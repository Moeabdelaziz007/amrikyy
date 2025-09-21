#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
MCP Channel - طبقة التواصل الذكية
نظام تمرير الرسائل بين المكونات مع إدارة السياق
"""

import asyncio
import json
import uuid
import time
from datetime import datetime
from typing import Dict, List, Any, Optional, Callable
from dataclasses import dataclass, asdict
from enum import Enum
import logging

# إعداد التسجيل
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class MessageType(Enum):
    TASK_ASSIGNMENT = "task_assignment"
    TASK_RESULT = "task_result"
    LEARNING_FEEDBACK = "learning_feedback"
    SYSTEM_STATUS = "system_status"
    HEARTBEAT = "heartbeat"
    ERROR = "error"
    LEARNING_INSIGHT = "learning_insight"

class MessagePriority(Enum):
    LOW = 1
    NORMAL = 2
    HIGH = 3
    CRITICAL = 4

@dataclass
class MCPMessage:
    id: str
    type: MessageType
    priority: MessagePriority
    sender: str
    receiver: str
    payload: Dict[str, Any]
    context: Dict[str, Any]
    timestamp: datetime
    correlation_id: Optional[str] = None
    reply_to: Optional[str] = None

@dataclass
class ComponentInfo:
    component_id: str
    component_type: str
    capabilities: List[str]
    status: str
    last_seen: datetime
    metadata: Dict[str, Any]

class MCPChannel:
    """
    قناة التواصل MCP - طبقة تمرير الرسائل الذكية
    """
    
    def __init__(self, channel_id: str = "mcp_main"):
        self.channel_id = channel_id
        self.is_active = False
        
        # إدارة المكونات
        self.registered_components: Dict[str, ComponentInfo] = {}
        
        # إدارة الرسائل
        self.message_queue: List[MCPMessage] = []
        self.message_history: List[MCPMessage] = []
        self.pending_replies: Dict[str, asyncio.Future] = {}
        
        # إدارة الاشتراكات
        self.subscriptions: Dict[str, List[str]] = {}  # message_type -> [component_ids]
        self.message_handlers: Dict[str, Callable] = {}
        
        # إحصائيات الأداء
        self.stats = {
            "messages_sent": 0,
            "messages_received": 0,
            "messages_delivered": 0,
            "messages_failed": 0,
            "average_latency": 0.0,
            "active_components": 0
        }
        
        # إدارة السياق
        self.context_store: Dict[str, Any] = {}
        self.context_history: List[Dict[str, Any]] = []
        
        logger.info(f"🔗 تم إنشاء MCP Channel: {channel_id}")

    async def initialize(self):
        """تهيئة القناة"""
        logger.info("🚀 تهيئة MCP Channel...")
        
        # بدء معالج الرسائل
        self.message_processor_task = asyncio.create_task(self._process_messages())
        
        # بدء مراقب المكونات
        self.component_monitor_task = asyncio.create_task(self._monitor_components())
        
        self.is_active = True
        logger.info("✅ MCP Channel جاهز للعمل!")

    async def register_component(self, component_id: str, component_type: str, 
                               capabilities: List[str], metadata: Dict[str, Any] = None) -> bool:
        """تسجيل مكون جديد"""
        try:
            component_info = ComponentInfo(
                component_id=component_id,
                component_type=component_type,
                capabilities=capabilities,
                status="active",
                last_seen=datetime.now(),
                metadata=metadata or {}
            )
            
            self.registered_components[component_id] = component_info
            self.stats["active_components"] = len(self.registered_components)
            
            logger.info(f"📝 تم تسجيل المكون: {component_id} ({component_type})")
            logger.info(f"   القدرات: {capabilities}")
            
            # إشعار المكونات الأخرى
            await self._broadcast_component_registration(component_info)
            
            return True
            
        except Exception as e:
            logger.error(f"❌ خطأ في تسجيل المكون {component_id}: {e}")
            return False

    async def unregister_component(self, component_id: str) -> bool:
        """إلغاء تسجيل مكون"""
        try:
            if component_id in self.registered_components:
                del self.registered_components[component_id]
                self.stats["active_components"] = len(self.registered_components)
                
                # إشعار المكونات الأخرى
                await self._broadcast_component_unregistration(component_id)
                
                logger.info(f"🗑️ تم إلغاء تسجيل المكون: {component_id}")
                return True
            
            return False
            
        except Exception as e:
            logger.error(f"❌ خطأ في إلغاء تسجيل المكون {component_id}: {e}")
            return False

    async def send_message(self, message_type: MessageType, sender: str, receiver: str,
                          payload: Dict[str, Any], priority: MessagePriority = MessagePriority.NORMAL,
                          context: Dict[str, Any] = None, correlation_id: str = None) -> str:
        """إرسال رسالة"""
        try:
            message_id = str(uuid.uuid4())
            
            message = MCPMessage(
                id=message_id,
                type=message_type,
                priority=priority,
                sender=sender,
                receiver=receiver,
                payload=payload,
                context=context or {},
                timestamp=datetime.now(),
                correlation_id=correlation_id
            )
            
            # إضافة السياق التلقائي
            await self._enrich_message_context(message)
            
            # إضافة الرسالة للطابور
            self.message_queue.append(message)
            
            # ترتيب الطابور حسب الأولوية
            self.message_queue.sort(key=lambda m: m.priority.value, reverse=True)
            
            self.stats["messages_sent"] += 1
            
            logger.info(f"📤 تم إرسال رسالة: {message_id} ({message_type.value}) من {sender} إلى {receiver}")
            
            return message_id
            
        except Exception as e:
            logger.error(f"❌ خطأ في إرسال الرسالة: {e}")
            self.stats["messages_failed"] += 1
            return None

    async def send_message_and_wait_reply(self, message_type: MessageType, sender: str, receiver: str,
                                         payload: Dict[str, Any], timeout: float = 30.0,
                                         priority: MessagePriority = MessagePriority.NORMAL) -> Optional[MCPMessage]:
        """إرسال رسالة والانتظار للرد"""
        try:
            message_id = await self.send_message(message_type, sender, receiver, payload, priority)
            
            if not message_id:
                return None
            
            # إنشاء Future للانتظار
            reply_future = asyncio.Future()
            self.pending_replies[message_id] = reply_future
            
            # إضافة reply_to للرسالة الأصلية
            if message_id in self.message_queue:
                for msg in self.message_queue:
                    if msg.id == message_id:
                        msg.reply_to = message_id
                        break
            
            # انتظار الرد مع timeout
            try:
                reply = await asyncio.wait_for(reply_future, timeout=timeout)
                return reply
            except asyncio.TimeoutError:
                logger.warning(f"⏰ انتهت مهلة انتظار الرد للرسالة: {message_id}")
                return None
            finally:
                # تنظيف
                if message_id in self.pending_replies:
                    del self.pending_replies[message_id]
                    
        except Exception as e:
            logger.error(f"❌ خطأ في إرسال الرسالة مع انتظار الرد: {e}")
            return None

    async def subscribe_to_message_type(self, component_id: str, message_type: MessageType):
        """الاشتراك في نوع رسالة معين"""
        if message_type.value not in self.subscriptions:
            self.subscriptions[message_type.value] = []
        
        if component_id not in self.subscriptions[message_type.value]:
            self.subscriptions[message_type.value].append(component_id)
            logger.info(f"📬 {component_id} اشترك في {message_type.value}")

    async def unsubscribe_from_message_type(self, component_id: str, message_type: MessageType):
        """إلغاء الاشتراك من نوع رسالة معين"""
        if message_type.value in self.subscriptions:
            if component_id in self.subscriptions[message_type.value]:
                self.subscriptions[message_type.value].remove(component_id)
                logger.info(f"📭 {component_id} ألغى الاشتراك من {message_type.value}")

    async def set_message_handler(self, message_type: MessageType, handler: Callable):
        """تعيين معالج رسائل مخصص"""
        self.message_handlers[message_type.value] = handler
        logger.info(f"🔧 تم تعيين معالج مخصص لـ {message_type.value}")

    async def _process_messages(self):
        """معالج الرسائل الرئيسي"""
        logger.info("🔄 بدء معالج الرسائل...")
        
        while self.is_active:
            try:
                if self.message_queue:
                    # أخذ الرسالة الأولى (الأعلى أولوية)
                    message = self.message_queue.pop(0)
                    
                    # معالجة الرسالة
                    await self._deliver_message(message)
                    
                    # إضافة للتاريخ
                    self.message_history.append(message)
                    
                    # الاحتفاظ بآخر 1000 رسالة فقط
                    if len(self.message_history) > 1000:
                        self.message_history = self.message_history[-1000:]
                
                else:
                    # انتظار قصير إذا لم تكن هناك رسائل
                    await asyncio.sleep(0.01)
                    
            except Exception as e:
                logger.error(f"❌ خطأ في معالج الرسائل: {e}")
                await asyncio.sleep(0.1)

    async def _deliver_message(self, message: MCPMessage):
        """توصيل الرسالة للمستقبل"""
        try:
            # التحقق من وجود المستقبل
            if message.receiver not in self.registered_components:
                logger.warning(f"⚠️ المستقبل غير موجود: {message.receiver}")
                self.stats["messages_failed"] += 1
                return
            
            # تحديث إحصائيات التسليم
            self.stats["messages_delivered"] += 1
            
            # حساب زمن الاستجابة
            latency = (datetime.now() - message.timestamp).total_seconds()
            self.stats["average_latency"] = (
                (self.stats["average_latency"] * (self.stats["messages_delivered"] - 1) + latency)
                / self.stats["messages_delivered"]
            )
            
            # التحقق من وجود معالج مخصص
            if message.type.value in self.message_handlers:
                handler = self.message_handlers[message.type.value]
                await handler(message)
            
            # إرسال للاشتراكات إذا كان نوع broadcast
            if message.receiver == "broadcast":
                await self._broadcast_message(message)
            
            # التحقق من وجود رد مطلوب
            if message.reply_to and message.reply_to in self.pending_replies:
                future = self.pending_replies[message.reply_to]
                if not future.done():
                    future.set_result(message)
            
            logger.info(f"📨 تم توصيل الرسالة {message.id} إلى {message.receiver}")
            
        except Exception as e:
            logger.error(f"❌ خطأ في توصيل الرسالة {message.id}: {e}")
            self.stats["messages_failed"] += 1

    async def _broadcast_message(self, message: MCPMessage):
        """بث الرسالة لجميع المشتركين"""
        if message.type.value in self.subscriptions:
            subscribers = self.subscriptions[message.type.value]
            
            for subscriber in subscribers:
                if subscriber != message.sender:  # عدم إرسال للمرسل
                    # إنشاء نسخة من الرسالة للمشترك
                    broadcast_message = MCPMessage(
                        id=str(uuid.uuid4()),
                        type=message.type,
                        priority=message.priority,
                        sender=message.sender,
                        receiver=subscriber,
                        payload=message.payload.copy(),
                        context=message.context.copy(),
                        timestamp=datetime.now(),
                        correlation_id=message.correlation_id
                    )
                    
                    await self._deliver_message(broadcast_message)

    async def _broadcast_component_registration(self, component_info: ComponentInfo):
        """بث تسجيل مكون جديد"""
        await self.send_message(
            MessageType.SYSTEM_STATUS,
            "mcp_channel",
            "broadcast",
            {
                "event": "component_registered",
                "component": asdict(component_info)
            },
            MessagePriority.NORMAL
        )

    async def _broadcast_component_unregistration(self, component_id: str):
        """بث إلغاء تسجيل مكون"""
        await self.send_message(
            MessageType.SYSTEM_STATUS,
            "mcp_channel",
            "broadcast",
            {
                "event": "component_unregistered",
                "component_id": component_id
            },
            MessagePriority.NORMAL
        )

    async def _enrich_message_context(self, message: MCPMessage):
        """إثراء رسالة بالسياق"""
        # إضافة معلومات النظام
        message.context.update({
            "channel_id": self.channel_id,
            "active_components": len(self.registered_components),
            "queue_size": len(self.message_queue),
            "system_time": datetime.now().isoformat()
        })
        
        # إضافة سياق المرسل إذا كان مسجلاً
        if message.sender in self.registered_components:
            sender_info = self.registered_components[message.sender]
            message.context["sender_info"] = {
                "type": sender_info.component_type,
                "capabilities": sender_info.capabilities,
                "status": sender_info.status
            }

    async def _monitor_components(self):
        """مراقب المكونات"""
        logger.info("👁️ بدء مراقب المكونات...")
        
        while self.is_active:
            try:
                current_time = datetime.now()
                
                # فحص المكونات غير النشطة
                inactive_components = []
                
                for component_id, component_info in self.registered_components.items():
                    # إذا لم يتم رؤية المكون لأكثر من 60 ثانية
                    if (current_time - component_info.last_seen).total_seconds() > 60:
                        inactive_components.append(component_id)
                
                # إزالة المكونات غير النشطة
                for component_id in inactive_components:
                    logger.warning(f"⚠️ المكون غير نشط: {component_id}")
                    await self.unregister_component(component_id)
                
                # انتظار قبل الفحص التالي
                await asyncio.sleep(30)  # فحص كل 30 ثانية
                
            except Exception as e:
                logger.error(f"❌ خطأ في مراقب المكونات: {e}")
                await asyncio.sleep(5)

    async def update_component_heartbeat(self, component_id: str):
        """تحديث نبضة المكون"""
        if component_id in self.registered_components:
            self.registered_components[component_id].last_seen = datetime.now()

    async def get_channel_status(self) -> Dict[str, Any]:
        """الحصول على حالة القناة"""
        return {
            "channel_id": self.channel_id,
            "is_active": self.is_active,
            "registered_components": len(self.registered_components),
            "message_queue_size": len(self.message_queue),
            "message_history_size": len(self.message_history),
            "stats": self.stats.copy(),
            "subscriptions": {k: len(v) for k, v in self.subscriptions.items()},
            "context_store_size": len(self.context_store)
        }

    async def get_component_info(self, component_id: str) -> Optional[ComponentInfo]:
        """الحصول على معلومات مكون"""
        return self.registered_components.get(component_id)

    async def get_message_history(self, limit: int = 100) -> List[MCPMessage]:
        """الحصول على تاريخ الرسائل"""
        return self.message_history[-limit:] if self.message_history else []

    async def store_context(self, key: str, value: Any):
        """تخزين سياق"""
        self.context_store[key] = {
            "value": value,
            "timestamp": datetime.now().isoformat()
        }
        
        # إضافة للتاريخ
        self.context_history.append({
            "key": key,
            "value": value,
            "timestamp": datetime.now().isoformat()
        })

    async def get_context(self, key: str) -> Optional[Any]:
        """الحصول على سياق"""
        if key in self.context_store:
            return self.context_store[key]["value"]
        return None

    async def shutdown(self):
        """إغلاق القناة"""
        logger.info("🔄 إغلاق MCP Channel...")
        
        self.is_active = False
        
        # إلغاء المهام
        if hasattr(self, 'message_processor_task'):
            self.message_processor_task.cancel()
        
        if hasattr(self, 'component_monitor_task'):
            self.component_monitor_task.cancel()
        
        # إشعار جميع المكونات بالإغلاق
        await self.send_message(
            MessageType.SYSTEM_STATUS,
            "mcp_channel",
            "broadcast",
            {"event": "channel_shutdown"},
            MessagePriority.HIGH
        )
        
        logger.info("✅ تم إغلاق MCP Channel")

# مثال على الاستخدام
async def demo_mcp_channel():
    """عرض توضيحي لـ MCP Channel"""
    print("🎬 بدء العرض التوضيحي لـ MCP Channel")
    print("=" * 50)
    
    # إنشاء القناة
    channel = MCPChannel("demo_channel")
    await channel.initialize()
    
    # تسجيل مكونات تجريبية
    await channel.register_component(
        "auraos_hub",
        "learning_hub",
        ["task_management", "learning_coordination"],
        {"version": "0.1.0"}
    )
    
    await channel.register_component(
        "ai_agent_1",
        "ai_agent",
        ["code_generation", "problem_solving"],
        {"specialization": "programming"}
    )
    
    # الاشتراك في أنواع الرسائل
    await channel.subscribe_to_message_type("ai_agent_1", MessageType.TASK_ASSIGNMENT)
    await channel.subscribe_to_message_type("auraos_hub", MessageType.TASK_RESULT)
    
    # إرسال رسالة تجريبية
    message_id = await channel.send_message(
        MessageType.TASK_ASSIGNMENT,
        "auraos_hub",
        "ai_agent_1",
        {
            "task_id": "task_001",
            "description": "كتابة دالة لحساب الأعداد الأولية",
            "context": {"language": "python", "level": "intermediate"}
        },
        MessagePriority.HIGH
    )
    
    print(f"📤 تم إرسال الرسالة: {message_id}")
    
    # انتظار قصير لمحاكاة المعالجة
    await asyncio.sleep(1)
    
    # إرسال نتيجة المهمة
    await channel.send_message(
        MessageType.TASK_RESULT,
        "ai_agent_1",
        "auraos_hub",
        {
            "task_id": "task_001",
            "result": {"code": "def prime_numbers(n): ...", "confidence": 0.85},
            "status": "completed"
        },
        MessagePriority.NORMAL,
        correlation_id=message_id
    )
    
    # عرض حالة القناة
    status = await channel.get_channel_status()
    print(f"\n📊 حالة القناة:")
    for key, value in status.items():
        print(f"   {key}: {value}")
    
    # عرض تاريخ الرسائل
    history = await channel.get_message_history(5)
    print(f"\n📜 آخر 5 رسائل:")
    for msg in history:
        print(f"   {msg.id}: {msg.type.value} من {msg.sender} إلى {msg.receiver}")
    
    await channel.shutdown()
    print("\n🎉 انتهى العرض التوضيحي!")

if __name__ == "__main__":
    asyncio.run(demo_mcp_channel())
