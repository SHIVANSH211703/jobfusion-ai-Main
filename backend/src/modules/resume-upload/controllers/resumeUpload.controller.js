const asyncHandler = require("../../../utils/asyncHandler");

const resumeUploadService = require("../services/resumeUpload.service");
const ResumeUploadDTO = require("../dto/resumeUpload.dto");

class ResumeUploadController {
  uploadResume = asyncHandler(async (req, res) => {
    const result = await resumeUploadService.uploadResume(
      req.file,
      req.user.id
    );

    res.status(201).json({
      success: true,
      message: "Resume uploaded successfully.",
      data: {
        uploadId: result.uploadId,
        resumeId: result.resumeId,
      },
    });
  });

  getUploads = asyncHandler(async (req, res) => {
    const uploads =
      await resumeUploadService.getUploadsByUser(req.user.id);

    res.status(200).json({
      success: true,
      data: ResumeUploadDTO.responseList(uploads),
    });
  });

  getUpload = asyncHandler(async (req, res) => {
    const upload =
      await resumeUploadService.getUploadById(req.params.id);

    res.status(200).json({
      success: true,
      data: ResumeUploadDTO.response(upload),
    });
  });

  deleteUpload = asyncHandler(async (req, res) => {
    const result =
      await resumeUploadService.deleteUpload(req.params.id);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  });
}

module.exports = new ResumeUploadController();