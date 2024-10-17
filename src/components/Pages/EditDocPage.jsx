import { off, onChildChanged, ref } from "firebase/database";
import PropTypes from "prop-types";
import { useCallback, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { NO_TITLE_VALUE_ERROR, TOO_MANY_USER_EDITING_DOC } from "../../constants/errorMessage";
import { db } from "../../firebase";
import useAutoSaveDebounce from "../../hooks/useAutoSaveDebounce";
import { useBoundStore } from "../../store";
import changeDayFormat from "../../utils/changeDayFormat";
import checkDeepEquality from "../../utils/checkDeepEquality";
import getDate from "../../utils/getDate";
import getMap from "../../utils/getMap";
import Chip from "../Chip";
import AutoSaveNoti from "../Noti/AutoSaveNoti";
import ErrorMessageNoti from "../Noti/ErrorMessageNoti";
import Container from "../UI/Container";
import Layout from "../UI/Layout";

export default function EditDocPage({ currentDocData }) {
  const { author, authorId, id, createdAt, modifiedAt, title: initialTitle, contents } = currentDocData;
  const [title, setTitle] = useState(initialTitle);
  const [lineCollection, setLineCollection] = useState(contents);
  const [currentFocusLine, setCurrentFocusLine] = useState({ key: contents[contents.length - 1].key, index: contents[contents.length - 1].index });
  const [thisModifiedAt, setThisModifiedAt] = useState(modifiedAt);
  const { errorMessage, isChangingDoc, userId, asyncGetUserNameWithUserId, concurrentDocOtherUserName } = useBoundStore(state => ({ 
    errorMessage: state.errorMessage,
    isChangingDoc: state.isChangingDoc,
    userId: state.userId,
    asyncGetUserNameWithUserId: state.asyncGetUserNameWithUserId,
    concurrentDocOtherUserName: state.concurrentDocOtherUserName,
  }));

  const lineCollectionRef = useRef(null);
  const isBackspaceTriggerRef = useRef(false);
  const lineStringLengthRef = useRef(contents[contents.length - 1].value.length);
  const otherUserFocusingLineKey = useRef(null);
  
  const createdDate = getDate(createdAt);
  const modifiedDate = getDate(thisModifiedAt);

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

  useAutoSaveDebounce(id, title, lineCollection, currentFocusLine.key, 900);

  const handleValueChanged = useCallback(async (snapshot) => {
    if (snapshot.exists() && isChangingDoc === false) {
      const parsedResponse = snapshot.val();

      const newContents = parsedResponse.contents;
      const newModifiedAt = parsedResponse.modifiedAt;
      const newConcurrentWorkingUser = parsedResponse.concurrentWorkingUser;

      const otherUserId = Object.keys(newConcurrentWorkingUser).filter(value => value !== userId)[0];
      const otherUserLine = newConcurrentWorkingUser[otherUserId];

      const currentWorkingWordsLength = lineCollection.filter(value => value.key === currentFocusLine.key)[0].value.length;
      const changedFocusingLine = newContents.filter(value => value.id === currentFocusLine.key).length === 0 ? null : newContents.filter(value => value.id === currentFocusLine.key);
      const changedFocusingLineIndex = changedFocusingLine && changedFocusingLine[0].index;

      await asyncGetUserNameWithUserId(otherUserId);

      setThisModifiedAt(newModifiedAt);
      otherUserFocusingLineKey.current = otherUserLine;
      lineStringLengthRef.current = currentWorkingWordsLength;
      const isLineCollectionChanged = checkDeepEquality(newContents, lineCollection);

      if (isLineCollectionChanged === false) {
        setLineCollection((prev) => {
          let newLineCollection = [];

          for (let i = 0; i < newContents.length; i++) {
            const prevLineObject = prev[i];
            const newLineObject = newContents[i];

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
        setCurrentFocusLine((prev) => ({ ...prev, key: newContents[newContents.length - 1].key, index: newContents[newContents.length - 1].index }));
      }
    }
  }, [asyncGetUserNameWithUserId, currentFocusLine.key, isChangingDoc, lineCollection, userId]);

  useEffect(() => {
    const dbRef = ref(db, `docs/${id}`);

    onChildChanged(dbRef, handleValueChanged);

    return () => {
      off(dbRef, "child_changed", handleValueChanged);
    }
  }, [id, handleValueChanged]);

  useEffect(() => {
    const map = getMap(lineCollectionRef);
    const node = map.get(currentFocusLine.key);

    node.focus();
    node.setSelectionRange(lineStringLengthRef.current, lineStringLengthRef.current);

    isBackspaceTriggerRef.current = false;
  }, [currentFocusLine])

  return (
    <Layout>
      <main className="flex flex-col justify-start items-center gap-40 px-70 pb-50 pt-130 bg-black-dark">
        <section className="flex justify-between items-end w-full">
          <h1 className="text-violet-light text-30">최초 작성자: {author}</h1>
          <Container style="flex justify-end items-center gap-20 text-16 text-gray-3">
            <h2>최초 작성일: {createdDate.currentYear}년 {createdDate.currentMonth}월 {createdDate.currentDate}일 {changeDayFormat(createdDate.currentDay)} {createdDate.currentHour}시 {createdDate.currentMinute}분</h2>
            <h2>최근 수정일: {modifiedDate.currentYear}년 {modifiedDate.currentMonth}월 {modifiedDate.currentDate}일 {changeDayFormat(modifiedDate.currentDay)} {modifiedDate.currentHour}시 {modifiedDate.currentMinute}분</h2>
          </Container>
        </section>
        <Container style="flex justify-between items-start gap-20 w-full">
          <Container style="w-[88%] flex flex-col gap-2">
            <input type="text" placeholder="제목" value={title} onChange={handleInputChange} className="border-1 border-solid border-white rounded-[10px] px-15 py-5 text-black text-30 caret-black bg-gray-1 mb-15" disabled={!(authorId === userId)} />
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
          <Container style="flex flex-col gap-18 w-200 flex-shrink-0">
            <AutoSaveNoti />
            {title === "" && <ErrorMessageNoti errorText={NO_TITLE_VALUE_ERROR} />}
            {errorMessage === TOO_MANY_USER_EDITING_DOC &&
              <ErrorMessageNoti errorText={TOO_MANY_USER_EDITING_DOC} />
            }
          </Container>
        </Container>
      </main>
    </Layout>
  )
}

EditDocPage.propTypes = {
  currentDocData: PropTypes.object,
};
