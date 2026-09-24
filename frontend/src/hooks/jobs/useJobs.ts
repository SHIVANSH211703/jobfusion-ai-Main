"use client";

import { useQuery } from "@tanstack/react-query";

import jobService from "@/services/job.service";

import type {
  JobSearchParams,
} from "@/types/job";

export function useJobs(
  params?: JobSearchParams
) {
  return useQuery({
    queryKey: ["jobs", params],

    queryFn: () =>
      jobService.getJobs(params),

    staleTime: 1000 * 60 * 2,
  });
}