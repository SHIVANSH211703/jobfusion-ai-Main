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
    const refreshToken = req.cookies.refreshToken;

    const result = await authService.refreshToken(refreshToken);

    setAuthCookies(
      res,
      result.accessToken,
      result.refreshToken
    );

    res.status(200).json({
      success: true,
      message: "Access token refreshed successfully",
    });
  });

  logout = asyncHandler(async (req, res) => {
    const result = await authService.logout(req.user.id);

    clearAuthCookies(res);

    res.status(200).json({
      success: true,
      message: result.message,
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
}

module.exports = new AuthController();