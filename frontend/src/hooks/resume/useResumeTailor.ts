"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import resumeService from "@/services/resume.service";
import { getApiErrorMessage } from "@/lib/api-error";

export function useResumeTailor() {
  return useMutation({
    mutationFn: ({ resumeId, jobDescription }: { resumeId: string; jobDescription: string }) =>
      resumeService.tailorResume(resumeId, jobDescription),
    onSuccess: () => toast.success("Review the proposed changes before applying them."),
    onError: (error: unknown) => toast.error(getApiErrorMessage(error, "Could not tailor this resume.")),
  });
}