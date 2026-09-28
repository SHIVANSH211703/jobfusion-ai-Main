const express = require("express");

const resumeController = require("../controllers/resume.controller");
const {
  createResumeValidation,
  updateResumeValidation,
  resumeIdValidation,
  publicResumeValidation,
  analyzeResumeValidation,
  jobMatchValidation,
   coverLetterValidation,
} = require("../validators/resume.validator");
const authenticate = require("../../../middlewares/auth.middleware");
const validate = require("../../../middlewares/validation.middleware");
const aiRateLimit = require("../../../middlewares/aiRateLimit.middleware");
const { versionIdValidation } = require("../validators/resumeVersion.validator");
const { resumeTailoringValidation } = require("../validators/resumeTailoring.validator");
const { careerGapValidation } = require("../validators/careerGap.validator");

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

router.get(
  "/:id/versions",
  resumeIdValidation,
  validate,
  resumeController.getVersions
);

router.post(
  "/:id/versions",
  resumeIdValidation,
  validate,
  resumeController.createVersion
);

router.get(
  "/:id/versions/:versionId",
  [...resumeIdValidation, ...versionIdValidation],
  validate,
  resumeController.getVersion
);

router.post(
  "/:id/versions/:versionId/restore",
  [...resumeIdValidation, ...versionIdValidation],
  validate,
  resumeController.restoreVersion
);

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

router.get(
  "/:id/file",
  resumeIdValidation,
  validate,
  resumeController.getResumeFile
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
  aiRateLimit,
  [...resumeIdValidation, ...analyzeResumeValidation],
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
  aiRateLimit,
  resumeIdValidation,
  validate,
  resumeController.improveResume
);

router.post(
  "/:id/tailor",
  aiRateLimit,
  resumeIdValidation,
  resumeTailoringValidation,
  validate,
  resumeController.tailorResume
);

router.post(
  "/:id/career-gap",
  aiRateLimit,
  resumeIdValidation,
  careerGapValidation,
  validate,
  resumeController.analyzeCareerGap
);

router.post(
  "/:id/job-match",
  aiRateLimit,
  resumeIdValidation,
  jobMatchValidation,
  validate,
  resumeController.matchResumeWithJobDescription
);

router.post(
  "/:id/cover-letter",
  aiRateLimit,
  resumeIdValidation,
  coverLetterValidation,
  validate,
  resumeController.generateCoverLetter
);

module.exports = router;