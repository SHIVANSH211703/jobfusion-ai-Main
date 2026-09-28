"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import resumeService from "@/services/resume.service";
import { getApiErrorMessage } from "@/lib/api-error";

export function useCareerGap() {
  return useMutation({
    mutationFn: ({ resumeId, targetRole }: { resumeId: string; targetRole: string }) => resumeService.analyzeCareerGap(resumeId, targetRole),
    onError: (error: unknown) => toast.error(getApiErrorMessage(error, "Could not analyze this career path.")),
  });
}