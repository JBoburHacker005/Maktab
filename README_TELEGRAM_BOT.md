# Telegram Bot Setup Guide

## Overview

This Telegram bot is fully integrated with the website (https://ima-uz.vercel.app) and allows admins to manage content (News, Events, Gallery) directly from Telegram.

## Features

- ✅ Role-based access (only admins can use the bot)
- ✅ Silent for non-admins (no response)
- ✅ Multilingual support (Uzbek, English, Russian)
- ✅ Real-time sync with website database
- ✅ Simple workflow: Add News, Events, Gallery items

## Setup Instructions

### 1. Create Telegram Bot

1. Open Telegram and search for [@BotFather](https://t.me/botfather)
2. Send `/newbot` command
3. Follow instructions to create your bot
4. Copy the **Bot Token** (e.g., `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

### 2. Set Webhook URL

Set your webhook URL to:
```
https://ima-uz.vercel.app/api/telegram-webhook
```

You can do this via:
- **BotFather**: Send `/setwebhook` and provide the URL
- **Or use curl**:
```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://ima-uz.vercel.app/api/telegram-webhook"}'
```

### 3. Environment Variables

Add these to your Vercel project environment variables:

```
TELEGRAM_BOT_TOKEN=your_bot_token_here
VITE_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 4. Database Migration

Run the migration to create necessary tables:
```sql
-- Run: supabase/migrations/20251214000002_telegram_bot.sql
```

### 5. Add Telegram Admins

1. Login to admin panel as **Super Admin**
2. Go to **Telegram Adminlar** section
3. Click **Admin qo'shish**
4. Enter Telegram User ID (get it from [@userinfobot](https://t.me/userinfobot))
5. Click **Qo'shish**

## How to Get Telegram User ID

1. Open Telegram
2. Search for [@userinfobot](https://t.me/userinfobot)
3. Send `/start` command
4. The bot will reply with your User ID (a number like `123456789`)

## Bot Usage

### For Admins:

1. **Start the bot**: Send `/start`
2. **Select language**: Choose 🇺🇿 Uzbek, 🇬🇧 English, or 🇷🇺 Russian
3. **Choose panel**: Select 📰 News, 📅 Events, or 🖼 Gallery
4. **Add content**: Click ➕ Add and follow instructions

### Adding News:
1. Select 📰 News → ➕ Add
2. Enter title
3. Enter description
4. Send image (optional) or skip
5. Done! Content appears on website instantly

### Adding Events:
1. Select 📅 Events → ➕ Add
2. Enter title
3. Enter description
4. Enter date (YYYY-MM-DD format)
5. Done! Event appears on website instantly

### Adding Gallery:
1. Select 🖼 Gallery → ➕ Add
2. Send image
3. Enter caption (optional) or skip
4. Done! Image appears on website instantly

## Security

- Only users with `telegram_user_id` in `user_roles` table can use the bot
- Non-admins receive no response (silent bot)
- All content is saved directly to Supabase database
- Real-time sync ensures website updates immediately

## Troubleshooting

### Bot not responding?
1. Check webhook is set correctly
2. Verify `TELEGRAM_BOT_TOKEN` environment variable
3. Check Vercel function logs

### Can't add admin?
1. Ensure you're logged in as Super Admin
2. Verify Telegram User ID is correct
3. Check database migration ran successfully

### Content not appearing on website?
1. Check Supabase connection
2. Verify `SUPABASE_SERVICE_ROLE_KEY` is set
3. Check database logs for errors

## Support

For issues or questions, contact the development team.

