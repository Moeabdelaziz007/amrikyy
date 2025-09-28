#!/bin/bash
# ⏹️ AuraOS App Stopper Script

echo "⏹️ Stopping AuraOS Application..."

# Stop processes by PID if files exist
if [ -f .bot.pid ]; then
    BOT_PID=$(cat .bot.pid)
    echo "🤖 Stopping Telegram Bot (PID: $BOT_PID)..."
    kill $BOT_PID 2>/dev/null || true
    rm .bot.pid
fi

if [ -f .dashboard.pid ]; then
    DASHBOARD_PID=$(cat .dashboard.pid)
    echo "🌐 Stopping Web Dashboard (PID: $DASHBOARD_PID)..."
    kill $DASHBOARD_PID 2>/dev/null || true
    rm .dashboard.pid
fi

if [ -f .preview.pid ]; then
    PREVIEW_PID=$(cat .preview.pid)
    echo "⚛️ Stopping Frontend Preview (PID: $PREVIEW_PID)..."
    kill $PREVIEW_PID 2>/dev/null || true
    rm .preview.pid
fi

# Kill any remaining processes
echo "🧹 Cleaning up remaining processes..."
pkill -f "node.*telegram" 2>/dev/null || true
pkill -f "node.*dashboard" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true

echo "✅ All AuraOS services stopped successfully!"
echo ""
echo "🚀 To restart: ./launch-app.sh"
