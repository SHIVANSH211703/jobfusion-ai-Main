const https = require("https");
const http = require("http");
const AppError = require("../../../utils/AppError");

const resumeRepository = require("../repositories/resume.repository");
const resumeVersionService = require("./resumeVersion.service");
const aiService = require("../../../services/ai.service");
const notificationService = require("../../notifications/services/notification.service");
const User = require("../../auth/models/user.model");
const Job = require("../../jobs/models/job.model");

class ResumeService {
  async createResume(userId, resumeData) {
    const editableFields = [
      "title", "template", "status", "isDefault", "isPublic", "publicSlug",
      "personalInfo", "summary", "education", "experience", "projects", "skills",
      "certifications", "languages", "achievements", "customSections",
    ];
    const safeResumeData = Object.fromEntries(
      Object.entries(resumeData).filter(([key]) => editableFields.includes(key))
    );
    const resume = await resumeRepository.create({
      ...safeResumeData,
      user: userId,
    });

    try {
      await resumeVersionService.createSnapshot(userId, resume, "created", ["Initial resume version"]);
    } catch (error) {
      await resumeRepository.delete(resume._id);
      throw error;
    }

    return resume;
  }

  async getUserResumes(userId) {
    const resumes = await resumeRepository.findByUserId(userId);
    const ResumeUpload = require("../../resume-upload/models/resumeUpload.model");
    const uploads = await ResumeUpload.find({
      user: userId,
      resume: { $ne: null },
    })
      .select("resume fileUrl fileType originalName")
      .lean();

    const uploadByResumeId = new Map();
    for (const u of uploads) {
      if (u.resume) {
        uploadByResumeId.set(u.resume.toString(), u);
      }
    }

    return resumes.map((resume) => {
      const doc = resume.toObject ? resume.toObject() : { ...resume };
      const upload = uploadByResumeId.get(doc._id.toString());
      if (upload) {
        doc.fileUrl = doc.fileUrl || upload.fileUrl;
        doc.fileType = doc.fileType || upload.fileType;
        doc.originalName = doc.originalName || upload.originalName;
      }
      doc.hasFile = Boolean(doc.fileUrl || upload);
      return doc;
    });
  }

  async getResumeById(userId, resumeId) {
    const resume = await resumeRepository.findById(resumeId);

    if (!resume) {
      throw new AppError("Resume not found", 404);
    }

    if (resume.user._id.toString() !== userId) {
      throw new AppError("Unauthorized", 403);
    }

    const doc = resume.toObject ? resume.toObject() : { ...resume };
    const ResumeUpload = require("../../resume-upload/models/resumeUpload.model");
    const upload = await ResumeUpload.findOne({
      resume: resumeId,
      user: userId,
    })
      .select("fileUrl fileType originalName")
      .lean();

    if (upload) {
      doc.fileUrl = doc.fileUrl || upload.fileUrl;
      doc.fileType = doc.fileType || upload.fileType;
      doc.originalName = doc.originalName || upload.originalName;
    }
    doc.hasFile = Boolean(doc.fileUrl || upload);

    return doc;
  }

  async getResumeFile(userId, resumeId, isDownload, res) {
    const resume = await resumeRepository.findById(resumeId);

    if (!resume) {
      throw new AppError("Resume not found", 404);
    }

    const ownerId = (resume.user && (resume.user._id || resume.user)).toString();
    if (ownerId !== userId.toString()) {
      throw new AppError("Unauthorized", 403);
    }

    let fileUrl = resume.fileUrl;
    let fileType = (resume.fileType || "").toLowerCase();
    let originalName = resume.originalName;

    if (!fileUrl) {
      const ResumeUpload = require("../../resume-upload/models/resumeUpload.model");
      let upload = await ResumeUpload.findOne({
        resume: resumeId,
        user: userId,
      });

      if (!upload) {
        upload = await ResumeUpload.findOne({
          user: userId,
        }).sort({ createdAt: -1 });
      }

      if (upload) {
        fileUrl = upload.fileUrl;
        fileType = (upload.fileType || "").toLowerCase();
        originalName = upload.originalName;

        resumeRepository
          .update(resumeId, { fileUrl, fileType, originalName })
          .catch(() => {});
      }
    }

    if (!fileUrl) {
      throw new AppError("No file attached to this resume.", 404);
    }

    if (!fileType) {
      if (fileUrl.endsWith(".pdf")) fileType = "pdf";
      else if (fileUrl.endsWith(".docx")) fileType = "docx";
      else fileType = "pdf";
    }

    if (!originalName) {
      originalName = `${resume.title || "Resume"}.${fileType}`;
    }

    if (isDownload) {
      await this.incrementDownload(resumeId).catch(() => {});
    }

    let contentType = "application/octet-stream";
    if (fileType === "pdf") {
      contentType = "application/pdf";
    } else if (fileType === "docx") {
      contentType =
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    } else if (fileType === "doc") {
      contentType = "application/msword";
    }

    const dispositionType = isDownload ? "attachment" : "inline";
    const safeFileName = encodeURIComponent(originalName).replace(
      /['()]/g,
      escape
    );

    let streamUrl = fileUrl;
    if (fileUrl.includes("res.cloudinary.com")) {
      try {
        const cloudinary = require("../../../config/cloudinary");
        const match = fileUrl.match(
          /\/(?:image|raw)\/upload\/(?:v\d+\/)?(.+?)(?:\.([a-zA-Z0-9]+))?$/
        );
        if (match) {
          const publicId = match[1];
          const format = match[2] || fileType || "pdf";
          streamUrl = cloudinary.utils.private_download_url(publicId, format, {
            resource_type: "image",
            type: "upload",
          });
        }
      } catch {
        // Fallback to direct fileUrl if signature generation fails
      }
    }

    const pipeFile = (targetUrl, redirectCount = 0) => {
      if (redirectCount > 5) {
        if (!res.headersSent) {
          return res.status(502).json({
            success: false,
            message: "Too many redirects fetching file.",
          });
        }
        return;
      }

      let parsedUrl;
      try {
        parsedUrl = new URL(targetUrl);
      } catch {
        if (!res.headersSent) {
          return res.status(500).json({
            success: false,
            message: "Invalid file target URL.",
          });
        }
        return;
      }

      const client = parsedUrl.protocol === "https:" ? https : http;
      client
        .get(targetUrl, (stream) => {
          if (
            stream.statusCode &&
            [301, 302, 307, 308].includes(stream.statusCode) &&
            stream.headers.location
          ) {
            const redirectUrl = new URL(
              stream.headers.location,
              targetUrl
            ).toString();
            stream.resume();
            return pipeFile(redirectUrl, redirectCount + 1);
          }

          if (stream.statusCode && stream.statusCode >= 400) {
            stream.resume();
            if (!res.headersSent) {
              return res.status(502).json({
                success: false,
                message: "Failed to fetch file from storage provider.",
              });
            }
            return;
          }

          if (!res.headersSent) {
            res.setHeader("Content-Type", contentType);
            res.setHeader(
              "Content-Disposition",
              `${dispositionType}; filename="${safeFileName}"; filename*=UTF-8''${safeFileName}`
            );
            if (stream.headers["content-length"]) {
              res.setHeader("Content-Length", stream.headers["content-length"]);
            }
          }

          stream.pipe(res);
        })
        .on("error", () => {
          if (!res.headersSent) {
            res.status(500).json({
              success: false,
              message: "Error streaming resume file.",
            });
          }
        });
    };

    pipeFile(streamUrl);
  }

  async updateResume(userId, resumeId, updateData) {
    const resume = await resumeRepository.findById(resumeId);

    if (!resume) {
      throw new AppError("Resume not found", 404);
    }

    if (resume.user._id.toString() !== userId) {
      throw new AppError("Unauthorized", 403);
    }

    await resumeVersionService.ensureBaseline(userId, resume);
    const editableFields = [
      "title", "template", "status", "isDefault", "isPublic", "publicSlug",
      "personalInfo", "summary", "education", "experience", "projects", "skills",
      "certifications", "languages", "achievements", "customSections",
    ];
    const safeUpdateData = Object.fromEntries(
      Object.entries(updateData).filter(([key]) => editableFields.includes(key))
    );
    const updatedResume = await resumeRepository.update(resumeId, safeUpdateData);
    await resumeVersionService.createSnapshot(
      userId,
      updatedResume,
      "manual",
      Object.keys(safeUpdateData)
    );
    return updatedResume;
  }

  async deleteResume(userId, resumeId) {
    const resume = await resumeRepository.findById(resumeId);

    if (!resume) {
      throw new AppError("Resume not found", 404);
    }

    if (resume.user._id.toString() !== userId) {
      throw new AppError("Unauthorized", 403);
    }

    await resumeRepository.delete(resumeId);
    await resumeVersionService.deleteVersions(userId, resumeId);

    return {
      message: "Resume deleted successfully",
    };
  }

  async getPublicResume(slug) {
    const resume = await resumeRepository.findByPublicSlug(slug);

    if (!resume) {
      throw new AppError("Resume not found", 404);
    }

    await resumeRepository.incrementViews(resume._id);

    return resume;
  }

  async incrementDownload(resumeId) {
    return await resumeRepository.incrementDownloads(resumeId);
  }

  async updateATSScore(resumeId, score) {
    return await resumeRepository.updateATSScore(
      resumeId,
      score
    );
  }

  async updateAISummary(resumeId, summary) {
    return await resumeRepository.updateAISummary(
      resumeId,
      summary
    );
  }

  /**
   * Analyze Resume using AI
   */
  async analyzeResume(userId, resumeId, jobDescription) {
    const resume = await resumeRepository.findById(resumeId);

    if (!resume) {
      throw new AppError("Resume not found", 404);
    }

    if (resume.user._id.toString() !== userId) {
      throw new AppError("Unauthorized", 403);
    }

  const analysis = await aiService.analyzeResume({
  title: resume.title,
  personalInfo: resume.personalInfo,
  summary: resume.summary,
  education: resume.education,
  experience: resume.experience,
  projects: resume.projects,
  skills: resume.skills,
  certifications: resume.certifications,
  achievements: resume.achievements,
  languages: resume.languages,
      customSections: resume.customSections,
    }, jobDescription);
    const updatedResume =
      await resumeRepository.updateATSAnalysis(
        resumeId,
        analysis
      );

    try {
      await notificationService.create({
        userId,
        type: "RESUME_ANALYSIS",
        title: "Resume analysis completed",
        message: `${resume.title} received an ATS score of ${updatedResume.atsScore}.`,
        metadata: { resumeId, score: updatedResume.atsScore },
      });
    } catch (error) {
      console.error("Resume analysis notification could not be stored", { code: error.code });
    }

    return {
      success: true,
      message: "Resume analyzed successfully.",
      data: {
        score: updatedResume.atsScore,
        aiSummary: updatedResume.aiSummary,
        strengths: updatedResume.atsAnalysis.strengths,
        weaknesses: updatedResume.atsAnalysis.weaknesses,
        recommendations:
          updatedResume.atsAnalysis.recommendations,
        categories: updatedResume.atsAnalysis.categories,
        matchedKeywords: updatedResume.atsAnalysis.matchedKeywords,
        missingKeywords: updatedResume.atsAnalysis.missingKeywords,
        jobSpecificRecommendations:
          updatedResume.atsAnalysis.jobSpecificRecommendations,
        weakSections: updatedResume.atsAnalysis.weakSections,
        jobSpecific: updatedResume.atsAnalysis.jobSpecific,
        analyzedAt: updatedResume.atsAnalysis.analyzedAt,
      },
    };
  }
  /**
 * Improve Resume using AI
 */
async improveResume(userId, resumeId) {
  const resume = await resumeRepository.findById(resumeId);

  if (!resume) {
    throw new AppError("Resume not found", 404);
  }

  if (resume.user._id.toString() !== userId) {
    throw new AppError("Unauthorized", 403);
  }

  const improvedResume = await aiService.improveResume({
    title: resume.title,
    personalInfo: resume.personalInfo,
    summary: resume.summary,
    education: resume.education,
    experience: resume.experience,
    projects: resume.projects,
    skills: resume.skills,
    certifications: resume.certifications,
    achievements: resume.achievements,
    languages: resume.languages,
    customSections: resume.customSections,
  });

  await resumeVersionService.ensureBaseline(userId, resume);
  const updatedResume =
    await resumeRepository.updateImprovedResume(
      resumeId,
      improvedResume
    );

  await resumeVersionService.createSnapshot(
    userId,
    updatedResume,
    "ai_improvement",
    improvedResume.changes || []
  );

  return {
    success: true,
    message: "Resume improved successfully.",
    data: updatedResume,
    changes: improvedResume.changes || [],
  };
}

async tailorResume(userId, resumeId, jobDescription) {
  const resume = await resumeRepository.findById(resumeId);
  if (!resume) {
    throw new AppError("Resume not found", 404);
  }
  if (resume.user._id.toString() !== userId) {
    throw new AppError("Unauthorized", 403);
  }
  if (!jobDescription || !jobDescription.trim()) {
    throw new AppError("Job description is required", 400);
  }

  const suggestions = await aiService.tailorResume({
    title: resume.title,
    personalInfo: resume.personalInfo,
    summary: resume.summary,
    education: resume.education,
    experience: resume.experience,
    projects: resume.projects,
    skills: resume.skills,
    certifications: resume.certifications,
    achievements: resume.achievements,
    languages: resume.languages,
    customSections: resume.customSections,
  }, jobDescription);

  return {
    success: true,
    message: "Resume tailoring suggestions generated.",
    data: suggestions,
  };
}

async analyzeCareerGap(userId, resumeId, targetRole) {
  const resume = await resumeRepository.findById(resumeId);
  if (!resume) throw new AppError("Resume not found", 404);
  if (resume.user._id.toString() !== userId) throw new AppError("Unauthorized", 403);
  if (!targetRole || !targetRole.trim()) throw new AppError("Target role is required", 400);

  const [profile, relevantJobs] = await Promise.all([
    User.findById(userId).select("headline bio location experienceLevel skills").lean(),
    Job.find({ isActive: true, $text: { $search: targetRole.trim() } })
      .select("title description skills experienceLevel")
      .limit(8)
      .lean(),
  ]);

  const result = await aiService.analyzeCareerGap({
    targetRole: targetRole.trim(),
    profile,
    resume: {
      summary: resume.summary,
      skills: resume.skills,
      experience: resume.experience,
      projects: resume.projects,
      education: resume.education,
    },
    jobEvidence: relevantJobs.map(({ title, description, skills, experienceLevel }) => ({
      title,
      description,
      skills,
      experienceLevel,
    })),
  });

  return { success: true, data: { targetRole: targetRole.trim(), evidenceJobCount: relevantJobs.length, ...result } };
}

/**
 * Match Resume with Job Description
 */
async matchResumeWithJobDescription(userId, resumeId, jobDescription) {
  const resume = await resumeRepository.findById(resumeId);

  if (!resume) {
    throw new AppError("Resume not found.", 404);
  }

  if (resume.user._id.toString() !== userId) {
    throw new AppError("Unauthorized.", 403);
  }

  if (!jobDescription || !jobDescription.trim()) {
    throw new AppError("Job description is required.", 400);
  }

  const analysis = await aiService.matchResumeWithJobDescription(
    {
      title: resume.title,
      summary: resume.summary,
      personalInfo: resume.personalInfo,
      education: resume.education,
      experience: resume.experience,
      projects: resume.projects,
      skills: resume.skills,
      certifications: resume.certifications,
      achievements: resume.achievements,
      languages: resume.languages,
      customSections: resume.customSections,
    },
    jobDescription
  );

  return {
    success: true,
    message: "Job match analysis completed successfully.",
    data: analysis,
  };
}

/**
 * Generate Cover Letter using AI
 */
async generateCoverLetter(
  userId,
  resumeId,
  jobDescription,
  tone = "professional"
) {
  const resume = await resumeRepository.findById(resumeId);

  if (!resume) {
    throw new AppError("Resume not found.", 404);
  }

  if (resume.user._id.toString() !== userId) {
    throw new AppError("Unauthorized.", 403);
  }

  if (!jobDescription || !jobDescription.trim()) {
    throw new AppError("Job description is required.", 400);
  }

  const result = await aiService.generateCoverLetter(
    {
      title: resume.title,
      personalInfo: resume.personalInfo,
      summary: resume.summary,
      education: resume.education,
      experience: resume.experience,
      projects: resume.projects,
      skills: resume.skills,
      certifications: resume.certifications,
      achievements: resume.achievements,
      languages: resume.languages,
      customSections: resume.customSections,
    },
    jobDescription,
    tone
  );

  return {
    success: true,
    message: "Cover letter generated successfully.",
    data: result,
  };
}

}

module.exports = new ResumeService();