#!/bin/bash

echo "🚀 Deploying AuraOS to Production..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create environment file if it doesn't exist
if [ ! -f .env ]; then
    print_warning "Creating .env file from template..."
    cat > .env << 'EOF'
# AuraOS Production Environment Variables
NODE_ENV=production
DATABASE_URL=postgresql://postgres:password@db:5432/auraos
REDIS_URL=redis://redis:6379

# Firebase Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email

# API Keys
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
GOOGLE_AI_API_KEY=your-google-ai-key
OPENAI_API_KEY=your-openai-key

# Security
JWT_SECRET=your-super-secret-jwt-key

# Optional: External Services
REDIS_URL=redis://redis:6379
EOF
    print_warning "Please edit .env file with your actual configuration values!"
    exit 1
fi

# Create necessary directories
print_status "Creating necessary directories..."
mkdir -p logs
mkdir -p ssl
mkdir -p grafana/dashboards
mkdir -p grafana/datasources

# Build and start services
print_status "Building and starting services..."
cd server
docker-compose -f docker-compose.production.yml down
docker-compose -f docker-compose.production.yml build --no-cache
docker-compose -f docker-compose.production.yml up -d

# Wait for services to be ready
print_status "Waiting for services to be ready..."
sleep 30

# Check service health
print_status "Checking service health..."
if curl -f http://localhost:3002/health > /dev/null 2>&1; then
    print_status "✅ Backend service is healthy"
else
    print_error "❌ Backend service is not responding"
    docker-compose -f docker-compose.production.yml logs auraos-backend
    exit 1
fi

# Check database connection
print_status "Checking database connection..."
if docker-compose -f docker-compose.production.yml exec -T db pg_isready -U postgres > /dev/null 2>&1; then
    print_status "✅ Database is ready"
else
    print_error "❌ Database is not ready"
    exit 1
fi

# Check Redis connection
print_status "Checking Redis connection..."
if docker-compose -f docker-compose.production.yml exec -T redis redis-cli ping > /dev/null 2>&1; then
    print_status "✅ Redis is ready"
else
    print_error "❌ Redis is not ready"
    exit 1
fi

# Show service status
print_status "Service Status:"
docker-compose -f docker-compose.production.yml ps

# Show logs
print_status "Recent logs:"
docker-compose -f docker-compose.production.yml logs --tail=20

print_status "🎉 AuraOS deployed successfully!"
print_status "🌐 Backend API: http://localhost:3002"
print_status "📊 Grafana Dashboard: http://localhost:3000 (admin/admin)"
print_status "📈 Prometheus: http://localhost:9090"
print_status "🔍 Health Check: http://localhost:3002/health"

echo ""
print_status "To view logs: docker-compose -f docker-compose.production.yml logs -f"
print_status "To stop services: docker-compose -f docker-compose.production.yml down"
print_status "To restart: docker-compose -f docker-compose.production.yml restart"
