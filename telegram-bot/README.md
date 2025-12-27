# Telegram Bot - Aiogram 3.22 Integration

Telegram bot for managing news, events, and gallery images for the Maktab website.

## Features

- 📰 **News Management** - Add news with text and optional images
- 📅 **Events Management** - Add events with date, location, and images
- 🖼 **Gallery Management** - Add images to gallery with optional captions
- 🌐 **Multi-language Support** - Uzbek, English, and Russian
- 🔄 **Real-time Integration** - Changes appear immediately on the website

## Installation

1. **Clone the repository and navigate to telegram-bot directory:**
```bash
cd telegram-bot
```

2. **Create virtual environment:**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies:**
```bash
pip install -r requirements.txt
```

4. **Create `.env` file:**
```bash
cp .env.example .env
```

5. **Configure environment variables in `.env`:**
```env
TELEGRAM_BOT_TOKEN=your_bot_token_here
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
BOT_ADMIN_IDS=123456789,987654321
```

## Usage

### Running the Bot

```bash
python -m bot.main
```

### Bot Commands

- `/start` - Start the bot and show main menu
- Main menu options:
  - 📰 Add News
  - 📅 Add Event
  - 🖼 Add Gallery
  - 🌐 Change Language

## Project Structure

```
telegram-bot/
├── bot/
│   ├── __init__.py
│   ├── main.py                 # Bot entry point
│   ├── config.py              # Configuration
│   │
│   ├── handlers/              # Message handlers
│   │   ├── start.py
│   │   ├── news.py
│   │   ├── events.py
│   │   ├── gallery.py
│   │   └── language.py
│   │
│   ├── keyboards/             # Keyboard layouts
│   │   ├── main_menu.py
│   │   └── language_menu.py
│   │
│   ├── states/               # FSM States
│   │   ├── news_state.py
│   │   ├── events_state.py
│   │   └── gallery_state.py
│   │
│   ├── services/              # Business logic
│   │   ├── database.py
│   │   ├── news_service.py
│   │   ├── events_service.py
│   │   ├── gallery_service.py
│   │   └── user_service.py
│   │
│   ├── utils/                 # Utility functions
│   │   ├── slug_utils.py
│   │   ├── text_utils.py
│   │   └── image_utils.py
│   │
│   ├── middlewares/           # Middlewares
│   │   └── user_middleware.py
│   │
│   └── locales/              # Translations
│       ├── uz.json
│       ├── en.json
│       └── ru.json
│
├── requirements.txt
├── .env.example
└── README.md
```

## Database Schema

The bot uses the following Supabase tables:

- `news` - News articles
- `events` - Events
- `gallery` - Gallery images
- `telegram_user_preferences` - User preferences (language, etc.)

## Workflow

### Adding News

1. User selects "📰 Add News"
2. Bot asks for news text
3. User sends text
4. Bot asks for image (optional)
5. User sends image or skips
6. Bot shows preview
7. User confirms
8. News is saved to database
9. News appears on website immediately

### Adding Events

1. User selects "📅 Add Event"
2. Bot asks for event text
3. User sends text
4. Bot asks for date (YYYY-MM-DD)
5. User sends date
6. Bot asks for location (optional)
7. User sends location or skips
8. Bot asks for image (optional)
9. User sends image or skips
10. Bot shows preview
11. User confirms
12. Event is saved to database

### Adding Gallery Images

1. User selects "🖼 Add Gallery"
2. Bot asks for image
3. User sends image
4. Bot asks for caption (optional)
5. User sends caption or skips
6. Bot shows preview
7. User confirms
8. Image is saved to database

## Multi-language Support

The bot supports three languages:
- 🇺🇿 Uzbek (uz) - Default
- 🇬🇧 English (en)
- 🇷🇺 Russian (ru)

User language preference is saved and persists across sessions.

## Error Handling

All errors are caught and logged. User-friendly error messages are displayed in the user's selected language.

## Security

- Bot token is stored in environment variables
- Supabase service role key is never exposed to frontend
- All input is validated before saving to database

## Deployment

### Railway

1. Create new project on Railway
2. Connect GitHub repository
3. Set environment variables
4. Deploy

### VPS

1. Clone repository
2. Install dependencies
3. Create systemd service
4. Start service

## License

This project is part of the Maktab website integration.

