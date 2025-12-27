"""
Gallery service for managing gallery images
"""
from bot.services.database import db_service
from datetime import datetime
from typing import Optional


class GalleryService:
    """Service for gallery operations"""
    
    @staticmethod
    async def create_gallery_image(
        image_url: str,
        caption: Optional[str] = None,
        telegram_user_id: Optional[int] = None
    ) -> Optional[dict]:
        """
        Create a new gallery image
        
        Args:
            image_url: Image URL
            caption: Optional caption
            telegram_user_id: Telegram user ID who created it
            
        Returns:
            Created gallery image dict or None if error
        """
        try:
            # Prepare data
            gallery_data = {
                "title_uz": caption or "",
                "title_en": caption or "",
                "title_ru": caption or "",
                "image_url": image_url,
                "published": True,
                "created_at": datetime.utcnow().isoformat()
            }
            
            # Insert into database
            response = db_service.client.table("gallery")\
                .insert(gallery_data)\
                .execute()
            
            if response.data:
                return response.data[0]
            return None
        except Exception as e:
            print(f"Error creating gallery image: {e}")
            return None


gallery_service = GalleryService()

