const Config = require("../models/Config");
const { DEFAULT_ROTATION } = require("../prompts/rotationTopics");
const logger = require("../utils/logger");

const VALID_DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

/**
 * GET /api/config
 * Get current rotation configuration
 */
async function getConfig(req, res) {
  try {
    let config = await Config.findOne().select("-__v");

    if (!config) {
      // Return defaults if none saved
      return res.json({
        success: true,
        data: {
          rotation: DEFAULT_ROTATION,
          scheduleTime: "07:00",
          timezone: "Asia/Kolkata",
          emailEnabled: true,
          whatsappEnabled: false,
          note: "Using default config — POST to /api/config to save custom settings",
        },
      });
    }

    return res.json({ success: true, data: config });
  } catch (error) {
    logger.error("getConfig error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
}

/**
 * PUT /api/config
 * Update rotation config for one or more days
 * Body can include any subset of days or top-level settings
 */
async function updateConfig(req, res) {
  try {
    const body = req.body;

    // Validate day keys if provided
    const dayKeys = Object.keys(body).filter((k) => VALID_DAYS.includes(k));
    for (const day of dayKeys) {
      const { topic, tone, type } = body[day];
      if (!topic || !tone) {
        return res.status(400).json({
          success: false,
          message: `${day} config must include 'topic' and 'tone'`,
        });
      }
    }

    let config = await Config.findOne();

    if (!config) {
      // Create with defaults first, then apply updates
      config = new Config({
        rotation: DEFAULT_ROTATION,
        scheduleTime: body.scheduleTime || "07:00",
        timezone: body.timezone || "Asia/Kolkata",
        emailEnabled:
          body.emailEnabled !== undefined ? body.emailEnabled : true,
        whatsappEnabled:
          body.whatsappEnabled !== undefined ? body.whatsappEnabled : false,
      });
    }

    // Apply day updates
    for (const day of dayKeys) {
      config.rotation[day] = {
        type: body[day].type || config.rotation[day]?.type || "custom",
        topic: body[day].topic,
        tone: body[day].tone,
      };
    }

    // Apply top-level settings
    if (body.scheduleTime) config.scheduleTime = body.scheduleTime;
    if (body.timezone) config.timezone = body.timezone;
    if (body.emailEnabled !== undefined)
      config.emailEnabled = body.emailEnabled;
    if (body.whatsappEnabled !== undefined)
      config.whatsappEnabled = body.whatsappEnabled;

    config.markModified("rotation");
    await config.save();

    logger.info("Config updated successfully");
    return res.json({ success: true, data: config });
  } catch (error) {
    logger.error("updateConfig error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = { getConfig, updateConfig };
