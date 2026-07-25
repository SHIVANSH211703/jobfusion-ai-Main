const express = require("express");

const authRoutes = require("../modules/auth/routes/auth.routes");
const profileRoutes = require("../modules/users/routes/profile.routes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/profile", profileRoutes);

module.exports = router;