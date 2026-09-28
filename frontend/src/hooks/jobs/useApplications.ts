"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import jobService from "@/services/job.service";
import { getApiErrorMessage } from "@/lib/api-error";
import type { ApplicationStatus } from "@/types/job";

export function useApplications() {
  return useQuery({
    queryKey: ["applications"],
    queryFn: () => jobService.getApplications(),
    staleTime: 1000 * 60 * 2,
  });
}

export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ jobId, status, notes }: { jobId: string; status: ApplicationStatus; notes?: string }) =>
      jobService.updateApplicationStatus(jobId, status, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Application status updated.");
    },
    onError: (error: unknown) => toast.error(getApiErrorMessage(error, "Could not update application status.")),
  });
}