const express = require("express");
const router = express.Router();
const { getConfig, updateConfig } = require("../controllers/configController");

// NEW — static routes first
router.get("/platforms", (req, res) => {
  res.json({
    success: true,
    platforms: ["LinkedIn"],
  });
});

router.get("/tones", (req, res) => {
  res.json({
    success: true,
    tones: [
      "educational",
      "professional",
      "casual",
      "inspirational",
      "storytelling",
      "promotional",
      "humorous",
    ],
  });
});

router.get("/", getConfig);
router.put("/", updateConfig);

module.exports = router;
