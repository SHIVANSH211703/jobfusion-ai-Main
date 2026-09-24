"use client";

import { useQuery } from "@tanstack/react-query";

import jobService from "@/services/job.service";

export function useJob(id: string) {
  return useQuery({
    queryKey: ["job", id],

    queryFn: () => jobService.getJobById(id),

    enabled: Boolean(id),

    staleTime: 1000 * 60 * 5,
  });
}