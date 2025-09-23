# IDE Agent Service

A FastAPI service for development environment integration and code assistance in the AuraOS system.

## 🚀 Features

- **Code File Management**: Create, read, update, and delete code files
- **Code Execution**: Execute code in multiple programming languages
- **Code Analysis**: Analyze code for quality, complexity, and issues
- **Language Detection**: Automatic programming language detection
- **Sandboxed Execution**: Secure code execution environment
- **Redis Integration**: Fast, scalable code storage
- **Prometheus Metrics**: Built-in monitoring and observability
- **Security**: JWT-based authentication and input validation

## 📋 Prerequisites

- Python 3.11+
- Redis server
- Node.js (for JavaScript execution)
- Environment variables configured

## 🔧 Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `HOST` | Server host | `0.0.0.0` | No |
| `PORT` | Server port | `8000` | No |
| `RELOAD` | Enable auto-reload | `true` | No |
| `WORKERS` | Number of workers | `1` | No |
| `REDIS_URL` | Redis connection URL | `redis://localhost:6379` | Yes |
| `LOG_LEVEL` | Logging level | `INFO` | No |
| `CORS_ORIGINS` | Allowed CORS origins | `http://localhost:3000` | No |
| `ALLOWED_HOSTS` | Allowed hosts | `localhost,127.0.0.1` | No |

## 🏃‍♂️ Running the Service

### Local Development

1. **Install dependencies:**
```bash
pip install -r requirements.txt
```

2. **Set environment variables:**
```bash
export REDIS_URL=redis://localhost:6379
export LOG_LEVEL=DEBUG
```

3. **Run the service:**
```bash
python run.py
```

### Docker

1. **Build the image:**
```bash
docker build -t auraos-ide-agent .
```

2. **Run the container:**
```bash
docker run -p 8000:8000 \
  -e REDIS_URL=redis://host.docker.internal:6379 \
  auraos-ide-agent
```

## 📚 API Endpoints

### Health & Monitoring

- `GET /health` - Health check
- `GET /metrics` - Prometheus metrics

### Code File Management

- `POST /files` - Create a new code file
- `GET /files` - List user's code files
- `GET /files/{id}` - Get a specific code file
- `PUT /files/{id}` - Update a code file
- `DELETE /files/{id}` - Delete a code file

### Code Execution

- `POST /execute` - Execute code
- `GET /executions` - List code executions
- `GET /executions/{id}` - Get execution result

### Code Analysis

- `POST /analyze/{file_id}` - Analyze code
- `GET /analyses` - List code analyses
- `GET /analyses/{id}` - Get analysis result

## 🔒 Security

- **Authentication**: JWT-based authentication
- **Sandboxed Execution**: Code execution in isolated environment
- **Input Validation**: Validate and sanitize all inputs
- **Access Control**: User-based file access control
- **Timeout Protection**: Prevent infinite loops and long-running code

## 📊 Monitoring

The service exposes Prometheus metrics at `/metrics`:

- `ide_agent_requests_total` - Total requests by method and endpoint
- `ide_agent_request_duration_seconds` - Request duration histogram
- `ide_agent_operations_total` - Code operations by type and status

## 🧪 Testing

```bash
# Run tests
pytest

# Run with coverage
pytest --cov=app --cov-report=html
```

## 🔧 Development

### Code Structure

```
ide-agent/
├── app.py              # Main FastAPI application
├── run.py              # Entry point script
├── requirements.txt    # Python dependencies
├── Dockerfile         # Docker configuration
├── README.md          # This file
└── tests/             # Test files
    ├── __init__.py
    ├── test_app.py
    └── test_models.py
```

### Supported Languages

- **Python**: Full support with syntax checking
- **JavaScript**: Node.js execution
- **Bash**: Shell script execution
- **TypeScript**: Compile and execute
- **Java**: Compile and run
- **C/C++**: Compile and execute
- **Go**: Compile and run
- **Rust**: Compile and execute

### Adding New Languages

1. **Update `detect_language()` function**
2. **Add execution logic in `execute_code()`**
3. **Update Dockerfile with required dependencies**
4. **Add tests for the new language**

## 🚀 Production Deployment

### Environment Setup

1. **Set production environment variables:**
```bash
export ENVIRONMENT=production
export DEBUG=false
export WORKERS=4
export RELOAD=false
```

2. **Configure Redis:**
```bash
export REDIS_URL=redis://your-redis-server:6379
```

3. **Set up code execution limits:**
```bash
export MAX_EXECUTION_TIME=30
export MAX_MEMORY_USAGE=100MB
export MAX_FILE_SIZE=10MB
```

### Scaling

- **Horizontal Scaling**: Run multiple instances behind a load balancer
- **Redis Clustering**: Use Redis Cluster for high availability
- **Code Execution**: Use containerized execution for better isolation
- **Caching**: Implement code analysis result caching

## 🐛 Troubleshooting

### Common Issues

1. **Code Execution Failed**
   - Check if the language runtime is installed
   - Verify code syntax
   - Check execution timeout settings

2. **File Not Found**
   - Verify file ID exists
   - Check user permissions
   - Ensure Redis connection is working

3. **Analysis Errors**
   - Check if analysis tools are installed
   - Verify file format is supported
   - Check analysis timeout settings

### Logs

The service uses structured logging with Loguru. Check logs for detailed error information.

## 📄 License

MIT License - see LICENSE file for details.
