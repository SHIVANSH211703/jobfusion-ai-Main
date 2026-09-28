const AppError = require("../../../utils/AppError");
const applicationRepository = require("../../jobs/repositories/application.repository");
const interviewRepository = require("../repositories/interview.repository");
const aiService = require("../../../services/ai.service");
const notificationService = require("../../notifications/services/notification.service");

class InterviewService {
  async list(userId) {
    return interviewRepository.findByUser(userId);
  }

  async create(userId, data) {
    const application = await applicationRepository.findOwnedApplication(userId, data.applicationId);
    if (!application) {
      throw new AppError("Application not found", 404);
    }
    const interview = await interviewRepository.create({ ...data, userId });
    try {
      await notificationService.create({
        userId,
        type: "INTERVIEW_REMINDER",
        title: "Interview scheduled",
        message: `Your ${data.round} interview is scheduled for ${new Date(data.scheduledAt).toLocaleString()}.`,
        metadata: { interviewId: interview._id, applicationId: data.applicationId, scheduledAt: data.scheduledAt },
      });
    } catch (error) {
      console.error("Interview notification could not be stored", { code: error.code });
    }
    return interview;
  }

  async prepare(userId, applicationId) {
    const application = await applicationRepository.findOwnedApplication(userId, applicationId);
    if (!application) {
      throw new AppError("Application not found", 404);
    }
    if (!application.jobId?.description || !application.resumeId) {
      throw new AppError("This application needs an available job description and applied resume for preparation.", 422);
    }

    return aiService.prepareForInterview({
      job: application.jobId,
      resume: application.resumeId,
    });
  }

  async update(userId, id, data) {
    const existing = await interviewRepository.findById(userId, id);
    if (!existing) {
      throw new AppError("Interview not found", 404);
    }
    const updated = await interviewRepository.update(userId, id, data);
    if (!updated) {
      throw new AppError("Interview not found", 404);
    }
    return updated;
  }

  async delete(userId, id) {
    const deleted = await interviewRepository.delete(userId, id);
    if (!deleted) {
      throw new AppError("Interview not found", 404);
    }
    return { message: "Interview deleted successfully" };
  }
}

module.exports = new InterviewService();