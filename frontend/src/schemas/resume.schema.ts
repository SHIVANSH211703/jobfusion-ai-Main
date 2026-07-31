import { z } from "zod";

export const personalInfoSchema = z.object({
    fullName: z.string().min(2, "Full name is required"),
    email: z.string().email("Invalid email"),
    phone: z.string().min(10, "Phone number is required"),
    location: z.string().min(2, "Location is required"),

    linkedin: z.string().url().optional().or(z.literal("")),
    github: z.string().url().optional().or(z.literal("")),
    portfolio: z.string().url().optional().or(z.literal("")),
});

export const educationSchema = z.object({
    institution: z.string().min(1, "Institution is required"),
    degree: z.string().min(1, "Degree is required"),
    field: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    grade: z.string().optional(),
    description: z.string().optional(),
});

export const experienceSchema = z.object({
    company: z.string().min(1, "Company is required"),
    position: z.string().min(1, "Position is required"),
    location: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    current: z.boolean().default(false),
    description: z.string().optional(),
});

export const projectSchema = z.object({
    title: z.string().min(1, "Project title is required"),
    description: z.string().optional(),
    technologies: z.array(z.string()).default([]),
    github: z.string().optional(),
    live: z.string().optional(),
});

export const certificationSchema = z.object({
    name: z.string().min(1),
    issuer: z.string().optional(),
    issueDate: z.string().optional(),
});

export const achievementSchema = z.object({
    title: z.string().min(1),
    description: z.string().optional(),
});

export const languageSchema = z.object({
    language: z.string().min(1),
    proficiency: z.string().optional(),
});

export const resumeSchema = z.object({
    title: z.string().min(2),

    template: z.string().default("modern"),

    summary: z.string().min(10),

    personalInfo: personalInfoSchema,

    education: z.array(educationSchema),

    experience: z.array(experienceSchema),

    projects: z.array(projectSchema),

    skills: z.array(z.string()),

    certifications: z.array(certificationSchema),

    achievements: z.array(achievementSchema),

    languages: z.array(languageSchema),
});

export type ResumeFormValues = z.infer<typeof resumeSchema>;