import { useEffect } from "react";

const useAutoSaveDebounce = (title, lineCollection, func, delay) => {
  useEffect(() => {
    const timerId = setTimeout(() => {
      func();
    }, delay);
    
    return () => {
      clearTimeout(timerId);
    }
  }, [title, lineCollection, func, delay]);
}

export default useAutoSaveDebounce;
