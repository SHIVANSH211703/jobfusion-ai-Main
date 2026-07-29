"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import resumeService from "@/services/resume.service";

import type {
  CreateResumeRequest,
  UpdateResumeRequest,
} from "@/types/resume";

export const RESUME_QUERY_KEY = ["resumes"] as const;

export function useResumes(enabled: boolean = true) {
  return useQuery({
    queryKey: RESUME_QUERY_KEY,

    queryFn: async () => {
      const response = await resumeService.getResumes();
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

export function useResume(id: string, enabled: boolean = true) {
  return useQuery({
    queryKey: [...RESUME_QUERY_KEY, id],

    queryFn: async () => {
      const response = await resumeService.getResumeById(id);
      return response.data;
    },

    enabled: enabled && !!id,

    retry: false,
  });
}

export function useCreateResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateResumeRequest) =>
      resumeService.createResume(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: RESUME_QUERY_KEY,
      });

      toast.success("Resume created successfully");
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Failed to create resume"
      );
    },
  });
}

export function useUpdateResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateResumeRequest;
    }) =>
      resumeService.updateResume(id, payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: RESUME_QUERY_KEY,
      });

      queryClient.invalidateQueries({
        queryKey: [...RESUME_QUERY_KEY, variables.id],
      });

      toast.success("Resume updated successfully");
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Failed to update resume"
      );
    },
  });
}

export function useDeleteResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      resumeService.deleteResume(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: RESUME_QUERY_KEY,
      });

      toast.success("Resume deleted successfully");
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Failed to delete resume"
      );
    },
  });
}