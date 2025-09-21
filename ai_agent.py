#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
AI Learning Agent - عضو التعلم الذكي
وكيل ذكاء اصطناعي يتعلم ويتكيف مع المهام
"""

import asyncio
import json
import random
import time
from datetime import datetime
from typing import Dict, List, Any, Optional
from dataclasses import dataclass
from enum import Enum

class AgentState(Enum):
    IDLE = "idle"
    LEARNING = "learning"
    PROCESSING = "processing"
    ADAPTING = "adapting"

class TaskType(Enum):
    CODE_GENERATION = "code_generation"
    PROBLEM_SOLVING = "problem_solving"
    EXPLANATION = "explanation"
    ANALYSIS = "analysis"
    OPTIMIZATION = "optimization"

@dataclass
class LearningMemory:
    task_type: str
    success_rate: float
    patterns: List[str]
    improvements: List[str]
    last_updated: datetime

@dataclass
class AgentResponse:
    task_id: str
    agent_id: str
    result: Dict[str, Any]
    confidence: float
    processing_time: float
    learning_insights: List[str]

class AILearningAgent:
    """
    وكيل الذكاء الاصطناعي للتعلم والتكيف
    """
    
    def __init__(self, agent_id: str, specialization: str):
        self.agent_id = agent_id
        self.specialization = specialization
        self.state = AgentState.IDLE
        
        # ذاكرة التعلم
        self.learning_memory: Dict[str, LearningMemory] = {}
        
        # إحصائيات الأداء
        self.performance_stats = {
            "total_tasks": 0,
            "successful_tasks": 0,
            "average_confidence": 0.0,
            "learning_cycles": 0,
            "adaptation_count": 0
        }
        
        # قاعدة المعرفة المتخصصة
        self.knowledge_base = self._initialize_knowledge_base()
        
        # أنماط التعلم المكتشفة
        self.learned_patterns = []
        
        print(f"🤖 تم إنشاء AI Agent: {agent_id} (تخصص: {specialization})")

    def _initialize_knowledge_base(self) -> Dict[str, Any]:
        """تهيئة قاعدة المعرفة المتخصصة"""
        base_knowledge = {
            "programming": {
                "languages": ["python", "javascript", "java", "cpp"],
                "patterns": ["design_patterns", "algorithms", "data_structures"],
                "best_practices": ["clean_code", "testing", "documentation", "optimization"]
            },
            "ai_education": {
                "concepts": ["machine_learning", "deep_learning", "nlp", "computer_vision"],
                "tools": ["tensorflow", "pytorch", "scikit-learn", "pandas"],
                "methods": ["supervised", "unsupervised", "reinforcement"]
            },
            "problem_solving": {
                "strategies": ["divide_conquer", "dynamic_programming", "greedy", "backtracking"],
                "complexity": ["time_complexity", "space_complexity", "optimization"],
                "approaches": ["brute_force", "heuristic", "approximation"]
            }
        }
        
        return base_knowledge.get(self.specialization, {})

    async def process_task(self, task_id: str, task_description: str, context: Dict[str, Any]) -> AgentResponse:
        """معالجة مهمة جديدة"""
        print(f"🎯 {self.agent_id} يبدأ معالجة المهمة: {task_id}")
        
        self.state = AgentState.PROCESSING
        start_time = time.time()
        
        try:
            # تحليل نوع المهمة
            task_type = await self._analyze_task_type(task_description, context)
            
            # تطبيق المعرفة المتخصصة
            result = await self._apply_specialized_knowledge(task_type, task_description, context)
            
            # حساب الثقة في النتيجة
            confidence = await self._calculate_confidence(result, task_type, context)
            
            # استخراج رؤى التعلم
            learning_insights = await self._extract_learning_insights(task_description, result, context)
            
            # تحديث الذاكرة
            await self._update_learning_memory(task_type, confidence, learning_insights)
            
            processing_time = time.time() - start_time
            
            response = AgentResponse(
                task_id=task_id,
                agent_id=self.agent_id,
                result=result,
                confidence=confidence,
                processing_time=processing_time,
                learning_insights=learning_insights
            )
            
            # تحديث الإحصائيات
            self.performance_stats["total_tasks"] += 1
            if confidence > 0.7:
                self.performance_stats["successful_tasks"] += 1
            
            self.performance_stats["average_confidence"] = (
                (self.performance_stats["average_confidence"] * (self.performance_stats["total_tasks"] - 1) + confidence)
                / self.performance_stats["total_tasks"]
            )
            
            print(f"✅ {self.agent_id} أكمل المهمة {task_id} بثقة {confidence:.2f}")
            
            self.state = AgentState.IDLE
            return response
            
        except Exception as e:
            print(f"❌ خطأ في معالجة المهمة {task_id}: {e}")
            self.state = AgentState.IDLE
            
            # إرجاع استجابة خطأ
            return AgentResponse(
                task_id=task_id,
                agent_id=self.agent_id,
                result={"error": str(e), "status": "failed"},
                confidence=0.0,
                processing_time=time.time() - start_time,
                learning_insights=["error_occurred"]
            )

    async def _analyze_task_type(self, description: str, context: Dict[str, Any]) -> TaskType:
        """تحليل نوع المهمة"""
        description_lower = description.lower()
        
        # مؤشرات أنواع المهام
        type_indicators = {
            TaskType.CODE_GENERATION: ["write", "create", "implement", "function", "class", "algorithm"],
            TaskType.PROBLEM_SOLVING: ["solve", "problem", "challenge", "optimize", "efficient"],
            TaskType.EXPLANATION: ["explain", "describe", "how", "why", "concept", "understand"],
            TaskType.ANALYSIS: ["analyze", "review", "evaluate", "assess", "examine"],
            TaskType.OPTIMIZATION: ["optimize", "improve", "enhance", "performance", "speed"]
        }
        
        # حساب النقاط لكل نوع
        type_scores = {}
        for task_type, indicators in type_indicators.items():
            score = sum(1 for indicator in indicators if indicator in description_lower)
            type_scores[task_type] = score
        
        # اختيار النوع الأعلى نقاطاً
        best_type = max(type_scores, key=type_scores.get)
        
        print(f"🔍 تم تحديد نوع المهمة: {best_type.value}")
        return best_type

    async def _apply_specialized_knowledge(self, task_type: TaskType, description: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """تطبيق المعرفة المتخصصة"""
        print(f"🧠 تطبيق المعرفة المتخصصة ({self.specialization}) لنوع المهمة: {task_type.value}")
        
        if task_type == TaskType.CODE_GENERATION:
            return await self._generate_code(description, context)
        elif task_type == TaskType.PROBLEM_SOLVING:
            return await self._solve_problem(description, context)
        elif task_type == TaskType.EXPLANATION:
            return await self._provide_explanation(description, context)
        elif task_type == TaskType.ANALYSIS:
            return await self._analyze_content(description, context)
        elif task_type == TaskType.OPTIMIZATION:
            return await self._optimize_solution(description, context)
        else:
            return {"error": "نوع مهمة غير مدعوم"}

    async def _generate_code(self, description: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """توليد كود"""
        language = context.get("context", {}).get("language", "python")
        
        # محاكاة توليد الكود
        code_examples = {
            "python": {
                "prime_numbers": """
def prime_numbers(n):
    \"\"\"إرجاع قائمة بالأعداد الأولية حتى n\"\"\"
    sieve = [True] * (n + 1)
    sieve[0] = sieve[1] = False
    
    for i in range(2, int(n**0.5) + 1):
        if sieve[i]:
            for j in range(i*i, n + 1, i):
                sieve[j] = False
    
    return [i for i in range(2, n + 1) if sieve[i]]
""",
                "fibonacci": """
def fibonacci(n):
    \"\"\"حساب عدد فيبوناتشي\"\"\"
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)
"""
            },
            "javascript": {
                "prime_numbers": """
function primeNumbers(n) {
    const sieve = new Array(n + 1).fill(true);
    sieve[0] = sieve[1] = false;
    
    for (let i = 2; i <= Math.sqrt(n); i++) {
        if (sieve[i]) {
            for (let j = i * i; j <= n; j += i) {
                sieve[j] = false;
            }
        }
    }
    
    return sieve.map((isPrime, index) => isPrime ? index : null)
                .filter(num => num !== null);
}
"""
            }
        }
        
        # اختيار مثال مناسب
        if "prime" in description.lower() or "أولية" in description:
            code = code_examples.get(language, {}).get("prime_numbers", "// كود غير متوفر")
        elif "fibonacci" in description.lower() or "فيبوناتشي" in description:
            code = code_examples.get(language, {}).get("fibonacci", "// كود غير متوفر")
        else:
            code = f"# كود {language} للمهمة: {description}"
        
        return {
            "type": "code_generation",
            "language": language,
            "code": code.strip(),
            "complexity": "O(n log log n)" if "prime" in description.lower() else "O(n)",
            "explanation": "تم توليد الكود باستخدام أفضل الممارسات",
            "test_cases": ["n=10", "n=100", "n=1000"]
        }

    async def _solve_problem(self, description: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """حل المشاكل"""
        return {
            "type": "problem_solving",
            "approach": "تحليل المشكلة وتطبيق الخوارزمية المناسبة",
            "solution": "حل محسن باستخدام تقنيات متقدمة",
            "complexity_analysis": "تحليل التعقيد الزمني والمكاني",
            "alternative_solutions": ["حل بديل 1", "حل بديل 2"],
            "optimization_suggestions": ["تحسين 1", "تحسين 2"]
        }

    async def _provide_explanation(self, description: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """تقديم شرح"""
        return {
            "type": "explanation",
            "concept": "شرح المفهوم المطلوب",
            "examples": ["مثال 1", "مثال 2", "مثال 3"],
            "analogies": ["تشبيه 1", "تشبيه 2"],
            "common_mistakes": ["خطأ شائع 1", "خطأ شائع 2"],
            "practice_exercises": ["تمرين 1", "تمرين 2"]
        }

    async def _analyze_content(self, description: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """تحليل المحتوى"""
        return {
            "type": "analysis",
            "strengths": ["نقطة قوة 1", "نقطة قوة 2"],
            "weaknesses": ["نقطة ضعف 1", "نقطة ضعف 2"],
            "improvements": ["تحسين 1", "تحسين 2"],
            "recommendations": ["توصية 1", "توصية 2"],
            "score": random.uniform(0.6, 0.9)
        }

    async def _optimize_solution(self, description: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """تحسين الحل"""
        return {
            "type": "optimization",
            "current_performance": "الأداء الحالي",
            "optimized_performance": "الأداء المحسن",
            "improvements": ["تحسين 1", "تحسين 2"],
            "performance_gain": f"{random.randint(10, 50)}%",
            "trade_offs": ["مقايضة 1", "مقايضة 2"]
        }

    async def _calculate_confidence(self, result: Dict[str, Any], task_type: TaskType, context: Dict[str, Any]) -> float:
        """حساب الثقة في النتيجة"""
        base_confidence = 0.7
        
        # تعديل الثقة بناءً على التخصص
        if self.specialization in str(context):
            base_confidence += 0.1
        
        # تعديل الثقة بناءً على نوع المهمة
        if task_type == TaskType.CODE_GENERATION and self.specialization == "programming":
            base_confidence += 0.15
        elif task_type == TaskType.EXPLANATION and self.specialization == "ai_education":
            base_confidence += 0.15
        
        # تعديل الثقة بناءً على التاريخ
        if self.performance_stats["total_tasks"] > 0:
            historical_performance = self.performance_stats["successful_tasks"] / self.performance_stats["total_tasks"]
            base_confidence = (base_confidence + historical_performance) / 2
        
        # إضافة بعض العشوائية الواقعية
        confidence = base_confidence + random.uniform(-0.1, 0.1)
        
        return max(0.1, min(1.0, confidence))

    async def _extract_learning_insights(self, description: str, result: Dict[str, Any], context: Dict[str, Any]) -> List[str]:
        """استخراج رؤى التعلم"""
        insights = []
        
        # تحليل الكلمات المفتاحية
        keywords = description.lower().split()
        if "efficient" in keywords or "optimize" in keywords:
            insights.append("المستخدم مهتم بالكفاءة")
        
        if "beginner" in keywords or "simple" in keywords:
            insights.append("المستخدم مبتدئ")
        
        if "advanced" in keywords or "complex" in keywords:
            insights.append("المستخدم متقدم")
        
        # تحليل السياق
        if context.get("context", {}).get("level") == "intermediate":
            insights.append("المستخدم في المستوى المتوسط")
        
        # تحليل النتيجة
        if result.get("type") == "code_generation":
            insights.append("تم توليد كود بنجاح")
        
        return insights

    async def _update_learning_memory(self, task_type: TaskType, confidence: float, insights: List[str]):
        """تحديث ذاكرة التعلم"""
        task_type_str = task_type.value
        
        if task_type_str not in self.learning_memory:
            self.learning_memory[task_type_str] = LearningMemory(
                task_type=task_type_str,
                success_rate=confidence,
                patterns=insights,
                improvements=[],
                last_updated=datetime.now()
            )
        else:
            memory = self.learning_memory[task_type_str]
            # تحديث معدل النجاح
            memory.success_rate = (memory.success_rate + confidence) / 2
            
            # إضافة الأنماط الجديدة
            for insight in insights:
                if insight not in memory.patterns:
                    memory.patterns.append(insight)
            
            memory.last_updated = datetime.now()

    async def adapt_from_feedback(self, feedback_score: float, feedback_details: Dict[str, Any]):
        """التكيف من التغذية الراجعة"""
        print(f"🔄 {self.agent_id} يتكيف من التغذية الراجعة: {feedback_score:.2f}")
        
        self.state = AgentState.ADAPTING
        
        # تحليل التغذية الراجعة
        if feedback_score < 0.6:
            # أداء ضعيف - يحتاج تحسين
            await self._improve_performance(feedback_details)
        elif feedback_score > 0.8:
            # أداء ممتاز - تعزيز النجاح
            await self._reinforce_success(feedback_details)
        
        self.performance_stats["adaptation_count"] += 1
        self.state = AgentState.IDLE

    async def _improve_performance(self, feedback_details: Dict[str, Any]):
        """تحسين الأداء"""
        improvements = []
        
        if "accuracy" in feedback_details:
            improvements.append("تحسين الدقة")
        
        if "speed" in feedback_details:
            improvements.append("تحسين السرعة")
        
        if "clarity" in feedback_details:
            improvements.append("تحسين الوضوح")
        
        # تحديث ذاكرة التعلم
        for memory in self.learning_memory.values():
            memory.improvements.extend(improvements)
        
        print(f"📈 تم تطبيق التحسينات: {improvements}")

    async def _reinforce_success(self, feedback_details: Dict[str, Any]):
        """تعزيز النجاح"""
        print("🎉 تعزيز الأنماط الناجحة")
        
        # تعزيز الأنماط التي أدت للنجاح
        for memory in self.learning_memory.values():
            if memory.success_rate > 0.8:
                memory.patterns.extend(["pattern_reinforced", "success_confirmed"])

    async def get_agent_status(self) -> Dict[str, Any]:
        """الحصول على حالة الوكيل"""
        return {
            "agent_id": self.agent_id,
            "specialization": self.specialization,
            "state": self.state.value,
            "total_tasks": self.performance_stats["total_tasks"],
            "success_rate": (
                self.performance_stats["successful_tasks"] / max(1, self.performance_stats["total_tasks"])
            ),
            "average_confidence": self.performance_stats["average_confidence"],
            "learning_cycles": self.performance_stats["learning_cycles"],
            "adaptation_count": self.performance_stats["adaptation_count"],
            "memory_size": len(self.learning_memory)
        }

# مثال على الاستخدام
async def demo_ai_agent():
    """عرض توضيحي لـ AI Agent"""
    print("🎬 بدء العرض التوضيحي لـ AI Agent")
    print("=" * 50)
    
    # إنشاء وكيل برمجة
    agent = AILearningAgent("code_analyzer", "programming")
    
    # معالجة مهمة برمجة
    task_context = {
        "context": {
            "level": "intermediate",
            "language": "python"
        }
    }
    
    response = await agent.process_task(
        "task_001",
        "كتابة دالة لحساب الأعداد الأولية بكفاءة",
        task_context
    )
    
    print(f"\n📋 نتيجة المهمة:")
    print(f"   الثقة: {response.confidence:.2f}")
    print(f"   وقت المعالجة: {response.processing_time:.2f}s")
    print(f"   النوع: {response.result.get('type', 'N/A')}")
    print(f"   الرؤى: {response.learning_insights}")
    
    # محاكاة التغذية الراجعة
    await agent.adapt_from_feedback(0.85, {"accuracy": "high", "speed": "good"})
    
    # عرض حالة الوكيل
    status = await agent.get_agent_status()
    print(f"\n📊 حالة الوكيل:")
    for key, value in status.items():
        print(f"   {key}: {value}")
    
    print("\n🎉 انتهى العرض التوضيحي!")

if __name__ == "__main__":
    asyncio.run(demo_ai_agent())
