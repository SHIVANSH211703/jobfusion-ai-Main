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
    return await resumeRepository.findByUserId(userId);
  }

  async getResumeById(userId, resumeId) {
    const resume = await resumeRepository.findById(resumeId);

    if (!resume) {
      throw new AppError("Resume not found", 404);
    }

    if (resume.user._id.toString() !== userId) {
      throw new AppError("Unauthorized", 403);
    }

    return resume;
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