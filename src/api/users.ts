import axiosInstance from "../services/axios";

interface User {
  id: string;
  name: string;
  email: string;
  status: "pending" | "approved" | "rejected";
  // add other user fields as needed
}

interface UpdateUserData {
  name?: string;
  email?: string;
  // add other updatable fields
}

// Get all users
export const getAllUsers = async (): Promise<User[]> => {
  const { data } = await axiosInstance.get("/api/auth/users/all");
  return data.data?.users;
};

// Update user status
export const updateUserStatus = async (
  userId: string,
  status: User["status"]
) => {
  const { data } = await axiosInstance.post(
    `/api/auth/users/${userId}/update-status`,
    {
      status,
    }
  );
  return data;
};

// Update user details
export const updateUser = async (userId: string, userData: UpdateUserData) => {
  const { data } = await axiosInstance.post(
    `/api/auth/users/${userId}/update`,
    userData
  );
  return data;
};

// Delete user
export const deleteUser = async (userId: string) => {
  const { data } = await axiosInstance.post(`/api/auth/users/${userId}/delete`);
  return data;
};
