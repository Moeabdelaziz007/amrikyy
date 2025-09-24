#!/bin/bash

# Firebase Deployment Script for AuraOS
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

# Check if Firebase CLI is installed
check_firebase() {
    log_info "Checking Firebase CLI installation..."
if ! command -v firebase &> /dev/null; then
        log_error "Firebase CLI is not installed. Please install it first:"
        log_info "npm install -g firebase-tools"
        exit 1
    fi
    log_success "Firebase CLI is available"
    log_info "Firebase CLI version: $(firebase --version)"
}

# Check if user is logged in
check_auth() {
    log_info "Checking Firebase authentication..."
    if ! firebase projects:list &> /dev/null; then
        log_error "Not logged in to Firebase. Please login first:"
        log_info "firebase login"
        exit 1
    fi
    log_success "Firebase authentication verified"
}

# Build the project
build_project() {
    log_info "Building AuraOS project..."
    npm run build
    
    if [ $? -eq 0 ]; then
        log_success "Build completed successfully"
    else
        log_error "Build failed"
    exit 1
fi
}

# Deploy to Firebase
deploy_firebase() {
    log_info "Deploying to Firebase..."
    firebase deploy --only hosting
    
    if [ $? -eq 0 ]; then
        log_success "Deployment completed successfully"
        log_info "Your app is available at: https://aios-97581.web.app"
    else
        log_error "Deployment failed"
        exit 1
    fi
}

# Main execution
main() {
    log_info "Starting Firebase deployment for AuraOS..."
    
    check_firebase
    check_auth
    build_project
    deploy_firebase
    
    log_success "Firebase deployment completed successfully!"
    log_info "Visit your app at: https://aios-97581.web.app"
}

# Run main function
main "$@"