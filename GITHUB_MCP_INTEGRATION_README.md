# 🚀 GitHub MCP Server Integration with AuraOS Autopilot

## نظرة عامة

تم دمج GitHub MCP Server مع نظام AuraOS Autopilot لتوفير إدارة تلقائية شاملة لمستودعات GitHub. يوفر هذا التكامل مراقبة في الوقت الفعلي، مراجعة الكود التلقائية، وإدارة المشاكل والطلبات.

## ✨ الميزات الرئيسية

### 1. **مراقبة تلقائية**
- مراقبة المشاكل الجديدة كل 5 دقائق
- مراقبة طلبات السحب كل 3 دقائق
- مراقبة أداء المستودع كل 30 دقيقة
- فحص الأمان كل ساعة

### 2. **إدارة المشاكل**
- إنشاء وتحديث وإغلاق المشاكل
- إضافة ملصقات تلقائية
- إشعارات فورية عبر Telegram

### 3. **مراجعة الكود التلقائية**
- تحليل جودة الكود
- فحص الأمان
- تحليل الأداء
- اقتراحات التحسين

### 4. **إدارة طلبات السحب**
- مراجعة تلقائية للطلبات
- دمج تلقائي (اختياري)
- تقييم شامل للكود

## 🛠️ التثبيت والإعداد

### 1. إعداد متغيرات البيئة

```bash
# انسخ ملف التكوين
cp github-integration.env.example .env

# عدّل المتغيرات في .env
GITHUB_TOKEN=your_github_token_here
GITHUB_OWNER=your_github_username
GITHUB_REPO=your_repository_name
GITHUB_AUTO_REVIEW=true
GITHUB_AUTO_APPROVE=false
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_ADMIN_CHAT_ID=your_telegram_chat_id
```

### 2. الحصول على GitHub Token

1. اذهب إلى GitHub Settings > Developer settings > Personal access tokens
2. انقر على "Generate new token"
3. اختر الصلاحيات التالية:
   - `repo` (Full control of private repositories)
   - `workflow` (Update GitHub Action workflows)
   - `write:packages` (Upload packages to GitHub Package Registry)
   - `read:org` (Read org and team membership)

### 3. تثبيت التبعيات

```bash
npm install
```

## 🚀 الاستخدام

### أوامر CLI الأساسية

```bash
# عرض معلومات المستودع
npm run cli:github:info

# عرض المشاكل
npm run cli:github:issues

# عرض طلبات السحب
npm run cli:github:prs

# تحليل الكود
npm run cli:github:analyze -- path/to/file

# بدء التكامل التلقائي
npm run cli:github:autopilot
```

### أوامر متقدمة

```bash
# عرض المشاكل المغلقة
tsx cli.ts github issues --state closed

# تحليل الأمان
tsx cli.ts github analyze server/index.ts --type security

# تحليل الأداء
tsx cli.ts github analyze src/components --type performance
```

## 📊 الميزات المتقدمة

### 1. **المراجعة التلقائية للكود**

```typescript
// مثال على المراجعة التلقائية
const reviewResults = await githubIntegration.performAutoReview(prNumber);
```

### 2. **إضافة الملصقات التلقائية**

```typescript
// إضافة ملصقات بناءً على محتوى المشكلة
const labels = [];
if (title.includes('bug')) labels.push('bug');
if (title.includes('feature')) labels.push('enhancement');
```

### 3. **مراقبة الأداء**

```typescript
// مراقبة مقاييس الأداء
const metrics = await githubIntegration.monitorPerformance('commits', 'week');
```

## 🔧 التكوين المتقدم

### إعدادات المراجعة التلقائية

```env
# في ملف .env
GITHUB_AUTO_REVIEW=true          # تفعيل المراجعة التلقائية
GITHUB_AUTO_APPROVE=false        # الموافقة التلقائية (مُوصى بعدم تفعيلها)
GITHUB_AUTO_LABEL=true          # إضافة الملصقات التلقائية
```

### إعدادات المراقبة

```typescript
// تخصيص فترات المراقبة
const monitoringTasks = {
  issues: 5 * 60 * 1000,        // كل 5 دقائق
  pullRequests: 3 * 60 * 1000,  // كل 3 دقائق
  performance: 30 * 60 * 1000,  // كل 30 دقيقة
  security: 60 * 60 * 1000      // كل ساعة
};
```

## 📱 إشعارات Telegram

### أنواع الإشعارات

1. **مشاكل جديدة**
   ```
   🐛 New Issue Detected
   
   Title: Fix authentication bug
   Number: #123
   Author: developer
   Labels: bug, urgent
   ```

2. **طلبات سحب جديدة**
   ```
   🔀 New Pull Request
   
   Title: Add new feature
   Number: #45
   Author: developer
   Branch: feature/new-feature → main
   ```

3. **تقرير الأداء**
   ```
   📊 Repository Performance Report
   
   Commits This Week: 25
   Trend: increasing
   Top Contributors: dev1, dev2, dev3
   ```

4. **تنبيهات الأمان**
   ```
   🚨 Security Alert
   
   Repository: owner/repo
   Scan Results:
   - Dependencies: 95/100
   - Secrets: 100/100
   - Code: 92/100
   ```

## 🔍 تحليل الكود

### أنواع التحليل المتاحة

1. **جودة الكود (Quality)**
   - تقييم قابلية القراءة
   - تحليل التعقيد
   - اقتراحات التحسين

2. **الأمان (Security)**
   - فحص الثغرات الأمنية
   - تحليل التبعيات
   - فحص الأسرار

3. **الأداء (Performance)**
   - تحليل الأداء
   - تحديد الاختناقات
   - اقتراحات التحسين

4. **التعقيد (Complexity)**
   - التعقيد الدوري
   - التعقيد المعرفي
   - مؤشر القابلية للصيانة

## 🚨 استكشاف الأخطاء

### مشاكل شائعة

1. **خطأ في المصادقة**
   ```
   ❌ GitHub API error: Bad credentials
   ```
   **الحل**: تحقق من صحة `GITHUB_TOKEN`

2. **خطأ في المستودع**
   ```
   ❌ GitHub API error: Not Found
   ```
   **الحل**: تحقق من `GITHUB_OWNER` و `GITHUB_REPO`

3. **خطأ في Telegram**
   ```
   ❌ Failed to send Telegram message
   ```
   **الحل**: تحقق من `TELEGRAM_BOT_TOKEN` و `TELEGRAM_ADMIN_CHAT_ID`

### سجلات التشخيص

```bash
# عرض سجلات النظام
npm run cli:autopilot:logs

# فحص حالة النظام
npm run cli:status

# فحص سريع للنظام
npm run cli:audit:quick
```

## 📈 المقاييس والإحصائيات

### مؤشرات الأداء الرئيسية

- **عدد المشاكل المفتوحة/المغلقة**
- **عدد طلبات السحب المدمجة**
- **وقت الاستجابة للمراجعة**
- **معدل الموافقة التلقائية**
- **جودة الكود الإجمالية**

### تقارير الأداء

```bash
# تقرير شامل للأداء
npm run cli:github:analyze -- . --type performance

# تقرير الأمان
npm run cli:github:analyze -- . --type security
```

## 🔐 الأمان

### أفضل الممارسات

1. **استخدم Personal Access Tokens محدودة الصلاحيات**
2. **لا تشارك الرموز المميزة**
3. **فعّل المراجعة التلقائية بحذر**
4. **راقب السجلات بانتظام**

### إعدادات الأمان الموصى بها

```env
GITHUB_AUTO_APPROVE=false        # تعطيل الموافقة التلقائية
GITHUB_AUTO_REVIEW=true          # تفعيل المراجعة التلقائية
GITHUB_AUTO_LABEL=true           # تفعيل الملصقات التلقائية
```

## 🤝 المساهمة

نرحب بالمساهمات! يرجى اتباع الخطوات التالية:

1. Fork المستودع
2. إنشاء فرع للميزة الجديدة
3. إجراء التغييرات
4. إضافة الاختبارات
5. إرسال Pull Request

## 📄 الترخيص

هذا المشروع مرخص تحت رخصة MIT. راجع ملف `LICENSE` للتفاصيل.

## 🆘 الدعم

للحصول على الدعم:

1. تحقق من قسم استكشاف الأخطاء
2. راجع السجلات
3. افتح Issue في GitHub
4. تواصل عبر Telegram

---

**تم تطوير هذا التكامل بواسطة فريق AuraOS** 🚀
