const asyncHandler = require("../../../utils/asyncHandler");
const notificationService = require("../services/notification.service");

class NotificationController {
  list = asyncHandler(async (req, res) => {
    const limit = Math.min(Math.max(Number(req.query.limit) || 30, 1), 100);
    const data = await notificationService.list(req.user.id, limit);
    res.status(200).json({ success: true, data });
  });

  markRead = asyncHandler(async (req, res) => {
    const data = await notificationService.markRead(req.user.id, req.params.id);
    res.status(200).json({ success: true, data });
  });

  markAllRead = asyncHandler(async (req, res) => {
    const data = await notificationService.markAllRead(req.user.id);
    res.status(200).json({ success: true, data });
  });
}

module.exports = new NotificationController();