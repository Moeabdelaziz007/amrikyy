# 🤖 Telegram Bot Setup Guide

## الخطوة 1: إنشاء Telegram Bot

1. اذهب إلى Telegram وابحث عن @BotFather
2. أرسل /newbot
3. اختر اسم للبوت: AuraOS AI Assistant
4. اختر username: auraos_ai_bot (أو أي اسم متاح)
5. ستحصل على التوكن بهذا الشكل:

```
1234567890:ABCdefGHIjklMNOpqrsTUVwxyz123456789
```

## الخطوة 2: الحصول على Chat ID

1. ابحث عن @RawDataBot في Telegram
2. أرسل /start
3. ستحصل على رسالة تحتوي على Chat ID مثل:

```
123456789
```

## الخطوة 3: تحديث ملف .env

افتح ملف .env وحدث هذه الأسطر:

```bash
# استبدل your_bot_token_here بالتوكن الفعلي
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz123456789

# استبدل your_chat_id_here بالـ Chat ID الفعلي
TELEGRAM_ADMIN_CHAT_ID=123456789
```

## الخطوة 4: اختبار البوت

```bash
# اختبر البوت
node test-telegram.cjs

# إذا نجح الاختبار، ستحصل على رسالة في Telegram
```

## مثال على ملف .env محدث

```bash
# 🤖 Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz123456789
TELEGRAM_ADMIN_CHAT_ID=123456789
```
