#!/bin/bash

echo "🚀 بدء تشغيل نظام A2A..."

# التحقق من وجود Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js غير مثبت. يرجى تثبيت Node.js أولاً."
    exit 1
fi

# التحقق من وجود npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm غير مثبت. يرجى تثبيت npm أولاً."
    exit 1
fi

# الانتقال إلى مجلد Gateway
cd gateway

# تثبيت التبعيات إذا لم تكن مثبتة
if [ ! -d "node_modules" ]; then
    echo "📦 تثبيت التبعيات..."
    npm install
fi

# إنشاء ملف .env إذا لم يكن موجوداً
if [ ! -f ".env" ]; then
    echo "⚙️ إنشاء ملف البيئة..."
    cp env.example .env
    echo "✅ تم إنشاء ملف .env - يرجى تعديل القيم حسب الحاجة"
fi

# تشغيل النظام
echo "🚀 تشغيل Gateway..."
npm run dev