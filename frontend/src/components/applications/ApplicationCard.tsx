"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Building2,
  MapPin,
  Calendar,
  FileText,
  Eye,
  ExternalLink,
  MoreVertical,
  CalendarClock,
  Clock,
  Sparkles,
  Trash2,
} from "lucide-react";
import type { JobApplication, ApplicationStatus } from "@/types/job";
import {
  ALL_STATUSES,
  getStatusBadgeClass,
  getStatusLabel,
  formatFollowUpDate,
} from "./applicationUtils";

interface ApplicationCardProps {
  application: JobApplication;
  onViewDetails: (application: JobApplication) => void;
  onViewResume?: (resumeId: string, title: string) => void;
  onStatusChange: (jobId: string, status: ApplicationStatus) => void;
  onDelete?: (application: JobApplication) => void;
  isDragging?: boolean;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd?: (e: React.DragEvent<HTMLDivElement>) => void;
}

export default function ApplicationCard({
  application,
  onViewDetails,
  onViewResume,
  onStatusChange,
  onDelete,
  isDragging = false,
  onDragStart,
  onDragEnd,
}: ApplicationCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const job =
    application.jobId && typeof application.jobId === "object"
      ? application.jobId
      : application.job;

  const targetJobId = job?._id || application._id;
  const status = application.status || "applied";
  const resume = application.resumeId;
  const followUp = formatFollowUpDate(application.followUpDate);

  const appliedDate = application.appliedAt
    ? new Date(application.appliedAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={`group relative rounded-xl border bg-card p-4 transition-all duration-200 hover:shadow-md cursor-grab active:cursor-grabbing ${
        isDragging
          ? "opacity-40 border-primary ring-2 ring-primary/30"
          : "border-border/80 hover:border-primary/40"
      }`}
    >
      {/* Top Header: Company + Actions Menu */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h4
            onClick={() => onViewDetails(application)}
            className="text-sm font-semibold text-foreground truncate hover:text-primary transition cursor-pointer"
            title={job?.title || "Job Application"}
          >
            {job?.title || "Job Application"}
          </h4>

          {job?.company && (
            <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground truncate">
              <Building2 className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{job.company}</span>
            </div>
          )}
        </div>

        {/* Action Menu Button */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((prev) => !prev);
            }}
            aria-label="Application options"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition"
          >
            <MoreVertical className="h-4 w-4" />
          </button>

          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-20"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute right-0 top-9 z-30 w-48 rounded-xl border border-border bg-card p-1.5 shadow-xl animate-in fade-in zoom-in-95 duration-150">
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onViewDetails(application);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-foreground hover:bg-muted transition text-left"
                >
                  <Eye className="h-3.5 w-3.5" />
                  View Details
                </button>

                {job?._id && (
                  <Link
                    href={`/jobs/${job._id}`}
                    onClick={() => setMenuOpen(false)}
                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-foreground hover:bg-muted transition text-left"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Open Job Listing
                  </Link>
                )}

                {resume && (
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onViewResume?.(resume._id, resume.title || "Resume");
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-foreground hover:bg-muted transition text-left"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    View Attached Resume
                  </button>
                )}

                {(status === "interview" || status === "technical" || status === "hr") && (
                  <>
                    <Link
                      href={`/interviews?applicationId=${application._id}&action=schedule`}
                      onClick={() => setMenuOpen(false)}
                      className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-500/10 transition text-left"
                    >
                      <Calendar className="h-3.5 w-3.5" />
                      Schedule Interview Round
                    </Link>
                    <Link
                      href={`/interviews?applicationId=${application._id}&action=prepare`}
                      onClick={() => setMenuOpen(false)}
                      className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/10 transition text-left"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      AI Interview Preparation
                    </Link>
                  </>
                )}

                <div className="my-1 border-t border-border" />

                <div className="px-2 py-1 text-[10px] font-semibold uppercase text-muted-foreground">
                  Move Status
                </div>

                <div className="max-h-36 overflow-y-auto space-y-0.5">
                  {ALL_STATUSES.map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      disabled={status === item.key}
                      onClick={() => {
                        setMenuOpen(false);
                        onStatusChange(targetJobId, item.key);
                      }}
                      className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition ${
                        status === item.key
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <span>{item.label}</span>
                      {status === item.key && (
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      )}
                    </button>
                  ))}
                </div>

                {onDelete && (
                  <>
                    <div className="my-1 border-t border-border" />
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        onDelete(application);
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-destructive hover:bg-destructive/10 transition text-left"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Remove Application
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Meta Row: Location + Salary */}
      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        {job?.location && (
          <div className="flex items-center gap-1 truncate max-w-[150px]">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="truncate">{job.location}</span>
          </div>
        )}
        {job?.salary && (job.salary.min || job.salary.max) && (
          <span className="rounded bg-muted px-1.5 py-0.5 text-[11px] font-medium text-foreground">
            {job.salary.min ? `₹${job.salary.min.toLocaleString()}` : ""}
            {job.salary.min && job.salary.max ? " - " : ""}
            {job.salary.max ? `₹${job.salary.max.toLocaleString()}` : ""}
          </span>
        )}
      </div>

      {/* Badges / Information: Resume & Follow-up */}
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {/* Applied Date */}
        {appliedDate && (
          <span className="inline-flex items-center gap-1 rounded-md bg-muted/60 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {appliedDate}
          </span>
        )}

        {/* Resume Pill */}
        {resume && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onViewResume?.(resume._id, resume.title || "Resume");
            }}
            className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2 py-0.5 text-[11px] font-medium text-foreground hover:bg-muted hover:border-primary/40 transition"
            title={`Resume: ${resume.title || "Resume"}`}
          >
            <FileText className="h-3 w-3 text-primary shrink-0" />
            <span className="truncate max-w-[100px]">
              {resume.title || "Resume"}
            </span>
          </button>
        )}

        {/* Follow-up Reminder Badge */}
        {followUp && (
          <span
            className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium border ${
              followUp.isOverdue
                ? "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20"
                : followUp.isToday
                ? "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20"
                : "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20"
            }`}
          >
            <CalendarClock className="h-3 w-3 shrink-0" />
            {followUp.isOverdue
              ? `Due: ${followUp.text}`
              : followUp.isToday
              ? "Follow-up today"
              : `Follow-up: ${followUp.text}`}
          </span>
        )}
      </div>

      {/* Note preview if present */}
      {application.notes && (
        <p className="mt-2 text-xs text-muted-foreground line-clamp-1 italic bg-muted/30 px-2 py-1 rounded">
          &ldquo;{application.notes}&rdquo;
        </p>
      )}

      {/* Quick Interview Stage Link */}
      {(status === "interview" || status === "technical" || status === "hr") && (
        <div className="mt-2.5 flex items-center justify-between rounded-lg bg-blue-500/10 px-2.5 py-1 text-[11px] border border-blue-500/20 text-blue-700 dark:text-blue-300">
          <span className="font-semibold flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            Interview Stage
          </span>
          <Link
            href={`/interviews?applicationId=${application._id}&action=schedule`}
            onClick={(e) => e.stopPropagation()}
            className="font-bold underline hover:opacity-80"
          >
            Schedule &rarr;
          </Link>
        </div>
      )}

      {/* Card Footer: Status Selector & Quick Details */}
      <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-2.5">
        <select
          value={status}
          onChange={(e) =>
            onStatusChange(targetJobId, e.target.value as ApplicationStatus)
          }
          onClick={(e) => e.stopPropagation()}
          aria-label={`Change status for ${job?.title || "application"}`}
          className={`h-7 rounded-lg border px-2 text-xs font-semibold capitalize cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary ${getStatusBadgeClass(
            status
          )}`}
        >
          {ALL_STATUSES.map((item) => (
            <option
              key={item.key}
              value={item.key}
              className="bg-card text-foreground font-normal"
            >
              {item.label}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={() => onViewDetails(application)}
          className="text-xs font-medium text-primary hover:underline"
        >
          Details &rarr;
        </button>
      </div>
    </div>
  );
}
