const logger = require('../utils/logger');

let client = null;
let isReady = false;

/**
 * Initialize WhatsApp client (whatsapp-web.js).
 * Only runs if WHATSAPP_ENABLED=true.
 *
 * NOTE: whatsapp-web.js is NOT in package.json by default because it's
 * optional and requires puppeteer (large install). To enable:
 *   npm install whatsapp-web.js qrcode-terminal
 * Then set WHATSAPP_ENABLED=true in your .env
 */
async function initWhatsApp() {
  if (process.env.WHATSAPP_ENABLED !== 'true') {
    logger.info('WhatsApp is disabled. Set WHATSAPP_ENABLED=true to enable.');
    return;
  }

  try {
    const { Client, LocalAuth } = require('whatsapp-web.js');
    const qrcode = require('qrcode-terminal');

    client = new Client({
      authStrategy: new LocalAuth(),
      puppeteer: { args: ['--no-sandbox', '--disable-setuid-sandbox'] },
    });

    client.on('qr', (qr) => {
      logger.info('📱 Scan this QR code with WhatsApp:');
      qrcode.generate(qr, { small: true });
    });

    client.on('ready', () => {
      isReady = true;
      logger.info('✅ WhatsApp client is ready');
    });

    client.on('auth_failure', () => {
      logger.error('❌ WhatsApp auth failed');
    });

    client.on('disconnected', () => {
      isReady = false;
      logger.warn('WhatsApp client disconnected');
    });

    await client.initialize();
  } catch (error) {
    logger.error('WhatsApp init failed:', error.message);
    logger.warn('Make sure you ran: npm install whatsapp-web.js qrcode-terminal');
  }
}

async function sendWhatsAppNotification(post) {
  if (process.env.WHATSAPP_ENABLED !== 'true') return false;

  if (!isReady || !client) {
    logger.warn('⚠️  WhatsApp client not ready — skipping WhatsApp message');
    return false;
  }

  const to = process.env.WHATSAPP_TO;
  if (!to) {
    logger.warn('⚠️  WHATSAPP_TO not set — skipping WhatsApp message');
    return false;
  }

  try {
    const { dayOfWeek, topic, generatedContent } = post;
    const { hook, hashtags } = generatedContent;
    const hashtagLine = hashtags.slice(0, 3).map((h) => `#${h}`).join(' ');

    const message = `🚀 *LinkedIn Post Ready!*
📅 *${dayOfWeek}*
🎯 Topic: ${topic}

*Hook:* "${hook}"

Full post is in your email.
Upload takes 2 mins! 💪

${hashtagLine}`;

    // Format: countrycode + number + @c.us (e.g. 919876543210@c.us)
    const chatId = to.replace('+', '') + '@c.us';
    await client.sendMessage(chatId, message);

    logger.info('✅ WhatsApp message sent');
    return true;
  } catch (error) {
    logger.error('❌ WhatsApp send failed:', error.message);
    return false;
  }
}

module.exports = { initWhatsApp, sendWhatsAppNotification };
