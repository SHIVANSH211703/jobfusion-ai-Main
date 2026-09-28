"use client";

import { useParams } from "next/navigation";

import ResumeForm from "@/components/resume/ResumeForm";
import ResumeActions from "@/components/resume/ResumeActions";
import ResumeVersionHistory from "@/components/resume/ResumeVersionHistory";

import { useResume } from "@/hooks/resume/useResumes";

export default function ResumeEditorPage() {
  const params = useParams();

  const id = params.id as string;

  const {
    data: resume,
    isLoading,
    isError,
  } = useResume(id);

  if (isLoading) {
    return (
      <div className="p-8">
        Loading resume...
      </div>
    );
  }

  if (isError || !resume) {
    return (
      <div className="p-8 text-red-500">
        Resume not found.
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Edit Resume
          </h1>

          <p className="text-muted-foreground mt-1 text-sm">
            Update your resume and use AI tools.
          </p>
        </div>

        <div className="w-full lg:max-w-md">
          <ResumeActions
            resumeId={resume._id ?? resume.id!}
          />
        </div>
      </div>

      <ResumeForm
        mode="edit"
        resume={resume}
      />

      <ResumeVersionHistory resumeId={resume._id ?? resume.id!} />

    </div>
  );
}