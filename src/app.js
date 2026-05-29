require("dotenv").config();

const express = require("express");
const postRoutes = require("./routes/postRoutes");
const configRoutes = require("./routes/configRoutes");
const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./middleware/auth");

// const morgon = require('morgon')

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "LinkedIn Automation Tool is running 🚀",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      posts: "/api/posts",
      config: "/api/config",
    },
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/posts", authMiddleware, postRoutes);
app.use("/api/config", authMiddleware, configRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

module.exports = app;
