"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import resumeService from "@/services/resume.service";

export function useATSAnalysis() {
  return useMutation({
    mutationFn: (resumeId: string) =>
      resumeService.analyzeResume(resumeId),

    onSuccess: () => {
      toast.success("Resume analyzed successfully.");
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ??
          "Failed to analyze resume."
      );
    },
  });
}