const path = require("path");
const fs = require("fs");

const clearImage = (filepath) => {
  const file = path.join(process.cwd(), filepath);
  fs.unlink(file, (err) => console.log(err));
};

module.exports = clearImage;
