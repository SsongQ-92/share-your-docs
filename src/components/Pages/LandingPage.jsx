import { useBoundStore } from "../../store";
import LinkButton from "../Button/LinkButton";
import Container from "../UI/Container";
import Layout from "../UI/Layout";

export default function LandingPage() {
  const { isLogIn, userName } = useBoundStore((state) => ({
    isLogIn: state.isLogIn,
    userName: state.userName,
  }));

  if (!isLogIn) {
    return (
      <Layout>
        <main className="h-full flex-col-center gap-20 bg-black-dark">
          <p className="text-80 text-gray-0 animate-fadeIn">환영합니다</p>
          <p className="text-60 text-gray-0 animate-fadeIn">로그인 후 서비스를 이용해주시기 바랍니다 🤗</p>
        </main>
      </Layout>
    )
  }

  return (
    <Layout>
      <main className="h-full flex-col-center gap-20 bg-black-dark">
        <p className="text-80 text-gray-0 animate-fadeIn">{`${userName}님 환영합니다`}</p>
        {
          isLogIn && 
            (<Container style="flex-center gap-30" >
              <LinkButton destination="/docs/lists">내 문서 보러 가기</ LinkButton>
              <LinkButton destination="/docs/new">
                <span className="animate-bounce">새로운 문서 만들기 👉</span>
              </ LinkButton>
            </Container>)
        }
      </main>
    </Layout>
  )
}
