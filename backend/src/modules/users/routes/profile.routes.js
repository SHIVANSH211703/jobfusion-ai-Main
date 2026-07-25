const express = require("express");

const profileController = require("../controllers/profile.controller");

const authenticate = require("../../../middlewares/auth.middleware");
const validate = require("../../../middlewares/validation.middleware");
const upload = require("../../../middlewares/upload.middleware");

const {
  updateProfileValidator,
} = require("../validators/profile.validator");

const router = express.Router();

router.get(
  "/",
  authenticate,
  profileController.getProfile
);

router.put(
  "/",
  authenticate,
  updateProfileValidator,
  validate,
  profileController.updateProfile
);

router.put(
  "/avatar",
  authenticate,
  upload.single("avatar"),
  profileController.updateAvatar
);

module.exports = router;