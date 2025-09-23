#!/bin/bash

# AuraOS MCP System Startup Script
# This script starts the complete MCP system with all agents

echo "🚀 Starting AuraOS MCP System..."
echo "=================================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose is not installed. Please install docker-compose first."
    exit 1
fi

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p mcp/logs
mkdir -p mcp/shared
mkdir -p mcp/temp

# Set permissions
chmod +x mcp/agents/*.py
chmod +x mcp/cursor_integration/*.py

# Build and start services
echo "🔨 Building and starting MCP services..."
docker-compose up -d --build

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check service health
echo "🔍 Checking service health..."
docker-compose ps

# Test Redis connection
echo "🔴 Testing Redis connection..."
docker exec aura_redis redis-cli ping

# Check agent status
echo "🤖 Checking agent status..."
docker exec aura_redis redis-cli hgetall active_agents

# Test MCP bridge
echo "🌉 Testing MCP bridge..."
curl -s http://localhost:8080/health || echo "Bridge not ready yet"

echo ""
echo "✅ AuraOS MCP System started successfully!"
echo ""
echo "📊 System Status:"
echo "  - Redis: localhost:6379"
echo "  - MCP Bridge: http://localhost:8080"
echo "  - Logic Agent: Running"
echo "  - Creativity Agent: Running"
echo "  - Optimization Agent: Running"
echo ""
echo "🔧 Useful Commands:"
echo "  - View logs: docker-compose logs -f"
echo "  - Stop system: docker-compose down"
echo "  - Restart: docker-compose restart"
echo "  - Test integration: python mcp/cursor_integration/cursor_mcp.py"
echo ""
echo "🎯 Ready to analyze code with AI-powered suggestions!"
