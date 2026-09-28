"use client";

import { ArrowRight, Briefcase, MapPin } from "lucide-react";
import Link from "next/link";

import { useDashboard } from "@/hooks/useDashboard";

export default function RecommendedJobs() {
  const { data, isLoading, isError } = useDashboard();
  const jobs = data?.data?.recommendedJobs ?? [];

  if (isLoading) {
    return (
      <div className="surface-panel rounded-2xl border border-border p-6">
        <div className="h-5 w-32 animate-pulse rounded-full bg-muted" />
        <div className="mt-6 space-y-4">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="h-28 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-6 text-sm text-rose-700 dark:text-rose-300">
        Unable to load recommended jobs.
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="surface-panel rounded-2xl border border-border p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Jobs</p>
            <h2 className="mt-2 text-xl font-semibold text-foreground">Recommended</h2>
          </div>
        </div>

        <div className="rounded-xl border border-dashed border-border bg-background p-6 text-center text-sm text-muted-foreground">
          No jobs are available for your profile yet.
        </div>
      </div>
    );
  }

  return (
    <div className="surface-panel rounded-2xl border border-border p-4.5 sm:p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Jobs</p>
          <h2 className="mt-2 text-xl font-semibold text-foreground">Recommended</h2>
        </div>
      </div>

      <div className="space-y-4">
        {jobs.map((job) => (
          <div key={job._id} className="group rounded-xl border border-border bg-background p-4 sm:p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-muted/50">
            <div className="flex flex-col gap-2 xs:flex-row xs:items-start xs:justify-between xs:gap-3">
              <div className="min-w-0">
                <h3 className="text-lg font-semibold text-foreground">{job.title}</h3>

                <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <Briefcase className="h-4 w-4" />
                  <span>{job.company}</span>
                </div>

                <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{job.location || "Not specified"}</span>
                </div>
              </div>

              {job.jobType ? (
                <div className="rounded-full border border-emerald-500/25 bg-emerald-100 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-200">
                  {job.jobType}
                </div>
              ) : null}
            </div>

            {job.skills && job.skills.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {job.skills.slice(0, 4).map((skill) => (
                  <span key={skill} className="rounded-full border border-border bg-muted px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.1em] text-muted-foreground">
                    {skill}
                  </span>
                ))}
              </div>
            ) : null}

            <Link href={`/jobs/${job._id}`} className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary transition-all group-hover:gap-3">
              View Details
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}