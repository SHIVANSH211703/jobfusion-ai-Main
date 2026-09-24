"use client";

import Link from "next/link";

import {
  CheckCircle2,
  FileText,
  Loader2,
  Plus,
  Upload,
  X,
} from "lucide-react";

import type { Resume } from "@/types/resume";

interface ApplyResumeModalProps {
  open: boolean;
  jobTitle: string;
  resumes: Resume[];
  isLoading: boolean;
  selectedResumeId: string;
  setSelectedResumeId: (
    id: string
  ) => void;
  onApply: () => void;
  onClose: () => void;
  isApplying: boolean;
}

export default function ApplyResumeModal({
  open,
  jobTitle,
  resumes,
  isLoading,
  selectedResumeId,
  setSelectedResumeId,
  onApply,
  onClose,
  isApplying,
}: ApplyResumeModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border bg-card shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-5">
          <div>
            <h2 className="text-lg font-semibold">
              Apply for this job
            </h2>

            <p className="mt-1 max-w-sm truncate text-sm text-muted-foreground">
              {jobTitle}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isApplying}
            className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-muted"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Loading */}
        {isLoading ? (
          <div className="flex min-h-[250px] flex-col items-center justify-center gap-3 p-6">
            <Loader2 className="h-7 w-7 animate-spin text-primary" />

            <p className="text-sm text-muted-foreground">
              Checking your resumes...
            </p>
          </div>
        ) : resumes.length === 0 ? (
          /* No Resume */
          <div className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <FileText className="h-8 w-8 text-primary" />
              </div>

              <h3 className="mt-4 text-lg font-semibold">
                Resume required
              </h3>

              <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                You need a resume before applying
                for this job. Upload an existing
                resume or create a new one.
              </p>

              <div className="mt-6 grid w-full gap-3 sm:grid-cols-2">
                <Link
                  href="/resume"
                  onClick={onClose}
                  className="flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition hover:bg-muted"
                >
                  <Upload className="h-4 w-4" />

                  Upload Resume
                </Link>

                <Link
                  href="/resume/create"
                  onClick={onClose}
                  className="flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                >
                  <Plus className="h-4 w-4" />

                  Create Resume
                </Link>
              </div>
            </div>
          </div>
        ) : (
          /* Resume Selection */
          <>
            <div className="max-h-[420px] space-y-3 overflow-y-auto p-5">
              <div className="mb-4">
                <h3 className="font-medium">
                  Select a resume
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  Choose the resume you want to use
                  for this application.
                </p>
              </div>

              {resumes.map((resume) => {
                const resumeId =
                  resume._id || resume.id || "";

                const selected =
                  selectedResumeId === resumeId;

                return (
                  <button
                    key={resumeId}
                    type="button"
                    onClick={() =>
                      setSelectedResumeId(resumeId)
                    }
                    className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition ${
                      selected
                        ? "border-primary bg-primary/10"
                        : "hover:bg-muted"
                    }`}
                  >
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${
                        selected
                          ? "bg-primary/15"
                          : "bg-muted"
                      }`}
                    >
                      <FileText
                        className={`h-5 w-5 ${
                          selected
                            ? "text-primary"
                            : "text-muted-foreground"
                        }`}
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate font-medium">
                          {resume.title}
                        </p>

                        {resume.isDefault && (
                          <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                            Default
                          </span>
                        )}
                      </div>

                      <p className="mt-1 text-xs text-muted-foreground">
                        ATS Score:{" "}
                        {resume.atsScore || 0}
                      </p>
                    </div>

                    {selected && (
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 border-t p-5">
              <button
                type="button"
                onClick={onClose}
                disabled={isApplying}
                className="rounded-xl border px-5 py-2.5 text-sm font-medium transition hover:bg-muted"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={onApply}
                disabled={
                  !selectedResumeId ||
                  isApplying
                }
                className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:pointer-events-none disabled:opacity-50"
              >
                {isApplying && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}

                Apply with this Resume
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}