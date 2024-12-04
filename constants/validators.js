const { body } = require("express-validator");

const validatePost = [
  body("title").trim().isLength({ min: 5 }),
  body("content").trim().isLength({ min: 5 }),
];

var validateSignupUser = [
  body("name")
    .trim()
    .isLength({ min: 5, max: 40 })
    .withMessage("Username must be at least 5 characters"),
  body("email")
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage("Email must be valid"),
  body("password")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Password must be at least 5 characters"),
];

module.exports = { validateSignupUser, validatePost };
