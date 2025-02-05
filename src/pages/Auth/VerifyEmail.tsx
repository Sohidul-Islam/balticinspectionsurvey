import React from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../../services/axios";
import { toast } from "react-hot-toast";
import { VerifyEmailData } from "../../types/auth";
import { FaEnvelopeOpen } from "react-icons/fa";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const verifyMutation = useMutation({
    mutationFn: async (data: VerifyEmailData) => {
      const response = await axiosInstance.post("/api/auth/verify-email", data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Email verified successfully!");
      navigate("/login");
    },
    onError: () => {
      toast.error("Email verification failed. Please try again.");
    },
  });

  React.useEffect(() => {
    if (token) {
      verifyMutation.mutate({ token });
    }
  }, [token]);

  const handleResendVerification = async () => {
    try {
      await axiosInstance.post("/api/auth/resend-verification");
      toast.success("Verification email has been resent!");
    } catch (error) {
      toast.error("Failed to resend verification email. Please try again.");
    }
  };

  return (
    <Container>
      <VerifyCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <LogoSection>
          <Logo>
            <FaEnvelopeOpen />
          </Logo>
          <Title>Email Verification</Title>
          {!token ? (
            <Subtitle>Please verify your email address to continue</Subtitle>
          ) : (
            <Subtitle>Verifying your email address...</Subtitle>
          )}
        </LogoSection>

        <ContentSection>
          {!token ? (
            <>
              <Message>
                We've sent a verification link to your email address. Please
                check your inbox and click the link to verify your account.
              </Message>
              <InfoText>
                Didn't receive the email? Check your spam folder or try
                resending the verification email.
              </InfoText>
              <ActionButton
                onClick={handleResendVerification}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Resend Verification Email
              </ActionButton>
            </>
          ) : (
            <>
              {verifyMutation.isPending ? (
                <LoadingWrapper>
                  <LoadingSpinner />
                  <LoadingText>Verifying your email...</LoadingText>
                </LoadingWrapper>
              ) : null}
            </>
          )}
          <BackToLogin>
            <Link to="/login">Back to Login</Link>
          </BackToLogin>
        </ContentSection>
      </VerifyCard>
    </Container>
  );
};

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a2b6d 0%, #2a4fa8 100%);
  padding: 2rem;
`;

const VerifyCard = styled(motion.div)`
  background: white;
  border-radius: 20px;
  padding: 2.5rem;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
`;

const LogoSection = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Logo = styled.div`
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, #1a2b6d 0%, #2a4fa8 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  color: white;
  font-size: 1.8rem;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  color: #2d3748;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: #718096;
  font-size: 0.95rem;
`;

const ContentSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Message = styled.p`
  color: #4a5568;
  font-size: 1rem;
  line-height: 1.6;
  text-align: center;
`;

const InfoText = styled.p`
  color: #718096;
  font-size: 0.9rem;
  text-align: center;
`;

const ActionButton = styled(motion.button)`
  background: linear-gradient(135deg, #1a2b6d 0%, #2a4fa8 100%);
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 10px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    opacity: 0.9;
  }
`;

const LoadingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid rgba(102, 126, 234, 0.1);
  border-radius: 50%;
  border-top-color: #667eea;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.p`
  color: #4a5568;
  font-size: 1rem;
`;

const BackToLogin = styled.div`
  text-align: center;
  margin-top: 1rem;

  a {
    color: #667eea;
    text-decoration: none;
    font-size: 0.95rem;
    font-weight: 500;
    transition: color 0.3s ease;

    &:hover {
      color: #764ba2;
    }
  }
`;

export default VerifyEmail;
