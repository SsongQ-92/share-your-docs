import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useBoundStore } from "../store";

const useNoLogInRedirect = () => {
  const navigate = useNavigate();
  const isLogIn = useBoundStore((state) => state.isLogIn);

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
