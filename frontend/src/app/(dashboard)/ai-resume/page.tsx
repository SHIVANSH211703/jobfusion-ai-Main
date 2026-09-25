"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Sparkles, FileText, Wand2, Upload, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import ResumeList from "@/components/resume/ResumeList";
import { useResumes } from "@/hooks/resume/useResumes";
import { useATSAnalysis } from "@/hooks/resume/useATSAnalysis";
import { useResumeImprove } from "@/hooks/resume/useResumeImprove";
import { useJobMatch } from "@/hooks/resume/useJobMatch";
import { useCoverLetter } from "@/hooks/resume/useCoverLetter";
import { useResumeUpload } from "@/hooks/resume/useResumeUpload";

export default function Page() {
  const { data, isLoading } = useResumes();
  const analyzeMutation = useATSAnalysis();
  const improveMutation = useResumeImprove();
  const matchMutation = useJobMatch();
  const coverLetterMutation = useCoverLetter();
  const uploadMutation = useResumeUpload();

  const resumes = data ?? [];
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  useEffect(() => {
    if (!selectedResumeId && resumes.length > 0) {
      setSelectedResumeId(resumes[0]._id ?? resumes[0].id ?? "");
    }
  }, [resumes, selectedResumeId]);

  const selectedResume = resumes.find(
    (resume) => (resume._id ?? resume.id) === selectedResumeId
  );

  const handleUpload = (file: File | undefined) => {
    if (!file) return;
    uploadMutation.mutate(file, {
      onSuccess: (response) => {
        setSelectedResumeId(response.data.resumeId);
      },
    });
  };

  const runWithResume = (action: (id: string) => void) => {
    if (selectedResumeId) action(selectedResumeId);
  };

  return (
    <div className="space-y-8 p-1 md:p-2">
      <div className="flex flex-col gap-4 rounded-2xl border bg-card p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600/10 text-violet-600">
            <Sparkles className="h-6 w-6" />
          </div>

          <div>
            <h1 className="text-3xl font-bold tracking-tight">AI Resume Workspace</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Build, optimize, and tailor your resumes with AI-powered actions.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted">
            <Upload className="h-4 w-4" />
            {uploadMutation.isPending ? "Uploading..." : "Upload Resume"}
            <input
              type="file"
              accept=".pdf,.docx"
              className="sr-only"
              disabled={uploadMutation.isPending}
              onChange={(event) => handleUpload(event.target.files?.[0])}
            />
          </label>

          <Link href="/resume/create">
            <Button className="gap-2">
              <Wand2 className="h-4 w-4" />
              Create Resume
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total resumes</p>
          <p className="mt-3 text-3xl font-bold">{resumes.length}</p>
        </div>

        <div className="rounded-2xl border bg-card p-4">
          <p className="text-sm text-muted-foreground">AI-ready</p>
          <p className="mt-3 text-3xl font-bold">{selectedResume?.atsScore ? `${selectedResume.atsScore}/100` : "Not analyzed"}</p>
        </div>

        <div className="rounded-2xl border bg-card p-4">
          <p className="text-sm text-muted-foreground">Quick action</p>
          <p className="mt-3 flex items-center gap-2 text-lg font-semibold text-violet-600">
            <FileText className="h-4 w-4" />
            Resume optimization
          </p>
        </div>
      </div>

      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold">Your resume library</h2>
            <p className="text-sm text-muted-foreground">Open a resume to improve, analyze, or match it to a role.</p>
          </div>
        </div>

        {isLoading ? (
          <div className="rounded-xl border border-dashed p-10 text-center text-muted-foreground">
            Loading resumes...
          </div>
        ) : resumes.length === 0 ? (
          <div className="rounded-xl border border-dashed p-10 text-center text-muted-foreground">
            Upload or create a resume to start using the AI workspace.
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <label htmlFor="ai-resume-selector" className="text-sm font-medium">Resume selector</label>
              <select
                id="ai-resume-selector"
                value={selectedResumeId}
                onChange={(event) => setSelectedResumeId(event.target.value)}
                className="h-10 flex-1 rounded-md border bg-background px-3 text-sm"
              >
                {resumes.map((resume) => (
                  <option key={resume._id ?? resume.id} value={resume._id ?? resume.id}>
                    {resume.title}
                  </option>
                ))}
              </select>
            </div>

            {selectedResume && (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border p-4">
                  <p className="text-sm text-muted-foreground">ATS score</p>
                  <p className="mt-2 text-4xl font-bold">{selectedResume.atsScore || "Not analyzed"}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{selectedResume.aiSummary || "Run an analysis to get a resume summary."}</p>
                </div>

                <div className="flex flex-wrap content-start gap-2 rounded-xl border p-4">
                  <Button disabled={analyzeMutation.isPending} onClick={() => runWithResume((id) => analyzeMutation.mutate(id))}>
                    {analyzeMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Analyze Resume
                  </Button>
                  <Button disabled={improveMutation.isPending} onClick={() => runWithResume((id) => {
                    if (window.confirm("Optimize Resume will replace the current resume content using the existing AI improvement flow. Continue?")) {
                      improveMutation.mutate(id);
                    }
                  })}>
                    {improveMutation.isPending ? "Optimizing..." : "Optimize Resume"}
                  </Button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <label htmlFor="ai-job-description" className="text-sm font-medium">Job description</label>
              <textarea
                id="ai-job-description"
                value={jobDescription}
                onChange={(event) => setJobDescription(event.target.value)}
                rows={6}
                placeholder="Paste a job description to match your resume or generate a cover letter."
                className="w-full rounded-md border bg-background p-3 text-sm"
              />
              <div className="flex flex-wrap gap-2">
                <Button
                  disabled={!selectedResumeId || !jobDescription.trim() || matchMutation.isPending}
                  onClick={() => matchMutation.mutate({ id: selectedResumeId, jobDescription })}
                >
                  {matchMutation.isPending ? "Matching..." : "Match With Job"}
                </Button>
                <Button
                  disabled={!selectedResumeId || !jobDescription.trim() || coverLetterMutation.isPending}
                  onClick={() => coverLetterMutation.mutate({ id: selectedResumeId, jobDescription, tone: "professional" })}
                >
                  {coverLetterMutation.isPending ? "Generating..." : "Generate Cover Letter"}
                </Button>
              </div>
            </div>

            {analyzeMutation.data && (
              <div className="rounded-xl border p-4">
                <h3 className="font-semibold">ATS Analysis</h3>
                <p className="mt-2 text-sm">{analyzeMutation.data.data.aiSummary}</p>
                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  <div><h4 className="text-sm font-medium">Strengths</h4><ul className="mt-2 list-disc pl-5 text-sm text-muted-foreground">{analyzeMutation.data.data.strengths.map((item) => <li key={item}>{item}</li>)}</ul></div>
                  <div><h4 className="text-sm font-medium">Weaknesses</h4><ul className="mt-2 list-disc pl-5 text-sm text-muted-foreground">{analyzeMutation.data.data.weaknesses.map((item) => <li key={item}>{item}</li>)}</ul></div>
                  <div><h4 className="text-sm font-medium">Recommendations</h4><ul className="mt-2 list-disc pl-5 text-sm text-muted-foreground">{analyzeMutation.data.data.recommendations.map((item) => <li key={item}>{item}</li>)}</ul></div>
                </div>
              </div>
            )}

            {matchMutation.data && (
              <div className="rounded-xl border p-4">
                <h3 className="font-semibold">Job Match: {matchMutation.data.data.matchScore}%</h3>
                <p className="mt-2 text-sm text-muted-foreground">Matched keywords: {matchMutation.data.data.matchedKeywords.join(", ") || "None returned"}</p>
                <p className="mt-1 text-sm text-muted-foreground">Missing keywords: {matchMutation.data.data.missingKeywords.join(", ") || "None returned"}</p>
              </div>
            )}

            {coverLetterMutation.data && (
              <div className="rounded-xl border p-4">
                <h3 className="font-semibold">Generated Cover Letter</h3>
                <p className="mt-2 whitespace-pre-wrap text-sm">{coverLetterMutation.data.data.coverLetter}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}