#!/usr/bin/env python3
"""
Generate Open Graph (OG) card images for blog posts using Playwright
"""

import sys
import os
from pathlib import Path
from playwright.sync_api import sync_playwright


# Category-specific color schemes and icons
CATEGORY_THEMES = {
    'python': {
        'gradient_start': '#3776AB',
        'gradient_end': '#FFD43B',
        'icon': '🐍'
    },
    'javascript': {
        'gradient_start': '#F7DF1E',
        'gradient_end': '#000000',
        'icon': '⚡'
    },
    'java': {
        'gradient_start': '#EA2D2E',
        'gradient_end': '#F89820',
        'icon': '☕'
    },
    'go': {
        'gradient_start': '#00ADD8',
        'gradient_end': '#00A29C',
        'icon': '🚀'
    },
    'devops': {
        'gradient_start': '#6E4C9A',
        'gradient_end': '#2088FF',
        'icon': '🔧'
    },
    'c-programming': {
        'gradient_start': '#A8B9CC',
        'gradient_end': '#283593',
        'icon': '⚙️'
    },
    'cpp-programming': {
        'gradient_start': '#00599C',
        'gradient_end': '#004482',
        'icon': '⚙️'
    },
    'shell-scripting': {
        'gradient_start': '#4EAA25',
        'gradient_end': '#89E051',
        'icon': '📜'
    },
    'angular': {
        'gradient_start': '#DD0031',
        'gradient_end': '#C3002F',
        'icon': '🅰️'
    },
    'default': {
        'gradient_start': '#667eea',
        'gradient_end': '#764ba2',
        'icon': '📚'
    }
}


def get_category_theme(category):
    """Get color theme for category"""
    category_key = category.lower().replace(' ', '-')
    return CATEGORY_THEMES.get(category_key, CATEGORY_THEMES['default'])


def generate_tags_html(tags):
    """Generate HTML for tags - REMOVED to keep OG image clean"""
    # Tags are now only in tweet text, not on the image
    return ""


def generate_learning_points_html(learning_points):
    """Generate HTML for learning points"""
    if not learning_points:
        return '<li>Core concepts and fundamentals</li>\n                    <li>Practical examples</li>\n                    <li>Best practices</li>'
    
    points_list = learning_points.split('|') if isinstance(learning_points, str) else learning_points
    points_html = []
    
    for point in points_list[:3]:  # Max 3 points
        point = point.strip()
        if point:
            points_html.append(f'<li>{point}</li>')
    
    return '\n                    '.join(points_html)


def generate_og_image(title, category, tags, date, learning_points, output_path):
    """
    Generate OG card image using Playwright
    
    Args:
        title: Post title
        category: Post category
        tags: Comma-separated tags or list
        date: Formatted date string
        learning_points: Pipe-separated learning points or list
        output_path: Where to save the PNG
    """
    # Get category theme
    theme = get_category_theme(category)
    
    # Load HTML template
    template_path = Path(__file__).parent / 'templates' / 'og-card.html'
    
    if not template_path.exists():
        print(f"❌ Template not found: {template_path}", file=sys.stderr)
        return False
    
    with open(template_path, 'r', encoding='utf-8') as f:
        template = f.read()
    
    # Replace placeholders (avoid format() due to CSS curly braces)
    html = template
    html = html.replace('{title}', title)
    html = html.replace('{category}', category.upper())
    html = html.replace('{category_icon}', theme['icon'])
    html = html.replace('{learning_points_html}', generate_learning_points_html(learning_points))
    html = html.replace('{tags_html}', generate_tags_html(tags))
    html = html.replace('{date}', date)
    html = html.replace('{gradient_start}', theme['gradient_start'])
    html = html.replace('{gradient_end}', theme['gradient_end'])
    
    # Generate image with Playwright
    try:
        with sync_playwright() as p:
            print("🌐 Launching browser...")
            browser = p.chromium.launch(headless=True)
            page = browser.new_page(viewport={'width': 1200, 'height': 630})
            
            print("📄 Loading HTML template...")
            page.set_content(html, wait_until='networkidle')
            
            # Wait longer for fonts to load (increased for CI environment)
            print("⏳ Waiting for fonts and rendering...")
            page.wait_for_timeout(3000)  # Increased from 1000ms to 3000ms
            
            # Verify content is rendered
            title_element = page.locator('.title')
            if title_element.count() == 0:
                print("⚠️  Warning: Title element not found, rendering may be incomplete")
            
            print(f"📸 Taking screenshot...")
            page.screenshot(path=output_path, type='png', full_page=True)
            
            browser.close()
            
        print(f"✅ OG image generated: {output_path}")
        
        # Verify file was created and has content
        if os.path.exists(output_path):
            file_size = os.path.getsize(output_path)
            print(f"📊 Image size: {file_size} bytes")
            if file_size < 1000:
                print("⚠️  Warning: Image file is suspiciously small")
                return False
        else:
            print("❌ Image file was not created")
            return False
            
        return True
        
    except Exception as e:
        print(f"❌ Error generating image: {e}", file=sys.stderr)
        return False


def main():
    if len(sys.argv) < 7:
        print("Usage: python generate_og_image.py <title> <category> <tags> <date> <learning_points> <output_path>")
        print("Example: python generate_og_image.py 'Python Decorators' 'Python' 'python,decorators' 'Nov 5, 2025' 'Point 1|Point 2|Point 3' 'output.png'")
        sys.exit(1)
    
    title = sys.argv[1]
    category = sys.argv[2]
    tags = sys.argv[3]
    date = sys.argv[4]
    learning_points = sys.argv[5]
    output_path = sys.argv[6]
    
    # Ensure output directory exists
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    success = generate_og_image(title, category, tags, date, learning_points, output_path)
    
    sys.exit(0 if success else 1)


if __name__ == '__main__':
    main()
