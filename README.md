# AuraOS - AI-Powered Operating System

A production-ready, testable, and secure Python monorepo for an AI-powered operating system.

## 🏗️ Architecture

```
AuraOS/
├── core/                    # Core system components
├── agents/                  # AI agents and automation
├── tools/                   # Utility tools and helpers
├── ui/                      # User interface components
├── services/                # Microservices
│   └── templates/           # Service templates
├── docs/                    # Documentation
├── tests/                   # Test suites
├── scripts/                 # Deployment and utility scripts
├── monitoring/              # Monitoring and observability
└── deployment/              # Deployment configurations
```

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Docker & Docker Compose
- Node.js 18+ (for UI components)
- Redis
- PostgreSQL (optional)

### Local Development

1. **Clone and setup:**
```bash
git clone <repository-url>
cd AuraOS
cp .env.example .env
# Edit .env with your configuration
```

2. **Install dependencies:**
```bash
make install
# or
pip install -r requirements.txt
```

3. **Start services:**
```bash
make dev
# or
docker-compose up -d
```

4. **Run tests:**
```bash
make test
# or
pytest
```

## 🔧 Services

### Core Services
- **conversational-core**: AI conversation management
- **file-organizer**: Intelligent file organization
- **ide-agent**: Development environment integration

### Monitoring
- **Prometheus**: Metrics collection
- **Grafana**: Visualization dashboard
- **Redis**: Caching and session storage

## 📚 Documentation

- [API Documentation](./docs/api.md)
- [Deployment Guide](./docs/deployment.md)
- [Security Guidelines](./docs/security.md)
- [Development Guide](./docs/development.md)

## 🔒 Security

- Environment-based configuration
- Input sanitization
- Secure shell execution
- No secrets in repository

## 🧪 Testing

```bash
# Run all tests
make test

# Run specific test suite
pytest tests/core/
pytest tests/agents/
pytest tests/services/
```

## 📊 Monitoring

Access monitoring dashboards:
- Grafana: http://localhost:3000
- Prometheus: http://localhost:9090

## 🚀 Deployment

### Firebase Deployment
```bash
make deploy-firebase
```

### Docker Production
```bash
make deploy-prod
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.