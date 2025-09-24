#!/bin/bash
# A2A System Monitoring Dashboard
# لوحة تحكم مراقبة نظام A2A

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

# Function to check if service is running
check_service() {
    local url=$1
    local name=$2
    
    if curl -s -f "$url" >/dev/null 2>&1; then
        print_success "$name is running"
        return 0
    else
        print_error "$name is not running"
        return 1
    fi
}

# Function to get service status
get_service_status() {
    local url=$1
    local name=$2
    
    if curl -s -f "$url" >/dev/null 2>&1; then
        echo "✅ $name"
    else
        echo "❌ $name"
    fi
}

# Function to get metrics
get_metrics() {
    local url=$1
    local name=$2
    
    if curl -s -f "$url" >/dev/null 2>&1; then
        local response=$(curl -s "$url" 2>/dev/null)
        echo "$response"
    else
        echo "{}"
    fi
}

# Main function
main() {
    echo "📊 AuraOS A2A System Monitoring Dashboard"
    echo "========================================="
    echo ""
    
    # Check if services are running
    print_status "Checking service status..."
    echo ""
    
    echo "🔧 Service Status:"
    echo "  $(get_service_status "http://localhost:3001/api/health" "API Gateway")"
    echo "  $(get_service_status "http://localhost:3002/health" "Autopilot Service")"
    echo "  $(get_service_status "http://localhost:3003/health" "Telegram Bot")"
    echo "  $(get_service_status "http://localhost:3000" "Grafana")"
    echo "  $(get_service_status "http://localhost:9090" "Prometheus")"
    echo "  $(get_service_status "http://localhost:15672" "RabbitMQ Management")"
    echo ""
    
    # Get system health
    print_status "System Health Status:"
    echo ""
    
    local health_response=$(curl -s "http://localhost:3001/api/health" 2>/dev/null || echo "{}")
    if echo "$health_response" | grep -q "healthy"; then
        print_success "Overall System Status: HEALTHY"
    elif echo "$health_response" | grep -q "degraded"; then
        print_warning "Overall System Status: DEGRADED"
    else
        print_error "Overall System Status: UNHEALTHY"
    fi
    
    # Get system metrics
    print_status "System Metrics:"
    echo ""
    
    local metrics_response=$(curl -s "http://localhost:3001/api/metrics" 2>/dev/null || echo "{}")
    if echo "$metrics_response" | grep -q "success"; then
        print_success "Metrics are accessible"
        
        # Extract key metrics
        local total_requests=$(echo "$metrics_response" | grep -o '"totalRequests":[0-9]*' | cut -d':' -f2)
        local avg_response_time=$(echo "$metrics_response" | grep -o '"averageResponseTime":[0-9.]*' | cut -d':' -f2)
        local requests_per_minute=$(echo "$metrics_response" | grep -o '"requestsPerMinute":[0-9]*' | cut -d':' -f2)
        local memory_usage=$(echo "$metrics_response" | grep -o '"memoryUsage":[0-9.]*' | cut -d':' -f2)
        local cpu_usage=$(echo "$metrics_response" | grep -o '"cpuUsage":[0-9.]*' | cut -d':' -f2)
        local error_rate=$(echo "$metrics_response" | grep -o '"errorRate":[0-9.]*' | cut -d':' -f2)
        
        echo "  📈 Total Requests: $total_requests"
        echo "  ⏱️  Average Response Time: ${avg_response_time}ms"
        echo "  🚀 Requests per Minute: $requests_per_minute"
        echo "  💾 Memory Usage: ${memory_usage}%"
        echo "  🔥 CPU Usage: ${cpu_usage}%"
        echo "  ❌ Error Rate: ${error_rate}%"
    else
        print_warning "Metrics are not accessible"
    fi
    
    echo ""
    
    # Get system uptime
    print_status "System Uptime:"
    echo ""
    
    local uptime_response=$(curl -s "http://localhost:3001/" 2>/dev/null || echo "{}")
    if echo "$uptime_response" | grep -q "uptime"; then
        local uptime=$(echo "$uptime_response" | grep -o '"uptime":[0-9]*' | cut -d':' -f2)
        local uptime_hours=$((uptime / 3600))
        local uptime_minutes=$(((uptime % 3600) / 60))
        echo "  ⏰ System Uptime: ${uptime_hours}h ${uptime_minutes}m"
    else
        print_warning "Uptime information not available")
    fi
    
    echo ""
    
    # Get queue information
    print_status "Message Queue Status:"
    echo ""
    
    # Check RabbitMQ management
    if curl -s -f "http://localhost:15672" >/dev/null 2>&1; then
        print_success "RabbitMQ Management is accessible"
        echo "  🔗 Management URL: http://localhost:15672 (admin/admin123)"
    else
        print_warning "RabbitMQ Management is not accessible"
    fi
    
    # Check Redis
    if curl -s -f "http://localhost:6379" >/dev/null 2>&1; then
        print_success "Redis is accessible"
    else
        print_warning "Redis is not accessible"
    fi
    
    echo ""
    
    # Get recent logs
    print_status "Recent System Logs:"
    echo ""
    
    if command -v docker-compose >/dev/null 2>&1; then
        echo "📋 Recent logs from API Gateway:"
        docker-compose -f docker-compose.dev.yml logs --tail=5 api-gateway 2>/dev/null || print_warning "Could not retrieve logs"
        echo ""
        
        echo "📋 Recent logs from Autopilot Service:"
        docker-compose -f docker-compose.dev.yml logs --tail=5 autopilot-service 2>/dev/null || print_warning "Could not retrieve logs"
        echo ""
        
        echo "📋 Recent logs from Telegram Bot:"
        docker-compose -f docker-compose.dev.yml logs --tail=5 telegram-bot 2>/dev/null || print_warning "Could not retrieve logs"
    else
        print_warning "Docker Compose not available for log retrieval"
    fi
    
    echo ""
    
    # Performance recommendations
    print_status "Performance Recommendations:"
    echo ""
    
    if [ ! -z "$error_rate" ] && [ "$error_rate" -gt 5 ]; then
        print_warning "High error rate detected (${error_rate}%). Consider investigating error logs."
    fi
    
    if [ ! -z "$memory_usage" ] && [ "$memory_usage" -gt 80 ]; then
        print_warning "High memory usage detected (${memory_usage}%). Consider scaling or optimization."
    fi
    
    if [ ! -z "$cpu_usage" ] && [ "$cpu_usage" -gt 80 ]; then
        print_warning "High CPU usage detected (${cpu_usage}%). Consider scaling or optimization."
    fi
    
    if [ ! -z "$avg_response_time" ] && [ "$avg_response_time" -gt 1000 ]; then
        print_warning "Slow response times detected (${avg_response_time}ms). Consider optimization."
    fi
    
    echo ""
    
    # Monitoring URLs
    print_status "Monitoring URLs:"
    echo ""
    echo "  📊 Grafana Dashboard:    http://localhost:3000 (admin/admin123)"
    echo "  📈 Prometheus Metrics:   http://localhost:9090"
    echo "  🐰 RabbitMQ Management:  http://localhost:15672 (admin/admin123)"
    echo "  🔍 API Gateway Health:   http://localhost:3001/api/health"
    echo "  📋 API Gateway Metrics:  http://localhost:3001/api/metrics"
    echo "  📚 API Documentation:    http://localhost:3001/api/docs"
    echo ""
    
    # Quick actions
    print_status "Quick Actions:"
    echo ""
    echo "  🔄 Restart services:     docker-compose -f docker-compose.dev.yml restart"
    echo "  📋 View all logs:        docker-compose -f docker-compose.dev.yml logs -f"
    echo "  🧪 Run tests:            ./test-a2a-system.sh"
    echo "  🚀 SDK examples:         ./sdk-examples.sh"
    echo "  🛑 Stop services:        docker-compose -f docker-compose.dev.yml down"
    echo ""
    
    # Auto-refresh option
    print_status "Auto-refresh monitoring (press Ctrl+C to stop):"
    echo ""
    
    read -p "Do you want to enable auto-refresh every 30 seconds? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        while true; do
            sleep 30
            clear
            main
        done
    fi
}

# Handle script interruption
trap 'print_error "Script interrupted"; exit 1' INT TERM

# Run main function
main "$@"
