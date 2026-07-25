const User = require("../../auth/models/user.model");

class ProfileRepository {
  async getProfileById(userId) {
    return await User.findById(userId).select("-password -refreshToken");
  }

  async updateProfile(userId, profileData) {
    return await User.findByIdAndUpdate(userId, profileData, {
      new: true,
      runValidators: true,
    }).select("-password -refreshToken");
  }

  async updateAvatar(userId, avatar) {
    return await User.findByIdAndUpdate(
      userId,
      { avatar },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password -refreshToken");
  }
}

module.exports = new ProfileRepository();