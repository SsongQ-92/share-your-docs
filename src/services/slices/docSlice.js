import { child, get, ref, update } from "firebase/database";
import { db } from "../../firebase";

export const createDocSlice = (set, getState) => ({
  uniqueDocId: "",
  docMode: "",
  isURLCopied: false,
  currentDocData: [],
  setUniqueDocId: (uniqueId) => set((state) => ({ ...state, uniqueDocId: uniqueId })),
  asyncGetUserDocList: async (uid) => {
    try {
      const dbRef = ref(db, "user/userList");
      const response = await get(child(dbRef, `/${uid}/docs`));
      const parsedResponse = response.val();
      
    } catch ({ name, message }) {
      set((state) => ({ ...state, errorMessage: message , errorName: name }));
    }
  },
  asyncSaveDoc: async (uniqueId, docData) => {
    try {
      getState().asyncSaveDocOnDoc(uniqueId, docData);
      getState().asyncSaveDocOnUser(uniqueId, docData);
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
});
