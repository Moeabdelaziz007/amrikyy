#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Icon sizes needed for PWA and favicon
const iconSizes = [
  { size: 16, name: 'icon-16x16.png' },
  { size: 32, name: 'icon-32x32.png' },
  { size: 72, name: 'icon-72x72.png' },
  { size: 96, name: 'icon-96x96.png' },
  { size: 128, name: 'icon-128x128.png' },
  { size: 144, name: 'icon-144x144.png' },
  { size: 152, name: 'icon-152x152.png' },
  { size: 192, name: 'icon-192x192.png' },
  { size: 384, name: 'icon-384x384.png' },
  { size: 512, name: 'icon-512x512.png' },
];

// Read the SVG content
const svgContent = fs.readFileSync(
  path.join(__dirname, 'auraos-logo.svg'),
  'utf8'
);

// Create a simple PNG generator using Canvas (if available) or fallback to base64
function generatePNGIcon(size, filename) {
  // For now, we'll create a simple HTML file that can be used to generate PNGs
  // This is a fallback approach since we don't have canvas available in this environment

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { margin: 0; padding: 0; background: transparent; }
    .icon-container { 
      width: ${size}px; 
      height: ${size}px; 
      display: flex; 
      align-items: center; 
      justify-content: center;
    }
  </style>
</head>
<body>
  <div class="icon-container">
    ${svgContent.replace('width="512" height="512"', `width="${size}" height="${size}"`)}
  </div>
</body>
</html>`;

  fs.writeFileSync(
    path.join(__dirname, `${filename.replace('.png', '.html')}`),
    htmlContent
  );
  console.log(`Generated HTML template for ${filename}`);
}

// Generate all icon sizes
iconSizes.forEach(({ size, name }) => {
  generatePNGIcon(size, name);
});

console.log('Icon generation complete!');
console.log(
  'Note: To convert HTML templates to PNG, use a tool like Puppeteer or screenshot the HTML files.'
);
