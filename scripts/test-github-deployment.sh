#!/bin/bash

# GitHub Pages Deployment Test Script
# Tests that all AI tools work properly in GitHub Pages environment

echo "🚀 Testing Amrikyy AI Tools for GitHub Pages Deployment"
echo "=================================================="

# Set colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print status
print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
    fi
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

# Check if we're in the frontend directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the frontend directory"
    exit 1
fi

print_info "Checking Next.js configuration for GitHub Pages..."

# Check if next.config.js has proper GitHub Pages settings
if grep -q "output.*export" next.config.js; then
    print_status 0 "Static export enabled"
else
    print_status 1 "Static export not configured"
fi

if grep -q "trailingSlash.*true" next.config.js; then
    print_status 0 "Trailing slash enabled"
else
    print_status 1 "Trailing slash not enabled"
fi

if grep -q "basePath.*amrikyy-ai" next.config.js; then
    print_status 0 "Base path configured for GitHub Pages"
else
    print_status 1 "Base path not configured"
fi

print_info "Testing build process..."

# Test the build
npm run build > /dev/null 2>&1
if [ $? -eq 0 ]; then
    print_status 0 "Build completed successfully"
else
    print_status 1 "Build failed - check for TypeScript errors"
    echo "Running build with verbose output:"
    npm run build
    exit 1
fi

print_info "Checking for static files..."

# Check if out directory exists
if [ -d "out" ]; then
    print_status 0 "Static export directory created"
else
    print_status 1 "Static export directory not found"
    exit 1
fi

# Check for essential files
files_to_check=(
    "out/index.html"
    "out/ai-tools/index.html"
    "out/linkedin-generator/index.html"
    "out/quantum-id-generator/index.html"
    "out/analytics-dashboard/index.html"
    "out/_next/static"
)

for file in "${files_to_check[@]}"; do
    if [ -e "$file" ]; then
        print_status 0 "Found: $file"
    else
        print_status 1 "Missing: $file"
    fi
done

print_info "Checking API routes functionality..."

# Check if API routes are properly configured for static export
api_routes=(
    "src/app/api/news/route.ts"
    "src/app/api/generate-post/route.ts"
    "src/app/api/analytics-data/route.ts"
    "src/app/api/quantum-analysis/route.ts"
)

for route in "${api_routes[@]}"; do
    if [ -f "$route" ]; then
        # Check for mock data fallbacks
        if grep -q "mock\|fallback\|demo" "$route"; then
            print_status 0 "API route has fallback: $route"
        else
            print_status 1 "API route missing fallback: $route"
        fi
    else
        print_status 1 "Missing API route: $route"
    fi
done

print_info "Checking component error handling..."

# Check components for error handling
components=(
    "src/components/linkedin/linkedin-generator.tsx"
    "src/components/quantum/quantum-id-generator.tsx"
    "src/components/analytics/smart-analytics-dashboard.tsx"
)

for component in "${components[@]}"; do
    if [ -f "$component" ]; then
        if grep -q "try.*catch\|catch.*error" "$component"; then
            print_status 0 "Error handling found: $component"
        else
            print_status 1 "No error handling: $component"
        fi
    else
        print_status 1 "Missing component: $component"
    fi
done

print_info "Testing file sizes..."

# Check if bundle sizes are reasonable for GitHub Pages
if [ -d "out/_next/static" ]; then
    js_size=$(du -sh out/_next/static/chunks/*.js 2>/dev/null | awk '{sum+=$1} END {print sum}' || echo "0")
    css_size=$(du -sh out/_next/static/css/*.css 2>/dev/null | awk '{sum+=$1} END {print sum}' || echo "0")
    
    print_info "JavaScript bundle size: ${js_size}KB (approx)"
    print_info "CSS bundle size: ${css_size}KB (approx)"
fi

print_info "Validating HTML structure..."

# Check if HTML files are properly formed
if [ -f "out/index.html" ]; then
    if grep -q "<html" out/index.html && grep -q "</html>" out/index.html; then
        print_status 0 "Main HTML structure valid"
    else
        print_status 1 "Main HTML structure invalid"
    fi
fi

print_info "GitHub Pages deployment checklist:"
echo ""
echo "📋 Pre-deployment checklist:"
echo "   □ All AI tools have fallback data for demo purposes"
echo "   □ No external API dependencies block functionality"
echo "   □ Error handling prevents crashes"
echo "   □ Loading states provide good UX"
echo "   □ Static export builds successfully"
echo "   □ File sizes are optimized for web delivery"
echo ""
echo "🔧 To deploy to GitHub Pages:"
echo "   1. Push changes to main branch"
echo "   2. GitHub Actions will automatically build and deploy"
echo "   3. Site will be available at: https://cryptojoker710.github.io/amrikyy-ai/"
echo ""
echo "🛠️  Local testing:"
echo "   1. Run 'npm run build' to test build"
echo "   2. Serve 'out' directory with any static server"
echo "   3. Test all AI tools functionality"
echo ""

print_info "Deployment test completed!"

# Clean up
print_info "Cleaning up build artifacts..."
rm -rf out

echo -e "${GREEN}🎉 GitHub Pages deployment test finished!${NC}"
