import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { NO_TITLE_VALUE_ERROR, TOO_MANY_USER_EDITING_DOC } from "../../constants/errorMessage";
import { useBoundStore } from "../../store";
import AutoSaveNoti from "../Noti/AutoSaveNoti";
import ErrorMessageNoti from "../Noti/ErrorMessageNoti";
import SaveButtonClickNoti from "../Noti/SaveButtonClickNoti";

export default function SaveButton({ title, lineCollection, currentFocusLineKey }) {
  const [isTitleError, setIsTitleError] = useState(false);
  const { userId, userName, uniqueDocId, errorMessage, addUserDocsNumber, asyncSaveDoc, asyncUpdateDocConcurrent } = useBoundStore((state) => ({
    userId: state.userId,
    userName: state.userName,
    uniqueDocId: state.uniqueDocId,
    errorMessage: state.errorMessage,
    addUserDocsNumber: state.addUserDocsNumber,
    asyncSaveDoc: state.asyncSaveDoc,
    asyncUpdateDocConcurrent: state.asyncUpdateDocConcurrent,
  }));

  const url = `https://share-your-docs.netlify.app/docs/${uniqueDocId}`;

  const handleSaveButtonClick = () => {
    const isTitleNull = title.length === 0 ? true : false;
    setIsTitleError(isTitleNull);
    
    if (isTitleNull) return;

    if (uniqueDocId === "") {
      const date = new Date();
      const parsedDate = Date.parse(date);
      const randomlyCreatedId = uuidv4(); 
      const newDocId = userName[0] + userId.slice(2, 5) + randomlyCreatedId;
    
      const docData = {
        id: newDocId,
        title,
        contents: lineCollection,
        author: userName,
        authorId: userId,
        createdAt: parsedDate,
        modifiedAt: null,
        concurrentWorkingUser: {},
      };
  
      asyncSaveDoc(newDocId, docData);
      addUserDocsNumber();
    } else {
      const date = new Date();
      const parsedDate = Date.parse(date);
  
      const docData = {
        title,
        contents: lineCollection,
        modifiedAt: parsedDate, 
      };
  
      asyncUpdateDocConcurrent(uniqueDocId, docData, false, currentFocusLineKey);
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
  
      asyncUpdateDocConcurrent(uniqueDocId, docData, true, currentFocusLineKey);
    };

    let timer;

    if (uniqueDocId) {
      timer = setInterval(autoSave, 20000);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    }
  }, [asyncUpdateDocConcurrent, lineCollection, title, uniqueDocId, currentFocusLineKey])

  return (
    <div className="flex flex-col gap-18 w-200 flex-shrink-0">
      <button className="flex-center w-80 h-50 border-2 border-solid border-white bg-gray-8 rounded-[15px] text-white text-18 hover:bg-black-light" onClick={handleSaveButtonClick}>저장하기</button>
      {uniqueDocId && <SaveButtonClickNoti url={url} />}
      {isTitleError && <ErrorMessageNoti errorText={NO_TITLE_VALUE_ERROR} />}
      {errorMessage === TOO_MANY_USER_EDITING_DOC &&
        <ErrorMessageNoti errorText={TOO_MANY_USER_EDITING_DOC} />
      }
      <AutoSaveNoti />
    </div>
  )
}

SaveButton.propTypes = {
  title: PropTypes.string,
  lineCollection: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      index: PropTypes.number,
      value: PropTypes.string,
      height: PropTypes.number,
    }),
  ),
  currentFocusLineKey: PropTypes.string,
};
