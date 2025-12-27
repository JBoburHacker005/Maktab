"""
Gallery handler
"""
from aiogram import Router, F
from aiogram.types import Message, CallbackQuery
from aiogram.fsm.context import FSMContext
from bot.states.gallery_state import GalleryStates
from bot.keyboards.main_menu import get_main_menu_keyboard, get_cancel_keyboard, get_skip_keyboard
from bot.locales import get_text
from bot.services.user_service import user_service
from bot.services.gallery_service import gallery_service
from bot.utils.image_utils import get_telegram_file_url
from bot.config import TELEGRAM_BOT_TOKEN

router = Router()


@router.message(F.text.contains("🖼") | F.text.contains("Galereya") | F.text.contains("Gallery") | F.text.contains("Галерея"))
async def cmd_add_gallery(message: Message, state: FSMContext):
    """
    Start adding gallery image
    
    Args:
        message: Message object
        state: FSM context
    """
    language = await user_service.get_user_language(message.from_user.id)
    
    await state.set_state(GalleryStates.waiting_for_image)
    
    await message.answer(
        get_text("send_gallery_image", language),
        reply_markup=get_cancel_keyboard(language)
    )


@router.message(GalleryStates.waiting_for_image, F.photo)
async def process_gallery_image(message: Message, state: FSMContext):
    """
    Process gallery image
    
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
        await state.set_state(GalleryStates.waiting_for_caption)
        
        await message.answer(
            get_text("enter_caption", language),
            reply_markup=get_skip_keyboard(language)
        )
    else:
        await message.answer(get_text("error", language))


@router.message(GalleryStates.waiting_for_caption)
async def process_gallery_caption(message: Message, state: FSMContext):
    """
    Process gallery caption
    
    Args:
        message: Message object
        state: FSM context
    """
    language = await user_service.get_user_language(message.from_user.id)
    
    if get_text("skip", language) in message.text:
        await state.update_data(caption=None)
    else:
        await state.update_data(caption=message.text)
    
    data = await state.get_data()
    await show_gallery_preview(message, state, data, language)


async def show_gallery_preview(message: Message, state: FSMContext, data: dict, language: str):
    """
    Show gallery preview
    
    Args:
        message: Message object
        state: FSM context
        data: State data
        language: User language
    """
    image_url = data.get("image_url")
    caption = data.get("caption", "")
    
    preview_text = f"{get_text('preview', language)}\n\n"
    
    if caption:
        preview_text += f"{get_text('caption', language)}: {caption}\n"
    
    await state.set_state(GalleryStates.confirming)
    
    from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton
    
    confirm_keyboard = InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text=get_text("confirm", language),
                    callback_data="gallery_confirm"
                ),
                InlineKeyboardButton(
                    text=get_text("cancel", language),
                    callback_data="gallery_cancel"
                )
            ]
        ]
    )
    
    if image_url:
        await message.answer_photo(
            photo=image_url,
            caption=preview_text,
            reply_markup=confirm_keyboard
        )
    else:
        await message.answer(
            preview_text,
            reply_markup=confirm_keyboard
        )


@router.callback_query(F.data == "gallery_confirm")
async def confirm_gallery(callback: CallbackQuery, state: FSMContext):
    """
    Confirm and save gallery image
    
    Args:
        callback: Callback query object
        state: FSM context
    """
    language = await user_service.get_user_language(callback.from_user.id)
    
    data = await state.get_data()
    image_url = data.get("image_url")
    caption = data.get("caption")
    
    if not image_url:
        await callback.answer(get_text("error", language))
        return
    
    gallery_item = await gallery_service.create_gallery_image(
        image_url=image_url,
        caption=caption,
        telegram_user_id=callback.from_user.id
    )
    
    if gallery_item:
        await callback.message.edit_caption(get_text("gallery_added", language))
        await callback.answer()
    else:
        await callback.message.edit_caption(get_text("error", language))
        await callback.answer()
    
    await state.clear()
    
    keyboard = await get_main_menu_keyboard(callback.from_user.id)
    await callback.message.answer(
        get_text("main_menu", language),
        reply_markup=keyboard
    )


@router.callback_query(F.data == "gallery_cancel")
async def cancel_gallery(callback: CallbackQuery, state: FSMContext):
    """
    Cancel gallery creation
    
    Args:
        callback: Callback query object
        state: FSM context
    """
    language = await user_service.get_user_language(callback.from_user.id)
    
    await state.clear()
    await callback.message.edit_caption(get_text("cancel", language))
    await callback.answer()
    
    keyboard = await get_main_menu_keyboard(callback.from_user.id)
    await callback.message.answer(
        get_text("main_menu", language),
        reply_markup=keyboard
    )

