import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth, db } from "../../firebase";
import { child, get, ref, update } from "firebase/database";

export const createAuthSlice = (set, getState) => ({
  isLogin: false,
  userId: "",
  userName: "",
  logIn: async () => {
    try {
      const provider = new GoogleAuthProvider();
      const response = await signInWithPopup(auth, provider);
      const { uid, displayName } = response.user;

      set((state) => ({ ...state, userId: uid, userName: displayName, isLogin: true }));

      const isEnrolled = getState().checkEnrollUser(uid);
      if (!isEnrolled) {
        getState().enrollUser(uid, displayName);
      }
      getState().updateOnlineUser(uid, true);
    } catch ({ name, message }) {
      set((state) => ({ ...state, errorMessage: message , errorName: name }));
    }
  },
  logOut: async () => {
    try {
      const auth = getAuth();
      const userId = getState().userId;
      set((state) => ({ ...state, isLogin: false }));
      getState().updateOnlineUser(userId, false);
      signOut(auth);
    } catch ({ name, message }) {
      set((state) => ({ ...state, errorMessage: message , errorName: name }));
    }
  },
  enrollUser: async (uid, userName) => {
    try {
      const dbRef = ref(db, "user");
      const response = await get(child(dbRef, "/userList"));
      
      const updatedUserList = response + "," + uid;

      update(ref(db, "/user/userList"), updatedUserList);
      update(ref(db, `user/${uid}`), {
        userName
      });
    } catch ({ name, message }) {
      set((state) => ({ ...state, errorMessage: message , errorName: name }));
    }
  },
  checkEnrollUser: async (uid) => {
    try {
      const dbRef = ref(db, "user");
      const response = await get(child(dbRef, "/userList"));

      return response.includes(uid);
    } catch ({ name, message }) {
      set((state) => ({ ...state, errorMessage: message , errorName: name }));
    }
  },
  updateOnlineUser: async (uid, isLogin) => {
    try {
      const dbRef = ref(db, "user");
      
      if (isLogin) {
        const response = await get(child(dbRef, "/currentOnlineUser"));
        
        const updatedOnlineUserList = response + "," + uid;
        
        update(ref(db, "/user/currentOnlineUser"), updatedOnlineUserList);
      } else {
        const response = await get(child(dbRef, "/currentOnlineUser"));
        const onlineUserListArray = response.split(",");
        
        const updatedOnlineUserList = onlineUserListArray.filter(value => value !== uid).join("");
        
        update(ref(db, "/user/currentOnlineUser"), updatedOnlineUserList);
      }
    } catch ({ name, message }) {
      set((state) => ({ ...state, errorMessage: message , errorName: name }));
    }
  },
});
