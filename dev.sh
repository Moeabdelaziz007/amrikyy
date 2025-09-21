#!/bin/bash

# AuraOS Development Server Startup Script
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if ports are available
check_ports() {
    log_info "Checking port availability..."

    if lsof -i :3000 >/dev/null 2>&1; then
        log_warning "Port 3000 is already in use. Killing existing process..."
        kill $(lsof -t -i :3000) 2>/dev/null || true
        sleep 2
    fi

    if lsof -i :3001 >/dev/null 2>&1; then
        log_warning "Port 3001 is already in use. Killing existing process..."
        kill $(lsof -t -i :3001) 2>/dev/null || true
        sleep 2
    fi

    log_success "Ports are available"
}

# Start backend server
start_backend() {
    log_info "Starting AuraOS Backend Server..."
    NODE_ENV=development npm run dev
}

# Start frontend server
start_frontend() {
    log_info "Starting AuraOS Frontend Server..."
    cd client && npm run dev &
    FRONTEND_PID=$!
    cd ..
    echo $FRONTEND_PID > .frontend.pid
}

# Show development URLs
show_urls() {
    echo ""
    log_success "🎉 AuraOS Development Servers Started!"
    echo ""
    echo "📱 Frontend (React):     http://localhost:3000"
    echo "🔧 Backend API:          http://localhost:3001"
    echo "📊 Health Check:         http://localhost:3001/health"
    echo "🔌 WebSocket:           ws://localhost:3001/ws/automation"
    echo ""
    echo "📧 Default Login:"
    echo "   • Email: admin@auraos.com"
    echo "   • Password: admin123"
    echo "   • OR use Guest Mode (no login required)"
    echo ""
    echo "🛑 To stop servers: Ctrl+C"
}

# Cleanup function
cleanup() {
    log_info "Stopping development servers..."

    # Kill frontend server if running
    if [ -f .frontend.pid ]; then
        kill $(cat .frontend.pid) 2>/dev/null || true
        rm .frontend.pid
    fi

    log_success "Development servers stopped"
    exit 0
}

# Main execution
main() {
    echo "🚀 Starting AuraOS Development Environment"
    echo "=========================================="

    check_ports
    start_backend

    # Wait a moment for backend to start
    log_info "Waiting for backend to initialize..."
    sleep 3

    # Check if backend is healthy
    if curl -f http://localhost:3001/health >/dev/null 2>&1; then
        log_success "Backend server is healthy!"
        start_frontend
        show_urls
    else
        log_error "Backend server failed to start properly"
        exit 1
    fi

    # Wait for interrupt
    trap cleanup INT TERM
    wait
}

# Run main function
main
