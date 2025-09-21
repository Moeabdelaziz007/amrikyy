#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
AuraOS Complete System - النظام المتكامل الكامل
تشغيل جميع المكونات معاً: MCP Agents + Task Dispatcher + Telegram Bot + Web Dashboard
"""

import asyncio
import sys
import os
from datetime import datetime
from pathlib import Path

# إضافة المسار للاستيراد
current_dir = Path(__file__).parent
sys.path.append(str(current_dir))

from web_dashboard import WebDashboard, demo_web_dashboard
from telegram_bot_integration import TelegramBotIntegration, demo_telegram_bot_integration
from task_dispatcher import TaskDispatcher, demo_task_dispatcher
from auraos_mcp_integration import AuraOSMCPIntegration, demo_mcp_integration

def print_banner():
    """طباعة شعار النظام"""
    print("""
🚀 AuraOS Complete System - النظام المتكامل الكامل
==================================================

🎯 المكونات المتكاملة:
   🤖 MCP Agents - وكلاء الذكاء الاصطناعي
   📋 Task Dispatcher - موزع المهام الذكي
   💬 Telegram Bot - بوت التواصل
   🌐 Web Dashboard - لوحة التحكم الويبية

🧠 Learning Hub Integration
📡 MCP Protocol Communication
🔄 Real-time Task Management
📊 Live Dashboard Updates

🚀 الإصدار: 0.5.0-Complete
""")

def print_usage():
    """طباعة تعليمات الاستخدام"""
    print("""
📖 الاستخدام:
    python run_complete_system.py [mode]

🎯 الأوضاع المتاحة:
    complete      - تشغيل النظام المتكامل الكامل
    dashboard     - تشغيل لوحة التحكم الويبية فقط
    telegram      - تشغيل Telegram Bot فقط
    dispatcher    - تشغيل Task Dispatcher فقط
    mcp           - تشغيل MCP Integration فقط
    demo          - عرض توضيحي كامل للنظام
    test          - اختبار جميع المكونات
    status        - عرض حالة النظام
    help          - عرض هذه المساعدة

💡 الأمثلة:
    python run_complete_system.py complete
    python run_complete_system.py demo
    python run_complete_system.py test

🔧 المتطلبات:
    Python 3.7+
    جميع المكونات المطلوبة
""")

async def run_complete_system():
    """تشغيل النظام المتكامل الكامل"""
    print("🚀 بدء تشغيل النظام المتكامل الكامل...")
    
    # إنشاء جميع المكونات
    dashboard = WebDashboard()
    
    try:
        # تهيئة النظام
        print("\n🔧 تهيئة النظام...")
        await dashboard.initialize()
        
        print("\n✅ النظام المتكامل جاهز!")
        print("\n🎯 المكونات النشطة:")
        print("   🌐 Web Dashboard - لوحة التحكم الويبية")
        print("   📋 Task Dispatcher - موزع المهام")
        print("   🤖 Telegram Bot - بوت التواصل")
        print("   🔗 MCP Integration - تكامل الوكيلات")
        
        print("\n💻 يمكنك الآن:")
        print("   - إرسال مهام عبر Telegram Bot")
        print("   - متابعة المهام عبر Web Dashboard")
        print("   - استخدام MCP Agents للتنفيذ")
        print("   - مراقبة النظام في الوقت الفعلي")
        
        # محاكاة استخدام النظام
        print("\n🔄 محاكاة استخدام النظام...")
        
        # إنشاء مهمة تجريبية
        task_data = {
            "user_id": "demo_user",
            "telegram_chat_id": "demo_chat",
            "description": "ابنِ لي React app متقدم",
            "priority": "high",
            "parameters": {"framework": "react", "features": ["routing", "styling", "state_management"]}
        }
        
        task_id = await dashboard.task_dispatcher.create_task(task_data)
        print(f"✅ تم إنشاء مهمة تجريبية: {task_id}")
        
        # تنفيذ المهمة
        print("⚡ تنفيذ المهمة...")
        result = await dashboard.task_dispatcher.execute_task(task_id)
        
        if result["success"]:
            print("✅ تم تنفيذ المهمة بنجاح!")
            print(f"   نوع الكود: {result.get('code_type', 'N/A')}")
            print(f"   اسم الملف: {result.get('file_name', 'N/A')}")
        else:
            print(f"❌ فشل في تنفيذ المهمة: {result.get('error', 'خطأ غير معروف')}")
        
        # عرض بيانات لوحة التحكم
        print("\n📊 بيانات لوحة التحكم:")
        dashboard_data = await dashboard.get_dashboard_data()
        
        print(f"   إجمالي المهام: {dashboard_data['task_overview']['total_tasks']}")
        print(f"   المهام المكتملة: {dashboard_data['task_overview']['tasks_by_status']['completed']}")
        print(f"   المهام قيد التنفيذ: {dashboard_data['task_overview']['tasks_by_status']['in_progress']}")
        
        # عرض مقاييس النظام
        print("\n📈 مقاييس النظام:")
        system_metrics = await dashboard.get_system_metrics()
        
        print(f"   Task Dispatcher: {'نشط' if system_metrics['task_dispatcher']['is_active'] else 'غير نشط'}")
        print(f"   Telegram Bot: {'نشط' if system_metrics['telegram_bot']['is_active'] else 'غير نشط'}")
        print(f"   MCP Integration: {'نشط' if system_metrics['mcp_integration']['is_active'] else 'غير نشط'}")
        print(f"   معدل نجاح المهام: {system_metrics['task_dispatcher']['success_rate']:.2f}")
        
        # انتظار إضافي لمحاكاة العمل المستمر
        print("\n⏳ انتظار إضافي لمحاكاة العمل المستمر...")
        await asyncio.sleep(5)
        
        print("\n🎉 النظام يعمل بنجاح!")
        print("   يمكنك الآن استخدام النظام في الإنتاج")
        print("   أو إيقافه بالضغط على Ctrl+C")
        
        # انتظار مستمر
        try:
            while True:
                await asyncio.sleep(60)
                print(f"🔄 النظام يعمل... {datetime.now().strftime('%H:%M:%S')}")
        except KeyboardInterrupt:
            print("\n⏹️ تم إيقاف النظام بواسطة المستخدم")
        
    except Exception as e:
        print(f"❌ خطأ في النظام المتكامل: {e}")
    
    finally:
        # إغلاق النظام
        await dashboard.shutdown()
        print("✅ تم إغلاق النظام المتكامل")

async def run_dashboard_mode():
    """تشغيل وضع لوحة التحكم"""
    print("🌐 بدء تشغيل لوحة التحكم الويبية...")
    await demo_web_dashboard()

async def run_telegram_mode():
    """تشغيل وضع Telegram Bot"""
    print("🤖 بدء تشغيل Telegram Bot...")
    await demo_telegram_bot_integration()

async def run_dispatcher_mode():
    """تشغيل وضع Task Dispatcher"""
    print("📋 بدء تشغيل Task Dispatcher...")
    await demo_task_dispatcher()

async def run_mcp_mode():
    """تشغيل وضع MCP Integration"""
    print("🔗 بدء تشغيل MCP Integration...")
    await demo_mcp_integration()

async def run_demo_mode():
    """تشغيل وضع العرض التوضيحي"""
    print("🎬 بدء العرض التوضيحي الكامل...")
    
    # تشغيل جميع العروض التوضيحية
    print("\n1️⃣ عرض MCP Integration...")
    await demo_mcp_integration()
    
    print("\n2️⃣ عرض Task Dispatcher...")
    await demo_task_dispatcher()
    
    print("\n3️⃣ عرض Telegram Bot Integration...")
    await demo_telegram_bot_integration()
    
    print("\n4️⃣ عرض Web Dashboard...")
    await demo_web_dashboard()
    
    print("\n🎉 انتهى العرض التوضيحي الكامل!")

async def run_test_mode():
    """تشغيل وضع الاختبار"""
    print("🧪 بدء اختبار جميع المكونات...")
    
    dashboard = WebDashboard()
    
    try:
        # تهيئة النظام
        print("\n🔧 تهيئة النظام للاختبار...")
        await dashboard.initialize()
        
        # اختبار إنشاء المهام
        print("\n📋 اختبار إنشاء المهام...")
        
        test_tasks = [
            {
                "user_id": "test_user_001",
                "telegram_chat_id": "test_chat_001",
                "description": "ابنِ لي Python script",
                "priority": "high"
            },
            {
                "user_id": "test_user_002",
                "telegram_chat_id": "test_chat_002",
                "description": "حلل بيانات JSON",
                "priority": "normal"
            },
            {
                "user_id": "test_user_001",
                "telegram_chat_id": "test_chat_001",
                "description": "اختبر API endpoint",
                "priority": "low"
            }
        ]
        
        created_tasks = []
        for i, task_data in enumerate(test_tasks, 1):
            task_id = await dashboard.task_dispatcher.create_task(task_data)
            created_tasks.append(task_id)
            print(f"   ✅ تم إنشاء المهمة {i}: {task_id}")
        
        # اختبار تنفيذ المهام
        print("\n⚡ اختبار تنفيذ المهام...")
        
        for i, task_id in enumerate(created_tasks, 1):
            print(f"   🔄 تنفيذ المهمة {i}...")
            result = await dashboard.task_dispatcher.execute_task(task_id)
            
            if result["success"]:
                print(f"   ✅ تم تنفيذ المهمة {i} بنجاح")
            else:
                print(f"   ❌ فشل في تنفيذ المهمة {i}: {result.get('error', 'خطأ غير معروف')}")
        
        # اختبار لوحة التحكم
        print("\n📊 اختبار لوحة التحكم...")
        
        dashboard_data = await dashboard.get_dashboard_data()
        print(f"   ✅ تم الحصول على بيانات لوحة التحكم")
        print(f"   📈 إجمالي المهام: {dashboard_data['task_overview']['total_tasks']}")
        
        # اختبار مقاييس النظام
        print("\n📈 اختبار مقاييس النظام...")
        
        system_metrics = await dashboard.get_system_metrics()
        print(f"   ✅ تم الحصول على مقاييس النظام")
        all_components_active = all([
            system_metrics['task_dispatcher']['is_active'],
            system_metrics['telegram_bot']['is_active'],
            system_metrics['mcp_integration']['is_active']
        ])
        print(f"   🔧 جميع المكونات نشطة: {all_components_active}")
        
        # اختبار Telegram Bot
        print("\n🤖 اختبار Telegram Bot...")
        
        test_message = {
            "chat_id": "test_chat_001",
            "user_id": "test_user_001",
            "username": "test_user",
            "text": "ابنِ لي React app"
        }
        
        bot_response = await dashboard.telegram_bot.handle_message(test_message)
        print(f"   ✅ تم معالجة الرسالة: {bot_response['success']}")
        
        # نتائج الاختبار
        print("\n🎯 نتائج الاختبار:")
        print(f"   ✅ إنشاء المهام: {len(created_tasks)}/3")
        completed_tasks = sum(1 for task_id in created_tasks if dashboard.task_dispatcher.active_tasks.get(task_id, {}).get('status') == 'completed')
        print(f"   ✅ تنفيذ المهام: {completed_tasks}/3")
        print(f"   ✅ لوحة التحكم: {'نشطة' if dashboard.is_active else 'غير نشطة'}")
        print(f"   ✅ Telegram Bot: {'نشط' if dashboard.telegram_bot.is_active else 'غير نشط'}")
        print(f"   ✅ MCP Integration: {'نشط' if dashboard.task_dispatcher.mcp_integration and dashboard.task_dispatcher.mcp_integration.is_active else 'غير نشط'}")
        
        print("\n🎉 جميع الاختبارات مكتملة!")
        
    except Exception as e:
        print(f"❌ خطأ في الاختبار: {e}")
    
    finally:
        await dashboard.shutdown()

async def run_status_mode():
    """تشغيل وضع عرض الحالة"""
    print("📊 عرض حالة النظام...")
    
    dashboard = WebDashboard()
    
    try:
        await dashboard.initialize()
        
        # الحصول على حالة النظام
        system_metrics = await dashboard.get_system_metrics()
        
        print(f"\n📊 حالة النظام:")
        print(f"   🕐 الوقت: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        
        print(f"\n🔧 المكونات:")
        print(f"   Task Dispatcher: {'✅ نشط' if system_metrics['task_dispatcher']['is_active'] else '❌ غير نشط'}")
        print(f"   Telegram Bot: {'✅ نشط' if system_metrics['telegram_bot']['is_active'] else '❌ غير نشط'}")
        print(f"   MCP Integration: {'✅ نشط' if system_metrics['mcp_integration']['is_active'] else '❌ غير نشط'}")
        print(f"   Web Dashboard: {'✅ نشط' if system_metrics['dashboard']['is_active'] else '❌ غير نشط'}")
        
        print(f"\n📈 الإحصائيات:")
        print(f"   إجمالي المهام: {system_metrics['task_dispatcher']['total_tasks']}")
        print(f"   المهام المكتملة: {system_metrics['task_dispatcher']['completed_tasks']}")
        print(f"   المهام الفاشلة: {system_metrics['task_dispatcher']['failed_tasks']}")
        print(f"   معدل النجاح: {system_metrics['task_dispatcher']['success_rate']:.2f}")
        
        print(f"\n🤖 Telegram Bot:")
        print(f"   إجمالي الرسائل: {system_metrics['telegram_bot']['total_messages']}")
        print(f"   المهام المنشأة: {system_metrics['telegram_bot']['tasks_created']}")
        print(f"   المستخدمين النشطين: {system_metrics['telegram_bot']['active_users']}")
        print(f"   المحادثات النشطة: {system_metrics['telegram_bot']['active_chats']}")
        
        print(f"\n🔗 MCP Integration:")
        print(f"   إجمالي الوكيلات: {system_metrics['mcp_integration']['total_agents']}")
        print(f"   الوكيلات النشطة: {system_metrics['mcp_integration']['active_agents']}")
        print(f"   إجمالي الأوامر: {system_metrics['mcp_integration']['total_commands']}")
        
        print(f"\n🌐 Web Dashboard:")
        print(f"   إجمالي الطلبات: {system_metrics['dashboard']['total_requests']}")
        print(f"   الجلسات النشطة: {system_metrics['dashboard']['active_sessions']}")
        print(f"   وقت التشغيل: {system_metrics['dashboard']['uptime']:.0f} ثانية")
        
    except Exception as e:
        print(f"❌ خطأ في عرض الحالة: {e}")
    
    finally:
        await dashboard.shutdown()

async def main():
    """الدالة الرئيسية"""
    print_banner()
    
    if len(sys.argv) > 1:
        mode = sys.argv[1].lower()
    else:
        mode = "complete"
    
    print(f"🎯 وضع التشغيل: {mode}")
    print("=" * 60)
    
    try:
        if mode == "complete":
            await run_complete_system()
        elif mode == "dashboard":
            await run_dashboard_mode()
        elif mode == "telegram":
            await run_telegram_mode()
        elif mode == "dispatcher":
            await run_dispatcher_mode()
        elif mode == "mcp":
            await run_mcp_mode()
        elif mode == "demo":
            await run_demo_mode()
        elif mode == "test":
            await run_test_mode()
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
