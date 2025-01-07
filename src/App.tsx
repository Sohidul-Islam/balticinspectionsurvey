import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "./admin/layout/AdminLayout";
import MenuManager from "./admin/components/MenuManager";
import PageBuilder from "./admin/components/PageBuilder";
import DynamicPage from "./components/DynamicPage";
import Navbar from "./components/Navbar";
import FooterManager from "./admin/components/FooterManager";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="menus" element={<MenuManager />} />
          <Route path="pages" element={<PageBuilder />} />
          <Route path="footer" element={<FooterManager />} />
        </Route>
        <Route
          path="*"
          element={
            <>
              <Navbar />
              <DynamicPage />
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
