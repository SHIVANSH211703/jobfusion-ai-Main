const test = require("node:test");
const assert = require("node:assert/strict");

const { filterExistingSkillsFromGaps } = require("../src/modules/resume/validators/careerGap.schema");

test("career gap filtering removes skills already present in profile or resume evidence", () => {
  const result = filterExistingSkillsFromGaps({
    strongSkills: ["Node.js"],
    skillsToImprove: ["Node.js", "AWS"],
    missingSkills: ["Node.js", "Kubernetes"],
    experienceGaps: [],
    learningTopics: ["Kubernetes"],
    roadmap: [
      { focus: "Kubernetes fundamentals", reason: "Required by target roles", relatedGap: "Kubernetes" },
      { focus: "Node.js", reason: "Already present", relatedGap: "Node.js" },
    ],
  }, "Node.js Express MongoDB");

  assert.deepEqual(result.missingSkills, ["Kubernetes"]);
  assert.deepEqual(result.roadmap.map((step) => step.relatedGap), ["Kubernetes"]);
});