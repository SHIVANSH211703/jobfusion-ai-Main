import React from "react";
import {
  Code2,
  Users,
  Briefcase,
  UserCheck,
  HelpCircle,
  Video,
  Phone,
  Building,
  Globe,
} from "lucide-react";
import type { InterviewRound, InterviewType, InterviewStatus } from "@/types/interview";

export function getRoundLabel(round: InterviewRound): string {
  switch (round) {
    case "technical":
      return "Technical Round";
    case "hr":
      return "HR Round";
    case "managerial":
      return "Managerial Round";
    case "behavioral":
      return "Behavioral Round";
    case "other":
    default:
      return "Interview Round";
  }
}

export function getRoundBadgeClass(round: InterviewRound): string {
  switch (round) {
    case "technical":
      return "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20";
    case "hr":
      return "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20";
    case "managerial":
      return "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20";
    case "behavioral":
      return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20";
    case "other":
    default:
      return "bg-muted text-muted-foreground border-border";
  }
}

export function getRoundIcon(round: InterviewRound): React.ReactNode {
  switch (round) {
    case "technical":
      return <Code2 className="h-3.5 w-3.5 shrink-0" />;
    case "hr":
      return <Users className="h-3.5 w-3.5 shrink-0" />;
    case "managerial":
      return <Briefcase className="h-3.5 w-3.5 shrink-0" />;
    case "behavioral":
      return <UserCheck className="h-3.5 w-3.5 shrink-0" />;
    case "other":
    default:
      return <HelpCircle className="h-3.5 w-3.5 shrink-0" />;
  }
}

export function getTypeLabel(type: InterviewType): string {
  switch (type) {
    case "video":
      return "Video Call";
    case "phone":
      return "Phone Call";
    case "onsite":
      return "Onsite / In-person";
    case "other":
    default:
      return "Other";
  }
}

export function getTypeIcon(type: InterviewType): React.ReactNode {
  switch (type) {
    case "video":
      return <Video className="h-3.5 w-3.5 shrink-0" />;
    case "phone":
      return <Phone className="h-3.5 w-3.5 shrink-0" />;
    case "onsite":
      return <Building className="h-3.5 w-3.5 shrink-0" />;
    case "other":
    default:
      return <Globe className="h-3.5 w-3.5 shrink-0" />;
  }
}

export function getTypeBadgeClass(type: InterviewType): string {
  switch (type) {
    case "video":
      return "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20";
    case "phone":
      return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20";
    case "onsite":
      return "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20";
    case "other":
    default:
      return "bg-muted text-muted-foreground border-border";
  }
}

export function getStatusBadgeClass(status: InterviewStatus): string {
  switch (status) {
    case "scheduled":
      return "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20";
    case "completed":
      return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20";
    case "cancelled":
      return "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
}

export function formatInterviewDateTime(isoString: string): {
  date: string;
  time: string;
  relative: string;
  isPast: boolean;
  isToday: boolean;
} {
  const date = new Date(isoString);
  const now = new Date();

  if (isNaN(date.getTime())) {
    return {
      date: "Invalid Date",
      time: "",
      relative: "",
      isPast: false,
      isToday: false,
    };
  }

  const isPast = date.getTime() < now.getTime();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const dateStart = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  const isToday = todayStart === dateStart;

  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  let relative = "";
  if (isToday) {
    relative = "Today";
  } else if (diffDays === 1) {
    relative = "Tomorrow";
  } else if (diffDays === -1) {
    relative = "Yesterday";
  } else if (diffDays > 1 && diffDays <= 7) {
    relative = `In ${diffDays} days`;
  } else if (diffDays < -1 && diffDays >= -7) {
    relative = `${Math.abs(diffDays)} days ago`;
  }

  const dateFormatted = date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });

  const timeFormatted = date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });

  return {
    date: dateFormatted,
    time: timeFormatted,
    relative,
    isPast,
    isToday,
  };
}
