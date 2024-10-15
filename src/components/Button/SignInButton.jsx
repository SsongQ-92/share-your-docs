import { useBoundStore } from "../../store";

export default function SignInButton() {
  const { isLogin, logIn, logOut } = useBoundStore((state) => ({
    isLogin: state.isLogin,
    logIn: state.logIn,
    logOut: state.logOut,
  }));

  const handleButtonClick = async () => {
    if (isLogin) {
      await logOut();
    } else {
      await logIn();
    }
  }

  return (
    <button className="flex-center w-80 h-50 border-2 border-solid border-white bg-gray-8 rounded-[15px] text-white text-18 hover:bg-black-light" onClick={handleButtonClick}>
      {isLogin ? "로그아웃" : "로그인"}
    </button>
  )
}

SignInButton.propTypes = {};
