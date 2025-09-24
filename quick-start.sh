#!/bin/bash
# A2A System Quick Start Menu
# قائمة البدء السريع لنظام A2A

set -e

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
    echo -e "${PURPLE}$1${NC}"
}

print_option() {
    echo -e "${CYAN}$1${NC}"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if service is running
check_service() {
    local url=$1
    local name=$2
    
    if curl -s -f "$url" >/dev/null 2>&1; then
        echo "✅ $name"
    else
        echo "❌ $name"
    fi
}

# Function to display system status
show_system_status() {
    clear
    print_header "🚀 AuraOS A2A System Status"
    echo "================================"
    echo ""
    
    print_status "Service Status:"
    echo "  $(check_service "http://localhost:3001/api/health" "API Gateway")"
    echo "  $(check_service "http://localhost:3002/health" "Autopilot Service")"
    echo "  $(check_service "http://localhost:3003/health" "Telegram Bot")"
    echo "  $(check_service "http://localhost:3000" "Grafana")"
    echo "  $(check_service "http://localhost:9090" "Prometheus")"
    echo "  $(check_service "http://localhost:15672" "RabbitMQ Management")"
    echo ""
    
    print_status "Quick Access URLs:"
    echo "  🔗 API Gateway:     http://localhost:3001"
    echo "  🔗 API Docs:        http://localhost:3001/api/docs"
    echo "  🔗 Health Check:    http://localhost:3001/api/health"
    echo "  🔗 Metrics:         http://localhost:3001/api/metrics"
    echo "  🔗 Grafana:         http://localhost:3000 (admin/admin123)"
    echo "  🔗 Prometheus:      http://localhost:9090"
    echo "  🔗 RabbitMQ Mgmt:   http://localhost:15672 (admin/admin123)"
    echo ""
    
    print_status "WebSocket:"
    echo "  🔗 Gateway WS:      ws://localhost:3004/ws/a2a"
    echo ""
}

# Function to start system
start_system() {
    print_status "Starting A2A System..."
    ./start-a2a-system.sh
    print_success "System started!"
    read -p "Press Enter to continue..."
}

# Function to stop system
stop_system() {
    print_status "Stopping A2A System..."
    docker-compose -f docker-compose.dev.yml down
    print_success "System stopped!"
    read -p "Press Enter to continue..."
}

# Function to restart system
restart_system() {
    print_status "Restarting A2A System..."
    docker-compose -f docker-compose.dev.yml restart
    print_success "System restarted!"
    read -p "Press Enter to continue..."
}

# Function to view logs
view_logs() {
    print_status "Viewing system logs..."
    docker-compose -f docker-compose.dev.yml logs -f
}

# Function to run tests
run_tests() {
    print_status "Running system tests..."
    ./test-a2a-system.sh
    read -p "Press Enter to continue..."
}

# Function to show SDK examples
show_sdk_examples() {
    print_status "Running SDK examples..."
    ./sdk-examples.sh
    read -p "Press Enter to continue..."
}

# Function to monitor system
monitor_system() {
    print_status "Starting system monitoring..."
    ./monitor-a2a-system.sh
}

# Function to start development
start_development() {
    print_status "Starting development environment..."
    ./dev-a2a-system.sh start
    read -p "Press Enter to continue..."
}

# Function to deploy production
deploy_production() {
    print_status "Deploying to production..."
    ./deploy-a2a-system.sh deploy
    read -p "Press Enter to continue..."
}

# Function to maintain system
maintain_system() {
    print_status "System maintenance options..."
    echo ""
    echo "1. Cleanup logs"
    echo "2. Create backup"
    echo "3. Restore backup"
    echo "4. Update system"
    echo "5. Check health"
    echo "6. Optimize system"
    echo "7. Real-time monitoring"
    echo "8. Back to main menu"
    echo ""
    read -p "Choose maintenance option (1-8): " choice
    
    case $choice in
        1)
            ./maintain-a2a-system.sh cleanup
            ;;
        2)
            ./maintain-a2a-system.sh backup
            ;;
        3)
            read -p "Enter backup directory: " backup_dir
            ./maintain-a2a-system.sh restore "$backup_dir"
            ;;
        4)
            ./maintain-a2a-system.sh update
            ;;
        5)
            ./maintain-a2a-system.sh health
            ;;
        6)
            ./maintain-a2a-system.sh optimize
            ;;
        7)
            ./maintain-a2a-system.sh monitor
            ;;
        8)
            return
            ;;
        *)
            print_error "Invalid option"
            ;;
    esac
    
    read -p "Press Enter to continue..."
}

# Function to show help
show_help() {
    clear
    print_header "📚 AuraOS A2A System Help"
    echo "============================="
    echo ""
    echo "🔧 Available Commands:"
    echo ""
    echo "  ./start-a2a-system.sh     - Start the A2A system"
    echo "  ./test-a2a-system.sh      - Run system tests"
    echo "  ./sdk-examples.sh         - Run SDK examples"
    echo "  ./monitor-a2a-system.sh   - Monitor system"
    echo "  ./dev-a2a-system.sh      - Development environment"
    echo "  ./deploy-a2a-system.sh    - Production deployment"
    echo "  ./maintain-a2a-system.sh - System maintenance"
    echo ""
    echo "📖 Documentation:"
    echo "  README.md                 - Main documentation"
    echo "  README-A2A-SYSTEM.md     - A2A system documentation"
    echo "  docs/openapi.yaml         - API documentation"
    echo ""
    echo "🔗 Quick Access:"
    echo "  http://localhost:3001     - API Gateway"
    echo "  http://localhost:3000     - Grafana Dashboard"
    echo "  http://localhost:9090     - Prometheus Metrics"
    echo "  http://localhost:15672    - RabbitMQ Management"
    echo ""
    echo "🆘 Support:"
    echo "  GitHub Issues:            https://github.com/auraos/a2a-system/issues"
    echo "  Email:                    support@auraos.com"
    echo ""
    read -p "Press Enter to continue..."
}

# Function to show main menu
show_main_menu() {
    clear
    print_header "🚀 AuraOS A2A System Quick Start"
    echo "===================================="
    echo ""
    print_option "1. Start System"
    print_option "2. Stop System"
    print_option "3. Restart System"
    print_option "4. View Logs"
    print_option "5. Run Tests"
    print_option "6. SDK Examples"
    print_option "7. Monitor System"
    print_option "8. Development Mode"
    print_option "9. Production Deployment"
    print_option "10. System Maintenance"
    print_option "11. System Status"
    print_option "12. Help"
    print_option "13. Exit"
    echo ""
}

# Main function
main() {
    # Check prerequisites
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
    
    # Main menu loop
    while true; do
        show_main_menu
        read -p "Choose an option (1-13): " choice
        
        case $choice in
            1)
                start_system
                ;;
            2)
                stop_system
                ;;
            3)
                restart_system
                ;;
            4)
                view_logs
                ;;
            5)
                run_tests
                ;;
            6)
                show_sdk_examples
                ;;
            7)
                monitor_system
                ;;
            8)
                start_development
                ;;
            9)
                deploy_production
                ;;
            10)
                maintain_system
                ;;
            11)
                show_system_status
                read -p "Press Enter to continue..."
                ;;
            12)
                show_help
                ;;
            13)
                print_success "Goodbye! 👋"
                exit 0
                ;;
            *)
                print_error "Invalid option. Please choose 1-13."
                sleep 2
                ;;
        esac
    done
}

# Handle script interruption
trap 'print_error "Script interrupted"; exit 1' INT TERM

# Run main function
main "$@"
