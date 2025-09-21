# 🧠 AuraOS Learning Growth Daemon

نظام دايمون متقدم لتشغيل AuraOS Learning Growth بشكل مستمر مع إمكانيات التطوير الذاتي والمراقبة المتقدمة.

## ✨ المميزات الرئيسية

- **🔄 التشغيل المستمر**: يعمل دايمون بشكل مستمر مع إعادة التشغيل التلقائي عند الفشل
- **⚙️ إعادة تحميل الإعدادات الديناميكية**: تحديث الإعدادات دون إعادة تشغيل الخدمة
- **🏥 مراقبة الصحة**: فحص دوري لصحة النظام وإعادة التشغيل عند الحاجة
- **📄 تدوير السجلات**: إدارة تلقائية للسجلات لتجنب امتلاء القرص
- **🚀 تكامل نظام macOS**: تشغيل كخدمة نظام مع LaunchDaemon
- **📊 مراقبة الأداء**: تتبع مستمر لأداء النظام ومعدلات التعلم

## 📁 هيكل الملفات

```
AuraOS/
├── tools/
│   ├── enhanced_auto_daemon.py    # دايمون محسن مع جميع المميزات
│   └── state/                     # ملفات حالة النظام
├── config/
│   └── learning_daemon_config.json # إعدادات الدايمون
├── logs/
│   └── daemon.log                 # سجل الدايمون الرئيسي
├── logrotate/
│   └── auraos-learning-daemon.conf # إعدادات تدوير السجلات
├── com.auraos.learningdaemon.plist # ملف LaunchDaemon
├── install_daemon.sh              # سكريبت التثبيت
└── manage_daemon.sh               # سكريبت إدارة الخدمة
```

## 🚀 التثبيت السريع

### 1. التثبيت التلقائي (مستحسن)

```bash
# تشغيل سكريبت التثبيت
sudo bash install_daemon.sh
```

### 2. التثبيت اليدوي

```bash
# نسخ ملف LaunchDaemon
sudo cp com.auraos.learningdaemon.plist /Library/LaunchDaemons/

# تحميل الخدمة
sudo launchctl load -w /Library/LaunchDaemons/com.auraos.learningdaemon.plist

# تثبيت إعدادات logrotate
sudo cp logrotate/auraos-learning-daemon.conf /etc/logrotate.d/
```

## 🔧 إدارة الخدمة

استخدم سكريبت الإدارة للتحكم في الخدمة:

```bash
# عرض حالة الخدمة
./manage_daemon.sh status

# بدء الخدمة
./manage_daemon.sh start

# إيقاف الخدمة
./manage_daemon.sh stop

# إعادة تشغيل الخدمة
./manage_daemon.sh restart

# عرض السجلات
./manage_daemon.sh logs

# عرض الإعدادات الحالية
./manage_daemon.sh config

# تعديل الإعدادات
./manage_daemon.sh edit
```

## ⚙️ الإعدادات المتقدمة

### ملف الإعدادات (`config/learning_daemon_config.json`)

```json
{
  "script": "auraos_learning_api_server.py",
  "restart_backoff_sec": 5,
  "max_backoff_sec": 120,
  "auto_start": true,
  "health_check_enabled": true,
  "log_rotation_enabled": true,
  "max_log_size_mb": 10,
  "max_health_failures": 3,
  "health_check_interval": 30,
  "enable_dynamic_config_reload": true,
  "daemon_description": "AuraOS Learning Growth Continuous Daemon"
}
```

### شرح الإعدادات

| الإعداد | الوصف | القيمة الافتراضية |
|---------|-------|-------------------|
| `script` | اسم سكريبت التعلم | `auraos_learning_api_server.py` |
| `restart_backoff_sec` | وقت الانتظار قبل إعادة التشغيل | `5` ثواني |
| `max_backoff_sec` | الحد الأقصى لوقت الانتظار | `120` ثانية |
| `health_check_enabled` | تفعيل مراقبة الصحة | `true` |
| `log_rotation_enabled` | تفعيل تدوير السجلات | `true` |
| `max_log_size_mb` | الحد الأقصى لحجم السجل | `10` ميجابايت |
| `max_health_failures` | عدد فشل الصحة قبل إعادة التشغيل | `3` |

## 📊 مراقبة الأداء

### السجلات

```bash
# عرض السجلات في الوقت الفعلي
tail -f logs/daemon.log

# عرض آخر 100 سطر
tail -n 100 logs/daemon.log

# البحث في السجلات
grep "ERROR" logs/daemon.log
```

### حالة النظام

```bash
# عرض حالة الخدمة
launchctl list | grep com.auraos.learningdaemon

# عرض معلومات مفصلة
launchctl print system/com.auraos.learningdaemon
```

## 🔍 استكشاف الأخطاء

### مشاكل شائعة وحلولها

#### 1. الخدمة لا تبدأ

```bash
# فحص السجلات للأخطاء
tail -f logs/daemon.log

# فحص حالة الخدمة
launchctl list | grep com.auraos.learningdaemon

# إعادة تحميل الخدمة
sudo launchctl unload /Library/LaunchDaemons/com.auraos.learningdaemon.plist
sudo launchctl load -w /Library/LaunchDaemons/com.auraos.learningdaemon.plist
```

#### 2. مشاكل الصلاحيات

```bash
# إصلاح صلاحيات الملفات
sudo chown -R $(whoami):staff /Users/cryptojoker710/Downloads/AuraOS
chmod +x tools/enhanced_auto_daemon.py
```

#### 3. مشاكل Python

```bash
# تثبيت المتطلبات
pip3 install watchdog

# فحص إصدار Python
python3 --version
```

## 📈 تحسين الأداء

### نصائح لتحسين الأداء

1. **ضبط إعدادات إعادة التشغيل**:
   - تقليل `restart_backoff_sec` للاستجابة السريعة
   - زيادة `max_backoff_sec` لتجنب إعادة التشغيل المتكررة

2. **إدارة السجلات**:
   - تقليل `max_log_size_mb` لتوفير المساحة
   - تفعيل `log_rotation_enabled` للتنظيف التلقائي

3. **مراقبة الصحة**:
   - ضبط `health_check_interval` حسب احتياجات النظام
   - زيادة `max_health_failures` لتجنب إعادة التشغيل غير الضرورية

## 🔄 التحديثات والصيانة

### تحديث الدايمون

```bash
# إيقاف الخدمة
./manage_daemon.sh stop

# تحديث الملفات
git pull  # أو تحديث يدوي

# إعادة تشغيل الخدمة
./manage_daemon.sh start
```

### تنظيف النظام

```bash
# تنظيف السجلات القديمة
find logs/ -name "daemon_*.log" -mtime +7 -delete

# تنظيف ملفات الحالة
rm -f tools/state/*.tmp
```

## 📞 الدعم والمساعدة

### أوامر مفيدة

```bash
# عرض جميع الأوامر المتاحة
./manage_daemon.sh help

# فحص حالة النظام الكاملة
./manage_daemon.sh status && ./manage_daemon.sh logs

# إعادة تثبيت كاملة
./manage_daemon.sh uninstall && ./manage_daemon.sh install
```

### معلومات النظام

- **نظام التشغيل**: macOS
- **Python**: 3.7+
- **المتطلبات**: watchdog (اختياري)
- **الصلاحيات**: root للتثبيت، عادي للتشغيل

---

## 🎯 الخلاصة

تم إنشاء نظام دايمون متكامل وشامل لـ AuraOS Learning Growth يتضمن:

✅ **تشغيل مستمر** مع إعادة التشغيل التلقائي  
✅ **إعادة تحميل الإعدادات** ديناميكيًا  
✅ **مراقبة الصحة** الدورية  
✅ **تدوير السجلات** التلقائي  
✅ **تكامل نظام macOS** مع LaunchDaemon  
✅ **سكريبتات إدارة** سهلة الاستخدام  
✅ **توثيق شامل** ودليل استكشاف الأخطاء  

النظام الآن جاهز للتشغيل المستمر والتطوير الذاتي! 🚀
