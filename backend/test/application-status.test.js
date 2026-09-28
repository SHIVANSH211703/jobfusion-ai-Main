const test = require("node:test");
const assert = require("node:assert/strict");

const { APPLICATION_STATUSES } = require("../src/modules/jobs/applicationStatus");

test("application lifecycle retains existing statuses and supports interview stages", () => {
  for (const existingStatus of ["applied", "interview", "offer", "rejected", "withdrawn"]) {
    assert.ok(APPLICATION_STATUSES.includes(existingStatus));
  }

  for (const additionalStatus of ["screening", "technical", "hr"]) {
    assert.ok(APPLICATION_STATUSES.includes(additionalStatus));
  }
});