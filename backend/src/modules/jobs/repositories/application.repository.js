const Application = require("../models/application.model");

const createApplication = async (
  userId,
  jobId,
  resumeId,
  notes
) => {
  return Application.findOneAndUpdate(
    {
      userId,
      jobId,
    },
    {
      $set: {
        resumeId,
        ...(notes !== undefined
          ? { notes }
          : {}),
      },

      $setOnInsert: {
        userId,
        jobId,
        status: "applied",
        appliedAt: new Date(),
      },
    },
    {
      new: true,
      upsert: true,
    }
  )
    .populate("jobId")
    .populate("resumeId");
};

const getApplication = async (
  userId,
  jobId
) => {
  return Application.findOne({
    userId,
    jobId,
  }).lean();
};

const updateApplicationStatus = async (
  userId,
  jobId,
  status,
  notes
) => {
  return Application.findOneAndUpdate(
    {
      userId,
      jobId,
    },
    {
      $set: {
        status,
        ...(notes !== undefined
          ? { notes }
          : {}),
      },
    },
    {
      new: true,
    }
  ).lean();
};

const getApplications = async (
  userId,
  page = 1,
  limit = 20
) => {
  const skip =
    (page - 1) * limit;

  const filter = {
    userId,
  };

  const [
    applications,
    total,
  ] = await Promise.all([
    Application.find(filter)
      .populate("jobId")
      .populate("resumeId")
      .sort({
        appliedAt: -1,
      })
      .skip(skip)
      .limit(limit)
      .lean(),

    Application.countDocuments(
      filter
    ),
  ]);

  return {
    applications,
    total,
    page,
    limit,
    totalPages: Math.ceil(
      total / limit
    ),
  };
};

module.exports = {
  createApplication,
  getApplication,
  updateApplicationStatus,
  getApplications,
};