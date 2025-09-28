#!/bin/bash
# 🚀 AuraOS App Launcher Script

echo "🎯 Starting AuraOS Complete Application..."

# Kill any existing processes
echo "🧹 Cleaning up existing processes..."
pkill -f "node.*telegram" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true

# Wait for cleanup
sleep 3

# Start the unified Telegram bot
echo "🤖 Starting Unified Telegram Bot..."
node unified-telegram-bot.js &
BOT_PID=$!

# Wait a moment for bot to initialize
sleep 5

# Start the web dashboard
echo "🌐 Starting Web Dashboard..."
node telegram-bot-dashboard.js &
DASHBOARD_PID=$!

# Wait for dashboard to start
sleep 3

# Build and start the React frontend
echo "⚛️ Building React Frontend..."
npm run build

# Start the preview server
echo "🚀 Starting Frontend Preview..."
npm run preview &
PREVIEW_PID=$!

# Save PIDs for cleanup
echo $BOT_PID > .bot.pid
echo $DASHBOARD_PID > .dashboard.pid
echo $PREVIEW_PID > .preview.pid

echo ""
echo "🎉 AuraOS Application is now running!"
echo ""
echo "📱 Available Services:"
echo "  🤖 Telegram Bot: Running (PID: $BOT_PID)"
echo "  🌐 Web Dashboard: http://localhost:8080 (PID: $DASHBOARD_PID)"
echo "  ⚛️ React Frontend: http://localhost:4173 (PID: $PREVIEW_PID)"
echo ""
echo "🎯 Your complete AuraOS system is ready!"
echo ""
echo "📋 Quick Commands:"
echo "  • Send /start to your Telegram bot"
echo "  • Visit http://localhost:8080 for dashboard"
echo "  • Visit http://localhost:4173 for frontend"
echo ""
echo "⏹️ To stop all services: ./stop-app.sh"
echo ""

# Keep script running
wait
