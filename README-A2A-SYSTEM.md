# 🚀 AuraOS A2A System - نظام التكامل بين التطبيقات

## نظرة عامة

نظام A2A (Application-to-Application) هو نظام تكامل شامل يربط بين التطبيقات المحلية وخدمة Autopilot وبوت Telegram. يوفر النظام بوابة API موحدة ووسيط رسائل لضمان التواصل السلس والآمن بين جميع المكونات.

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
├── gateway/                 # API Gateway
│   ├── src/
│   │   ├── routes/         # مسارات API
│   │   ├── services/       # الخدمات الأساسية
│   │   ├── utils/          # الأدوات المساعدة
│   │   └── index.ts        # نقطة البداية
│   ├── package.json
│   ├── tsconfig.json
│   └── env.example
├── sdk/
│   ├── node/               # SDK لـ Node.js
│   └── python/            # SDK لـ Python
├── tests/                 # الاختبارات
├── docs/                  # الوثائق
├── docker-compose.dev.yml
└── README-A2A-SYSTEM.md
```

## 🚀 البدء السريع

### 1. تثبيت التبعيات

```bash
# تثبيت تبعيات Gateway
cd gateway
npm install

# تثبيت تبعيات Python SDK
cd ../sdk/python
pip install -r requirements.txt
```

### 2. إعداد المتغيرات البيئية

```bash
# نسخ ملف البيئة
cd gateway
cp env.example .env

# تعديل القيم حسب الحاجة
nano .env
```

### 3. تشغيل النظام

```bash
# تشغيل Gateway
cd gateway
npm run dev

# أو استخدام Docker Compose
docker compose -f docker-compose.dev.yml up --build
```

## 📡 API Endpoints

### المصادقة
- `POST /api/auth/login` - تسجيل الدخول
- `GET /api/auth/verify` - التحقق من الرمز المميز

### الرسائل
- `POST /api/messages/publish` - نشر رسالة
- `GET /api/messages/history` - تاريخ الرسائل

### Webhooks
- `POST /api/webhooks/incoming` - webhook عام
- `POST /api/webhooks/telegram` - webhook Telegram

### المراقبة
- `GET /api/health` - فحص الصحة
- `GET /api/metrics` - المقاييس

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

// إرسال رسالة
const messageResult = await client.publishMessage('test.topic', {
  type: 'notification',
  target: 'telegram',
  payload: { message: 'Hello World!' }
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
    
    # إرسال رسالة
    message_result = await client.publish_message(
        topic='test.topic',
        message_type='notification',
        target='telegram',
        payload={'message': 'Hello World!'}
    )
```

## 🔒 الأمان

- **JWT Authentication** - مصادقة آمنة باستخدام الرموز المميزة
- **API Key Authentication** - مصادقة للتطبيقات الخارجية
- **Rate Limiting** - تحديد معدل الطلبات
- **Helmet** - حماية HTTP headers
- **CORS** - التحكم في الوصول عبر المصادر

## 📊 المراقبة

- **Health Checks** - فحص صحة الخدمات
- **Metrics** - مقاييس الأداء باستخدام Prometheus
- **Logging** - تسجيل شامل باستخدام Winston
- **Error Handling** - معالجة شاملة للأخطاء

## 🧪 الاختبار

```bash
# تشغيل الاختبارات
cd gateway
npm test

# تشغيل اختبارات التكامل
cd ../tests
npm test
```

## 🐳 Docker

```bash
# تشغيل النظام باستخدام Docker Compose
docker compose -f docker-compose.dev.yml up --build

# إيقاف النظام
docker compose -f docker-compose.dev.yml down
```

## 📈 الأداء

- **Redis Streams** - معالجة الرسائل بسرعة عالية
- **Connection Pooling** - إدارة فعالة للاتصالات
- **Compression** - ضغط الاستجابات
- **Caching** - تخزين مؤقت للبيانات

## 🔄 التطوير

### إضافة خدمة جديدة

1. إنشاء مجلد الخدمة في `services/`
2. إضافة المسارات في `routes/`
3. تسجيل الخدمة في `index.ts`
4. إضافة الاختبارات

### إضافة SDK جديد

1. إنشاء مجلد اللغة في `sdk/`
2. تنفيذ `A2AClient` class
3. إضافة أمثلة الاستخدام
4. كتابة الوثائق

## 📚 الوثائق

- [API Documentation](docs/openapi.yaml)
- [SDK Examples](sdk/)
- [Integration Tests](tests/)
- [Deployment Guide](README-A2A-SYSTEM.md)

## 🤝 المساهمة

1. Fork المشروع
2. إنشاء فرع للميزة الجديدة
3. Commit التغييرات
4. Push إلى الفرع
5. إنشاء Pull Request

## 📄 الترخيص

هذا المشروع مرخص تحت رخصة MIT - راجع ملف [LICENSE](LICENSE) للتفاصيل.

## 🆘 الدعم

للحصول على المساعدة:
- إنشاء Issue في GitHub
- مراجعة الوثائق
- التواصل مع فريق التطوير

---

**تم تطوير هذا النظام بواسطة فريق AuraOS** 🚀