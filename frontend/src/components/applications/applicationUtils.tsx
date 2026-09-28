import React from "react";
import {
  Briefcase,
  Clock3,
  CheckCircle2,
  XCircle,
  FileCheck2,
  UserCheck,
  Ban,
} from "lucide-react";
import type { ApplicationStatus } from "@/types/job";

export interface StatusColumnConfig {
  key: ApplicationStatus;
  label: string;
  badgeClass: string;
  dotClass: string;
  columnBg: string;
  borderClass: string;
}

export const KANBAN_COLUMNS: StatusColumnConfig[] = [
  {
    key: "applied",
    label: "Applied",
    badgeClass: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20",
    dotClass: "bg-blue-500",
    columnBg: "bg-blue-50/50 dark:bg-blue-950/20",
    borderClass: "border-blue-200 dark:border-blue-900/50",
  },
  {
    key: "screening",
    label: "Screening",
    badgeClass: "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20",
    dotClass: "bg-purple-500",
    columnBg: "bg-purple-50/50 dark:bg-purple-950/20",
    borderClass: "border-purple-200 dark:border-purple-900/50",
  },
  {
    key: "interview",
    label: "Interview",
    badgeClass: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20",
    dotClass: "bg-amber-500",
    columnBg: "bg-amber-50/50 dark:bg-amber-950/20",
    borderClass: "border-amber-200 dark:border-amber-900/50",
  },
  {
    key: "offer",
    label: "Offer",
    badgeClass: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
    dotClass: "bg-emerald-500",
    columnBg: "bg-emerald-50/50 dark:bg-emerald-950/20",
    borderClass: "border-emerald-200 dark:border-emerald-900/50",
  },
  {
    key: "rejected",
    label: "Rejected",
    badgeClass: "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20",
    dotClass: "bg-rose-500",
    columnBg: "bg-rose-50/50 dark:bg-rose-950/20",
    borderClass: "border-rose-200 dark:border-rose-900/50",
  },
];

export const ALL_STATUSES: { key: ApplicationStatus; value: ApplicationStatus; label: string }[] = [
  { key: "applied", value: "applied", label: "Applied" },
  { key: "screening", value: "screening", label: "Screening" },
  { key: "interview", value: "interview", label: "Interview" },
  { key: "technical", value: "technical", label: "Technical Round" },
  { key: "hr", value: "hr", label: "HR Round" },
  { key: "offer", value: "offer", label: "Offer" },
  { key: "rejected", value: "rejected", label: "Rejected" },
  { key: "withdrawn", value: "withdrawn", label: "Withdrawn" },
];

export function getStatusLabel(status: string): string {
  switch (status) {
    case "applied":
      return "Applied";
    case "screening":
      return "Screening";
    case "interview":
      return "Interview";
    case "technical":
      return "Technical Round";
    case "hr":
      return "HR Round";
    case "offer":
      return "Offer";
    case "rejected":
      return "Rejected";
    case "withdrawn":
      return "Withdrawn";
    default:
      return status.charAt(0).toUpperCase() + status.slice(1);
  }
}

export function getStatusBadgeClass(status: string): string {
  switch (status) {
    case "applied":
      return "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20";
    case "screening":
      return "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20";
    case "interview":
    case "technical":
    case "hr":
      return "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20";
    case "offer":
      return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20";
    case "rejected":
      return "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20";
    case "withdrawn":
      return "bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/20";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
}

export function getStatusIcon(status: string): React.ReactNode {
  switch (status) {
    case "applied":
      return <Briefcase className="h-3.5 w-3.5 shrink-0" />;
    case "screening":
      return <FileCheck2 className="h-3.5 w-3.5 shrink-0" />;
    case "interview":
    case "technical":
    case "hr":
      return <Clock3 className="h-3.5 w-3.5 shrink-0" />;
    case "offer":
      return <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />;
    case "rejected":
      return <XCircle className="h-3.5 w-3.5 shrink-0" />;
    case "withdrawn":
      return <Ban className="h-3.5 w-3.5 shrink-0" />;
    default:
      return <UserCheck className="h-3.5 w-3.5 shrink-0" />;
  }
}

export function normalizeKanbanStatus(status: ApplicationStatus): ApplicationStatus {
  if (status === "technical" || status === "hr") {
    return "interview";
  }
  return status;
}

export function formatFollowUpDate(dateString: string | null | undefined): {
  text: string;
  formatted: string;
  isOverdue: boolean;
  isToday: boolean;
} | null {
  if (!dateString) return null;
  const target = new Date(dateString);
  if (isNaN(target.getTime())) return null;

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const targetStart = new Date(target.getFullYear(), target.getMonth(), target.getDate()).getTime();

  const isToday = todayStart === targetStart;
  const isOverdue = targetStart < todayStart;

  const dateText = target.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: target.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });

  return {
    text: dateText,
    formatted: dateText,
    isOverdue,
    isToday,
  };
}
