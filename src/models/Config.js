const mongoose = require("mongoose");

const dayConfigSchema = new mongoose.Schema(
  {
    type: { type: String, required: true },
    topic: { type: String, required: true },
    tone: { type: String, required: true },
  },
  { _id: false },
);

const configSchema = new mongoose.Schema(
  {
    rotation: {
      monday: { type: dayConfigSchema, required: true },
      tuesday: { type: dayConfigSchema, required: true },
      wednesday: { type: dayConfigSchema, required: true },
      thursday: { type: dayConfigSchema, required: true },
      friday: { type: dayConfigSchema, required: true },
      saturday: { type: dayConfigSchema, required: true },
      sunday: { type: dayConfigSchema, required: true },
    },
    scheduleTime: {
      type: String,
      default: "07:00",
    },
    timezone: {
      type: String,
      default: "Asia/Kolkata",
    },
    emailEnabled: {
      type: Boolean,
      default: true,
    },
    whatsappEnabled: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const Config = mongoose.model("Config", configSchema);
module.exports = Config;
