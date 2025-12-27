"""
News service for managing news articles
"""
from bot.services.database import db_service
from bot.utils.slug_utils import generate_slug
from bot.utils.text_utils import extract_title
from datetime import datetime
from typing import Optional


class NewsService:
    """Service for news operations"""
    
    @staticmethod
    async def create_news(
        text: str,
        image_url: Optional[str] = None,
        telegram_user_id: Optional[int] = None
    ) -> Optional[dict]:
        """
        Create a new news article
        
        Args:
            text: News content text
            image_url: Optional image URL
            telegram_user_id: Telegram user ID who created it
            
        Returns:
            Created news dict or None if error
        """
        try:
            # Extract title from text
            title = extract_title(text, max_length=100)
            
            # Generate slug
            slug = generate_slug(title)
            
            # Ensure unique slug
            slug = await NewsService._ensure_unique_slug(slug)
            
            # Prepare data
            news_data = {
                "title_uz": title,
                "title_en": title,
                "title_ru": title,
                "content_uz": text,
                "content_en": text,
                "content_ru": text,
                "image_url": image_url,
                "published": True,
                "created_at": datetime.utcnow().isoformat(),
                "slug": slug
            }
            
            # Insert into database
            response = db_service.client.table("news")\
                .insert(news_data)\
                .execute()
            
            if response.data:
                return response.data[0]
            return None
        except Exception as e:
            print(f"Error creating news: {e}")
            return None
    
    @staticmethod
    async def _ensure_unique_slug(slug: str) -> str:
        """
        Ensure slug is unique by appending number if needed
        
        Args:
            slug: Base slug
            
        Returns:
            Unique slug
        """
        base_slug = slug
        counter = 1
        
        while True:
            # Check if slug exists
            response = db_service.client.table("news")\
                .select("id")\
                .eq("slug", slug)\
                .maybe_single()\
                .execute()
            
            if not response.data:
                return slug
            
            # Slug exists, append counter
            slug = f"{base_slug}-{counter}"
            counter += 1


news_service = NewsService()

