import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "./axios";
import { toast } from "react-hot-toast";

export interface Menu {
  id: number;
  title: string;
  path: string;
}

export interface MegaMenu {
  id: number;
  menuId: number;
  title: string;
  path: string;
}

interface ApiResponse<T> {
  data: T;
  status: boolean;
  message: string;
}

export const useMenus = () => {
  return useQuery<ApiResponse<Menu[]>>({
    queryKey: ["menus"],
    queryFn: async () => {
      const { data } = await axiosInstance.get<ApiResponse<Menu[]>>(
        "/api/menu"
      );
      return data;
    },
  });
};

export const useMenu = (id: number) => {
  return useQuery<ApiResponse<Menu>>({
    queryKey: ["menu", id],
    queryFn: async () => {
      const { data } = await axiosInstance.get<ApiResponse<Menu>>(
        `/api/menu/${id}`
      );
      return data;
    },
  });
};

export const useCreateMenu = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<Menu>, Error, Omit<Menu, "id">>({
    mutationFn: async (menuData) => {
      const { data } = await axiosInstance.post<ApiResponse<Menu>>(
        "/api/menu",
        menuData
      );
      return data;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["menus"] });
      toast.success(response.message || "Menu created successfully");
    },
  });
};

export const useUpdateMenu = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<Menu>, Error, Menu>({
    mutationFn: async ({ id, ...menuData }) => {
      const { data } = await axiosInstance.post<ApiResponse<Menu>>(
        `/api/menu/${id}`,
        menuData
      );
      return data;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["menus"] });
      toast.success(response.message || "Menu updated successfully");
    },
  });
};

// Mega Menu Operations
export const useMegaMenus = (menuId: number) => {
  return useQuery<ApiResponse<MegaMenu[]>>({
    queryKey: ["megaMenus", menuId],
    queryFn: async () => {
      const { data } = await axiosInstance.get<ApiResponse<MegaMenu[]>>(
        `/api/menu/${menuId}/mega-menus`
      );
      return data;
    },
    enabled: !!menuId,
  });
};

export const useMegaMenu = (menuId: number, megaMenuId: number) => {
  return useQuery<ApiResponse<MegaMenu>>({
    queryKey: ["megaMenu", menuId, megaMenuId],
    queryFn: async () => {
      const { data } = await axiosInstance.get<ApiResponse<MegaMenu>>(
        `/api/menu/${menuId}/mega-menus/${megaMenuId}`
      );
      return data;
    },
    enabled: !!menuId && !!megaMenuId,
  });
};

export const useCreateMegaMenu = (menuId: number) => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<MegaMenu>, Error, Omit<MegaMenu, "id">>({
    mutationFn: async (megaMenuData) => {
      const { data } = await axiosInstance.post<ApiResponse<MegaMenu>>(
        `/api/menu/${menuId}/mega-menus`,
        megaMenuData
      );
      return data;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["megaMenus", menuId] });
      toast.success(response.message || "Mega menu created successfully");
    },
  });
};

export const useUpdateMegaMenu = (menuId: number) => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<MegaMenu>, Error, MegaMenu>({
    mutationFn: async ({ id, ...megaMenuData }) => {
      const { data } = await axiosInstance.post<ApiResponse<MegaMenu>>(
        `/api/menu/${menuId}/mega-menus/${id}`,
        megaMenuData
      );
      return data;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["megaMenus", menuId] });
      toast.success(response.message || "Mega menu updated successfully");
    },
  });
};

export const useDeleteMegaMenu = (menuId: number) => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<void>, Error, number>({
    mutationFn: async (megaMenuId) => {
      const { data } = await axiosInstance.delete<ApiResponse<void>>(
        `/api/menu/${menuId}/mega-menus/${megaMenuId}/delete`
      );
      return data;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["megaMenus", menuId] });
      toast.success(response.message || "Mega menu deleted successfully");
    },
  });
};

export const useDeleteMenu = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<void>, Error, number>({
    mutationFn: async (menuId) => {
      const { data } = await axiosInstance.delete<ApiResponse<void>>(
        `/api/menu/${menuId}/delete`
      );
      return data;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["menus"] });
      toast.success(response.message || "Menu deleted successfully");
    },
  });
};
