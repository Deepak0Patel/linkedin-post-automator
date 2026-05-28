require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/db");
// const { startCronJob } = require("./src/scheduler/cronJob");
const { initWhatsApp } = require("./src/services/whatsappService");
const logger = require("./src/utils/logger");

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start Express server
    app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
      logger.info(`📍 Environment: ${process.env.NODE_ENV || "development"}`);
    });

    // Start cron scheduler
    // startCronJob();

    // Initialize WhatsApp (only if enabled)
    if (process.env.WHATSAPP_ENABLED === "true") {
      logger.info("📱 Initializing WhatsApp...");
      await initWhatsApp();
    }

    logger.info("✅ LinkedIn Automation Tool is LIVE!");
  } catch (error) {
    logger.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();
