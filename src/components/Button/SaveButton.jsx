import PropTypes from "prop-types";
import { memo, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { NO_TITLE_VALUE_ERROR, TOO_MANY_USER_EDITING_DOC } from "../../constants/errorMessage";
import { useBoundStore } from "../../store";

const SaveButton = memo(function SaveButton({ mode, title, lineCollection }) {
  const [isTitleError, setIsTitleError] = useState(false);
  const [isSaveClickedOnce, setIsSaveClickedOnce] = useState(false);
  const { userId, userName, uniqueDocId, errorMessage, autoSaveNum, setUniqueDocId, setErrorMessage, addUserDocsNumber, asyncSaveDoc, asyncUpdateDocConcurrent } = useBoundStore((state) => ({
    userId: state.userId,
    userName: state.userName,
    uniqueDocId: state.uniqueDocId,
    errorMessage: state.errorMessage,
    autoSaveNum: state.autoSaveNum,
    setUniqueDocId: state.setUniqueDocId,
    setErrorMessage: state.setErrorMessage,
    addUserDocsNumber: state.addUserDocsNumber,
    asyncSaveDoc: state.asyncSaveDoc,
    asyncUpdateDocConcurrent: state.asyncUpdateDocConcurrent,
  }));

  const handleSaveButtonClick = () => {
    const isTitleNull = title.length === 0 ? true : false;
    setIsTitleError(isTitleNull);
    
    if (isTitleNull) return;

    if (mode === "create" && isSaveClickedOnce === false) {
      const date = new Date();
      const parsedDate = Date.parse(date);
      const randomlyCreatedId = uuidv4(); 
      const newDocId = userName[0] + userId.slice(2, 5) + randomlyCreatedId;
  
      setUniqueDocId(newDocId);
  
      const docData = {
        id: newDocId,
        title,
        contents: lineCollection,
        author: userName,
        authorId: userId,
        createdAt: parsedDate,
        modifiedAt: null,
        concurrentWorkingUser: [],
      };
  
      asyncSaveDoc(newDocId, docData);
      addUserDocsNumber();
      setIsSaveClickedOnce(true);
    } else if (mode === "create" && isSaveClickedOnce === true) {
      const date = new Date();
      const parsedDate = Date.parse(date);
  
      const docData = {
        title,
        contents: lineCollection,
        modifiedAt: parsedDate, 
      };
  
      asyncUpdateDocConcurrent(uniqueDocId, docData, false);
    }
  }

  const handleURLCopyClipBoard = async () => {
    try {
      await navigator.clipboard.writeText(uniqueDocId);
    } catch ({ message }) {
      setErrorMessage(message);
    }
  }

  useEffect(() => {
    const autoSave = () => {
      const date = new Date();
      const parsedDate = Date.parse(date);
  
      const docData = {
        title,
        contents: lineCollection,
        modifiedAt: parsedDate, 
      };
  
      asyncUpdateDocConcurrent(uniqueDocId, docData, true);
    };

    let timer;

    if (isSaveClickedOnce) {
      timer = setInterval(autoSave, 20000);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    }
  }, [isSaveClickedOnce, asyncUpdateDocConcurrent, lineCollection, title, uniqueDocId])

  return (
    <div className="flex flex-col gap-18 w-200 flex-shrink-0">
      <button className="flex-center w-80 h-50 border-2 border-solid border-white bg-gray-8 rounded-[15px] text-white text-18 hover:bg-black-light" onClick={handleSaveButtonClick}>저장하기</button>
      {uniqueDocId && 
        <div className="flex flex-col gap-20">
          <p className="w-200 p-10 bg-gray-6 text-white text-20 break-words underline cursor-pointer hover:bg-black-light" onClick={handleURLCopyClipBoard}>
            http://localhost:5173/docs/{uniqueDocId}
          </p>
          <p className="flex flex-col w-200 p-10 bg-gray-6 text-purple-light text-20 break-words">
            <span>저장이 완료 되었습니다. 20초 간격으로 자동 저장이 됩니다.</span>
            <span>위의 링크를 클릭하여 복사하세요</span>
          </p>
        </div>
      }
      {isTitleError &&
        <p className="w-200 p-10 bg-gray-6 text-red text-22 break-words hover:bg-black-light">
          {NO_TITLE_VALUE_ERROR}
        </p>
      }
      {errorMessage === TOO_MANY_USER_EDITING_DOC &&
        <p className="w-200 p-10 bg-gray-6 text-red text-22 break-words hover:bg-black-light">
          {TOO_MANY_USER_EDITING_DOC}
        </p>
      }
      {(autoSaveNum > 0) &&
        <div className="flex flex-col w-200 p-10 bg-gray-6 text-purple-light text-20 break-words">
          <span>자동 저장이 완료 되었습니다.</span>
          <div className="flex justify-end">
            <span className="w-40 h-40 flex-center bg-purple rounded-full text-violet-light text-17">{autoSaveNum}</span>
          </div>
        </div>
      }
    </div>
  )
});

export default SaveButton;

SaveButton.propTypes = {
  mode: PropTypes.string.isRequired,
  title: PropTypes.string,
  lineCollection: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      index: PropTypes.number,
      value: PropTypes.string,
      height: PropTypes.number,
    }),
  ),
};
