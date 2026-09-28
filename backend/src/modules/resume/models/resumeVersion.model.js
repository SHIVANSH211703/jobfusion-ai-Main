const mongoose = require("mongoose");

const resumeVersionSchema = new mongoose.Schema(
  {
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    versionNumber: {
      type: Number,
      required: true,
      min: 1,
    },
    source: {
      type: String,
      enum: ["created", "upload", "manual", "ai_improvement", "checkpoint", "restore"],
      required: true,
    },
    content: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    changes: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

resumeVersionSchema.index({ resumeId: 1, versionNumber: 1 }, { unique: true });
resumeVersionSchema.index({ userId: 1, resumeId: 1, createdAt: -1 });

module.exports = mongoose.model("ResumeVersion", resumeVersionSchema);