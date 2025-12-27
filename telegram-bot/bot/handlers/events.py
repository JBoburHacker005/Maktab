"""
Events handler
"""
from aiogram import Router, F
from aiogram.types import Message, CallbackQuery
from aiogram.fsm.context import FSMContext
from bot.states.events_state import EventsStates
from bot.keyboards.main_menu import get_main_menu_keyboard, get_cancel_keyboard, get_skip_keyboard
from bot.locales import get_text
from bot.services.user_service import user_service
from bot.services.events_service import events_service
from bot.utils.image_utils import get_telegram_file_url
from bot.config import TELEGRAM_BOT_TOKEN
from datetime import datetime
import re

router = Router()


@router.message(F.text.contains("📅") | F.text.contains("Tadbir") | F.text.contains("Event") | F.text.contains("Событие"))
async def cmd_add_event(message: Message, state: FSMContext):
    """
    Start adding event
    
    Args:
        message: Message object
        state: FSM context
    """
    language = await user_service.get_user_language(message.from_user.id)
    
    await state.set_state(EventsStates.waiting_for_text)
    
    await message.answer(
        get_text("enter_event_text", language),
        reply_markup=get_cancel_keyboard(language)
    )


@router.message(EventsStates.waiting_for_text)
async def process_event_text(message: Message, state: FSMContext):
    """
    Process event text
    
    Args:
        message: Message object
        state: FSM context
    """
    language = await user_service.get_user_language(message.from_user.id)
    
    await state.update_data(text=message.text)
    await state.set_state(EventsStates.waiting_for_date)
    
    await message.answer(
        get_text("enter_date", language),
        reply_markup=get_cancel_keyboard(language)
    )


@router.message(EventsStates.waiting_for_date)
async def process_event_date(message: Message, state: FSMContext):
    """
    Process event date
    
    Args:
        message: Message object
        state: FSM context
    """
    language = await user_service.get_user_language(message.from_user.id)
    
    # Validate date format (YYYY-MM-DD)
    date_pattern = r'^\d{4}-\d{2}-\d{2}$'
    if not re.match(date_pattern, message.text):
        await message.answer(get_text("invalid_date", language))
        return
    
    # Validate date is valid
    try:
        datetime.strptime(message.text, "%Y-%m-%d")
    except ValueError:
        await message.answer(get_text("invalid_date", language))
        return
    
    await state.update_data(event_date=message.text)
    await state.set_state(EventsStates.waiting_for_location)
    
    await message.answer(
        get_text("enter_location", language),
        reply_markup=get_skip_keyboard(language)
    )


@router.message(EventsStates.waiting_for_location)
async def process_event_location(message: Message, state: FSMContext):
    """
    Process event location
    
    Args:
        message: Message object
        state: FSM context
    """
    language = await user_service.get_user_language(message.from_user.id)
    
    if get_text("skip", language) in message.text:
        await state.update_data(location=None)
    else:
        await state.update_data(location=message.text)
    
    await state.set_state(EventsStates.waiting_for_image)
    
    await message.answer(
        get_text("send_image", language),
        reply_markup=get_skip_keyboard(language)
    )


@router.message(EventsStates.waiting_for_image, F.photo)
async def process_event_image(message: Message, state: FSMContext):
    """
    Process event image
    
    Args:
        message: Message object
        state: FSM context
    """
    language = await user_service.get_user_language(message.from_user.id)
    
    photo = message.photo[-1]
    file_id = photo.file_id
    
    image_url = await get_telegram_file_url(file_id, TELEGRAM_BOT_TOKEN)
    
    if image_url:
        await state.update_data(image_url=image_url)
    
    data = await state.get_data()
    await show_event_preview(message, state, data, language)


@router.message(EventsStates.waiting_for_image, F.text)
async def process_event_skip_image(message: Message, state: FSMContext):
    """
    Process skip image
    
    Args:
        message: Message object
        state: FSM context
    """
    language = await user_service.get_user_language(message.from_user.id)
    
    if get_text("skip", language) in message.text:
        data = await state.get_data()
        await show_event_preview(message, state, data, language)
    elif get_text("cancel", language) in message.text:
        await state.clear()
        keyboard = await get_main_menu_keyboard(message.from_user.id)
        await message.answer(get_text("cancel", language), reply_markup=keyboard)
    else:
        await message.answer(get_text("send_image", language))


async def show_event_preview(message: Message, state: FSMContext, data: dict, language: str):
    """
    Show event preview
    
    Args:
        message: Message object
        state: FSM context
        data: State data
        language: User language
    """
    text = data.get("text", "")
    event_date = data.get("event_date", "")
    location = data.get("location")
    image_url = data.get("image_url")
    
    preview_text = f"{get_text('preview', language)}\n\n"
    preview_text += f"{get_text('title', language)}: {text[:50]}...\n"
    preview_text += f"{get_text('date', language)}: {event_date}\n"
    
    if location:
        preview_text += f"{get_text('location', language)}: {location}\n"
    
    if image_url:
        preview_text += f"{get_text('image', language)}: ✅\n"
    
    if image_url:
        await message.answer_photo(photo=image_url, caption=preview_text)
    else:
        await message.answer(preview_text)
    
    await state.set_state(EventsStates.confirming)
    
    from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton
    
    confirm_keyboard = InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text=get_text("confirm", language),
                    callback_data="event_confirm"
                ),
                InlineKeyboardButton(
                    text=get_text("cancel", language),
                    callback_data="event_cancel"
                )
            ]
        ]
    )
    
    await message.answer(
        get_text("confirm", language),
        reply_markup=confirm_keyboard
    )


@router.callback_query(F.data == "event_confirm")
async def confirm_event(callback: CallbackQuery, state: FSMContext):
    """
    Confirm and save event
    
    Args:
        callback: Callback query object
        state: FSM context
    """
    language = await user_service.get_user_language(callback.from_user.id)
    
    data = await state.get_data()
    text = data.get("text")
    event_date = data.get("event_date")
    location = data.get("location")
    image_url = data.get("image_url")
    
    if not text or not event_date:
        await callback.answer(get_text("error", language))
        return
    
    # Convert date to ISO format
    event_date_iso = f"{event_date}T00:00:00Z"
    
    event = await events_service.create_event(
        text=text,
        event_date=event_date_iso,
        location=location,
        image_url=image_url,
        telegram_user_id=callback.from_user.id
    )
    
    if event:
        await callback.message.edit_text(get_text("event_added", language))
        await callback.answer()
    else:
        await callback.message.edit_text(get_text("error", language))
        await callback.answer()
    
    await state.clear()
    
    keyboard = await get_main_menu_keyboard(callback.from_user.id)
    await callback.message.answer(
        get_text("main_menu", language),
        reply_markup=keyboard
    )


@router.callback_query(F.data == "event_cancel")
async def cancel_event(callback: CallbackQuery, state: FSMContext):
    """
    Cancel event creation
    
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

