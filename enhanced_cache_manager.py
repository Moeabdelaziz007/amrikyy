#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Advanced Cache Management System for AuraOS Learning Growth
نظام متقدم لإدارة التخزين المؤقت وتجنب التخزين الزائد
"""

import asyncio
import json
import time
import hashlib
import heapq
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional, Tuple, Union
from collections import defaultdict, OrderedDict
from dataclasses import dataclass, field
from enum import Enum
import logging
import psutil
import os

# إعداد التسجيل
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class CacheType(Enum):
    """أنواع التخزين المؤقت"""
    PATTERN_CACHE = "pattern_cache"
    RESPONSE_CACHE = "response_cache"
    CONTEXT_CACHE = "context_cache"
    LEARNING_CACHE = "learning_cache"
    METRICS_CACHE = "metrics_cache"

class EvictionPolicy(Enum):
    """سياسات الإزالة"""
    LRU = "lru"  # Least Recently Used
    LFU = "lfu"  # Least Frequently Used
    TTL = "ttl"  # Time To Live
    SIZE_BASED = "size_based"
    ADAPTIVE = "adaptive"

@dataclass
class CacheEntry:
    """إدخال التخزين المؤقت"""
    key: str
    value: Any
    cache_type: CacheType
    created_at: datetime
    last_accessed: datetime
    access_count: int = 0
    size_bytes: int = 0
    ttl_seconds: Optional[int] = None
    priority: float = 1.0
    metadata: Dict[str, Any] = field(default_factory=dict)

@dataclass
class CacheStats:
    """إحصائيات التخزين المؤقت"""
    total_entries: int
    total_size_bytes: int
    hit_rate: float
    miss_rate: float
    eviction_count: int
    memory_usage_percent: float
    cache_efficiency: float

class AdvancedCacheManager:
    """مدير التخزين المؤقت المتقدم"""
    
    def __init__(self):
        self.caches: Dict[CacheType, Dict[str, CacheEntry]] = {
            cache_type: {} for cache_type in CacheType
        }
        
        # إعدادات النظام
        self.config = {
            "max_total_size_mb": 100,
            "max_entries_per_cache": 1000,
            "default_ttl_seconds": 3600,  # ساعة واحدة
            "eviction_threshold": 0.8,  # 80% من الحد الأقصى
            "cleanup_interval_seconds": 300,  # 5 دقائق
            "memory_monitoring": True,
            "adaptive_sizing": True
        }
        
        # إحصائيات النظام
        self.stats = CacheStats(0, 0, 0.0, 0.0, 0, 0.0, 0.0)
        self.hit_count = 0
        self.miss_count = 0
        
        # سياسات الإزالة لكل نوع
        self.eviction_policies = {
            CacheType.PATTERN_CACHE: EvictionPolicy.LRU,
            CacheType.RESPONSE_CACHE: EvictionPolicy.TTL,
            CacheType.CONTEXT_CACHE: EvictionPolicy.LRU,
            CacheType.LEARNING_CACHE: EvictionPolicy.LFU,
            CacheType.METRICS_CACHE: EvictionPolicy.SIZE_BASED
        }
        
        # خوارزميات الإدارة
        self.size_calculator = SizeCalculator()
        self.eviction_manager = EvictionManager()
        self.memory_monitor = MemoryMonitor()
        self.performance_optimizer = PerformanceOptimizer()
        
        # بدء المهام الخلفية
        self.cleanup_task = None
        self.monitoring_task = None
        
        logger.info("💾 Advanced Cache Manager initialized")
    
    async def initialize(self):
        """تهيئة النظام"""
        # بدء مهمة التنظيف الدوري
        self.cleanup_task = asyncio.create_task(self._periodic_cleanup())
        
        # بدء مراقبة الذاكرة
        if self.config["memory_monitoring"]:
            self.monitoring_task = asyncio.create_task(self._memory_monitoring())
        
        logger.info("✅ Cache Manager initialized and running")
    
    async def get(self, key: str, cache_type: CacheType) -> Optional[Any]:
        """الحصول على قيمة من التخزين المؤقت"""
        try:
            cache = self.caches[cache_type]
            
            if key in cache:
                entry = cache[key]
                
                # فحص انتهاء الصلاحية
                if self._is_expired(entry):
                    await self._remove_entry(key, cache_type)
                    self.miss_count += 1
                    return None
                
                # تحديث إحصائيات الوصول
                entry.last_accessed = datetime.now()
                entry.access_count += 1
                
                self.hit_count += 1
                await self._update_stats()
                
                logger.debug(f"✅ Cache hit: {key} from {cache_type.value}")
                return entry.value
            else:
                self.miss_count += 1
                await self._update_stats()
                
                logger.debug(f"❌ Cache miss: {key} from {cache_type.value}")
                return None
                
        except Exception as e:
            logger.error(f"❌ Error getting from cache: {e}")
            return None
    
    async def set(self, key: str, value: Any, cache_type: CacheType, 
                 ttl_seconds: Optional[int] = None, priority: float = 1.0) -> bool:
        """إضافة قيمة إلى التخزين المؤقت"""
        try:
            # حساب حجم القيمة
            size_bytes = await self.size_calculator.calculate_size(value)
            
            # إنشاء إدخال جديد
            entry = CacheEntry(
                key=key,
                value=value,
                cache_type=cache_type,
                created_at=datetime.now(),
                last_accessed=datetime.now(),
                size_bytes=size_bytes,
                ttl_seconds=ttl_seconds or self.config["default_ttl_seconds"],
                priority=priority,
                metadata={"created_by": "cache_manager"}
            )
            
            # فحص المساحة المتاحة
            if not await self._has_space_for_entry(entry):
                await self._evict_if_needed(cache_type)
            
            # إضافة الإدخال
            self.caches[cache_type][key] = entry
            
            await self._update_stats()
            
            logger.debug(f"💾 Cached: {key} in {cache_type.value} ({size_bytes} bytes)")
            return True
            
        except Exception as e:
            logger.error(f"❌ Error setting cache: {e}")
            return False
    
    async def delete(self, key: str, cache_type: CacheType) -> bool:
        """حذف إدخال من التخزين المؤقت"""
        try:
            if key in self.caches[cache_type]:
                await self._remove_entry(key, cache_type)
                await self._update_stats()
                logger.debug(f"🗑️ Deleted: {key} from {cache_type.value}")
                return True
            return False
            
        except Exception as e:
            logger.error(f"❌ Error deleting from cache: {e}")
            return False
    
    async def clear(self, cache_type: Optional[CacheType] = None) -> int:
        """مسح التخزين المؤقت"""
        try:
            cleared_count = 0
            
            if cache_type:
                cleared_count = len(self.caches[cache_type])
                self.caches[cache_type].clear()
            else:
                for cache in self.caches.values():
                    cleared_count += len(cache)
                    cache.clear()
            
            await self._update_stats()
            logger.info(f"🧹 Cleared {cleared_count} entries from cache")
            return cleared_count
            
        except Exception as e:
            logger.error(f"❌ Error clearing cache: {e}")
            return 0
    
    async def _is_expired(self, entry: CacheEntry) -> bool:
        """فحص انتهاء صلاحية الإدخال"""
        if entry.ttl_seconds is None:
            return False
        
        expiry_time = entry.created_at + timedelta(seconds=entry.ttl_seconds)
        return datetime.now() > expiry_time
    
    async def _has_space_for_entry(self, entry: CacheEntry) -> bool:
        """فحص توفر المساحة للإدخال"""
        current_size = self.stats.total_size_bytes
        max_size = self.config["max_total_size_mb"] * 1024 * 1024
        
        return (current_size + entry.size_bytes) <= max_size
    
    async def _evict_if_needed(self, cache_type: CacheType):
        """إزالة الإدخالات عند الحاجة"""
        cache = self.caches[cache_type]
        
        # فحص الحد الأقصى للإدخالات
        if len(cache) >= self.config["max_entries_per_cache"]:
            await self._evict_entries(cache_type, 1)
        
        # فحص الحد الأقصى للحجم
        current_size = sum(entry.size_bytes for entry in cache.values())
        max_size = self.config["max_total_size_mb"] * 1024 * 1024
        
        if current_size >= max_size * self.config["eviction_threshold"]:
            entries_to_evict = max(1, len(cache) // 10)  # إزالة 10%
            await self._evict_entries(cache_type, entries_to_evict)
    
    async def _evict_entries(self, cache_type: CacheType, count: int):
        """إزالة إدخالات محددة"""
        cache = self.caches[cache_type]
        policy = self.eviction_policies[cache_type]
        
        entries_to_evict = await self.eviction_manager.select_entries_for_eviction(
            cache, policy, count
        )
        
        for key in entries_to_evict:
            await self._remove_entry(key, cache_type)
            self.stats.eviction_count += 1
        
        logger.info(f"🗑️ Evicted {len(entries_to_evict)} entries from {cache_type.value}")
    
    async def _remove_entry(self, key: str, cache_type: CacheType):
        """إزالة إدخال محدد"""
        if key in self.caches[cache_type]:
            del self.caches[cache_type][key]
    
    async def _update_stats(self):
        """تحديث الإحصائيات"""
        self.stats.total_entries = sum(len(cache) for cache in self.caches.values())
        self.stats.total_size_bytes = sum(
            sum(entry.size_bytes for entry in cache.values())
            for cache in self.caches.values()
        )
        
        total_requests = self.hit_count + self.miss_count
        if total_requests > 0:
            self.stats.hit_rate = self.hit_count / total_requests
            self.stats.miss_rate = self.miss_count / total_requests
        
        # حساب كفاءة التخزين المؤقت
        self.stats.cache_efficiency = self.stats.hit_rate * (1 - self.stats.miss_rate)
    
    async def _periodic_cleanup(self):
        """تنظيف دوري للتخزين المؤقت"""
        while True:
            try:
                await asyncio.sleep(self.config["cleanup_interval_seconds"])
                
                # إزالة الإدخالات المنتهية الصلاحية
                expired_count = 0
                for cache_type, cache in self.caches.items():
                    expired_keys = [
                        key for key, entry in cache.items()
                        if await self._is_expired(entry)
                    ]
                    
                    for key in expired_keys:
                        await self._remove_entry(key, cache_type)
                        expired_count += 1
                
                if expired_count > 0:
                    logger.info(f"🧹 Cleaned up {expired_count} expired entries")
                
                # تحسين الأداء
                await self.performance_optimizer.optimize_caches(self.caches)
                
            except Exception as e:
                logger.error(f"❌ Error in periodic cleanup: {e}")
    
    async def _memory_monitoring(self):
        """مراقبة استخدام الذاكرة"""
        while True:
            try:
                await asyncio.sleep(60)  # كل دقيقة
                
                # الحصول على استخدام الذاكرة
                memory_info = psutil.virtual_memory()
                self.stats.memory_usage_percent = memory_info.percent
                
                # تحذير عند ارتفاع استخدام الذاكرة
                if memory_info.percent > 85:
                    logger.warning(f"⚠️ High memory usage: {memory_info.percent:.1f}%")
                    
                    # تنظيف إضافي عند ارتفاع الذاكرة
                    await self._emergency_cleanup()
                
            except Exception as e:
                logger.error(f"❌ Error in memory monitoring: {e}")
    
    async def _emergency_cleanup(self):
        """تنظيف طارئ عند ارتفاع الذاكرة"""
        logger.warning("🚨 Emergency cache cleanup initiated")
        
        # إزالة الإدخالات منخفضة الأولوية
        for cache_type, cache in self.caches.items():
            low_priority_entries = [
                (key, entry) for key, entry in cache.items()
                if entry.priority < 0.5
            ]
            
            # ترتيب حسب الأولوية والوصول الأخير
            low_priority_entries.sort(key=lambda x: (x[1].priority, x[1].last_accessed))
            
            # إزالة النصف الأقل أولوية
            entries_to_remove = low_priority_entries[:len(low_priority_entries)//2]
            
            for key, _ in entries_to_remove:
                await self._remove_entry(key, cache_type)
        
        await self._update_stats()
        logger.info("✅ Emergency cleanup completed")
    
    async def get_cache_analytics(self) -> Dict[str, Any]:
        """الحصول على تحليلات التخزين المؤقت"""
        analytics = {
            "overall_stats": self.stats.__dict__,
            "cache_types": {},
            "memory_info": {
                "total_size_mb": self.stats.total_size_bytes / (1024 * 1024),
                "memory_usage_percent": self.stats.memory_usage_percent,
                "available_memory_mb": psutil.virtual_memory().available / (1024 * 1024)
            },
            "performance_metrics": {
                "hit_rate": self.stats.hit_rate,
                "miss_rate": self.stats.miss_rate,
                "efficiency": self.stats.cache_efficiency,
                "eviction_rate": self.stats.eviction_count / max(1, self.stats.total_entries)
            },
            "timestamp": datetime.now().isoformat()
        }
        
        # إحصائيات كل نوع تخزين مؤقت
        for cache_type, cache in self.caches.items():
            analytics["cache_types"][cache_type.value] = {
                "entry_count": len(cache),
                "total_size_bytes": sum(entry.size_bytes for entry in cache.values()),
                "avg_entry_size": np.mean([entry.size_bytes for entry in cache.values()]) if cache else 0,
                "eviction_policy": self.eviction_policies[cache_type].value,
                "oldest_entry": min([entry.created_at for entry in cache.values()]).isoformat() if cache else None,
                "newest_entry": max([entry.created_at for entry in cache.values()]).isoformat() if cache else None
            }
        
        return analytics

class SizeCalculator:
    """حاسبة الحجم"""
    
    async def calculate_size(self, value: Any) -> int:
        """حساب حجم القيمة بالبايت"""
        try:
            if isinstance(value, str):
                return len(value.encode('utf-8'))
            elif isinstance(value, (int, float)):
                return 8  # تقدير تقريبي
            elif isinstance(value, dict):
                return len(json.dumps(value, default=str).encode('utf-8'))
            elif isinstance(value, list):
                return sum(await self.calculate_size(item) for item in value)
            else:
                return len(str(value).encode('utf-8'))
        except Exception:
            return 1024  # حجم افتراضي

class EvictionManager:
    """مدير الإزالة"""
    
    async def select_entries_for_eviction(self, cache: Dict[str, CacheEntry], 
                                        policy: EvictionPolicy, count: int) -> List[str]:
        """اختيار الإدخالات للإزالة"""
        if len(cache) <= count:
            return list(cache.keys())
        
        if policy == EvictionPolicy.LRU:
            return self._select_lru(cache, count)
        elif policy == EvictionPolicy.LFU:
            return self._select_lfu(cache, count)
        elif policy == EvictionPolicy.TTL:
            return self._select_by_ttl(cache, count)
        elif policy == EvictionPolicy.SIZE_BASED:
            return self._select_by_size(cache, count)
        else:  # ADAPTIVE
            return self._select_adaptive(cache, count)
    
    def _select_lru(self, cache: Dict[str, CacheEntry], count: int) -> List[str]:
        """اختيار الأقل استخدامًا مؤخرًا"""
        sorted_entries = sorted(
            cache.items(),
            key=lambda x: x[1].last_accessed
        )
        return [key for key, _ in sorted_entries[:count]]
    
    def _select_lfu(self, cache: Dict[str, CacheEntry], count: int) -> List[str]:
        """اختيار الأقل استخدامًا"""
        sorted_entries = sorted(
            cache.items(),
            key=lambda x: x[1].access_count
        )
        return [key for key, _ in sorted_entries[:count]]
    
    def _select_by_ttl(self, cache: Dict[str, CacheEntry], count: int) -> List[str]:
        """اختيار حسب انتهاء الصلاحية"""
        sorted_entries = sorted(
            cache.items(),
            key=lambda x: x[1].created_at + timedelta(seconds=x[1].ttl_seconds or 0)
        )
        return [key for key, _ in sorted_entries[:count]]
    
    def _select_by_size(self, cache: Dict[str, CacheEntry], count: int) -> List[str]:
        """اختيار حسب الحجم"""
        sorted_entries = sorted(
            cache.items(),
            key=lambda x: x[1].size_bytes,
            reverse=True
        )
        return [key for key, _ in sorted_entries[:count]]
    
    def _select_adaptive(self, cache: Dict[str, CacheEntry], count: int) -> List[str]:
        """اختيار تكيفي"""
        # دمج عدة عوامل
        scored_entries = []
        
        for key, entry in cache.items():
            score = (
                entry.access_count * 0.3 +  # تكرار الاستخدام
                (datetime.now() - entry.last_accessed).total_seconds() * 0.4 +  # الوقت منذ آخر استخدام
                entry.size_bytes * 0.2 +  # الحجم
                (1 - entry.priority) * 0.1  # الأولوية
            )
            scored_entries.append((key, score))
        
        scored_entries.sort(key=lambda x: x[1], reverse=True)
        return [key for key, _ in scored_entries[:count]]

class MemoryMonitor:
    """مراقب الذاكرة"""
    
    def __init__(self):
        self.memory_history = deque(maxlen=100)
    
    async def get_memory_usage(self) -> Dict[str, float]:
        """الحصول على استخدام الذاكرة"""
        memory_info = psutil.virtual_memory()
        
        return {
            "total_mb": memory_info.total / (1024 * 1024),
            "available_mb": memory_info.available / (1024 * 1024),
            "used_percent": memory_info.percent,
            "cached_mb": memory_info.cached / (1024 * 1024) if hasattr(memory_info, 'cached') else 0
        }

class PerformanceOptimizer:
    """محسن الأداء"""
    
    async def optimize_caches(self, caches: Dict[CacheType, Dict[str, CacheEntry]]):
        """تحسين أداء التخزين المؤقت"""
        for cache_type, cache in caches.items():
            # تحسين ترتيب الإدخالات حسب الاستخدام
            await self._optimize_access_patterns(cache)
            
            # ضغط البيانات إذا أمكن
            await self._compress_large_entries(cache)
    
    async def _optimize_access_patterns(self, cache: Dict[str, CacheEntry]):
        """تحسين أنماط الوصول"""
        # إعادة ترتيب الإدخالات حسب تكرار الاستخدام
        pass  # يمكن تطبيق خوارزميات تحسين متقدمة
    
    async def _compress_large_entries(self, cache: Dict[str, CacheEntry]):
        """ضغط الإدخالات الكبيرة"""
        # ضغط الإدخالات التي تتجاوز حجم معين
        pass  # يمكن تطبيق ضغط البيانات

# مثال على الاستخدام
async def demo_cache_manager():
    """عرض توضيحي لمدير التخزين المؤقت"""
    print("💾 Advanced Cache Manager Demo")
    print("=" * 50)
    
    cache_manager = AdvancedCacheManager()
    await cache_manager.initialize()
    
    # اختبار إضافة البيانات
    test_data = [
        ("pattern_001", {"type": "help_request", "confidence": 0.9}, CacheType.PATTERN_CACHE),
        ("response_001", "This is a helpful response", CacheType.RESPONSE_CACHE),
        ("context_001", {"user_level": "beginner", "platform": "macOS"}, CacheType.CONTEXT_CACHE),
        ("learning_001", {"accuracy": 0.85, "patterns": 45}, CacheType.LEARNING_CACHE),
        ("metrics_001", {"hit_rate": 0.92, "response_time": 156}, CacheType.METRICS_CACHE)
    ]
    
    print("\n📝 Adding test data to cache...")
    for key, value, cache_type in test_data:
        success = await cache_manager.set(key, value, cache_type)
        print(f"   {key} -> {cache_type.value}: {'✅' if success else '❌'}")
    
    # اختبار استرجاع البيانات
    print("\n🔍 Retrieving data from cache...")
    for key, _, cache_type in test_data:
        value = await cache_manager.get(key, cache_type)
        print(f"   {key} from {cache_type.value}: {'✅' if value else '❌'}")
    
    # عرض التحليلات
    print("\n📊 Cache Analytics:")
    analytics = await cache_manager.get_cache_analytics()
    
    print(f"   Total Entries: {analytics['overall_stats']['total_entries']}")
    print(f"   Total Size: {analytics['overall_stats']['total_size_bytes']} bytes")
    print(f"   Hit Rate: {analytics['overall_stats']['hit_rate']:.3f}")
    print(f"   Memory Usage: {analytics['memory_info']['memory_usage_percent']:.1f}%")
    
    # تنظيف
    await cache_manager.clear()
    print("\n🧹 Cache cleared")

if __name__ == "__main__":
    asyncio.run(demo_cache_manager())
