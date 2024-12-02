const { validationResult } = require("express-validator");
const Post = require("../models/post");
const AppError = require("../middlewares/errorHandler");
const path = require("path");

exports.getPosts = (req, res, next) => {
  Post.find().then((posts) => {
    res.status(200).json({
      posts,
    });
  });
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new AppError("Validation failed!", 422);
  }

  const title = req.body.title;
  const content = req.body.content;
  const imageUrl = req.file.path.replace(/\\/g, "/");
  console.log({ imageUrl });

  // Create post in db
  Post.create({
    title: title,
    content: content,
    creator: {
      name: "Himi",
    },
    imageUrl,
  })
    .then((result) => {
      res.status(201).send({
        success: true,
        message: "Post created successfully",
        post: result,
      });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getPost = (req, res, next) => {
  Post.findById(req.params.postId)
    .then((post) => {
      if (!post) {
        throw new AppError("No post found with that ID", 404);
      }
      res.status(200).json({
        message: "Post was successfully retrieved",
        post,
      });
    })
    .catch((err) => next(err));
};
