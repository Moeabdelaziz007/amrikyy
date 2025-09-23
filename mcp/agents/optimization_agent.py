#!/usr/bin/env python3
"""
AuraOS Optimization Agent - Performance and Efficiency Improvements
Provides intelligent suggestions for code optimization, performance improvements, and resource efficiency.
"""

import redis
import os
import time
import json
import re
import ast
from typing import Dict, List, Any, Optional, Tuple
from loguru import logger
from datetime import datetime
import asyncio

class OptimizationAgent:
    def __init__(self):
        self.redis_host = os.getenv("REDIS_HOST", "localhost")
        self.redis_port = int(os.getenv("REDIS_PORT", 6379))
        self.agent_type = "optimization"
        self.agent_id = f"optimization_{int(time.time())}"
        
        # Initialize Redis connection
        self.redis_client = redis.Redis(
            host=self.redis_host, 
            port=self.redis_port, 
            decode_responses=True,
            retry_on_timeout=True,
            socket_connect_timeout=5
        )
        
        # Configure logging
        logger.add("/app/logs/optimization_agent.log", rotation="10 MB", level="INFO")
        logger.info(f"Optimization Agent {self.agent_id} initialized")
        
        # Performance patterns and optimizations
        self.performance_patterns = {
            'inefficient_loops': [
                r'for\s+\w+\s+in\s+range\(len\([^)]+\)\)',
                r'for\s+\w+\s+in\s+enumerate\([^)]+\)',
                r'while\s+True:.*break'
            ],
            'memory_inefficient': [
                r'\.append\([^)]+\)\s*$',
                r'list\([^)]+\)\s*\+',
                r'str\([^)]+\)\s*\+'
            ],
            'slow_operations': [
                r'time\.sleep\(',
                r'\.join\([^)]+\)',
                r'\.split\([^)]+\)'
            ],
            'redundant_calculations': [
                r'len\([^)]+\)\s*>\s*\d+.*len\([^)]+\)',
                r'[^=]=\s*[^=].*[^=]=\s*[^=]'
            ]
        }
        
        self.optimization_suggestions = {
            'algorithm_optimization': [
                'Use list comprehensions instead of loops for better performance',
                'Consider using generators for memory efficiency',
                'Implement caching for expensive operations',
                'Use built-in functions instead of custom implementations',
                'Optimize data structures for your use case'
            ],
            'memory_optimization': [
                'Use generators instead of lists for large datasets',
                'Implement object pooling for frequently created objects',
                'Use __slots__ for classes with many instances',
                'Avoid creating unnecessary temporary objects',
                'Use weak references for circular references'
            ],
            'io_optimization': [
                'Use async/await for I/O operations',
                'Implement connection pooling for database operations',
                'Use buffered I/O for file operations',
                'Cache frequently accessed data',
                'Use compression for large data transfers'
            ],
            'cpu_optimization': [
                'Use multiprocessing for CPU-intensive tasks',
                'Implement parallel processing where possible',
                'Use vectorized operations with NumPy',
                'Avoid unnecessary function calls in loops',
                'Use local variables instead of global ones'
            ]
        }
        
        self.performance_metrics = {
            'time_complexity': {
                'O(1)': 'Constant time - optimal',
                'O(log n)': 'Logarithmic - very good',
                'O(n)': 'Linear - good',
                'O(n log n)': 'Linearithmic - acceptable',
                'O(n²)': 'Quadratic - poor for large inputs',
                'O(2^n)': 'Exponential - very poor'
            },
            'space_complexity': {
                'O(1)': 'Constant space - optimal',
                'O(n)': 'Linear space - good',
                'O(n²)': 'Quadratic space - poor for large inputs'
            }
        }

    def analyze_performance(self, code: str) -> Dict[str, Any]:
        """Analyze code for performance issues and optimization opportunities."""
        try:
            analysis = {
                'performance_score': 0,
                'issues_found': [],
                'optimization_opportunities': [],
                'complexity_analysis': {},
                'memory_usage': {},
                'suggestions': []
            }
            
            # Analyze performance patterns
            issues = self._detect_performance_issues(code)
            analysis['issues_found'] = issues
            
            # Calculate performance score
            analysis['performance_score'] = self._calculate_performance_score(code, issues)
            
            # Analyze complexity
            analysis['complexity_analysis'] = self._analyze_complexity(code)
            
            # Analyze memory usage
            analysis['memory_usage'] = self._analyze_memory_usage(code)
            
            # Generate optimization opportunities
            analysis['optimization_opportunities'] = self._identify_optimization_opportunities(code, issues)
            
            # Generate suggestions
            analysis['suggestions'] = self._generate_optimization_suggestions(code, analysis)
            
            return analysis
            
        except Exception as e:
            logger.error(f"Error analyzing performance: {str(e)}")
            return {'error': f'Performance analysis error: {str(e)}'}

    def _detect_performance_issues(self, code: str) -> List[Dict[str, Any]]:
        """Detect performance issues in the code."""
        issues = []
        
        # Check for inefficient loops
        for pattern_name, patterns in self.performance_patterns.items():
            for pattern in patterns:
                matches = re.findall(pattern, code, re.MULTILINE)
                if matches:
                    issues.append({
                        'type': pattern_name,
                        'pattern': pattern,
                        'matches': len(matches),
                        'severity': self._get_severity(pattern_name),
                        'description': self._get_issue_description(pattern_name)
                    })
        
        # Check for specific performance anti-patterns
        if 'for ' in code and 'range(len(' in code:
            issues.append({
                'type': 'inefficient_loop',
                'pattern': 'for i in range(len(list))',
                'matches': 1,
                'severity': 'medium',
                'description': 'Use enumerate() or direct iteration instead of range(len())'
            })
        
        if 'time.sleep(' in code:
            issues.append({
                'type': 'blocking_operation',
                'pattern': 'time.sleep()',
                'matches': 1,
                'severity': 'high',
                'description': 'Consider using async/await for non-blocking operations'
            })
        
        return issues

    def _get_severity(self, issue_type: str) -> str:
        """Get severity level for an issue type."""
        severity_map = {
            'inefficient_loops': 'medium',
            'memory_inefficient': 'high',
            'slow_operations': 'high',
            'redundant_calculations': 'low'
        }
        return severity_map.get(issue_type, 'medium')

    def _get_issue_description(self, issue_type: str) -> str:
        """Get description for an issue type."""
        descriptions = {
            'inefficient_loops': 'Loop can be optimized for better performance',
            'memory_inefficient': 'Memory usage can be optimized',
            'slow_operations': 'Operation may cause performance bottlenecks',
            'redundant_calculations': 'Redundant calculations detected'
        }
        return descriptions.get(issue_type, 'Performance issue detected')

    def _calculate_performance_score(self, code: str, issues: List[Dict]) -> int:
        """Calculate overall performance score."""
        base_score = 100
        
        # Deduct points for issues
        for issue in issues:
            severity = issue['severity']
            if severity == 'high':
                base_score -= 20
            elif severity == 'medium':
                base_score -= 10
            else:
                base_score -= 5
        
        # Bonus for good practices
        if 'async' in code or 'await' in code:
            base_score += 10
        
        if 'generator' in code or 'yield' in code:
            base_score += 15
        
        if 'cache' in code.lower():
            base_score += 10
        
        # Ensure score is between 0 and 100
        return max(0, min(100, base_score))

    def _analyze_complexity(self, code: str) -> Dict[str, Any]:
        """Analyze time and space complexity."""
        try:
            tree = ast.parse(code)
            complexity = {
                'time_complexity': 'O(1)',
                'space_complexity': 'O(1)',
                'nested_loops': 0,
                'recursive_calls': 0,
                'data_structures': []
            }
            
            # Analyze loops and recursion
            for node in ast.walk(tree):
                if isinstance(node, (ast.For, ast.While)):
                    complexity['nested_loops'] += 1
                elif isinstance(node, ast.Call) and isinstance(node.func, ast.Name):
                    if node.func.id == 'recursive_function':  # Placeholder
                        complexity['recursive_calls'] += 1
            
            # Determine complexity based on analysis
            if complexity['nested_loops'] > 1:
                complexity['time_complexity'] = 'O(n²)'
            elif complexity['nested_loops'] == 1:
                complexity['time_complexity'] = 'O(n)'
            
            if complexity['recursive_calls'] > 0:
                complexity['time_complexity'] = 'O(2^n)'
            
            return complexity
            
        except SyntaxError:
            return {'error': 'Syntax error in code analysis'}

    def _analyze_memory_usage(self, code: str) -> Dict[str, Any]:
        """Analyze memory usage patterns."""
        memory_analysis = {
            'memory_efficient': True,
            'potential_issues': [],
            'suggestions': []
        }
        
        # Check for memory-intensive patterns
        if 'list(' in code and 'range(' in code:
            memory_analysis['potential_issues'].append('Creating large lists in memory')
            memory_analysis['suggestions'].append('Use generators instead of lists')
        
        if '.append(' in code and code.count('.append(') > 5:
            memory_analysis['potential_issues'].append('Multiple list appends')
            memory_analysis['suggestions'].append('Consider list comprehension or pre-allocation')
        
        if 'global ' in code:
            memory_analysis['potential_issues'].append('Global variables detected')
            memory_analysis['suggestions'].append('Avoid global variables for better memory management')
        
        if memory_analysis['potential_issues']:
            memory_analysis['memory_efficient'] = False
        
        return memory_analysis

    def _identify_optimization_opportunities(self, code: str, issues: List[Dict]) -> List[Dict[str, str]]:
        """Identify specific optimization opportunities."""
        opportunities = []
        
        # Algorithm optimization opportunities
        if any(issue['type'] == 'inefficient_loops' for issue in issues):
            opportunities.append({
                'category': 'algorithm',
                'opportunity': 'Optimize loop structures',
                'description': 'Replace inefficient loops with more performant alternatives',
                'impact': 'High performance improvement'
            })
        
        # Memory optimization opportunities
        if any(issue['type'] == 'memory_inefficient' for issue in issues):
            opportunities.append({
                'category': 'memory',
                'opportunity': 'Optimize memory usage',
                'description': 'Reduce memory footprint and improve efficiency',
                'impact': 'Reduced memory consumption'
            })
        
        # I/O optimization opportunities
        if 'open(' in code or 'read(' in code:
            opportunities.append({
                'category': 'io',
                'opportunity': 'Optimize I/O operations',
                'description': 'Use async I/O or buffering for better performance',
                'impact': 'Faster I/O operations'
            })
        
        return opportunities

    def _generate_optimization_suggestions(self, code: str, analysis: Dict) -> List[Dict[str, str]]:
        """Generate specific optimization suggestions."""
        suggestions = []
        
        # Algorithm optimization suggestions
        if analysis['complexity_analysis'].get('time_complexity') in ['O(n²)', 'O(2^n)']:
            suggestions.append({
                'type': 'algorithm',
                'suggestion': 'Optimize algorithm complexity',
                'description': 'Current complexity is inefficient. Consider using more efficient algorithms.',
                'priority': 'high'
            })
        
        # Memory optimization suggestions
        if not analysis['memory_usage'].get('memory_efficient', True):
            suggestions.append({
                'type': 'memory',
                'suggestion': 'Optimize memory usage',
                'description': 'Implement memory-efficient patterns and data structures.',
                'priority': 'medium'
            })
        
        # Performance suggestions based on issues
        for issue in analysis['issues_found']:
            if issue['severity'] == 'high':
                suggestions.append({
                    'type': 'performance',
                    'suggestion': f"Fix {issue['type']}",
                    'description': issue['description'],
                    'priority': 'high'
                })
        
        return suggestions

    def suggest_optimizations(self, code: str, context: str = "") -> Dict[str, Any]:
        """Generate comprehensive optimization suggestions."""
        try:
            # Analyze performance
            performance_analysis = self.analyze_performance(code)
            
            # Generate optimization suggestions
            optimizations = {
                'performance_analysis': performance_analysis,
                'algorithm_optimizations': self._suggest_algorithm_optimizations(code),
                'memory_optimizations': self._suggest_memory_optimizations(code),
                'io_optimizations': self._suggest_io_optimizations(code),
                'cpu_optimizations': self._suggest_cpu_optimizations(code),
                'best_practices': self._suggest_best_practices(code)
            }
            
            return optimizations
            
        except Exception as e:
            logger.error(f"Error generating optimizations: {str(e)}")
            return {'error': f'Optimization generation error: {str(e)}'}

    def _suggest_algorithm_optimizations(self, code: str) -> List[Dict[str, str]]:
        """Suggest algorithm optimizations."""
        suggestions = []
        
        # Check for specific patterns and suggest optimizations
        if 'for ' in code and 'range(len(' in code:
            suggestions.append({
                'optimization': 'Replace range(len()) with enumerate()',
                'current': 'for i in range(len(items)):',
                'optimized': 'for i, item in enumerate(items):',
                'benefit': 'More readable and potentially faster'
            })
        
        if 'if ' in code and 'in ' in code:
            suggestions.append({
                'optimization': 'Use set for membership testing',
                'current': 'if item in list:',
                'optimized': 'if item in set:',
                'benefit': 'O(1) lookup instead of O(n)'
            })
        
        return suggestions

    def _suggest_memory_optimizations(self, code: str) -> List[Dict[str, str]]:
        """Suggest memory optimizations."""
        suggestions = []
        
        if 'list(' in code and 'range(' in code:
            suggestions.append({
                'optimization': 'Use generator instead of list',
                'current': 'list(range(1000000))',
                'optimized': 'range(1000000)',
                'benefit': 'Memory efficient, lazy evaluation'
            })
        
        if '.append(' in code:
            suggestions.append({
                'optimization': 'Use list comprehension',
                'current': 'for item in items: result.append(process(item))',
                'optimized': 'result = [process(item) for item in items]',
                'benefit': 'More efficient and readable'
            })
        
        return suggestions

    def _suggest_io_optimizations(self, code: str) -> List[Dict[str, str]]:
        """Suggest I/O optimizations."""
        suggestions = []
        
        if 'open(' in code and 'read(' in code:
            suggestions.append({
                'optimization': 'Use context manager for file operations',
                'current': 'file = open("file.txt"); data = file.read(); file.close()',
                'optimized': 'with open("file.txt") as file: data = file.read()',
                'benefit': 'Automatic resource management'
            })
        
        if 'time.sleep(' in code:
            suggestions.append({
                'optimization': 'Use async/await for non-blocking operations',
                'current': 'time.sleep(1)',
                'optimized': 'await asyncio.sleep(1)',
                'benefit': 'Non-blocking, better concurrency'
            })
        
        return suggestions

    def _suggest_cpu_optimizations(self, code: str) -> List[Dict[str, str]]:
        """Suggest CPU optimizations."""
        suggestions = []
        
        if 'for ' in code and 'def ' in code:
            suggestions.append({
                'optimization': 'Use built-in functions',
                'current': 'Custom loop implementation',
                'optimized': 'Use map(), filter(), reduce()',
                'benefit': 'Optimized C implementations'
            })
        
        if 'if ' in code and 'else' in code:
            suggestions.append({
                'optimization': 'Use ternary operator for simple conditions',
                'current': 'if condition: result = value1 else: result = value2',
                'optimized': 'result = value1 if condition else value2',
                'benefit': 'More concise and potentially faster'
            })
        
        return suggestions

    def _suggest_best_practices(self, code: str) -> List[Dict[str, str]]:
        """Suggest performance best practices."""
        practices = []
        
        practices.append({
            'practice': 'Use local variables instead of global ones',
            'reason': 'Local variable access is faster than global access',
            'implementation': 'Pass variables as parameters instead of using globals'
        })
        
        practices.append({
            'practice': 'Implement caching for expensive operations',
            'reason': 'Avoid redundant calculations',
            'implementation': 'Use functools.lru_cache or custom caching'
        })
        
        practices.append({
            'practice': 'Use appropriate data structures',
            'reason': 'Choose the right tool for the job',
            'implementation': 'Use sets for membership, dicts for key-value pairs'
        })
        
        return practices

    def process_optimization_request(self, request_data: Dict[str, Any]) -> Dict[str, Any]:
        """Process incoming optimization request."""
        try:
            code = request_data.get('code', '')
            context = request_data.get('context', '')
            request_id = request_data.get('request_id', '')
            
            logger.info(f"Processing optimization request: {request_id}")
            
            # Generate optimizations
            optimizations = self.suggest_optimizations(code, context)
            
            # Create response
            response = {
                'agent_type': self.agent_type,
                'agent_id': self.agent_id,
                'request_id': request_id,
                'timestamp': datetime.now().isoformat(),
                'optimizations': optimizations,
                'status': 'completed'
            }
            
            return response
            
        except Exception as e:
            logger.error(f"Error processing optimization request: {str(e)}")
            return {
                'agent_type': self.agent_type,
                'agent_id': self.agent_id,
                'error': str(e),
                'status': 'error'
            }

    async def run(self):
        """Main agent loop."""
        logger.info(f"Optimization Agent {self.agent_id} starting...")
        
        # Test Redis connection
        try:
            self.redis_client.ping()
            logger.info("Connected to Redis successfully")
        except Exception as e:
            logger.error(f"Failed to connect to Redis: {str(e)}")
            return
        
        # Register agent
        self.redis_client.hset("active_agents", self.agent_id, json.dumps({
            'type': self.agent_type,
            'status': 'active',
            'started_at': datetime.now().isoformat()
        }))
        
        while True:
            try:
                # Check for new requests
                request_data = self.redis_client.lpop("mcp_queue")
                
                if request_data:
                    request = json.loads(request_data)
                    logger.info(f"Received optimization request: {request.get('request_id', 'unknown')}")
                    
                    # Process the request
                    response = self.process_optimization_request(request)
                    
                    # Send response
                    self.redis_client.rpush("mcp_results", json.dumps(response))
                    logger.info(f"Sent optimization response for request: {request.get('request_id', 'unknown')}")
                
                # Update agent status
                self.redis_client.hset("active_agents", self.agent_id, json.dumps({
                    'type': self.agent_type,
                    'status': 'active',
                    'last_activity': datetime.now().isoformat()
                }))
                
                await asyncio.sleep(1)
                
            except Exception as e:
                logger.error(f"Error in optimization agent main loop: {str(e)}")
                await asyncio.sleep(5)

if __name__ == "__main__":
    agent = OptimizationAgent()
    asyncio.run(agent.run())
