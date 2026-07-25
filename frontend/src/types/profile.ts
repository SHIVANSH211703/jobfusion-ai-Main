export interface Profile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  headline: string;
  bio: string;
  location: string;
  experienceLevel: string;
  skills: string[];
  linkedin: string;
  github: string;
  portfolio: string;
  role: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileResponse {
  success: boolean;
  message: string;
  data: Profile;
}

export interface UpdateProfileRequest {
  name: string;
  phone: string;
  headline: string;
  bio: string;
  location: string;
  experienceLevel: string;
  skills: string[];
  linkedin: string;
  github: string;
  portfolio: string;
}