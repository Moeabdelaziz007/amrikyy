#!/bin/bash
# 🚀 AuraOS Autopilot Application Launcher

echo "🚀 Starting AuraOS Autopilot Application..."

# Kill any existing processes
echo "🧹 Cleaning up existing processes..."
pkill -f "node.*telegram" 2>/dev/null || true
pkill -f "node.*autopilot" 2>/dev/null || true

# Wait for cleanup
sleep 3

# Start the autopilot application
echo "🤖 Starting Autopilot Application..."
node autopilot-app.js &
AUTOPILOT_PID=$!

# Save PID for cleanup
echo $AUTOPILOT_PID > .autopilot.pid

# Wait for autopilot to initialize
sleep 5

# Start the web dashboard
echo "🌐 Starting Web Dashboard..."
node telegram-bot-dashboard.js &
DASHBOARD_PID=$!

# Save PID for cleanup
echo $DASHBOARD_PID > .dashboard.pid

# Wait for dashboard to start
sleep 3

# Build and start the React frontend
echo "⚛️ Building React Frontend..."
npm run build

# Start the preview server
echo "🚀 Starting Frontend Preview..."
npm run preview &
PREVIEW_PID=$!

# Save PID for cleanup
echo $PREVIEW_PID > .preview.pid

echo ""
echo "🎉 AuraOS Autopilot Application is now running!"
echo ""
echo "📱 Available Services:"
echo "  🤖 Autopilot Bot: Running (PID: $AUTOPILOT_PID)"
echo "  🌐 Web Dashboard: http://localhost:8080 (PID: $DASHBOARD_PID)"
echo "  ⚛️ React Frontend: http://localhost:4173 (PID: $PREVIEW_PID)"
echo ""
echo "🎯 Your complete AuraOS Autopilot system is ready!"
echo ""
echo "📋 Quick Commands:"
echo "  • Send /start to your Telegram bot"
echo "  • Send /autopilot to enable autopilot mode"
echo "  • Visit http://localhost:8080 for dashboard"
echo "  • Visit http://localhost:4173 for frontend"
echo ""
echo "🧠 Autopilot Features:"
echo "  • AI-powered automation"
echo "  • Intelligent decision making"
echo "  • Smart learning algorithms"
echo "  • Predictive analytics"
echo "  • System optimization"
echo "  • Real-time monitoring"
echo ""
echo "⏹️ To stop all services: ./stop-autopilot.sh"
echo ""

# Keep script running
wait
