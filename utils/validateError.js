const { validationResult } = require("express-validator");
const AppError = require("../middlewares/errorHandler");

const validateError = (req) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new AppError("Validation failed!", 422);
  }
};

module.exports = validateError;
