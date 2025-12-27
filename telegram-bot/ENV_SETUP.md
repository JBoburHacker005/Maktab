# Environment Variables Setup

Create a `.env` file in the `telegram-bot` directory with the following variables:

```env
# Telegram Bot
TELEGRAM_BOT_TOKEN=your_bot_token_here

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Bot Settings (optional)
BOT_ADMIN_IDS=123456789,987654321
```

## How to Get Values

### Telegram Bot Token

1. Open [@BotFather](https://t.me/botfather) on Telegram
2. Send `/newbot` command
3. Follow the instructions to create a bot
4. Copy the token provided by BotFather

### Supabase Credentials

1. Go to your Supabase project dashboard
2. Navigate to Settings > API
3. Copy the Project URL (SUPABASE_URL)
4. Copy the service_role key (SUPABASE_SERVICE_ROLE_KEY)

⚠️ **Important**: Never commit the `.env` file to version control!

