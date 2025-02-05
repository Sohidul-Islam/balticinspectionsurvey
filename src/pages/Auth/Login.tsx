import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../../services/axios";
import { toast } from "react-hot-toast";
import { LoginData, AuthResponse } from "../../types/auth";
import { FaEnvelope, FaKey, FaLock } from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState<LoginData>({
    email: "",
    password: "",
  });

  const loginMutation = useMutation<AuthResponse, Error, LoginData>({
    mutationFn: async (data) => {
      const response = await axiosInstance.post("/api/auth/login", data);
      return response.data;
    },
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      if (!data?.user?.isVerified) {
        toast.error("Please verify your email to access all features.");
        navigate(`/verify-email?email=${data.user.email}`);
      } else {
        toast.success("Login successful!");
        navigate("/admin/dashboard");
      }
    },
    onError: (error) => {
      toast.error(error.message || "Invalid credentials. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(credentials);
  };

  return (
    <Container>
      <LoginCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <LogoSection>
          <Logo>
            <FaLock />
          </Logo>
          <Title>Admin Login</Title>
          <Subtitle>Welcome back! Please login to your account.</Subtitle>
        </LogoSection>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>
              <FaEnvelope /> Email
            </Label>
            <Input
              type="email"
              placeholder="Enter your email"
              value={credentials.email}
              onChange={(e) =>
                setCredentials({ ...credentials, email: e.target.value })
              }
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>
              <FaKey /> Password
            </Label>
            <PasswordWrapper>
              <Input
                type="password"
                placeholder="Enter your password"
                value={credentials.password}
                onChange={(e) =>
                  setCredentials({ ...credentials, password: e.target.value })
                }
                required
              />
            </PasswordWrapper>
          </FormGroup>

          <RememberMeSection>
            {/* <CheckboxLabel>
              <Checkbox type="checkbox" />
              Remember me
            </CheckboxLabel> */}
            <ForgotPassword to="/forgot-password">
              Forgot password?
            </ForgotPassword>
            <RegisterLink to="/register">
              Don't have an account? Register{" "}
            </RegisterLink>
          </RememberMeSection>

          <LoginButton
            type="submit"
            disabled={loginMutation.isPending}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loginMutation.isPending ? (
              <>
                <LoadingSpinner /> Logging in...
              </>
            ) : (
              <>
                Login <i className="fas fa-arrow-right" />
              </>
            )}
          </LoginButton>
        </Form>
      </LoginCard>
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

const LoginCard = styled(motion.div)`
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
  width: 100%;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const PasswordWrapper = styled.div`
  position: relative;
`;

const RememberMeSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

// const CheckboxLabel = styled.label`
//   display: flex;
//   align-items: center;
//   gap: 0.5rem;
//   color: #4a5568;
//   font-size: 0.9rem;
//   cursor: pointer;
// `;

// const Checkbox = styled.input`
//   width: 16px;
//   height: 16px;
//   cursor: pointer;
// `;

const ForgotPassword = styled(Link)`
  color: #667eea;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s ease;

  &:hover {
    color: #764ba2;
  }
`;

const LoginButton = styled(motion.button)`
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

const RegisterLink = styled(Link)`
  color: #667eea;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s ease;

  &:hover {
    color: #764ba2;
  }
`;

export default Login;
