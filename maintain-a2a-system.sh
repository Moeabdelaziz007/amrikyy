#!/bin/bash
# A2A System Maintenance Script
# سكريبت صيانة نظام A2A

set -e

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

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to get disk usage
get_disk_usage() {
    df -h . | awk 'NR==2 {print $5}' | sed 's/%//'
}

# Function to get memory usage
get_memory_usage() {
    free | awk 'NR==2{printf "%.1f", $3*100/$2}'
}

# Function to get CPU usage
get_cpu_usage() {
    top -bn1 | grep "Cpu(s)" | awk '{print $2}' | sed 's/%us,//'
}

# Function to cleanup old logs
cleanup_logs() {
    local days=${1:-7}
    
    print_status "Cleaning up logs older than $days days..."
    
    if [ -d "logs" ]; then
        find logs -name "*.log" -type f -mtime +$days -delete
        print_success "Cleaned up old log files"
    else
        print_warning "Logs directory not found"
    fi
    
    # Cleanup Docker logs
    if command_exists docker; then
        docker system prune -f --volumes
        print_success "Cleaned up Docker system"
    fi
}

# Function to backup data
backup_data() {
    local backup_dir="backups/$(date +%Y%m%d_%H%M%S)"
    
    print_status "Creating data backup..."
    mkdir -p "$backup_dir"
    
    # Backup Docker volumes
    if command_exists docker; then
        docker-compose -f docker-compose.dev.yml down
        docker run --rm -v a2a-redis_data:/data -v $(pwd)/$backup_dir:/backup alpine tar czf /backup/redis_data.tar.gz -C /data .
        docker run --rm -v a2a-rabbitmq_data:/data -v $(pwd)/$backup_dir:/backup alpine tar czf /backup/rabbitmq_data.tar.gz -C /data .
        docker run --rm -v a2a-mongodb_data:/data -v $(pwd)/$backup_dir:/backup alpine tar czf /backup/mongodb_data.tar.gz -C /data .
        docker-compose -f docker-compose.dev.yml up -d
        print_success "Docker volumes backed up"
    fi
    
    # Backup configuration files
    cp docker-compose.dev.yml "$backup_dir/" 2>/dev/null || true
    cp docker-compose.prod.yml "$backup_dir/" 2>/dev/null || true
    cp .env "$backup_dir/" 2>/dev/null || true
    cp .env.production "$backup_dir/" 2>/dev/null || true
    
    print_success "Data backup created at $backup_dir"
}

# Function to restore data
restore_data() {
    local backup_dir=$1
    
    if [ -z "$backup_dir" ]; then
        print_error "Backup directory not specified"
        return 1
    fi
    
    if [ ! -d "$backup_dir" ]; then
        print_error "Backup directory not found: $backup_dir"
        return 1
    fi
    
    print_status "Restoring data from $backup_dir..."
    
    # Restore Docker volumes
    if command_exists docker; then
        docker-compose -f docker-compose.dev.yml down
        
        if [ -f "$backup_dir/redis_data.tar.gz" ]; then
            docker run --rm -v a2a-redis_data:/data -v $(pwd)/$backup_dir:/backup alpine tar xzf /backup/redis_data.tar.gz -C /data
            print_success "Redis data restored"
        fi
        
        if [ -f "$backup_dir/rabbitmq_data.tar.gz" ]; then
            docker run --rm -v a2a-rabbitmq_data:/data -v $(pwd)/$backup_dir:/backup alpine tar xzf /backup/rabbitmq_data.tar.gz -C /data
            print_success "RabbitMQ data restored"
        fi
        
        if [ -f "$backup_dir/mongodb_data.tar.gz" ]; then
            docker run --rm -v a2a-mongodb_data:/data -v $(pwd)/$backup_dir:/backup alpine tar xzf /backup/mongodb_data.tar.gz -C /data
            print_success "MongoDB data restored"
        fi
        
        docker-compose -f docker-compose.dev.yml up -d
        print_success "Data restoration completed"
    fi
}

# Function to update system
update_system() {
    print_status "Updating A2A System..."
    
    # Update Docker images
    if command_exists docker; then
        docker-compose -f docker-compose.dev.yml pull
        print_success "Docker images updated"
    fi
    
    # Update dependencies
    if [ -d "gateway" ] && [ -f "gateway/package.json" ]; then
        cd gateway
        npm update
        cd ..
        print_success "Gateway dependencies updated"
    fi
    
    if [ -d "autopilot" ] && [ -f "autopilot/package.json" ]; then
        cd autopilot
        npm update
        cd ..
        print_success "Autopilot dependencies updated"
    fi
    
    if [ -d "telegram_bot" ] && [ -f "telegram_bot/package.json" ]; then
        cd telegram_bot
        npm update
        cd ..
        print_success "Telegram Bot dependencies updated"
    fi
    
    print_success "System update completed"
}

# Function to check system health
check_system_health() {
    print_status "Checking system health..."
    echo ""
    
    # Check disk usage
    local disk_usage=$(get_disk_usage)
    if [ "$disk_usage" -gt 80 ]; then
        print_warning "High disk usage: ${disk_usage}%"
    else
        print_success "Disk usage: ${disk_usage}%"
    fi
    
    # Check memory usage
    local memory_usage=$(get_memory_usage)
    if [ "$memory_usage" -gt 80 ]; then
        print_warning "High memory usage: ${memory_usage}%"
    else
        print_success "Memory usage: ${memory_usage}%"
    fi
    
    # Check CPU usage
    local cpu_usage=$(get_cpu_usage)
    if [ "$cpu_usage" -gt 80 ]; then
        print_warning "High CPU usage: ${cpu_usage}%"
    else
        print_success "CPU usage: ${cpu_usage}%"
    fi
    
    # Check Docker containers
    if command_exists docker; then
        local running_containers=$(docker ps --format "table {{.Names}}\t{{.Status}}" | grep -c "Up" || echo "0")
        print_success "Running containers: $running_containers"
        
        # Check for unhealthy containers
        local unhealthy_containers=$(docker ps --format "table {{.Names}}\t{{.Status}}" | grep -c "unhealthy" || echo "0")
        if [ "$unhealthy_containers" -gt 0 ]; then
            print_warning "Unhealthy containers: $unhealthy_containers"
        fi
    fi
    
    # Check service endpoints
    local services=(
        "http://localhost:3001/api/health:API Gateway"
        "http://localhost:3002/health:Autopilot Service"
        "http://localhost:3003/health:Telegram Bot"
        "http://localhost:3000:Grafana"
        "http://localhost:9090:Prometheus"
        "http://localhost:15672:RabbitMQ Management"
    )
    
    echo ""
    print_status "Service Health:"
    for service in "${services[@]}"; do
        local url=$(echo $service | cut -d: -f1-3)
        local name=$(echo $service | cut -d: -f4)
        
        if curl -s -f "$url" >/dev/null 2>&1; then
            echo "  ✅ $name"
        else
            echo "  ❌ $name"
        fi
    done
}

# Function to optimize system
optimize_system() {
    print_status "Optimizing system performance..."
    
    # Cleanup Docker system
    if command_exists docker; then
        docker system prune -f --volumes
        print_success "Docker system optimized"
    fi
    
    # Cleanup logs
    cleanup_logs 7
    
    # Restart services for memory optimization
    if command_exists docker-compose; then
        docker-compose -f docker-compose.dev.yml restart
        print_success "Services restarted for optimization"
    fi
    
    print_success "System optimization completed"
}

# Function to monitor system
monitor_system() {
    print_status "Starting system monitoring..."
    echo ""
    
    while true; do
        clear
        echo "📊 AuraOS A2A System Monitoring"
        echo "================================"
        echo ""
        
        # System metrics
        echo "🔧 System Metrics:"
        echo "  💾 Disk Usage: $(get_disk_usage)%"
        echo "  🧠 Memory Usage: $(get_memory_usage)%"
        echo "  🔥 CPU Usage: $(get_cpu_usage)%"
        echo ""
        
        # Service status
        echo "🔧 Service Status:"
        local services=(
            "http://localhost:3001/api/health:API Gateway"
            "http://localhost:3002/health:Autopilot Service"
            "http://localhost:3003/health:Telegram Bot"
            "http://localhost:3000:Grafana"
            "http://localhost:9090:Prometheus"
            "http://localhost:15672:RabbitMQ Management"
        )
        
        for service in "${services[@]}"; do
            local url=$(echo $service | cut -d: -f1-3)
            local name=$(echo $service | cut -d: -f4)
            
            if curl -s -f "$url" >/dev/null 2>&1; then
                echo "  ✅ $name"
            else
                echo "  ❌ $name"
            fi
        done
        
        echo ""
        echo "Press Ctrl+C to stop monitoring"
        sleep 30
    done
}

# Main function
main() {
    echo "🛠️  AuraOS A2A System Maintenance"
    echo "================================"
    echo ""
    
    # Parse command line arguments
    case "${1:-help}" in
        "cleanup")
            local days=${2:-7}
            cleanup_logs $days
            print_success "Cleanup completed!"
            ;;
            
        "backup")
            backup_data
            print_success "Backup completed!"
            ;;
            
        "restore")
            local backup_dir=$2
            if [ -z "$backup_dir" ]; then
                print_error "Please specify backup directory"
                echo "Usage: $0 restore <backup_directory>"
                exit 1
            fi
            restore_data "$backup_dir"
            print_success "Restore completed!"
            ;;
            
        "update")
            update_system
            print_success "Update completed!"
            ;;
            
        "health")
            check_system_health
            ;;
            
        "optimize")
            optimize_system
            print_success "Optimization completed!"
            ;;
            
        "monitor")
            monitor_system
            ;;
            
        "help"|"-h"|"--help")
            echo "Usage: $0 [command] [options]"
            echo ""
            echo "Commands:"
            echo "  cleanup [days]     Clean up old logs (default: 7 days)"
            echo "  backup            Create system backup"
            echo "  restore <dir>     Restore from backup directory"
            echo "  update            Update system components"
            echo "  health            Check system health"
            echo "  optimize          Optimize system performance"
            echo "  monitor           Start real-time monitoring"
            echo "  help              Show this help message"
            echo ""
            echo "Examples:"
            echo "  $0 cleanup 14     # Clean logs older than 14 days"
            echo "  $0 backup          # Create system backup"
            echo "  $0 restore backups/20240101_120000  # Restore from backup"
            echo "  $0 update          # Update system"
            echo "  $0 health          # Check system health"
            echo "  $0 optimize        # Optimize system"
            echo "  $0 monitor         # Start monitoring"
            ;;
            
        *)
            print_error "Unknown command: $1"
            echo "Use '$0 help' for available commands"
            exit 1
            ;;
    esac
}

# Handle script interruption
trap 'print_error "Script interrupted"; exit 1' INT TERM

# Run main function
main "$@"
