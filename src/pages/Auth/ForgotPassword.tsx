import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../../services/axios";
import { toast } from "react-hot-toast";
import { ForgotPasswordData } from "../../types/auth";
import { FaLockOpen } from "react-icons/fa";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);

  const forgotPasswordMutation = useMutation({
    mutationFn: async (data: ForgotPasswordData) => {
      const response = await axiosInstance.post(
        "/api/auth/forgot-password",
        data
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Password reset instructions sent to your email!");
      setIsEmailSent(true);
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message ||
          "Failed to send reset instructions. Please try again."
      );
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    forgotPasswordMutation.mutate({ email });
  };

  return (
    <Container>
      <ForgotPasswordCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <LogoSection>
          <Logo>
            <FaLockOpen />
          </Logo>
          <Title>Forgot Password?</Title>
          <Subtitle>
            {isEmailSent
              ? "Check your email for reset instructions"
              : "Enter your email to reset your password"}
          </Subtitle>
        </LogoSection>

        {!isEmailSent ? (
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label>
                <i className="fas fa-envelope" /> Email Address
              </Label>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </FormGroup>

            <SubmitButton
              type="submit"
              disabled={forgotPasswordMutation.isPending}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {forgotPasswordMutation.isPending ? (
                <>
                  <LoadingSpinner /> Sending Instructions...
                </>
              ) : (
                <>
                  Send Reset Instructions <i className="fas fa-arrow-right" />
                </>
              )}
            </SubmitButton>
          </Form>
        ) : (
          <SuccessMessage>
            <i className="fas fa-envelope-open-text" />
            <h3>Check Your Email</h3>
            <p>
              We've sent password reset instructions to {email}. Please check
              your inbox.
            </p>
            <ResendButton
              onClick={() => forgotPasswordMutation.mutate({ email })}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Resend Instructions
            </ResendButton>
          </SuccessMessage>
        )}

        <BackToLogin>
          Remember your password? <Link to="/login">Back to Login</Link>
        </BackToLogin>
      </ForgotPasswordCard>
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

const ForgotPasswordCard = styled(motion.div)`
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

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: #4a5568;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  i {
    color: #667eea;
  }
`;

const Input = styled.input`
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const SubmitButton = styled(motion.button)`
  background: linear-gradient(135deg, #1a2b6d 0%, #2a4fa8 100%);
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 10px;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  i {
    transition: transform 0.3s ease;
  }

  &:hover:not(:disabled) i {
    transform: translateX(5px);
  }
`;

const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const SuccessMessage = styled.div`
  text-align: center;
  padding: 2rem 0;

  i {
    font-size: 3rem;
    color: #667eea;
    margin-bottom: 1rem;
  }

  h3 {
    color: #2d3748;
    margin-bottom: 0.5rem;
  }

  p {
    color: #718096;
    margin-bottom: 1.5rem;
  }
`;

const ResendButton = styled(motion.button)`
  background: transparent;
  color: #667eea;
  border: 2px solid #667eea;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(102, 126, 234, 0.1);
  }
`;

const BackToLogin = styled.div`
  text-align: center;
  margin-top: 1.5rem;
  color: #4a5568;
  font-size: 0.95rem;

  a {
    color: #667eea;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.3s ease;

    &:hover {
      color: #764ba2;
    }
  }
`;

export default ForgotPassword;
