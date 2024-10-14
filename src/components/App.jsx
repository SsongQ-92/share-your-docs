import { Route, Routes } from "react-router-dom";
import Header from "./Header";
import Layout from "./UI/Layout";
import LandingPage from "./Pages/LandingPage";
import DocsListPage from "./Pages/DocsListPage";
import CreateDocPage from "./Pages/CreateDocPage";

export default function App() {
  return (
    <Layout>
      <Header />
      <Routes>
        <Route path="/" exact element={<LandingPage />} />
        <Route path="docs">
          <Route path="lists" element={<DocsListPage />} />
          <Route path="new" element={<CreateDocPage />} />
        </Route>
      </Routes>
    </Layout>
  )
}
