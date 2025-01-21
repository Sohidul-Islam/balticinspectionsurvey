import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "./axios";
import { toast } from "react-hot-toast";

export interface Section {
  type: string;
  data: Record<string, any>;
}

export interface Content {
  id: number;
  title: string;
  menuId: number;
  megaMenuId: number;
  subMegaMenuId: number;
  sections: Section[];
}

interface ApiResponse<T> {
  data: T;
  status: boolean;
  message: string;
}

export const useContent = (contentId: string) => {
  return useQuery<ApiResponse<Content>>({
    queryKey: ["content", contentId],
    queryFn: async () => {
      const { data } = await axiosInstance.get<ApiResponse<Content>>(
        `/api/content?contentId=${contentId}`
      );
      return data;
    },
    enabled: !!contentId,
  });
};

export const useCreateContent = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<Content>, Error, Omit<Content, "id">>({
    mutationFn: async (contentData) => {
      const { data } = await axiosInstance.post("/api/content", contentData);
      return data;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["content"] });
      toast.success(response.message || "Content created successfully");
    },
  });
};

export const useUpdateContent = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<Content>, Error, Content>({
    mutationFn: async ({ id, ...contentData }) => {
      const { data } = await axiosInstance.post(
        `/api/content/${id}`,
        contentData
      );
      return data;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["content"] });
      toast.success(response.message || "Content updated successfully");
    },
  });
};

export const useDeleteContent = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<void>, Error, number>({
    mutationFn: async (id) => {
      const { data } = await axiosInstance.post(`/api/content/delete/${id}`);
      return data;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["content"] });
      queryClient.invalidateQueries({ queryKey: ["pages"] });
      toast.success(response.message || "Content deleted successfully");
    },
  });
};
