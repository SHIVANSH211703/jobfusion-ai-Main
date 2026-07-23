const express = require("express");

const router = express.Router();

const authController = require("../controllers/auth.controller");

const {
  registerValidation,
  loginValidation,
} = require("../validators/auth.validator");

const {
  refreshTokenValidation,
} = require("../validators/refresh-token.validator");

const {
  changePasswordValidation,
} = require("../validators/change-password.validator");

const {
  forgotPasswordValidation,
} = require("../validators/forgot-password.validator");

const {
  resetPasswordValidation,
} = require("../validators/reset-password.validator");

const validate = require("../../../middlewares/validation.middleware");

const authMiddleware = require("../../../middlewares/auth.middleware");

// Public Routes
router.post(
  "/register",
  registerValidation,
  validate,
  authController.register
);

router.post(
  "/login",
  loginValidation,
  validate,
  authController.login
);

router.post(
  "/refresh-token",
  refreshTokenValidation,
  validate,
  authController.refreshToken
);

router.post(
  "/forgot-password",
  forgotPasswordValidation,
  validate,
  authController.forgotPassword
);

router.post(
  "/reset-password",
  resetPasswordValidation,
  validate,
  authController.resetPassword
);

// Protected Routes
router.get(
  "/me",
  authMiddleware,
  authController.me
);

router.post(
  "/logout",
  authMiddleware,
  authController.logout
);

router.post(
  "/change-password",
  authMiddleware,
  changePasswordValidation,
  validate,
  authController.changePassword
);

module.exports = router;