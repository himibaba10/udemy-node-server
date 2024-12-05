const AppError = require("../middlewares/errorHandler");
const User = require("../models/user");
const validateError = require("../utils/validateError");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.postSignup = (req, res, next) => {
  validateError(req);
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email })
    .then((user) => {
      if (user) throw new AppError("User already exists", 403);

      return bcrypt.hash(password, 12);
    })
    .then((hashedPassword) => {
      return User.create({ name, email, password: hashedPassword });
    })
    .then((result) => {
      res.status(201).json({
        success: true,
        message: "User created successfully",
        data: result,
        userId: result._id,
      });
    })
    .catch((err) => next(err));
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let fetchedUser;
  User.findOne({ email })
    .then((user) => {
      if (!user) throw new AppError("User not found", 404);
      fetchedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then((isEqual) => {
      if (!isEqual) throw new AppError("Invalid credentials", 401);
      const token = jwt.sign(
        { userId: fetchedUser._id.toString(), email: fetchedUser.email },
        "supersupersecretjwntoken",
        {
          expiresIn: "1h",
        }
      );
      res.json({
        token,
        userId: fetchedUser._id,
      });
    })
    .catch((err) => next(err));
};

exports.postLogout = (req, res, next) => {};
