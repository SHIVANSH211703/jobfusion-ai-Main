import axiosInstance from "@/lib/axios";
import { API } from "@/constants/api";

import type {
  AuthResponse,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
  User,
} from "@/types/auth";

interface MessageResponse {
  success: boolean;
  message: string;
}

interface CurrentUserResponse {
  success: boolean;
  message: string;
  data: User;
}

class AuthService {
  async login(payload: LoginRequest): Promise<AuthResponse> {
    const response = await axiosInstance.post<AuthResponse>(
      API.AUTH.LOGIN,
      payload
    );

    return response.data;
  }

  async register(payload: RegisterRequest): Promise<AuthResponse> {
    const response = await axiosInstance.post<AuthResponse>(
      API.AUTH.REGISTER,
      payload
    );

    return response.data;
  }

  async getCurrentUser(): Promise<CurrentUserResponse> {
    const response = await axiosInstance.get<CurrentUserResponse>(
      API.AUTH.ME
    );

    return response.data;
  }

  async logout(): Promise<MessageResponse> {
    const response = await axiosInstance.post<MessageResponse>(
      API.AUTH.LOGOUT
    );

    return response.data;
  }

  async refreshToken(
    refreshToken: string
  ): Promise<AuthResponse> {
    const response = await axiosInstance.post<AuthResponse>(
      API.AUTH.REFRESH_TOKEN,
      {
        refreshToken,
      }
    );

    return response.data;
  }

  async forgotPassword(
    payload: ForgotPasswordRequest
  ): Promise<MessageResponse> {
    const response = await axiosInstance.post<MessageResponse>(
      API.AUTH.FORGOT_PASSWORD,
      payload
    );

    return response.data;
  }

  async resetPassword(
    payload: ResetPasswordRequest
  ): Promise<MessageResponse> {
    const response = await axiosInstance.post<MessageResponse>(
      API.AUTH.RESET_PASSWORD,
      payload
    );

    return response.data;
  }

  async changePassword(
    payload: ChangePasswordRequest
  ): Promise<MessageResponse> {
    const response = await axiosInstance.post<MessageResponse>(
      API.AUTH.CHANGE_PASSWORD,
      payload
    );

    return response.data;
  }
}

const authService = new AuthService();

export default authService;