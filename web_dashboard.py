#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
AuraOS Web Dashboard - لوحة التحكم الويبية
عرض المهام والإحصائيات في الوقت الفعلي
"""

import asyncio
import json
import sys
from datetime import datetime
from typing import Dict, List, Any, Optional
from pathlib import Path
import logging

# إضافة المسار للاستيراد
sys.path.append(str(Path(__file__).parent))

from task_dispatcher import TaskDispatcher, TaskStatus, TaskType
from telegram_bot_integration import TelegramBotIntegration

# إعداد التسجيل
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class WebDashboard:
    """
    لوحة التحكم الويبية
    """
    
    def __init__(self):
        self.name = "AuraOS Web Dashboard"
        self.version = "0.5.0-Dashboard"
        self.is_active = False
        
        # المكونات الأساسية
        self.task_dispatcher: Optional[TaskDispatcher] = None
        self.telegram_bot: Optional[TelegramBotIntegration] = None
        
        # إحصائيات لوحة التحكم
        self.dashboard_stats = {
            "total_requests": 0,
            "active_sessions": 0,
            "last_update": None,
            "start_time": None
        }
        
        logger.info(f"🌐 تم إنشاء {self.name} v{self.version}")

    async def initialize(self):
        """تهيئة لوحة التحكم"""
        logger.info("🚀 تهيئة Web Dashboard...")
        
        try:
            # تهيئة Task Dispatcher
            logger.info("   📋 تهيئة Task Dispatcher...")
            self.task_dispatcher = TaskDispatcher()
            await self.task_dispatcher.initialize()
            
            # تهيئة Telegram Bot Integration
            logger.info("   🤖 تهيئة Telegram Bot Integration...")
            self.telegram_bot = TelegramBotIntegration()
            await self.telegram_bot.initialize()
            
            # بدء مراقبة لوحة التحكم
            logger.info("   👁️ بدء مراقبة لوحة التحكم...")
            self.monitoring_task = asyncio.create_task(self._monitor_dashboard())
            
            self.is_active = True
            self.dashboard_stats["start_time"] = datetime.now()
            
            logger.info("✅ Web Dashboard جاهز!")
            
        except Exception as e:
            logger.error(f"❌ خطأ في تهيئة Web Dashboard: {e}")
            await self.shutdown()
            raise

    async def get_dashboard_data(self) -> Dict[str, Any]:
        """الحصول على بيانات لوحة التحكم"""
        try:
            self.dashboard_stats["total_requests"] += 1
            self.dashboard_stats["last_update"] = datetime.now().isoformat()
            
            # الحصول على بيانات المهام
            all_tasks = await self.task_dispatcher.get_all_tasks()
            
            # تصنيف المهام حسب الحالة
            tasks_by_status = {
                TaskStatus.PENDING: [],
                TaskStatus.IN_PROGRESS: [],
                TaskStatus.COMPLETED: [],
                TaskStatus.FAILED: [],
                TaskStatus.CANCELLED: []
            }
            
            for task in all_tasks:
                status = task["status"]
                if status in tasks_by_status:
                    tasks_by_status[status].append(task)
            
            # تصنيف المهام حسب النوع
            tasks_by_type = {
                TaskType.CODE_GENERATION: [],
                TaskType.DATA_ANALYSIS: [],
                TaskType.API_TESTING: [],
                TaskType.DOCUMENTATION: [],
                TaskType.RESEARCH: [],
                TaskType.AUTOMATION: []
            }
            
            for task in all_tasks:
                task_type = task["task_type"]
                if task_type in tasks_by_type:
                    tasks_by_type[task_type].append(task)
            
            # الحصول على إحصائيات المهام
            task_stats = await self.task_dispatcher.get_dispatcher_status()
            
            # الحصول على إحصائيات البوت
            bot_stats = await self.telegram_bot.get_bot_status()
            
            # إنشاء بيانات لوحة التحكم
            dashboard_data = {
                "dashboard_info": {
                    "name": self.name,
                    "version": self.version,
                    "is_active": self.is_active,
                    "last_update": self.dashboard_stats["last_update"]
                },
                "task_overview": {
                    "total_tasks": len(all_tasks),
                    "tasks_by_status": {
                        "pending": len(tasks_by_status[TaskStatus.PENDING]),
                        "in_progress": len(tasks_by_status[TaskStatus.IN_PROGRESS]),
                        "completed": len(tasks_by_status[TaskStatus.COMPLETED]),
                        "failed": len(tasks_by_status[TaskStatus.FAILED]),
                        "cancelled": len(tasks_by_status[TaskStatus.CANCELLED])
                    },
                    "tasks_by_type": {
                        "code_generation": len(tasks_by_type[TaskType.CODE_GENERATION]),
                        "data_analysis": len(tasks_by_type[TaskType.DATA_ANALYSIS]),
                        "api_testing": len(tasks_by_type[TaskType.API_TESTING]),
                        "documentation": len(tasks_by_type[TaskType.DOCUMENTATION]),
                        "research": len(tasks_by_type[TaskType.RESEARCH]),
                        "automation": len(tasks_by_type[TaskType.AUTOMATION])
                    }
                },
                "recent_tasks": self._get_recent_tasks(all_tasks),
                "task_stats": task_stats["task_stats"],
                "bot_stats": bot_stats["bot_stats"],
                "system_status": {
                    "task_dispatcher": task_stats["is_active"],
                    "telegram_bot": bot_stats["is_active"],
                    "mcp_integration": task_stats.get("mcp_integration_status", {}).get("is_active", False)
                }
            }
            
            return dashboard_data
            
        except Exception as e:
            logger.error(f"❌ خطأ في الحصول على بيانات لوحة التحكم: {e}")
            return {
                "error": str(e),
                "timestamp": datetime.now().isoformat()
            }

    def _get_recent_tasks(self, all_tasks: List[Dict[str, Any]], limit: int = 10) -> List[Dict[str, Any]]:
        """الحصول على المهام الأخيرة"""
        try:
            # ترتيب المهام حسب وقت الإنشاء
            sorted_tasks = sorted(all_tasks, key=lambda x: x["created_at"], reverse=True)
            
            # أخذ آخر المهام
            recent_tasks = sorted_tasks[:limit]
            
            # تنسيق البيانات للعرض
            formatted_tasks = []
            for task in recent_tasks:
                formatted_task = {
                    "task_id": task["task_id"],
                    "description": task["description"],
                    "task_type": task["task_type"],
                    "status": task["status"],
                    "assigned_agent": task["assigned_agent"],
                    "created_at": task["created_at"],
                    "updated_at": task["updated_at"],
                    "progress": task.get("progress", 0),
                    "user_id": task["user_id"],
                    "telegram_chat_id": task.get("telegram_chat_id")
                }
                
                # إضافة النتيجة إذا كانت متوفرة
                if task.get("result"):
                    formatted_task["result"] = task["result"]
                
                # إضافة الخطأ إذا كان متوفراً
                if task.get("error"):
                    formatted_task["error"] = task["error"]
                
                formatted_tasks.append(formatted_task)
            
            return formatted_tasks
            
        except Exception as e:
            logger.error(f"❌ خطأ في تنسيق المهام الأخيرة: {e}")
            return []

    async def get_task_details(self, task_id: str) -> Dict[str, Any]:
        """الحصول على تفاصيل مهمة محددة"""
        try:
            task = await self.task_dispatcher.get_task_status(task_id)
            
            if not task:
                return {
                    "error": "المهمة غير موجودة",
                    "task_id": task_id
                }
            
            # تنسيق تفاصيل المهمة
            task_details = {
                "task_id": task["task_id"],
                "user_id": task["user_id"],
                "telegram_chat_id": task.get("telegram_chat_id"),
                "task_type": task["task_type"],
                "description": task["description"],
                "assigned_agent": task["assigned_agent"],
                "status": task["status"],
                "priority": task["priority"],
                "created_at": task["created_at"],
                "updated_at": task["updated_at"],
                "progress": task.get("progress", 0),
                "parameters": task.get("parameters", {}),
                "result": task.get("result"),
                "error": task.get("error")
            }
            
            return task_details
            
        except Exception as e:
            logger.error(f"❌ خطأ في الحصول على تفاصيل المهمة: {e}")
            return {
                "error": str(e),
                "task_id": task_id
            }

    async def get_user_dashboard(self, user_id: str) -> Dict[str, Any]:
        """الحصول على لوحة تحكم المستخدم"""
        try:
            # الحصول على مهام المستخدم
            user_tasks = await self.task_dispatcher.get_user_tasks(user_id)
            
            # تصنيف مهام المستخدم
            user_tasks_by_status = {
                TaskStatus.PENDING: [],
                TaskStatus.IN_PROGRESS: [],
                TaskStatus.COMPLETED: [],
                TaskStatus.FAILED: [],
                TaskStatus.CANCELLED: []
            }
            
            for task in user_tasks:
                status = task["status"]
                if status in user_tasks_by_status:
                    user_tasks_by_status[status].append(task)
            
            # إنشاء لوحة تحكم المستخدم
            user_dashboard = {
                "user_id": user_id,
                "total_tasks": len(user_tasks),
                "tasks_by_status": {
                    "pending": len(user_tasks_by_status[TaskStatus.PENDING]),
                    "in_progress": len(user_tasks_by_status[TaskStatus.IN_PROGRESS]),
                    "completed": len(user_tasks_by_status[TaskStatus.COMPLETED]),
                    "failed": len(user_tasks_by_status[TaskStatus.FAILED]),
                    "cancelled": len(user_tasks_by_status[TaskStatus.CANCELLED])
                },
                "recent_tasks": self._get_recent_tasks(user_tasks, limit=5),
                "task_history": user_tasks,
                "last_activity": max([task["updated_at"] for task in user_tasks]) if user_tasks else None
            }
            
            return user_dashboard
            
        except Exception as e:
            logger.error(f"❌ خطأ في الحصول على لوحة تحكم المستخدم: {e}")
            return {
                "error": str(e),
                "user_id": user_id
            }

    async def get_system_metrics(self) -> Dict[str, Any]:
        """الحصول على مقاييس النظام"""
        try:
            # الحصول على إحصائيات المهام
            task_stats = await self.task_dispatcher.get_dispatcher_status()
            
            # الحصول على إحصائيات البوت
            bot_stats = await self.telegram_bot.get_bot_status()
            
            # الحصول على إحصائيات MCP Integration
            mcp_stats = None
            if task_stats.get("mcp_integration_status"):
                mcp_stats = task_stats["mcp_integration_status"]
            
            # إنشاء مقاييس النظام
            system_metrics = {
                "timestamp": datetime.now().isoformat(),
                "task_dispatcher": {
                    "is_active": task_stats["is_active"],
                    "total_tasks": task_stats["task_stats"]["total_tasks"],
                    "completed_tasks": task_stats["task_stats"]["completed_tasks"],
                    "failed_tasks": task_stats["task_stats"]["failed_tasks"],
                    "in_progress_tasks": task_stats["task_stats"]["in_progress_tasks"],
                    "success_rate": task_stats["task_stats"].get("success_rate", 0)
                },
                "telegram_bot": {
                    "is_active": bot_stats["is_active"],
                    "total_messages": bot_stats["bot_stats"]["total_messages"],
                    "tasks_created": bot_stats["bot_stats"]["tasks_created"],
                    "tasks_completed": bot_stats["bot_stats"]["tasks_completed"],
                    "active_users": bot_stats["bot_stats"]["active_users"],
                    "active_chats": bot_stats["active_chats"]
                },
                "mcp_integration": {
                    "is_active": mcp_stats.get("is_active", False) if mcp_stats else False,
                    "total_agents": mcp_stats.get("integration_stats", {}).get("total_agents", 0) if mcp_stats else 0,
                    "active_agents": mcp_stats.get("integration_stats", {}).get("active_agents", 0) if mcp_stats else 0,
                    "total_commands": mcp_stats.get("integration_stats", {}).get("total_commands_executed", 0) if mcp_stats else 0
                },
                "dashboard": {
                    "is_active": self.is_active,
                    "total_requests": self.dashboard_stats["total_requests"],
                    "active_sessions": self.dashboard_stats["active_sessions"],
                    "uptime": self.dashboard_stats.get("uptime", 0)
                }
            }
            
            return system_metrics
            
        except Exception as e:
            logger.error(f"❌ خطأ في الحصول على مقاييس النظام: {e}")
            return {
                "error": str(e),
                "timestamp": datetime.now().isoformat()
            }

    async def _monitor_dashboard(self):
        """مراقبة لوحة التحكم"""
        logger.info("👁️ بدء مراقبة لوحة التحكم...")
        
        while self.is_active:
            try:
                # تحديث وقت التشغيل
                if self.dashboard_stats["start_time"]:
                    uptime = (datetime.now() - self.dashboard_stats["start_time"]).total_seconds()
                    self.dashboard_stats["uptime"] = uptime
                
                # تحديث آخر تحديث
                self.dashboard_stats["last_update"] = datetime.now().isoformat()
                
                # انتظار قبل المراقبة التالية
                await asyncio.sleep(60)  # مراقبة كل دقيقة
                
            except Exception as e:
                logger.error(f"❌ خطأ في مراقبة لوحة التحكم: {e}")
                await asyncio.sleep(30)

    async def get_dashboard_status(self) -> Dict[str, Any]:
        """الحصول على حالة لوحة التحكم"""
        status = {
            "dashboard_name": self.name,
            "version": self.version,
            "is_active": self.is_active,
            "dashboard_stats": self.dashboard_stats.copy(),
            "components": {
                "task_dispatcher": self.task_dispatcher is not None,
                "telegram_bot": self.telegram_bot is not None
            }
        }
        
        return status

    async def shutdown(self):
        """إغلاق لوحة التحكم"""
        logger.info("🔄 إغلاق Web Dashboard...")
        
        self.is_active = False
        
        # إلغاء مهمة المراقبة
        if hasattr(self, 'monitoring_task'):
            self.monitoring_task.cancel()
        
        # إغلاق المكونات
        if self.task_dispatcher:
            await self.task_dispatcher.shutdown()
        
        if self.telegram_bot:
            await self.telegram_bot.shutdown()
        
        logger.info("✅ تم إغلاق Web Dashboard")

# مثال على الاستخدام
async def demo_web_dashboard():
    """عرض توضيحي للوحة التحكم الويبية"""
    print("🎬 بدء العرض التوضيحي للوحة التحكم الويبية")
    print("=" * 60)
    
    dashboard = WebDashboard()
    
    try:
        # تهيئة لوحة التحكم
        await dashboard.initialize()
        
        # إنشاء بعض المهام التجريبية
        print("\n📋 إنشاء مهام تجريبية...")
        
        # مهمة 1
        task1_data = {
            "user_id": "user_001",
            "telegram_chat_id": "123456789",
            "description": "ابنِ لي React app بسيط",
            "priority": "high"
        }
        
        task1_id = await dashboard.task_dispatcher.create_task(task1_data)
        print(f"✅ تم إنشاء المهمة 1: {task1_id}")
        
        # مهمة 2
        task2_data = {
            "user_id": "user_002",
            "telegram_chat_id": "987654321",
            "description": "حلل بيانات JSON للمستخدمين",
            "priority": "normal"
        }
        
        task2_id = await dashboard.task_dispatcher.create_task(task2_data)
        print(f"✅ تم إنشاء المهمة 2: {task2_id}")
        
        # مهمة 3
        task3_data = {
            "user_id": "user_001",
            "telegram_chat_id": "123456789",
            "description": "اختبر API endpoint",
            "priority": "low"
        }
        
        task3_id = await dashboard.task_dispatcher.create_task(task3_data)
        print(f"✅ تم إنشاء المهمة 3: {task3_id}")
        
        # تنفيذ بعض المهام
        print("\n⚡ تنفيذ المهام...")
        
        await dashboard.task_dispatcher.execute_task(task1_id)
        await dashboard.task_dispatcher.execute_task(task2_id)
        
        # الحصول على بيانات لوحة التحكم
        print("\n📊 بيانات لوحة التحكم:")
        dashboard_data = await dashboard.get_dashboard_data()
        
        print(f"   إجمالي المهام: {dashboard_data['task_overview']['total_tasks']}")
        print(f"   المهام المكتملة: {dashboard_data['task_overview']['tasks_by_status']['completed']}")
        print(f"   المهام قيد التنفيذ: {dashboard_data['task_overview']['tasks_by_status']['in_progress']}")
        print(f"   المهام الفاشلة: {dashboard_data['task_overview']['tasks_by_status']['failed']}")
        
        print(f"\n📈 المهام حسب النوع:")
        for task_type, count in dashboard_data['task_overview']['tasks_by_type'].items():
            print(f"   {task_type}: {count}")
        
        print(f"\n📋 المهام الأخيرة:")
        for task in dashboard_data['recent_tasks'][:3]:
            status_emoji = {
                TaskStatus.PENDING: "⏳",
                TaskStatus.IN_PROGRESS: "🔄",
                TaskStatus.COMPLETED: "✅",
                TaskStatus.FAILED: "❌",
                TaskStatus.CANCELLED: "🚫"
            }.get(task["status"], "❓")
            
            print(f"   {status_emoji} {task['task_id']}: {task['description'][:50]}...")
        
        # الحصول على تفاصيل مهمة محددة
        print(f"\n🔍 تفاصيل المهمة {task1_id}:")
        task_details = await dashboard.get_task_details(task1_id)
        
        if "error" not in task_details:
            print(f"   الوصف: {task_details['description']}")
            print(f"   النوع: {task_details['task_type']}")
            print(f"   الحالة: {task_details['status']}")
            print(f"   الوكيل: {task_details['assigned_agent']}")
            print(f"   التقدم: {task_details['progress']}%")
        else:
            print(f"   خطأ: {task_details['error']}")
        
        # الحصول على لوحة تحكم المستخدم
        print(f"\n👤 لوحة تحكم المستخدم user_001:")
        user_dashboard = await dashboard.get_user_dashboard("user_001")
        
        if "error" not in user_dashboard:
            print(f"   إجمالي المهام: {user_dashboard['total_tasks']}")
            print(f"   المهام المكتملة: {user_dashboard['tasks_by_status']['completed']}")
            print(f"   آخر نشاط: {user_dashboard['last_activity']}")
        else:
            print(f"   خطأ: {user_dashboard['error']}")
        
        # الحصول على مقاييس النظام
        print(f"\n📈 مقاييس النظام:")
        system_metrics = await dashboard.get_system_metrics()
        
        print(f"   Task Dispatcher: {'نشط' if system_metrics['task_dispatcher']['is_active'] else 'غير نشط'}")
        print(f"   Telegram Bot: {'نشط' if system_metrics['telegram_bot']['is_active'] else 'غير نشط'}")
        print(f"   MCP Integration: {'نشط' if system_metrics['mcp_integration']['is_active'] else 'غير نشط'}")
        
        print(f"   معدل نجاح المهام: {system_metrics['task_dispatcher']['success_rate']:.2f}")
        print(f"   إجمالي الرسائل: {system_metrics['telegram_bot']['total_messages']}")
        print(f"   المستخدمين النشطين: {system_metrics['telegram_bot']['active_users']}")
        
        # انتظار إضافي لمحاكاة العمل
        print("\n⏳ انتظار إضافي لمحاكاة العمل...")
        await asyncio.sleep(2)
        
    except Exception as e:
        print(f"❌ خطأ في العرض التوضيحي: {e}")
    
    finally:
        # إغلاق لوحة التحكم
        await dashboard.shutdown()
        print("\n🎉 انتهى العرض التوضيحي!")

if __name__ == "__main__":
    asyncio.run(demo_web_dashboard())
