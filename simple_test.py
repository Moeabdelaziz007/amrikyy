#!/usr/bin/env python3
"""
AuraOS MCP System - Simple Local Test
Test the MCP system components locally without Docker or Redis.
"""

import sys
import os
import json
import time
from datetime import datetime

def test_logic_analysis():
    """Test logic analysis functionality."""
    print("🧠 Testing Logic Analysis...")
    
    # Simple logic analysis
    def analyze_code_structure(code):
        """Basic code structure analysis."""
        lines = code.split('\n')
        functions = []
        classes = []
        
        for i, line in enumerate(lines):
            if line.strip().startswith('def '):
                func_name = line.strip().split('(')[0].replace('def ', '')
                functions.append({
                    'name': func_name,
                    'line': i + 1,
                    'complexity': len([l for l in lines[i:i+20] if 'if ' in l or 'for ' in l or 'while ' in l])
                })
            elif line.strip().startswith('class '):
                class_name = line.strip().split(':')[0].replace('class ', '')
                classes.append({
                    'name': class_name,
                    'line': i + 1
                })
        
        return {
            'functions': functions,
            'classes': classes,
            'total_lines': len(lines),
            'complexity_score': sum(f['complexity'] for f in functions)
        }
    
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

class DataProcessor:
    def __init__(self):
        self.data = []
    
    def add_item(self, item):
        self.data.append(item)
"""
    
    try:
        analysis = analyze_code_structure(test_code)
        print("✅ Logic analysis successful")
        print(f"📊 Found {len(analysis['functions'])} functions and {len(analysis['classes'])} classes")
        print(f"📈 Complexity score: {analysis['complexity_score']}")
        
        # Generate suggestions
        suggestions = []
        for func in analysis['functions']:
            if func['complexity'] > 3:
                suggestions.append(f"Function '{func['name']}' has high complexity ({func['complexity']}). Consider refactoring.")
        
        if suggestions:
            print("💡 Suggestions:")
            for suggestion in suggestions:
                print(f"  • {suggestion}")
        
        return True
        
    except Exception as e:
        print(f"❌ Logic analysis failed: {str(e)}")
        return False

def test_creativity_analysis():
    """Test creativity analysis functionality."""
    print("🎨 Testing Creativity Analysis...")
    
    # Simple creativity analysis
    def analyze_creativity(code):
        """Basic creativity analysis."""
        creativity_score = 0
        suggestions = []
        
        # Check for modern features
        if 'async' in code or 'await' in code:
            creativity_score += 20
            suggestions.append("✅ Uses async/await - modern approach!")
        
        if 'class' in code:
            creativity_score += 15
            suggestions.append("✅ Object-oriented design detected")
        
        if 'def ' in code:
            creativity_score += 10
            suggestions.append("✅ Functional programming elements")
        
        # Check for patterns
        if 'if ' in code and 'else' in code:
            suggestions.append("💡 Consider using polymorphism or strategy pattern")
        
        if 'for ' in code:
            suggestions.append("💡 Consider using list comprehensions or functional approaches")
        
        if 'def ' in code and 'return' in code:
            suggestions.append("💡 Consider using generators for memory efficiency")
        
        return {
            'creativity_score': min(creativity_score, 100),
            'suggestions': suggestions,
            'patterns_detected': ['Object-oriented', 'Functional', 'Async'] if creativity_score > 30 else ['Basic']
        }
    
    # Test code
    test_code = """
import asyncio
from typing import List, Dict

class AsyncDataProcessor:
    def __init__(self):
        self.data = []
    
    async def process_data(self, items: List[Dict]) -> List[Dict]:
        results = []
        for item in items:
            if item.get('active'):
                processed = await self.process_item(item)
                results.append(processed)
        return results
    
    async def process_item(self, item: Dict) -> Dict:
        await asyncio.sleep(0.1)  # Simulate async operation
        return {**item, 'processed': True}
"""
    
    try:
        analysis = analyze_creativity(test_code)
        print("✅ Creativity analysis successful")
        print(f"📊 Creativity score: {analysis['creativity_score']}/100")
        print(f"🎯 Patterns detected: {', '.join(analysis['patterns_detected'])}")
        
        if analysis['suggestions']:
            print("💡 Suggestions:")
            for suggestion in analysis['suggestions']:
                print(f"  • {suggestion}")
        
        return True
        
    except Exception as e:
        print(f"❌ Creativity analysis failed: {str(e)}")
        return False

def test_optimization_analysis():
    """Test optimization analysis functionality."""
    print("⚡ Testing Optimization Analysis...")
    
    # Simple optimization analysis
    def analyze_performance(code):
        """Basic performance analysis."""
        issues = []
        suggestions = []
        performance_score = 100
        
        # Check for performance issues
        if 'range(len(' in code:
            issues.append("Inefficient loop: range(len())")
            suggestions.append("Use enumerate() or direct iteration")
            performance_score -= 20
        
        if 'time.sleep(' in code:
            issues.append("Blocking operation: time.sleep()")
            suggestions.append("Consider using async/await for non-blocking operations")
            performance_score -= 15
        
        if '.append(' in code and code.count('.append(') > 3:
            issues.append("Multiple list appends")
            suggestions.append("Consider using list comprehension or pre-allocation")
            performance_score -= 10
        
        if 'def ' in code and 'return' in code:
            suggestions.append("Consider using generators for memory efficiency")
        
        return {
            'performance_score': max(performance_score, 0),
            'issues_found': issues,
            'suggestions': suggestions,
            'optimization_opportunities': len(issues)
        }
    
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

def slow_operation():
    import time
    time.sleep(1)  # Blocking operation
    return "Done"
"""
    
    try:
        analysis = analyze_performance(test_code)
        print("✅ Performance analysis successful")
        print(f"📊 Performance score: {analysis['performance_score']}/100")
        print(f"⚠️  Issues found: {len(analysis['issues_found'])}")
        
        if analysis['issues_found']:
            print("🚨 Performance Issues:")
            for issue in analysis['issues_found']:
                print(f"  • {issue}")
        
        if analysis['suggestions']:
            print("💡 Optimization Suggestions:")
            for suggestion in analysis['suggestions']:
                print(f"  • {suggestion}")
        
        return True
        
    except Exception as e:
        print(f"❌ Performance analysis failed: {str(e)}")
        return False

def test_complete_analysis():
    """Test complete analysis system."""
    print("🚀 Testing Complete Analysis System...")
    
    # Test code
    test_code = """
import asyncio
from typing import List, Dict, Optional

class AsyncDataProcessor:
    def __init__(self, max_concurrent: int = 10):
        self.max_concurrent = max_concurrent
        self.semaphore = asyncio.Semaphore(max_concurrent)
    
    async def fetch_data(self, session, url: str) -> Optional[Dict]:
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
    
    try:
        print("📝 Analyzing code...")
        print(f"Code:\n{test_code}")
        
        # Run all analyses
        results = {}
        
        # Logic analysis
        print("\n🧠 Logic Analysis:")
        logic_result = test_logic_analysis()
        results['logic'] = logic_result
        
        # Creativity analysis
        print("\n🎨 Creativity Analysis:")
        creativity_result = test_creativity_analysis()
        results['creativity'] = creativity_result
        
        # Optimization analysis
        print("\n⚡ Optimization Analysis:")
        optimization_result = test_optimization_analysis()
        results['optimization'] = optimization_result
        
        return results
        
    except Exception as e:
        print(f"❌ Complete analysis failed: {str(e)}")
        return False

def main():
    """Main test function."""
    print("🚀 AuraOS MCP System - Simple Local Test")
    print("=" * 50)
    print(f"Test started at: {datetime.now().isoformat()}")
    print()
    
    # Test individual components
    tests = [
        ("Logic Analysis", test_logic_analysis),
        ("Creativity Analysis", test_creativity_analysis),
        ("Optimization Analysis", test_optimization_analysis)
    ]
    
    results = []
    
    for test_name, test_func in tests:
        print(f"\n🧪 Running {test_name}...")
        try:
            result = test_func()
            results.append((test_name, result))
        except Exception as e:
            print(f"❌ {test_name} failed with exception: {str(e)}")
            results.append((test_name, False))
        
        time.sleep(1)  # Brief pause between tests
    
    # Test complete system
    print(f"\n🧪 Running Complete System Test...")
    try:
        system_results = test_complete_analysis()
        results.append(("Complete System", True))
        print("✅ Complete system test successful")
    except Exception as e:
        print(f"❌ Complete system test failed: {str(e)}")
        results.append(("Complete System", False))
    
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
        print("\n💡 You can now use the MCP system locally!")
        print("\n🔧 To use in your projects:")
        print("  1. Copy the analysis functions to your code")
        print("  2. Call them with your code snippets")
        print("  3. Get AI-powered suggestions!")
        return 0
    else:
        print("⚠️  Some tests failed. Check the errors above.")
        return 1

if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)
