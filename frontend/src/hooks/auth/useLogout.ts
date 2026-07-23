"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

import authService from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import { CURRENT_USER_QUERY_KEY } from "./useCurrentUser";

export function useLogout() {
  const router = useRouter();

  const queryClient = useQueryClient();

  const logout = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: async () => {
      try {
        await authService.logout();
      } catch {
        // Even if the API call fails, continue logging out locally.
      }
    },

    onSuccess: async () => {
      logout();

      await queryClient.removeQueries({
        queryKey: CURRENT_USER_QUERY_KEY,
      });

      await queryClient.clear();

      toast.success("Logged out successfully.");

      router.replace("/login");
    },
  });
}