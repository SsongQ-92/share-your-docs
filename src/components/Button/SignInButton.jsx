import { useParams } from "react-router-dom";
import { useBoundStore } from "../../store";

export default function SignInButton() {
  const { docId } = useParams();
  const { isLogIn, asyncLogIn, asyncLogOut } = useBoundStore((state) => ({
    isLogIn: state.isLogIn,
    asyncLogIn: state.asyncLogIn,
    asyncLogOut: state.asyncLogOut,
  }));

  const isLogInWithSpecificUrl = docId ? true : false;

  const handleButtonClick = async () => {
    if (isLogIn) {
      await asyncLogOut();
    } else {
      await asyncLogIn(isLogInWithSpecificUrl, docId);
    }
  }

  return (
    <button className="flex-center w-80 h-50 border-2 border-solid border-white bg-gray-8 rounded-[15px] text-white text-18 hover:bg-black-light" onClick={handleButtonClick}>
      {isLogIn ? "로그아웃" : "로그인"}
    </button>
  )
}

SignInButton.propTypes = {};
