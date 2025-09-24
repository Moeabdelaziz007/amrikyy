# 🚀 AuraOS A2A System - نظام التكامل بين التطبيقات

## 🎯 نظرة عامة

نظام A2A (Application-to-Application) هو نظام تكامل شامل ومتقدم يربط بين التطبيقات المحلية وخدمة Autopilot وبوت Telegram. يوفر النظام بوابة API موحدة ووسيط رسائل لضمان التواصل السلس والآمن بين جميع المكونات.

## 🏗️ المعمارية

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   التطبيقات      │    │   API Gateway   │    │  Message Broker │
│   الخارجية       │◄──►│   (Express)     │◄──►│   (Redis)       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │                        │
                                ▼                        ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │   Autopilot     │    │   Telegram     │
                       │   Service       │    │   Bot Service  │
                       └─────────────────┘    └─────────────────┘
```

## 📁 هيكل المشروع

```
AuraOS/
├── gateway/                 # API Gateway الرئيسي
│   ├── src/
│   │   ├── routes/         # مسارات API
│   │   ├── services/       # الخدمات الأساسية
│   │   ├── utils/          # الأدوات المساعدة
│   │   └── index.ts        # نقطة البداية
│   ├── package.json
│   ├── tsconfig.json
│   ├── Dockerfile
│   └── env.example
├── autopilot-service/       # خدمة تكامل Autopilot
│   ├── src/
│   │   ├── handlers/       # معالجات الأحداث
│   │   ├── services/        # خدمات Redis والـ Broker
│   │   ├── utils/          # أدوات مساعدة
│   │   └── index.ts        # نقطة البداية
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
├── telegram-bot/           # خدمة بوت Telegram
│   ├── src/
│   │   ├── handlers/       # معالجات الرسائل
│   │   ├── services/       # خدمات Redis والـ Broker
│   │   ├── utils/          # أدوات مساعدة
│   │   └── index.ts        # نقطة البداية
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
├── sdk/
│   ├── node/               # SDK لـ Node.js
│   └── python/            # SDK لـ Python
├── tests/                 # الاختبارات الشاملة
├── docs/                  # الوثائق التقنية
├── docker-compose.dev.yml # إعداد التطوير
├── demo-a2a-workflow.sh   # سكريبت Demo
└── README-A2A-SYSTEM.md   # هذا الملف
```

## 🚀 البدء السريع

### الطريقة الأولى: تشغيل مباشر

```bash
# تشغيل Demo كامل
./demo-a2a-workflow.sh

# أو تشغيل يدوي
cd gateway && npm install && npm run dev
cd ../autopilot-service && npm install && npm run dev
cd ../telegram-bot && npm install && npm run dev
```

### الطريقة الثانية: Docker Compose

```bash
# تشغيل النظام كاملاً
docker compose -f docker-compose.dev.yml up --build

# إيقاف النظام
docker compose -f docker-compose.dev.yml down
```

### الطريقة الثالثة: تشغيل منفصل

```bash
# تشغيل Redis
redis-server --daemonize yes

# تشغيل Gateway
cd gateway && npm run dev

# تشغيل Autopilot Service
cd autopilot-service && npm run dev

# تشغيل Telegram Bot
cd telegram-bot && npm run dev
```

## 📡 API Endpoints

### API Gateway (Port 3001)

#### المصادقة
- `POST /api/auth/login` - تسجيل الدخول
- `GET /api/auth/verify` - التحقق من الرمز المميز

#### الرسائل
- `POST /api/messages/publish` - نشر رسالة
- `GET /api/messages/history` - تاريخ الرسائل

#### Webhooks
- `POST /api/webhooks/incoming` - webhook عام
- `POST /api/webhooks/telegram` - webhook Telegram

#### المراقبة
- `GET /api/health` - فحص الصحة
- `GET /api/metrics` - المقاييس

### Autopilot Service (Port 3002)

- `GET /health` - فحص الصحة
- `GET /api/status` - حالة الخدمة

### Telegram Bot Service (Port 3003)

- `GET /health` - فحص الصحة
- `POST /webhook` - إرسال رسالة عبر webhook

## 🔧 الاستخدام

### Node.js SDK

```javascript
import { A2AClient } from '@auraos/a2a-sdk-node';

const client = new A2AClient({
  gatewayUrl: 'http://localhost:3001',
  apiKey: 'your_api_key_here'
});

// تسجيل الدخول
const authResult = await client.login('username', 'password');

// إرسال رسالة إلى Autopilot
const taskResult = await client.publishMessage('autopilot.task', {
  type: 'task-execution',
  target: 'autopilot',
  payload: {
    taskId: 'task-001',
    taskType: 'notification',
    parameters: { message: 'Hello Autopilot!' }
  }
});

// إرسال رسالة إلى Telegram
const telegramResult = await client.publishMessage('telegram.message', {
  type: 'send-message',
  target: 'telegram',
  payload: {
    chatId: '123456789',
    message: 'Hello from A2A System!',
    messageType: 'text'
  }
});
```

### Python SDK

```python
from a2a_client import A2AClient, A2AConfig

config = A2AConfig(
    gateway_url="http://localhost:3001",
    api_key="your_api_key_here"
)

async with A2AClient(config) as client:
    # تسجيل الدخول
    auth_result = await client.login('username', 'password')
    
    # إرسال رسالة إلى Autopilot
    task_result = await client.publish_message(
        topic='autopilot.task',
        message_type='task-execution',
        target='autopilot',
        payload={
            'taskId': 'task-001',
            'taskType': 'notification',
            'parameters': {'message': 'Hello Autopilot!'}
        }
    )
    
    # إرسال رسالة إلى Telegram
    telegram_result = await client.publish_message(
        topic='telegram.message',
        message_type='send-message',
        target='telegram',
        payload={
            'chatId': '123456789',
            'message': 'Hello from A2A System!',
            'messageType': 'text'
        }
    )
```

## 🔄 Workflow الكامل

### 1. إرسال رسالة من التطبيق الخارجي

```bash
curl -X POST http://localhost:3001/api/messages/publish \
  -H "Content-Type: application/json" \
  -H "X-API-Key: demo_external_app_key" \
  -d '{
    "source": "my-app",
    "type": "task-execution",
    "payload": {
      "taskId": "task-001",
      "taskType": "notification",
      "parameters": {
        "message": "Hello A2A System!",
        "target": "telegram"
      }
    }
  }'
```

### 2. معالجة الرسالة في Autopilot Service

- استقبال الرسالة من Redis Streams
- معالجة المهمة
- إرسال النتيجة إلى Telegram Bot

### 3. إرسال الرسالة عبر Telegram Bot

- استقبال النتيجة من Redis Streams
- إرسال الرسالة إلى Telegram
- تأكيد الإرسال

## 🔒 الأمان

- **JWT Authentication** - مصادقة آمنة باستخدام الرموز المميزة
- **API Key Authentication** - مصادقة للتطبيقات الخارجية
- **Rate Limiting** - تحديد معدل الطلبات (100 طلب/15 دقيقة)
- **Helmet** - حماية HTTP headers
- **CORS** - التحكم في الوصول عبر المصادر
- **Input Validation** - التحقق من صحة البيانات المدخلة

## 📊 المراقبة

- **Health Checks** - فحص صحة جميع الخدمات
- **Metrics** - مقاييس الأداء باستخدام Prometheus
- **Logging** - تسجيل شامل باستخدام Winston
- **Error Handling** - معالجة شاملة للأخطاء
- **Redis Monitoring** - مراقبة حالة Redis Streams

## 🧪 الاختبار

```bash
# اختبار النظام الكامل
./test-a2a-system.sh

# اختبار Gateway
cd gateway && npm test

# اختبار Autopilot Service
cd autopilot-service && npm test

# اختبار Telegram Bot
cd telegram-bot && npm test
```

## 🐳 Docker

```bash
# تشغيل النظام باستخدام Docker Compose
docker compose -f docker-compose.dev.yml up --build

# إيقاف النظام
docker compose -f docker-compose.dev.yml down

# عرض السجلات
docker compose -f docker-compose.dev.yml logs -f

# إعادة بناء خدمة معينة
docker compose -f docker-compose.dev.yml up --build api-gateway
```

## 📈 الأداء

- **Redis Streams** - معالجة الرسائل بسرعة عالية
- **Connection Pooling** - إدارة فعالة للاتصالات
- **Compression** - ضغط الاستجابات
- **Caching** - تخزين مؤقت للبيانات
- **Health Checks** - مراقبة الأداء المستمرة

## 🔧 التطوير

### إضافة خدمة جديدة

1. إنشاء مجلد الخدمة في `services/`
2. إضافة المسارات في `routes/`
3. تسجيل الخدمة في `index.ts`
4. إضافة الاختبارات
5. تحديث Docker Compose

### إضافة SDK جديد

1. إنشاء مجلد اللغة في `sdk/`
2. تنفيذ `A2AClient` class
3. إضافة أمثلة الاستخدام
4. كتابة الوثائق

## 📚 الوثائق

- [API Documentation](docs/openapi.yaml) - مواصفات API الكاملة
- [SDK Examples](sdk/) - أمثلة استخدام SDKs
- [Integration Tests](tests/) - اختبارات التكامل
- [Docker Guide](docker-compose.dev.yml) - دليل Docker

## 🎬 Demo

```bash
# تشغيل Demo كامل
./demo-a2a-workflow.sh

# Demo يتضمن:
# 1. تشغيل جميع الخدمات
# 2. اختبار الاتصال
# 3. إرسال رسائل تجريبية
# 4. عرض النتائج والسجلات
```

## 🤝 المساهمة

1. Fork المشروع
2. إنشاء فرع للميزة الجديدة (`git checkout -b feature/amazing-feature`)
3. Commit التغييرات (`git commit -m 'Add amazing feature'`)
4. Push إلى الفرع (`git push origin feature/amazing-feature`)
5. إنشاء Pull Request

## 📄 الترخيص

هذا المشروع مرخص تحت رخصة MIT - راجع ملف [LICENSE](LICENSE) للتفاصيل.

## 🆘 الدعم

للحصول على المساعدة:
- إنشاء Issue في GitHub
- مراجعة الوثائق في `/docs/`
- التواصل مع فريق التطوير

## 🎯 الميزات المستقبلية

- [ ] دعم WebSocket للاتصال المباشر
- [ ] تكامل مع خدمات AI إضافية
- [ ] لوحة تحكم ويب للمراقبة
- [ ] دعم المزيد من منصات الرسائل
- [ ] تحليلات متقدمة للأداء
- [ ] دعم التكامل مع Kubernetes

---

**تم تطوير هذا النظام بواسطة فريق AuraOS** 🚀

**آخر تحديث:** سبتمبر 2024