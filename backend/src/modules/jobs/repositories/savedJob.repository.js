const SavedJob = require("../models/savedJob.model");

const saveJob = async (userId, jobId) => {
  return SavedJob.findOneAndUpdate(
    {
      userId,
      jobId,
    },
    {
      $setOnInsert: {
        userId,
        jobId,
      },
    },
    {
      new: true,
      upsert: true,
    }
  );
};

const unsaveJob = async (userId, jobId) => {
  return SavedJob.findOneAndDelete({
    userId,
    jobId,
  });
};

const isJobSaved = async (userId, jobId) => {
  return SavedJob.exists({
    userId,
    jobId,
  });
};

const getSavedJobs = async (
  userId,
  page = 1,
  limit = 20
) => {
  const skip = (page - 1) * limit;

  const filter = {
    userId,
  };

  const [savedJobs, total] = await Promise.all([
    SavedJob.find(filter)
      .populate("jobId")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),

    SavedJob.countDocuments(filter),
  ]);

  return {
    jobs: savedJobs
      .map((item) => item.jobId)
      .filter(Boolean),

    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

module.exports = {
  saveJob,
  unsaveJob,
  isJobSaved,
  getSavedJobs,
};