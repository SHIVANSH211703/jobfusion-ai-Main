const mongoose = require("mongoose");

const resumeVersionCounterSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Resume",
  },
  sequence: {
    type: Number,
    required: true,
    default: 0,
  },
});

module.exports = mongoose.model("ResumeVersionCounter", resumeVersionCounterSchema);