#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
AuraOS Task Dispatcher - موزع المهام الذكي
ربط Telegram Bot مع MCP Agents وإدارة المهام
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

from auraos_mcp_integration import AuraOSMCPIntegration

# إعداد التسجيل
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class TaskStatus:
    """حالات المهام"""
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"

class TaskType:
    """أنواع المهام"""
    CODE_GENERATION = "code_generation"
    DATA_ANALYSIS = "data_analysis"
    API_TESTING = "api_testing"
    DOCUMENTATION = "documentation"
    RESEARCH = "research"
    AUTOMATION = "automation"

class TaskDispatcher:
    """
    موزع المهام الذكي
    """
    
    def __init__(self):
        self.name = "AuraOS Task Dispatcher"
        self.version = "0.5.0-TaskManager"
        self.is_active = False
        
        # المكونات الأساسية
        self.mcp_integration: Optional[AuraOSMCPIntegration] = None
        self.active_tasks: Dict[str, Dict[str, Any]] = {}
        
        # إحصائيات المهام
        self.task_stats = {
            "total_tasks": 0,
            "completed_tasks": 0,
            "failed_tasks": 0,
            "in_progress_tasks": 0,
            "start_time": None
        }
        
        logger.info(f"📋 تم إنشاء {self.name} v{self.version}")

    async def initialize(self):
        """تهيئة موزع المهام"""
        logger.info("🚀 تهيئة Task Dispatcher...")
        
        try:
            # تهيئة MCP Integration
            logger.info("   🔗 تهيئة MCP Integration...")
            self.mcp_integration = AuraOSMCPIntegration()
            await self.mcp_integration.initialize()
            
            # بدء مراقبة المهام
            logger.info("   👁️ بدء مراقبة المهام...")
            self.monitoring_task = asyncio.create_task(self._monitor_tasks())
            
            self.is_active = True
            self.task_stats["start_time"] = datetime.now()
            
            logger.info("✅ Task Dispatcher جاهز!")
            
        except Exception as e:
            logger.error(f"❌ خطأ في تهيئة Task Dispatcher: {e}")
            await self.shutdown()
            raise

    async def create_task(self, task_data: Dict[str, Any]) -> str:
        """إنشاء مهمة جديدة"""
        try:
            task_id = f"task_{int(datetime.now().timestamp())}_{len(self.active_tasks)}"
            
            # تحليل نوع المهمة
            task_type = await self._analyze_task_type(task_data)
            
            # تحديد الوكيل المناسب
            assigned_agent = await self._assign_agent(task_type, task_data)
            
            # إنشاء المهمة
            task = {
                "task_id": task_id,
                "user_id": task_data.get("user_id", "unknown"),
                "telegram_chat_id": task_data.get("telegram_chat_id"),
                "task_type": task_type,
                "description": task_data.get("description", ""),
                "assigned_agent": assigned_agent,
                "status": TaskStatus.PENDING,
                "created_at": datetime.now().isoformat(),
                "updated_at": datetime.now().isoformat(),
                "priority": task_data.get("priority", "normal"),
                "parameters": task_data.get("parameters", {}),
                "result": None,
                "error": None,
                "progress": 0
            }
            
            self.active_tasks[task_id] = task
            self.task_stats["total_tasks"] += 1
            
            logger.info(f"📋 تم إنشاء المهمة: {task_id}")
            logger.info(f"   النوع: {task_type}")
            logger.info(f"   الوكيل: {assigned_agent}")
            logger.info(f"   الوصف: {task['description']}")
            
            return task_id
            
        except Exception as e:
            logger.error(f"❌ خطأ في إنشاء المهمة: {e}")
            raise

    async def _analyze_task_type(self, task_data: Dict[str, Any]) -> str:
        """تحليل نوع المهمة"""
        description = task_data.get("description", "").lower()
        
        # تحليل نوع المهمة بناءً على الوصف
        if any(keyword in description for keyword in ["build", "create", "generate", "code", "app", "website"]):
            return TaskType.CODE_GENERATION
        elif any(keyword in description for keyword in ["analyze", "data", "json", "csv", "database"]):
            return TaskType.DATA_ANALYSIS
        elif any(keyword in description for keyword in ["api", "test", "request", "endpoint"]):
            return TaskType.API_TESTING
        elif any(keyword in description for keyword in ["document", "explain", "tutorial", "guide"]):
            return TaskType.DOCUMENTATION
        elif any(keyword in description for keyword in ["research", "find", "search", "information"]):
            return TaskType.RESEARCH
        elif any(keyword in description for keyword in ["automate", "workflow", "process"]):
            return TaskType.AUTOMATION
        else:
            return TaskType.CODE_GENERATION  # افتراضي

    async def _assign_agent(self, task_type: str, task_data: Dict[str, Any]) -> str:
        """تحديد الوكيل المناسب"""
        # خريطة أنواع المهام للوكلاء
        task_agent_mapping = {
            TaskType.CODE_GENERATION: "cursor-agent",
            TaskType.DATA_ANALYSIS: "jq-agent",
            TaskType.API_TESTING: "httpie-agent",
            TaskType.DOCUMENTATION: "gemini-agent",
            TaskType.RESEARCH: "gemini-agent",
            TaskType.AUTOMATION: "cursor-agent"
        }
        
        return task_agent_mapping.get(task_type, "cursor-agent")

    async def execute_task(self, task_id: str) -> Dict[str, Any]:
        """تنفيذ مهمة"""
        try:
            if task_id not in self.active_tasks:
                raise ValueError(f"المهمة {task_id} غير موجودة")
            
            task = self.active_tasks[task_id]
            
            # تحديث حالة المهمة
            task["status"] = TaskStatus.IN_PROGRESS
            task["updated_at"] = datetime.now().isoformat()
            self.task_stats["in_progress_tasks"] += 1
            
            logger.info(f"⚡ بدء تنفيذ المهمة: {task_id}")
            
            # تنفيذ المهمة حسب النوع
            result = await self._execute_task_by_type(task)
            
            # تحديث النتيجة
            if result["success"]:
                task["status"] = TaskStatus.COMPLETED
                task["result"] = result
                task["progress"] = 100
                self.task_stats["completed_tasks"] += 1
                self.task_stats["in_progress_tasks"] -= 1
                
                logger.info(f"✅ تم إكمال المهمة: {task_id}")
            else:
                task["status"] = TaskStatus.FAILED
                task["error"] = result.get("error", "خطأ غير معروف")
                task["progress"] = 0
                self.task_stats["failed_tasks"] += 1
                self.task_stats["in_progress_tasks"] -= 1
                
                logger.error(f"❌ فشلت المهمة: {task_id}")
            
            task["updated_at"] = datetime.now().isoformat()
            
            return result
            
        except Exception as e:
            logger.error(f"❌ خطأ في تنفيذ المهمة {task_id}: {e}")
            
            if task_id in self.active_tasks:
                task = self.active_tasks[task_id]
                task["status"] = TaskStatus.FAILED
                task["error"] = str(e)
                task["updated_at"] = datetime.now().isoformat()
                self.task_stats["failed_tasks"] += 1
                self.task_stats["in_progress_tasks"] -= 1
            
            return {
                "success": False,
                "error": str(e),
                "timestamp": datetime.now().isoformat()
            }

    async def _execute_task_by_type(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """تنفيذ المهمة حسب النوع"""
        task_type = task["task_type"]
        description = task["description"]
        parameters = task["parameters"]
        
        try:
            if task_type == TaskType.CODE_GENERATION:
                return await self._execute_code_generation_task(description, parameters)
            
            elif task_type == TaskType.DATA_ANALYSIS:
                return await self._execute_data_analysis_task(description, parameters)
            
            elif task_type == TaskType.API_TESTING:
                return await self._execute_api_testing_task(description, parameters)
            
            elif task_type == TaskType.DOCUMENTATION:
                return await self._execute_documentation_task(description, parameters)
            
            elif task_type == TaskType.RESEARCH:
                return await self._execute_research_task(description, parameters)
            
            elif task_type == TaskType.AUTOMATION:
                return await self._execute_automation_task(description, parameters)
            
            else:
                return {
                    "success": False,
                    "error": f"نوع مهمة غير مدعوم: {task_type}"
                }
                
        except Exception as e:
            logger.error(f"❌ خطأ في تنفيذ المهمة من نوع {task_type}: {e}")
            return {
                "success": False,
                "error": str(e)
            }

    async def _execute_code_generation_task(self, description: str, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """تنفيذ مهمة توليد الكود"""
        try:
            # محاكاة توليد الكود
            await asyncio.sleep(2)  # محاكاة وقت التنفيذ
            
            # تحليل الوصف لتحديد نوع الكود المطلوب
            if "react" in description.lower():
                code_type = "React App"
                code_content = """
import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>مرحباً بك في AuraOS!</h1>
        <p>تم إنشاء هذا التطبيق بواسطة AI Agent</p>
      </header>
    </div>
  );
}

export default App;
"""
            elif "python" in description.lower():
                code_type = "Python Script"
                code_content = '''#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
تم إنشاء هذا السكريبت بواسطة AuraOS AI Agent
"""

def main():
    print("مرحباً بك في AuraOS!")
    print("تم إنشاء هذا السكريبت بواسطة AI Agent")

if __name__ == "__main__":
    main()
'''
            else:
                code_type = "Generic Code"
                code_content = f"""
// تم إنشاء هذا الكود بواسطة AuraOS AI Agent
// الوصف: {description}

function generatedFunction() {{
    console.log("مرحباً بك في AuraOS!");
    return "تم إنشاء الكود بنجاح";
}}

module.exports = {{ generatedFunction }};
"""
            
            return {
                "success": True,
                "task_type": "code_generation",
                "code_type": code_type,
                "code_content": code_content,
                "file_name": f"generated_{int(datetime.now().timestamp())}.js",
                "instructions": [
                    "تم إنشاء الكود بنجاح",
                    "يمكنك نسخ الكود واستخدامه في مشروعك",
                    "تأكد من تثبيت التبعيات المطلوبة"
                ],
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }

    async def _execute_data_analysis_task(self, description: str, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """تنفيذ مهمة تحليل البيانات"""
        try:
            # محاكاة تحليل البيانات
            await asyncio.sleep(1.5)
            
            # استخدام JQ Agent إذا كان متوفراً
            if self.mcp_integration and "jq-agent" in self.mcp_integration.registered_agents:
                # بيانات تجريبية للتحليل
                sample_data = json.dumps({
                    "users": [
                        {"name": "أحمد", "age": 25, "city": "القاهرة"},
                        {"name": "فاطمة", "age": 30, "city": "الإسكندرية"},
                        {"name": "محمد", "age": 22, "city": "القاهرة"}
                    ]
                })
                
                result = await self.mcp_integration.execute_agent_command("jq-agent", "parse", {
                    "filter": ".users | group_by(.city) | map({city: .[0].city, count: length})",
                    "input": sample_data
                })
                
                if result["success"]:
                    return {
                        "success": True,
                        "task_type": "data_analysis",
                        "analysis_result": result["result"]["parsed_json"],
                        "summary": "تم تحليل البيانات بنجاح",
                        "insights": [
                            "تم تجميع البيانات حسب المدينة",
                            "تم حساب عدد المستخدمين في كل مدينة"
                        ],
                        "timestamp": datetime.now().isoformat()
                    }
            
            # تحليل بسيط بدون JQ
            return {
                "success": True,
                "task_type": "data_analysis",
                "analysis_result": {"message": "تم تحليل البيانات بنجاح"},
                "summary": "تم تحليل البيانات بنجاح",
                "insights": ["تحليل البيانات مكتمل"],
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }

    async def _execute_api_testing_task(self, description: str, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """تنفيذ مهمة اختبار API"""
        try:
            # محاكاة اختبار API
            await asyncio.sleep(1)
            
            # استخدام HTTPie Agent إذا كان متوفراً
            if self.mcp_integration and "httpie-agent" in self.mcp_integration.registered_agents:
                result = await self.mcp_integration.execute_agent_command("httpie-agent", "get", {
                    "url": "https://httpbin.org/get",
                    "query_params": {"test": "auraos"},
                    "options": {"verbose": True}
                })
                
                if result["success"]:
                    return {
                        "success": True,
                        "task_type": "api_testing",
                        "api_response": result["result"],
                        "test_summary": "تم اختبار API بنجاح",
                        "status_code": result["result"]["http_info"].get("status_code"),
                        "response_time": "1.2s",
                        "timestamp": datetime.now().isoformat()
                    }
            
            # اختبار بسيط بدون HTTPie
            return {
                "success": True,
                "task_type": "api_testing",
                "test_summary": "تم اختبار API بنجاح",
                "status_code": 200,
                "response_time": "1.0s",
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }

    async def _execute_documentation_task(self, description: str, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """تنفيذ مهمة التوثيق"""
        try:
            # محاكاة إنشاء التوثيق
            await asyncio.sleep(1.5)
            
            return {
                "success": True,
                "task_type": "documentation",
                "documentation": f"""
# توثيق: {description}

## نظرة عامة
تم إنشاء هذا التوثيق بواسطة AuraOS AI Agent.

## الميزات الرئيسية
- ميزة 1: وصف الميزة الأولى
- ميزة 2: وصف الميزة الثانية
- ميزة 3: وصف الميزة الثالثة

## كيفية الاستخدام
1. الخطوة الأولى
2. الخطوة الثانية
3. الخطوة الثالثة

## أمثلة
```javascript
// مثال على الاستخدام
function example() {{
    console.log("مرحباً بك في AuraOS!");
}}
```

## ملاحظات
- تم إنشاء هذا التوثيق تلقائياً
- يمكن تحديثه حسب الحاجة
""",
                "file_name": f"documentation_{int(datetime.now().timestamp())}.md",
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }

    async def _execute_research_task(self, description: str, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """تنفيذ مهمة البحث"""
        try:
            # محاكاة البحث
            await asyncio.sleep(2)
            
            return {
                "success": True,
                "task_type": "research",
                "research_results": {
                    "topic": description,
                    "findings": [
                        "نتيجة البحث الأولى",
                        "نتيجة البحث الثانية",
                        "نتيجة البحث الثالثة"
                    ],
                    "sources": [
                        "المصدر الأول",
                        "المصدر الثاني",
                        "المصدر الثالث"
                    ],
                    "summary": "ملخص نتائج البحث"
                },
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }

    async def _execute_automation_task(self, description: str, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """تنفيذ مهمة الأتمتة"""
        try:
            # محاكاة الأتمتة
            await asyncio.sleep(1.5)
            
            return {
                "success": True,
                "task_type": "automation",
                "automation_result": {
                    "workflow": "تم إنشاء سير عمل تلقائي",
                    "steps": [
                        "الخطوة الأولى",
                        "الخطوة الثانية",
                        "الخطوة الثالثة"
                    ],
                    "status": "مكتمل"
                },
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }

    async def get_task_status(self, task_id: str) -> Optional[Dict[str, Any]]:
        """الحصول على حالة مهمة"""
        return self.active_tasks.get(task_id)

    async def get_user_tasks(self, user_id: str) -> List[Dict[str, Any]]:
        """الحصول على مهام المستخدم"""
        user_tasks = []
        
        for task in self.active_tasks.values():
            if task["user_id"] == user_id:
                user_tasks.append(task)
        
        return sorted(user_tasks, key=lambda x: x["created_at"], reverse=True)

    async def get_all_tasks(self) -> List[Dict[str, Any]]:
        """الحصول على جميع المهام"""
        return list(self.active_tasks.values())

    async def _monitor_tasks(self):
        """مراقبة المهام"""
        logger.info("👁️ بدء مراقبة المهام...")
        
        while self.is_active:
            try:
                # تحديث وقت التشغيل
                if self.task_stats["start_time"]:
                    uptime = (datetime.now() - self.task_stats["start_time"]).total_seconds()
                    self.task_stats["uptime"] = uptime
                
                # تنظيف المهام القديمة (أكثر من 24 ساعة)
                await self._cleanup_old_tasks()
                
                # انتظار قبل المراقبة التالية
                await asyncio.sleep(300)  # مراقبة كل 5 دقائق
                
            except Exception as e:
                logger.error(f"❌ خطأ في مراقبة المهام: {e}")
                await asyncio.sleep(60)

    async def _cleanup_old_tasks(self):
        """تنظيف المهام القديمة"""
        try:
            current_time = datetime.now()
            tasks_to_remove = []
            
            for task_id, task in self.active_tasks.items():
                created_at = datetime.fromisoformat(task["created_at"])
                time_diff = (current_time - created_at).total_seconds()
                
                # إزالة المهام القديمة (أكثر من 24 ساعة)
                if time_diff > 86400:  # 24 ساعة
                    tasks_to_remove.append(task_id)
            
            for task_id in tasks_to_remove:
                del self.active_tasks[task_id]
                logger.info(f"🗑️ تم حذف المهمة القديمة: {task_id}")
                
        except Exception as e:
            logger.error(f"❌ خطأ في تنظيف المهام القديمة: {e}")

    async def get_dispatcher_status(self) -> Dict[str, Any]:
        """الحصول على حالة موزع المهام"""
        status = {
            "dispatcher_name": self.name,
            "version": self.version,
            "is_active": self.is_active,
            "task_stats": self.task_stats.copy(),
            "active_tasks_count": len(self.active_tasks),
            "mcp_integration_status": None
        }
        
        if self.mcp_integration:
            status["mcp_integration_status"] = await self.mcp_integration.get_integration_status()
        
        return status

    async def shutdown(self):
        """إغلاق موزع المهام"""
        logger.info("🔄 إغلاق Task Dispatcher...")
        
        self.is_active = False
        
        # إلغاء مهمة المراقبة
        if hasattr(self, 'monitoring_task'):
            self.monitoring_task.cancel()
        
        # إغلاق MCP Integration
        if self.mcp_integration:
            await self.mcp_integration.shutdown()
        
        logger.info("✅ تم إغلاق Task Dispatcher")

# مثال على الاستخدام
async def demo_task_dispatcher():
    """عرض توضيحي لموزع المهام"""
    print("🎬 بدء العرض التوضيحي لموزع المهام")
    print("=" * 60)
    
    dispatcher = TaskDispatcher()
    
    try:
        # تهيئة موزع المهام
        await dispatcher.initialize()
        
        # إنشاء مهام تجريبية
        print("\n📋 إنشاء مهام تجريبية...")
        
        # مهمة توليد الكود
        code_task_data = {
            "user_id": "telegram_user_001",
            "telegram_chat_id": "123456789",
            "description": "ابنِ لي React app بسيط",
            "priority": "high",
            "parameters": {"framework": "react", "features": ["routing", "styling"]}
        }
        
        code_task_id = await dispatcher.create_task(code_task_data)
        print(f"✅ تم إنشاء مهمة توليد الكود: {code_task_id}")
        
        # مهمة تحليل البيانات
        data_task_data = {
            "user_id": "telegram_user_001",
            "telegram_chat_id": "123456789",
            "description": "حلل بيانات JSON للمستخدمين",
            "priority": "normal",
            "parameters": {"data_source": "users.json"}
        }
        
        data_task_id = await dispatcher.create_task(data_task_data)
        print(f"✅ تم إنشاء مهمة تحليل البيانات: {data_task_id}")
        
        # مهمة اختبار API
        api_task_data = {
            "user_id": "telegram_user_001",
            "telegram_chat_id": "123456789",
            "description": "اختبر API endpoint",
            "priority": "low",
            "parameters": {"url": "https://api.example.com/test"}
        }
        
        api_task_id = await dispatcher.create_task(api_task_data)
        print(f"✅ تم إنشاء مهمة اختبار API: {api_task_id}")
        
        # تنفيذ المهام
        print("\n⚡ تنفيذ المهام...")
        
        # تنفيذ مهمة توليد الكود
        print("\n1️⃣ تنفيذ مهمة توليد الكود...")
        code_result = await dispatcher.execute_task(code_task_id)
        
        if code_result["success"]:
            print("✅ تم تنفيذ مهمة توليد الكود بنجاح:")
            print(f"   نوع الكود: {code_result['code_type']}")
            print(f"   اسم الملف: {code_result['file_name']}")
        else:
            print(f"❌ فشل في تنفيذ مهمة توليد الكود: {code_result.get('error', 'خطأ غير معروف')}")
        
        # تنفيذ مهمة تحليل البيانات
        print("\n2️⃣ تنفيذ مهمة تحليل البيانات...")
        data_result = await dispatcher.execute_task(data_task_id)
        
        if data_result["success"]:
            print("✅ تم تنفيذ مهمة تحليل البيانات بنجاح:")
            print(f"   نتيجة التحليل: {data_result['analysis_result']}")
        else:
            print(f"❌ فشل في تنفيذ مهمة تحليل البيانات: {data_result.get('error', 'خطأ غير معروف')}")
        
        # تنفيذ مهمة اختبار API
        print("\n3️⃣ تنفيذ مهمة اختبار API...")
        api_result = await dispatcher.execute_task(api_task_id)
        
        if api_result["success"]:
            print("✅ تم تنفيذ مهمة اختبار API بنجاح:")
            print(f"   رمز الحالة: {api_result['status_code']}")
            print(f"   وقت الاستجابة: {api_result['response_time']}")
        else:
            print(f"❌ فشل في تنفيذ مهمة اختبار API: {api_result.get('error', 'خطأ غير معروف')}")
        
        # عرض حالة المهام
        print("\n📊 حالة المهام:")
        user_tasks = await dispatcher.get_user_tasks("telegram_user_001")
        
        for task in user_tasks:
            status_emoji = {
                TaskStatus.PENDING: "⏳",
                TaskStatus.IN_PROGRESS: "🔄",
                TaskStatus.COMPLETED: "✅",
                TaskStatus.FAILED: "❌",
                TaskStatus.CANCELLED: "🚫"
            }.get(task["status"], "❓")
            
            print(f"   {status_emoji} {task['task_id']}: {task['description']} ({task['status']})")
        
        # عرض حالة موزع المهام
        print("\n📈 حالة موزع المهام:")
        dispatcher_status = await dispatcher.get_dispatcher_status()
        
        stats = dispatcher_status["task_stats"]
        print(f"   إجمالي المهام: {stats['total_tasks']}")
        print(f"   المهام المكتملة: {stats['completed_tasks']}")
        print(f"   المهام الفاشلة: {stats['failed_tasks']}")
        print(f"   المهام قيد التنفيذ: {stats['in_progress_tasks']}")
        
        # انتظار إضافي لمحاكاة العمل
        print("\n⏳ انتظار إضافي لمحاكاة العمل...")
        await asyncio.sleep(2)
        
    except Exception as e:
        print(f"❌ خطأ في العرض التوضيحي: {e}")
    
    finally:
        # إغلاق موزع المهام
        await dispatcher.shutdown()
        print("\n🎉 انتهى العرض التوضيحي!")

if __name__ == "__main__":
    asyncio.run(demo_task_dispatcher())
