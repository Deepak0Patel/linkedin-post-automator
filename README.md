# 🚀 LinkedIn Post Automator

An AI-powered LinkedIn content automation tool that generates daily posts based on a 7-day content rotation strategy, delivers them via Email and WhatsApp, and stores full history in MongoDB.

> Built by **Deepak** — MERN Stack Developer targeting US remote opportunities.

---

## ✨ Features

- 🤖 **AI Post Generation** — Gemini 2.5 Flash (free), Claude, or OpenAI
- 📅 **7-Day Content Rotation** — Different topic & tone every day automatically
- ⏰ **Daily Cron Job** — Auto-generates post every morning at 7 AM IST
- 📧 **Email Notification** — Full HTML email with copy-paste ready post via Resend
- 📱 **WhatsApp Notification** — Quick preview message via whatsapp-web.js (free)
- 🗄️ **MongoDB History** — Every post saved with status tracking
- 🎛️ **REST API** — Manual override, config updates, post history
- ✋ **Manual Override** — Generate custom topic/tone anytime via API

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js v18+ |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| AI Provider | Google Gemini 2.5 Flash (free) |
| Email | Resend (3000 free emails/month) |
| WhatsApp | whatsapp-web.js (free) |
| Scheduler | node-cron |

---

## 📁 Project Structure

```
linkedin-post-automator/
├── index.js                          # Entry point
├── src/
│   ├── app.js                        # Express setup
│   ├── config/
│   │   ├── db.js                     # MongoDB connection
│   │   └── env.js                    # Env validation
│   ├── models/
│   │   ├── Post.js                   # Post schema
│   │   └── Config.js                 # Rotation config schema
│   ├── prompts/
│   │   ├── basePrompt.js             # AI system prompt
│   │   └── rotationTopics.js         # 7-day rotation topics
│   ├── services/
│   │   ├── aiService.js              # Gemini / Claude / OpenAI
│   │   ├── emailService.js           # Resend email
│   │   ├── whatsappService.js        # WhatsApp web
│   │   └── postService.js            # Core orchestration
│   ├── scheduler/
│   │   └── cronJob.js                # Daily cron
│   ├── controllers/
│   │   ├── postController.js
│   │   └── configController.js
│   ├── routes/
│   │   ├── postRoutes.js
│   │   └── configRoutes.js
│   └── utils/
│       ├── logger.js
│       └── dateHelper.js
```

---

## ⚡ Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/yourusername/linkedin-post-automator.git
cd linkedin-post-automator
npm install
```

### 2. WhatsApp (optional)
```bash
npm install whatsapp-web.js qrcode-terminal
```

### 3. Environment Setup
```bash
cp .env.example .env
```

Fill in your `.env`:
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb+srv://...
GEMINI_API_KEY=AIzaSy...
AI_PROVIDER=gemini
RESEND_API_KEY=re_...
EMAIL_TO=your@gmail.com
WHATSAPP_ENABLED=false
WHATSAPP_TO=+919876543210
CRON_TIME=0 7 * * *
TIMEZONE=Asia/Kolkata
```

### 4. Run
```bash
npm run dev     # development
npm start       # production
```

---

## 🔑 Getting API Keys

### Gemini API (FREE)
1. Go to [aistudio.google.com](https://aistudio.google.com)
2. Click **"Get API Key"** → Create API Key
3. Free: 250 requests/day — you need only 1/day ✅

### Resend Email (FREE)
1. Sign up at [resend.com](https://resend.com)
2. Go to **API Keys** → Create API Key
3. Free: 3000 emails/month ✅

### MongoDB (FREE)
1. Sign up at [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create free M0 cluster
3. Copy connection string ✅

---

## 📡 API Endpoints

### Generate Post Manually
```http
POST /api/posts/generate
Content-Type: application/json

{
  "topic": "Why I switched from callbacks to async/await",
  "tone": "educational"
}
```

### Get All Posts
```http
GET /api/posts?page=1&limit=10&status=generated
```

### Mark as Uploaded to LinkedIn
```http
PATCH /api/posts/:id/status
Content-Type: application/json

{ "status": "uploaded" }
```

### Get Rotation Config
```http
GET /api/config
```

### Update Rotation for Specific Days
```http
PUT /api/config
Content-Type: application/json

{
  "monday": {
    "type": "technical",
    "topic": "React Server Components explained simply",
    "tone": "educational"
  }
}
```

---

## 📅 7-Day Content Rotation

| Day | Type | Goal |
|---|---|---|
| Monday | Technical Tip | Show expertise |
| Tuesday | Career / Remote | Attract recruiters |
| Wednesday | Today I Learned | Relatability |
| Thursday | Funny / Relatable | Boost engagement |
| Friday | Project Showcase | Portfolio visibility |
| Saturday | Hot Take | Virality via debate |
| Sunday | Real Talk / Mindset | Human connection |

---

## 📱 WhatsApp Setup

1. Set `WHATSAPP_ENABLED=true` in `.env`
2. Run `npm run dev`
3. Scan the QR code shown in terminal with your WhatsApp
4. Done — stays connected permanently ✅

---

## 🚢 Deployment (Railway)

1. Push to GitHub
2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
3. Add all env variables in Railway dashboard
4. Deploy — cron runs 24/7 automatically ✅

---

## 💡 How It Works

```
Every day at 7 AM
       ↓
Cron job wakes up
       ↓
Checks today's rotation topic
       ↓
Builds prompt → calls Gemini API
       ↓
Gets back hook + body + CTA + hashtags
       ↓
Saves to MongoDB
       ↓
Sends HTML email via Resend
       ↓
Sends WhatsApp preview
       ↓
You open Gmail → copy → paste on LinkedIn
       ↓
Done in 2 minutes ✅
```

---

## 🌟 Portfolio Talking Points

> "I built a personal automation tool that uses Google's Gemini AI to generate daily LinkedIn posts based on a rotating content calendar. It delivers posts via email and WhatsApp every morning, stores full history in MongoDB, and exposes a REST API for manual control. The project runs 24/7 on Railway and I use it every day."

**Skills demonstrated:** Node.js, Express.js, MongoDB/Mongoose, REST API design, AI integration (Gemini/Claude/OpenAI), cron scheduling, email automation, WhatsApp automation, environment config, error handling, clean service architecture.

---

*Version 1.0 — Built by Deepak Patel*
