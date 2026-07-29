const express = require("express");

const authMiddleware = require("../../../middlewares/auth.middleware");
const uploadResume = require("../../../middlewares/resumeUpload.middleware");
const validate = require("../../../middlewares/validation.middleware");

const resumeUploadController = require("../controllers/resumeUpload.controller");

const {
  uploadIdValidation,
} = require("../validators/resumeUpload.validator");

const router = express.Router();

/**
 * Upload Resume
 * POST /api/v1/resume-upload
 */
router.post(
  "/",
  authMiddleware,
  uploadResume.single("resume"),
  resumeUploadController.uploadResume
);

/**
 * Get All Uploaded Resumes
 * GET /api/v1/resume-upload
 */
router.get(
  "/",
  authMiddleware,
  resumeUploadController.getUploads
);

/**
 * Get Upload By Id
 * GET /api/v1/resume-upload/:id
 */
router.get(
  "/:id",
  authMiddleware,
  uploadIdValidation,
  validate,
  resumeUploadController.getUpload
);

/**
 * Delete Upload
 * DELETE /api/v1/resume-upload/:id
 */
router.delete(
  "/:id",
  authMiddleware,
  uploadIdValidation,
  validate,
  resumeUploadController.deleteUpload
);

module.exports = router;