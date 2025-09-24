# Conversational Core Service

A FastAPI service for managing AI conversations and chat interactions in the AuraOS system.

## 🚀 Features

- **Conversation Management**: Create, read, update, and delete conversations
- **Message Handling**: Add messages to conversations with role-based access
- **Real-time Processing**: Background task processing for AI responses
- **Redis Integration**: Fast, scalable conversation storage
- **Prometheus Metrics**: Built-in monitoring and observability
- **Security**: JWT-based authentication and input validation
- **CORS Support**: Cross-origin resource sharing for web clients

## 📋 Prerequisites

- Python 3.11+
- Redis server
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
docker build -t auraos-conversational-core .
```

2. **Run the container:**
```bash
docker run -p 8000:8000 \
  -e REDIS_URL=redis://host.docker.internal:6379 \
  auraos-conversational-core
```

### Docker Compose

The service is included in the main `docker-compose.yml` file.

## 📚 API Endpoints

### Health & Monitoring

- `GET /health` - Health check
- `GET /metrics` - Prometheus metrics

### Conversations

- `POST /conversations` - Create a new conversation
- `GET /conversations` - List user's conversations
- `GET /conversations/{id}` - Get a specific conversation
- `PUT /conversations/{id}` - Update a conversation
- `DELETE /conversations/{id}` - Delete a conversation

### Messages

- `POST /conversations/{id}/messages` - Add a message to a conversation
- `GET /conversations/{id}/messages` - Get messages from a conversation
- `PUT /conversations/{id}/messages/{msg_id}` - Update a message
- `DELETE /conversations/{id}/messages/{msg_id}` - Delete a message

## 🔒 Security

- **Authentication**: JWT-based authentication (implement in production)
- **Input Validation**: Pydantic models for request validation
- **CORS**: Configurable cross-origin resource sharing
- **Rate Limiting**: Implement rate limiting in production
- **Input Sanitization**: Validate and sanitize all inputs

## 📊 Monitoring

The service exposes Prometheus metrics at `/metrics`:

- `conversational_core_requests_total` - Total requests by method and endpoint
- `conversational_core_request_duration_seconds` - Request duration histogram
- `conversational_core_conversations_total` - Total conversations created

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
conversational-core/
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

### Adding New Features

1. **Models**: Add new Pydantic models in `app.py`
2. **Routes**: Add new endpoints in `app.py`
3. **Background Tasks**: Add new background tasks for async processing
4. **Tests**: Add corresponding tests in `tests/`

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

3. **Set up monitoring:**
```bash
export SENTRY_DSN=your-sentry-dsn
export PROMETHEUS_PORT=8000
```

### Scaling

- **Horizontal Scaling**: Run multiple instances behind a load balancer
- **Redis Clustering**: Use Redis Cluster for high availability
- **Database**: Consider PostgreSQL for persistent storage
- **Caching**: Implement additional caching layers

## 🐛 Troubleshooting

### Common Issues

1. **Redis Connection Failed**
   - Check Redis server is running
   - Verify `REDIS_URL` is correct
   - Check network connectivity

2. **Port Already in Use**
   - Change the `PORT` environment variable
   - Kill existing processes on the port

3. **Import Errors**
   - Ensure all dependencies are installed
   - Check Python path configuration

### Logs

The service uses structured logging with Loguru. Check logs for detailed error information.

## 📄 License

MIT License - see LICENSE file for details.
