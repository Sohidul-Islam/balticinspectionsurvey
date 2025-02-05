export interface AuthResponse {
  data: {
    token: string;
    user: {
      id: string;
      username: string;
      email: string;
      isVerified: boolean;
      status: string;
    };
  };
  message: string;
  status: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface VerifyEmailData {
  token: string;
  email: string;
}
