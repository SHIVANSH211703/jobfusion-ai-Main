"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Sparkles, FileText, Wand2, Upload, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import ResumeList from "@/components/resume/ResumeList";
import ATSAnalysis from "@/components/resume/ATSAnalysis";
import ResumeTailoringReview from "@/components/resume/ResumeTailoringReview";
import { useResumes } from "@/hooks/resume/useResumes";
import { useATSAnalysis } from "@/hooks/resume/useATSAnalysis";
import { useResumeImprove } from "@/hooks/resume/useResumeImprove";
import { useJobMatch } from "@/hooks/resume/useJobMatch";
import { useCoverLetter } from "@/hooks/resume/useCoverLetter";
import { useResumeUpload } from "@/hooks/resume/useResumeUpload";
import { useResumeTailor } from "@/hooks/resume/useResumeTailor";
import { useUpdateResume } from "@/hooks/resume/useResumes";

export default function Page() {
  const { data, isLoading } = useResumes();
  const analyzeMutation = useATSAnalysis();
  const improveMutation = useResumeImprove();
  const matchMutation = useJobMatch();
  const coverLetterMutation = useCoverLetter();
  const uploadMutation = useResumeUpload();
  const tailorMutation = useResumeTailor();
  const updateResume = useUpdateResume();

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
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col gap-4 rounded-2xl border bg-card p-4.5 sm:p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3.5 sm:gap-4">
          <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl bg-accent/10 text-accent">
            <Sparkles className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>

          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">AI Resume Workspace</h1>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
              Build, optimize, and tailor your resumes with AI-powered actions.
            </p>
          </div>
        </div>

        <div className="flex flex-col xs:flex-row gap-2 w-full md:w-auto">
          <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted w-full xs:w-auto">
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

          <Link href="/resume/create" className="w-full xs:w-auto">
            <Button className="gap-2 w-full xs:w-auto justify-center">
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
          <p className="mt-3 flex items-center gap-2 text-lg font-semibold text-accent">
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
                  <Button disabled={analyzeMutation.isPending} onClick={() => runWithResume((id) => analyzeMutation.mutate({ id, jobDescription }))}>
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
                  disabled={!selectedResumeId || jobDescription.trim().length < 20 || tailorMutation.isPending}
                  onClick={() => tailorMutation.mutate({ resumeId: selectedResumeId, jobDescription: jobDescription.trim() })}
                >
                  {tailorMutation.isPending ? "Preparing..." : "Tailor Resume for This Job"}
                </Button>
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
              <ATSAnalysis analysis={analyzeMutation.data.data} />
            )}

            {selectedResume && tailorMutation.data && (
              <ResumeTailoringReview
                resume={selectedResume}
                suggestions={tailorMutation.data.data}
                isSaving={updateResume.isPending}
                onApply={(payload) => updateResume.mutate({ id: selectedResumeId, payload })}
              />
            )}

            {matchMutation.data && (
              <div className="rounded-xl border p-4">
                <h3 className="font-semibold">Job Match: {matchMutation.data.data.matchScore}%</h3>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {Object.entries(matchMutation.data.data.categories).map(([category, score]) => (
                    <div key={category}>
                      <div className="mb-1 flex justify-between text-xs capitalize">
                        <span className="text-muted-foreground">{category}</span>
                        <span>{score === null ? "Not enough data" : `${score}%`}</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                        {score !== null && <div className="h-full rounded-full bg-primary" style={{ width: `${score}%` }} />}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-sm text-muted-foreground">Matched skills: {matchMutation.data.data.matchedSkills.join(", ") || "None identified"}</p>
                <p className="mt-1 text-sm text-muted-foreground">Missing skills: {matchMutation.data.data.missingSkills.join(", ") || "None identified"}</p>
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