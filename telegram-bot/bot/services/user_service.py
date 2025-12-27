"""
User service for managing user preferences and state
"""
from bot.services.database import db_service
from bot.config import DEFAULT_LANGUAGE
from typing import Optional


class UserService:
    """Service for user-related operations"""
    
    @staticmethod
    async def get_user_language(telegram_user_id: int) -> str:
        """
        Get user language preference
        
        Args:
            telegram_user_id: Telegram user ID
            
        Returns:
            Language code (uz, en, ru)
        """
        preferences = await db_service.get_user_preferences(telegram_user_id)
        if preferences and preferences.get("language"):
            return preferences["language"]
        return DEFAULT_LANGUAGE
    
    @staticmethod
    async def set_user_language(telegram_user_id: int, language: str) -> bool:
        """
        Set user language preference
        
        Args:
            telegram_user_id: Telegram user ID
            language: Language code
            
        Returns:
            True if successful
        """
        return await db_service.save_user_preferences(
            telegram_user_id,
            language=language
        )
    
    @staticmethod
    async def get_user_panel(telegram_user_id: int) -> Optional[str]:
        """
        Get user current panel
        
        Args:
            telegram_user_id: Telegram user ID
            
        Returns:
            Panel name or None
        """
        preferences = await db_service.get_user_preferences(telegram_user_id)
        if preferences:
            return preferences.get("current_panel")
        return None
    
    @staticmethod
    async def set_user_panel(telegram_user_id: int, panel: Optional[str]) -> bool:
        """
        Set user current panel
        
        Args:
            telegram_user_id: Telegram user ID
            panel: Panel name
            
        Returns:
            True if successful
        """
        language = await UserService.get_user_language(telegram_user_id)
        return await db_service.save_user_preferences(
            telegram_user_id,
            language=language,
            current_panel=panel
        )


user_service = UserService()

