"use client";

import Link from "next/link";
import { ArrowRight, CalendarClock } from "lucide-react";

import { useDashboard } from "@/hooks/useDashboard";

export default function UpcomingInterviews() {
  const { data, isLoading, isError } = useDashboard();
  const interviews = data?.data?.upcomingInterviews ?? [];

  return (
    <section className="surface-panel rounded-2xl border border-border p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Schedule</p>
          <h2 className="mt-1 text-lg font-semibold">Upcoming interviews</h2>
        </div>
        <CalendarClock className="h-5 w-5 text-primary" />
      </div>

      {isLoading ? <p className="mt-4 text-sm text-muted-foreground">Loading schedule...</p> : null}
      {isError ? <p className="mt-4 text-sm text-destructive">Unable to load interviews.</p> : null}
      {!isLoading && !isError && interviews.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">No upcoming interviews scheduled.</p>
      ) : null}
      {interviews.length > 0 && (
        <ul className="mt-4 divide-y divide-border">
          {interviews.map((interview) => (
            <li key={interview._id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{interview.job?.title ?? "Interview"} · {interview.job?.company ?? "Application"}</p>
                <p className="mt-1 text-xs capitalize text-muted-foreground">{interview.round} · {new Date(interview.scheduledAt).toLocaleString()}</p>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Link href="/interviews" className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary">
        Manage interviews <ArrowRight className="h-4 w-4" />
      </Link>
    </section>
  );
}