const { param } = require("express-validator");

const versionIdValidation = [
  param("versionId").isMongoId().withMessage("Invalid resume version id"),
];

module.exports = { versionIdValidation };