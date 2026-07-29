const Resume = require("../models/resume.model");

class ResumeRepository {
  async create(resumeData) {
    return await Resume.create(resumeData);
  }

  async findById(id) {
    return await Resume.findById(id).populate(
      "user",
      "name email avatar"
    );
  }

  async findByUserId(userId) {
    return await Resume.find({ user: userId }).sort({
      updatedAt: -1,
    });
  }

  async update(id, updateData) {
    return await Resume.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );
  }

  async delete(id) {
    return await Resume.findByIdAndDelete(id);
  }

  async exists(id) {
    return await Resume.exists({
      _id: id,
    });
  }

  async findByPublicSlug(slug) {
    return await Resume.findOne({
      publicSlug: slug,
      isPublic: true,
    }).populate("user", "name avatar");
  }

  async incrementViews(id) {
    return await Resume.findByIdAndUpdate(
      id,
      {
        $inc: {
          "metadata.views": 1,
        },
      },
      {
        new: true,
      }
    );
  }

  async incrementDownloads(id) {
    return await Resume.findByIdAndUpdate(
      id,
      {
        $inc: {
          "metadata.downloads": 1,
        },
      },
      {
        new: true,
      }
    );
  }

  async updateATSAnalysis(id, analysis) {
    return await Resume.findByIdAndUpdate(
      id,
      {
        atsScore: analysis.score,
        aiSummary: analysis.aiSummary,
        atsAnalysis: {
          strengths: analysis.strengths || [],
          weaknesses: analysis.weaknesses || [],
          recommendations: analysis.recommendations || [],
          analyzedAt: new Date(),
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );
  }

  async updateATSScore(id, score) {
    return await Resume.findByIdAndUpdate(
      id,
      {
        atsScore: score,
      },
      {
        new: true,
        runValidators: true,
      }
    );
  }

  async updateAISummary(id, aiSummary) {
    return await Resume.findByIdAndUpdate(
      id,
      {
        aiSummary,
      },
      {
        new: true,
        runValidators: true,
      }
    );
  }

  async updateImprovedResume(id, improvedResume) {
  return await Resume.findByIdAndUpdate(
    id,
    {
      summary: improvedResume.summary,

      experience: improvedResume.experience,

      projects: improvedResume.projects,

      skills: improvedResume.skills,

      achievements: improvedResume.achievements,
    },
    {
      new: true,
      runValidators: true,
    }
  );
}
}

module.exports = new ResumeRepository();