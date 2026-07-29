const mongoose = require("mongoose");

const personalInfoSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      default: "",
      trim: true,
    },

    email: {
      type: String,
      default: "",
      trim: true,
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    location: {
      type: String,
      default: "",
      trim: true,
    },

    linkedin: {
      type: String,
      default: "",
      trim: true,
    },

    github: {
      type: String,
      default: "",
      trim: true,
    },

    portfolio: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { _id: false }
);

const educationSchema = new mongoose.Schema(
  {
    institution: {
      type: String,
      default: "",
    },

    degree: {
      type: String,
      default: "",
    },

    fieldOfStudy: {
      type: String,
      default: "",
    },

    startDate: Date,

    endDate: Date,

    currentlyStudying: {
      type: Boolean,
      default: false,
    },

    grade: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },
  },
  { _id: true }
);

const experienceSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      default: "",
    },

    position: {
      type: String,
      default: "",
    },

    location: {
      type: String,
      default: "",
    },

    startDate: Date,

    endDate: Date,

    currentlyWorking: {
      type: Boolean,
      default: false,
    },

    description: {
      type: String,
      default: "",
    },
  },
  { _id: true }
);

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

    technologies: {
      type: [String],
      default: [],
    },

    github: {
      type: String,
      default: "",
    },

    liveDemo: {
      type: String,
      default: "",
    },
  },
  { _id: true }
);

const certificationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "",
    },

    issuer: {
      type: String,
      default: "",
    },

    issueDate: Date,

    credentialId: {
      type: String,
      default: "",
    },

    credentialUrl: {
      type: String,
      default: "",
    },
  },
  { _id: true }
);

const languageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "",
    },

    proficiency: {
      type: String,
      enum: [
        "Beginner",
        "Intermediate",
        "Advanced",
        "Native",
      ],
      default: "Beginner",
    },
  },
  { _id: true }
);

const achievementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },
  },
  { _id: true }
);

const customSectionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "",
    },

    items: {
      type: [String],
      default: [],
    },
  },
  { _id: true }
);

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      default: "My Resume",
    },

    template: {
      type: String,
      default: "modern",
    },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },

    isDefault: {
      type: Boolean,
      default: false,
    },

    isPublic: {
      type: Boolean,
      default: false,
    },

    publicSlug: {
      type: String,
      default: "",
    },

    atsScore: {
  type: Number,
  default: 0,
},

aiSummary: {
  type: String,
  default: "",
},

atsAnalysis: {
  strengths: {
    type: [String],
    default: [],
  },

  weaknesses: {
    type: [String],
    default: [],
  },

  recommendations: {
    type: [String],
    default: [],
  },

  analyzedAt: {
    type: Date,
    default: null,
  },
},
   
    personalInfo: {
      type: personalInfoSchema,
      default: () => ({}),
    },

    summary: {
      type: String,
      default: "",
    },

    education: {
      type: [educationSchema],
      default: [],
    },

    experience: {
      type: [experienceSchema],
      default: [],
    },

    projects: {
      type: [projectSchema],
      default: [],
    },

    skills: {
      type: [String],
      default: [],
    },

    certifications: {
      type: [certificationSchema],
      default: [],
    },

    languages: {
      type: [languageSchema],
      default: [],
    },

    achievements: {
      type: [achievementSchema],
      default: [],
    },

    customSections: {
      type: [customSectionSchema],
      default: [],
    },

    metadata: {
      views: {
        type: Number,
        default: 0,
      },

      downloads: {
        type: Number,
        default: 0,
      },

      lastExportedAt: {
        type: Date,
        default: null,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Resume", resumeSchema);