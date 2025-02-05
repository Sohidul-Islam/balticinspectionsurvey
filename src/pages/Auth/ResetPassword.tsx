import React, { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../../services/axios";
import { toast } from "react-hot-toast";
import { ResetPasswordData } from "../../types/auth";
import { FaExclamationTriangle, FaLock } from "react-icons/fa";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async (data: ResetPasswordData) => {
      const response = await axiosInstance.post(
        "/api/auth/reset-password",
        data
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Password reset successful!");
      navigate("/login");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message ||
          "Failed to reset password. Please try again."
      );
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    if (!token || !email) {
      toast.error("Invalid reset token!");
      return;
    }
    resetPasswordMutation.mutate({
      token,
      email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
    });
  };

  if (!token) {
    return (
      <Container>
        <ResetCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <LogoSection>
            <Logo>
              <FaExclamationTriangle />
            </Logo>
            <Title>Invalid Reset Link</Title>
            <Subtitle>
              This password reset link is invalid or has expired.
            </Subtitle>
          </LogoSection>
          <BackToLogin>
            <Link to="/forgot-password">Request New Reset Link</Link>
          </BackToLogin>
        </ResetCard>
      </Container>
    );
  }

  return (
    <Container>
      <ResetCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <LogoSection>
          <Logo>
            <FaLock />
          </Logo>
          <Title>Reset Password</Title>
          <Subtitle>Please enter your new password</Subtitle>
        </LogoSection>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>
              <i className="fas fa-lock" /> New Password
            </Label>
            <Input
              type="password"
              placeholder="Enter new password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              minLength={6}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>
              <i className="fas fa-lock" /> Confirm Password
            </Label>
            <Input
              type="password"
              placeholder="Confirm new password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              minLength={6}
              required
            />
          </FormGroup>

          <ResetButton
            type="submit"
            disabled={resetPasswordMutation.isPending}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {resetPasswordMutation.isPending ? (
              <>
                <LoadingSpinner /> Resetting Password...
              </>
            ) : (
              <>
                Reset Password <i className="fas fa-arrow-right" />
              </>
            )}
          </ResetButton>
        </Form>

        <BackToLogin>
          Remember your password? <Link to="/login">Back to Login</Link>
        </BackToLogin>
      </ResetCard>
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

const ResetCard = styled(motion.div)`
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

const ResetButton = styled(motion.button)`
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

export default ResetPassword;
