#!/bin/bash
# ⏹️ AuraOS Autopilot Application Stopper

echo "⏹️ Stopping AuraOS Autopilot Application..."

# Stop processes by PID if files exist
if [ -f .autopilot.pid ]; then
    AUTOPILOT_PID=$(cat .autopilot.pid)
    echo "🤖 Stopping Autopilot Bot (PID: $AUTOPILOT_PID)..."
    kill $AUTOPILOT_PID 2>/dev/null || true
    rm .autopilot.pid
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
pkill -f "node.*autopilot" 2>/dev/null || true
pkill -f "node.*dashboard" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true

echo "✅ All AuraOS Autopilot services stopped successfully!"
echo ""
echo "🚀 To restart: ./launch-autopilot.sh"
