#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
AuraOS Telegram Bot Integration - تكامل البوت مع Task Dispatcher
ربط Telegram Bot مع نظام إدارة المهام
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

# إعداد التسجيل
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class TelegramBotIntegration:
    """
    تكامل Telegram Bot مع Task Dispatcher
    """
    
    def __init__(self, bot_token: str = None):
        self.bot_token = bot_token or "demo_bot_token"
        self.name = "AuraOS Telegram Bot Integration"
        self.version = "0.5.0-Telegram"
        self.is_active = False
        
        # المكونات الأساسية
        self.task_dispatcher: Optional[TaskDispatcher] = None
        self.active_chats: Dict[str, Dict[str, Any]] = {}
        
        # إحصائيات البوت
        self.bot_stats = {
            "total_messages": 0,
            "tasks_created": 0,
            "tasks_completed": 0,
            "active_users": 0,
            "start_time": None
        }
        
        logger.info(f"🤖 تم إنشاء {self.name} v{self.version}")

    async def initialize(self):
        """تهيئة تكامل البوت"""
        logger.info("🚀 تهيئة Telegram Bot Integration...")
        
        try:
            # تهيئة Task Dispatcher
            logger.info("   📋 تهيئة Task Dispatcher...")
            self.task_dispatcher = TaskDispatcher()
            await self.task_dispatcher.initialize()
            
            # بدء مراقبة البوت
            logger.info("   👁️ بدء مراقبة البوت...")
            self.monitoring_task = asyncio.create_task(self._monitor_bot())
            
            self.is_active = True
            self.bot_stats["start_time"] = datetime.now()
            
            logger.info("✅ Telegram Bot Integration جاهز!")
            
        except Exception as e:
            logger.error(f"❌ خطأ في تهيئة Telegram Bot Integration: {e}")
            await self.shutdown()
            raise

    async def handle_message(self, message_data: Dict[str, Any]) -> Dict[str, Any]:
        """معالجة رسالة من Telegram"""
        try:
            self.bot_stats["total_messages"] += 1
            
            chat_id = message_data.get("chat_id")
            user_id = message_data.get("user_id")
            text = message_data.get("text", "")
            username = message_data.get("username", "unknown")
            
            logger.info(f"📨 معالجة رسالة من {username} ({user_id}): {text}")
            
            # تحديث معلومات المستخدم
            if chat_id not in self.active_chats:
                self.active_chats[chat_id] = {
                    "user_id": user_id,
                    "username": username,
                    "first_seen": datetime.now().isoformat(),
                    "last_activity": datetime.now().isoformat(),
                    "tasks_created": 0
                }
                self.bot_stats["active_users"] += 1
            else:
                self.active_chats[chat_id]["last_activity"] = datetime.now().isoformat()
            
            # تحليل الرسالة
            response = await self._analyze_and_process_message(chat_id, user_id, text, username)
            
            return response
            
        except Exception as e:
            logger.error(f"❌ خطأ في معالجة الرسالة: {e}")
            return {
                "success": False,
                "error": str(e),
                "response": "عذراً، حدث خطأ في معالجة رسالتك. حاول مرة أخرى."
            }

    async def _analyze_and_process_message(self, chat_id: str, user_id: str, text: str, username: str) -> Dict[str, Any]:
        """تحليل ومعالجة الرسالة"""
        try:
            text_lower = text.lower()
            
            # التحقق من الأوامر الخاصة
            if text_lower.startswith("/start"):
                return await self._handle_start_command(chat_id, username)
            
            elif text_lower.startswith("/help"):
                return await self._handle_help_command(chat_id)
            
            elif text_lower.startswith("/status"):
                return await self._handle_status_command(chat_id, user_id)
            
            elif text_lower.startswith("/tasks"):
                return await self._handle_tasks_command(chat_id, user_id)
            
            elif text_lower.startswith("/cancel"):
                return await self._handle_cancel_command(chat_id, user_id, text)
            
            # معالجة المهام
            elif any(keyword in text_lower for keyword in ["ابن", "أنشئ", "اصنع", "build", "create", "make"]):
                return await self._handle_task_creation(chat_id, user_id, text, "code_generation")
            
            elif any(keyword in text_lower for keyword in ["حلل", "analyze", "parse"]):
                return await self._handle_task_creation(chat_id, user_id, text, "data_analysis")
            
            elif any(keyword in text_lower for keyword in ["اختبر", "test", "check"]):
                return await self._handle_task_creation(chat_id, user_id, text, "api_testing")
            
            elif any(keyword in text_lower for keyword in ["اكتب", "اشرح", "document", "explain"]):
                return await self._handle_task_creation(chat_id, user_id, text, "documentation")
            
            elif any(keyword in text_lower for keyword in ["ابحث", "find", "search"]):
                return await self._handle_task_creation(chat_id, user_id, text, "research")
            
            else:
                return await self._handle_general_message(chat_id, text)
                
        except Exception as e:
            logger.error(f"❌ خطأ في تحليل الرسالة: {e}")
            return {
                "success": False,
                "error": str(e),
                "response": "عذراً، لم أتمكن من فهم رسالتك. استخدم /help للحصول على المساعدة."
            }

    async def _handle_start_command(self, chat_id: str, username: str) -> Dict[str, Any]:
        """معالجة أمر /start"""
        response = f"""
🎉 مرحباً {username}!

أنا AuraOS AI Assistant، يمكنني مساعدتك في:

🔧 **توليد الكود**
- ابنِ لي React app
- أنشئ Python script
- اصنع website

📊 **تحليل البيانات**
- حلل بيانات JSON
- افحص ملف CSV
- راجع قاعدة البيانات

🌐 **اختبار APIs**
- اختبر API endpoint
- تحقق من الخدمة
- فحص الاستجابة

📝 **التوثيق والبحث**
- اكتب documentation
- ابحث عن معلومات
- اشرح مفهوم

**الأوامر المتاحة:**
/help - عرض المساعدة
/status - حالة المهام
/tasks - قائمة المهام
/cancel - إلغاء مهمة

ابدأ بكتابة ما تريد! 🚀
"""
        
        return {
            "success": True,
            "response": response,
            "message_type": "start"
        }

    async def _handle_help_command(self, chat_id: str) -> Dict[str, Any]:
        """معالجة أمر /help"""
        response = """
📖 **دليل الاستخدام**

**إنشاء المهام:**
• ابنِ لي [نوع المشروع] - لتوليد الكود
• حلل [نوع البيانات] - لتحليل البيانات
• اختبر [API URL] - لاختبار APIs
• اكتب [نوع التوثيق] - للتوثيق
• ابحث عن [الموضوع] - للبحث

**أمثلة:**
• ابنِ لي React app بسيط
• حلل بيانات JSON للمستخدمين
• اختبر API endpoint
• اكتب documentation للكود
• ابحث عن معلومات عن AI

**إدارة المهام:**
• /status - عرض حالة المهام الحالية
• /tasks - قائمة جميع المهام
• /cancel [رقم المهمة] - إلغاء مهمة

**نصائح:**
• كن محدداً في طلبك
• اذكر التفاصيل المهمة
• استخدم الكلمات المفتاحية المناسبة

هل تحتاج مساعدة في شيء معين؟ 🤔
"""
        
        return {
            "success": True,
            "response": response,
            "message_type": "help"
        }

    async def _handle_status_command(self, chat_id: str, user_id: str) -> Dict[str, Any]:
        """معالجة أمر /status"""
        try:
            # الحصول على مهام المستخدم
            user_tasks = await self.task_dispatcher.get_user_tasks(user_id)
            
            if not user_tasks:
                response = "📋 لا توجد مهام حالياً.\n\nابدأ بإنشاء مهمة جديدة!"
            else:
                response = "📊 **حالة المهام:**\n\n"
                
                for i, task in enumerate(user_tasks[:5], 1):  # آخر 5 مهام فقط
                    status_emoji = {
                        TaskStatus.PENDING: "⏳",
                        TaskStatus.IN_PROGRESS: "🔄",
                        TaskStatus.COMPLETED: "✅",
                        TaskStatus.FAILED: "❌",
                        TaskStatus.CANCELLED: "🚫"
                    }.get(task["status"], "❓")
                    
                    created_at = datetime.fromisoformat(task["created_at"]).strftime("%H:%M")
                    response += f"{i}. {status_emoji} {task['description'][:50]}...\n"
                    response += f"   📅 {created_at} | 🎯 {task['task_type']}\n\n"
                
                if len(user_tasks) > 5:
                    response += f"... و {len(user_tasks) - 5} مهمة أخرى"
            
            return {
                "success": True,
                "response": response,
                "message_type": "status"
            }
            
        except Exception as e:
            logger.error(f"❌ خطأ في عرض حالة المهام: {e}")
            return {
                "success": False,
                "error": str(e),
                "response": "عذراً، لم أتمكن من عرض حالة المهام."
            }

    async def _handle_tasks_command(self, chat_id: str, user_id: str) -> Dict[str, Any]:
        """معالجة أمر /tasks"""
        try:
            # الحصول على جميع مهام المستخدم
            user_tasks = await self.task_dispatcher.get_user_tasks(user_id)
            
            if not user_tasks:
                response = "📋 لا توجد مهام حالياً.\n\nابدأ بإنشاء مهمة جديدة!"
            else:
                response = f"📋 **جميع المهام ({len(user_tasks)}):**\n\n"
                
                for i, task in enumerate(user_tasks, 1):
                    status_emoji = {
                        TaskStatus.PENDING: "⏳",
                        TaskStatus.IN_PROGRESS: "🔄",
                        TaskStatus.COMPLETED: "✅",
                        TaskStatus.FAILED: "❌",
                        TaskStatus.CANCELLED: "🚫"
                    }.get(task["status"], "❓")
                    
                    created_at = datetime.fromisoformat(task["created_at"]).strftime("%Y-%m-%d %H:%M")
                    response += f"**{i}. {task['task_id']}**\n"
                    response += f"{status_emoji} {task['description']}\n"
                    response += f"📅 {created_at} | 🎯 {task['task_type']}\n"
                    response += f"🤖 {task['assigned_agent']}\n\n"
            
            return {
                "success": True,
                "response": response,
                "message_type": "tasks"
            }
            
        except Exception as e:
            logger.error(f"❌ خطأ في عرض المهام: {e}")
            return {
                "success": False,
                "error": str(e),
                "response": "عذراً، لم أتمكن من عرض المهام."
            }

    async def _handle_cancel_command(self, chat_id: str, user_id: str, text: str) -> Dict[str, Any]:
        """معالجة أمر /cancel"""
        try:
            # استخراج رقم المهمة من النص
            parts = text.split()
            if len(parts) < 2:
                return {
                    "success": False,
                    "response": "استخدم: /cancel [رقم المهمة]\nمثال: /cancel 1"
                }
            
            try:
                task_index = int(parts[1]) - 1
            except ValueError:
                return {
                    "success": False,
                    "response": "رقم المهمة غير صحيح. استخدم رقم صحيح."
                }
            
            # الحصول على مهام المستخدم
            user_tasks = await self.task_dispatcher.get_user_tasks(user_id)
            
            if task_index < 0 or task_index >= len(user_tasks):
                return {
                    "success": False,
                    "response": f"رقم المهمة غير صحيح. لديك {len(user_tasks)} مهمة."
                }
            
            task = user_tasks[task_index]
            task_id = task["task_id"]
            
            # إلغاء المهمة
            if task["status"] in [TaskStatus.PENDING, TaskStatus.IN_PROGRESS]:
                task["status"] = TaskStatus.CANCELLED
                task["updated_at"] = datetime.now().isoformat()
                
                response = f"🚫 تم إلغاء المهمة:\n{task['description']}"
            else:
                response = f"⚠️ لا يمكن إلغاء المهمة في حالة: {task['status']}"
            
            return {
                "success": True,
                "response": response,
                "message_type": "cancel"
            }
            
        except Exception as e:
            logger.error(f"❌ خطأ في إلغاء المهمة: {e}")
            return {
                "success": False,
                "error": str(e),
                "response": "عذراً، لم أتمكن من إلغاء المهمة."
            }

    async def _handle_task_creation(self, chat_id: str, user_id: str, text: str, task_type: str) -> Dict[str, Any]:
        """معالجة إنشاء مهمة جديدة"""
        try:
            # إنشاء المهمة
            task_data = {
                "user_id": user_id,
                "telegram_chat_id": chat_id,
                "description": text,
                "priority": "normal",
                "parameters": {}
            }
            
            task_id = await self.task_dispatcher.create_task(task_data)
            
            # تحديث إحصائيات البوت
            self.bot_stats["tasks_created"] += 1
            self.active_chats[chat_id]["tasks_created"] += 1
            
            # إرسال تأكيد إنشاء المهمة
            response = f"""
✅ **تم إنشاء المهمة بنجاح!**

🆔 **رقم المهمة:** {task_id}
📝 **الوصف:** {text}
🎯 **النوع:** {task_type}
⏳ **الحالة:** في الانتظار

سيتم تنفيذ المهمة قريباً. ستصلك إشعار عند الانتهاء! 🚀

استخدم /status لمتابعة التقدم
"""
            
            # بدء تنفيذ المهمة في الخلفية
            asyncio.create_task(self._execute_task_and_notify(task_id, chat_id))
            
            return {
                "success": True,
                "response": response,
                "message_type": "task_created",
                "task_id": task_id
            }
            
        except Exception as e:
            logger.error(f"❌ خطأ في إنشاء المهمة: {e}")
            return {
                "success": False,
                "error": str(e),
                "response": "عذراً، لم أتمكن من إنشاء المهمة. حاول مرة أخرى."
            }

    async def _handle_general_message(self, chat_id: str, text: str) -> Dict[str, Any]:
        """معالجة الرسائل العامة"""
        response = """
🤔 لم أفهم طلبك تماماً.

**يمكنني مساعدتك في:**

🔧 **توليد الكود**
• ابنِ لي React app
• أنشئ Python script

📊 **تحليل البيانات**
• حلل بيانات JSON
• افحص ملف CSV

🌐 **اختبار APIs**
• اختبر API endpoint
• تحقق من الخدمة

📝 **التوثيق والبحث**
• اكتب documentation
• ابحث عن معلومات

**أو استخدم:**
/help - للمساعدة
/status - لحالة المهام
/tasks - لقائمة المهام

اكتب طلبك بوضوح وسأساعدك! 😊
"""
        
        return {
            "success": True,
            "response": response,
            "message_type": "general"
        }

    async def _execute_task_and_notify(self, task_id: str, chat_id: str):
        """تنفيذ المهمة وإرسال الإشعار"""
        try:
            logger.info(f"⚡ بدء تنفيذ المهمة: {task_id}")
            
            # تنفيذ المهمة
            result = await self.task_dispatcher.execute_task(task_id)
            
            # إرسال الإشعار
            await self._send_task_notification(chat_id, task_id, result)
            
        except Exception as e:
            logger.error(f"❌ خطأ في تنفيذ المهمة {task_id}: {e}")
            
            # إرسال إشعار خطأ
            await self._send_error_notification(chat_id, task_id, str(e))

    async def _send_task_notification(self, chat_id: str, task_id: str, result: Dict[str, Any]):
        """إرسال إشعار انتهاء المهمة"""
        try:
            task = await self.task_dispatcher.get_task_status(task_id)
            
            if not task:
                return
            
            if result["success"]:
                # إشعار نجاح
                notification = f"""
🎉 **تم إكمال المهمة بنجاح!**

🆔 **رقم المهمة:** {task_id}
📝 **الوصف:** {task['description']}
✅ **الحالة:** مكتملة
⏱️ **الوقت:** {datetime.now().strftime('%H:%M')}

**النتيجة:**
{self._format_task_result(result)}

استخدم /status لمتابعة المهام الأخرى
"""
            else:
                # إشعار فشل
                notification = f"""
❌ **فشلت المهمة**

🆔 **رقم المهمة:** {task_id}
📝 **الوصف:** {task['description']}
❌ **الحالة:** فشلت
⏱️ **الوقت:** {datetime.now().strftime('%H:%M')}

**الخطأ:** {result.get('error', 'خطأ غير معروف')}

يمكنك المحاولة مرة أخرى أو طلب المساعدة
"""
            
            # في التطبيق الحقيقي، سيتم إرسال الإشعار عبر Telegram API
            logger.info(f"📤 إرسال إشعار إلى {chat_id}: {notification[:100]}...")
            
            # تحديث إحصائيات البوت
            if result["success"]:
                self.bot_stats["tasks_completed"] += 1
            
        except Exception as e:
            logger.error(f"❌ خطأ في إرسال الإشعار: {e}")

    async def _send_error_notification(self, chat_id: str, task_id: str, error: str):
        """إرسال إشعار خطأ"""
        try:
            notification = f"""
❌ **خطأ في تنفيذ المهمة**

🆔 **رقم المهمة:** {task_id}
❌ **الخطأ:** {error}
⏱️ **الوقت:** {datetime.now().strftime('%H:%M')}

عذراً على الإزعاج. يمكنك المحاولة مرة أخرى.
"""
            
            logger.info(f"📤 إرسال إشعار خطأ إلى {chat_id}: {notification[:100]}...")
            
        except Exception as e:
            logger.error(f"❌ خطأ في إرسال إشعار الخطأ: {e}")

    def _format_task_result(self, result: Dict[str, Any]) -> str:
        """تنسيق نتيجة المهمة"""
        try:
            task_type = result.get("task_type", "unknown")
            
            if task_type == "code_generation":
                return f"📁 **ملف:** {result.get('file_name', 'N/A')}\n🔧 **نوع الكود:** {result.get('code_type', 'N/A')}"
            
            elif task_type == "data_analysis":
                return f"📊 **نتيجة التحليل:** {result.get('analysis_result', 'N/A')}\n📝 **ملخص:** {result.get('summary', 'N/A')}"
            
            elif task_type == "api_testing":
                return f"🌐 **رمز الحالة:** {result.get('status_code', 'N/A')}\n⏱️ **وقت الاستجابة:** {result.get('response_time', 'N/A')}"
            
            elif task_type == "documentation":
                return f"📝 **ملف التوثيق:** {result.get('file_name', 'N/A')}\n📖 **نوع التوثيق:** Documentation"
            
            elif task_type == "research":
                return f"🔍 **نتائج البحث:** {len(result.get('research_results', {}).get('findings', []))} نتيجة\n📚 **المصادر:** {len(result.get('research_results', {}).get('sources', []))} مصدر"
            
            elif task_type == "automation":
                return f"🔄 **سير العمل:** {result.get('automation_result', {}).get('workflow', 'N/A')}\n📋 **الخطوات:** {len(result.get('automation_result', {}).get('steps', []))} خطوة"
            
            else:
                return "✅ تم تنفيذ المهمة بنجاح"
                
        except Exception as e:
            logger.error(f"❌ خطأ في تنسيق النتيجة: {e}")
            return "✅ تم تنفيذ المهمة بنجاح"

    async def _monitor_bot(self):
        """مراقبة البوت"""
        logger.info("👁️ بدء مراقبة البوت...")
        
        while self.is_active:
            try:
                # تحديث وقت التشغيل
                if self.bot_stats["start_time"]:
                    uptime = (datetime.now() - self.bot_stats["start_time"]).total_seconds()
                    self.bot_stats["uptime"] = uptime
                
                # تنظيف المحادثات القديمة
                await self._cleanup_old_chats()
                
                # انتظار قبل المراقبة التالية
                await asyncio.sleep(300)  # مراقبة كل 5 دقائق
                
            except Exception as e:
                logger.error(f"❌ خطأ في مراقبة البوت: {e}")
                await asyncio.sleep(60)

    async def _cleanup_old_chats(self):
        """تنظيف المحادثات القديمة"""
        try:
            current_time = datetime.now()
            chats_to_remove = []
            
            for chat_id, chat_info in self.active_chats.items():
                last_activity = datetime.fromisoformat(chat_info["last_activity"])
                time_diff = (current_time - last_activity).total_seconds()
                
                # إزالة المحادثات القديمة (أكثر من 24 ساعة)
                if time_diff > 86400:  # 24 ساعة
                    chats_to_remove.append(chat_id)
            
            for chat_id in chats_to_remove:
                del self.active_chats[chat_id]
                logger.info(f"🗑️ تم حذف المحادثة القديمة: {chat_id}")
                
        except Exception as e:
            logger.error(f"❌ خطأ في تنظيف المحادثات القديمة: {e}")

    async def get_bot_status(self) -> Dict[str, Any]:
        """الحصول على حالة البوت"""
        status = {
            "bot_name": self.name,
            "version": self.version,
            "is_active": self.is_active,
            "bot_stats": self.bot_stats.copy(),
            "active_chats": len(self.active_chats),
            "task_dispatcher_status": None
        }
        
        if self.task_dispatcher:
            status["task_dispatcher_status"] = await self.task_dispatcher.get_dispatcher_status()
        
        return status

    async def shutdown(self):
        """إغلاق تكامل البوت"""
        logger.info("🔄 إغلاق Telegram Bot Integration...")
        
        self.is_active = False
        
        # إلغاء مهمة المراقبة
        if hasattr(self, 'monitoring_task'):
            self.monitoring_task.cancel()
        
        # إغلاق Task Dispatcher
        if self.task_dispatcher:
            await self.task_dispatcher.shutdown()
        
        logger.info("✅ تم إغلاق Telegram Bot Integration")

# مثال على الاستخدام
async def demo_telegram_bot_integration():
    """عرض توضيحي لتكامل Telegram Bot"""
    print("🎬 بدء العرض التوضيحي لتكامل Telegram Bot")
    print("=" * 60)
    
    bot_integration = TelegramBotIntegration()
    
    try:
        # تهيئة تكامل البوت
        await bot_integration.initialize()
        
        # محاكاة رسائل من المستخدمين
        print("\n📨 محاكاة رسائل من المستخدمين...")
        
        # رسالة ترحيب
        print("\n1️⃣ رسالة ترحيب...")
        start_message = {
            "chat_id": "123456789",
            "user_id": "user_001",
            "username": "أحمد",
            "text": "/start"
        }
        
        start_response = await bot_integration.handle_message(start_message)
        print(f"✅ استجابة الترحيب: {start_response['response'][:100]}...")
        
        # رسالة طلب مساعدة
        print("\n2️⃣ رسالة طلب مساعدة...")
        help_message = {
            "chat_id": "123456789",
            "user_id": "user_001",
            "username": "أحمد",
            "text": "/help"
        }
        
        help_response = await bot_integration.handle_message(help_message)
        print(f"✅ استجابة المساعدة: {help_response['response'][:100]}...")
        
        # رسالة إنشاء مهمة
        print("\n3️⃣ رسالة إنشاء مهمة...")
        task_message = {
            "chat_id": "123456789",
            "user_id": "user_001",
            "username": "أحمد",
            "text": "ابنِ لي React app بسيط"
        }
        
        task_response = await bot_integration.handle_message(task_message)
        print(f"✅ استجابة إنشاء المهمة: {task_response['response'][:100]}...")
        
        if task_response["success"] and "task_id" in task_response:
            task_id = task_response["task_id"]
            print(f"   🆔 رقم المهمة: {task_id}")
            
            # انتظار تنفيذ المهمة
            print("\n⏳ انتظار تنفيذ المهمة...")
            await asyncio.sleep(3)
            
            # عرض حالة المهام
            print("\n4️⃣ عرض حالة المهام...")
            status_message = {
                "chat_id": "123456789",
                "user_id": "user_001",
                "username": "أحمد",
                "text": "/status"
            }
            
            status_response = await bot_integration.handle_message(status_message)
            print(f"✅ استجابة حالة المهام: {status_response['response'][:100]}...")
        
        # رسالة عرض جميع المهام
        print("\n5️⃣ رسالة عرض جميع المهام...")
        tasks_message = {
            "chat_id": "123456789",
            "user_id": "user_001",
            "username": "أحمد",
            "text": "/tasks"
        }
        
        tasks_response = await bot_integration.handle_message(tasks_message)
        print(f"✅ استجابة جميع المهام: {tasks_response['response'][:100]}...")
        
        # عرض حالة البوت
        print("\n📊 حالة البوت:")
        bot_status = await bot_integration.get_bot_status()
        
        print(f"   البوت: {bot_status['bot_name']} v{bot_status['version']}")
        print(f"   الحالة: {'نشط' if bot_status['is_active'] else 'غير نشط'}")
        print(f"   المحادثات النشطة: {bot_status['active_chats']}")
        
        stats = bot_status['bot_stats']
        print(f"   إجمالي الرسائل: {stats['total_messages']}")
        print(f"   المهام المنشأة: {stats['tasks_created']}")
        print(f"   المهام المكتملة: {stats['tasks_completed']}")
        print(f"   المستخدمين النشطين: {stats['active_users']}")
        
        # انتظار إضافي لمحاكاة العمل
        print("\n⏳ انتظار إضافي لمحاكاة العمل...")
        await asyncio.sleep(2)
        
    except Exception as e:
        print(f"❌ خطأ في العرض التوضيحي: {e}")
    
    finally:
        # إغلاق تكامل البوت
        await bot_integration.shutdown()
        print("\n🎉 انتهى العرض التوضيحي!")

if __name__ == "__main__":
    asyncio.run(demo_telegram_bot_integration())
