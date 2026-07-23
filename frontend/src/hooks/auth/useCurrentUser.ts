"use client";

import { useQuery } from "@tanstack/react-query";

import authService from "@/services/auth.service";

export const CURRENT_USER_QUERY_KEY = ["current-user"];

export function useCurrentUser(enabled = true) {
  return useQuery({
    queryKey: CURRENT_USER_QUERY_KEY,

    queryFn: async () => {
      const response = await authService.getCurrentUser();

      return response.data;
    },

    enabled,

    staleTime: 1000 * 60 * 5,

    gcTime: 1000 * 60 * 30,

    retry: 1,

    refetchOnWindowFocus: false,
  });
}