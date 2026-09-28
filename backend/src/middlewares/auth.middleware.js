const AppError = require("../utils/AppError");
const { verifyAccessToken } = require("../utils/jwt");
const userRepository = require("../modules/auth/repositories/user.repository");

const authMiddleware = async (req, res, next) => {
  const isLogoutRoute =
    req.path === "/logout" || req.originalUrl?.endsWith("/logout");

  try {
    let token;

    // 1. Bearer token
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // 2. accessToken cookie
    if (!token && req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      if (isLogoutRoute) {
        return next();
      }
      throw new AppError("Authentication required", 401);
    }

    const decoded = verifyAccessToken(token);

    const user = await userRepository.findById(decoded.id);

    if (!user) {
      if (isLogoutRoute) {
        return next();
      }
      throw new AppError("User not found", 404);
    }

    req.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    if (isLogoutRoute) {
      return next();
    }

    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError"
    ) {
      return next(
        new AppError("Invalid or expired access token", 401)
      );
    }

    next(error);
  }
};

module.exports = authMiddleware;