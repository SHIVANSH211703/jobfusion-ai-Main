const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    externalId: {
      type: String,
      required: true,
    },

    source: {
      type: String,
      required: true,
      enum: ["adzuna", "arbeitnow", "remotive", "jsearch"],
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    company: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      default: "Not specified",
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    salary: {
      min: {
        type: Number,
        default: null,
      },

      max: {
        type: Number,
        default: null,
      },

      currency: {
        type: String,
        default: "INR",
      },
    },

    jobType: {
      type: String,
      default: null,
    },

    skills: {
      type: [String],
      default: [],
    },

    postedAt: {
      type: Date,
      default: null,
    },

    applyUrl: {
      type: String,
      default: null,
    },

    isRemote: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);


// Prevent duplicate jobs
jobSchema.index(
  {
    externalId: 1,
    source: 1,
  },
  {
    unique: true,
  }
);


// Text search
jobSchema.index({
  title: "text",
  company: "text",
  description: "text",
});


const Job = mongoose.model("Job", jobSchema);

module.exports = Job;