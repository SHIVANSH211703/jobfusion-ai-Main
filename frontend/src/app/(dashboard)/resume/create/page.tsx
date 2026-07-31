"use client";

import ResumeForm from "@/components/resume/ResumeForm";

export default function CreateResumePage() {
  return (
    <div className="p-8">

      <h1 className="text-3xl font-bold mb-8">
        Create Resume
      </h1>

      <ResumeForm
        mode="create"
      />

    </div>
  );
}