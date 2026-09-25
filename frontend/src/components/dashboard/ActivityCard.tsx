"use client";

import { Briefcase, FileText, Sparkles, User } from "lucide-react";

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
      color: "bg-emerald-500",
    };
  });

  if (isLoading) {
    return (
      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <div className="h-5 w-32 animate-pulse rounded bg-muted" />
        <div className="mt-6 space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="h-11 w-11 animate-pulse rounded-full bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
                <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-sm text-destructive">
        Unable to load recent activity.
      </div>
    );
  }

  const atsScore = data?.data?.stats?.atsScore ?? null;

  const fallbackActivities = [
    {
      title: "Resume uploaded",
      time: data?.data?.latestResume ? "Latest resume" : "No resume yet",
      icon: FileText,
      color: "bg-blue-500",
    },
    {
      title: "Profile updated",
      time: data?.data?.user?.headline ? "Profile ready" : "Profile incomplete",
      icon: User,
      color: "bg-amber-500",
    },
    {
      title: "ATS score available",
      time: atsScore !== null ? `${Math.round(atsScore)}%` : "Not analyzed yet",
      icon: Sparkles,
      color: "bg-violet-500",
    },
  ];

  const visibleActivities = activities.length > 0 ? activities : fallbackActivities;

  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Recent Activity</h2>
      </div>

      <div className="space-y-6">
        {visibleActivities.length > 0 ? (
          visibleActivities.map((activity, index) => {
            const Icon = activity.icon;

            return (
              <div key={`${activity.title}-${index}`} className="flex items-start gap-4">
                <div className={`flex h-11 w-11 items-center justify-center rounded-full ${activity.color} text-white`}>
                  <Icon className="h-5 w-5" />
                </div>

                <div className="flex-1">
                  <p className="font-medium">{activity.title}</p>
                  <p className="text-sm text-muted-foreground">{activity.time}</p>
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