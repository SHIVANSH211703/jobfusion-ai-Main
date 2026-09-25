"use client";

import { ArrowRight, Briefcase, MapPin } from "lucide-react";
import Link from "next/link";

import { useDashboard } from "@/hooks/useDashboard";

export default function RecommendedJobs() {
  const { data, isLoading, isError } = useDashboard();
  const jobs = data?.data?.recommendedJobs ?? [];

  if (isLoading) {
    return (
      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <div className="h-5 w-32 animate-pulse rounded bg-muted" />
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
      <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-sm text-destructive">
        Unable to load recommended jobs.
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recommended Jobs</h2>
        </div>

        <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
          No jobs are available for your profile yet.
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Recommended Jobs</h2>
      </div>

      <div className="space-y-5">
        {jobs.map((job) => (
          <div key={job._id} className="rounded-xl border p-5 transition hover:border-violet-500 hover:shadow-md">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold">{job.title}</h3>

                <div className="mt-1 flex items-center gap-2 text-muted-foreground">
                  <Briefcase className="h-4 w-4" />
                  <span>{job.company}</span>
                </div>

                <div className="mt-1 flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{job.location || "Not specified"}</span>
                </div>
              </div>

              {job.jobType ? (
                <div className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                  {job.jobType}
                </div>
              ) : null}
            </div>

            {job.skills && job.skills.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {job.skills.slice(0, 4).map((skill) => (
                  <span key={skill} className="rounded-full bg-muted px-3 py-1 text-xs">
                    {skill}
                  </span>
                ))}
              </div>
            ) : null}

            <Link href={`/jobs/${job._id}`} className="mt-5 flex items-center gap-2 text-sm font-medium text-violet-600 transition-all hover:gap-3">
              View Details
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}