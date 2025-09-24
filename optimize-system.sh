#!/bin/bash

# AuraOS System Optimization Script
echo "🚀 AuraOS System Optimization & Next Steps"
echo "=========================================="

# Step 1: Clean up processes
echo "🧹 Cleaning up existing processes..."
pkill -f "vite" 2>/dev/null
pkill -f "tsx watch" 2>/dev/null
pkill -f "npm run dev" 2>/dev/null
sleep 2

# Step 2: Fix configuration issues
echo "🔧 Fixing configuration issues..."
if [ -f "vite.config.js" ]; then
    rm vite.config.js
    echo "✅ Removed conflicting vite.config.js"
fi

if [ ! -f "vite.config.ts" ]; then
    cat > vite.config.ts << 'EOF'
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'esnext',
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('react') || id.includes('react-dom')) {
            return 'react-vendor';
          }
          if (id.includes('@radix-ui') || id.includes('lucide-react')) {
            return 'ui-vendor';
          }
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
  server: {
    port: 5173,
    open: true,
  },
});
EOF
    echo "✅ Created vite.config.ts"
fi

# Step 3: Start optimized development environment
echo "🌐 Starting optimized development environment..."

# Start backend server
echo "📡 Starting backend server..."
cd server
npm run dev > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Wait for backend to start
echo "⏳ Waiting for backend to initialize..."
sleep 5

# Check backend health
if curl -s http://localhost:3001/health > /dev/null 2>&1; then
    echo "✅ Backend server is healthy"
else
    echo "❌ Backend server failed to start"
    echo "Backend logs:"
    tail -10 backend.log
fi

# Start frontend server
echo "🎨 Starting frontend server..."
npm run dev > frontend.log 2>&1 &
FRONTEND_PID=$!

# Wait for frontend to start
echo "⏳ Waiting for frontend to initialize..."
sleep 8

# Check frontend health
if curl -s http://localhost:5173 > /dev/null 2>&1; then
    echo "✅ Frontend server is running on port 5173"
elif curl -s http://localhost:5174 > /dev/null 2>&1; then
    echo "✅ Frontend server is running on port 5174"
elif curl -s http://localhost:5175 > /dev/null 2>&1; then
    echo "✅ Frontend server is running on port 5175"
else
    echo "❌ Frontend server failed to start"
    echo "Frontend logs:"
    tail -10 frontend.log
fi

# Step 4: System Status Report
echo ""
echo "📊 AuraOS System Status Report"
echo "=============================="
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo ""

# Test API endpoints
echo "🔌 Testing API Integration..."
if curl -s http://localhost:3001/health | grep -q "ok"; then
    echo "✅ Backend API: Healthy"
else
    echo "❌ Backend API: Unhealthy"
fi

# Step 5: Next Steps Recommendations
echo ""
echo "🎯 NEXT STEPS RECOMMENDATIONS"
echo "============================="
echo ""
echo "1. 🎨 UI/UX Enhancements:"
echo "   - Add more theme options"
echo "   - Implement dark/light mode toggle"
echo "   - Add animations and transitions"
echo ""
echo "2. 🛠️ MCP Tools Expansion:"
echo "   - Add more AI-powered tools"
echo "   - Implement tool categories"
echo "   - Add tool marketplace"
echo ""
echo "3. 🔐 Authentication System:"
echo "   - Implement user registration"
echo "   - Add OAuth integration"
echo "   - Set up user profiles"
echo ""
echo "4. 📊 Analytics & Monitoring:"
echo "   - Add usage analytics"
echo "   - Implement error tracking"
echo "   - Set up performance monitoring"
echo ""
echo "5. 🚀 Production Deployment:"
echo "   - Deploy backend to cloud"
echo "   - Set up production database"
echo "   - Configure CDN and caching"
echo ""
echo "6. 🤖 AI Features:"
echo "   - Implement AI chat assistant"
echo "   - Add smart recommendations"
echo "   - Set up automated workflows"
echo ""

# Step 6: Quick Access URLs
echo "🌐 Quick Access URLs:"
echo "===================="
echo "Frontend: http://localhost:5173 (or 5174/5175)"
echo "Backend:  http://localhost:3001"
echo "Health:   http://localhost:3001/health"
echo "Deployed: https://aios-97581.web.app"
echo ""

# Step 7: Development Commands
echo "💻 Useful Development Commands:"
echo "=============================="
echo "View backend logs: tail -f backend.log"
echo "View frontend logs: tail -f frontend.log"
echo "Stop all servers: pkill -f 'npm run dev' && pkill -f 'tsx watch'"
echo "Restart backend: cd server && npm run dev"
echo "Restart frontend: npm run dev"
echo "Deploy to Firebase: firebase deploy --only hosting"
echo ""

echo "🎉 AuraOS is now optimized and ready for development!"
echo "Choose your next step from the recommendations above."
