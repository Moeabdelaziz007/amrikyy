# AuraOS Automation Platform - Deployment Guide

This guide covers deploying the AuraOS Automation Platform with real-time WebSocket capabilities, database integration, and monitoring.

## 🚀 Quick Start

### Prerequisites

- **Docker** (20.10+) and **Docker Compose** (2.0+)
- **Git** for cloning the repository
- **OpenSSL** for generating SSL certificates (production)
- **4GB RAM** minimum, **8GB recommended**
- **10GB disk space** for containers and data

### 1. Clone and Setup

```bash
git clone <repository-url>
cd AuraOS
cp env.example .env
```

### 2. Configure Environment

Edit `.env` file with your settings:

```bash
# Required: Change these for production
DB_PASSWORD=your-secure-database-password
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long
REDIS_PASSWORD=your-redis-password

# Optional: Customize URLs
CLIENT_URL=https://yourdomain.com
CORS_ORIGINS=https://yourdomain.com
```

### 3. Deploy

```bash
# Make deployment script executable
chmod +x deploy.sh

# Deploy everything
./deploy.sh deploy
```

### 4. Access the Platform

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **WebSocket**: ws://localhost:3001/ws/automation
- **Health Check**: http://localhost:3001/health

**Default Login:**
- Email: `admin@auraos.com`
- Password: `admin123`

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

# Complete cleanup (removes all data)
./deploy.sh cleanup
```

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (React)       │◄──►│   (Node.js)     │◄──►│   (PostgreSQL)  │
│   Port: 3000    │    │   Port: 3001    │    │   Port: 5432    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐              │
         │              │     Redis       │              │
         └──────────────►│   (Caching)     │◄─────────────┘
                        │   Port: 6379    │
                        └─────────────────┘
```

## 🔧 Service Details

### Frontend (auraos-client)
- **Technology**: React with TypeScript
- **Port**: 3000 (HTTP)
- **Features**: Real-time UI, WebSocket integration, responsive design
- **Build**: Optimized production build with Nginx

### Backend (auraos-server)
- **Technology**: Node.js with Express and TypeScript
- **Port**: 3001 (HTTP/WebSocket)
- **Features**: REST API, WebSocket server, real-time updates
- **Database**: PostgreSQL with Drizzle ORM

### Database (postgres)
- **Technology**: PostgreSQL 15
- **Port**: 5432
- **Features**: Full automation schema, indexes, triggers
- **Persistence**: Docker volume for data

### Cache (redis)
- **Technology**: Redis 7
- **Port**: 6379
- **Features**: Session storage, caching, pub/sub
- **Persistence**: Docker volume for data

## 🔒 Production Deployment

### 1. SSL/TLS Setup

Generate SSL certificates:

```bash
mkdir -p nginx/ssl
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout nginx/ssl/key.pem \
  -out nginx/ssl/cert.pem \
  -subj "/C=US/ST=State/L=City/O=Organization/CN=yourdomain.com"
```

### 2. Production Environment

Update `.env` for production:

```bash
NODE_ENV=production
CLIENT_URL=https://yourdomain.com
CORS_ORIGINS=https://yourdomain.com
DB_PASSWORD=super-secure-production-password
JWT_SECRET=production-jwt-secret-at-least-64-characters
```

### 3. Deploy with SSL

```bash
# Deploy with production profile (includes SSL)
docker-compose --profile production up -d
```

### 4. Domain Configuration

Point your domain to your server:
- A record: `yourdomain.com` → `your-server-ip`
- CNAME: `www.yourdomain.com` → `yourdomain.com`

## 📊 Monitoring (Optional)

### Enable Monitoring Stack

```bash
# Deploy with monitoring
docker-compose --profile monitoring up -d
```

**Monitoring URLs:**
- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3001 (admin/admin123)

### Monitoring Features

- **System Metrics**: CPU, Memory, Disk, Network
- **Application Metrics**: API response times, error rates
- **Database Metrics**: Query performance, connections
- **WebSocket Metrics**: Connection counts, message rates

## 🔧 Customization

### Adding Custom MCP Tools

1. Create tool in database:
```sql
INSERT INTO mcp_tools (name, description, category, ...) 
VALUES ('Your Tool', 'Description', 'category', ...);
```

2. Implement tool handler in backend
3. Add frontend integration

### Custom Workflow Templates

1. Create template in database:
```sql
INSERT INTO workflow_templates (name, description, nodes, ...) 
VALUES ('Template Name', 'Description', 'nodes_json', ...);
```

2. Access via frontend workflow builder

## 🚨 Troubleshooting

### Common Issues

**Services won't start:**
```bash
# Check logs
./deploy.sh logs

# Check Docker resources
docker system df
docker system prune
```

**Database connection issues:**
```bash
# Check database health
docker-compose exec postgres pg_isready -U postgres

# Reset database
docker-compose down --volumes
./deploy.sh deploy
```

**WebSocket connection issues:**
```bash
# Check WebSocket endpoint
curl -i -N -H "Connection: Upgrade" -H "Upgrade: websocket" \
  -H "Sec-WebSocket-Version: 13" -H "Sec-WebSocket-Key: test" \
  http://localhost:3001/ws/automation
```

**Memory issues:**
```bash
# Increase Docker memory limit
# Edit Docker Desktop settings → Resources → Memory
```

### Log Locations

- **Application logs**: `docker-compose logs -f`
- **Nginx logs**: `docker-compose exec nginx-proxy tail -f /var/log/nginx/access.log`
- **Database logs**: `docker-compose exec postgres tail -f /var/log/postgresql/postgresql-*.log`

### Performance Tuning

**Database optimization:**
```sql
-- Check slow queries
SELECT query, mean_time, calls FROM pg_stat_statements 
ORDER BY mean_time DESC LIMIT 10;

-- Analyze tables
ANALYZE;
```

**Application optimization:**
- Increase Node.js memory: `NODE_OPTIONS="--max-old-space-size=4096"`
- Enable Redis caching for frequently accessed data
- Use connection pooling for database connections

## 🔄 Updates and Maintenance

### Updating the Platform

```bash
# Pull latest changes
git pull origin main

# Update and redeploy
./deploy.sh update
```

### Backup Strategy

**Database backup:**
```bash
# Create backup
docker-compose exec postgres pg_dump -U postgres auraos_automation > backup.sql

# Restore backup
docker-compose exec -T postgres psql -U postgres auraos_automation < backup.sql
```

**Full system backup:**
```bash
# Backup volumes
docker run --rm -v auraos_postgres_data:/data -v $(pwd):/backup alpine \
  tar czf /backup/postgres_backup.tar.gz /data
```

### Maintenance Tasks

**Clean old logs:**
```sql
-- Run cleanup function
SELECT cleanup_old_logs();
```

**Update statistics:**
```sql
-- Update table statistics
ANALYZE;
```

## 📞 Support

For issues and questions:
1. Check this documentation
2. Review logs: `./deploy.sh logs`
3. Check GitHub issues
4. Create new issue with logs and environment details

## 🎯 Next Steps

After successful deployment:
1. **Change default passwords** in production
2. **Set up monitoring** and alerts
3. **Configure backups** and disaster recovery
4. **Set up CI/CD** for automated deployments
5. **Implement user authentication** and authorization
6. **Add custom MCP tools** and workflow templates

---

**🎉 Congratulations!** Your AuraOS Automation Platform is now deployed and ready for use!
