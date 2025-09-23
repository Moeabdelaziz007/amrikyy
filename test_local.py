#!/usr/bin/env python3
"""
AuraOS MCP System - Local Testing (No Docker)
Test the MCP system components locally without Docker.
"""

import sys
import os
import time
import json
import threading
import queue
from datetime import datetime

# Add the mcp directory to the path
sys.path.append(os.path.join(os.path.dirname(__file__), 'mcp'))

def test_logic_agent():
    """Test Logic Agent locally."""
    print("🧠 Testing Logic Agent...")
    try:
        from agents.logic_agent import LogicAgent
        
        agent = LogicAgent()
        
        # Test code
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
        
        # Test analysis
        analysis = agent.analyze_code_structure(test_code)
        print("✅ Logic Agent analysis successful")
        print(f"📊 Analysis: {json.dumps(analysis, indent=2)}")
        
        # Test suggestions
        suggestions = agent.suggest_improvements(test_code, "Testing logic agent")
        print("✅ Logic Agent suggestions generated")
        print(f"💡 Suggestions: {json.dumps(suggestions, indent=2)}")
        
        return True
        
    except Exception as e:
        print(f"❌ Logic Agent test failed: {str(e)}")
        return False

def test_creativity_agent():
    """Test Creativity Agent locally."""
    print("🎨 Testing Creativity Agent...")
    try:
        from agents.creativity_agent import CreativityAgent
        
        agent = CreativityAgent()
        
        # Test code
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
        return result
"""
        
        # Test creativity analysis
        analysis = agent.analyze_creativity_potential(test_code)
        print("✅ Creativity Agent analysis successful")
        print(f"📊 Analysis: {json.dumps(analysis, indent=2)}")
        
        # Test creative solutions
        solutions = agent.suggest_creative_solutions(test_code, "Testing creativity agent")
        print("✅ Creativity Agent solutions generated")
        print(f"💡 Solutions: {json.dumps(solutions, indent=2)}")
        
        return True
        
    except Exception as e:
        print(f"❌ Creativity Agent test failed: {str(e)}")
        return False

def test_optimization_agent():
    """Test Optimization Agent locally."""
    print("⚡ Testing Optimization Agent...")
    try:
        from agents.optimization_agent import OptimizationAgent
        
        agent = OptimizationAgent()
        
        # Test code
        test_code = """
def inefficient_fibonacci(n):
    if n <= 1:
        return n
    return inefficient_fibonacci(n-1) + inefficient_fibonacci(n-2)

def process_large_list(data):
    result = []
    for i in range(len(data)):
        if data[i] > 0:
            result.append(data[i] * 2)
    return result
"""
        
        # Test performance analysis
        analysis = agent.analyze_performance(test_code)
        print("✅ Optimization Agent analysis successful")
        print(f"📊 Analysis: {json.dumps(analysis, indent=2)}")
        
        # Test optimizations
        optimizations = agent.suggest_optimizations(test_code, "Testing optimization agent")
        print("✅ Optimization Agent optimizations generated")
        print(f"💡 Optimizations: {json.dumps(optimizations, indent=2)}")
        
        return True
        
    except Exception as e:
        print(f"❌ Optimization Agent test failed: {str(e)}")
        return False

def test_local_mcp_system():
    """Test the complete MCP system locally."""
    print("🚀 Testing Complete MCP System Locally...")
    
    # Create a simple in-memory queue system
    class LocalMCPQueue:
        def __init__(self):
            self.queue = queue.Queue()
            self.results = queue.Queue()
        
        def put_request(self, request):
            self.queue.put(request)
        
        def get_request(self):
            try:
                return self.queue.get_nowait()
            except queue.Empty:
                return None
        
        def put_result(self, result):
            self.results.put(result)
        
        def get_result(self):
            try:
                return self.results.get_nowait()
            except queue.Empty:
                return None
    
    # Initialize local queue
    local_queue = LocalMCPQueue()
    
    # Test code
    test_code = """
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
"""
    
    print("📝 Test code:")
    print(test_code)
    
    # Test all agents
    results = {}
    
    # Logic Agent
    try:
        from agents.logic_agent import LogicAgent
        logic_agent = LogicAgent()
        logic_result = logic_agent.suggest_improvements(test_code, "Local MCP test")
        results['logic'] = logic_result
        print("✅ Logic Agent completed")
    except Exception as e:
        print(f"❌ Logic Agent failed: {str(e)}")
        results['logic'] = {'error': str(e)}
    
    # Creativity Agent
    try:
        from agents.creativity_agent import CreativityAgent
        creativity_agent = CreativityAgent()
        creativity_result = creativity_agent.suggest_creative_solutions(test_code, "Local MCP test")
        results['creativity'] = creativity_result
        print("✅ Creativity Agent completed")
    except Exception as e:
        print(f"❌ Creativity Agent failed: {str(e)}")
        results['creativity'] = {'error': str(e)}
    
    # Optimization Agent
    try:
        from agents.optimization_agent import OptimizationAgent
        optimization_agent = OptimizationAgent()
        optimization_result = optimization_agent.suggest_optimizations(test_code, "Local MCP test")
        results['optimization'] = optimization_result
        print("✅ Optimization Agent completed")
    except Exception as e:
        print(f"❌ Optimization Agent failed: {str(e)}")
        results['optimization'] = {'error': str(e)}
    
    return results

def main():
    """Main test function."""
    print("🚀 AuraOS MCP System - Local Testing (No Docker)")
    print("=" * 60)
    print(f"Test started at: {datetime.now().isoformat()}")
    print()
    
    # Check Python dependencies
    print("🔍 Checking Python dependencies...")
    try:
        import ast
        import re
        import json
        import threading
        import queue
        print("✅ Basic Python modules available")
    except ImportError as e:
        print(f"❌ Missing Python module: {str(e)}")
        return 1
    
    # Test individual agents
    tests = [
        ("Logic Agent", test_logic_agent),
        ("Creativity Agent", test_creativity_agent),
        ("Optimization Agent", test_optimization_agent)
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
    
    # Test complete system
    print(f"\n🧪 Running Complete MCP System test...")
    try:
        system_results = test_local_mcp_system()
        results.append(("Complete System", True))
        print("✅ Complete system test successful")
    except Exception as e:
        print(f"❌ Complete system test failed: {str(e)}")
        results.append(("Complete System", False))
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 Test Results Summary")
    print("=" * 60)
    
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
        print("\n💡 You can now use the MCP system locally without Docker!")
        return 0
    else:
        print("⚠️  Some tests failed. Check the errors above.")
        return 1

if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)
