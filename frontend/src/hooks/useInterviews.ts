"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import interviewService from "@/services/interview.service";
import { getApiErrorMessage } from "@/lib/api-error";
import type { CreateInterviewRequest, UpdateInterviewRequest } from "@/types/interview";

export const INTERVIEWS_QUERY_KEY = ["interviews"] as const;

export function useInterviews() {
  return useQuery({
    queryKey: INTERVIEWS_QUERY_KEY,
    queryFn: async () => (await interviewService.getInterviews()).data,
  });
}

export function useCreateInterview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateInterviewRequest) => interviewService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INTERVIEWS_QUERY_KEY });
      toast.success("Interview scheduled.");
    },
    onError: (error: unknown) => toast.error(getApiErrorMessage(error, "Could not schedule interview.")),
  });
}

export function useUpdateInterview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateInterviewRequest }) => interviewService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INTERVIEWS_QUERY_KEY });
      toast.success("Interview updated.");
    },
    onError: (error: unknown) => toast.error(getApiErrorMessage(error, "Could not update interview.")),
  });
}

export function useDeleteInterview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => interviewService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INTERVIEWS_QUERY_KEY });
      toast.success("Interview deleted.");
    },
    onError: (error: unknown) => toast.error(getApiErrorMessage(error, "Could not delete interview.")),
  });
}

export function useInterviewPreparation() {
  return useMutation({
    mutationFn: (applicationId: string) => interviewService.prepare(applicationId),
    onError: (error: unknown) => toast.error(getApiErrorMessage(error, "Could not prepare interview questions.")),
  });
}