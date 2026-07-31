"use client";

import { useParams } from "next/navigation";

import ResumeForm from "@/components/resume/ResumeForm";
import ResumeActions from "@/components/resume/ResumeActions";

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
    <div className="space-y-8 p-8">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-bold">
            Edit Resume
          </h1>

          <p className="text-muted-foreground">
            Update your resume and use AI tools.
          </p>

        </div>

        <ResumeActions
          resumeId={resume._id ?? resume.id!}
        />

      </div>

      <ResumeForm
        mode="edit"
        resume={resume}
      />

    </div>
  );
}