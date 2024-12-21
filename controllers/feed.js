const Post = require("../models/post");
const AppError = require("../middlewares/errorHandler");
const validateError = require("../utils/validateError");
const clearImage = require("../utils/clearImage");
const User = require("../models/user");
const isCreator = require("../utils/isCreator");
const { getIO } = require("../socket");

exports.getPosts = (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 2;
  let totalItems;
  Post.find()
    .countDocuments()
    .then((count) => {
      totalItems = count;
      return Post.find()
        .sort({ createdAt: -1 })
        .populate("creator")
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    })
    .then((posts) => {
      res.status(200).json({
        message: "Fetch posts successfully",
        posts,
        totalItems,
      });
    })
    .catch((err) => next(err));
};

exports.createPost = (req, res, next) => {
  validateError(req);

  const title = req.body.title;
  const content = req.body.content;
  const imageUrl = req.file.path.replace(/\\/g, "/");

  let createdPost;
  let creator;
  // Create post in db
  Post.create({
    title: title,
    content: content,
    creator: req.userId,
    imageUrl,
  })
    .then((result) => {
      createdPost = result;
      return User.findById(req.userId);
    })
    .then((user) => {
      creator = user;
      user.posts.push(createdPost);
      return user.save();
    })
    .then(() => {
      getIO().emit("posts", {
        action: "create",
        post: {
          ...createdPost._doc,
          creator: { _id: creator._id, name: creator.name },
        },
      });
      res.status(201).send({
        success: true,
        message: "Post created successfully",
        post: createdPost,
        creator: { _id: creator._id, name: creator.name },
      });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getPost = (req, res, next) => {
  Post.findById(req.params.postId)
    .then((post) => {
      if (!post) throw new AppError("No post found with that ID", 404);

      res.status(200).json({
        message: "Post was successfully retrieved",
        post,
      });
    })
    .catch((err) => next(err));
};

exports.updatePost = (req, res, next) => {
  validateError(req);
  const postId = req.params.postId;
  const title = req.body.title;
  const content = req.body.content;
  const imageUrl = req.file
    ? req.file.path.replace(/\\/g, "/")
    : req.body.image;

  if (!imageUrl) throw new AppError("Please provide an image", 400);

  Post.findById(postId)
    .populate("creator")
    .then((post) => {
      if (!post) throw new AppError("No post found with that ID", 404);

      isCreator(post.creator._id.toString(), req.userId);
      if (post.imageUrl !== imageUrl) clearImage(post.imageUrl);
      post.title = title;
      post.content = content;
      post.imageUrl = imageUrl;

      return post.save();
    })
    .then((result) => {
      getIO().emit("posts", { action: "update", post: result });
      res.status(200).json({
        message: "Post updated successfully",
        post: result,
      });
    })
    .catch((err) => next(err));
};

exports.deletePost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then((post) => {
      if (!post) throw new AppError("No post found with that ID", 404);
      isCreator(post.creator.toString(), req.userId);
      if (post.creator.toString() !== req.userId)
        throw new AppError("Not authorized", 401);
      clearImage(post.imageUrl);
      return Post.findByIdAndDelete(postId);
    })
    .then(() => {
      return User.findById(req.userId);
    })
    .then((user) => {
      user.posts.pull(postId);
      return user.save();
    })
    .then(() => {
      getIO().emit("posts", { action: "delete", post: postId });
      res.status(200).json({ message: "The post is deleted successfully." });
    })
    .catch((err) => next(err));
};
