"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import resumeService from "@/services/resume.service";

interface CoverLetterPayload {
  id: string;
  jobDescription: string;
  tone?: string;
}

export function useCoverLetter() {
  return useMutation({
    mutationFn: ({
      id,
      jobDescription,
      tone,
    }: CoverLetterPayload) =>
      resumeService.generateCoverLetter(id, {
        jobDescription,
        tone,
      }),

    onSuccess: () => {
      toast.success(
        "Cover letter generated successfully."
      );
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ??
          "Failed to generate cover letter."
      );
    },
  });
}