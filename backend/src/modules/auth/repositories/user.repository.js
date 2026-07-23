const User = require("../models/user.model");

class UserRepository {
  async create(userData) {
    return await User.create(userData);
  }

  async findByEmail(email) {
    return await User.findOne({ email }).select("+password +refreshToken");
  }

  async findById(id) {
    return await User.findById(id);
  }

  async findByIdWithPassword(id) {
    return await User.findById(id).select("+password");
  }

  async updateRefreshToken(userId, refreshToken) {
    return await User.findByIdAndUpdate(
      userId,
      { refreshToken },
      {
        returnDocument: "after",
      }
    ).select("+refreshToken");
  }

  async clearRefreshToken(userId) {
    return await User.findByIdAndUpdate(
      userId,
      {
        refreshToken: null,
      },
      {
        returnDocument: "after",
      }
    );
  }

  async updatePassword(userId, password) {
    return await User.findByIdAndUpdate(
      userId,
      {
        password,
      },
      {
        returnDocument: "after",
      }
    );
  }

  async updateResetToken(userId, token, expires) {
    return await User.findByIdAndUpdate(
      userId,
      {
        passwordResetToken: token,
        passwordResetExpires: expires,
      },
      {
        returnDocument: "after",
      }
    );
  }

  async findByResetToken(token) {
    return await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: {
        $gt: new Date(),
      },
    }).select("+passwordResetToken +passwordResetExpires +password");
  }

  async clearResetToken(userId) {
    return await User.findByIdAndUpdate(
      userId,
      {
        passwordResetToken: null,
        passwordResetExpires: null,
      },
      {
        returnDocument: "after",
      }
    );
  }
}

module.exports = new UserRepository();