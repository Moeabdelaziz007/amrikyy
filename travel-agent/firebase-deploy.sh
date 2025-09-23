#!/bin/bash

# AI Travel Agent Firebase Deployment Script
echo "🔥 Starting Firebase deployment for AI Travel Agent..."

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

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    print_warning "Firebase CLI is not installed. Installing..."
    npm install -g firebase-tools
    if [ $? -eq 0 ]; then
        print_success "Firebase CLI installed successfully"
    else
        print_error "Failed to install Firebase CLI"
        exit 1
    fi
fi

print_status "Node.js, npm, and Firebase CLI are available"

# Install dependencies
print_status "Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    print_success "Dependencies installed successfully"
else
    print_error "Failed to install dependencies"
    exit 1
fi

# Build the project
print_status "Building the project..."
npm run build

if [ $? -eq 0 ]; then
    print_success "Project built successfully"
else
    print_error "Build failed"
    exit 1
fi

# Check if Firebase project is initialized
if [ ! -f "firebase.json" ]; then
    print_error "Firebase project not initialized. Please run 'firebase init' first."
    exit 1
fi

# Login to Firebase (if not already logged in)
print_status "Checking Firebase authentication..."
firebase projects:list > /dev/null 2>&1
if [ $? -ne 0 ]; then
    print_status "Logging in to Firebase..."
    firebase login
    if [ $? -eq 0 ]; then
        print_success "Successfully logged in to Firebase"
    else
        print_error "Failed to login to Firebase"
        exit 1
    fi
else
    print_success "Already authenticated with Firebase"
fi

# Deploy to Firebase Hosting
print_status "Deploying to Firebase Hosting..."
firebase deploy --only hosting

if [ $? -eq 0 ]; then
    print_success "Deployment completed successfully!"
    echo ""
    echo "🎉 AI Travel Agent is now live on Firebase Hosting!"
    echo "🌐 Your app should be available at: https://ai-travel-agent-app.web.app"
    echo ""
    echo "📊 Deployment Summary:"
    echo "   • App: AI Travel Agent"
    echo "   • Version: 1.0.0"
    echo "   • Platform: Firebase Hosting"
    echo "   • Build: Production"
    echo "   • Features: AI Chat, Flight Search, Hotel Booking, Car Rental, Travel Planning"
    echo ""
    echo "🔧 Next Steps:"
    echo "   1. Visit your deployed app"
    echo "   2. Test all features"
    echo "   3. Set up custom domain (optional)"
    echo "   4. Configure analytics (optional)"
    echo ""
else
    print_error "Deployment failed"
    exit 1
fi
