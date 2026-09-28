"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Calendar,
  Clock,
  Video,
  Building2,
  Briefcase,
  Link as LinkIcon,
  User,
  MessageSquare,
  Sparkles,
  Loader2,
} from "lucide-react";
import type {
  Interview,
  InterviewRound,
  InterviewType,
  CreateInterviewRequest,
  UpdateInterviewRequest,
} from "@/types/interview";
import type { JobApplication } from "@/types/job";
import { getRoundLabel, getTypeLabel } from "./interviewUtils";
import { toast } from "sonner";

interface ScheduleInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  applications: JobApplication[];
  interviewToEdit?: Interview | null;
  defaultApplicationId?: string;
  onSubmitCreate: (data: CreateInterviewRequest) => Promise<void> | void;
  onSubmitUpdate: (id: string, data: UpdateInterviewRequest) => Promise<void> | void;
  isLoading?: boolean;
}

const ROUNDS: InterviewRound[] = [
  "technical",
  "hr",
  "managerial",
  "behavioral",
  "other",
];

const TYPES: InterviewType[] = ["video", "phone", "onsite", "other"];

export default function ScheduleInterviewModal({
  isOpen,
  onClose,
  applications,
  interviewToEdit,
  defaultApplicationId,
  onSubmitCreate,
  onSubmitUpdate,
  isLoading = false,
}: ScheduleInterviewModalProps) {
  const [applicationId, setApplicationId] = useState<string>("");
  const [round, setRound] = useState<InterviewRound>("technical");
  const [type, setType] = useState<InterviewType>("video");
  const [scheduledAt, setScheduledAt] = useState<string>("");
  const [interviewer, setInterviewer] = useState<string>("");
  const [meetingLink, setMeetingLink] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      if (interviewToEdit) {
        const app =
          typeof interviewToEdit.applicationId === "object"
            ? interviewToEdit.applicationId._id
            : interviewToEdit.applicationId;

        setApplicationId(app || "");
        setRound(interviewToEdit.round || "technical");
        setType(interviewToEdit.type || "video");
        setInterviewer(interviewToEdit.interviewer || "");
        setMeetingLink(interviewToEdit.meetingLink || "");
        setNotes(interviewToEdit.notes || "");

        if (interviewToEdit.scheduledAt) {
          try {
            const d = new Date(interviewToEdit.scheduledAt);
            const offset = d.getTimezoneOffset();
            const localDate = new Date(d.getTime() - offset * 60 * 1000);
            setScheduledAt(localDate.toISOString().slice(0, 16));
          } catch {
            setScheduledAt("");
          }
        } else {
          setScheduledAt("");
        }
      } else {
        setApplicationId(defaultApplicationId || (applications[0]?._id ?? ""));
        setRound("technical");
        setType("video");
        setInterviewer("");
        setMeetingLink("");
        setNotes("");

        // Default scheduled time: Tomorrow at 10:00 AM
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(10, 0, 0, 0);
        const offset = tomorrow.getTimezoneOffset();
        const localDate = new Date(tomorrow.getTime() - offset * 60 * 1000);
        setScheduledAt(localDate.toISOString().slice(0, 16));
      }
    }
  }, [isOpen, interviewToEdit, defaultApplicationId, applications]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const selectedApp = applications.find((a) => a._id === applicationId);
  const selectedJob =
    selectedApp?.jobId && typeof selectedApp.jobId === "object"
      ? selectedApp.jobId
      : selectedApp?.job;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!applicationId && !interviewToEdit) {
      toast.error("Please select a job application");
      return;
    }

    if (!scheduledAt) {
      toast.error("Please set interview date and time");
      return;
    }

    const isoDate = new Date(scheduledAt).toISOString();

    if (interviewToEdit) {
      await onSubmitUpdate(interviewToEdit._id, {
        round,
        type,
        scheduledAt: isoDate,
        interviewer: interviewer.trim(),
        meetingLink: meetingLink.trim(),
        notes: notes.trim(),
      });
    } else {
      await onSubmitCreate({
        applicationId,
        round,
        type,
        scheduledAt: isoDate,
        interviewer: interviewer.trim(),
        meetingLink: meetingLink.trim(),
        notes: notes.trim(),
      });
    }

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="schedule-modal-title"
    >
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative z-10 flex flex-col w-full max-w-xl max-h-[90vh] rounded-2xl border border-border bg-card shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4 sm:px-6">
          <div>
            <h2 id="schedule-modal-title" className="text-lg sm:text-xl font-bold text-foreground">
              {interviewToEdit ? "Reschedule / Edit Interview" : "Schedule New Interview"}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Keep your upcoming interview rounds, meeting link, and notes organized.
            </p>
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          {/* Target Application */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5 text-primary" />
              Target Job Application <span className="text-destructive">*</span>
            </label>

            {interviewToEdit ? (
              <div className="rounded-xl border border-border bg-muted/40 p-3 text-sm">
                <p className="font-semibold text-foreground">
                  {selectedJob?.title || "Role"}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {selectedJob?.company || "Company"}
                </p>
              </div>
            ) : (
              <select
                required
                value={applicationId}
                onChange={(e) => setApplicationId(e.target.value)}
                className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select a job application</option>
                {applications.map((app) => {
                  const j =
                    app.jobId && typeof app.jobId === "object" ? app.jobId : app.job;
                  return (
                    <option key={app._id} value={app._id}>
                      {j?.company || "Company"} — {j?.title || "Role"} ({app.status})
                    </option>
                  );
                })}
              </select>
            )}

            {selectedJob && (
              <p className="text-xs text-muted-foreground">
                Company: <strong className="text-foreground">{selectedJob.company}</strong> · Role:{" "}
                <strong className="text-foreground">{selectedJob.title}</strong>
              </p>
            )}
          </div>

          {/* Round & Format in 2 cols */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Interview Round <span className="text-destructive">*</span>
              </label>
              <select
                value={round}
                onChange={(e) => setRound(e.target.value as InterviewRound)}
                className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm font-medium capitalize text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {ROUNDS.map((r) => (
                  <option key={r} value={r}>
                    {getRoundLabel(r)}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Interview Format <span className="text-destructive">*</span>
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as InterviewType)}
                className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm font-medium capitalize text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {TYPES.map((t) => (
                  <option key={t} value={t}>
                    {getTypeLabel(t)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date & Time */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-primary" />
              Date & Time <span className="text-destructive">*</span>
            </label>
            <input
              required
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Meeting Link */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <LinkIcon className="h-3.5 w-3.5 text-primary" />
              Meeting Link (Google Meet, Zoom, Teams, etc.)
            </label>
            <input
              type="url"
              placeholder="https://meet.google.com/abc-defg-hij"
              value={meetingLink}
              onChange={(e) => setMeetingLink(e.target.value)}
              maxLength={500}
              className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Interviewer */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-primary" />
              Interviewer Name / Role
            </label>
            <input
              type="text"
              placeholder="e.g. Alex Johnson (Engineering Lead)"
              value={interviewer}
              onChange={(e) => setInterviewer(e.target.value)}
              maxLength={160}
              className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <MessageSquare className="h-3.5 w-3.5 text-primary" />
              Preparation Notes & Topics
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Focus on microservices design, MongoDB aggregation, and recent scaling experience."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={5000}
              className="w-full rounded-xl border border-border bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary leading-relaxed"
            />
          </div>

          {/* Footer inside form */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="h-10 rounded-xl border border-border px-4 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-xs font-semibold text-primary-foreground shadow-sm hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {interviewToEdit ? "Update Interview" : "Save Interview"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
