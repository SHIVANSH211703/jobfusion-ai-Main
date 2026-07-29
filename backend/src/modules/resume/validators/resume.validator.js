const { body, param } = require("express-validator");

const createResumeValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Resume title is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Resume title must be between 3 and 100 characters"),

  body("template")
    .optional()
    .isString()
    .withMessage("Template must be a string"),

  body("summary")
    .optional()
    .isLength({ max: 1000 })
    .withMessage("Summary cannot exceed 1000 characters"),
];

const updateResumeValidation = [
  body("title")
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Resume title must be between 3 and 100 characters"),

  body("template")
    .optional()
    .isString()
    .withMessage("Template must be a string"),

  body("summary")
    .optional()
    .isLength({ max: 1000 })
    .withMessage("Summary cannot exceed 1000 characters"),

  body("isPublic")
    .optional()
    .isBoolean()
    .withMessage("isPublic must be true or false"),

  body("status")
    .optional()
    .isIn(["draft", "published"])
    .withMessage("Invalid resume status"),
];

const resumeIdValidation = [
  param("id")
    .isMongoId()
    .withMessage("Invalid resume id"),
];

const publicResumeValidation = [
  param("slug")
    .notEmpty()
    .withMessage("Resume slug is required"),
];

module.exports = {
  createResumeValidation,
  updateResumeValidation,
  resumeIdValidation,
  publicResumeValidation,
};