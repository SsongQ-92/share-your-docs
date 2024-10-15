import { Link } from "react-router-dom";

export default function NotFoundPage() {
  const notFoundGifUrl = "https://media.giphy.com/media/3ohs7KViF6rA4aan5u/giphy.gif?cid=ecf05e47xhk2cqh66hl2qlmrhfd23c3s0gt2dbkcxl9y6cdq&ep=v1_gifs_search&rid=giphy.gif&ct=g";

  return (
    <main className="h-full flex-col-center gap-60 bg-black-dark">
      <nav>
        <Link to="/">
          <p className="animate-bounce text-white text-30">홈페이지로 돌아가기 클릭 👆</p>
        </Link>
      </nav>
      <div className="flex-col-center gap-10">
        <h1 className="text-30 text-white">Oops!</h1>
        <h2 className="text-26 text-white">Something went wrong</h2>
        <h3 className="text-red-5 text-22 mb-10">없는 Doc 페이지 입니다 !!!</h3>
        <img src={notFoundGifUrl} alt="not found page" width={'400'} height={'400'} />
      </div>
    </main>
  )
}
