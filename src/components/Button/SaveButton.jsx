import { v4 as uuidv4 } from "uuid";
import { useBoundStore } from "../../store";

export default function SaveButton() {
  const { userId, userName, uniqueDocId, setUniqueDocId, setErrorMessage } = useBoundStore((state) => ({
    userId: state.userId,
    userName: state.userName,
    uniqueDocId: state.uniqueDocId,
    setUniqueDocId: state.setUniqueDocId,
    setErrorMessage: state.setErrorMessage,
  }));

  const handleButtonClick = () => {
    const randomlyCreatedId = uuidv4(); 
    const newDocId = userName[0] + userId.slice(2, 5) + randomlyCreatedId;

    setUniqueDocId(newDocId);
  }

  const handleURLCopyClipBoard = async () => {
    try {
      await navigator.clipboard.writeText(uniqueDocId);
    } catch ({ message }) {
      setErrorMessage(message);
    }
  }

  return (
    <div className="flex flex-col gap-18 w-200">
      <button className="flex-center w-80 h-50 border-2 border-solid border-white bg-gray-8 rounded-[15px] text-white text-18 hover:bg-black-light" onClick={handleButtonClick}>저장하기</button>
      {uniqueDocId && 
        <div className="flex flex-col gap-20">
          <p className="w-200 p-10 bg-gray-6 text-white text-20 break-words underline cursor-pointer hover:bg-black-light" onClick={handleURLCopyClipBoard}>
            {uniqueDocId}
          </p>
          <p className="w-200 p-10 bg-gray-6 text-purple-light text-20 break-words hover:bg-black-light">
            위의 링크를 클릭하여 복사하세요
          </p>
        </div>
      }
    </div>
  )
}

SaveButton.propTypes = {};
