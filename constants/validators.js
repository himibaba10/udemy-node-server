const { body } = require("express-validator");

const validatePost = [
  body("title").trim().isLength({ min: 5 }),
  body("content").trim().isLength({ min: 5 }),
];

var validateEmail = function (email) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

module.exports = { validateEmail, validatePost };
