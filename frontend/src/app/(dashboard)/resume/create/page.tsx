"use client";

import ResumeForm from "@/components/resume/ResumeForm";

export default function CreateResumePage() {
  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-8 tracking-tight">
        Create Resume
      </h1>

      <ResumeForm
        mode="create"
      />
    </div>
  );
}