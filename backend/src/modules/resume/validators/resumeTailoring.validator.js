const { body } = require("express-validator");

const resumeTailoringValidation = [
  body("jobDescription")
    .isString()
    .trim()
    .isLength({ min: 20, max: 10000 })
    .withMessage("Job description must be between 20 and 10000 characters."),
];

module.exports = { resumeTailoringValidation };