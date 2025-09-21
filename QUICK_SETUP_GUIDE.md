# 🚀 AuraOS AI System - Quick Setup Guide

## 📋 **الخطوات السريعة**

### **1. إعداد Firebase** 🔥

```bash
# 1. اذهب إلى Firebase Console
https://console.firebase.google.com/

# 2. أنشئ مشروع جديد
Project Name: auraos-ai-system
Enable Google Analytics: Yes

# 3. فعل Firestore
Firestore Database → Create Database → Start in test mode

# 4. نزل service-account-key.json
Project Settings → Service Accounts → Generate new private key

# 5. ضع الملف في مجلد المشروع
cp ~/Downloads/service-account-key.json ./
```

### **2. إعداد Telegram Bot** 🤖

```bash
# 1. اذهب إلى BotFather
https://t.me/botfather

# 2. أنشئ بوت جديد
/newbot
Bot Name: AuraOS AI Assistant
Username: auraos_ai_bot

# 3. احفظ التوكن
Token: 123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11

# 4. احصل على Chat ID
Message @RawDataBot → /start → Copy Chat ID
```

### **3. إعداد Google AI** 🧠

```bash
# 1. اذهب إلى Google AI Studio
https://aistudio.google.com/app/apikey

# 2. أنشئ API Key جديد
Create API Key → Copy Key

# 3. احفظ المفتاح
API Key: AIzaSyC...
```

### **4. تحديث ملف .env** ⚙️

```bash
# افتح ملف .env وحدث القيم:

FIREBASE_PROJECT_ID=auraos-ai-system
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_ACTUAL_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@auraos-ai-system.iam.gserviceaccount.com

TELEGRAM_BOT_TOKEN=123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11
TELEGRAM_ADMIN_CHAT_ID=123456789

GOOGLE_AI_API_KEY=AIzaSyC...
```

### **5. اختبار النظام** 🧪

```bash
# اختبار الإعداد
node test-setup.cjs

# اختبار Firebase
node test-firebase.cjs

# اختبار Telegram
node test-telegram.cjs

# اختبار Gemini AI
node test-gemini.cjs

# اختبار النظام الكامل
node test-complete-system.cjs
```

### **6. تشغيل النظام** 🚀

```bash
# تشغيل AuraOS AI System
node run.cjs
```

## 🎯 **أوامر Telegram**

بعد تشغيل النظام، يمكنك استخدام هذه الأوامر في Telegram:

- `/test` - اختبار البوت
- `/status` - حالة النظام
- `/help` - عرض المساعدة
- `/build frontend` - تشغيل بناء Frontend
- `/build backend` - تشغيل بناء Backend
- `/build full` - تشغيل بناء كامل

## 🔍 **مراقبة النظام**

### **Firebase Console**
- تحقق من Firestore للبيانات والسجلات
- راقب حالة النظام
- عرض سجلات الأخطاء

### **Telegram**
- استقبال إشعارات الأخطاء
- تحديثات حالة البناء
- مراقبة صحة النظام

## 🚨 **حل المشاكل**

### **مشاكل Firebase**
- تحقق من Project ID
- تأكد من صحة Service Account Key
- تأكد من تفعيل Firestore

### **مشاكل Telegram**
- تحقق من Bot Token
- تأكد من بدء البوت بـ /start
- تحقق من صحة Chat ID

### **مشاكل Gemini AI**
- تحقق من API Key
- تأكد من صلاحيات API
- تحقق من الاتصال بالإنترنت

## 🎉 **النجاح!**

إذا نجحت جميع الاختبارات، ستحصل على:

✅ **نظام مراقبة مستمر** للأخطاء والبناء
✅ **ذكاء اصطناعي** يحلل ويصلح المشاكل
✅ **إشعارات تليجرام** فورية
✅ **نظام إصلاح ذاتي** متقدم
✅ **دعم اللغة العربية** الكامل

**AuraOS AI System جاهز للعمل!** 🚀
