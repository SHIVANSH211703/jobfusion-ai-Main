"use client";

import { useQuery } from "@tanstack/react-query";

import jobService from "@/services/job.service";

export function useSavedJobs() {
  return useQuery({
    queryKey: ["saved-jobs"],
    queryFn: () => jobService.getSavedJobs(),
    staleTime: 1000 * 60 * 2,
  });
}