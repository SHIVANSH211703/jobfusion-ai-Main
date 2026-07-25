const profileRepository = require("../repositories/profile.repository");
const AppError = require("../../../utils/AppError");

class ProfileService {
  async getProfile(userId) {
    const user = await profileRepository.getProfileById(userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return user;
  }

  async updateProfile(userId, profileData) {
    const updatedUser = await profileRepository.updateProfile(
      userId,
      profileData
    );

    if (!updatedUser) {
      throw new AppError("User not found", 404);
    }

    return updatedUser;
  }

  async updateAvatar(userId, avatar) {
    const updatedUser = await profileRepository.updateAvatar(
      userId,
      avatar
    );

    if (!updatedUser) {
      throw new AppError("User not found", 404);
    }

    return updatedUser;
  }
}

module.exports = new ProfileService();