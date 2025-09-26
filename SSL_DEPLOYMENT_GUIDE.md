# 🔒 SSL & Production Deployment Guide

## 🚀 **Quick Start - Frontend Testing**

### 1. Test Frontend (Already Running)
```bash
# Frontend should be running on http://localhost:5173
# Open your browser and navigate to:
# http://localhost:5173

# Check if it's running:
curl http://localhost:5173
```

### 2. Test TaskQueue Component
1. Open http://localhost:5173 in your browser
2. Navigate to the Dashboard
3. Click on the "Task Queue" tab
4. You should see the new TaskQueue component with:
   - Task filtering and search
   - Bulk operations
   - Real-time task management
   - Task statistics

## 🔒 **SSL Certificate Setup**

### Option A: Self-Signed Certificates (Development)
```bash
cd server
./ssl-setup.sh self-signed
```

### Option B: Let's Encrypt (Production)
```bash
# Replace 'yourdomain.com' with your actual domain
cd server
./ssl-setup.sh letsencrypt yourdomain.com
```

### Option C: Manual SSL Setup
```bash
# 1. Generate self-signed certificates
openssl req -x509 -newkey rsa:4096 -keyout server/ssl/auraos.key -out server/ssl/auraos.crt -days 365 -nodes

# 2. Create combined certificate
cat server/ssl/auraos.crt server/ssl/auraos.key > server/ssl/auraos.pem
```

## 🐳 **Production Deployment**

### 1. Basic Deployment (HTTP)
```bash
# Deploy with HTTP only
./deploy-production.sh
```

### 2. SSL-Enabled Deployment
```bash
# 1. Setup SSL certificates first
cd server
./ssl-setup.sh self-signed  # or letsencrypt yourdomain.com

# 2. Deploy with SSL
docker-compose -f docker-compose.ssl.yml up -d
```

### 3. Custom Domain Setup
```bash
# 1. Update your domain DNS to point to your server IP
# 2. Setup Let's Encrypt certificates
cd server
./ssl-setup.sh letsencrypt yourdomain.com

# 3. Update nginx-ssl.conf with your domain
# 4. Deploy with SSL
docker-compose -f docker-compose.ssl.yml up -d
```

## 🔧 **Environment Configuration**

### 1. Create .env File
```bash
# Copy the example file
cp .env.example .env

# Edit with your actual values
nano .env
```

### 2. Required Environment Variables
```env
# Database
DATABASE_URL=postgresql://postgres:password@db:5432/auraos

# Redis
REDIS_URL=redis://redis:6379

# Firebase
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email

# API Keys
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
GOOGLE_AI_API_KEY=your-google-ai-key
OPENAI_API_KEY=your-openai-key

# Security
JWT_SECRET=your-super-secret-jwt-key

# Optional
NODE_ENV=production
PORT=3002
```

## 📊 **Monitoring & Health Checks**

### 1. Service Health
```bash
# Check all services
docker-compose -f server/docker-compose.production.yml ps

# Check backend health
curl http://localhost:3002/health

# Check database
docker-compose -f server/docker-compose.production.yml exec db pg_isready -U postgres

# Check Redis
docker-compose -f server/docker-compose.production.yml exec redis redis-cli ping
```

### 2. Monitoring Dashboards
- **Grafana**: http://localhost:3000 (admin/admin)
- **Prometheus**: http://localhost:9090
- **Application**: http://localhost:3002/metrics

### 3. Logs
```bash
# View all logs
docker-compose -f server/docker-compose.production.yml logs -f

# View specific service logs
docker-compose -f server/docker-compose.production.yml logs -f auraos-backend
docker-compose -f server/docker-compose.production.yml logs -f nginx
```

## 🛡️ **Security Features**

### 1. SSL/TLS Configuration
- ✅ TLS 1.2 and 1.3 support
- ✅ Strong cipher suites
- ✅ HSTS headers
- ✅ Perfect Forward Secrecy

### 2. Rate Limiting
- ✅ API endpoints: 10 requests/second
- ✅ Login endpoints: 1 request/second
- ✅ Burst handling with queue

### 3. Security Headers
- ✅ X-Frame-Options: DENY
- ✅ X-Content-Type-Options: nosniff
- ✅ X-XSS-Protection: 1; mode=block
- ✅ Strict-Transport-Security
- ✅ Referrer-Policy

### 4. Network Security
- ✅ Internal Docker networks
- ✅ Restricted port exposure
- ✅ Non-root container execution

## 🔄 **SSL Certificate Renewal**

### Automatic Renewal
```bash
# Certificates auto-renew via cron job
# Check renewal status
certbot certificates

# Manual renewal
./server/ssl-setup.sh renew
```

### Let's Encrypt Renewal
```bash
# Test renewal (dry run)
sudo certbot renew --dry-run

# Force renewal
sudo certbot renew --force-renewal
```

## 🚨 **Troubleshooting**

### 1. Frontend Issues
```bash
# Clear cache and restart
rm -rf node_modules/.vite
npm run dev

# Check for errors
npm run build
```

### 2. Backend Issues
```bash
# Check backend logs
docker-compose -f server/docker-compose.production.yml logs auraos-backend

# Restart backend
docker-compose -f server/docker-compose.production.yml restart auraos-backend
```

### 3. SSL Issues
```bash
# Check certificate validity
openssl x509 -in server/ssl/auraos.crt -text -noout

# Test SSL connection
openssl s_client -connect localhost:443 -servername yourdomain.com
```

### 4. Database Issues
```bash
# Check database connection
docker-compose -f server/docker-compose.production.yml exec db psql -U postgres -d auraos -c "SELECT 1;"

# Reset database
docker-compose -f server/docker-compose.production.yml down
docker volume rm auraos_postgres_data
docker-compose -f server/docker-compose.production.yml up -d
```

## 📈 **Performance Optimization**

### 1. Production Builds
```bash
# Frontend production build
npm run build

# Backend production build
cd server
npm run build
```

### 2. Docker Optimization
```bash
# Multi-stage builds enabled
# Image optimization
# Layer caching
# Minimal base images
```

### 3. Monitoring
```bash
# Resource usage
docker stats

# Performance metrics
curl http://localhost:3002/metrics
```

## 🎯 **Next Steps**

### Immediate (Today)
1. ✅ Test frontend functionality
2. ✅ Setup SSL certificates
3. ✅ Deploy to production
4. ✅ Configure monitoring

### Short-term (This Week)
1. Set up custom domain
2. Configure DNS
3. Test all endpoints
4. Set up backups

### Medium-term (Next Month)
1. Performance optimization
2. Security hardening
3. Load testing
4. Scaling preparation

## 📞 **Support**

If you encounter any issues:
1. Check the logs first
2. Verify environment variables
3. Test individual services
4. Check network connectivity
5. Review SSL certificate validity

**Status**: ✅ **READY FOR PRODUCTION DEPLOYMENT**
