"""
News handler
"""
from aiogram import Router, F
from aiogram.types import Message, CallbackQuery
from aiogram.fsm.context import FSMContext
from bot.states.news_state import NewsStates
from bot.keyboards.main_menu import get_main_menu_keyboard, get_cancel_keyboard, get_skip_keyboard
from bot.keyboards.language_menu import get_language_keyboard
from bot.locales import get_text
from bot.services.user_service import user_service
from bot.services.news_service import news_service
from bot.utils.image_utils import get_telegram_file_url
from bot.config import TELEGRAM_BOT_TOKEN
from typing import Optional

router = Router()


@router.message(F.text.contains("📰") | F.text.contains("Yangilik") | F.text.contains("News") | F.text.contains("Новость"))
async def cmd_add_news(message: Message, state: FSMContext):
    """
    Start adding news
    
    Args:
        message: Message object
        state: FSM context
    """
    language = await user_service.get_user_language(message.from_user.id)
    
    # Set state
    await state.set_state(NewsStates.waiting_for_text)
    
    await message.answer(
        get_text("enter_news_text", language),
        reply_markup=get_cancel_keyboard(language)
    )


@router.message(NewsStates.waiting_for_text)
async def process_news_text(message: Message, state: FSMContext):
    """
    Process news text
    
    Args:
        message: Message object
        state: FSM context
    """
    language = await user_service.get_user_language(message.from_user.id)
    
    # Save text to state
    await state.update_data(text=message.text)
    
    # Ask for image
    await state.set_state(NewsStates.waiting_for_image)
    
    await message.answer(
        get_text("send_image", language),
        reply_markup=get_skip_keyboard(language)
    )


@router.message(NewsStates.waiting_for_image, F.photo)
async def process_news_image(message: Message, state: FSMContext):
    """
    Process news image
    
    Args:
        message: Message object
        state: FSM context
    """
    language = await user_service.get_user_language(message.from_user.id)
    
    # Get largest photo
    photo = message.photo[-1]
    file_id = photo.file_id
    
    # Get file URL
    image_url = await get_telegram_file_url(file_id, TELEGRAM_BOT_TOKEN)
    
    if image_url:
        await state.update_data(image_url=image_url)
    
    # Get data and create preview
    data = await state.get_data()
    await show_news_preview(message, state, data, language)


@router.message(NewsStates.waiting_for_image, F.text)
async def process_news_skip_image(message: Message, state: FSMContext):
    """
    Process skip image or cancel
    
    Args:
        message: Message object
        state: FSM context
    """
    language = await user_service.get_user_language(message.from_user.id)
    
    if get_text("skip", language) in message.text or get_text("cancel", language) in message.text:
        if get_text("cancel", language) in message.text:
            await state.clear()
            keyboard = await get_main_menu_keyboard(message.from_user.id)
            await message.answer(
                get_text("cancel", language),
                reply_markup=keyboard
            )
            return
        
        # Skip image
        data = await state.get_data()
        await show_news_preview(message, state, data, language)
    else:
        await message.answer(get_text("send_image", language))


async def show_news_preview(message: Message, state: FSMContext, data: dict, language: str):
    """
    Show news preview and ask for confirmation
    
    Args:
        message: Message object
        state: FSM context
        data: State data
        language: User language
    """
    text = data.get("text", "")
    image_url = data.get("image_url")
    
    # Create preview message
    preview_text = f"{get_text('preview', language)}\n\n"
    preview_text += f"{get_text('title', language)}: {text[:50]}...\n"
    preview_text += f"{get_text('content', language)}: {text[:200]}...\n"
    
    if image_url:
        preview_text += f"{get_text('image', language)}: ✅\n"
    
    # Send preview
    if image_url:
        await message.answer_photo(
            photo=image_url,
            caption=preview_text
        )
    else:
        await message.answer(preview_text)
    
    # Set confirming state
    await state.set_state(NewsStates.confirming)
    
    # Ask for confirmation
    from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton
    
    confirm_keyboard = InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text=get_text("confirm", language),
                    callback_data="news_confirm"
                ),
                InlineKeyboardButton(
                    text=get_text("cancel", language),
                    callback_data="news_cancel"
                )
            ]
        ]
    )
    
    await message.answer(
        get_text("confirm", language),
        reply_markup=confirm_keyboard
    )


@router.callback_query(F.data == "news_confirm")
async def confirm_news(callback: CallbackQuery, state: FSMContext):
    """
    Confirm and save news
    
    Args:
        callback: Callback query object
        state: FSM context
    """
    language = await user_service.get_user_language(callback.from_user.id)
    
    # Get data
    data = await state.get_data()
    text = data.get("text")
    image_url = data.get("image_url")
    
    if not text:
        await callback.answer(get_text("error", language))
        return
    
    # Create news
    news = await news_service.create_news(
        text=text,
        image_url=image_url,
        telegram_user_id=callback.from_user.id
    )
    
    if news:
        await callback.message.edit_text(get_text("news_added", language))
        await callback.answer()
    else:
        await callback.message.edit_text(get_text("error", language))
        await callback.answer()
    
    # Clear state
    await state.clear()
    
    # Show main menu
    keyboard = await get_main_menu_keyboard(callback.from_user.id)
    await callback.message.answer(
        get_text("main_menu", language),
        reply_markup=keyboard
    )


@router.callback_query(F.data == "news_cancel")
async def cancel_news(callback: CallbackQuery, state: FSMContext):
    """
    Cancel news creation
    
    Args:
        callback: Callback query object
        state: FSM context
    """
    language = await user_service.get_user_language(callback.from_user.id)
    
    await state.clear()
    await callback.message.edit_text(get_text("cancel", language))
    await callback.answer()
    
    keyboard = await get_main_menu_keyboard(callback.from_user.id)
    await callback.message.answer(
        get_text("main_menu", language),
        reply_markup=keyboard
    )

