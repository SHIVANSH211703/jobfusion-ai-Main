const { z } = require("zod");

const scoreSchema = z.number().min(0).max(100);
const itemListSchema = z.array(z.string().trim().min(1)).max(40);

const resumeAnalysisSchema = z.object({
  score: scoreSchema,
  aiSummary: z.string().trim().min(1).max(2000),
  categories: z.object({
    keywords: scoreSchema,
    skills: scoreSchema,
    experience: scoreSchema,
    education: scoreSchema,
    formatting: scoreSchema,
    impact: scoreSchema,
  }),
  matchedKeywords: itemListSchema,
  missingKeywords: itemListSchema,
  jobSpecificRecommendations: itemListSchema,
  weakSections: itemListSchema,
  strengths: itemListSchema,
  weaknesses: itemListSchema,
  recommendations: itemListSchema,
});

const parseResumeAnalysis = (value) => {
  const result = resumeAnalysisSchema.safeParse(value);

  if (!result.success) {
    const error = new Error("AI provider returned an invalid resume analysis.");
    error.statusCode = 502;
    throw error;
  }

  return result.data;
};

module.exports = {
  resumeAnalysisSchema,
  parseResumeAnalysis,
};