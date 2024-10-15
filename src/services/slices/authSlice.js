import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase";

export const createAuthSlice = (set) => ({
  isLogin: false,
  userLocalId: "",
  userFederatedId: "",
  userName: "",
  logIn: async () => {
    try {
      const response = await signInWithPopup(auth, provider);
      const provider = new GoogleAuthProvider();

      const { fullName, localId, federatedId } = response["_tokenResponse"];

      set((state) => ({ ...state, userLocalId: localId, userFederatedId: federatedId, userName: fullName, isLogin: true }));
    } catch ({ name, message }) {
      set((state) => ({ ...state, errorMessage: message , errorName: name }));
    }
  },
  logOut: () => set((state) => ({ ...state, isLogin: false })),
});
