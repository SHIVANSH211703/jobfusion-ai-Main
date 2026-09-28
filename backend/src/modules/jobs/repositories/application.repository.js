const Application = require("../models/application.model");

const createApplication = async (
  userId,
  jobId,
  resumeId,
  notes
) => {
  return Application.create({
    userId,
    jobId,
    resumeId,
    status: "applied",
    statusHistory: [{ status: "applied", changedAt: new Date() }],
    appliedAt: new Date(),
    notes: notes || "",
  }).then((application) => application
    .populate("jobId")
    .then((populatedApplication) => populatedApplication.populate("resumeId")));
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

const findOwnedApplication = async (userId, applicationId) => {
  return Application.findOne({ _id: applicationId, userId })
    .populate("jobId")
    .populate("resumeId")
    .lean();
};

const updateApplicationStatus = async (
  userId,
  targetId,
  status,
  notes,
  followUpDate
) => {
  const existingApplication = await Application.findOne({
    userId,
    $or: [{ jobId: targetId }, { _id: targetId }],
  });
  if (!existingApplication) return null;

  const update = {
    $set: {
      ...(status ? { status } : {}),
      ...(notes !== undefined ? { notes } : {}),
      ...(followUpDate !== undefined
        ? { followUpDate: followUpDate ? new Date(followUpDate) : null }
        : {}),
    },
  };

  if (status && existingApplication.status !== status) {
    update.$push = {
      statusHistory: {
        status,
        changedAt: new Date(),
        note: typeof notes === "string" ? notes.trim() : "",
      },
    };
  }

  return Application.findOneAndUpdate(
    {
      _id: existingApplication._id,
      userId,
    },
    update,
    {
      new: true,
    }
  ).populate("jobId").populate("resumeId").lean();
};

const deleteApplication = async (userId, targetId) => {
  return Application.findOneAndDelete({
    userId,
    $or: [{ jobId: targetId }, { _id: targetId }],
  });
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
  findOwnedApplication,
  updateApplicationStatus,
  deleteApplication,
  getApplications,
};