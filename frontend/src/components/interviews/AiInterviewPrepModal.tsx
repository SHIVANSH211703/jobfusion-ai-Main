"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Sparkles,
  Code2,
  Users,
  FileText,
  Briefcase,
  Copy,
  Check,
  Building2,
  Loader2,
  RefreshCw,
  Lightbulb,
} from "lucide-react";
import type { JobApplication } from "@/types/job";
import { useInterviewPreparation } from "@/hooks/useInterviews";
import { toast } from "sonner";

interface AiInterviewPrepModalProps {
  isOpen: boolean;
  onClose: () => void;
  applications: JobApplication[];
  selectedApplicationId?: string;
}

export default function AiInterviewPrepModal({
  isOpen,
  onClose,
  applications,
  selectedApplicationId,
}: AiInterviewPrepModalProps) {
  const [activeAppId, setActiveAppId] = useState<string>("");
  const [activeCategory, setActiveCategory] = useState<
    "technical" | "behavioral" | "resume" | "jobSpecific"
  >("technical");
  const [copiedQuestion, setCopiedQuestion] = useState<string | null>(null);

  const prepMutation = useInterviewPreparation();

  useEffect(() => {
    if (isOpen) {
      const initialId =
        selectedApplicationId ||
        applications.find(
          (a) =>
            a.status === "interview" ||
            a.status === "technical" ||
            a.status === "hr"
        )?._id ||
        applications[0]?._id ||
        "";

      setActiveAppId(initialId);
      if (initialId) {
        prepMutation.mutate(initialId);
      }
    }
  }, [isOpen, selectedApplicationId]);

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

  const currentApp = applications.find((a) => a._id === activeAppId);
  const currentJob =
    currentApp?.jobId && typeof currentApp.jobId === "object"
      ? currentApp.jobId
      : currentApp?.job;

  const handleAppChange = (newId: string) => {
    setActiveAppId(newId);
    if (newId) {
      prepMutation.mutate(newId);
    }
  };

  const handleCopyQuestion = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedQuestion(text);
    toast.success("Question copied to clipboard");
    setTimeout(() => setCopiedQuestion(null), 2000);
  };

  const prepData = prepMutation.data?.data;

  const categories = [
    {
      id: "technical" as const,
      label: "Technical Questions",
      icon: Code2,
      count: prepData?.technicalQuestions?.length ?? 0,
      color: "text-blue-600 dark:text-blue-400",
      items: prepData?.technicalQuestions ?? [],
    },
    {
      id: "behavioral" as const,
      label: "Behavioral & STAR",
      icon: Users,
      count: prepData?.behavioralQuestions?.length ?? 0,
      color: "text-emerald-600 dark:text-emerald-400",
      items: prepData?.behavioralQuestions ?? [],
    },
    {
      id: "resume" as const,
      label: "Resume-Specific",
      icon: FileText,
      count: prepData?.resumeQuestions?.length ?? 0,
      color: "text-purple-600 dark:text-purple-400",
      items: prepData?.resumeQuestions ?? [],
    },
    {
      id: "jobSpecific" as const,
      label: "Role & Company Fit",
      icon: Briefcase,
      count: prepData?.jobSpecificQuestions?.length ?? 0,
      color: "text-amber-600 dark:text-amber-400",
      items: prepData?.jobSpecificQuestions ?? [],
    },
  ];

  const currentCategoryData = categories.find((c) => c.id === activeCategory);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="prep-modal-title"
    >
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative z-10 flex flex-col w-full max-w-4xl max-h-[90vh] rounded-2xl border border-border bg-card shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-border bg-card px-5 py-4 sm:px-6">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 text-primary font-semibold text-xs tracking-wider uppercase">
              <Sparkles className="h-4 w-4" />
              <span>AI Career Copilot</span>
            </div>

            <h2 id="prep-modal-title" className="text-xl sm:text-2xl font-bold text-foreground mt-1">
              AI Interview Preparation
            </h2>

            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Personalized mock interview questions tailored to your resume and the target job description.
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

        {/* Application Selector Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-border bg-muted/30 px-5 py-3 sm:px-6">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-xs font-semibold text-foreground shrink-0">Application:</span>
            <select
              value={activeAppId}
              onChange={(e) => handleAppChange(e.target.value)}
              className="h-9 w-full sm:max-w-md rounded-lg border border-border bg-background px-3 text-xs font-medium text-foreground shadow-sm focus:border-primary focus:outline-none"
            >
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
          </div>

          <button
            type="button"
            onClick={() => activeAppId && prepMutation.mutate(activeAppId)}
            disabled={prepMutation.isPending || !activeAppId}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-border bg-card px-3 text-xs font-semibold text-foreground hover:bg-muted disabled:opacity-50"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${prepMutation.isPending ? "animate-spin" : ""}`}
            />
            <span>Regenerate</span>
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex overflow-x-auto border-b border-border bg-card px-5 sm:px-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`flex shrink-0 items-center gap-2 border-b-2 py-3 px-3 text-xs sm:text-sm font-semibold transition-colors ${
                  isActive
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className={`h-4 w-4 ${cat.color}`} />
                <span>{cat.label}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          {prepMutation.isPending && (
            <div className="flex min-h-[300px] flex-col items-center justify-center p-8 text-center space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary animate-pulse">
                <Sparkles className="h-6 w-6 animate-spin" />
              </div>
              <h3 className="text-base font-semibold text-foreground">
                Analyzing Job Requirements & Resume...
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm">
                Generating high-yield questions, evaluation context, and model talking points.
              </p>
            </div>
          )}

          {prepMutation.isError && (
            <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-center space-y-2">
              <p className="text-sm font-semibold text-destructive">
                Unable to generate questions for this application.
              </p>
              <p className="text-xs text-muted-foreground max-w-md mx-auto">
                Make sure the application has an active job description and an attached resume.
              </p>
            </div>
          )}

          {!prepMutation.isPending && !prepMutation.isError && prepData && (
            <div className="space-y-3">
              {/* Category Hint Banner */}
              <div className="flex items-start gap-2.5 rounded-xl border border-border bg-muted/30 p-3 text-xs text-muted-foreground">
                <Lightbulb className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-foreground font-semibold">Practice Tip: </strong>
                  {activeCategory === "technical" &&
                    "Explain your thought process step-by-step. Mention time/space complexity and trade-offs."}
                  {activeCategory === "behavioral" &&
                    "Use the STAR method: Situation, Task, Action, and measurable Result."}
                  {activeCategory === "resume" &&
                    "Be ready to elaborate on metrics, challenges, and ownership from your previous projects."}
                  {activeCategory === "jobSpecific" &&
                    `Connect your answers directly to ${currentJob?.company || "the company"}'s mission and engineering challenges.`}
                </div>
              </div>

              {/* Questions List */}
              {currentCategoryData && currentCategoryData.items.length > 0 ? (
                <div className="space-y-3">
                  {currentCategoryData.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="group relative rounded-xl border border-border bg-card p-4 transition-all duration-200 hover:border-primary/40 hover:shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                            {idx + 1}
                          </span>
                          <div className="space-y-1.5 flex-1 min-w-0">
                            <p className="text-sm font-semibold text-foreground leading-snug">
                              {item.question}
                            </p>
                            {item.context && (
                              <div className="rounded-lg bg-muted/40 p-2.5 text-xs text-muted-foreground border border-border/40">
                                <span className="font-semibold text-foreground/80">
                                  Context & Focus:{" "}
                                </span>
                                {item.context}
                              </div>
                            )}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleCopyQuestion(item.question)}
                          title="Copy question"
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                        >
                          {copiedQuestion === item.question ? (
                            <Check className="h-3.5 w-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-border p-8 text-center text-xs text-muted-foreground">
                  No questions generated in this category. Click &ldquo;Regenerate&rdquo; above.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border bg-muted/20 px-5 py-3.5 sm:px-6">
          <p className="text-xs text-muted-foreground hidden sm:block">
            Targeting: <strong className="text-foreground">{currentJob?.title || "Role"}</strong> at{" "}
            <strong className="text-foreground">{currentJob?.company || "Company"}</strong>
          </p>

          <button
            type="button"
            onClick={onClose}
            className="ml-auto rounded-xl border border-border bg-background px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
