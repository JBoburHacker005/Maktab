"""
FSM States for Events
"""
from aiogram.fsm.state import State, StatesGroup


class EventsStates(StatesGroup):
    """States for adding events"""
    waiting_for_text = State()      # Waiting for text
    waiting_for_date = State()       # Waiting for date
    waiting_for_location = State()   # Waiting for location (optional)
    waiting_for_image = State()      # Waiting for image (optional)
    confirming = State()             # Confirming before saving

