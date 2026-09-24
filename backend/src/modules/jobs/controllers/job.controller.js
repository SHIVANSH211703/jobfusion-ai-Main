const jobService = require("../services/job.service");
const asyncHandler = require("../../../utils/asyncHandler");

// ======================================================
// GET USER ID
// ======================================================

const getUserId = (req) => {
  return req.user?.id;
};

// ======================================================
// GET ALL JOBS
// ======================================================

const getJobs = asyncHandler(
  async (req, res) => {
    const {
      page = 1,
      limit = 20,
      search = "",
      location = "",
      remote,
      minSalary,
      maxSalary,
      jobType = "",
      days,
    } = req.query;

    const result =
      await jobService.getJobs({
        page: Number(page),
        limit: Number(limit),
        search,
        location,
        remote,
        minSalary,
        maxSalary,
        jobType,
        days,
      });

    res.status(200).json({
      success: true,
      message:
        "Jobs retrieved successfully",
      data: result,
    });
  }
);

// ======================================================
// SEARCH ADZUNA
// ======================================================

const searchJobs = asyncHandler(
  async (req, res) => {
    const {
      page = 1,
      what = "",
      where = "",
      resultsPerPage = 20,
    } = req.query;

    const result =
      await jobService.searchJobs({
        page: Number(page),
        what,
        where,
        resultsPerPage:
          Number(resultsPerPage),
      });

    res.status(200).json({
      success: true,
      message:
        "Jobs fetched successfully",
      data: result,
    });
  }
);

// ======================================================
// GET JOB BY ID
// ======================================================

const getJobById = asyncHandler(
  async (req, res) => {
    const { id } = req.params;

    const result =
      await jobService.getJobById(id);

    res.status(200).json({
      success: true,
      message:
        "Job retrieved successfully",
      data: result,
    });
  }
);

// ======================================================
// SAVE JOB
// ======================================================

const saveJob = asyncHandler(
  async (req, res) => {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required",
      });
    }

    const { id } = req.params;

    const result =
      await jobService.saveJob(
        userId,
        id
      );

    res.status(200).json({
      success: true,
      message:
        "Job saved successfully",
      data: result,
    });
  }
);

// ======================================================
// UNSAVE JOB
// ======================================================

const unsaveJob = asyncHandler(
  async (req, res) => {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required",
      });
    }

    const { id } = req.params;

    const result =
      await jobService.unsaveJob(
        userId,
        id
      );

    res.status(200).json({
      success: true,
      message:
        "Job removed from saved jobs",
      data: result,
    });
  }
);

// ======================================================
// GET SAVED JOBS
// ======================================================

const getSavedJobs = asyncHandler(
  async (req, res) => {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required",
      });
    }

    const {
      page = 1,
      limit = 20,
    } = req.query;

    const result =
      await jobService.getSavedJobs(
        userId,
        Number(page),
        Number(limit)
      );

    res.status(200).json({
      success: true,
      message:
        "Saved jobs retrieved successfully",
      data: result,
    });
  }
);

// ======================================================
// APPLY TO JOB
// ======================================================

const applyToJob = asyncHandler(
  async (req, res) => {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const { id } = req.params;

    const {
      resumeId,
      notes,
    } = req.body;

    if (!resumeId) {
      return res.status(400).json({
        success: false,
        message: "resumeId is required",
      });
    }

    const result =
      await jobService.applyToJob(
        userId,
        id,
        resumeId,
        notes
      );

    res.status(200).json({
      success: true,
      message:
        "Job application submitted successfully",
      data: result,
    });
  }
);

// ======================================================
// GET APPLICATIONS
// ======================================================

const getApplications =
  asyncHandler(async (req, res) => {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required",
      });
    }

    const {
      page = 1,
      limit = 20,
    } = req.query;

    const result =
      await jobService.getApplications(
        userId,
        Number(page),
        Number(limit)
      );

    res.status(200).json({
      success: true,
      message:
        "Applications retrieved successfully",
      data: result,
    });
  });

// ======================================================
// GET APPLICATION
// ======================================================

const getApplication =
  asyncHandler(async (req, res) => {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required",
      });
    }

    const { id } = req.params;

    const result =
      await jobService.getApplication(
        userId,
        id
      );

    res.status(200).json({
      success: true,
      message:
        "Application retrieved successfully",
      data: result,
    });
  });

// ======================================================
// UPDATE APPLICATION STATUS
// ======================================================

const updateApplicationStatus =
  asyncHandler(async (req, res) => {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required",
      });
    }

    const { id } = req.params;

    const {
      status,
      notes,
    } = req.body;

    const result =
      await jobService.updateApplicationStatus(
        userId,
        id,
        status,
        notes
      );

    res.status(200).json({
      success: true,
      message:
        "Application status updated successfully",
      data: result,
    });
  });

// ======================================================
// AI JOB MATCH
// ======================================================

const matchJob = asyncHandler(
  async (req, res) => {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required",
      });
    }

    const { id } = req.params;

    const { resumeId } =
      req.body;

    if (!resumeId) {
      return res.status(400).json({
        success: false,
        message:
          "resumeId is required",
      });
    }

    const result =
      await jobService.matchJobWithResume({
        resumeId,
        jobId: id,
        userId,
      });

    res.status(200).json({
      success: true,
      message:
        "AI job match calculated successfully",
      data: result,
    });
  }
);

// ======================================================
// EXPORT
// ======================================================

module.exports = {
  getJobs,
  searchJobs,
  getJobById,
  saveJob,
  unsaveJob,
  getSavedJobs,
  applyToJob,
  getApplications,
  getApplication,
  updateApplicationStatus,
  matchJob,
};