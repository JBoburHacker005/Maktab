"""
User middleware for loading user preferences
"""
from typing import Callable, Dict, Any, Awaitable
from aiogram import BaseMiddleware
from aiogram.types import TelegramObject
from bot.services.user_service import user_service


class UserMiddleware(BaseMiddleware):
    """Middleware to load user preferences"""
    
    async def __call__(
        self,
        handler: Callable[[TelegramObject, Dict[str, Any]], Awaitable[Any]],
        event: TelegramObject,
        data: Dict[str, Any]
    ) -> Any:
        """
        Process middleware
        
        Args:
            handler: Handler function
            event: Telegram event
            data: Handler data
            
        Returns:
            Handler result
        """
        # Get user from event
        user = data.get("event_from_user")
        
        if user:
            # Load user language
            language = await user_service.get_user_language(user.id)
            data["user_language"] = language
        
        return await handler(event, data)

