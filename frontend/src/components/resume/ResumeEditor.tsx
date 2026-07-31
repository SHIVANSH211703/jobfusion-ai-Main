"use client";

import ResumeForm from "./ResumeForm";
import ResumeActions from "./ResumeActions";

import type { Resume } from "@/types/resume";

interface ResumeEditorProps {
  resume: Resume;
}

export default function ResumeEditor({
  resume,
}: ResumeEditorProps) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

      {/* Left */}

      <div className="xl:col-span-2">

        <ResumeForm
          mode="edit"
          resume={resume}
        />

      </div>

      {/* Right */}

      <div className="space-y-6 sticky top-5 h-fit">

        <ResumeActions
          resumeId={resume._id ?? resume.id!}
        />

      </div>

    </div>
  );
}
