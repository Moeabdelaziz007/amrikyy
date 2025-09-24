#!/bin/bash
# A2A System Quick Start Script
# سكريبت البدء السريع لنظام A2A

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if port is in use
port_in_use() {
    lsof -i :$1 >/dev/null 2>&1
}

# Function to wait for service
wait_for_service() {
    local url=$1
    local max_attempts=30
    local attempt=1
    
    print_status "Waiting for service at $url..."
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s -f "$url" >/dev/null 2>&1; then
            print_success "Service is ready!"
            return 0
        fi
        
        print_status "Attempt $attempt/$max_attempts - waiting..."
        sleep 2
        attempt=$((attempt + 1))
    done
    
    print_error "Service failed to start after $max_attempts attempts"
    return 1
}

# Main function
main() {
    echo "🚀 AuraOS A2A System Quick Start"
    echo "================================="
    echo ""
    
    # Check prerequisites
    print_status "Checking prerequisites..."
    
    if ! command_exists docker; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command_exists docker-compose; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    if ! command_exists curl; then
        print_error "curl is not installed. Please install curl first."
        exit 1
    fi
    
    print_success "All prerequisites are met!"
    
    # Check if ports are available
    print_status "Checking port availability..."
    
    local ports=(3001 3002 3003 3004 3005 6379 5672 15672 27017 9090 3000)
    local occupied_ports=()
    
    for port in "${ports[@]}"; do
        if port_in_use $port; then
            occupied_ports+=($port)
        fi
    done
    
    if [ ${#occupied_ports[@]} -gt 0 ]; then
        print_warning "The following ports are already in use: ${occupied_ports[*]}"
        print_warning "Please stop the services using these ports or modify the configuration."
        read -p "Do you want to continue anyway? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_error "Aborted by user"
            exit 1
        fi
    fi
    
    print_success "Ports are available!"
    
    # Create necessary directories
    print_status "Creating necessary directories..."
    mkdir -p logs
    mkdir -p data/redis
    mkdir -p data/rabbitmq
    mkdir -p data/mongodb
    mkdir -p data/prometheus
    mkdir -p data/grafana
    print_success "Directories created!"
    
    # Check environment file
    if [ ! -f .env ]; then
        print_status "Creating environment file..."
        cat > .env << EOF
# A2A System Environment Variables
NODE_ENV=development

# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
TELEGRAM_WEBHOOK_URL=https://your-domain.com/api/a2a/webhook/telegram

# Test Configuration
TEST_API_KEY=test_api_key_123

# Security
JWT_SECRET=auraos-a2a-super-secret-key-change-in-production
WEBHOOK_SECRET=default-webhook-secret-change-me

# Database
MONGODB_USERNAME=admin
MONGODB_PASSWORD=admin123
MONGODB_DATABASE=auraos_a2a

# Redis
REDIS_PASSWORD=

# RabbitMQ
RABBITMQ_USERNAME=admin
RABBITMQ_PASSWORD=admin123

# Monitoring
GRAFANA_ADMIN_PASSWORD=admin123
EOF
        print_warning "Environment file created with default values."
        print_warning "Please update .env file with your actual configuration before proceeding."
        read -p "Do you want to continue with default values? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_error "Please update .env file and run the script again."
            exit 1
        fi
    fi
    
    # Start services
    print_status "Starting A2A System services..."
    
    # Pull latest images
    print_status "Pulling Docker images..."
    docker-compose -f docker-compose.dev.yml pull
    
    # Build and start services
    print_status "Building and starting services..."
    docker-compose -f docker-compose.dev.yml up -d --build
    
    # Wait for services to be ready
    print_status "Waiting for services to be ready..."
    
    # Wait for API Gateway
    if wait_for_service "http://localhost:3001/api/health"; then
        print_success "API Gateway is ready!"
    else
        print_error "API Gateway failed to start"
        docker-compose -f docker-compose.dev.yml logs api-gateway
        exit 1
    fi
    
    # Wait for Autopilot Service
    if wait_for_service "http://localhost:3002/health"; then
        print_success "Autopilot Service is ready!"
    else
        print_warning "Autopilot Service may not be ready yet"
    fi
    
    # Wait for Telegram Bot
    if wait_for_service "http://localhost:3003/health"; then
        print_success "Telegram Bot is ready!"
    else
        print_warning "Telegram Bot may not be ready yet"
    fi
    
    # Wait for Grafana
    if wait_for_service "http://localhost:3000"; then
        print_success "Grafana is ready!"
    else
        print_warning "Grafana may not be ready yet"
    fi
    
    # Display service information
    echo ""
    echo "🎉 A2A System is now running!"
    echo "================================"
    echo ""
    echo "📊 Service URLs:"
    echo "  • API Gateway:     http://localhost:3001"
    echo "  • Autopilot:       http://localhost:3002"
    echo "  • Telegram Bot:    http://localhost:3003"
    echo "  • Test App:        http://localhost:3005"
    echo "  • Grafana:         http://localhost:3000 (admin/admin123)"
    echo "  • Prometheus:      http://localhost:9090"
    echo "  • RabbitMQ Mgmt:  http://localhost:15672 (admin/admin123)"
    echo ""
    echo "🔗 WebSocket:"
    echo "  • Gateway WS:      ws://localhost:3004/ws/a2a"
    echo ""
    echo "📚 Documentation:"
    echo "  • API Docs:        http://localhost:3001/api/docs"
    echo "  • OpenAPI Spec:    ./docs/openapi.yaml"
    echo "  • README:          ./README-A2A-SYSTEM.md"
    echo ""
    echo "🧪 Testing:"
    echo "  • Run tests:       npm test"
    echo "  • Integration:     npm run test:integration"
    echo ""
    echo "📝 Logs:"
    echo "  • View logs:       docker-compose -f docker-compose.dev.yml logs -f"
    echo "  • Gateway logs:    docker-compose -f docker-compose.dev.yml logs -f api-gateway"
    echo ""
    echo "🛑 Stop services:"
    echo "  • Stop all:        docker-compose -f docker-compose.dev.yml down"
    echo "  • Stop & cleanup:  docker-compose -f docker-compose.dev.yml down -v"
    echo ""
    
    # Test API Gateway
    print_status "Testing API Gateway..."
    if curl -s -f "http://localhost:3001/" >/dev/null 2>&1; then
        print_success "API Gateway is responding!"
    else
        print_warning "API Gateway may not be fully ready yet"
    fi
    
    # Test authentication
    print_status "Testing authentication..."
    auth_response=$(curl -s -X POST "http://localhost:3001/api/auth/login" \
        -H "Content-Type: application/json" \
        -d '{"username":"admin","password":"default123"}' 2>/dev/null || echo "")
    
    if echo "$auth_response" | grep -q "success"; then
        print_success "Authentication is working!"
    else
        print_warning "Authentication may need configuration"
    fi
    
    echo ""
    print_success "🚀 A2A System is ready for use!"
    echo ""
    print_status "Next steps:"
    echo "  1. Update .env file with your actual configuration"
    echo "  2. Configure Telegram Bot token"
    echo "  3. Test the system using the provided SDKs"
    echo "  4. Monitor the system using Grafana dashboard"
    echo ""
    print_status "For more information, see README-A2A-SYSTEM.md"
}

# Handle script interruption
trap 'print_error "Script interrupted"; exit 1' INT TERM

# Run main function
main "$@"
