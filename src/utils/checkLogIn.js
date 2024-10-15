import { getAuth } from "firebase/auth";

const checkLogIn = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  
  if (!user) {
    return false;
  }

  return true;
}

export default checkLogIn;
