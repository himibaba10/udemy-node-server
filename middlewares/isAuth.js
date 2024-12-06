const jwt = require("jsonwebtoken");
const AppError = require("./errorHandler");

const isAuth = (req, res, next) => {
  try {
    const token = req.get("Authorization")?.split(" ")[1];
    const decodedUser = jwt.verify(token, "supersupersecretjwntoken");
    if (!decodedUser) throw new AppError("Invalid authorization", 401);

    req.userId = decodedUser.userId;
    next();
  } catch (err) {
    err.statusCode = 401;
    next(err);
  }
};

module.exports = isAuth;
