"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { toast } from "sonner";

import jobService from "@/services/job.service";
import { getApiErrorMessage } from "@/lib/api-error";

interface ApplyJobPayload {
  jobId: string;
  resumeId: string;
  notes?: string;
}

export function useApplyJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      jobId,
      resumeId,
      notes,
    }: ApplyJobPayload) =>
      jobService.applyToJob(jobId, {
        resumeId,
        notes,
      }),

    onSuccess: (response) => {
      toast.success(
        response?.message ||
          "Application submitted successfully."
      );

      queryClient.invalidateQueries({
        queryKey: ["applications"],
      });

      queryClient.invalidateQueries({
        queryKey: ["job"],
      });
    },

    onError: (error: unknown) => {
      toast.error(
        getApiErrorMessage(error, "Failed to apply for this job.")
      );
    },
  });
}