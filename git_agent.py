#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Git MCP Agent - وكيل Git لإدارة التحكم في الإصدارات
تحويل git إلى عضو ذكي في Learning Hub
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

class GitAgent(MCPAgentBase):
    """
    وكيل Git لإدارة التحكم في الإصدارات
    """
    
    def __init__(self, manifest_path: str):
        super().__init__(manifest_path)
        self.supported_commands = [
            "clone", "add", "commit", "push", "pull", "merge", "branch", 
            "checkout", "status", "log", "diff", "reset", "revert", "tag"
        ]
        self.common_workflows = {
            "clone_repo": "clone repository",
            "create_branch": "create and checkout new branch",
            "commit_changes": "add, commit and push changes",
            "merge_branch": "merge branch into main",
            "sync_repo": "pull latest changes and push local changes"
        }
    
    async def _build_cli_command(self, command_name: str, params: Dict[str, Any], command_config: Dict[str, Any]) -> List[str]:
        """بناء أمر Git"""
        try:
            command = ["git"]
            
            # إضافة الأمر الأساسي
            command.append(command_name)
            
            # معالجة الأوامر المختلفة
            if command_name == "clone":
                url = params.get("url", "")
                directory = params.get("directory", "")
                if url:
                    command.append(url)
                if directory:
                    command.append(directory)
            
            elif command_name == "add":
                files = params.get("files", ["."])
                if isinstance(files, list):
                    command.extend(files)
                else:
                    command.append(files)
            
            elif command_name == "commit":
                message = params.get("message", "")
                if message:
                    command.extend(["-m", message])
                
                # إضافة خيارات إضافية
                if params.get("amend", False):
                    command.append("--amend")
                if params.get("no_verify", False):
                    command.append("--no-verify")
            
            elif command_name == "push":
                remote = params.get("remote", "origin")
                branch = params.get("branch", "")
                
                command.append(remote)
                if branch:
                    command.append(branch)
                
                # إضافة خيارات إضافية
                if params.get("force", False):
                    command.append("--force")
                if params.get("set_upstream", False):
                    command.append("--set-upstream")
            
            elif command_name == "pull":
                remote = params.get("remote", "origin")
                branch = params.get("branch", "")
                
                command.append(remote)
                if branch:
                    command.append(branch)
            
            elif command_name == "merge":
                branch = params.get("branch", "")
                if branch:
                    command.append(branch)
                
                # إضافة خيارات إضافية
                if params.get("no_ff", False):
                    command.append("--no-ff")
                if params.get("squash", False):
                    command.append("--squash")
            
            elif command_name == "branch":
                branch_name = params.get("name", "")
                action = params.get("action", "list")
                
                if action == "create":
                    command.append(branch_name)
                elif action == "delete":
                    command.extend(["-d", branch_name])
                elif action == "list":
                    # لا حاجة لإضافة أي شيء إضافي
                    pass
            
            elif command_name == "checkout":
                target = params.get("target", "")
                if target:
                    command.append(target)
                
                # إضافة خيارات إضافية
                if params.get("create_branch", False):
                    command.append("-b")
                    command.append(params.get("new_branch", ""))
            
            elif command_name == "status":
                # إضافة خيارات إضافية
                if params.get("short", False):
                    command.append("--short")
                if params.get("porcelain", False):
                    command.append("--porcelain")
            
            elif command_name == "log":
                # إضافة خيارات إضافية
                if params.get("oneline", False):
                    command.append("--oneline")
                if params.get("graph", False):
                    command.append("--graph")
                if params.get("decorate", False):
                    command.append("--decorate")
                
                limit = params.get("limit", 0)
                if limit > 0:
                    command.extend(["-n", str(limit)])
            
            elif command_name == "diff":
                # إضافة خيارات إضافية
                if params.get("staged", False):
                    command.append("--staged")
                if params.get("cached", False):
                    command.append("--cached")
            
            elif command_name == "reset":
                mode = params.get("mode", "mixed")
                commit = params.get("commit", "")
                
                command.append(f"--{mode}")
                if commit:
                    command.append(commit)
            
            elif command_name == "revert":
                commit = params.get("commit", "")
                if commit:
                    command.append(commit)
            
            elif command_name == "tag":
                tag_name = params.get("name", "")
                action = params.get("action", "list")
                
                if action == "create":
                    command.append(tag_name)
                    message = params.get("message", "")
                    if message:
                        command.extend(["-m", message])
                elif action == "delete":
                    command.extend(["-d", tag_name])
                elif action == "list":
                    # لا حاجة لإضافة أي شيء إضافي
                    pass
            
            return command
            
        except Exception as e:
            logger.error(f"❌ خطأ في بناء أمر Git: {e}")
            raise
    
    async def _process_result(self, result: Dict[str, Any], command_config: Dict[str, Any]) -> Dict[str, Any]:
        """معالجة نتيجة Git"""
        try:
            output = result["stdout"].strip()
            error = result["stderr"].strip()
            
            # تحليل النتيجة
            parsed_output = self._parse_git_output(output, command_config.get("command", ""))
            
            # تحليل الأخطاء
            error_analysis = self._analyze_git_error(error)
            
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
    
    def _parse_git_output(self, output: str, command: str) -> Dict[str, Any]:
        """تحليل ناتج Git"""
        parsed = {
            "raw_output": output,
            "command": command,
            "analysis": {}
        }
        
        try:
            if command == "status":
                parsed["analysis"] = self._parse_status_output(output)
            elif command == "log":
                parsed["analysis"] = self._parse_log_output(output)
            elif command == "branch":
                parsed["analysis"] = self._parse_branch_output(output)
            elif command == "diff":
                parsed["analysis"] = self._parse_diff_output(output)
            else:
                parsed["analysis"] = {"type": "general", "lines": output.split('\n') if output else []}
        
        except Exception as e:
            logger.warning(f"⚠️ خطأ في تحليل ناتج Git: {e}")
            parsed["analysis"] = {"error": str(e)}
        
        return parsed
    
    def _parse_status_output(self, output: str) -> Dict[str, Any]:
        """تحليل ناتج git status"""
        analysis = {
            "type": "status",
            "staged_files": [],
            "modified_files": [],
            "untracked_files": [],
            "deleted_files": [],
            "renamed_files": [],
            "clean": True
        }
        
        lines = output.split('\n')
        for line in lines:
            line = line.strip()
            if not line:
                continue
            
            if line.startswith('Changes to be committed:'):
                analysis["clean"] = False
            elif line.startswith('Changes not staged for commit:'):
                analysis["clean"] = False
            elif line.startswith('Untracked files:'):
                analysis["clean"] = False
            elif line.startswith('On branch'):
                analysis["current_branch"] = line.split('On branch ')[1].split()[0]
            elif line.startswith('nothing to commit'):
                analysis["clean"] = True
            
            # تحليل حالة الملفات
            if len(line) >= 2:
                status = line[:2]
                filename = line[3:].strip()
                
                if status[0] == 'A':
                    analysis["staged_files"].append(filename)
                elif status[0] == 'M':
                    analysis["modified_files"].append(filename)
                elif status[0] == 'D':
                    analysis["deleted_files"].append(filename)
                elif status[0] == 'R':
                    analysis["renamed_files"].append(filename)
                elif status[0] == '?':
                    analysis["untracked_files"].append(filename)
        
        return analysis
    
    def _parse_log_output(self, output: str) -> Dict[str, Any]:
        """تحليل ناتج git log"""
        analysis = {
            "type": "log",
            "commits": [],
            "total_commits": 0
        }
        
        lines = output.split('\n')
        current_commit = {}
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
            
            if line.startswith('commit '):
                if current_commit:
                    analysis["commits"].append(current_commit)
                current_commit = {
                    "hash": line.split()[1],
                    "message": "",
                    "author": "",
                    "date": ""
                }
            elif line.startswith('Author:'):
                current_commit["author"] = line.split('Author: ')[1]
            elif line.startswith('Date:'):
                current_commit["date"] = line.split('Date: ')[1]
            elif not line.startswith('commit ') and not line.startswith('Author:') and not line.startswith('Date:'):
                if current_commit["message"]:
                    current_commit["message"] += " " + line
                else:
                    current_commit["message"] = line
        
        if current_commit:
            analysis["commits"].append(current_commit)
        
        analysis["total_commits"] = len(analysis["commits"])
        return analysis
    
    def _parse_branch_output(self, output: str) -> Dict[str, Any]:
        """تحليل ناتج git branch"""
        analysis = {
            "type": "branch",
            "branches": [],
            "current_branch": None
        }
        
        lines = output.split('\n')
        for line in lines:
            line = line.strip()
            if not line:
                continue
            
            if line.startswith('*'):
                branch_name = line[2:].strip()
                analysis["branches"].append(branch_name)
                analysis["current_branch"] = branch_name
            else:
                analysis["branches"].append(line)
        
        return analysis
    
    def _parse_diff_output(self, output: str) -> Dict[str, Any]:
        """تحليل ناتج git diff"""
        analysis = {
            "type": "diff",
            "files_changed": 0,
            "insertions": 0,
            "deletions": 0,
            "files": []
        }
        
        lines = output.split('\n')
        current_file = None
        
        for line in lines:
            line = line.strip()
            if line.startswith('diff --git'):
                if current_file:
                    analysis["files"].append(current_file)
                current_file = {
                    "name": line.split()[2],
                    "changes": []
                }
            elif line.startswith('+') and not line.startswith('+++'):
                analysis["insertions"] += 1
                if current_file:
                    current_file["changes"].append({"type": "addition", "line": line})
            elif line.startswith('-') and not line.startswith('---'):
                analysis["deletions"] += 1
                if current_file:
                    current_file["changes"].append({"type": "deletion", "line": line})
        
        if current_file:
            analysis["files"].append(current_file)
        
        analysis["files_changed"] = len(analysis["files"])
        return analysis
    
    def _analyze_git_error(self, error: str) -> Dict[str, Any]:
        """تحليل أخطاء Git"""
        if not error:
            return {"has_error": False}
        
        error_analysis = {
            "has_error": True,
            "error_type": "unknown",
            "suggestion": None,
            "common_solutions": []
        }
        
        error_lower = error.lower()
        
        if "not a git repository" in error_lower:
            error_analysis["error_type"] = "not_git_repo"
            error_analysis["suggestion"] = "تأكد من أنك في مجلد يحتوي على مستودع Git"
            error_analysis["common_solutions"] = ["git init", "git clone <repository-url>"]
        
        elif "fatal: not a git repository" in error_lower:
            error_analysis["error_type"] = "not_git_repo"
            error_analysis["suggestion"] = "قم بتهيئة مستودع Git أو انتقل إلى مجلد يحتوي على مستودع"
            error_analysis["common_solutions"] = ["git init", "cd <git-repository>"]
        
        elif "merge conflict" in error_lower:
            error_analysis["error_type"] = "merge_conflict"
            error_analysis["suggestion"] = "حل تعارضات الدمج قبل المتابعة"
            error_analysis["common_solutions"] = ["git status", "git add <resolved-files>", "git commit"]
        
        elif "authentication failed" in error_lower:
            error_analysis["error_type"] = "auth_failed"
            error_analysis["suggestion"] = "تحقق من بيانات الاعتماد أو إعدادات SSH"
            error_analysis["common_solutions"] = ["git config --global user.name", "git config --global user.email"]
        
        elif "remote repository not found" in error_lower:
            error_analysis["error_type"] = "remote_not_found"
            error_analysis["suggestion"] = "تحقق من صحة رابط المستودع البعيد"
            error_analysis["common_solutions"] = ["git remote -v", "git remote set-url origin <new-url>"]
        
        elif "working tree clean" in error_lower:
            error_analysis["error_type"] = "working_tree_clean"
            error_analysis["suggestion"] = "لا توجد تغييرات للالتزام"
            error_analysis["common_solutions"] = ["git add <files>", "git status"]
        
        return error_analysis
    
    async def clone_repository(self, url: str, directory: str = "") -> Dict[str, Any]:
        """استنساخ مستودع"""
        try:
            result = await self.execute_command("clone", {
                "url": url,
                "directory": directory
            })
            
            return result
            
        except Exception as e:
            logger.error(f"❌ خطأ في استنساخ المستودع: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    async def create_branch(self, branch_name: str) -> Dict[str, Any]:
        """إنشاء فرع جديد"""
        try:
            result = await self.execute_command("checkout", {
                "create_branch": True,
                "new_branch": branch_name
            })
            
            return result
            
        except Exception as e:
            logger.error(f"❌ خطأ في إنشاء الفرع: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    async def commit_changes(self, message: str, files: List[str] = None) -> Dict[str, Any]:
        """التزام التغييرات"""
        try:
            # إضافة الملفات
            if files:
                add_result = await self.execute_command("add", {"files": files})
                if not add_result["success"]:
                    return add_result
            
            # التزام التغييرات
            commit_result = await self.execute_command("commit", {"message": message})
            
            return commit_result
            
        except Exception as e:
            logger.error(f"❌ خطأ في التزام التغييرات: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    async def push_changes(self, remote: str = "origin", branch: str = "") -> Dict[str, Any]:
        """دفع التغييرات"""
        try:
            result = await self.execute_command("push", {
                "remote": remote,
                "branch": branch
            })
            
            return result
            
        except Exception as e:
            logger.error(f"❌ خطأ في دفع التغييرات: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    async def pull_changes(self, remote: str = "origin", branch: str = "") -> Dict[str, Any]:
        """سحب التغييرات"""
        try:
            result = await self.execute_command("pull", {
                "remote": remote,
                "branch": branch
            })
            
            return result
            
        except Exception as e:
            logger.error(f"❌ خطأ في سحب التغييرات: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    async def get_repository_status(self) -> Dict[str, Any]:
        """الحصول على حالة المستودع"""
        try:
            result = await self.execute_command("status", {"short": True})
            
            return result
            
        except Exception as e:
            logger.error(f"❌ خطأ في الحصول على حالة المستودع: {e}")
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
                "Repository Management",
                "Branch Operations",
                "Commit History",
                "Merge Operations",
                "Remote Operations",
                "Conflict Resolution"
            ]
        })
        
        return base_info

def create_git_manifest():
    """إنشاء ملف تعريف Git Agent"""
    manifest = MCPAgentManifest(
        agent_name="git-agent",
        cli_tool="git",
        description="وكيل Git لإدارة التحكم في الإصدارات"
    )
    
    # إضافة القدرات
    manifest.add_capability("version_control")
    manifest.add_capability("repository_management")
    manifest.add_capability("branch_operations")
    manifest.add_capability("commit_management")
    manifest.add_capability("remote_operations")
    manifest.add_capability("merge_operations")
    
    # إضافة الأوامر
    manifest.add_command("clone", {
        "description": "استنساخ مستودع Git",
        "parameters": ["url"],
        "optional_parameters": ["directory"],
        "output_type": "clone_result"
    })
    
    manifest.add_command("add", {
        "description": "إضافة ملفات إلى منطقة التجهيز",
        "parameters": ["files"],
        "optional_parameters": [],
        "output_type": "add_result"
    })
    
    manifest.add_command("commit", {
        "description": "التزام التغييرات",
        "parameters": ["message"],
        "optional_parameters": ["amend", "no_verify"],
        "output_type": "commit_result"
    })
    
    manifest.add_command("push", {
        "description": "دفع التغييرات إلى المستودع البعيد",
        "parameters": [],
        "optional_parameters": ["remote", "branch", "force", "set_upstream"],
        "output_type": "push_result"
    })
    
    manifest.add_command("pull", {
        "description": "سحب التغييرات من المستودع البعيد",
        "parameters": [],
        "optional_parameters": ["remote", "branch"],
        "output_type": "pull_result"
    })
    
    manifest.add_command("merge", {
        "description": "دمج الفروع",
        "parameters": ["branch"],
        "optional_parameters": ["no_ff", "squash"],
        "output_type": "merge_result"
    })
    
    manifest.add_command("branch", {
        "description": "إدارة الفروع",
        "parameters": ["action"],
        "optional_parameters": ["name"],
        "output_type": "branch_result"
    })
    
    manifest.add_command("checkout", {
        "description": "التبديل بين الفروع أو الملفات",
        "parameters": ["target"],
        "optional_parameters": ["create_branch", "new_branch"],
        "output_type": "checkout_result"
    })
    
    manifest.add_command("status", {
        "description": "عرض حالة المستودع",
        "parameters": [],
        "optional_parameters": ["short", "porcelain"],
        "output_type": "status_result"
    })
    
    manifest.add_command("log", {
        "description": "عرض تاريخ الالتزامات",
        "parameters": [],
        "optional_parameters": ["oneline", "graph", "decorate", "limit"],
        "output_type": "log_result"
    })
    
    manifest.add_command("diff", {
        "description": "عرض الاختلافات",
        "parameters": [],
        "optional_parameters": ["staged", "cached"],
        "output_type": "diff_result"
    })
    
    manifest.add_command("reset", {
        "description": "إعادة تعيين التغييرات",
        "parameters": ["mode"],
        "optional_parameters": ["commit"],
        "output_type": "reset_result"
    })
    
    manifest.add_command("revert", {
        "description": "تراجع عن التزام",
        "parameters": ["commit"],
        "optional_parameters": [],
        "output_type": "revert_result"
    })
    
    manifest.add_command("tag", {
        "description": "إدارة العلامات",
        "parameters": ["action"],
        "optional_parameters": ["name", "message"],
        "output_type": "tag_result"
    })
    
    # إضافة مخططات الإدخال
    manifest.add_input_schema("git_command", {
        "type": "object",
        "properties": {
            "command": {"type": "string", "enum": [
                "clone", "add", "commit", "push", "pull", "merge", "branch",
                "checkout", "status", "log", "diff", "reset", "revert", "tag"
            ]},
            "parameters": {"type": "object"},
            "options": {"type": "object"}
        },
        "required": ["command"]
    })
    
    # إضافة مخططات الإخراج
    manifest.add_output_schema("git_result", {
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
    manifest.add_dependency("git")
    
    return manifest

# مثال على الاستخدام
async def demo_git_agent():
    """عرض توضيحي لـ Git Agent"""
    print("🎬 بدء العرض التوضيحي لـ Git Agent")
    print("=" * 60)
    
    # إنشاء ملف التعريف
    print("\n📋 إنشاء ملف تعريف Git Agent...")
    manifest = create_git_manifest()
    
    manifest_path = "git_agent_manifest.json"
    manifest.save(manifest_path)
    print(f"✅ تم حفظ ملف التعريف: {manifest_path}")
    
    # إنشاء الوكيل
    print("\n🤖 إنشاء Git Agent...")
    git_agent = GitAgent(manifest_path)
    
    try:
        # تهيئة الوكيل
        await git_agent.initialize()
        
        # اختبار حالة المستودع
        print("\n📊 اختبار حالة المستودع...")
        
        status_result = await git_agent.execute_command("status", {"short": True})
        
        if status_result["success"]:
            print("✅ تم الحصول على حالة المستودع بنجاح:")
            parsed = status_result['result']['parsed_output']
            if 'analysis' in parsed:
                analysis = parsed['analysis']
                print(f"   الفرع الحالي: {analysis.get('current_branch', 'N/A')}")
                print(f"   نظيف: {analysis.get('clean', False)}")
                print(f"   الملفات المعدلة: {len(analysis.get('modified_files', []))}")
                print(f"   الملفات الجديدة: {len(analysis.get('untracked_files', []))}")
        else:
            print(f"❌ فشل في الحصول على حالة المستودع: {status_result.get('error', 'خطأ غير معروف')}")
        
        # اختبار عرض الفروع
        print("\n🌿 اختبار عرض الفروع...")
        
        branch_result = await git_agent.execute_command("branch", {"action": "list"})
        
        if branch_result["success"]:
            print("✅ تم عرض الفروع بنجاح:")
            parsed = branch_result['result']['parsed_output']
            if 'analysis' in parsed:
                analysis = parsed['analysis']
                print(f"   عدد الفروع: {len(analysis.get('branches', []))}")
                print(f"   الفرع الحالي: {analysis.get('current_branch', 'N/A')}")
                print(f"   الفروع: {analysis.get('branches', [])}")
        else:
            print(f"❌ فشل في عرض الفروع: {branch_result.get('error', 'خطأ غير معروف')}")
        
        # اختبار عرض تاريخ الالتزامات
        print("\n📜 اختبار عرض تاريخ الالتزامات...")
        
        log_result = await git_agent.execute_command("log", {
            "oneline": True,
            "limit": 5
        })
        
        if log_result["success"]:
            print("✅ تم عرض تاريخ الالتزامات بنجاح:")
            parsed = log_result['result']['parsed_output']
            if 'analysis' in parsed:
                analysis = parsed['analysis']
                print(f"   عدد الالتزامات: {analysis.get('total_commits', 0)}")
                commits = analysis.get('commits', [])
                if commits:
                    print(f"   آخر التزام: {commits[0].get('message', 'N/A')}")
        else:
            print(f"❌ فشل في عرض تاريخ الالتزامات: {log_result.get('error', 'خطأ غير معروف')}")
        
        # عرض معلومات الوكيل
        print("\n📊 معلومات Git Agent:")
        agent_info = await git_agent.get_agent_info()
        
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
        await git_agent.shutdown()
        
        # حذف ملف التعريف
        if os.path.exists(manifest_path):
            os.remove(manifest_path)
            print(f"🗑️ تم حذف ملف التعريف: {manifest_path}")
    
    print("\n🎉 انتهى العرض التوضيحي!")

if __name__ == "__main__":
    asyncio.run(demo_git_agent())
