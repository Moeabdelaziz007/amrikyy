#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Docker MCP Agent - وكيل Docker لإدارة الحاويات
تحويل docker إلى عضو ذكي في Learning Hub
"""

import asyncio
import json
import sys
import os
import subprocess
from datetime import datetime
from typing import Dict, List, Any, Optional
from pathlib import Path

# إضافة المسار للاستيراد
sys.path.append(str(Path(__file__).parent))

from mcp_agent_template import MCPAgentBase, MCPAgentManifest

class DockerAgent(MCPAgentBase):
    """
    وكيل Docker لإدارة الحاويات والصور
    """
    
    def __init__(self, manifest_path: str):
        super().__init__(manifest_path)
        self.supported_commands = [
            "build", "run", "start", "stop", "restart", "kill", "rm", "rmi",
            "ps", "images", "logs", "exec", "inspect", "stats", "pull", "push",
            "tag", "commit", "save", "load", "network", "volume", "compose"
        ]
        self.common_workflows = {
            "build_and_run": "build image and run container",
            "container_lifecycle": "start, stop, restart container",
            "image_management": "pull, build, push images",
            "container_monitoring": "inspect, logs, stats",
            "cleanup_resources": "remove containers and images"
        }
    
    async def _build_cli_command(self, command_name: str, params: Dict[str, Any], command_config: Dict[str, Any]) -> List[str]:
        """بناء أمر Docker"""
        try:
            command = ["docker"]
            
            # إضافة الأمر الأساسي
            command.append(command_name)
            
            # معالجة الأوامر المختلفة
            if command_name == "build":
                dockerfile = params.get("dockerfile", "Dockerfile")
                tag = params.get("tag", "")
                context = params.get("context", ".")
                
                if tag:
                    command.extend(["-t", tag])
                
                # إضافة خيارات إضافية
                if params.get("no_cache", False):
                    command.append("--no-cache")
                if params.get("pull", False):
                    command.append("--pull")
                if params.get("build_arg"):
                    for key, value in params["build_arg"].items():
                        command.extend(["--build-arg", f"{key}={value}"])
                
                command.append(context)
            
            elif command_name == "run":
                image = params.get("image", "")
                if image:
                    command.append(image)
                
                # إضافة خيارات إضافية
                if params.get("detached", False):
                    command.append("-d")
                if params.get("interactive", False):
                    command.append("-i")
                if params.get("tty", False):
                    command.append("-t")
                if params.get("name"):
                    command.extend(["--name", params["name"]])
                if params.get("port"):
                    for port_mapping in params["port"]:
                        command.extend(["-p", port_mapping])
                if params.get("volume"):
                    for volume_mapping in params["volume"]:
                        command.extend(["-v", volume_mapping])
                if params.get("env"):
                    for key, value in params["env"].items():
                        command.extend(["-e", f"{key}={value}"])
                if params.get("workdir"):
                    command.extend(["-w", params["workdir"]])
                if params.get("user"):
                    command.extend(["-u", params["user"]])
                
                # إضافة الأمر
                if params.get("command"):
                    command.append(params["command"])
            
            elif command_name in ["start", "stop", "restart", "kill"]:
                container = params.get("container", "")
                if container:
                    command.append(container)
            
            elif command_name == "rm":
                containers = params.get("containers", [])
                if isinstance(containers, list):
                    command.extend(containers)
                else:
                    command.append(containers)
                
                # إضافة خيارات إضافية
                if params.get("force", False):
                    command.append("-f")
                if params.get("volumes", False):
                    command.append("-v")
            
            elif command_name == "rmi":
                images = params.get("images", [])
                if isinstance(images, list):
                    command.extend(images)
                else:
                    command.append(images)
                
                # إضافة خيارات إضافية
                if params.get("force", False):
                    command.append("-f")
            
            elif command_name == "ps":
                # إضافة خيارات إضافية
                if params.get("all", False):
                    command.append("-a")
                if params.get("latest", False):
                    command.append("-l")
                if params.get("quiet", False):
                    command.append("-q")
                if params.get("format"):
                    command.extend(["--format", params["format"]])
            
            elif command_name == "images":
                # إضافة خيارات إضافية
                if params.get("all", False):
                    command.append("-a")
                if params.get("quiet", False):
                    command.append("-q")
                if params.get("format"):
                    command.extend(["--format", params["format"]])
            
            elif command_name == "logs":
                container = params.get("container", "")
                if container:
                    command.append(container)
                
                # إضافة خيارات إضافية
                if params.get("follow", False):
                    command.append("-f")
                if params.get("timestamps", False):
                    command.append("-t")
                if params.get("tail"):
                    command.extend(["--tail", str(params["tail"])])
                if params.get("since"):
                    command.extend(["--since", params["since"]])
            
            elif command_name == "exec":
                container = params.get("container", "")
                if container:
                    command.append(container)
                
                # إضافة خيارات إضافية
                if params.get("interactive", False):
                    command.append("-i")
                if params.get("tty", False):
                    command.append("-t")
                if params.get("user"):
                    command.extend(["-u", params["user"]])
                if params.get("workdir"):
                    command.extend(["-w", params["workdir"]])
                
                # إضافة الأمر
                if params.get("command"):
                    command.append(params["command"])
            
            elif command_name == "inspect":
                resource = params.get("resource", "")
                if resource:
                    command.append(resource)
                
                # إضافة خيارات إضافية
                if params.get("format"):
                    command.extend(["--format", params["format"]])
                if params.get("type"):
                    command.extend(["--type", params["type"]])
            
            elif command_name == "stats":
                # إضافة خيارات إضافية
                if params.get("all", False):
                    command.append("-a")
                if params.get("no_stream", False):
                    command.append("--no-stream")
                if params.get("format"):
                    command.extend(["--format", params["format"]])
            
            elif command_name == "pull":
                image = params.get("image", "")
                if image:
                    command.append(image)
                
                # إضافة خيارات إضافية
                if params.get("all_tags", False):
                    command.append("-a")
                if params.get("platform"):
                    command.extend(["--platform", params["platform"]])
            
            elif command_name == "push":
                image = params.get("image", "")
                if image:
                    command.append(image)
            
            elif command_name == "tag":
                source = params.get("source", "")
                target = params.get("target", "")
                if source and target:
                    command.extend([source, target])
            
            elif command_name == "commit":
                container = params.get("container", "")
                image = params.get("image", "")
                if container and image:
                    command.extend([container, image])
                
                # إضافة خيارات إضافية
                if params.get("message"):
                    command.extend(["-m", params["message"]])
                if params.get("author"):
                    command.extend(["-a", params["author"]])
            
            elif command_name == "save":
                image = params.get("image", "")
                output = params.get("output", "")
                if image:
                    command.append(image)
                if output:
                    command.extend(["-o", output])
            
            elif command_name == "load":
                input_file = params.get("input", "")
                if input_file:
                    command.extend(["-i", input_file])
            
            elif command_name == "network":
                action = params.get("action", "ls")
                command.append(action)
                
                if action == "create":
                    name = params.get("name", "")
                    if name:
                        command.append(name)
                elif action == "rm":
                    network = params.get("network", "")
                    if network:
                        command.append(network)
            
            elif command_name == "volume":
                action = params.get("action", "ls")
                command.append(action)
                
                if action == "create":
                    name = params.get("name", "")
                    if name:
                        command.append(name)
                elif action == "rm":
                    volume = params.get("volume", "")
                    if volume:
                        command.append(volume)
            
            elif command_name == "compose":
                action = params.get("action", "up")
                command.append(action)
                
                # إضافة خيارات إضافية
                if params.get("detached", False):
                    command.append("-d")
                if params.get("build", False):
                    command.append("--build")
                if params.get("file"):
                    command.extend(["-f", params["file"]])
            
            return command
            
        except Exception as e:
            logger.error(f"❌ خطأ في بناء أمر Docker: {e}")
            raise
    
    async def _process_result(self, result: Dict[str, Any], command_config: Dict[str, Any]) -> Dict[str, Any]:
        """معالجة نتيجة Docker"""
        try:
            output = result["stdout"].strip()
            error = result["stderr"].strip()
            
            # تحليل النتيجة
            parsed_output = self._parse_docker_output(output, command_config.get("command", ""))
            
            # تحليل الأخطاء
            error_analysis = self._analyze_docker_error(error)
            
            processed_result = {
                "success": result["returncode"] == 0,
                "output": output,
                "parsed_output": parsed_output,
                "error": error if error else None,
                "error_analysis": error_analysis,
                "command_executed": command_config.get("command", ""),
                "execution_time": datetime.now().isoformat()
            }
            
            return processed_result
            
        except Exception as e:
            logger.error(f"❌ خطأ في معالجة النتيجة: {e}")
            return {
                "success": False,
                "error": str(e),
                "raw_output": result["stdout"],
                "error_output": result["stderr"]
            }
    
    def _parse_docker_output(self, output: str, command: str) -> Dict[str, Any]:
        """تحليل ناتج Docker"""
        parsed = {
            "raw_output": output,
            "command": command,
            "analysis": {}
        }
        
        try:
            if command == "ps":
                parsed["analysis"] = self._parse_ps_output(output)
            elif command == "images":
                parsed["analysis"] = self._parse_images_output(output)
            elif command == "inspect":
                parsed["analysis"] = self._parse_inspect_output(output)
            elif command == "stats":
                parsed["analysis"] = self._parse_stats_output(output)
            else:
                parsed["analysis"] = {"type": "general", "lines": output.split('\n') if output else []}
        
        except Exception as e:
            logger.warning(f"⚠️ خطأ في تحليل ناتج Docker: {e}")
            parsed["analysis"] = {"error": str(e)}
        
        return parsed
    
    def _parse_ps_output(self, output: str) -> Dict[str, Any]:
        """تحليل ناتج docker ps"""
        analysis = {
            "type": "ps",
            "containers": [],
            "total_containers": 0
        }
        
        lines = output.split('\n')
        if len(lines) < 2:
            return analysis
        
        # تحليل العنوان
        header = lines[0]
        columns = header.split()
        
        # تحليل البيانات
        for line in lines[1:]:
            line = line.strip()
            if not line:
                continue
            
            parts = line.split()
            if len(parts) >= len(columns):
                container = {}
                for i, column in enumerate(columns):
                    if i < len(parts):
                        container[column.lower()] = parts[i]
                
                analysis["containers"].append(container)
        
        analysis["total_containers"] = len(analysis["containers"])
        return analysis
    
    def _parse_images_output(self, output: str) -> Dict[str, Any]:
        """تحليل ناتج docker images"""
        analysis = {
            "type": "images",
            "images": [],
            "total_images": 0
        }
        
        lines = output.split('\n')
        if len(lines) < 2:
            return analysis
        
        # تحليل العنوان
        header = lines[0]
        columns = header.split()
        
        # تحليل البيانات
        for line in lines[1:]:
            line = line.strip()
            if not line:
                continue
            
            parts = line.split()
            if len(parts) >= len(columns):
                image = {}
                for i, column in enumerate(columns):
                    if i < len(parts):
                        image[column.lower()] = parts[i]
                
                analysis["images"].append(image)
        
        analysis["total_images"] = len(analysis["images"])
        return analysis
    
    def _parse_inspect_output(self, output: str) -> Dict[str, Any]:
        """تحليل ناتج docker inspect"""
        analysis = {
            "type": "inspect",
            "data": {}
        }
        
        try:
            # محاولة تحليل JSON
            if output.strip().startswith('['):
                data = json.loads(output)
                if isinstance(data, list) and len(data) > 0:
                    analysis["data"] = data[0]
            elif output.strip().startswith('{'):
                analysis["data"] = json.loads(output)
        except json.JSONDecodeError:
            analysis["data"] = {"raw_output": output}
        
        return analysis
    
    def _parse_stats_output(self, output: str) -> Dict[str, Any]:
        """تحليل ناتج docker stats"""
        analysis = {
            "type": "stats",
            "containers": [],
            "total_containers": 0
        }
        
        lines = output.split('\n')
        if len(lines) < 2:
            return analysis
        
        # تحليل العنوان
        header = lines[0]
        columns = header.split()
        
        # تحليل البيانات
        for line in lines[1:]:
            line = line.strip()
            if not line:
                continue
            
            parts = line.split()
            if len(parts) >= len(columns):
                container = {}
                for i, column in enumerate(columns):
                    if i < len(parts):
                        container[column.lower()] = parts[i]
                
                analysis["containers"].append(container)
        
        analysis["total_containers"] = len(analysis["containers"])
        return analysis
    
    def _analyze_docker_error(self, error: str) -> Dict[str, Any]:
        """تحليل أخطاء Docker"""
        if not error:
            return {"has_error": False}
        
        error_analysis = {
            "has_error": True,
            "error_type": "unknown",
            "suggestion": None,
            "common_solutions": []
        }
        
        error_lower = error.lower()
        
        if "docker daemon" in error_lower and "not running" in error_lower:
            error_analysis["error_type"] = "daemon_not_running"
            error_analysis["suggestion"] = "تأكد من تشغيل Docker daemon"
            error_analysis["common_solutions"] = ["sudo systemctl start docker", "sudo service docker start"]
        
        elif "permission denied" in error_lower:
            error_analysis["error_type"] = "permission_denied"
            error_analysis["suggestion"] = "تحقق من الصلاحيات أو استخدم sudo"
            error_analysis["common_solutions"] = ["sudo docker", "sudo usermod -aG docker $USER"]
        
        elif "no such container" in error_lower:
            error_analysis["error_type"] = "container_not_found"
            error_analysis["suggestion"] = "تأكد من وجود الحاوية أو استخدم docker ps لرؤية الحاويات المتاحة"
            error_analysis["common_solutions"] = ["docker ps -a", "docker run <image>"]
        
        elif "no such image" in error_lower:
            error_analysis["error_type"] = "image_not_found"
            error_analysis["suggestion"] = "تأكد من وجود الصورة أو قم بسحبها من Docker Hub"
            error_analysis["common_solutions"] = ["docker pull <image>", "docker images"]
        
        elif "port is already allocated" in error_lower:
            error_analysis["error_type"] = "port_in_use"
            error_analysis["suggestion"] = "البورت مستخدم بالفعل، جرب بورت آخر"
            error_analysis["common_solutions"] = ["docker ps", "netstat -tulpn | grep <port>", "docker run -p <new_port>:<container_port>"]
        
        elif "container is not running" in error_lower:
            error_analysis["error_type"] = "container_not_running"
            error_analysis["suggestion"] = "الحاوية غير متوقفة، قم بتشغيلها أولاً"
            error_analysis["common_solutions"] = ["docker start <container>", "docker run <image>"]
        
        elif "dockerfile not found" in error_lower:
            error_analysis["error_type"] = "dockerfile_not_found"
            error_analysis["suggestion"] = "تأكد من وجود Dockerfile في المجلد المحدد"
            error_analysis["common_solutions"] = ["ls -la", "docker build -f <dockerfile_path> ."]
        
        return error_analysis
    
    async def build_image(self, dockerfile: str = "Dockerfile", tag: str = "", context: str = ".") -> Dict[str, Any]:
        """بناء صورة Docker"""
        try:
            result = await self.execute_command("build", {
                "dockerfile": dockerfile,
                "tag": tag,
                "context": context
            })
            
            return result
            
        except Exception as e:
            logger.error(f"❌ خطأ في بناء الصورة: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    async def run_container(self, image: str, **kwargs) -> Dict[str, Any]:
        """تشغيل حاوية Docker"""
        try:
            result = await self.execute_command("run", {
                "image": image,
                **kwargs
            })
            
            return result
            
        except Exception as e:
            logger.error(f"❌ خطأ في تشغيل الحاوية: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    async def stop_container(self, container: str) -> Dict[str, Any]:
        """إيقاف حاوية Docker"""
        try:
            result = await self.execute_command("stop", {
                "container": container
            })
            
            return result
            
        except Exception as e:
            logger.error(f"❌ خطأ في إيقاف الحاوية: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    async def get_container_logs(self, container: str, **kwargs) -> Dict[str, Any]:
        """الحصول على سجلات الحاوية"""
        try:
            result = await self.execute_command("logs", {
                "container": container,
                **kwargs
            })
            
            return result
            
        except Exception as e:
            logger.error(f"❌ خطأ في الحصول على السجلات: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    async def execute_in_container(self, container: str, command: str, **kwargs) -> Dict[str, Any]:
        """تنفيذ أمر داخل الحاوية"""
        try:
            result = await self.execute_command("exec", {
                "container": container,
                "command": command,
                **kwargs
            })
            
            return result
            
        except Exception as e:
            logger.error(f"❌ خطأ في تنفيذ الأمر داخل الحاوية: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    async def inspect_resource(self, resource: str, **kwargs) -> Dict[str, Any]:
        """فحص مورد Docker"""
        try:
            result = await self.execute_command("inspect", {
                "resource": resource,
                **kwargs
            })
            
            return result
            
        except Exception as e:
            logger.error(f"❌ خطأ في فحص المورد: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    async def get_container_stats(self, **kwargs) -> Dict[str, Any]:
        """الحصول على إحصائيات الحاويات"""
        try:
            result = await self.execute_command("stats", kwargs)
            
            return result
            
        except Exception as e:
            logger.error(f"❌ خطأ في الحصول على الإحصائيات: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    async def get_agent_info(self) -> Dict[str, Any]:
        """الحصول على معلومات الوكيل"""
        base_info = await super().get_agent_info()
        
        base_info.update({
            "supported_commands": self.supported_commands,
            "common_workflows": list(self.common_workflows.keys()),
            "specialized_features": [
                "Container Management",
                "Image Building",
                "Resource Monitoring",
                "Network Management",
                "Volume Management",
                "Docker Compose Support"
            ]
        })
        
        return base_info

def create_docker_manifest():
    """إنشاء ملف تعريف Docker Agent"""
    manifest = MCPAgentManifest(
        agent_name="docker-agent",
        cli_tool="docker",
        description="وكيل Docker لإدارة الحاويات والصور"
    )
    
    # إضافة القدرات
    manifest.add_capability("container_management")
    manifest.add_capability("image_management")
    manifest.add_capability("resource_monitoring")
    manifest.add_capability("network_management")
    manifest.add_capability("volume_management")
    manifest.add_capability("docker_compose")
    
    # إضافة الأوامر
    manifest.add_command("build", {
        "description": "بناء صورة Docker",
        "parameters": [],
        "optional_parameters": ["dockerfile", "tag", "context", "no_cache", "pull", "build_arg"],
        "output_type": "build_result"
    })
    
    manifest.add_command("run", {
        "description": "تشغيل حاوية Docker",
        "parameters": ["image"],
        "optional_parameters": ["detached", "interactive", "tty", "name", "port", "volume", "env", "workdir", "user", "command"],
        "output_type": "run_result"
    })
    
    manifest.add_command("start", {
        "description": "تشغيل حاوية متوقفة",
        "parameters": ["container"],
        "optional_parameters": [],
        "output_type": "start_result"
    })
    
    manifest.add_command("stop", {
        "description": "إيقاف حاوية Docker",
        "parameters": ["container"],
        "optional_parameters": [],
        "output_type": "stop_result"
    })
    
    manifest.add_command("restart", {
        "description": "إعادة تشغيل حاوية Docker",
        "parameters": ["container"],
        "optional_parameters": [],
        "output_type": "restart_result"
    })
    
    manifest.add_command("kill", {
        "description": "إنهاء حاوية Docker",
        "parameters": ["container"],
        "optional_parameters": [],
        "output_type": "kill_result"
    })
    
    manifest.add_command("rm", {
        "description": "حذف حاوية Docker",
        "parameters": ["containers"],
        "optional_parameters": ["force", "volumes"],
        "output_type": "rm_result"
    })
    
    manifest.add_command("rmi", {
        "description": "حذف صورة Docker",
        "parameters": ["images"],
        "optional_parameters": ["force"],
        "output_type": "rmi_result"
    })
    
    manifest.add_command("ps", {
        "description": "عرض الحاويات",
        "parameters": [],
        "optional_parameters": ["all", "latest", "quiet", "format"],
        "output_type": "ps_result"
    })
    
    manifest.add_command("images", {
        "description": "عرض الصور",
        "parameters": [],
        "optional_parameters": ["all", "quiet", "format"],
        "output_type": "images_result"
    })
    
    manifest.add_command("logs", {
        "description": "عرض سجلات الحاوية",
        "parameters": ["container"],
        "optional_parameters": ["follow", "timestamps", "tail", "since"],
        "output_type": "logs_result"
    })
    
    manifest.add_command("exec", {
        "description": "تنفيذ أمر داخل الحاوية",
        "parameters": ["container", "command"],
        "optional_parameters": ["interactive", "tty", "user", "workdir"],
        "output_type": "exec_result"
    })
    
    manifest.add_command("inspect", {
        "description": "فحص مورد Docker",
        "parameters": ["resource"],
        "optional_parameters": ["format", "type"],
        "output_type": "inspect_result"
    })
    
    manifest.add_command("stats", {
        "description": "عرض إحصائيات الحاويات",
        "parameters": [],
        "optional_parameters": ["all", "no_stream", "format"],
        "output_type": "stats_result"
    })
    
    manifest.add_command("pull", {
        "description": "سحب صورة من Docker Hub",
        "parameters": ["image"],
        "optional_parameters": ["all_tags", "platform"],
        "output_type": "pull_result"
    })
    
    manifest.add_command("push", {
        "description": "دفع صورة إلى Docker Hub",
        "parameters": ["image"],
        "optional_parameters": [],
        "output_type": "push_result"
    })
    
    manifest.add_command("tag", {
        "description": "إنشاء علامة للصورة",
        "parameters": ["source", "target"],
        "optional_parameters": [],
        "output_type": "tag_result"
    })
    
    manifest.add_command("commit", {
        "description": "إنشاء صورة من حاوية",
        "parameters": ["container", "image"],
        "optional_parameters": ["message", "author"],
        "output_type": "commit_result"
    })
    
    manifest.add_command("save", {
        "description": "حفظ صورة إلى ملف",
        "parameters": ["image"],
        "optional_parameters": ["output"],
        "output_type": "save_result"
    })
    
    manifest.add_command("load", {
        "description": "تحميل صورة من ملف",
        "parameters": [],
        "optional_parameters": ["input"],
        "output_type": "load_result"
    })
    
    manifest.add_command("network", {
        "description": "إدارة الشبكات",
        "parameters": ["action"],
        "optional_parameters": ["name", "network"],
        "output_type": "network_result"
    })
    
    manifest.add_command("volume", {
        "description": "إدارة الأحجام",
        "parameters": ["action"],
        "optional_parameters": ["name", "volume"],
        "output_type": "volume_result"
    })
    
    manifest.add_command("compose", {
        "description": "إدارة Docker Compose",
        "parameters": ["action"],
        "optional_parameters": ["detached", "build", "file"],
        "output_type": "compose_result"
    })
    
    # إضافة مخططات الإدخال
    manifest.add_input_schema("docker_command", {
        "type": "object",
        "properties": {
            "command": {"type": "string", "enum": [
                "build", "run", "start", "stop", "restart", "kill", "rm", "rmi",
                "ps", "images", "logs", "exec", "inspect", "stats", "pull", "push",
                "tag", "commit", "save", "load", "network", "volume", "compose"
            ]},
            "parameters": {"type": "object"},
            "options": {"type": "object"}
        },
        "required": ["command"]
    })
    
    # إضافة مخططات الإخراج
    manifest.add_output_schema("docker_result", {
        "type": "object",
        "properties": {
            "success": {"type": "boolean"},
            "output": {"type": "string"},
            "parsed_output": {"type": "object"},
            "error": {"type": "string"},
            "error_analysis": {
                "type": "object",
                "properties": {
                    "has_error": {"type": "boolean"},
                    "error_type": {"type": "string"},
                    "suggestion": {"type": "string"},
                    "common_solutions": {"type": "array", "items": {"type": "string"}}
                }
            },
            "command_executed": {"type": "string"},
            "execution_time": {"type": "string"}
        }
    })
    
    # إضافة التبعيات
    manifest.add_dependency("docker")
    
    return manifest

# مثال على الاستخدام
async def demo_docker_agent():
    """عرض توضيحي لـ Docker Agent"""
    print("🎬 بدء العرض التوضيحي لـ Docker Agent")
    print("=" * 60)
    
    # إنشاء ملف التعريف
    print("\n📋 إنشاء ملف تعريف Docker Agent...")
    manifest = create_docker_manifest()
    
    manifest_path = "docker_agent_manifest.json"
    manifest.save(manifest_path)
    print(f"✅ تم حفظ ملف التعريف: {manifest_path}")
    
    # إنشاء الوكيل
    print("\n🤖 إنشاء Docker Agent...")
    docker_agent = DockerAgent(manifest_path)
    
    try:
        # تهيئة الوكيل
        await docker_agent.initialize()
        
        # اختبار عرض الحاويات
        print("\n📦 اختبار عرض الحاويات...")
        
        ps_result = await docker_agent.execute_command("ps", {"all": True})
        
        if ps_result["success"]:
            print("✅ تم عرض الحاويات بنجاح:")
            parsed = ps_result['result']['parsed_output']
            if 'analysis' in parsed:
                analysis = parsed['analysis']
                print(f"   عدد الحاويات: {analysis.get('total_containers', 0)}")
                containers = analysis.get('containers', [])
                if containers:
                    print(f"   أول حاوية: {containers[0]}")
        else:
            print(f"❌ فشل في عرض الحاويات: {ps_result.get('error', 'خطأ غير معروف')}")
        
        # اختبار عرض الصور
        print("\n🖼️ اختبار عرض الصور...")
        
        images_result = await docker_agent.execute_command("images", {})
        
        if images_result["success"]:
            print("✅ تم عرض الصور بنجاح:")
            parsed = images_result['result']['parsed_output']
            if 'analysis' in parsed:
                analysis = parsed['analysis']
                print(f"   عدد الصور: {analysis.get('total_images', 0)}")
                images = analysis.get('images', [])
                if images:
                    print(f"   أول صورة: {images[0]}")
        else:
            print(f"❌ فشل في عرض الصور: {images_result.get('error', 'خطأ غير معروف')}")
        
        # اختبار عرض الإحصائيات
        print("\n📊 اختبار عرض الإحصائيات...")
        
        stats_result = await docker_agent.execute_command("stats", {"no_stream": True})
        
        if stats_result["success"]:
            print("✅ تم عرض الإحصائيات بنجاح:")
            parsed = stats_result['result']['parsed_output']
            if 'analysis' in parsed:
                analysis = parsed['analysis']
                print(f"   عدد الحاويات النشطة: {analysis.get('total_containers', 0)}")
        else:
            print(f"❌ فشل في عرض الإحصائيات: {stats_result.get('error', 'خطأ غير معروف')}")
        
        # عرض معلومات الوكيل
        print("\n📊 معلومات Docker Agent:")
        agent_info = await docker_agent.get_agent_info()
        
        print(f"   الاسم: {agent_info['name']}")
        print(f"   الأداة CLI: {agent_info['cli_tool']}")
        print(f"   الأوامر المدعومة: {len(agent_info['supported_commands'])} أمر")
        print(f"   سير العمل الشائعة: {agent_info['common_workflows']}")
        print(f"   القدرات: {agent_info['capabilities']}")
        print(f"   الميزات المتخصصة: {agent_info['specialized_features']}")
        
    except Exception as e:
        print(f"❌ خطأ في العرض التوضيحي: {e}")
    
    finally:
        # إغلاق الوكيل
        await docker_agent.shutdown()
        
        # حذف ملف التعريف
        if os.path.exists(manifest_path):
            os.remove(manifest_path)
            print(f"🗑️ تم حذف ملف التعريف: {manifest_path}")
    
    print("\n🎉 انتهى العرض التوضيحي!")

if __name__ == "__main__":
    asyncio.run(demo_docker_agent())
