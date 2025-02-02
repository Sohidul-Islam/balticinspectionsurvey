import React, { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useSubmitInquiry } from "../../hooks/useInquiry";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    inquiryType: "",
    firstName: "",
    lastName: "",
    email: "",
    companyName: "",
    jobTitle: "",
    phone: "",
    message: "",
    agreeToTerms: false,
  });

  const { mutate: submitInquiry, isPending } = useSubmitInquiry();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    submitInquiry(formData, {
      onSuccess: () => {
        // Reset form
        setFormData({
          inquiryType: "",
          firstName: "",
          lastName: "",
          email: "",
          companyName: "",
          jobTitle: "",
          phone: "",
          message: "",
          agreeToTerms: false,
        });
      },
    });
  };

  return (
    <Container>
      <BackgroundShape />
      <BackgroundShapeTwo />

      <ContentWrapper>
        <HeroSection
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <HeroTitle>Let's Start a Conversation</HeroTitle>
          <HeroSubtitle>
            Get in touch with our team and let us know how we can help
          </HeroSubtitle>
        </HeroSection>

        <CardGrid>
          <ContactCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <CardIcon className="fas fa-map-marker-alt" />
            <CardTitle>Visit Us</CardTitle>
            <CardText>123 Business Avenue, Suite 100, City, Country</CardText>
          </ContactCard>

          <ContactCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <CardIcon className="fas fa-phone-alt" />
            <CardTitle>Call Us</CardTitle>
            <CardText>+1 (555) 123-4567</CardText>
          </ContactCard>

          <ContactCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <CardIcon className="fas fa-envelope" />
            <CardTitle>Email Us</CardTitle>
            <CardText>contact@yourcompany.com</CardText>
          </ContactCard>
        </CardGrid>

        <FormSection
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <FormContainer onSubmit={handleSubmit}>
            <FormGrid>
              <FormGroup>
                <Label>Inquiry Type</Label>
                <Select
                  value={formData.inquiryType}
                  onChange={(e) =>
                    setFormData({ ...formData, inquiryType: e.target.value })
                  }
                >
                  <option value="Request Information">
                    Request Information
                  </option>
                  <option value="Request Quotation">Request Quotation</option>
                  <option value="Recruitment  Jobs">
                    Recruitment &amp; Jobs
                  </option>
                  <option value="Verify Baltic Documents">
                    Verify Baltic Documents
                  </option>
                  <option value="Provide Your Feedback">
                    Provide Your Feedback
                  </option>
                  <option value="Personal Data &amp; Privacy">
                    Personal Data &amp; Privacy
                  </option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>First Name</Label>
                <Input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  required
                  placeholder="John"
                />
              </FormGroup>

              <FormGroup>
                <Label>Last Name</Label>
                <Input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  required
                  placeholder="Doe"
                />
              </FormGroup>

              <FormGroup>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  placeholder="john@example.com"
                />
              </FormGroup>

              <FormGroup>
                <Label>
                  Company Name <Optional>(Optional)</Optional>
                </Label>
                <Input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) =>
                    setFormData({ ...formData, companyName: e.target.value })
                  }
                  placeholder="Your company"
                />
              </FormGroup>

              <FormGroup>
                <Label>
                  Job Title <Optional>(Optional)</Optional>
                </Label>
                <Input
                  type="text"
                  value={formData.jobTitle}
                  onChange={(e) =>
                    setFormData({ ...formData, jobTitle: e.target.value })
                  }
                  placeholder="Your position"
                />
              </FormGroup>

              <FormGroup className="full-width">
                <Label>Message</Label>
                <TextArea
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  required
                  rows={5}
                  placeholder="How can we help you?"
                />
              </FormGroup>

              <FormGroup className="full-width">
                <CheckboxWrapper>
                  <Checkbox
                    type="checkbox"
                    checked={formData.agreeToTerms}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        agreeToTerms: e.target.checked,
                      })
                    }
                    required
                  />
                  <CheckboxLabel>
                    I agree to the{" "}
                    <PrivacyLink href="/privacy">Privacy Policy</PrivacyLink>
                  </CheckboxLabel>
                </CheckboxWrapper>
              </FormGroup>
            </FormGrid>

            <SubmitButton type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <LoadingSpinner /> Sending...
                </>
              ) : (
                <>
                  Send Message
                  <ButtonIcon className="fas fa-paper-plane" />
                </>
              )}
            </SubmitButton>
          </FormContainer>
        </FormSection>
      </ContentWrapper>
    </Container>
  );
};

const Container = styled.div`
  min-height: 100vh;
  background: #f8fafc;
  padding: 6rem 2rem;
  position: relative;
  overflow: hidden;
`;

const BackgroundShape = styled.div`
  position: absolute;
  top: -200px;
  right: -200px;
  width: 600px;
  height: 600px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border-radius: 50%;
  opacity: 0.1;
  z-index: 1;
`;

const BackgroundShapeTwo = styled.div`
  position: absolute;
  bottom: -200px;
  left: -200px;
  width: 500px;
  height: 500px;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  border-radius: 50%;
  opacity: 0.1;
  z-index: 1;
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
`;

const HeroSection = styled(motion.div)`
  text-align: center;
  margin-bottom: 4rem;
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  color: #64748b;
  max-width: 600px;
  margin: 0 auto;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-bottom: 4rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ContactCard = styled(motion.div)`
  background: white;
  padding: 2rem;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const CardIcon = styled.i`
  font-size: 2rem;
  color: #2563eb;
  margin-bottom: 1rem;
`;

const CardTitle = styled.h3`
  font-size: 1.25rem;
  color: #1e293b;
  margin-bottom: 0.5rem;
`;

const CardText = styled.p`
  color: #64748b;
  font-size: 1rem;
`;

const FormSection = styled(motion.div)`
  background: white;
  padding: 3rem;
  border-radius: 30px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05);
`;

const FormContainer = styled.form`
  max-width: 800px;
  margin: 0 auto;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }

  .full-width {
    grid-column: 1 / -1;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 600;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Optional = styled.span`
  color: #94a3b8;
  font-weight: normal;
`;

const Input = styled.input`
  padding: 0.875rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #f8fafc;

  &:focus {
    outline: none;
    border-color: #2563eb;
    background: white;
    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

const Select = styled.select`
  padding: 0.875rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  background: #f8fafc;
  cursor: pointer;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #2563eb;
    background: white;
    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
  }
`;

const TextArea = styled.textarea`
  padding: 0.875rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  resize: vertical;
  min-height: 120px;
  background: #f8fafc;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #2563eb;
    background: white;
    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const Checkbox = styled.input`
  width: 20px;
  height: 20px;
  border-radius: 6px;
  cursor: pointer;
`;

const CheckboxLabel = styled.label`
  font-size: 0.95rem;
  color: #475569;
`;

const PrivacyLink = styled.a`
  color: #2563eb;
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  transition: all 0.3s ease;
  width: 100%;
  max-width: 300px;
  margin: 0 auto;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(37, 99, 235, 0.2);
  }
`;

const ButtonIcon = styled.i`
  font-size: 1.1rem;
  transition: transform 0.3s ease;

  ${SubmitButton}:hover & {
    transform: translateX(4px);
  }
`;

const LoadingSpinner = styled.div`
  border: 2px solid #f3f3f3;
  border-top: 2px solid #ffffff;
  border-radius: 50%;
  width: 16px;
  height: 16px;
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

export default ContactPage;
