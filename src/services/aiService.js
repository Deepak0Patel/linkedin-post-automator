const Anthropic = require("@anthropic-ai/sdk");
const OpenAI = require("openai");
const { BASE_PROMPT } = require("../prompts/basePrompt");
const logger = require("../utils/logger");

/**
 * Sleep helper for retry delays
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Parse AI response — strips markdown fences and extracts JSON block.
 */
function parseAIResponse(text) {
  let clean = text.trim();

  clean = clean.replace(/^```json\s*/i, "").replace(/\s*```$/, "");
  clean = clean.replace(/^```\s*/, "").replace(/\s*```$/, "");

  try {
    return JSON.parse(clean);
  } catch (err) {
    const jsonMatch = clean.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (err2) {
        logger.error(
          "Failed to extract JSON from response:",
          clean.substring(0, 300),
        );
      }
    }
    logger.error("Failed to parse AI JSON response:", clean.substring(0, 300));
    throw new Error("AI returned invalid JSON. Try again.");
  }
}

/**
 * Generate post using Claude (Anthropic API).
 */
async function generateWithClaude(fullPrompt) {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const response = await client.messages.create({
    model: "claude-opus-4-5",
    max_tokens: 8192,
    messages: [{ role: "user", content: fullPrompt }],
  });

  const text = response.content[0].text;
  return parseAIResponse(text);
}

/**
 * Generate post using GPT-4o (OpenAI API).
 */
async function generateWithOpenAI(fullPrompt) {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const response = await client.chat.completions.create({
    model: "gpt-4o",
    max_tokens: 8192,
    messages: [{ role: "user", content: fullPrompt }],
    response_format: { type: "json_object" },
  });

  const text = response.choices[0].message.content;
  return parseAIResponse(text);
}

/**
 * Generate post using Gemini (Google AI — FREE tier).
 * Auto-retries on 503 overload errors (3 attempts, 5s apart).
 */
async function generateWithGemini(fullPrompt) {
  const { GoogleGenerativeAI } = require("@google/generative-ai");

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  const geminiPrompt =
    fullPrompt +
    "\n\nIMPORTANT: Respond with ONLY a valid JSON object. No extra text, no markdown, no explanation before or after the JSON.";

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      maxOutputTokens: 8192,
    },
  });

  const MAX_RETRIES = 3;
  const RETRY_DELAY_MS = 5000; // 5 seconds between retries

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      logger.info(`Gemini attempt ${attempt}/${MAX_RETRIES}...`);
      const result = await model.generateContent(geminiPrompt);
      const text = result.response.text();
      logger.debug("Gemini raw response:", text.substring(0, 200));
      return parseAIResponse(text);
    } catch (error) {
      const is503 = error.message && error.message.includes("503");
      const isOverload = error.message && error.message.includes("high demand");

      if ((is503 || isOverload) && attempt < MAX_RETRIES) {
        logger.warn(
          `Gemini overloaded (attempt ${attempt}). Retrying in ${RETRY_DELAY_MS / 1000}s...`,
        );
        await sleep(RETRY_DELAY_MS);
      } else {
        throw error;
      }
    }
  }
}

/**
 * Main function — routes to correct AI provider.
 * Set AI_PROVIDER in .env to: "gemini", "openai", or "anthropic"
 */
async function generatePost(modeVariable) {
  const provider = process.env.AI_PROVIDER || "gemini";
  const fullPrompt = `${BASE_PROMPT}\n\n${modeVariable}`;

  logger.info(`🤖 Generating post with ${provider}...`);

  try {
    if (provider === "openai") {
      return await generateWithOpenAI(fullPrompt);
    } else if (provider === "anthropic") {
      return await generateWithClaude(fullPrompt);
    } else {
      return await generateWithGemini(fullPrompt);
    }
  } catch (error) {
    logger.error(`AI generation failed (${provider}):`, error.message);
    throw error;
  }
}

module.exports = { generatePost };
