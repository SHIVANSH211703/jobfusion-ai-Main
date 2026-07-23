"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { BriefcaseBusiness } from "lucide-react";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

export default function AuthLayout({
  children,
  title,
  subtitle,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Section */}
      <div className="hidden lg:flex relative overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,.2),transparent_40%)]" />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link
            href="/"
            className="flex items-center gap-3 text-2xl font-bold"
          >
            <BriefcaseBusiness className="h-8 w-8" />
            JobFusion AI
          </Link>

          <div>
            <h2 className="text-5xl font-bold leading-tight">
              Build your dream career with AI.
            </h2>

            <p className="mt-6 text-lg text-white/90 leading-8 max-w-lg">
              Create ATS-friendly resumes, generate AI cover letters,
              practice interviews, and track every application from one
              powerful dashboard.
            </p>
          </div>

          <div className="text-sm text-white/80">
            © {new Date().getFullYear()} JobFusion AI
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center justify-center bg-background px-6 py-10">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <h1 className="text-4xl font-bold tracking-tight">
              {title}
            </h1>

            <p className="mt-2 text-muted-foreground">
              {subtitle}
            </p>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}