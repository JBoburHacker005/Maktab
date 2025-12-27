"""
URL slug generation utilities
"""
from slugify import slugify


def generate_slug(text: str, max_length: int = 100) -> str:
    """
    Generate URL-friendly slug from text
    
    Args:
        text: Input text
        max_length: Maximum length of slug
        
    Returns:
        URL-friendly slug
    """
    if not text:
        return ""
    
    # Generate slug
    slug = slugify(text, max_length=max_length, lowercase=True)
    
    # Ensure slug is not empty
    if not slug:
        slug = "untitled"
    
    return slug

