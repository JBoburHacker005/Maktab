"""
Bot configuration module
"""
import os
from dotenv import load_dotenv

load_dotenv()

# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
if not TELEGRAM_BOT_TOKEN:
    raise ValueError("TELEGRAM_BOT_TOKEN environment variable is required")

# Supabase Configuration
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
    raise ValueError("Supabase configuration is required")

# Bot Settings
BOT_ADMIN_IDS = [
    int(admin_id.strip())
    for admin_id in os.getenv("BOT_ADMIN_IDS", "").split(",")
    if admin_id.strip()
]

# Supported Languages
SUPPORTED_LANGUAGES = ["uz", "en", "ru"]
DEFAULT_LANGUAGE = "uz"

