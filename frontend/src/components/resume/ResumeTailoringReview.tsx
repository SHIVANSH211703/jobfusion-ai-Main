"use client";

import { useEffect, useState } from "react";
import { Check, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Resume, ResumeTailoringResponse, UpdateResumeRequest } from "@/types/resume";

interface Props {
  resume: Resume;
  suggestions: ResumeTailoringResponse["data"];
  isSaving: boolean;
  onApply: (payload: UpdateResumeRequest) => void;
}

export default function ResumeTailoringReview({ resume, suggestions, isSaving, onApply }: Props) {
  const [accepted, setAccepted] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const initial: Record<string, boolean> = { summary: true };
    for (const section of ["experience", "projects", "achievements"] as const) {
      suggestions[section].forEach((item) => { initial[`${section}-${item.index}`] = true; });
    }
    setAccepted(initial);
  }, [suggestions]);

  const toggle = (key: string) => setAccepted((current) => ({ ...current, [key]: !current[key] }));
  const selectedCount = Object.values(accepted).filter(Boolean).length;

  const applyAccepted = () => {
    const payload: UpdateResumeRequest = {};
    if (accepted.summary) payload.summary = suggestions.summary;
    if (suggestions.experience.length > 0) {
      payload.experience = resume.experience.map((item, index) => ({
        ...item,
        description: accepted[`experience-${index}`]
          ? suggestions.experience[index].description
          : item.description,
      }));
    }
    if (suggestions.projects.length > 0) {
      payload.projects = resume.projects.map((item, index) => ({
        ...item,
        description: accepted[`projects-${index}`]
          ? suggestions.projects[index].description
          : item.description,
      }));
    }
    if (suggestions.achievements.length > 0) {
      payload.achievements = resume.achievements.map((item, index) => ({
        ...item,
        description: accepted[`achievements-${index}`]
          ? suggestions.achievements[index].description
          : item.description,
      }));
    }
    onApply(payload);
  };

  return (
    <section className="rounded-xl border border-primary/20 bg-primary/5 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold">Review tailored wording</h3>
          <p className="mt-1 text-sm text-muted-foreground">{suggestions.changes.join(" · ")}</p>
        </div>
        <Button onClick={applyAccepted} disabled={isSaving || selectedCount === 0}>
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? "Saving..." : `Apply ${selectedCount} selected`}
        </Button>
      </div>

      <div className="mt-5 space-y-4">
        <SuggestionRow
          label="Summary"
          original={resume.summary}
          suggested={suggestions.summary}
          checked={Boolean(accepted.summary)}
          onToggle={() => toggle("summary")}
        />
        {(["experience", "projects", "achievements"] as const).flatMap((section) =>
          suggestions[section].map((suggestion) => {
            const key = `${section}-${suggestion.index}`;
            const original = resume[section][suggestion.index]?.description ?? "";
            return (
              <SuggestionRow
                key={key}
                label={`${section} ${suggestion.index + 1}`}
                original={original}
                suggested={suggestion.description}
                checked={Boolean(accepted[key])}
                onToggle={() => toggle(key)}
              />
            );
          })
        )}
      </div>
    </section>
  );
}

function SuggestionRow({
  label,
  original,
  suggested,
  checked,
  onToggle,
}: {
  label: string;
  original: string;
  suggested: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <label className="flex cursor-pointer items-center gap-2 text-sm font-medium capitalize">
        <input type="checkbox" checked={checked} onChange={onToggle} />
        <Check className="h-4 w-4 text-primary" />
        {label}
      </label>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <p className="whitespace-pre-wrap rounded-md bg-muted/60 p-3 text-sm text-muted-foreground">{original || "No existing text"}</p>
        <p className="whitespace-pre-wrap rounded-md bg-primary/5 p-3 text-sm text-foreground">{suggested || "No text proposed"}</p>
      </div>
    </div>
  );
}