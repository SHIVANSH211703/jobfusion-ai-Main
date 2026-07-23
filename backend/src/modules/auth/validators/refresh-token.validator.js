const { body } = require("express-validator");

const refreshTokenValidation = [
  body("refreshToken")
    .trim()
    .notEmpty()
    .withMessage("Refresh token is required"),
];

module.exports = {
  refreshTokenValidation,
};