# 🔥 Firebase Studio Setup Guide

## الخطوة 1: إعداد Firebase Project

### 1.1 إنشاء Firebase Project
```bash
# اذهب إلى Firebase Console
https://console.firebase.google.com/

# أنشئ مشروع جديد:
Project Name: auraos-ai-system
Enable Google Analytics: Yes
```

### 1.2 تفعيل Firestore Database
```bash
# في Firebase Console:
1. اذهب إلى Firestore Database
2. اضغط "Create Database"
3. اختر "Start in test mode"
4. اختر موقع البيانات (us-central1)
```

### 1.2 تفعيل Authentication
```bash
# في Firebase Console:
1. اذهب إلى Authentication
2. اضغط "Get Started"
3. اختر "Sign-in method"
4. فعل "Email/Password"
```

## الخطوة 2: تحميل Service Account Key

### 2.1 الحصول على Service Account Key
```bash
# في Firebase Console:
1. اذهب إلى Project Settings (⚙️)
2. اختر تبويب "Service accounts"
3. اضغط "Generate new private key"
4. اضغط "Generate key"
5. سيتم تحميل ملف JSON
```

### 2.2 تحديث الملف
```bash
# 1. احفظ الملف كـ: service-account-key.json
# 2. ضعه في مجلد المشروع
# 3. تأكد من أن الملف يحتوي على:
```

```json
{
  "type": "service_account",
  "project_id": "your-actual-project-id",
  "private_key_id": "actual-key-id",
  "private_key": "-----BEGIN PRIVATE KEY-----\nACTUAL_PRIVATE_KEY\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com",
  "client_id": "actual-client-id",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40your-project.iam.gserviceaccount.com"
}
```

## الخطوة 3: تحديث ملف .env

### 3.1 استخراج المعلومات من service-account-key.json
```bash
# من الملف JSON، احصل على:
project_id: "your-actual-project-id"
private_key: "-----BEGIN PRIVATE KEY-----\nACTUAL_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"
client_email: "firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com"
```

### 3.2 تحديث .env
```bash
# افتح ملف .env وحدث:
FIREBASE_PROJECT_ID=your-actual-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nACTUAL_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
```

## الخطوة 4: اختبار Firebase

```bash
# اختبر الاتصال
node test-firebase.cjs

# إذا نجح، ستحصل على:
# ✅ Firebase Admin initialized successfully
# ✅ Firebase Admin connected successfully
```

## الخطوة 5: إعداد Telegram Bot

### 5.1 إنشاء Bot
```bash
# 1. اذهب إلى Telegram وابحث عن @BotFather
# 2. أرسل /newbot
# 3. اختر اسم: AuraOS AI Assistant
# 4. اختر username: auraos_ai_bot
# 5. احفظ التوكن
```

### 5.2 الحصول على Chat ID
```bash
# 1. ابحث عن @RawDataBot
# 2. أرسل /start
# 3. احفظ Chat ID
```

### 5.3 تحديث .env
```bash
TELEGRAM_BOT_TOKEN=your-actual-bot-token
TELEGRAM_ADMIN_CHAT_ID=your-actual-chat-id
```

## الخطوة 6: اختبار النظام الكامل

```bash
# اختبار جميع المكونات
node test-complete-system.cjs

# تشغيل النظام
node run.cjs
```
