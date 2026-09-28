const mongoose = require("mongoose");
const { APPLICATION_STATUSES } = require("../applicationStatus");

const statusHistorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: APPLICATION_STATUSES,
      required: true,
    },
    changedAt: {
      type: Date,
      default: Date.now,
    },
    note: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { _id: false }
);

const applicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    resumeId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Resume",
  required: true,
},

    status: {
      type: String,
      enum: APPLICATION_STATUSES,
      default: "applied",
    },

    statusHistory: {
      type: [statusHistorySchema],
      default: [],
    },

    appliedAt: {
      type: Date,
      default: Date.now,
    },

    notes: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

applicationSchema.index(
  {
    userId: 1,
    jobId: 1,
  },
  {
    unique: true,
  }
);

const Application = mongoose.model(
  "Application",
  applicationSchema
);

module.exports = Application;