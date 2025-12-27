"""
FSM States for Gallery
"""
from aiogram.fsm.state import State, StatesGroup


class GalleryStates(StatesGroup):
    """States for adding gallery images"""
    waiting_for_image = State()     # Waiting for image
    waiting_for_caption = State()   # Waiting for caption (optional)
    confirming = State()            # Confirming before saving

