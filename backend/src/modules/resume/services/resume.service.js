const AppError = require("../../../utils/AppError");

const resumeRepository = require("../repositories/resume.repository");
const aiService = require("../../../services/ai.service");

class ResumeService {
  async createResume(userId, resumeData) {
    return await resumeRepository.create({
      ...resumeData,
      user: userId,
    });
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

    return await resumeRepository.update(resumeId, updateData);
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
  async analyzeResume(userId, resumeId) {
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
});
    const updatedResume =
      await resumeRepository.updateATSAnalysis(
        resumeId,
        analysis
      );

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

  const updatedResume =
    await resumeRepository.updateImprovedResume(
      resumeId,
      improvedResume
    );

  return {
    success: true,
    message: "Resume improved successfully.",
    data: updatedResume,
    changes: improvedResume.changes || [],
  };
}
}

module.exports = new ResumeService();