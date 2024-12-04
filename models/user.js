const { Schema, model, Types } = require("mongoose");
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
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "active",
    },
    posts: {
      type: [Types.ObjectId],
      ref: Post,
      default: [],
    },
  },
  { timestamps: true }
);

const User = model("user", userSchema);
module.exports = User;
