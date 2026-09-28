const test = require("node:test");
const assert = require("node:assert/strict");

const { parseResumeImprovement } = require("../src/modules/resume/validators/resumeImprovement.schema");

const source = {
  summary: "Developer",
  experience: [{ company: "Existing Co", position: "Engineer", startDate: "2020", description: "Built services" }],
  projects: [],
  skills: ["Node.js"],
  achievements: [{ title: "Award", description: "Received award" }],
};

test("preserves original company, role, dates, titles and skills while accepting rewritten descriptions", () => {
  const result = parseResumeImprovement({
    summary: "Backend engineer focused on services",
    experience: [{ company: "Invented Co", position: "Invented Role", startDate: "2030", description: "Designed reliable services" }],
    projects: [],
    skills: ["Node.js"],
    achievements: [{ title: "Invented award", description: "Recognized for delivery" }],
    changes: ["Clarified service ownership"],
  }, source);

  assert.equal(result.experience[0].company, "Existing Co");
  assert.equal(result.experience[0].position, "Engineer");
  assert.equal(result.experience[0].startDate, "2020");
  assert.equal(result.achievements[0].title, "Award");
});

test("rejects added experience and unsupported skills", () => {
  assert.throws(() => parseResumeImprovement({
    summary: "Updated",
    experience: [{ description: "One" }, { description: "Invented" }],
    projects: [],
    skills: ["Node.js", "Kubernetes"],
    achievements: [{ description: "Updated award" }],
    changes: ["Updated wording"],
  }, source));
});