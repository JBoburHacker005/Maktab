"""
Internationalization (i18n) module
"""
import json
from pathlib import Path
from typing import Dict

# Load locale files
LOCALES_DIR = Path(__file__).parent
LOCALES: Dict[str, Dict[str, str]] = {}

# Supported languages
SUPPORTED_LANGUAGES = ["uz", "en", "ru"]


def load_locales():
    """Load all locale files"""
    global LOCALES
    
    for lang in SUPPORTED_LANGUAGES:
        locale_file = LOCALES_DIR / f"{lang}.json"
        if locale_file.exists():
            with open(locale_file, "r", encoding="utf-8") as f:
                LOCALES[lang] = json.load(f)
        else:
            # Create default locale if not exists
            LOCALES[lang] = {}


def get_text(key: str, language: str = "uz", **kwargs) -> str:
    """
    Get translated text
    
    Args:
        key: Translation key
        language: Language code
        **kwargs: Format parameters
        
    Returns:
        Translated text
    """
    if not LOCALES:
        load_locales()
    
    # Fallback to uz if language not found
    if language not in LOCALES:
        language = "uz"
    
    # Get text
    text = LOCALES.get(language, {}).get(key, key)
    
    # Format if kwargs provided
    if kwargs:
        try:
            text = text.format(**kwargs)
        except KeyError:
            pass
    
    return text


# Load locales on import
load_locales()

