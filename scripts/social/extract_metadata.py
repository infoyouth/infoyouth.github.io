#!/usr/bin/env python3
"""
Extract metadata from Jekyll markdown post frontmatter and content
"""

import re
import sys
from pathlib import Path
from datetime import datetime


def parse_frontmatter(md_file_path):
    """
    Parse YAML frontmatter and content from markdown file
    
    Args:
        md_file_path: Path to markdown file
        
    Returns:
        tuple: (metadata dict, content str)
    """
    try:
        with open(md_file_path, 'r', encoding='utf-8') as f:
            full_content = f.read()
        
        # Extract frontmatter between --- markers
        match = re.search(r'^---\s*\n(.*?)\n---\s*\n(.*)', full_content, re.DOTALL)
        if not match:
            print(f"❌ No frontmatter found in {md_file_path}", file=sys.stderr)
            return None, None
        
        frontmatter = match.group(1)
        content = match.group(2)
        metadata = {}
        current_key = None
        current_list = []
        
        for line in frontmatter.split('\n'):
            # Check if this is a list item (starts with - or whitespace + -)
            if re.match(r'^\s*-\s+', line):
                # This is a list item
                value = re.sub(r'^\s*-\s+', '', line).strip().strip('"').strip("'")
                current_list.append(value)
            elif ':' in line:
                # This is a key-value pair
                # Save previous list if any
                if current_key and current_list:
                    metadata[current_key] = current_list
                    current_list = []
                
                key, value = line.split(':', 1)
                key = key.strip()
                value = value.strip().strip('"').strip("'")
                
                if value:
                    # Has value on same line
                    metadata[key] = value
                    current_key = None
                else:
                    # Value might be on next lines (list format)
                    current_key = key
            elif line.strip():
                # Non-empty line that's not a key-value or list item
                # Might be continuation of previous value
                if current_key and line.strip().startswith('"'):
                    metadata[current_key] = line.strip().strip('"').strip("'")
                    current_key = None
        
        # Save last list if any
        if current_key and current_list:
            metadata[current_key] = current_list
        
        return metadata, content
        
    except Exception as e:
        print(f"❌ Error parsing {md_file_path}: {e}", file=sys.stderr)
        return None, None


def extract_learning_points(content, max_points=3):
    """
    Extract key learning points from markdown content
    
    Args:
        content: Markdown content
        max_points: Maximum number of points to extract
        
    Returns:
        list: Learning points
    """
    points = []
    
    # Pattern 1: Look for ## or ### headers (main sections)
    headers = re.findall(r'^#{2,3}\s+(.+)$', content, re.MULTILINE)
    if headers:
        # Filter out common non-content headers
        filtered = [h for h in headers if not any(skip in h.lower() 
                   for skip in ['table of contents', 'toc', 'introduction', 
                               'conclusion', 'summary', 'references', 'prerequisites'])]
        points.extend(filtered[:max_points])
    
    # Pattern 2: Look for bullet points with learning keywords
    if len(points) < max_points:
        bullets = re.findall(r'^[\*\-]\s+(.+)$', content, re.MULTILINE)
        for bullet in bullets:
            if any(keyword in bullet.lower() for keyword in 
                  ['learn', 'understand', 'how to', 'explore', 'discover', 'master', 'create', 'build']):
                clean_bullet = re.sub(r'\[([^\]]+)\]\([^\)]+\)', r'\1', bullet)  # Remove links
                clean_bullet = re.sub(r'[`\*\_]', '', clean_bullet).strip()  # Remove formatting
                points.append(clean_bullet)
                if len(points) >= max_points:
                    break
    
    # Pattern 3: First few headers if nothing else found
    if not points and headers:
        points = headers[:max_points]
    
    # Fallback: Generic points based on category/title
    if not points:
        points = [
            "Core concepts and fundamentals",
            "Practical examples and use cases",
            "Best practices and patterns"
        ]
    
    # Clean up and truncate points
    cleaned_points = []
    for point in points[:max_points]:
        # Remove HTML tags first
        clean = re.sub(r'<[^>]+>', '', point).strip()
        # Remove markdown formatting
        clean = re.sub(r'[#\*\[\]\(\)\_`]', '', clean).strip()
        # Remove emoji
        clean = re.sub(r':[a-z_]+:', '', clean).strip()
        # Remove extra whitespace
        clean = re.sub(r'\s+', ' ', clean).strip()
        # Truncate if too long
        if len(clean) > 45:
            clean = clean[:42] + "..."
        if clean:
            cleaned_points.append(clean)
    
    # Ensure we have exactly max_points
    while len(cleaned_points) < max_points:
        if len(cleaned_points) == 0:
            cleaned_points.append("Key concepts and fundamentals")
        elif len(cleaned_points) == 1:
            cleaned_points.append("Practical implementation examples")
        else:
            cleaned_points.append("Best practices and tips")
    
    return cleaned_points[:max_points]


def extract_post_slug(file_path):
    """Extract URL slug from filename"""
    filename = Path(file_path).stem
    # Remove date prefix (YYYY-MM-DD-)
    slug = re.sub(r'^\d{4}-\d{2}-\d{2}-', '', filename)
    return slug


def get_post_url(file_path, metadata):
    """Generate full post URL"""
    slug = extract_post_slug(file_path)
    base_url = "https://infoyouth.github.io"
    return f"{base_url}/posts/{slug}"


def format_date(date_str):
    """Format date for display"""
    try:
        dt = datetime.strptime(date_str, '%Y-%m-%d')
        return dt.strftime('%b %d, %Y')
    except:
        return date_str


def main():
    if len(sys.argv) < 2:
        print("Usage: python extract_metadata.py <path_to_md_file>", file=sys.stderr)
        sys.exit(1)
    
    md_file = sys.argv[1]
    
    if not Path(md_file).exists():
        print(f"❌ File not found: {md_file}", file=sys.stderr)
        sys.exit(1)
    
    metadata, content = parse_frontmatter(md_file)
    if not metadata:
        sys.exit(1)
    
    # Extract key fields
    title = metadata.get('title', 'Untitled')
    categories = metadata.get('categories', [])
    if isinstance(categories, str):
        categories = [categories]
    
    tags = metadata.get('tags', [])
    if isinstance(tags, str):
        tags = [tags]
    
    date = metadata.get('date', datetime.now().strftime('%Y-%m-%d'))
    description = metadata.get('description', metadata.get('excerpt', ''))
    
    # Get category (first one or derive from path)
    category = categories[0] if categories else 'Tutorial'
    
    # Get URL
    url = get_post_url(md_file, metadata)
    
    # Extract learning points from content
    learning_points = extract_learning_points(content, max_points=3)
    
    # Output as shell-friendly format
    print(f"TITLE={title}")
    print(f"CATEGORY={category}")
    print(f"TAGS={','.join(tags[:4])}")  # Limit to 4 tags
    print(f"DATE={format_date(date)}")
    print(f"URL={url}")
    print(f"DESCRIPTION={description[:200]}")  # Limit description length
    print(f"LEARNING_POINTS={' | '.join(learning_points)}")
    
    return 0


if __name__ == '__main__':
    sys.exit(main())
