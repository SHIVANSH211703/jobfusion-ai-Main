const { validationResult } = require("express-validator");
const AppError = require("../utils/AppError");

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  const formattedErrors = errors.array().map((error) => ({
    field: error.path || error.param,
    message: error.msg,
    value: error.value,
  }));

  return next(
    new AppError(
      "Validation Error",
      400,
      formattedErrors
    )
  );
};

module.exports = validate;