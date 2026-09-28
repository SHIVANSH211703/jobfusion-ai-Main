import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import dynamic from "next/dynamic";
import ResumeCard from "./ResumeCard";

const PdfViewer = dynamic(() => import("./PdfViewer"), { ssr: false });

import { useDeleteResume } from "@/hooks/resume/useDeleteResume";
import resumeService from "@/services/resume.service";

import type { Resume } from "@/types/resume";

interface ResumeListProps {
  resumes: Resume[];
}

export default function ResumeList({
  resumes,
}: ResumeListProps) {
  const router = useRouter();
  const deleteResume = useDeleteResume();
  const [previewResume, setPreviewResume] = useState<Resume | null>(null);

  const handleDownload = useCallback(async (resume: Resume) => {
    const resumeId = resume._id ?? resume.id!;
    const ext = resume.fileType || "pdf";
    const filename = `${resume.title.replace(/[^a-zA-Z0-9_-]/g, "_") || "Resume"}.${ext}`;
    try {
      await resumeService.downloadResumeFile(resumeId, filename);
      toast.success("Download started");
    } catch {
      toast.error("Failed to download resume file.");
    }
  }, []);

  if (!Array.isArray(resumes)) {
    return (
      <div className="py-10 text-center">
        Invalid resume data.
      </div>
    );
  }

  if (resumes.length === 0) {
    return (
      <div className="py-10 text-center">
        No resumes found.
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {resumes.map((resume) => (
          <ResumeCard
            key={resume._id ?? resume.id}
            resume={resume}
            onView={(id) => router.push(`/resume/${id}`)}
            onViewPdf={(r) => setPreviewResume(r)}
            onDownload={handleDownload}
            onDelete={(id) => deleteResume.mutate(id)}
          />
        ))}
      </div>

      {previewResume && (
        <PdfViewer
          isOpen={Boolean(previewResume)}
          onClose={() => setPreviewResume(null)}
          resumeId={previewResume._id ?? previewResume.id!}
          title={previewResume.title}
          fileType={previewResume.fileType}
          fileUrl={previewResume.fileUrl}
          hasFile={previewResume.hasFile}
        />
      )}
    </>
  );
}