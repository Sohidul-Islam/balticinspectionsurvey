import React, { useState } from "react";
import styled from "styled-components";
import moment from "moment";

import {
  useInquiries,
  useUpdateInquiryStatus,
  useDeleteInquiry
} from "../../../hooks/useInquiry";
import { FaFile, FaSearch, FaSyncAlt, FaTimes, FaTrash } from "react-icons/fa";

const DeleteButton = styled.button`
  background: #f1f5f9;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
`;

const DeleteIcon = styled(FaTrash)`
  color: #3b82f6;
`;

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
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });

  const { data: inquiries, isLoading, refetch } = useInquiries();
  const { mutate: updateStatus } = useUpdateInquiryStatus();
  const { mutate: deleteInquiry } = useDeleteInquiry();

  // Filter and search logic
  const filteredInquiries = React.useMemo(() => {
    if (!Array.isArray(inquiries)) return [];

    return inquiries.filter((inquiry) => {
      const matchesSearch =
        searchTerm === "" ||
        `${inquiry.firstName} ${inquiry.lastName}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        inquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inquiry.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inquiry.inquiryType.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || inquiry.status === statusFilter;

      const inquiryDate = moment(inquiry.createdAt);
      const matchesDateRange =
        (!dateRange.startDate ||
          inquiryDate.isSameOrAfter(moment(dateRange.startDate))) &&
        (!dateRange.endDate ||
          inquiryDate.isSameOrBefore(moment(dateRange.endDate)));

      return matchesSearch && matchesStatus && matchesDateRange;
    });
  }, [inquiries, searchTerm, statusFilter, dateRange]);

  const handleStatusUpdate = (id: string, status: string) => {
    updateStatus({ id, status });
  };

  const handleDelete = (id: string) => {
    deleteInquiry(id);
  };



  return (
    <Container>
      <Header>
        <Title>Inquiry Management</Title>
        <RefreshButton onClick={() => refetch()}>
          <FaSyncAlt /> Refresh
        </RefreshButton>
      </Header>

      <FilterSection>
        <FilterContainer className="flex flex-wrap gap-2">
          <FilterGroup className="flex-1">
            <SearchContainer className="w-full flex items-center gap-2">
              <SearchIcon />
              <SearchInput
                type="text"
                placeholder="Search by name, email, company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </SearchContainer>
          </FilterGroup>
          <FilterGroup>
            <FilterLabel>Status</FilterLabel>

            <FilterSelect
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processed">Processed</option>
              <option value="completed">Completed</option>
            </FilterSelect>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Date Range</FilterLabel>
            <DateInputGroup>
              <DateInput
                type="date"
                value={dateRange.startDate}
                onChange={(e) =>
                  setDateRange({ ...dateRange, startDate: e.target.value })
                }
              />
              <DateSeparator>to</DateSeparator>
              <DateInput
                type="date"
                value={dateRange.endDate}
                onChange={(e) =>
                  setDateRange({ ...dateRange, endDate: e.target.value })
                }
              />
            </DateInputGroup>
          </FilterGroup>

          <ClearFiltersButton
            onClick={() => {
              setSearchTerm("");
              setStatusFilter("all");
              setDateRange({ startDate: "", endDate: "" });
            }}
          >
            <i className="fas fa-times" /> Clear Filters
          </ClearFiltersButton>
        </FilterContainer>
      </FilterSection>

      {isLoading ? (
        <LoadingWrapper>
          <LoadingSpinner />
        </LoadingWrapper>
      ) : (
        <>
          <ResultCount>
            Showing {filteredInquiries.length} of {inquiries?.length || 0} inquiries
          </ResultCount>
          
          <TableWrapper>
            <ResponsiveTableContainer>
              <Table>
                <thead>
                  <tr>
                    <Th width="100px">Date</Th>
                    <Th width="120px">Type</Th>
                    <Th width="150px">Name</Th>
                    <Th hideOnMobile width="200px">Email</Th>
                    <Th hideOnMobile width="150px">Company</Th>
                    <Th width="100px">Status</Th>
                    <ActionColumnHeader>Actions</ActionColumnHeader>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(filteredInquiries) &&
                    filteredInquiries?.map((inquiry) => (
                      <TableRow
                        key={inquiry.id}
                        onClick={() => setSelectedInquiry(inquiry)}
                      >
                        <Td width="100px">{moment(inquiry.createdAt).format("MMM DD, YYYY")}</Td>
                        <Td width="120px">{inquiry.inquiryType}</Td>
                        <Td width="150px">{`${inquiry.firstName} ${inquiry.lastName}`}</Td>
                        <Td hideOnMobile width="200px">{inquiry.email}</Td>
                        <Td hideOnMobile width="150px">{inquiry.companyName || "-"}</Td>
                        <Td width="100px">
                          <StatusBadge status={inquiry.status || "pending"}>
                            {inquiry.status || "pending"}
                          </StatusBadge>
                        </Td>
                        <ActionColumn onClick={(e) => e.stopPropagation()}>
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
                            <DeleteButton className="flex items-center justify-center" onClick={() => handleDelete(inquiry.id)}>
                              <DeleteIcon />
                            </DeleteButton>
                          </ActionButtons>
                        </ActionColumn>
                      </TableRow>
                    ))}
                </tbody>
              </Table>
            </ResponsiveTableContainer>
          </TableWrapper>
        </>
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
  padding: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  max-width: 100vw;
  overflow-x: hidden;
  
  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: white;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    padding: 0;
    background: transparent;
  }
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
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
  table-layout: fixed;

  @media (min-width: 768px) {
    font-size: 1rem;
  }
`;

const Th = styled.th<{ hideOnMobile?: boolean; width?: string }>`
  padding: 0.75rem;
  text-align: left;
  background: #f8f9fa;
  border-bottom: 2px solid #dee2e6;
  white-space: nowrap;
  width: ${props => props.width || 'auto'};
  min-width: ${props => props.width || 'auto'};

  @media (min-width: 768px) {
    padding: 1rem;
  }

  @media (max-width: 767px) {
    ${(props) =>
      props.hideOnMobile &&
      `
      display: none;
    `}
  }
`;

const Td = styled.td<{ hideOnMobile?: boolean; width?: string }>`
  padding: 0.75rem;
  border-bottom: 1px solid #dee2e6;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: ${props => props.width || 'auto'};
  min-width: ${props => props.width || 'auto'};

  @media (min-width: 768px) {
    padding: 1rem;
  }

  @media (max-width: 767px) {
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
  flex-wrap: wrap;
`;

const StatusSelect = styled.select`
  padding: 0.25rem 0.5rem;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  background: white;
  font-size: 0.875rem;
  max-width: 120px;
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
  margin: 0;
  border-radius: 0;
  width: 100%;
  max-width: 100%;
  overflow: auto;
  table {
    width: 100%;
  }
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  background: white;
  position: relative;
  margin: 0;
  padding: 0;

  @media (min-width: 768px) {
    border-radius: 8px;
  }

  @media (max-width: 768px) {
    max-width: 700px;
  }
  
  @media (max-width: 480px) {
    max-width: 450px;
  }

  @media (max-width: 400px) {
    max-width: 350px;
  }
`;


const ResultCount = styled.div`
  margin: 0.5rem 1rem;
  font-size: 0.875rem;
  color: #64748b;

  @media (min-width: 768px) {
    margin: 0 0 1rem 0;
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
  width: 95%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
  margin: 1rem;
  position: relative;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);

  @media (min-width: 768px) {
    width: 90%;
    margin: 0;
  }
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
  flex-direction: column;
  gap: 0.75rem;

  @media (min-width: 768px) {
    flex-direction: row;
    gap: 1rem;
    flex-wrap: wrap;
  }
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
  grid-template-columns: 1fr;
  gap: 1rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
  }
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


const FilterSection = styled.div`
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0 1rem;

  @media (min-width: 768px) {
    margin-bottom: 2rem;
    padding: 0;
  }
`;

const SearchContainer = styled.div`
  position: relative;
`;

const SearchIcon = styled(FaSearch)`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 2.5rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  background: white;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const FilterContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (min-width: 768px) {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: flex-end;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;

  @media (min-width: 768px) {
    min-width: 200px;
    width: auto;
  }
`;

const FilterLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #64748b;
`;

const FilterSelect = styled.select`
  padding: 0.875rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const DateInputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
  }
`;

const DateInput = styled.input`
  padding: 0.875rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  background: white;
  transition: all 0.3s ease;
  width: 100%;

  @media (min-width: 768px) {
    min-width: 150px;
    width: auto;
  }

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const DateSeparator = styled.span`
  color: #64748b;
  font-size: 0.875rem;
`;

const ClearFiltersButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  background: #f1f5f9;
  border: none;
  border-radius: 12px;
  color: #64748b;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #e2e8f0;
    color: #1e293b;
  }
`;

const ActionColumn = styled(Td)`
  width: 200px;
  min-width: 200px;
  white-space: nowrap;
  // position: sticky;
  right: 0;
  background: white;
  z-index: 1;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);



  &:hover {
    background: #f8f9fa;
  }

`;

const ActionColumnHeader = styled(Th)`
  width: 200px;
  min-width: 200px;
  white-space: nowrap;
  // position: sticky;
  right: 0;
  background: #f8f9fa;
  z-index: 2;
  // box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);





`;




export default InquiryManagement;
