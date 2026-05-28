/**
 * Default 7-day content rotation strategy.
 * This is the FALLBACK if no config exists in MongoDB.
 * You can update these via PUT /api/config in your running app.
 */
const DEFAULT_ROTATION = {
  monday: {
    type: "technical",
    topic:
      "MongoDB Performance Optimization — indexing, query tips, aggregation tricks",
    tone: "educational but conversational",
  },
  tuesday: {
    type: "career",
    topic: "How I am preparing for US remote developer interviews from India",
    tone: "motivational and honest",
  },
  wednesday: {
    type: "learning",
    topic:
      "Today I Learned — a mistake or misconception I had about Node.js or React",
    tone: "casual and relatable",
  },
  thursday: {
    type: "funny",
    topic:
      "Funny and relatable developer life moment — standups, bugs, or code reviews",
    tone: "funny and light-hearted",
  },
  friday: {
    type: "project",
    topic:
      "A real project or feature I built recently — what I learned from it",
    tone: "professional but approachable",
  },
  saturday: {
    type: "opinion",
    topic:
      "A hot take or strong opinion about a tech trend, tool, or industry norm",
    tone: "bold and direct",
  },
  sunday: {
    type: "mindset",
    topic:
      "Real talk about the challenges of remote job hunting or developer life",
    tone: "honest and human",
  },
};

/**
 * Build the dynamic portion of the prompt for auto mode.
 */
function buildAutoModeVariable(dayName, dayConfig) {
  return `
Today is ${dayName.toUpperCase()}.
Content Type: ${dayConfig.type}
Topic: ${dayConfig.topic}
Tone: ${dayConfig.tone}
Generate a LinkedIn post following ALL rules above.`;
}

/**
 * Build the dynamic portion of the prompt for manual override.
 */
function buildManualModeVariable(topic, tone) {
  return `
The developer wants a custom post today.
Their topic: ${topic}
Their preferred tone: ${tone || "professional and conversational"}
Generate a LinkedIn post following ALL rules above.`;
}

module.exports = {
  DEFAULT_ROTATION,
  buildAutoModeVariable,
  buildManualModeVariable,
};
