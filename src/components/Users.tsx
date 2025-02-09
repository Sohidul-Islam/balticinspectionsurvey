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
import { useNavigate } from "react-router";
import { useState } from 'react';

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newName: string) => void;
  currentName: string;
}

const EditModal: React.FC<EditModalProps> = ({ isOpen, onClose, onSubmit, currentName }) => {
  const [newName, setNewName] = useState(currentName);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(newName);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all w-full max-w-md">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
              <div className="mt-3 text-center sm:mt-0 sm:text-left">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Edit Username
                </h3>
                <div className="mt-4">
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Enter new username"
                  />
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="submit"
                className="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Save
              </button>
              <button
                type="button"
                onClick={onClose}
                className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export const Users = () => {
  const queryClient = useQueryClient();

  const authData = useAuth();

  const navigate = useNavigate();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

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

  const handleEditClick = (user: any) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = (newName: string) => {
    if (selectedUser && newName.trim()) {
      updateUserMutation.mutate({
        userId: selectedUser.id,
        userData: { username: newName },
      });
    }
  };

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
    <div className="p-0 md:p-6 mx-auto">
      <div className="mb-6 md:mb-8">
        <h2 className="text-xl md:text-3xl font-bold text-gray-800">User Management</h2>
        <p className="text-xs md:text-base text-gray-600 mt-2">Manage and monitor user accounts</p>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="hidden md:table-cell px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="hidden md:table-cell px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Verified
                </th>
                <th className="hidden md:table-cell px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Password Token
                </th>
                <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users?.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {user.username}
                    </div>
                    {/* Show email on mobile as secondary info */}
                    <div className="md:hidden text-xs text-gray-500 mt-1">
                      {user.email}
                    </div>
                  </td>
                  <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </td>
                  <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : user.status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </td>
                  <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap">
                    <button
                      disabled={user.isVerified}
                      onClick={() => {
                        updateUserMutation.mutate({
                          userId: user.id,
                          userData: { isVerified: true },
                        });
                      }}
                      className={`inline-flex items-center px-3 py-1.5 rounded-md text-xs md:text-sm ${
                        user.isVerified
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-gray-500 hover:bg-gray-600"
                      } text-white transition-colors`}
                    >
                      {user.isVerified ? "Verified" : "Mark as Verified"}
                    </button>
                  </td>
                  <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm">
                    {user.resetPasswordToken && user.resetPasswordExpiry ? (
                      <button
                        onClick={() => {
                          navigate(
                            `/reset-password?token=${user.resetPasswordToken}&email=${user.email}`
                          );
                        }}
                        className="inline-flex items-center px-3 py-1.5 rounded-md text-xs md:text-sm bg-blue-50 text-blue-700 hover:bg-blue-100"
                      >
                        Reset Password Link
                      </button>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex flex-col md:flex-row gap-2 md:space-x-2">
                      <button
                        onClick={() =>
                          updateStatusMutation.mutate({
                            userId: user.id,
                            status: "approved",
                          })
                        }
                        disabled={user.status === "approved" || authData?.user?.id === user.id}
                        className={`inline-flex items-center px-2 md:px-3 py-1 md:py-1.5 rounded-md text-xs md:text-sm
                          ${
                            user.status === "approved"
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-green-50 text-green-700 hover:bg-green-100"
                          }`}
                      >
                        <FiCheck className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                        <span className="hidden md:inline">Approve</span>
                      </button>
                      
                      <button
                        onClick={() =>
                          updateStatusMutation.mutate({
                            userId: user.id,
                            status: "rejected",
                          })
                        }
                        disabled={user.status === "rejected" || authData?.user?.id === user.id}
                        className={`inline-flex items-center px-2 md:px-3 py-1 md:py-1.5 rounded-md text-xs md:text-sm
                          ${
                            user.status === "rejected" || authData?.user?.id === user.id
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-red-50 text-red-700 hover:bg-red-100"
                          }`}
                      >
                        <FiX className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                        <span className="hidden md:inline">Reject</span>
                      </button>

                      <button
                        onClick={() => handleEditClick(user)}
                        className="inline-flex items-center px-2 md:px-3 py-1 md:py-1.5 rounded-md text-xs md:text-sm bg-blue-50 text-blue-700 hover:bg-blue-100"
                      >
                        <FiEdit2 className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                        <span className="hidden md:inline">Edit</span>
                      </button>

                      <button
                        disabled={authData?.user?.id === user.id}
                        onClick={() => {
                          if (window.confirm("Are you sure you want to delete this user?")) {
                            deleteUserMutation.mutate(user.id);
                          }
                        }}
                        className={`inline-flex items-center px-2 md:px-3 py-1 md:py-1.5 rounded-md text-xs md:text-sm
                          ${
                            authData?.user?.id === user.id
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-red-50 text-red-700 hover:bg-red-100"
                          }`}
                      >
                        <FiTrash2 className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                        <span className="hidden md:inline">Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedUser && (
        <EditModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedUser(null);
          }}
          onSubmit={handleEditSubmit}
          currentName={selectedUser.username}
        />
      )}
    </div>
  );
};
