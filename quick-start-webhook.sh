#!/bin/bash
# AuraOS Webhook Bot Quick Start
# تشغيل سريع للبوت مع Webhook

echo "🚀 بدء تشغيل AuraOS Webhook Bot..."

# التحقق من وجود ملف .env
if [ ! -f .env ]; then
    echo "❌ ملف .env غير موجود"
    echo "💡 يرجى إنشاء ملف .env مع TELEGRAM_BOT_TOKEN"
    exit 1
fi

# التحقق من وجود TELEGRAM_BOT_TOKEN
if ! grep -q "TELEGRAM_BOT_TOKEN" .env; then
    echo "❌ TELEGRAM_BOT_TOKEN غير موجود في ملف .env"
    exit 1
fi

echo "✅ تم التحقق من الإعدادات"

# إعداد Webhook
echo "🔧 إعداد Webhook..."
node setup-webhook.js

if [ $? -eq 0 ]; then
    echo "✅ تم إعداد Webhook بنجاح"
else
    echo "❌ فشل في إعداد Webhook"
    exit 1
fi

# اختبار النظام
echo "🧪 اختبار النظام..."
node test-webhook.js

if [ $? -eq 0 ]; then
    echo "✅ تم اختبار النظام بنجاح"
else
    echo "⚠️ تم اختبار النظام مع بعض التحذيرات"
fi

# تشغيل البوت
echo "🤖 تشغيل البوت..."
echo "⏹️ اضغط Ctrl+C لإيقاف البوت"
node start-webhook-bot.js

echo "✅ تم إيقاف البوت"
