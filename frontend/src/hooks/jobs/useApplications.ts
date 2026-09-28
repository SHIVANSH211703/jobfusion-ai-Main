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
    mutationFn: ({
      jobId,
      status,
      notes,
      followUpDate,
    }: {
      jobId: string;
      status?: ApplicationStatus;
      notes?: string;
      followUpDate?: string | null;
    }) => jobService.updateApplicationStatus(jobId, status, notes, followUpDate),
    onMutate: async ({ jobId, status, notes, followUpDate }) => {
      await queryClient.cancelQueries({ queryKey: ["applications"] });
      const previousData = queryClient.getQueryData(["applications"]);

      queryClient.setQueryData(["applications"], (old: unknown) => {
        if (!old || typeof old !== "object" || !("data" in old)) return old;
        const oldTyped = old as {
          data?: {
            applications?: Array<{
              _id: string;
              status: ApplicationStatus;
              notes?: string;
              followUpDate?: string | null;
              jobId?: { _id: string };
              job?: { _id: string };
            }>;
          };
        };
        if (!oldTyped.data?.applications) return old;

        return {
          ...oldTyped,
          data: {
            ...oldTyped.data,
            applications: oldTyped.data.applications.map((app) => {
              const matches =
                app._id === jobId ||
                app.jobId?._id === jobId ||
                app.job?._id === jobId;
              if (!matches) return app;
              return {
                ...app,
                ...(status ? { status } : {}),
                ...(notes !== undefined ? { notes } : {}),
                ...(followUpDate !== undefined ? { followUpDate } : {}),
              };
            }),
          },
        };
      });

      return { previousData };
    },
    onError: (error: unknown, _variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["applications"], context.previousData);
      }
      toast.error(
        getApiErrorMessage(error, "Could not update application status.")
      );
    },
    onSuccess: () => {
      toast.success("Application status updated.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useDeleteApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => jobService.deleteApplication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Application removed.");
    },
    onError: (error: unknown) =>
      toast.error(getApiErrorMessage(error, "Could not remove application.")),
  });
}