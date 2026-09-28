"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import resumeService from "@/services/resume.service";
import { getApiErrorMessage } from "@/lib/api-error";
import { RESUME_QUERY_KEY } from "./useResumes";

export const resumeVersionsQueryKey = (resumeId: string) => ["resume-versions", resumeId] as const;

export function useResumeVersions(resumeId: string) {
  return useQuery({
    queryKey: resumeVersionsQueryKey(resumeId),
    queryFn: () => resumeService.getVersions(resumeId),
    enabled: Boolean(resumeId),
  });
}

export function useResumeVersion(resumeId: string, versionId: string) {
  return useQuery({
    queryKey: [...resumeVersionsQueryKey(resumeId), versionId],
    queryFn: () => resumeService.getVersion(resumeId, versionId),
    enabled: Boolean(resumeId && versionId),
  });
}

export function useCreateResumeVersion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (resumeId: string) => resumeService.createVersion(resumeId),
    onSuccess: (_, resumeId) => {
      queryClient.invalidateQueries({ queryKey: resumeVersionsQueryKey(resumeId) });
      toast.success("Resume checkpoint created.");
    },
    onError: (error: unknown) => toast.error(getApiErrorMessage(error, "Could not create checkpoint.")),
  });
}

export function useRestoreResumeVersion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ resumeId, versionId }: { resumeId: string; versionId: string }) =>
      resumeService.restoreVersion(resumeId, versionId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: RESUME_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...RESUME_QUERY_KEY, variables.resumeId] });
      queryClient.invalidateQueries({ queryKey: resumeVersionsQueryKey(variables.resumeId) });
      toast.success("Resume version restored.");
    },
    onError: (error: unknown) => toast.error(getApiErrorMessage(error, "Could not restore this version.")),
  });
}