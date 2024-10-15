import { Route, Routes } from "react-router-dom";
import Header from "./Header";
import CreateDocPage from "./Pages/CreateDocPage";
import DocsListPage from "./Pages/DocsListPage";
import EditDocPage from "./Pages/EditDocPage";
import LandingPage from "./Pages/LandingPage";
import NotFoundPage from "./Pages/NotFoundPage";
import Layout from "./UI/Layout";

export default function App() {
  return (
    <Layout>
      <Header />
      <Routes>
        <Route path="/" exact element={<LandingPage />} />
        <Route path="docs">
          <Route path="lists" element={<DocsListPage />} />
          <Route path="new" element={<CreateDocPage />} />
          <Route path=":docId" element={<EditDocPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  )
}
