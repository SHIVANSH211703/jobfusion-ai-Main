const test = require("node:test");
const assert = require("node:assert/strict");

const { parseResumeTailoring } = require("../src/modules/resume/validators/resumeTailoring.schema");

const sourceResume = {
  experience: [{ company: "Example Co", position: "Developer", description: "Built APIs" }],
  projects: [],
  achievements: [{ title: "Award", description: "Received team award" }],
};

const validSuggestions = {
  summary: "Backend developer focused on API delivery.",
  experience: [{ index: 0, description: "Developed and maintained APIs." }],
  projects: [],
  achievements: [{ index: 0, description: "Recognized with a team award." }],
  changes: ["Reworded existing experience for the target role"],
};

test("accepts suggestions mapped to existing resume sections", () => {
  assert.deepEqual(parseResumeTailoring(validSuggestions, sourceResume), validSuggestions);
});

test("rejects suggestions that introduce new experience entries", () => {
  const inventedEntry = {
    ...validSuggestions,
    experience: [...validSuggestions.experience, { index: 1, description: "New role" }],
  };
  assert.throws(
    () => parseResumeTailoring(inventedEntry, sourceResume),
    { message: "AI provider returned suggestions outside the source resume sections." }
  );
});