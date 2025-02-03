/* eslint-disable no-unsafe-optional-chaining */
import React, { useState } from "react";
import styled from "styled-components";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  RiAddLine,
  RiDeleteBinLine,
  RiEditLine,
  RiPhoneLine,
  RiSaveLine,
  RiToggleLine,
} from "react-icons/ri";
import axiosInstance from "../../../services/axios";

interface FooterData {
  id?: number;
  emails: string[];
  phones: string[];
  addresses: string[];
  isActive: boolean;
}

type FieldType = "emails" | "phones" | "addresses";

const FooterManagement = () => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<FooterData>({
    emails: [""],
    phones: [""],
    addresses: [""],
    isActive: true,
  });

  const { data: footerData, isLoading } = useQuery<FooterData>({
    queryKey: ["footer-data"],
    queryFn: async () => {
      const response = await axiosInstance.get("/api/footer");
      const { emails, phones, addresses, isActive, id } = response?.data?.data;
      return {
        id,
        emails: emails || [],
        phones: phones || [],
        addresses: addresses || [],
        isActive: isActive || false,
      };
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: FooterData) => {
      const response = await axiosInstance.post(
        data?.id ? `/api/footer/${data?.id}` : "/api/footer",
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["footer-data"] });
      setIsEditing(false);
      toast.success("Footer information updated successfully!");
    },
    onError: () => {
      toast.error("Failed to update footer information");
    },
  });

  React.useEffect(() => {
    if (footerData) {
      setFormData(footerData);
    }
  }, [footerData]);

  console.log({ formData });

  const handleAddField = (field: FieldType) => {
    setFormData((prev) => ({
      ...prev,
      [field]: Array.isArray(prev[field]) ? [...prev[field], ""] : [""],
    }));
  };

  const handleRemoveField = (field: FieldType, index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: Array.isArray(prev[field])
        ? prev[field].filter((_: string, i: number) => i !== index)
        : [],
    }));
  };

  const handleFieldChange = (
    field: FieldType,
    index: number,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]:
        prev[field]?.map?.((item: string, i: number) =>
          i === index ? value : item
        ) ?? [],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // console.log({ formData });
    updateMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <LoadingWrapper>
        <LoadingSpinner />
      </LoadingWrapper>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Footer Management</Title>
        {!isEditing && (
          <EditButton onClick={() => setIsEditing(true)}>
            <RiEditLine /> Edit Footer
          </EditButton>
        )}
      </Header>

      {isEditing ? (
        <Form onSubmit={handleSubmit}>
          <Section>
            <SectionHeader>
              <h3>Email Addresses</h3>
              <AddButton type="button" onClick={() => handleAddField("emails")}>
                <RiAddLine /> Add Email
              </AddButton>
            </SectionHeader>
            {formData.emails?.map((email, index) => (
              <FieldGroup key={`email-${index}`}>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    handleFieldChange("emails", index, e.target.value)
                  }
                  placeholder="Enter email address"
                />
                {formData.emails.length > 1 && (
                  <RemoveButton
                    type="button"
                    onClick={() => handleRemoveField("emails", index)}
                  >
                    <RiDeleteBinLine />
                  </RemoveButton>
                )}
              </FieldGroup>
            ))}
          </Section>

          <Section>
            <SectionHeader>
              <h3>Phone Numbers</h3>
              <AddButton type="button" onClick={() => handleAddField("phones")}>
                <RiAddLine /> Add Phone
              </AddButton>
            </SectionHeader>
            {formData?.phones?.map((phone, index) => (
              <FieldGroup key={`phone-${index}`}>
                <Input
                  value={phone}
                  onChange={(e) =>
                    handleFieldChange("phones", index, e.target.value)
                  }
                  placeholder="Enter phone number"
                />
                {formData?.phones?.length > 1 && (
                  <RemoveButton
                    type="button"
                    onClick={() => handleRemoveField("phones", index)}
                  >
                    <RiDeleteBinLine />
                  </RemoveButton>
                )}
              </FieldGroup>
            ))}
          </Section>

          <Section>
            <SectionHeader>
              <h3>Addresses</h3>
              <AddButton
                type="button"
                onClick={() => handleAddField("addresses")}
              >
                <RiAddLine /> Add Address
              </AddButton>
            </SectionHeader>
            {formData?.addresses?.map((address, index) => (
              <FieldGroup key={`address-${index}`}>
                <Input
                  value={address}
                  onChange={(e) =>
                    handleFieldChange("addresses", index, e.target.value)
                  }
                  placeholder="Enter address"
                />
                {formData?.addresses?.length > 1 && (
                  <RemoveButton
                    type="button"
                    onClick={() => handleRemoveField("addresses", index)}
                  >
                    <RiDeleteBinLine />
                  </RemoveButton>
                )}
              </FieldGroup>
            ))}
          </Section>

          {/* <Section>
            <SectionHeader>
              <h3>Footer Visibility</h3>
            </SectionHeader>
            <ToggleWrapper>
              <ToggleLabel>
                <Toggle
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      isActive: e.target.checked,
                    }))
                  }
                />
                Show footer on website
              </ToggleLabel>
            </ToggleWrapper>
          </Section> */}

          <ButtonGroup>
            <SaveButton type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? (
                <>
                  <LoadingSpinner small /> Saving...
                </>
              ) : (
                <>
                  <RiSaveLine /> Save Changes
                </>
              )}
            </SaveButton>
            <CancelButton type="button" onClick={() => setIsEditing(false)}>
              Cancel
            </CancelButton>
          </ButtonGroup>
        </Form>
      ) : (
        <PreviewSection>
          <InfoCard>
            <CardHeader>
              <i className="fas fa-envelope" /> Email Addresses
            </CardHeader>
            <CardContent>
              {formData.emails?.map((email, index) => (
                <InfoItem key={`email-${index}`}>{email}</InfoItem>
              ))}
            </CardContent>
          </InfoCard>

          <InfoCard>
            <CardHeader>
              <RiPhoneLine /> Phone Numbers
            </CardHeader>
            <CardContent>
              {formData.phones?.map((phone, index) => (
                <InfoItem key={`phone-${index}`}>{phone}</InfoItem>
              ))}
            </CardContent>
          </InfoCard>

          <InfoCard>
            <CardHeader>
              <i className="fas fa-map-marker-alt" /> Addresses
            </CardHeader>
            <CardContent>
              {formData.addresses?.map((address, index) => (
                <InfoItem key={`address-${index}`}>{address}</InfoItem>
              ))}
            </CardContent>
          </InfoCard>

          {/* <InfoCard>
            <CardHeader>
              <RiToggleLine /> Status
            </CardHeader>
            <CardContent>
              <StatusBadge active={formData.isActive}>
                {formData.isActive ? "Active" : "Inactive"}
              </StatusBadge>
            </CardContent>
          </InfoCard> */}
        </PreviewSection>
      )}
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  font-size: 1.8rem;
  color: #1a1a1a;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Section = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  h3 {
    color: #1a1a1a;
    margin-bottom: 1rem;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const FieldGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Input = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
`;

const EditButton = styled(Button)`
  background: #3b82f6;
  color: white;
  border: none;

  &:hover {
    background: #2563eb;
  }
`;

const SaveButton = styled(Button)`
  background: #10b981;
  color: white;
  border: none;

  &:hover {
    background: #059669;
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`;

const CancelButton = styled(Button)`
  background: #f3f4f6;
  color: #4b5563;
  border: 1px solid #e5e7eb;

  &:hover {
    background: #e5e7eb;
  }
`;

const AddButton = styled(Button)`
  background: #f3f4f6;
  color: #4b5563;
  border: 1px solid #e5e7eb;
  padding: 0.5rem 1rem;

  &:hover {
    background: #e5e7eb;
  }
`;

const RemoveButton = styled.button`
  background: #fee2e2;
  color: #dc2626;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #fecaca;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`;

const PreviewSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const InfoCard = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const CardHeader = styled.div`
  background: #f8fafc;
  padding: 1rem 1.5rem;
  font-weight: 600;
  color: #1e293b;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  i {
    color: #3b82f6;
  }
`;

const CardContent = styled.div`
  padding: 1.5rem;
`;

const InfoItem = styled.div`
  padding: 0.5rem 0;
  color: #4b5563;
  border-bottom: 1px solid #f1f5f9;

  &:last-child {
    border-bottom: none;
  }
`;

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 2rem;
`;

const LoadingSpinner = styled.div<{ small?: boolean }>`
  border: 2px solid #f3f3f3;
  border-top: 2px solid #3b82f6;
  border-radius: 50%;
  width: ${(props) => (props.small ? "16px" : "24px")};
  height: ${(props) => (props.small ? "16px" : "24px")};
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

const ToggleWrapper = styled.div`
  padding: 0.5rem 0;
`;

const ToggleLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  color: #4b5563;
`;

const Toggle = styled.input`
  appearance: none;
  width: 50px;
  height: 28px;
  background: #e5e7eb;
  border-radius: 999px;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;

  &:checked {
    background: #10b981;
  }

  &:before {
    content: "";
    position: absolute;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    top: 2px;
    left: 2px;
    background: white;
    transition: all 0.3s ease;
  }

  &:checked:before {
    transform: translateX(22px);
  }
`;

const StatusBadge = styled.span<{ active: boolean }>`
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border-radius: 999px;
  font-size: 0.875rem;
  font-weight: 500;
  ${({ active }) =>
    active
      ? `
    background: #d1fae5;
    color: #059669;
  `
      : `
    background: #fee2e2;
    color: #dc2626;
  `}
`;

export default FooterManagement;
