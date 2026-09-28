const dashboardService = require("../services/dashboard.service");
const analyticsService = require("../services/analytics.service");
const asyncHandler = require("../../../utils/asyncHandler");

const getDashboard = asyncHandler(async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  const data = await dashboardService.getDashboard(userId);

  res.status(200).json({
    success: true,
    message: "Dashboard data retrieved successfully",
    data,
  });
});

const getAnalytics = asyncHandler(async (req, res) => {
  const data = await analyticsService.getAnalytics(req.user.id);
  res.status(200).json({
    success: true,
    message: "Application analytics retrieved successfully",
    data,
  });
});

module.exports = {
  getDashboard,
  getAnalytics,
};
