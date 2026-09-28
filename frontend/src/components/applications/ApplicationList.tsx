"use client";

import React from "react";
import Link from "next/link";
import {
  Building2,
  MapPin,
  CalendarDays,
  FileText,
  ExternalLink,
  Eye,
  Trash2,
  Clock3,
  CalendarClock,
  Briefcase,
} from "lucide-react";
import type { JobApplication, ApplicationStatus } from "@/types/job";
import {
  ALL_STATUSES,
  getStatusBadgeClass,
  getStatusIcon,
  formatFollowUpDate,
} from "./applicationUtils";

interface ApplicationListProps {
  applications: JobApplication[];
  onSelectApplication: (application: JobApplication) => void;
  onViewResume: (resumeId: string, resumeTitle: string) => void;
  onStatusChange: (jobIdOrAppId: string, newStatus: ApplicationStatus) => void;
  onDeleteApplication: (application: JobApplication) => void;
  isUpdating?: boolean;
}

export default function ApplicationList({
  applications,
  onSelectApplication,
  onViewResume,
  onStatusChange,
  onDeleteApplication,
  isUpdating = false,
}: ApplicationListProps) {
  if (applications.length === 0) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 p-8 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground mb-4">
          <Briefcase className="h-7 w-7" />
        </div>
        <h3 className="text-base font-semibold text-foreground">No applications match your filter</h3>
        <p className="mt-1 text-sm text-muted-foreground max-w-sm">
          Try clearing or adjusting your search keywords and status filters to see your applications.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th scope="col" className="px-6 py-4">Job & Company</th>
                <th scope="col" className="px-6 py-4">Location</th>
                <th scope="col" className="px-6 py-4">Status</th>
                <th scope="col" className="px-6 py-4">Applied Date</th>
                <th scope="col" className="px-6 py-4">Follow-up</th>
                <th scope="col" className="px-6 py-4">Resume</th>
                <th scope="col" className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {applications.map((application) => {
                const job =
                  application.jobId && typeof application.jobId === "object"
                    ? application.jobId
                    : application.job;

                const targetId = job?._id || application._id;
                const status = application.status || "applied";
                const resumeObj =
                  typeof application.resumeId === "object" && application.resumeId !== null
                    ? application.resumeId
                    : null;
                const resumeIdStr =
                  resumeObj?._id ||
                  (typeof application.resumeId === "string" ? application.resumeId : null);
                const resumeName =
                  resumeObj?.title ||
                  resumeObj?.originalName ||
                  resumeObj?.fileName ||
                  "Attached Resume";

                const followUp = formatFollowUpDate(application.followUpDate);

                return (
                  <tr
                    key={application._id || `${targetId}-${application.appliedAt}`}
                    className="group transition-colors hover:bg-muted/30"
                  >
                    {/* Job & Company */}
                    <td className="px-6 py-4">
                      <div className="min-w-0 max-w-xs">
                        <button
                          type="button"
                          onClick={() => onSelectApplication(application)}
                          className="text-left font-semibold text-foreground hover:text-primary transition-colors truncate block max-w-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                        >
                          {job?.title || "Job Application"}
                        </button>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                          <Building2 className="h-3.5 w-3.5 shrink-0" />
                          <span className="truncate">{job?.company || "Company Unavailable"}</span>
                        </div>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-xs">
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground/80" />
                        <span>{job?.location || "Not specified"}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium capitalize ${getStatusBadgeClass(
                            status
                          )}`}
                        >
                          {getStatusIcon(status)}
                          {status}
                        </span>

                        <select
                          aria-label={`Change status for ${job?.title || "application"}`}
                          value={status}
                          disabled={isUpdating}
                          onChange={(e) =>
                            onStatusChange(targetId, e.target.value as ApplicationStatus)
                          }
                          className="h-8 rounded-lg border border-border bg-background px-2 text-xs font-medium capitalize text-foreground shadow-sm hover:border-primary/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                          {ALL_STATUSES.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>

                    {/* Applied Date */}
                    <td className="px-6 py-4 text-xs text-muted-foreground whitespace-nowrap">
                      {application.appliedAt ? (
                        <div className="flex items-center gap-1.5">
                          <CalendarDays className="h-3.5 w-3.5 shrink-0" />
                          <span>{new Date(application.appliedAt).toLocaleDateString()}</span>
                        </div>
                      ) : (
                        "—"
                      )}
                    </td>

                    {/* Follow-up Date */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {followUp ? (
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium ${
                            followUp.isOverdue
                              ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20"
                              : "bg-muted text-muted-foreground border border-border"
                          }`}
                        >
                          <CalendarClock className="h-3 w-3" />
                          {followUp.formatted}
                          {followUp.isOverdue && " (Due)"}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground/60">—</span>
                      )}
                    </td>

                    {/* Resume */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {resumeIdStr ? (
                        <button
                          type="button"
                          onClick={() => onViewResume(resumeIdStr, resumeName)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-medium text-foreground hover:bg-muted hover:border-primary/50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <FileText className="h-3.5 w-3.5 text-primary" />
                          <span className="max-w-[120px] truncate">{resumeName}</span>
                        </button>
                      ) : (
                        <span className="text-xs text-muted-foreground/60">None attached</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onSelectApplication(application)}
                          title="View Details"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View Details</span>
                        </button>

                        {(status === "interview" || status === "technical" || status === "hr") && (
                          <Link
                            href={`/interviews?applicationId=${application._id}&action=schedule`}
                            title="Schedule Interview Round"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 transition-colors"
                          >
                            <CalendarDays className="h-4 w-4" />
                            <span className="sr-only">Schedule Interview</span>
                          </Link>
                        )}

                        {job?._id && (
                          <Link
                            href={`/jobs/${job._id}`}
                            title="View Job Post"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                          >
                            <ExternalLink className="h-4 w-4" />
                            <span className="sr-only">View Job Post</span>
                          </Link>
                        )}

                        <button
                          type="button"
                          onClick={() => onDeleteApplication(application)}
                          title="Withdraw Application"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:border-destructive/30 hover:bg-destructive/10 hover:text-destructive transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Withdraw Application</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile & Tablet Card List View */}
      <div className="lg:hidden space-y-3">
        {applications.map((application) => {
          const job =
            application.jobId && typeof application.jobId === "object"
              ? application.jobId
              : application.job;

          const targetId = job?._id || application._id;
          const status = application.status || "applied";
          const resumeObj =
            typeof application.resumeId === "object" && application.resumeId !== null
              ? application.resumeId
              : null;
          const resumeIdStr =
            resumeObj?._id ||
            (typeof application.resumeId === "string" ? application.resumeId : null);
          const resumeName =
            resumeObj?.title ||
            resumeObj?.originalName ||
            resumeObj?.fileName ||
            "Attached Resume";

          const followUp = formatFollowUpDate(application.followUpDate);

          return (
            <div
              key={application._id || `${targetId}-${application.appliedAt}`}
              className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-sm space-y-3.5 transition-shadow hover:shadow-md"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <button
                    type="button"
                    onClick={() => onSelectApplication(application)}
                    className="text-left font-semibold text-foreground hover:text-primary transition-colors text-base line-clamp-1"
                  >
                    {job?.title || "Job Application"}
                  </button>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                    <Building2 className="h-3.5 w-3.5 shrink-0" />
                    <span className="font-medium text-foreground/80">{job?.company || "Company Unavailable"}</span>
                    {job?.location && (
                      <>
                        <span className="text-muted-foreground/40">•</span>
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground/70" />
                        <span className="truncate">{job.location}</span>
                      </>
                    )}
                  </div>
                </div>

                <span
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${getStatusBadgeClass(
                    status
                  )}`}
                >
                  {getStatusIcon(status)}
                  {status}
                </span>
              </div>

              {/* Metadata rows */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground border-t border-b border-border/60 py-2.5">
                {application.appliedAt && (
                  <div className="flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5 shrink-0 text-muted-foreground/70" />
                    <span>Applied {new Date(application.appliedAt).toLocaleDateString()}</span>
                  </div>
                )}

                {followUp && (
                  <div className="flex items-center gap-1.5">
                    <CalendarClock
                      className={`h-3.5 w-3.5 shrink-0 ${
                        followUp.isOverdue ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground/70"
                      }`}
                    />
                    <span
                      className={
                        followUp.isOverdue
                          ? "font-medium text-amber-600 dark:text-amber-400"
                          : ""
                      }
                    >
                      Follow-up: {followUp.formatted}
                    </span>
                  </div>
                )}

                {resumeIdStr && (
                  <button
                    type="button"
                    onClick={() => onViewResume(resumeIdStr, resumeName)}
                    className="inline-flex items-center gap-1.5 text-primary hover:underline font-medium min-h-[36px]"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    <span className="truncate max-w-[140px]">{resumeName}</span>
                  </button>
                )}
              </div>

              {/* Status Selector + Actions */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <div className="flex items-center gap-2 flex-1 min-w-[180px]">
                  <label htmlFor={`mobile-status-${application._id}`} className="text-xs font-medium text-muted-foreground sr-only">
                    Change Status
                  </label>
                  <select
                    id={`mobile-status-${application._id}`}
                    value={status}
                    disabled={isUpdating}
                    onChange={(e) =>
                      onStatusChange(targetId, e.target.value as ApplicationStatus)
                    }
                    className="h-11 w-full rounded-xl border border-border bg-background px-3 text-xs font-semibold capitalize text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {ALL_STATUSES.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        Status: {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  {(status === "interview" || status === "technical" || status === "hr") && (
                    <Link
                      href={`/interviews?applicationId=${application._id}&action=schedule`}
                      className="inline-flex h-11 items-center justify-center gap-1 rounded-xl border border-blue-500/30 bg-blue-500/10 px-2.5 text-xs font-semibold text-blue-700 dark:text-blue-300 hover:bg-blue-500/20 transition-colors"
                      title="Schedule Interview"
                    >
                      <CalendarDays className="h-4 w-4" />
                      <span className="hidden xs:inline">Interview</span>
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={() => onSelectApplication(application)}
                    className="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl border border-border bg-background px-3 text-xs font-medium text-foreground hover:bg-muted transition-colors active:scale-95"
                  >
                    <Eye className="h-4 w-4" />
                    <span>Details</span>
                  </button>

                  {job?._id && (
                    <Link
                      href={`/jobs/${job._id}`}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition-colors active:scale-95"
                      title="View Job"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span className="sr-only">View Job</span>
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={() => onDeleteApplication(application)}
                    title="Withdraw"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-background text-muted-foreground hover:border-destructive/30 hover:bg-destructive/10 hover:text-destructive transition-colors active:scale-95"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Withdraw</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
