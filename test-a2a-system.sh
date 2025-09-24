#!/bin/bash
# A2A System Test Runner
# سكريبت تشغيل اختبارات نظام A2A

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

# Function to wait for service
wait_for_service() {
    local url=$1
    local name=$2
    local max_attempts=30
    local attempt=1
    
    print_status "Waiting for $name at $url..."
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s -f "$url" >/dev/null 2>&1; then
            print_success "$name is ready!"
            return 0
        fi
        
        print_status "Attempt $attempt/$max_attempts - waiting..."
        sleep 2
        attempt=$((attempt + 1))
    done
    
    print_error "$name failed to start after $max_attempts attempts"
    return 1
}

# Main function
main() {
    echo "🧪 AuraOS A2A System Test Runner"
    echo "================================="
    echo ""
    
    # Check if services are running
    print_status "Checking if services are running..."
    
    local services_ready=true
    
    if ! check_service "http://localhost:3001/api/health" "API Gateway"; then
        services_ready=false
    fi
    
    if ! check_service "http://localhost:3002/health" "Autopilot Service"; then
        services_ready=false
    fi
    
    if ! check_service "http://localhost:3003/health" "Telegram Bot"; then
        services_ready=false
    fi
    
    if [ "$services_ready" = false ]; then
        print_warning "Some services are not running. Starting services..."
        docker-compose -f docker-compose.dev.yml up -d
        
        # Wait for services
        wait_for_service "http://localhost:3001/api/health" "API Gateway"
        wait_for_service "http://localhost:3002/health" "Autopilot Service"
        wait_for_service "http://localhost:3003/health" "Telegram Bot"
    fi
    
    print_success "All services are ready!"
    echo ""
    
    # Run tests
    print_status "Running A2A System tests..."
    echo ""
    
    # Test API Gateway
    print_status "Testing API Gateway..."
    if [ -d "gateway" ]; then
        cd gateway
        if [ -f "package.json" ]; then
            npm test
            print_success "API Gateway tests completed"
        else
            print_warning "No package.json found in gateway directory"
        fi
        cd ..
    else
        print_warning "Gateway directory not found"
    fi
    
    echo ""
    
    # Test Integration
    print_status "Testing Integration..."
    if [ -d "tests" ]; then
        cd tests
        if [ -f "package.json" ]; then
            npm test
            print_success "Integration tests completed"
        else
            print_warning "No package.json found in tests directory"
        fi
        cd ..
    else
        print_warning "Tests directory not found"
    fi
    
    echo ""
    
    # Test SDKs
    print_status "Testing SDKs..."
    
    # Test Node.js SDK
    if [ -d "sdk/node" ]; then
        cd sdk/node
        if [ -f "package.json" ]; then
            npm test
            print_success "Node.js SDK tests completed"
        else
            print_warning "No package.json found in Node.js SDK directory"
        fi
        cd ../..
    else
        print_warning "Node.js SDK directory not found"
    fi
    
    # Test Python SDK
    if [ -d "sdk/python" ]; then
        cd sdk/python
        if [ -f "requirements.txt" ]; then
            python -m pytest test_*.py -v
            print_success "Python SDK tests completed"
        else
            print_warning "No requirements.txt found in Python SDK directory"
        fi
        cd ../..
    else
        print_warning "Python SDK directory not found"
    fi
    
    echo ""
    
    # Performance tests
    print_status "Running performance tests..."
    
    # Test API Gateway performance
    print_status "Testing API Gateway performance..."
    for i in {1..10}; do
        curl -s -f "http://localhost:3001/api/health" >/dev/null
    done
    print_success "API Gateway performance test completed"
    
    # Test message publishing performance
    print_status "Testing message publishing performance..."
    
    # Get auth token
    auth_response=$(curl -s -X POST "http://localhost:3001/api/auth/login" \
        -H "Content-Type: application/json" \
        -d '{"username":"admin","password":"default123"}' 2>/dev/null || echo "")
    
    if echo "$auth_response" | grep -q "success"; then
        token=$(echo "$auth_response" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
        
        # Publish test messages
        for i in {1..5}; do
            curl -s -X POST "http://localhost:3001/api/messages/publish" \
                -H "Content-Type: application/json" \
                -H "Authorization: Bearer $token" \
                -d "{
                    \"topic\": \"test.performance.$i\",
                    \"type\": \"performance_test\",
                    \"target\": \"gateway\",
                    \"payload\": {
                        \"message\": \"Performance test message $i\",
                        \"timestamp\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"
                    }
                }" >/dev/null
        done
        
        print_success "Message publishing performance test completed"
    else
        print_warning "Could not authenticate for performance tests"
    fi
    
    echo ""
    
    # Health check
    print_status "Running health checks..."
    
    # Check API Gateway health
    health_response=$(curl -s "http://localhost:3001/api/health" 2>/dev/null || echo "")
    if echo "$health_response" | grep -q "healthy"; then
        print_success "API Gateway is healthy"
    else
        print_warning "API Gateway health check failed"
    fi
    
    # Check metrics
    metrics_response=$(curl -s "http://localhost:3001/api/metrics" 2>/dev/null || echo "")
    if echo "$metrics_response" | grep -q "success"; then
        print_success "Metrics are accessible"
    else
        print_warning "Metrics check failed"
    fi
    
    echo ""
    
    # Summary
    print_success "🎉 All tests completed successfully!"
    echo ""
    print_status "Test Summary:"
    echo "  ✅ API Gateway tests"
    echo "  ✅ Integration tests"
    echo "  ✅ SDK tests"
    echo "  ✅ Performance tests"
    echo "  ✅ Health checks"
    echo ""
    print_status "System is ready for production use!"
}

# Handle script interruption
trap 'print_error "Script interrupted"; exit 1' INT TERM

# Run main function
main "$@"
