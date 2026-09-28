"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  X,
  Building2,
  Calendar,
  Clock,
  Video,
  Copy,
  Check,
  Sparkles,
  ExternalLink,
  User,
  MessageSquare,
  CheckCircle2,
  Trash2,
  Edit,
  MapPin,
  FileText,
  Briefcase,
  Save,
} from "lucide-react";
import type { Interview } from "@/types/interview";
import {
  getRoundBadgeClass,
  getRoundIcon,
  getRoundLabel,
  getTypeIcon,
  getTypeLabel,
  getStatusBadgeClass,
  formatInterviewDateTime,
} from "./interviewUtils";
import { toast } from "sonner";

interface InterviewDetailModalProps {
  interview: Interview | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (interview: Interview) => void;
  onComplete: (interview: Interview) => void;
  onDelete: (interview: Interview) => void;
  onPrepare: (applicationId: string) => void;
  onSaveFeedback: (id: string, feedback: string) => void;
  isUpdating?: boolean;
}

export default function InterviewDetailModal({
  interview,
  isOpen,
  onClose,
  onEdit,
  onComplete,
  onDelete,
  onPrepare,
  onSaveFeedback,
  isUpdating = false,
}: InterviewDetailModalProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [isEditingFeedback, setIsEditingFeedback] = useState(false);

  React.useEffect(() => {
    if (interview) {
      setFeedbackText(interview.feedback || "");
      setIsEditingFeedback(!interview.feedback && interview.status === "completed");
    }
  }, [interview, isOpen]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !interview) return null;

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

  const handleCopyLink = () => {
    if (!interview.meetingLink) return;
    navigator.clipboard.writeText(interview.meetingLink);
    setCopiedLink(true);
    toast.success("Meeting link copied to clipboard");
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSaveFeedbackClick = () => {
    onSaveFeedback(interview._id, feedbackText.trim());
    setIsEditingFeedback(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="interview-detail-title"
    >
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative z-10 flex flex-col w-full max-w-2xl max-h-[90vh] rounded-2xl border border-border bg-card shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4 sm:px-6">
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

              <span
                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${getStatusBadgeClass(
                  interview.status
                )}`}
              >
                {interview.status}
              </span>
            </div>

            <h2 id="interview-detail-title" className="text-xl sm:text-2xl font-bold text-foreground truncate">
              {jobTitle}
            </h2>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground mt-1">
              <div className="flex items-center gap-1.5 font-medium text-foreground/90">
                <Building2 className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span>{company}</span>
              </div>
              {location && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground/80" />
                  <span>{location}</span>
                </div>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* AI Prep Banner */}
          {application?._id && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-blue-500/20 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/20 text-blue-600 dark:text-blue-400">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-foreground">AI Interview Preparation</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Generate tailored technical, behavioral, and resume questions for {company}.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onPrepare(application._id);
                }}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-sm hover:opacity-90 transition-opacity"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Start Preparation
              </button>
            </div>
          )}

          {/* Date, Time & Meeting Link */}
          <div className="rounded-xl border border-border bg-card p-4 sm:p-5 space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Schedule & Access
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 rounded-lg bg-muted/30 p-3">
                <Calendar className="h-5 w-5 text-primary shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Date</p>
                  <p className="text-sm font-semibold text-foreground">{dt.date}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg bg-muted/30 p-3">
                <Clock className="h-5 w-5 text-primary shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Time</p>
                  <p className="text-sm font-semibold text-foreground">
                    {dt.time} {dt.relative ? `(${dt.relative})` : ""}
                  </p>
                </div>
              </div>
            </div>

            {/* Meeting Link Section */}
            {interview.meetingLink ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-primary/20 bg-primary/5 p-3.5">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-primary">Meeting Link</p>
                  <p className="text-xs text-muted-foreground truncate max-w-sm mt-0.5">
                    {interview.meetingLink}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={
                      interview.meetingLink.startsWith("http")
                        ? interview.meetingLink
                        : `https://${interview.meetingLink}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-semibold text-primary-foreground shadow-sm hover:opacity-90 transition-opacity"
                  >
                    <Video className="h-3.5 w-3.5" />
                    Join Call
                    <ExternalLink className="h-3 w-3" />
                  </a>

                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="inline-flex h-9 items-center gap-1 rounded-lg border border-border bg-card px-2.5 text-xs font-medium text-foreground hover:bg-muted"
                  >
                    {copiedLink ? (
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                    Copy
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic">
                No meeting link was provided for this round.
              </p>
            )}

            {interview.interviewer && (
              <div className="flex items-center gap-2 pt-2 border-t border-border/60 text-xs">
                <User className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground font-medium">Interviewer:</span>
                <span className="font-semibold text-foreground">{interview.interviewer}</span>
              </div>
            )}
          </div>

          {/* Notes Section */}
          <div className="rounded-xl border border-border bg-card p-4 sm:p-5 space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <MessageSquare className="h-3.5 w-3.5 text-primary" />
              Preparation Notes
            </h4>
            {interview.notes ? (
              <p className="text-xs sm:text-sm text-foreground/90 whitespace-pre-line leading-relaxed bg-muted/20 p-3 rounded-lg border border-border/40">
                {interview.notes}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground italic">
                No specific notes were recorded for this round.
              </p>
            )}
          </div>

          {/* Feedback & Outcome Section */}
          <div className="rounded-xl border border-border bg-card p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                Post-Interview Feedback & Reflections
              </h4>
              {!isEditingFeedback && (
                <button
                  type="button"
                  onClick={() => setIsEditingFeedback(true)}
                  className="text-xs font-medium text-primary hover:underline"
                >
                  {interview.feedback ? "Edit Feedback" : "+ Add Feedback"}
                </button>
              )}
            </div>

            {isEditingFeedback ? (
              <div className="space-y-2">
                <textarea
                  rows={4}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Record questions asked, how you performed, topics to review, and any follow-up actions..."
                  className="w-full rounded-xl border border-border bg-background p-3 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary leading-relaxed"
                />
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingFeedback(false);
                      setFeedbackText(interview.feedback || "");
                    }}
                    className="h-8 rounded-lg border border-border px-3 text-xs font-medium text-foreground hover:bg-muted"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveFeedbackClick}
                    disabled={isUpdating}
                    className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-semibold text-primary-foreground hover:opacity-90"
                  >
                    <Save className="h-3.5 w-3.5" />
                    Save Feedback
                  </button>
                </div>
              </div>
            ) : interview.feedback ? (
              <p className="text-xs sm:text-sm text-foreground/90 whitespace-pre-line leading-relaxed bg-muted/20 p-3 rounded-lg border border-border/40">
                {interview.feedback}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground italic">
                No feedback recorded yet. Add notes right after your interview to remember key moments.
              </p>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-muted/20 px-5 py-3.5 sm:px-6">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(interview);
              }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted"
            >
              <Edit className="h-3.5 w-3.5" />
              Reschedule / Edit
            </button>

            {interview.status === "scheduled" && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onComplete(interview);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                Mark Completed
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onDelete(interview);
              }}
              className="inline-flex items-center gap-1 text-xs font-medium text-destructive hover:underline"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-border bg-background px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
