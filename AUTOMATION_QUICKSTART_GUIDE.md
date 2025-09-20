# 🚀 دليل التشغيل السريع - نظام الأتمتة المتقدم

## 📋 المتطلبات الأساسية

### 1. تثبيت المتطلبات
```bash
# تثبيت Node.js (الإصدار 18 أو أحدث)
npm install -g node@18

# تثبيت المتطلبات
npm install express socket.io node-cron uuid firebase
npm install @types/node-cron @types/uuid
```

### 2. إعداد قاعدة البيانات
```bash
# تثبيت PostgreSQL
# Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib

# macOS
brew install postgresql

# Windows
# تحميل من الموقع الرسمي

# إنشاء قاعدة البيانات
createdb auraos_automation
```

### 3. إعداد Firebase
```bash
# تثبيت Firebase CLI
npm install -g firebase-tools

# تسجيل الدخول
firebase login

# تهيئة المشروع
firebase init firestore
```

## ⚙️ إعداد البيئة

### 1. نسخ ملف البيئة
```bash
cp AUTOMATION_ENV_EXAMPLE.txt .env
```

### 2. تحديث متغيرات البيئة
```bash
# تحديث ملف .env بالقيم الصحيحة
FIREBASE_API_KEY=your_actual_api_key
FIREBASE_PROJECT_ID=your_actual_project_id
TELEGRAM_BOT_TOKEN=your_actual_bot_token
TELEGRAM_CHAT_ID=your_actual_chat_id
```

## 🚀 تشغيل النظام

### 1. تشغيل الخادم
```bash
# تشغيل في وضع التطوير
npm run dev

# أو تشغيل مباشر
tsx server/index.ts
```

### 2. تشغيل العميل
```bash
# في terminal منفصل
cd client
npm run dev
```

### 3. الوصول للتطبيق
```
http://localhost:3000
```

## 📊 إنشاء أول Workflow

### 1. إنشاء Service Monitoring
```typescript
import { createSampleServiceMonitoring } from './server/service-monitoring-workflow';

// إنشاء مراقب الخدمة
const monitor = await createSampleServiceMonitoring();

// بدء المراقبة
await monitor.initialize();
```

### 2. إنشاء Task بسيط
```typescript
import { databaseService } from './server/database-service';

// إنشاء مهمة جديدة
const task = await databaseService.createTask({
  name: 'Test Task',
  description: 'مهمة تجريبية',
  type: 'custom_function',
  config: {
    functionCode: 'console.log("Hello from automation!");'
  },
  dependencies: [],
  resources: [
    { type: 'cpu', amount: 0.1, unit: 'cores' }
  ],
  retryPolicy: {
    maxRetries: 3,
    retryDelay: 5000,
    backoffMultiplier: 2,
    retryOn: ['network_error'],
    maxRetryDelay: 60000
  },
  timeout: 300000,
  priority: 5,
  tags: ['test'],
  metadata: {
    author: 'admin',
    category: 'test',
    version: '1.0.0',
    permissions: [],
    environment: 'development'
  },
  status: 'pending',
  createdBy: 'admin'
});
```

## 🔧 إعداد Telegram Bot

### 1. إنشاء Bot
```bash
# إرسال رسالة لـ @BotFather على Telegram
/newbot

# اتباع التعليمات وإعطاء اسم للـ bot
# حفظ الـ token الذي ستحصل عليه
```

### 2. الحصول على Chat ID
```bash
# إرسال رسالة للـ bot
# ثم زيارة الرابط التالي:
https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates

# البحث عن "chat":{"id": في النتيجة
```

### 3. اختبار الإشعارات
```typescript
// اختبار إرسال رسالة
const response = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    chat_id: process.env.TELEGRAM_CHAT_ID,
    text: '🚀 نظام الأتمتة يعمل بنجاح!'
  })
});
```

## 📱 استخدام الواجهة

### 1. الوصول للـ Dashboard
```
http://localhost:3000/automation
```

### 2. الميزات المتاحة
- **عرض المهام**: عرض جميع المهام مع حالتها
- **عرض Workflows**: عرض الـ workflows النشطة
- **عرض التنفيذات**: عرض تاريخ تنفيذ المهام
- **الفلترة**: فلترة حسب الحالة أو النوع
- **البحث**: البحث في المهام والـ workflows

### 3. إجراءات المهام
- **تشغيل**: تشغيل مهمة جديدة
- **إيقاف**: إيقاف مهمة قيد التشغيل
- **إعادة تشغيل**: إعادة تشغيل مهمة فاشلة
- **عرض السجلات**: عرض سجلات التنفيذ

## 🔍 استكشاف الأخطاء

### 1. مشاكل قاعدة البيانات
```bash
# فحص اتصال PostgreSQL
psql -h localhost -U username -d auraos_automation

# فحص اتصال Firebase
firebase projects:list
```

### 2. مشاكل Telegram
```bash
# اختبار الـ bot token
curl "https://api.telegram.org/bot<TOKEN>/getMe"

# اختبار إرسال رسالة
curl -X POST "https://api.telegram.org/bot<TOKEN>/sendMessage" \
  -H "Content-Type: application/json" \
  -d '{"chat_id":"<CHAT_ID>","text":"Test message"}'
```

### 3. مشاكل الخادم
```bash
# فحص المنافذ
netstat -tulpn | grep :3000

# فحص السجلات
tail -f logs/auraos-$(date +%Y-%m-%d).log
```

## 📈 مراقبة الأداء

### 1. إحصائيات النظام
- **المهام النشطة**: عدد المهام قيد التشغيل
- **المهام المكتملة**: عدد المهام المكتملة اليوم
- **المهام الفاشلة**: عدد المهام الفاشلة
- **معدل النجاح**: نسبة نجاح المهام

### 2. سجلات الأداء
```typescript
// مراقبة أداء المهام
taskAutomationEngine.on('task:execution:completed', (execution) => {
  console.log(`Task completed in ${execution.metrics.executionTime}ms`);
});

// مراقبة أداء الـ workflows
workflowEngine.on('workflow:execution:completed', (execution) => {
  console.log(`Workflow completed in ${execution.metrics.executionTime}ms`);
});
```

## 🛠️ التخصيص المتقدم

### 1. إضافة أنواع مهام جديدة
```typescript
// تسجيل نوع مهمة جديد
taskAutomationEngine.registerTaskType('email_sender', {
  name: 'email_sender',
  description: 'Send email notifications',
  configSchema: {
    type: 'object',
    properties: {
      to: { type: 'string' },
      subject: { type: 'string' },
      body: { type: 'string' }
    },
    required: ['to', 'subject', 'body']
  },
  processor: {
    execute: async (config, context) => {
      // تنفيذ إرسال الإيميل
      return { success: true, output: 'Email sent' };
    },
    validate: async (config) => {
      // التحقق من صحة الإعدادات
      return { valid: true, errors: [] };
    }
  }
});
```

### 2. إضافة عقد workflow جديدة
```typescript
// تسجيل نوع عقدة جديد
workflowEngine.registerNodeType('email_node', {
  execute: async (config, context) => {
    // تنفيذ إرسال الإيميل
    return { success: true, output: 'Email sent' };
  },
  validate: async (config) => {
    return { valid: true, errors: [] };
  }
});
```

## 📚 الخطوات التالية

### 1. التطوير المتقدم
- [ ] إضافة مزيد من أنواع المهام
- [ ] تطوير واجهة إنشاء الـ workflows
- [ ] إضافة نظام الإشعارات المتقدم
- [ ] تطوير نظام التحليلات

### 2. النشر
- [ ] إعداد البيئة الإنتاجية
- [ ] تكوين CI/CD
- [ ] إعداد المراقبة والإشعارات
- [ ] نسخ احتياطية للبيانات

### 3. الأمان
- [ ] إعداد المصادقة المتقدمة
- [ ] تشفير البيانات الحساسة
- [ ] مراقبة الأمان
- [ ] تدقيق الوصول

---

## 🆘 الدعم والمساعدة

### المشاكل الشائعة
1. **خطأ في الاتصال بقاعدة البيانات**: تأكد من صحة متغيرات البيئة
2. **فشل إرسال إشعارات Telegram**: تحقق من صحة الـ token والـ chat ID
3. **بطء في التنفيذ**: تحقق من موارد النظام والاتصال بالشبكة

### الحصول على المساعدة
- **GitHub Issues**: للإبلاغ عن المشاكل
- **Discord Community**: للمناقشات والدعم
- **Documentation**: للوثائق التفصيلية

---

**🎉 تهانينا! نظام الأتمتة المتقدم جاهز للاستخدام**

*آخر تحديث: ديسمبر 2024*
*الإصدار: 1.0*
