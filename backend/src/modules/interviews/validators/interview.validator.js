const { body, param } = require("express-validator");

const interviewIdValidation = [
  param("id").isMongoId().withMessage("Invalid interview id"),
];

const createInterviewValidation = [
  body("applicationId").isMongoId().withMessage("Valid applicationId is required"),
  body("round").isIn(["technical", "hr", "managerial", "behavioral", "other"]),
  body("type").isIn(["phone", "video", "onsite", "other"]),
  body("scheduledAt").isISO8601().toDate(),
  body("interviewer").optional().isString().trim().isLength({ max: 160 }),
  body("notes").optional().isString().trim().isLength({ max: 5000 }),
];

const prepareInterviewValidation = [
  body("applicationId").isMongoId().withMessage("Valid applicationId is required"),
];

const updateInterviewValidation = [
  body("round").optional().isIn(["technical", "hr", "managerial", "behavioral", "other"]),
  body("type").optional().isIn(["phone", "video", "onsite", "other"]),
  body("scheduledAt").optional().isISO8601().toDate(),
  body("interviewer").optional().isString().trim().isLength({ max: 160 }),
  body("notes").optional().isString().trim().isLength({ max: 5000 }),
  body("status").optional().isIn(["scheduled", "completed", "cancelled"]),
  body("feedback").optional().isString().trim().isLength({ max: 5000 }),
];

module.exports = { interviewIdValidation, createInterviewValidation, updateInterviewValidation, prepareInterviewValidation };