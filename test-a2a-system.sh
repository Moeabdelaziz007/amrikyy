#!/bin/bash

echo "🚀 اختبار نظام A2A..."

# اختبار Gateway
echo "📡 اختبار Gateway..."
curl -s http://localhost:3001/api/health | jq .

# اختبار المصادقة
echo "🔐 اختبار المصادقة..."
curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' | jq .

# اختبار نشر رسالة
echo "📨 اختبار نشر رسالة..."
curl -s -X POST http://localhost:3001/api/messages/publish \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_external_app_api_key_here" \
  -d '{
    "source": "test-app",
    "type": "notification",
    "payload": {"message": "Hello A2A System!"}
  }' | jq .

echo "✅ تم الانتهاء من الاختبارات!"