#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Learning Brain Hub - ملف التشغيل الرئيسي
تشغيل النظام الكامل واختبار جميع المكونات
"""

import asyncio
import sys
import os
from datetime import datetime

# إضافة المسار الحالي للاستيراد
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from learning_brain_hub import LearningBrainHub

async def run_quick_test():
    """اختبار سريع للنظام"""
    print("🚀 بدء الاختبار السريع لـ Learning Brain Hub")
    print("=" * 60)
    
    brain_hub = LearningBrainHub()
    
    try:
        # تهيئة النظام
        await brain_hub.initialize()
        
        # اختبار جلسة تعلم بسيطة
        print("\n📚 اختبار جلسة تعلم بسيطة...")
        
        session_id = await brain_hub.start_learning_session(
            "test_user",
            ["programming"],
            {
                "level": "beginner",
                "language": "python",
                "topic": "basic_functions"
            }
        )
        
        if session_id:
            print(f"✅ تم إنشاء جلسة التعلم: {session_id}")
            
            # انتظار معالجة المهمة
            await asyncio.sleep(2)
            
            # عرض النتائج
            status = await brain_hub.get_system_status()
            print(f"\n📊 النتائج:")
            print(f"   المهام المكتملة: {status['system_stats']['successful_tasks']}")
            print(f"   متوسط الأداء: {status['system_stats']['average_performance']:.2f}")
            
            return True
        else:
            print("❌ فشل في إنشاء جلسة التعلم")
            return False
            
    except Exception as e:
        print(f"❌ خطأ في الاختبار: {e}")
        return False
    
    finally:
        await brain_hub.shutdown()

async def run_comprehensive_test():
    """اختبار شامل للنظام"""
    print("🧪 بدء الاختبار الشامل لـ Learning Brain Hub")
    print("=" * 60)
    
    brain_hub = LearningBrainHub()
    
    try:
        # تهيئة النظام
        await brain_hub.initialize()
        
        # اختبارات متعددة
        test_cases = [
            {
                "name": "مبتدئ في البرمجة",
                "user_id": "beginner_001",
                "goals": ["programming"],
                "context": {"level": "beginner", "language": "python"}
            },
            {
                "name": "متوسط في الذكاء الاصطناعي",
                "user_id": "intermediate_001",
                "goals": ["ai", "machine_learning"],
                "context": {"level": "intermediate", "focus": "algorithms"}
            },
            {
                "name": "متقدم في حل المشاكل",
                "user_id": "advanced_001",
                "goals": ["problem_solving", "optimization"],
                "context": {"level": "advanced", "complexity": "high"}
            }
        ]
        
        successful_sessions = 0
        
        for i, test_case in enumerate(test_cases, 1):
            print(f"\n🎯 اختبار {i}: {test_case['name']}")
            
            session_id = await brain_hub.start_learning_session(
                test_case["user_id"],
                test_case["goals"],
                test_case["context"]
            )
            
            if session_id:
                print(f"   ✅ تم إنشاء الجلسة: {session_id}")
                successful_sessions += 1
                
                # انتظار معالجة المهمة
                await asyncio.sleep(1)
            else:
                print(f"   ❌ فشل في إنشاء الجلسة")
        
        # عرض النتائج النهائية
        print(f"\n📊 النتائج النهائية:")
        status = await brain_hub.get_system_status()
        
        print(f"   الجلسات الناجحة: {successful_sessions}/{len(test_cases)}")
        print(f"   المهام المكتملة: {status['system_stats']['successful_tasks']}")
        print(f"   المهام الفاشلة: {status['system_stats']['failed_tasks']}")
        print(f"   متوسط الأداء: {status['system_stats']['average_performance']:.2f}")
        print(f"   وقت التشغيل: {status['system_stats']['uptime']:.1f} ثانية")
        
        # عرض حالة المكونات
        print(f"\n🔧 حالة المكونات:")
        components = status['components']
        
        if components['auraos_hub']:
            hub = components['auraos_hub']
            print(f"   AuraOS Hub: {hub['total_tasks']} مهمة، {hub['registered_agents']} وكيل")
        
        if components['mcp_channel']:
            channel = components['mcp_channel']
            print(f"   MCP Channel: {channel['registered_components']} مكون، {channel['stats']['messages_sent']} رسالة مرسلة")
        
        print(f"   AI Agents: {len(components['ai_agents'])} وكيل")
        for agent_id, agent_status in components['ai_agents'].items():
            print(f"     - {agent_id}: {agent_status['total_tasks']} مهمة، معدل نجاح {agent_status['success_rate']:.2f}")
        
        return successful_sessions == len(test_cases)
        
    except Exception as e:
        print(f"❌ خطأ في الاختبار الشامل: {e}")
        return False
    
    finally:
        await brain_hub.shutdown()

async def run_interactive_demo():
    """عرض تفاعلي للنظام"""
    print("🎮 بدء العرض التفاعلي لـ Learning Brain Hub")
    print("=" * 60)
    
    brain_hub = LearningBrainHub()
    
    try:
        await brain_hub.initialize()
        
        print("\n🎯 يمكنك إنشاء جلسات تعلم مخصصة!")
        print("أدخل 'quit' للخروج")
        
        session_count = 0
        
        while True:
            print(f"\n--- جلسة تعلم #{session_count + 1} ---")
            
            # إدخال بيانات المستخدم
            user_id = input("معرف المستخدم: ").strip()
            if user_id.lower() == 'quit':
                break
            
            goals_input = input("أهداف التعلم (مفصولة بفاصلة): ").strip()
            goals = [goal.strip() for goal in goals_input.split(',') if goal.strip()]
            
            level = input("المستوى (beginner/intermediate/advanced): ").strip() or "intermediate"
            language = input("اللغة البرمجية: ").strip() or "python"
            
            context = {
                "level": level,
                "language": language,
                "timestamp": datetime.now().isoformat()
            }
            
            print(f"\n🚀 إنشاء جلسة تعلم...")
            session_id = await brain_hub.start_learning_session(user_id, goals, context)
            
            if session_id:
                print(f"✅ تم إنشاء جلسة التعلم: {session_id}")
                session_count += 1
                
                # انتظار معالجة المهمة
                print("⏳ معالجة المهمة...")
                await asyncio.sleep(2)
                
                # عرض النتائج
                status = await brain_hub.get_system_status()
                print(f"📊 المهام المكتملة حتى الآن: {status['system_stats']['successful_tasks']}")
            else:
                print("❌ فشل في إنشاء جلسة التعلم")
            
            # سؤال عن الاستمرار
            continue_demo = input("\nهل تريد إنشاء جلسة أخرى؟ (y/n): ").strip().lower()
            if continue_demo != 'y':
                break
        
        print(f"\n🎉 انتهى العرض التفاعلي! تم إنشاء {session_count} جلسة تعلم")
        
    except KeyboardInterrupt:
        print("\n\n⏹️ تم إيقاف العرض التفاعلي بواسطة المستخدم")
    except Exception as e:
        print(f"❌ خطأ في العرض التفاعلي: {e}")
    
    finally:
        await brain_hub.shutdown()

def print_usage():
    """طباعة تعليمات الاستخدام"""
    print("""
🧠 Learning Brain Hub - نظام التعلم الذكي

الاستخدام:
    python run_learning_brain.py [mode]

الأوضاع المتاحة:
    quick       - اختبار سريع للنظام
    full        - اختبار شامل للنظام  
    interactive - عرض تفاعلي للنظام
    demo        - عرض توضيحي كامل (افتراضي)

الأمثلة:
    python run_learning_brain.py quick
    python run_learning_brain.py interactive
    python run_learning_brain.py

المكونات:
    🧠 AuraOS Hub - رأس الحلقة الرئيسي
    🤖 AI Agents - وكلاء التعلم الذكي
    📡 MCP Channel - قناة التواصل الذكية
""")

async def main():
    """الدالة الرئيسية"""
    if len(sys.argv) > 1:
        mode = sys.argv[1].lower()
    else:
        mode = "demo"
    
    print(f"🎬 بدء Learning Brain Hub في وضع: {mode}")
    print("=" * 60)
    
    if mode == "quick":
        success = await run_quick_test()
        print(f"\n{'✅ نجح الاختبار السريع!' if success else '❌ فشل الاختبار السريع!'}")
        
    elif mode == "full":
        success = await run_comprehensive_test()
        print(f"\n{'✅ نجح الاختبار الشامل!' if success else '❌ فشل الاختبار الشامل!'}")
        
    elif mode == "interactive":
        await run_interactive_demo()
        
    elif mode == "demo":
        # تشغيل العرض التوضيحي الكامل
        from learning_brain_hub import demo_learning_brain_hub
        await demo_learning_brain_hub()
        
    elif mode == "help":
        print_usage()
        
    else:
        print(f"❌ وضع غير معروف: {mode}")
        print_usage()

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n\n⏹️ تم إيقاف البرنامج بواسطة المستخدم")
    except Exception as e:
        print(f"\n❌ خطأ عام: {e}")
        sys.exit(1)
