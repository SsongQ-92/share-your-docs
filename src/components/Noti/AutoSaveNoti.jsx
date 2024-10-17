import { useBoundStore } from "../../store"

export default function AutoSaveNoti() {
  const autoSaveNum = useBoundStore(state => state.autoSaveNum);

  if (autoSaveNum > 0) {
    return (
      <div className="flex flex-col w-200 p-10 bg-gray-6 text-purple-light text-20 break-words">
        <span>자동 저장이 완료 되었습니다.</span>
        <div className="flex justify-end">
          <span className="w-40 h-40 flex-center bg-purple rounded-full text-violet-light text-17">{autoSaveNum}</span>
        </div>
      </div>
    )
  } else {
    return null;
  }
}
