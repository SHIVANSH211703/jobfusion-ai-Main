"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import {
  ArrowLeft,
  Banknote,
  Bookmark,
  Briefcase,
  Building2,
  CheckCircle2,
  Clock3,
  ExternalLink,
  FileText,
  Loader2,
  MapPin,
  Plus,
  Sparkles,
  Upload,
} from "lucide-react";

import { toast } from "sonner";

import { useJob } from "@/hooks/jobs/useJob";
import { useSaveJob } from "@/hooks/jobs/useSaveJob";
import { useSavedJobs } from "@/hooks/jobs/useSavedJobs";
import { useApplyJob } from "@/hooks/jobs/useApplyJob";
import { useResumes } from "@/hooks/resume/useResumes";
import { useResumeUpload } from "@/hooks/resume/useResumeUpload";

import type { Resume } from "@/types/resume";

export default function JobDetailsPage() {
  const params = useParams();

  const jobId = params?.id as string;

  /*
   * ============================================================
   * LOCAL STATE
   * ============================================================
   */

  const [notes, setNotes] = useState("");

  const [showApplyForm, setShowApplyForm] =
    useState(false);

  const [selectedResumeId, setSelectedResumeId] =
    useState("");

  /*
   * Keep saved state locally so saving Job B does not
   * remove the saved state of Job A.
   */
  const [isSaved, setIsSaved] = useState(false);

  /*
   * ============================================================
   * JOB DETAILS
   * ============================================================
   */

  const {
    data,
    isLoading,
    isError,
  } = useJob(jobId);

  const job = data?.data;

  /*
   * ============================================================
   * SAVED JOBS
   * ============================================================
   */

  const {
    data: savedJobsData,
  } = useSavedJobs();

  /*
   * ============================================================
   * SAVE MUTATION
   * ============================================================
   */

  const saveMutation = useSaveJob();

  /*
   * ============================================================
   * APPLY MUTATION
   * ============================================================
   */

  const applyMutation = useApplyJob();

  /*
   * ============================================================
   * RESUME UPLOAD MUTATION
   * ============================================================
   */

  const resumeUploadMutation = useResumeUpload();

  /*
   * ============================================================
   * RESUMES
   *
   * We only fetch resumes after the user clicks Apply.
   * ============================================================
   */

  const {
    data: resumes = [],
    isLoading: isResumesLoading,
    isError: isResumesError,
  } = useResumes(showApplyForm);

  /*
   * ============================================================
   * SYNC SAVED STATE
   * ============================================================
   */

  useEffect(() => {
    if (!savedJobsData?.data) {
      return;
    }

    const rawData = savedJobsData.data;

    let savedJobs: any[] = [];

    /*
     * Backend may return:
     *
     * data: []
     *
     * OR
     *
     * data: {
     *   savedJobs: []
     * }
     *
     * OR
     *
     * data: {
     *   jobs: []
     * }
     */

    if (Array.isArray(rawData)) {
      savedJobs = rawData;
    } else if (
      rawData &&
      typeof rawData === "object"
    ) {
      const objectData = rawData as any;

      if (Array.isArray(objectData.savedJobs)) {
        savedJobs = objectData.savedJobs;
      } else if (Array.isArray(objectData.jobs)) {
        savedJobs = objectData.jobs;
      }
    }

    const found = savedJobs.some(
      (savedJob) => {
        const savedJobId =
          typeof savedJob.jobId === "string"
            ? savedJob.jobId
            : savedJob.jobId?._id;

        return savedJobId === jobId;
      }
    );

    setIsSaved(found);
  }, [savedJobsData, jobId]);

  /*
   * ============================================================
   * AUTO SELECT DEFAULT RESUME
   * ============================================================
   */

  useEffect(() => {
    if (!showApplyForm) {
      return;
    }

    if (!resumes || resumes.length === 0) {
      setSelectedResumeId("");
      return;
    }

    /*
     * If a resume is already selected and still exists,
     * keep it selected.
     */
    const selectedStillExists = resumes.some(
      (resume: Resume) => {
        const id = resume._id || resume.id;

        return id === selectedResumeId;
      }
    );

    if (selectedStillExists) {
      return;
    }

    /*
     * Prefer default resume.
     */
    const defaultResume = resumes.find(
      (resume: Resume) => resume.isDefault
    );

    if (defaultResume) {
      setSelectedResumeId(
        defaultResume._id ||
          defaultResume.id ||
          ""
      );

      return;
    }

    /*
     * Otherwise select first resume.
     */
    const firstResume = resumes[0];

    setSelectedResumeId(
      firstResume._id ||
        firstResume.id ||
        ""
    );
  }, [
    showApplyForm,
    resumes,
    selectedResumeId,
  ]);

  /*
   * ============================================================
   * SAVE / UNSAVE
   * ============================================================
   */

  const handleSave = () => {
    if (!jobId) {
      return;
    }

    if (saveMutation.isPending) {
      return;
    }

    const previousSavedState = isSaved;

    saveMutation.mutate(
      {
        jobId,
        isSaved: previousSavedState,
      },
      {
        onSuccess: () => {
          /*
           * Immediately update THIS job's state.
           *
           * This does not affect any other job.
           */
          setIsSaved(!previousSavedState);
        },
      }
    );
  };

  /*
   * ============================================================
   * OPEN APPLY
   * ============================================================
   */

  const handleOpenApply = () => {
    setShowApplyForm(true);
  };

  /*
   * ============================================================
   * RESUME PDF UPLOAD
   * ============================================================
   */

  const handleResumeUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    /*
     * Reset input so the same file can be selected again.
     */
    event.target.value = "";

    if (!file) {
      return;
    }

    /*
     * Only PDF is allowed.
     */
    if (
      file.type !== "application/pdf" &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      toast.error("Please upload a PDF resume.");
      return;
    }

    /*
     * Backend maximum file size = 5 MB.
     */
    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      toast.error(
        "Resume must be smaller than 5 MB."
      );
      return;
    }

    /*
     * Upload resume.
     *
     * Backend will:
     * - upload the PDF
     * - extract text
     * - parse the resume
     * - create Resume document
     * - return resumeId
     */
    resumeUploadMutation.mutate(file, {
      onSuccess: (response) => {
        const resumeId =
          response?.data?.resumeId;

        if (!resumeId) {
          toast.error(
            "Resume uploaded but resume ID was not returned."
          );

          return;
        }

        /*
         * Automatically select the newly uploaded resume.
         */
        setSelectedResumeId(resumeId);
      },
    });
  };

  /*
   * ============================================================
   * CLOSE APPLY
   * ============================================================
   */

  const handleCloseApply = () => {
    if (applyMutation.isPending) {
      return;
    }

    if (resumeUploadMutation.isPending) {
      return;
    }

    setShowApplyForm(false);
    setSelectedResumeId("");
    setNotes("");
  };

  /*
   * ============================================================
   * APPLY
   * ============================================================
   */

  const handleApply = () => {
    if (!jobId) {
      return;
    }

    /*
     * No resume selected.
     */
    if (!selectedResumeId) {
      toast.error(
        "Please select or upload a resume before applying."
      );

      return;
    }

    applyMutation.mutate(
      {
        jobId,
        resumeId: selectedResumeId,
        notes,
      },
      {
        onSuccess: () => {
          setShowApplyForm(false);
          setSelectedResumeId("");
          setNotes("");
        },
      }
    );
  };

  /*
   * ============================================================
   * SALARY FORMATTER
   * ============================================================
   */

  const formatSalary = (
    min: number | null | undefined,
    max: number | null | undefined,
    currency: string | undefined
  ) => {
    if (!min && !max) {
      return "Salary not specified";
    }

    const symbol =
      currency === "INR"
        ? "₹"
        : currency || "";

    if (min && max) {
      return `${symbol}${min.toLocaleString()} - ${symbol}${max.toLocaleString()}`;
    }

    if (min) {
      return `${symbol}${min.toLocaleString()}+`;
    }

    if (max) {
      return `Up to ${symbol}${max.toLocaleString()}`;
    }

    return "Salary not specified";
  };

  /*
   * ============================================================
   * POSTED DATE FORMATTER
   * ============================================================
   */

  const formatPostedDate = (
    postedAt: string | null | undefined
  ) => {
    if (!postedAt) {
      return "Recently posted";
    }

    const date = new Date(postedAt);

    if (Number.isNaN(date.getTime())) {
      return "Recently posted";
    }

    const difference =
      Date.now() - date.getTime();

    const days = Math.floor(
      difference /
        (1000 * 60 * 60 * 24)
    );

    if (days <= 0) {
      return "Posted today";
    }

    if (days === 1) {
      return "Posted yesterday";
    }

    if (days < 30) {
      return `Posted ${days} days ago`;
    }

    return `Posted ${date.toLocaleDateString()}`;
  };

  /*
   * ============================================================
   * LOADING
   * ============================================================
   */

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-500/10">
            <Loader2 className="h-6 w-6 animate-spin text-violet-500" />
          </div>

          <p className="text-sm text-muted-foreground">
            Loading job details...
          </p>
        </div>
      </div>
    );
  }

  /*
   * ============================================================
   * ERROR / NOT FOUND
   * ============================================================
   */

  if (isError || !job) {
    return (
      <div className="mx-auto max-w-4xl py-10">
        <Link
          href="/jobs"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-violet-500"
        >
          <ArrowLeft className="h-4 w-4" />

          Back to Jobs
        </Link>

        <div className="mt-6 rounded-3xl border border-red-500/20 bg-red-500/5 p-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10">
            <Briefcase className="h-7 w-7 text-red-500" />
          </div>

          <h2 className="mt-5 text-xl font-semibold">
            Job not found
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            We couldn't load this job. It may no
            longer be available.
          </p>

          <Link
            href="/jobs"
            className="mt-6 inline-flex rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700"
          >
            Browse Jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto max-w-6xl space-y-6">
        {/* =====================================================
            BACK TO JOBS
        ====================================================== */}

        <Link
          href="/jobs"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-violet-500"
        >
          <ArrowLeft className="h-4 w-4" />

          Back to Jobs
        </Link>

        {/* =====================================================
            JOB HEADER
        ====================================================== */}

        <section className="rounded-3xl border border-border/70 bg-card/60 p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            {/* Job information */}
            <div className="flex gap-5">
              {/* Company icon */}
              <div className="hidden h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-violet-600/10 sm:flex">
                <Building2 className="h-7 w-7 text-violet-500" />
              </div>

              <div>
                {/* Title */}
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                    {job.title}
                  </h1>

                  {job.isRemote && (
                    <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-500">
                      Remote
                    </span>
                  )}
                </div>

                {/* Company */}
                <p className="mt-2 text-base font-medium text-muted-foreground">
                  {job.company}
                </p>

                {/* Meta */}
                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />

                    {job.location ||
                      "Location not specified"}
                  </span>

                  {job.jobType && (
                    <span className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />

                      {job.jobType}
                    </span>
                  )}

                  <span className="flex items-center gap-2">
                    <Clock3 className="h-4 w-4" />

                    {formatPostedDate(
                      job.postedAt
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
              {/* Save */}
              <button
                type="button"
                onClick={handleSave}
                disabled={saveMutation.isPending}
                className={`flex items-center justify-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-semibold transition ${
                  isSaved
                    ? "border-violet-500/40 bg-violet-500/10 text-violet-500 hover:bg-violet-500/15"
                    : "border-border hover:border-violet-500/40 hover:bg-violet-500/5"
                } disabled:cursor-not-allowed disabled:opacity-60`}
              >
                {saveMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Bookmark
                    className={`h-4 w-4 ${
                      isSaved
                        ? "fill-current"
                        : ""
                    }`}
                  />
                )}

                {isSaved
                  ? "Saved"
                  : "Save Job"}
              </button>

              {/* AI Match */}
              <button
                type="button"
                onClick={() => {
                  document
                    .getElementById("ai-match")
                    ?.scrollIntoView({
                      behavior: "smooth",
                    });
                }}
                className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700"
              >
                <Sparkles className="h-4 w-4" />

                AI Match
              </button>
            </div>
          </div>

          {/* =====================================================
              JOB SUMMARY
          ====================================================== */}

          <div className="mt-7 grid gap-3 border-t border-border pt-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Salary */}
            <div className="rounded-2xl bg-background/60 p-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Banknote className="h-4 w-4" />

                Salary
              </div>

              <p className="mt-2 text-sm font-semibold">
                {formatSalary(
                  job.salary?.min,
                  job.salary?.max,
                  job.salary?.currency
                )}
              </p>
            </div>

            {/* Job type */}
            <div className="rounded-2xl bg-background/60 p-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Briefcase className="h-4 w-4" />

                Job Type
              </div>

              <p className="mt-2 text-sm font-semibold">
                {job.jobType ||
                  "Not specified"}
              </p>
            </div>

            {/* Source */}
            <div className="rounded-2xl bg-background/60 p-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Building2 className="h-4 w-4" />

                Source
              </div>

              <p className="mt-2 text-sm font-semibold capitalize">
                {job.source}
              </p>
            </div>
          </div>
        </section>

        {/* =====================================================
            MAIN CONTENT
        ====================================================== */}

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* =====================================================
              LEFT CONTENT
          ====================================================== */}

          <div className="space-y-6">
            {/* Job Description */}
            <section className="rounded-3xl border border-border/70 bg-card/60 p-6 shadow-sm md:p-8">
              <h2 className="text-xl font-semibold">
                Job Description
              </h2>

              <div className="mt-5 whitespace-pre-line text-sm leading-7 text-muted-foreground">
                {job.description ||
                  "No job description is available for this position."}
              </div>
            </section>

            {/* Skills */}
            <section className="rounded-3xl border border-border/70 bg-card/60 p-6 shadow-sm md:p-8">
              <h2 className="text-xl font-semibold">
                Skills & Requirements
              </h2>

              {job.skills &&
              job.skills.length > 0 ? (
                <div className="mt-5 flex flex-wrap gap-2">
                  {job.skills.map(
                  (skill: string) => (
                      <span
                        key={skill}
                        className="rounded-full border border-border bg-background px-4 py-2 text-sm text-muted-foreground transition hover:border-violet-500/40 hover:text-violet-500"
                      >
                        {skill}
                      </span>
                    )
                  )}
                </div>
              ) : (
                <p className="mt-4 text-sm text-muted-foreground">
                  No specific skills listed.
                </p>
              )}
            </section>

            {/* =================================================
                AI MATCH
            ================================================== */}

            <section
              id="ai-match"
              className="rounded-3xl border border-violet-500/20 bg-violet-500/5 p-6 shadow-sm md:p-8"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-600/15">
                  <Sparkles className="h-6 w-6 text-violet-500" />
                </div>

                <div>
                  <h2 className="text-xl font-semibold">
                    AI Resume Match
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    Compare your resume with this job
                    and understand your skill match,
                    strengths and missing skills.
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-violet-500/10 bg-background/60 p-5">
                <div className="flex items-start gap-3">
                  <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-violet-500" />

                  <div>
                    <p className="text-sm font-semibold">
                      AI-powered job analysis
                    </p>

                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      Select your resume to calculate
                      how well it matches this position.
                    </p>
                  </div>
                </div>

                {/* AI Match button */}
                <button
                  type="button"
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700"
                >
                  <Sparkles className="h-4 w-4" />

                  Analyze My Resume
                </button>
              </div>
            </section>
          </div>

          {/* =====================================================
              RIGHT SIDEBAR
          ====================================================== */}

          <aside className="space-y-4">
            {/* =================================================
                APPLY CARD
            ================================================== */}

            <div className="rounded-3xl border border-border/70 bg-card/60 p-5 shadow-sm">
              <h3 className="font-semibold">
                Apply for this job
              </h3>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Submit your application and keep track
                of it from your Applications page.
              </p>

              {!showApplyForm ? (
                <button
                  type="button"
                  onClick={handleOpenApply}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700"
                >
                  Apply Now

                  <ExternalLink className="h-4 w-4" />
                </button>
              ) : (
                <div className="mt-5 space-y-4">
                  {/* =================================================
                      RESUME SECTION
                  ================================================== */}

                  {isResumesLoading ? (
                    <div className="flex items-center justify-center rounded-xl border border-border p-6">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />

                        Checking your resumes...
                      </div>
                    </div>
                  ) : isResumesError ? (
                    <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
                      <p className="text-sm font-medium text-red-500">
                        Unable to load your resumes.
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        Please try again.
                      </p>
                    </div>
                  ) : resumes.length === 0 ? (
                    /*
                     * =================================================
                     * NO RESUME
                     * =================================================
                     */

                    <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-5">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10">
                          <FileText className="h-5 w-5 text-violet-500" />
                        </div>

                        <div>
                          <h4 className="text-sm font-semibold">
                            Resume required
                          </h4>

                          <p className="mt-1 text-xs leading-5 text-muted-foreground">
                            Upload a PDF resume to apply
                            for this job.
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 space-y-2">
                        {/* Direct PDF Upload */}
                        <label
                          className={`flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-violet-700 ${
                            resumeUploadMutation.isPending
                              ? "cursor-not-allowed opacity-60"
                              : ""
                          }`}
                        >
                          {resumeUploadMutation.isPending ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Uploading Resume...
                            </>
                          ) : (
                            <>
                              <Upload className="h-4 w-4" />
                              Upload Resume PDF
                            </>
                          )}

                          <input
                            type="file"
                            accept="application/pdf,.pdf"
                            className="hidden"
                            disabled={
                              resumeUploadMutation.isPending
                            }
                            onChange={
                              handleResumeUpload
                            }
                          />
                        </label>

                        {/* Create Resume */}
                        <Link
                          href="/resume/create"
                          onClick={() =>
                            setShowApplyForm(false)
                          }
                          className="flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition hover:bg-muted"
                        >
                          <Plus className="h-4 w-4" />

                          Create Resume
                        </Link>
                      </div>

                      <p className="mt-3 text-[11px] leading-4 text-muted-foreground">
                        PDF only • Maximum size 5 MB
                      </p>
                    </div>
                  ) : (
                    /*
                     * =================================================
                     * RESUME SELECTION
                     * =================================================
                     */

                    <>
                      <div>
                        <label className="text-sm font-medium">
                          Select Resume
                        </label>

                        <p className="mt-1 text-xs text-muted-foreground">
                          Choose the resume you want to
                          use for this application.
                        </p>
                      </div>

                      <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
                        {resumes.map(
                          (resume: Resume) => {
                            const resumeId =
                              resume._id ||
                              resume.id ||
                              "";

                            const selected =
                              selectedResumeId ===
                              resumeId;

                            return (
                              <button
                                key={resumeId}
                                type="button"
                                onClick={() =>
                                  setSelectedResumeId(
                                    resumeId
                                  )
                                }
                                className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${
                                  selected
                                    ? "border-violet-500 bg-violet-500/10"
                                    : "border-border hover:bg-muted"
                                }`}
                              >
                                <div
                                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                                    selected
                                      ? "bg-violet-500/15"
                                      : "bg-muted"
                                  }`}
                                >
                                  <FileText
                                    className={`h-5 w-5 ${
                                      selected
                                        ? "text-violet-500"
                                        : "text-muted-foreground"
                                    }`}
                                  />
                                </div>

                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2">
                                    <p className="truncate text-sm font-medium">
                                      {resume.title}
                                    </p>

                                    {resume.isDefault && (
                                      <span className="shrink-0 rounded-full bg-violet-500/10 px-2 py-0.5 text-[10px] font-medium text-violet-500">
                                        Default
                                      </span>
                                    )}
                                  </div>

                                  <p className="mt-1 text-xs text-muted-foreground">
                                    ATS Score:{" "}
                                    {resume.atsScore ||
                                      0}
                                  </p>
                                </div>

                                {selected && (
                                  <CheckCircle2 className="h-5 w-5 shrink-0 text-violet-500" />
                                )}
                              </button>
                            );
                          }
                        )}
                      </div>

                      {/* =================================================
                          UPLOAD NEW RESUME
                      ================================================== */}

                      <div className="space-y-2">
                        <label
                          className={`flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-violet-500/40 px-4 py-3 text-sm font-medium text-violet-500 transition hover:bg-violet-500/5 ${
                            resumeUploadMutation.isPending
                              ? "cursor-not-allowed opacity-60"
                              : ""
                          }`}
                        >
                          {resumeUploadMutation.isPending ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />

                              Uploading Resume...
                            </>
                          ) : (
                            <>
                              <Upload className="h-4 w-4" />

                              Upload New Resume PDF
                            </>
                          )}

                          <input
                            type="file"
                            accept="application/pdf,.pdf"
                            className="hidden"
                            disabled={
                              resumeUploadMutation.isPending
                            }
                            onChange={
                              handleResumeUpload
                            }
                          />
                        </label>

                        <p className="text-center text-[11px] text-muted-foreground">
                          PDF only • Maximum size 5 MB
                        </p>
                      </div>

                      {/* =================================================
                          NOTE
                      ================================================== */}

                      <div>
                        <label className="text-sm font-medium">
                          Note
                          <span className="ml-1 text-xs font-normal text-muted-foreground">
                            (optional)
                          </span>
                        </label>

                        <textarea
                          value={notes}
                          onChange={(event) =>
                            setNotes(
                              event.target.value
                            )
                          }
                          placeholder="Add an optional note..."
                          rows={3}
                          className="mt-2 w-full resize-none rounded-xl border border-border bg-background p-3 text-sm outline-none transition focus:border-violet-500"
                        />
                      </div>

                      {/* =================================================
                          APPLY
                      ================================================== */}

                      <button
                        type="button"
                        onClick={handleApply}
                        disabled={
                          !selectedResumeId ||
                          applyMutation.isPending ||
                          resumeUploadMutation.isPending
                        }
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {applyMutation.isPending && (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        )}

                        {applyMutation.isPending
                          ? "Applying..."
                          : "Apply with Selected Resume"}
                      </button>
                    </>
                  )}

                  {/* =================================================
                      CANCEL
                  ================================================== */}

                  <button
                    type="button"
                    onClick={handleCloseApply}
                    disabled={
                      applyMutation.isPending ||
                      resumeUploadMutation.isPending
                    }
                    className="w-full rounded-xl border border-border px-5 py-3 text-sm font-medium transition hover:bg-muted disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* =================================================
                JOB INFORMATION
            ================================================== */}

            <div className="rounded-3xl border border-border/70 bg-card/60 p-5 shadow-sm">
              <h3 className="font-semibold">
                Job Information
              </h3>

              <div className="mt-5 space-y-5">
                {/* Company */}
                <div>
                  <p className="text-xs text-muted-foreground">
                    Company
                  </p>

                  <p className="mt-1 text-sm font-medium">
                    {job.company}
                  </p>
                </div>

                {/* Location */}
                <div>
                  <p className="text-xs text-muted-foreground">
                    Location
                  </p>

                  <p className="mt-1 text-sm font-medium">
                    {job.location ||
                      "Not specified"}
                  </p>
                </div>

                {/* Job Type */}
                <div>
                  <p className="text-xs text-muted-foreground">
                    Job Type
                  </p>

                  <p className="mt-1 text-sm font-medium">
                    {job.jobType ||
                      "Not specified"}
                  </p>
                </div>

                {/* Remote */}
                <div>
                  <p className="text-xs text-muted-foreground">
                    Work Mode
                  </p>

                  <p className="mt-1 text-sm font-medium">
                    {job.isRemote
                      ? "Remote"
                      : "On-site / Not specified"}
                  </p>
                </div>

                {/* Source */}
                <div>
                  <p className="text-xs text-muted-foreground">
                    Source
                  </p>

                  <p className="mt-1 text-sm font-medium capitalize">
                    {job.source}
                  </p>
                </div>

                {/* Posted */}
                <div>
                  <p className="text-xs text-muted-foreground">
                    Posted
                  </p>

                  <p className="mt-1 text-sm font-medium">
                    {formatPostedDate(
                      job.postedAt
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* =================================================
                APPLICATION STATUS INFO
            ================================================== */}

            <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-5">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />

                <div>
                  <p className="text-sm font-semibold">
                    Track your application
                  </p>

                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    Once you apply, you can track your
                    application status from Applications.
                  </p>

                  <Link
                    href="/applications"
                    className="mt-3 inline-flex text-xs font-semibold text-emerald-600 hover:underline"
                  >
                    View Applications →
                  </Link>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}