#!/bin/bash
# Development environment setup script

set -e

echo "🚀 Setting up AuraOS Development Environment"

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

# Check if Python 3.11+ is installed
check_python() {
    print_status "Checking Python version..."
    if command -v python3 &> /dev/null; then
        PYTHON_VERSION=$(python3 -c 'import sys; print(".".join(map(str, sys.version_info[:2])))')
        if python3 -c 'import sys; exit(0 if sys.version_info >= (3, 11) else 1)'; then
            print_success "Python $PYTHON_VERSION is installed"
        else
            print_error "Python 3.11+ is required. Current version: $PYTHON_VERSION"
            exit 1
        fi
    else
        print_error "Python 3 is not installed"
        exit 1
    fi
}

# Check if Docker is installed
check_docker() {
    print_status "Checking Docker installation..."
    if command -v docker &> /dev/null; then
        print_success "Docker is installed"
    else
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if command -v docker-compose &> /dev/null; then
        print_success "Docker Compose is installed"
    else
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
}

# Check if Redis is running
check_redis() {
    print_status "Checking Redis connection..."
    if docker ps | grep -q redis; then
        print_success "Redis is running"
    else
        print_warning "Redis is not running. Starting Redis..."
        docker-compose up -d redis
        sleep 5
    fi
}

# Create virtual environment
create_venv() {
    print_status "Creating virtual environment..."
    if [ ! -d "venv" ]; then
        python3 -m venv venv
        print_success "Virtual environment created"
    else
        print_warning "Virtual environment already exists"
    fi
}

# Activate virtual environment
activate_venv() {
    print_status "Activating virtual environment..."
    source venv/bin/activate
    print_success "Virtual environment activated"
}

# Install dependencies
install_deps() {
    print_status "Installing dependencies..."
    pip install --upgrade pip
    pip install -r requirements-dev.txt
    print_success "Dependencies installed"
}

# Setup environment file
setup_env() {
    print_status "Setting up environment file..."
    if [ ! -f ".env" ]; then
        cp env.example .env
        print_success "Environment file created from template"
        print_warning "Please edit .env file with your configuration"
    else
        print_warning "Environment file already exists"
    fi
}

# Start development services
start_services() {
    print_status "Starting development services..."
    docker-compose up -d redis prometheus grafana
    print_success "Development services started"
}

# Run pre-commit hooks
setup_precommit() {
    print_status "Setting up pre-commit hooks..."
    if command -v pre-commit &> /dev/null; then
        pre-commit install
        print_success "Pre-commit hooks installed"
    else
        print_warning "Pre-commit not installed. Skipping..."
    fi
}

# Run initial tests
run_tests() {
    print_status "Running initial tests..."
    if pytest --version &> /dev/null; then
        pytest tests/ -v
        print_success "Tests completed"
    else
        print_warning "pytest not available. Skipping tests..."
    fi
}

# Main setup function
main() {
    echo "=========================================="
    echo "AuraOS Development Environment Setup"
    echo "=========================================="
    
    check_python
    check_docker
    create_venv
    activate_venv
    install_deps
    setup_env
    start_services
    setup_precommit
    run_tests
    
    echo ""
    echo "=========================================="
    echo "🎉 Setup Complete!"
    echo "=========================================="
    echo ""
    echo "Next steps:"
    echo "1. Edit .env file with your configuration"
    echo "2. Run 'make dev' to start all services"
    echo "3. Access Grafana at http://localhost:3000"
    echo "4. Access Prometheus at http://localhost:9090"
    echo ""
    echo "Available commands:"
    echo "  make dev          - Start development environment"
    echo "  make test         - Run tests"
    echo "  make lint         - Run linting"
    echo "  make format       - Format code"
    echo "  make clean        - Clean up temporary files"
    echo ""
}

# Run main function
main "$@"
