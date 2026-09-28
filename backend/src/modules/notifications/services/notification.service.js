const AppError = require("../../../utils/AppError");
const notificationRepository = require("../repositories/notification.repository");

class NotificationService {
  async create(data) {
    return notificationRepository.create(data);
  }

  async list(userId, limit = 30) {
    return notificationRepository.list(userId, limit);
  }

  async markRead(userId, id) {
    const notification = await notificationRepository.markRead(userId, id);
    if (!notification) throw new AppError("Notification not found", 404);
    return notification;
  }

  async markAllRead(userId) {
    const result = await notificationRepository.markAllRead(userId);
    return { modifiedCount: result.modifiedCount };
  }
}

module.exports = new NotificationService();