"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";

import authService from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import { CURRENT_USER_QUERY_KEY } from "./useCurrentUser";

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const logout = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: () => authService.logout(),

    onSuccess: async (response) => {
      // Update auth state
      logout();

      // Clear all cached queries
      queryClient.clear();

      // Ensure current user cache is removed
      queryClient.removeQueries({
        queryKey: CURRENT_USER_QUERY_KEY,
      });

      toast.success(response.message);

      router.replace("/login");
    },

    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ??
            "Logout failed"
        );
        return;
      }

      toast.error("Something went wrong.");
    },
  });
}