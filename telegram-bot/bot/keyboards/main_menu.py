"""
Main menu keyboard
"""
from aiogram.types import ReplyKeyboardMarkup, KeyboardButton
from bot.services.user_service import user_service
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from aiogram import Bot


async def get_main_menu_keyboard(telegram_user_id: int) -> ReplyKeyboardMarkup:
    """
    Get main menu keyboard based on user language
    
    Args:
        telegram_user_id: Telegram user ID
        
    Returns:
        Main menu keyboard
    """
    from bot.locales import get_text
    
    language = await user_service.get_user_language(telegram_user_id)
    
    keyboard = ReplyKeyboardMarkup(
        keyboard=[
            [
                KeyboardButton(text=get_text("add_news", language)),
                KeyboardButton(text=get_text("add_event", language))
            ],
            [
                KeyboardButton(text=get_text("add_gallery", language)),
                KeyboardButton(text=get_text("change_language", language))
            ]
        ],
        resize_keyboard=True
    )
    
    return keyboard


def get_cancel_keyboard(language: str = "uz") -> ReplyKeyboardMarkup:
    """
    Get cancel keyboard
    
    Args:
        language: User language
        
    Returns:
        Cancel keyboard
    """
    from bot.locales import get_text
    
    keyboard = ReplyKeyboardMarkup(
        keyboard=[
            [KeyboardButton(text=get_text("cancel", language))]
        ],
        resize_keyboard=True
    )
    
    return keyboard


def get_skip_keyboard(language: str = "uz") -> ReplyKeyboardMarkup:
    """
    Get skip keyboard for optional fields
    
    Args:
        language: User language
        
    Returns:
        Skip keyboard
    """
    from bot.locales import get_text
    
    keyboard = ReplyKeyboardMarkup(
        keyboard=[
            [
                KeyboardButton(text=get_text("skip", language)),
                KeyboardButton(text=get_text("cancel", language))
            ]
        ],
        resize_keyboard=True
    )
    
    return keyboard

