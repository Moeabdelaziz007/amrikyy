#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
AuraOS Learning MVP - ملف التشغيل الرئيسي
تشغيل النظام المتكامل مع AuraOS
"""

import asyncio
import sys
import os
from datetime import datetime
from pathlib import Path

# إضافة المسار للاستيراد
current_dir = Path(__file__).parent
sys.path.append(str(current_dir))

from auraos_learning_api_server import AuraOSLearningAPIServer, demo_api_server
from auraos_learning_integration import AuraOSLearningIntegration, demo_auraos_integration

def print_banner():
    """طباعة شعار النظام"""
    print("""
🧠 AuraOS Learning Brain Hub - MVP
=====================================

🎯 نظام التعلم الذكي المتكامل مع AuraOS
🔗 رأس الحلقة + AI Agents + MCP Channel

📋 المكونات:
   🧠 AuraOS Hub - المركز الرئيسي
   🤖 AI Agents - وكلاء التعلم الذكي  
   📡 MCP Channel - قناة التواصل
   🌐 API Server - واجهة التكامل

🚀 الإصدار: 0.2.0-MVP
""")

def print_usage():
    """طباعة تعليمات الاستخدام"""
    print("""
📖 الاستخدام:
    python run_mvp.py [mode]

🎯 الأوضاع المتاحة:
    server       - تشغيل خادم API
    integration  - اختبار التكامل فقط
    demo         - عرض توضيحي كامل
    test         - اختبارات سريعة
    help         - عرض هذه المساعدة

💡 الأمثلة:
    python run_mvp.py server
    python run_mvp.py demo
    python run_mvp.py test

🔧 المتطلبات:
    Python 3.7+
    جميع الملفات في نفس المجلد
""")

async def run_server_mode():
    """تشغيل وضع الخادم"""
    print("🌐 بدء تشغيل خادم AuraOS Learning API...")
    
    server = AuraOSLearningAPIServer("localhost", 8080)
    
    try:
        await server.initialize()
        await server.start_server()
    except KeyboardInterrupt:
        print("\n⏹️ تم إيقاف الخادم بواسطة المستخدم")
    except Exception as e:
        print(f"❌ خطأ في الخادم: {e}")
    finally:
        await server.shutdown()

async def run_integration_mode():
    """تشغيل وضع التكامل"""
    print("🔗 بدء اختبار التكامل...")
    await demo_auraos_integration()

async def run_demo_mode():
    """تشغيل وضع العرض التوضيحي"""
    print("🎬 بدء العرض التوضيحي الكامل...")
    
    # عرض توضيحي للتكامل
    print("\n" + "="*60)
    print("🔗 جزء 1: اختبار التكامل")
    print("="*60)
    await demo_auraos_integration()
    
    # عرض توضيحي لخادم API
    print("\n" + "="*60)
    print("🌐 جزء 2: اختبار خادم API")
    print("="*60)
    await demo_api_server()

async def run_test_mode():
    """تشغيل وضع الاختبارات"""
    print("🧪 بدء الاختبارات السريعة...")
    
    # اختبار التكامل السريع
    print("\n1️⃣ اختبار التكامل السريع...")
    integration = AuraOSLearningIntegration()
    
    try:
        await integration.initialize()
        
        # اختبار إنشاء جلسة تعلم
        session_request = {
            "user_id": "test_user",
            "goals": ["programming"],
            "context": {"level": "beginner"}
        }
        
        response = await integration._handle_learning_session_request(session_request)
        
        if response["success"]:
            print(f"   ✅ نجح اختبار التكامل: {response['session_id']}")
        else:
            print(f"   ❌ فشل اختبار التكامل: {response.get('message', 'خطأ غير معروف')}")
        
    except Exception as e:
        print(f"   ❌ خطأ في اختبار التكامل: {e}")
    
    finally:
        await integration.shutdown()
    
    # اختبار خادم API السريع
    print("\n2️⃣ اختبار خادم API السريع...")
    server = AuraOSLearningAPIServer("localhost", 8080)
    
    try:
        await server.initialize()
        
        # اختبار فحص الصحة
        health_response = await server.handle_request("GET", "/api/learning/health")
        
        if health_response["success"]:
            print("   ✅ نجح اختبار خادم API")
        else:
            print(f"   ❌ فشل اختبار خادم API: {health_response.get('error', 'خطأ غير معروف')}")
        
    except Exception as e:
        print(f"   ❌ خطأ في اختبار خادم API: {e}")
    
    finally:
        await server.shutdown()
    
    print("\n🎉 انتهت الاختبارات السريعة!")

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
        if mode == "server":
            await run_server_mode()
        elif mode == "integration":
            await run_integration_mode()
        elif mode == "demo":
            await run_demo_mode()
        elif mode == "test":
            await run_test_mode()
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
