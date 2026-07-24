"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";

import authService from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import { CURRENT_USER_QUERY_KEY } from "./useCurrentUser";

import type { LoginRequest } from "@/types/auth";

export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: (payload: LoginRequest) =>
      authService.login(payload),

    onSuccess: async (response) => {
      const { user } = response.data;

      // Backend has already set the HttpOnly cookies.
      // Just update the client auth state.
      login();

      // Cache the current user
      queryClient.setQueryData(
        CURRENT_USER_QUERY_KEY,
        user
      );

      toast.success("Welcome back!");

      router.replace("/dashboard");
    },

    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ?? "Login failed"
        );
        return;
      }

      toast.error("Something went wrong.");
    },
  });
}