const express = require("express");

const authController = require("../controllers/auth");
const { validateSignupUser } = require("../constants/validators");

const router = express.Router();

router.post("/signup", validateSignupUser, authController.postSignup);

module.exports = router;
