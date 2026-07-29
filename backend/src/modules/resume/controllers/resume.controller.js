const asyncHandler = require("../../../utils/asyncHandler");

const resumeService = require("../services/resume.service");
const resumeDTO = require("../dto/resume.dto");

class ResumeController {
  createResume = asyncHandler(async (req, res) => {
    const resume = await resumeService.createResume(
      req.user.id,
      req.body
    );

    res.status(201).json({
      success: true,
      message: "Resume created successfully",
      data: resumeDTO.resumeResponse(resume),
    });
  });

  getUserResumes = asyncHandler(async (req, res) => {
    const resumes = await resumeService.getUserResumes(
      req.user.id
    );

    res.status(200).json({
      success: true,
      data: resumeDTO.resumeList(resumes),
    });
  });

  getResumeById = asyncHandler(async (req, res) => {
    const resume = await resumeService.getResumeById(
      req.user.id,
      req.params.id
    );

    res.status(200).json({
      success: true,
      data: resumeDTO.resumeResponse(resume),
    });
  });

  updateResume = asyncHandler(async (req, res) => {
    const resume = await resumeService.updateResume(
      req.user.id,
      req.params.id,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Resume updated successfully",
      data: resumeDTO.resumeResponse(resume),
    });
  });

  deleteResume = asyncHandler(async (req, res) => {
    const result = await resumeService.deleteResume(
      req.user.id,
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: result.message,
    });
  });

  getPublicResume = asyncHandler(async (req, res) => {
    const resume = await resumeService.getPublicResume(
      req.params.slug
    );

    res.status(200).json({
      success: true,
      data: resumeDTO.resumeResponse(resume),
    });
  });

  /**
   * Analyze Resume using AI
   * POST /api/v1/resume/:id/analyze
   */
  analyzeResume = asyncHandler(async (req, res) => {
    const result = await resumeService.analyzeResume(
      req.user.id,
      req.params.id
    );

    res.status(200).json(result);
  });

/**
 * Improve Resume using AI
 * POST /api/v1/resume/:id/improve
 */
improveResume = asyncHandler(async (req, res) => {
  const result = await resumeService.improveResume(
    req.user.id,
    req.params.id
  );

  res.status(200).json(result);
});  
}

module.exports = new ResumeController();