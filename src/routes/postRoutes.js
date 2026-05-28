const {
  generatePost,
  getAllPosts,
  getPostById,
  updatePostStatus,
} = require("../controllers/postController");

const express = require("express");
const router = express.Router();

router.post("/generate", generatePost);

router.get("/", getAllPosts);

// 👇 specific before dynamic
router.patch("/:id/status", updatePostStatus);

// 👇 generic last
router.get("/:id", getPostById);

module.exports = router;
