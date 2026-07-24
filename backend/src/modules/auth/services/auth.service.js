const bcrypt = require("bcrypt");
const crypto = require("crypto");

const sendEmail = require("../../../utils/email");
const AppError = require("../../../utils/AppError");

const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../../../utils/jwt");

const userRepository = require("../repositories/user.repository");
const authDTO = require("../dto/auth.dto");

class AuthService {
  async register(userData) {
    const { name, email, password } = userData;

    const existingUser = await userRepository.findByEmail(email);

    if (existingUser) {
      throw new AppError("Email already exists", 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    const accessToken = generateAccessToken({
      id: user._id,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      id: user._id,
    });

    await userRepository.updateRefreshToken(user._id, refreshToken);

    return authDTO.authResponse(
      user,
      accessToken,
      refreshToken
    );
  }

  async login(email, password) {
    const user = await userRepository.findByEmail(email);

    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new AppError("Invalid email or password", 401);
    }

    const accessToken = generateAccessToken({
      id: user._id,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      id: user._id,
    });

    await userRepository.updateRefreshToken(user._id, refreshToken);

    return authDTO.authResponse(
      user,
      accessToken,
      refreshToken
    );
  }

  async getCurrentUser(userId) {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return authDTO.userResponse(user);
  }

  async refreshToken(refreshToken) {
    if (!refreshToken) {
      throw new AppError("Refresh token is required", 401);
    }

    const decoded = verifyRefreshToken(refreshToken);

    const user = await userRepository.findById(decoded.id);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const dbUser = await userRepository.findByEmail(user.email);

    if (
      !dbUser.refreshToken ||
      dbUser.refreshToken !== refreshToken
    ) {
      throw new AppError("Invalid refresh token", 401);
    }

    const newAccessToken = generateAccessToken({
      id: user._id,
      role: user.role,
    });

    const newRefreshToken = generateRefreshToken({
      id: user._id,
    });

    await userRepository.updateRefreshToken(
      user._id,
      newRefreshToken
    );

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(userId) {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    await userRepository.clearRefreshToken(userId);

    return {
      message: "Logout successful",
    };
  }

  async changePassword(
    userId,
    currentPassword,
    newPassword
  ) {
    const user =
      await userRepository.findByIdWithPassword(userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const isMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isMatch) {
      throw new AppError(
        "Current password is incorrect",
        400
      );
    }

    const isSamePassword = await bcrypt.compare(
      newPassword,
      user.password
    );

    if (isSamePassword) {
      throw new AppError(
        "New password cannot be the same as the current password",
        400
      );
    }

    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

    await userRepository.updatePassword(
      userId,
      hashedPassword
    );

    await userRepository.clearRefreshToken(userId);

    return {
      message:
        "Password changed successfully. Please login again.",
    };
  }

  async forgotPassword(email) {
    const user = await userRepository.findByEmail(email);

    if (!user) {
      return {
        message:
          "If an account with that email exists, a password reset link will be sent.",
      };
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const expires = new Date(Date.now() + 15 * 60 * 1000);

    await userRepository.updateResetToken(
      user._id,
      hashedToken,
      expires
    );

    const frontendUrl =
      process.env.FRONTEND_URL ||
      process.env.CLIENT_URL ||
      "http://localhost:3000";

    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;

    await sendEmail({
      to: user.email,
      subject: "Reset Your JobFusion AI Password",
      html: `
        <div style="font-family:Arial,sans-serif;padding:24px;max-width:600px;margin:auto">
          <h2 style="color:#7c3aed;">JobFusion AI</h2>

          <p>Hello <strong>${user.name}</strong>,</p>

          <p>We received a request to reset your password.</p>

          <p>
            Click the button below to choose a new password.
          </p>

          <div style="margin:30px 0">
            <a
              href="${resetUrl}"
              style="
                background:#7c3aed;
                color:white;
                padding:14px 28px;
                text-decoration:none;
                border-radius:8px;
                display:inline-block;
                font-weight:bold;
              "
            >
              Reset Password
            </a>
          </div>

          <p>
            This link will expire in <strong>15 minutes</strong>.
          </p>

          <p>
            If you didn't request this password reset,
            you can safely ignore this email.
          </p>

          <hr style="margin:30px 0">

          <small>
            © ${new Date().getFullYear()} JobFusion AI
          </small>
        </div>
      `,
    });

    return {
      message: "Password reset email sent successfully.",
      resetToken,
    };
  }

  async resetPassword(token, newPassword) {
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await userRepository.findByResetToken(
      hashedToken
    );

    if (!user) {
      throw new AppError(
        "Invalid or expired reset token",
        400
      );
    }

    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

    await userRepository.updatePassword(
      user._id,
      hashedPassword
    );

    await userRepository.clearResetToken(user._id);

    await userRepository.clearRefreshToken(user._id);

    return {
      message:
        "Password reset successful. Please login again.",
    };
  }
}

module.exports = new AuthService();