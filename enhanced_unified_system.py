#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
AuraOS Learning Growth - Enhanced Unified System
نظام موحد محسن يجمع جميع التحسينات في نظام تعلم ذكي متكامل
"""

import asyncio
import json
import time
import logging
from datetime import datetime
from typing import Dict, List, Any, Optional
from pathlib import Path
import sys

# إضافة المسارات للاستيراد
current_dir = Path(__file__).parent
sys.path.append(str(current_dir))

# استيراد المكونات المحسنة
try:
    from enhanced_pattern_recognizer import AdvancedPatternRecognizer
    from enhanced_feedback_weighting import AdvancedFeedbackWeighting
    from enhanced_cache_manager import AdvancedCacheManager, CacheType
    from enhanced_performance_monitor import AdvancedPerformanceMonitor, MetricType
except ImportError as e:
    print(f"⚠️ Import error: {e}")
    print("Make sure all enhanced modules are in the same directory")

# إعداد التسجيل
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class AuraOSLearningGrowthSystem:
    """نظام AuraOS Learning Growth المحسن والموحد"""
    
    def __init__(self):
        self.name = "AuraOS Learning Growth Enhanced"
        self.version = "2.0.0-Enhanced"
        self.is_running = False
        
        # المكونات الأساسية المحسنة
        self.pattern_recognizer: Optional[AdvancedPatternRecognizer] = None
        self.feedback_weighting: Optional[AdvancedFeedbackWeighting] = None
        self.cache_manager: Optional[AdvancedCacheManager] = None
        self.performance_monitor: Optional[AdvancedPerformanceMonitor] = None
        
        # إعدادات النظام الموحدة
        self.config = {
            "system": {
                "auto_start": True,
                "monitoring_enabled": True,
                "learning_enabled": True,
                "cache_enabled": True,
                "feedback_enabled": True
            },
            "performance": {
                "target_response_time_ms": 200,
                "target_accuracy": 0.9,
                "target_cache_hit_rate": 0.85,
                "max_memory_usage_percent": 80
            },
            "learning": {
                "pattern_recognition_enabled": True,
                "feedback_weighting_enabled": True,
                "adaptive_learning_enabled": True,
                "zero_shot_learning_enabled": True
            }
        }
        
        # إحصائيات النظام الموحدة
        self.system_stats = {
            "start_time": None,
            "total_messages_processed": 0,
            "total_patterns_learned": 0,
            "average_response_time": 0.0,
            "current_accuracy": 0.0,
            "system_health_score": 100.0,
            "uptime_seconds": 0.0
        }
        
        # مهمة التكامل
        self.integration_task = None
        
        logger.info(f"🚀 {self.name} v{self.version} initialized")
    
    async def initialize(self):
        """تهيئة النظام الموحد"""
        logger.info("🔧 Initializing Enhanced AuraOS Learning Growth System...")
        
        try:
            # 1. تهيئة مراقب الأداء أولاً
            logger.info("   📊 Initializing Performance Monitor...")
            self.performance_monitor = AdvancedPerformanceMonitor()
            await self.performance_monitor.initialize()
            
            # 2. تهيئة مدير التخزين المؤقت
            logger.info("   💾 Initializing Cache Manager...")
            self.cache_manager = AdvancedCacheManager()
            await self.cache_manager.initialize()
            
            # 3. تهيئة نظام اكتشاف الأنماط
            logger.info("   🧠 Initializing Pattern Recognizer...")
            self.pattern_recognizer = AdvancedPatternRecognizer()
            
            # 4. تهيئة نظام تقييم التغذية الراجعة
            logger.info("   🎯 Initializing Feedback Weighting...")
            self.feedback_weighting = AdvancedFeedbackWeighting()
            
            # 5. بدء مهمة التكامل
            logger.info("   🔗 Starting Integration Task...")
            self.integration_task = asyncio.create_task(self._integration_loop())
            
            self.is_running = True
            self.system_stats["start_time"] = datetime.now()
            
            logger.info("✅ Enhanced AuraOS Learning Growth System ready!")
            
            # تسجيل مقاييس البدء
            await self._record_startup_metrics()
            
        except Exception as e:
            logger.error(f"❌ Error initializing system: {e}")
            await self.shutdown()
            raise
    
    async def process_message(self, message: str, context: Dict[str, Any] = None) -> Dict[str, Any]:
        """معالجة رسالة مع التعلم المحسن"""
        start_time = time.time()
        
        try:
            # تسجيل بدء المعالجة
            await self.performance_monitor.record_metric(
                "system.messages_processing", 1, MetricType.COUNTER
            )
            
            # 1. فحص التخزين المؤقت أولاً
            cache_key = f"response_{hash(message)}"
            cached_response = await self.cache_manager.get(cache_key, CacheType.RESPONSE_CACHE)
            
            if cached_response:
                logger.info("💾 Cache hit - returning cached response")
                await self.performance_monitor.record_metric(
                    "cache.hit", 1, MetricType.COUNTER
                )
                return {
                    "response": cached_response,
                    "source": "cache",
                    "processing_time": time.time() - start_time,
                    "pattern_id": "cached"
                }
            
            # 2. تحليل الأنماط المتقدم
            pattern_result = await self.pattern_recognizer.analyze_message(
                message, context or {}
            )
            
            # 3. توليد الاستجابة
            response = await self._generate_response(message, pattern_result, context)
            
            # 4. تخزين الاستجابة في التخزين المؤقت
            await self.cache_manager.set(
                cache_key, response, CacheType.RESPONSE_CACHE,
                ttl_seconds=3600, priority=0.8
            )
            
            # 5. تحديث إحصائيات النظام
            processing_time = time.time() - start_time
            await self._update_system_stats(processing_time, pattern_result)
            
            # 6. تسجيل مقاييس الأداء
            await self.performance_monitor.record_metric(
                "learning.response_time_ms", processing_time * 1000, MetricType.TIMER
            )
            await self.performance_monitor.record_metric(
                "learning.patterns_discovered", pattern_result.get("similar_patterns", 0), MetricType.COUNTER
            )
            
            return {
                "response": response,
                "source": "generated",
                "processing_time": processing_time,
                "pattern_id": pattern_result.get("pattern_id"),
                "confidence": pattern_result.get("confidence", 0.0),
                "similar_patterns": pattern_result.get("similar_patterns", 0),
                "metrics": pattern_result.get("metrics", {})
            }
            
        except Exception as e:
            logger.error(f"❌ Error processing message: {e}")
            
            # تسجيل خطأ
            await self.performance_monitor.record_metric(
                "system.errors", 1, MetricType.COUNTER
            )
            
            return {
                "error": str(e),
                "processing_time": time.time() - start_time,
                "source": "error"
            }
    
    async def process_feedback(self, pattern_id: str, feedback_data: Dict[str, Any]) -> Dict[str, Any]:
        """معالجة التغذية الراجعة مع النظام المحسن"""
        try:
            # معالجة التغذية الراجعة
            feedback_result = await self.feedback_weighting.process_feedback(
                pattern_id, feedback_data
            )
            
            # تحديث التخزين المؤقت بناءً على التغذية الراجعة
            if feedback_result.get("score", 0) < -0.5:  # تغذية راجعة سلبية
                await self.cache_manager.delete(f"response_{pattern_id}", CacheType.RESPONSE_CACHE)
                logger.info(f"🗑️ Removed cached response for pattern {pattern_id} due to negative feedback")
            
            # تسجيل مقاييس التغذية الراجعة
            await self.performance_monitor.record_metric(
                "feedback.score", feedback_result.get("score", 0), MetricType.GAUGE
            )
            await self.performance_monitor.record_metric(
                "feedback.weight", feedback_result.get("weight", 0), MetricType.GAUGE
            )
            
            return feedback_result
            
        except Exception as e:
            logger.error(f"❌ Error processing feedback: {e}")
            return {"error": str(e)}
    
    async def _generate_response(self, message: str, pattern_result: Dict[str, Any], 
                               context: Dict[str, Any]) -> str:
        """توليد استجابة ذكية"""
        # محاكاة توليد الاستجابة بناءً على النمط المكتشف
        pattern_id = pattern_result.get("pattern_id", "unknown")
        confidence = pattern_result.get("confidence", 0.0)
        
        # استجابة أساسية مع تحسينات
        base_response = f"Response to: {message}"
        
        # تحسين الاستجابة بناءً على الثقة
        if confidence > 0.8:
            base_response = f"High confidence response: {message}"
        elif confidence > 0.6:
            base_response = f"Moderate confidence response: {message}"
        else:
            base_response = f"Learning response: {message}"
        
        # إضافة معلومات النمط
        base_response += f" [Pattern: {pattern_id}, Confidence: {confidence:.2f}]"
        
        return base_response
    
    async def _update_system_stats(self, processing_time: float, pattern_result: Dict[str, Any]):
        """تحديث إحصائيات النظام"""
        self.system_stats["total_messages_processed"] += 1
        
        # تحديث متوسط وقت الاستجابة
        current_avg = self.system_stats["average_response_time"]
        new_avg = (current_avg * 0.9) + (processing_time * 0.1)
        self.system_stats["average_response_time"] = new_avg
        
        # تحديث دقة النظام
        if "metrics" in pattern_result:
            metrics = pattern_result["metrics"]
            if "responseAccuracy" in metrics:
                self.system_stats["current_accuracy"] = metrics["responseAccuracy"]
        
        # تحديث وقت التشغيل
        if self.system_stats["start_time"]:
            uptime = (datetime.now() - self.system_stats["start_time"]).total_seconds()
            self.system_stats["uptime_seconds"] = uptime
    
    async def _record_startup_metrics(self):
        """تسجيل مقاييس البدء"""
        await self.performance_monitor.record_metric(
            "system.startup_time", time.time(), MetricType.GAUGE
        )
        await self.performance_monitor.record_metric(
            "system.components_initialized", 4, MetricType.COUNTER
        )
    
    async def _integration_loop(self):
        """حلقة التكامل المستمرة"""
        logger.info("🔄 Starting integration loop...")
        
        while self.is_running:
            try:
                # تحديث صحة النظام
                await self._update_system_health()
                
                # تحسين الأداء التلقائي
                await self._auto_optimize_performance()
                
                # تنظيف البيانات القديمة
                await self._cleanup_old_data()
                
                # انتظار قبل التكرار التالي
                await asyncio.sleep(30)  # كل 30 ثانية
                
            except Exception as e:
                logger.error(f"❌ Error in integration loop: {e}")
                await asyncio.sleep(10)
    
    async def _update_system_health(self):
        """تحديث صحة النظام"""
        try:
            # الحصول على تحليلات الأداء
            analytics = await self.performance_monitor.get_performance_analytics()
            system_health = analytics.get("system_health", {})
            
            # تحديث درجة الصحة
            self.system_stats["system_health_score"] = system_health.get("overall_score", 100.0)
            
            # تسجيل درجة الصحة
            await self.performance_monitor.record_metric(
                "system.health_score", self.system_stats["system_health_score"], MetricType.GAUGE
            )
            
        except Exception as e:
            logger.error(f"❌ Error updating system health: {e}")
    
    async def _auto_optimize_performance(self):
        """تحسين الأداء التلقائي"""
        try:
            # الحصول على تحليلات التخزين المؤقت
            cache_analytics = await self.cache_manager.get_cache_analytics()
            
            # تحسين التخزين المؤقت إذا لزم الأمر
            hit_rate = cache_analytics.get("performance_metrics", {}).get("hit_rate", 0)
            if hit_rate < 0.8:
                logger.info("🔧 Optimizing cache due to low hit rate")
                await self.cache_manager.clear()  # مسح وإعادة بناء
            
            # تحسين اكتشاف الأنماط
            if self.pattern_recognizer:
                await self.pattern_recognizer._optimize_performance()
            
        except Exception as e:
            logger.error(f"❌ Error in auto optimization: {e}")
    
    async def _cleanup_old_data(self):
        """تنظيف البيانات القديمة"""
        try:
            # تنظيف التخزين المؤقت
            await self.cache_manager._periodic_cleanup()
            
            # تنظيف بيانات الأنماط القديمة
            if self.pattern_recognizer:
                await self.pattern_recognizer._cleanup_old_patterns()
            
        except Exception as e:
            logger.error(f"❌ Error in cleanup: {e}")
    
    async def get_system_status(self) -> Dict[str, Any]:
        """الحصول على حالة النظام الموحدة"""
        try:
            # جمع البيانات من جميع المكونات
            performance_analytics = await self.performance_monitor.get_performance_analytics()
            cache_analytics = await self.cache_manager.get_cache_analytics()
            pattern_analytics = await self.pattern_recognizer.get_learning_analytics()
            
            return {
                "system_info": {
                    "name": self.name,
                    "version": self.version,
                    "is_running": self.is_running,
                    "uptime_seconds": self.system_stats["uptime_seconds"],
                    "start_time": self.system_stats["start_time"].isoformat() if self.system_stats["start_time"] else None
                },
                "system_stats": self.system_stats,
                "performance": performance_analytics,
                "cache": cache_analytics,
                "learning": pattern_analytics,
                "health": {
                    "overall_score": self.system_stats["system_health_score"],
                    "status": "healthy" if self.system_stats["system_health_score"] > 80 else "warning" if self.system_stats["system_health_score"] > 60 else "critical"
                },
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"❌ Error getting system status: {e}")
            return {"error": str(e)}
    
    async def get_learning_analytics(self) -> Dict[str, Any]:
        """الحصول على تحليلات التعلم الموحدة"""
        try:
            # جمع تحليلات من جميع المكونات
            pattern_analytics = await self.pattern_recognizer.get_learning_analytics()
            performance_analytics = await self.performance_monitor.get_performance_analytics()
            cache_analytics = await self.cache_manager.get_cache_analytics()
            
            # تحليلات موحدة
            unified_analytics = {
                "learning_metrics": {
                    "patterns_learned": pattern_analytics.get("total_patterns", 0),
                    "patterns_per_second": pattern_analytics.get("patterns_per_second", 0),
                    "learning_rate": pattern_analytics.get("learning_rate", 0),
                    "response_accuracy": pattern_analytics.get("average_confidence", 0),
                    "average_response_time": pattern_analytics.get("response_time_avg", 0)
                },
                "performance_metrics": {
                    "system_health": performance_analytics.get("system_health", {}),
                    "active_alerts": performance_analytics.get("active_alerts", 0),
                    "recommendations": performance_analytics.get("recommendations", [])
                },
                "cache_metrics": {
                    "hit_rate": cache_analytics.get("performance_metrics", {}).get("hit_rate", 0),
                    "total_size_mb": cache_analytics.get("memory_info", {}).get("total_size_mb", 0),
                    "efficiency": cache_analytics.get("performance_metrics", {}).get("efficiency", 0)
                },
                "system_stats": self.system_stats,
                "timestamp": datetime.now().isoformat()
            }
            
            return unified_analytics
            
        except Exception as e:
            logger.error(f"❌ Error getting learning analytics: {e}")
            return {"error": str(e)}
    
    async def shutdown(self):
        """إغلاق النظام الموحد"""
        logger.info("🔄 Shutting down Enhanced AuraOS Learning Growth System...")
        
        self.is_running = False
        
        # إلغاء مهمة التكامل
        if self.integration_task:
            self.integration_task.cancel()
        
        # إغلاق المكونات
        if self.performance_monitor:
            # إيقاف المهام الخلفية
            if hasattr(self.performance_monitor, 'monitoring_task') and self.performance_monitor.monitoring_task:
                self.performance_monitor.monitoring_task.cancel()
            if hasattr(self.performance_monitor, 'alert_task') and self.performance_monitor.alert_task:
                self.performance_monitor.alert_task.cancel()
            if hasattr(self.performance_monitor, 'cleanup_task') and self.performance_monitor.cleanup_task:
                self.performance_monitor.cleanup_task.cancel()
        
        if self.cache_manager:
            # إيقاف مهمة التنظيف
            if hasattr(self.cache_manager, 'cleanup_task') and self.cache_manager.cleanup_task:
                self.cache_manager.cleanup_task.cancel()
            if hasattr(self.cache_manager, 'monitoring_task') and self.cache_manager.monitoring_task:
                self.cache_manager.monitoring_task.cancel()
        
        logger.info("✅ Enhanced AuraOS Learning Growth System shutdown complete")

# مثال على الاستخدام
async def demo_enhanced_system():
    """عرض توضيحي للنظام المحسن الموحد"""
    print("🚀 Enhanced AuraOS Learning Growth System Demo")
    print("=" * 60)
    
    system = AuraOSLearningGrowthSystem()
    
    try:
        # تهيئة النظام
        await system.initialize()
        
        # اختبار معالجة الرسائل
        print("\n📝 Testing Message Processing...")
        
        test_messages = [
            ("Hello, I need help with installation", {"user_level": "beginner"}),
            ("How do I configure the system?", {"user_level": "intermediate"}),
            ("I'm getting an error during setup", {"user_level": "advanced"}),
            ("What are the system requirements?", {"user_level": "beginner"}),
            ("Can you help me optimize performance?", {"user_level": "advanced"})
        ]
        
        for i, (message, context) in enumerate(test_messages, 1):
            print(f"\n   Message {i}: {message}")
            
            result = await system.process_message(message, context)
            
            if "error" not in result:
                print(f"   Response: {result['response'][:50]}...")
                print(f"   Source: {result['source']}")
                print(f"   Processing Time: {result['processing_time']:.3f}s")
                print(f"   Pattern ID: {result['pattern_id']}")
                print(f"   Confidence: {result.get('confidence', 0):.2f}")
            else:
                print(f"   Error: {result['error']}")
            
            await asyncio.sleep(0.5)  # محاكاة التوقيت الطبيعي
        
        # اختبار التغذية الراجعة
        print("\n🔄 Testing Feedback Processing...")
        
        feedback_data = {
            "rating": 5,
            "text": "Excellent response, very helpful!",
            "context": {"satisfaction": "high"}
        }
        
        feedback_result = await system.process_feedback("pattern_001", feedback_data)
        
        if "error" not in feedback_result:
            print(f"   Feedback Type: {feedback_result['feedback_type']}")
            print(f"   Score: {feedback_result['score']:.3f}")
            print(f"   Weight: {feedback_result['weight']:.3f}")
        
        # عرض حالة النظام
        print("\n📊 System Status:")
        status = await system.get_system_status()
        
        if "error" not in status:
            print(f"   System: {status['system_info']['name']} v{status['system_info']['version']}")
            print(f"   Status: {'Running' if status['system_info']['is_running'] else 'Stopped'}")
            print(f"   Uptime: {status['system_info']['uptime_seconds']:.1f} seconds")
            print(f"   Health Score: {status['health']['overall_score']:.1f}")
            print(f"   Messages Processed: {status['system_stats']['total_messages_processed']}")
            print(f"   Average Response Time: {status['system_stats']['average_response_time']:.3f}s")
        
        # عرض تحليلات التعلم
        print("\n🧠 Learning Analytics:")
        analytics = await system.get_learning_analytics()
        
        if "error" not in analytics:
            learning_metrics = analytics['learning_metrics']
            print(f"   Patterns Learned: {learning_metrics['patterns_learned']}")
            print(f"   Patterns/Second: {learning_metrics['patterns_per_second']:.3f}")
            print(f"   Learning Rate: {learning_metrics['learning_rate']:.3f}")
            print(f"   Response Accuracy: {learning_metrics['response_accuracy']:.3f}")
            print(f"   Average Response Time: {learning_metrics['average_response_time']:.3f}s")
            
            cache_metrics = analytics['cache_metrics']
            print(f"   Cache Hit Rate: {cache_metrics['hit_rate']:.3f}")
            print(f"   Cache Size: {cache_metrics['total_size_mb']:.1f} MB")
            print(f"   Cache Efficiency: {cache_metrics['efficiency']:.3f}")
        
        # انتظار إضافي لمحاكاة العمل المستمر
        print("\n⏳ Simulating continuous operation...")
        await asyncio.sleep(3)
        
    except Exception as e:
        print(f"❌ Demo error: {e}")
    
    finally:
        # إغلاق النظام
        await system.shutdown()
        print("\n🎉 Demo completed successfully!")

if __name__ == "__main__":
    asyncio.run(demo_enhanced_system())
