import { getAuth } from "firebase/auth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useBoundStore } from "../store";

const useNoLogInRedirect = () => {
  const navigate = useNavigate();
  const isLogIn = useBoundStore((state) => state.isLogIn);

  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (!isLogIn || !user) {
      navigate("/");
    }
  }, [isLogIn, navigate, user])
  
  if (!isLogIn || !user) {
    return null;
  }
}

export default useNoLogInRedirect;
