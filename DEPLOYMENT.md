# 🚀 AuraOS Telegram Bot Deployment Guide

Complete deployment guide for the AuraOS Unified Telegram Bot System.

## 📋 Prerequisites

- Node.js 18+ installed
- Telegram Bot Token from [@BotFather](https://t.me/BotFather)
- Admin Chat ID
- Firebase account (optional)
- Domain name (for webhook deployment)

## 🔧 Quick Start Deployment

### 1. Local Development Setup

```bash
# Clone and setup
git clone <repository-url>
cd auraos-telegram-system
npm install

# Configure environment
cp .env.example .env
# Edit .env with your credentials

# Start the bot
npm start
```

### 2. Production Deployment

```bash
# Install PM2 for process management
npm install -g pm2

# Start with PM2
pm2 start unified-telegram-bot.js --name "auraos-bot"

# Save PM2 configuration
pm2 save
pm2 startup
```

## 🌐 Webhook Deployment

### Option 1: Firebase Functions

1. **Setup Firebase**:
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase init functions
   ```

2. **Deploy Functions**:
   ```bash
   firebase deploy --only functions
   ```

3. **Set Webhook**:
   ```bash
   curl -X POST "https://api.telegram.org/bot<YOUR_TOKEN>/setWebhook" \
   -H "Content-Type: application/json" \
   -d '{"url": "https://your-project.cloudfunctions.net/telegramWebhook"}'
   ```

### Option 2: Heroku Deployment

1. **Create Heroku App**:
   ```bash
   heroku create your-auraos-bot
   ```

2. **Set Environment Variables**:
   ```bash
   heroku config:set TELEGRAM_BOT_TOKEN=your_token
   heroku config:set TELEGRAM_ADMIN_CHAT_ID=your_chat_id
   ```

3. **Deploy**:
   ```bash
   git push heroku main
   ```

4. **Set Webhook**:
   ```bash
   curl -X POST "https://api.telegram.org/bot<YOUR_TOKEN>/setWebhook" \
   -H "Content-Type: application/json" \
   -d '{"url": "https://your-auraos-bot.herokuapp.com/webhook"}'
   ```

### Option 3: VPS Deployment

1. **Server Setup**:
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install PM2
   sudo npm install -g pm2
   ```

2. **Deploy Application**:
   ```bash
   # Clone repository
   git clone <repository-url>
   cd auraos-telegram-system
   
   # Install dependencies
   npm install
   
   # Configure environment
   cp .env.example .env
   nano .env
   
   # Start with PM2
   pm2 start unified-telegram-bot.js --name "auraos-bot"
   pm2 startup
   pm2 save
   ```

3. **Setup Nginx** (optional):
   ```bash
   sudo apt install nginx
   
   # Create nginx config
   sudo nano /etc/nginx/sites-available/auraos-bot
   
   # Add configuration:
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   
   # Enable site
   sudo ln -s /etc/nginx/sites-available/auraos-bot /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

## 🔐 SSL Certificate Setup

### Let's Encrypt with Certbot

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 📊 Monitoring and Logging

### PM2 Monitoring

```bash
# View logs
pm2 logs auraos-bot

# Monitor in real-time
pm2 monit

# Restart if needed
pm2 restart auraos-bot
```

### System Monitoring

```bash
# Install monitoring tools
sudo apt install htop iotop nethogs

# Monitor system resources
htop
iotop
nethogs
```

## 🔄 Backup and Recovery

### Database Backup

```bash
# Backup user data
cp -r data/ backup/data-$(date +%Y%m%d)/

# Automated backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
tar -czf "backup-$DATE.tar.gz" data/
```

### Configuration Backup

```bash
# Backup configuration
cp .env backup/env-backup-$(date +%Y%m%d)
cp package.json backup/package-backup-$(date +%Y%m%d)
```

## 🚨 Troubleshooting

### Common Issues

1. **Bot Not Responding**:
   ```bash
   # Check if bot is running
   pm2 status
   
   # Check logs
   pm2 logs auraos-bot
   
   # Restart bot
   pm2 restart auraos-bot
   ```

2. **Webhook Issues**:
   ```bash
   # Check webhook status
   curl "https://api.telegram.org/bot<YOUR_TOKEN>/getWebhookInfo"
   
   # Delete webhook (use polling instead)
   curl -X POST "https://api.telegram.org/bot<YOUR_TOKEN>/deleteWebhook"
   ```

3. **Memory Issues**:
   ```bash
   # Check memory usage
   pm2 monit
   
   # Restart if memory is high
   pm2 restart auraos-bot
   ```

### Performance Optimization

1. **Enable Compression**:
   ```javascript
   app.use(compression());
   ```

2. **Optimize Database Queries**:
   ```javascript
   // Use indexes and limit queries
   db.collection('users').find({}).limit(100);
   ```

3. **Cache Frequently Used Data**:
   ```javascript
   const cache = new Map();
   // Cache user sessions and settings
   ```

## 🔒 Security Best Practices

### Environment Security

```bash
# Secure .env file
chmod 600 .env

# Use environment-specific configs
cp .env.example .env.production
```

### Bot Security

```javascript
// Validate admin access
if (msg.chat.id.toString() !== process.env.TELEGRAM_ADMIN_CHAT_ID) {
  return res.status(403).send('Unauthorized');
}

// Rate limiting
const rateLimit = new Map();
const RATE_LIMIT = 10; // messages per minute
```

### Server Security

```bash
# Configure firewall
sudo ufw enable
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443

# Disable root login
sudo nano /etc/ssh/sshd_config
# Set: PermitRootLogin no
sudo systemctl restart ssh
```

## 📈 Scaling

### Horizontal Scaling

1. **Load Balancer Setup**:
   ```bash
   # Install nginx for load balancing
   sudo apt install nginx
   
   # Configure upstream servers
   upstream bot_servers {
       server 127.0.0.1:3001;
       server 127.0.0.1:3002;
       server 127.0.0.1:3003;
   }
   ```

2. **Multiple Bot Instances**:
   ```bash
   # Start multiple instances
   pm2 start unified-telegram-bot.js --name "auraos-bot-1" -- --port 3001
   pm2 start unified-telegram-bot.js --name "auraos-bot-2" -- --port 3002
   pm2 start unified-telegram-bot.js --name "auraos-bot-3" -- --port 3003
   ```

### Database Scaling

1. **Redis for Session Storage**:
   ```bash
   sudo apt install redis-server
   npm install redis
   ```

2. **MongoDB for User Data**:
   ```bash
   # Install MongoDB
   wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
   sudo apt-get install mongodb-org
   ```

## 📱 Mobile App Integration

### React Native Setup

```bash
# Install React Native CLI
npm install -g react-native-cli

# Create new project
react-native init AuraOSApp

# Install dependencies
npm install @react-native-async-storage/async-storage
npm install react-native-telegram-bot-api
```

### Flutter Setup

```bash
# Create Flutter project
flutter create auraos_app

# Add dependencies to pubspec.yaml
dependencies:
  http: ^0.13.5
  telegram_bot_api: ^1.0.0
```

## 🔄 CI/CD Pipeline

### GitHub Actions

```yaml
name: Deploy AuraOS Bot

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm install
      
    - name: Run tests
      run: npm test
      
    - name: Deploy to production
      run: |
        pm2 stop auraos-bot
        pm2 start unified-telegram-bot.js --name "auraos-bot"
```

## 📊 Analytics and Metrics

### Custom Analytics

```javascript
// Track user interactions
const analytics = {
  track: (event, data) => {
    console.log(`Analytics: ${event}`, data);
    // Send to analytics service
  }
};

// Usage
analytics.track('user_message', {
  userId: msg.from.id,
  messageType: 'command',
  command: text.split(' ')[0]
});
```

### Performance Metrics

```javascript
// Monitor response times
const startTime = Date.now();
// ... process message ...
const responseTime = Date.now() - startTime;
console.log(`Response time: ${responseTime}ms`);
```

## 🎯 Production Checklist

- [ ] Environment variables configured
- [ ] SSL certificate installed
- [ ] Firewall configured
- [ ] Backup strategy implemented
- [ ] Monitoring setup
- [ ] Error logging configured
- [ ] Rate limiting enabled
- [ ] Security headers set
- [ ] Performance optimization applied
- [ ] Documentation updated

## 🆘 Support and Maintenance

### Regular Maintenance

```bash
# Weekly maintenance script
#!/bin/bash
echo "Starting weekly maintenance..."

# Update system
sudo apt update && sudo apt upgrade -y

# Restart services
pm2 restart auraos-bot

# Clean logs
pm2 flush

# Backup data
./backup-script.sh

echo "Weekly maintenance completed."
```

### Health Checks

```bash
# Health check script
#!/bin/bash
if curl -f http://localhost:3000/health > /dev/null 2>&1; then
    echo "Bot is healthy"
else
    echo "Bot is down, restarting..."
    pm2 restart auraos-bot
fi
```

---

**Your AuraOS Telegram Bot is now ready for production! 🚀**