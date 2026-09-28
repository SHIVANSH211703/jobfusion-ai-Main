const { body } = require("express-validator");

const careerGapValidation = [
  body("targetRole").isString().trim().isLength({ min: 2, max: 120 }),
];

module.exports = { careerGapValidation };