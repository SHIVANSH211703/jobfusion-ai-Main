"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  X,
  Building2,
  MapPin,
  Calendar,
  CalendarDays,
  FileText,
  ExternalLink,
  Download,
  Trash2,
  CalendarClock,
  Sparkles,
  MessageSquare,
  Clock3,
  CheckCircle2,
  Briefcase,
  Save,
  Check,
  Loader2,
  DollarSign,
} from "lucide-react";
import type { JobApplication, ApplicationStatus } from "@/types/job";
import {
  ALL_STATUSES,
  getStatusBadgeClass,
  getStatusIcon,
  formatFollowUpDate,
} from "./applicationUtils";
import resumeService from "@/services/resume.service";
import { toast } from "sonner";

interface ApplicationDetailModalProps {
  application: JobApplication | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (
    jobIdOrAppId: string,
    newStatus: ApplicationStatus,
    notes?: string,
    followUpDate?: string | null
  ) => void;
  onDelete: (application: JobApplication) => void;
  onViewResume: (resumeId: string, title: string) => void;
  isUpdating?: boolean;
}

export default function ApplicationDetailModal({
  application,
  isOpen,
  onClose,
  onStatusChange,
  onDelete,
  onViewResume,
  isUpdating = false,
}: ApplicationDetailModalProps) {
  const [activeTab, setActiveTab] = useState<"details" | "notes" | "timeline">("details");
  const [currentStatus, setCurrentStatus] = useState<ApplicationStatus>("applied");
  const [noteText, setNoteText] = useState<string>("");
  const [followUpDateInput, setFollowUpDateInput] = useState<string>("");
  const [isDownloadingResume, setIsDownloadingResume] = useState<boolean>(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [isSavedRecently, setIsSavedRecently] = useState<boolean>(false);

  // Sync state when application changes or modal opens
  useEffect(() => {
    if (application) {
      setCurrentStatus(application.status || "applied");
      setNoteText(application.notes || "");
      if (application.followUpDate) {
        try {
          const d = new Date(application.followUpDate);
          if (!isNaN(d.getTime())) {
            setFollowUpDateInput(d.toISOString().split("T")[0]);
          } else {
            setFollowUpDateInput("");
          }
        } catch {
          setFollowUpDateInput("");
        }
      } else {
        setFollowUpDateInput("");
      }
      setShowDeleteConfirm(false);
      setIsSavedRecently(false);
    }
  }, [application, isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        if (showDeleteConfirm) {
          setShowDeleteConfirm(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, showDeleteConfirm, onClose]);

  if (!isOpen || !application) return null;

  const job =
    application.jobId && typeof application.jobId === "object"
      ? application.jobId
      : application.job;

  const targetId = job?._id || application._id;

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
    "Attached Resume.pdf";

  const followUp = formatFollowUpDate(application.followUpDate);

  const isInterviewStage =
    currentStatus === "interview" ||
    currentStatus === "technical" ||
    currentStatus === "hr";

  const handleStatusSelectChange = (newStatus: ApplicationStatus) => {
    setCurrentStatus(newStatus);
    onStatusChange(targetId, newStatus, noteText, followUpDateInput ? new Date(followUpDateInput).toISOString() : null);
  };

  const handleSaveNotesAndFollowUp = () => {
    onStatusChange(
      targetId,
      currentStatus,
      noteText.trim(),
      followUpDateInput ? new Date(followUpDateInput).toISOString() : null
    );
    setIsSavedRecently(true);
    setTimeout(() => setIsSavedRecently(false), 2500);
  };

  const handleClearFollowUp = () => {
    setFollowUpDateInput("");
    onStatusChange(targetId, currentStatus, noteText.trim(), null);
    setIsSavedRecently(true);
    setTimeout(() => setIsSavedRecently(false), 2500);
  };

  const handleDownload = async () => {
    if (!resumeIdStr) return;
    try {
      setIsDownloadingResume(true);
      await resumeService.downloadResumeFile(resumeIdStr, resumeName);
      toast.success("Resume download started");
    } catch {
      toast.error("Failed to download resume");
    } finally {
      setIsDownloadingResume(false);
    }
  };

  const timelineEvents = application.statusHistory?.length
    ? [...application.statusHistory].reverse()
    : [
        {
          status: application.status || "applied",
          changedAt: application.appliedAt || new Date().toISOString(),
          note: application.notes,
        },
      ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="application-details-title"
    >
      {/* Backdrop click */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      {/* Modal Dialog Card */}
      <div className="relative z-10 flex flex-col w-full max-w-3xl max-h-[90vh] rounded-2xl border border-border bg-card shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-border bg-card px-5 py-4 sm:px-6">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${getStatusBadgeClass(
                  currentStatus
                )}`}
              >
                {getStatusIcon(currentStatus)}
                {currentStatus}
              </span>

              {followUp && (
                <span
                  className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${
                    followUp.isOverdue
                      ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20"
                      : "bg-muted text-muted-foreground border border-border"
                  }`}
                >
                  <CalendarClock className="h-3 w-3" />
                  Follow-up: {followUp.formatted}
                  {followUp.isOverdue && " (Due)"}
                </span>
              )}
            </div>

            <h2 id="application-details-title" className="text-xl sm:text-2xl font-bold text-foreground truncate">
              {job?.title || "Job Application"}
            </h2>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground mt-1">
              <div className="flex items-center gap-1.5 font-medium text-foreground/90">
                <Building2 className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span>{job?.company || "Company Unavailable"}</span>
              </div>
              {job?.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground/80" />
                  <span>{job.location}</span>
                </div>
              )}
              {(job?.jobType || job?.employmentType) && (
                <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground uppercase">
                  {job.jobType || job.employmentType}
                </span>
              )}
              {job?.salary && (job.salary.min || job.salary.max) && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <DollarSign className="h-3.5 w-3.5 shrink-0" />
                  <span>
                    {job.salary.currency || "$"}
                    {job.salary.min?.toLocaleString()}
                    {job.salary.max ? ` - ${job.salary.max.toLocaleString()}` : ""}
                  </span>
                </div>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-border bg-muted/30 px-5 sm:px-6">
          <button
            type="button"
            onClick={() => setActiveTab("details")}
            className={`flex items-center gap-2 border-b-2 py-3 px-3 text-sm font-semibold transition-colors ${
              activeTab === "details"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Briefcase className="h-4 w-4" />
            Job & Resume
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("notes")}
            className={`flex items-center gap-2 border-b-2 py-3 px-3 text-sm font-semibold transition-colors ${
              activeTab === "notes"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <MessageSquare className="h-4 w-4" />
            Notes & Follow-up
            {application.notes && (
              <span className="h-2 w-2 rounded-full bg-primary inline-block ml-0.5" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("timeline")}
            className={`flex items-center gap-2 border-b-2 py-3 px-3 text-sm font-semibold transition-colors ${
              activeTab === "timeline"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Clock3 className="h-4 w-4" />
            Timeline ({timelineEvents.length})
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Interview CTA if in interview stage */}
          {isInterviewStage && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-blue-500/20 bg-blue-500/10 p-4 text-blue-900 dark:text-blue-100">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/20 text-blue-600 dark:text-blue-400">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Application in Interview Stage</h4>
                  <p className="text-xs text-blue-700/80 dark:text-blue-300/80 mt-0.5">
                    Schedule rounds, track meeting links, and generate AI mock prep questions for {job?.company || "this company"}.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={`/interviews?applicationId=${application._id}&action=schedule`}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-blue-600/30 bg-background px-3 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 shadow-sm hover:bg-muted transition-colors"
                >
                  <Calendar className="h-3.5 w-3.5" />
                  Schedule Round
                </Link>
                <Link
                  href={`/interviews?applicationId=${application._id}&action=prepare`}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  AI Interview Prep
                </Link>
              </div>
            </div>
          )}

          {/* TAB 1: DETAILS */}
          {activeTab === "details" && (
            <div className="space-y-6">
              {/* Status Update Quick Bar */}
              <div className="rounded-xl border border-border bg-card p-4 sm:p-5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">Application Status</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Change stage to update tracking and record it to your timeline.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      aria-label="Change application status"
                      value={currentStatus}
                      disabled={isUpdating}
                      onChange={(e) =>
                        handleStatusSelectChange(e.target.value as ApplicationStatus)
                      }
                      className="h-10 rounded-xl border border-border bg-background px-3 text-sm font-semibold capitalize text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary min-w-[160px]"
                    >
                      {ALL_STATUSES.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Attached Resume Section */}
              <div className="rounded-xl border border-border bg-card p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    Resume Used for Application
                  </h4>
                  {application.appliedAt && (
                    <span className="text-xs text-muted-foreground">
                      Submitted on {new Date(application.appliedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>

                {resumeIdStr ? (
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border border-border/80 bg-muted/20 p-3.5">
                    <div className="min-w-0 flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{resumeName}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Stored securely on JobFusion AI
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => onViewResume(resumeIdStr, resumeName)}
                        className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-semibold text-primary-foreground shadow-sm hover:opacity-90 transition-opacity"
                      >
                        <FileText className="h-3.5 w-3.5" />
                        Preview PDF
                      </button>

                      <button
                        type="button"
                        onClick={handleDownload}
                        disabled={isDownloadingResume}
                        className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-xs font-medium text-foreground hover:bg-muted transition-colors disabled:opacity-50"
                        title="Download Resume"
                      >
                        {isDownloadingResume ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Download className="h-3.5 w-3.5" />
                        )}
                        Download
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
                    No resume document was attached to this application record.
                  </div>
                )}
              </div>

              {/* Job Details Section */}
              <div className="rounded-xl border border-border bg-card p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-primary" />
                    Job Description & Information
                  </h4>
                  {job?._id && (
                    <Link
                      href={`/jobs/${job._id}`}
                      className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                    >
                      Full Job Page
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  )}
                </div>

                {job?.description ? (
                  <div className="max-h-60 overflow-y-auto rounded-lg bg-muted/20 p-3.5 text-xs sm:text-sm text-foreground/80 leading-relaxed whitespace-pre-line border border-border/60">
                    {job.description}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic">
                    Job details or description are not provided in this record.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: NOTES & FOLLOW-UP */}
          {activeTab === "notes" && (
            <div className="space-y-6">
              {/* Follow-up date section */}
              <div className="rounded-xl border border-border bg-card p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <CalendarClock className="h-4 w-4 text-primary" />
                      Follow-up Reminder Date
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Set a target date to reach out to the recruiter or check application status.
                    </p>
                  </div>
                  {followUp && (
                    <button
                      type="button"
                      onClick={handleClearFollowUp}
                      className="text-xs text-muted-foreground hover:text-destructive underline"
                    >
                      Clear Date
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <input
                    type="date"
                    value={followUpDateInput}
                    onChange={(e) => setFollowUpDateInput(e.target.value)}
                    className="h-10 rounded-xl border border-border bg-background px-3 text-sm text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {followUp && (
                    <div
                      className={`text-xs font-medium px-2.5 py-1 rounded-md ${
                        followUp.isOverdue
                          ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {followUp.isOverdue ? "Follow-up is overdue" : "Scheduled"}
                    </div>
                  )}
                </div>
              </div>

              {/* Notes Editor */}
              <div className="rounded-xl border border-border bg-card p-4 sm:p-5 space-y-3">
                <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-primary" />
                  Personal Notes & Interview Log
                </h4>
                <p className="text-xs text-muted-foreground">
                  Record recruiter contacts, referral names, interview questions, or preparation notes.
                </p>

                <textarea
                  rows={6}
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="e.g. Spoke with Sarah from HR on Tuesday. Technical round is scheduled for next Thursday on system design..."
                  className="w-full rounded-xl border border-border bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary leading-relaxed"
                />

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-muted-foreground">
                    {noteText.length} characters
                  </span>

                  <button
                    type="button"
                    onClick={handleSaveNotesAndFollowUp}
                    disabled={isUpdating}
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-sm hover:opacity-90 transition-all disabled:opacity-50"
                  >
                    {isSavedRecently ? (
                      <>
                        <Check className="h-4 w-4 text-white" />
                        Saved!
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save Notes & Date
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TIMELINE */}
          {activeTab === "timeline" && (
            <div className="space-y-4">
              <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
                <h4 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Clock3 className="h-4 w-4 text-primary" />
                  Status History & Activity
                </h4>

                <ol className="relative space-y-4 border-l-2 border-border/80 pl-5 ml-2.5">
                  {timelineEvents.map((event, index) => {
                    const eventDate = event.changedAt
                      ? new Date(event.changedAt).toLocaleString()
                      : "Date unavailable";

                    return (
                      <li key={`${event.status}-${event.changedAt}-${index}`} className="relative">
                        <span className="absolute -left-[27px] top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary ring-4 ring-card" />
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${getStatusBadgeClass(
                              event.status
                            )}`}
                          >
                            {getStatusIcon(event.status)}
                            {event.status}
                          </span>
                          <span className="text-xs text-muted-foreground">{eventDate}</span>
                        </div>
                        {event.note && (
                          <div className="mt-2 rounded-lg bg-muted/40 p-2.5 text-xs text-foreground/80 border border-border/60">
                            {event.note}
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-muted/20 px-5 py-3.5 sm:px-6">
          {showDeleteConfirm ? (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-medium text-destructive">
                Withdraw this application?
              </span>
              <button
                type="button"
                onClick={() => {
                  onDelete(application);
                  setShowDeleteConfirm(false);
                  onClose();
                }}
                className="rounded-lg bg-destructive px-3 py-1.5 text-xs font-semibold text-destructive-foreground hover:opacity-90"
              >
                Yes, Withdraw
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-destructive hover:underline"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Withdraw Application
            </button>
          )}

          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-border bg-background px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
