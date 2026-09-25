"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { toast } from "sonner";

import jobService from "@/services/job.service";
import { getApiErrorMessage } from "@/lib/api-error";

import type {
  SavedJobsResponse,
} from "@/types/job";

interface SaveJobPayload {
  jobId: string;
  isSaved: boolean;
}

export function useSaveJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      jobId,
      isSaved,
    }: SaveJobPayload) => {
      if (isSaved) {
        return jobService.unsaveJob(jobId);
      }

      return jobService.saveJob(jobId);
    },

    onSuccess: async (_response, variables) => {
      /*
       * IMPORTANT:
       * Refetch saved jobs from backend after every
       * save/unsave so the backend remains the source
       * of truth.
       *
       * We don't manually replace the complete local
       * saved state anymore.
       */
      await queryClient.invalidateQueries({
        queryKey: ["saved-jobs"],
      });

      toast.success(
        variables.isSaved
          ? "Job removed from saved jobs."
          : "Job saved successfully."
      );
    },

    onError: (error: unknown) => {
      toast.error(
        getApiErrorMessage(error, "Unable to update saved job.")
      );
    },
  });
}