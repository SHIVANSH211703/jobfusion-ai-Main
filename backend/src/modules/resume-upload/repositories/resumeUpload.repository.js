const ResumeUpload = require("../models/resumeUpload.model");

class ResumeUploadRepository {
  async create(data) {
    return await ResumeUpload.create(data);
  }

  async findById(id) {
    return await ResumeUpload.findById(id).populate("resume");
  }

  async findByUser(userId) {
    return await ResumeUpload.find({ user: userId })
      .populate("resume")
      .sort({ createdAt: -1 });
  }

  async update(id, data) {
    return await ResumeUpload.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  async updateStatus(id, parsingStatus) {
    return await ResumeUpload.findByIdAndUpdate(
      id,
      { parsingStatus },
      { new: true }
    );
  }

  async updateExtractedText(id, extractedText) {
    return await ResumeUpload.findByIdAndUpdate(
      id,
      { extractedText },
      { new: true }
    );
  }

  async attachResume(id, resumeId) {
    return await ResumeUpload.findByIdAndUpdate(
      id,
      { resume: resumeId },
      { new: true }
    );
  }

  async delete(id) {
    return await ResumeUpload.findByIdAndDelete(id);
  }
}

module.exports = new ResumeUploadRepository();