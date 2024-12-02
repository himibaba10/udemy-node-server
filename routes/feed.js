const express = require("express");

const feedController = require("../controllers/feed");
const { body } = require("express-validator");
const validatePost = require("../constants/validators");

const router = express.Router();

// GET /feed/posts
router.get("/posts", feedController.getPosts);
router.get("/post/:postId", feedController.getPost);

// POST /feed/post
router.post("/post", validatePost, feedController.createPost);

// PUT /feed/posts
router.put("/post/:postId", validatePost, feedController.updatePost);

module.exports = router;
