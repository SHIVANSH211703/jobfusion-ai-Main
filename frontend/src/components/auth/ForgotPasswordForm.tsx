"use client";

import Link from "next/link";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "@/schemas/auth.schema";

import { useForgotPassword } from "@/hooks/auth/useForgotPassword";

export default function ForgotPasswordForm() {
  const forgotPasswordMutation = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: ForgotPasswordFormValues) => {
    forgotPasswordMutation.mutate(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      {/* Email */}
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="text-sm font-medium"
        >
          Email
        </label>

        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          {...register("email")}
          aria-invalid={!!errors.email}
        />

        {errors.email && (
          <p className="text-sm text-red-500">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full"
        disabled={forgotPasswordMutation.isPending}
      >
        {forgotPasswordMutation.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          "Send Reset Link"
        )}
      </Button>

      {/* Back to Login */}
      <div className="text-center text-sm text-muted-foreground">
        <Link
          href="/login"
          className="font-medium text-primary hover:underline"
        >
          Back to Login
        </Link>
      </div>
    </form>
  );
}