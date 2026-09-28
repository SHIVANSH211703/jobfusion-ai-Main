const Interview = require("../models/interview.model");

class InterviewRepository {
  async create(data) {
    const interview = await Interview.create(data);
    return interview.populate({
      path: "applicationId",
      populate: { path: "jobId", select: "title company location" },
    });
  }

  async findByUser(userId) {
    return Interview.find({ userId })
      .populate({
        path: "applicationId",
        populate: { path: "jobId", select: "title company location" },
      })
      .sort({ scheduledAt: 1 })
      .lean();
  }

  async findById(userId, id) {
    return Interview.findOne({ _id: id, userId }).lean();
  }

  async update(userId, id, data) {
    return Interview.findOneAndUpdate({ _id: id, userId }, data, {
      new: true,
      runValidators: true,
    }).lean();
  }

  async delete(userId, id) {
    return Interview.findOneAndDelete({ _id: id, userId }).lean();
  }
}

module.exports = new InterviewRepository();