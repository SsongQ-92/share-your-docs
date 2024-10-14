import LinkButton from "../Button/LinkButton";

export default function LandingPage() {
  return (
    <main className="h-full flex-col-center gap-20 bg-black-dark">
      <p className="text-60 text-gray-0 animate-fadeIn">환영합니다</p>
      <LinkButton destination="/docs/list" text="내 문서 보러 가기 👉" />
    </main>
  )
}
