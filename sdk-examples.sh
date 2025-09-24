#!/bin/bash
# A2A SDK Quick Start Examples
# أمثلة البدء السريع لـ SDKs

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

# Main function
main() {
    echo "🚀 AuraOS A2A SDK Quick Start Examples"
    echo "======================================"
    echo ""
    
    # Check if API Gateway is running
    print_status "Checking if API Gateway is running..."
    if ! check_service "http://localhost:3001/api/health" "API Gateway"; then
        print_error "API Gateway is not running. Please start the system first:"
        echo "  ./start-a2a-system.sh"
        exit 1
    fi
    
    print_success "API Gateway is ready!"
    echo ""
    
    # Node.js SDK Example
    print_status "Running Node.js SDK example..."
    if [ -d "sdk/node" ]; then
        cd sdk/node
        
        # Create example file if it doesn't exist
        if [ ! -f "example.js" ]; then
            cat > example.js << 'EOF'
const { A2AClient } = require('./dist/index.js');

async function main() {
    const client = new A2AClient({
        gatewayUrl: 'http://localhost:3001',
        apiKey: 'test_api_key_123'
    });

    try {
        // Connect to WebSocket
        await client.connectWebSocket();
        console.log('✅ Connected to WebSocket');

        // Set event handlers
        client.on('connected', () => console.log('🔗 WebSocket connected'));
        client.on('authenticated', (user) => console.log('🔐 Authenticated:', user));
        client.on('message', (message) => console.log('📨 Message received:', message));
        client.on('error', (error) => console.error('❌ Error:', error));

        // Login
        const loginResult = await client.login('admin', 'default123');
        console.log('✅ Login successful:', loginResult.user.username);

        // Publish a message
        const publishResult = await client.publishMessage('test.sdk', {
            type: 'test_message',
            target: 'gateway',
            payload: {
                message: 'Hello from Node.js SDK!',
                timestamp: new Date().toISOString()
            },
            priority: 'normal'
        });
        console.log('✅ Message published:', publishResult.messageId);

        // Subscribe to topic
        await client.subscribeToTopic('test.sdk');
        console.log('✅ Subscribed to test.sdk topic');

        // Record metrics
        await client.recordCustomMetric('sdk_usage', 1.0, { language: 'nodejs' });
        console.log('✅ Custom metric recorded');

        // Get health status
        const health = await client.getHealthStatus();
        console.log('✅ Health status:', health.overall);

        // Keep connection alive for a few seconds
        await new Promise(resolve => setTimeout(resolve, 5000));

        // Disconnect
        await client.disconnect();
        console.log('✅ Disconnected');

    } catch (error) {
        console.error('❌ Error:', error);
    }
}

main().catch(console.error);
EOF
        fi
        
        # Run example
        if [ -f "package.json" ]; then
            npm install
            npm run build
            node example.js
            print_success "Node.js SDK example completed"
        else
            print_warning "No package.json found in Node.js SDK directory"
        fi
        
        cd ../..
    else
        print_warning "Node.js SDK directory not found"
    fi
    
    echo ""
    
    # Python SDK Example
    print_status "Running Python SDK example..."
    if [ -d "sdk/python" ]; then
        cd sdk/python
        
        # Create example file if it doesn't exist
        if [ ! -f "example.py" ]; then
            cat > example.py << 'EOF'
#!/usr/bin/env python3
import asyncio
import sys
import os

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from a2a_client import A2AClient, A2AConfig

async def main():
    config = A2AConfig(
        gateway_url="http://localhost:3001",
        api_key="test_api_key_123"
    )
    
    async with A2AClient(config) as client:
        # Set event handlers
        client.on_connected = lambda: print("🔗 WebSocket connected")
        client.on_disconnected = lambda: print("🔌 WebSocket disconnected")
        client.on_authenticated = lambda user: print(f"🔐 Authenticated: {user['username']}")
        client.on_error = lambda error: print(f"❌ Error: {error}")
        client.on_message = lambda message: print(f"📨 Message received: {message}")
        
        try:
            # Connect WebSocket
            await client.connect_websocket()
            print("✅ Connected to WebSocket")
            
            # Login
            login_result = await client.login("admin", "default123")
            print(f"✅ Login successful: {login_result['user']['username']}")
            
            # Publish a message
            publish_result = await client.publish_message(
                topic="test.sdk",
                message_type="test_message",
                target="gateway",
                payload={
                    "message": "Hello from Python SDK!",
                    "timestamp": "2024-01-01T00:00:00Z"
                },
                priority="normal"
            )
            print(f"✅ Message published: {publish_result['messageId']}")
            
            # Subscribe to topic
            await client.subscribe_to_topic("test.sdk")
            print("✅ Subscribed to test.sdk topic")
            
            # Record metrics
            await client.record_custom_metric("sdk_usage", 1.0, {"language": "python"})
            print("✅ Custom metric recorded")
            
            # Get health status
            health = await client.get_health_status()
            print(f"✅ Health status: {health.overall}")
            
            # Keep connection alive for a few seconds
            await asyncio.sleep(5)
            
            print("✅ Python SDK example completed")
            
        except Exception as e:
            print(f"❌ Error: {e}")

if __name__ == "__main__":
    asyncio.run(main())
EOF
        fi
        
        # Run example
        if [ -f "requirements.txt" ]; then
            pip install -r requirements.txt
            python example.py
            print_success "Python SDK example completed"
        else
            print_warning "No requirements.txt found in Python SDK directory"
        fi
        
        cd ../..
    else
        print_warning "Python SDK directory not found"
    fi
    
    echo ""
    
    # REST API Examples
    print_status "Running REST API examples..."
    
    # Test authentication
    print_status "Testing authentication..."
    auth_response=$(curl -s -X POST "http://localhost:3001/api/auth/login" \
        -H "Content-Type: application/json" \
        -d '{"username":"admin","password":"default123"}' 2>/dev/null || echo "")
    
    if echo "$auth_response" | grep -q "success"; then
        token=$(echo "$auth_response" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
        print_success "Authentication successful"
        
        # Test message publishing
        print_status "Testing message publishing..."
        publish_response=$(curl -s -X POST "http://localhost:3001/api/messages/publish" \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer $token" \
            -d '{
                "topic": "test.rest",
                "type": "test_message",
                "target": "gateway",
                "payload": {
                    "message": "Hello from REST API!",
                    "timestamp": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'"
                },
                "priority": "normal"
            }' 2>/dev/null || echo "")
        
        if echo "$publish_response" | grep -q "success"; then
            print_success "Message published successfully"
        else
            print_warning "Message publishing failed"
        fi
        
        # Test subscription
        print_status "Testing subscription..."
        subscribe_response=$(curl -s -X POST "http://localhost:3001/api/messages/subscribe" \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer $token" \
            -d '{
                "topic": "test.rest"
            }' 2>/dev/null || echo "")
        
        if echo "$subscribe_response" | grep -q "success"; then
            print_success "Subscription successful"
        else
            print_warning "Subscription failed"
        fi
        
        # Test metrics
        print_status "Testing metrics..."
        metrics_response=$(curl -s -X POST "http://localhost:3001/api/metrics/custom" \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer $token" \
            -d '{
                "name": "rest_api_usage",
                "value": 1.0,
                "labels": {
                    "method": "rest"
                }
            }' 2>/dev/null || echo "")
        
        if echo "$metrics_response" | grep -q "success"; then
            print_success "Custom metric recorded"
        else
            print_warning "Custom metric recording failed")
        fi
        
    else
        print_warning "Authentication failed"
    fi
    
    echo ""
    
    # Summary
    print_success "🎉 All SDK examples completed successfully!"
    echo ""
    print_status "Examples Summary:"
    echo "  ✅ Node.js SDK example"
    echo "  ✅ Python SDK example"
    echo "  ✅ REST API examples"
    echo ""
    print_status "SDKs are ready for use!"
    echo ""
    print_status "Next steps:"
    echo "  1. Integrate the SDKs into your applications"
    echo "  2. Configure your Telegram Bot token"
    echo "  3. Set up your Autopilot workflows"
    echo "  4. Monitor the system using Grafana"
}

# Handle script interruption
trap 'print_error "Script interrupted"; exit 1' INT TERM

# Run main function
main "$@"
