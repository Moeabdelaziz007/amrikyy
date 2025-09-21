# 🚀 AuraOS CLI المحسن - دليل الأوتوبايلوت

## نظرة عامة

AuraOS CLI المحسن هو واجهة سطر أوامر متقدمة للتحكم في نظام الأوتوبايلوت الذكي. يوفر أدوات شاملة للإدارة، المراقبة، والتحليل باستخدام الذكاء الاصطناعي.

## 🎯 الميزات الرئيسية

- **إدارة الأوتوبايلوت**: بدء، إيقاف، ومراقبة النظام
- **ذكاء اصطناعي متكامل**: مساعد AI للدعم والتحليل
- **مراقبة فورية**: WebSocket للتحديثات الحية
- **سجلات متقدمة**: عرض منظم مع التصنيف اللوني
- **واجهة عربية**: دعم كامل للغة العربية
- **أمان محسن**: تشفير ومصادقة

## 📦 التثبيت والإعداد

```bash
# تثبيت التبعيات
npm install

# تشغيل النظام
npm run dev

# اختبار CLI
npm run cli:status
```

## 🛩️ الأوامر المتاحة

### الأوامر الأساسية
```bash
auraos status          # عرض حالة النظام
auraos interactive     # محادثة تفاعلية
auraos demo           # تشغيل التفاعلات التجريبية
auraos monitor        # مراقبة الأحداث الفورية
```

### أوامر الأوتوبايلوت
```bash
# إدارة النظام
auraos autopilot start          # بدء الأوتوبايلوت
auraos autopilot stop           # إيقاف الأوتوبايلوت
auraos autopilot status         # حالة الأوتوبايلوت
auraos autopilot monitor        # مراقبة فورية
auraos autopilot logs           # عرض السجلات

# الذكاء الاصطناعي
auraos autopilot ai chat        # محادثة مع AI
auraos autopilot ai analyze     # تحليل الأداء
```

## 🎮 استخدام متقدم

### بدء النظام
```bash
npm run cli:autopilot:start
```

### مراقبة فورية
```bash
npm run cli:autopilot:monitor
```

### تحليل AI
```bash
npm run cli:autopilot:ai:analyze
```

## 🔧 إعدادات متقدمة

### متغيرات البيئة
```bash
# مطلوبة
AURAOS_API_URL=http://localhost:5000
FIREBASE_PROJECT_ID=your_project
TELEGRAM_BOT_TOKEN=your_token
TELEGRAM_ADMIN_CHAT_ID=your_chat_id
GOOGLE_AI_API_KEY=your_api_key

# اختيارية
AURAOS_LOG_LEVEL=info
AURAOS_MONITOR_INTERVAL=30000
```

### ملف التكوين
```json
{
  "autopilot": {
    "enabled": true,
    "rules": 5,
    "workflows": 4
  },
  "ai": {
    "model": "gemini-pro",
    "temperature": 0.7
  },
  "monitoring": {
    "realtime": true,
    "alerts": true
  }
}
```

## 📊 مراقبة وتحليلات

### لوحة المراقبة
- **الحالة الصحية**: مؤشرات النظام
- **الأداء**: CPU، ذاكرة، استجابة
- **السجلات**: أحدث الأحداث
- **الإشعارات**: تنبيهات فورية

### تحليل AI
- **الصحة العامة**: تقييم شامل
- **نقاط الأداء**: درجات من 100
- **التوصيات**: اقتراحات التحسين

## 🔒 الأمان

- **المصادقة**: API keys مشفرة
- **التشفير**: SSL/TLS للاتصالات
- **التسجيل**: جميع العمليات مسجلة
- **التحكم**: صلاحيات محددة

## 🐛 استكشاف الأخطاء

### مشاكل شائعة

1. **الأوتوبايلوت لا يبدأ**
   ```bash
   # فحص الحالة
   npm run cli:autopilot:status

   # تشخيص النظام
   npm run cli:autopilot:ai:analyze
   ```

2. **مشاكل الاتصال**
   ```bash
   # اختبار WebSocket
   npm run cli:monitor
   ```

3. **أخطاء AI**
   ```bash
   # فحص API key
   echo $GOOGLE_AI_API_KEY

   # اختبار الاتصال
   npm run cli:autopilot:ai:chat
   ```

## 📈 أفضل الممارسات

1. **المراقبة الدورية**: تشغيل `status` يومياً
2. **النسخ الاحتياطي**: حفظ السجلات بانتظام
3. **التحسين**: تطبيق توصيات AI
4. **الأمان**: تحديث المفاتيح دورياً

## 🔗 الموارد

- [دليل الإعداد](./AURAOS_SETUP_GUIDE.md)
- [دليل الأوتوبايلوت](./AUTOPILOT_SYSTEM_GUIDE.md)
- [وثائق API](./api-docs.md)

## 📞 الدعم

للحصول على المساعدة:
1. تشغيل `auraos autopilot ai chat`
2. مراجعة السجلات
3. إنشاء issue في المستودع

---

**🚀 AuraOS CLI - نظام أوتوبايلوت ذكي ومتقدم!**
