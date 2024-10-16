import PropTypes from "prop-types";
import { v4 as uuidv4 } from "uuid";
import { useBoundStore } from "../../store";
import { memo, useState } from "react";

const SaveButton = memo(function SaveButton({ title, lineCollection }) {
  const [isTitleError, setIsTitleError] = useState(false);
  const { userId, userName, uniqueDocId, setUniqueDocId, setErrorMessage, asyncSaveDoc } = useBoundStore((state) => ({
    userId: state.userId,
    userName: state.userName,
    uniqueDocId: state.uniqueDocId,
    setUniqueDocId: state.setUniqueDocId,
    setErrorMessage: state.setErrorMessage,
    asyncSaveDoc: state.asyncSaveDoc,
  }));

  const handleSaveButtonClick = () => {
    const isTitleNull = title.length === 0 ? true : false;
    setIsTitleError(isTitleNull);
    
    if (isTitleNull) return;

    const randomlyCreatedId = uuidv4(); 
    const newDocId = userName[0] + userId.slice(2, 5) + randomlyCreatedId;

    setUniqueDocId(newDocId);

    const docData = {
      title,
      contents: lineCollection,
    };

    asyncSaveDoc(newDocId, docData);
  }

  const handleURLCopyClipBoard = async () => {
    try {
      await navigator.clipboard.writeText(uniqueDocId);
    } catch ({ message }) {
      setErrorMessage(message);
    }
  }

  return (
    <div className="flex flex-col gap-18 w-200 flex-shrink-0">
      <button className="flex-center w-80 h-50 border-2 border-solid border-white bg-gray-8 rounded-[15px] text-white text-18 hover:bg-black-light" onClick={handleSaveButtonClick}>저장하기</button>
      {uniqueDocId && 
        <div className="flex flex-col gap-20">
          <p className="w-200 p-10 bg-gray-6 text-white text-20 break-words underline cursor-pointer hover:bg-black-light" onClick={handleURLCopyClipBoard}>
            {uniqueDocId}
          </p>
          <p className="flex flex-col w-200 p-10 bg-gray-6 text-purple-light text-20 break-words hover:bg-black-light">
            <span>저장이 완료 되었습니다.</span>
            <span>위의 링크를 클릭하여 복사하세요</span>
          </p>
        </div>
      }
      {isTitleError &&
        <p className="w-200 p-10 bg-gray-6 text-red text-22 break-words hover:bg-black-light">
          제목을 입력해주세요
        </p>
      }
    </div>
  )
});

export default SaveButton;

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
};
