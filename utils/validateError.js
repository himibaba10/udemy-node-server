const { validationResult } = require("express-validator");
const AppError = require("../middlewares/errorHandler");

const validateError = (req) => {
  const errors = validationResult(req);
  const errorMessage = errors
    .array()
    .map((err) => err.msg)
    .join(", ");

  if (!errors.isEmpty()) {
    throw new AppError(errorMessage, 422);
  }
};

module.exports = validateError;
