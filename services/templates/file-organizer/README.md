# File Organizer Service

A FastAPI service for intelligent file organization and management in the AuraOS system.

## 🚀 Features

- **File Upload**: Secure file upload with validation
- **File Management**: List, search, and delete files
- **Intelligent Organization**: Automatic file organization based on type and content
- **File Search**: Advanced search with filters (tags, size, date, type)
- **File Download**: Secure file download with access control
- **Redis Integration**: Fast, scalable file metadata storage
- **Prometheus Metrics**: Built-in monitoring and observability
- **Security**: JWT-based authentication and input validation

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
| `UPLOAD_DIR` | Upload directory | `/tmp/uploads` | No |
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
export UPLOAD_DIR=/tmp/uploads
export LOG_LEVEL=DEBUG
```

3. **Run the service:**
```bash
python run.py
```

### Docker

1. **Build the image:**
```bash
docker build -t auraos-file-organizer .
```

2. **Run the container:**
```bash
docker run -p 8000:8000 \
  -e REDIS_URL=redis://host.docker.internal:6379 \
  -v /tmp/uploads:/app/uploads \
  auraos-file-organizer
```

## 📚 API Endpoints

### Health & Monitoring

- `GET /health` - Health check
- `GET /metrics` - Prometheus metrics

### File Operations

- `POST /files/upload` - Upload a file
- `GET /files` - List user's files
- `GET /files/{id}` - Get file information
- `GET /files/{id}/download` - Download a file
- `DELETE /files/{id}` - Delete a file
- `POST /files/search` - Search files with filters

### File Organization

- `GET /rules` - List organization rules
- `POST /rules` - Create organization rule
- `PUT /rules/{id}` - Update organization rule
- `DELETE /rules/{id}` - Delete organization rule

## 🔒 Security

- **Authentication**: JWT-based authentication
- **File Validation**: MIME type and size validation
- **Access Control**: User-based file access control
- **Input Sanitization**: Validate and sanitize all inputs
- **File Isolation**: Files are isolated per user

## 📊 Monitoring

The service exposes Prometheus metrics at `/metrics`:

- `file_organizer_requests_total` - Total requests by method and endpoint
- `file_organizer_request_duration_seconds` - Request duration histogram
- `file_organizer_operations_total` - File operations by type and status

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
file-organizer/
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

1. **File Processing**: Add new file processing capabilities
2. **Organization Rules**: Implement custom organization rules
3. **File Analysis**: Add content analysis and metadata extraction
4. **Thumbnails**: Generate thumbnails for images and videos

## 🚀 Production Deployment

### Environment Setup

1. **Set production environment variables:**
```bash
export ENVIRONMENT=production
export DEBUG=false
export WORKERS=4
export RELOAD=false
export UPLOAD_DIR=/var/lib/auraos/uploads
```

2. **Configure Redis:**
```bash
export REDIS_URL=redis://your-redis-server:6379
```

3. **Set up file storage:**
```bash
# For local storage
export UPLOAD_DIR=/var/lib/auraos/uploads

# For cloud storage (S3, GCS, etc.)
export STORAGE_TYPE=s3
export AWS_ACCESS_KEY_ID=your-key
export AWS_SECRET_ACCESS_KEY=your-secret
export S3_BUCKET=your-bucket
```

### Scaling

- **Horizontal Scaling**: Run multiple instances behind a load balancer
- **File Storage**: Use cloud storage (S3, GCS) for large files
- **Redis Clustering**: Use Redis Cluster for high availability
- **CDN**: Use CDN for file delivery

## 🐛 Troubleshooting

### Common Issues

1. **Upload Directory Not Writable**
   - Check directory permissions
   - Ensure the service has write access
   - Verify disk space

2. **File Not Found After Upload**
   - Check file path configuration
   - Verify Redis connection
   - Check file permissions

3. **Large File Upload Issues**
   - Increase upload size limits
   - Configure reverse proxy timeouts
   - Use chunked upload for large files

### Logs

The service uses structured logging with Loguru. Check logs for detailed error information.

## 📄 License

MIT License - see LICENSE file for details.
