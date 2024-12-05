const path = require("path");
const fs = require("fs");
const AppError = require("../middlewares/errorHandler");

const clearImage = (filepath) => {
  const file = path.join(process.cwd(), filepath);
  fs.unlink(file, (err) => {
    if (err) throw new AppError("Could not remove image", 400);
  });
};

module.exports = clearImage;
