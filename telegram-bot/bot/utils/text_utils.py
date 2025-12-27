"""
Text processing utilities
"""


def truncate_text(text: str, max_length: int = 100, suffix: str = "...") -> str:
    """
    Truncate text to maximum length
    
    Args:
        text: Input text
        max_length: Maximum length
        suffix: Suffix to add if truncated
        
    Returns:
        Truncated text
    """
    if not text:
        return ""
    
    if len(text) <= max_length:
        return text
    
    return text[:max_length - len(suffix)] + suffix


def extract_title(content: str, max_length: int = 100) -> str:
    """
    Extract title from content (first sentence or first N characters)
    
    Args:
        content: Full content text
        max_length: Maximum title length
        
    Returns:
        Extracted title
    """
    if not content:
        return "Untitled"
    
    # Try to extract first sentence
    sentences = content.split(". ")
    if sentences and len(sentences[0]) <= max_length:
        return sentences[0].strip()
    
    # Otherwise truncate
    return truncate_text(content, max_length)

