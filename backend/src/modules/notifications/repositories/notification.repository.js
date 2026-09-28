const Notification = require("../models/notification.model");

class NotificationRepository {
  async create(data) {
    return Notification.create(data);
  }

  async list(userId, limit = 30) {
    const [notifications, unreadCount] = await Promise.all([
      Notification.find({ userId }).sort({ createdAt: -1 }).limit(limit).lean(),
      Notification.countDocuments({ userId, readAt: null }),
    ]);
    return { notifications, unreadCount };
  }

  async markRead(userId, id) {
    return Notification.findOneAndUpdate(
      { _id: id, userId },
      { $set: { readAt: new Date() } },
      { new: true }
    ).lean();
  }

  async markAllRead(userId) {
    return Notification.updateMany(
      { userId, readAt: null },
      { $set: { readAt: new Date() } }
    );
  }
}

module.exports = new NotificationRepository();