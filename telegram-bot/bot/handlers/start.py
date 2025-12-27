"""
Start command handler
"""
from aiogram import Router, F
from aiogram.types import Message
from aiogram.fsm.context import FSMContext
from bot.keyboards.main_menu import get_main_menu_keyboard
from bot.locales import get_text
from bot.services.user_service import user_service

router = Router()


@router.message(F.text == "/start")
async def cmd_start(message: Message, state: FSMContext):
    """
    Handle /start command
    
    Args:
        message: Message object
        state: FSM context
    """
    # Clear any existing state
    await state.clear()
    
    # Get user language
    language = await user_service.get_user_language(message.from_user.id)
    
    # Get keyboard
    keyboard = await get_main_menu_keyboard(message.from_user.id)
    
    # Send welcome message
    await message.answer(
        get_text("welcome", language),
        reply_markup=keyboard
    )

