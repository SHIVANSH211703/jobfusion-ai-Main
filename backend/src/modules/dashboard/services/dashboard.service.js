const User = require("../../auth/models/user.model");
const Resume = require("../../resume/models/resume.model");
const Application = require("../../jobs/models/application.model");
const SavedJob = require("../../jobs/models/savedJob.model");
const Job = require("../../jobs/models/job.model");
const Interview = require("../../interviews/models/interview.model");

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
  const settledResults = await Promise.allSettled([
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
    Interview.find({
      userId,
      status: "scheduled",
      scheduledAt: { $gte: new Date() },
    })
      .populate({ path: "applicationId", populate: { path: "jobId", select: "title company" } })
      .sort({ scheduledAt: 1 })
      .limit(5)
      .lean(),
  ]);

  const getVal = (res, fallback) => (res.status === "fulfilled" ? res.value : fallback);

  const user = getVal(settledResults[0], null);
  const applicationsCount = getVal(settledResults[1], 0);
  const savedJobsCount = getVal(settledResults[2], 0);
  const interviewsCount = getVal(settledResults[3], 0);
  const resumesCount = getVal(settledResults[4], 0);
  const latestResume = getVal(settledResults[5], null);
  const recentApplications = getVal(settledResults[6], []);
  const savedJobs = getVal(settledResults[7], []);
  const recommendedJobs = getVal(settledResults[8], []);
  const upcomingInterviews = getVal(settledResults[9], []);

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
    upcomingInterviews: upcomingInterviews.map((interview) => ({
      _id: interview._id,
      applicationId: interview.applicationId?._id ?? null,
      scheduledAt: interview.scheduledAt,
      round: interview.round,
      type: interview.type,
      status: interview.status,
      job: interview.applicationId?.jobId
        ? {
            title: interview.applicationId.jobId.title,
            company: interview.applicationId.jobId.company,
          }
        : null,
    })),
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
