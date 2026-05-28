const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      default: Date.now,
    },
    dayOfWeek: {
      type: String,
      enum: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      required: true,
    },
    mode: {
      type: String,
      enum: ["auto", "manual"],
      default: "auto",
    },
    topic: {
      type: String,
      required: true,
    },
    tone: {
      type: String,
      required: true,
    },
    generatedContent: {
      hook: { type: String },
      body: { type: String },
      cta: { type: String },
      hashtags: [{ type: String }],
      fullPost: { type: String },
      emojiHook: { type: String },
    },
    status: {
      type: String,
      enum: ["generated", "uploaded", "skipped"],
      default: "generated",
    },
    uploadedAt: {
      type: Date,
      default: null,
    },
    notificationSent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// Index for querying by date/status
postSchema.index({ date: -1 });
postSchema.index({ status: 1 });

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
