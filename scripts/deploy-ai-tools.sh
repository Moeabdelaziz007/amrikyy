#!/bin/bash

# AI Tools Portfolio Deployment Script
# Enhanced version of the original LinkedIn generator deployment

echo "🤖 Amrikyy AI Tools Portfolio - Complete Deployment"
echo "=================================================="

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

print_ai() {
    echo -e "${PURPLE}[AI TOOLS]${NC} $1"
}

# ASCII Art Header
echo -e "${CYAN}"
cat << "EOF"
   ___    __  __   ____    ____   __ __  __ __       ___      ____
  /   |  |  \/  | |    \  |    | |  |  ||  |  |     /   \    |    |
 |    |  |      | |  D  ) |  |  ||  |  ||  |  |    |     |   |  |  |
 |  _  | |      | |    /  |  |  ||  _  ||  ~  |    |  O  |   |  |  |
 |  |  | |      | |    \  |  |  ||  |  ||___, |    |     |   |  |  |
 |  |  | |      | |  .  \ |  |  ||  |  ||     |     \   /    |  |  |
 |__|__| |__||__| |__|\_| |____| |__|__||____/       \_/     |__|__|

EOF
echo -e "${NC}"

# Check if we're in the correct directory
if [ ! -f "package.json" ] && [ ! -d "frontend" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

print_status "Analyzing current portfolio setup..."

echo ""
print_ai "🚀 Available AI Tools for Deployment:"
echo ""
echo "1. 📝 LinkedIn Viral Post Generator    - LIVE & Interactive"
echo "2. ⚛️  Quantum Digital ID Generator     - LIVE & Interactive" 
echo "3. 📊 Smart Analytics Dashboard        - LIVE & Interactive"
echo "4. 🛠️  AI Tools Showcase Page          - LIVE & Interactive"
echo "5. 🎯 Complete Portfolio Deployment    - All tools + Backend APIs"
echo ""

echo "Choose deployment strategy:"
echo "1. Deploy single tool (LinkedIn Generator)"
echo "2. Deploy single tool (Quantum ID Generator)"
echo "3. Deploy single tool (Analytics Dashboard)"
echo "4. Deploy complete AI portfolio (All tools + APIs)"
echo "5. Setup development environment"
echo "6. Run production build test"
echo "7. Deploy to GitHub Pages with GitHub Actions"
echo "8. Exit"
echo ""

read -p "Enter your choice (1-8): " choice

case $choice in
    1)
        print_ai "Deploying LinkedIn Viral Post Generator..."
        cd frontend
        
        print_status "Installing dependencies..."
        npm install
        
        print_status "Building LinkedIn generator..."
        npm run build
        
        if [ $? -eq 0 ]; then
            print_success "LinkedIn Generator built successfully!"
            print_status "Tool Features:"
            echo "  ✅ Real-time news fetching (GNews API)"
            echo "  ✅ AI post generation (OpenAI API)"
            echo "  ✅ 3 tone options (Inspirational, Technical, Storytelling)"
            echo "  ✅ Copy to clipboard functionality"
            echo "  ✅ Responsive design"
            echo ""
            print_warning "Files ready in frontend/out/"
            print_status "Access: /linkedin-generator"
        else
            print_error "Build failed!"
            exit 1
        fi
        ;;
        
    2)
        print_ai "Deploying Quantum Digital ID Generator..."
        cd frontend
        
        print_status "Installing dependencies..."
        npm install
        
        print_status "Building Quantum ID generator..."
        npm run build
        
        if [ $? -eq 0 ]; then
            print_success "Quantum ID Generator built successfully!"
            print_status "Tool Features:"
            echo "  ✅ Quantum-inspired personality analysis"
            echo "  ✅ AI-powered recommendations"
            echo "  ✅ Digital signature generation"
            echo "  ✅ 4 ID types (Professional, Creative, Tech, Gaming)"
            echo "  ✅ Real-time quantum metrics"
            echo ""
            print_warning "Files ready in frontend/out/"
            print_status "Access: /quantum-id-generator"
        else
            print_error "Build failed!"
            exit 1
        fi
        ;;
        
    3)
        print_ai "Deploying Smart Analytics Dashboard..."
        cd frontend
        
        print_status "Installing dependencies..."
        npm install
        
        print_status "Building Analytics Dashboard..."
        npm run build
        
        if [ $? -eq 0 ]; then
            print_success "Analytics Dashboard built successfully!"
            print_status "Tool Features:"
            echo "  ✅ Real-time data streaming"
            echo "  ✅ AI performance metrics"
            echo "  ✅ System health monitoring"
            echo "  ✅ Live activity feeds"
            echo "  ✅ Export functionality"
            echo ""
            print_warning "Files ready in frontend/out/"
            print_status "Access: /analytics-dashboard"
        else
            print_error "Build failed!"
            exit 1
        fi
        ;;
        
    4)
        print_ai "Deploying Complete AI Portfolio..."
        cd frontend
        
        print_status "Installing dependencies..."
        npm install
        
        print_status "Running type check..."
        npm run type-check
        
        print_status "Building complete portfolio..."
        npm run build
        
        if [ $? -eq 0 ]; then
            print_success "Complete AI Portfolio built successfully!"
            echo ""
            print_ai "🎯 Deployed Tools Summary:"
            echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
            echo "📝 LinkedIn Viral Post Generator  → /linkedin-generator"
            echo "⚛️  Quantum Digital ID Generator   → /quantum-id-generator"
            echo "📊 Smart Analytics Dashboard      → /analytics-dashboard"
            echo "🛠️  AI Tools Showcase            → /ai-tools"
            echo "💬 RAG Chat Assistant             → /"
            echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
            echo ""
            print_status "Backend APIs Available:"
            echo "  🔗 /api/news - News fetching"
            echo "  🔗 /api/generate-post - Post generation"
            echo "  🔗 /api/quantum-analysis - Quantum analysis"
            echo "  🔗 /api/analytics-data - Live analytics"
            echo ""
            print_success "Portfolio ready for production deployment!"
            print_warning "Files ready in frontend/out/"
        else
            print_error "Build failed!"
            exit 1
        fi
        ;;
        
    5)
        print_ai "Setting up development environment..."
        
        print_status "Installing frontend dependencies..."
        cd frontend && npm install
        
        print_status "Creating environment file..."
        if [ ! -f ".env.local" ]; then
            cp env.example .env.local
            print_warning "Please update .env.local with your API keys:"
            echo "  • GNEWS_API_KEY (get from gnews.io)"
            echo "  • OPENAI_API_KEY (get from OpenAI)"
        fi
        
        print_status "Starting development server..."
        print_success "Development environment ready!"
        print_ai "Available tools:"
        echo "  🌐 http://localhost:3000 - Main portfolio"
        echo "  📝 http://localhost:3000/linkedin-generator"
        echo "  ⚛️  http://localhost:3000/quantum-id-generator"
        echo "  📊 http://localhost:3000/analytics-dashboard"
        echo "  🛠️  http://localhost:3000/ai-tools"
        echo ""
        
        npm run dev
        ;;
        
    6)
        print_ai "Running production build test..."
        cd frontend
        
        print_status "Installing dependencies..."
        npm install
        
        print_status "Type checking..."
        npm run type-check
        
        print_status "Building for production..."
        npm run build
        
        if [ $? -eq 0 ]; then
            print_success "Production build successful!"
            
            print_status "Build statistics:"
            if [ -d "out" ]; then
                echo "  📁 Output directory: frontend/out/"
                echo "  📊 Total files: $(find out -type f | wc -l)"
                echo "  💾 Total size: $(du -sh out | cut -f1)"
            fi
            
            print_status "Testing production build..."
            if command -v python3 &> /dev/null; then
                print_status "Starting local server for testing..."
                cd out && python3 -m http.server 8080 &
                SERVER_PID=$!
                print_success "Test server running at http://localhost:8080"
                print_warning "Press any key to stop test server..."
                read -n 1
                kill $SERVER_PID
            fi
        else
            print_error "Production build failed!"
            exit 1
        fi
        ;;
        
    7)
        print_ai "Setting up GitHub Pages deployment..."
        
        if [ ! -d ".github/workflows" ]; then
            mkdir -p .github/workflows
        fi
        
        if [ -f ".github/workflows/deploy-github-pages.yml" ]; then
            print_success "GitHub Actions workflow already exists!"
        else
            print_error "Workflow file not found. Please ensure it exists."
            exit 1
        fi
        
        print_status "GitHub Pages deployment setup:"
        echo ""
        print_ai "🚀 Automatic Deployment Process:"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "1. Push code to main branch"
        echo "2. GitHub Actions triggers build"
        echo "3. Next.js app builds for static export"
        echo "4. Deploy to GitHub Pages automatically"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo ""
        print_warning "Required Setup Steps:"
        echo "1. Push this repository to GitHub"
        echo "2. Go to Settings → Pages"
        echo "3. Select 'GitHub Actions' as source"
        echo "4. Add API keys in Settings → Secrets:"
        echo "   • GNEWS_API_KEY"
        echo "   • OPENAI_API_KEY"
        echo ""
        print_status "Once deployed, your tools will be available at:"
        echo "  🌐 https://yourusername.github.io/repository-name/"
        ;;
        
    8)
        print_ai "Deployment cancelled."
        exit 0
        ;;
        
    *)
        print_error "Invalid option. Please choose 1-8."
        exit 1
        ;;
esac

echo ""
print_success "Deployment operation completed!"
echo ""
print_ai "🎯 Portfolio Impact Analysis:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Transformed static portfolio to interactive tools"
echo "✅ Implemented real AI functionality with live APIs"
echo "✅ Created production-ready applications"
echo "✅ Demonstrated advanced technical capabilities"
echo "✅ Enhanced professional credibility significantly"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
print_ai "🌟 Pro Tips for Maximum Impact:"
echo "• Update APIs regularly for fresh content"
echo "• Monitor usage analytics for insights"
echo "• Share tools on LinkedIn to demonstrate capabilities"
echo "• Use tools in client presentations as proof of concept"
echo ""
print_success "Happy deploying! 🚀"
