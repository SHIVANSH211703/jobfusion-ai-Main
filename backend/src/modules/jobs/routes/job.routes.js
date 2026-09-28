const express = require("express");

const jobController = require("../controllers/job.controller");
const authMiddleware = require("../../../middlewares/auth.middleware");
const aiRateLimit = require("../../../middlewares/aiRateLimit.middleware");
const validate = require("../../../middlewares/validation.middleware");
const {
  savedSearchIdValidation,
  createSavedSearchValidation,
  updateSavedSearchValidation,
} = require("../validators/savedSearch.validator");

const router = express.Router();

// ==================== PUBLIC ====================

router.get(
  "/",
  jobController.getJobs
);

router.get(
  "/search",
  jobController.searchJobs
);

// ==================== PROTECTED COLLECTION ====================

router.get(
  "/saved",
  authMiddleware,
  jobController.getSavedJobs
);

router.get(
  "/applied",
  authMiddleware,
  jobController.getApplications
);

router.get("/saved-searches", authMiddleware, jobController.getSavedSearches);
router.post("/saved-searches", authMiddleware, createSavedSearchValidation, validate, jobController.createSavedSearch);
router.patch("/saved-searches/:id", authMiddleware, [...savedSearchIdValidation, ...updateSavedSearchValidation], validate, jobController.updateSavedSearch);
router.delete("/saved-searches/:id", authMiddleware, savedSearchIdValidation, validate, jobController.deleteSavedSearch);

// ==================== SINGLE JOB ====================

router.get(
  "/:id",
  jobController.getJobById
);

// ==================== JOB ACTIONS ====================

router.post(
  "/:id/save",
  authMiddleware,
  jobController.saveJob
);

router.delete(
  "/:id/save",
  authMiddleware,
  jobController.unsaveJob
);

router.post(
  "/:id/apply",
  authMiddleware,
  jobController.applyToJob
);

router.get(
  "/:id/application",
  authMiddleware,
  jobController.getApplication
);

router.patch(
  "/:id/application",
  authMiddleware,
  jobController.updateApplicationStatus
);

router.delete(
  "/:id/application",
  authMiddleware,
  jobController.deleteApplication
);

// ==================== AI MATCH ====================

router.post(
  "/:id/match",
  authMiddleware,
  aiRateLimit,
  jobController.matchJob
);

module.exports = router;