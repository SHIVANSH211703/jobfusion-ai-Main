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
      <div className="surface-panel rounded-2xl border border-border p-6">
        <div className="h-5 w-36 animate-pulse rounded-full bg-muted" />
        <div className="mt-5 h-3 animate-pulse rounded-full bg-muted" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-6 text-sm text-rose-700 dark:text-rose-300">
        Unable to load profile data.
      </div>
    );
  }

  return (
    <div className="surface-panel rounded-2xl border border-border p-4.5 sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Profile</p>
          <h2 className="mt-2 text-xl font-semibold text-foreground">Strength</h2>
        </div>
        <span className="text-xl font-semibold text-primary">{progress}%</span>
      </div>

      <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
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
            <div key={item.label} className="flex items-center justify-between rounded-xl border border-border bg-background px-3 py-2.5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-muted text-muted-foreground">
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-sm text-foreground">{item.label}</span>
              </div>

              {completed ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
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