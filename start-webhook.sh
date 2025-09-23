#!/bin/bash
# AuraOS Webhook Bot Starter
# تشغيل البوت مع Webhook

echo "🚀 بدء تشغيل AuraOS Webhook Bot..."

# التحقق من وجود ملف .env
if [ ! -f .env ]; then
    echo "❌ ملف .env غير موجود"
    exit 1
fi

# تشغيل البوت
node start-webhook-bot.js

echo "✅ تم تشغيل البوت"
