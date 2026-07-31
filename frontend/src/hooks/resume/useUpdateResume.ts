"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import resumeService from "@/services/resume.service";
import { RESUME_QUERY_KEY } from "./useResumes";

import type { UpdateResumeRequest } from "@/types/resume";

interface UpdateResumePayload {
  id: string;
  payload: UpdateResumeRequest;
}

export function useUpdateResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: UpdateResumePayload) =>
      resumeService.updateResume(id, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: RESUME_QUERY_KEY,
      });

      toast.success("Resume updated successfully.");
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ??
          "Failed to update resume."
      );
    },
  });
}