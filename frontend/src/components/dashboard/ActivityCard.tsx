"use client";

import { Briefcase } from "lucide-react";

import { useDashboard } from "@/hooks/useDashboard";

export default function ActivityCard() {
  const { data, isLoading, isError } = useDashboard();
  const recentApplications = data?.data?.recentApplications ?? [];

  const activities = recentApplications.slice(0, 4).map((application) => {
    const job = application.jobId as { title?: string } | null;
    const title = job?.title ? `Applied for ${job.title}` : "Applied to a role";
    const time = application.appliedAt
      ? new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(
          new Date(application.appliedAt)
        )
      : "Recently";

    return {
      title,
      time,
      icon: Briefcase,
      color: "border border-emerald-500/20 bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200",
    };
  });

  if (isLoading) {
    return (
      <div className="surface-panel rounded-2xl border border-border p-6">
        <div className="h-5 w-32 animate-pulse rounded-full bg-muted" />
        <div className="mt-6 space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="h-11 w-11 animate-pulse rounded-full bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-2/3 animate-pulse rounded-full bg-muted" />
                <div className="h-4 w-1/3 animate-pulse rounded-full bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-6 text-sm text-rose-700 dark:text-rose-300">
        Unable to load recent activity.
      </div>
    );
  }

  const visibleActivities = activities;

  return (
    <div className="surface-panel rounded-2xl border border-border p-4.5 sm:p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Insights</p>
          <h2 className="mt-2 text-xl font-semibold text-foreground">Recent activity</h2>
        </div>
      </div>

      <div className="space-y-5">
        {visibleActivities.length > 0 ? (
          visibleActivities.map((activity, index) => {
            const Icon = activity.icon;

            return (
              <div key={`${activity.title}-${index}`} className="flex items-start gap-4 rounded-xl border border-border bg-background p-3">
                <div className={`flex h-11 w-11 items-center justify-center rounded-full ${activity.color}`}>
                  <Icon className="h-4 w-4" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">{activity.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-sm text-muted-foreground">No recent activity yet.</p>
        )}
      </div>
    </div>
  );
}