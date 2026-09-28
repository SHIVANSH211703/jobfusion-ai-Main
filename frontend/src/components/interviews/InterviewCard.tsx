"use client";

import React, { useState } from "react";
import {
  Building2,
  Calendar,
  Clock,
  ExternalLink,
  Copy,
  Check,
  Sparkles,
  MoreVertical,
  CheckCircle2,
  Trash2,
  Edit,
  Eye,
  User,
  Video,
  FileText,
  MapPin,
} from "lucide-react";
import type { Interview } from "@/types/interview";
import {
  getRoundBadgeClass,
  getRoundIcon,
  getRoundLabel,
  getTypeBadgeClass,
  getTypeIcon,
  getTypeLabel,
  getStatusBadgeClass,
  formatInterviewDateTime,
} from "./interviewUtils";
import { toast } from "sonner";

interface InterviewCardProps {
  interview: Interview;
  onViewDetails: (interview: Interview) => void;
  onEdit: (interview: Interview) => void;
  onComplete: (interview: Interview) => void;
  onDelete: (interview: Interview) => void;
  onPrepare: (applicationId: string) => void;
}

export default function InterviewCard({
  interview,
  onViewDetails,
  onEdit,
  onComplete,
  onDelete,
  onPrepare,
}: InterviewCardProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const application =
    typeof interview.applicationId === "object" ? interview.applicationId : null;
  const job =
    application?.jobId && typeof application.jobId === "object"
      ? application.jobId
      : application?.job;

  const company = job?.company || "Company Unavailable";
  const jobTitle = job?.title || "Role Unavailable";
  const location = job?.location;

  const dt = formatInterviewDateTime(interview.scheduledAt);
  const isCompleted = interview.status === "completed";
  const isCancelled = interview.status === "cancelled";
  const isUpcoming = interview.status === "scheduled" && !dt.isPast;

  const handleCopyMeetingLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!interview.meetingLink) return;
    navigator.clipboard.writeText(interview.meetingLink);
    setCopiedLink(true);
    toast.success("Meeting link copied to clipboard");
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="group relative flex flex-col rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:border-primary/40">
      {/* Top Header: Company, Role & Status Badges */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${getRoundBadgeClass(
                interview.round
              )}`}
            >
              {getRoundIcon(interview.round)}
              {getRoundLabel(interview.round)}
            </span>

            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-2.5 py-0.5 text-xs font-medium text-muted-foreground capitalize">
              {getTypeIcon(interview.type)}
              {getTypeLabel(interview.type)}
            </span>

            {interview.status !== "scheduled" && (
              <span
                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${getStatusBadgeClass(
                  interview.status
                )}`}
              >
                {interview.status}
              </span>
            )}
          </div>

          <h3
            onClick={() => onViewDetails(interview)}
            className="cursor-pointer text-base sm:text-lg font-bold text-foreground hover:text-primary transition-colors truncate"
          >
            {jobTitle}
          </h3>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground mt-1">
            <div className="flex items-center gap-1.5 font-medium text-foreground/80">
              <Building2 className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              <span>{company}</span>
            </div>
            {location && (
              <div className="flex items-center gap-1 text-muted-foreground/70">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{location}</span>
              </div>
            )}
          </div>
        </div>

        {/* Top Right: Kebab Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(!menuOpen);
            }}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label="Interview actions"
          >
            <MoreVertical className="h-4 w-4" />
          </button>

          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute right-0 top-10 z-50 w-44 rounded-xl border border-border bg-card p-1 shadow-xl animate-in fade-in zoom-in-95">
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onViewDetails(interview);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-foreground hover:bg-muted transition text-left"
                >
                  <Eye className="h-3.5 w-3.5" />
                  View Details
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onEdit(interview);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-foreground hover:bg-muted transition text-left"
                >
                  <Edit className="h-3.5 w-3.5" />
                  Reschedule / Edit
                </button>

                {!isCompleted && !isCancelled && (
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onComplete(interview);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-emerald-600 hover:bg-emerald-500/10 transition text-left"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Mark Completed
                  </button>
                )}

                <div className="my-1 border-t border-border" />

                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete(interview);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-destructive hover:bg-destructive/10 transition text-left"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete Interview
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Date & Time Banner */}
      <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-muted/40 p-2.5 text-xs border border-border/60">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-primary shrink-0" />
          <span className="font-semibold text-foreground">{dt.date}</span>
          <span className="text-muted-foreground">•</span>
          <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <span className="font-medium text-foreground/90">{dt.time}</span>
        </div>

        {dt.relative && (
          <span
            className={`rounded-md px-2 py-0.5 text-[11px] font-semibold ${
              dt.isToday
                ? "bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20"
                : dt.isPast
                ? "bg-muted text-muted-foreground"
                : "bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20"
            }`}
          >
            {dt.relative}
          </span>
        )}
      </div>

      {/* Details: Interviewer & Meeting Link */}
      <div className="mt-3 space-y-2 text-xs">
        {interview.interviewer && (
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <User className="h-3.5 w-3.5 shrink-0 text-muted-foreground/80" />
            <span className="font-medium text-foreground/80">Interviewer:</span>
            <span className="truncate">{interview.interviewer}</span>
          </div>
        )}

        {/* Meeting Link Pill */}
        {interview.meetingLink && (
          <div className="flex items-center gap-2">
            <a
              href={
                interview.meetingLink.startsWith("http")
                  ? interview.meetingLink
                  : `https://${interview.meetingLink}`
              }
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 border border-primary/20 px-2.5 py-1 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors"
            >
              <Video className="h-3.5 w-3.5" />
              <span>Join Meeting Call</span>
              <ExternalLink className="h-3 w-3" />
            </a>

            <button
              type="button"
              onClick={handleCopyMeetingLink}
              title="Copy meeting link"
              className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              {copiedLink ? (
                <Check className="h-3.5 w-3.5 text-emerald-600" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
        )}

        {/* Notes preview */}
        {interview.notes && (
          <p className="mt-2 line-clamp-2 text-xs text-muted-foreground italic bg-muted/20 p-2 rounded-lg border border-border/40">
            &ldquo;{interview.notes}&rdquo;
          </p>
        )}
      </div>

      {/* Card Footer: AI Prep CTA + View Details */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border/60 pt-3">
        {application?._id && (
          <button
            type="button"
            onClick={() => onPrepare(application._id)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:opacity-95 transition-opacity"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI Interview Prep</span>
          </button>
        )}

        <div className="flex items-center gap-2 ml-auto">
          <button
            type="button"
            onClick={() => onViewDetails(interview)}
            className="text-xs font-semibold text-primary hover:underline"
          >
            View Details &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}
