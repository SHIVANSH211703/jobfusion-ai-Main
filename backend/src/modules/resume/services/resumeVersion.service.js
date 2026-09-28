const AppError = require("../../../utils/AppError");
const resumeRepository = require("../repositories/resume.repository");
const resumeVersionRepository = require("../repositories/resumeVersion.repository");

const versionedFields = [
  "title",
  "template",
  "status",
  "isDefault",
  "isPublic",
  "publicSlug",
  "atsScore",
  "aiSummary",
  "atsAnalysis",
  "personalInfo",
  "summary",
  "education",
  "experience",
  "projects",
  "skills",
  "certifications",
  "languages",
  "achievements",
  "customSections",
];

const toVersionContent = (resume) => {
  const source = typeof resume.toObject === "function" ? resume.toObject() : resume;
  return Object.fromEntries(
    versionedFields
      .filter((field) => source[field] !== undefined)
      .map((field) => [field, source[field]])
  );
};

class ResumeVersionService {
  async getOwnedResume(userId, resumeId) {
    const resume = await resumeRepository.findById(resumeId);
    if (!resume) {
      throw new AppError("Resume not found", 404);
    }
    if (resume.user._id.toString() !== userId) {
      throw new AppError("Unauthorized", 403);
    }
    return resume;
  }

  async createSnapshot(userId, resume, source, changes = []) {
    return resumeVersionRepository.create({
      userId,
      resumeId: resume._id,
      source,
      content: toVersionContent(resume),
      changes,
    });
  }

  async ensureBaseline(userId, resume) {
    const latest = await resumeVersionRepository.findLatest(userId, resume._id);
    if (!latest) {
      return this.createSnapshot(userId, resume, "created", ["Initial resume version"]);
    }
    return latest;
  }

  async listVersions(userId, resumeId) {
    await this.getOwnedResume(userId, resumeId);
    return resumeVersionRepository.findAll(userId, resumeId);
  }

  async getVersion(userId, resumeId, versionId) {
    await this.getOwnedResume(userId, resumeId);
    const version = await resumeVersionRepository.findById(userId, resumeId, versionId);
    if (!version) {
      throw new AppError("Resume version not found", 404);
    }
    return version;
  }

  async createCheckpoint(userId, resumeId) {
    const resume = await this.getOwnedResume(userId, resumeId);
    return this.createSnapshot(userId, resume, "checkpoint", ["Manual checkpoint"]);
  }

  async restoreVersion(userId, resumeId, versionId) {
    const resume = await this.getOwnedResume(userId, resumeId);
    const version = await resumeVersionRepository.findById(userId, resumeId, versionId);
    if (!version) {
      throw new AppError("Resume version not found", 404);
    }

    await this.ensureBaseline(userId, resume);
    const restoredResume = await resumeRepository.update(resumeId, version.content);
    await this.createSnapshot(userId, restoredResume, "restore", [
      `Restored from version ${version.versionNumber}`,
    ]);

    return restoredResume;
  }

  async deleteVersions(userId, resumeId) {
    return resumeVersionRepository.deleteForResume(userId, resumeId);
  }
}

module.exports = new ResumeVersionService();