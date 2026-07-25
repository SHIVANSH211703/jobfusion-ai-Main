const AppError = require("../utils/AppError");
const { verifyAccessToken } = require("../utils/jwt");
const userRepository = require("../modules/auth/repositories/user.repository");

const authMiddleware = async (req, res, next) => {
  try {
    let token = req.cookies?.accessToken;

    // If no cookie, try Authorization header
    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;

      if (authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }
    }

    if (!token) {
      throw new AppError("Authentication required", 401);
    }

    const decoded = verifyAccessToken(token);

    const user = await userRepository.findById(decoded.id);

    if (!user) {
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