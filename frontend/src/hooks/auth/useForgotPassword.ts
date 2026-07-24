"use client";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-hot-toast";

import authService from "@/services/auth.service";

import type { ForgotPasswordRequest } from "@/types/auth";

export function useForgotPassword() {
  return useMutation({
    mutationFn: (payload: ForgotPasswordRequest) =>
      authService.forgotPassword(payload),

    onSuccess: (response) => {
      toast.success(response.message);
    },

    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ??
            "Failed to send reset link."
        );
        return;
      }

      toast.error("Something went wrong.");
    },
  });
}