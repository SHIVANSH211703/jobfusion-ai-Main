"use client";

import React from "react";
import {
  CalendarDays,
  Clock3,
  CheckCircle2,
  Users,
} from "lucide-react";
import type { Interview } from "@/types/interview";
import type { JobApplication } from "@/types/job";

interface InterviewStatsProps {
  interviews: Interview[];
  applications: JobApplication[];
  onSelectFilter?: (filter: "all" | "upcoming" | "completed") => void;
  activeFilter?: string;
}

export default function InterviewStats({
  interviews,
  applications,
  onSelectFilter,
  activeFilter = "all",
}: InterviewStatsProps) {
  const now = Date.now();

  const total = interviews.length;
  const upcomingCount = interviews.filter(
    (item) => item.status === "scheduled" && new Date(item.scheduledAt).getTime() >= now
  ).length;

  const completedCount = interviews.filter((item) => item.status === "completed").length;

  const interviewStageApplicationsCount = applications.filter((app) => {
    return (
      app.status === "interview" ||
      app.status === "technical" ||
      app.status === "hr"
    );
  }).length;

  const statCards = [
    {
      id: "upcoming",
      label: "Upcoming Interviews",
      count: upcomingCount,
      icon: Clock3,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      filterValue: "upcoming" as const,
    },
    {
      id: "completed",
      label: "Completed",
      count: completedCount,
      icon: CheckCircle2,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      filterValue: "completed" as const,
    },
    {
      id: "all",
      label: "Total Scheduled",
      count: total,
      icon: CalendarDays,
      color: "text-primary",
      bg: "bg-primary/10",
      border: "border-primary/20",
      filterValue: "all" as const,
    },
    {
      id: "apps-in-stage",
      label: "Applications in Interview Stage",
      count: interviewStageApplicationsCount,
      icon: Users,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
      filterValue: undefined,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {statCards.map((card) => {
        const Icon = card.icon;
        const isSelected = card.filterValue && activeFilter === card.filterValue;

        const content = (
          <div className="flex items-center justify-between w-full">
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
                {card.label}
              </p>
              <p className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                {card.count}
              </p>
            </div>
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${card.bg} ${card.color}`}
            >
              <Icon className="h-5 w-5" />
            </div>
          </div>
        );

        if (card.filterValue) {
          return (
            <button
              key={card.id}
              type="button"
              onClick={() => card.filterValue && onSelectFilter?.(card.filterValue)}
              className={`flex rounded-2xl border p-4 text-left transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary ${
                isSelected
                  ? "border-primary bg-primary/5 ring-1 ring-primary shadow-sm"
                  : "border-border bg-card hover:border-primary/30"
              }`}
            >
              {content}
            </button>
          );
        }

        return (
          <div
            key={card.id}
            className="flex rounded-2xl border border-border bg-card p-4 text-left shadow-sm"
          >
            {content}
          </div>
        );
      })}
    </div>
  );
}
