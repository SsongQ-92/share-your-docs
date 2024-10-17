import { useEffect } from "react";
import { useBoundStore } from "../store";

const useAutoSaveDebounce = (id, title, lineCollection, currentFocusLineKey, delay) => {
  const { asyncUpdateDocConcurrent } = useBoundStore(state => ({ 
    asyncUpdateDocConcurrent: state.asyncUpdateDocConcurrent,
  }));

  useEffect(() => {
    const date = new Date();
    const parsedDate = Date.parse(date);

    const docData = {
      title,
      contents: lineCollection,
      modifiedAt: parsedDate,
    };

    const timerId = setTimeout(() => {
      asyncUpdateDocConcurrent(id, docData, true, currentFocusLineKey);
    }, delay);
    
    return () => {
      clearTimeout(timerId);
    }
  }, [asyncUpdateDocConcurrent, id, title, lineCollection, currentFocusLineKey, delay]);
}

export default useAutoSaveDebounce;
