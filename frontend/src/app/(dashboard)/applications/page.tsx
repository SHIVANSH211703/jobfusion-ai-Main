"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import {
  Briefcase,
  Search,
  Filter,
  Kanban,
  List,
  ArrowUpDown,
  X,
  AlertCircle,
  RefreshCw,
  PlusCircle,
  ChevronDown,
} from "lucide-react";
import {
  useApplications,
  useUpdateApplicationStatus,
  useDeleteApplication,
} from "@/hooks/jobs/useApplications";
import type { JobApplication, ApplicationStatus } from "@/types/job";
import ApplicationStats from "@/components/applications/ApplicationStats";
import ApplicationKanban from "@/components/applications/ApplicationKanban";
import ApplicationList from "@/components/applications/ApplicationList";
import ApplicationDetailModal from "@/components/applications/ApplicationDetailModal";
import { ALL_STATUSES } from "@/components/applications/applicationUtils";

// Dynamically import PdfViewer to prevent SSR issues with pdfjs-dist
const PdfViewer = dynamic(() => import("@/components/resume/PdfViewer"), {
  ssr: false,
});

function ApplicationsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL state initialization
  const initialStatus = searchParams.get("status") || "all";
  const initialSearch = searchParams.get("search") || "";

  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [statusFilter, setStatusFilter] = useState<string>(initialStatus);
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");

  // Selection states
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);

  // Resume PDF viewer state
  const [resumeViewerState, setResumeViewerState] = useState<{
    isOpen: boolean;
    resumeId: string;
    title: string;
  }>({
    isOpen: false,
    resumeId: "",
    title: "Resume Preview",
  });

  // Delete confirmation modal state
  const [applicationToDelete, setApplicationToDelete] = useState<JobApplication | null>(null);

  // Queries and mutations
  const { data, isLoading, isError, refetch } = useApplications();
  const updateStatusMutation = useUpdateApplicationStatus();
  const deleteApplicationMutation = useDeleteApplication();

  const applications: JobApplication[] = useMemo(() => {
    return data?.data?.applications ?? [];
  }, [data]);

  // Keep view preference in localStorage
  useEffect(() => {
    try {
      const savedView = localStorage.getItem("jobfusion_applications_view");
      if (savedView === "list" || savedView === "kanban") {
        setViewMode(savedView);
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const handleViewChange = (newView: "kanban" | "list") => {
    setViewMode(newView);
    try {
      localStorage.setItem("jobfusion_applications_view", newView);
    } catch {
      // Ignore
    }
  };

  // Sync search and filter with URL params
  const updateUrlParams = (newSearch: string, newStatus: string) => {
    const params = new URLSearchParams();
    if (newSearch) params.set("search", newSearch);
    if (newStatus && newStatus !== "all") params.set("status", newStatus);
    const queryString = params.toString();
    router.replace(queryString ? `/applications?${queryString}` : "/applications", {
      scroll: false,
    });
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    updateUrlParams(val, statusFilter);
  };

  const handleStatusFilterChange = (val: string) => {
    setStatusFilter(val);
    updateUrlParams(searchQuery, val);
  };

  // Filter and sort applications
  const filteredApplications = useMemo(() => {
    return applications
      .filter((app) => {
        const job = app.jobId && typeof app.jobId === "object" ? app.jobId : app.job;
        const title = (job?.title || "").toLowerCase();
        const company = (job?.company || "").toLowerCase();
        const location = (job?.location || "").toLowerCase();
        const q = searchQuery.toLowerCase().trim();

        const matchesQuery = !q || title.includes(q) || company.includes(q) || location.includes(q);
        const matchesStatus =
          statusFilter === "all" ||
          app.status === statusFilter ||
          (statusFilter === "interview" && (app.status === "technical" || app.status === "hr"));

        return matchesQuery && matchesStatus;
      })
      .sort((a, b) => {
        const dateA = a.appliedAt ? new Date(a.appliedAt).getTime() : 0;
        const dateB = b.appliedAt ? new Date(b.appliedAt).getTime() : 0;
        return sortBy === "newest" ? dateB - dateA : dateA - dateB;
      });
  }, [applications, searchQuery, statusFilter, sortBy]);

  // Actions
  const handleSelectApplication = (app: JobApplication) => {
    setSelectedApplication(app);
    setIsDetailModalOpen(true);
  };

  const handleViewResume = (resumeId: string, title: string) => {
    setResumeViewerState({
      isOpen: true,
      resumeId,
      title,
    });
  };

  const handleStatusChange = (
    jobIdOrAppId: string,
    newStatus: ApplicationStatus,
    notes?: string,
    followUpDate?: string | null
  ) => {
    updateStatusMutation.mutate({
      jobId: jobIdOrAppId,
      status: newStatus,
      notes,
      followUpDate,
    });

    // If modal is open and has matching application, update selectedApplication state
    if (selectedApplication) {
      const selectedJob =
        selectedApplication.jobId && typeof selectedApplication.jobId === "object"
          ? selectedApplication.jobId
          : selectedApplication.job;
      const targetId = selectedJob?._id || selectedApplication._id;
      if (targetId === jobIdOrAppId) {
        setSelectedApplication((prev) =>
          prev
            ? {
                ...prev,
                status: newStatus,
                notes: notes !== undefined ? notes : prev.notes,
                followUpDate: followUpDate !== undefined ? followUpDate : prev.followUpDate,
              }
            : null
        );
      }
    }
  };

  const handleConfirmDelete = () => {
    if (!applicationToDelete) return;
    const job =
      applicationToDelete.jobId && typeof applicationToDelete.jobId === "object"
        ? applicationToDelete.jobId
        : applicationToDelete.job;
    const targetId = job?._id || applicationToDelete._id;

    deleteApplicationMutation.mutate(targetId, {
      onSuccess: () => {
        setApplicationToDelete(null);
        if (selectedApplication?._id === applicationToDelete._id) {
          setIsDetailModalOpen(false);
          setSelectedApplication(null);
        }
      },
    });
  };

  // 1. Loading State
  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse p-1 sm:p-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-muted rounded-xl" />
            <div className="h-4 w-72 bg-muted/60 rounded-lg" />
          </div>
          <div className="h-10 w-32 bg-muted rounded-xl" />
        </div>

        {/* Stats skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-24 bg-card border border-border rounded-2xl p-4" />
          ))}
        </div>

        {/* Filter skeleton */}
        <div className="h-12 bg-card border border-border rounded-2xl" />

        {/* Board skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-96 bg-card/60 border border-border rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  // 2. Error State
  if (isError) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Applications</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Track every job application from submission to final outcome.
            </p>
          </div>
        </div>

        <div className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <AlertCircle className="h-7 w-7" />
          </div>
          <h2 className="text-lg sm:text-xl font-semibold text-foreground">
            Unable to load your applications
          </h2>
          <p className="mt-1.5 max-w-md text-sm text-muted-foreground">
            We couldn&apos;t connect to your job applications right now. Please verify your connection or try again.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90 transition-opacity"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // 3. Global Empty State (User has zero applications across the board)
  if (applications.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Applications</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Track every job application from submission to final outcome.
            </p>
          </div>
        </div>

        <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/60 p-8 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Briefcase className="h-8 w-8" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">No applications yet</h2>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
            Start applying to jobs and your applications will automatically appear here with full status tracking, follow-ups, and resume insights.
          </p>
          <Link
            href="/jobs"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90 transition-all active:scale-95"
          >
            <Briefcase className="h-4 w-4" />
            Explore Jobs
          </Link>
        </div>
      </div>
    );
  }

  // 4. Main Applications View
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Applications
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Track every job application from submission to final outcome.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/jobs"
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-4 sm:px-5 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90 transition-all active:scale-95"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Find More Jobs</span>
          </Link>
        </div>
      </div>

      {/* Real Summary Statistics */}
      <ApplicationStats applications={applications} />

      {/* Toolbar: Search, Filters, Sorters & View Switcher */}
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-3 sm:p-4 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search by job title, company, or location..."
              className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-9 text-sm text-foreground placeholder:text-muted-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => handleSearchChange("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Filters, Sorters & View Switcher */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            {/* Status Filter Dropdown */}
            <div className="relative flex-1 sm:flex-initial min-w-[140px]">
              <select
                aria-label="Filter by application status"
                value={statusFilter}
                onChange={(e) => handleStatusFilterChange(e.target.value)}
                className="h-11 w-full rounded-xl border border-border bg-background px-3 text-xs sm:text-sm font-medium text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary capitalize"
              >
                <option value="all">All Statuses ({applications.length})</option>
                {ALL_STATUSES.map((opt) => {
                  const count = applications.filter((a) => {
                    if (opt.value === "interview") {
                      return (
                        a.status === "interview" ||
                        a.status === "technical" ||
                        a.status === "hr"
                      );
                    }
                    return a.status === opt.value;
                  }).length;
                  return (
                    <option key={opt.value} value={opt.value}>
                      {opt.label} ({count})
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="relative flex-1 sm:flex-initial min-w-[130px]">
              <select
                aria-label="Sort applications"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "newest" | "oldest")}
                className="h-11 w-full rounded-xl border border-border bg-background px-3 text-xs sm:text-sm font-medium text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>

            {/* View Mode Toggle: [Kanban] [List] */}
            <div
              className="inline-flex h-11 items-center rounded-xl border border-border bg-muted/40 p-1"
              role="radiogroup"
              aria-label="Application view switch"
            >
              <button
                type="button"
                role="radio"
                aria-checked={viewMode === "kanban"}
                onClick={() => handleViewChange("kanban")}
                className={`inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-xs sm:text-sm font-semibold transition-all ${
                  viewMode === "kanban"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Kanban className="h-4 w-4" />
                <span>Kanban</span>
              </button>

              <button
                type="button"
                role="radio"
                aria-checked={viewMode === "list"}
                onClick={() => handleViewChange("list")}
                className={`inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-xs sm:text-sm font-semibold transition-all ${
                  viewMode === "list"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <List className="h-4 w-4" />
                <span>List</span>
              </button>
            </div>
          </div>
        </div>

        {/* Active Filters Display */}
        {(searchQuery || statusFilter !== "all") && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/60 text-xs">
            <span className="text-muted-foreground font-medium">Active filters:</span>
            {searchQuery && (
              <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-foreground">
                Query: &quot;{searchQuery}&quot;
                <button
                  type="button"
                  onClick={() => handleSearchChange("")}
                  className="hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {statusFilter !== "all" && (
              <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-foreground capitalize">
                Status: {statusFilter}
                <button
                  type="button"
                  onClick={() => handleStatusFilterChange("all")}
                  className="hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
                updateUrlParams("", "all");
              }}
              className="text-primary hover:underline font-medium ml-1"
            >
              Reset all
            </button>
          </div>
        )}
      </div>

      {/* Main View: Kanban OR List */}
      {viewMode === "kanban" ? (
        <ApplicationKanban
          applications={filteredApplications}
          onSelectApplication={handleSelectApplication}
          onViewResume={handleViewResume}
          onStatusChange={handleStatusChange}
          onDeleteApplication={(app) => setApplicationToDelete(app)}
          isUpdating={updateStatusMutation.isPending}
        />
      ) : (
        <ApplicationList
          applications={filteredApplications}
          onSelectApplication={handleSelectApplication}
          onViewResume={handleViewResume}
          onStatusChange={handleStatusChange}
          onDeleteApplication={(app) => setApplicationToDelete(app)}
          isUpdating={updateStatusMutation.isPending}
        />
      )}

      {/* Application Details Modal */}
      <ApplicationDetailModal
        application={selectedApplication}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedApplication(null);
        }}
        onStatusChange={handleStatusChange}
        onDelete={(app) => setApplicationToDelete(app)}
        onViewResume={handleViewResume}
        isUpdating={updateStatusMutation.isPending}
      />

      {/* Global Attached Resume PDF Viewer */}
      <PdfViewer
        isOpen={resumeViewerState.isOpen}
        onClose={() =>
          setResumeViewerState((prev) => ({ ...prev, isOpen: false }))
        }
        resumeId={resumeViewerState.resumeId}
        title={resumeViewerState.title}
        hasFile={true}
      />

      {/* Application Withdrawal Confirmation Dialog */}
      {applicationToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="fixed inset-0"
            onClick={() => setApplicationToDelete(null)}
            aria-hidden="true"
          />
          <div className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-foreground">Withdraw Application?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Are you sure you want to withdraw your application for{" "}
              <strong className="text-foreground">
                {applicationToDelete.jobId && typeof applicationToDelete.jobId === "object"
                  ? applicationToDelete.jobId.title
                  : applicationToDelete.job?.title || "this job"}
              </strong>
              ? This action will remove the record from your tracker.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setApplicationToDelete(null)}
                className="h-10 rounded-xl border border-border px-4 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleteApplicationMutation.isPending}
                className="h-10 rounded-xl bg-destructive px-4 text-sm font-semibold text-destructive-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {deleteApplicationMutation.isPending ? "Withdrawing..." : "Yes, Withdraw"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ApplicationsPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6 animate-pulse p-4">
          <div className="h-8 w-48 bg-muted rounded-xl" />
          <div className="h-24 bg-card border border-border rounded-2xl" />
        </div>
      }
    >
      <ApplicationsContent />
    </Suspense>
  );
}