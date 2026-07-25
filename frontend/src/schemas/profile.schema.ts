import { z } from "zod";

export const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(100, "Name cannot exceed 100 characters."),

  phone: z
    .string()
    .trim()
    .min(10, "Phone number must be at least 10 digits.")
    .max(15, "Phone number cannot exceed 15 digits.")
    .optional()
    .or(z.literal("")),

  headline: z
    .string()
    .trim()
    .max(120, "Headline cannot exceed 120 characters.")
    .optional()
    .or(z.literal("")),

  bio: z
    .string()
    .trim()
    .max(500, "Bio cannot exceed 500 characters.")
    .optional()
    .or(z.literal("")),

  location: z
    .string()
    .trim()
    .max(100, "Location cannot exceed 100 characters.")
    .optional()
    .or(z.literal("")),

  experienceLevel: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),

  skills: z.array(z.string()).default([]),

  github: z
    .string()
    .trim()
    .url("Enter a valid GitHub URL.")
    .optional()
    .or(z.literal("")),

  linkedin: z
    .string()
    .trim()
    .url("Enter a valid LinkedIn URL.")
    .optional()
    .or(z.literal("")),

  portfolio: z
    .string()
    .trim()
    .url("Enter a valid Portfolio URL.")
    .optional()
    .or(z.literal("")),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;