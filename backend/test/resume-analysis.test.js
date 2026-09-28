const test = require("node:test");
const assert = require("node:assert/strict");

const { parseResumeAnalysis } = require("../src/modules/resume/validators/resumeAnalysis.schema");

const validAnalysis = {
  score: 82,
  aiSummary: "The resume presents relevant experience with room to quantify impact.",
  categories: {
    keywords: 74,
    skills: 79,
    experience: 88,
    education: 91,
    formatting: 94,
    impact: 76,
  },
  matchedKeywords: ["Node.js", "MongoDB"],
  missingKeywords: ["Redis"],
  jobSpecificRecommendations: [],
  weakSections: ["Experience"],
  strengths: ["Relevant backend experience"],
  weaknesses: ["Some outcomes lack measurable impact"],
  recommendations: ["Add measurable results where supported by the source content"],
};

test("accepts complete resume analysis from the provider", () => {
  assert.deepEqual(parseResumeAnalysis(validAnalysis), validAnalysis);
});

test("rejects scores outside the supported range", () => {
  assert.throws(
    () => parseResumeAnalysis({ ...validAnalysis, score: 101 }),
    { message: "AI provider returned an invalid resume analysis." }
  );
});

test("rejects incomplete category data instead of fabricating values", () => {
  const incomplete = { ...validAnalysis, categories: { ...validAnalysis.categories } };
  delete incomplete.categories.impact;

  assert.throws(
    () => parseResumeAnalysis(incomplete),
    { message: "AI provider returned an invalid resume analysis." }
  );
});