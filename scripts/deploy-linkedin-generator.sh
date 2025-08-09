#!/bin/bash

# LinkedIn Generator Deployment Script
# This script helps deploy the LinkedIn generator to GitHub Pages

echo "🚀 LinkedIn Viral Post Generator - Deployment Script"
echo "================================================="

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

# Check if we're in the correct directory
if [ ! -f "package.json" ] || [ ! -d "frontend" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

print_status "Checking deployment options..."

echo ""
echo "Choose deployment method:"
echo "1. Deploy Next.js app to GitHub Pages (full features, requires API keys)"
echo "2. Deploy standalone version to GitHub Pages (works without API keys)"
echo "3. Setup GitHub Actions for automatic deployment"
echo "4. Exit"
echo ""

read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        print_status "Deploying Next.js app..."
        cd frontend
        
        # Check if dependencies are installed
        if [ ! -d "node_modules" ]; then
            print_status "Installing dependencies..."
            npm install
        fi
        
        # Build the app
        print_status "Building Next.js app..."
        npm run build
        
        if [ $? -eq 0 ]; then
            print_success "Build completed successfully!"
            print_status "Files are ready in frontend/out/"
            print_warning "Remember to:"
            echo "  1. Upload the 'out' folder contents to your GitHub Pages repository"
            echo "  2. Set up API keys in GitHub Secrets: GNEWS_API_KEY, OPENAI_API_KEY"
            echo "  3. Enable GitHub Pages in repository settings"
        else
            print_error "Build failed!"
            exit 1
        fi
        ;;
        
    2)
        print_status "Deploying standalone version..."
        
        # Create a deployment directory
        DEPLOY_DIR="deploy-linkedin-generator"
        rm -rf $DEPLOY_DIR
        mkdir -p $DEPLOY_DIR
        
        # Copy standalone files
        cp -r linkedin-generator-standalone/* $DEPLOY_DIR/
        
        print_success "Standalone version ready in $DEPLOY_DIR/"
        print_status "This version includes:"
        echo "  ✅ Fully functional UI"
        echo "  ✅ Mock data for testing"
        echo "  ✅ No API dependencies"
        echo "  ✅ Ready for GitHub Pages"
        echo ""
        print_warning "To deploy:"
        echo "  1. Create a new GitHub repository"
        echo "  2. Upload files from '$DEPLOY_DIR' folder"
        echo "  3. Enable GitHub Pages in Settings → Pages"
        echo "  4. Select 'Deploy from a branch' → main → / (root)"
        ;;
        
    3)
        print_status "Setting up GitHub Actions..."
        
        if [ ! -d ".github/workflows" ]; then
            mkdir -p .github/workflows
        fi
        
        # Check if workflow already exists
        if [ -f ".github/workflows/deploy-github-pages.yml" ]; then
            print_success "GitHub Actions workflow already exists!"
        else
            print_error "Workflow file not found. Please ensure it exists in .github/workflows/"
            exit 1
        fi
        
        print_status "GitHub Actions setup complete!"
        print_warning "To enable automatic deployment:"
        echo "  1. Push this repository to GitHub"
        echo "  2. Go to Settings → Pages"
        echo "  3. Select 'GitHub Actions' as source"
        echo "  4. Add API keys in Settings → Secrets and variables → Actions:"
        echo "     - GNEWS_API_KEY"
        echo "     - OPENAI_API_KEY"
        ;;
        
    4)
        print_status "Deployment cancelled."
        exit 0
        ;;
        
    *)
        print_error "Invalid option. Please choose 1-4."
        exit 1
        ;;
esac

echo ""
print_success "Deployment preparation complete!"
echo ""
print_status "🌟 Pro Tips:"
echo "  • Test locally before deploying"
echo "  • Use HTTPS URLs for production"
echo "  • Monitor API usage and costs"
echo "  • Update content regularly for best engagement"
echo ""
print_status "📚 Documentation: linkedin-generator-standalone/README.md"
print_status "🐛 Issues: https://github.com/cryptojoker710/amrikyy-ai/issues"
echo ""
print_success "Happy posting! 🚀"
