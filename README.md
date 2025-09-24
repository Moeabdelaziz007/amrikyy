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

2. **تشغيل النظام**
```bash
npm start
# أو
./start-a2a-system.sh
```

3. **التحقق من الحالة**
```bash
npm run status
npm run health
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
- **Prometheus**: http://localhost:9090
- **RabbitMQ Management**: http://localhost:15672 (admin/admin123)

## 🔧 التطوير

### إعداد بيئة التطوير

1. **تثبيت التبعيات**
```bash
npm install
```

2. **تشغيل الخدمات المحلية**
```bash
npm run dev
```

3. **مراقبة السجلات**
```bash
npm run logs
```

### اختبار النظام

1. **اختبار API Gateway**
```bash
npm run test:gateway
```

2. **اختبار التكامل**
```bash
npm run test:integration
```

3. **اختبار شامل**
```bash
npm test
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
npm run test:gateway

# اختبارات التكامل
npm run test:integration

# اختبارات الأداء
npm run test:performance
```

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

- **Issues**: [GitHub Issues](https://github.com/auraos/a2a-system/issues)
- **Discussions**: [GitHub Discussions](https://github.com/auraos/a2a-system/discussions)
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