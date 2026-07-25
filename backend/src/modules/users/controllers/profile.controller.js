const profileService = require("../services/profile.service");
const ProfileDTO = require("../dto/profile.dto");
const asyncHandler = require("../../../utils/asyncHandler");
const uploadImage = require("../../../utils/cloudinaryUpload");

class ProfileController {
  getProfile = asyncHandler(async (req, res) => {
    const user = await profileService.getProfile(req.user.id);

    res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      data: ProfileDTO.toResponse(user),
    });
  });

  updateProfile = asyncHandler(async (req, res) => {
    const updatedUser = await profileService.updateProfile(
      req.user.id,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: ProfileDTO.toResponse(updatedUser),
    });
  });

  updateAvatar = asyncHandler(async (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload an image",
      });
    }

    const uploadedImage = await uploadImage(
      req.file.buffer,
      "jobfusion/profile"
    );

    const updatedUser = await profileService.updateAvatar(
      req.user.id,
      uploadedImage.secure_url
    );

    res.status(200).json({
      success: true,
      message: "Avatar updated successfully",
      data: ProfileDTO.toResponse(updatedUser),
    });
  });
}

module.exports = new ProfileController();