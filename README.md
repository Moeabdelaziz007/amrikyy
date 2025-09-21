# 🚀 AuraOS Automation Platform

> **Professional workflow automation platform with real-time capabilities - Better than n8n**

A comprehensive automation platform featuring workspace management, MCP (Model Context Protocol) tools integration, AI-powered workflow optimization, and real-time WebSocket updates. Built with modern technologies and designed for enterprise-scale automation.

![AuraOS Automation Platform](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED)

## ✨ Features

### 🎯 Core Automation
- **Visual Workflow Builder** - Drag-and-drop automation with node-based editor
- **Real-Time Execution** - Live monitoring of workflow executions
- **Workspace Management** - Multi-user collaboration with role-based access
- **Task Scheduling** - Cron-based scheduling with timezone support
- **Error Handling** - Comprehensive error recovery and retry mechanisms

### 🤖 AI & MCP Integration
- **AI Workflow Optimizer** - Intelligent suggestions for workflow improvements
- **MCP Tools Integration** - Model Context Protocol for advanced AI capabilities
- **Smart Recommendations** - AI-powered automation suggestions
- **Performance Analytics** - Machine learning insights for optimization

### 🔄 Real-Time Capabilities
- **Live WebSocket Updates** - Instant synchronization across all clients
- **Real-Time Monitoring** - Live system health and performance metrics
- **Collaborative Editing** - Multiple users working simultaneously
- **Live Notifications** - Instant alerts and status updates

### 🏢 Enterprise Features
- **Multi-Workspace Support** - Organize projects and teams
- **User Management** - Role-based permissions and authentication
- **API Integration** - RESTful APIs for all platform features
- **Webhook Support** - Trigger workflows from external systems
- **Template Marketplace** - Share and discover automation templates

### 📊 Monitoring & Analytics
- **System Health Dashboard** - Real-time system monitoring
- **Performance Metrics** - Detailed execution analytics
- **Usage Statistics** - Track automation usage and patterns
- **Alert Management** - Proactive system alerts and notifications

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   React + TS    │◄──►│   Node.js + TS  │◄──►│   PostgreSQL    │
│   Real-time UI  │    │   WebSocket API │    │   Full Schema   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐              │
         │              │     Redis       │              │
         └──────────────►│   Caching +     │◄─────────────┘
                        │   Real-time     │
                        └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- **Docker** (20.10+) and **Docker Compose** (2.0+)
- **Git** for cloning the repository
- **4GB RAM** minimum, **8GB recommended**
- **10GB disk space** for containers and data

### 1. Clone and Deploy

```bash
# Clone the repository
git clone <repository-url>
cd AuraOS

# Copy environment configuration
cp env.example .env

# Deploy the entire platform
chmod +x deploy.sh
./deploy.sh deploy
```

### 2. Access Your Platform

- **🌐 Frontend**: http://localhost:3000
- **🔧 Backend API**: http://localhost:3001
- **🔌 WebSocket**: ws://localhost:3001/ws/automation
- **📊 Health Check**: http://localhost:3001/health

**Default Login:**
- **📧 Email**: `admin@auraos.com`
- **🔑 Password**: `admin123`

### 3. Start Automating

1. **Create Workspaces** - Organize your automation projects
2. **Build Workflows** - Use the visual workflow builder
3. **Integrate MCP Tools** - Connect AI and automation tools
4. **Monitor in Real-Time** - Watch executions live with WebSocket updates
5. **Optimize with AI** - Get intelligent suggestions for improvements

## 📋 Deployment Commands

```bash
# Deploy the platform
./deploy.sh deploy

# Stop services
./deploy.sh stop

# Restart services
./deploy.sh restart

# View logs
./deploy.sh logs

# Check status
./deploy.sh status

# Update services
./deploy.sh update

# Complete cleanup
./deploy.sh cleanup
```

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Real-time WebSocket** integration
- **Responsive design** for all devices

### Backend
- **Node.js** with Express and TypeScript
- **WebSocket Server** for real-time updates
- **PostgreSQL** with Drizzle ORM
- **Redis** for caching and sessions
- **JWT Authentication** with security middleware

### Infrastructure
- **Docker** containerization
- **Nginx** reverse proxy with SSL
- **Prometheus** + **Grafana** monitoring
- **Health checks** and auto-recovery
- **Backup and restore** capabilities

## 🎨 User Interface

### Dashboard
- **Real-time metrics** and system health
- **Quick actions** for common tasks
- **Recent activity** and notifications
- **Workspace overview** with task counts

### Workspace Manager
- **Drag-and-drop** task organization
- **Collaborative features** with real-time updates
- **Custom themes** and layouts
- **Permission management** for team members

### Workflow Builder
- **Visual node editor** with drag-and-drop
- **Real-time preview** and testing
- **Template library** with pre-built workflows
- **Version control** and rollback capabilities

### MCP Tools Integration
- **Tool marketplace** with ratings and reviews
- **One-click installation** and configuration
- **Performance monitoring** for each tool
- **Integration testing** and validation

### Real-Time Monitor
- **Live execution tracking** with WebSocket updates
- **System health dashboard** with alerts
- **Performance metrics** and analytics
- **Log streaming** and error tracking

## 🔧 API Documentation

### REST API Endpoints

```bash
# Workspaces
GET    /api/v1/workspaces              # List workspaces
POST   /api/v1/workspaces              # Create workspace
GET    /api/v1/workspaces/:id          # Get workspace
PUT    /api/v1/workspaces/:id          # Update workspace
DELETE /api/v1/workspaces/:id          # Delete workspace

# Automation Tasks
GET    /api/v1/tasks                   # List tasks
POST   /api/v1/tasks                   # Create task
GET    /api/v1/tasks/:id               # Get task
PUT    /api/v1/tasks/:id               # Update task
DELETE /api/v1/tasks/:id               # Delete task
POST   /api/v1/tasks/:id/execute       # Execute task

# MCP Tools
GET    /api/v1/mcp-tools               # List tools
GET    /api/v1/mcp-tools/:id           # Get tool
POST   /api/v1/mcp-tools/:id/install   # Install tool
DELETE /api/v1/mcp-tools/:id/uninstall # Uninstall tool

# System Monitoring
GET    /api/v1/system/health           # System health
GET    /api/v1/system/metrics          # System metrics
GET    /api/v1/system/alerts           # System alerts
```

### WebSocket API

```javascript
// Connect to WebSocket
const ws = new WebSocket('ws://localhost:3001/ws/automation?token=your-token');

// Subscribe to updates
ws.send(JSON.stringify({
  type: 'subscribe',
  data: { subscriptions: ['task_update', 'execution_update'] }
}));

// Listen for real-time updates
ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  console.log('Real-time update:', message);
};
```

## 🔒 Security Features

- **JWT Authentication** with secure token handling
- **Rate Limiting** to prevent abuse
- **CORS Protection** with configurable origins
- **Security Headers** (HSTS, CSP, XSS Protection)
- **SQL Injection Protection** with parameterized queries
- **WebSocket Security** with token validation
- **Role-Based Access Control** for workspaces and tasks

## 📊 Monitoring & Analytics

### Built-in Monitoring
- **System Health Checks** with automatic alerts
- **Performance Metrics** for all components
- **WebSocket Connection Monitoring** with live stats
- **Database Performance** tracking and optimization
- **API Response Times** and error rates

### Optional Monitoring Stack
```bash
# Deploy with monitoring
docker-compose --profile monitoring up -d
```

- **Prometheus**: http://localhost:9090 (metrics collection)
- **Grafana**: http://localhost:3001 (dashboards)

## 🚀 Production Deployment

### SSL/TLS Setup
```bash
# Generate SSL certificates
mkdir -p nginx/ssl
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout nginx/ssl/key.pem \
  -out nginx/ssl/cert.pem \
  -subj "/C=US/ST=State/L=City/O=Organization/CN=yourdomain.com"
```

### Production Environment
```bash
# Update .env for production
NODE_ENV=production
CLIENT_URL=https://yourdomain.com
DB_PASSWORD=super-secure-password
JWT_SECRET=production-jwt-secret-64-chars-minimum
```

### Deploy with SSL
```bash
# Deploy with production profile
docker-compose --profile production up -d
```

## 🔄 Development

### Local Development Setup

```bash
# Backend development
cd server
npm install
npm run dev

# Frontend development
cd client
npm install
npm start

# Database setup
docker-compose up postgres redis
```

### Project Structure

```
AuraOS/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API and WebSocket clients
│   │   └── types/         # TypeScript definitions
│   ├── Dockerfile         # Frontend container
│   └── nginx.conf         # Nginx configuration
├── server/                # Node.js backend
│   ├── api/automation/    # API routes and logic
│   │   ├── types.ts       # Database types
│   │   ├── schema.ts      # Database schema
│   │   ├── routes.ts      # API endpoints
│   │   ├── websocket.ts   # WebSocket server
│   │   └── database.ts    # Database connection
│   ├── sql/init.sql       # Database initialization
│   ├── Dockerfile         # Backend container
│   └── package.json       # Dependencies
├── nginx/                 # Production reverse proxy
├── monitoring/            # Prometheus and Grafana configs
├── docker-compose.yml     # Complete stack definition
├── deploy.sh             # Deployment script
├── env.example           # Environment template
└── DEPLOYMENT.md         # Detailed deployment guide
```

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Guidelines

- **TypeScript** for type safety
- **ESLint** and **Prettier** for code formatting
- **Jest** for testing
- **Conventional Commits** for commit messages
- **Component documentation** with JSDoc

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **n8n** for inspiration on workflow automation
- **React** and **Node.js** communities for excellent tooling
- **Docker** for containerization capabilities
- **PostgreSQL** and **Redis** for reliable data storage
- **WebSocket** protocol for real-time communication

## 📞 Support

- **📖 Documentation**: [DEPLOYMENT.md](DEPLOYMENT.md)
- **🐛 Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **💬 Discussions**: [GitHub Discussions](https://github.com/your-repo/discussions)
- **📧 Email**: support@auraos.com

## 🎯 Roadmap

### Upcoming Features
- [ ] **Mobile App** (React Native)
- [ ] **Advanced Analytics** with ML insights
- [ ] **Workflow Templates Marketplace**
- [ ] **Enterprise SSO** integration
- [ ] **Advanced Scheduling** with dependencies
- [ ] **Multi-language Support**
- [ ] **API Rate Limiting** per user
- [ ] **Advanced Monitoring** with custom dashboards

### Performance Improvements
- [ ] **Horizontal Scaling** with load balancing
- [ ] **Database Optimization** with read replicas
- [ ] **Caching Layer** improvements
- [ ] **WebSocket Clustering** for high availability
- [ ] **CDN Integration** for static assets

---

<div align="center">

**🚀 Ready to automate your workflows?**

[![Deploy Now](https://img.shields.io/badge/Deploy%20Now-Start%20Automating-brightgreen?style=for-the-badge)](./deploy.sh)

*Built with ❤️ by the AuraOS Team*

</div>