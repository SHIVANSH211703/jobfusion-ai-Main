const AppError = require("../utils/AppError");
const { verifyAccessToken } = require("../utils/jwt");
const userRepository = require("../modules/auth/repositories/user.repository");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new AppError("Authorization header is required", 401);
    }

    if (!authHeader.startsWith("Bearer ")) {
      throw new AppError("Invalid authorization format", 401);
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      throw new AppError("Access token is required", 401);
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
      return next(new AppError("Invalid or expired access token", 401));
    }

    next(error);
  }
};

module.exports = authMiddleware;