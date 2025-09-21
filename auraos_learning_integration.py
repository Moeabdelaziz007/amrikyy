#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
AuraOS Learning Brain Hub - MVP Integration
تكامل نظام التعلم الذكي مع AuraOS الحالي
"""

import asyncio
import json
import os
import sys
from datetime import datetime
from typing import Dict, List, Any, Optional
from pathlib import Path

# إضافة المسار للاستيراد
current_dir = Path(__file__).parent
sys.path.append(str(current_dir))

from learning_brain_hub import LearningBrainHub
from auraos_hub import AuraOSHub
from ai_agent import AILearningAgent
from mcp_channel import MCPChannel, MessageType, MessagePriority

class AuraOSLearningIntegration:
    """
    تكامل نظام التعلم الذكي مع AuraOS
    """
    
    def __init__(self):
        self.name = "AuraOS Learning Integration"
        self.version = "0.2.0-MVP"
        self.is_active = False
        
        # المكونات الأساسية
        self.learning_hub: Optional[LearningBrainHub] = None
        self.auraos_connection: Optional[Dict[str, Any]] = None
        
        # إعدادات التكامل
        self.integration_config = {
            "auraos_api_url": "http://localhost:3000",
            "learning_endpoint": "/api/learning",
            "websocket_port": 8080,
            "mcp_channel_id": "auraos_learning_channel"
        }
        
        # إحصائيات التكامل
        self.integration_stats = {
            "total_integrations": 0,
            "successful_integrations": 0,
            "failed_integrations": 0,
            "learning_sessions": 0,
            "start_time": None
        }
        
        print(f"🔗 تم إنشاء {self.name} v{self.version}")

    async def initialize(self):
        """تهيئة التكامل"""
        print("🚀 تهيئة تكامل AuraOS Learning...")
        
        try:
            # 1. تهيئة Learning Brain Hub
            print("   🧠 تهيئة Learning Brain Hub...")
            self.learning_hub = LearningBrainHub()
            await self.learning_hub.initialize()
            
            # 2. إعداد اتصال AuraOS
            print("   🔌 إعداد اتصال AuraOS...")
            await self._setup_auraos_connection()
            
            # 3. تسجيل نقاط النهاية
            print("   📡 تسجيل نقاط النهاية...")
            await self._register_endpoints()
            
            # 4. بدء مراقبة التكامل
            print("   👁️ بدء مراقبة التكامل...")
            self.monitoring_task = asyncio.create_task(self._monitor_integration())
            
            self.is_active = True
            self.integration_stats["start_time"] = datetime.now()
            
            print("✅ تكامل AuraOS Learning جاهز!")
            
        except Exception as e:
            print(f"❌ خطأ في تهيئة التكامل: {e}")
            await self.shutdown()
            raise

    async def _setup_auraos_connection(self):
        """إعداد اتصال AuraOS"""
        # محاكاة اتصال AuraOS
        self.auraos_connection = {
            "status": "connected",
            "api_url": self.integration_config["auraos_api_url"],
            "websocket_port": self.integration_config["websocket_port"],
            "capabilities": [
                "user_management",
                "workflow_engine",
                "ai_agents",
                "automation",
                "analytics"
            ],
            "last_ping": datetime.now()
        }
        
        print("   ✅ تم إعداد اتصال AuraOS")

    async def _register_endpoints(self):
        """تسجيل نقاط النهاية"""
        endpoints = [
            {
                "path": "/api/learning/session",
                "method": "POST",
                "handler": self._handle_learning_session_request
            },
            {
                "path": "/api/learning/status",
                "method": "GET", 
                "handler": self._handle_learning_status_request
            },
            {
                "path": "/api/learning/feedback",
                "method": "POST",
                "handler": self._handle_learning_feedback_request
            },
            {
                "path": "/api/learning/analytics",
                "method": "GET",
                "handler": self._handle_learning_analytics_request
            }
        ]
        
        for endpoint in endpoints:
            print(f"   📍 تم تسجيل: {endpoint['method']} {endpoint['path']}")
        
        self.registered_endpoints = endpoints

    async def _handle_learning_session_request(self, request_data: Dict[str, Any]) -> Dict[str, Any]:
        """معالجة طلب جلسة تعلم"""
        try:
            user_id = request_data.get("user_id")
            learning_goals = request_data.get("goals", [])
            context = request_data.get("context", {})
            
            print(f"📚 طلب جلسة تعلم من المستخدم: {user_id}")
            
            # إنشاء جلسة تعلم
            session_id = await self.learning_hub.start_learning_session(
                user_id, learning_goals, context
            )
            
            if session_id:
                self.integration_stats["learning_sessions"] += 1
                self.integration_stats["successful_integrations"] += 1
                
                return {
                    "success": True,
                    "session_id": session_id,
                    "message": "تم إنشاء جلسة التعلم بنجاح",
                    "timestamp": datetime.now().isoformat()
                }
            else:
                self.integration_stats["failed_integrations"] += 1
                return {
                    "success": False,
                    "message": "فشل في إنشاء جلسة التعلم",
                    "timestamp": datetime.now().isoformat()
                }
                
        except Exception as e:
            self.integration_stats["failed_integrations"] += 1
            return {
                "success": False,
                "error": str(e),
                "timestamp": datetime.now().isoformat()
            }

    async def _handle_learning_status_request(self, request_data: Dict[str, Any]) -> Dict[str, Any]:
        """معالجة طلب حالة التعلم"""
        try:
            session_id = request_data.get("session_id")
            
            if not session_id:
                # إرجاع حالة النظام العام
                system_status = await self.learning_hub.get_system_status()
                return {
                    "success": True,
                    "system_status": system_status,
                    "integration_stats": self.integration_stats,
                    "timestamp": datetime.now().isoformat()
                }
            else:
                # إرجاع حالة جلسة محددة
                # في التطبيق الحقيقي، سيتم البحث عن الجلسة في قاعدة البيانات
                return {
                    "success": True,
                    "session_id": session_id,
                    "status": "active",
                    "progress": 0.75,
                    "timestamp": datetime.now().isoformat()
                }
                
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "timestamp": datetime.now().isoformat()
            }

    async def _handle_learning_feedback_request(self, request_data: Dict[str, Any]) -> Dict[str, Any]:
        """معالجة طلب التغذية الراجعة"""
        try:
            session_id = request_data.get("session_id")
            feedback_score = request_data.get("feedback_score", 0.0)
            feedback_details = request_data.get("feedback_details", {})
            
            print(f"🔄 معالجة التغذية الراجعة للجلسة: {session_id}")
            
            # إرسال التغذية الراجعة للنظام
            if self.learning_hub and self.learning_hub.mcp_channel:
                await self.learning_hub.mcp_channel.send_message(
                    MessageType.LEARNING_FEEDBACK,
                    "auraos_integration",
                    "learning_hub",
                    {
                        "session_id": session_id,
                        "feedback_score": feedback_score,
                        "feedback_details": feedback_details
                    },
                    MessagePriority.NORMAL
                )
            
            return {
                "success": True,
                "message": "تم معالجة التغذية الراجعة",
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "timestamp": datetime.now().isoformat()
            }

    async def _handle_learning_analytics_request(self, request_data: Dict[str, Any]) -> Dict[str, Any]:
        """معالجة طلب التحليلات"""
        try:
            analytics_type = request_data.get("type", "overview")
            
            if analytics_type == "overview":
                # تحليلات عامة
                system_status = await self.learning_hub.get_system_status()
                
                analytics = {
                    "total_sessions": self.integration_stats["learning_sessions"],
                    "success_rate": (
                        self.integration_stats["successful_integrations"] / 
                        max(1, self.integration_stats["total_integrations"])
                    ),
                    "system_performance": system_status["system_stats"]["average_performance"],
                    "active_agents": len(system_status["components"]["ai_agents"]),
                    "uptime": self.integration_stats.get("uptime", 0)
                }
                
            elif analytics_type == "detailed":
                # تحليلات مفصلة
                system_status = await self.learning_hub.get_system_status()
                analytics = {
                    "system_status": system_status,
                    "integration_stats": self.integration_stats,
                    "component_performance": system_status["components"]
                }
            
            else:
                analytics = {"error": "نوع تحليل غير مدعوم"}
            
            return {
                "success": True,
                "analytics": analytics,
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "timestamp": datetime.now().isoformat()
            }

    async def _monitor_integration(self):
        """مراقبة التكامل"""
        print("👁️ بدء مراقبة التكامل...")
        
        while self.is_active:
            try:
                # تحديث وقت التشغيل
                if self.integration_stats["start_time"]:
                    self.integration_stats["uptime"] = (
                        datetime.now() - self.integration_stats["start_time"]
                    ).total_seconds()
                
                # فحص حالة الاتصال
                await self._check_auraos_connection()
                
                # تحديث إحصائيات التكامل
                await self._update_integration_stats()
                
                # انتظار قبل المراقبة التالية
                await asyncio.sleep(30)  # مراقبة كل 30 ثانية
                
            except Exception as e:
                print(f"❌ خطأ في مراقبة التكامل: {e}")
                await asyncio.sleep(10)

    async def _check_auraos_connection(self):
        """فحص اتصال AuraOS"""
        if self.auraos_connection:
            # محاكاة فحص الاتصال
            self.auraos_connection["last_ping"] = datetime.now()
            
            # في التطبيق الحقيقي، سيتم إرسال ping فعلي لـ AuraOS
            # response = await self._ping_auraos()
            # self.auraos_connection["status"] = "connected" if response else "disconnected"

    async def _update_integration_stats(self):
        """تحديث إحصائيات التكامل"""
        self.integration_stats["total_integrations"] = (
            self.integration_stats["successful_integrations"] + 
            self.integration_stats["failed_integrations"]
        )

    async def create_learning_workflow(self, workflow_config: Dict[str, Any]) -> str:
        """إنشاء سير عمل تعلم"""
        try:
            workflow_id = f"workflow_{int(datetime.now().timestamp())}"
            
            print(f"🔄 إنشاء سير عمل تعلم: {workflow_id}")
            
            # إنشاء سير العمل في Learning Hub
            if self.learning_hub:
                # إضافة سير العمل لقاعدة المعرفة
                await self.learning_hub.mcp_channel.store_context(
                    f"workflow_{workflow_id}",
                    workflow_config
                )
            
            return workflow_id
            
        except Exception as e:
            print(f"❌ خطأ في إنشاء سير العمل: {e}")
            return None

    async def get_integration_status(self) -> Dict[str, Any]:
        """الحصول على حالة التكامل"""
        status = {
            "integration_name": self.name,
            "version": self.version,
            "is_active": self.is_active,
            "auraos_connection": self.auraos_connection,
            "integration_stats": self.integration_stats.copy(),
            "registered_endpoints": len(self.registered_endpoints),
            "learning_hub_status": None
        }
        
        if self.learning_hub:
            status["learning_hub_status"] = await self.learning_hub.get_system_status()
        
        return status

    async def shutdown(self):
        """إغلاق التكامل"""
        print("🔄 إغلاق تكامل AuraOS Learning...")
        
        self.is_active = False
        
        # إلغاء مهمة المراقبة
        if hasattr(self, 'monitoring_task'):
            self.monitoring_task.cancel()
        
        # إغلاق Learning Hub
        if self.learning_hub:
            await self.learning_hub.shutdown()
        
        print("✅ تم إغلاق تكامل AuraOS Learning")

# مثال على الاستخدام
async def demo_auraos_integration():
    """عرض توضيحي للتكامل"""
    print("🎬 بدء العرض التوضيحي لتكامل AuraOS Learning")
    print("=" * 60)
    
    integration = AuraOSLearningIntegration()
    
    try:
        # تهيئة التكامل
        await integration.initialize()
        
        # اختبار إنشاء جلسة تعلم
        print("\n📚 اختبار إنشاء جلسة تعلم...")
        
        session_request = {
            "user_id": "auraos_user_001",
            "goals": ["programming", "ai", "automation"],
            "context": {
                "level": "intermediate",
                "platform": "auraos",
                "preferences": {
                    "learning_style": "hands_on",
                    "time_available": 45
                }
            }
        }
        
        response = await integration._handle_learning_session_request(session_request)
        
        if response["success"]:
            print(f"✅ تم إنشاء جلسة التعلم: {response['session_id']}")
            
            # اختبار الحصول على الحالة
            print("\n📊 اختبار الحصول على الحالة...")
            status_response = await integration._handle_learning_status_request({})
            
            if status_response["success"]:
                print("✅ تم الحصول على حالة النظام")
                system_status = status_response["system_status"]
                print(f"   المهام المكتملة: {system_status['system_stats']['successful_tasks']}")
                print(f"   متوسط الأداء: {system_status['system_stats']['average_performance']:.2f}")
            
            # اختبار التغذية الراجعة
            print("\n🔄 اختبار التغذية الراجعة...")
            feedback_request = {
                "session_id": response["session_id"],
                "feedback_score": 0.9,
                "feedback_details": {
                    "satisfaction": "high",
                    "learning_progress": "excellent",
                    "recommendations": ["continue", "advanced_topics"]
                }
            }
            
            feedback_response = await integration._handle_learning_feedback_request(feedback_request)
            
            if feedback_response["success"]:
                print("✅ تم معالجة التغذية الراجعة")
            
            # اختبار التحليلات
            print("\n📈 اختبار التحليلات...")
            analytics_response = await integration._handle_learning_analytics_request({"type": "overview"})
            
            if analytics_response["success"]:
                print("✅ تم الحصول على التحليلات")
                analytics = analytics_response["analytics"]
                print(f"   إجمالي الجلسات: {analytics['total_sessions']}")
                print(f"   معدل النجاح: {analytics['success_rate']:.2f}")
        
        else:
            print(f"❌ فشل في إنشاء جلسة التعلم: {response.get('message', 'خطأ غير معروف')}")
        
        # عرض حالة التكامل النهائية
        print("\n📊 حالة التكامل النهائية:")
        integration_status = await integration.get_integration_status()
        
        print(f"   التكامل: {integration_status['integration_name']} v{integration_status['version']}")
        print(f"   الحالة: {'نشط' if integration_status['is_active'] else 'غير نشط'}")
        print(f"   نقاط النهاية: {integration_status['registered_endpoints']}")
        print(f"   جلسات التعلم: {integration_status['integration_stats']['learning_sessions']}")
        print(f"   التكاملات الناجحة: {integration_status['integration_stats']['successful_integrations']}")
        
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
    asyncio.run(demo_auraos_integration())
