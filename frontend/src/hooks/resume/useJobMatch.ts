"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import resumeService from "@/services/resume.service";
import { getApiErrorMessage } from "@/lib/api-error";

interface JobMatchPayload {
  id: string;
  jobDescription: string;
}

export function useJobMatch() {
  return useMutation({
    mutationFn: ({
      id,
      jobDescription,
    }: JobMatchPayload) =>
      resumeService.jobMatch(id, {
        jobDescription,
      }),

    onSuccess: () => {
      toast.success(
        "Job match analysis completed."
      );
    },

    onError: (error: unknown) => {
      toast.error(
        getApiErrorMessage(error, "Failed to analyze job match.")
      );
    },
  });
}