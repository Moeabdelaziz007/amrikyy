# 🚀 AuraOS MCP System - Complete Usage Guide

## 🎯 **System Overview**

The AuraOS MCP System is a comprehensive AI-powered code analysis platform that provides intelligent suggestions through three specialized agents:

- **🧠 Logic Agent**: Code structure analysis and logic optimization
- **🎨 Creativity Agent**: Innovative solutions and design patterns  
- **⚡ Optimization Agent**: Performance and efficiency improvements

## 🚀 **Quick Start (5 Minutes)**

### 1. Start the System
```bash
./start_mcp.sh
```

### 2. Test the System
```bash
python test_mcp.py
```

### 3. Try an Example
```bash
python example_usage.py
```

## 📁 **System Structure**

```
AuraOS/
├── docker-compose.yml          # Main Docker configuration
├── start_mcp.sh               # Startup script
├── test_mcp.py                # System test suite
├── example_usage.py           # Usage examples
├── README.md                  # Complete documentation
├── USAGE_GUIDE.md            # This guide
└── mcp/
    ├── Dockerfile             # Agent container setup
    ├── requirements.txt       # Python dependencies
    ├── config/
    │   └── mcp_config.json   # System configuration
    ├── agents/
    │   ├── logic_agent.py     # Logic analysis agent
    │   ├── creativity_agent.py # Creativity agent
    │   └── optimization_agent.py # Optimization agent
    └── cursor_integration/
        ├── mcp_bridge.py      # FastAPI bridge server
        └── cursor_mcp.py      # Cursor integration client
```

## 🔧 **Usage Methods**

### Method 1: Direct API Calls

```bash
# Health check
curl http://localhost:8080/health

# Quick analysis
curl -X POST http://localhost:8080/quick_analyze \
  -H "Content-Type: application/json" \
  -d '{"code": "def test(): pass", "context": "Testing"}'

# Full analysis
curl -X POST http://localhost:8080/analyze \
  -H "Content-Type: application/json" \
  -d '{"code": "def test(): pass", "context": "Testing", "request_type": "all"}'
```

### Method 2: Python Integration

```python
from mcp.cursor_integration.cursor_mcp import CursorMCP

# Initialize client
mcp = CursorMCP()

# Quick analysis
results = mcp.quick_analyze("def hello(): print('Hello')")

# Full analysis
results = mcp.analyze_via_bridge("def hello(): print('Hello')", "Testing")

# Check system health
health = mcp.health_check()
```

### Method 3: Direct Redis Communication

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

## 🎯 **Agent Capabilities**

### 🧠 Logic Agent Features

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

### 🎨 Creativity Agent Features

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

### ⚡ Optimization Agent Features

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

## 🔧 **Configuration**

### System Configuration

Edit `mcp/config/mcp_config.json`:

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
```

## 📊 **Monitoring and Health**

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

## 🛠️ **Development and Customization**

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

## 🚨 **Troubleshooting**

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

## 🎯 **Best Practices**

### For Code Analysis

1. **Provide Context**: Always include context about what the code does
2. **Use Specific Requests**: Specify which agents to use for targeted analysis
3. **Batch Processing**: For multiple files, use batch processing
4. **Monitor Performance**: Keep an eye on system resources

### For Integration

1. **Error Handling**: Always handle potential connection errors
2. **Timeout Management**: Set appropriate timeouts for requests
3. **Caching**: Cache results for repeated analysis
4. **Health Monitoring**: Regularly check system health

## 📈 **Performance Tips**

1. **Use Quick Analysis**: For fast feedback during development
2. **Parallel Processing**: Enable parallel processing for better performance
3. **Resource Monitoring**: Monitor CPU and memory usage
4. **Optimize Redis**: Tune Redis configuration for your workload

## 🔮 **Future Enhancements**

- **Machine Learning Integration**: Add ML models for better analysis
- **Custom Rules**: Allow users to define custom analysis rules
- **Plugin System**: Support for third-party analysis plugins
- **Real-time Collaboration**: Multi-user analysis and sharing
- **Advanced Metrics**: Detailed performance and quality metrics

## 📞 **Support and Community**

- **Documentation**: Check README.md for complete documentation
- **Examples**: Run example_usage.py for usage examples
- **Testing**: Use test_mcp.py to verify system functionality
- **Logs**: Check logs for debugging information

---

**🎉 Ready to supercharge your coding with AI-powered analysis!**

The AuraOS MCP System provides comprehensive code analysis through specialized AI agents, helping you write better, more efficient, and more creative code. Start with the quick examples and gradually integrate it into your development workflow for maximum benefit.
