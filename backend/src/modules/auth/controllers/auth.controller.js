const asyncHandler = require("../../../utils/asyncHandler");
const authService = require("../services/auth.service");

const {
  setAuthCookies,
  clearAuthCookies,
} = require("../../../utils/cookies");

class AuthController {
  register = asyncHandler(async (req, res) => {
    const result = await authService.register(req.body);

    setAuthCookies(
      res,
      result.tokens.accessToken,
      result.tokens.refreshToken
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: result.user,
        accessToken: result.tokens.accessToken,
      },
    });
  });

  login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const result = await authService.login(email, password);

    setAuthCookies(
      res,
      result.tokens.accessToken,
      result.tokens.refreshToken
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: result.user,
        accessToken: result.tokens.accessToken,
      },
    });
  });

  me = asyncHandler(async (req, res) => {
    const result = await authService.getCurrentUser(req.user.id);

    res.status(200).json({
      success: true,
      data: result,
    });
  });

  refreshToken = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

    const result = await authService.refreshToken(refreshToken);

    setAuthCookies(
      res,
      result.accessToken,
      result.refreshToken
    );

    res.status(200).json({
      success: true,
      message: "Access token refreshed successfully",
      data: {
        accessToken: result.accessToken,
      },
    });
  });

  logout = asyncHandler(async (req, res) => {
    let userId = req.user?.id;

    if (!userId && req.cookies?.refreshToken) {
      try {
        const { verifyRefreshToken } = require("../../../utils/jwt");
        const decoded = verifyRefreshToken(req.cookies.refreshToken);
        userId = decoded?.id;
      } catch (_) {
        // safely ignore invalid or expired refresh token
      }
    }

    if (userId) {
      try {
        await authService.logout(userId);
      } catch (_) {
        // safely ignore if session was already removed
      }
    }

    clearAuthCookies(res);

    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  });

  changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    const result = await authService.changePassword(
      req.user.id,
      currentPassword,
      newPassword
    );

    clearAuthCookies(res);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  });

  forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    const result = await authService.forgotPassword(email);

    res.status(200).json({
      success: true,
      message: result.message,
      ...(process.env.NODE_ENV !== "production" &&
        result.resetToken && {
          data: {
            resetToken: result.resetToken,
          },
        }),
    });
  });

  resetPassword = asyncHandler(async (req, res) => {
    const { token, newPassword } = req.body;

    const result = await authService.resetPassword(
      token,
      newPassword
    );

    clearAuthCookies(res);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  });

  sendVerificationEmail = asyncHandler(async (req, res) => {
    const result = await authService.sendVerificationEmail(req.user.id);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  });

  verifyEmail = asyncHandler(async (req, res) => {
    const result = await authService.verifyEmail(req.query.token);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  });
}

module.exports = new AuthController();