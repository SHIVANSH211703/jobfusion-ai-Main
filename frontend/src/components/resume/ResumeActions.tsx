"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

import { useATSAnalysis } from "@/hooks/resume/useATSAnalysis";
import { useResumeImprove } from "@/hooks/resume/useResumeImprove";
import { useJobMatch } from "@/hooks/resume/useJobMatch";
import { useCoverLetter } from "@/hooks/resume/useCoverLetter";

interface ResumeActionsProps {
  resumeId: string;
}

export default function ResumeActions({
  resumeId,
}: ResumeActionsProps) {
  const analyzeMutation = useATSAnalysis();
  const improveMutation = useResumeImprove();
  const jobMatchMutation = useJobMatch();
  const coverLetterMutation = useCoverLetter();

  const [jobDescription, setJobDescription] = useState("");

  const handleAnalyze = () => {
    analyzeMutation.mutate(resumeId);
  };

  const handleImprove = () => {
    improveMutation.mutate(resumeId);
  };

  const handleJobMatch = () => {
    if (!jobDescription.trim()) {
      alert("Please enter a job description.");
      return;
    }

    jobMatchMutation.mutate({
      id: resumeId,
      jobDescription,
    });
  };

  const handleCoverLetter = () => {
    if (!jobDescription.trim()) {
      alert("Please enter a job description.");
      return;
    }

    coverLetterMutation.mutate({
      id: resumeId,
      jobDescription,
      tone: "professional",
    });
  };

  return (
    <div className="space-y-6">

      <div className="flex flex-wrap gap-3">

        <Button
          onClick={handleAnalyze}
          disabled={analyzeMutation.isPending}
        >
          {analyzeMutation.isPending
            ? "Analyzing..."
            : "ATS Analysis"}
        </Button>

        <Button
          onClick={handleImprove}
          disabled={improveMutation.isPending}
        >
          {improveMutation.isPending
            ? "Improving..."
            : "Improve Resume"}
        </Button>

      </div>

      <div className="space-y-3">

        <textarea
          rows={8}
          className="w-full rounded-md border p-3"
          placeholder="Paste the Job Description here..."
          value={jobDescription}
          onChange={(e) =>
            setJobDescription(e.target.value)
          }
        />

        <div className="flex flex-wrap gap-3">

          <Button
            onClick={handleJobMatch}
            disabled={jobMatchMutation.isPending}
          >
            {jobMatchMutation.isPending
              ? "Matching..."
              : "Job Match"}
          </Button>

          <Button
            onClick={handleCoverLetter}
            disabled={coverLetterMutation.isPending}
          >
            {coverLetterMutation.isPending
              ? "Generating..."
              : "Generate Cover Letter"}
          </Button>

        </div>

      </div>

      {analyzeMutation.data && (
        <div className="rounded-lg border p-4">
          <h3 className="font-semibold mb-2">
            ATS Score
          </h3>

          <p className="text-3xl font-bold">
            {analyzeMutation.data.data.score}/100
          </p>
        </div>
      )}

      {jobMatchMutation.data && (
        <div className="rounded-lg border p-4">
          <h3 className="font-semibold mb-2">
            Job Match Score
          </h3>

          <p className="text-3xl font-bold">
            {jobMatchMutation.data.data.matchScore}%
          </p>
        </div>
      )}

      {coverLetterMutation.data && (
        <div className="rounded-lg border p-4">
          <h3 className="font-semibold mb-2">
            Cover Letter
          </h3>

          <pre className="whitespace-pre-wrap text-sm">
            {coverLetterMutation.data.data.coverLetter}
          </pre>
        </div>
      )}

    </div>
  );
}