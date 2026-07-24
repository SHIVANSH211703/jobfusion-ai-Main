"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";

import authService from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import { CURRENT_USER_QUERY_KEY } from "./useCurrentUser";

import type { RegisterRequest } from "@/types/auth";

export function useRegister() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: (payload: RegisterRequest) =>
      authService.register(payload),

    onSuccess: async (response) => {
      const { user } = response.data;

      // Backend already stored the cookies
      login();

      // Cache current user
      queryClient.setQueryData(
        CURRENT_USER_QUERY_KEY,
        user
      );

      toast.success(response.message);

      router.replace("/dashboard");
    },

    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ??
            "Registration failed"
        );
        return;
      }

      toast.error("Something went wrong.");
    },
  });
}