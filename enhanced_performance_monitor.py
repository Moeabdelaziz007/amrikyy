#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Advanced Performance Monitoring System for AuraOS Learning Growth
نظام مراقبة الأداء المتقدم مع تحليلات في الوقت الفعلي
"""

import asyncio
import json
import time
import psutil
import numpy as np
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional, Tuple
from collections import defaultdict, deque
from dataclasses import dataclass, field
from enum import Enum
import logging
import threading
from pathlib import Path

# إعداد التسجيل
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class MetricType(Enum):
    """أنواع المقاييس"""
    COUNTER = "counter"
    GAUGE = "gauge"
    HISTOGRAM = "histogram"
    TIMER = "timer"
    RATE = "rate"

class AlertLevel(Enum):
    """مستويات التنبيه"""
    INFO = "info"
    WARNING = "warning"
    CRITICAL = "critical"
    EMERGENCY = "emergency"

@dataclass
class Metric:
    """مقياس أداء"""
    name: str
    value: float
    metric_type: MetricType
    timestamp: datetime
    tags: Dict[str, str] = field(default_factory=dict)
    metadata: Dict[str, Any] = field(default_factory=dict)

@dataclass
class Alert:
    """تنبيه أداء"""
    id: str
    metric_name: str
    level: AlertLevel
    message: str
    threshold: float
    current_value: float
    timestamp: datetime
    resolved: bool = False

@dataclass
class PerformanceSnapshot:
    """لقطة أداء"""
    timestamp: datetime
    metrics: Dict[str, float]
    system_info: Dict[str, Any]
    alerts: List[Alert]

class AdvancedPerformanceMonitor:
    """مراقب الأداء المتقدم"""
    
    def __init__(self):
        self.metrics_history: Dict[str, deque] = defaultdict(lambda: deque(maxlen=1000))
        self.active_alerts: Dict[str, Alert] = {}
        self.performance_snapshots: deque = deque(maxlen=100)
        
        # إعدادات النظام
        self.config = {
            "monitoring_interval_seconds": 5,
            "alert_check_interval_seconds": 10,
            "data_retention_hours": 24,
            "enable_system_monitoring": True,
            "enable_learning_monitoring": True,
            "enable_cache_monitoring": True,
            "alert_thresholds": {
                "cpu_usage_percent": 80.0,
                "memory_usage_percent": 85.0,
                "response_time_ms": 1000.0,
                "error_rate_percent": 5.0,
                "learning_accuracy": 0.7,
                "cache_hit_rate": 0.8
            }
        }
        
        # مكونات المراقبة
        self.system_monitor = SystemMonitor()
        self.learning_monitor = LearningMonitor()
        self.cache_monitor = CacheMonitor()
        self.alert_manager = AlertManager()
        self.data_aggregator = DataAggregator()
        
        # المهام الخلفية
        self.monitoring_task = None
        self.alert_task = None
        self.cleanup_task = None
        
        # إحصائيات النظام
        self.stats = {
            "total_metrics_collected": 0,
            "active_alerts": 0,
            "monitoring_uptime": 0.0,
            "last_alert_time": None
        }
        
        logger.info("📊 Advanced Performance Monitor initialized")
    
    async def initialize(self):
        """تهيئة النظام"""
        # بدء مراقبة النظام
        self.monitoring_task = asyncio.create_task(self._continuous_monitoring())
        
        # بدء فحص التنبيهات
        self.alert_task = asyncio.create_task(self._alert_monitoring())
        
        # بدء تنظيف البيانات
        self.cleanup_task = asyncio.create_task(self._periodic_cleanup())
        
        self.stats["monitoring_start_time"] = datetime.now()
        
        logger.info("✅ Performance Monitor started")
    
    async def record_metric(self, name: str, value: float, metric_type: MetricType = MetricType.GAUGE,
                          tags: Dict[str, str] = None, metadata: Dict[str, Any] = None) -> bool:
        """تسجيل مقياس أداء"""
        try:
            metric = Metric(
                name=name,
                value=value,
                metric_type=metric_type,
                timestamp=datetime.now(),
                tags=tags or {},
                metadata=metadata or {}
            )
            
            # إضافة إلى التاريخ
            self.metrics_history[name].append(metric)
            
            # تحديث الإحصائيات
            self.stats["total_metrics_collected"] += 1
            
            # فحص التنبيهات
            await self._check_metric_alerts(metric)
            
            logger.debug(f"📈 Recorded metric: {name} = {value}")
            return True
            
        except Exception as e:
            logger.error(f"❌ Error recording metric: {e}")
            return False
    
    async def get_metric_history(self, name: str, hours: int = 1) -> List[Metric]:
        """الحصول على تاريخ المقياس"""
        cutoff_time = datetime.now() - timedelta(hours=hours)
        
        return [
            metric for metric in self.metrics_history[name]
            if metric.timestamp >= cutoff_time
        ]
    
    async def get_current_metrics(self) -> Dict[str, float]:
        """الحصول على المقاييس الحالية"""
        current_metrics = {}
        
        for name, history in self.metrics_history.items():
            if history:
                current_metrics[name] = history[-1].value
        
        return current_metrics
    
    async def _continuous_monitoring(self):
        """مراقبة مستمرة"""
        while True:
            try:
                await asyncio.sleep(self.config["monitoring_interval_seconds"])
                
                # مراقبة النظام
                if self.config["enable_system_monitoring"]:
                    await self._monitor_system_metrics()
                
                # مراقبة التعلم
                if self.config["enable_learning_monitoring"]:
                    await self._monitor_learning_metrics()
                
                # مراقبة التخزين المؤقت
                if self.config["enable_cache_monitoring"]:
                    await self._monitor_cache_metrics()
                
                # إنشاء لقطة أداء
                await self._create_performance_snapshot()
                
            except Exception as e:
                logger.error(f"❌ Error in continuous monitoring: {e}")
    
    async def _monitor_system_metrics(self):
        """مراقبة مقاييس النظام"""
        try:
            # استخدام المعالج
            cpu_percent = psutil.cpu_percent(interval=1)
            await self.record_metric("system.cpu_usage_percent", cpu_percent, 
                                   tags={"component": "system"})
            
            # استخدام الذاكرة
            memory = psutil.virtual_memory()
            await self.record_metric("system.memory_usage_percent", memory.percent,
                                   tags={"component": "system"})
            
            # استخدام القرص
            disk = psutil.disk_usage('/')
            await self.record_metric("system.disk_usage_percent", 
                                   (disk.used / disk.total) * 100,
                                   tags={"component": "system"})
            
            # عدد العمليات
            process_count = len(psutil.pids())
            await self.record_metric("system.process_count", process_count,
                                   tags={"component": "system"})
            
            # استخدام الشبكة
            network = psutil.net_io_counters()
            await self.record_metric("system.network_bytes_sent", network.bytes_sent,
                                   tags={"component": "network"})
            await self.record_metric("system.network_bytes_recv", network.bytes_recv,
                                   tags={"component": "network"})
            
        except Exception as e:
            logger.error(f"❌ Error monitoring system metrics: {e}")
    
    async def _monitor_learning_metrics(self):
        """مراقبة مقاييس التعلم"""
        try:
            # محاكاة مقاييس التعلم
            learning_accuracy = 0.85 + np.random.normal(0, 0.05)
            await self.record_metric("learning.accuracy", learning_accuracy,
                                   tags={"component": "learning"})
            
            patterns_learned = np.random.poisson(2)
            await self.record_metric("learning.patterns_per_second", patterns_learned,
                                   metric_type=MetricType.RATE,
                                   tags={"component": "learning"})
            
            response_time = 150 + np.random.normal(0, 20)
            await self.record_metric("learning.response_time_ms", response_time,
                                   metric_type=MetricType.TIMER,
                                   tags={"component": "learning"})
            
            error_rate = max(0, np.random.normal(2, 1))
            await self.record_metric("learning.error_rate_percent", error_rate,
                                   tags={"component": "learning"})
            
        except Exception as e:
            logger.error(f"❌ Error monitoring learning metrics: {e}")
    
    async def _monitor_cache_metrics(self):
        """مراقبة مقاييس التخزين المؤقت"""
        try:
            # محاكاة مقاييس التخزين المؤقت
            cache_hit_rate = 0.9 + np.random.normal(0, 0.05)
            await self.record_metric("cache.hit_rate", cache_hit_rate,
                                   tags={"component": "cache"})
            
            cache_size_mb = 50 + np.random.normal(0, 10)
            await self.record_metric("cache.size_mb", cache_size_mb,
                                   tags={"component": "cache"})
            
            cache_entries = 500 + np.random.poisson(50)
            await self.record_metric("cache.entry_count", cache_entries,
                                   tags={"component": "cache"})
            
        except Exception as e:
            logger.error(f"❌ Error monitoring cache metrics: {e}")
    
    async def _create_performance_snapshot(self):
        """إنشاء لقطة أداء"""
        try:
            current_metrics = await self.get_current_metrics()
            system_info = await self.system_monitor.get_system_info()
            active_alerts = list(self.active_alerts.values())
            
            snapshot = PerformanceSnapshot(
                timestamp=datetime.now(),
                metrics=current_metrics,
                system_info=system_info,
                alerts=active_alerts
            )
            
            self.performance_snapshots.append(snapshot)
            
        except Exception as e:
            logger.error(f"❌ Error creating performance snapshot: {e}")
    
    async def _check_metric_alerts(self, metric: Metric):
        """فحص تنبيهات المقياس"""
        threshold = self.config["alert_thresholds"].get(metric.name)
        
        if threshold is not None:
            alert_level = AlertLevel.INFO
            
            if metric.value > threshold * 1.5:
                alert_level = AlertLevel.EMERGENCY
            elif metric.value > threshold * 1.2:
                alert_level = AlertLevel.CRITICAL
            elif metric.value > threshold:
                alert_level = AlertLevel.WARNING
            
            if alert_level != AlertLevel.INFO:
                await self._create_alert(metric, alert_level, threshold)
    
    async def _create_alert(self, metric: Metric, level: AlertLevel, threshold: float):
        """إنشاء تنبيه"""
        alert_id = f"alert_{metric.name}_{int(time.time())}"
        
        alert = Alert(
            id=alert_id,
            metric_name=metric.name,
            level=level,
            message=f"{metric.name} exceeded threshold: {metric.value:.2f} > {threshold:.2f}",
            threshold=threshold,
            current_value=metric.value,
            timestamp=datetime.now()
        )
        
        self.active_alerts[alert_id] = alert
        self.stats["active_alerts"] = len(self.active_alerts)
        self.stats["last_alert_time"] = datetime.now()
        
        logger.warning(f"🚨 Alert {level.value}: {alert.message}")
    
    async def _alert_monitoring(self):
        """مراقبة التنبيهات"""
        while True:
            try:
                await asyncio.sleep(self.config["alert_check_interval_seconds"])
                
                # فحص التنبيهات المنتهية الصلاحية
                await self._check_expired_alerts()
                
                # إرسال تقارير التنبيهات
                await self._send_alert_reports()
                
            except Exception as e:
                logger.error(f"❌ Error in alert monitoring: {e}")
    
    async def _check_expired_alerts(self):
        """فحص التنبيهات المنتهية الصلاحية"""
        cutoff_time = datetime.now() - timedelta(minutes=30)
        
        expired_alerts = [
            alert_id for alert_id, alert in self.active_alerts.items()
            if alert.timestamp < cutoff_time
        ]
        
        for alert_id in expired_alerts:
            del self.active_alerts[alert_id]
        
        if expired_alerts:
            self.stats["active_alerts"] = len(self.active_alerts)
            logger.info(f"🕒 Expired {len(expired_alerts)} alerts")
    
    async def _send_alert_reports(self):
        """إرسال تقارير التنبيهات"""
        if self.active_alerts:
            # في التطبيق الحقيقي، سيتم إرسال التنبيهات عبر البريد الإلكتروني أو Slack
            logger.info(f"📧 Would send alert report for {len(self.active_alerts)} active alerts")
    
    async def _periodic_cleanup(self):
        """تنظيف دوري للبيانات"""
        while True:
            try:
                await asyncio.sleep(3600)  # كل ساعة
                
                # تنظيف البيانات القديمة
                cutoff_time = datetime.now() - timedelta(hours=self.config["data_retention_hours"])
                
                for name, history in self.metrics_history.items():
                    # إزالة المقاييس القديمة
                    while history and history[0].timestamp < cutoff_time:
                        history.popleft()
                
                logger.info("🧹 Cleaned up old metrics data")
                
            except Exception as e:
                logger.error(f"❌ Error in periodic cleanup: {e}")
    
    async def get_performance_analytics(self) -> Dict[str, Any]:
        """الحصول على تحليلات الأداء"""
        analytics = {
            "monitoring_stats": self.stats,
            "current_metrics": await self.get_current_metrics(),
            "active_alerts": len(self.active_alerts),
            "alert_summary": {
                level.value: len([a for a in self.active_alerts.values() if a.level == level])
                for level in AlertLevel
            },
            "system_health": await self._calculate_system_health(),
            "performance_trends": await self._calculate_performance_trends(),
            "recommendations": await self._generate_recommendations(),
            "timestamp": datetime.now().isoformat()
        }
        
        return analytics
    
    async def _calculate_system_health(self) -> Dict[str, Any]:
        """حساب صحة النظام"""
        current_metrics = await self.get_current_metrics()
        
        health_score = 100.0
        
        # فحص استخدام المعالج
        cpu_usage = current_metrics.get("system.cpu_usage_percent", 0)
        if cpu_usage > 80:
            health_score -= 20
        elif cpu_usage > 60:
            health_score -= 10
        
        # فحص استخدام الذاكرة
        memory_usage = current_metrics.get("system.memory_usage_percent", 0)
        if memory_usage > 85:
            health_score -= 25
        elif memory_usage > 70:
            health_score -= 15
        
        # فحص دقة التعلم
        learning_accuracy = current_metrics.get("learning.accuracy", 0)
        if learning_accuracy < 0.7:
            health_score -= 20
        elif learning_accuracy < 0.8:
            health_score -= 10
        
        # فحص معدل الخطأ
        error_rate = current_metrics.get("learning.error_rate_percent", 0)
        if error_rate > 5:
            health_score -= 15
        elif error_rate > 2:
            health_score -= 5
        
        return {
            "overall_score": max(0, health_score),
            "status": "healthy" if health_score > 80 else "warning" if health_score > 60 else "critical",
            "cpu_health": "good" if cpu_usage < 60 else "warning" if cpu_usage < 80 else "critical",
            "memory_health": "good" if memory_usage < 70 else "warning" if memory_usage < 85 else "critical",
            "learning_health": "good" if learning_accuracy > 0.8 else "warning" if learning_accuracy > 0.7 else "critical"
        }
    
    async def _calculate_performance_trends(self) -> Dict[str, Any]:
        """حساب اتجاهات الأداء"""
        trends = {}
        
        for name, history in self.metrics_history.items():
            if len(history) >= 10:
                recent_values = [m.value for m in list(history)[-10:]]
                older_values = [m.value for m in list(history)[-20:-10]] if len(history) >= 20 else recent_values
                
                recent_avg = np.mean(recent_values)
                older_avg = np.mean(older_values)
                
                trend = "stable"
                if recent_avg > older_avg * 1.1:
                    trend = "improving"
                elif recent_avg < older_avg * 0.9:
                    trend = "declining"
                
                trends[name] = {
                    "trend": trend,
                    "recent_average": recent_avg,
                    "change_percent": ((recent_avg - older_avg) / older_avg * 100) if older_avg > 0 else 0
                }
        
        return trends
    
    async def _generate_recommendations(self) -> List[Dict[str, Any]]:
        """توليد التوصيات"""
        recommendations = []
        current_metrics = await self.get_current_metrics()
        
        # توصيات استخدام المعالج
        cpu_usage = current_metrics.get("system.cpu_usage_percent", 0)
        if cpu_usage > 80:
            recommendations.append({
                "type": "performance",
                "priority": "high",
                "title": "High CPU Usage",
                "description": f"CPU usage is at {cpu_usage:.1f}%. Consider optimizing processes or scaling resources.",
                "action": "optimize_cpu_usage"
            })
        
        # توصيات استخدام الذاكرة
        memory_usage = current_metrics.get("system.memory_usage_percent", 0)
        if memory_usage > 85:
            recommendations.append({
                "type": "resource",
                "priority": "critical",
                "title": "High Memory Usage",
                "description": f"Memory usage is at {memory_usage:.1f}%. Consider clearing cache or adding more RAM.",
                "action": "optimize_memory_usage"
            })
        
        # توصيات دقة التعلم
        learning_accuracy = current_metrics.get("learning.accuracy", 0)
        if learning_accuracy < 0.7:
            recommendations.append({
                "type": "learning",
                "priority": "medium",
                "title": "Low Learning Accuracy",
                "description": f"Learning accuracy is at {learning_accuracy:.2f}. Consider reviewing training data or algorithms.",
                "action": "improve_learning_accuracy"
            })
        
        return recommendations

class SystemMonitor:
    """مراقب النظام"""
    
    async def get_system_info(self) -> Dict[str, Any]:
        """الحصول على معلومات النظام"""
        return {
            "cpu_count": psutil.cpu_count(),
            "memory_total_gb": psutil.virtual_memory().total / (1024**3),
            "disk_total_gb": psutil.disk_usage('/').total / (1024**3),
            "boot_time": datetime.fromtimestamp(psutil.boot_time()).isoformat(),
            "platform": psutil.platform(),
            "python_version": psutil.sys.version
        }

class LearningMonitor:
    """مراقب التعلم"""
    
    def __init__(self):
        self.learning_metrics = {}
    
    async def get_learning_stats(self) -> Dict[str, Any]:
        """الحصول على إحصائيات التعلم"""
        return self.learning_metrics

class CacheMonitor:
    """مراقب التخزين المؤقت"""
    
    def __init__(self):
        self.cache_metrics = {}
    
    async def get_cache_stats(self) -> Dict[str, Any]:
        """الحصول على إحصائيات التخزين المؤقت"""
        return self.cache_metrics

class AlertManager:
    """مدير التنبيهات"""
    
    def __init__(self):
        self.alert_history = deque(maxlen=1000)
    
    async def process_alert(self, alert: Alert):
        """معالجة التنبيه"""
        self.alert_history.append(alert)

class DataAggregator:
    """مجمع البيانات"""
    
    def __init__(self):
        self.aggregated_data = {}
    
    async def aggregate_metrics(self, metrics: List[Metric]) -> Dict[str, Any]:
        """تجميع المقاييس"""
        if not metrics:
            return {}
        
        values = [m.value for m in metrics]
        
        return {
            "count": len(values),
            "min": min(values),
            "max": max(values),
            "avg": np.mean(values),
            "median": np.median(values),
            "std": np.std(values)
        }

# مثال على الاستخدام
async def demo_performance_monitor():
    """عرض توضيحي لمراقب الأداء"""
    print("📊 Advanced Performance Monitor Demo")
    print("=" * 50)
    
    monitor = AdvancedPerformanceMonitor()
    await monitor.initialize()
    
    # تسجيل بعض المقاييس التجريبية
    print("\n📈 Recording test metrics...")
    
    test_metrics = [
        ("learning.accuracy", 0.85, MetricType.GAUGE),
        ("learning.response_time_ms", 156, MetricType.TIMER),
        ("system.cpu_usage_percent", 45.2, MetricType.GAUGE),
        ("system.memory_usage_percent", 67.8, MetricType.GAUGE),
        ("cache.hit_rate", 0.92, MetricType.GAUGE)
    ]
    
    for name, value, metric_type in test_metrics:
        await monitor.record_metric(name, value, metric_type)
        print(f"   {name}: {value}")
    
    # انتظار قليل لمحاكاة المراقبة
    await asyncio.sleep(2)
    
    # عرض التحليلات
    print("\n📊 Performance Analytics:")
    analytics = await monitor.get_performance_analytics()
    
    print(f"   System Health: {analytics['system_health']['status']}")
    print(f"   Health Score: {analytics['system_health']['overall_score']:.1f}")
    print(f"   Active Alerts: {analytics['active_alerts']}")
    print(f"   Total Metrics: {analytics['monitoring_stats']['total_metrics_collected']}")
    
    # عرض التوصيات
    if analytics['recommendations']:
        print("\n💡 Recommendations:")
        for rec in analytics['recommendations']:
            print(f"   {rec['priority'].upper()}: {rec['title']}")
    
    # إيقاف المراقبة
    if monitor.monitoring_task:
        monitor.monitoring_task.cancel()
    if monitor.alert_task:
        monitor.alert_task.cancel()
    if monitor.cleanup_task:
        monitor.cleanup_task.cancel()
    
    print("\n✅ Demo completed")

if __name__ == "__main__":
    asyncio.run(demo_performance_monitor())
