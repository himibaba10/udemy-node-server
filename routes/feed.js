const express = require("express");

const feedController = require("../controllers/feed");
const { validatePost } = require("../constants/validators");
const isAuth = require("../middlewares/isAuth");

const router = express.Router();

// GET /feed/posts
router.get("/posts", isAuth, feedController.getPosts);
router.get("/post/:postId", isAuth, feedController.getPost);

// POST /feed/post
router.post("/post", isAuth, validatePost, feedController.createPost);

// PUT /feed/posts
router.put("/post/:postId", isAuth, validatePost, feedController.updatePost);

// DELETE /feed/posts
router.delete("/post/:postId", isAuth, feedController.deletePost);

module.exports = router;
