"use client";

import React, { useState } from "react";
import type { JobApplication, ApplicationStatus } from "@/types/job";
import { KANBAN_COLUMNS, normalizeKanbanStatus } from "./applicationUtils";
import ApplicationCard from "./ApplicationCard";

interface ApplicationKanbanProps {
  applications: JobApplication[];
  onSelectApplication: (application: JobApplication) => void;
  onViewResume?: (resumeId: string, title: string) => void;
  onStatusChange: (jobId: string, status: ApplicationStatus) => void;
  onDeleteApplication?: (application: JobApplication) => void;
  isUpdating?: boolean;
}

export default function ApplicationKanban({
  applications,
  onSelectApplication,
  onViewResume,
  onStatusChange,
  onDeleteApplication,
}: ApplicationKanbanProps) {
  const [draggedAppId, setDraggedAppId] = useState<string | null>(null);
  const [activeDropColumn, setActiveDropColumn] = useState<ApplicationStatus | null>(null);
  const [mobileTab, setMobileTab] = useState<ApplicationStatus | "all">("all");

  // Group applications by normalized Kanban status
  const grouped = React.useMemo(() => {
    const map: Record<ApplicationStatus, JobApplication[]> = {
      applied: [],
      screening: [],
      interview: [],
      technical: [],
      hr: [],
      offer: [],
      rejected: [],
      withdrawn: [],
    };

    applications.forEach((app) => {
      const status = app.status || "applied";
      const kanbanCol = normalizeKanbanStatus(status);
      if (!map[kanbanCol]) {
        map[kanbanCol] = [];
      }
      map[kanbanCol].push(app);
    });

    return map;
  }, [applications]);

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    application: JobApplication
  ) => {
    const job =
      application.jobId && typeof application.jobId === "object"
        ? application.jobId
        : application.job;
    const targetId = job?._id || application._id;
    setDraggedAppId(targetId);
    e.dataTransfer.setData("text/plain", targetId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (
    e: React.DragEvent<HTMLDivElement>,
    columnKey: ApplicationStatus
  ) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (activeDropColumn !== columnKey) {
      setActiveDropColumn(columnKey);
    }
  };

  const handleDragLeave = (
    _e: React.DragEvent<HTMLDivElement>,
    columnKey: ApplicationStatus
  ) => {
    if (activeDropColumn === columnKey) {
      setActiveDropColumn(null);
    }
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    targetStatus: ApplicationStatus
  ) => {
    e.preventDefault();
    setActiveDropColumn(null);
    const targetId = e.dataTransfer.getData("text/plain") || draggedAppId;
    setDraggedAppId(null);

    if (targetId) {
      onStatusChange(targetId, targetStatus);
    }
  };

  return (
    <div className="space-y-4">
      {/* Mobile Tab Filter (Visible on small screens < 768px) */}
      <div className="flex md:hidden overflow-x-auto pb-2 gap-1.5 scrollbar-none overscroll-contain">
        <button
          type="button"
          onClick={() => setMobileTab("all")}
          className={`shrink-0 rounded-xl px-3.5 py-2 text-xs font-semibold min-h-[44px] transition ${
            mobileTab === "all"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "border border-border bg-card text-muted-foreground hover:bg-muted"
          }`}
        >
          All ({applications.length})
        </button>
        {KANBAN_COLUMNS.map((col) => {
          const count = (grouped[col.key] || []).length;
          const isActive = mobileTab === col.key;
          return (
            <button
              key={col.key}
              type="button"
              onClick={() => setMobileTab(col.key)}
              className={`shrink-0 flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold min-h-[44px] transition ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "border border-border bg-card text-muted-foreground hover:bg-muted"
              }`}
            >
              <span>{col.label}</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                  isActive
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Kanban Board Container */}
      <div className="flex flex-col md:grid md:grid-cols-5 gap-4 overflow-x-auto pb-6">
        {KANBAN_COLUMNS.map((col) => {
          const items = grouped[col.key] || [];
          const isDropTarget = activeDropColumn === col.key;

          // On mobile, if a specific tab is selected, hide other columns
          const isHiddenOnMobile =
            mobileTab !== "all" && mobileTab !== col.key;

          return (
            <div
              key={col.key}
              onDragOver={(e) => handleDragOver(e, col.key)}
              onDragLeave={(e) => handleDragLeave(e, col.key)}
              onDrop={(e) => handleDrop(e, col.key)}
              className={`flex flex-col rounded-2xl border transition-all duration-200 ${
                isHiddenOnMobile ? "hidden md:flex" : "flex"
              } ${
                isDropTarget
                  ? "border-primary bg-primary/5 ring-2 ring-primary/30"
                  : `${col.borderClass} ${col.columnBg}`
              }`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between p-3.5 border-b border-border/60">
                <div className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${col.dotClass}`} />
                  <h3 className="text-sm font-semibold text-foreground">
                    {col.label}
                  </h3>
                </div>
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-background px-1.5 text-xs font-bold text-muted-foreground border border-border/80">
                  {items.length}
                </span>
              </div>

              {/* Column Cards Container */}
              <div className="flex-1 p-2.5 space-y-2.5 min-h-[300px] overflow-y-auto">
                {items.length === 0 ? (
                  <div className="flex h-32 flex-col items-center justify-center rounded-xl border border-dashed border-border/70 p-4 text-center">
                    <p className="text-xs text-muted-foreground">
                      No applications
                    </p>
                    <p className="mt-1 text-[11px] text-muted-foreground/80">
                      Drop cards here to change status
                    </p>
                  </div>
                ) : (
                  items.map((app) => (
                    <ApplicationCard
                      key={app._id}
                      application={app}
                      onViewDetails={onSelectApplication}
                      onViewResume={onViewResume}
                      onStatusChange={onStatusChange}
                      onDelete={onDeleteApplication}
                      isDragging={draggedAppId === (app.jobId?._id || app._id)}
                      onDragStart={(e) => handleDragStart(e, app)}
                      onDragEnd={() => setDraggedAppId(null)}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
