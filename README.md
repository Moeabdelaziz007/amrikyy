# 🚀 AuraOS MCP System

**AI-Powered Code Analysis and Optimization System**

A comprehensive MCP (Model Context Protocol) system that provides intelligent code analysis, creative solutions, and performance optimizations through specialized AI agents.

## ✨ Features

- **🧠 Logic Agent**: Advanced code structure analysis and logic optimization
- **🎨 Creativity Agent**: Innovative solutions and design patterns
- **⚡ Optimization Agent**: Performance and efficiency improvements
- **🌉 MCP Bridge**: Seamless integration with Cursor and other IDEs
- **📊 Real-time Analysis**: Instant feedback and suggestions
- **🔄 Parallel Processing**: Multiple agents working simultaneously
- **💾 Redis Shared Memory**: Efficient communication between agents

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Logic Agent   │    │ Creativity Agent│    │Optimization Agent│
│                 │    │                 │    │                 │
│ • Code Analysis │    │ • Design Patterns│    │ • Performance   │
│ • Structure     │    │ • Innovation     │    │ • Memory        │
│ • Logic Flow    │    │ • Solutions      │    │ • Algorithms    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Redis Queue   │
                    │                 │
                    │ • Shared Memory │
                    │ • Communication │
                    │ • Results Store │
                    └─────────────────┘
                                 │
                    ┌─────────────────┐
                    │   MCP Bridge    │
                    │                 │
                    │ • FastAPI       │
                    │ • Cursor Integration│
                    │ • Health Check  │
                    └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose
- Python 3.12+ (for local development)
- Redis (included in Docker setup)

### Installation

1. **Clone or download the system**
   ```bash
   # If you have the files, navigate to the directory
   cd AuraOS
   ```

2. **Start the system**
   ```bash
   ./start_mcp.sh
   ```

3. **Verify the system is running**
   ```bash
   # Check Docker containers
   docker-compose ps
   
   # Test the system
   python mcp/cursor_integration/cursor_mcp.py
   ```

## 🔧 Usage

### Via Cursor Integration

```python
from mcp.cursor_integration.cursor_mcp import CursorMCP

# Initialize MCP client
mcp = CursorMCP()

# Analyze code
code = """
def calculate_fibonacci(n):
    if n <= 1:
        return n
    return calculate_fibonacci(n-1) + calculate_fibonacci(n-2)
"""

# Get comprehensive analysis
results = mcp.analyze_via_bridge(code, "Fibonacci calculation")
print(results)
```

### Via Direct API

```bash
# Health check
curl http://localhost:8080/health

# Analyze code
curl -X POST http://localhost:8080/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "code": "def test(): pass",
    "context": "Testing",
    "request_type": "all"
  }'
```

### Via Redis Direct

```python
import redis
import json

# Connect to Redis
r = redis.Redis(host='localhost', port=6379, decode_responses=True)

# Send code for analysis
request = {
    "request_id": "test_123",
    "code": "def example(): pass",
    "context": "Testing"
}
r.rpush("mcp_queue", json.dumps(request))

# Get results
results = r.lpop("mcp_results")
print(json.loads(results))
```

## 📊 Agent Capabilities

### 🧠 Logic Agent

- **Code Structure Analysis**: Identifies complex functions, nested loops, and architectural issues
- **Logic Flow Optimization**: Suggests improvements for control flow and decision making
- **Complexity Analysis**: Calculates cyclomatic complexity and suggests refactoring
- **Best Practices**: Recommends coding standards and maintainability improvements

**Example Output:**
```json
{
  "agent_type": "logic",
  "suggestions": [
    "Function 'calculate_fibonacci' has high complexity (15). Consider refactoring.",
    "Consider extracting this logic into a separate method for better readability",
    "Add input validation and error handling"
  ],
  "complexity_score": 75,
  "priority": "high"
}
```

### 🎨 Creativity Agent

- **Design Patterns**: Suggests appropriate design patterns for the code
- **Innovative Solutions**: Proposes creative approaches to problems
- **Architecture Ideas**: Recommends modern architectural patterns
- **User Experience**: Considers UX and interface design aspects

**Example Output:**
```json
{
  "agent_type": "creativity",
  "suggestions": [
    "Consider implementing Strategy Pattern for algorithm variants",
    "Use functional programming paradigms for better expressiveness",
    "Think about user experience and interface design"
  ],
  "creativity_score": 85,
  "innovation_opportunities": [
    "Implement data streaming for real-time processing",
    "Create adaptive user interface based on user behavior"
  ]
}
```

### ⚡ Optimization Agent

- **Performance Analysis**: Identifies bottlenecks and slow operations
- **Memory Optimization**: Suggests memory-efficient patterns
- **Algorithm Optimization**: Recommends better algorithms and data structures
- **I/O Optimization**: Proposes async operations and caching strategies

**Example Output:**
```json
{
  "agent_type": "optimization",
  "suggestions": [
    "Replace range(len()) with enumerate() for better performance",
    "Use generators instead of lists for memory efficiency",
    "Consider using async/await for non-blocking operations"
  ],
  "performance_score": 70,
  "optimization_opportunities": [
    "Optimize loop structures",
    "Implement caching for expensive operations"
  ]
}
```

## 🔧 Configuration

### System Configuration

Edit `mcp/config/mcp_config.json` to customize:

```json
{
  "agents": {
    "logic": {"enabled": true, "priority": "high"},
    "creativity": {"enabled": true, "priority": "medium"},
    "optimization": {"enabled": true, "priority": "high"}
  },
  "processing": {
    "parallel_processing": true,
    "max_concurrent_requests": 10,
    "request_timeout": 30
  }
}
```

### Environment Variables

```bash
# Redis configuration
REDIS_HOST=localhost
REDIS_PORT=6379

# Bridge configuration
BRIDGE_PORT=8080
LOG_LEVEL=INFO

# Agent configuration
AGENT_TYPE=logic
```

## 📈 Monitoring and Health

### Health Checks

```bash
# System health
curl http://localhost:8080/health

# Active agents
curl http://localhost:8080/agents

# Docker container status
docker-compose ps
```

### Logs

```bash
# View all logs
docker-compose logs -f

# View specific agent logs
docker-compose logs -f logic_agent
docker-compose logs -f creativity_agent
docker-compose logs -f optimization_agent
```

## 🛠️ Development

### Adding New Agents

1. Create agent file in `mcp/agents/`
2. Implement the agent class with `run()` method
3. Add to `docker-compose.yml`
4. Update configuration

### Customizing Analysis

Each agent can be customized by modifying:
- Analysis patterns and rules
- Suggestion generation logic
- Performance metrics
- Output formatting

## 🚨 Troubleshooting

### Common Issues

1. **Redis Connection Failed**
   ```bash
   # Check Redis container
   docker exec aura_redis redis-cli ping
   ```

2. **Agents Not Responding**
   ```bash
   # Check agent status
   docker-compose logs logic_agent
   ```

3. **Bridge Not Accessible**
   ```bash
   # Check bridge logs
   docker-compose logs mcp_bridge
   ```

### Performance Issues

- Increase Redis memory limits
- Adjust agent timeout settings
- Monitor system resources

## 📝 License

This project is part of the AuraOS system and is available under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For issues and questions:
- Check the logs first
- Review the configuration
- Test with simple code examples
- Check system health endpoints

---

**🎯 Ready to supercharge your coding with AI-powered analysis!**