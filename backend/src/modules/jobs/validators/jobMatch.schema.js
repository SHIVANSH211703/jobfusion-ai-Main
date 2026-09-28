const { z } = require("zod");

const scoreSchema = z.number().min(0).max(100);
const itemListSchema = z.array(z.string().trim().min(1)).max(40);

const jobMatchSchema = z.object({
  matchScore: scoreSchema,
  categories: z.object({
    skills: scoreSchema,
    experience: scoreSchema,
    education: scoreSchema,
    keywords: scoreSchema,
    location: scoreSchema.nullable(),
  }),
  matchedSkills: itemListSchema,
  missingSkills: itemListSchema,
  matchedKeywords: itemListSchema,
  missingKeywords: itemListSchema,
  strengths: itemListSchema,
  weaknesses: itemListSchema,
  recommendations: itemListSchema,
});

const parseJobMatch = (value) => {
  const result = jobMatchSchema.safeParse(value);
  if (!result.success) {
    const error = new Error("AI provider returned an invalid job match analysis.");
    error.statusCode = 502;
    throw error;
  }
  return result.data;
};

module.exports = { jobMatchSchema, parseJobMatch };