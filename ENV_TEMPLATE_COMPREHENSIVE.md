# =============================================================================
# 🔐 AuraOS Environment Configuration Template
# =============================================================================
# 
# ⚠️  IMPORTANT SECURITY NOTICE:
# - Copy this file to .env and fill in your actual values
# - NEVER commit .env file to version control
# - Use different values for development, staging, and production
# - Rotate keys regularly for security
#
# =============================================================================

# =============================================================================
# 🔥 Firebase Configuration
# =============================================================================
# Get these values from: https://console.firebase.google.com/project/YOUR_PROJECT/settings/general

# Client-side Firebase Configuration (Vite/React)
VITE_FIREBASE_API_KEY=your-firebase-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# Server-side Firebase Admin Configuration
FIREBASE_ADMIN_PROJECT_ID=your-project-id
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"

# =============================================================================
# 🌐 Application Configuration
# =============================================================================

# Application Environment
NODE_ENV=development
APP_ENV=development

# Server Configuration
PORT=3000
HOST=localhost

# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/auraos_db
DATABASE_SSL=false

# Redis Configuration (for caching)
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=your-redis-password

# =============================================================================
# 🔒 Security Configuration
# =============================================================================

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-minimum-32-characters
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-refresh-token-secret-here

# Encryption Keys
ENCRYPTION_KEY=your-32-character-encryption-key-here
API_ENCRYPTION_KEY=your-api-encryption-key-here

# CORS Configuration
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
CORS_CREDENTIALS=true

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# =============================================================================
# 🤖 AI & Machine Learning Configuration
# =============================================================================

# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key-here
OPENAI_ORGANIZATION_ID=your-org-id-here

# Google AI (Gemini) Configuration
GOOGLE_AI_API_KEY=your-google-ai-api-key-here
GEMINI_MODEL_ID=gemini-pro

# Anthropic Configuration
ANTHROPIC_API_KEY=your-anthropic-api-key-here

# Weights & Biases Configuration
WANDB_API_KEY=your-wandb-api-key-here
WANDB_PROJECT_NAME=auraos-learning-loop

# =============================================================================
# 📊 Analytics & Monitoring Configuration
# =============================================================================

# Google Analytics
GA_MEASUREMENT_ID=G-XXXXXXXXXX
GA_TRACKING_ID=UA-XXXXXXXXX-X

# Sentry Configuration
SENTRY_DSN=your-sentry-dsn-here
SENTRY_ENVIRONMENT=development

# Logging Configuration
LOG_LEVEL=verbose
LOG_FORMAT=json
LOG_FILE_PATH=./logs/auraos.log

# Performance Monitoring
PERFORMANCE_MONITORING=true
PERFORMANCE_SAMPLE_RATE=0.1

# =============================================================================
# 🔌 External Services Configuration
# =============================================================================

# Email Service (SendGrid)
SENDGRID_API_KEY=your-sendgrid-api-key-here
FROM_EMAIL=noreply@auraos.com

# SMS Service (Twilio)
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+1234567890

# File Storage (AWS S3)
AWS_ACCESS_KEY_ID=your-aws-access-key-id
AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=auraos-storage

# =============================================================================
# 🧪 Development & Testing Configuration
# =============================================================================

# Development Settings
DEBUG_MODE=true
VERBOSE_LOGGING=true
HOT_RELOAD=true

# Testing Configuration
TEST_DATABASE_URL=postgresql://test:test@localhost:5432/auraos_test_db
TEST_REDIS_URL=redis://localhost:6379/1

# Mock Services (for development)
USE_MOCK_SERVICES=false
MOCK_AI_RESPONSES=false

# =============================================================================
# 🚀 Production Configuration
# =============================================================================
# Uncomment and modify these for production deployment

# Production Database
# DATABASE_URL=postgresql://prod_user:prod_pass@prod_host:5432/auraos_prod
# DATABASE_SSL=true

# Production Redis
# REDIS_URL=redis://prod-redis-host:6379
# REDIS_PASSWORD=prod-redis-password

# Production Security
# JWT_SECRET=your-production-jwt-secret-minimum-64-characters
# ENCRYPTION_KEY=your-production-encryption-key-32-chars

# Production Monitoring
# SENTRY_ENVIRONMENT=production
# LOG_LEVEL=error
# PERFORMANCE_SAMPLE_RATE=0.01

# =============================================================================
# 📱 Mobile & Cross-Platform Configuration
# =============================================================================

# React Native Configuration
RN_FIREBASE_API_KEY=your-rn-firebase-api-key
RN_FIREBASE_PROJECT_ID=your-rn-project-id

# PWA Configuration
PWA_ENABLED=true
PWA_CACHE_STRATEGY=network-first

# =============================================================================
# 🔧 Advanced Configuration
# =============================================================================

# WebSocket Configuration
WEBSOCKET_PORT=3001
WEBSOCKET_PATH=/ws

# File Upload Configuration
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,application/pdf

# Cache Configuration
CACHE_TTL=3600
CACHE_MAX_SIZE=1000

# =============================================================================
# 📋 Setup Instructions
# =============================================================================
#
# 1. Copy this file to .env:
#    cp .env.example .env
#
# 2. Fill in your actual values for each variable
#
# 3. For Firebase setup:
#    - Go to https://console.firebase.google.com/
#    - Create a new project or select existing
#    - Go to Project Settings > General
#    - Copy the config values to your .env file
#
# 4. For production deployment:
#    - Use environment-specific values
#    - Enable SSL for database connections
#    - Use strong, unique secrets
#    - Set appropriate log levels
#
# 5. Security checklist:
#    - ✅ All secrets are at least 32 characters
#    - ✅ Different values for each environment
#    - ✅ Regular key rotation scheduled
#    - ✅ .env file is in .gitignore
#    - ✅ Production secrets are encrypted
#
# =============================================================================
