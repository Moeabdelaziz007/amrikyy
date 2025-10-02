#!/usr/bin/env python3
"""
AuraOS Icon Generator
Generates high-quality PNG icons from SVG for PWA and favicon use.
"""

import os
import base64
from io import BytesIO

# Icon sizes needed for PWA and favicon
ICON_SIZES = [
    (16, 'icon-16x16.png'),
    (32, 'icon-32x32.png'),
    (72, 'icon-72x72.png'),
    (96, 'icon-96x96.png'),
    (128, 'icon-128x128.png'),
    (144, 'icon-144x144.png'),
    (152, 'icon-152x152.png'),
    (192, 'icon-192x192.png'),
    (384, 'icon-384x384.png'),
    (512, 'icon-512x512.png')
]

def create_simple_png_icon(size, filename):
    """
    Create a simple PNG icon using PIL/Pillow
    This creates a basic icon with the AuraOS branding colors
    """
    try:
        from PIL import Image, ImageDraw
        
        # Create a new image with transparent background
        img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)
        
        # Calculate dimensions
        center = size // 2
        hex_radius = int(size * 0.3)
        
        # Draw background circle with gradient effect
        bg_radius = int(size * 0.45)
        draw.ellipse([center - bg_radius, center - bg_radius, 
                     center + bg_radius, center + bg_radius], 
                    fill=(99, 102, 241, 200))  # Primary blue with transparency
        
        # Draw hexagon
        hex_points = []
        for i in range(6):
            angle = i * 60 * 3.14159 / 180
            x = center + int(hex_radius * 0.8 * cos(angle))
            y = center + int(hex_radius * 0.8 * sin(angle))
            hex_points.append((x, y))
        
        draw.polygon(hex_points, fill=(255, 255, 255, 255), outline=(6, 182, 212, 255))
        
        # Draw central AI node
        node_radius = max(2, size // 16)
        draw.ellipse([center - node_radius, center - node_radius,
                     center + node_radius, center + node_radius],
                    fill=(6, 182, 212, 255))
        
        # Save the image
        img.save(filename, 'PNG')
        print(f"Generated {filename}")
        
    except ImportError:
        print("PIL/Pillow not available. Creating placeholder files...")
        # Create a simple text file as placeholder
        with open(filename.replace('.png', '.txt'), 'w') as f:
            f.write(f"AuraOS Icon {size}x{size}\n")
            f.write("Generated placeholder - convert SVG to PNG manually\n")

def cos(angle):
    """Simple cosine approximation"""
    import math
    return math.cos(angle)

def sin(angle):
    """Simple sine approximation"""
    import math
    return math.sin(angle)

def main():
    """Generate all required icon sizes"""
    print("Generating AuraOS icons...")
    
    for size, filename in ICON_SIZES:
        create_simple_png_icon(size, filename)
    
    print("Icon generation complete!")
    print("\nNote: If PIL/Pillow is not installed, install it with:")
    print("pip install Pillow")
    print("\nOr manually convert the SVG files to PNG using:")
    print("- Online SVG to PNG converters")
    print("- Inkscape: inkscape --export-png=icon-512x512.png --export-width=512 --export-height=512 auraos-logo.svg")
    print("- ImageMagick: convert auraos-logo.svg -resize 512x512 icon-512x512.png")

if __name__ == "__main__":
    main()
