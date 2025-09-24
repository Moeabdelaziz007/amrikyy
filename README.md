# 🚀 Amrikyy AIOS System

Advanced AI-Powered Operating System with intelligent agents, automation, and modern design.

## 📋 Overview

Amrikyy AIOS System is a comprehensive solution that provides:

- **Modern Desktop Interface** with glassmorphism and 3D effects
- **AI-Powered Applications** with intelligent automation
- **Advanced Wallpaper System** with dynamic animations
- **Telegram Integration** for remote control
- **Autopilot Dashboard** for task automation
- **Theme Customization** with multiple visual styles
- **Real-time Monitoring** and system health checks

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Desktop Apps  │    │   Telegram Bot   │    │   Autopilot     │
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

## 🚀 Quick Start

### Requirements

- Docker & Docker Compose
- Node.js 18+ (for local development)
- Git

### Installation

1. **Clone the project**
```bash
git clone https://github.com/amrikyy/aios-system.git
cd AuraOS
```

2. **Start the system**
```bash
npm start
# or
./start-a2a-system.sh
```

3. **Check status**
```bash
npm run status
npm run health
```

## 📚 Available Services

### Frontend (Port 5173)
- **Main Interface**: http://localhost:5173
- **Live Demo**: https://aios-97581.web.app

### API Gateway (Port 3001)
- **Main**: http://localhost:3001
- **WebSocket**: ws://localhost:3004/ws/a2a
- **Documentation**: http://localhost:3001/api/docs

### Autopilot Service (Port 3002)
- **Main**: http://localhost:3002
- **Health**: http://localhost:3002/health

### Telegram Bot (Port 3003)
- **Main**: http://localhost:3003
- **Health**: http://localhost:3003/health

### System Monitoring
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

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/amrikyy/aios-system/issues)
- **Discussions**: [GitHub Discussions](https://github.com/amrikyy/aios-system/discussions)
- **Email**: support@amrikyy-aios.com

## 🔄 Updates

### Version 1.0.0
- Initial system launch
- Modern desktop interface with glassmorphism
- AI-powered applications
- Advanced wallpaper system
- Telegram integration
- Autopilot dashboard

### Upcoming Versions
- Enhanced AI capabilities
- More visual themes
- Performance improvements
- Mobile app support
- Cloud synchronization

---

**Developed by the Amrikyy AIOS Team** 🚀