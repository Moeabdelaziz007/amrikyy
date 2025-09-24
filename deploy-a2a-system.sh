#!/bin/bash
# A2A System Production Deployment
# نشر نظام A2A للإنتاج

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
    local name=$2
    local max_attempts=60
    local attempt=1
    
    print_status "Waiting for $name at $url..."
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s -f "$url" >/dev/null 2>&1; then
            print_success "$name is ready!"
            return 0
        fi
        
        print_status "Attempt $attempt/$max_attempts - waiting..."
        sleep 5
        attempt=$((attempt + 1))
    done
    
    print_error "$name failed to start after $max_attempts attempts"
    return 1
}

# Function to backup existing deployment
backup_deployment() {
    local backup_dir="backups/$(date +%Y%m%d_%H%M%S)"
    
    print_status "Creating backup of existing deployment..."
    mkdir -p "$backup_dir"
    
    if [ -f "docker-compose.yml" ]; then
        cp docker-compose.yml "$backup_dir/"
        print_success "Backed up docker-compose.yml"
    fi
    
    if [ -f ".env" ]; then
        cp .env "$backup_dir/"
        print_success "Backed up .env"
    fi
    
    if [ -d "data" ]; then
        cp -r data "$backup_dir/"
        print_success "Backed up data directory"
    fi
    
    print_success "Backup created at $backup_dir"
}

# Function to validate environment
validate_environment() {
    print_status "Validating production environment..."
    
    # Check required environment variables
    local required_vars=(
        "NODE_ENV"
        "JWT_SECRET"
        "TELEGRAM_BOT_TOKEN"
        "MONGODB_PASSWORD"
        "RABBITMQ_PASSWORD"
        "REDIS_PASSWORD"
    )
    
    local missing_vars=()
    
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            missing_vars+=("$var")
        fi
    done
    
    if [ ${#missing_vars[@]} -gt 0 ]; then
        print_error "Missing required environment variables:"
        for var in "${missing_vars[@]}"; do
            echo "  - $var"
        done
        return 1
    fi
    
    # Check if NODE_ENV is production
    if [ "$NODE_ENV" != "production" ]; then
        print_warning "NODE_ENV is not set to 'production'. Current value: $NODE_ENV"
        read -p "Do you want to continue? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_error "Deployment aborted"
            exit 1
        fi
    fi
    
    print_success "Environment validation completed"
}

# Function to check system resources
check_system_resources() {
    print_status "Checking system resources..."
    
    # Check available disk space
    local available_space=$(df -h . | awk 'NR==2 {print $4}')
    print_status "Available disk space: $available_space"
    
    # Check available memory
    local available_memory=$(free -h | awk 'NR==2 {print $7}')
    print_status "Available memory: $available_memory"
    
    # Check CPU load
    local cpu_load=$(uptime | awk -F'load average:' '{print $2}' | awk '{print $1}' | sed 's/,//')
    print_status "CPU load: $cpu_load"
    
    # Check if ports are available
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
            print_error "Deployment aborted"
            exit 1
        fi
    fi
    
    print_success "System resources check completed"
}

# Function to deploy services
deploy_services() {
    print_status "Deploying A2A System services..."
    
    # Create production docker-compose file if it doesn't exist
    if [ ! -f "docker-compose.prod.yml" ]; then
        print_status "Creating production docker-compose file..."
        cat > docker-compose.prod.yml << 'EOF'
version: '3.8'

services:
  # Redis - للذاكرة المؤقتة والجلسات
  redis:
    image: redis:7-alpine
    container_name: a2a-redis-prod
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD}
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 30s
      timeout: 10s
      retries: 3

  # RabbitMQ - لإدارة الرسائل
  rabbitmq:
    image: rabbitmq:3-management-alpine
    container_name: a2a-rabbitmq-prod
    ports:
      - "5672:5672"
      - "15672:15672"
    environment:
      RABBITMQ_DEFAULT_USER: admin
      RABBITMQ_DEFAULT_PASS: ${RABBITMQ_PASSWORD}
      RABBITMQ_DEFAULT_VHOST: /
    volumes:
      - rabbitmq_data:/var/lib/rabbitmq
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "rabbitmq-diagnostics", "ping"]
      interval: 30s
      timeout: 10s
      retries: 3

  # API Gateway - بوابة API الرئيسية
  api-gateway:
    build:
      context: ./gateway
      dockerfile: Dockerfile
    container_name: a2a-gateway-prod
    ports:
      - "3001:3001"
      - "3004:3004"  # WebSocket port
    environment:
      NODE_ENV: production
      PORT: 3001
      HOST: 0.0.0.0
      JWT_SECRET: ${JWT_SECRET}
      JWT_EXPIRES_IN: 24h
      REDIS_HOST: redis
      REDIS_PORT: 6379
      REDIS_PASSWORD: ${REDIS_PASSWORD}
      REDIS_DB: 0
      RABBITMQ_URL: amqp://admin:${RABBITMQ_PASSWORD}@rabbitmq:5672
      RABBITMQ_EXCHANGE: a2a_events
      RABBITMQ_QUEUE_PREFIX: a2a
      RATE_LIMIT_WINDOW_MS: 900000
      RATE_LIMIT_MAX_REQUESTS: 1000
      LOG_LEVEL: info
      LOG_FORMAT: json
      ENABLE_METRICS: true
      METRICS_PORT: 9090
      ALLOWED_ORIGINS: ${ALLOWED_ORIGINS}
      WS_PORT: 3004
      WS_PATH: /ws/a2a
      WEBHOOK_SECRET: ${WEBHOOK_SECRET}
    volumes:
      - ./logs:/app/logs
    depends_on:
      redis:
        condition: service_healthy
      rabbitmq:
        condition: service_healthy
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3001/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Autopilot Service - خدمة الأوتوبيلوت
  autopilot-service:
    build:
      context: ./autopilot
      dockerfile: Dockerfile
    container_name: a2a-autopilot-prod
    ports:
      - "3002:3002"
    environment:
      NODE_ENV: production
      PORT: 3002
      HOST: 0.0.0.0
      GATEWAY_URL: http://api-gateway:3001
      REDIS_HOST: redis
      REDIS_PORT: 6379
      REDIS_PASSWORD: ${REDIS_PASSWORD}
      RABBITMQ_URL: amqp://admin:${RABBITMQ_PASSWORD}@rabbitmq:5672
      LOG_LEVEL: info
      MAX_CONCURRENT_TASKS: 10
      TASK_TIMEOUT: 300000
    volumes:
      - ./logs:/app/logs
    depends_on:
      - redis
      - rabbitmq
      - api-gateway
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3002/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Telegram Bot - بوت تيليجرام
  telegram-bot:
    build:
      context: ./telegram_bot
      dockerfile: Dockerfile
    container_name: a2a-telegram-bot-prod
    ports:
      - "3003:3003"
    environment:
      NODE_ENV: production
      PORT: 3003
      HOST: 0.0.0.0
      TELEGRAM_BOT_TOKEN: ${TELEGRAM_BOT_TOKEN}
      GATEWAY_URL: http://api-gateway:3001
      WEBHOOK_URL: ${TELEGRAM_WEBHOOK_URL}
      REDIS_HOST: redis
      REDIS_PORT: 6379
      REDIS_PASSWORD: ${REDIS_PASSWORD}
      RABBITMQ_URL: amqp://admin:${RABBITMQ_PASSWORD}@rabbitmq:5672
      LOG_LEVEL: info
      RATE_LIMIT_MESSAGES_PER_MINUTE: 30
      RATE_LIMIT_COMMANDS_PER_MINUTE: 10
    volumes:
      - ./logs:/app/logs
    depends_on:
      - redis
      - rabbitmq
      - api-gateway
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3003/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # MongoDB - قاعدة البيانات الرئيسية
  mongodb:
    image: mongo:7
    container_name: a2a-mongodb-prod
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: ${MONGODB_PASSWORD}
      MONGO_INITDB_DATABASE: auraos_a2a
    volumes:
      - mongodb_data:/data/db
      - ./mongodb/init:/docker-entrypoint-initdb.d
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "mongosh", "--eval", "db.adminCommand('ping')"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Prometheus - مراقبة المقاييس
  prometheus:
    image: prom/prometheus:latest
    container_name: a2a-prometheus-prod
    ports:
      - "9090:9090"
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.console.libraries=/etc/prometheus/console_libraries'
      - '--web.console.templates=/etc/prometheus/consoles'
      - '--storage.tsdb.retention.time=200h'
      - '--web.enable-lifecycle'
    restart: unless-stopped
    depends_on:
      - api-gateway

  # Grafana - لوحة تحكم المراقبة
  grafana:
    image: grafana/grafana:latest
    container_name: a2a-grafana-prod
    ports:
      - "3000:3000"
    environment:
      GF_SECURITY_ADMIN_PASSWORD: ${GRAFANA_ADMIN_PASSWORD}
      GF_USERS_ALLOW_SIGN_UP: false
    volumes:
      - grafana_data:/var/lib/grafana
      - ./monitoring/grafana/dashboards:/etc/grafana/provisioning/dashboards
      - ./monitoring/grafana/datasources:/etc/grafana/provisioning/datasources
    restart: unless-stopped
    depends_on:
      - prometheus

  # Nginx - Load Balancer
  nginx:
    image: nginx:alpine
    container_name: a2a-nginx-prod
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
    depends_on:
      - api-gateway
      - autopilot-service
      - telegram-bot
    restart: unless-stopped

volumes:
  redis_data:
    driver: local
  rabbitmq_data:
    driver: local
  mongodb_data:
    driver: local
  prometheus_data:
    driver: local
  grafana_data:
    driver: local

networks:
  default:
    name: a2a-network-prod
    driver: bridge
EOF
        print_success "Production docker-compose file created"
    fi
    
    # Create production environment file if it doesn't exist
    if [ ! -f ".env.production" ]; then
        print_status "Creating production environment file..."
        cat > .env.production << 'EOF'
# A2A System Production Environment Variables
NODE_ENV=production

# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
TELEGRAM_WEBHOOK_URL=https://your-domain.com/api/a2a/webhook/telegram

# Security
JWT_SECRET=your-super-secret-jwt-key-change-in-production
WEBHOOK_SECRET=your-webhook-secret-change-in-production

# Database
MONGODB_PASSWORD=your-mongodb-password-here

# Redis
REDIS_PASSWORD=your-redis-password-here

# RabbitMQ
RABBITMQ_PASSWORD=your-rabbitmq-password-here

# Monitoring
GRAFANA_ADMIN_PASSWORD=your-grafana-password-here

# CORS
ALLOWED_ORIGINS=https://your-domain.com,https://api.your-domain.com
EOF
        print_warning "Production environment file created with placeholder values."
        print_warning "Please update .env.production file with your actual configuration."
        read -p "Do you want to continue with placeholder values? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_error "Please update .env.production file and run the script again."
            exit 1
        fi
    fi
    
    # Load production environment
    if [ -f ".env.production" ]; then
        export $(cat .env.production | grep -v '^#' | xargs)
        print_success "Production environment loaded"
    fi
    
    # Build and start services
    print_status "Building and starting production services..."
    docker-compose -f docker-compose.prod.yml up -d --build
    
    # Wait for services to be ready
    print_status "Waiting for services to be ready..."
    
    # Wait for API Gateway
    if wait_for_service "http://localhost:3001/api/health" "API Gateway"; then
        print_success "API Gateway is ready!"
    else
        print_error "API Gateway failed to start"
        docker-compose -f docker-compose.prod.yml logs api-gateway
        exit 1
    fi
    
    # Wait for Autopilot Service
    if wait_for_service "http://localhost:3002/health" "Autopilot Service"; then
        print_success "Autopilot Service is ready!"
    else
        print_warning "Autopilot Service may not be ready yet"
    fi
    
    # Wait for Telegram Bot
    if wait_for_service "http://localhost:3003/health" "Telegram Bot"; then
        print_success "Telegram Bot is ready!"
    else
        print_warning "Telegram Bot may not be ready yet"
    fi
    
    # Wait for Grafana
    if wait_for_service "http://localhost:3000" "Grafana"; then
        print_success "Grafana is ready!"
    else
        print_warning "Grafana may not be ready yet"
    fi
    
    print_success "Production deployment completed!"
}

# Function to run post-deployment tests
run_post_deployment_tests() {
    print_status "Running post-deployment tests..."
    
    # Test API Gateway
    if curl -s -f "http://localhost:3001/api/health" >/dev/null 2>&1; then
        print_success "API Gateway health check passed"
    else
        print_error "API Gateway health check failed"
        return 1
    fi
    
    # Test authentication
    auth_response=$(curl -s -X POST "http://localhost:3001/api/auth/login" \
        -H "Content-Type: application/json" \
        -d '{"username":"admin","password":"default123"}' 2>/dev/null || echo "")
    
    if echo "$auth_response" | grep -q "success"; then
        print_success "Authentication test passed"
    else
        print_warning "Authentication test failed (may need configuration)"
    fi
    
    # Test metrics
    if curl -s -f "http://localhost:3001/api/metrics" >/dev/null 2>&1; then
        print_success "Metrics endpoint test passed"
    else
        print_warning "Metrics endpoint test failed"
    fi
    
    print_success "Post-deployment tests completed"
}

# Main function
main() {
    echo "🚀 AuraOS A2A System Production Deployment"
    echo "=========================================="
    echo ""
    
    # Check prerequisites
    print_status "Checking deployment prerequisites..."
    
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
    echo ""
    
    # Parse command line arguments
    case "${1:-deploy}" in
        "deploy")
            # Validate environment
            validate_environment
            
            # Check system resources
            check_system_resources
            
            # Backup existing deployment
            backup_deployment
            
            # Deploy services
            deploy_services
            
            # Run post-deployment tests
            run_post_deployment_tests
            
            # Display deployment information
            echo ""
            print_success "🎉 Production deployment completed successfully!"
            echo ""
            echo "📊 Production Services:"
            echo "  • API Gateway:     http://localhost:3001"
            echo "  • Autopilot:        http://localhost:3002"
            echo "  • Telegram Bot:     http://localhost:3003"
            echo "  • Grafana:          http://localhost:3000"
            echo "  • Prometheus:       http://localhost:9090"
            echo "  • RabbitMQ Mgmt:    http://localhost:15672"
            echo ""
            echo "🔗 WebSocket:"
            echo "  • Gateway WS:       ws://localhost:3004/ws/a2a"
            echo ""
            echo "📚 Documentation:"
            echo "  • API Docs:         http://localhost:3001/api/docs"
            echo "  • OpenAPI Spec:     ./docs/openapi.yaml"
            echo "  • README:           ./README.md"
            echo ""
            echo "🛠️  Management Commands:"
            echo "  • View logs:        docker-compose -f docker-compose.prod.yml logs -f"
            echo "  • Restart services: docker-compose -f docker-compose.prod.yml restart"
            echo "  • Stop services:    docker-compose -f docker-compose.prod.yml down"
            echo "  • Update services:  docker-compose -f docker-compose.prod.yml pull && docker-compose -f docker-compose.prod.yml up -d --build"
            echo ""
            print_status "Production system is ready for use!"
            ;;
            
        "stop")
            print_status "Stopping production services..."
            docker-compose -f docker-compose.prod.yml down
            print_success "Production services stopped!"
            ;;
            
        "restart")
            print_status "Restarting production services..."
            docker-compose -f docker-compose.prod.yml restart
            print_success "Production services restarted!"
            ;;
            
        "logs")
            print_status "Viewing production logs..."
            docker-compose -f docker-compose.prod.yml logs -f
            ;;
            
        "status")
            print_status "Production services status..."
            docker-compose -f docker-compose.prod.yml ps
            ;;
            
        "update")
            print_status "Updating production services..."
            docker-compose -f docker-compose.prod.yml pull
            docker-compose -f docker-compose.prod.yml up -d --build
            print_success "Production services updated!"
            ;;
            
        "help"|"-h"|"--help")
            echo "Usage: $0 [command]"
            echo ""
            echo "Commands:"
            echo "  deploy     Deploy production environment (default)"
            echo "  stop       Stop production services"
            echo "  restart    Restart production services"
            echo "  logs       View production logs"
            echo "  status     Show production services status"
            echo "  update     Update production services"
            echo "  help       Show this help message"
            echo ""
            echo "Examples:"
            echo "  $0 deploy    # Deploy production environment"
            echo "  $0 stop      # Stop production services"
            echo "  $0 logs      # View logs"
            echo "  $0 status    # Show status"
            ;;
            
        *)
            print_error "Unknown command: $1"
            echo "Use '$0 help' for available commands"
            exit 1
            ;;
    esac
}

# Handle script interruption
trap 'print_error "Script interrupted"; exit 1' INT TERM

# Run main function
main "$@"
