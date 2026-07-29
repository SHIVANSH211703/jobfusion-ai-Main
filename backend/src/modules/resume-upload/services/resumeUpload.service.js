const pdf = require("pdf-parse");
const mammoth = require("mammoth");
const path = require("path");

const AppError = require("../../../utils/AppError");
const uploadFile = require("../../../utils/cloudinaryUpload");

const aiService = require("../../../services/ai.service");

const resumeUploadRepository = require("../repositories/resumeUpload.repository");
const resumeRepository = require("../../resume/repositories/resume.repository");

class ResumeUploadService {
  async uploadResume(file, userId) {
    if (!file) {
      throw new AppError("Resume file is required", 400);
    }

    const extension = path
      .extname(file.originalname)
      .replace(".", "")
      .toLowerCase();

    const cloudinaryResponse = await uploadFile(
      file.buffer,
      "jobfusion/resumes"
    );

    const upload = await resumeUploadRepository.create({
      user: userId,
      originalName: file.originalname,
      fileName: cloudinaryResponse.original_filename,
      fileUrl: cloudinaryResponse.secure_url,
      publicId: cloudinaryResponse.public_id,
      fileType: extension,
      fileSize: file.size,
      parsingStatus: "processing",
    });

    const extractedText = await this.extractText(
      file.buffer,
      extension
    );

    const wordCount = extractedText
      .split(/\s+/)
      .filter(Boolean).length;

    await resumeUploadRepository.update(upload._id, {
      extractedText,
      parsingStatus: "completed",
      metadata: {
        wordCount,
      },
    });

    const resume = await this.processResume(
      upload._id,
      extractedText,
      userId
    );

    return {
      uploadId: upload._id,
      resumeId: resume._id,
      resume,
    };
  }
    async extractText(buffer, extension) {
    switch (extension) {
      case "pdf":
        return await this.parsePDF(buffer);

      case "docx":
        return await this.parseDOCX(buffer);

      case "doc":
        throw new AppError(
          "DOC format is currently not supported. Please upload DOCX or PDF.",
          400
        );

      default:
        throw new AppError("Unsupported file format.", 400);
    }
  }

  async parsePDF(buffer) {
    try {
      const data = await pdf(buffer);

      return data.text
        .replace(/\r/g, "")
        .replace(/\n{2,}/g, "\n")
        .trim();
    } catch (error) {
      throw new AppError("Unable to parse PDF.", 500);
    }
  }

  async parseDOCX(buffer) {
    try {
      const result = await mammoth.extractRawText({
        buffer,
      });

      return result.value
        .replace(/\r/g, "")
        .replace(/\n{2,}/g, "\n")
        .trim();
    } catch (error) {
      throw new AppError("Unable to parse DOCX.", 500);
    }
  }
    async processResume(uploadId, extractedText, userId) {
    try {
     const parsedResume =
  await aiService.parseResume(extractedText);

      const resume =
        await this.createResume(
          userId,
          parsedResume
        );

      await resumeUploadRepository.attachResume(
        uploadId,
        resume._id
      );

      return resume;
    } catch (error) {
      await resumeUploadRepository.update(uploadId, {
        parsingStatus: "failed",
      });

      throw error;
    }
  }

 async createResume(userId, parsedResume) {
  return await resumeRepository.create({
    user: userId,

    title: parsedResume.title || "Imported Resume",

    template: parsedResume.template || "modern",

    status: "draft",

    personalInfo: {
      fullName: parsedResume.personalInfo?.fullName || "",
      email: parsedResume.personalInfo?.email || "",
      phone: parsedResume.personalInfo?.phone || "",
      location: parsedResume.personalInfo?.location || "",
      linkedin: parsedResume.personalInfo?.linkedin || "",
      github: parsedResume.personalInfo?.github || "",
      portfolio: parsedResume.personalInfo?.portfolio || "",
    },

    summary: parsedResume.summary || "",

    education: (parsedResume.education || []).map((item) => ({
      institution: item.institution || "",
      degree: item.degree || "",
      fieldOfStudy: item.fieldOfStudy || "",
      startDate: item.startDate || null,
      endDate: item.endDate || null,
      currentlyStudying: item.currentlyStudying || false,
      grade: item.grade || "",
      description: item.description || "",
    })),

    experience: (parsedResume.experience || []).map((item) => ({
      company: item.company || "",
      position: item.position || "",
      location: item.location || "",
      startDate: item.startDate || null,
      endDate: item.endDate || null,
      currentlyWorking: item.currentlyWorking || false,
      description: item.description || "",
    })),

    projects: (parsedResume.projects || []).map((item) => ({
      title: item.title || item.name || "",
      description: item.description || "",
      technologies: Array.isArray(item.technologies)
        ? item.technologies
        : typeof item.technologies === "string"
        ? item.technologies
            .split(",")
            .map((tech) => tech.trim())
        : [],
      github: item.github || "",
      liveDemo: item.liveDemo || "",
    })),

    skills: Array.isArray(parsedResume.skills)
      ? parsedResume.skills
      : [],

    certifications: (parsedResume.certifications || []).map((item) => {
      if (typeof item === "string") {
        return {
          name: item,
          issuer: "",
          issueDate: null,
          credentialId: "",
          credentialUrl: "",
        };
      }

      return {
        name: item.name || "",
        issuer: item.issuer || "",
        issueDate: item.issueDate || null,
        credentialId: item.credentialId || "",
        credentialUrl: item.credentialUrl || "",
      };
    }),

    languages: (parsedResume.languages || []).map((item) => {
      if (typeof item === "string") {
        return {
          name: item,
          proficiency: "Beginner",
        };
      }

      return {
        name: item.name || "",
        proficiency: item.proficiency || "Beginner",
      };
    }),

    achievements: (parsedResume.achievements || []).map((item) => {
      if (typeof item === "string") {
        return {
          title: item,
          description: "",
        };
      }

      return {
        title: item.title || "",
        description: item.description || "",
      };
    }),

    customSections: (parsedResume.customSections || []).map((item) => ({
      title: item.title || item.name || "",
      items: Array.isArray(item.items)
        ? item.items
        : item.description
        ? [item.description]
        : [],
    })),
  });
}
    async getUploadById(id) {
    const upload =
      await resumeUploadRepository.findById(id);

    if (!upload) {
      throw new AppError(
        "Uploaded resume not found",
        404
      );
    }

    return upload;
  }

  async getUploadsByUser(userId) {
    return await resumeUploadRepository.findByUser(
      userId
    );
  }

  async deleteUpload(id) {
    const upload =
      await resumeUploadRepository.findById(id);

    if (!upload) {
      throw new AppError(
        "Uploaded resume not found",
        404
      );
    }

    await resumeUploadRepository.delete(id);

    return {
      message:
        "Resume upload deleted successfully",
    };
  }
}

module.exports = new ResumeUploadService();