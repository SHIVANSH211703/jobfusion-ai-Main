const asyncHandler = require("../../../utils/asyncHandler");
const authService = require("../services/auth.service");

class AuthController {
  register = asyncHandler(async (req, res) => {
    const result = await authService.register(req.body);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result,
    });
  });

  login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const result = await authService.login(email, password);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
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
    const { refreshToken } = req.body;

    const result = await authService.refreshToken(refreshToken);

    res.status(200).json({
      success: true,
      message: "Access token refreshed successfully",
      data: result,
    });
  });  
    logout = asyncHandler(async (req, res) => {
    const result = await authService.logout(req.user.id);

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
      ...(result.resetToken && {
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

    res.status(200).json({
      success: true,
      message: result.message,
    });
  });
}

module.exports = new AuthController();