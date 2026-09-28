class ResumeDTO {
  resumeResponse(resume) {
    return {
      id: resume._id,

      title: resume.title,
      template: resume.template,

      status: resume.status,

      isDefault: resume.isDefault,
      isPublic: resume.isPublic,
      publicSlug: resume.publicSlug,

      atsScore: resume.atsScore,
      aiSummary: resume.aiSummary,
      atsAnalysis: resume.atsAnalysis,

      personalInfo: resume.personalInfo,
      summary: resume.summary,

      education: resume.education,
      experience: resume.experience,
      projects: resume.projects,
      skills: resume.skills,
      certifications: resume.certifications,
      languages: resume.languages,
      achievements: resume.achievements,
      customSections: resume.customSections,

      metadata: resume.metadata,

      fileUrl: resume.fileUrl || null,
      fileType: resume.fileType || null,
      originalName: resume.originalName || null,
      hasFile: Boolean(resume.hasFile || resume.fileUrl),

      createdAt: resume.createdAt,
      updatedAt: resume.updatedAt,
    };
  }

  resumeList(resumes) {
    return resumes.map((resume) =>
      this.resumeResponse(resume)
    );
  }
}

module.exports = new ResumeDTO();