"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Bell, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useDeleteSavedSearch, useSavedSearches, useUpdateSavedSearch } from "@/hooks/jobs/useSavedSearches";

export default function SavedSearchesPage() {
  const router = useRouter();
  const { data: searches, isLoading, isError } = useSavedSearches();
  const updateSearch = useUpdateSavedSearch();
  const deleteSearch = useDeleteSavedSearch();

  if (isLoading) return <div className="p-8 text-sm text-muted-foreground">Loading saved searches...</div>;
  if (isError) return <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6 text-sm text-destructive">Unable to load saved searches.</div>;

  return (
    <div className="space-y-7 pb-8">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-5">
        <div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Job discovery</p><h1 className="mt-2 text-3xl font-semibold">Saved searches</h1><p className="mt-1 text-sm text-muted-foreground">Keep useful job filters ready to run.</p></div>
        <Link href="/jobs" className="inline-flex items-center gap-2 text-sm font-medium text-primary">Find jobs <ArrowRight className="h-4 w-4" /></Link>
      </header>

      {!searches?.length ? (
        <div className="rounded-xl border border-dashed border-border p-8"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><Bell className="h-5 w-5" /></div><h2 className="mt-4 text-lg font-semibold">No saved searches</h2><p className="mt-1 text-sm text-muted-foreground">Save filters from Jobs to reuse your search criteria.</p><Link href="/jobs" className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary">Open job search <ArrowRight className="h-4 w-4" /></Link></div>
      ) : (
        <div className="divide-y divide-border rounded-xl border border-border bg-card">
          {searches.map((search) => (
            <article key={search._id} className="flex flex-wrap items-center justify-between gap-4 p-5">
              <div className="min-w-0"><div className="flex items-center gap-2"><h2 className="font-semibold">{search.name}</h2><span className={`rounded-full px-2 py-0.5 text-xs ${search.enabled ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : "bg-muted text-muted-foreground"}`}>{search.enabled ? "Enabled" : "Paused"}</span></div><p className="mt-2 text-sm text-muted-foreground">{[
                search.filters.search,
                search.filters.location,
                search.filters.remote === true ? "Remote" : search.filters.remote === false ? "On-site" : "",
                search.filters.jobType,
                search.filters.minSalary ? `Min salary ${search.filters.minSalary}` : "",
              ].filter(Boolean).join(" · ") || "All jobs"}</p></div>
              <div className="flex items-center gap-2"><Button variant="outline" size="sm" onClick={() => router.push(`/jobs?${new URLSearchParams(Object.entries(search.filters).filter(([, value]) => value !== undefined && value !== null && value !== "").map(([key, value]) => [key, String(value)]))}`)}>Run search</Button><Button variant="outline" size="sm" onClick={() => updateSearch.mutate({ id: search._id, payload: { enabled: !search.enabled } })}>{search.enabled ? "Pause" : "Enable"}</Button><Button variant="ghost" size="icon" aria-label={`Delete ${search.name}`} onClick={() => deleteSearch.mutate(search._id)}><Trash2 className="h-4 w-4" /></Button></div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}