"""
Events service for managing events
"""
from bot.services.database import db_service
from bot.utils.slug_utils import generate_slug
from bot.utils.text_utils import extract_title
from datetime import datetime
from typing import Optional


class EventsService:
    """Service for events operations"""
    
    @staticmethod
    async def create_event(
        text: str,
        event_date: str,
        location: Optional[str] = None,
        image_url: Optional[str] = None,
        telegram_user_id: Optional[int] = None
    ) -> Optional[dict]:
        """
        Create a new event
        
        Args:
            text: Event description text
            event_date: Event date (ISO format)
            location: Optional location
            image_url: Optional image URL
            telegram_user_id: Telegram user ID who created it
            
        Returns:
            Created event dict or None if error
        """
        try:
            # Extract title from text
            title = extract_title(text, max_length=100)
            
            # Generate slug
            slug = generate_slug(title)
            
            # Ensure unique slug
            slug = await EventsService._ensure_unique_slug(slug)
            
            # Prepare data
            event_data = {
                "title_uz": title,
                "title_en": title,
                "title_ru": title,
                "description_uz": text,
                "description_en": text,
                "description_ru": text,
                "event_date": event_date,
                "location": location,
                "image_url": image_url,
                "published": True,
                "created_at": datetime.utcnow().isoformat(),
                "slug": slug
            }
            
            # Insert into database
            response = db_service.client.table("events")\
                .insert(event_data)\
                .execute()
            
            if response.data:
                return response.data[0]
            return None
        except Exception as e:
            print(f"Error creating event: {e}")
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
            response = db_service.client.table("events")\
                .select("id")\
                .eq("slug", slug)\
                .maybe_single()\
                .execute()
            
            if not response.data:
                return slug
            
            # Slug exists, append counter
            slug = f"{base_slug}-{counter}"
            counter += 1


events_service = EventsService()

