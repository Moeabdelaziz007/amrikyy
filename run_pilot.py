#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
AuraOS Learning Pilot - ملف التشغيل الرئيسي
تشغيل النظام المتكامل مع Firebase و Cursor + Gemini
"""

import asyncio
import sys
import os
from datetime import datetime
from pathlib import Path

# إضافة المسار للاستيراد
current_dir = Path(__file__).parent
sys.path.append(str(current_dir))

from auraos_learning_pilot import AuraOSLearningPilot, demo_pilot

def print_banner():
    """طباعة شعار النظام"""
    print("""
🚀 AuraOS Learning Pilot - تكامل حقيقي
=========================================

🎯 نظام التعلم الذكي المتكامل مع:
   🔥 Firebase - تخزين البيانات والجلسات
   🎯 Cursor + Gemini - تحليل وتوليد الكود
   🧠 Learning Brain Hub - النظام الأساسي
   📡 MCP Channel - قناة التواصل

💻 Public IDE داخل AuraOS
📊 تحليلات متقدمة في الوقت الفعلي
🔗 تكامل كامل مع البنية التحتية الحقيقية

🚀 الإصدار: 0.3.0-Pilot
""")

def print_usage():
    """طباعة تعليمات الاستخدام"""
    print("""
📖 الاستخدام:
    python run_pilot.py [mode]

🎯 الأوضاع المتاحة:
    demo         - عرض توضيحي كامل للـ Pilot
    ide          - تشغيل Public IDE
    analyze      - تحليل كود المستخدم
    exercise     - توليد تمارين تعلم
    status       - عرض حالة النظام
    help         - عرض هذه المساعدة

💡 الأمثلة:
    python run_pilot.py demo
    python run_pilot.py ide
    python run_pilot.py analyze

🔧 المتطلبات:
    Python 3.7+
    Firebase Project (اختياري)
    Cursor API Key (اختياري)
    Gemini API Key (اختياري)
""")

async def run_demo_mode():
    """تشغيل وضع العرض التوضيحي"""
    print("🎬 بدء العرض التوضيحي الكامل للـ Pilot...")
    await demo_pilot()

async def run_ide_mode():
    """تشغيل وضع Public IDE"""
    print("💻 بدء تشغيل Public IDE...")
    
    pilot = AuraOSLearningPilot()
    
    try:
        await pilot.initialize()
        
        # إنشاء جلسة IDE تفاعلية
        print("\n🎯 إنشاء جلسة IDE تفاعلية...")
        
        preferences = {
            'goals': ['programming', 'ai'],
            'level': 'intermediate',
            'language': 'javascript',
            'framework': 'nodejs'
        }
        
        session_id = await pilot.create_public_ide_session('ide_user', preferences)
        print(f"✅ تم إنشاء جلسة IDE: {session_id}")
        
        # محاكاة استخدام IDE
        print("\n💻 محاكاة استخدام IDE...")
        
        # تحليل كود عينة
        sample_code = """
function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}
"""
        
        print("🔍 تحليل الكود...")
        analysis = await pilot.analyze_user_code(session_id, sample_code)
        
        if 'error' not in analysis:
            print(f"✅ تحليل الكود:")
            print(f"   جودة الكود: {analysis['code_quality']:.2f}")
            print(f"   درجة التعقيد: {analysis['complexity_score']:.2f}")
            print(f"   الاقتراحات: {analysis['suggestions'][:2]}")  # أول اقتراحين فقط
        
        # توليد تمرين
        print("\n📚 توليد تمرين تعلم...")
        exercise = await pilot.generate_learning_exercise(session_id, 'algorithms')
        
        if 'error' not in exercise:
            print(f"✅ تم توليد التمرين:")
            print(f"   العنوان: {exercise['title']}")
            print(f"   المستوى: {exercise['level']}")
            print(f"   الوقت المقدر: {exercise['estimated_time']} دقيقة")
        
        print("\n🎉 جلسة IDE مكتملة!")
        
    except Exception as e:
        print(f"❌ خطأ في IDE: {e}")
    
    finally:
        await pilot.shutdown()

async def run_analyze_mode():
    """تشغيل وضع تحليل الكود"""
    print("🔍 بدء وضع تحليل الكود...")
    
    pilot = AuraOSLearningPilot()
    
    try:
        await pilot.initialize()
        
        # إنشاء جلسة تحليل
        session_id = await pilot.create_public_ide_session('analyze_user', {
            'goals': ['code_analysis'],
            'level': 'advanced'
        })
        
        print(f"✅ تم إنشاء جلسة التحليل: {session_id}")
        
        # كود للتحليل
        code_to_analyze = """
class UserManager {
    constructor() {
        this.users = [];
    }
    
    addUser(user) {
        if (!user.name || !user.email) {
            throw new Error('User must have name and email');
        }
        this.users.push(user);
    }
    
    findUser(email) {
        return this.users.find(user => user.email === email);
    }
}
"""
        
        print("🔍 تحليل الكود...")
        analysis = await pilot.analyze_user_code(session_id, code_to_analyze)
        
        if 'error' not in analysis:
            print(f"\n📊 نتائج التحليل:")
            print(f"   جودة الكود: {analysis['code_quality']:.2f}")
            print(f"   درجة التعقيد: {analysis['complexity_score']:.2f}")
            print(f"   رؤى Gemini: {analysis['gemini_insights']}")
            
            print(f"\n💡 الاقتراحات:")
            for i, suggestion in enumerate(analysis['suggestions'], 1):
                print(f"   {i}. {suggestion}")
            
            print(f"\n⭐ أفضل الممارسات:")
            for i, practice in enumerate(analysis['best_practices'], 1):
                print(f"   {i}. {practice}")
        
        else:
            print(f"❌ خطأ في التحليل: {analysis['error']}")
        
    except Exception as e:
        print(f"❌ خطأ في التحليل: {e}")
    
    finally:
        await pilot.shutdown()

async def run_exercise_mode():
    """تشغيل وضع توليد التمارين"""
    print("📚 بدء وضع توليد التمارين...")
    
    pilot = AuraOSLearningPilot()
    
    try:
        await pilot.initialize()
        
        # إنشاء جلسة تمارين
        session_id = await pilot.create_public_ide_session('exercise_user', {
            'goals': ['learning', 'practice'],
            'level': 'intermediate'
        })
        
        print(f"✅ تم إنشاء جلسة التمارين: {session_id}")
        
        # توليد تمارين مختلفة
        topics = ['algorithms', 'data_structures', 'javascript', 'ai']
        
        for topic in topics:
            print(f"\n📚 توليد تمرين في: {topic}")
            exercise = await pilot.generate_learning_exercise(session_id, topic)
            
            if 'error' not in exercise:
                print(f"✅ تم توليد التمرين:")
                print(f"   العنوان: {exercise['title']}")
                print(f"   المستوى: {exercise['level']}")
                print(f"   الوقت المقدر: {exercise['estimated_time']} دقيقة")
                print(f"   التعليمات: {len(exercise['instructions'])} خطوة")
            else:
                print(f"❌ خطأ في توليد التمرين: {exercise['error']}")
        
        print("\n🎉 تم توليد جميع التمارين!")
        
    except Exception as e:
        print(f"❌ خطأ في التمارين: {e}")
    
    finally:
        await pilot.shutdown()

async def run_status_mode():
    """تشغيل وضع عرض الحالة"""
    print("📊 عرض حالة النظام...")
    
    pilot = AuraOSLearningPilot()
    
    try:
        await pilot.initialize()
        
        status = await pilot.get_pilot_status()
        
        print(f"\n📊 حالة Pilot:")
        print(f"   الاسم: {status['pilot_name']}")
        print(f"   الإصدار: {status['version']}")
        print(f"   الحالة: {'نشط' if status['is_active'] else 'غير نشط'}")
        
        print(f"\n📈 الإحصائيات:")
        stats = status['pilot_stats']
        print(f"   إجمالي الجلسات: {stats['total_sessions']}")
        print(f"   عمليات Firebase: {stats['firebase_operations']}")
        print(f"   عمليات Cursor: {stats['cursor_operations']}")
        print(f"   عمليات Gemini: {stats['gemini_operations']}")
        print(f"   معدل النجاح: {stats['success_rate']:.2f}")
        
        print(f"\n🔧 حالة المكونات:")
        components = status['components']
        print(f"   Firebase Store: {'✅ متصل' if components['firebase_store'] else '❌ غير متصل'}")
        print(f"   Cursor + Gemini: {'✅ متصل' if components['cursor_gemini'] else '❌ غير متصل'}")
        print(f"   Learning Integration: {'✅ نشط' if components['learning_integration'] else '❌ غير نشط'}")
        
    except Exception as e:
        print(f"❌ خطأ في عرض الحالة: {e}")
    
    finally:
        await pilot.shutdown()

async def main():
    """الدالة الرئيسية"""
    print_banner()
    
    if len(sys.argv) > 1:
        mode = sys.argv[1].lower()
    else:
        mode = "demo"
    
    print(f"🎯 وضع التشغيل: {mode}")
    print("=" * 60)
    
    try:
        if mode == "demo":
            await run_demo_mode()
        elif mode == "ide":
            await run_ide_mode()
        elif mode == "analyze":
            await run_analyze_mode()
        elif mode == "exercise":
            await run_exercise_mode()
        elif mode == "status":
            await run_status_mode()
        elif mode == "help":
            print_usage()
        else:
            print(f"❌ وضع غير معروف: {mode}")
            print_usage()
    
    except KeyboardInterrupt:
        print("\n\n⏹️ تم إيقاف البرنامج بواسطة المستخدم")
    except Exception as e:
        print(f"\n❌ خطأ عام: {e}")
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main())
