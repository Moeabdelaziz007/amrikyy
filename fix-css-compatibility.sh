#!/bin/bash

# Fix CSS compatibility issues across all files
echo "🔧 Fixing CSS compatibility issues..."

# Fix backdrop-filter compatibility
echo "📱 Adding -webkit-backdrop-filter prefixes..."

find src/styles -name "*.css" -exec sed -i '' 's/backdrop-filter: blur([0-9]\+px);/-webkit-backdrop-filter: &;\n  backdrop-filter: &;/g' {} \;
find src/styles -name "*.css" -exec sed -i '' 's/backdrop-filter: blur([0-9]\+\.[0-9]\+px);/-webkit-backdrop-filter: &;\n  backdrop-filter: &;/g' {} \;

# Fix background-clip compatibility
echo "🎨 Adding -webkit-background-clip prefixes..."
find src/styles -name "*.css" -exec sed -i '' 's/background-clip: text;/-webkit-background-clip: text;\n  background-clip: text;/g' {} \;

# Fix appearance property order
echo "🔧 Fixing appearance property order..."
find src/styles -name "*.css" -exec sed -i '' 's/appearance: none;/-webkit-appearance: none;\n  appearance: none;/g' {} \;

echo "✅ CSS compatibility fixes applied!"
