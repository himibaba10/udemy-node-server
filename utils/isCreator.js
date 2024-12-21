const AppError = require("../middlewares/errorHandler");

const isCreator = (creatorId, currentUserId) => {
  if (creatorId !== currentUserId) throw new AppError("Not authorized", 401);
};

module.exports = isCreator;
