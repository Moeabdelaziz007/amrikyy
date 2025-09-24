# AURAOS ENVIRONMENT CONFIGURATION GUIDE

## 🚨 CRITICAL: .env FILE PROTECTION

The `.env` file is **ESSENTIAL** for AuraOS operation and **MUST NOT BE DELETED**.

### ⚠️ Protection Rules

1. **NEVER DELETE** the `.env` file
2. **NEVER COMMIT** the `.env` file to version control
3. **ALWAYS BACKUP** before making changes
4. **USE TEMPLATES** (.env.example) for new setups

### 🛡️ Protection Mechanisms

#### 1. Git Protection
- `.env` is listed in `.gitignore` (line 14)
- Prevents accidental commits to repository
- Keeps sensitive data secure

#### 2. File Permissions
```bash
# Protect the file
chmod 600 .env

# Check permissions
ls -l .env
```

#### 3. Backup System
```bash
# Use the protection script
./protect-env.sh backup
./protect-env.sh protect
```

#### 4. Integrity Checks
```bash
# Check file integrity
./protect-env.sh check
./protect-env.sh status
```

### 📁 File Structure

```
AuraOS/
├── .env                 # 🚨 MAIN CONFIG FILE (DO NOT DELETE)
├── .env.example         # 📋 Template for new setups
├── protect-env.sh       # 🛡️ Protection script
├── env_backups/         # 💾 Automatic backups
└── .gitignore          # 🔒 Git protection rules
```

### 🔧 Setup Instructions

#### For New Developers:
1. **Copy template**: `cp .env.example .env`
2. **Fill in values**: Edit `.env` with your actual credentials
3. **Protect file**: `./protect-env.sh protect`
4. **Verify setup**: `./protect-env.sh check`

#### For Existing Setup:
1. **Check status**: `./protect-env.sh status`
2. **Create backup**: `./protect-env.sh backup`
3. **Make changes**: `./protect-env.sh unprotect`
4. **Edit .env**: Update your values
5. **Protect again**: `./protect-env.sh protect`

### 🚨 Emergency Recovery

If `.env` file is accidentally deleted:

1. **Check backups**: `ls env_backups/`
2. **Restore latest**: `./protect-env.sh restore`
3. **Recreate from template**: `./protect-env.sh recreate`
4. **Update values**: Edit the restored file
5. **Protect**: `./protect-env.sh protect`

### 📋 Required Environment Variables

#### System Configuration
- `NODE_ENV` - Environment mode (development/production)
- `PORT` - Server port (default: 3001)
- `CLIENT_URL` - Frontend URL
- `DEBUG` - Debug mode flag

#### Database Configuration
- `DATABASE_URL` - PostgreSQL connection string
- `DB_PASSWORD` - Database password
- `REDIS_URL` - Redis connection string
- `REDIS_PASSWORD` - Redis password

#### Firebase Configuration
- `VITE_FIREBASE_API_KEY` - Firebase API key (client-side)
- `VITE_FIREBASE_AUTH_DOMAIN` - Firebase auth domain
- `VITE_FIREBASE_PROJECT_ID` - Firebase project ID
- `FIREBASE_PRIVATE_KEY` - Firebase private key (server-side)
- `FIREBASE_CLIENT_EMAIL` - Firebase service account email

#### AI Services
- `GOOGLE_AI_API_KEY` - Google AI/Gemini API key
- `OPENAI_API_KEY` - OpenAI API key
- `ANTHROPIC_API_KEY` - Anthropic API key

#### Telegram Integration
- `TELEGRAM_BOT_TOKEN` - Telegram bot token
- `TELEGRAM_ADMIN_CHAT_ID` - Admin chat ID

#### Security
- `JWT_SECRET` - JWT signing secret
- `WEBHOOK_SECRET` - Webhook validation secret

### 🔍 Validation Commands

```bash
# Check all environment variables
node -e "require('dotenv').config(); console.log(process.env)"

# Validate configuration
node config_env.cjs

# Check file integrity
./protect-env.sh check
```

### 📊 Monitoring

The system automatically logs all protection events to `env_protection.log`:

```bash
# View protection log
tail -f env_protection.log

# Check recent events
grep "$(date '+%Y-%m-%d')" env_protection.log
```

### 🚫 Common Mistakes to Avoid

1. **Don't delete .env** - System will break
2. **Don't commit .env** - Security risk
3. **Don't share .env** - Contains secrets
4. **Don't edit without backup** - Risk of data loss
5. **Don't ignore warnings** - Check integrity regularly

### 🆘 Support

If you encounter issues:

1. **Check status**: `./protect-env.sh status`
2. **View logs**: `cat env_protection.log`
3. **Restore backup**: `./protect-env.sh restore`
4. **Recreate file**: `./protect-env.sh recreate`

### 📝 Last Updated

This documentation was last updated: $(date)

---

**Remember: The .env file is the heart of AuraOS configuration. Protect it like your life depends on it! 🛡️**
