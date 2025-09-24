#!/bin/bash

echo "🎬 بدء تشغيل Demo نظام A2A..."

# إنشاء ملفات البيئة
echo "⚙️ إنشاء ملفات البيئة..."

# Gateway
cat > gateway/.env << EOF
PORT=3001
NODE_ENV=development
JWT_SECRET=demo_jwt_secret_key
JWT_EXPIRES_IN=24h
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
TELEGRAM_BOT_TOKEN=demo_telegram_token
AUTOPILOT_API_KEY=demo_autopilot_key
EXTERNAL_APP_API_KEY=demo_external_app_key
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
LOG_LEVEL=info
LOG_FILE=logs/gateway.log
EOF

# Autopilot Service
cat > autopilot-service/.env << EOF
PORT=3002
NODE_ENV=development
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
AUTOPILOT_API_URL=http://localhost:3000
AUTOPILOT_API_KEY=demo_autopilot_key
LOG_LEVEL=info
EOF

# Telegram Bot
cat > telegram-bot/.env << EOF
PORT=3003
NODE_ENV=development
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
TELEGRAM_BOT_TOKEN=demo_telegram_token
LOG_LEVEL=info
EOF

echo "✅ تم إنشاء ملفات البيئة"

# تثبيت التبعيات
echo "📦 تثبيت التبعيات..."

cd gateway && npm install --silent
cd ../autopilot-service && npm install --silent
cd ../telegram-bot && npm install --silent
cd ..

echo "✅ تم تثبيت التبعيات"

# إنشاء مجلدات السجلات
mkdir -p gateway/logs autopilot-service/logs telegram-bot/logs

echo "🚀 بدء تشغيل الخدمات..."

# تشغيل Redis (إذا كان متاحاً)
if command -v redis-server &> /dev/null; then
    echo "📡 تشغيل Redis..."
    redis-server --daemonize yes --port 6379
    sleep 2
else
    echo "⚠️ Redis غير مثبت - سيتم استخدام Docker Compose"
fi

# تشغيل الخدمات في الخلفية
echo "🌐 تشغيل API Gateway..."
cd gateway && npm run dev > ../logs/gateway.log 2>&1 &
GATEWAY_PID=$!

echo "🤖 تشغيل Autopilot Service..."
cd ../autopilot-service && npm run dev > ../logs/autopilot.log 2>&1 &
AUTOPILOT_PID=$!

echo "📱 تشغيل Telegram Bot..."
cd ../telegram-bot && npm run dev > ../logs/telegram.log 2>&1 &
TELEGRAM_PID=$!

cd ..

# انتظار تشغيل الخدمات
echo "⏳ انتظار تشغيل الخدمات..."
sleep 10

# اختبار النظام
echo "🧪 اختبار النظام..."

# اختبار Gateway
echo "📡 اختبار API Gateway..."
curl -s http://localhost:3001/api/health | jq . || echo "❌ Gateway غير متاح"

# اختبار Autopilot
echo "🤖 اختبار Autopilot Service..."
curl -s http://localhost:3002/health | jq . || echo "❌ Autopilot غير متاح"

# اختبار Telegram Bot
echo "📱 اختبار Telegram Bot..."
curl -s http://localhost:3003/health | jq . || echo "❌ Telegram Bot غير متاح"

# Demo Workflow
echo "🎬 تشغيل Demo Workflow..."

# تسجيل الدخول
echo "🔐 تسجيل الدخول..."
AUTH_RESPONSE=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}')

TOKEN=$(echo $AUTH_RESPONSE | jq -r '.token')
echo "✅ تم تسجيل الدخول - Token: ${TOKEN:0:20}..."

# إرسال رسالة عبر Gateway
echo "📨 إرسال رسالة عبر Gateway..."
MESSAGE_RESPONSE=$(curl -s -X POST http://localhost:3001/api/messages/publish \
  -H "Content-Type: application/json" \
  -H "X-API-Key: demo_external_app_key" \
  -d '{
    "source": "demo-app",
    "type": "task-execution",
    "payload": {
      "taskId": "demo-task-001",
      "taskType": "notification",
      "parameters": {
        "message": "Hello from A2A Demo!",
        "target": "telegram"
      }
    },
    "correlation_id": "demo-correlation-001"
  }')

echo "✅ تم إرسال الرسالة: $(echo $MESSAGE_RESPONSE | jq -r '.eventId')"

# إرسال رسالة Telegram
echo "📱 إرسال رسالة Telegram..."
TELEGRAM_RESPONSE=$(curl -s -X POST http://localhost:3001/api/messages/publish \
  -H "Content-Type: application/json" \
  -H "X-API-Key: demo_external_app_key" \
  -d '{
    "source": "demo-app",
    "type": "send-message",
    "payload": {
      "chatId": "123456789",
      "message": "🎉 Demo A2A System is working!",
      "messageType": "text"
    },
    "correlation_id": "demo-telegram-001"
  }')

echo "✅ تم إرسال رسالة Telegram: $(echo $TELEGRAM_RESPONSE | jq -r '.eventId')"

# عرض السجلات
echo "📊 عرض السجلات..."
echo "=== Gateway Logs ==="
tail -5 logs/gateway.log

echo "=== Autopilot Logs ==="
tail -5 logs/autopilot.log

echo "=== Telegram Bot Logs ==="
tail -5 logs/telegram.log

echo ""
echo "🎉 Demo مكتمل!"
echo "📊 الخدمات تعمل على:"
echo "   - API Gateway: http://localhost:3001"
echo "   - Autopilot Service: http://localhost:3002"
echo "   - Telegram Bot: http://localhost:3003"
echo ""
echo "🛑 لإيقاف الخدمات:"
echo "   kill $GATEWAY_PID $AUTOPILOT_PID $TELEGRAM_PID"
echo ""
echo "📁 السجلات متاحة في: logs/"
echo "🔍 لمراقبة السجلات: tail -f logs/*.log"
