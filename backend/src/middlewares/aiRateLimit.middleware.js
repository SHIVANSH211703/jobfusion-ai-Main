const AppError = require("../utils/AppError");

const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 12;
const MAX_TRACKED_USERS = 10000;
const requestsByUser = new Map();

const aiRateLimit = (req, res, next) => {
  const userId = req.user?.id;
  if (!userId) {
    return next(new AppError("Authentication required", 401));
  }

  const now = Date.now();
  const entry = requestsByUser.get(userId);
  if (!entry || now - entry.windowStartedAt >= WINDOW_MS) {
    if (requestsByUser.size >= MAX_TRACKED_USERS) {
      for (const [key, value] of requestsByUser) {
        if (now - value.windowStartedAt >= WINDOW_MS) requestsByUser.delete(key);
      }
    }
    requestsByUser.set(userId, { windowStartedAt: now, count: 1 });
    return next();
  }

  if (entry.count >= MAX_REQUESTS) {
    res.set("Retry-After", String(Math.ceil((WINDOW_MS - (now - entry.windowStartedAt)) / 1000)));
    return next(new AppError("AI request limit reached. Please try again later.", 429));
  }

  entry.count += 1;
  return next();
};

module.exports = aiRateLimit;