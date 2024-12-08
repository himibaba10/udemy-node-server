const AppError = require("../middlewares/errorHandler");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

const createUserResolver = async (_, { userInput }) => {
  try {
    const { email, name, password } = userInput;
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new AppError("User already exists", 403);

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({ email, name, password: hashedPassword });
    const createdUser = await newUser.save();

    return { ...createdUser._doc, _id: createdUser._id.toString() };
  } catch (error) {
    throw new AppError(error.message, 500);
  }
};

module.exports = { createUserResolver };
