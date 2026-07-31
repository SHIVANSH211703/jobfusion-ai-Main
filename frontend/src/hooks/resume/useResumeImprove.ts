"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import resumeService from "@/services/resume.service";

export function useResumeImprove() {
  return useMutation({
    mutationFn: (resumeId: string) =>
      resumeService.improveResume(resumeId),

    onSuccess: () => {
      toast.success("Resume improved successfully.");
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ??
          "Failed to improve resume."
      );
    },
  });
}