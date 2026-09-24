const Job = require("../models/job.model");

const upsertManyJobs = async (jobs) => {
  if (!jobs.length) {
    return [];
  }

  const operations = jobs.map((job) => ({
    updateOne: {
      filter: {
        externalId: job.externalId,
        source: job.source,
      },
      update: {
        $set: job,
      },
      upsert: true,
    },
  }));

  return Job.bulkWrite(operations);
};

const findJobs = async (filter = {}, options = {}) => {
  const {
    page = 1,
    limit = 20,
    sort = { postedAt: -1 },
  } = options;

  const skip = (page - 1) * limit;

  const [jobs, total] = await Promise.all([
    Job.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),

    Job.countDocuments(filter),
  ]);

  return {
    jobs,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

const findJobById = async (id) => {
  return Job.findById(id).lean();
};

module.exports = {
  upsertManyJobs,
  findJobs,
  findJobById,
};