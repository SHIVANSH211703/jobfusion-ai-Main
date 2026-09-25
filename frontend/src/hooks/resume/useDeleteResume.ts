"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import resumeService from "@/services/resume.service";
import { getApiErrorMessage } from "@/lib/api-error";
import { RESUME_QUERY_KEY } from "./useResumes";

export function useDeleteResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      resumeService.deleteResume(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: RESUME_QUERY_KEY,
      });

      toast.success("Resume deleted successfully.");
    },

    onError: (error: unknown) => {
      toast.error(
        getApiErrorMessage(error, "Failed to delete resume.")
      );
    },
  });
}