import { Link } from "react-router-dom";
import { useBoundStore } from "../../store";
import SignInButton from "../Button/SignInButton";
import Container from "../UI/Container";

export default function Header() {
  const { userName, isLogIn, userDocsNumber, asyncClearDocInfo } = useBoundStore((state) => ({
    userName: state.userName,
    isLogIn: state.isLogIn,
    userDocsNumber: state.userDocsNumber,
    asyncClearDocInfo: state.asyncClearDocInfo,
  }))

  const handleLogoClick = () => {
    asyncClearDocInfo();
  }

  return (
    <header className="fixed top-0 w-full bg-black py-10 z-header shadow-[0px_5px_20px_3px_rgba(255,255,255,0.2)] z-">
      <nav className="flex justify-between items-center px-60">
        <Link to="/">
          <img src="/assets/logo.png" alt="로고" width={200} height={80} onClick={handleLogoClick} />
        </Link>
        <Container style="flex items-center gap-30 mr-20">
          {isLogIn && <span className="text-18 text-white">{`${userName}님 좋은 하루 되세요`}</span>}
          {isLogIn && <span className="text-18 text-white">{`나의 문서: ${userDocsNumber}개`}</span>}
          <SignInButton />
        </Container>
      </nav>
    </header>
  )
}
