"use client";

import { useQuery } from "@tanstack/react-query";
import dashboardService from "@/services/dashboard.service";

export const ANALYTICS_QUERY_KEY = ["application-analytics"] as const;

export function useAnalytics() {
  return useQuery({
    queryKey: ANALYTICS_QUERY_KEY,
    queryFn: async () => (await dashboardService.getAnalytics()).data,
    staleTime: 1000 * 60 * 2,
  });
}