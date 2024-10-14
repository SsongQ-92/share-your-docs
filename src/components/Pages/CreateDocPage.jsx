import { useEffect, useRef, useState } from "react"
import { v4 as uuidv4 } from "uuid";
import getMap from "../../utils/getMap";

export default function CreateDocPage() {
  const initialKey = uuidv4();
  const [lineCollection, setLineCollection] = useState(() => {
    return [{ key: initialKey, value: "" }];
  });
  const [currentFocusKey, setCurrentFocusKey] = useState(initialKey);
  const lineCollectionRef = useRef(null);

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") {
      const newKey = uuidv4();
      setCurrentFocusKey(newKey);
      setLineCollection((prev) => [...prev, { key: newKey, value: "" }]);
    }

    if (e.code === "Backspace" && e.target.value === "" && lineCollection.length > 1) {
      e.preventDefault();

      let beforeLineIndex;

      setLineCollection((prev) => prev.filter((value, index) => {
        if (value.key === currentFocusKey) {
          beforeLineIndex = index - 1;
        }

        return value.key !== currentFocusKey;
      }));

      setCurrentFocusKey(() => lineCollection[beforeLineIndex]["key"]);
    }
  }

  const handleInputChange = (e) => {
    setLineCollection((prev) => {
      return prev.map((value) => {
        if (value.key === currentFocusKey) {
          return { ...value, value: e.target.value };
        }

        return value;
      });
    })
  }

  const handleInputFocus = (e) => {
    const map = getMap(lineCollectionRef);
    let currentKey;
    
    for (const key of map) {
      if (key[1] === e.target) {
        currentKey = key[0];
      }
    }

    setCurrentFocusKey(currentKey);
  }

  useEffect(() => {
    const map = getMap(lineCollectionRef);
    const node = map.get(currentFocusKey);

    node.focus();
  }, [currentFocusKey])

  return (
    <main className="h-full p-50 flex-center bg-black-dark">
      <div className="w-1000 min-h-600 p-20 flex flex-col gap-20 border-2 border-solid border-white rounded-[15px]">
        {lineCollection.map(lineValue => {
          const { key, value } = lineValue;

          return (
            <input key={key} ref={(node) => {
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
