import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import AdminLayout from "./admin/layout/AdminLayout";
import MenuConsole from "./admin/components/MenuConsole";
import MegaMenuPage from "./admin/pages/MegaMenuPage";
import Dashboard from "./admin/components/Dashboard";
import PageBuilder from "./admin/components/PageBuilder";
import DynamicPage from "./components/DynamicPage";
import Navbar from "./components/Navbar";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-right" />
      <BrowserRouter>
        <Routes>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="menus" element={<MenuConsole />} />
            <Route path="menus/mega-menu" element={<MegaMenuPage />} />
            <Route path="pages" element={<PageBuilder />} />
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
    </QueryClientProvider>
  );
};

export default App;
