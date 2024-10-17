import PropTypes from "prop-types";
import { useBoundStore } from "../../store";

export default function SaveButtonClickNoti({ url }) {
  const setErrorMessage = useBoundStore(state => state.setErrorMessage);

  const handleURLCopyClipBoard = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch ({ message }) {
      setErrorMessage(message);
    }
  };

  return (
    <div className="flex flex-col gap-20">
      <p className="w-200 p-10 bg-gray-6 text-white text-20 break-words underline cursor-pointer hover:bg-black-light" onClick={handleURLCopyClipBoard}>
        {url}
      </p>
      <p className="flex flex-col w-200 p-10 bg-gray-6 text-purple-light text-20 break-words">
        <span>저장이 완료 되었습니다. 20초 간격으로 자동 저장이 됩니다.</span>
        <span>위의 링크를 클릭하여 복사하세요</span>
      </p>
    </div>
  )
}

SaveButtonClickNoti.propTypes = {
  url: PropTypes.string.isRequired,
}
