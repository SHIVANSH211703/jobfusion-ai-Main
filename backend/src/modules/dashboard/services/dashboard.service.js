const User = require("../../auth/models/user.model");
const Resume = require("../../resume/models/resume.model");
const Application = require("../../jobs/models/application.model");
const SavedJob = require("../../jobs/models/savedJob.model");
const Job = require("../../jobs/models/job.model");

const calculateProfileCompletion = (user) => {
  if (!user) {
    return 0;
  }

  const fields = [
    "name",
    "email",
    "phone",
    "headline",
    "bio",
    "location",
    "experienceLevel",
    "skills",
    "linkedin",
    "github",
    "portfolio",
    "avatar",
  ];

  const completed = fields.filter((field) => {
    const value = user[field];

    if (Array.isArray(value)) {
      return value.length > 0;
    }

    if (typeof value === "string") {
      return value.trim().length > 0;
    }

    return Boolean(value);
  }).length;

  return Math.round((completed / fields.length) * 100);
};

const sanitizeResume = (resume) => {
  if (!resume) return null;

  return {
    _id: resume._id,
    title: resume.title,
    status: resume.status,
    isDefault: resume.isDefault,
    isPublic: resume.isPublic,
    atsScore: resume.atsScore ?? null,
    aiSummary: resume.aiSummary || "",
    atsAnalysis: resume.atsAnalysis || {
      strengths: [],
      weaknesses: [],
      recommendations: [],
      analyzedAt: null,
    },
    personalInfo: resume.personalInfo || {},
    summary: resume.summary || "",
    skills: Array.isArray(resume.skills) ? resume.skills : [],
    createdAt: resume.createdAt,
    updatedAt: resume.updatedAt,
  };
};

const sanitizeApplication = (application) => {
  if (!application) return null;

  return {
    _id: application._id,
    status: application.status,
    appliedAt: application.appliedAt,
    notes: application.notes || "",
    jobId: application.jobId || null,
    resumeId: application.resumeId || null,
  };
};

const sanitizeSavedJob = (savedJob) => {
  if (!savedJob) return null;

  return {
    _id: savedJob._id,
    jobId: savedJob.jobId || null,
    createdAt: savedJob.createdAt,
  };
};

const getDashboard = async (userId) => {
  const [
    user,
    applicationsCount,
    savedJobsCount,
    interviewsCount,
    resumesCount,
    latestResume,
    recentApplications,
    savedJobs,
    recommendedJobs,
  ] = await Promise.all([
    User.findById(userId).lean(),
    Application.countDocuments({ userId }),
    SavedJob.countDocuments({ userId }),
    Application.countDocuments({ userId, status: "interview" }),
    Resume.countDocuments({ user: userId }),
    Resume.findOne({ user: userId }).sort({ createdAt: -1 }).lean(),
    Application.find({ userId })
      .populate("jobId")
      .sort({ appliedAt: -1 })
      .limit(5)
      .lean(),
    SavedJob.find({ userId })
      .populate("jobId")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),
    Job.find({ isActive: true })
      .sort({ postedAt: -1, createdAt: -1 })
      .limit(3)
      .lean(),
  ]);

  const profileCompletion = calculateProfileCompletion(user);

  const dashboard = {
    stats: {
      applications: applicationsCount,
      savedJobs: savedJobsCount,
      interviews: interviewsCount,
      profileCompletion,
      resumes: resumesCount,
      atsScore: latestResume?.atsScore ?? null,
      resumeScore: latestResume?.atsScore ?? null,
    },
    recentApplications: recentApplications
      .map(sanitizeApplication)
      .filter(Boolean),
    savedJobs: savedJobs
      .map(sanitizeSavedJob)
      .filter(Boolean),
    recommendedJobs: recommendedJobs.map((job) => ({
      _id: job._id,
      title: job.title,
      company: job.company,
      location: job.location,
      jobType: job.jobType || "Not specified",
      salary: job.salary || null,
      postedAt: job.postedAt,
      applyUrl: job.applyUrl || null,
      isRemote: Boolean(job.isRemote),
      description: job.description || "",
      skills: Array.isArray(job.skills) ? job.skills : [],
      source: job.source || "",
    })),
    latestResume: sanitizeResume(latestResume),
    user: user
      ? {
          _id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar || "",
          headline: user.headline || "",
          location: user.location || "",
          experienceLevel: user.experienceLevel || "",
          skills: Array.isArray(user.skills) ? user.skills : [],
          linkedin: user.linkedin || "",
          github: user.github || "",
          portfolio: user.portfolio || "",
        }
      : null,
  };

  return dashboard;
};

module.exports = {
  getDashboard,
};
