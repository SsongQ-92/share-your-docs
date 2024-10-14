import { Link } from "react-router-dom";
import SignInButton from "../Button/SignInButton";
import Container from "../UI/Container";

export default function Header() {
  return (
    <header className="fixed top-0 w-full bg-black py-10 shadow-[0px_5px_20px_3px_rgba(255,255,255,0.2)]">
      <nav className="flex justify-between items-center px-20">
        <Link to="/">
          <img src="/assets/logo.png" alt="로고" width={200} height={80} />
        </Link>
        <Container style="flex items-center gap-20 mr-20">
          <SignInButton />
        </Container>
      </nav>
    </header>
  )
}
