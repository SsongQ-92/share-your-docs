import { Route, Routes } from "react-router-dom";
import DocPage from "./Pages/DocPage";
import DocsListPage from "./Pages/DocsListPage";
import ExternalAccessPage from "./Pages/ExternalAccessPage";
import LandingPage from "./Pages/LandingPage";
import NotFoundPage from "./Pages/NotFoundPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" exact element={<LandingPage />} />
      <Route path="docs">
        <Route path="lists" element={<DocsListPage />} />
        <Route path="new" element={<DocPage mode="create" />} />
        <Route path=":docId" element={<ExternalAccessPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
