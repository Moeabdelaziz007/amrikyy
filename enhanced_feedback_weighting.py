#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Advanced Feedback Weighting System for AuraOS Learning Growth
نظام متقدم لتقييم التغذية الراجعة وتحسين دقة الاستجابة
"""

import asyncio
import json
import time
import numpy as np
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional, Tuple
from collections import defaultdict, deque
from dataclasses import dataclass
from enum import Enum
import logging

# إعداد التسجيل
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class FeedbackType(Enum):
    """أنواع التغذية الراجعة"""
    POSITIVE = "positive"
    NEGATIVE = "negative"
    NEUTRAL = "neutral"
    CORRECTION = "correction"
    ENHANCEMENT = "enhancement"

class FeedbackSource(Enum):
    """مصادر التغذية الراجعة"""
    USER_RATING = "user_rating"
    USER_COMMENT = "user_comment"
    SYSTEM_METRICS = "system_metrics"
    PERFORMANCE_DATA = "performance_data"
    IMPLICIT_BEHAVIOR = "implicit_behavior"

@dataclass
class FeedbackEntry:
    """إدخال تغذية راجعة"""
    id: str
    pattern_id: str
    feedback_type: FeedbackType
    source: FeedbackSource
    score: float  # -1.0 إلى 1.0
    weight: float  # وزن التغذية الراجعة
    timestamp: datetime
    context: Dict[str, Any]
    metadata: Dict[str, Any]

@dataclass
class PatternPerformance:
    """أداء النمط"""
    pattern_id: str
    total_feedback: int
    positive_feedback: int
    negative_feedback: int
    weighted_score: float
    confidence_adjustment: float
    last_updated: datetime

class AdvancedFeedbackWeighting:
    """نظام متقدم لتقييم التغذية الراجعة"""
    
    def __init__(self):
        self.feedback_history: Dict[str, List[FeedbackEntry]] = defaultdict(list)
        self.pattern_performance: Dict[str, PatternPerformance] = {}
        self.feedback_weights: Dict[FeedbackSource, float] = {
            FeedbackSource.USER_RATING: 1.0,
            FeedbackSource.USER_COMMENT: 0.8,
            FeedbackSource.SYSTEM_METRICS: 0.6,
            FeedbackSource.PERFORMANCE_DATA: 0.7,
            FeedbackSource.IMPLICIT_BEHAVIOR: 0.4
        }
        
        # إعدادات النظام
        self.config = {
            "min_feedback_count": 3,
            "confidence_threshold": 0.7,
            "weight_decay_factor": 0.95,
            "learning_rate": 0.1,
            "feedback_window_hours": 24,
            "adaptive_weighting": True
        }
        
        # خوارزميات التقييم
        self.sentiment_analyzer = SentimentAnalyzer()
        self.weight_calculator = WeightCalculator()
        self.performance_tracker = PerformanceTracker()
        
        logger.info("🎯 Advanced Feedback Weighting System initialized")
    
    async def process_feedback(self, pattern_id: str, feedback_data: Dict[str, Any]) -> Dict[str, Any]:
        """معالجة التغذية الراجعة"""
        try:
            # 1. تحليل نوع التغذية الراجعة
            feedback_type = await self._analyze_feedback_type(feedback_data)
            
            # 2. تحديد المصدر
            source = await self._identify_feedback_source(feedback_data)
            
            # 3. حساب النقاط والوزن
            score = await self._calculate_feedback_score(feedback_data, feedback_type)
            weight = await self._calculate_feedback_weight(feedback_data, source)
            
            # 4. إنشاء إدخال التغذية الراجعة
            feedback_entry = FeedbackEntry(
                id=f"feedback_{int(time.time())}_{hash(str(feedback_data))[:8]}",
                pattern_id=pattern_id,
                feedback_type=feedback_type,
                source=source,
                score=score,
                weight=weight,
                timestamp=datetime.now(),
                context=feedback_data.get("context", {}),
                metadata=feedback_data.get("metadata", {})
            )
            
            # 5. إضافة إلى التاريخ
            self.feedback_history[pattern_id].append(feedback_entry)
            
            # 6. تحديث أداء النمط
            await self._update_pattern_performance(pattern_id, feedback_entry)
            
            # 7. تطبيق التعلم التكيفي
            await self._apply_adaptive_learning(pattern_id)
            
            return {
                "feedback_id": feedback_entry.id,
                "pattern_id": pattern_id,
                "feedback_type": feedback_type.value,
                "source": source.value,
                "score": score,
                "weight": weight,
                "pattern_performance": self.pattern_performance.get(pattern_id).__dict__ if pattern_id in self.pattern_performance else None,
                "timestamp": feedback_entry.timestamp.isoformat()
            }
            
        except Exception as e:
            logger.error(f"❌ Error processing feedback: {e}")
            return {"error": str(e)}
    
    async def _analyze_feedback_type(self, feedback_data: Dict[str, Any]) -> FeedbackType:
        """تحليل نوع التغذية الراجعة"""
        # تحليل النص إذا كان متوفرًا
        if "text" in feedback_data:
            sentiment = await self.sentiment_analyzer.analyze(feedback_data["text"])
            
            if sentiment > 0.6:
                return FeedbackType.POSITIVE
            elif sentiment < 0.4:
                return FeedbackType.NEGATIVE
            else:
                return FeedbackType.NEUTRAL
        
        # تحليل التقييم الرقمي
        if "rating" in feedback_data:
            rating = feedback_data["rating"]
            if rating >= 4:
                return FeedbackType.POSITIVE
            elif rating <= 2:
                return FeedbackType.NEGATIVE
            else:
                return FeedbackType.NEUTRAL
        
        # تحليل الإجراءات
        if "action" in feedback_data:
            action = feedback_data["action"].lower()
            if "correct" in action or "fix" in action:
                return FeedbackType.CORRECTION
            elif "improve" in action or "enhance" in action:
                return FeedbackType.ENHANCEMENT
            elif "good" in action or "great" in action:
                return FeedbackType.POSITIVE
            elif "bad" in action or "wrong" in action:
                return FeedbackType.NEGATIVE
        
        return FeedbackType.NEUTRAL
    
    async def _identify_feedback_source(self, feedback_data: Dict[str, Any]) -> FeedbackSource:
        """تحديد مصدر التغذية الراجعة"""
        if "user_rating" in feedback_data:
            return FeedbackSource.USER_RATING
        elif "user_comment" in feedback_data or "text" in feedback_data:
            return FeedbackSource.USER_COMMENT
        elif "system_metrics" in feedback_data:
            return FeedbackSource.SYSTEM_METRICS
        elif "performance_data" in feedback_data:
            return FeedbackSource.PERFORMANCE_DATA
        elif "implicit_behavior" in feedback_data:
            return FeedbackSource.IMPLICIT_BEHAVIOR
        else:
            return FeedbackSource.USER_COMMENT  # افتراضي
    
    async def _calculate_feedback_score(self, feedback_data: Dict[str, Any], feedback_type: FeedbackType) -> float:
        """حساب نقاط التغذية الراجعة"""
        base_score = 0.0
        
        # نقاط أساسية حسب النوع
        if feedback_type == FeedbackType.POSITIVE:
            base_score = 0.8
        elif feedback_type == FeedbackType.NEGATIVE:
            base_score = -0.8
        elif feedback_type == FeedbackType.CORRECTION:
            base_score = -0.6
        elif feedback_type == FeedbackType.ENHANCEMENT:
            base_score = 0.6
        else:  # NEUTRAL
            base_score = 0.0
        
        # تعديل حسب التقييم الرقمي
        if "rating" in feedback_data:
            rating = feedback_data["rating"]
            # تحويل من 1-5 إلى -1 إلى 1
            normalized_rating = (rating - 3) / 2
            base_score = normalized_rating
        
        # تعديل حسب الثقة
        confidence = feedback_data.get("confidence", 1.0)
        base_score *= confidence
        
        # تحديد النقاط في النطاق المطلوب
        return max(-1.0, min(1.0, base_score))
    
    async def _calculate_feedback_weight(self, feedback_data: Dict[str, Any], source: FeedbackSource) -> float:
        """حساب وزن التغذية الراجعة"""
        base_weight = self.feedback_weights[source]
        
        # تعديل الوزن حسب عوامل إضافية
        weight_multiplier = 1.0
        
        # عامل الوقت (التغذية الراجعة الحديثة لها وزن أكبر)
        if "timestamp" in feedback_data:
            feedback_time = datetime.fromisoformat(feedback_data["timestamp"])
            time_diff = datetime.now() - feedback_time
            if time_diff < timedelta(hours=1):
                weight_multiplier *= 1.2
            elif time_diff > timedelta(days=7):
                weight_multiplier *= 0.8
        
        # عامل التفصيل (التغذية الراجعة المفصلة لها وزن أكبر)
        if "text" in feedback_data and len(feedback_data["text"]) > 50:
            weight_multiplier *= 1.1
        
        # عامل السياق (التغذية الراجعة مع سياق لها وزن أكبر)
        if "context" in feedback_data and feedback_data["context"]:
            weight_multiplier *= 1.05
        
        return base_weight * weight_multiplier
    
    async def _update_pattern_performance(self, pattern_id: str, feedback_entry: FeedbackEntry):
        """تحديث أداء النمط"""
        if pattern_id not in self.pattern_performance:
            self.pattern_performance[pattern_id] = PatternPerformance(
                pattern_id=pattern_id,
                total_feedback=0,
                positive_feedback=0,
                negative_feedback=0,
                weighted_score=0.0,
                confidence_adjustment=0.0,
                last_updated=datetime.now()
            )
        
        performance = self.pattern_performance[pattern_id]
        
        # تحديث العدادات
        performance.total_feedback += 1
        
        if feedback_entry.score > 0:
            performance.positive_feedback += 1
        elif feedback_entry.score < 0:
            performance.negative_feedback += 1
        
        # تحديث النقاط الموزونة
        total_weighted_score = performance.weighted_score * (performance.total_feedback - 1)
        total_weighted_score += feedback_entry.score * feedback_entry.weight
        performance.weighted_score = total_weighted_score / performance.total_feedback
        
        # حساب تعديل الثقة
        if performance.total_feedback >= self.config["min_feedback_count"]:
            success_rate = performance.positive_feedback / performance.total_feedback
            
            if success_rate >= 0.8:
                performance.confidence_adjustment = 0.1
            elif success_rate >= 0.6:
                performance.confidence_adjustment = 0.05
            elif success_rate <= 0.4:
                performance.confidence_adjustment = -0.1
            else:
                performance.confidence_adjustment = 0.0
        
        performance.last_updated = datetime.now()
        
        logger.info(f"📊 Updated performance for pattern {pattern_id}: "
                   f"score={performance.weighted_score:.3f}, "
                   f"confidence_adj={performance.confidence_adjustment:.3f}")
    
    async def _apply_adaptive_learning(self, pattern_id: str):
        """تطبيق التعلم التكيفي"""
        if pattern_id not in self.pattern_performance:
            return
        
        performance = self.pattern_performance[pattern_id]
        
        # تطبيق عامل التدهور الزمني
        time_since_update = datetime.now() - performance.last_updated
        if time_since_update > timedelta(hours=self.config["feedback_window_hours"]):
            performance.confidence_adjustment *= self.config["weight_decay_factor"]
        
        # تحديث أوزان المصادر بناءً على الأداء
        if self.config["adaptive_weighting"]:
            await self._update_source_weights(pattern_id)
    
    async def _update_source_weights(self, pattern_id: str):
        """تحديث أوزان المصادر بناءً على الأداء"""
        if pattern_id not in self.feedback_history:
            return
        
        recent_feedback = [
            f for f in self.feedback_history[pattern_id]
            if datetime.now() - f.timestamp < timedelta(hours=24)
        ]
        
        if len(recent_feedback) < 5:
            return
        
        # حساب دقة كل مصدر
        source_accuracy = defaultdict(list)
        
        for feedback in recent_feedback:
            # محاكاة دقة المصدر بناءً على الاتساق
            accuracy = abs(feedback.score) * feedback.weight
            source_accuracy[feedback.source].append(accuracy)
        
        # تحديث الأوزان
        for source, accuracies in source_accuracy.items():
            if len(accuracies) >= 2:
                avg_accuracy = np.mean(accuracies)
                # تعديل الوزن بناءً على الدقة
                adjustment = (avg_accuracy - 0.5) * 0.1
                self.feedback_weights[source] = max(0.1, min(2.0, 
                    self.feedback_weights[source] + adjustment))
    
    async def get_pattern_recommendations(self, pattern_id: str) -> Dict[str, Any]:
        """الحصول على توصيات للنمط"""
        if pattern_id not in self.pattern_performance:
            return {"error": "Pattern not found"}
        
        performance = self.pattern_performance[pattern_id]
        
        recommendations = {
            "pattern_id": pattern_id,
            "current_performance": {
                "weighted_score": performance.weighted_score,
                "confidence_adjustment": performance.confidence_adjustment,
                "total_feedback": performance.total_feedback,
                "success_rate": performance.positive_feedback / max(1, performance.total_feedback)
            },
            "recommendations": []
        }
        
        # توصيات بناءً على الأداء
        if performance.weighted_score < -0.3:
            recommendations["recommendations"].append({
                "type": "improvement_needed",
                "priority": "high",
                "message": "Pattern needs significant improvement",
                "suggested_actions": ["review_pattern_logic", "gather_more_feedback", "adjust_confidence"]
            })
        elif performance.weighted_score > 0.7:
            recommendations["recommendations"].append({
                "type": "excellent_performance",
                "priority": "low",
                "message": "Pattern performing excellently",
                "suggested_actions": ["maintain_current_approach", "consider_pattern_replication"]
            })
        
        if performance.total_feedback < self.config["min_feedback_count"]:
            recommendations["recommendations"].append({
                "type": "insufficient_data",
                "priority": "medium",
                "message": "Need more feedback for reliable assessment",
                "suggested_actions": ["encourage_user_feedback", "monitor_implicit_signals"]
            })
        
        return recommendations
    
    async def get_system_analytics(self) -> Dict[str, Any]:
        """الحصول على تحليلات النظام"""
        total_patterns = len(self.pattern_performance)
        total_feedback = sum(p.total_feedback for p in self.pattern_performance.values())
        
        # حساب متوسط الأداء
        avg_performance = np.mean([p.weighted_score for p in self.pattern_performance.values()]) if total_patterns > 0 else 0
        
        # توزيع التغذية الراجعة حسب المصدر
        source_distribution = defaultdict(int)
        for feedback_list in self.feedback_history.values():
            for feedback in feedback_list:
                source_distribution[feedback.source] += 1
        
        return {
            "total_patterns": total_patterns,
            "total_feedback": total_feedback,
            "average_performance": avg_performance,
            "source_distribution": dict(source_distribution),
            "feedback_weights": {k.value: v for k, v in self.feedback_weights.items()},
            "high_performing_patterns": len([p for p in self.pattern_performance.values() if p.weighted_score > 0.7]),
            "low_performing_patterns": len([p for p in self.pattern_performance.values() if p.weighted_score < -0.3]),
            "timestamp": datetime.now().isoformat()
        }

class SentimentAnalyzer:
    """محلل المشاعر"""
    
    async def analyze(self, text: str) -> float:
        """تحليل مشاعر النص"""
        # محاكاة تحليل المشاعر
        positive_words = ["good", "great", "excellent", "amazing", "wonderful", "perfect", "love", "like"]
        negative_words = ["bad", "terrible", "awful", "horrible", "worst", "hate", "dislike", "wrong"]
        
        text_lower = text.lower()
        positive_count = sum(1 for word in positive_words if word in text_lower)
        negative_count = sum(1 for word in negative_words if word in text_lower)
        
        if positive_count > negative_count:
            return 0.8
        elif negative_count > positive_count:
            return 0.2
        else:
            return 0.5

class WeightCalculator:
    """حاسبة الأوزان"""
    
    def __init__(self):
        self.base_weights = {
            FeedbackSource.USER_RATING: 1.0,
            FeedbackSource.USER_COMMENT: 0.8,
            FeedbackSource.SYSTEM_METRICS: 0.6,
            FeedbackSource.PERFORMANCE_DATA: 0.7,
            FeedbackSource.IMPLICIT_BEHAVIOR: 0.4
        }

class PerformanceTracker:
    """متتبع الأداء"""
    
    def __init__(self):
        self.performance_history = deque(maxlen=1000)
    
    async def track_performance(self, pattern_id: str, performance_data: Dict[str, Any]):
        """تتبع أداء النمط"""
        self.performance_history.append({
            "pattern_id": pattern_id,
            "timestamp": datetime.now(),
            "data": performance_data
        })

# مثال على الاستخدام
async def demo_feedback_weighting():
    """عرض توضيحي لنظام تقييم التغذية الراجعة"""
    print("🎯 Advanced Feedback Weighting Demo")
    print("=" * 50)
    
    weighting_system = AdvancedFeedbackWeighting()
    
    # بيانات تغذية راجعة تجريبية
    test_feedback = [
        {
            "pattern_id": "pattern_001",
            "rating": 5,
            "text": "Great response, very helpful!",
            "context": {"user_level": "beginner"}
        },
        {
            "pattern_id": "pattern_001",
            "rating": 2,
            "text": "Not what I was looking for",
            "context": {"user_level": "advanced"}
        },
        {
            "pattern_id": "pattern_002",
            "rating": 4,
            "text": "Good but could be better",
            "context": {"user_level": "intermediate"}
        },
        {
            "pattern_id": "pattern_001",
            "rating": 5,
            "text": "Perfect! Exactly what I needed",
            "context": {"user_level": "beginner"}
        }
    ]
    
    for i, feedback_data in enumerate(test_feedback, 1):
        print(f"\n📝 Processing Feedback {i}:")
        print(f"   Pattern: {feedback_data['pattern_id']}")
        print(f"   Rating: {feedback_data['rating']}")
        print(f"   Text: {feedback_data['text']}")
        
        result = await weighting_system.process_feedback(
            feedback_data["pattern_id"], 
            feedback_data
        )
        
        if "error" not in result:
            print(f"   Feedback Type: {result['feedback_type']}")
            print(f"   Source: {result['source']}")
            print(f"   Score: {result['score']:.3f}")
            print(f"   Weight: {result['weight']:.3f}")
        
        await asyncio.sleep(0.1)
    
    # عرض التحليلات النهائية
    print(f"\n📊 System Analytics:")
    analytics = await weighting_system.get_system_analytics()
    
    for key, value in analytics.items():
        if isinstance(value, float):
            print(f"   {key}: {value:.3f}")
        else:
            print(f"   {key}: {value}")
    
    # عرض توصيات الأنماط
    print(f"\n🎯 Pattern Recommendations:")
    for pattern_id in ["pattern_001", "pattern_002"]:
        recommendations = await weighting_system.get_pattern_recommendations(pattern_id)
        if "error" not in recommendations:
            print(f"\n   Pattern {pattern_id}:")
            print(f"     Performance Score: {recommendations['current_performance']['weighted_score']:.3f}")
            print(f"     Success Rate: {recommendations['current_performance']['success_rate']:.3f}")
            print(f"     Total Feedback: {recommendations['current_performance']['total_feedback']}")

if __name__ == "__main__":
    asyncio.run(demo_feedback_weighting())
