#!/usr/bin/env python3
"""
AuraOS MCP System - Simple Usage Example
Use the MCP system to analyze your own code.
"""

import sys
import os
import json
from datetime import datetime

def analyze_code_logic(code):
    """Analyze code structure and logic."""
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

def analyze_code_creativity(code):
    """Analyze code creativity and patterns."""
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

def analyze_code_performance(code):
    """Analyze code performance and optimization opportunities."""
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

def analyze_code(code, context=""):
    """Complete code analysis using all MCP agents."""
    print("🚀 AuraOS MCP System - Code Analysis")
    print("=" * 50)
    print(f"Analysis started at: {datetime.now().isoformat()}")
    if context:
        print(f"Context: {context}")
    print()
    
    print("📝 Code to analyze:")
    print("-" * 30)
    print(code)
    print("-" * 30)
    
    # Run all analyses
    results = {}
    
    # Logic Analysis
    print("\n🧠 Logic Analysis:")
    logic_result = analyze_code_logic(code)
    results['logic'] = logic_result
    print(f"📊 Found {len(logic_result['functions'])} functions and {len(logic_result['classes'])} classes")
    print(f"📈 Complexity score: {logic_result['complexity_score']}")
    
    # Generate logic suggestions
    logic_suggestions = []
    for func in logic_result['functions']:
        if func['complexity'] > 3:
            logic_suggestions.append(f"Function '{func['name']}' has high complexity ({func['complexity']}). Consider refactoring.")
    
    if logic_suggestions:
        print("💡 Logic Suggestions:")
        for suggestion in logic_suggestions:
            print(f"  • {suggestion}")
    
    # Creativity Analysis
    print("\n🎨 Creativity Analysis:")
    creativity_result = analyze_code_creativity(code)
    results['creativity'] = creativity_result
    print(f"📊 Creativity score: {creativity_result['creativity_score']}/100")
    print(f"🎯 Patterns detected: {', '.join(creativity_result['patterns_detected'])}")
    
    if creativity_result['suggestions']:
        print("💡 Creativity Suggestions:")
        for suggestion in creativity_result['suggestions']:
            print(f"  • {suggestion}")
    
    # Performance Analysis
    print("\n⚡ Performance Analysis:")
    performance_result = analyze_code_performance(code)
    results['performance'] = performance_result
    print(f"📊 Performance score: {performance_result['performance_score']}/100")
    print(f"⚠️  Issues found: {len(performance_result['issues_found'])}")
    
    if performance_result['issues_found']:
        print("🚨 Performance Issues:")
        for issue in performance_result['issues_found']:
            print(f"  • {issue}")
    
    if performance_result['suggestions']:
        print("💡 Performance Suggestions:")
        for suggestion in performance_result['suggestions']:
            print(f"  • {suggestion}")
    
    # Summary
    print("\n" + "=" * 50)
    print("📊 Analysis Summary")
    print("=" * 50)
    print(f"Logic Score: {logic_result['complexity_score']} (lower is better)")
    print(f"Creativity Score: {creativity_result['creativity_score']}/100")
    print(f"Performance Score: {performance_result['performance_score']}/100")
    print(f"Total Issues: {len(performance_result['issues_found'])}")
    
    return results

def main():
    """Main function for interactive code analysis."""
    print("🎯 AuraOS MCP System - Interactive Code Analysis")
    print("=" * 60)
    
    # Example code for testing
    example_code = """
def calculate_fibonacci(n):
    if n <= 1:
        return n
    return calculate_fibonacci(n-1) + calculate_fibonacci(n-2)

def process_data(data):
    result = []
    for i in range(len(data)):
        if data[i] > 0:
            result.append(data[i] * 2)
    return result

class DataProcessor:
    def __init__(self):
        self.data = []
    
    def add_item(self, item):
        self.data.append(item)
    
    def get_stats(self):
        return {
            'count': len(self.data),
            'sum': sum(self.data) if self.data else 0
        }
"""
    
    print("Choose an option:")
    print("1. Analyze example code")
    print("2. Enter your own code")
    print("3. Exit")
    
    choice = input("\nEnter your choice (1-3): ").strip()
    
    if choice == "1":
        print("\n🔍 Analyzing example code...")
        analyze_code(example_code, "Example code for testing MCP system")
    
    elif choice == "2":
        print("\n📝 Enter your code (press Enter twice when done):")
        lines = []
        while True:
            line = input()
            if line == "" and lines and lines[-1] == "":
                break
            lines.append(line)
        
        code = "\n".join(lines[:-1])  # Remove the last empty line
        if code.strip():
            print("\n🔍 Analyzing your code...")
            context = input("Enter context (optional): ").strip()
            analyze_code(code, context)
        else:
            print("❌ No code provided.")
    
    elif choice == "3":
        print("👋 Goodbye!")
        return
    
    else:
        print("❌ Invalid choice.")

if __name__ == "__main__":
    main()
