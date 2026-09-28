"use client";

import { useEffect, useState } from "react";
import { GitCompareArrows, RotateCcw, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  useCreateResumeVersion,
  useRestoreResumeVersion,
  useResumeVersion,
  useResumeVersions,
} from "@/hooks/resume/useResumeVersions";

const compareSections = ["title", "summary", "personalInfo", "skills", "experience", "education", "projects"] as const;

export default function ResumeVersionHistory({ resumeId }: { resumeId: string }) {
  const { data, isLoading, isError } = useResumeVersions(resumeId);
  const versions = data?.data ?? [];
  const [selectedId, setSelectedId] = useState("");
  const [compareId, setCompareId] = useState("");
  const selected = useResumeVersion(resumeId, selectedId);
  const compared = useResumeVersion(resumeId, compareId);
  const createVersion = useCreateResumeVersion();
  const restoreVersion = useRestoreResumeVersion();

  useEffect(() => {
    if (!selectedId && versions.length > 0) setSelectedId(versions[0]._id);
    if (!compareId && versions.length > 1) setCompareId(versions[1]._id);
  }, [versions, selectedId, compareId]);

  const selectedContent = selected.data?.data.content;
  const comparedContent = compared.data?.data.content;
  const changedSections = selectedContent && comparedContent
    ? compareSections.filter((section) => JSON.stringify(selectedContent[section]) !== JSON.stringify(comparedContent[section]))
    : [];

  const handleRestore = () => {
    if (!selectedId || !window.confirm("Restore this version? The current resume will be saved as a new version.")) return;
    restoreVersion.mutate({ resumeId, versionId: selectedId });
  };

  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Version history</h2>
          <p className="mt-1 text-sm text-muted-foreground">{versions.length} saved versions</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => createVersion.mutate(resumeId)} disabled={createVersion.isPending}>
          <Save className="mr-2 h-4 w-4" />
          {createVersion.isPending ? "Saving..." : "Create checkpoint"}
        </Button>
      </div>

      {isLoading ? <p className="mt-5 text-sm text-muted-foreground">Loading versions...</p> : null}
      {isError ? <p className="mt-5 text-sm text-destructive">Unable to load version history.</p> : null}
      {!isLoading && !isError && versions.length === 0 ? <p className="mt-5 text-sm text-muted-foreground">No saved versions yet.</p> : null}

      {versions.length > 0 && (
        <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(220px,0.7fr)_minmax(0,1.3fr)]">
          <div className="space-y-2" role="list" aria-label="Resume versions">
            {versions.map((version) => (
              <button
                key={version._id}
                type="button"
                onClick={() => setSelectedId(version._id)}
                className={`w-full rounded-lg border p-3 text-left transition ${selectedId === version._id ? "border-primary bg-primary/5" : "border-border hover:bg-muted"}`}
              >
                <span className="flex items-center justify-between gap-2 text-sm font-medium">
                  <span>Version {version.versionNumber}</span>
                  <span className="text-xs capitalize text-muted-foreground">{version.source.replaceAll("_", " ")}</span>
                </span>
                <span className="mt-1 block text-xs text-muted-foreground">{new Date(version.createdAt).toLocaleString()}</span>
              </button>
            ))}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <label htmlFor="compare-version" className="text-sm text-muted-foreground">Compare with</label>
              <select
                id="compare-version"
                value={compareId}
                onChange={(event) => setCompareId(event.target.value)}
                className="h-9 min-w-0 rounded-md border border-border bg-background px-2 text-sm"
              >
                <option value="">Choose a version</option>
                {versions.filter((version) => version._id !== selectedId).map((version) => (
                  <option key={version._id} value={version._id}>Version {version.versionNumber}</option>
                ))}
              </select>
              <Button variant="outline" size="sm" onClick={handleRestore} disabled={!selectedId || restoreVersion.isPending}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Restore selected
              </Button>
            </div>

            {selectedContent && comparedContent && (
              <div className="mt-4 space-y-3">
                <p className="flex items-center gap-2 text-sm font-medium"><GitCompareArrows className="h-4 w-4 text-primary" />Changed sections</p>
                {changedSections.length > 0 ? changedSections.map((section) => (
                  <div key={section} className="grid min-w-0 gap-2 rounded-lg border border-border p-3 md:grid-cols-2">
                    <div className="min-w-0">
                      <p className="mb-1 text-xs font-semibold capitalize text-muted-foreground">Version {compared.data?.data.versionNumber}</p>
                      <pre className="max-h-36 overflow-auto whitespace-pre-wrap break-words text-xs">{JSON.stringify(comparedContent[section] ?? null, null, 2)}</pre>
                    </div>
                    <div className="min-w-0">
                      <p className="mb-1 text-xs font-semibold capitalize text-muted-foreground">Version {selected.data?.data.versionNumber}</p>
                      <pre className="max-h-36 overflow-auto whitespace-pre-wrap break-words text-xs">{JSON.stringify(selectedContent[section] ?? null, null, 2)}</pre>
                    </div>
                  </div>
                )) : <p className="text-sm text-muted-foreground">No content differences between these versions.</p>}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}