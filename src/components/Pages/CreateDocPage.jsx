import { off, onChildChanged, ref } from "firebase/database";
import { useCallback, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { db } from "../../firebase";
import useNoLogInRedirect from "../../hooks/useNoLogInRedirect";
import { useBoundStore } from "../../store";
import checkDeepEquality from "../../utils/checkDeepEquality";
import getMap from "../../utils/getMap";
import SaveButton from "../Button/SaveButton";
import Container from "../UI/Container";
import Layout from "../UI/Layout";
import Chip from "../Chip";

export default function CreateDocPage() {
  const initialKey = uuidv4();
  const [title, setTitle] = useState("");
  const [lineCollection, setLineCollection] = useState(() => {
    return [{ key: initialKey, index: 0, value: "", height: 39 }];
  });
  const [currentFocusLine, setCurrentFocusLine] = useState({ key: initialKey, index: 0 });
  const { uniqueDocId, isChangingDoc, userId, asyncGetUserNameWithUserId, concurrentDocOtherUserName } = useBoundStore(state => ({ 
    uniqueDocId: state.uniqueDocId,
    isChangingDoc: state.isChangingDoc,
    userId: state.userId,
    asyncGetUserNameWithUserId: state.asyncGetUserNameWithUserId,
    concurrentDocOtherUserName: state.concurrentDocOtherUserName,
  }));

  const lineCollectionRef = useRef(null);
  const isBackspaceTriggerRef = useRef(false);
  const lineStringLengthRef = useRef(0);
  const otherUserFocusingLineKey = useRef(null);
  
  const handleInputChange = (e) => {
    setTitle(e.target.value);
  }

  const handleTextareaKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      const newKey = uuidv4();
      setCurrentFocusLine((prev) => ({ ...prev, key: newKey, index: prev.index + 1 }));

      const clonedNewLineCollection = structuredClone(lineCollection);
      clonedNewLineCollection.splice(currentFocusLine.index + 1, 0, { key: newKey, index: currentFocusLine.index + 1, value: "", height: 39 });

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

        if (value.index > currentFocusLine.index) {
          return { ...value, index: value.index - 1 };
        }

        return value;
      }))

      setCurrentFocusLine((prev) => ({ ...prev, key: lineCollection[beforeLineIndex]["key"], index: beforeLineIndex }));

      isBackspaceTriggerRef.current = true;
    }
  }

  const handleTextareaChange = (e) => {
    setLineCollection((prev) => {
      return prev.map((value) => {
        if (value.key === currentFocusLine.key) {
          return { ...value, value: e.target.value, height: e.target.scrollHeight };
        }

        return value;
      });
    })
  }

  const handleTextareaFocus = (e) => {
    const map = getMap(lineCollectionRef);
    let currentKey;
    let currentIndex;
    
    for (const key of map) {
      const element = key[1];
      const elementKey = key[0];

      if (element === e.target) {
        currentKey = elementKey;
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

  const handleValueChanged = useCallback(async (snapshot) => {
    if (snapshot.exists() && isChangingDoc === false && uniqueDocId) {
      const parsedResponse = snapshot.val();

      if (snapshot.key === "concurrentWorkingUser") {
        const otherUserId = Object.keys(parsedResponse)?.filter(value => value !== userId)[0];
        const otherUserLine = parsedResponse[otherUserId];

        await asyncGetUserNameWithUserId(otherUserId);

        otherUserFocusingLineKey.current = otherUserLine;
      } else if (snapshot.key === "contents") {
        const changedFocusingLine = parsedResponse.filter(value => value.id === currentFocusLine.key).length === 0 ? null : parsedResponse.filter(value => value.id === currentFocusLine.key);
        const changedFocusingLineIndex = changedFocusingLine && changedFocusingLine[0].index;

        const isLineCollectionChanged = checkDeepEquality(parsedResponse, lineCollection);

        if (isLineCollectionChanged === false) {
          setLineCollection((prev) => {
            let newLineCollection = [];
  
            for (let i = 0; i < parsedResponse.length; i++) {
              const prevLineObject = prev[i];
              const newLineObject = parsedResponse[i];
  
              if (prevLineObject) {
                newLineCollection.push({ ...prevLineObject, ...newLineObject });
              } else {
                newLineCollection.push(newLineObject);
              }
            }
  
            return newLineCollection;
          });
        }

        if (changedFocusingLine) {
          setCurrentFocusLine((prev) => ({ ...prev, index: changedFocusingLineIndex }));
        } else {
          setCurrentFocusLine((prev) => ({ ...prev, key: parsedResponse[parsedResponse.length - 1].key, index: parsedResponse[parsedResponse.length - 1].index }));
        }

        const currentWorkingWordsLength = lineCollection.filter(value => value.key === currentFocusLine.key)[0].value.length;
        lineStringLengthRef.current = currentWorkingWordsLength;  
      } else {
        return;
      }
    }
  }, [asyncGetUserNameWithUserId, currentFocusLine.key, isChangingDoc, lineCollection, userId, uniqueDocId]);

  useEffect(() => {
    const dbRef = ref(db, `docs/${uniqueDocId}`);

    onChildChanged(dbRef, handleValueChanged);

    return () => {
      off(dbRef, "child_changed", handleValueChanged);
    }
  }, [uniqueDocId, handleValueChanged]);

  useNoLogInRedirect();

  useEffect(() => {
    const map = getMap(lineCollectionRef);
    const node = map.get(currentFocusLine.key);

    node.focus();
    node.setSelectionRange(lineStringLengthRef.current, lineStringLengthRef.current);
    
    isBackspaceTriggerRef.current = false;
  }, [currentFocusLine])

  return (
    <Layout>
      <main className="flex justify-between items-start gap-20 px-70 pb-50 pt-130 bg-black-dark">
        <Container style="w-[88%] flex flex-col gap-2">
          <input type="text" placeholder="제목" value={title} onChange={handleInputChange} className="border-1 border-solid border-white rounded-[10px] px-15 py-5 text-black text-30 caret-black bg-gray-1 mb-15" />
          {lineCollection.map(lineValue => {
            const { key, value, height } = lineValue;
            const calculatedRows = Math.floor(height / 39);

            return (
              <div key={key} className="relative">
                <textarea ref={(node) => {
                  const map = getMap(lineCollectionRef);

                  if (node) {
                    map.set(key, node);
                  } else {
                    map.delete(key);
                  }
                }} value={value} onKeyDown={handleTextareaKeyDown} onChange={handleTextareaChange} onFocus={handleTextareaFocus} rows={calculatedRows} className={`w-full rounded-[10px] px-15 text-white text-26 caret-white resize-none overflow-y-hidden bg-black-dark ${key === currentFocusLine.key && "border-1 border-solid border-white"}`} />
                {(key === otherUserFocusingLineKey.current && concurrentDocOtherUserName) && <Chip userName={concurrentDocOtherUserName} /> }
              </div>
            )
          })}
        </Container>
        <SaveButton title={title} lineCollection={lineCollection} currentFocusLineKey={currentFocusLine.key} />
      </main>
    </Layout>
  )
}
