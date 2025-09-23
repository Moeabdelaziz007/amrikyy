#!/usr/bin/env python3
"""
AuraOS MCP System Test Script
Comprehensive testing of the MCP system functionality.
"""

import sys
import os
import time
import json
import requests
from datetime import datetime

# Add the mcp directory to the path
sys.path.append(os.path.join(os.path.dirname(__file__), 'mcp'))

def test_redis_connection():
    """Test Redis connection."""
    print("🔴 Testing Redis connection...")
    try:
        import redis
        r = redis.Redis(host='localhost', port=6379, decode_responses=True)
        r.ping()
        print("✅ Redis connection successful")
        return True
    except Exception as e:
        print(f"❌ Redis connection failed: {str(e)}")
        return False

def test_bridge_health():
    """Test MCP bridge health."""
    print("🌉 Testing MCP bridge health...")
    try:
        response = requests.get("http://localhost:8080/health", timeout=5)
        if response.status_code == 200:
            print("✅ MCP bridge is healthy")
            return True
        else:
            print(f"❌ MCP bridge health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ MCP bridge health check failed: {str(e)}")
        return False

def test_active_agents():
    """Test active agents."""
    print("🤖 Testing active agents...")
    try:
        response = requests.get("http://localhost:8080/agents", timeout=5)
        if response.status_code == 200:
            agents = response.json()
            print(f"✅ Active agents: {agents}")
            return True
        else:
            print(f"❌ Failed to get active agents: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Failed to get active agents: {str(e)}")
        return False

def test_quick_analysis():
    """Test quick analysis functionality."""
    print("⚡ Testing quick analysis...")
    try:
        test_code = """
def calculate_fibonacci(n):
    if n <= 1:
        return n
    return calculate_fibonacci(n-1) + calculate_fibonacci(n-2)

def process_data(data):
    result = []
    for item in data:
        if item > 0:
            result.append(item * 2)
    return result
"""
        
        payload = {
            "code": test_code,
            "context": "Testing MCP system",
            "request_type": "all",
            "priority": "medium"
        }
        
        response = requests.post("http://localhost:8080/quick_analyze", 
                               json=payload, timeout=10)
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Quick analysis successful")
            print(f"📊 Results: {json.dumps(result, indent=2)}")
            return True
        else:
            print(f"❌ Quick analysis failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Quick analysis failed: {str(e)}")
        return False

def test_full_analysis():
    """Test full analysis functionality."""
    print("🔍 Testing full analysis...")
    try:
        test_code = """
class DataProcessor:
    def __init__(self):
        self.data = []
    
    def add_data(self, item):
        self.data.append(item)
    
    def process(self):
        result = []
        for item in self.data:
            if isinstance(item, (int, float)):
                result.append(item * 2)
            elif isinstance(item, str):
                result.append(item.upper())
        return result
    
    def get_stats(self):
        return {
            'count': len(self.data),
            'sum': sum(item for item in self.data if isinstance(item, (int, float)))
        }
"""
        
        payload = {
            "code": test_code,
            "context": "Testing full MCP analysis",
            "request_type": "all",
            "priority": "high"
        }
        
        response = requests.post("http://localhost:8080/analyze", 
                               json=payload, timeout=30)
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Full analysis successful")
            print(f"📊 Results: {json.dumps(result, indent=2)}")
            return True
        else:
            print(f"❌ Full analysis failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Full analysis failed: {str(e)}")
        return False

def test_cursor_integration():
    """Test Cursor integration."""
    print("🎯 Testing Cursor integration...")
    try:
        from cursor_integration.cursor_mcp import CursorMCP
        
        mcp = CursorMCP()
        
        # Test health check
        health = mcp.health_check()
        print(f"Health check: {health}")
        
        # Test quick analysis
        test_code = "def hello(): print('Hello, World!')"
        quick_result = mcp.quick_analyze(test_code, "Testing Cursor integration")
        print(f"Quick analysis result: {json.dumps(quick_result, indent=2)}")
        
        print("✅ Cursor integration successful")
        return True
    except Exception as e:
        print(f"❌ Cursor integration failed: {str(e)}")
        return False

def main():
    """Main test function."""
    print("🚀 AuraOS MCP System Test Suite")
    print("=" * 50)
    print(f"Test started at: {datetime.now().isoformat()}")
    print()
    
    tests = [
        ("Redis Connection", test_redis_connection),
        ("Bridge Health", test_bridge_health),
        ("Active Agents", test_active_agents),
        ("Quick Analysis", test_quick_analysis),
        ("Full Analysis", test_full_analysis),
        ("Cursor Integration", test_cursor_integration)
    ]
    
    results = []
    
    for test_name, test_func in tests:
        print(f"\n🧪 Running {test_name} test...")
        try:
            result = test_func()
            results.append((test_name, result))
        except Exception as e:
            print(f"❌ {test_name} test failed with exception: {str(e)}")
            results.append((test_name, False))
        
        time.sleep(1)  # Brief pause between tests
    
    # Summary
    print("\n" + "=" * 50)
    print("📊 Test Results Summary")
    print("=" * 50)
    
    passed = 0
    total = len(results)
    
    for test_name, result in results:
        status = "✅ PASSED" if result else "❌ FAILED"
        print(f"{test_name}: {status}")
        if result:
            passed += 1
    
    print(f"\n🎯 Overall: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! MCP system is working correctly.")
        return 0
    else:
        print("⚠️  Some tests failed. Check the logs and system status.")
        return 1

if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)
