"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";

import authService from "@/services/auth.service";

import type { ResetPasswordRequest } from "@/types/auth";

export function useResetPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: ResetPasswordRequest) =>
      authService.resetPassword(payload),

    onSuccess: (response) => {
      toast.success(response.message);

      router.replace("/login");
    },

    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ??
            "Failed to reset password."
        );
        return;
      }

      toast.error("Something went wrong.");
    },
  });
}