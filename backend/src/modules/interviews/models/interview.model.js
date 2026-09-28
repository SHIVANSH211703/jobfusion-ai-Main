const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true,
      index: true,
    },
    round: {
      type: String,
      enum: ["technical", "hr", "managerial", "behavioral", "other"],
      required: true,
    },
    type: {
      type: String,
      enum: ["phone", "video", "onsite", "other"],
      required: true,
    },
    scheduledAt: { type: Date, required: true, index: true },
    interviewer: { type: String, trim: true, maxlength: 160, default: "" },
    meetingLink: { type: String, trim: true, maxlength: 500, default: "" },
    notes: { type: String, trim: true, maxlength: 5000, default: "" },
    status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled"],
      default: "scheduled",
    },
    feedback: { type: String, trim: true, maxlength: 5000, default: "" },
  },
  { timestamps: true }
);

interviewSchema.index({ userId: 1, scheduledAt: 1, status: 1 });

module.exports = mongoose.model("Interview", interviewSchema);