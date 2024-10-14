import { Route, Routes } from "react-router-dom";
import Header from "./Header";
import Layout from "./UI/Layout";
import LandingPage from "./Pages/LandingPage";

export default function App() {
  return (
    <Layout>
      <Header />
      <Routes>
        <Route path="/" exact element={<LandingPage />} />
      </Routes>
    </Layout>
  )
}
