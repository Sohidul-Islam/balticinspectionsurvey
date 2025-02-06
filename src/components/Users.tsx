import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllUsers,
  updateUserStatus,
  updateUser,
  deleteUser,
} from "../api/users";
import { toast } from "react-hot-toast"; // or your preferred toast library
import { FiEdit2, FiTrash2, FiCheck, FiX } from "react-icons/fi"; // Import icons
import { useAuth } from "../providers/AuthProvider";

export const Users = () => {
  const queryClient = useQueryClient();

  const authData = useAuth();

  console.log({ authData });

  // Fetch users
  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
  });

  // Update status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({
      userId,
      status,
    }: {
      userId: string;
      status: "pending" | "approved" | "rejected";
    }) => updateUserStatus(userId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User status updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update user status");
      console.error("Error:", error);
    },
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: ({ userId, userData }: { userId: string; userData: any }) =>
      updateUser(userId, userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update user");
      console.error("Error:", error);
    },
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete user");
      console.error("Error:", error);
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 p-4 rounded-lg text-red-800">
          Error loading users. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800">User Management</h2>
        <p className="text-gray-600 mt-2">Manage and monitor user accounts</p>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Verified
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users?.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {user.username}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        user.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : user.status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {user.status.charAt(0).toUpperCase() +
                        user.status.slice(1)}
                    </span>
                  </td>
                  <td>
                    <button
                      disabled={user.isVerified}
                      onClick={() => {
                        updateUserMutation.mutate({
                          userId: user.id,
                          userData: { isVerified: true },
                        });
                      }}
                      className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm ${
                        user.isVerified
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-gray-500 hover:bg-gray-600"
                      } text-white transition-colors`}
                    >
                      {user.isVerified ? "Verified" : "Mark as Verified"}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() =>
                        updateStatusMutation.mutate({
                          userId: user.id,
                          status: "approved",
                        })
                      }
                      disabled={
                        user.status === "approved" ||
                        authData?.user?.id === user.id
                      }
                      className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm
                        ${
                          user.status === "approved"
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-green-50 text-green-700 hover:bg-green-100"
                        }`}
                    >
                      <FiCheck className="w-4 h-4 mr-1" />
                      Approve
                    </button>
                    <button
                      onClick={() =>
                        updateStatusMutation.mutate({
                          userId: user.id,
                          status: "rejected",
                        })
                      }
                      disabled={
                        user.status === "rejected" ||
                        authData?.user?.id === user.id
                      }
                      className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm
                        ${
                          user.status === "rejected" ||
                          authData?.user?.id === user.id
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-red-50 text-red-700 hover:bg-red-100"
                        }`}
                    >
                      <FiX className="w-4 h-4 mr-1" />
                      Reject
                    </button>
                    <button
                      onClick={() => {
                        const newName = prompt("Enter new name:", user.name);
                        if (newName) {
                          updateUserMutation.mutate({
                            userId: user.id,
                            userData: { username: newName },
                          });
                        }
                      }}
                      className="inline-flex items-center px-3 py-1.5 rounded-md text-sm bg-blue-50 text-blue-700 hover:bg-blue-100"
                    >
                      <FiEdit2 className="w-4 h-4 mr-1" />
                      Edit
                    </button>
                    <button
                      disabled={authData?.user?.id === user.id}
                      onClick={() => {
                        if (
                          window.confirm(
                            "Are you sure you want to delete this user?"
                          )
                        ) {
                          deleteUserMutation.mutate(user.id);
                        }
                      }}
                      className={`${
                        authData?.user?.id === user.id
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : ""
                      } inline-flex items-center px-3 py-1.5 rounded-md text-sm bg-gray-50 text-gray-700 hover:bg-gray-100`}
                    >
                      <FiTrash2 className="w-4 h-4 mr-1" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
