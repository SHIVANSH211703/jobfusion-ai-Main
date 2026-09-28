"use client";

import {
  Briefcase,
  ClipboardList,
  FileText,
  Sparkles,
} from "lucide-react";

import { CountUp } from "@/components/ui/premium";
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
      value: stats.atsScore !== null ? `${Math.round(stats.atsScore)}%` : "Not analyzed",
      icon: Sparkles,
      hasNumber: stats.atsScore !== null,
      numericValue: stats.atsScore ?? 0,
      accentClass: "border-accent/20 bg-accent/10 text-accent",
    },
    {
      title: "Saved Jobs",
      value: String(stats.savedJobs ?? 0),
      icon: Briefcase,
      hasNumber: true,
      numericValue: stats.savedJobs ?? 0,
      accentClass: "border-primary/20 bg-primary/10 text-primary",
    },
    {
      title: "Applications",
      value: String(stats.applications ?? 0),
      icon: ClipboardList,
      hasNumber: true,
      numericValue: stats.applications ?? 0,
      accentClass: "border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400",
    },
    {
      title: "Resumes",
      value: String(stats.resumes ?? 0),
      icon: FileText,
      hasNumber: true,
      numericValue: stats.resumes ?? 0,
      accentClass: "border-border bg-secondary text-foreground",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="surface-panel h-32 animate-pulse rounded-2xl border border-border" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-4 text-sm text-rose-300">
        Unable to load dashboard overview.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4">
      {statItems.map((item) => (
        <StatCard
          key={item.title}
          title={item.title}
          accentClass={item.accentClass}
          value={
            item.hasNumber ? (
              <CountUp
                value={item.numericValue}
                duration={1200}
                suffix={item.title === "ATS Score" ? "%" : ""}
                className="text-3xl font-semibold text-foreground"
              />
            ) : (
              <span className="text-3xl font-semibold text-foreground">{item.value}</span>
            )
          }
          icon={item.icon}
        />
      ))}
    </div>
  );
}