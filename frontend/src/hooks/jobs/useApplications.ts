"use client";

import { useQuery } from "@tanstack/react-query";
import jobService from "@/services/job.service";

export function useApplications() {
  return useQuery({
    queryKey: ["applications"],
    queryFn: () => jobService.getApplications(),
    staleTime: 1000 * 60 * 2,
  });
}