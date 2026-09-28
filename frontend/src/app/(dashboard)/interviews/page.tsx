"use client";

import { useMemo, useState } from "react";
import { CalendarDays, Clock3, MapPin, Plus, Sparkles, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useApplications } from "@/hooks/jobs/useApplications";
import { useCreateInterview, useDeleteInterview, useInterviews, useInterviewPreparation, useUpdateInterview } from "@/hooks/useInterviews";
import type { InterviewRound, InterviewType } from "@/types/interview";
import type { JobApplication } from "@/types/job";

const rounds: InterviewRound[] = ["technical", "hr", "managerial", "behavioral", "other"];
const interviewTypes: InterviewType[] = ["phone", "video", "onsite", "other"];

export default function InterviewsPage() {
  const { data: interviews, isLoading, isError } = useInterviews();
  const { data: applicationData } = useApplications();
  const createInterview = useCreateInterview();
  const updateInterview = useUpdateInterview();
  const deleteInterview = useDeleteInterview();
  const preparation = useInterviewPreparation();
  const [showForm, setShowForm] = useState(false);
  const [applicationId, setApplicationId] = useState("");
  const [round, setRound] = useState<InterviewRound>("technical");
  const [type, setType] = useState<InterviewType>("video");
  const [scheduledAt, setScheduledAt] = useState("");
  const [interviewer, setInterviewer] = useState("");
  const [notes, setNotes] = useState("");
  const [feedbackDrafts, setFeedbackDrafts] = useState<Record<string, string>>({});

  const applications: JobApplication[] = applicationData?.data?.applications ?? [];
  const upcoming = useMemo(
    () => (interviews ?? []).filter((interview) => interview.status === "scheduled" && new Date(interview.scheduledAt).getTime() >= Date.now()),
    [interviews]
  );
  const past = useMemo(
    () => (interviews ?? []).filter((interview) => !upcoming.some((item) => item._id === interview._id)),
    [interviews, upcoming]
  );

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!applicationId || !scheduledAt) return;
    createInterview.mutate(
      { applicationId, round, type, scheduledAt: new Date(scheduledAt).toISOString(), interviewer, notes },
      { onSuccess: () => { setShowForm(false); setScheduledAt(""); setNotes(""); } }
    );
  };

  if (isLoading) return <div className="p-8 text-sm text-muted-foreground">Loading interviews...</div>;
  if (isError) return <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6 text-sm text-destructive">Unable to load interviews.</div>;

  return (
    <div className="space-y-7 pb-8">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Career workspace</p>
          <h1 className="mt-2 text-2xl sm:text-3xl font-semibold">Interviews</h1>
          <p className="mt-1 text-sm text-muted-foreground">Schedule and track interview rounds for your applications.</p>
        </div>
        <Button onClick={() => setShowForm((value) => !value)} disabled={applications.length === 0} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" /> Schedule interview
        </Button>
      </header>

      {applications.length === 0 && (
        <div className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">
          Apply to a job before scheduling an interview.
        </div>
      )}

      {applications.length > 0 && (
        <section className="rounded-xl border border-border bg-card p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-end gap-3">
            <label className="grid w-full sm:min-w-[220px] flex-1 gap-1.5 text-sm font-medium">Prepare for an application
              <select value={applicationId} onChange={(event) => setApplicationId(event.target.value)} className="h-10 rounded-lg border border-border bg-background px-3 font-normal">
                <option value="">Select an application</option>
                {applications.map((application) => {
                  const job = application.jobId && typeof application.jobId === "object" ? application.jobId : application.job;
                  return <option key={application._id} value={application._id}>{job?.company ?? "Company"} · {job?.title ?? "Role"}</option>;
                })}
              </select>
            </label>
            <Button onClick={() => applicationId && preparation.mutate(applicationId)} disabled={!applicationId || preparation.isPending} className="w-full sm:w-auto">
              <Sparkles className="mr-2 h-4 w-4" />{preparation.isPending ? "Preparing..." : "Prepare for interview"}
            </Button>
          </div>
          {preparation.isError && <p className="mt-3 text-sm text-destructive">Preparation unavailable for this application. Confirm its job description and applied resume are still available.</p>}
          {preparation.data && <div className="mt-5 grid gap-4 md:grid-cols-2">
            {([
              ["Technical", preparation.data.data.technicalQuestions],
              ["Behavioral", preparation.data.data.behavioralQuestions],
              ["From your resume", preparation.data.data.resumeQuestions],
              ["Job-specific", preparation.data.data.jobSpecificQuestions],
            ] as const).map(([title, questions]) => <section key={title} className="rounded-lg border border-border p-4">
              <h3 className="text-sm font-semibold">{title}</h3>
              {questions.length > 0 ? <ol className="mt-3 list-decimal space-y-3 pl-5">{questions.map((item, index) => <li key={`${item.question}-${index}`} className="text-sm"><p>{item.question}</p><p className="mt-1 text-xs text-muted-foreground">{item.context}</p></li>)}</ol> : <p className="mt-2 text-sm text-muted-foreground">No supported questions for this category.</p>}
            </section>)}
          </div>}
        </section>
      )}

      {showForm && applications.length > 0 && (
        <form onSubmit={submit} className="grid gap-4 rounded-xl border border-border bg-card p-5 md:grid-cols-2">
          <label className="grid gap-1.5 text-sm font-medium">Application
            <select required value={applicationId} onChange={(event) => setApplicationId(event.target.value)} className="h-10 rounded-lg border border-border bg-background px-3 font-normal">
              <option value="">Select an application</option>
              {applications.map((application) => {
                const job = application.jobId && typeof application.jobId === "object" ? application.jobId : application.job;
                return <option key={application._id} value={application._id}>{job?.company ?? "Company"} · {job?.title ?? "Role"}</option>;
              })}
            </select>
          </label>
          <label className="grid gap-1.5 text-sm font-medium">Round
            <select value={round} onChange={(event) => setRound(event.target.value as InterviewRound)} className="h-10 rounded-lg border border-border bg-background px-3 font-normal">{rounds.map((item) => <option key={item} value={item}>{item}</option>)}</select>
          </label>
          <label className="grid gap-1.5 text-sm font-medium">Format
            <select value={type} onChange={(event) => setType(event.target.value as InterviewType)} className="h-10 rounded-lg border border-border bg-background px-3 font-normal">{interviewTypes.map((item) => <option key={item} value={item}>{item}</option>)}</select>
          </label>
          <label className="grid gap-1.5 text-sm font-medium">Date and time
            <input required type="datetime-local" value={scheduledAt} onChange={(event) => setScheduledAt(event.target.value)} className="h-10 rounded-lg border border-border bg-background px-3 font-normal" />
          </label>
          <label className="grid gap-1.5 text-sm font-medium">Interviewer
            <input value={interviewer} onChange={(event) => setInterviewer(event.target.value)} maxLength={160} className="h-10 rounded-lg border border-border bg-background px-3 font-normal" />
          </label>
          <label className="grid gap-1.5 text-sm font-medium md:col-span-2">Preparation notes
            <textarea value={notes} onChange={(event) => setNotes(event.target.value)} maxLength={5000} rows={3} className="rounded-lg border border-border bg-background p-3 font-normal" />
          </label>
          <div className="flex gap-2 md:col-span-2"><Button type="submit" disabled={createInterview.isPending}>{createInterview.isPending ? "Scheduling..." : "Save interview"}</Button><Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button></div>
        </form>
      )}

      <section>
        <div className="mb-3 flex items-center gap-2"><CalendarDays className="h-4 w-4 text-primary" /><h2 className="text-lg font-semibold">Upcoming</h2><span className="text-sm text-muted-foreground">{upcoming.length}</span></div>
        {upcoming.length === 0 ? <p className="rounded-lg border border-dashed border-border p-5 text-sm text-muted-foreground">No upcoming interviews scheduled.</p> : <div className="divide-y divide-border rounded-xl border border-border bg-card">{upcoming.map((interview) => <InterviewRow key={interview._id} interview={interview} onComplete={() => updateInterview.mutate({ id: interview._id, payload: { status: "completed" } })} onDelete={() => deleteInterview.mutate(interview._id)} />)}</div>}
      </section>

      {past.length > 0 && <section>
        <h2 className="mb-3 text-lg font-semibold">Past and completed</h2>
        <div className="divide-y divide-border rounded-xl border border-border bg-card">{past.map((interview) => <div key={interview._id} className="p-4">
          <InterviewRow interview={interview} onComplete={() => updateInterview.mutate({ id: interview._id, payload: { status: "completed" } })} onDelete={() => deleteInterview.mutate(interview._id)} />
          {interview.status === "completed" && <div className="mt-3 flex gap-2"><input aria-label="Interview feedback" value={feedbackDrafts[interview._id] ?? interview.feedback} onChange={(event) => setFeedbackDrafts((current) => ({ ...current, [interview._id]: event.target.value }))} placeholder="Add interview feedback" className="h-10 min-w-0 flex-1 rounded-lg border border-border bg-background px-3 text-sm" /><Button size="sm" variant="outline" onClick={() => updateInterview.mutate({ id: interview._id, payload: { feedback: feedbackDrafts[interview._id] ?? interview.feedback } })}>Save feedback</Button></div>}
        </div>)}</div>
      </section>}
    </div>
  );
}

function InterviewRow({ interview, onComplete, onDelete }: { interview: import("@/types/interview").Interview; onComplete: () => void; onDelete: () => void }) {
  const application = typeof interview.applicationId === "object" ? interview.applicationId : null;
  const job = application?.jobId && typeof application.jobId === "object" ? application.jobId : application?.job;
  return (
    <article className="flex flex-wrap items-start justify-between gap-4 p-4">
      <div className="min-w-0">
        <p className="font-semibold">{job?.title ?? "Interview"}<span className="font-normal text-muted-foreground"> · {job?.company ?? "Application"}</span></p>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground"><span className="inline-flex items-center gap-1.5 capitalize"><Clock3 className="h-4 w-4" />{new Date(interview.scheduledAt).toLocaleString()}</span><span className="capitalize">{interview.round} · {interview.type}</span>{job?.location && <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" />{job.location}</span>}</div>
        {interview.interviewer && <p className="mt-2 text-sm text-muted-foreground">Interviewer: {interview.interviewer}</p>}
        {interview.notes && <p className="mt-2 whitespace-pre-wrap text-sm">{interview.notes}</p>}
        {interview.feedback && <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">Feedback: {interview.feedback}</p>}
        <p className="mt-2 text-xs capitalize text-muted-foreground">{interview.status}</p>
      </div>
      <div className="flex gap-2"><Button size="sm" variant="outline" onClick={onComplete} disabled={interview.status !== "scheduled"}>Mark completed</Button><Button size="icon" variant="ghost" aria-label="Delete interview" onClick={onDelete}><Trash2 className="h-4 w-4" /></Button></div>
    </article>
  );
}