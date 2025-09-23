#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Read the premium SVG content
const logoSVG = fs.readFileSync(
  path.join(__dirname, 'auraos-logo.svg'),
  'utf8'
);

const faviconSVG = fs.readFileSync(
  path.join(__dirname, 'favicon.svg'),
  'utf8'
);

// Create HTML templates for each icon size
function generateIconHTML(size, filename, svgContent) {
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { 
      margin: 0; 
      padding: 0; 
      background: transparent; 
      width: ${size}px; 
      height: ${size}px; 
      overflow: hidden;
    }
    .icon-container { 
      width: ${size}px; 
      height: ${size}px; 
      display: flex; 
      align-items: center; 
      justify-content: center;
    }
    svg {
      width: ${size}px;
      height: ${size}px;
    }
  </style>
</head>
<body>
  <div class="icon-container">
    ${svgContent.replace('width="512" height="512"', `width="${size}" height="${size}"`).replace('width="32" height="32"', `width="${size}" height="${size}"`)}
  </div>
</body>
</html>`;

  fs.writeFileSync(
    path.join(__dirname, `${filename.replace('.png', '.html')}`),
    htmlContent
  );
  console.log(`✅ Generated HTML template for ${filename}`);
}

// Generate all icon sizes
console.log('🎨 Generating premium AuraOS icons...\n');

// Generate main logo icons
iconSizes.forEach(({ size, name }) => {
  generateIconHTML(size, name, logoSVG);
});

// Generate favicon-specific icons
const faviconSizes = [
  { size: 16, name: 'favicon-16x16.html' },
  { size: 32, name: 'favicon-32x32.html' },
];

faviconSizes.forEach(({ size, name }) => {
  generateIconHTML(size, name, faviconSVG);
});

console.log('\n🎉 Premium icon generation complete!');
console.log('\n📋 Next steps:');
console.log('1. Open each HTML file in a browser');
console.log('2. Use browser dev tools to capture screenshots');
console.log('3. Save as PNG files with the corresponding names');
console.log('4. Or use online SVG to PNG converters');
console.log('\n💡 Recommended tools:');
console.log('- https://convertio.co/svg-png/');
console.log('- https://cloudconvert.com/svg-to-png');
console.log('- Browser screenshot tools');
console.log('\n🎨 Premium features included:');
console.log('- Multi-stop gradient backgrounds');
console.log('- Advanced glow and shadow effects');
console.log('- Animated data flow particles');
console.log('- Professional typography');
console.log('- Neural network AI symbolism');
console.log('- Modern glassmorphism styling');
