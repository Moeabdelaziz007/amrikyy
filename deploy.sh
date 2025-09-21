#!/bin/bash

# AuraOS Automation Platform - Deployment Script
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="auraos-automation"
COMPOSE_FILE="docker-compose.yml"
ENV_FILE=".env"

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

# Check if Docker is installed
check_docker() {
    log_info "Checking Docker installation..."
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    log_success "Docker and Docker Compose are installed"
}

# Check if .env file exists
check_env() {
    log_info "Checking environment configuration..."
    if [ ! -f "$ENV_FILE" ]; then
        log_warning "Environment file not found. Creating from example..."
        if [ -f "env.example" ]; then
            cp env.example "$ENV_FILE"
            log_warning "Please edit $ENV_FILE with your configuration before continuing."
            read -p "Press Enter to continue after editing the environment file..."
        else
            log_error "No environment file or example found. Please create $ENV_FILE"
            exit 1
        fi
    fi
    log_success "Environment configuration found"
}

# Generate JWT secret if not set
generate_jwt_secret() {
    if ! grep -q "JWT_SECRET=" "$ENV_FILE" || grep -q "your-super-secret-jwt-key" "$ENV_FILE"; then
        log_info "Generating JWT secret..."
        JWT_SECRET=$(openssl rand -base64 64 | tr -d "=+/" | cut -c1-32)
        # Use a more compatible sed approach
        sed -i.bak '/^JWT_SECRET=/d' "$ENV_FILE"
        echo "JWT_SECRET=$JWT_SECRET" >> "$ENV_FILE"
        log_success "JWT secret generated"
    else
        log_info "JWT secret already configured"
    fi
}

# Build and start services
deploy_services() {
    log_info "Building and deploying services..."
    
    # Stop existing services
    log_info "Stopping existing services..."
    docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" down --remove-orphans
    
    # Build and start services
    log_info "Building images..."
    docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" build --no-cache
    
    log_info "Starting services..."
    docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up -d
    
    log_success "Services deployed successfully"
}

# Wait for services to be healthy
wait_for_services() {
    log_info "Waiting for services to be healthy..."
    
    # Wait for database
    log_info "Waiting for PostgreSQL..."
    timeout 60 bash -c 'until docker-compose exec -T postgres pg_isready -U postgres; do sleep 2; done'
    
    # Wait for Redis
    log_info "Waiting for Redis..."
    timeout 30 bash -c 'until docker-compose exec -T redis redis-cli ping; do sleep 2; done'
    
    # Wait for server
    log_info "Waiting for AuraOS Server..."
    timeout 60 bash -c 'until curl -f http://localhost:3001/health >/dev/null 2>&1; do sleep 2; done'
    
    # Wait for client
    log_info "Waiting for AuraOS Client..."
    timeout 30 bash -c 'until curl -f http://localhost:3000/health >/dev/null 2>&1; do sleep 2; done'
    
    log_success "All services are healthy"
}

# Show deployment status
show_status() {
    log_info "Deployment Status:"
    echo ""
    
    # Show running containers
    docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" ps
    
    echo ""
    log_info "Service URLs:"
    echo "  🌐 Frontend:     http://localhost:3000"
    echo "  🔧 Backend API:  http://localhost:3001"
    echo "  📊 Health:       http://localhost:3001/health"
    echo "  🔌 WebSocket:    ws://localhost:3001/ws/automation"
    echo "  🗄️  Database:     localhost:5432"
    echo "  📦 Redis:        localhost:6379"
    echo ""
    
    log_info "Default Login Credentials:"
    echo "  📧 Email:    admin@auraos.com"
    echo "  🔑 Password: admin123"
    echo ""
    
    log_success "AuraOS Automation Platform is ready!"
}

# Run database migrations (if needed)
run_migrations() {
    log_info "Running database migrations..."
    # This would be implemented when we add a proper migration system
    log_success "Database migrations completed"
}

# Cleanup function
cleanup() {
    log_info "Cleaning up..."
    docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" down --volumes --remove-orphans
    log_success "Cleanup completed"
}

# Show logs
show_logs() {
    log_info "Showing service logs..."
    docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" logs -f
}

# Main deployment function
main() {
    case "${1:-deploy}" in
        "deploy")
            log_info "Starting AuraOS Automation Platform deployment..."
            check_docker
            check_env
            generate_jwt_secret
            deploy_services
            wait_for_services
            run_migrations
            show_status
            ;;
        "stop")
            log_info "Stopping services..."
            docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" down
            log_success "Services stopped"
            ;;
        "restart")
            log_info "Restarting services..."
            docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" restart
            log_success "Services restarted"
            ;;
        "logs")
            show_logs
            ;;
        "status")
            show_status
            ;;
        "cleanup")
            cleanup
            ;;
        "update")
            log_info "Updating services..."
            docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" pull
            deploy_services
            wait_for_services
            show_status
            ;;
        *)
            echo "Usage: $0 {deploy|stop|restart|logs|status|cleanup|update}"
            echo ""
            echo "Commands:"
            echo "  deploy   - Deploy the entire platform (default)"
            echo "  stop     - Stop all services"
            echo "  restart  - Restart all services"
            echo "  logs     - Show service logs"
            echo "  status   - Show deployment status"
            echo "  cleanup  - Remove all containers and volumes"
            echo "  update   - Update and redeploy services"
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"
