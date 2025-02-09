import axiosInstance from "./axios";

export interface InquiryData {
  inquiryType: string;
  firstName: string;
  lastName: string;
  email: string;
  companyName?: string;
  jobTitle?: string;
  phone?: string;
  message: string;
  agreeToTerms: boolean;
  status?: "pending" | "inProgress" | "completed";
}

export interface InquiryResponse extends InquiryData {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export const inquiryApi = {
  submit: async (data: InquiryData): Promise<InquiryResponse> => {
    const response = await axiosInstance.post(`/api/inquiry`, data);
    return response.data;
  },

  getAll: async (): Promise<InquiryResponse[]> => {
    const response = await axiosInstance.get(`/api/inquiry`);
    return response?.data?.data;
  },

  updateInquiry: async (
    id: string,
    status: string
  ): Promise<InquiryResponse> => {
    const response = await axiosInstance.post(`/api/inquiry/${id}`, {
      status,
    });
    return response.data;
  },
  delete: async (id: string): Promise<void> => {
    const response = await axiosInstance.post(`/api/inquiry/delete/${id}`);
    return response.data;
  },
  updateInquiryStatus: async (
    id: string,
    status: string
  ): Promise<InquiryResponse> => {
    const response = await axiosInstance.post(`/api/inquiry/${id}/status`, {
      status,
    });
    return response.data;
  },
};
