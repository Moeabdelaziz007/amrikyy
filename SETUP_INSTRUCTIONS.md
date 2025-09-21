# 🚀 AuraOS AI System - Setup Instructions

## 📋 **Current Status: Ready for Configuration**

✅ **Environment file created** (.env)
✅ **All system files ready**
✅ **Testing suite prepared**

## 🎯 **Next Steps for You:**

### **1️⃣ Firebase Setup** 🔥

**Step 1: Create Firebase Project**
```bash
# Go to Firebase Console
https://console.firebase.google.com/

# Create new project:
Project Name: auraos-ai-system
Enable Google Analytics: Yes
```

**Step 2: Enable Firestore**
```bash
# In Firebase Console:
Firestore Database → Create Database → Start in test mode
```

**Step 3: Get Service Account Key**
```bash
# In Firebase Console:
Project Settings → Service Accounts → Generate new private key
# Download the JSON file and rename to: service-account-key.json
```

**Step 4: Update .env**
```bash
# Edit .env file and replace:
FIREBASE_PROJECT_ID=your_actual_project_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_ACTUAL_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
```

### **2️⃣ Telegram Bot Setup** 🤖

**Step 1: Create Bot**
```bash
# Go to Telegram and message @BotFather
/newbot
Bot Name: AuraOS AI Assistant
Username: auraos_ai_bot (or any available name)
```

**Step 2: Get Chat ID**
```bash
# Message @RawDataBot and send /start
# Copy your Chat ID from the response
```

**Step 3: Update .env**
```bash
# Edit .env file and replace:
TELEGRAM_BOT_TOKEN=123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11
TELEGRAM_ADMIN_CHAT_ID=123456789
```

### **3️⃣ Google AI Setup** 🧠

**Step 1: Get API Key**
```bash
# Go to Google AI Studio
https://aistudio.google.com/app/apikey

# Create API Key
```

**Step 2: Update .env**
```bash
# Edit .env file and replace:
GOOGLE_AI_API_KEY=AIzaSyC...
```

## 🧪 **Testing Commands**

After updating .env with real values, run these tests:

```bash
# Test environment setup
node test-setup.cjs

# Test Firebase connection
node test-firebase.cjs

# Test Telegram bot
node test-telegram.cjs

# Test Gemini AI
node test-gemini.cjs

# Test complete system
node test-complete-system.cjs
```

## 🚀 **Run System**

```bash
# Start AuraOS AI System
node run.cjs
```

## 📱 **Telegram Commands**

Once running, use these commands in Telegram:
- `/test` - Test bot
- `/status` - System status
- `/help` - Show commands
- `/build frontend` - Build frontend
- `/build backend` - Build backend

## 🔍 **Monitoring**

- **Firebase Console**: Check Firestore data
- **Telegram**: Receive notifications
- **Terminal**: View system logs

## 🎉 **Success Indicators**

✅ All tests pass
✅ Telegram bot responds
✅ Firebase connection works
✅ Gemini AI responds
✅ System runs without errors
✅ Notifications sent to Telegram

**Ready to configure your credentials!** 🚀
