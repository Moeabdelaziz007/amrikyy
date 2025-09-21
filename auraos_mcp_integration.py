#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
AuraOS MCP Agents Integration - دمج MCP Agents مع Learning Hub
نظام موحد لإدارة وتشغيل MCP Agents داخل AuraOS
"""

import asyncio
import json
import sys
import os
from datetime import datetime
from typing import Dict, List, Any, Optional
from pathlib import Path

# إضافة المسار للاستيراد
sys.path.append(str(Path(__file__).parent))

from mcp_agent_template import MCPAgentRegistry
from httpie_agent import HTTPieAgent, create_httpie_manifest
from jq_agent import JQAgent, create_jq_manifest

class AuraOSMCPIntegration:
    """
    تكامل MCP Agents مع AuraOS Learning Hub
    """
    
    def __init__(self):
        self.name = "AuraOS MCP Agents Integration"
        self.version = "0.4.0-MCP"
        self.is_active = False
        
        # المكونات الأساسية
        self.agent_registry: Optional[MCPAgentRegistry] = None
        self.registered_agents: Dict[str, Any] = {}
        
        # إحصائيات التكامل
        self.integration_stats = {
            "total_agents": 0,
            "active_agents": 0,
            "total_commands_executed": 0,
            "successful_commands": 0,
            "failed_commands": 0,
            "start_time": None
        }
        
        print(f"🔗 تم إنشاء {self.name} v{self.version}")

    async def initialize(self):
        """تهيئة التكامل"""
        print("🚀 تهيئة AuraOS MCP Agents Integration...")
        
        try:
            # 1. إنشاء سجل الوكيلات
            print("   📋 إنشاء سجل الوكيلات...")
            self.agent_registry = MCPAgentRegistry()
            
            # 2. تسجيل الوكيلات الأساسية
            print("   🤖 تسجيل الوكيلات الأساسية...")
            await self._register_basic_agents()
            
            # 3. بدء مراقبة التكامل
            print("   👁️ بدء مراقبة التكامل...")
            self.monitoring_task = asyncio.create_task(self._monitor_integration())
            
            self.is_active = True
            self.integration_stats["start_time"] = datetime.now()
            
            print("✅ AuraOS MCP Agents Integration جاهز!")
            
        except Exception as e:
            print(f"❌ خطأ في تهيئة التكامل: {e}")
            await self.shutdown()
            raise

    async def _register_basic_agents(self):
        """تسجيل الوكيلات الأساسية"""
        try:
            # تسجيل HTTPie Agent
            print("     🌐 تسجيل HTTPie Agent...")
            httpie_manifest = create_httpie_manifest()
            httpie_manifest_path = "httpie_agent_manifest.json"
            httpie_manifest.save(httpie_manifest_path)
            
            httpie_agent = HTTPieAgent(httpie_manifest_path)
            success = await self.agent_registry.register_agent(httpie_agent)
            
            if success:
                self.registered_agents["httpie-agent"] = httpie_agent
                self.integration_stats["total_agents"] += 1
                self.integration_stats["active_agents"] += 1
                print("       ✅ تم تسجيل HTTPie Agent")
            else:
                print("       ❌ فشل في تسجيل HTTPie Agent")
            
            # تسجيل JQ Agent
            print("     📊 تسجيل JQ Agent...")
            jq_manifest = create_jq_manifest()
            jq_manifest_path = "jq_agent_manifest.json"
            jq_manifest.save(jq_manifest_path)
            
            jq_agent = JQAgent(jq_manifest_path)
            success = await self.agent_registry.register_agent(jq_agent)
            
            if success:
                self.registered_agents["jq-agent"] = jq_agent
                self.integration_stats["total_agents"] += 1
                self.integration_stats["active_agents"] += 1
                print("       ✅ تم تسجيل JQ Agent")
            else:
                print("       ❌ فشل في تسجيل JQ Agent")
            
        except Exception as e:
            print(f"❌ خطأ في تسجيل الوكيلات الأساسية: {e}")
            raise

    async def execute_agent_command(self, agent_name: str, command_name: str, params: Dict[str, Any]) -> Dict[str, Any]:
        """تنفيذ أمر وكيل"""
        try:
            self.integration_stats["total_commands_executed"] += 1
            
            result = await self.agent_registry.execute_agent_command(agent_name, command_name, params)
            
            if result["success"]:
                self.integration_stats["successful_commands"] += 1
            else:
                self.integration_stats["failed_commands"] += 1
            
            return result
            
        except Exception as e:
            self.integration_stats["failed_commands"] += 1
            return {
                "success": False,
                "error": str(e),
                "timestamp": datetime.now().isoformat()
            }

    async def create_api_workflow(self, api_url: str, json_filter: str = None) -> Dict[str, Any]:
        """إنشاء سير عمل API"""
        try:
            print(f"🔄 إنشاء سير عمل API: {api_url}")
            
            workflow_steps = []
            
            # الخطوة 1: إرسال طلب HTTP
            print("   📤 إرسال طلب HTTP...")
            http_result = await self.execute_agent_command("httpie-agent", "get", {
                "url": api_url,
                "options": {"verbose": True}
            })
            
            workflow_steps.append({
                "step": 1,
                "agent": "httpie-agent",
                "action": "GET",
                "success": http_result["success"],
                "result": http_result.get("result", {})
            })
            
            if not http_result["success"]:
                return {
                    "success": False,
                    "error": "فشل في إرسال طلب HTTP",
                    "workflow_steps": workflow_steps
                }
            
            # الخطوة 2: معالجة JSON (إذا كان هناك فلتر)
            if json_filter and http_result["result"].get("has_json", False):
                print("   📊 معالجة JSON...")
                
                json_data = http_result["result"]["raw_output"]
                
                jq_result = await self.execute_agent_command("jq-agent", "parse", {
                    "filter": json_filter,
                    "input": json_data
                })
                
                workflow_steps.append({
                    "step": 2,
                    "agent": "jq-agent",
                    "action": "parse",
                    "success": jq_result["success"],
                    "result": jq_result.get("result", {})
                })
                
                if jq_result["success"]:
                    return {
                        "success": True,
                        "workflow_steps": workflow_steps,
                        "final_result": jq_result["result"],
                        "api_response": http_result["result"],
                        "processed_data": jq_result["result"]
                    }
            
            # إرجاع النتيجة بدون معالجة JSON
            return {
                "success": True,
                "workflow_steps": workflow_steps,
                "final_result": http_result["result"],
                "api_response": http_result["result"]
            }
            
        except Exception as e:
            print(f"❌ خطأ في إنشاء سير عمل API: {e}")
            return {
                "success": False,
                "error": str(e),
                "workflow_steps": workflow_steps if 'workflow_steps' in locals() else []
            }

    async def analyze_api_response(self, api_url: str) -> Dict[str, Any]:
        """تحليل استجابة API"""
        try:
            print(f"🔍 تحليل استجابة API: {api_url}")
            
            # الحصول على البيانات
            http_result = await self.execute_agent_command("httpie-agent", "get", {
                "url": api_url,
                "options": {"verbose": True}
            })
            
            if not http_result["success"]:
                return {
                    "success": False,
                    "error": "فشل في الحصول على بيانات API"
                }
            
            analysis = {
                "api_url": api_url,
                "http_status": http_result["result"]["http_info"].get("status_code"),
                "content_type": http_result["result"]["http_info"].get("content_type"),
                "response_size": http_result["result"]["response_size"],
                "has_json": http_result["result"]["has_json"],
                "analysis_timestamp": datetime.now().isoformat()
            }
            
            # تحليل JSON إذا كان متوفراً
            if http_result["result"]["has_json"]:
                json_data = http_result["result"]["raw_output"]
                
                # استخراج المفاتيح الرئيسية
                keys_result = await self.execute_agent_command("jq-agent", "parse", {
                    "filter": "keys",
                    "input": json_data
                })
                
                if keys_result["success"]:
                    analysis["json_keys"] = keys_result["result"]["parsed_json"]
                
                # تحليل نوع البيانات
                type_result = await self.execute_agent_command("jq-agent", "parse", {
                    "filter": "type",
                    "input": json_data
                })
                
                if type_result["success"]:
                    analysis["json_type"] = type_result["result"]["parsed_json"]
                
                # تحليل حجم البيانات
                length_result = await self.execute_agent_command("jq-agent", "parse", {
                    "filter": "length",
                    "input": json_data
                })
                
                if length_result["success"]:
                    analysis["json_length"] = length_result["result"]["parsed_json"]
            
            return {
                "success": True,
                "analysis": analysis,
                "raw_response": http_result["result"]
            }
            
        except Exception as e:
            print(f"❌ خطأ في تحليل استجابة API: {e}")
            return {
                "success": False,
                "error": str(e)
            }

    async def _monitor_integration(self):
        """مراقبة التكامل"""
        print("👁️ بدء مراقبة التكامل...")
        
        while self.is_active:
            try:
                # تحديث وقت التشغيل
                if self.integration_stats["start_time"]:
                    uptime = (datetime.now() - self.integration_stats["start_time"]).total_seconds()
                    self.integration_stats["uptime"] = uptime
                
                # تحديث عدد الوكيلات النشطة
                if self.agent_registry:
                    registry_status = await self.agent_registry.get_registry_status()
                    self.integration_stats["active_agents"] = registry_status["active_agents"]
                
                # حساب معدل النجاح
                total_commands = self.integration_stats["total_commands_executed"]
                if total_commands > 0:
                    success_rate = self.integration_stats["successful_commands"] / total_commands
                    self.integration_stats["success_rate"] = success_rate
                
                # انتظار قبل المراقبة التالية
                await asyncio.sleep(60)  # مراقبة كل دقيقة
                
            except Exception as e:
                print(f"❌ خطأ في مراقبة التكامل: {e}")
                await asyncio.sleep(10)

    async def get_integration_status(self) -> Dict[str, Any]:
        """الحصول على حالة التكامل"""
        status = {
            "integration_name": self.name,
            "version": self.version,
            "is_active": self.is_active,
            "integration_stats": self.integration_stats.copy(),
            "registered_agents": list(self.registered_agents.keys()),
            "agent_registry_status": None
        }
        
        if self.agent_registry:
            status["agent_registry_status"] = await self.agent_registry.get_registry_status()
        
        return status

    async def shutdown(self):
        """إغلاق التكامل"""
        print("🔄 إغلاق AuraOS MCP Agents Integration...")
        
        self.is_active = False
        
        # إلغاء مهمة المراقبة
        if hasattr(self, 'monitoring_task'):
            self.monitoring_task.cancel()
        
        # إغلاق سجل الوكيلات
        if self.agent_registry:
            await self.agent_registry.shutdown()
        
        # تنظيف ملفات التعريف
        for manifest_file in ["httpie_agent_manifest.json", "jq_agent_manifest.json"]:
            if os.path.exists(manifest_file):
                os.remove(manifest_file)
                print(f"🗑️ تم حذف ملف التعريف: {manifest_file}")
        
        print("✅ تم إغلاق AuraOS MCP Agents Integration")

# مثال على الاستخدام
async def demo_mcp_integration():
    """عرض توضيحي لتكامل MCP Agents"""
    print("🎬 بدء العرض التوضيحي لتكامل MCP Agents")
    print("=" * 60)
    
    integration = AuraOSMCPIntegration()
    
    try:
        # تهيئة التكامل
        await integration.initialize()
        
        # اختبار سير عمل API
        print("\n🔄 اختبار سير عمل API...")
        
        api_workflow = await integration.create_api_workflow(
            "https://httpbin.org/json",
            ".slideshow.slides[0].title"
        )
        
        if api_workflow["success"]:
            print("✅ تم إنشاء سير عمل API بنجاح:")
            print(f"   عدد الخطوات: {len(api_workflow['workflow_steps'])}")
            
            for step in api_workflow["workflow_steps"]:
                print(f"   الخطوة {step['step']}: {step['agent']} - {step['action']} ({'✅' if step['success'] else '❌'})")
            
            if "processed_data" in api_workflow:
                print(f"   البيانات المعالجة: {api_workflow['processed_data']['parsed_json']}")
        else:
            print(f"❌ فشل في إنشاء سير عمل API: {api_workflow.get('error', 'خطأ غير معروف')}")
        
        # اختبار تحليل API
        print("\n🔍 اختبار تحليل API...")
        
        api_analysis = await integration.analyze_api_response("https://httpbin.org/json")
        
        if api_analysis["success"]:
            print("✅ تم تحليل API بنجاح:")
            analysis = api_analysis["analysis"]
            print(f"   HTTP Status: {analysis['http_status']}")
            print(f"   Content Type: {analysis['content_type']}")
            print(f"   Response Size: {analysis['response_size']} bytes")
            print(f"   Has JSON: {analysis['has_json']}")
            
            if analysis.get("json_keys"):
                print(f"   JSON Keys: {analysis['json_keys']}")
            
            if analysis.get("json_type"):
                print(f"   JSON Type: {analysis['json_type']}")
        else:
            print(f"❌ فشل في تحليل API: {api_analysis.get('error', 'خطأ غير معروف')}")
        
        # اختبار أوامر فردية
        print("\n⚡ اختبار أوامر فردية...")
        
        # اختبار HTTPie Agent
        http_result = await integration.execute_agent_command("httpie-agent", "get", {
            "url": "https://httpbin.org/get",
            "query_params": {"test": "auraos"}
        })
        
        if http_result["success"]:
            print("✅ تم تنفيذ أمر HTTPie بنجاح")
        else:
            print(f"❌ فشل في تنفيذ أمر HTTPie: {http_result.get('error', 'خطأ غير معروف')}")
        
        # اختبار JQ Agent
        test_json = '{"users": [{"name": "أحمد", "age": 25}, {"name": "فاطمة", "age": 30}]}'
        
        jq_result = await integration.execute_agent_command("jq-agent", "parse", {
            "filter": ".users[].name",
            "input": test_json
        })
        
        if jq_result["success"]:
            print("✅ تم تنفيذ أمر JQ بنجاح:")
            print(f"   النتيجة: {jq_result['result']['parsed_json']}")
        else:
            print(f"❌ فشل في تنفيذ أمر JQ: {jq_result.get('error', 'خطأ غير معروف')}")
        
        # عرض حالة التكامل
        print("\n📊 حالة التكامل:")
        status = await integration.get_integration_status()
        
        print(f"   التكامل: {status['integration_name']} v{status['version']}")
        print(f"   الحالة: {'نشط' if status['is_active'] else 'غير نشط'}")
        print(f"   الوكيلات المسجلة: {status['registered_agents']}")
        
        stats = status['integration_stats']
        print(f"   إجمالي الأوامر: {stats['total_commands_executed']}")
        print(f"   الأوامر الناجحة: {stats['successful_commands']}")
        print(f"   الأوامر الفاشلة: {stats['failed_commands']}")
        print(f"   معدل النجاح: {stats.get('success_rate', 0):.2f}")
        
        # عرض حالة سجل الوكيلات
        if status['agent_registry_status']:
            registry_status = status['agent_registry_status']
            print(f"\n🔧 حالة سجل الوكيلات:")
            print(f"   إجمالي الوكيلات: {registry_status['total_agents']}")
            print(f"   الوكيلات النشطة: {registry_status['active_agents']}")
            
            for agent_name, agent_info in registry_status['agents'].items():
                print(f"   - {agent_name}: {agent_info['capabilities']}")
        
        # انتظار إضافي لمحاكاة العمل
        print("\n⏳ انتظار إضافي لمحاكاة العمل...")
        await asyncio.sleep(2)
        
    except Exception as e:
        print(f"❌ خطأ في العرض التوضيحي: {e}")
    
    finally:
        # إغلاق التكامل
        await integration.shutdown()
        print("\n🎉 انتهى العرض التوضيحي!")

if __name__ == "__main__":
    asyncio.run(demo_mcp_integration())
