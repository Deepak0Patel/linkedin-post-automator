const nodemailer = require("nodemailer");
const logger = require("../utils/logger");

function createTransporter() {
  return nodemailer.createTransport({
    host: "smtp.resend.com",
    port: 587,
    secure: false,
    auth: {
      user: "resend", // Always literally "resend"
      pass: process.env.RESEND_API_KEY, // Your Resend API key
    },
  });
}

function buildEmailHTML(post, dayOfWeek, topic, tone) {
  const { hook, body, cta, hashtags, emojiHook, fullPost } =
    post.generatedContent;
  const hashtagLine = hashtags.map((h) => `#${h}`).join(" ");
  const date = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f3f2ef; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.12); }
    .header { background: #0A66C2; color: white; padding: 24px 32px; }
    .header h1 { margin: 0; font-size: 22px; font-weight: 700; }
    .header p { margin: 6px 0 0; opacity: 0.85; font-size: 14px; }
    .meta { background: #EEF3F8; padding: 16px 32px; display: flex; gap: 24px; flex-wrap: wrap; }
    .meta-item { font-size: 13px; color: #444; }
    .meta-item strong { color: #0A66C2; }
    .section { padding: 24px 32px; border-bottom: 1px solid #f0f0f0; }
    .section h2 { font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; color: #888; margin: 0 0 12px; }
    .post-box { background: #f8f9fa; border-left: 4px solid #0A66C2; border-radius: 4px; padding: 16px; font-size: 15px; line-height: 1.6; color: #1a1a1a; white-space: pre-wrap; word-break: break-word; }
    .hook { font-size: 17px; font-weight: 700; color: #0A66C2; margin-bottom: 16px; }
    .hashtags { margin-top: 16px; color: #0A66C2; font-size: 13px; }
    .cta { margin-top: 12px; font-style: italic; color: #555; font-size: 14px; }
    .copy-section { padding: 24px 32px; background: #f8f9fa; }
    .copy-section h2 { font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; color: #888; margin: 0 0 12px; }
    .full-post { background: white; border: 1px solid #ddd; border-radius: 4px; padding: 16px; font-size: 14px; line-height: 1.7; color: #1a1a1a; white-space: pre-wrap; word-break: break-word; }
    .footer { background: #1B1B1B; color: #aaa; padding: 20px 32px; text-align: center; font-size: 12px; }
    .reminder { background: #FFF3CD; border: 1px solid #FFD700; border-radius: 6px; padding: 12px 16px; margin: 0 32px 24px; font-size: 14px; color: #856404; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📝 Your LinkedIn Post is Ready!</h1>
      <p>${date}</p>
    </div>

    <div class="meta">
      <div class="meta-item">📅 <strong>${dayOfWeek}</strong></div>
      <div class="meta-item">🎯 Topic: <strong>${topic}</strong></div>
      <div class="meta-item">🎭 Tone: <strong>${tone}</strong></div>
    </div>

    <div class="section">
      <h2>Post Preview</h2>
      <div class="post-box">
        <div class="hook">${emojiHook || ""} ${hook}</div>
        <div>${body}</div>
        <div class="cta">${cta}</div>
        <div class="hashtags">${hashtagLine}</div>
      </div>
    </div>

    <div class="copy-section">
      <h2>📋 Full Post — Ready to Copy & Paste</h2>
      <div class="full-post">${fullPost}</div>
    </div>

    <div class="reminder">
      ⏱️ <strong>Uploading takes 2 minutes.</strong> Open LinkedIn → Create Post → Paste → Post. Keep the streak going!
    </div>

    <div class="footer">
      LinkedIn Automation Tool by Deepak · Powered by AI · You handle the upload ✅
    </div>
  </div>
</body>
</html>`;
}

async function sendEmailNotification(post) {
  if (!process.env.RESEND_API_KEY) {
    logger.warn("⚠️  RESEND_API_KEY missing — skipping email");
    return false;
  }

  try {
    const transporter = createTransporter();
    const { dayOfWeek, topic, tone } = post;

    const date = new Date().toLocaleDateString("en-IN", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });

    const mailOptions = {
      from: "LinkedIn Bot <onboarding@resend.dev>", // Use this until you verify your domain
      to: process.env.EMAIL_TO,
      subject: `📝 LinkedIn Post Ready — ${dayOfWeek}, ${date}`,
      html: buildEmailHTML(post, dayOfWeek, topic, tone),
    };

    await transporter.sendMail(mailOptions);
    logger.info("✅ Email sent successfully via Resend");
    return true;
  } catch (error) {
    logger.error("❌ Email send failed:", error.message);
    return false;
  }
}

module.exports = { sendEmailNotification };
