#!/usr/bin/env python3
"""
AuraOS Cursor MCP Integration
Simple script to integrate Cursor with the MCP system.
"""

import redis
import requests
import json
import time
import uuid
from typing import Dict, List, Any, Optional
from datetime import datetime

class CursorMCP:
    def __init__(self, redis_host="localhost", redis_port=6379, bridge_url="http://localhost:8080"):
        self.redis_host = redis_host
        self.redis_port = redis_port
        self.bridge_url = bridge_url
        
        # Initialize Redis connection
        try:
            self.redis_client = redis.Redis(
                host=self.redis_host,
                port=self.redis_port,
                decode_responses=True,
                retry_on_timeout=True,
                socket_connect_timeout=5
            )
            self.redis_client.ping()
            print("✅ Connected to Redis successfully")
        except Exception as e:
            print(f"❌ Failed to connect to Redis: {str(e)}")
            self.redis_client = None

    def send_code_for_analysis(self, code: str, context: str = "", request_type: str = "all") -> Dict[str, Any]:
        """Send code to MCP system for analysis."""
        try:
            if not self.redis_client:
                return {"error": "Redis connection not available"}
            
            request_id = str(uuid.uuid4())
            request_data = {
                "request_id": request_id,
                "code": code,
                "context": context,
                "request_type": request_type,
                "timestamp": datetime.now().isoformat()
            }
            
            # Send to MCP queue
            self.redis_client.rpush("mcp_queue", json.dumps(request_data))
            print(f"📤 Sent request {request_id} to MCP queue")
            
            # Wait for results
            results = self._wait_for_results(request_id, timeout=30)
            
            return {
                "request_id": request_id,
                "status": "completed",
                "results": results,
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            return {"error": f"Failed to send code for analysis: {str(e)}"}

    def _wait_for_results(self, request_id: str, timeout: int = 30) -> Dict[str, Any]:
        """Wait for results from MCP agents."""
        start_time = time.time()
        results = {
            "logic": None,
            "creativity": None,
            "optimization": None
        }
        
        print(f"⏳ Waiting for results for request {request_id}...")
        
        while time.time() - start_time < timeout:
            try:
                # Check for results
                result_data = self.redis_client.lpop("mcp_results")
                
                if result_data:
                    result = json.loads(result_data)
                    
                    # Check if this result is for our request
                    if result.get("request_id") == request_id:
                        agent_type = result.get("agent_type")
                        if agent_type in results:
                            results[agent_type] = result
                            print(f"✅ Received result from {agent_type} agent")
                
                # Check if we have all results
                if all(results.values()):
                    print("🎉 All results received!")
                    break
                
                time.sleep(0.5)
                
            except Exception as e:
                print(f"❌ Error waiting for results: {str(e)}")
                break
        
        return results

    def analyze_via_bridge(self, code: str, context: str = "", request_type: str = "all") -> Dict[str, Any]:
        """Analyze code via the MCP bridge API."""
        try:
            url = f"{self.bridge_url}/analyze"
            payload = {
                "code": code,
                "context": context,
                "request_type": request_type,
                "priority": "medium"
            }
            
            response = requests.post(url, json=payload, timeout=30)
            response.raise_for_status()
            
            return response.json()
            
        except Exception as e:
            return {"error": f"Failed to analyze via bridge: {str(e)}"}

    def quick_analyze(self, code: str, context: str = "") -> Dict[str, Any]:
        """Perform quick analysis via the bridge."""
        try:
            url = f"{self.bridge_url}/quick_analyze"
            payload = {
                "code": code,
                "context": context,
                "request_type": "all",
                "priority": "medium"
            }
            
            response = requests.post(url, json=payload, timeout=10)
            response.raise_for_status()
            
            return response.json()
            
        except Exception as e:
            return {"error": f"Failed to perform quick analysis: {str(e)}"}

    def get_active_agents(self) -> Dict[str, Any]:
        """Get list of active agents."""
        try:
            url = f"{self.bridge_url}/agents"
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            
            return response.json()
            
        except Exception as e:
            return {"error": f"Failed to get active agents: {str(e)}"}

    def health_check(self) -> Dict[str, Any]:
        """Check system health."""
        try:
            url = f"{self.bridge_url}/health"
            response = requests.get(url, timeout=5)
            response.raise_for_status()
            
            return response.json()
            
        except Exception as e:
            return {"error": f"Health check failed: {str(e)}"}

def main():
    """Main function for testing the integration."""
    print("🚀 AuraOS Cursor MCP Integration")
    print("=" * 50)
    
    # Initialize MCP client
    mcp = CursorMCP()
    
    # Test health check
    print("\n🔍 Checking system health...")
    health = mcp.health_check()
    print(f"Health status: {health}")
    
    # Test getting active agents
    print("\n🤖 Getting active agents...")
    agents = mcp.get_active_agents()
    print(f"Active agents: {agents}")
    
    # Test code analysis
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
    
    print("\n📝 Testing code analysis...")
    print(f"Test code:\n{test_code}")
    
    # Try bridge analysis first
    print("\n🌉 Analyzing via bridge...")
    bridge_results = mcp.analyze_via_bridge(test_code, "Testing MCP integration")
    print(f"Bridge results: {json.dumps(bridge_results, indent=2)}")
    
    # Try direct Redis analysis
    print("\n🔴 Analyzing via Redis...")
    redis_results = mcp.send_code_for_analysis(test_code, "Testing MCP integration")
    print(f"Redis results: {json.dumps(redis_results, indent=2)}")
    
    # Try quick analysis
    print("\n⚡ Quick analysis...")
    quick_results = mcp.quick_analyze(test_code, "Testing MCP integration")
    print(f"Quick results: {json.dumps(quick_results, indent=2)}")

if __name__ == "__main__":
    main()
