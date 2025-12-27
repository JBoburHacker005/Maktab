"""
FSM States for News
"""
from aiogram.fsm.state import State, StatesGroup


class NewsStates(StatesGroup):
    """States for adding news"""
    waiting_for_text = State()      # Waiting for text
    waiting_for_image = State()      # Waiting for image (optional)
    confirming = State()             # Confirming before saving

