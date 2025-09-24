#!/bin/bash
# Deployment script for AuraOS

set -e

echo "🚀 AuraOS Deployment Script"

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

# Configuration
ENVIRONMENT=${1:-staging}
FIREBASE_PROJECT=${2:-auraos-staging}

# Validate environment
validate_environment() {
    print_status "Validating environment: $ENVIRONMENT"
    
    if [ "$ENVIRONMENT" != "staging" ] && [ "$ENVIRONMENT" != "production" ]; then
        print_error "Invalid environment. Use 'staging' or 'production'"
        exit 1
    fi
    
    print_success "Environment validated"
}

# Check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check if Docker is running
    if ! docker info &> /dev/null; then
        print_error "Docker is not running"
        exit 1
    fi
    
    # Check if Firebase CLI is installed
    if ! command -v firebase &> /dev/null; then
        print_error "Firebase CLI is not installed"
        exit 1
    fi
    
    # Check if environment file exists
    if [ ! -f ".env" ]; then
        print_error "Environment file .env not found"
        exit 1
    fi
    
    print_success "Prerequisites checked"
}

# Run tests
run_tests() {
    print_status "Running tests..."
    
    if [ -f "requirements-test.txt" ]; then
        pip install -r requirements-test.txt
    fi
    
    pytest tests/ -v --cov=auraos --cov-report=term-missing
    
    print_success "Tests completed"
}

# Build Docker images
build_images() {
    print_status "Building Docker images..."
    
    if [ "$ENVIRONMENT" = "production" ]; then
        docker-compose -f docker-compose.production.yml build
    else
        docker-compose build
    fi
    
    print_success "Docker images built"
}

# Deploy to Firebase
deploy_firebase() {
    print_status "Deploying to Firebase..."
    
    # Set Firebase project
    firebase use $FIREBASE_PROJECT
    
    # Deploy hosting
    firebase deploy --only hosting
    
    # Deploy functions
    firebase deploy --only functions
    
    print_success "Firebase deployment completed"
}

# Deploy to Docker
deploy_docker() {
    print_status "Deploying Docker services..."
    
    if [ "$ENVIRONMENT" = "production" ]; then
        docker-compose -f docker-compose.production.yml up -d
    else
        docker-compose up -d
    fi
    
    print_success "Docker services deployed"
}

# Health check
health_check() {
    print_status "Performing health check..."
    
    # Wait for services to start
    sleep 30
    
    # Check service health
    services=("conversational-core" "file-organizer" "ide-agent")
    ports=("8001" "8002" "8003")
    
    for i in "${!services[@]}"; do
        service=${services[$i]}
        port=${ports[$i]}
        
        if curl -f http://localhost:$port/health &> /dev/null; then
            print_success "$service is healthy"
        else
            print_error "$service is not responding"
        exit 1
    fi
    done
    
    print_success "Health check completed"
}

# Cleanup
cleanup() {
    print_status "Cleaning up..."
    
    # Remove unused Docker images
    docker image prune -f
    
    # Remove unused containers
    docker container prune -f
    
    print_success "Cleanup completed"
}

# Rollback function
rollback() {
    print_warning "Rolling back deployment..."
    
    # Stop current services
    if [ "$ENVIRONMENT" = "production" ]; then
        docker-compose -f docker-compose.production.yml down
    else
        docker-compose down
    fi
    
    # Restore previous version (if available)
    if [ -f "docker-compose.backup.yml" ]; then
        mv docker-compose.backup.yml docker-compose.yml
        docker-compose up -d
    fi
    
    print_warning "Rollback completed"
}

# Main deployment function
main() {
    echo "=========================================="
    echo "AuraOS Deployment to $ENVIRONMENT"
    echo "=========================================="
    
    validate_environment
    check_prerequisites
    run_tests
    build_images
            deploy_firebase
            deploy_docker
    health_check
    cleanup
    
    echo ""
    echo "=========================================="
    echo "🎉 Deployment Complete!"
    echo "=========================================="
    echo ""
    echo "Environment: $ENVIRONMENT"
    echo "Firebase Project: $FIREBASE_PROJECT"
    echo ""
    echo "Services:"
    echo "  - Conversational Core: http://localhost:8001"
    echo "  - File Organizer: http://localhost:8002"
    echo "  - IDE Agent: http://localhost:8003"
    echo "  - Grafana: http://localhost:3000"
    echo "  - Prometheus: http://localhost:9090"
    echo ""
    echo "To rollback: ./scripts/deploy.sh rollback"
    echo ""
}

# Handle rollback
if [ "$1" = "rollback" ]; then
    rollback
    exit 0
fi

# Run main function
main "$@"