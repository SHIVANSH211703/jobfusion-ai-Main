"use client";

import { useState } from "react";
import Link from "next/link";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

import { loginSchema, type LoginFormValues } from "@/schemas/auth.schema";
import { useLogin } from "@/hooks/auth/useLogin";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data);
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
            placeholder="Enter your password"
            className="pr-10"
            {...register("password")}
            aria-invalid={!!errors.password}
          />

          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
            aria-label={
              showPassword
                ? "Hide password"
                : "Show password"
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

      {/* Remember Me + Forgot Password */}
      <div className="flex items-center justify-between">
        <label
          htmlFor="remember"
          className="flex items-center gap-2 text-sm cursor-pointer"
        >
          <Checkbox id="remember" />
          <span>Remember me</span>
        </label>

        <Link
          href="/forgot-password"
          className="text-sm font-medium text-primary hover:underline"
        >
          Forgot Password?
        </Link>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        className="w-full"
        disabled={loginMutation.isPending}
      >
        {loginMutation.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing In...
          </>
        ) : (
          "Sign In"
        )}
      </Button>

      {/* Register */}
     <div className="text-center text-sm text-muted-foreground">
  Don&apos;t have an account?{" "}
  <Link
    href="/register"
    className="font-medium text-primary hover:underline"
  >
    Create Account
  </Link>
</div>
    </form>
  );
}