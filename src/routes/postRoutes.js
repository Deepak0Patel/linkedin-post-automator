const express = require("express");
const router = express.Router();
const {
  generatePost,
  getAllPosts,
  getPostById,
  updatePostStatus,
  deletePost,
  schedulePost,
} = require("../controllers/postController");

router.post("/generate", generatePost);
router.get("/", getAllPosts);

// specific routes before dynamic
router.patch("/:id/status", updatePostStatus);
router.patch("/:id/schedule", schedulePost); // NEW
router.delete("/:id", deletePost); // NEW

// generic last
router.get("/:id", getPostById);

module.exports = router;
