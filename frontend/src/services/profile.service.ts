import axiosInstance from "@/lib/axios";
import { API } from "@/constants/api";

import type {
  ProfileResponse,
  UpdateProfileRequest,
} from "@/types/profile";

interface MessageResponse {
  success: boolean;
  message: string;
}

class ProfileService {
  async getProfile(): Promise<ProfileResponse> {
    const response = await axiosInstance.get<ProfileResponse>(
      API.PROFILE.GET
    );

    return response.data;
  }

  async updateProfile(
    payload: UpdateProfileRequest
  ): Promise<ProfileResponse> {
    const response = await axiosInstance.put<ProfileResponse>(
      API.PROFILE.UPDATE,
      payload
    );

    return response.data;
  }

  async uploadAvatar(
    file: File
  ): Promise<MessageResponse> {
    const formData = new FormData();

    formData.append("avatar", file);

    const response = await axiosInstance.put<MessageResponse>(
      API.PROFILE.UPLOAD_AVATAR,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  }
}

const profileService = new ProfileService();

export default profileService;