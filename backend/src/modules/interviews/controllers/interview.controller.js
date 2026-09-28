const asyncHandler = require("../../../utils/asyncHandler");
const interviewService = require("../services/interview.service");

class InterviewController {
  list = asyncHandler(async (req, res) => {
    const interviews = await interviewService.list(req.user.id);
    res.status(200).json({ success: true, data: interviews });
  });

  create = asyncHandler(async (req, res) => {
    const interview = await interviewService.create(req.user.id, req.body);
    res.status(201).json({ success: true, data: interview });
  });

  prepare = asyncHandler(async (req, res) => {
    const preparation = await interviewService.prepare(req.user.id, req.body.applicationId);
    res.status(200).json({ success: true, data: preparation });
  });

  update = asyncHandler(async (req, res) => {
    const interview = await interviewService.update(req.user.id, req.params.id, req.body);
    res.status(200).json({ success: true, data: interview });
  });

  delete = asyncHandler(async (req, res) => {
    const result = await interviewService.delete(req.user.id, req.params.id);
    res.status(200).json({ success: true, message: result.message });
  });
}

module.exports = new InterviewController();