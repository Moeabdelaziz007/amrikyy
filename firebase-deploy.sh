#!/bin/bash

# AuraOS Platform Firebase Deployment Script
echo "🔥 Starting Firebase deployment for AuraOS Platform..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
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

print_header() {
    echo -e "${PURPLE}[AURAOS]${NC} $1"
}

print_step() {
    echo -e "${CYAN}[STEP]${NC} $1"
}

# Print banner
echo -e "${PURPLE}"
echo "  █████╗ ██╗   ██╗██████╗  ██████╗ ███████╗"
echo " ██╔══██╗██║   ██║██╔══██╗██╔═══██╗██╔════╝"
echo " ███████║██║   ██║██████╔╝██║   ██║███████╗"
echo " ██╔══██║██║   ██║██╔══██╗██║   ██║╚════██║"
echo " ██║  ██║╚██████╔╝██║  ██║╚██████╔╝███████║"
echo " ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚══════╝"
echo -e "${NC}"
echo "🚀 AI-Powered Operating System Platform"
echo ""

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

print_success "Node.js, npm, and Firebase CLI are available"

# Step 1: Build the AI Travel Agent
print_step "1. Building AI Travel Agent..."
cd travel-agent
if [ -f "package.json" ]; then
    print_status "Installing AI Travel Agent dependencies..."
    npm install
    
    if [ $? -eq 0 ]; then
        print_success "AI Travel Agent dependencies installed"
        
        print_status "Building AI Travel Agent..."
        npm run build
        
        if [ $? -eq 0 ]; then
            print_success "AI Travel Agent built successfully"
        else
            print_error "AI Travel Agent build failed"
            exit 1
        fi
    else
        print_error "Failed to install AI Travel Agent dependencies"
        exit 1
    fi
else
    print_warning "AI Travel Agent package.json not found, skipping..."
fi
cd ..

# Step 2: Build the main AuraOS platform
print_step "2. Building AuraOS Platform..."
if [ -f "package.json" ]; then
    print_status "Installing AuraOS dependencies..."
    npm install
    
    if [ $? -eq 0 ]; then
        print_success "AuraOS dependencies installed"
        
        print_status "Building AuraOS platform..."
        npm run build
        
        if [ $? -eq 0 ]; then
            print_success "AuraOS platform built successfully"
        else
            print_warning "AuraOS build failed, continuing with existing files..."
        fi
    else
        print_warning "Failed to install AuraOS dependencies, continuing..."
    fi
else
    print_warning "Main package.json not found, using existing files..."
fi

# Step 3: Create deployment directory
print_step "3. Preparing deployment files..."
mkdir -p dist

# Copy AI Travel Agent build
if [ -d "travel-agent/dist" ]; then
    print_status "Copying AI Travel Agent to deployment directory..."
    cp -r travel-agent/dist/* dist/
    print_success "AI Travel Agent copied to deployment directory"
fi

# Copy main platform files
print_status "Copying main platform files..."
cp -r client/* dist/ 2>/dev/null || true
cp -r src/* dist/ 2>/dev/null || true
cp index.html dist/ 2>/dev/null || true
cp manifest.json dist/ 2>/dev/null || true
cp sw.js dist/ 2>/dev/null || true

# Copy static assets
if [ -d "icons" ]; then
    cp -r icons dist/ 2>/dev/null || true
fi

if [ -d "uploads" ]; then
    cp -r uploads dist/ 2>/dev/null || true
fi

print_success "Deployment files prepared"

# Step 4: Check Firebase configuration
print_step "4. Checking Firebase configuration..."
if [ ! -f "firebase.json" ]; then
    print_error "Firebase configuration not found. Please run 'firebase init' first."
    exit 1
fi

print_success "Firebase configuration found"

# Step 5: Firebase authentication
print_step "5. Firebase authentication..."
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

# Step 6: Deploy to Firebase Hosting
print_step "6. Deploying to Firebase Hosting..."
print_status "Starting deployment process..."
firebase deploy --only hosting

if [ $? -eq 0 ]; then
    print_success "Deployment completed successfully!"
    echo ""
    print_header "🎉 AuraOS Platform is now live on Firebase Hosting!"
    echo ""
    echo -e "${GREEN}🌐 Your platform is available at:${NC} https://auraos-platform.web.app"
    echo ""
    echo -e "${CYAN}📊 Deployment Summary:${NC}"
    echo "   • Platform: AuraOS AI-Powered Operating System"
    echo "   • Version: 1.0.0"
    echo "   • Hosting: Firebase Hosting"
    echo "   • Build: Production"
    echo "   • Features:"
    echo "     - AI Travel Agent"
    echo "     - Advanced AI Integration"
    echo "     - MCP Tools Integration"
    echo "     - Learning Brain System"
    echo "     - Automation Framework"
    echo "     - Telegram Bot Integration"
    echo "     - GitHub Integration"
    echo "     - Analytics Dashboard"
    echo "     - Security Features"
    echo ""
    echo -e "${YELLOW}🔧 Next Steps:${NC}"
    echo "   1. Visit your deployed platform"
    echo "   2. Test all features and integrations"
    echo "   3. Set up custom domain (optional)"
    echo "   4. Configure Firebase Analytics"
    echo "   5. Set up monitoring and alerts"
    echo "   6. Configure environment variables"
    echo ""
    echo -e "${PURPLE}🚀 AuraOS Platform Features:${NC}"
    echo "   • AI-Powered Travel Agent"
    echo "   • Advanced Automation System"
    echo "   • MCP Tools Integration"
    echo "   • Learning Brain Hub"
    echo "   • Real-time Analytics"
    echo "   • Secure Authentication"
    echo "   • Mobile-Responsive Design"
    echo ""
    print_success "Deployment completed successfully!"
else
    print_error "Deployment failed"
    exit 1
fi
