const test = require("node:test");
const assert = require("node:assert/strict");

const { parseJobMatch } = require("../src/modules/jobs/validators/jobMatch.schema");

const validMatch = {
  matchScore: 81,
  categories: {
    skills: 88,
    experience: 76,
    education: 90,
    keywords: 79,
    location: null,
  },
  matchedSkills: ["Node.js", "MongoDB"],
  missingSkills: ["Redis"],
  matchedKeywords: ["REST APIs"],
  missingKeywords: ["observability"],
  strengths: ["Relevant API development experience"],
  weaknesses: ["No evidence of Redis experience"],
  recommendations: ["Discuss transferable caching experience if applicable"],
};

test("accepts an explainable job match with unknown location fit", () => {
  assert.deepEqual(parseJobMatch(validMatch), validMatch);
});

test("rejects fabricated fallback scores from malformed provider output", () => {
  assert.throws(
    () => parseJobMatch({ ...validMatch, categories: { ...validMatch.categories, skills: 101 } }),
    { message: "AI provider returned an invalid job match analysis." }
  );
});