#!/usr/bin/env python3
"""
AuraOS MCP System - Example Usage
Demonstrates how to use the MCP system for code analysis.
"""

import sys
import os
import json
import time

# Add the mcp directory to the path
sys.path.append(os.path.join(os.path.dirname(__file__), 'mcp'))

def example_basic_usage():
    """Basic usage example."""
    print("🚀 AuraOS MCP System - Basic Usage Example")
    print("=" * 50)
    
    try:
        from cursor_integration.cursor_mcp import CursorMCP
        
        # Initialize MCP client
        mcp = CursorMCP()
        
        # Example code to analyze
        code = """
def calculate_fibonacci(n):
    if n <= 1:
        return n
    return calculate_fibonacci(n-1) + calculate_fibonacci(n-2)

def process_user_data(users):
    active_users = []
    for user in users:
        if user.get('status') == 'active':
            active_users.append(user)
    return active_users

class DataValidator:
    def __init__(self):
        self.rules = []
    
    def add_rule(self, rule):
        self.rules.append(rule)
    
    def validate(self, data):
        for rule in self.rules:
            if not rule(data):
                return False
        return True
"""
        
        print("📝 Analyzing code...")
        print(f"Code:\n{code}")
        
        # Perform quick analysis
        print("\n⚡ Quick Analysis Results:")
        quick_results = mcp.quick_analyze(code, "Example code analysis")
        print(json.dumps(quick_results, indent=2))
        
        # Perform full analysis
        print("\n🔍 Full Analysis Results:")
        full_results = mcp.analyze_via_bridge(code, "Example code analysis")
        print(json.dumps(full_results, indent=2))
        
        print("\n✅ Analysis completed successfully!")
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        print("Make sure the MCP system is running with: ./start_mcp.sh")

def example_advanced_usage():
    """Advanced usage example with custom analysis."""
    print("\n🚀 AuraOS MCP System - Advanced Usage Example")
    print("=" * 50)
    
    try:
        from cursor_integration.cursor_mcp import CursorMCP
        
        # Initialize MCP client
        mcp = CursorMCP()
        
        # Complex code example
        code = """
import asyncio
import aiohttp
from typing import List, Dict, Optional

class AsyncDataProcessor:
    def __init__(self, max_concurrent: int = 10):
        self.max_concurrent = max_concurrent
        self.semaphore = asyncio.Semaphore(max_concurrent)
    
    async def fetch_data(self, session: aiohttp.ClientSession, url: str) -> Optional[Dict]:
        async with self.semaphore:
            try:
                async with session.get(url) as response:
                    if response.status == 200:
                        return await response.json()
                    return None
            except Exception as e:
                print(f"Error fetching {url}: {e}")
                return None
    
    async def process_urls(self, urls: List[str]) -> List[Dict]:
        async with aiohttp.ClientSession() as session:
            tasks = [self.fetch_data(session, url) for url in urls]
            results = await asyncio.gather(*tasks, return_exceptions=True)
            return [r for r in results if r is not None and not isinstance(r, Exception)]
    
    def calculate_statistics(self, data: List[Dict]) -> Dict:
        if not data:
            return {}
        
        total = len(data)
        numeric_values = [item.get('value', 0) for item in data if isinstance(item.get('value'), (int, float))]
        
        return {
            'total_items': total,
            'numeric_items': len(numeric_values),
            'average': sum(numeric_values) / len(numeric_values) if numeric_values else 0,
            'min': min(numeric_values) if numeric_values else 0,
            'max': max(numeric_values) if numeric_values else 0
        }
"""
        
        print("📝 Analyzing complex async code...")
        print(f"Code:\n{code}")
        
        # Analyze with specific context
        context = "Async data processing with rate limiting and error handling"
        
        # Perform analysis
        print("\n🔍 Analysis Results:")
        results = mcp.analyze_via_bridge(code, context, "all")
        
        # Display results in a structured way
        if 'results' in results:
            for agent_type, agent_result in results['results'].items():
                if agent_result:
                    print(f"\n🤖 {agent_type.upper()} AGENT:")
                    print(f"Status: {agent_result.get('status', 'unknown')}")
                    
                    if 'suggestions' in agent_result:
                        print("Suggestions:")
                        for suggestion in agent_result['suggestions']:
                            print(f"  • {suggestion}")
                    
                    if 'optimizations' in agent_result:
                        print("Optimizations:")
                        for opt in agent_result['optimizations']:
                            print(f"  • {opt}")
        
        print("\n✅ Advanced analysis completed!")
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        print("Make sure the MCP system is running with: ./start_mcp.sh")

def example_integration_with_cursor():
    """Example of integrating with Cursor IDE."""
    print("\n🚀 AuraOS MCP System - Cursor Integration Example")
    print("=" * 50)
    
    print("""
To integrate with Cursor IDE, you can:

1. **Use the MCP Bridge API directly:**
   ```python
   import requests
   
   def analyze_code_in_cursor(code):
       response = requests.post("http://localhost:8080/analyze", json={
           "code": code,
           "context": "Cursor IDE integration",
           "request_type": "all"
       })
       return response.json()
   ```

2. **Use the CursorMCP class:**
   ```python
   from mcp.cursor_integration.cursor_mcp import CursorMCP
   
   mcp = CursorMCP()
   results = mcp.analyze_via_bridge(your_code)
   ```

3. **Create a Cursor extension:**
   - Use the MCP Bridge API
   - Display results in Cursor's UI
   - Provide real-time suggestions

4. **Use in your development workflow:**
   - Analyze code before committing
   - Get suggestions during development
   - Optimize performance-critical code
   """)

def main():
    """Main function to run examples."""
    print("🎯 AuraOS MCP System - Usage Examples")
    print("=" * 60)
    
    # Check if system is running
    try:
        import requests
        response = requests.get("http://localhost:8080/health", timeout=5)
        if response.status_code != 200:
            raise Exception("System not healthy")
    except:
        print("❌ MCP system is not running!")
        print("Please start it with: ./start_mcp.sh")
        return
    
    # Run examples
    example_basic_usage()
    example_advanced_usage()
    example_integration_with_cursor()
    
    print("\n🎉 All examples completed!")
    print("\n💡 Tips:")
    print("  - Use 'quick_analyze' for fast feedback")
    print("  - Use 'analyze_via_bridge' for comprehensive analysis")
    print("  - Check system health with: curl http://localhost:8080/health")
    print("  - View logs with: docker-compose logs -f")

if __name__ == "__main__":
    main()
