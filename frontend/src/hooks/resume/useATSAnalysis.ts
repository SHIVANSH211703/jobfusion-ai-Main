"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import resumeService from "@/services/resume.service";
import { getApiErrorMessage } from "@/lib/api-error";
import { RESUME_QUERY_KEY } from "./useResumes";

type AnalyzeResumeInput = string | {
  id: string;
  jobDescription?: string;
};

export function useATSAnalysis() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: AnalyzeResumeInput) => {
      const { id, jobDescription } = typeof input === "string"
        ? { id: input, jobDescription: undefined }
        : input;

      return resumeService.analyzeResume(
        id,
        jobDescription?.trim()
          ? { jobDescription: jobDescription.trim() }
          : undefined
      );
    },

    onSuccess: (_, input) => {
      const resumeId = typeof input === "string" ? input : input.id;
      queryClient.invalidateQueries({ queryKey: RESUME_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...RESUME_QUERY_KEY, resumeId] });
      toast.success("Resume analyzed successfully.");
    },

    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, "Failed to analyze resume."));
    },
  });
}