const {
  searchJobsFromAdzuna,
} = require("../../../services/adzuna.service");

const jobRepository = require("../repositories/job.repository");
const savedJobRepository = require("../repositories/savedJob.repository");
const applicationRepository = require("../repositories/application.repository");

const Resume = require("../../resume/models/resume.model");

const {
  calculateMatch,
} = require("./jobMatch.service");

// ======================================================
// SEARCH JOBS FROM ADZUNA
// ======================================================

const searchJobs = async ({
  page = 1,
  what = "",
  where = "",
  resultsPerPage = 20,
}) => {
  const data = await searchJobsFromAdzuna({
    page,
    what,
    where,
    resultsPerPage,
  });

  const jobs = data.results.map((job) => ({
    externalId: String(job.id),

    source: "adzuna",

    title: job.title,

    company:
      job.company?.display_name ||
      "Unknown",

    location:
      job.location?.display_name ||
      "Not specified",

    description:
      job.description || "",

    salary: {
      min: job.salary_min || null,
      max: job.salary_max || null,
      currency: "INR",
    },

    jobType:
      job.contract_type || null,

    skills: [],

    postedAt: job.created
      ? new Date(job.created)
      : null,

    applyUrl:
      job.redirect_url || null,

    isRemote: false,

    isActive: true,
  }));

  if (jobs.length > 0) {
    await jobRepository.upsertManyJobs(jobs);
  }

  return {
    count: data.count || 0,
    jobs,
  };
};

// ======================================================
// GET JOBS FROM DATABASE
// ======================================================

const getJobs = async ({
  page = 1,
  limit = 20,
  search = "",
  location = "",
  remote,
  minSalary,
  maxSalary,
  jobType = "",
  days,
}) => {
  const filter = {
    isActive: true,
  };

  if (search) {
    filter.$text = {
      $search: search,
    };
  }

  if (location) {
    filter.location = {
      $regex: location,
      $options: "i",
    };
  }

  if (
    remote !== undefined &&
    remote !== ""
  ) {
    filter.isRemote =
      remote === true ||
      remote === "true";
  }

  if (
    minSalary !== undefined &&
    minSalary !== ""
  ) {
    filter["salary.max"] = {
      $gte: Number(minSalary),
    };
  }

  if (
    maxSalary !== undefined &&
    maxSalary !== ""
  ) {
    filter["salary.min"] = {
      ...(filter["salary.min"] || {}),
      $lte: Number(maxSalary),
    };
  }

  if (jobType) {
    filter.jobType = {
      $regex: jobType,
      $options: "i",
    };
  }

  if (
    days !== undefined &&
    days !== ""
  ) {
    const numberOfDays = Number(days);

    if (
      !Number.isNaN(numberOfDays) &&
      numberOfDays > 0
    ) {
      const cutoffDate = new Date();

      cutoffDate.setDate(
        cutoffDate.getDate() -
          numberOfDays
      );

      filter.postedAt = {
        $gte: cutoffDate,
      };
    }
  }

  return jobRepository.findJobs(
    filter,
    {
      page,
      limit,
      sort: {
        postedAt: -1,
      },
    }
  );
};

// ======================================================
// GET SINGLE JOB
// ======================================================

const getJobById = async (jobId) => {
  const job =
    await jobRepository.findJobById(
      jobId
    );

  if (!job) {
    const error = new Error(
      "Job not found"
    );

    error.statusCode = 404;

    throw error;
  }

  return job;
};

// ======================================================
// SAVE JOB
// ======================================================

const saveJob = async (
  userId,
  jobId
) => {
  const job =
    await jobRepository.findJobById(
      jobId
    );

  if (!job) {
    const error = new Error(
      "Job not found"
    );

    error.statusCode = 404;

    throw error;
  }

  await savedJobRepository.saveJob(
    userId,
    jobId
  );

  return {
    jobId,
    saved: true,
  };
};

// ======================================================
// UNSAVE JOB
// ======================================================

const unsaveJob = async (
  userId,
  jobId
) => {
  const deleted =
    await savedJobRepository.unsaveJob(
      userId,
      jobId
    );

  return {
    jobId,
    saved: false,
    existed: Boolean(deleted),
  };
};

// ======================================================
// GET SAVED JOBS
// ======================================================

const getSavedJobs = async (
  userId,
  page = 1,
  limit = 20
) => {
  return savedJobRepository.getSavedJobs(
    userId,
    page,
    limit
  );
};

// ======================================================
// APPLY TO JOB
// ======================================================

// ======================================================
// APPLY TO JOB
// ======================================================

const applyToJob = async (
  userId,
  jobId,
  resumeId,
  notes
) => {
  const job =
    await jobRepository.findJobById(
      jobId
    );

  if (!job) {
    const error = new Error(
      "Job not found"
    );

    error.statusCode = 404;

    throw error;
  }

  /*
   * Verify that the resume belongs
   * to the logged-in user.
   */
  const resume =
    await Resume.findOne({
      _id: resumeId,
      user: userId,
    }).lean();

  if (!resume) {
    const error = new Error(
      "Resume not found or unauthorized"
    );

    error.statusCode = 404;

    throw error;
  }

  return applicationRepository.createApplication(
    userId,
    jobId,
    resumeId,
    notes
  );
};

// ======================================================
// GET APPLICATIONS
// ======================================================

const getApplications = async (
  userId,
  page = 1,
  limit = 20
) => {
  return applicationRepository.getApplications(
    userId,
    page,
    limit
  );
};

// ======================================================
// GET SINGLE APPLICATION
// ======================================================

const getApplication = async (
  userId,
  jobId
) => {
  return applicationRepository.getApplication(
    userId,
    jobId
  );
};

// ======================================================
// UPDATE APPLICATION STATUS
// ======================================================

const updateApplicationStatus = async (
  userId,
  jobId,
  status,
  notes
) => {
  const application =
    await applicationRepository.getApplication(
      userId,
      jobId
    );

  if (!application) {
    const error = new Error(
      "Application not found"
    );

    error.statusCode = 404;

    throw error;
  }

  const allowedStatuses = [
    "applied",
    "interview",
    "offer",
    "rejected",
    "withdrawn",
  ];

  if (
    !allowedStatuses.includes(status)
  ) {
    const error = new Error(
      "Invalid application status"
    );

    error.statusCode = 400;

    throw error;
  }

  return applicationRepository.updateApplicationStatus(
    userId,
    jobId,
    status,
    notes
  );
};

// ======================================================
// AI JOB MATCH
// ======================================================

const matchJobWithResume = async ({
  resumeId,
  jobId,
  userId,
}) => {
  const job =
    await jobRepository.findJobById(
      jobId
    );

  if (!job) {
    const error = new Error(
      "Job not found"
    );

    error.statusCode = 404;

    throw error;
  }

  return calculateMatch({
    resumeId,
    job,
    userId,
  });
};

// ======================================================
// EXPORT
// ======================================================

module.exports = {
  searchJobs,
  getJobs,
  getJobById,
  saveJob,
  unsaveJob,
  getSavedJobs,
  applyToJob,
  getApplications,
  getApplication,
  updateApplicationStatus,
  matchJobWithResume,
};