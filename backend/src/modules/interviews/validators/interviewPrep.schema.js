const { z } = require("zod");

const questionSchema = z.object({
  question: z.string().trim().min(1).max(500),
  context: z.string().trim().min(1).max(500),
});

const interviewPrepSchema = z.object({
  technicalQuestions: z.array(questionSchema).max(12),
  behavioralQuestions: z.array(questionSchema).max(12),
  resumeQuestions: z.array(questionSchema).max(12),
  jobSpecificQuestions: z.array(questionSchema).max(12),
});

const parseInterviewPrep = (value) => {
  const result = interviewPrepSchema.safeParse(value);
  if (!result.success) {
    const error = new Error("AI provider returned invalid interview preparation.");
    error.statusCode = 502;
    throw error;
  }
  return result.data;
};

module.exports = { interviewPrepSchema, parseInterviewPrep };