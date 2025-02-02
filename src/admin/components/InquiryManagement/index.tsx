import styled from "styled-components";
import moment from "moment";

import {
  useInquiries,
  useUpdateInquiryStatus,
} from "../../../hooks/useInquiry";

const InquiryManagement = () => {
  const { data: inquiries, isLoading, refetch } = useInquiries();
  const { mutate: updateStatus } = useUpdateInquiryStatus();

  console.log({ inquiries });

  const handleStatusUpdate = (id: string, status: string) => {
    updateStatus({ id, status });
  };

  return (
    <Container>
      <Header>
        <Title>Inquiry Management</Title>
        <RefreshButton onClick={() => refetch()}>
          <i className="fas fa-sync-alt" /> Refresh
        </RefreshButton>
      </Header>

      {isLoading ? (
        <LoadingWrapper>
          <LoadingSpinner />
        </LoadingWrapper>
      ) : (
        <TableContainer>
          <Table>
            <thead>
              <tr>
                <Th>Date</Th>
                <Th>Type</Th>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Company</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(inquiries) &&
                inquiries?.map((inquiry) => (
                  <TableRow key={inquiry.id}>
                    <Td>{moment(inquiry.createdAt).format("MMM DD, YYYY")}</Td>
                    <Td>{inquiry.inquiryType}</Td>
                    <Td>{`${inquiry.firstName} ${inquiry.lastName}`}</Td>
                    <Td>{inquiry.email}</Td>
                    <Td>{inquiry.companyName || "-"}</Td>
                    <Td>
                      <StatusBadge status={inquiry.status || "pending"}>
                        {inquiry.status || "pending"}
                      </StatusBadge>
                    </Td>
                    <Td>
                      <ActionButtons>
                        <StatusSelect
                          value={inquiry.status || "pending"}
                          onChange={(e) =>
                            handleStatusUpdate(inquiry.id, e.target.value)
                          }
                        >
                          <option value="pending">Pending</option>
                          <option value="processed">Processed</option>
                          <option value="completed">Completed</option>
                        </StatusSelect>
                      </ActionButtons>
                    </Td>
                  </TableRow>
                ))}
            </tbody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

const Container = styled.div`
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  color: #1a1a1a;
`;

const RefreshButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #e9ecef;
  }
`;

const TableContainer = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  padding: 1rem;
  text-align: left;
  background: #f8f9fa;
  border-bottom: 2px solid #dee2e6;
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
`;

const TableRow = styled.tr`
  &:hover {
    background: #f8f9fa;
  }
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.875rem;
  font-weight: 500;

  ${({ status }) => {
    switch (status) {
      case "pending":
        return "background: #fff3cd; color: #856404;";
      case "processed":
        return "background: #cce5ff; color: #004085;";
      case "completed":
        return "background: #d4edda; color: #155724;";
      default:
        return "background: #f8f9fa; color: #1a1a1a;";
    }
  }}
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const StatusSelect = styled.select`
  padding: 0.25rem 0.5rem;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  background: white;
`;

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 2rem;
`;

const LoadingSpinner = styled.div`
  border: 3px solid #f3f3f3;
  border-top: 3px solid #3498db;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export default InquiryManagement;
