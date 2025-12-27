"""
Language selection handler
"""
from aiogram import Router, F
from aiogram.types import Message, CallbackQuery
from bot.keyboards.language_menu import get_language_keyboard
from bot.keyboards.main_menu import get_main_menu_keyboard
from bot.locales import get_text
from bot.services.user_service import user_service

router = Router()


@router.message(F.text.contains("🌐") | F.text.contains("Til") | F.text.contains("Language") | F.text.contains("Язык"))
async def cmd_language(message: Message):
    """
    Handle language selection request
    
    Args:
        message: Message object
    """
    language = await user_service.get_user_language(message.from_user.id)
    
    await message.answer(
        get_text("select_language", language),
        reply_markup=get_language_keyboard()
    )


@router.callback_query(F.data.startswith("lang_"))
async def process_language(callback: CallbackQuery):
    """
    Handle language selection callback
    
    Args:
        callback: Callback query object
    """
    # Extract language code
    language_code = callback.data.split("_")[1]
    
    # Save user language
    await user_service.set_user_language(callback.from_user.id, language_code)
    
    # Get updated keyboard
    keyboard = await get_main_menu_keyboard(callback.from_user.id)
    
    # Send confirmation
    language_names = {
        "uz": "O'zbek",
        "en": "English",
        "ru": "Русский"
    }
    
    await callback.message.edit_text(
        get_text("language_changed", language_code, language=language_names[language_code])
    )
    
    await callback.message.answer(
        get_text("welcome", language_code),
        reply_markup=keyboard
    )
    
    await callback.answer()

