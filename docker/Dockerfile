# AuraOS Dockerfile - إعداد Docker للنشر السهل والمرن
FROM node:18-alpine

# إعداد متغيرات البيئة
ENV NODE_ENV=production
ENV PORT=3000
ENV TELEGRAM_BOT_TOKEN=""
ENV GOOGLE_AI_API_KEY=""
ENV WEBHOOK_URL=""
ENV WEBHOOK_SECRET_TOKEN=""

# إنشاء مجلد التطبيق
WORKDIR /app

# نسخ ملفات التبعيات
COPY package*.json ./

# تثبيت التبعيات
RUN npm ci --only=production && npm cache clean --force

# نسخ الكود المصدري
COPY . .

# إنشاء مجلدات مطلوبة
RUN mkdir -p logs reports

# إعداد المستخدم غير الجذر
RUN addgroup -g 1001 -S nodejs && \
    adduser -S auraos -u 1001

# تغيير ملكية الملفات
RUN chown -R auraos:nodejs /app

# التبديل إلى المستخدم غير الجذر
USER auraos

# فتح المنفذ
EXPOSE 3000

# إضافة health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node health-check.js

# تشغيل التطبيق
CMD ["node", "start-ai-system.js"]
