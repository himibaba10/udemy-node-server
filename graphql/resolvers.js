const AppError = require("../middlewares/errorHandler");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const Post = require("../models/post");

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

const loginResolver = async (_, { email, password }) => {
  try {
    const user = await User.findOne({ email });
    if (!user) throw new AppError("User does not exist", 404);
    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) throw new AppError("Password does not match", 401);
    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email },
      "supersupersecretjwntoken",
      { expiresIn: "1h" }
    );

    return { token, userId: user._id.toString() };
  } catch ({ message, statusCode }) {
    throw new AppError(message || "Can't login user", statusCode || 500);
  }
};

const createPostResolver = async (
  _,
  { postInput },
  { isAuthenticated, userId }
) => {
  const errors = [];
  try {
    if (!isAuthenticated) throw new AppError("User is not authenticated", 401);

    const { title, content, imageUrl } = postInput;

    // Checking errors
    if (validator.isEmpty(title) || !validator.isLength(title, { min: 5 }))
      errors.push({ message: "Title is not valid" });

    if (validator.isEmpty(content) || !validator.isLength(content, { min: 5 }))
      errors.push({ message: "Content is not valid" });

    if (errors.length > 0) throw new AppError("Invalid input", 401);

    const user = await User.findById(userId);
    if (!user) throw new AppError("No user found", 404);

    const newPost = new Post({ title, content, imageUrl, creator: user });
    const createdPost = await newPost.save();

    user.posts.push(createdPost);
    await user.save();

    return {
      ...createdPost._doc,
      _id: createdPost._id.toString(),
      createdAt: createdPost.createdAt.toISOString(),
      updatedAt: createdPost.updatedAt.toISOString(),
    };
  } catch ({ message, statusCode }) {
    throw new AppError(message || "Can't create post", statusCode || 500);
  }
};

const postsResolver = async (_parent, { page = 1 }, { isAuthenticated }) => {
  if (!isAuthenticated) throw new AppError("User is not authenticated", 401);
  const perPage = 2;

  const posts = await Post.find()
    .sort({ createdAt: -1 })
    .skip((page - 1) * perPage)
    .limit(perPage)
    .populate("creator");
  const postCount = await Post.find().countDocuments();

  return {
    posts: posts.map((post) => ({
      ...post._doc,
      _id: post._id.toString(),
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    })),
    totalPosts: postCount,
  };
};

const postResolver = async (_parent, { postId }) => {
  const post = await Post.findById(postId).populate("creator");
  if (!post) throw new AppError("No post found", 404);
  // console.log(post.creator);
  return {
    ...post._doc,
    _id: post._id.toString(),
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
  };
};

const updatePostResolver = async (
  _parent,
  { postId, postInput },
  { isAuthenticated }
) => {
  if (!isAuthenticated) throw new AppError("User is not authenticated", 401);
  const post = await Post.findById(postId).populate("creator");
  post.title = postInput.title;
  post.content = postInput.content;
  if (postInput.imageUrl !== "undefined") {
    post.imageUrl = postInput.imageUrl;
  }
  await post.save();

  return {
    ...post._doc,
    _id: post._id.toString(),
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
  };
};

const deletePostResolver = async (
  _parent,
  { postId },
  { isAuthenticated, userId }
) => {
  if (!isAuthenticated) throw new AppError("User is not authenticated", 401);
  const post = await Post.findByIdAndDelete(postId);
  if (!post) throw new AppError("No post found", 404);

  const user = await User.findById(userId);
  user.posts.pull(postId);
  await user.save();

  return true;
};

module.exports = {
  createUserResolver,
  loginResolver,
  createPostResolver,
  postsResolver,
  postResolver,
  updatePostResolver,
  deletePostResolver,
};
