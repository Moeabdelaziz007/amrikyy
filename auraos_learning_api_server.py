#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
AuraOS Learning API Server - MVP
خادم API لنظام التعلم الذكي المتكامل مع AuraOS
"""

import asyncio
import json
import logging
from datetime import datetime
from typing import Dict, List, Any, Optional
from pathlib import Path
import sys

# إضافة المسار للاستيراد
current_dir = Path(__file__).parent
sys.path.append(str(current_dir))

from auraos_learning_integration import AuraOSLearningIntegration

# إعداد التسجيل
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class AuraOSLearningAPIServer:
    """
    خادم API لنظام التعلم الذكي
    """
    
    def __init__(self, host: str = "localhost", port: int = 8080):
        self.host = host
        self.port = port
        self.is_running = False
        
        # تكامل AuraOS Learning
        self.integration: Optional[AuraOSLearningIntegration] = None
        
        # إحصائيات الخادم
        self.server_stats = {
            "start_time": None,
            "total_requests": 0,
            "successful_requests": 0,
            "failed_requests": 0,
            "uptime": 0.0
        }
        
        logger.info(f"🌐 تم إنشاء AuraOS Learning API Server على {host}:{port}")

    async def initialize(self):
        """تهيئة الخادم"""
        logger.info("🚀 تهيئة AuraOS Learning API Server...")
        
        try:
            # تهيئة التكامل
            self.integration = AuraOSLearningIntegration()
            await self.integration.initialize()
            
            # بدء مراقبة الخادم
            self.monitoring_task = asyncio.create_task(self._monitor_server())
            
            self.is_running = True
            self.server_stats["start_time"] = datetime.now()
            
            logger.info("✅ AuraOS Learning API Server جاهز!")
            
        except Exception as e:
            logger.error(f"❌ خطأ في تهيئة الخادم: {e}")
            await self.shutdown()
            raise

    async def start_server(self):
        """بدء الخادم"""
        logger.info(f"🌐 بدء الخادم على {self.host}:{self.port}")
        
        # محاكاة بدء الخادم
        # في التطبيق الحقيقي، سيتم استخدام FastAPI أو Express.js
        
        print(f"""
🚀 AuraOS Learning API Server يعمل!

📍 نقاط النهاية المتاحة:
   POST /api/learning/session     - إنشاء جلسة تعلم جديدة
   GET  /api/learning/status      - الحصول على حالة النظام
   POST /api/learning/feedback    - إرسال تغذية راجعة
   GET  /api/learning/analytics   - الحصول على التحليلات
   GET  /api/learning/health      - فحص صحة النظام

🌐 الخادم متاح على: http://{self.host}:{self.port}
📊 لوحة المراقبة: http://{self.host}:{self.port}/dashboard

اضغط Ctrl+C لإيقاف الخادم
""")
        
        try:
            # محاكاة تشغيل الخادم
            while self.is_running:
                await asyncio.sleep(1)
        except KeyboardInterrupt:
            logger.info("⏹️ تم إيقاف الخادم بواسطة المستخدم")
        except Exception as e:
            logger.error(f"❌ خطأ في الخادم: {e}")

    async def handle_request(self, method: str, path: str, data: Dict[str, Any] = None) -> Dict[str, Any]:
        """معالجة طلب API"""
        self.server_stats["total_requests"] += 1
        
        try:
            # تحديد المعالج المناسب
            if path == "/api/learning/session" and method == "POST":
                response = await self.integration._handle_learning_session_request(data or {})
            elif path == "/api/learning/status" and method == "GET":
                response = await self.integration._handle_learning_status_request(data or {})
            elif path == "/api/learning/feedback" and method == "POST":
                response = await self.integration._handle_learning_feedback_request(data or {})
            elif path == "/api/learning/analytics" and method == "GET":
                response = await self.integration._handle_learning_analytics_request(data or {})
            elif path == "/api/learning/health" and method == "GET":
                response = await self._handle_health_check()
            else:
                response = {
                    "success": False,
                    "error": "نقطة نهاية غير مدعومة",
                    "timestamp": datetime.now().isoformat()
                }
            
            if response.get("success"):
                self.server_stats["successful_requests"] += 1
            else:
                self.server_stats["failed_requests"] += 1
            
            return response
            
        except Exception as e:
            self.server_stats["failed_requests"] += 1
            return {
                "success": False,
                "error": str(e),
                "timestamp": datetime.now().isoformat()
            }

    async def _handle_health_check(self) -> Dict[str, Any]:
        """فحص صحة النظام"""
        try:
            integration_status = await self.integration.get_integration_status()
            
            health_status = {
                "status": "healthy" if self.is_running else "unhealthy",
                "server": {
                    "is_running": self.is_running,
                    "uptime": self.server_stats["uptime"],
                    "total_requests": self.server_stats["total_requests"]
                },
                "integration": {
                    "is_active": integration_status["is_active"],
                    "learning_sessions": integration_status["integration_stats"]["learning_sessions"]
                },
                "timestamp": datetime.now().isoformat()
            }
            
            return {
                "success": True,
                "health": health_status
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "timestamp": datetime.now().isoformat()
            }

    async def _monitor_server(self):
        """مراقبة الخادم"""
        logger.info("👁️ بدء مراقبة الخادم...")
        
        while self.is_running:
            try:
                # تحديث وقت التشغيل
                if self.server_stats["start_time"]:
                    self.server_stats["uptime"] = (
                        datetime.now() - self.server_stats["start_time"]
                    ).total_seconds()
                
                # فحص الأداء
                await self._check_performance()
                
                # انتظار قبل المراقبة التالية
                await asyncio.sleep(60)  # مراقبة كل دقيقة
                
            except Exception as e:
                logger.error(f"❌ خطأ في مراقبة الخادم: {e}")
                await asyncio.sleep(10)

    async def _check_performance(self):
        """فحص الأداء"""
        total_requests = self.server_stats["total_requests"]
        successful_requests = self.server_stats["successful_requests"]
        
        if total_requests > 0:
            success_rate = successful_requests / total_requests
            
            if success_rate < 0.8:  # أقل من 80%
                logger.warning(f"⚠️ معدل نجاح منخفض: {success_rate:.2f}")

    async def get_server_status(self) -> Dict[str, Any]:
        """الحصول على حالة الخادم"""
        status = {
            "server_name": "AuraOS Learning API Server",
            "version": "0.2.0-MVP",
            "is_running": self.is_running,
            "host": self.host,
            "port": self.port,
            "server_stats": self.server_stats.copy(),
            "integration_status": None
        }
        
        if self.integration:
            status["integration_status"] = await self.integration.get_integration_status()
        
        return status

    async def shutdown(self):
        """إغلاق الخادم"""
        logger.info("🔄 إغلاق AuraOS Learning API Server...")
        
        self.is_running = False
        
        # إلغاء مهمة المراقبة
        if hasattr(self, 'monitoring_task'):
            self.monitoring_task.cancel()
        
        # إغلاق التكامل
        if self.integration:
            await self.integration.shutdown()
        
        logger.info("✅ تم إغلاق AuraOS Learning API Server")

# مثال على الاستخدام
async def demo_api_server():
    """عرض توضيحي لخادم API"""
    print("🎬 بدء العرض التوضيحي لخادم AuraOS Learning API")
    print("=" * 60)
    
    server = AuraOSLearningAPIServer("localhost", 8080)
    
    try:
        # تهيئة الخادم
        await server.initialize()
        
        # اختبار نقاط النهاية
        print("\n🧪 اختبار نقاط النهاية...")
        
        # اختبار فحص الصحة
        print("\n1️⃣ اختبار فحص الصحة...")
        health_response = await server.handle_request("GET", "/api/learning/health")
        print(f"   النتيجة: {'✅ صحية' if health_response['success'] else '❌ غير صحية'}")
        
        # اختبار إنشاء جلسة تعلم
        print("\n2️⃣ اختبار إنشاء جلسة تعلم...")
        session_data = {
            "user_id": "api_test_user",
            "goals": ["programming", "ai"],
            "context": {
                "level": "intermediate",
                "platform": "api_test"
            }
        }
        
        session_response = await server.handle_request("POST", "/api/learning/session", session_data)
        
        if session_response["success"]:
            print(f"   ✅ تم إنشاء الجلسة: {session_response['session_id']}")
            
            # اختبار التغذية الراجعة
            print("\n3️⃣ اختبار التغذية الراجعة...")
            feedback_data = {
                "session_id": session_response["session_id"],
                "feedback_score": 0.85,
                "feedback_details": {"satisfaction": "high"}
            }
            
            feedback_response = await server.handle_request("POST", "/api/learning/feedback", feedback_data)
            print(f"   النتيجة: {'✅ نجح' if feedback_response['success'] else '❌ فشل'}")
            
            # اختبار التحليلات
            print("\n4️⃣ اختبار التحليلات...")
            analytics_response = await server.handle_request("GET", "/api/learning/analytics", {"type": "overview"})
            print(f"   النتيجة: {'✅ نجح' if analytics_response['success'] else '❌ فشل'}")
        
        else:
            print(f"   ❌ فشل في إنشاء الجلسة: {session_response.get('message', 'خطأ غير معروف')}")
        
        # عرض حالة الخادم
        print("\n📊 حالة الخادم:")
        server_status = await server.get_server_status()
        
        print(f"   الخادم: {server_status['server_name']} v{server_status['version']}")
        print(f"   الحالة: {'نشط' if server_status['is_running'] else 'غير نشط'}")
        print(f"   العنوان: {server_status['host']}:{server_status['port']}")
        print(f"   إجمالي الطلبات: {server_status['server_stats']['total_requests']}")
        print(f"   الطلبات الناجحة: {server_status['server_stats']['successful_requests']}")
        print(f"   وقت التشغيل: {server_status['server_stats']['uptime']:.1f} ثانية")
        
        # محاكاة تشغيل الخادم لفترة قصيرة
        print("\n⏳ محاكاة تشغيل الخادم...")
        await asyncio.sleep(3)
        
    except Exception as e:
        print(f"❌ خطأ في العرض التوضيحي: {e}")
    
    finally:
        # إغلاق الخادم
        await server.shutdown()
        print("\n🎉 انتهى العرض التوضيحي!")

# تشغيل الخادم
async def run_server():
    """تشغيل الخادم"""
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

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1 and sys.argv[1] == "demo":
        asyncio.run(demo_api_server())
    else:
        asyncio.run(run_server())
