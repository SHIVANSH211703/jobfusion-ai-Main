const express = require("express");

const resumeController = require("../controllers/resume.controller");

const authenticate = require("../../../middlewares/auth.middleware");
const validate = require("../../../middlewares/validation.middleware");

const {
  createResumeValidation,
  updateResumeValidation,
  resumeIdValidation,
  publicResumeValidation,
} = require("../validators/resume.validator");

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

router.get(
  "/public/:slug",
  publicResumeValidation,
  validate,
  resumeController.getPublicResume
);

/*
|--------------------------------------------------------------------------
| Protected Routes
|--------------------------------------------------------------------------
*/

router.use(authenticate);

router.post(
  "/",
  createResumeValidation,
  validate,
  resumeController.createResume
);

router.get("/", resumeController.getUserResumes);

router.get(
  "/:id",
  resumeIdValidation,
  validate,
  resumeController.getResumeById
);

router.put(
  "/:id",
  [...resumeIdValidation, ...updateResumeValidation],
  validate,
  resumeController.updateResume
);

router.delete(
  "/:id",
  resumeIdValidation,
  validate,
  resumeController.deleteResume
);

/*
|--------------------------------------------------------------------------
| ATS Resume Analysis
|--------------------------------------------------------------------------
*/

router.post(
  "/:id/analyze",
  resumeIdValidation,
  validate,
  resumeController.analyzeResume
);

/*
|--------------------------------------------------------------------------
| Resume Improvement
|--------------------------------------------------------------------------
*/

router.post(
  "/:id/improve",
  resumeIdValidation,
  validate,
  resumeController.improveResume
);

module.exports = router;