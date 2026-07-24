"use client";

import { useState } from "react";
import Link from "next/link";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  registerSchema,
  type RegisterFormValues,
} from "@/schemas/auth.schema";

import { useRegister } from "@/hooks/auth/useRegister";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: RegisterFormValues) => {
    registerMutation.mutate({
      name: data.name,
      email: data.email,
      password: data.password,
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      {/* Name */}
      <div className="space-y-2">
        <label
          htmlFor="name"
          className="text-sm font-medium"
        >
          Full Name
        </label>

        <Input
          id="name"
          type="text"
          placeholder="Enter your full name"
          {...register("name")}
          aria-invalid={!!errors.name}
        />

        {errors.name && (
          <p className="text-sm text-red-500">
            {errors.name.message}
          </p>
        )}
      </div>

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

      {/* Password */}
      <div className="space-y-2">
        <label
          htmlFor="password"
          className="text-sm font-medium"
        >
          Password
        </label>

        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a password"
            className="pr-10"
            {...register("password")}
            aria-invalid={!!errors.password}
          />

          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
            aria-label={
              showPassword ? "Hide password" : "Show password"
            }
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>

        {errors.password && (
          <p className="text-sm text-red-500">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Confirm Password */}
      <div className="space-y-2">
        <label
          htmlFor="confirmPassword"
          className="text-sm font-medium"
        >
          Confirm Password
        </label>

        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your password"
            className="pr-10"
            {...register("confirmPassword")}
            aria-invalid={!!errors.confirmPassword}
          />

          <button
            type="button"
            onClick={() =>
              setShowConfirmPassword((prev) => !prev)
            }
            className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
            aria-label={
              showConfirmPassword
                ? "Hide password"
                : "Show password"
            }
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>

        {errors.confirmPassword && (
          <p className="text-sm text-red-500">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Submit */}
      <Button
        type="submit"
        className="w-full"
        disabled={registerMutation.isPending}
      >
        {registerMutation.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating Account...
          </>
        ) : (
          "Create Account"
        )}
      </Button>

      {/* Login */}
      <div className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-primary hover:underline"
        >
          Sign In
        </Link>
      </div>
    </form>
  );
}