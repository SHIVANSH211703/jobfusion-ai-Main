"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import {
  Bookmark,
  BriefcaseBusiness,
  Building2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Loader2,
  MapPin,
  Search,
  SlidersHorizontal,
} from "lucide-react";

import { useJobs } from "@/hooks/jobs/useJobs";
import { useSavedJobs } from "@/hooks/jobs/useSavedJobs";
import { useSaveJob } from "@/hooks/jobs/useSaveJob";

import type { Job } from "@/types/job";

const JOBS_PER_PAGE = 20;

export default function JobsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");

  const [searchInput, setSearchInput] = useState("");
  const [locationInput, setLocationInput] = useState("");

  const [page, setPage] = useState(1);

  /*
   * Keep locally saved job IDs.
   *
   * This makes the button update immediately after
   * successful save / unsave.
   */
  const [savedJobIds, setSavedJobIds] = useState<
    Set<string>
  >(new Set());

  /*
   * Jobs
   */
  const {
    data,
    isLoading,
    isError,
    isFetching,
  } = useJobs({
    page,
    limit: JOBS_PER_PAGE,
    search: search || undefined,
    location: location || undefined,
  });

  /*
   * Saved jobs
   */
  const {
    data: savedJobsData,
    isLoading: isSavedJobsLoading,
  } = useSavedJobs();

  /*
   * Save / Unsave mutation
   */
  const saveMutation = useSaveJob();

  const jobs = data?.data?.jobs ?? [];

  const total = data?.data?.total ?? 0;

  const totalPages =
    data?.data?.totalPages ??
    Math.ceil(total / JOBS_PER_PAGE);

  useEffect(() => {
    const nextSearch = searchParams.get("search") ?? "";
    const nextLocation = searchParams.get("location") ?? "";

    setSearchInput(nextSearch);
    setLocationInput(nextLocation);
    setSearch(nextSearch);
    setLocation(nextLocation);
  }, [searchParams]);

  /*
   * Sync saved jobs from backend.
   */
  useEffect(() => {
    const rawData = savedJobsData?.data;

    const savedJobs = rawData?.jobs ?? [];

    const ids = new Set<string>();

    savedJobs.forEach((savedJob) => {
      ids.add(savedJob._id);
    });

    setSavedJobIds(ids);
  }, [savedJobsData]);

  /*
   * Search
   */
  const handleSearch = () => {
    const nextSearch = searchInput.trim();
    const nextLocation = locationInput.trim();

    setSearch(nextSearch);
    setLocation(nextLocation);

    const params = new URLSearchParams();

    if (nextSearch) params.set("search", nextSearch);
    if (nextLocation) params.set("location", nextLocation);

    router.push(params.toString() ? `/jobs?${params.toString()}` : "/jobs");
    setPage(1);
  };

  /*
   * Enter key search
   */
  const handleSearchKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  /*
   * Clear search
   */
  const handleClearSearch = () => {
    setSearchInput("");
    setLocationInput("");

    setSearch("");
    setLocation("");

    setPage(1);
  };

  /*
   * Save / Unsave
   *
   * IMPORTANT:
   * We stop event propagation so clicking Save
   * never opens the Job Details page.
   */
  const handleSave = (
    event: React.MouseEvent<HTMLButtonElement>,
    job: Job
  ) => {
    event.preventDefault();
    event.stopPropagation();

    if (saveMutation.isPending) {
      return;
    }

    const currentlySaved = savedJobIds.has(job._id);

    saveMutation.mutate(
      {
        jobId: job._id,
        isSaved: currentlySaved,
      },
      {
        onSuccess: () => {
          setSavedJobIds((previous) => {
            const next = new Set(previous);

            if (currentlySaved) {
              next.delete(job._id);
            } else {
              next.add(job._id);
            }

            return next;
          });
        },
      }
    );
  };

  /*
   * Format posted date
   */
  const formatPostedDate = (postedAt?: string | null) => {
    if (!postedAt) {
      return "Recently posted";
    }

    const date = new Date(postedAt);

    if (Number.isNaN(date.getTime())) {
      return "Recently posted";
    }

    const now = new Date();

    const difference =
      now.getTime() - date.getTime();

    const days = Math.floor(
      difference / (1000 * 60 * 60 * 24)
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
   * Salary formatter
   */
  const formatSalary = (job: Job) => {
    const min = job.salary?.min;
    const max = job.salary?.max;

    if (!min && !max) {
      return null;
    }

    const currency =
      job.salary?.currency || "INR";

    const formatAmount = (amount: number) => {
      if (amount >= 100000) {
        return `${(amount / 100000).toFixed(1)}L`;
      }

      if (amount >= 1000) {
        return `${Math.round(
          amount / 1000
        )}K`;
      }

      return amount.toString();
    };

    if (min && max) {
      return `${currency} ${formatAmount(
        min
      )} - ${formatAmount(max)}`;
    }

    if (min) {
      return `${currency} ${formatAmount(min)}+`;
    }

    if (max) {
      return `Up to ${currency} ${formatAmount(
        max
      )}`;
    }

    return null;
  };

  /*
   * Previous page
   */
  const handlePreviousPage = () => {
    if (page > 1) {
      setPage((previous) => previous - 1);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  /*
   * Next page
   */
  const handleNextPage = () => {
    if (page < totalPages) {
      setPage((previous) => previous + 1);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  /*
   * Loading
   */
  if (isLoading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />

          <p className="text-sm text-muted-foreground">
            Loading jobs...
          </p>
        </div>
      </div>
    );
  }

  /*
   * Error
   */
  if (isError) {
    return (
      <div className="flex min-h-[500px] flex-col items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <BriefcaseBusiness className="h-8 w-8 text-destructive" />
        </div>

        <h2 className="text-xl font-semibold">
          Unable to load jobs
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong while fetching jobs.
        </p>

        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-6 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-7">
      {/* ========================================================= */}
      {/* HEADER */}
      {/* ========================================================= */}

      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-purple-500/15">
          <BriefcaseBusiness className="h-5 w-5 text-purple-500" />
        </div>

        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Find Your Next Job
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Discover opportunities that match your
            skills and experience.
          </p>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SEARCH BOX */}
      {/* ========================================================= */}

      <div className="rounded-2xl border bg-card/50 p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <input
              type="text"
              value={searchInput}
              onChange={(event) =>
                setSearchInput(event.target.value)
              }
              onKeyDown={handleSearchKeyDown}
              placeholder="Job title, skills or company"
              className="h-11 w-full rounded-xl border bg-background pl-11 pr-4 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Location */}
          <div className="relative flex-1">
            <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <input
              type="text"
              value={locationInput}
              onChange={(event) =>
                setLocationInput(event.target.value)
              }
              onKeyDown={handleSearchKeyDown}
              placeholder="Location"
              className="h-11 w-full rounded-xl border bg-background pl-11 pr-4 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Search button */}
          <button
            type="button"
            onClick={handleSearch}
            className="flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-7 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            <Search className="h-4 w-4" />

            Search
          </button>
        </div>

        {/* Filters row */}
        <div className="mt-3 flex items-center gap-4">
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg border px-4 py-2 text-xs font-medium text-muted-foreground transition hover:bg-muted"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />

            Filters
          </button>

          {(search || location) && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="text-xs font-medium text-muted-foreground transition hover:text-foreground"
            >
              Clear search
            </button>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* JOBS HEADER */}
      {/* ========================================================= */}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">
            Available Jobs
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            {total} {total === 1 ? "job" : "jobs"} found
          </p>
        </div>

        {totalPages > 0 && (
          <p className="text-sm text-muted-foreground">
            Page{" "}
            <span className="font-medium text-foreground">
              {page}
            </span>{" "}
            of{" "}
            <span className="font-medium text-foreground">
              {totalPages}
            </span>
          </p>
        )}
      </div>

      {/* ========================================================= */}
      {/* FETCHING INDICATOR */}
      {/* ========================================================= */}

      {isFetching && !isLoading && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />

          Updating jobs...
        </div>
      )}

      {/* ========================================================= */}
      {/* EMPTY STATE */}
      {/* ========================================================= */}

      {jobs.length === 0 ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed p-8 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <BriefcaseBusiness className="h-8 w-8 text-primary" />
          </div>

          <h2 className="text-xl font-semibold">
            No jobs found
          </h2>

          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Try changing your search keywords or
            location.
          </p>

          {(search || location) && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="mt-6 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <>
          {/* ===================================================== */}
          {/* JOB LIST */}
          {/* ===================================================== */}

          <div className="space-y-4">
            {jobs.map((job: Job) => {
              const isSaved = savedJobIds.has(
                job._id
              );

              const salary = formatSalary(job);

              return (
                <div
                  key={job._id}
                  className="group rounded-2xl border bg-card p-5 transition-all duration-200 hover:border-primary/30 hover:shadow-md"
                >
                  <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                    {/* ========================================= */}
                    {/* JOB CONTENT */}
                    {/* ========================================= */}

                    <div className="flex min-w-0 gap-4">
                      {/* Company Icon */}
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-purple-500/10">
                        <Building2 className="h-5 w-5 text-purple-500" />
                      </div>

                      {/* Details */}
                      <div className="min-w-0">
                        <h3 className="truncate text-base font-semibold sm:text-lg">
                          {job.title}
                        </h3>

                        <p className="mt-1 text-sm text-muted-foreground">
                          {job.company}
                        </p>

                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
                          {/* Location */}
                          {job.location && (
                            <div className="flex items-center gap-1.5">
                              <MapPin className="h-3.5 w-3.5" />

                              <span>
                                {job.location}
                              </span>
                            </div>
                          )}

                          {/* Job type */}
                          {job.jobType && (
                            <div className="flex items-center gap-1.5">
                              <BriefcaseBusiness className="h-3.5 w-3.5" />

                              <span className="capitalize">
                                {job.jobType}
                              </span>
                            </div>
                          )}

                          {/* Posted */}
                          <div className="flex items-center gap-1.5">
                            <Clock3 className="h-3.5 w-3.5" />

                            <span>
                              {formatPostedDate(
                                job.postedAt ?? null
                              )}
                            </span>
                          </div>

                          {/* Salary */}
                          {salary && (
                            <span className="font-medium text-green-500">
                              {salary}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* ========================================= */}
                    {/* ACTIONS */}
                    {/* ========================================= */}

                    <div className="flex shrink-0 items-center gap-3 md:flex-col md:items-stretch">
                      {/* SAVE BUTTON */}

                      <button
                        type="button"
                        onClick={(event) =>
                          handleSave(
                            event,
                            job
                          )
                        }
                        disabled={
                          saveMutation.isPending &&
                          saveMutation.variables
                            ?.jobId === job._id
                        }
                        className={`flex min-w-[110px] items-center justify-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition-all ${
                          isSaved
                            ? "border-purple-500/40 bg-purple-500/15 text-purple-400 hover:bg-purple-500/25"
                            : "border-border bg-background text-foreground hover:border-purple-500/40 hover:bg-purple-500/10"
                        }`}
                      >
                        {saveMutation.isPending &&
                        saveMutation.variables
                          ?.jobId === job._id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Bookmark
                            className={`h-4 w-4 transition ${
                              isSaved
                                ? "fill-current"
                                : ""
                            }`}
                          />
                        )}

                        {isSaved
                          ? "Saved"
                          : "Save"}
                      </button>

                      {/* VIEW DETAILS */}

                      <Link
                        href={`/jobs/${job._id}`}
                        className="flex min-w-[110px] items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ===================================================== */}
          {/* PAGINATION */}
          {/* ===================================================== */}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-4">
              <button
                type="button"
                onClick={handlePreviousPage}
                disabled={page <= 1}
                className="flex h-10 items-center gap-2 rounded-xl border px-4 text-sm font-medium transition hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />

                Previous
              </button>

              <div className="flex h-10 min-w-10 items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground">
                {page}
              </div>

              <button
                type="button"
                onClick={handleNextPage}
                disabled={page >= totalPages}
                className="flex h-10 items-center gap-2 rounded-xl border px-4 text-sm font-medium transition hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
              >
                Next

                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}