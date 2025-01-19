import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "./axios";
import { toast } from "react-hot-toast";

export interface Menu {
  id: number;
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
