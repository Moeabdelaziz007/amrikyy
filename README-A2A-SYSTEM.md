# 🚀 AuraOS A2A Integration System

نظام تكامل شامل للتطبيقات (Application-to-Application) يربط بين التطبيقات المحلية ونظام الأوتوبيلوت وبوت تيليجرام.

## 📋 نظرة عامة

نظام A2A هو حل متكامل يوفر:

- **API Gateway** موحد لإدارة جميع الاتصالات
- **Message Broker** للتواصل غير المتزامن
- **تكامل الأوتوبيلوت** لإدارة المهام التلقائية
- **تكامل تيليجرام** للتفاعل مع المستخدمين
- **نظام مراقبة شامل** مع Prometheus و Grafana
- **أمان متقدم** مع JWT و Rate Limiting

## 🏗️ البنية المعمارية

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Applications  │    │   Telegram Bot   │    │   Autopilot     │
│                 │    │                 │    │                 │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌─────────────┴─────────────┐
                    │      API Gateway         │
                    │   (Express + TypeScript)  │
                    └─────────────┬─────────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    │     Message Broker        │
                    │    (RabbitMQ + Redis)     │
                    └───────────────────────────┘
```

## 🚀 البدء السريع

### المتطلبات

- Docker & Docker Compose
- Node.js 18+ (للتطوير المحلي)
- Git

### التثبيت

1. **استنساخ المشروع**
```bash
git clone <repository-url>
cd AuraOS
```

2. **إعداد متغيرات البيئة**
```bash
cp gateway/env.example gateway/.env
cp .env.example .env
```

3. **تحديث متغيرات البيئة**
```bash
# في ملف .env
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_WEBHOOK_URL=https://your-domain.com/api/a2a/webhook/telegram
TEST_API_KEY=your_test_api_key
```

4. **تشغيل النظام**
```bash
docker-compose -f docker-compose.dev.yml up -d
```

5. **التحقق من الحالة**
```bash
docker-compose -f docker-compose.dev.yml ps
```

## 📚 الخدمات المتاحة

### API Gateway (Port 3001)
- **الرئيسي**: http://localhost:3001
- **WebSocket**: ws://localhost:3004/ws/a2a
- **الوثائق**: http://localhost:3001/api/docs

### Autopilot Service (Port 3002)
- **الرئيسي**: http://localhost:3002
- **الصحة**: http://localhost:3002/health

### Telegram Bot (Port 3003)
- **الرئيسي**: http://localhost:3003
- **الصحة**: http://localhost:3003/health

### مراقبة النظام
- **Grafana**: http://localhost:3000 (admin/admin123)
- **Prometheus**: http://localhost:3000:9090
- **RabbitMQ Management**: http://localhost:15672 (admin/admin123)

## 🔧 التطوير

### إعداد بيئة التطوير

1. **تثبيت التبعيات**
```bash
cd gateway
npm install

cd ../autopilot
npm install

cd ../telegram_bot
npm install
```

2. **تشغيل الخدمات المحلية**
```bash
# Terminal 1 - API Gateway
cd gateway
npm run dev

# Terminal 2 - Autopilot
cd autopilot
npm run dev

# Terminal 3 - Telegram Bot
cd telegram_bot
npm run dev
```

### اختبار النظام

1. **اختبار API Gateway**
```bash
curl http://localhost:3001/api/health
```

2. **اختبار المصادقة**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"default123"}'
```

3. **اختبار إرسال رسالة**
```bash
curl -X POST http://localhost:3001/api/messages/publish \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "topic": "test.topic",
    "type": "test_message",
    "target": "telegram",
    "payload": {"message": "Hello World!"}
  }'
```

## 📖 واجهات برمجية

### المصادقة

#### تسجيل الدخول
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "default123"
}
```

#### إنشاء مستخدم جديد
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "newuser",
  "email": "user@example.com",
  "password": "password123",
  "role": "user"
}
```

### الرسائل

#### إرسال رسالة
```http
POST /api/messages/publish
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "topic": "telegram.updates",
  "type": "notification",
  "target": "telegram",
  "payload": {
    "message": "Hello from A2A System!",
    "chatId": "123456789"
  },
  "priority": "normal"
}
```

#### الاشتراك في موضوع
```http
POST /api/messages/subscribe
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "topic": "autopilot.events",
  "handler": "https://your-app.com/webhook"
}
```

### Webhooks

#### Telegram Webhook
```http
POST /api/webhooks/telegram
X-Webhook-Signature: sha256=...
Content-Type: application/json

{
  "update_id": 123456,
  "message": {
    "message_id": 1,
    "from": {...},
    "chat": {...},
    "text": "Hello Bot!"
  }
}
```

## 🔒 الأمان

### المصادقة والتفويض

- **JWT Tokens** للمصادقة
- **API Keys** للخدمات الخارجية
- **Role-based Access Control** للتفويض
- **Rate Limiting** للحماية من الإساءة

### تشفير البيانات

- **HTTPS** لجميع الاتصالات
- **Webhook Signatures** للتحقق من صحة البيانات
- **Environment Variables** للمعلومات الحساسة

## 📊 المراقبة والتحليل

### المقاييس المتاحة

- **مقاييس الطلبات**: عدد الطلبات، وقت الاستجابة، معدل الأخطاء
- **مقاييس النظام**: استخدام الذاكرة، CPU، وقت التشغيل
- **مقاييس الرسائل**: عدد الرسائل المرسلة، معدل النجاح
- **مقاييس الصحة**: حالة الخدمات، فحوصات الصحة

### لوحات التحكم

- **Grafana Dashboard**: مراقبة شاملة للنظام
- **Prometheus Metrics**: جمع المقاييس التفصيلية
- **Health Checks**: فحص صحة الخدمات

## 🧪 الاختبار

### تشغيل الاختبارات

```bash
# اختبارات API Gateway
cd gateway
npm test

# اختبارات التكامل
npm run test:integration

# اختبارات الأداء
npm run test:performance
```

### اختبارات Postman

استيراد مجموعة Postman من `tests/postman/A2A-System.postman_collection.json`

## 🚀 النشر

### بيئة الإنتاج

1. **إعداد متغيرات البيئة**
```bash
cp docker-compose.prod.yml docker-compose.yml
# تحديث متغيرات البيئة للإنتاج
```

2. **بناء الصور**
```bash
docker-compose build
```

3. **النشر**
```bash
docker-compose up -d
```

### Kubernetes

```bash
kubectl apply -f k8s/
```

## 📝 التوثيق

- **API Documentation**: http://localhost:3001/api/docs
- **Architecture Guide**: `docs/architecture.md`
- **Deployment Guide**: `docs/deployment.md`
- **Troubleshooting**: `docs/troubleshooting.md`

## 🤝 المساهمة

1. Fork المشروع
2. إنشاء فرع للميزة الجديدة (`git checkout -b feature/amazing-feature`)
3. Commit التغييرات (`git commit -m 'Add amazing feature'`)
4. Push للفرع (`git push origin feature/amazing-feature`)
5. فتح Pull Request

## 📄 الترخيص

هذا المشروع مرخص تحت رخصة MIT - راجع ملف [LICENSE](LICENSE) للتفاصيل.

## 🆘 الدعم

- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-repo/discussions)
- **Email**: support@auraos.com

## 🔄 التحديثات

### الإصدار 1.0.0
- إطلاق النظام الأساسي
- API Gateway مع المصادقة
- تكامل الأوتوبيلوت
- تكامل تيليجرام
- نظام المراقبة

### الإصدارات القادمة
- دعم المزيد من منصات المراسلة
- تحسينات الأداء
- واجهات مستخدم محسنة
- دعم Kubernetes محسن

---

**تم تطوير هذا النظام بواسطة فريق AuraOS** 🚀
