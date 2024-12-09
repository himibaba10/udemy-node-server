const AppError = require("../middlewares/errorHandler");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const createUserResolver = async (_, { userInput }) => {
  const errors = [];
  try {
    const { email, name, password } = userInput;

    // Checking errors
    if (!validator.isEmail(email))
      errors.push({ message: "Email is not valid" });
    if (
      validator.isEmpty(password) ||
      !validator.isLength(password, { min: 5 })
    )
      errors.push({ message: "Password must be at least 5 characters" });

    if (errors.length > 0) {
      throw new Error("Invalid input");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) throw new AppError("User already exists", 403);

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({ email, name, password: hashedPassword });
    const createdUser = await newUser.save();

    return { ...createdUser._doc, _id: createdUser._id.toString() };
  } catch (err) {
    const error = new Error(err.message);
    if (errors.length > 0) {
      error.data = errors;
      error.statusCode = 400;
    }
    throw error;
  }
};

module.exports = { createUserResolver };
