import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { child, get, ref, remove, update } from "firebase/database";
import { auth, db } from "../../firebase";

export const createAuthSlice = (set, getState) => ({
  isLogIn: false,
  userId: "",
  userName: "",
  userDocsNumber: 0,
  userAllDocs: {},
  onlineUserList: [],
  addUserDocsNumber: () => set((state) => ({ userDocsNumber: state.userDocsNumber + 1 })),
  asyncLogIn: async (isLogInWithSpecificUrl, theSpecificUrl) => {
    try {
      const provider = new GoogleAuthProvider();
      const response = await signInWithPopup(auth, provider);
      const { uid, displayName } = response.user;

      set((state) => ({ ...state, userId: uid, userName: displayName, isLogIn: true }));

      if (isLogInWithSpecificUrl) {
        await getState().asyncGetSpecificDoc(theSpecificUrl);
      }

      await getState().asyncCheckEnrollUser(uid, displayName);
      await getState().asyncUpdateOnlineUser(uid, true);
    } catch ({ name, message }) {
      set((state) => ({ ...state, errorMessage: message , errorName: name }));
    }
  },
  asyncLogOut: async () => {
    try {
      const auth = getAuth();
      const userId = getState().userId;
      const currentWorkingUniqueDocId = getState().uniqueDocId;
      await getState().asyncUpdateOnlineUser(userId, false);
      await getState().asyncDeleteConcurrentUserList(currentWorkingUniqueDocId);
      set((state) => ({ ...state, isLogIn: false, uniqueDocId: "", docMode: "", currentDocData: {}, userId: "", userName: "", userDocsNumber: 0, userAllDocs: {}, autoSaveNum: 0 }));
      signOut(auth);
    } catch ({ name, message }) {
      set((state) => ({ ...state, errorMessage: message , errorName: name }));
    }
  },
  asyncEnrollUser: async (uid, userName) => {
    try {
      const userInfo = { userId: uid, userName, };
      update(ref(db, `/user/userList/${uid}`), userInfo);
    } catch ({ name, message }) {
      set((state) => ({ ...state, errorMessage: message , errorName: name }));
    }
  },
  asyncCheckEnrollUser: async (uid, displayName) => {
    try {
      const dbRef = ref(db, "user");
      const response = await get(child(dbRef, "/userList"));
      const parsedResponse = response.val();

      if (!parsedResponse || (parsedResponse && !Object.keys(parsedResponse).includes(uid))) {
        await getState().asyncEnrollUser(uid, displayName);
      } else {
        await getState().asyncGetUserDocList(uid);
      }
    } catch ({ name, message }) {
      set((state) => ({ ...state, errorMessage: message , errorName: name }));
    }
  },
  asyncGetOnlineUser: async () => {
    try {
      const dbRef = ref(db, "user");
      const response = await get(child(dbRef, "/currentOnlineUser"));
      const parsedResponse = response?.val();

      if (!parsedResponse) {
        set({ onlineUserList: [] });
        return;
      }

      set({ onlineUserList: Object.keys(parsedResponse) });
    } catch ({ name, message }) {
      set((state) => ({ ...state, errorMessage: message , errorName: name }));
    }
  },
  asyncUpdateOnlineUser: async (uid, isLogin) => {
    try {      
      if (isLogin) {
        update(ref(db, `/user/currentOnlineUser/${uid}`), { userId: uid });
      } else { 
        remove(ref(db, `/user/currentOnlineUser/${uid}`));
      }
    } catch ({ name, message }) {
      set((state) => ({ ...state, errorMessage: message , errorName: name }));
    }
  },
});
