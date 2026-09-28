const mongoose = require("mongoose");

const savedSearchSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true, trim: true, maxlength: 80 },
    filters: {
      search: { type: String, trim: true, default: "" },
      location: { type: String, trim: true, default: "" },
      remote: { type: Boolean, default: null },
      minSalary: { type: Number, min: 0, default: null },
      maxSalary: { type: Number, min: 0, default: null },
      jobType: { type: String, trim: true, default: "" },
      days: { type: Number, min: 1, max: 365, default: null },
      sort: { type: String, enum: ["newest", "salary_high", "salary_low"], default: "newest" },
    },
    enabled: { type: Boolean, default: true },
  },
  { timestamps: true }
);

savedSearchSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("SavedSearch", savedSearchSchema);