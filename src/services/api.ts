import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const BASE_URL = "https://server.balticinspectionsurvey.com";
// export const BASE_URL = "http://localhost:5000";

export const menuService = {
  getMenus: () => api.get("/menus"),
  createMenu: (data: any) => api.post("/menus", data),
  updateMenu: (id: string, data: any) => api.put(`/menus/${id}`, data),
  deleteMenu: (id: string) => api.delete(`/menus/${id}`),
};

export const pageService = {
  getPage: (path: string) => api.get(`/pages/${path}`),
  createPage: (data: any) => api.post("/pages", data),
  updatePage: (id: string, data: any) => api.put(`/pages/${id}`, data),
  deletePage: (id: string) => api.delete(`/pages/${id}`),
};

export const footerService = {
  getFooterData: () => api.get("/footer"),
  updateFooterData: (data: any) => api.put("/footer", data),
};
