#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Learning Brain Hub - النظام المتكامل
ربط AuraOS Hub + AI Agent + MCP Channel في حلقة تعلم ذكية
"""

import asyncio
import json
import time
from datetime import datetime
from typing import Dict, List, Any, Optional

# استيراد المكونات
from auraos_hub import AuraOSHub, LearningTask, TaskStatus
from ai_agent import AILearningAgent, AgentResponse
from mcp_channel import MCPChannel, MessageType, MessagePriority

class LearningBrainHub:
    """
    النظام المتكامل للتعلم الذكي
    يربط AuraOS Hub + AI Agent + MCP Channel
    """
    
    def __init__(self):
        self.name = "Learning Brain Hub"
        self.version = "0.1.0-PoC"
        self.is_running = False
        
        # المكونات الأساسية
        self.auraos_hub: Optional[AuraOSHub] = None
        self.ai_agents: Dict[str, AILearningAgent] = {}
        self.mcp_channel: Optional[MCPChannel] = None
        
        # إحصائيات النظام
        self.system_stats = {
            "total_learning_cycles": 0,
            "successful_tasks": 0,
            "failed_tasks": 0,
            "average_performance": 0.0,
            "uptime": 0.0,
            "start_time": None
        }
        
        print(f"🧠 تم إنشاء {self.name} v{self.version}")

    async def initialize(self):
        """تهيئة النظام الكامل"""
        print("🚀 تهيئة Learning Brain Hub...")
        
        try:
            # 1. تهيئة MCP Channel أولاً
            print("   📡 تهيئة MCP Channel...")
            self.mcp_channel = MCPChannel("learning_brain_channel")
            await self.mcp_channel.initialize()
            
            # 2. تهيئة AuraOS Hub
            print("   🧠 تهيئة AuraOS Hub...")
            self.auraos_hub = AuraOSHub()
            await self.auraos_hub.initialize()
            
            # تسجيل Hub في MCP Channel
            await self.mcp_channel.register_component(
                "auraos_hub",
                "learning_hub",
                ["task_management", "learning_coordination", "performance_analysis"],
                {"version": self.auraos_hub.version}
            )
            
            # 3. تهيئة AI Agents
            print("   🤖 تهيئة AI Agents...")
            await self._initialize_ai_agents()
            
            # 4. ربط المكونات
            print("   🔗 ربط المكونات...")
            await self._connect_components()
            
            # 5. بدء مراقبة النظام
            print("   👁️ بدء مراقبة النظام...")
            self.monitoring_task = asyncio.create_task(self._monitor_system())
            
            self.is_running = True
            self.system_stats["start_time"] = datetime.now()
            
            print("✅ Learning Brain Hub جاهز للعمل!")
            
        except Exception as e:
            print(f"❌ خطأ في تهيئة النظام: {e}")
            await self.shutdown()
            raise

    async def _initialize_ai_agents(self):
        """تهيئة وكلاء الذكاء الاصطناعي"""
        agents_config = [
            {
                "id": "code_analyzer",
                "specialization": "programming",
                "capabilities": ["code_generation", "bug_detection", "optimization"]
            },
            {
                "id": "ai_tutor",
                "specialization": "ai_education",
                "capabilities": ["explanation", "concept_clarification", "example_generation"]
            },
            {
                "id": "problem_solver",
                "specialization": "problem_solving",
                "capabilities": ["algorithm_design", "problem_breakdown", "solution_optimization"]
            }
        ]
        
        for config in agents_config:
            # إنشاء الوكيل
            agent = AILearningAgent(config["id"], config["specialization"])
            
            # تسجيل الوكيل في MCP Channel
            await self.mcp_channel.register_component(
                config["id"],
                "ai_agent",
                config["capabilities"],
                {"specialization": config["specialization"]}
            )
            
            # الاشتراك في رسائل تعيين المهام
            await self.mcp_channel.subscribe_to_message_type(config["id"], MessageType.TASK_ASSIGNMENT)
            
            # حفظ الوكيل
            self.ai_agents[config["id"]] = agent
            
            print(f"   ✅ تم تهيئة الوكيل: {config['id']}")

    async def _connect_components(self):
        """ربط المكونات مع بعضها"""
        
        # تعيين معالج رسائل تعيين المهام
        await self.mcp_channel.set_message_handler(
            MessageType.TASK_ASSIGNMENT,
            self._handle_task_assignment
        )
        
        # تعيين معالج رسائل نتائج المهام
        await self.mcp_channel.set_message_handler(
            MessageType.TASK_RESULT,
            self._handle_task_result
        )
        
        # تعيين معالج رسائل التغذية الراجعة
        await self.mcp_channel.set_message_handler(
            MessageType.LEARNING_FEEDBACK,
            self._handle_learning_feedback
        )
        
        print("   🔗 تم ربط جميع المكونات")

    async def _handle_task_assignment(self, message):
        """معالجة رسالة تعيين مهمة"""
        try:
            payload = message.payload
            task_id = payload.get("task_id")
            agent_id = message.receiver
            
            print(f"📋 معالجة تعيين المهمة {task_id} للوكيل {agent_id}")
            
            if agent_id in self.ai_agents:
                agent = self.ai_agents[agent_id]
                
                # معالجة المهمة
                response = await agent.process_task(
                    task_id,
                    payload.get("description", ""),
                    payload.get("context", {})
                )
                
                # إرسال النتيجة عبر MCP
                await self.mcp_channel.send_message(
                    MessageType.TASK_RESULT,
                    agent_id,
                    "auraos_hub",
                    {
                        "task_id": task_id,
                        "agent_id": agent_id,
                        "result": response.result,
                        "confidence": response.confidence,
                        "processing_time": response.processing_time,
                        "learning_insights": response.learning_insights
                    },
                    MessagePriority.NORMAL,
                    correlation_id=message.correlation_id
                )
                
                print(f"✅ تم إكمال المهمة {task_id} بواسطة {agent_id}")
            
        except Exception as e:
            print(f"❌ خطأ في معالجة تعيين المهمة: {e}")
            
            # إرسال رسالة خطأ
            await self.mcp_channel.send_message(
                MessageType.ERROR,
                "learning_brain_hub",
                "auraos_hub",
                {
                    "error": str(e),
                    "task_id": message.payload.get("task_id", "unknown"),
                    "agent_id": message.receiver
                },
                MessagePriority.HIGH
            )

    async def _handle_task_result(self, message):
        """معالجة رسالة نتيجة المهمة"""
        try:
            payload = message.payload
            task_id = payload.get("task_id")
            agent_id = payload.get("agent_id")
            result = payload.get("result", {})
            confidence = payload.get("confidence", 0.0)
            
            print(f"📊 معالجة نتيجة المهمة {task_id} من {agent_id}")
            
            # تحديث Hub بنتيجة المهمة
            if self.auraos_hub and task_id in self.auraos_hub.tasks:
                await self.auraos_hub.process_task_result(task_id, result, confidence)
                
                # تحديث الإحصائيات
                if confidence > 0.7:
                    self.system_stats["successful_tasks"] += 1
                else:
                    self.system_stats["failed_tasks"] += 1
                
                # حساب متوسط الأداء
                total_tasks = self.system_stats["successful_tasks"] + self.system_stats["failed_tasks"]
                if total_tasks > 0:
                    self.system_stats["average_performance"] = (
                        self.system_stats["successful_tasks"] / total_tasks
                    )
            
            # إرسال تغذية راجعة للوكيل
            await self.mcp_channel.send_message(
                MessageType.LEARNING_FEEDBACK,
                "auraos_hub",
                agent_id,
                {
                    "task_id": task_id,
                    "feedback_score": confidence,
                    "feedback_details": {
                        "accuracy": "high" if confidence > 0.8 else "medium" if confidence > 0.6 else "low",
                        "speed": "good",
                        "clarity": "clear"
                    }
                },
                MessagePriority.NORMAL
            )
            
        except Exception as e:
            print(f"❌ خطأ في معالجة نتيجة المهمة: {e}")

    async def _handle_learning_feedback(self, message):
        """معالجة رسالة التغذية الراجعة"""
        try:
            payload = message.payload
            agent_id = message.receiver
            feedback_score = payload.get("feedback_score", 0.0)
            feedback_details = payload.get("feedback_details", {})
            
            print(f"🔄 معالجة التغذية الراجعة للوكيل {agent_id}")
            
            if agent_id in self.ai_agents:
                agent = self.ai_agents[agent_id]
                await agent.adapt_from_feedback(feedback_score, feedback_details)
            
        except Exception as e:
            print(f"❌ خطأ في معالجة التغذية الراجعة: {e}")

    async def start_learning_session(self, user_id: str, learning_goals: List[str], 
                                   context: Dict[str, Any] = None) -> str:
        """بدء جلسة تعلم جديدة"""
        if not self.is_running:
            raise Exception("النظام غير نشط")
        
        print(f"🎯 بدء جلسة تعلم جديدة للمستخدم {user_id}")
        
        # إنشاء مهمة في Hub
        task_id = await self.auraos_hub.create_learning_task(
            f"جلسة تعلم للمستخدم {user_id}",
            context or {}
        )
        
        # تعيين المهمة للوكيل المناسب
        assigned_agent = await self.auraos_hub.assign_task_to_agent(task_id)
        
        if assigned_agent:
            # إرسال المهمة عبر MCP
            await self.mcp_channel.send_message(
                MessageType.TASK_ASSIGNMENT,
                "auraos_hub",
                assigned_agent,
                {
                    "task_id": task_id,
                    "description": f"جلسة تعلم للمستخدم {user_id}",
                    "context": {
                        "user_id": user_id,
                        "learning_goals": learning_goals,
                        **(context or {})
                    }
                },
                MessagePriority.HIGH
            )
            
            print(f"✅ تم بدء جلسة التعلم {task_id} مع الوكيل {assigned_agent}")
            return task_id
        
        return None

    async def _monitor_system(self):
        """مراقبة النظام"""
        print("👁️ بدء مراقبة النظام...")
        
        while self.is_running:
            try:
                # تحديث وقت التشغيل
                if self.system_stats["start_time"]:
                    self.system_stats["uptime"] = (
                        datetime.now() - self.system_stats["start_time"]
                    ).total_seconds()
                
                # دورة التعلم التلقائية كل 5 دقائق
                if self.system_stats["uptime"] > 0 and self.system_stats["uptime"] % 300 == 0:
                    await self._run_learning_cycle()
                
                # انتظار قبل المراقبة التالية
                await asyncio.sleep(60)  # مراقبة كل دقيقة
                
            except Exception as e:
                print(f"❌ خطأ في مراقبة النظام: {e}")
                await asyncio.sleep(10)

    async def _run_learning_cycle(self):
        """تشغيل دورة التعلم"""
        print("🧠 تشغيل دورة التعلم...")
        
        try:
            # تعلم Hub من التغذية الراجعة
            if self.auraos_hub:
                await self.auraos_hub.learn_from_feedback()
            
            # تحديث إحصائيات النظام
            self.system_stats["total_learning_cycles"] += 1
            
            # إرسال إحصائيات النظام
            await self.mcp_channel.send_message(
                MessageType.SYSTEM_STATUS,
                "learning_brain_hub",
                "broadcast",
                {
                    "event": "learning_cycle_completed",
                    "cycle_number": self.system_stats["total_learning_cycles"],
                    "system_stats": self.system_stats
                },
                MessagePriority.NORMAL
            )
            
            print(f"📈 اكتملت دورة التعلم #{self.system_stats['total_learning_cycles']}")
            
        except Exception as e:
            print(f"❌ خطأ في دورة التعلم: {e}")

    async def get_system_status(self) -> Dict[str, Any]:
        """الحصول على حالة النظام الكامل"""
        status = {
            "system_name": self.name,
            "version": self.version,
            "is_running": self.is_running,
            "system_stats": self.system_stats.copy(),
            "components": {
                "auraos_hub": await self.auraos_hub.get_system_status() if self.auraos_hub else None,
                "mcp_channel": await self.mcp_channel.get_channel_status() if self.mcp_channel else None,
                "ai_agents": {}
            }
        }
        
        # إضافة حالة الوكلاء
        for agent_id, agent in self.ai_agents.items():
            status["components"]["ai_agents"][agent_id] = await agent.get_agent_status()
        
        return status

    async def shutdown(self):
        """إغلاق النظام"""
        print("🔄 إغلاق Learning Brain Hub...")
        
        self.is_running = False
        
        # إلغاء مهمة المراقبة
        if hasattr(self, 'monitoring_task'):
            self.monitoring_task.cancel()
        
        # إغلاق المكونات
        if self.mcp_channel:
            await self.mcp_channel.shutdown()
        
        if self.auraos_hub:
            await self.auraos_hub.shutdown()
        
        print("✅ تم إغلاق Learning Brain Hub")

# مثال على الاستخدام الكامل
async def demo_learning_brain_hub():
    """عرض توضيحي للنظام الكامل"""
    print("🎬 بدء العرض التوضيحي لـ Learning Brain Hub")
    print("=" * 60)
    
    # إنشاء النظام
    brain_hub = LearningBrainHub()
    
    try:
        # تهيئة النظام
        await brain_hub.initialize()
        
        # بدء جلسة تعلم تجريبية
        print("\n🎯 بدء جلسة تعلم تجريبية...")
        
        session_id = await brain_hub.start_learning_session(
            "user_001",
            ["programming", "ai"],
            {
                "level": "intermediate",
                "language": "python",
                "time_available": 60
            }
        )
        
        if session_id:
            print(f"✅ بدأت جلسة التعلم: {session_id}")
            
            # انتظار معالجة المهمة
            print("⏳ انتظار معالجة المهمة...")
            await asyncio.sleep(3)
            
            # عرض حالة النظام
            status = await brain_hub.get_system_status()
            print(f"\n📊 حالة النظام:")
            print(f"   النظام: {status['system_name']} v{status['version']}")
            print(f"   الحالة: {'نشط' if status['is_running'] else 'غير نشط'}")
            print(f"   وقت التشغيل: {status['system_stats']['uptime']:.1f} ثانية")
            print(f"   المهام الناجحة: {status['system_stats']['successful_tasks']}")
            print(f"   المهام الفاشلة: {status['system_stats']['failed_tasks']}")
            print(f"   متوسط الأداء: {status['system_stats']['average_performance']:.2f}")
            print(f"   دورات التعلم: {status['system_stats']['total_learning_cycles']}")
            
            # عرض حالة المكونات
            print(f"\n🔧 حالة المكونات:")
            if status['components']['auraos_hub']:
                hub_status = status['components']['auraos_hub']
                print(f"   AuraOS Hub: {hub_status['total_tasks']} مهمة، {hub_status['registered_agents']} وكيل")
            
            if status['components']['mcp_channel']:
                channel_status = status['components']['mcp_channel']
                print(f"   MCP Channel: {channel_status['registered_components']} مكون، {channel_status['message_queue_size']} رسالة في الطابور")
            
            print(f"   AI Agents: {len(status['components']['ai_agents'])} وكيل نشط")
            for agent_id, agent_status in status['components']['ai_agents'].items():
                print(f"     - {agent_id}: {agent_status['total_tasks']} مهمة، معدل نجاح {agent_status['success_rate']:.2f}")
        
        else:
            print("❌ فشل في بدء جلسة التعلم")
        
        # انتظار إضافي لمحاكاة العمل
        print("\n⏳ انتظار إضافي لمحاكاة العمل...")
        await asyncio.sleep(2)
        
    except Exception as e:
        print(f"❌ خطأ في العرض التوضيحي: {e}")
    
    finally:
        # إغلاق النظام
        await brain_hub.shutdown()
        print("\n🎉 انتهى العرض التوضيحي!")

if __name__ == "__main__":
    asyncio.run(demo_learning_brain_hub())
