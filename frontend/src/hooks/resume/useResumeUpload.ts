"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { toast } from "sonner";

import resumeService from "@/services/resume.service";
import { getApiErrorMessage } from "@/lib/api-error";

export const RESUME_QUERY_KEY = [
  "resumes",
] as const;

export function useResumeUpload() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) =>
      resumeService.uploadResume(file),

    onSuccess: async (response) => {
      await queryClient.invalidateQueries({
        queryKey: RESUME_QUERY_KEY,
      });

      toast.success(
        response.message ||
          "Resume uploaded successfully."
      );
    },

    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, "Failed to upload resume."));
    },
  });
}