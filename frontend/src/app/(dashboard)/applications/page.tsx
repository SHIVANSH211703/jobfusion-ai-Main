"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Briefcase,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  ExternalLink,
  Loader2,
  MapPin,
  XCircle,
} from "lucide-react";

import { useApplications } from "@/hooks/jobs/useApplications";

export default function ApplicationsPage() {
  const {
    data,
    isLoading,
    isError,
  } = useApplications();

  const rawData = data?.data;

  let applications: any[] = [];

  /*
   * Backend may return:
   *
   * data: []
   *
   * OR
   *
   * data: {
   *   applications: []
   * }
   *
   * OR
   *
   * data: {
   *   jobs: []
   * }
   */

  if (Array.isArray(rawData)) {
    applications = rawData;
  } else if (
    rawData &&
    typeof rawData === "object"
  ) {
    const objectData = rawData as any;

    if (Array.isArray(objectData.applications)) {
      applications = objectData.applications;
    } else if (Array.isArray(objectData.jobs)) {
      applications = objectData.jobs;
    }
  }

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "interview":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";

      case "offer":
        return "bg-green-500/10 text-green-600 border-green-500/20";

      case "rejected":
        return "bg-red-500/10 text-red-600 border-red-500/20";

      case "withdrawn":
        return "bg-gray-500/10 text-gray-600 border-gray-500/20";

      default:
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "interview":
        return <Clock3 className="h-4 w-4" />;

      case "offer":
        return (
          <CheckCircle2 className="h-4 w-4" />
        );

      case "rejected":
        return (
          <XCircle className="h-4 w-4" />
        );

      default:
        return (
          <Briefcase className="h-4 w-4" />
        );
    }
  };

  /*
   * Loading state
   */
  if (isLoading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />

          <p className="text-sm text-muted-foreground">
            Loading your applications...
          </p>
        </div>
      </div>
    );
  }

  /*
   * Error state
   */
  if (isError) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link
            href="/jobs"
            className="flex h-10 w-10 items-center justify-center rounded-lg border transition hover:bg-muted"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>

          <div>
            <h1 className="text-2xl font-bold">
              My Applications
            </h1>

            <p className="text-sm text-muted-foreground">
              Track all your job applications
            </p>
          </div>
        </div>

        <div className="flex min-h-[350px] flex-col items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
            <XCircle className="h-7 w-7 text-destructive" />
          </div>

          <h2 className="text-xl font-semibold">
            Unable to load applications
          </h2>

          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            We couldn't fetch your applications.
            Please try again.
          </p>

          <Link
            href="/applications"
            className="mt-6 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            Try Again
          </Link>
        </div>
      </div>
    );
  }

  /*
   * Empty state
   */
  if (applications.length === 0) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            href="/jobs"
            className="flex h-10 w-10 items-center justify-center rounded-lg border transition hover:bg-muted"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>

          <div>
            <h1 className="text-2xl font-bold">
              My Applications
            </h1>

            <p className="text-sm text-muted-foreground">
              Track all your job applications
            </p>
          </div>
        </div>

        {/* Empty Card */}
        <div className="flex min-h-[450px] flex-col items-center justify-center rounded-2xl border border-dashed p-8 text-center">
          <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <Briefcase className="h-10 w-10 text-primary" />
          </div>

          <h2 className="text-2xl font-semibold">
            No applications yet
          </h2>

          <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            You haven't applied to any jobs yet.
            Start exploring jobs and apply to the
            opportunities that match your skills.
          </p>

          <Link
            href="/jobs"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            <Briefcase className="h-4 w-4" />
            Find Jobs
          </Link>
        </div>
      </div>
    );
  }

  /*
   * Applications list
   */
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/jobs"
            className="flex h-10 w-10 items-center justify-center rounded-lg border transition hover:bg-muted"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>

          <div>
            <h1 className="text-2xl font-bold">
              My Applications
            </h1>

            <p className="text-sm text-muted-foreground">
              Track all your job applications
            </p>
          </div>
        </div>

        <Link
          href="/jobs"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90"
        >
          <Briefcase className="h-4 w-4" />
          Find More Jobs
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border bg-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Total Applications
              </p>

              <p className="mt-2 text-2xl font-bold">
                {applications.length}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
              <Briefcase className="h-5 w-5 text-primary" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Interviews
              </p>

              <p className="mt-2 text-2xl font-bold">
                {
                  applications.filter(
                    (application) =>
                      application.status ===
                      "interview"
                  ).length
                }
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10">
              <Clock3 className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Offers
              </p>

              <p className="mt-2 text-2xl font-bold">
                {
                  applications.filter(
                    (application) =>
                      application.status ===
                      "offer"
                  ).length
                }
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-500/10">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Applications */}
      <div className="space-y-4">
        {applications.map((application) => {
          /*
           * Backend may populate jobId:
           *
           * jobId: {
           *   _id,
           *   title,
           *   company,
           *   location
           * }
           *
           * Or it may return job separately.
           */
          const job =
            application.jobId &&
            typeof application.jobId === "object"
              ? application.jobId
              : application.job;

          const status =
            application.status || "applied";

          return (
            <div
              key={
                application._id ||
                `${job?._id}-${application.appliedAt}`
              }
              className="rounded-2xl border bg-card p-5 transition hover:shadow-md"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                {/* Job Information */}
                <div className="min-w-0 space-y-3">
                  <div>
                    <h2 className="truncate text-lg font-semibold">
                      {job?.title ||
                        "Job Application"}
                    </h2>

                    {job?.company && (
                      <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                        <Building2 className="h-4 w-4 shrink-0" />

                        <span>
                          {job.company}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
                    {job?.location && (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 shrink-0" />

                        <span>
                          {job.location}
                        </span>
                      </div>
                    )}

                    {application.appliedAt && (
                      <div className="flex items-center gap-1.5">
                        <CalendarDays className="h-4 w-4 shrink-0" />

                        <span>
                          Applied{" "}
                          {new Date(
                            application.appliedAt
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status + Action */}
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium capitalize ${getStatusStyles(
                      status
                    )}`}
                  >
                    {getStatusIcon(status)}

                    {status}
                  </span>

                  {job?._id && (
                    <Link
                      href={`/jobs/${job._id}`}
                      className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition hover:bg-muted"
                    >
                      View Job

                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  )}
                </div>
              </div>

              {/* Notes */}
              {application.notes && (
                <div className="mt-5 rounded-xl bg-muted/50 p-4">
                  <p className="text-xs font-medium text-muted-foreground">
                    Notes
                  </p>

                  <p className="mt-1 text-sm">
                    {application.notes}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}