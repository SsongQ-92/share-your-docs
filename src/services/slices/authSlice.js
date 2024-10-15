import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase";

export const createAuthSlice = (set) => ({
  userLocalId: 0,
  userName: "",
  setUserLocalId: (newLocalId) => set({ userLocalId: newLocalId }), 
  setUserName: (newUserName) => set({ userName: newUserName }),
  logIn: async () => {
    try {
      const response = await signInWithPopup(auth, provider);
      const provider = new GoogleAuthProvider();

      const { fullName, localId } = response["_tokenResponse"];

      set({ userLocalId: localId });
      set({ userName: fullName });
    } catch (err) {
      console.error(err.message);
    }
  }
});
