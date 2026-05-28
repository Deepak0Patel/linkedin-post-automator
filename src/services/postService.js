const Config = require("../models/Config");
const { generatePost } = require("./aiService");

const {
  DEFAULT_ROTATION,
  buildAutoModeVariable,
  buildManualModeVariable,
} = require("../prompts/rotationTopics");
const { getDayName } = require("../utils/dateHelper");
const logger = require("../utils/logger");
const Post = require("../models/postSchema");
const { sendEmailNotification } = require("./emailService");
const { sendWhatsAppNotification } = require("./whatsappService");

/**
 * Get config from DB, fallback to defaults.
 */
async function getRotationConfig() {
  let config = await Config.findOne();
  if (!config) {
    logger.info("No config in DB — using default rotation");
    return DEFAULT_ROTATION;
  }
  return config.rotation;
}

async function runAutoMode() {
  const dayName = getDayName();
  const dayLabel = dayName.charAt(0).toUpperCase() + dayName.slice(1);

  logger.info(`📅 Running AUTO MODE for ${dayLabel}`);

  const rotation = await getRotationConfig();
  const dayConfig = rotation[dayName];

  if (!dayConfig) {
    logger.error(`No rotation config found for ${dayLabel}`);
    return null;
  }

  const modeVariable = buildAutoModeVariable(dayName, dayConfig);
  return await generateAndSave({
    mode: "auto",
    topic: dayConfig.topic,
    tone: dayConfig.tone,
    dayOfWeek: dayLabel,
    modeVariable,
  });
}

async function runManualMode({ topic, tone }) {
  const dayName = getDayName();
  const dayLabel = dayName.charAt(0).toUpperCase() + dayName.slice(1);

  logger.info(`✋ Running MANUAL MODE — Topic: ${topic}`);

  const modeVariable = buildManualModeVariable(topic, tone);
  return await generateAndSave({
    mode: "manual",
    topic,
    tone: tone || "professional",
    dayOfWeek: dayLabel,
    modeVariable,
  });
}

async function generateAndSave({ mode, topic, tone, dayOfWeek, modeVariable }) {
  // 1. Generate with AI
  const generatedContent = await generatePost(modeVariable);

  // 2. Save to MongoDB
  const post = await Post.create({
    date: new Date(),
    dayOfWeek,
    mode,
    topic,
    tone,
    generatedContent,
    status: "generated",
    notificationSent: false,
  });

  logger.info(`✅ Post saved to DB: ${post._id}`);

  // 3. Send notifications
  // 3. Send notifications
  const emailSent = await sendEmailNotification(post);
  const whatsappSent = await sendWhatsAppNotification(post);

  if (emailSent || whatsappSent) {
    post.notificationSent = true;
    await post.save();
  }

  logger.info(
    `📬 Notifications — Email: ${emailSent}, WhatsApp: ${whatsappSent}`,
  );
  logger.info(`🎉 Done! Hook: "${generatedContent.hook}"`);

  return post;
}

module.exports = { runAutoMode, runManualMode };
