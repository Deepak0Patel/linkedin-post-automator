const Post = require("../models/postSchema");
const { runManualMode } = require("../services/postService");
const logger = require("../utils/logger");

async function generatePost(req, res) {
  try {
    const { topic, tone, override } = req.body;

    if (!topic || topic.trim().length < 5) {
      return res.status(400).json({
        success: false,
        message: "topic is required (min 5 characters)",
      });
    }

    const post = await runManualMode({
      topic: topic.trim(),
      tone: tone?.trim(),
    });

    return res.status(201).json({
      success: true,
      message: "Post generated and sent to your email!",
      post: {
        id: post._id,
        hook: post.generatedContent.hook,
        body: post.generatedContent.body,
        cta: post.generatedContent.cta,
        hashtags: post.generatedContent.hashtags,
        emojiHook: post.generatedContent.emojiHook,
        fullPost: post.generatedContent.fullPost,
      },
    });
  } catch (error) {
    logger.error("generatePost error:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message || "Post generation failed",
    });
  }
}

async function getAllPosts(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const skip = (page - 1) * limit;

    const filter = {};
    if (status) filter.status = status;

    const [posts, total] = await Promise.all([
      Post.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("-__v"),
      Post.countDocuments(filter),
    ]);

    return res.json({
      success: true,
      data: posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    logger.error("getAllPosts error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
}

async function getPostById(req, res) {
  try {
    const post = await Post.findById(req.params.id).select("-__v");
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }
    return res.json({ success: true, data: post });
  } catch (error) {
    logger.error("getPostById error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
}

async function updatePostStatus(req, res) {
  try {
    const { status } = req.body;
    const validStatuses = ["generated", "uploaded", "skipped"];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `status must be one of: ${validStatuses.join(", ")}`,
      });
    }

    const update = { status };
    if (status === "uploaded") {
      update.uploadedAt = new Date();
    }

    const post = await Post.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    logger.info(`Post ${post._id} marked as ${status}`);
    return res.json({ success: true, data: post });
  } catch (error) {
    logger.error("updatePostStatus error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = { generatePost, getAllPosts, getPostById, updatePostStatus };
