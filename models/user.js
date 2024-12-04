const { Schema, model, Types } = require("mongoose");
const { validateEmail } = require("../constants/validators");
const Post = require("./post");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      validate: [validateEmail, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    posts: {
      type: Types.ObjectId,
      ref: Post,
    },
  },
  { timestamps: true }
);

const User = model("user", userSchema);
module.exports = User;
