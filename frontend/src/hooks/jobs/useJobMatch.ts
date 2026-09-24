"use client";

import { useMutation } from "@tanstack/react-query";

import { toast } from "sonner";

import jobService from "@/services/job.service";

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

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Failed to calculate job match."
      );
    },
  });
}
