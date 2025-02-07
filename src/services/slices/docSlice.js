import { child, get, ref, update } from "firebase/database";
import { TOO_MANY_USER_EDITING_DOC } from "../../constants/errorMessage";
import { db } from "../../firebase";

export const createDocSlice = (set, getState) => ({
  uniqueDocId: "",
  autoSaveNum: 0,
  currentDocData: {},
  concurrentDocOtherUserName: "",
  isChangingDoc: false,
  asyncClearDocInfo: async () => {
    const currentWorkingUniqueDocId = getState().uniqueDocId;
    await getState().asyncDeleteConcurrentUserList(currentWorkingUniqueDocId);
    set((state) => ({ ...state, uniqueDocId: "", currentDocData: {}, autoSaveNum: 0, concurrentDocOtherUserName: "" }));
  },
  asyncCheckSpecificDoc: async (param) => {
    try {
      const dbRef = ref(db, "docs");
      const response = await get(child(dbRef, `/${param}`));
      const parsedResponse = response.val();

      if (parsedResponse === null) {
        set((state) => ({ ...state, isNoExistDocUrlError: true }));
      } else {
        getState().addUserDocsNumber();
      }
    } catch ({ name, message }) {
      set((state) => ({ ...state, errorMessage: message , errorName: name }));
    }
  },
  asyncGetSpecificDoc: async (param) => {
    try {
      const dbRef = ref(db, "docs");
      const response = await get(child(dbRef, `/${param}`));
      const parsedResponse = response.val();

      set((state) => ({ ...state, currentDocData: parsedResponse, uniqueDocId: param }));
    } catch ({ name, message }) {
      set((state) => ({ ...state, errorMessage: message , errorName: name }));
    }
  },
  asyncGetUserDocList: async (uid) => {
    try {
      const dbRef = ref(db, "user/userList");
      const response = await get(child(dbRef, `/${uid}/docs`));
      const parsedResponse = response.val();

      const userDocsNumber = Object.keys(parsedResponse).length;

      set((state) => ({ ...state, userAllDocs: parsedResponse, userDocsNumber }));
    } catch ({ name, message }) {
      set((state) => ({ ...state, errorMessage: message , errorName: name }));
    }
  },
  asyncSaveDoc: async (uniqueId, docData) => {
    try {
      await getState().asyncSaveDocOnDoc(uniqueId, docData);
      await getState().asyncSaveDocOnUser(uniqueId, docData);

      set((state) => ({ ...state, uniqueDocId: uniqueId }));
    } catch ({ name, message }) {
      set((state) => ({ ...state, errorMessage: message , errorName: name }));
    }
  },
  asyncSaveDocOnDoc: async (uniqueId, docData) => {
    try {
      update(ref(db, `/docs/${uniqueId}`), docData);
    } catch ({ name, message }) {
      set((state) => ({ ...state, errorMessage: message , errorName: name }));
    }
  },
  asyncSaveDocOnUser: async (uniqueId, docData) => {
    try {
      const userId = getState().userId;
      update(ref(db, `/user/userList/${userId}/docs/${uniqueId}`), docData);
    } catch ({ name, message }) {
      set((state) => ({ ...state, errorMessage: message , errorName: name }));
    }
  },
  asyncGetDocConcurrent: async (uniqueId) => {
    try {
      const dbRef = ref(db, "docs");
      const response = await get(child(dbRef, `/${uniqueId}/concurrentWorkingUser`));
      const parsedResponse = response.val();

      const concurrentDocUserId = parsedResponse ? Object.keys(parsedResponse) : null;
      const prevConcurrentDocUser = getState().concurrentDocUser ?? null;
      const prevConcurrentDocUserId = prevConcurrentDocUser ? Object.keys(prevConcurrentDocUser) : null;

      const isSameWithPrev = concurrentDocUserId.length === prevConcurrentDocUserId.length && concurrentDocUserId.every(value => prevConcurrentDocUserId.includes(value));

      if (!isSameWithPrev) {
        set((state) => ({ ...state, concurrentDocUser: parsedResponse }));
      }
    } catch ({ name, message }) {
      set((state) => ({ ...state, errorMessage: message , errorName: name }));
    }
  },
  asyncUpdateDocConcurrent: async (uniqueId, docData, isAuto, currentFocusLineKey) => {
    set((state) => ({ ...state, isChangingDoc: true }));

    try {
      const dbRef = ref(db, "docs");
      const response = await get(child(dbRef, `/${uniqueId}/concurrentWorkingUser`));
      const parsedResponse = response.val();

      const userId = getState().userId;
      const concurrentDocUserId = parsedResponse ? Object.keys(parsedResponse) : null;
      let isPossibleConcurrent = false;

      if (concurrentDocUserId === null) {
        isPossibleConcurrent = true;
      } else if (concurrentDocUserId.length < 2) {
        isPossibleConcurrent = true;
      } else if (concurrentDocUserId.length === 2 && concurrentDocUserId.includes(userId)) {
        isPossibleConcurrent = true;
      }

      if (isPossibleConcurrent) {
        let updatedDocData;
        const isConcurrentOnlyMe = concurrentDocUserId === null || (concurrentDocUserId.length === 1 && concurrentDocUserId.includes(userId));

        if (isConcurrentOnlyMe) {
          updatedDocData = { ...docData, concurrentWorkingUser: { [userId]: currentFocusLineKey } };
        } else {
          updatedDocData = { ...docData, concurrentWorkingUser: { ...parsedResponse, [userId]: currentFocusLineKey } };
        }

        await getState().asyncSaveDocOnDoc(uniqueId, updatedDocData);
        await getState().asyncSaveDocOnUser(uniqueId, docData);

        if (isAuto) {
          set((state) => ({ ...state, autoSaveNum: state.autoSaveNum + 1 }));
        }

        set((state) => ({ ...state, errorMessage: "" }));
        set((state) => ({ ...state, isChangingDoc: false }));
      } else {
        set((state) => ({ ...state, errorMessage: TOO_MANY_USER_EDITING_DOC }));
      }
    } catch ({ name, message }) {
      set((state) => ({ ...state, errorMessage: message , errorName: name }));
    }
  },
  asyncDeleteConcurrentUserList: async (uniqueId) => {
    try {
      const dbRef = ref(db, "docs");
      const response = await get(child(dbRef, `/${uniqueId}/concurrentWorkingUser`));
      const parsedResponse = response.val();

      const userId = getState().userId;
      delete parsedResponse[userId];

      const updatedDocDate = { concurrentWorkingUser: parsedResponse };

      await getState().asyncSaveDocOnDoc(uniqueId, updatedDocDate);
    } catch ({ name, message }) {
      set((state) => ({ ...state, errorMessage: message , errorName: name }));
    }
  },
});
