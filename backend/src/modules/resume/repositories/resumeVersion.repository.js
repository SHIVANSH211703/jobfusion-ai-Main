const ResumeVersion = require("../models/resumeVersion.model");
const ResumeVersionCounter = require("../models/resumeVersionCounter.model");

class ResumeVersionRepository {
  async findLatest(userId, resumeId) {
    return ResumeVersion.findOne({ userId, resumeId })
      .sort({ versionNumber: -1 })
      .lean();
  }

  async create(data) {
    const counter = await ResumeVersionCounter.findOneAndUpdate(
      { _id: data.resumeId },
      { $inc: { sequence: 1 } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    try {
      return await ResumeVersion.create({
        ...data,
        versionNumber: counter.sequence,
      });
    } catch (error) {
      await ResumeVersionCounter.updateOne(
        { _id: data.resumeId, sequence: counter.sequence },
        { $inc: { sequence: -1 } }
      );
      throw error;
    }
  }

  async findAll(userId, resumeId) {
    return ResumeVersion.find({ userId, resumeId })
      .select("-content")
      .sort({ versionNumber: -1 })
      .lean();
  }

  async findById(userId, resumeId, versionId) {
    return ResumeVersion.findOne({
      _id: versionId,
      userId,
      resumeId,
    }).lean();
  }

  async deleteForResume(userId, resumeId) {
    const result = await ResumeVersion.deleteMany({ userId, resumeId });
    await ResumeVersionCounter.deleteOne({ _id: resumeId });
    return result;
  }
}

module.exports = new ResumeVersionRepository();