"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import resumeService from "@/services/resume.service";
import { RESUME_QUERY_KEY } from "./useResumes";

import type { CreateResumeRequest } from "@/types/resume";

export function useCreateResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateResumeRequest) =>
      resumeService.createResume(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: RESUME_QUERY_KEY,
      });

      toast.success("Resume created successfully.");
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ??
          "Failed to create resume."
      );
    },
  });
}