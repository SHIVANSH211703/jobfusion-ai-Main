const test = require("node:test");
const assert = require("node:assert/strict");

const { parseInterviewPrep } = require("../src/modules/interviews/validators/interviewPrep.schema");

const validPrep = {
  technicalQuestions: [{ question: "How did you design the API?", context: "Based on the API project in the resume." }],
  behavioralQuestions: [],
  resumeQuestions: [],
  jobSpecificQuestions: [],
};

test("accepts structured interview prep categories", () => {
  assert.deepEqual(parseInterviewPrep(validPrep), validPrep);
});

test("rejects empty questions and unstructured AI output", () => {
  assert.throws(
    () => parseInterviewPrep({ ...validPrep, resumeQuestions: [{ question: "", context: "Resume" }] }),
    { message: "AI provider returned invalid interview preparation." }
  );
});