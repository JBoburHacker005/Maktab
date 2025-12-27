"""
Supabase database service
"""
from supabase import create_client, Client
from bot.config import SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
from typing import Optional


class DatabaseService:
    """Service for database operations"""
    
    def __init__(self):
        """Initialize Supabase client"""
        self.client: Client = create_client(
            SUPABASE_URL,
            SUPABASE_SERVICE_ROLE_KEY
        )
    
    async def get_user_preferences(self, telegram_user_id: int) -> Optional[dict]:
        """
        Get user preferences
        
        Args:
            telegram_user_id: Telegram user ID
            
        Returns:
            User preferences dict or None
        """
        try:
            response = self.client.table("telegram_user_preferences")\
                .select("*")\
                .eq("telegram_user_id", telegram_user_id)\
                .maybe_single()\
                .execute()
            
            return response.data if response.data else None
        except Exception as e:
            print(f"Error getting user preferences: {e}")
            return None
    
    async def save_user_preferences(
        self,
        telegram_user_id: int,
        language: str = "uz",
        current_panel: Optional[str] = None
    ) -> bool:
        """
        Save or update user preferences
        
        Args:
            telegram_user_id: Telegram user ID
            language: User language
            current_panel: Current panel name
            
        Returns:
            True if successful
        """
        try:
            # Check if user exists
            existing = await self.get_user_preferences(telegram_user_id)
            
            data = {
                "telegram_user_id": telegram_user_id,
                "language": language,
                "current_panel": current_panel
            }
            
            if existing:
                # Update
                self.client.table("telegram_user_preferences")\
                    .update(data)\
                    .eq("telegram_user_id", telegram_user_id)\
                    .execute()
            else:
                # Insert
                self.client.table("telegram_user_preferences")\
                    .insert(data)\
                    .execute()
            
            return True
        except Exception as e:
            print(f"Error saving user preferences: {e}")
            return False


# Global instance
db_service = DatabaseService()

