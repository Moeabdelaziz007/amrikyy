#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
MCP Agent Template - قالب أساسي لتحويل CLI Tools إلى MCP Agents
نظام موحد لتحويل أي أداة CLI إلى عضو ذكي في Learning Hub
"""

import asyncio
import json
import subprocess
import sys
import os
from datetime import datetime
from typing import Dict, List, Any, Optional, Union
from pathlib import Path
import logging

# إعداد التسجيل
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class MCPAgentManifest:
    """
    ملف تعريف MCP Agent
    """
    
    def __init__(self, agent_name: str, cli_tool: str, description: str):
        self.manifest = {
            "name": agent_name,
            "version": "1.0.0",
            "description": description,
            "cli_tool": cli_tool,
            "type": "mcp_agent",
            "capabilities": [],
            "commands": {},
            "inputs": {},
            "outputs": {},
            "dependencies": [],
            "created_at": datetime.now().isoformat(),
            "author": "AuraOS Learning Hub"
        }
    
    def add_capability(self, capability: str):
        """إضافة قدرة جديدة"""
        self.manifest["capabilities"].append(capability)
    
    def add_command(self, command_name: str, command_config: Dict[str, Any]):
        """إضافة أمر جديد"""
        self.manifest["commands"][command_name] = command_config
    
    def add_input_schema(self, input_name: str, schema: Dict[str, Any]):
        """إضافة مخطط الإدخال"""
        self.manifest["inputs"][input_name] = schema
    
    def add_output_schema(self, output_name: str, schema: Dict[str, Any]):
        """إضافة مخطط الإخراج"""
        self.manifest["outputs"][output_name] = schema
    
    def add_dependency(self, dependency: str):
        """إضافة تبعية"""
        self.manifest["dependencies"].append(dependency)
    
    def to_dict(self) -> Dict[str, Any]:
        """تحويل إلى قاموس"""
        return self.manifest
    
    def save(self, file_path: str):
        """حفظ الملف"""
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(self.manifest, f, indent=2, ensure_ascii=False)

class MCPAgentBase:
    """
    الكلاس الأساسي لـ MCP Agent
    """
    
    def __init__(self, manifest_path: str):
        self.manifest_path = manifest_path
        self.manifest = self._load_manifest()
        self.agent_name = self.manifest["name"]
        self.cli_tool = self.manifest["cli_tool"]
        self.is_active = False
        
        logger.info(f"🤖 تم إنشاء MCP Agent: {self.agent_name}")
    
    def _load_manifest(self) -> Dict[str, Any]:
        """تحميل ملف التعريف"""
        try:
            with open(self.manifest_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            logger.error(f"❌ خطأ في تحميل ملف التعريف: {e}")
            raise
    
    async def initialize(self):
        """تهيئة الوكيل"""
        try:
            logger.info(f"🚀 تهيئة {self.agent_name}...")
            
            # التحقق من وجود الأداة CLI
            await self._check_cli_tool()
            
            # تهيئة الوكيل
            await self._setup_agent()
            
            self.is_active = True
            logger.info(f"✅ {self.agent_name} جاهز للعمل!")
            
        except Exception as e:
            logger.error(f"❌ خطأ في تهيئة {self.agent_name}: {e}")
            raise
    
    async def _check_cli_tool(self):
        """التحقق من وجود الأداة CLI"""
        try:
            # محاولة تشغيل الأمر للتحقق من وجود الأداة
            result = await self._run_cli_command([self.cli_tool, "--version"])
            if result["returncode"] != 0:
                logger.warning(f"⚠️ الأداة {self.cli_tool} قد لا تكون مثبتة")
        except Exception as e:
            logger.warning(f"⚠️ لا يمكن التحقق من الأداة {self.cli_tool}: {e}")
    
    async def _run_cli_command(self, command: List[str], input_data: str = None) -> Dict[str, Any]:
        """تشغيل أمر CLI"""
        try:
            logger.info(f"⚡ تشغيل أمر: {' '.join(command)}")
            
            process = await asyncio.create_subprocess_exec(
                *command,
                stdin=asyncio.subprocess.PIPE if input_data else None,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            
            stdout, stderr = await process.communicate(
                input=input_data.encode() if input_data else None
            )
            
            result = {
                "returncode": process.returncode,
                "stdout": stdout.decode('utf-8'),
                "stderr": stderr.decode('utf-8'),
                "command": ' '.join(command),
                "timestamp": datetime.now().isoformat()
            }
            
            return result
            
        except Exception as e:
            logger.error(f"❌ خطأ في تشغيل الأمر: {e}")
            return {
                "returncode": -1,
                "stdout": "",
                "stderr": str(e),
                "command": ' '.join(command),
                "timestamp": datetime.now().isoformat()
            }
    
    async def _setup_agent(self):
        """إعداد الوكيل"""
        # يمكن تخصيص هذا في الوكيلات الفرعية
        pass
    
    async def execute_command(self, command_name: str, params: Dict[str, Any]) -> Dict[str, Any]:
        """تنفيذ أمر"""
        try:
            if command_name not in self.manifest["commands"]:
                raise ValueError(f"الأمر {command_name} غير مدعوم")
            
            command_config = self.manifest["commands"][command_name]
            
            # بناء الأمر CLI
            cli_command = await self._build_cli_command(command_name, params, command_config)
            
            # تشغيل الأمر
            result = await self._run_cli_command(cli_command, params.get("input"))
            
            # معالجة النتيجة
            processed_result = await self._process_result(result, command_config)
            
            return {
                "success": result["returncode"] == 0,
                "agent": self.agent_name,
                "command": command_name,
                "result": processed_result,
                "raw_output": result["stdout"],
                "error": result["stderr"] if result["returncode"] != 0 else None,
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"❌ خطأ في تنفيذ الأمر {command_name}: {e}")
            return {
                "success": False,
                "agent": self.agent_name,
                "command": command_name,
                "error": str(e),
                "timestamp": datetime.now().isoformat()
            }
    
    async def _build_cli_command(self, command_name: str, params: Dict[str, Any], command_config: Dict[str, Any]) -> List[str]:
        """بناء أمر CLI"""
        # يجب تخصيص هذا في الوكيلات الفرعية
        return [self.cli_tool]
    
    async def _process_result(self, result: Dict[str, Any], command_config: Dict[str, Any]) -> Dict[str, Any]:
        """معالجة النتيجة"""
        # يمكن تخصيص هذا في الوكيلات الفرعية
        return {
            "output": result["stdout"],
            "success": result["returncode"] == 0
        }
    
    async def get_agent_info(self) -> Dict[str, Any]:
        """الحصول على معلومات الوكيل"""
        return {
            "name": self.agent_name,
            "cli_tool": self.cli_tool,
            "capabilities": self.manifest["capabilities"],
            "commands": list(self.manifest["commands"].keys()),
            "is_active": self.is_active,
            "version": self.manifest["version"]
        }
    
    async def shutdown(self):
        """إغلاق الوكيل"""
        logger.info(f"🔄 إغلاق {self.agent_name}...")
        self.is_active = False
        logger.info(f"✅ تم إغلاق {self.agent_name}")

class MCPAgentRegistry:
    """
    سجل MCP Agents
    """
    
    def __init__(self):
        self.agents: Dict[str, MCPAgentBase] = {}
        self.registry_path = Path("mcp_agents_registry.json")
        
        logger.info("📋 تم إنشاء MCP Agent Registry")
    
    async def register_agent(self, agent: MCPAgentBase):
        """تسجيل وكيل جديد"""
        try:
            agent_name = agent.agent_name
            
            if agent_name in self.agents:
                logger.warning(f"⚠️ الوكيل {agent_name} مسجل بالفعل")
                return False
            
            # تهيئة الوكيل
            await agent.initialize()
            
            # تسجيل الوكيل
            self.agents[agent_name] = agent
            
            # حفظ السجل
            await self._save_registry()
            
            logger.info(f"✅ تم تسجيل الوكيل: {agent_name}")
            return True
            
        except Exception as e:
            logger.error(f"❌ خطأ في تسجيل الوكيل: {e}")
            return False
    
    async def unregister_agent(self, agent_name: str):
        """إلغاء تسجيل وكيل"""
        try:
            if agent_name not in self.agents:
                logger.warning(f"⚠️ الوكيل {agent_name} غير مسجل")
                return False
            
            # إغلاق الوكيل
            await self.agents[agent_name].shutdown()
            
            # إزالة الوكيل
            del self.agents[agent_name]
            
            # حفظ السجل
            await self._save_registry()
            
            logger.info(f"✅ تم إلغاء تسجيل الوكيل: {agent_name}")
            return True
            
        except Exception as e:
            logger.error(f"❌ خطأ في إلغاء تسجيل الوكيل: {e}")
            return False
    
    async def execute_agent_command(self, agent_name: str, command_name: str, params: Dict[str, Any]) -> Dict[str, Any]:
        """تنفيذ أمر وكيل"""
        try:
            if agent_name not in self.agents:
                return {
                    "success": False,
                    "error": f"الوكيل {agent_name} غير مسجل",
                    "timestamp": datetime.now().isoformat()
                }
            
            agent = self.agents[agent_name]
            result = await agent.execute_command(command_name, params)
            
            return result
            
        except Exception as e:
            logger.error(f"❌ خطأ في تنفيذ أمر الوكيل: {e}")
            return {
                "success": False,
                "error": str(e),
                "timestamp": datetime.now().isoformat()
            }
    
    async def get_registry_status(self) -> Dict[str, Any]:
        """الحصول على حالة السجل"""
        agents_info = {}
        
        for agent_name, agent in self.agents.items():
            agents_info[agent_name] = await agent.get_agent_info()
        
        return {
            "total_agents": len(self.agents),
            "active_agents": len([a for a in self.agents.values() if a.is_active]),
            "agents": agents_info,
            "timestamp": datetime.now().isoformat()
        }
    
    async def _save_registry(self):
        """حفظ السجل"""
        try:
            registry_data = {
                "agents": list(self.agents.keys()),
                "last_updated": datetime.now().isoformat()
            }
            
            with open(self.registry_path, 'w', encoding='utf-8') as f:
                json.dump(registry_data, f, indent=2, ensure_ascii=False)
                
        except Exception as e:
            logger.error(f"❌ خطأ في حفظ السجل: {e}")
    
    async def shutdown(self):
        """إغلاق السجل"""
        logger.info("🔄 إغلاق MCP Agent Registry...")
        
        for agent in self.agents.values():
            await agent.shutdown()
        
        self.agents.clear()
        logger.info("✅ تم إغلاق MCP Agent Registry")

# مثال على الاستخدام
async def demo_mcp_agent_template():
    """عرض توضيحي لقالب MCP Agent"""
    print("🎬 بدء العرض التوضيحي لقالب MCP Agent")
    print("=" * 60)
    
    # إنشاء ملف تعريف للوكيل
    print("\n📋 إنشاء ملف تعريف للوكيل...")
    
    manifest = MCPAgentManifest(
        agent_name="demo-agent",
        cli_tool="echo",
        description="وكيل تجريبي لعرض قالب MCP Agent"
    )
    
    manifest.add_capability("text_processing")
    manifest.add_capability("demo_functionality")
    
    manifest.add_command("echo", {
        "description": "طباعة النص",
        "parameters": ["text"],
        "output_type": "text"
    })
    
    manifest.add_input_schema("text", {
        "type": "string",
        "description": "النص المراد طباعته"
    })
    
    manifest.add_output_schema("result", {
        "type": "string",
        "description": "النص المطبوع"
    })
    
    # حفظ ملف التعريف
    manifest_path = "demo_agent_manifest.json"
    manifest.save(manifest_path)
    print(f"✅ تم حفظ ملف التعريف: {manifest_path}")
    
    # إنشاء وكيل تجريبي
    print("\n🤖 إنشاء وكيل تجريبي...")
    
    class DemoAgent(MCPAgentBase):
        async def _build_cli_command(self, command_name: str, params: Dict[str, Any], command_config: Dict[str, Any]) -> List[str]:
            if command_name == "echo":
                text = params.get("text", "Hello World")
                return [self.cli_tool, text]
            return [self.cli_tool]
    
    demo_agent = DemoAgent(manifest_path)
    
    # إنشاء السجل
    print("\n📋 إنشاء سجل الوكيلات...")
    registry = MCPAgentRegistry()
    
    # تسجيل الوكيل
    success = await registry.register_agent(demo_agent)
    
    if success:
        print("✅ تم تسجيل الوكيل التجريبي")
        
        # اختبار تنفيذ أمر
        print("\n⚡ اختبار تنفيذ أمر...")
        
        result = await registry.execute_agent_command(
            "demo-agent",
            "echo",
            {"text": "Hello from MCP Agent!"}
        )
        
        if result["success"]:
            print(f"✅ تم تنفيذ الأمر بنجاح:")
            print(f"   النتيجة: {result['result']['output']}")
        else:
            print(f"❌ فشل في تنفيذ الأمر: {result.get('error', 'خطأ غير معروف')}")
        
        # عرض حالة السجل
        print("\n📊 حالة سجل الوكيلات:")
        status = await registry.get_registry_status()
        
        print(f"   إجمالي الوكيلات: {status['total_agents']}")
        print(f"   الوكيلات النشطة: {status['active_agents']}")
        
        for agent_name, agent_info in status['agents'].items():
            print(f"   - {agent_name}: {agent_info['capabilities']}")
    
    else:
        print("❌ فشل في تسجيل الوكيل التجريبي")
    
    # تنظيف
    await registry.shutdown()
    
    # حذف ملف التعريف التجريبي
    if os.path.exists(manifest_path):
        os.remove(manifest_path)
        print(f"🗑️ تم حذف ملف التعريف التجريبي: {manifest_path}")
    
    print("\n🎉 انتهى العرض التوضيحي!")

if __name__ == "__main__":
    asyncio.run(demo_mcp_agent_template())
