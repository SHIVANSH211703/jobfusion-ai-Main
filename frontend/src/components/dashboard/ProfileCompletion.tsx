"use client";

import {
  Award,
  Briefcase,
  CheckCircle2,
  Circle,
  FileText,
  GraduationCap,
  User,
} from "lucide-react";

import { useDashboard } from "@/hooks/useDashboard";

const items = [
  { label: "Basic Information", icon: User },
  { label: "Education", icon: GraduationCap },
  { label: "Experience", icon: Briefcase },
  { label: "Resume Uploaded", icon: FileText },
  { label: "Skills Added", icon: Award },
];

export default function ProfileCompletion() {
  const { data, isLoading, isError } = useDashboard();
  const progress = data?.data?.stats?.profileCompletion ?? 0;

  if (isLoading) {
    return (
      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <div className="h-5 w-36 animate-pulse rounded bg-muted" />
        <div className="mt-5 h-3 animate-pulse rounded-full bg-muted" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-sm text-destructive">
        Unable to load profile data.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Profile Completion</h2>
        <span className="text-lg font-bold text-violet-600">{progress}%</span>
      </div>

      <div className="mt-5 h-3 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-6 space-y-4">
        {items.map((item) => {
          const Icon = item.icon;
          const completed =
            item.label === "Basic Information"
              ? Boolean(data?.data?.user?.name)
              : item.label === "Experience"
                ? Boolean(data?.data?.user?.experienceLevel)
                : item.label === "Resume Uploaded"
                  ? Boolean(data?.data?.latestResume)
                  : item.label === "Skills Added"
                    ? Boolean(data?.data?.user?.skills?.length)
                    : Boolean(data?.data?.user?.location);

          return (
            <div key={item.label} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Icon className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm">{item.label}</span>
              </div>

              {completed ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}