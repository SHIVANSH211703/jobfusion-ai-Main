const express = require("express");

const authMiddleware = require("../../../middlewares/auth.middleware");
const validate = require("../../../middlewares/validation.middleware");
const controller = require("../controllers/interview.controller");
const aiRateLimit = require("../../../middlewares/aiRateLimit.middleware");
const {
  interviewIdValidation,
  createInterviewValidation,
  updateInterviewValidation,
  prepareInterviewValidation,
} = require("../validators/interview.validator");

const router = express.Router();
router.use(authMiddleware);

router.get("/", controller.list);
router.post("/preparation", aiRateLimit, prepareInterviewValidation, validate, controller.prepare);
router.post("/", createInterviewValidation, validate, controller.create);
router.patch("/:id", [...interviewIdValidation, ...updateInterviewValidation], validate, controller.update);
router.delete("/:id", interviewIdValidation, validate, controller.delete);

module.exports = router;