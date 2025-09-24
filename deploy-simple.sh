#!/bin/bash

# Simple AuraOS Deployment Script (No Docker Required)
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Check if Node.js is installed
check_node() {
    log_info "Checking Node.js installation..."
    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed. Please install Node.js first."
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        log_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    log_success "Node.js and npm are available"
    log_info "Node.js version: $(node --version)"
    log_info "npm version: $(npm --version)"
}

# Install dependencies
install_dependencies() {
    log_info "Installing dependencies..."
    npm install
    
    if [ $? -eq 0 ]; then
        log_success "Dependencies installed successfully"
    else
        log_error "Failed to install dependencies"
        exit 1
    fi
}

# Run linting (optional)
run_lint() {
    log_info "Skipping linting for deployment..."
    log_success "Linting skipped"
}

# Build the project
build_project() {
    log_info "Building the project..."
    npm run build
    
    if [ $? -eq 0 ]; then
        log_success "Project built successfully"
    else
        log_error "Build failed"
        exit 1
    fi
}

# Create deployment directory
create_deployment() {
    log_info "Creating deployment directory..."
    mkdir -p deployment/auraos-$(date +%Y%m%d-%H%M%S)
    DEPLOY_DIR="deployment/auraos-$(date +%Y%m%d-%H%M%S)"
    
    # Copy built files
    log_info "Copying built files..."
    cp -r dist/* "$DEPLOY_DIR/"
    
    # Copy additional files
    cp package.json "$DEPLOY_DIR/"
    cp README.md "$DEPLOY_DIR/" 2>/dev/null || log_warning "README.md not found"
    
    log_success "Files deployed to: $DEPLOY_DIR"
}

# Create deployment info
create_deployment_info() {
    DEPLOY_DIR="deployment/auraos-$(date +%Y%m%d-%H%M%S)"
    log_info "Creating deployment info..."
    
    cat > "$DEPLOY_DIR/deployment-info.json" << EOF
{
  "appName": "AuraOS",
  "version": "2.1.0",
  "deploymentDate": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "buildTime": "$(date)",
  "nodeVersion": "$(node --version)",
  "npmVersion": "$(npm --version)",
  "features": [
    "Modern Desktop Interface",
    "AI-Powered Apps",
    "Theme Management",
    "Window Management",
    "App Launcher",
    "Responsive Design"
  ],
  "techStack": [
    "React 18",
    "TypeScript",
    "Vite",
    "Tailwind CSS",
    "Radix UI",
    "Lucide React",
    "Framer Motion"
  ],
  "deploymentStatus": "success"
}
EOF
    
    log_success "Deployment info created"
}

# Start development server
start_dev_server() {
    log_info "Starting development server..."
    log_info "Server will be available at: http://localhost:5173"
    log_info "Press Ctrl+C to stop the server"
    
    npm run dev
}

# Main deployment function
main() {
    case "${1:-build}" in
        "build")
            log_info "Starting AuraOS build process..."
            check_node
            install_dependencies
            run_lint
            build_project
            create_deployment
            create_deployment_info
            log_success "Build completed successfully!"
            ;;
        "dev")
            log_info "Starting development server..."
            check_node
            install_dependencies
            start_dev_server
            ;;
        "clean")
            log_info "Cleaning build artifacts..."
            rm -rf dist/
            rm -rf node_modules/
            log_success "Clean completed"
            ;;
        "test")
            log_info "Running tests..."
            check_node
            install_dependencies
            npm run test
            ;;
        *)
            echo "Usage: $0 {build|dev|clean|test}"
            echo ""
            echo "Commands:"
            echo "  build   - Build the project for production (default)"
            echo "  dev     - Start development server"
            echo "  clean   - Clean build artifacts"
            echo "  test    - Run tests"
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"