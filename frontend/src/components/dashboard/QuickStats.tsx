"use client";

import {
  Briefcase,
  ClipboardList,
  FileText,
  Sparkles,
} from "lucide-react";

import { useDashboard } from "@/hooks/useDashboard";

import StatCard from "./StatCard";

export default function QuickStats() {
  const { data, isLoading, isError } = useDashboard();
  const stats = data?.data?.stats ?? {
    applications: 0,
    savedJobs: 0,
    interviews: 0,
    profileCompletion: 0,
    resumes: 0,
    atsScore: null,
    resumeScore: null,
  };

  const statItems = [
    {
      title: "ATS Score",
      value:
        stats.atsScore !== null
          ? `${Math.round(stats.atsScore)}%`
          : "Not analyzed",
      icon: Sparkles,
    },
    {
      title: "Saved Jobs",
      value: String(stats.savedJobs ?? 0),
      icon: Briefcase,
    },
    {
      title: "Applications",
      value: String(stats.applications ?? 0),
      icon: ClipboardList,
    },
    {
      title: "Resumes",
      value: String(stats.resumes ?? 0),
      icon: FileText,
    },
  ];

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-28 animate-pulse rounded-2xl border bg-muted/40"
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
        Unable to load dashboard overview.
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {statItems.map((item) => (
        <StatCard
          key={item.title}
          title={item.title}
          value={item.value}
          icon={item.icon}
        />
      ))}
    </div>
  );
}