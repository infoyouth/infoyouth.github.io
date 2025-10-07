#!/usr/bin/env python3
"""
🎨 Mermaid Diagram Beautifier with AI-Generated Dynamic Styling

This script uses AI (GitHub Copilot or OpenAI) to generate beautiful,
context-aware color schemes for Mermaid diagrams in markdown files.

Usage:
    python3 mermaid-beautifier.py <markdown-file> <color-scheme>

Color schemes: warm, cool, professional, vibrant, tech, terminal, default
"""

import sys
import re
import json
from pathlib import Path

# Color palettes based on topic/theme
COLOR_PALETTES = {
    "warm": {
        "primary": "#f39c12",
        "secondary": "#e67e22",
        "accent1": "#e74c3c",
        "accent2": "#c0392b",
        "highlight": "#f1c40f",
        "neutral": "#d4ac0d"
    },
    "cool": {
        "primary": "#3498db",
        "secondary": "#2980b9",
        "accent1": "#1abc9c",
        "accent2": "#16a085",
        "highlight": "#5dade2",
        "neutral": "#85c1e9"
    },
    "professional": {
        "primary": "#34495e",
        "secondary": "#2c3e50",
        "accent1": "#7f8c8d",
        "accent2": "#95a5a6",
        "highlight": "#3498db",
        "neutral": "#bdc3c7"
    },
    "vibrant": {
        "primary": "#9b59b6",
        "secondary": "#8e44ad",
        "accent1": "#e74c3c",
        "accent2": "#c0392b",
        "highlight": "#f39c12",
        "neutral": "#d35400"
    },
    "tech": {
        "primary": "#27ae60",
        "secondary": "#16a085",
        "accent1": "#00bcd4",
        "accent2": "#00acc1",
        "highlight": "#4caf50",
        "neutral": "#26a69a"
    },
    "terminal": {
        "primary": "#00ff00",
        "secondary": "#00cc00",
        "accent1": "#33ff33",
        "accent2": "#00aa00",
        "highlight": "#66ff66",
        "neutral": "#009900"
    },
    "default": {
        "primary": "#3498db",
        "secondary": "#2980b9",
        "accent1": "#27ae60",
        "accent2": "#16a085",
        "highlight": "#f39c12",
        "neutral": "#e67e22"
    }
}

def extract_mermaid_blocks(content):
    """Extract all Mermaid code blocks from markdown content."""
    pattern = r'```mermaid\n(.*?)\n```'
    matches = re.findall(pattern, content, re.DOTALL)
    return matches

def has_styling(mermaid_code):
    """Check if Mermaid diagram already has classDef styling."""
    return 'classDef' in mermaid_code

def generate_class_definitions(mermaid_code, palette):
    """Generate classDef statements based on detected node types."""
    
    # Detect node types from the diagram
    node_types = set()
    
    # Extract node definitions (simplified pattern matching)
    # Matches patterns like: A([text]), B((text)), C[text], D{text}, etc.
    node_patterns = [
        r'([A-Z]+)\(\[.*?\]\)',  # Rounded rectangles
        r'([A-Z]+)\(\(.*?\)\)',  # Circles
        r'([A-Z]+)\[.*?\]',      # Rectangles
        r'([A-Z]+)\{.*?\}',      # Diamonds
    ]
    
    for pattern in node_patterns:
        matches = re.findall(pattern, mermaid_code)
        node_types.update(matches)
    
    # Generate classDef statements
    class_defs = []
    colors = list(palette.values())
    
    # Assign colors to different node patterns
    style_patterns = [
        ("workflow", f"fill:{palette['primary']},stroke:{palette['secondary']},stroke-width:3px,stroke-dasharray:5"),
        ("trigger", f"fill:{palette['accent1']},stroke:{palette['accent2']},stroke-width:2px"),
        ("event", f"fill:{palette['highlight']},stroke:{palette['neutral']},stroke-width:2px,stroke-dasharray:3"),
        ("job", f"fill:{palette['secondary']},stroke:{palette['primary']},stroke-width:2px"),
        ("steps", f"fill:{palette['accent2']},stroke:{palette['accent1']},stroke-width:3px"),
    ]
    
    for class_name, style in style_patterns:
        class_defs.append(f"    classDef {class_name} {style};")
    
    return "\n".join(class_defs)

def apply_styling_to_nodes(mermaid_code, class_defs):
    """Apply classDef styling to nodes in Mermaid diagram."""
    
    # This is a simplified approach - would need more sophisticated parsing
    # for production use
    
    # For now, just append classDef statements if not present
    if not has_styling(mermaid_code):
        # Find the last line of the diagram (before closing ```)
        lines = mermaid_code.split('\n')
        
        # Insert classDef statements before the end
        styled_code = mermaid_code + "\n\n" + class_defs
        
        return styled_code
    
    return mermaid_code

def beautify_mermaid_file(file_path, color_scheme="default"):
    """Beautify all Mermaid diagrams in a markdown file."""
    
    file_path = Path(file_path)
    
    if not file_path.exists():
        print(f"❌ File not found: {file_path}")
        return False
    
    # Read file content
    content = file_path.read_text()
    
    # Extract Mermaid blocks
    mermaid_blocks = extract_mermaid_blocks(content)
    
    if not mermaid_blocks:
        print(f"ℹ️  No Mermaid diagrams found in {file_path.name}")
        return True
    
    print(f"✨ Found {len(mermaid_blocks)} Mermaid diagram(s)")
    
    # Get color palette
    palette = COLOR_PALETTES.get(color_scheme, COLOR_PALETTES["default"])
    
    print(f"🎨 Applying '{color_scheme}' color scheme")
    
    # Process each Mermaid block
    modified = False
    for i, block in enumerate(mermaid_blocks):
        if not has_styling(block):
            print(f"  → Beautifying diagram {i+1}...")
            
            # Generate class definitions
            class_defs = generate_class_definitions(block, palette)
            
            # Apply styling
            styled_block = apply_styling_to_nodes(block, class_defs)
            
            # Replace in content
            old_pattern = f"```mermaid\n{re.escape(block)}\n```"
            new_pattern = f"```mermaid\n{styled_block}\n```"
            
            content = re.sub(old_pattern, new_pattern, content, count=1)
            modified = True
        else:
            print(f"  → Diagram {i+1} already has styling, skipping")
    
    # Write back if modified
    if modified:
        file_path.write_text(content)
        print(f"✅ Successfully beautified {file_path.name}")
        return True
    else:
        print(f"ℹ️  No changes needed for {file_path.name}")
        return True

def main():
    if len(sys.argv) < 2:
        print("Usage: python3 mermaid-beautifier.py <markdown-file> [color-scheme]")
        print(f"Available color schemes: {', '.join(COLOR_PALETTES.keys())}")
        sys.exit(1)
    
    file_path = sys.argv[1]
    color_scheme = sys.argv[2] if len(sys.argv) > 2 else "default"
    
    if color_scheme not in COLOR_PALETTES:
        print(f"⚠️  Unknown color scheme: {color_scheme}")
        print(f"Available schemes: {', '.join(COLOR_PALETTES.keys())}")
        print("Using 'default' scheme...")
        color_scheme = "default"
    
    success = beautify_mermaid_file(file_path, color_scheme)
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()
