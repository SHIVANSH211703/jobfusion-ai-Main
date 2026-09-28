const express = require("express");

const dashboardController = require("../controllers/dashboard.controller");
const authMiddleware = require("../../../middlewares/auth.middleware");

const router = express.Router();

router.get("/", authMiddleware, dashboardController.getDashboard);
router.get("/analytics", authMiddleware, dashboardController.getAnalytics);

module.exports = router;
