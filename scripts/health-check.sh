#!/bin/bash
# Health check script for AuraOS services

set -e

echo "🏥 AuraOS Health Check"

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
SERVICES=(
    "conversational-core:8001"
    "file-organizer:8002"
    "ide-agent:8003"
    "prometheus:9090"
    "grafana:3000"
    "redis:6379"
)

# Check service health
check_service() {
    local service=$1
    local port=$2
    local name=$(echo $service | cut -d: -f1)
    
    print_status "Checking $name service..."
    
    if curl -f -s "http://localhost:$port/health" > /dev/null 2>&1; then
        print_success "$name is healthy"
        return 0
    else
        print_error "$name is not responding"
        return 1
    fi
}

# Check Redis connection
check_redis() {
    print_status "Checking Redis connection..."
    
    if docker exec redis redis-cli ping > /dev/null 2>&1; then
        print_success "Redis is healthy"
        return 0
    else
        print_error "Redis is not responding"
        return 1
    fi
}

# Check Docker containers
check_containers() {
    print_status "Checking Docker containers..."
    
    local containers=("redis" "prometheus" "grafana" "conversational-core" "file-organizer" "ide-agent")
    local all_healthy=true
    
    for container in "${containers[@]}"; do
        if docker ps | grep -q "$container"; then
            print_success "Container $container is running"
        else
            print_error "Container $container is not running"
            all_healthy=false
        fi
    done
    
    if [ "$all_healthy" = true ]; then
        return 0
    else
        return 1
    fi
}

# Check disk space
check_disk_space() {
    print_status "Checking disk space..."
    
    local usage=$(df -h . | awk 'NR==2 {print $5}' | sed 's/%//')
    
    if [ "$usage" -lt 80 ]; then
        print_success "Disk space is healthy ($usage% used)"
        return 0
    elif [ "$usage" -lt 90 ]; then
        print_warning "Disk space is getting low ($usage% used)"
        return 0
    else
        print_error "Disk space is critically low ($usage% used)"
        return 1
    fi
}

# Check memory usage
check_memory() {
    print_status "Checking memory usage..."
    
    local usage=$(free | awk 'NR==2{printf "%.0f", $3*100/$2}')
    
    if [ "$usage" -lt 80 ]; then
        print_success "Memory usage is healthy ($usage% used)"
        return 0
    elif [ "$usage" -lt 90 ]; then
        print_warning "Memory usage is getting high ($usage% used)"
        return 0
    else
        print_error "Memory usage is critically high ($usage% used)"
        return 1
    fi
}

# Check network connectivity
check_network() {
    print_status "Checking network connectivity..."
    
    if ping -c 1 8.8.8.8 > /dev/null 2>&1; then
        print_success "Network connectivity is healthy"
        return 0
    else
        print_error "Network connectivity issues detected"
        return 1
    fi
}

# Generate health report
generate_report() {
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    local report_file="health_report_$(date +%Y%m%d_%H%M%S).txt"
    
    print_status "Generating health report..."
    
    cat > "$report_file" << EOF
AuraOS Health Report
Generated: $timestamp

Services Status:
EOF
    
    for service in "${SERVICES[@]}"; do
        local name=$(echo $service | cut -d: -f1)
        local port=$(echo $service | cut -d: -f2)
        
        if curl -f -s "http://localhost:$port/health" > /dev/null 2>&1; then
            echo "  $name: HEALTHY" >> "$report_file"
        else
            echo "  $name: UNHEALTHY" >> "$report_file"
        fi
    done
    
    echo "" >> "$report_file"
    echo "System Resources:" >> "$report_file"
    echo "  Disk Usage: $(df -h . | awk 'NR==2 {print $5}')" >> "$report_file"
    echo "  Memory Usage: $(free | awk 'NR==2{printf "%.0f%%", $3*100/$2}')" >> "$report_file"
    
    print_success "Health report generated: $report_file"
}

# Main health check function
main() {
    echo "=========================================="
    echo "AuraOS Health Check"
    echo "=========================================="
    
    local exit_code=0
    
    # Check Docker containers
    if ! check_containers; then
        exit_code=1
    fi
    
    # Check services
    for service in "${SERVICES[@]}"; do
        local name=$(echo $service | cut -d: -f1)
        local port=$(echo $service | cut -d: -f2)
        
        if [ "$name" = "redis" ]; then
            if ! check_redis; then
                exit_code=1
            fi
        else
            if ! check_service "$name" "$port"; then
                exit_code=1
            fi
        fi
    done
    
    # Check system resources
    if ! check_disk_space; then
        exit_code=1
    fi
    
    if ! check_memory; then
        exit_code=1
    fi
    
    if ! check_network; then
        exit_code=1
    fi
    
    # Generate report
    generate_report
    
    echo ""
    echo "=========================================="
    if [ $exit_code -eq 0 ]; then
        echo "🎉 All systems healthy!"
    else
        echo "⚠️  Some issues detected!"
    fi
    echo "=========================================="
    
    exit $exit_code
}

# Run main function
main "$@"
