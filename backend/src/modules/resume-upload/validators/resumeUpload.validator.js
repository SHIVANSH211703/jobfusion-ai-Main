const { param } = require("express-validator");

const uploadIdValidation = [
  param("id")
    .isMongoId()
    .withMessage("Invalid upload id"),
];

module.exports = {
  uploadIdValidation,
};