const express = require("express");

const authRoutes = require("../modules/auth/routes/auth.routes");
const profileRoutes = require("../modules/users/routes/profile.routes");
const resumeRoutes = require("../modules/resume/routes/resume.routes");
const resumeUploadRoutes = require("../modules/resume-upload/routes/resumeUpload.routes");
const jobRoutes = require("../modules/jobs/routes/job.routes");
const dashboardRoutes = require("../modules/dashboard/routes/dashboard.routes");
const interviewRoutes = require("../modules/interviews/routes/interview.routes");
const notificationRoutes = require("../modules/notifications/routes/notification.routes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/profile", profileRoutes);
router.use("/resume", resumeRoutes);
router.use("/resume-upload", resumeUploadRoutes);
router.use("/jobs", jobRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/interviews", interviewRoutes);
router.use("/notifications", notificationRoutes);

module.exports = router;