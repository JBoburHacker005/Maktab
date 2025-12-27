"""
Image processing utilities
"""
import aiohttp
from typing import Optional


async def get_telegram_file_url(file_id: str, bot_token: str) -> Optional[str]:
    """
    Get Telegram file URL from file_id
    
    Args:
        file_id: Telegram file_id
        bot_token: Bot token
        
    Returns:
        File URL or None if error
    """
    try:
        # Get file path
        async with aiohttp.ClientSession() as session:
            async with session.get(
                f"https://api.telegram.org/bot{bot_token}/getFile",
                params={"file_id": file_id}
            ) as response:
                data = await response.json()
                
                if not data.get("ok"):
                    return None
                
                file_path = data["result"]["file_path"]
                
                # Return full URL
                return f"https://api.telegram.org/file/bot{bot_token}/{file_path}"
    except Exception as e:
        print(f"Error getting Telegram file URL: {e}")
        return None


async def download_telegram_file(file_id: str, bot_token: str) -> Optional[bytes]:
    """
    Download file from Telegram
    
    Args:
        file_id: Telegram file_id
        bot_token: Bot token
        
    Returns:
        File bytes or None if error
    """
    try:
        file_url = await get_telegram_file_url(file_id, bot_token)
        if not file_url:
            return None
        
        async with aiohttp.ClientSession() as session:
            async with session.get(file_url) as response:
                if response.status == 200:
                    return await response.read()
    except Exception as e:
        print(f"Error downloading Telegram file: {e}")
        return None

