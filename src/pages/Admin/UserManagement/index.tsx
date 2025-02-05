import React, { useState } from "react";
import styled from "styled-components";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../../services/axios";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import EditModal from "./EditModal";

interface User {
  id: string;
  username: string;
  email: string;
  isVerified: boolean;
  createdAt: string;
}

const UserManagement = () => {
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await axiosInstance.get("/api/users/all");
      return response.data;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: boolean }) => {
      const response = await axiosInstance.post(
        `/api/users/${id}/update-status`,
        {
          isVerified: status,
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User status updated successfully");
    },
    onError: () => {
      toast.error("Failed to update user status");
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await axiosInstance.post(`/api/users/${id}/delete`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete user");
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<User> }) => {
      const response = await axiosInstance.post(
        `/api/users/${id}/update`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsEditModalOpen(false);
      toast.success("User updated successfully");
    },
    onError: () => {
      toast.error("Failed to update user");
    },
  });

  return (
    <Container>
      <Header>
        <Title>User Management</Title>
      </Header>

      <TableContainer>
        <Table>
          <thead>
            <tr>
              <Th>Username</Th>
              <Th>Email</Th>
              <Th>Status</Th>
              <Th>Created At</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user: User) => (
              <TableRow key={user.id}>
                <Td>{user.username}</Td>
                <Td>{user.email}</Td>
                <Td>
                  <StatusBadge
                    verified={user.isVerified}
                    onClick={() =>
                      updateStatusMutation.mutate({
                        id: user.id,
                        status: !user.isVerified,
                      })
                    }
                  >
                    {user.isVerified ? "Verified" : "Unverified"}
                  </StatusBadge>
                </Td>
                <Td>{new Date(user.createdAt).toLocaleDateString()}</Td>
                <Td>
                  <ActionButtons>
                    <ActionButton
                      onClick={() => {
                        setSelectedUser(user);
                        setIsEditModalOpen(true);
                      }}
                    >
                      <i className="fas fa-edit" />
                    </ActionButton>
                    <ActionButton
                      danger
                      onClick={() => {
                        if (
                          window.confirm(
                            "Are you sure you want to delete this user?"
                          )
                        ) {
                          deleteUserMutation.mutate(user.id);
                        }
                      }}
                    >
                      <i className="fas fa-trash" />
                    </ActionButton>
                  </ActionButtons>
                </Td>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </TableContainer>

      {isEditModalOpen && selectedUser && (
        <EditModal
          user={selectedUser}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={(data) =>
            updateUserMutation.mutate({ id: selectedUser.id, data })
          }
        />
      )}
    </Container>
  );
};

// Styled components...
const Container = styled.div`
  padding: 2rem;
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #2d3748;
`;

const TableContainer = styled.div`
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 1rem;
  background: #f7fafc;
  color: #4a5568;
  font-weight: 600;
`;

const Td = styled.td`
  padding: 1rem;
  border-top: 1px solid #e2e8f0;
`;

const TableRow = styled.tr`
  &:hover {
    background: #f7fafc;
  }
`;

const StatusBadge = styled.span<{ verified: boolean }>`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  cursor: pointer;
  background: ${({ verified }) => (verified ? "#C6F6D5" : "#FED7D7")};
  color: ${({ verified }) => (verified ? "#2F855A" : "#C53030")};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button<{ danger?: boolean }>`
  padding: 0.5rem;
  border: none;
  border-radius: 5px;
  background: ${({ danger }) => (danger ? "#FED7D7" : "#EBF4FF")};
  color: ${({ danger }) => (danger ? "#C53030" : "#2B6CB0")};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${({ danger }) => (danger ? "#FEB2B2" : "#BEE3F8")};
  }
`;

export default UserManagement;
