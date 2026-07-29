const express = require("express");

const resumeController = require("../controllers/resume.controller");
const {
  createResumeValidation,
  updateResumeValidation,
  resumeIdValidation,
  publicResumeValidation,
  jobMatchValidation,
   coverLetterValidation,
} = require("../validators/resume.validator");
const authenticate = require("../../../middlewares/auth.middleware");
const validate = require("../../../middlewares/validation.middleware");

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

router.post(
  "/:id/job-match",
  resumeIdValidation,
  jobMatchValidation,
  validate,
  resumeController.matchResumeWithJobDescription
);

router.post(
  "/:id/cover-letter",
  resumeIdValidation,
  coverLetterValidation,
  validate,
  resumeController.generateCoverLetter
);

module.exports = router;