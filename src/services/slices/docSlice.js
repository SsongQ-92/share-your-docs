import { child, get, ref, update } from "firebase/database";
import { db } from "../../firebase";
import { TOO_MANY_USER_EDITING_DOC } from "../../constants/errorMessage";

export const createDocSlice = (set, getState) => ({
  uniqueDocId: "",
  docMode: "",
  autoSaveNum: 0,
  currentDocData: {},
  asyncClearDocInfo: async () => {
    const currentWorkingUniqueDocId = getState().uniqueDocId;
    await getState().asyncDeleteConcurrentUserList(currentWorkingUniqueDocId);
    set((state) => ({ ...state, uniqueDocId: "", docMode: "", currentDocData: {}, autoSaveNum: 0 }));
  },
  asyncCheckSpecificDoc: async (param) => {
    try {
      const dbRef = ref(db, "docs");
      const response = await get(child(dbRef, `/${param}`));
      const parsedResponse = response.val();

      if (parsedResponse === null) {
        set((state) => ({ ...state, isNoExistDocUrlError: true }))
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

      set((state) => ({ ...state, currentDocData: parsedResponse }));
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
      set((state) => ({ ...state, uniqueDocId: uniqueId }));
      
      await getState().asyncSaveDocOnDoc(uniqueId, docData);
      await getState().asyncSaveDocOnUser(uniqueId, docData);
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
  asyncUpdateDocConcurrent: async (uniqueId, docData, isAuto) => {
    try {
      const dbRef = ref(db, "docs");
      const response = await get(child(dbRef, `/${uniqueId}/concurrentWorkingUser`));
      const parsedResponse = response.val();

      const userId = getState().userId;
      let isPossibleConcurrent = false;

      if (parsedResponse === null) {
        isPossibleConcurrent = true;
      } else if (parsedResponse.length < 2) {
        isPossibleConcurrent = true;
      } else if (parsedResponse.length === 2 && parsedResponse.includes(userId)) {
        isPossibleConcurrent = true;
      }

      if (isPossibleConcurrent) {
        let updatedDocDate;
        const isConcurrentOnlyMe = parsedResponse === null || (parsedResponse.length === 1 && parsedResponse.includes(userId));

        if (isConcurrentOnlyMe) {
          updatedDocDate = { ...docData, concurrentWorkingUser: [ userId ] };
        } else {
          updatedDocDate = { ...docData, concurrentWorkingUser: [ ...parsedResponse, userId ] };
        }

        await getState().asyncSaveDocOnDoc(uniqueId, updatedDocDate);
        await getState().asyncSaveDocOnUser(uniqueId, updatedDocDate);

        if (isAuto) {
          set((state) => ({ ...state, autoSaveNum: state.autoSaveNum + 1 }));
        }

        set((state) => ({ ...state, errorMessage: "" }));
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
      const updatedConcurrentWorkingUser = parsedResponse.filter(value => value !== userId);
      const updatedDocDate = { concurrentWorkingUser: updatedConcurrentWorkingUser };

      await getState().asyncSaveDocOnDoc(uniqueId, updatedDocDate);
      await getState().asyncSaveDocOnUser(uniqueId, updatedDocDate);
    } catch ({ name, message }) {
      set((state) => ({ ...state, errorMessage: message , errorName: name }));
    }
  },
});
