import { z } from "zod";

/* -------------------- Login -------------------- */

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

/* -------------------- Register -------------------- */

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters"),

    email: z
      .string()
      .trim()
      .email("Please enter a valid email address"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters"),

    confirmPassword: z
      .string()
      .min(8, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;

/* -------------------- Forgot Password -------------------- */

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address"),
});

export type ForgotPasswordFormValues = z.infer<
  typeof forgotPasswordSchema
>;

/* -------------------- Reset Password -------------------- */

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters"),

    confirmPassword: z
      .string()
      .min(8, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type ResetPasswordFormValues = z.infer<
  typeof resetPasswordSchema
>;