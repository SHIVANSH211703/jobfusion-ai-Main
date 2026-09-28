const mongoose = require("mongoose");
const Application = require("../../jobs/models/application.model");
const { APPLICATION_STATUSES } = require("../../jobs/applicationStatus");

const buildAnalyticsSummary = (total, groupedStatuses, monthlyCounts) => {
  const statuses = Object.fromEntries(APPLICATION_STATUSES.map((status) => [status, 0]));
  for (const item of groupedStatuses) {
    if (Object.hasOwn(statuses, item._id)) statuses[item._id] = item.count;
  }

  const interviews = statuses.interview + statuses.technical + statuses.hr;
  const responses = interviews + statuses.offer + statuses.rejected;

  return {
    totalApplications: total,
    statuses,
    responseRate: total > 0 ? Math.round((responses / total) * 100) : null,
    interviewConversion: total > 0 ? Math.round((interviews / total) * 100) : null,
    offerRate: total > 0 ? Math.round((statuses.offer / total) * 100) : null,
    applicationsOverTime: monthlyCounts.map(({ _id, count }) => ({
      year: _id.year,
      month: _id.month,
      count,
    })),
  };
};

const getAnalytics = async (userId) => {
  const [total, groupedStatuses, monthlyCounts] = await Promise.all([
    Application.countDocuments({ userId }),
    Application.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),
    Application.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: {
            year: { $year: "$appliedAt" },
            month: { $month: "$appliedAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      { $limit: 24 },
    ]),
  ]);

  return buildAnalyticsSummary(total, groupedStatuses, monthlyCounts);
};

module.exports = { getAnalytics, buildAnalyticsSummary };