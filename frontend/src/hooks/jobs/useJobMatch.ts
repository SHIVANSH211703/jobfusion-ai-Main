"use client";

import { useMutation } from "@tanstack/react-query";

import { toast } from "sonner";

import jobService from "@/services/job.service";
import { getApiErrorMessage } from "@/lib/api-error";

interface JobMatchPayload {
  jobId: string;
  resumeId: string;
}

export function useJobMatch() {
  return useMutation({
    mutationFn: ({
      jobId,
      resumeId,
    }: JobMatchPayload) =>
      jobService.matchJob(
        jobId,
        resumeId
      ),

    onSuccess: () => {
      toast.success(
        "AI job match calculated successfully."
      );
    },

    onError: (error: unknown) => {
      toast.error(
        getApiErrorMessage(error, "Failed to calculate job match.")
      );
    },
  });
}
