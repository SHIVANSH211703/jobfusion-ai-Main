"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  CalendarDays,
  Clock3,
  CheckCircle2,
  Plus,
  Sparkles,
  Search,
  Filter,
  X,
  AlertCircle,
  Briefcase,
  Video,
  ArrowRight,
} from "lucide-react";
import { useApplications } from "@/hooks/jobs/useApplications";
import {
  useInterviews,
  useCreateInterview,
  useUpdateInterview,
  useDeleteInterview,
} from "@/hooks/useInterviews";
import type {
  Interview,
  InterviewRound,
  CreateInterviewRequest,
  UpdateInterviewRequest,
} from "@/types/interview";
import type { JobApplication } from "@/types/job";
import InterviewStats from "@/components/interviews/InterviewStats";
import InterviewCard from "@/components/interviews/InterviewCard";
import ScheduleInterviewModal from "@/components/interviews/ScheduleInterviewModal";
import InterviewDetailModal from "@/components/interviews/InterviewDetailModal";
import AiInterviewPrepModal from "@/components/interviews/AiInterviewPrepModal";

function InterviewsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Queries
  const { data: rawInterviews, isLoading, isError, refetch } = useInterviews();
  const { data: rawApplicationData } = useApplications();

  // Mutations
  const createInterview = useCreateInterview();
  const updateInterview = useUpdateInterview();
  const deleteInterview = useDeleteInterview();

  const interviews: Interview[] = useMemo(() => rawInterviews ?? [], [rawInterviews]);
  const applications: JobApplication[] = useMemo(
    () => rawApplicationData?.data?.applications ?? [],
    [rawApplicationData]
  );

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [roundFilter, setRoundFilter] = useState<string>("all");
  const [statusTab, setStatusTab] = useState<"all" | "upcoming" | "completed">("all");

  // Modals state
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [interviewToEdit, setInterviewToEdit] = useState<Interview | null>(null);
  const [selectedApplicationForSchedule, setSelectedApplicationForSchedule] = useState<string>("");

  const [selectedInterviewForDetail, setSelectedInterviewForDetail] = useState<Interview | null>(
    null
  );
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const [isAiPrepModalOpen, setIsAiPrepModalOpen] = useState(false);
  const [prepApplicationId, setPrepApplicationId] = useState<string>("");

  const [interviewToDelete, setInterviewToDelete] = useState<Interview | null>(null);

  // Check URL query parameters for cross-module actions (e.g. from Applications page)
  useEffect(() => {
    const appIdParam = searchParams.get("applicationId");
    const actionParam = searchParams.get("action");

    if (appIdParam) {
      if (actionParam === "schedule") {
        setSelectedApplicationForSchedule(appIdParam);
        setIsScheduleModalOpen(true);
      } else if (actionParam === "prepare") {
        setPrepApplicationId(appIdParam);
        setIsAiPrepModalOpen(true);
      }
    }
  }, [searchParams]);

  // Separate upcoming vs past/completed
  const now = Date.now();

  const { upcomingInterviews, pastInterviews } = useMemo(() => {
    const matchesFilter = (item: Interview) => {
      const app = typeof item.applicationId === "object" ? item.applicationId : null;
      const job = app?.jobId && typeof app.jobId === "object" ? app.jobId : app?.job;
      const company = (job?.company || "").toLowerCase();
      const role = (job?.title || "").toLowerCase();
      const interviewer = (item.interviewer || "").toLowerCase();
      const q = searchQuery.toLowerCase().trim();

      const matchesQuery =
        !q || company.includes(q) || role.includes(q) || interviewer.includes(q);
      const matchesRound = roundFilter === "all" || item.round === roundFilter;

      return matchesQuery && matchesRound;
    };

    const filtered = interviews.filter(matchesFilter);

    const upcoming = filtered
      .filter(
        (i) => i.status === "scheduled" && new Date(i.scheduledAt).getTime() >= now
      )
      .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());

    const past = filtered
      .filter(
        (i) => i.status !== "scheduled" || new Date(i.scheduledAt).getTime() < now
      )
      .sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime());

    return { upcomingInterviews: upcoming, pastInterviews: past };
  }, [interviews, searchQuery, roundFilter, now]);

  // Actions
  const handleOpenScheduleNew = (appId?: string) => {
    setInterviewToEdit(null);
    setSelectedApplicationForSchedule(appId || "");
    setIsScheduleModalOpen(true);
  };

  const handleEditInterview = (interview: Interview) => {
    setInterviewToEdit(interview);
    setIsScheduleModalOpen(true);
  };

  const handleViewDetails = (interview: Interview) => {
    setSelectedInterviewForDetail(interview);
    setIsDetailModalOpen(true);
  };

  const handleOpenAiPrep = (appId: string) => {
    setPrepApplicationId(appId);
    setIsAiPrepModalOpen(true);
  };

  const handleCompleteInterview = (interview: Interview) => {
    updateInterview.mutate({
      id: interview._id,
      payload: { status: "completed" },
    });
  };

  const handleSaveFeedback = (id: string, feedback: string) => {
    updateInterview.mutate({
      id,
      payload: { feedback },
    });
  };

  const handleConfirmDelete = () => {
    if (!interviewToDelete) return;
    deleteInterview.mutate(interviewToDelete._id, {
      onSuccess: () => {
        setInterviewToDelete(null);
        if (selectedInterviewForDetail?._id === interviewToDelete._id) {
          setIsDetailModalOpen(false);
          setSelectedInterviewForDetail(null);
        }
      },
    });
  };

  const handleSubmitCreate = async (data: CreateInterviewRequest) => {
    await createInterview.mutateAsync(data);
  };

  const handleSubmitUpdate = async (id: string, data: UpdateInterviewRequest) => {
    await updateInterview.mutateAsync({ id, payload: data });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse p-1 sm:p-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-muted rounded-xl" />
            <div className="h-4 w-72 bg-muted/60 rounded-lg" />
          </div>
          <div className="h-10 w-36 bg-muted rounded-xl" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-card border border-border rounded-2xl p-4" />
          ))}
        </div>
        <div className="h-96 bg-card border border-border rounded-2xl" />
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Interview Management
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Track interview rounds, meeting links, notes, and AI mock prep.
          </p>
        </div>

        <div className="flex min-h-[350px] flex-col items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <AlertCircle className="h-7 w-7" />
          </div>
          <h2 className="text-lg font-semibold text-foreground">
            Unable to load your interviews
          </h2>
          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            We couldn&apos;t retrieve your scheduled interview records. Please try again.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-primary">
            Career Workspace
          </p>
          <h1 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Interview Management
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Track upcoming rounds, meeting links, notes, and practice with AI preparation.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsAiPrepModalOpen(true)}
            disabled={applications.length === 0}
            className="inline-flex h-11 items-center gap-2 rounded-xl border border-border bg-card px-4 text-xs sm:text-sm font-semibold text-foreground shadow-sm hover:bg-muted transition-colors disabled:opacity-50"
          >
            <Sparkles className="h-4 w-4 text-primary" />
            <span>AI Mock Prep</span>
          </button>

          <button
            type="button"
            onClick={() => handleOpenScheduleNew()}
            disabled={applications.length === 0}
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-4 sm:px-5 text-xs sm:text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            <span>Schedule Interview</span>
          </button>
        </div>
      </div>

      {/* Summary Statistics */}
      <InterviewStats
        interviews={interviews}
        applications={applications}
        activeFilter={statusTab}
        onSelectFilter={(tab) => setStatusTab(tab)}
      />

      {/* Cross-Module Highlight Banner if applications are in Interview status without an interview */}
      {applications.filter(
        (a) =>
          (a.status === "interview" || a.status === "technical" || a.status === "hr") &&
          !interviews.some(
            (i) =>
              (typeof i.applicationId === "object" ? i.applicationId._id : i.applicationId) ===
              a._id
          )
      ).length > 0 && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-2xl border border-blue-500/20 bg-blue-500/10 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/20 text-blue-600 dark:text-blue-400">
              <CalendarDays className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-semibold text-foreground">
                You have active applications in the Interview pipeline
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Schedule your specific rounds, interviewers, and meeting links to keep track of your schedule.
              </p>
            </div>
          </div>
          <Link
            href="/applications?status=interview"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
          >
            <span>View Applications</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}

      {/* Toolbar: Search, Round Filter & Status Tabs */}
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-3 sm:p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by company, role, or interviewer..."
              className="h-10 w-full rounded-xl border border-border bg-background pl-10 pr-9 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Round Filter */}
            <select
              aria-label="Filter by interview round"
              value={roundFilter}
              onChange={(e) => setRoundFilter(e.target.value)}
              className="h-10 rounded-xl border border-border bg-background px-3 text-xs sm:text-sm font-medium text-foreground shadow-sm focus:border-primary focus:outline-none capitalize"
            >
              <option value="all">All Rounds</option>
              <option value="technical">Technical Round</option>
              <option value="hr">HR Round</option>
              <option value="managerial">Managerial Round</option>
              <option value="behavioral">Behavioral Round</option>
              <option value="other">Other</option>
            </select>

            {/* Status Tabs */}
            <div className="inline-flex h-10 items-center rounded-xl border border-border bg-muted/40 p-1">
              <button
                type="button"
                onClick={() => setStatusTab("all")}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                  statusTab === "all"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setStatusTab("upcoming")}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                  statusTab === "upcoming"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Upcoming ({upcomingInterviews.length})
              </button>
              <button
                type="button"
                onClick={() => setStatusTab("completed")}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                  statusTab === "completed"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Completed ({pastInterviews.length})
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 1: UPCOMING INTERVIEWS */}
      {(statusTab === "all" || statusTab === "upcoming") && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock3 className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold text-foreground">Upcoming Interviews</h2>
              <span className="flex h-5 items-center justify-center rounded-full bg-primary/10 px-2 text-xs font-bold text-primary">
                {upcomingInterviews.length}
              </span>
            </div>

            {upcomingInterviews.length > 0 && (
              <button
                type="button"
                onClick={() => handleOpenScheduleNew()}
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
              >
                <Plus className="h-3.5 w-3.5" />
                Schedule another
              </button>
            )}
          </div>

          {upcomingInterviews.length === 0 ? (
            <div className="flex min-h-[220px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/60 p-8 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                <CalendarDays className="h-6 w-6" />
              </div>
              <h3 className="text-base font-semibold text-foreground">
                No upcoming interviews scheduled
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-muted-foreground max-w-sm">
                When you get an interview invitation, schedule it here to keep your meeting link, date, and preparation notes ready.
              </p>
              {applications.length > 0 ? (
                <button
                  type="button"
                  onClick={() => handleOpenScheduleNew()}
                  className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-sm hover:opacity-90"
                >
                  <Plus className="h-4 w-4" />
                  Schedule Interview
                </button>
              ) : (
                <Link
                  href="/jobs"
                  className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-sm hover:opacity-90"
                >
                  <Briefcase className="h-4 w-4" />
                  Explore Jobs & Apply
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingInterviews.map((interview) => (
                <InterviewCard
                  key={interview._id}
                  interview={interview}
                  onViewDetails={handleViewDetails}
                  onEdit={handleEditInterview}
                  onComplete={handleCompleteInterview}
                  onDelete={(item) => setInterviewToDelete(item)}
                  onPrepare={handleOpenAiPrep}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* SECTION 2: PAST & COMPLETED INTERVIEWS */}
      {(statusTab === "all" || statusTab === "completed") && (
        <section className="space-y-4 pt-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-foreground">Past & Completed</h2>
            <span className="flex h-5 items-center justify-center rounded-full bg-muted px-2 text-xs font-bold text-muted-foreground">
              {pastInterviews.length}
            </span>
          </div>

          {pastInterviews.length === 0 ? (
            statusTab === "completed" && (
              <div className="rounded-2xl border border-dashed border-border p-8 text-center text-xs text-muted-foreground">
                No past or completed interviews recorded yet.
              </div>
            )
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pastInterviews.map((interview) => (
                <InterviewCard
                  key={interview._id}
                  interview={interview}
                  onViewDetails={handleViewDetails}
                  onEdit={handleEditInterview}
                  onComplete={handleCompleteInterview}
                  onDelete={(item) => setInterviewToDelete(item)}
                  onPrepare={handleOpenAiPrep}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* MODAL 1: SCHEDULE / EDIT INTERVIEW */}
      <ScheduleInterviewModal
        isOpen={isScheduleModalOpen}
        onClose={() => {
          setIsScheduleModalOpen(false);
          setInterviewToEdit(null);
        }}
        applications={applications}
        interviewToEdit={interviewToEdit}
        defaultApplicationId={selectedApplicationForSchedule}
        onSubmitCreate={handleSubmitCreate}
        onSubmitUpdate={handleSubmitUpdate}
        isLoading={createInterview.isPending || updateInterview.isPending}
      />

      {/* MODAL 2: INTERVIEW DETAILS */}
      <InterviewDetailModal
        interview={selectedInterviewForDetail}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedInterviewForDetail(null);
        }}
        onEdit={(item) => {
          setIsDetailModalOpen(false);
          handleEditInterview(item);
        }}
        onComplete={handleCompleteInterview}
        onDelete={(item) => setInterviewToDelete(item)}
        onPrepare={handleOpenAiPrep}
        onSaveFeedback={handleSaveFeedback}
        isUpdating={updateInterview.isPending}
      />

      {/* MODAL 3: AI INTERVIEW PREPARATION */}
      <AiInterviewPrepModal
        isOpen={isAiPrepModalOpen}
        onClose={() => setIsAiPrepModalOpen(false)}
        applications={applications}
        selectedApplicationId={prepApplicationId}
      />

      {/* DELETE CONFIRMATION DIALOG */}
      {interviewToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="fixed inset-0"
            onClick={() => setInterviewToDelete(null)}
            aria-hidden="true"
          />
          <div className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-foreground">Delete Interview Record?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Are you sure you want to remove this scheduled interview round? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setInterviewToDelete(null)}
                className="h-10 rounded-xl border border-border px-4 text-xs font-semibold text-foreground hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleteInterview.isPending}
                className="h-10 rounded-xl bg-destructive px-4 text-xs font-semibold text-destructive-foreground hover:opacity-90 disabled:opacity-50"
              >
                {deleteInterview.isPending ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function InterviewsPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6 animate-pulse p-4">
          <div className="h-8 w-48 bg-muted rounded-xl" />
          <div className="h-24 bg-card border border-border rounded-2xl" />
        </div>
      }
    >
      <InterviewsContent />
    </Suspense>
  );
}