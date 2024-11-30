const { validationResult } = require("express-validator");
const Post = require("../models/post");

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
    res.status(422).json({
      message: "Validation failed!",
      error: errors.array(),
    });
  }

  const title = req.body.title;
  const content = req.body.content;

  // Create post in db
  Post.create({
    title: title,
    content: content,
    creator: {
      name: "Himi",
    },
    imageUrl: "images/heart.png",
  })
    .then((result) => {
      res.status(201).send({
        success: true,
        message: "Post created successfully",
        post: result,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
