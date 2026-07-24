"use client";

import { useQuery } from "@tanstack/react-query";

import authService from "@/services/auth.service";

export const CURRENT_USER_QUERY_KEY = ["current-user"] as const;

export function useCurrentUser(enabled: boolean = true) {
  return useQuery({
    queryKey: CURRENT_USER_QUERY_KEY,

    queryFn: async () => {
      const response = await authService.getCurrentUser();
      return response.data;
    },

    enabled,

    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes

    retry: false,

    refetchOnMount: false,
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
  });
}