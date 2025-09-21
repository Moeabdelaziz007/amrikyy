// Generate PWA Icons for AuraOS
// This script creates basic SVG icons for the PWA

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create AuraOS logo SVG
const logoSVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="128" fill="url(#gradient)"/>
  <circle cx="256" cy="256" r="120" fill="none" stroke="white" stroke-width="8"/>
  <circle cx="256" cy="256" r="80" fill="none" stroke="white" stroke-width="6"/>
  <circle cx="256" cy="256" r="40" fill="none" stroke="white" stroke-width="4"/>
  <path d="M256 136 L256 200 L320 200 L320 136 Z" fill="white"/>
  <path d="M256 312 L256 376 L320 376 L320 312 Z" fill="white"/>
  <path d="M192 200 L192 264 L256 264 L256 200 Z" fill="white"/>
  <path d="M192 312 L192 376 L256 376 L256 312 Z" fill="white"/>
  <text x="256" y="460" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="48" font-weight="bold">AURA</text>
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#764ba2;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1a73e8;stop-opacity:1" />
    </linearGradient>
  </defs>
</svg>`;

// Create favicon SVG
const faviconSVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="32" height="32" rx="8" fill="url(#favicon-gradient)"/>
  <circle cx="16" cy="16" r="8" fill="none" stroke="white" stroke-width="1"/>
  <circle cx="16" cy="16" r="5" fill="none" stroke="white" stroke-width="0.8"/>
  <circle cx="16" cy="16" r="2.5" fill="none" stroke="white" stroke-width="0.6"/>
  <defs>
    <linearGradient id="favicon-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1a73e8;stop-opacity:1" />
    </linearGradient>
  </defs>
</svg>`;

// Write logo SVG
fs.writeFileSync(path.join(__dirname, 'client/public/icons/auraos-logo.svg'), logoSVG);
fs.writeFileSync(path.join(__dirname, 'client/public/icons/favicon.svg'), faviconSVG);

console.log('✅ AuraOS icons generated successfully!');
console.log('📁 Icons saved to: client/public/icons/');
console.log('🎨 Logo SVG and Favicon SVG created');

console.log('\n📋 Next steps:');
console.log('1. Convert SVG to PNG icons using online tools or ImageMagick');
console.log('2. Add PNG icons to client/public/icons/ directory');
console.log('3. Update manifest.json with correct icon paths');
console.log('4. Test PWA installation and offline functionality');

console.log('\n🔧 Required PNG icon sizes:');
console.log('- icon-72x72.png');
console.log('- icon-96x96.png');
console.log('- icon-128x128.png');
console.log('- icon-144x144.png');
console.log('- icon-152x152.png');
console.log('- icon-192x192.png');
console.log('- icon-384x384.png');
console.log('- icon-512x512.png');
