import { useEffect, useRef, useState } from "react"
import { v4 as uuidv4 } from "uuid";
import getMap from "../../utils/getMap";

export default function CreateDocPage() {
  const initialKey = uuidv4();
  const [lineCollection, setLineCollection] = useState(() => {
    return [{ key: initialKey, index: 0, value: "" }];
  });
  const [currentFocusLine, setCurrentFocusLine] = useState({ key: initialKey, index: 0 });
  // const beforeLineRef = useRef({ isTriggered: false, beforeLineStringLength: 0 });
  const lineCollectionRef = useRef(null);
  const isBackspaceTriggerRef = useRef(false);
  const lineStringLengthRef = useRef(0);

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      const newKey = uuidv4();
      setCurrentFocusLine((prev) => ({ ...prev, key: newKey, index: prev.index + 1 }));

      const clonedNewLineCollection = structuredClone(lineCollection);
      clonedNewLineCollection.splice(currentFocusLine.index + 1, 0, { key: newKey, index: currentFocusLine.index + 1, value: "" });

      const newLineCollection = clonedNewLineCollection.map((value, index) => {
        if (index > currentFocusLine.index + 1) {
          return { ...value, index: value.index + 1 };
        }

        return value;
      })

      setLineCollection(newLineCollection);
    }

    const isFirst = lineCollection.every((value) => value.index >= currentFocusLine.index);
    const cursorPosition = e.target.selectionStart;

    if (e.code === "Backspace" && lineCollection.length > 1 && !isFirst && cursorPosition === 0) {
      e.preventDefault();

      let beforeLineIndex;
      let currentLineString;

      setLineCollection((prev) => prev.filter((value, index) => {
        if (value.key === currentFocusLine.key) {
          beforeLineIndex = lineCollection[index - 1].index;
          currentLineString = lineCollection[index].value;
          lineStringLengthRef.current = lineCollection[index - 1].value.length;
        }

        return value.key !== currentFocusLine.key;
      }));

      setLineCollection((prev) => prev.map((value) => {
        if (value.index === beforeLineIndex) {
          return { ...value, value: value.value + currentLineString };
        }

        return value;
      }))

      setCurrentFocusLine((prev) => ({ ...prev, key: lineCollection[beforeLineIndex]["key"], index: beforeLineIndex }));

      isBackspaceTriggerRef.current = true;
    }
  }

  const handleInputChange = (e) => {
    setLineCollection((prev) => {
      return prev.map((value) => {
        if (value.key === currentFocusLine.key) {
          return { ...value, value: e.target.value };
        }

        return value;
      });
    })
  }

  const handleInputFocus = (e) => {
    const map = getMap(lineCollectionRef);
    let currentKey;
    let currentIndex;
    
    for (const key of map) {
      if (key[1] === e.target) {
        currentKey = key[0];
        break;
      }
    }

    for (let i = 0; i < lineCollection.length; i++) {
      if (lineCollection[i].key === currentKey) {
        currentIndex = lineCollection[i].index;
        break;
      }
    }

    setCurrentFocusLine((prev) => ({ ...prev, key: currentKey, index: currentIndex }));
  }

  useEffect(() => {
    const map = getMap(lineCollectionRef);
    const node = map.get(currentFocusLine.key);

    if (isBackspaceTriggerRef.current) {
      node.focus();
      node.setSelectionRange(lineStringLengthRef.current, lineStringLengthRef.current);
    } else {
      node.focus();
    }

    isBackspaceTriggerRef.current = false;
  }, [currentFocusLine])

  return (
    <main className="flex justify-center p-50 pt-150 items-start bg-black-dark">
      <div className="w-1000 min-h-600 p-20 flex flex-col gap-20 border-2 border-solid border-white rounded-[15px]">
        {lineCollection.map(lineValue => {
          const { key, value } = lineValue;

          return (
            <textarea key={key} ref={(node) => {
              const map = getMap(lineCollectionRef);

              if (node) {
                map.set(key, node);
              } else {
                map.delete(key);
              }
            }} value={value} onKeyDown={handleInputKeyDown} onChange={handleInputChange} onFocus={handleInputFocus} rows={1} className="w-full h-full border-1 border-solid border-white rounded-[10px] px-15 text-white text-26 caret-white resize-none bg-black-dark overflow-hidden" />
          )
        })}
      </div>
    </main>
  )
}
