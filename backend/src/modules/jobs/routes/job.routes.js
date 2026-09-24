const express = require("express");

const jobController = require("../controllers/job.controller");
const authMiddleware = require("../../../middlewares/auth.middleware");

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

// ==================== AI MATCH ====================

router.post(
  "/:id/match",
  authMiddleware,
  jobController.matchJob
);

module.exports = router;