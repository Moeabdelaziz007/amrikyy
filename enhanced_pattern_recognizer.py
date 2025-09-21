#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Enhanced Pattern Recognition System for AuraOS Learning Growth
نظام متقدم لاكتشاف الأنماط وتحسين معدل التعلم
"""

import asyncio
import json
import time
import hashlib
import numpy as np
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional, Tuple
from collections import defaultdict, deque
from dataclasses import dataclass
from pathlib import Path
import logging

# إعداد التسجيل
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class Pattern:
    """نمط تعلم محدد"""
    id: str
    pattern_type: str
    confidence: float
    frequency: int
    last_seen: datetime
    success_rate: float
    context: Dict[str, Any]
    metadata: Dict[str, Any]

@dataclass
class LearningMetrics:
    """مقاييس التعلم"""
    patterns_discovered: int
    patterns_per_second: float
    accuracy_improvement: float
    cache_hit_rate: float
    response_time_avg: float
    learning_rate: float

class AdvancedPatternRecognizer:
    """نظام متقدم لاكتشاف الأنماط"""
    
    def __init__(self):
        self.patterns: Dict[str, Pattern] = {}
        self.pattern_cache: Dict[str, Any] = {}
        self.learning_history: deque = deque(maxlen=1000)
        self.metrics = LearningMetrics(0, 0.0, 0.0, 0.0, 0.0, 0.0)
        
        # إعدادات التعلم المتقدم
        self.config = {
            "min_confidence": 0.7,
            "pattern_window_size": 10,
            "learning_rate": 0.1,
            "cache_size_limit": 1000,
            "pattern_decay_factor": 0.95,
            "similarity_threshold": 0.8
        }
        
        # خوارزميات التعلم
        self.similarity_engine = SimilarityEngine()
        self.pattern_clustering = PatternClustering()
        self.adaptive_learning = AdaptiveLearning()
        
        logger.info("🧠 Advanced Pattern Recognizer initialized")
    
    async def analyze_message(self, message: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """تحليل رسالة لاكتشاف الأنماط"""
        start_time = time.time()
        
        try:
            # 1. استخراج الميزات الأساسية
            features = await self._extract_features(message, context)
            
            # 2. البحث عن أنماط مشابهة
            similar_patterns = await self._find_similar_patterns(features)
            
            # 3. تحديث الأنماط الموجودة أو إنشاء جديدة
            pattern_result = await self._update_or_create_pattern(features, similar_patterns)
            
            # 4. تحديث المقاييس
            await self._update_metrics(time.time() - start_time)
            
            # 5. تحسين الأداء
            await self._optimize_performance()
            
            return {
                "pattern_id": pattern_result["pattern_id"],
                "confidence": pattern_result["confidence"],
                "similar_patterns": len(similar_patterns),
                "processing_time": time.time() - start_time,
                "metrics": self.metrics.__dict__
            }
            
        except Exception as e:
            logger.error(f"❌ Error analyzing message: {e}")
            return {"error": str(e)}
    
    async def _extract_features(self, message: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """استخراج الميزات من الرسالة والسياق"""
        features = {
            "text_length": len(message),
            "word_count": len(message.split()),
            "sentiment": await self._analyze_sentiment(message),
            "keywords": await self._extract_keywords(message),
            "intent": await self._detect_intent(message),
            "context_features": self._extract_context_features(context),
            "timestamp": datetime.now(),
            "message_hash": hashlib.md5(message.encode()).hexdigest()
        }
        
        return features
    
    async def _analyze_sentiment(self, message: str) -> float:
        """تحليل المشاعر (محاكاة)"""
        # في التطبيق الحقيقي، سيتم استخدام مكتبة تحليل المشاعر
        positive_words = ["good", "great", "excellent", "amazing", "wonderful", "perfect"]
        negative_words = ["bad", "terrible", "awful", "horrible", "worst", "disappointed"]
        
        message_lower = message.lower()
        positive_count = sum(1 for word in positive_words if word in message_lower)
        negative_count = sum(1 for word in negative_words if word in message_lower)
        
        if positive_count > negative_count:
            return 0.8
        elif negative_count > positive_count:
            return 0.2
        else:
            return 0.5
    
    async def _extract_keywords(self, message: str) -> List[str]:
        """استخراج الكلمات المفتاحية"""
        # إزالة الكلمات الشائعة
        stop_words = {"the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with", "by"}
        
        words = message.lower().split()
        keywords = [word for word in words if len(word) > 3 and word not in stop_words]
        
        return keywords[:10]  # أول 10 كلمات مفتاحية
    
    async def _detect_intent(self, message: str) -> str:
        """كشف نية الرسالة"""
        message_lower = message.lower()
        
        if any(word in message_lower for word in ["help", "support", "assist"]):
            return "help_request"
        elif any(word in message_lower for word in ["install", "setup", "configure"]):
            return "installation"
        elif any(word in message_lower for word in ["error", "problem", "issue", "bug"]):
            return "problem_report"
        elif any(word in message_lower for word in ["question", "ask", "what", "how", "why"]):
            return "question"
        else:
            return "general"
    
    def _extract_context_features(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """استخراج ميزات السياق"""
        return {
            "user_level": context.get("level", "unknown"),
            "platform": context.get("platform", "unknown"),
            "session_duration": context.get("session_duration", 0),
            "previous_interactions": len(context.get("history", []))
        }
    
    async def _find_similar_patterns(self, features: Dict[str, Any]) -> List[Pattern]:
        """البحث عن أنماط مشابهة"""
        similar_patterns = []
        
        for pattern in self.patterns.values():
            similarity = await self.similarity_engine.calculate_similarity(features, pattern)
            
            if similarity >= self.config["similarity_threshold"]:
                similar_patterns.append(pattern)
        
        # ترتيب حسب التشابه
        similar_patterns.sort(key=lambda p: p.confidence, reverse=True)
        
        return similar_patterns[:5]  # أفضل 5 أنماط مشابهة
    
    async def _update_or_create_pattern(self, features: Dict[str, Any], similar_patterns: List[Pattern]) -> Dict[str, Any]:
        """تحديث نمط موجود أو إنشاء جديد"""
        if similar_patterns:
            # تحديث النمط الأكثر تشابهًا
            best_pattern = similar_patterns[0]
            await self._update_pattern(best_pattern, features)
            
            return {
                "pattern_id": best_pattern.id,
                "confidence": best_pattern.confidence,
                "action": "updated"
            }
        else:
            # إنشاء نمط جديد
            new_pattern = await self._create_pattern(features)
            
            return {
                "pattern_id": new_pattern.id,
                "confidence": new_pattern.confidence,
                "action": "created"
            }
    
    async def _update_pattern(self, pattern: Pattern, features: Dict[str, Any]):
        """تحديث نمط موجود"""
        # تحديث التكرار
        pattern.frequency += 1
        pattern.last_seen = datetime.now()
        
        # تحديث الثقة بناءً على الأداء
        pattern.confidence = min(0.95, pattern.confidence + self.config["learning_rate"])
        
        # تحديث السياق
        pattern.context.update(features["context_features"])
        
        # تحديث البيانات الوصفية
        pattern.metadata["last_update"] = datetime.now()
        pattern.metadata["update_count"] = pattern.metadata.get("update_count", 0) + 1
        
        logger.info(f"🔄 Updated pattern {pattern.id} (confidence: {pattern.confidence:.2f})")
    
    async def _create_pattern(self, features: Dict[str, Any]) -> Pattern:
        """إنشاء نمط جديد"""
        pattern_id = f"pattern_{int(time.time())}_{hashlib.md5(str(features).encode()).hexdigest()[:8]}"
        
        new_pattern = Pattern(
            id=pattern_id,
            pattern_type=features["intent"],
            confidence=self.config["min_confidence"],
            frequency=1,
            last_seen=datetime.now(),
            success_rate=0.5,  # معدل نجاح ابتدائي
            context=features["context_features"],
            metadata={
                "created": datetime.now(),
                "features": features,
                "update_count": 0
            }
        )
        
        self.patterns[pattern_id] = new_pattern
        self.metrics.patterns_discovered += 1
        
        logger.info(f"✨ Created new pattern {pattern_id} (type: {features['intent']})")
        
        return new_pattern
    
    async def _update_metrics(self, processing_time: float):
        """تحديث مقاييس الأداء"""
        current_time = time.time()
        
        # تحديث معدل اكتشاف الأنماط
        if len(self.learning_history) > 0:
            time_diff = current_time - self.learning_history[-1]["timestamp"]
            if time_diff > 0:
                self.metrics.patterns_per_second = 1.0 / time_diff
        
        # تحديث متوسط وقت الاستجابة
        self.metrics.response_time_avg = (
            self.metrics.response_time_avg * 0.9 + processing_time * 0.1
        )
        
        # تحديث معدل التعلم
        self.metrics.learning_rate = min(0.95, self.metrics.learning_rate + 0.001)
        
        # إضافة إلى التاريخ
        self.learning_history.append({
            "timestamp": current_time,
            "processing_time": processing_time,
            "patterns_count": len(self.patterns)
        })
    
    async def _optimize_performance(self):
        """تحسين الأداء"""
        # تنظيف الأنماط القديمة
        await self._cleanup_old_patterns()
        
        # تحسين التخزين المؤقت
        await self._optimize_cache()
        
        # تحديث التجميعات
        await self.pattern_clustering.update_clusters(self.patterns)
    
    async def _cleanup_old_patterns(self):
        """تنظيف الأنماط القديمة"""
        current_time = datetime.now()
        cutoff_time = current_time - timedelta(hours=24)
        
        patterns_to_remove = []
        
        for pattern_id, pattern in self.patterns.items():
            # إزالة الأنماط غير المستخدمة لفترة طويلة
            if pattern.last_seen < cutoff_time and pattern.frequency < 3:
                patterns_to_remove.append(pattern_id)
            
            # تطبيق عامل التدهور
            pattern.confidence *= self.config["pattern_decay_factor"]
            
            # إزالة الأنماط منخفضة الثقة
            if pattern.confidence < 0.3:
                patterns_to_remove.append(pattern_id)
        
        # إزالة الأنماط المحددة
        for pattern_id in patterns_to_remove:
            del self.patterns[pattern_id]
            logger.info(f"🗑️ Removed old pattern {pattern_id}")
    
    async def _optimize_cache(self):
        """تحسين التخزين المؤقت"""
        if len(self.pattern_cache) > self.config["cache_size_limit"]:
            # إزالة العناصر الأقل استخدامًا
            sorted_items = sorted(
                self.pattern_cache.items(),
                key=lambda x: x[1].get("last_used", 0)
            )
            
            # الاحتفاظ بأفضل 80%
            keep_count = int(len(sorted_items) * 0.8)
            self.pattern_cache = dict(sorted_items[-keep_count:])
            
            logger.info(f"🧹 Cache optimized: {len(self.pattern_cache)} items remaining")
    
    async def get_learning_analytics(self) -> Dict[str, Any]:
        """الحصول على تحليلات التعلم"""
        return {
            "total_patterns": len(self.patterns),
            "patterns_per_second": self.metrics.patterns_per_second,
            "average_confidence": np.mean([p.confidence for p in self.patterns.values()]) if self.patterns else 0,
            "average_frequency": np.mean([p.frequency for p in self.patterns.values()]) if self.patterns else 0,
            "learning_rate": self.metrics.learning_rate,
            "response_time_avg": self.metrics.response_time_avg,
            "cache_size": len(self.pattern_cache),
            "pattern_types": {
                pattern_type: len([p for p in self.patterns.values() if p.pattern_type == pattern_type])
                for pattern_type in set(p.pattern_type for p in self.patterns.values())
            },
            "recent_activity": len(self.learning_history),
            "timestamp": datetime.now().isoformat()
        }

class SimilarityEngine:
    """محرك حساب التشابه"""
    
    async def calculate_similarity(self, features1: Dict[str, Any], pattern: Pattern) -> float:
        """حساب التشابه بين الميزات والنمط"""
        try:
            similarity_score = 0.0
            total_weight = 0.0
            
            # تشابه الكلمات المفتاحية
            if "keywords" in features1 and pattern.metadata.get("features", {}).get("keywords"):
                keyword_similarity = self._calculate_keyword_similarity(
                    features1["keywords"],
                    pattern.metadata["features"]["keywords"]
                )
                similarity_score += keyword_similarity * 0.4
                total_weight += 0.4
            
            # تشابه النية
            if features1.get("intent") == pattern.pattern_type:
                similarity_score += 0.3
            total_weight += 0.3
            
            # تشابه السياق
            context_similarity = self._calculate_context_similarity(
                features1.get("context_features", {}),
                pattern.context
            )
            similarity_score += context_similarity * 0.2
            total_weight += 0.2
            
            # تشابه المشاعر
            sentiment_diff = abs(features1.get("sentiment", 0.5) - pattern.metadata.get("features", {}).get("sentiment", 0.5))
            sentiment_similarity = 1.0 - sentiment_diff
            similarity_score += sentiment_similarity * 0.1
            total_weight += 0.1
            
            return similarity_score / total_weight if total_weight > 0 else 0.0
            
        except Exception as e:
            logger.error(f"❌ Error calculating similarity: {e}")
            return 0.0
    
    def _calculate_keyword_similarity(self, keywords1: List[str], keywords2: List[str]) -> float:
        """حساب تشابه الكلمات المفتاحية"""
        if not keywords1 or not keywords2:
            return 0.0
        
        set1 = set(keywords1)
        set2 = set(keywords2)
        
        intersection = len(set1.intersection(set2))
        union = len(set1.union(set2))
        
        return intersection / union if union > 0 else 0.0
    
    def _calculate_context_similarity(self, context1: Dict[str, Any], context2: Dict[str, Any]) -> float:
        """حساب تشابه السياق"""
        if not context1 or not context2:
            return 0.0
        
        common_keys = set(context1.keys()).intersection(set(context2.keys()))
        if not common_keys:
            return 0.0
        
        matches = 0
        for key in common_keys:
            if context1[key] == context2[key]:
                matches += 1
        
        return matches / len(common_keys)

class PatternClustering:
    """تجميع الأنماط"""
    
    def __init__(self):
        self.clusters: Dict[str, List[str]] = {}
    
    async def update_clusters(self, patterns: Dict[str, Pattern]):
        """تحديث تجميعات الأنماط"""
        # تجميع بسيط حسب النوع
        self.clusters = defaultdict(list)
        
        for pattern_id, pattern in patterns.items():
            self.clusters[pattern.pattern_type].append(pattern_id)
        
        logger.info(f"📊 Updated clusters: {len(self.clusters)} clusters")

class AdaptiveLearning:
    """التعلم التكيفي"""
    
    def __init__(self):
        self.learning_history = deque(maxlen=100)
        self.performance_trend = 0.0
    
    async def adjust_learning_rate(self, performance: float) -> float:
        """تعديل معدل التعلم بناءً على الأداء"""
        self.learning_history.append(performance)
        
        if len(self.learning_history) >= 10:
            recent_performance = np.mean(list(self.learning_history)[-10:])
            older_performance = np.mean(list(self.learning_history)[-20:-10]) if len(self.learning_history) >= 20 else recent_performance
            
            self.performance_trend = recent_performance - older_performance
            
            # تعديل معدل التعلم بناءً على الاتجاه
            if self.performance_trend > 0.1:
                return 0.15  # زيادة معدل التعلم
            elif self.performance_trend < -0.1:
                return 0.05  # تقليل معدل التعلم
            else:
                return 0.1   # معدل التعلم العادي
        
        return 0.1

# مثال على الاستخدام
async def demo_pattern_recognizer():
    """عرض توضيحي لنظام اكتشاف الأنماط"""
    print("🧠 Advanced Pattern Recognition Demo")
    print("=" * 50)
    
    recognizer = AdvancedPatternRecognizer()
    
    # رسائل تجريبية
    test_messages = [
        ("Hello, I need help with installation", {"level": "beginner", "platform": "macOS"}),
        ("How do I install AuraOS on Windows?", {"level": "beginner", "platform": "Windows"}),
        ("I'm getting an error during setup", {"level": "intermediate", "platform": "Linux"}),
        ("Can you help me configure the system?", {"level": "advanced", "platform": "macOS"}),
        ("What are the system requirements?", {"level": "beginner", "platform": "unknown"}),
    ]
    
    for i, (message, context) in enumerate(test_messages, 1):
        print(f"\n📝 Message {i}: {message}")
        
        result = await recognizer.analyze_message(message, context)
        
        if "error" not in result:
            print(f"   Pattern ID: {result['pattern_id']}")
            print(f"   Confidence: {result['confidence']:.2f}")
            print(f"   Similar Patterns: {result['similar_patterns']}")
            print(f"   Processing Time: {result['processing_time']:.3f}s")
        
        await asyncio.sleep(0.1)  # محاكاة التوقيت الطبيعي
    
    # عرض التحليلات النهائية
    print(f"\n📊 Final Analytics:")
    analytics = await recognizer.get_learning_analytics()
    
    for key, value in analytics.items():
        if isinstance(value, float):
            print(f"   {key}: {value:.3f}")
        else:
            print(f"   {key}: {value}")

if __name__ == "__main__":
    asyncio.run(demo_pattern_recognizer())
