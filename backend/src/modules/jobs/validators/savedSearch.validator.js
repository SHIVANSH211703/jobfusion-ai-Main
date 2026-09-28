const { body, param } = require("express-validator");

const savedSearchIdValidation = [
  param("id").isMongoId().withMessage("Invalid saved search id"),
];

const createSavedSearchValidation = [
  body("name").isString().trim().isLength({ min: 1, max: 80 }),
  body("filters").isObject(),
  body("filters.search").optional().isString().trim().isLength({ max: 120 }),
  body("filters.location").optional().isString().trim().isLength({ max: 120 }),
  body("filters.remote").optional({ nullable: true }).isBoolean(),
  body("filters.minSalary").optional({ nullable: true }).isFloat({ min: 0 }),
  body("filters.maxSalary").optional({ nullable: true }).isFloat({ min: 0 }),
  body("filters.jobType").optional().isString().trim().isLength({ max: 80 }),
  body("filters.days").optional({ nullable: true }).isInt({ min: 1, max: 365 }),
  body("filters.sort").optional().isIn(["newest", "salary_high", "salary_low"]),
  body("enabled").optional().isBoolean(),
];

const updateSavedSearchValidation = [
  body("name").optional().isString().trim().isLength({ min: 1, max: 80 }),
  body("filters").optional().isObject(),
  body("enabled").optional().isBoolean(),
];

module.exports = { savedSearchIdValidation, createSavedSearchValidation, updateSavedSearchValidation };