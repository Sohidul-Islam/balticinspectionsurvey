import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { inquiryApi, InquiryData } from "../services/inquiryService";
import { toast } from "react-hot-toast";

export const useSubmitInquiry = () => {
  return useMutation({
    mutationFn: (data: InquiryData) => inquiryApi.submit(data),
    onSuccess: () => {
      toast.success("Your inquiry has been submitted successfully!");
    },
    onError: () => {
      toast.error("Failed to submit inquiry. Please try again.");
    },
  });
};

export const useInquiries = () => {
  return useQuery({
    queryKey: ["inquiries"],
    queryFn: inquiryApi.getAll,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useUpdateInquiryStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      inquiryApi.updateInquiryStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inquiries"] });
      toast.success("Status updated successfully");
    },
    onError: () => {
      toast.error("Failed to update status");
    },
  });
};
