# 🚀 AuraOS - دليل النشر والإنتاج

## 📋 نظرة عامة

AuraOS هو نظام تشغيل ويب متطور مدعوم بالذكاء الاصطناعي مع واجهة مستخدم على طراز السايبر بانك. هذا الدليل يغطي عملية النشر والإعداد للإنتاج.

## ✅ متطلبات النشر

### متطلبات النظام
- **Node.js**: 18.x أو أحدث
- **npm**: 9.x أو أحدث
- **Docker**: 20.x أو أحدث (اختياري)
- **Firebase CLI**: أحدث إصدار

### حسابات مطلوبة
- [Firebase](https://firebase.google.com) - للاستضافة وقاعدة البيانات
- [OpenAI](https://openai.com) - للذكاء الاصطناعي (اختياري)
- [Google AI](https://ai.google.dev) - للذكاء الاصطناعي (اختياري)
- [Telegram](https://core.telegram.org/bots) - للبوت (اختياري)

## 🔧 الإعداد السريع

### 1. استنساخ المشروع
```bash
git clone https://github.com/yourusername/auraos.git
cd auraos
```

### 2. تثبيت التبعيات
```bash
npm install
```

### 3. إعداد متغيرات البيئة
```bash
# نسخ ملف الإعدادات
cp production.env .env

# تعديل المتغيرات حسب الحاجة
nano .env
```

### 4. اختبار المشروع
```bash
# تشغيل الاختبارات
npm run test:all

# تشغيل المشروع محلياً
npm run dev
```

## 🚀 النشر

### النشر على Firebase (موصى به)

#### 1. إعداد Firebase
```bash
# تثبيت Firebase CLI
npm install -g firebase-tools

# تسجيل الدخول
firebase login

# تهيئة المشروع
firebase init hosting
```

#### 2. النشر
```bash
# النشر مع الاختبارات
npm run deploy
```

### النشر باستخدام Docker

#### 1. بناء الصورة
```bash
docker build -f Dockerfile.production -t auraos:latest .
```

#### 2. تشغيل الحاوية
```bash
docker run -d \
  --name auraos \
  -p 3001:3001 \
  --env-file production.env \
  auraos:latest
```

### النشر على VPS/Cloud

#### 1. رفع الملفات
```bash
# رفع المشروع إلى الخادم
scp -r . user@your-server:/var/www/auraos
```

#### 2. إعداد الخادم
```bash
# على الخادم
cd /var/www/auraos
npm install --production
npm run start
```

## 🔒 الأمان

### إعدادات الأمان المطبقة
- **Content Security Policy (CSP)**
- **HTTP Strict Transport Security (HSTS)**
- **X-Frame-Options**
- **X-Content-Type-Options**
- **Rate Limiting**
- **Input Validation**

### تحديث شهادات SSL
```bash
# إعداد شهادة SSL
sudo certbot --nginx -d yourdomain.com
```

## 📊 المراقبة والأداء

### مراقبة الأداء
```bash
# تشغيل اختبارات الأداء
npm run test:performance

# عرض تقرير الأداء
cat performance-report.json
```

### مراقبة الأخطاء
- **Firebase Console**: لمراقبة الأخطاء
- **Browser DevTools**: لمراقبة الأداء
- **Service Worker**: للتخزين المؤقت

## 🔧 الصيانة

### تحديث المشروع
```bash
# سحب التحديثات
git pull origin main

# تثبيت التبعيات الجديدة
npm install

# إعادة النشر
npm run deploy
```

### نسخ احتياطية
```bash
# نسخ احتياطي للبيانات
firebase firestore:export ./backup

# نسخ احتياطي للملفات
tar -czf auraos-backup.tar.gz .
```

## 🐛 استكشاف الأخطاء

### مشاكل شائعة

#### 1. خطأ في التحميل
```bash
# فحص الشبكة
curl -I https://yourdomain.com

# فحص Service Worker
# افتح DevTools > Application > Service Workers
```

#### 2. مشاكل Firebase
```bash
# فحص الاتصال
firebase projects:list

# إعادة إعداد
firebase login --reauth
```

#### 3. مشاكل الأداء
```bash
# تحليل الحزمة
npm run test:performance

# فحص حجم الملفات
du -sh client/dist/*
```

## 📞 الدعم

### الموارد المفيدة
- [Firebase Documentation](https://firebase.google.com/docs)
- [Vite Documentation](https://vitejs.dev/guide)
- [Tailwind CSS](https://tailwindcss.com/docs)

### التواصل
- **GitHub Issues**: للإبلاغ عن الأخطاء
- **Discord**: للدعم المجتمعي
- **Email**: للدعم المباشر

## 📈 التطوير المستقبلي

### ميزات مخطط لها
- [ ] دعم متعدد اللغات
- [ ] تطبيق موبايل
- [ ] API عامة
- [ ] تكاملات إضافية

### المساهمة
نرحب بالمساهمات! يرجى قراءة [دليل المساهمة](CONTRIBUTING.md) قبل البدء.

## 📄 الترخيص

هذا المشروع مرخص تحت [MIT License](LICENSE).

---

**تم إنشاء هذا الدليل بواسطة فريق AuraOS** 🎉
