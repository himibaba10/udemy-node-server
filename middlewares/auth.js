const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  req.isAuthenticated = false;
  const token = req.get("Authorization")?.split(" ")[1];
  if (!token || token === "undefined") {
    req.isAuthenticated = false;
    return next();
  }

  const decodedUser = await jwt.verify(token, "supersupersecretjwntoken");
  if (!decodedUser) {
    req.isAuthenticated = false;
    return next();
  }

  req.userId = decodedUser.userId;
  req.isAuthenticated = true;
  next();
};

module.exports = auth;
