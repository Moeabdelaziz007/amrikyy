#!/usr/bin/env python3
"""
AuraOS Logic Agent - Advanced Code Analysis and Structure Optimization
Provides intelligent suggestions for code structure, logic flow, and architectural improvements.
"""

import redis
import os
import time
import json
import ast
import re
from typing import Dict, List, Any, Optional
from loguru import logger
from datetime import datetime
import asyncio

class LogicAgent:
    def __init__(self):
        self.redis_host = os.getenv("REDIS_HOST", "localhost")
        self.redis_port = int(os.getenv("REDIS_PORT", 6379))
        self.agent_type = "logic"
        self.agent_id = f"logic_{int(time.time())}"
        
        # Initialize Redis connection
        self.redis_client = redis.Redis(
            host=self.redis_host, 
            port=self.redis_port, 
            decode_responses=True,
            retry_on_timeout=True,
            socket_connect_timeout=5
        )
        
        # Configure logging
        logger.add("/app/logs/logic_agent.log", rotation="10 MB", level="INFO")
        logger.info(f"Logic Agent {self.agent_id} initialized")
        
        # Code analysis patterns
        self.complexity_patterns = {
            'high_complexity': r'(for.*for|while.*while|if.*if.*if)',
            'long_functions': r'def\s+\w+\([^)]*\):\s*(?:[^\n]+\n){20,}',
            'deep_nesting': r'(\s{12,}|\t{3,})',
            'magic_numbers': r'\b\d{2,}\b(?!\s*[\)\]\}])',
            'duplicate_code': r'(\w+\([^)]*\)[^;]*;?\s*){3,}'
        }
        
        self.improvement_suggestions = {
            'extract_method': "Consider extracting this logic into a separate method for better readability",
            'reduce_complexity': "This function has high cyclomatic complexity. Consider breaking it down",
            'add_validation': "Add input validation and error handling",
            'optimize_algorithm': "Consider using a more efficient algorithm or data structure",
            'improve_naming': "Use more descriptive variable and function names",
            'add_documentation': "Add docstrings and comments for better code documentation"
        }

    def analyze_code_structure(self, code: str) -> Dict[str, Any]:
        """Analyze code structure and identify improvement opportunities."""
        try:
            # Parse AST for structural analysis
            tree = ast.parse(code)
            
            analysis = {
                'functions': [],
                'classes': [],
                'imports': [],
                'complexity_score': 0,
                'suggestions': [],
                'metrics': {}
            }
            
            # Extract functions and classes
            for node in ast.walk(tree):
                if isinstance(node, ast.FunctionDef):
                    func_info = {
                        'name': node.name,
                        'line': node.lineno,
                        'args': len(node.args.args),
                        'complexity': self._calculate_function_complexity(node)
                    }
                    analysis['functions'].append(func_info)
                    
                elif isinstance(node, ast.ClassDef):
                    class_info = {
                        'name': node.name,
                        'line': node.lineno,
                        'methods': len([n for n in node.body if isinstance(n, ast.FunctionDef)])
                    }
                    analysis['classes'].append(class_info)
                    
                elif isinstance(node, (ast.Import, ast.ImportFrom)):
                    analysis['imports'].append(ast.unparse(node))
            
            # Calculate overall complexity
            analysis['complexity_score'] = sum(f['complexity'] for f in analysis['functions'])
            
            # Generate suggestions based on analysis
            analysis['suggestions'] = self._generate_structural_suggestions(analysis)
            
            # Calculate metrics
            analysis['metrics'] = {
                'total_lines': len(code.split('\n')),
                'function_count': len(analysis['functions']),
                'class_count': len(analysis['classes']),
                'import_count': len(analysis['imports']),
                'avg_function_length': self._calculate_avg_function_length(analysis['functions'])
            }
            
            return analysis
            
        except SyntaxError as e:
            return {'error': f'Syntax error in code: {str(e)}'}
        except Exception as e:
            logger.error(f"Error analyzing code structure: {str(e)}")
            return {'error': f'Analysis error: {str(e)}'}

    def _calculate_function_complexity(self, func_node: ast.FunctionDef) -> int:
        """Calculate cyclomatic complexity of a function."""
        complexity = 1  # Base complexity
        
        for node in ast.walk(func_node):
            if isinstance(node, (ast.If, ast.While, ast.For, ast.AsyncFor)):
                complexity += 1
            elif isinstance(node, ast.ExceptHandler):
                complexity += 1
            elif isinstance(node, (ast.And, ast.Or)):
                complexity += 1
                
        return complexity

    def _calculate_avg_function_length(self, functions: List[Dict]) -> float:
        """Calculate average function length."""
        if not functions:
            return 0
        return sum(f.get('complexity', 0) for f in functions) / len(functions)

    def _generate_structural_suggestions(self, analysis: Dict) -> List[str]:
        """Generate structural improvement suggestions."""
        suggestions = []
        
        # Check for high complexity functions
        for func in analysis['functions']:
            if func['complexity'] > 10:
                suggestions.append(f"Function '{func['name']}' has high complexity ({func['complexity']}). Consider refactoring.")
            
            if func['args'] > 5:
                suggestions.append(f"Function '{func['name']}' has many parameters ({func['args']}). Consider using a data structure.")
        
        # Check for long functions
        if analysis['metrics']['avg_function_length'] > 20:
            suggestions.append("Functions are generally too long. Consider breaking them into smaller, focused functions.")
        
        # Check for missing documentation
        if analysis['metrics']['function_count'] > 0:
            suggestions.append("Consider adding docstrings to your functions for better documentation.")
        
        # Check for class design
        for cls in analysis['classes']:
            if cls['methods'] > 10:
                suggestions.append(f"Class '{cls['name']}' has many methods ({cls['methods']}). Consider splitting responsibilities.")
        
        return suggestions

    def suggest_improvements(self, code: str, context: str = "") -> Dict[str, Any]:
        """Generate comprehensive improvement suggestions."""
        try:
            # Analyze code structure
            structure_analysis = self.analyze_code_structure(code)
            
            # Pattern-based analysis
            pattern_analysis = self._analyze_patterns(code)
            
            # Generate specific suggestions
            suggestions = {
                'structure': structure_analysis,
                'patterns': pattern_analysis,
                'recommendations': [],
                'priority': 'medium',
                'estimated_effort': 'low'
            }
            
            # Combine suggestions
            all_suggestions = []
            all_suggestions.extend(structure_analysis.get('suggestions', []))
            all_suggestions.extend(pattern_analysis.get('suggestions', []))
            
            # Prioritize suggestions
            suggestions['recommendations'] = self._prioritize_suggestions(all_suggestions)
            
            # Determine priority and effort
            suggestions['priority'] = self._determine_priority(suggestions)
            suggestions['estimated_effort'] = self._estimate_effort(suggestions)
            
            return suggestions
            
        except Exception as e:
            logger.error(f"Error generating suggestions: {str(e)}")
            return {'error': f'Suggestion generation error: {str(e)}'}

    def _analyze_patterns(self, code: str) -> Dict[str, Any]:
        """Analyze code patterns for common issues."""
        patterns_found = {}
        suggestions = []
        
        for pattern_name, pattern in self.complexity_patterns.items():
            matches = re.findall(pattern, code, re.MULTILINE | re.DOTALL)
            if matches:
                patterns_found[pattern_name] = len(matches)
                
                if pattern_name == 'high_complexity':
                    suggestions.append("Found nested loops/conditions. Consider refactoring for better readability.")
                elif pattern_name == 'long_functions':
                    suggestions.append("Found long functions. Consider breaking them into smaller functions.")
                elif pattern_name == 'deep_nesting':
                    suggestions.append("Found deep nesting. Consider using early returns or guard clauses.")
                elif pattern_name == 'magic_numbers':
                    suggestions.append("Found magic numbers. Consider using named constants.")
                elif pattern_name == 'duplicate_code':
                    suggestions.append("Found potential code duplication. Consider extracting common logic.")
        
        return {
            'patterns_found': patterns_found,
            'suggestions': suggestions,
            'pattern_score': sum(patterns_found.values())
        }

    def _prioritize_suggestions(self, suggestions: List[str]) -> List[Dict[str, str]]:
        """Prioritize suggestions based on impact and effort."""
        prioritized = []
        
        for suggestion in suggestions:
            priority = 'medium'
            effort = 'low'
            
            # Determine priority based on keywords
            if any(keyword in suggestion.lower() for keyword in ['complexity', 'performance', 'security']):
                priority = 'high'
            elif any(keyword in suggestion.lower() for keyword in ['documentation', 'naming', 'style']):
                priority = 'low'
            
            # Determine effort
            if any(keyword in suggestion.lower() for keyword in ['refactor', 'restructure', 'redesign']):
                effort = 'high'
            elif any(keyword in suggestion.lower() for keyword in ['add', 'consider', 'use']):
                effort = 'low'
            
            prioritized.append({
                'suggestion': suggestion,
                'priority': priority,
                'effort': effort
            })
        
        # Sort by priority
        priority_order = {'high': 3, 'medium': 2, 'low': 1}
        prioritized.sort(key=lambda x: priority_order.get(x['priority'], 0), reverse=True)
        
        return prioritized

    def _determine_priority(self, suggestions: Dict) -> str:
        """Determine overall priority of suggestions."""
        high_count = sum(1 for rec in suggestions['recommendations'] if rec['priority'] == 'high')
        total_count = len(suggestions['recommendations'])
        
        if high_count > total_count * 0.5:
            return 'high'
        elif high_count > 0:
            return 'medium'
        else:
            return 'low'

    def _estimate_effort(self, suggestions: Dict) -> str:
        """Estimate overall effort required."""
        high_effort_count = sum(1 for rec in suggestions['recommendations'] if rec['effort'] == 'high')
        total_count = len(suggestions['recommendations'])
        
        if high_effort_count > total_count * 0.3:
            return 'high'
        elif high_effort_count > 0:
            return 'medium'
        else:
            return 'low'

    def process_code_request(self, request_data: Dict[str, Any]) -> Dict[str, Any]:
        """Process incoming code analysis request."""
        try:
            code = request_data.get('code', '')
            context = request_data.get('context', '')
            request_id = request_data.get('request_id', '')
            
            logger.info(f"Processing logic analysis request: {request_id}")
            
            # Generate suggestions
            suggestions = self.suggest_improvements(code, context)
            
            # Create response
            response = {
                'agent_type': self.agent_type,
                'agent_id': self.agent_id,
                'request_id': request_id,
                'timestamp': datetime.now().isoformat(),
                'suggestions': suggestions,
                'status': 'completed'
            }
            
            return response
            
        except Exception as e:
            logger.error(f"Error processing request: {str(e)}")
            return {
                'agent_type': self.agent_type,
                'agent_id': self.agent_id,
                'error': str(e),
                'status': 'error'
            }

    async def run(self):
        """Main agent loop."""
        logger.info(f"Logic Agent {self.agent_id} starting...")
        
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
                    logger.info(f"Received request: {request.get('request_id', 'unknown')}")
                    
                    # Process the request
                    response = self.process_code_request(request)
                    
                    # Send response
                    self.redis_client.rpush("mcp_results", json.dumps(response))
                    logger.info(f"Sent response for request: {request.get('request_id', 'unknown')}")
                
                # Update agent status
                self.redis_client.hset("active_agents", self.agent_id, json.dumps({
                    'type': self.agent_type,
                    'status': 'active',
                    'last_activity': datetime.now().isoformat()
                }))
                
                await asyncio.sleep(1)
                
            except Exception as e:
                logger.error(f"Error in main loop: {str(e)}")
                await asyncio.sleep(5)

if __name__ == "__main__":
    agent = LogicAgent()
    asyncio.run(agent.run())
