"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Compass, Route } from "lucide-react";

import { useResumes } from "@/hooks/resume/useResumes";
import { useCareerGap } from "@/hooks/resume/useCareerGap";

export default function CareerIntelligencePage() {
  const { data: resumes, isLoading } = useResumes();
  const analysis = useCareerGap();
  const [resumeId, setResumeId] = useState("");
  const [targetRole, setTargetRole] = useState("");

  useEffect(() => {
    if (!resumeId && resumes?.length) setResumeId(resumes[0]._id ?? resumes[0].id ?? "");
  }, [resumes, resumeId]);

  const result = analysis.data?.data;

  return (
    <div className="space-y-7 pb-8">
      <header className="border-b border-border pb-5"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">Career intelligence</p><h1 className="mt-2 text-2xl sm:text-3xl font-semibold">Build your next-step roadmap</h1><p className="mt-1 text-sm text-muted-foreground">Compare your current profile with stored requirements for a target role.</p></header>

      <section className="grid gap-4 rounded-xl border border-border bg-card p-4 sm:p-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] md:items-end">
        <label className="grid gap-1.5 text-sm font-medium">Resume
          <select value={resumeId} onChange={(event) => setResumeId(event.target.value)} disabled={isLoading || !resumes?.length} className="h-10 rounded-lg border border-border bg-background px-3 font-normal">
            {resumes?.map((resume) => <option key={resume._id ?? resume.id} value={resume._id ?? resume.id}>{resume.title}</option>)}
            {!resumes?.length && <option value="">No resumes available</option>}
          </select>
        </label>
        <label className="grid gap-1.5 text-sm font-medium">Target role
          <input value={targetRole} onChange={(event) => setTargetRole(event.target.value)} maxLength={120} placeholder="e.g. Backend Engineer" className="h-10 rounded-lg border border-border bg-background px-3 font-normal" />
        </label>
        <button type="button" onClick={() => analysis.mutate({ resumeId, targetRole: targetRole.trim() })} disabled={!resumeId || targetRole.trim().length < 2 || analysis.isPending} className="inline-flex h-10 w-full md:w-auto items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground disabled:opacity-50">{analysis.isPending ? "Analyzing..." : "Analyze role"}<ArrowRight className="h-4 w-4" /></button>
      </section>

      {analysis.isError && <p className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">Career analysis is unavailable right now.</p>}
      {result && <>
        <p className="text-sm text-muted-foreground">Compared against {result.evidenceJobCount} stored job {result.evidenceJobCount === 1 ? "description" : "descriptions"} for <span className="font-medium text-foreground">{result.targetRole}</span>.</p>
        {result.evidenceJobCount === 0 && <p className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4 text-sm">No stored job requirements matched this role. Skills gaps are not inferred without role evidence.</p>}
        <div className="grid gap-4 xl:grid-cols-3">
          <ListSection title="Skills evidenced" icon={<Compass className="h-4 w-4" />} items={result.strongSkills} />
          <ListSection title="Skills to improve" icon={<ArrowRight className="h-4 w-4" />} items={result.skillsToImprove} />
          <ListSection title="Role skill gaps" icon={<Route className="h-4 w-4" />} items={result.missingSkills} />
        </div>
        <div className="grid gap-5 xl:grid-cols-2">
          <ListSection title="Experience gaps" items={result.experienceGaps} />
          <ListSection title="Learning topics" items={result.learningTopics} />
        </div>
        <section className="rounded-xl border border-border bg-card p-5"><h2 className="text-lg font-semibold">Roadmap</h2>{result.roadmap.length ? <ol className="mt-4 space-y-3">{result.roadmap.map((step, index) => <li key={`${step.focus}-${index}`} className="flex gap-3 border-l-2 border-primary/30 pl-4"><span className="text-xs font-semibold text-primary">{String(index + 1).padStart(2, "0")}</span><div><h3 className="text-sm font-semibold">{step.focus}</h3><p className="mt-1 text-sm text-muted-foreground">{step.reason}</p><p className="mt-1 text-xs text-muted-foreground">Addresses: {step.relatedGap}</p></div></li>)}</ol> : <p className="mt-3 text-sm text-muted-foreground">No roadmap steps are supported by the available role evidence.</p>}</section>
      </>}
    </div>
  );
}

function ListSection({ title, items, icon }: { title: string; items: string[]; icon?: React.ReactNode }) {
  return <section className="rounded-xl border border-border bg-card p-5"><h2 className="flex items-center gap-2 text-base font-semibold">{icon}<span>{title}</span></h2>{items.length ? <ul className="mt-3 space-y-2 text-sm text-muted-foreground">{items.map((item, index) => <li key={`${item}-${index}`} className="border-b border-border pb-2 last:border-0">{item}</li>)}</ul> : <p className="mt-3 text-sm text-muted-foreground">No evidence to display.</p>}</section>;
}