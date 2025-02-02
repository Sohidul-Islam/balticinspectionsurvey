import React, { useState } from "react";
import styled from "styled-components";
import moment from "moment";

import {
  useInquiries,
  useUpdateInquiryStatus,
} from "../../../hooks/useInquiry";
import { FaFile, FaTimes } from "react-icons/fa";

interface DetailModalProps {
  inquiry: any;
  onClose: () => void;
}

const DetailModal: React.FC<DetailModalProps> = ({ inquiry, onClose }) => (
  <ModalOverlay onClick={onClose}>
    <ModalContent onClick={(e) => e.stopPropagation()}>
      <ModalHeader>
        <ModalTitle>
          <FaFile />
          Inquiry Details
        </ModalTitle>
        <CloseButton onClick={onClose}>
          <FaTimes />
        </CloseButton>
      </ModalHeader>

      <ModalBody>
        <TopSection>
          <StatusContainer>
            <LargeStatusBadge status={inquiry.status || "pending"}>
              <i className="fas fa-clock" style={{ marginRight: "8px" }} />
              {inquiry.status || "pending"}
            </LargeStatusBadge>
            <DateBadge>
              <i
                className="far fa-calendar-alt"
                style={{ marginRight: "8px" }}
              />
              {moment(inquiry.createdAt).format("MMMM DD, YYYY")}
            </DateBadge>
            <TimeBadge>
              <i className="far fa-clock" style={{ marginRight: "8px" }} />
              {moment(inquiry.createdAt).format("h:mm A")}
            </TimeBadge>
          </StatusContainer>
        </TopSection>

        <DetailSection>
          <DetailHeader>
            <HeaderIcon className="fas fa-user-circle" />
            Contact Information
          </DetailHeader>
          <DetailCard>
            <DetailGrid>
              <DetailItem>
                <DetailLabel>
                  <i className="fas fa-user" /> Full Name
                </DetailLabel>
                <DetailValue>{`${inquiry.firstName} ${inquiry.lastName}`}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>
                  <i className="fas fa-envelope" /> Email
                </DetailLabel>
                <DetailValue>{inquiry.email}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>
                  <i className="fas fa-phone" /> Phone
                </DetailLabel>
                <DetailValue>{inquiry.phone || "Not provided"}</DetailValue>
              </DetailItem>
            </DetailGrid>
          </DetailCard>
        </DetailSection>

        <DetailSection>
          <DetailHeader>
            <HeaderIcon className="fas fa-building" />
            Company Details
          </DetailHeader>
          <DetailCard>
            <DetailGrid>
              <DetailItem>
                <DetailLabel>
                  <i className="fas fa-briefcase" /> Inquiry Type
                </DetailLabel>
                <DetailValue>{inquiry.inquiryType}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>
                  <i className="fas fa-building" /> Company Name
                </DetailLabel>
                <DetailValue>
                  {inquiry.companyName || "Not provided"}
                </DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>
                  <i className="fas fa-id-badge" /> Job Title
                </DetailLabel>
                <DetailValue>{inquiry.jobTitle || "Not provided"}</DetailValue>
              </DetailItem>
            </DetailGrid>
          </DetailCard>
        </DetailSection>

        <DetailSection>
          <DetailHeader>
            <HeaderIcon className="fas fa-comment-alt" />
            Message
          </DetailHeader>
          <MessageCard>
            <MessageContent>{inquiry.message}</MessageContent>
          </MessageCard>
        </DetailSection>
      </ModalBody>
    </ModalContent>
  </ModalOverlay>
);

const InquiryManagement = () => {
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null);
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
        <ResponsiveTableContainer>
          <Table>
            <thead>
              <tr>
                <Th>Date</Th>
                <Th>Type</Th>
                <Th>Name</Th>
                <Th hideOnMobile>Email</Th>
                <Th hideOnMobile>Company</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(inquiries) &&
                inquiries?.map((inquiry) => (
                  <TableRow
                    key={inquiry.id}
                    onClick={() => setSelectedInquiry(inquiry)}
                  >
                    <Td>{moment(inquiry.createdAt).format("MMM DD, YYYY")}</Td>
                    <Td>{inquiry.inquiryType}</Td>
                    <Td>{`${inquiry.firstName} ${inquiry.lastName}`}</Td>
                    <Td hideOnMobile>{inquiry.email}</Td>
                    <Td hideOnMobile>{inquiry.companyName || "-"}</Td>
                    <Td>
                      <StatusBadge status={inquiry.status || "pending"}>
                        {inquiry.status || "pending"}
                      </StatusBadge>
                    </Td>
                    <Td onClick={(e) => e.stopPropagation()}>
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
        </ResponsiveTableContainer>
      )}

      {selectedInquiry && (
        <DetailModal
          inquiry={selectedInquiry}
          onClose={() => setSelectedInquiry(null)}
        />
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

const Th = styled.th<{ hideOnMobile?: boolean }>`
  padding: 1rem;
  text-align: left;
  background: #f8f9fa;
  border-bottom: 2px solid #dee2e6;

  @media (max-width: 768px) {
    ${(props) =>
      props.hideOnMobile &&
      `
      display: none;
    `}
  }
`;

const Td = styled.td<{ hideOnMobile?: boolean }>`
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;

  @media (max-width: 768px) {
    ${(props) =>
      props.hideOnMobile &&
      `
      display: none;
    `}
  }
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

const ResponsiveTableContainer = styled(TableContainer)`
  @media (max-width: 768px) {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #f8fafc;
  border-radius: 16px;
  width: 90%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
`;

const ModalHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  background: white;
  z-index: 1;
  border-radius: 16px 16px 0 0;
`;

const ModalTitle = styled.h3`
  margin: 0;
  font-size: 1.5rem;
  color: #1a1a1a;
  display: flex;
  align-items: center;
  font-weight: 600;
`;

const CloseButton = styled.button`
  background: #f1f5f9;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #64748b;
  transition: all 0.2s ease;

  &:hover {
    background: #e2e8f0;
    color: #1e293b;
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
`;

const TopSection = styled.div`
  margin-bottom: 2rem;
`;

const StatusContainer = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const LargeStatusBadge = styled(StatusBadge)`
  padding: 0.5rem 1rem;
  font-size: 1rem;
  display: flex;
  align-items: center;
`;

const DateBadge = styled.div`
  background: #f1f5f9;
  color: #475569;
  padding: 0.5rem 1rem;
  border-radius: 999px;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
`;

const TimeBadge = styled(DateBadge)`
  background: #f1f5f9;
`;

const DetailSection = styled.div`
  margin-bottom: 2rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const DetailHeader = styled.h4`
  margin: 0 0 1rem 0;
  color: #1e293b;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const HeaderIcon = styled.i`
  color: #3b82f6;
  font-size: 1.25rem;
`;

const DetailCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
`;

const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const DetailLabel = styled.span`
  font-size: 0.9rem;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  i {
    color: #3b82f6;
  }
`;

const DetailValue = styled.span`
  font-size: 1.1rem;
  color: #1e293b;
  font-weight: 500;
`;

const MessageCard = styled(DetailCard)`
  background: #ffffff;
`;

const MessageContent = styled.div`
  color: #334155;
  line-height: 1.7;
  font-size: 1.05rem;
  white-space: pre-wrap;
`;

export default InquiryManagement;
