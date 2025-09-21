#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
AuraOS Learning Hub - رأس الحلقة الذكي
PoC للتعلم التكيفي مع الذكاء الاصطناعي
"""

import asyncio
import json
import time
from datetime import datetime
from typing import Dict, List, Any, Optional
from dataclasses import dataclass
from enum import Enum

class TaskStatus(Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    FAILED = "failed"

class LearningPhase(Enum):
    ANALYSIS = "analysis"
    EXECUTION = "execution"
    FEEDBACK = "feedback"
    ADAPTATION = "adaptation"

@dataclass
class LearningTask:
    id: str
    description: str
    complexity: float  # 0.0 to 1.0
    context: Dict[str, Any]
    status: TaskStatus
    assigned_agent: Optional[str] = None
    result: Optional[Dict[str, Any]] = None
    feedback_score: Optional[float] = None
    created_at: datetime = None
    
    def __post_init__(self):
        if self.created_at is None:
            self.created_at = datetime.now()

@dataclass
class AgentCapability:
    agent_id: str
    capabilities: List[str]
    performance_score: float
    specialization: str
    last_used: datetime

class AuraOSHub:
    """
    رأس الحلقة - المركز الرئيسي للتعلم والتنسيق
    """
    
    def __init__(self):
        self.name = "AuraOS Learning Hub"
        self.version = "0.1.0-PoC"
        self.is_active = False
        
        # إدارة المهام
        self.tasks: Dict[str, LearningTask] = {}
        self.task_queue: List[str] = []
        
        # إدارة الوكلاء
        self.registered_agents: Dict[str, AgentCapability] = {}
        
        # إدارة التعلم
        self.learning_history: List[Dict[str, Any]] = []
        self.knowledge_base: Dict[str, Any] = {}
        
        # إحصائيات الأداء
        self.stats = {
            "tasks_completed": 0,
            "tasks_failed": 0,
            "total_learning_cycles": 0,
            "average_performance": 0.0
        }
        
        print(f"🧠 {self.name} v{self.version} تم إنشاؤه")

    async def initialize(self):
        """تهيئة النظام"""
        print("🚀 تهيئة AuraOS Hub...")
        
        # تحميل قاعدة المعرفة الأساسية
        await self.load_knowledge_base()
        
        # تهيئة الوكلاء الافتراضيين
        await self.initialize_default_agents()
        
        self.is_active = True
        print("✅ AuraOS Hub جاهز للعمل!")

    async def load_knowledge_base(self):
        """تحميل قاعدة المعرفة"""
        self.knowledge_base = {
            "programming": {
                "difficulty_levels": ["beginner", "intermediate", "advanced"],
                "common_patterns": ["loops", "conditionals", "functions"],
                "best_practices": ["clean_code", "testing", "documentation"]
            },
            "ai": {
                "concepts": ["machine_learning", "deep_learning", "nlp"],
                "tools": ["tensorflow", "pytorch", "scikit-learn"],
                "applications": ["classification", "regression", "clustering"]
            }
        }
        print("📚 تم تحميل قاعدة المعرفة")

    async def initialize_default_agents(self):
        """تهيئة الوكلاء الافتراضيين"""
        default_agents = [
            AgentCapability(
                agent_id="code_analyzer",
                capabilities=["code_review", "bug_detection", "optimization"],
                performance_score=0.85,
                specialization="programming",
                last_used=datetime.now()
            ),
            AgentCapability(
                agent_id="ai_tutor",
                capabilities=["explanation", "example_generation", "concept_clarification"],
                performance_score=0.78,
                specialization="ai_education",
                last_used=datetime.now()
            ),
            AgentCapability(
                agent_id="problem_solver",
                capabilities=["algorithm_design", "problem_breakdown", "solution_optimization"],
                performance_score=0.82,
                specialization="problem_solving",
                last_used=datetime.now()
            )
        ]
        
        for agent in default_agents:
            self.registered_agents[agent.agent_id] = agent
        
        print(f"🤖 تم تسجيل {len(default_agents)} وكيل افتراضي")

    async def create_learning_task(self, description: str, context: Dict[str, Any]) -> str:
        """إنشاء مهمة تعلم جديدة"""
        task_id = f"task_{int(time.time())}_{len(self.tasks)}"
        
        # تحليل تعقيد المهمة
        complexity = await self.analyze_task_complexity(description, context)
        
        task = LearningTask(
            id=task_id,
            description=description,
            complexity=complexity,
            context=context,
            status=TaskStatus.PENDING
        )
        
        self.tasks[task_id] = task
        self.task_queue.append(task_id)
        
        print(f"📋 تم إنشاء مهمة جديدة: {task_id}")
        print(f"   الوصف: {description}")
        print(f"   التعقيد: {complexity:.2f}")
        
        return task_id

    async def analyze_task_complexity(self, description: str, context: Dict[str, Any]) -> float:
        """تحليل تعقيد المهمة"""
        # تحليل بسيط للتعقيد
        complexity_indicators = {
            "beginner": 0.2,
            "intermediate": 0.5,
            "advanced": 0.8,
            "expert": 1.0
        }
        
        # البحث عن مؤشرات التعقيد في الوصف والسياق
        base_complexity = 0.5  # افتراضي
        
        if "context" in context:
            level = context["context"].get("level", "intermediate")
            base_complexity = complexity_indicators.get(level, 0.5)
        
        # إضافة تعقيد بناءً على الكلمات المفتاحية
        if any(word in description.lower() for word in ["complex", "advanced", "sophisticated"]):
            base_complexity += 0.2
        
        if any(word in description.lower() for word in ["simple", "basic", "easy"]):
            base_complexity -= 0.2
        
        return max(0.1, min(1.0, base_complexity))

    async def assign_task_to_agent(self, task_id: str) -> Optional[str]:
        """تعيين المهمة للوكيل المناسب"""
        if task_id not in self.tasks:
            return None
        
        task = self.tasks[task_id]
        
        # البحث عن الوكيل الأنسب
        best_agent = None
        best_score = 0.0
        
        for agent_id, capability in self.registered_agents.items():
            # حساب درجة التطابق
            match_score = await self.calculate_agent_match(task, capability)
            
            if match_score > best_score:
                best_score = match_score
                best_agent = agent_id
        
        if best_agent:
            task.assigned_agent = best_agent
            task.status = TaskStatus.IN_PROGRESS
            
            # تحديث إحصائيات الوكيل
            self.registered_agents[best_agent].last_used = datetime.now()
            
            print(f"🎯 تم تعيين المهمة {task_id} للوكيل {best_agent}")
            print(f"   درجة التطابق: {best_score:.2f}")
        
        return best_agent

    async def calculate_agent_match(self, task: LearningTask, capability: AgentCapability) -> float:
        """حساب درجة تطابق الوكيل مع المهمة"""
        base_score = capability.performance_score
        
        # تطابق التخصص
        if capability.specialization in task.description.lower():
            base_score += 0.2
        
        # تطابق القدرات
        task_keywords = task.description.lower().split()
        capability_matches = sum(1 for cap in capability.capabilities 
                               if any(keyword in cap.lower() for keyword in task_keywords))
        
        if capability_matches > 0:
            base_score += (capability_matches / len(capability.capabilities)) * 0.3
        
        return min(1.0, base_score)

    async def process_task_result(self, task_id: str, result: Dict[str, Any], feedback_score: float):
        """معالجة نتيجة المهمة"""
        if task_id not in self.tasks:
            return
        
        task = self.tasks[task_id]
        task.result = result
        task.feedback_score = feedback_score
        task.status = TaskStatus.COMPLETED
        
        # تحديث الإحصائيات
        self.stats["tasks_completed"] += 1
        self.stats["average_performance"] = (
            (self.stats["average_performance"] * (self.stats["tasks_completed"] - 1) + feedback_score) 
            / self.stats["tasks_completed"]
        )
        
        # تسجيل في تاريخ التعلم
        learning_record = {
            "task_id": task_id,
            "agent": task.assigned_agent,
            "complexity": task.complexity,
            "feedback_score": feedback_score,
            "timestamp": datetime.now().isoformat(),
            "result_summary": result.get("summary", "")
        }
        
        self.learning_history.append(learning_record)
        
        # تحديث معرفة الوكيل
        if task.assigned_agent in self.registered_agents:
            agent = self.registered_agents[task.assigned_agent]
            # تحديث درجة الأداء بناءً على النتيجة
            agent.performance_score = (agent.performance_score + feedback_score) / 2
        
        print(f"✅ تم إكمال المهمة {task_id}")
        print(f"   النتيجة: {result.get('summary', 'N/A')}")
        print(f"   درجة التقييم: {feedback_score:.2f}")

    async def learn_from_feedback(self):
        """التعلم من التغذية الراجعة"""
        if not self.learning_history:
            return
        
        print("🧠 بدء دورة التعلم من التغذية الراجعة...")
        
        # تحليل الأنماط في تاريخ التعلم
        patterns = await self.analyze_learning_patterns()
        
        # تحديث قاعدة المعرفة
        await self.update_knowledge_base(patterns)
        
        # تحسين استراتيجيات تعيين المهام
        await self.optimize_task_assignment()
        
        self.stats["total_learning_cycles"] += 1
        print(f"📈 اكتملت دورة التعلم #{self.stats['total_learning_cycles']}")

    async def analyze_learning_patterns(self) -> Dict[str, Any]:
        """تحليل أنماط التعلم"""
        if len(self.learning_history) < 2:
            return {}
        
        patterns = {
            "best_performing_agents": {},
            "complexity_performance": {},
            "task_type_success": {}
        }
        
        # تحليل أداء الوكلاء
        agent_scores = {}
        for record in self.learning_history:
            agent = record["agent"]
            score = record["feedback_score"]
            
            if agent not in agent_scores:
                agent_scores[agent] = []
            agent_scores[agent].append(score)
        
        for agent, scores in agent_scores.items():
            patterns["best_performing_agents"][agent] = sum(scores) / len(scores)
        
        return patterns

    async def update_knowledge_base(self, patterns: Dict[str, Any]):
        """تحديث قاعدة المعرفة"""
        if "best_performing_agents" in patterns:
            self.knowledge_base["agent_performance"] = patterns["best_performing_agents"]
            print("📚 تم تحديث معرفة أداء الوكلاء")

    async def optimize_task_assignment(self):
        """تحسين استراتيجيات تعيين المهام"""
        # تحسين بسيط بناءً على الأداء التاريخي
        for agent_id, agent in self.registered_agents.items():
            if agent_id in self.knowledge_base.get("agent_performance", {}):
                historical_performance = self.knowledge_base["agent_performance"][agent_id]
                # تحديث درجة الأداء مع وزن للتاريخ
                agent.performance_score = (agent.performance_score * 0.7) + (historical_performance * 0.3)

    async def get_system_status(self) -> Dict[str, Any]:
        """الحصول على حالة النظام"""
        return {
            "hub_name": self.name,
            "version": self.version,
            "is_active": self.is_active,
            "total_tasks": len(self.tasks),
            "pending_tasks": len([t for t in self.tasks.values() if t.status == TaskStatus.PENDING]),
            "active_tasks": len([t for t in self.tasks.values() if t.status == TaskStatus.IN_PROGRESS]),
            "completed_tasks": len([t for t in self.tasks.values() if t.status == TaskStatus.COMPLETED]),
            "registered_agents": len(self.registered_agents),
            "learning_cycles": self.stats["total_learning_cycles"],
            "average_performance": self.stats["average_performance"]
        }

    async def shutdown(self):
        """إغلاق النظام"""
        print("🔄 إغلاق AuraOS Hub...")
        
        # حفظ حالة النظام
        await self.save_system_state()
        
        self.is_active = False
        print("✅ تم إغلاق AuraOS Hub")

    async def save_system_state(self):
        """حفظ حالة النظام"""
        state = {
            "knowledge_base": self.knowledge_base,
            "learning_history": self.learning_history[-10:],  # آخر 10 سجلات فقط
            "stats": self.stats,
            "timestamp": datetime.now().isoformat()
        }
        
        # في التطبيق الحقيقي، سيتم حفظ هذا في قاعدة بيانات
        print("💾 تم حفظ حالة النظام")

# مثال على الاستخدام
async def demo_auraos_hub():
    """عرض توضيحي لـ AuraOS Hub"""
    print("🎬 بدء العرض التوضيحي لـ AuraOS Hub")
    print("=" * 50)
    
    # إنشاء النظام
    hub = AuraOSHub()
    await hub.initialize()
    
    # إنشاء مهمة تجريبية
    task_context = {
        "context": {
            "level": "intermediate",
            "domain": "programming",
            "language": "python"
        }
    }
    
    task_id = await hub.create_learning_task(
        "كتابة دالة لحساب الأعداد الأولية بكفاءة",
        task_context
    )
    
    # تعيين المهمة للوكيل
    assigned_agent = await hub.assign_task_to_agent(task_id)
    
    if assigned_agent:
        # محاكاة نتيجة المهمة
        await asyncio.sleep(1)  # محاكاة وقت المعالجة
        
        result = {
            "summary": "تم إنشاء دالة محسنة باستخدام Sieve of Eratosthenes",
            "code": "def prime_numbers(n): ...",
            "efficiency": "O(n log log n)",
            "test_results": "passed"
        }
        
        await hub.process_task_result(task_id, result, 0.85)
    
    # دورة التعلم
    await hub.learn_from_feedback()
    
    # عرض حالة النظام
    status = await hub.get_system_status()
    print("\n📊 حالة النظام:")
    for key, value in status.items():
        print(f"   {key}: {value}")
    
    await hub.shutdown()
    print("\n🎉 انتهى العرض التوضيحي!")

if __name__ == "__main__":
    asyncio.run(demo_auraos_hub())
