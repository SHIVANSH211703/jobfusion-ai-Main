const Resume = require("../../resume/models/resume.model");
const aiService = require("../../../services/ai.service");

// ======================================================
// GET RESUME WITH OWNERSHIP VALIDATION
// ======================================================

const getResumeById = async (resumeId, userId) => {
  const resume = await Resume.findOne({
    _id: resumeId,
    user: userId,
  }).lean();

  if (!resume) {
    const error = new Error(
      "Resume not found or you do not have access to this resume"
    );

    error.statusCode = 404;

    throw error;
  }

  return resume;
};

// ======================================================
// BUILD JOB DESCRIPTION
// ======================================================

const buildJobDescription = (job) => {
  return `
Job Title:
${job.title || ""}

Company:
${job.company || ""}

Location:
${job.location || ""}

Job Type:
${job.jobType || ""}

Skills:
${(job.skills || []).join(", ")}

Description:
${job.description || ""}
`.trim();
};

// ======================================================
// CALCULATE AI JOB MATCH
// ======================================================

const calculateMatch = async ({
  resumeId,
  job,
  userId,
}) => {
  // ----------------------------------------------------
  // 1. Get resume
  // ----------------------------------------------------

  const resume = await getResumeById(
    resumeId,
    userId
  );

  // ----------------------------------------------------
  // 2. Build complete job description
  // ----------------------------------------------------

  const jobDescription =
    buildJobDescription(job);

  // ----------------------------------------------------
  // 3. Send resume + job to AI
  // ----------------------------------------------------

  const aiResult =
    await aiService.matchResumeWithJobDescription(
      resume,
      jobDescription
    );

  // ----------------------------------------------------
  // 4. Return AI result
  // ----------------------------------------------------

  return aiResult;
};

module.exports = {
  calculateMatch,
};