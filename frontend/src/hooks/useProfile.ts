"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import profileService from "@/services/profile.service";

import type { UpdateProfileRequest } from "@/types/profile";

export const PROFILE_QUERY_KEY = ["profile"] as const;

export function useProfile(enabled: boolean = true) {
  return useQuery({
    queryKey: PROFILE_QUERY_KEY,

    queryFn: async () => {
      const response = await profileService.getProfile();
      return response.data;
    },

    enabled,

    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,

    retry: false,

    refetchOnMount: false,
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateProfileRequest) =>
      profileService.updateProfile(payload),

    onSuccess: (response) => {
      queryClient.setQueryData(PROFILE_QUERY_KEY, response.data);
      toast.success("Profile updated successfully");
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to update profile"
      );
    },
  });
}

export function useUploadAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) =>
      profileService.uploadAvatar(file),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: PROFILE_QUERY_KEY,
      });
      toast.success("Avatar updated successfully");
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to upload avatar"
      );
    },
  });
}