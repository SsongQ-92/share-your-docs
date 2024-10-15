import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import checkLogIn from "../utils/checkLogIn";

const useNoLogInRedirect = () => {
  const navigate = useNavigate();
  const isLogIn = checkLogIn();

  useEffect(() => {
    if (!isLogIn) {
      navigate("/");
    }
  }, [isLogIn, navigate])
  
  if (!isLogIn) {
    return null;
  }
}

export default useNoLogInRedirect;
