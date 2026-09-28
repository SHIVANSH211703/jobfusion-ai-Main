const express = require("express");

const authMiddleware = require("../../../middlewares/auth.middleware");
const validate = require("../../../middlewares/validation.middleware");
const controller = require("../controllers/notification.controller");
const { notificationIdValidation } = require("../validators/notification.validator");

const router = express.Router();
router.use(authMiddleware);
router.get("/", controller.list);
router.patch("/read-all", controller.markAllRead);
router.patch("/:id/read", notificationIdValidation, validate, controller.markRead);

module.exports = router;