#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
AuraOS MCP Agents - ملف التشغيل الرئيسي
تشغيل نظام MCP Agents المتكامل مع Learning Hub
"""

import asyncio
import sys
import os
from datetime import datetime
from pathlib import Path

# إضافة المسار للاستيراد
current_dir = Path(__file__).parent
sys.path.append(str(current_dir))

from auraos_mcp_integration import AuraOSMCPIntegration, demo_mcp_integration
from mcp_agent_template import demo_mcp_agent_template
from httpie_agent import demo_httpie_agent
from jq_agent import demo_jq_agent

def print_banner():
    """طباعة شعار النظام"""
    print("""
🤖 AuraOS MCP Agents - نظام الوكيلات الذكية
===============================================

🎯 تحويل CLI Tools إلى MCP Agents متخصصين:
   🌐 HTTPie Agent - للتعامل مع APIs
   📊 JQ Agent - لمعالجة JSON
   🔍 Ripgrep Agent - للبحث في الكود
   📁 FZF Agent - للتنقل في الملفات
   📈 Htop Agent - لمراقبة النظام
   🌐 Ngrok Agent - للنفق

🧠 تكامل مع Learning Hub
📡 بروتوكول MCP موحد
🔄 سير عمل ذكي متكامل

🚀 الإصدار: 0.4.0-MCP
""")

def print_usage():
    """طباعة تعليمات الاستخدام"""
    print("""
📖 الاستخدام:
    python run_mcp_agents.py [mode]

🎯 الأوضاع المتاحة:
    demo         - عرض توضيحي كامل للنظام
    integration  - تشغيل التكامل الكامل
    template     - عرض قالب MCP Agent
    httpie       - اختبار HTTPie Agent
    jq           - اختبار JQ Agent
    workflow     - اختبار سير عمل API
    status       - عرض حالة النظام
    help         - عرض هذه المساعدة

💡 الأمثلة:
    python run_mcp_agents.py demo
    python run_mcp_agents.py integration
    python run_mcp_agents.py workflow

🔧 المتطلبات:
    Python 3.7+
    httpie (اختياري)
    jq (اختياري)
""")

async def run_demo_mode():
    """تشغيل وضع العرض التوضيحي"""
    print("🎬 بدء العرض التوضيحي الكامل للنظام...")
    await demo_mcp_integration()

async def run_integration_mode():
    """تشغيل وضع التكامل الكامل"""
    print("🔗 بدء تشغيل التكامل الكامل...")
    
    integration = AuraOSMCPIntegration()
    
    try:
        await integration.initialize()
        
        print("\n🎯 التكامل جاهز! يمكنك الآن:")
        print("   - إرسال طلبات HTTP عبر HTTPie Agent")
        print("   - معالجة JSON عبر JQ Agent")
        print("   - إنشاء سير عمل متكامل")
        print("   - تحليل استجابات API")
        
        # محاكاة استخدام النظام
        print("\n💻 محاكاة استخدام النظام...")
        
        # اختبار سير عمل بسيط
        workflow = await integration.create_api_workflow(
            "https://httpbin.org/json",
            ".slideshow.slides[0].title"
        )
        
        if workflow["success"]:
            print("✅ تم تنفيذ سير عمل API بنجاح")
        else:
            print(f"❌ فشل في تنفيذ سير عمل API: {workflow.get('error', 'خطأ غير معروف')}")
        
        # انتظار إضافي
        print("\n⏳ انتظار إضافي...")
        await asyncio.sleep(3)
        
    except Exception as e:
        print(f"❌ خطأ في التكامل: {e}")
    
    finally:
        await integration.shutdown()

async def run_template_mode():
    """تشغيل وضع القالب"""
    print("📋 بدء عرض قالب MCP Agent...")
    await demo_mcp_agent_template()

async def run_httpie_mode():
    """تشغيل وضع HTTPie Agent"""
    print("🌐 بدء اختبار HTTPie Agent...")
    await demo_httpie_agent()

async def run_jq_mode():
    """تشغيل وضع JQ Agent"""
    print("📊 بدء اختبار JQ Agent...")
    await demo_jq_agent()

async def run_workflow_mode():
    """تشغيل وضع سير العمل"""
    print("🔄 بدء اختبار سير عمل API...")
    
    integration = AuraOSMCPIntegration()
    
    try:
        await integration.initialize()
        
        # اختبار سير عمل متقدم
        print("\n🔄 اختبار سير عمل متقدم...")
        
        # سير عمل 1: تحليل API
        print("\n1️⃣ تحليل API...")
        analysis = await integration.analyze_api_response("https://httpbin.org/json")
        
        if analysis["success"]:
            print("✅ تم تحليل API بنجاح:")
            analysis_data = analysis["analysis"]
            print(f"   HTTP Status: {analysis_data['http_status']}")
            print(f"   Content Type: {analysis_data['content_type']}")
            print(f"   Response Size: {analysis_data['response_size']} bytes")
        else:
            print(f"❌ فشل في تحليل API: {analysis.get('error', 'خطأ غير معروف')}")
        
        # سير عمل 2: معالجة البيانات
        print("\n2️⃣ معالجة البيانات...")
        
        workflow = await integration.create_api_workflow(
            "https://httpbin.org/json",
            ".slideshow.slides | map(.title)"
        )
        
        if workflow["success"]:
            print("✅ تم معالجة البيانات بنجاح:")
            if "processed_data" in workflow:
                processed = workflow["processed_data"]
                print(f"   البيانات المعالجة: {processed['parsed_json']}")
        else:
            print(f"❌ فشل في معالجة البيانات: {workflow.get('error', 'خطأ غير معروف')}")
        
        # سير عمل 3: تجميع البيانات
        print("\n3️⃣ تجميع البيانات...")
        
        # بيانات تجريبية للتجميع
        test_data = '{"users": [{"name": "أحمد", "city": "القاهرة"}, {"name": "فاطمة", "city": "الإسكندرية"}, {"name": "محمد", "city": "القاهرة"}]}'
        
        aggregate_result = await integration.execute_agent_command("jq-agent", "aggregate", {
            "filter": {"type": "aggregate", "field": "city", "operation": "count"},
            "input": test_data
        })
        
        if aggregate_result["success"]:
            print("✅ تم تجميع البيانات بنجاح:")
            aggregated = aggregate_result["result"]["parsed_json"]
            print(f"   توزيع المستخدمين حسب المدينة: {aggregated}")
        else:
            print(f"❌ فشل في تجميع البيانات: {aggregate_result.get('error', 'خطأ غير معروف')}")
        
        print("\n🎉 اكتمل اختبار سير العمل!")
        
    except Exception as e:
        print(f"❌ خطأ في سير العمل: {e}")
    
    finally:
        await integration.shutdown()

async def run_status_mode():
    """تشغيل وضع عرض الحالة"""
    print("📊 عرض حالة النظام...")
    
    integration = AuraOSMCPIntegration()
    
    try:
        await integration.initialize()
        
        status = await integration.get_integration_status()
        
        print(f"\n📊 حالة النظام:")
        print(f"   التكامل: {status['integration_name']}")
        print(f"   الإصدار: {status['version']}")
        print(f"   الحالة: {'نشط' if status['is_active'] else 'غير نشط'}")
        
        print(f"\n🤖 الوكيلات المسجلة:")
        for agent_name in status['registered_agents']:
            print(f"   - {agent_name}")
        
        print(f"\n📈 الإحصائيات:")
        stats = status['integration_stats']
        print(f"   إجمالي الأوامر: {stats['total_commands_executed']}")
        print(f"   الأوامر الناجحة: {stats['successful_commands']}")
        print(f"   الأوامر الفاشلة: {stats['failed_commands']}")
        print(f"   معدل النجاح: {stats.get('success_rate', 0):.2f}")
        
        if status['agent_registry_status']:
            registry_status = status['agent_registry_status']
            print(f"\n🔧 حالة سجل الوكيلات:")
            print(f"   إجمالي الوكيلات: {registry_status['total_agents']}")
            print(f"   الوكيلات النشطة: {registry_status['active_agents']}")
            
            print(f"\n📋 تفاصيل الوكيلات:")
            for agent_name, agent_info in registry_status['agents'].items():
                print(f"   {agent_name}:")
                print(f"     - القدرات: {agent_info['capabilities']}")
                print(f"     - الأوامر: {agent_info['commands']}")
                print(f"     - الحالة: {'نشط' if agent_info['is_active'] else 'غير نشط'}")
        
    except Exception as e:
        print(f"❌ خطأ في عرض الحالة: {e}")
    
    finally:
        await integration.shutdown()

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
        elif mode == "integration":
            await run_integration_mode()
        elif mode == "template":
            await run_template_mode()
        elif mode == "httpie":
            await run_httpie_mode()
        elif mode == "jq":
            await run_jq_mode()
        elif mode == "workflow":
            await run_workflow_mode()
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
