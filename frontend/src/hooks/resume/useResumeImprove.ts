"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import resumeService from "@/services/resume.service";
import { getApiErrorMessage } from "@/lib/api-error";
import { RESUME_QUERY_KEY } from "./useResumes";

export function useResumeImprove() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (resumeId: string) =>
      resumeService.improveResume(resumeId),

    onSuccess: (_, resumeId) => {
      queryClient.invalidateQueries({ queryKey: RESUME_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...RESUME_QUERY_KEY, resumeId] });
      toast.success("Resume improved successfully.");
    },

    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, "Failed to improve resume."));
    },
  });
}