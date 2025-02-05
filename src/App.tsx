import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import AdminLayout from "./admin/layout/AdminLayout";
import MenuConsole from "./admin/components/MenuConsole";
import MegaMenuPage from "./admin/pages/MegaMenuPage";
import Dashboard from "./admin/components/Dashboard";
import PageBuilder from "./admin/components/PageBuilder";
import DynamicPage from "./components/DynamicPage";
import Navbar from "./components/Navbar";
import SubMegaMenuPage from "./admin/pages/SubMegaMenuPage";
import ContentManagementPage from "./admin/pages/ContentManagementPage";
import PageContentList from "./admin/pages/PageContentList";
import ContentEditPage from "./admin/pages/ContentEditPage";
import Contact from "./pages/Contact";
import Footer from "./components/Footer";
import InquiryManagement from "./admin/components/InquiryManagement";
import FooterManagement from "./admin/components/FooterManagement";
import { authRoutes } from "./routes";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-right" />
      <BrowserRouter>
        <Routes>
          {authRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="inquiry" element={<InquiryManagement />} />
            <Route path="footer" element={<FooterManagement />} />
            <Route path="menus" element={<MenuConsole />} />
            <Route path="menus/mega-menu" element={<MegaMenuPage />} />
            <Route path="pages/content" element={<PageContentList />} />
            <Route path="content" element={<ContentManagementPage />} />
            <Route path="content/:contentId" element={<ContentEditPage />} />
            <Route
              path="menus/:menuId/mega-menu/:megaMenuId/sub-menus"
              element={<SubMegaMenuPage />}
            />
            <Route path="pages" element={<PageBuilder />} />
            <Route path="pages/:path" element={<DynamicPage />} />
          </Route>
          <Route
            path="/contact"
            element={
              <div className="flex flex-grow-1 flex-col">
                <Navbar />
                <div className="flex-grow">
                  <Contact />
                </div>
                <Footer />
              </div>
            }
          />
          <Route
            path="*"
            element={
              <>
                <div className="flex h-screen  flex-col">
                  <Navbar />
                  <div className="flex-grow">
                    <DynamicPage />
                  </div>
                  <Footer />
                </div>
              </>
            }
          />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
