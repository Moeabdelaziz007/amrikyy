#!/bin/bash

echo "🚀 Starting AuraOS Development Environment (No Docker)"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
print_status "Checking prerequisites..."

if ! command_exists node; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi

if ! command_exists npm; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

print_status "✅ Node.js version: $(node --version)"
print_status "✅ npm version: $(npm --version)"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    print_status "Installing dependencies..."
    npm install
fi

# Check if express is available for mock backend
if ! npm list express >/dev/null 2>&1; then
    print_status "Installing mock backend dependencies..."
    npm install express cors
fi

# Create a simple package.json script for development
print_status "Setting up development scripts..."

# Add development scripts to package.json if they don't exist
if ! grep -q '"dev:frontend"' package.json; then
    print_status "Adding development scripts to package.json..."
    # This is a simple way to add scripts - in a real scenario you'd use a JSON manipulation tool
    print_warning "Please manually add these scripts to your package.json:"
    echo "  \"dev:frontend\": \"vite --host 0.0.0.0 --port 3000\","
    echo "  \"dev:backend\": \"node mock-backend.js\","
    echo "  \"dev:full\": \"concurrently \\\"npm run dev:backend\\\" \\\"npm run dev:frontend\\\"\""
fi

# Start the mock backend
print_info "Starting mock backend server..."
print_info "Backend will be available at: http://localhost:3002"
print_info "API endpoints:"
print_info "  - GET /health - Health check"
print_info "  - GET /api/v1/tasks - Get all tasks"
print_info "  - POST /api/v1/tasks/:id/start - Start a task"
print_info "  - POST /api/v1/tasks/:id/pause - Pause a task"
print_info "  - POST /api/v1/tasks/:id/cancel - Cancel a task"
print_info "  - DELETE /api/v1/tasks/:id - Delete a task"

# Start mock backend in background
node mock-backend.js &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 2

# Test backend health
print_status "Testing backend health..."
if curl -s http://localhost:3002/health > /dev/null; then
    print_status "✅ Backend is healthy"
else
    print_warning "⚠️  Backend health check failed, but continuing..."
fi

# Start frontend
print_info "Starting frontend development server..."
print_info "Frontend will be available at: http://localhost:3000"
print_info "Press Ctrl+C to stop both servers"

# Function to cleanup on exit
cleanup() {
    print_info "Shutting down servers..."
    kill $BACKEND_PID 2>/dev/null
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Start frontend
npx vite --host 0.0.0.0 --port 3000

# Cleanup when frontend stops
cleanup
