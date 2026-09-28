const test = require("node:test");
const assert = require("node:assert/strict");

const { buildAnalyticsSummary } = require("../src/modules/dashboard/services/analytics.service");

test("analytics returns null rates and empty timeline without applications", () => {
  const result = buildAnalyticsSummary(0, [], []);
  assert.equal(result.responseRate, null);
  assert.equal(result.interviewConversion, null);
  assert.equal(result.offerRate, null);
  assert.deepEqual(result.applicationsOverTime, []);
});

test("analytics derives rates only from persisted status totals", () => {
  const result = buildAnalyticsSummary(4, [
    { _id: "applied", count: 1 },
    { _id: "interview", count: 1 },
    { _id: "technical", count: 1 },
    { _id: "rejected", count: 1 },
  ], [{ _id: { year: 2026, month: 9 }, count: 4 }]);

  assert.equal(result.responseRate, 75);
  assert.equal(result.interviewConversion, 50);
  assert.equal(result.offerRate, 0);
  assert.equal(result.applicationsOverTime[0].count, 4);
});