#!/bin/bash

# AuraOS Day 1 - Quick Deploy Script
# This script deploys the Day 1 implementation for testing

echo "🚀 AuraOS Day 1 - Deploying for Testing..."

# Check if we're in the right directory
if [ ! -f "test-dashboard.html" ]; then
    echo "❌ Error: test-dashboard.html not found. Please run from AuraOS root directory."
    exit 1
fi

# Create a simple HTTP server for testing
echo "📡 Starting local test server..."

# Check if Python is available
if command -v python3 &> /dev/null; then
    echo "🐍 Using Python 3 HTTP server..."
    echo "🌐 Dashboard available at: http://localhost:8000/test-dashboard.html"
    echo "📱 Mobile test: http://$(hostname -I | awk '{print $1}'):8000/test-dashboard.html"
    echo ""
    echo "Press Ctrl+C to stop the server"
    python3 -m http.server 8000
elif command -v python &> /dev/null; then
    echo "🐍 Using Python HTTP server..."
    echo "🌐 Dashboard available at: http://localhost:8000/test-dashboard.html"
    echo "📱 Mobile test: http://$(hostname -I | awk '{print $1}'):8000/test-dashboard.html"
    echo ""
    echo "Press Ctrl+C to stop the server"
    python -m SimpleHTTPServer 8000
elif command -v node &> /dev/null; then
    echo "🟢 Using Node.js HTTP server..."
    echo "🌐 Dashboard available at: http://localhost:8000/test-dashboard.html"
    echo "📱 Mobile test: http://$(hostname -I | awk '{print $1}'):8000/test-dashboard.html"
    echo ""
    echo "Press Ctrl+C to stop the server"
    npx http-server -p 8000
else
    echo "❌ No HTTP server found. Please install Python or Node.js"
    echo "💡 Alternative: Open test-dashboard.html directly in your browser"
    exit 1
fi
