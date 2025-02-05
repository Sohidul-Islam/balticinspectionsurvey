import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../../services/axios";
import { toast } from "react-hot-toast";
import { RegisterData } from "../../types/auth";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterData>({
    username: "",
    email: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterData) => {
      const response = await axiosInstance.post("/api/auth/register", data);
      return response.data;
    },
    onSuccess: () => {
      toast.success(
        "Registration successful! Please check your email to verify your account."
      );
      navigate("/verify-email");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    registerMutation.mutate(formData);
  };

  return (
    <Container>
      <RegisterCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <LogoSection>
          <Logo>
            <i className="fas fa-user-plus" />
          </Logo>
          <Title>Create Account</Title>
          <Subtitle>Join us! Please create your account.</Subtitle>
        </LogoSection>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>
              <i className="fas fa-user" /> Username
            </Label>
            <Input
              type="text"
              placeholder="Enter your username"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              minLength={3}
              maxLength={30}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>
              <i className="fas fa-envelope" /> Email
            </Label>
            <Input
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>
              <i className="fas fa-lock" /> Password
            </Label>
            <Input
              type="password"
              placeholder="Enter your password"
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
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              minLength={6}
              required
            />
          </FormGroup>

          <RegisterButton
            type="submit"
            disabled={registerMutation.isPending}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {registerMutation.isPending ? (
              <>
                <LoadingSpinner /> Creating Account...
              </>
            ) : (
              <>
                Create Account <i className="fas fa-arrow-right" />
              </>
            )}
          </RegisterButton>

          <LoginLink>
            Already have an account? <Link to="/login">Login here</Link>
          </LoginLink>
        </Form>
      </RegisterCard>
    </Container>
  );
};

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
`;

const RegisterCard = styled(motion.div)`
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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

const RegisterButton = styled(motion.button)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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

const LoginLink = styled.p`
  text-align: center;
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

export default Register;
