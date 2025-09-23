#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🧪 AuraOS Complete System Test Suite
مجموعة اختبارات شاملة لنظام AuraOS

This script tests all the integrated systems including:
- Easy Control Panel
- MCP Tools Integration
- Push/Pull Update System
- Automated Deployment System
"""

import asyncio
import json
import sys
import os
import subprocess
import time
from datetime import datetime
from typing import Dict, List, Any, Optional
from pathlib import Path

class AuraOSSystemTester:
    """
    نظام اختبار شامل لـ AuraOS
    """
    
    def __init__(self):
        self.testResults = {
            "timestamp": datetime.now().isoformat(),
            "total_tests": 0,
            "passed_tests": 0,
            "failed_tests": 0,
            "test_details": []
        }
        self.systems = {
            "easy_control_panel": {
                "file": "easy-control-panel.js",
                "status": "not_tested",
                "features": ["control_buttons", "tool_management", "system_monitoring"]
            },
            "mcp_tools_integration": {
                "file": "mcp-tools-integration.js",
                "status": "not_tested",
                "features": ["mcp_tools", "tool_categories", "tool_actions"]
            },
            "push_pull_update_system": {
                "file": "push-pull-update-system.js",
                "status": "not_tested",
                "features": ["git_integration", "update_checking", "conflict_resolution"]
            },
            "automated_deployment_system": {
                "file": "automated-deployment-system.js",
                "status": "not_tested",
                "features": ["environment_deployment", "health_checks", "rollback"]
            },
            "dashboard_integration": {
                "file": "dashboard.html",
                "status": "not_tested",
                "features": ["script_loading", "ui_integration", "initialization"]
            }
        }
    
    async def run_all_tests(self):
        """تشغيل جميع الاختبارات"""
        print("🧪 بدء اختبارات نظام AuraOS الشاملة")
        print("=" * 60)
        
        # اختبار وجود الملفات
        await self.test_file_existence()
        
        # اختبار صحة JavaScript
        await self.test_javascript_syntax()
        
        # اختبار تكامل النظام
        await self.test_system_integration()
        
        # اختبار الميزات الأساسية
        await self.test_core_features()
        
        # اختبار الأداء
        await self.test_performance()
        
        # عرض النتائج
        self.display_results()
        
        # حفظ التقرير
        await self.save_test_report()
    
    async def test_file_existence(self):
        """اختبار وجود الملفات المطلوبة"""
        print("\n📁 اختبار وجود الملفات...")
        
        required_files = [
            "easy-control-panel.js",
            "mcp-tools-integration.js", 
            "push-pull-update-system.js",
            "automated-deployment-system.js",
            "dashboard.html",
            "git_agent.py",
            "docker_agent.py",
            "mcp_agents_registry.json"
        ]
        
        for file in required_files:
            if os.path.exists(file):
                self.add_test_result("file_existence", f"File {file} exists", True)
                print(f"  ✅ {file}")
            else:
                self.add_test_result("file_existence", f"File {file} missing", False)
                print(f"  ❌ {file} - MISSING")
    
    async def test_javascript_syntax(self):
        """اختبار صحة JavaScript"""
        print("\n🔍 اختبار صحة JavaScript...")
        
        js_files = [
            "easy-control-panel.js",
            "mcp-tools-integration.js",
            "push-pull-update-system.js", 
            "automated-deployment-system.js"
        ]
        
        for js_file in js_files:
            if os.path.exists(js_file):
                try:
                    # قراءة الملف والتحقق من الأخطاء الأساسية
                    with open(js_file, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    # فحص الأخطاء الشائعة
                    errors = self.check_javascript_errors(content)
                    
                    if not errors:
                        self.add_test_result("javascript_syntax", f"JavaScript syntax OK for {js_file}", True)
                        print(f"  ✅ {js_file} - Syntax OK")
                    else:
                        self.add_test_result("javascript_syntax", f"JavaScript errors in {js_file}: {errors}", False)
                        print(f"  ❌ {js_file} - Errors: {errors}")
                        
                except Exception as e:
                    self.add_test_result("javascript_syntax", f"Error reading {js_file}: {e}", False)
                    print(f"  ❌ {js_file} - Read error: {e}")
    
    def check_javascript_errors(self, content: str) -> List[str]:
        """فحص أخطاء JavaScript الأساسية"""
        errors = []
        
        # فحص الأقواس المتوازنة
        if content.count('{') != content.count('}'):
            errors.append("Unbalanced braces")
        
        if content.count('(') != content.count(')'):
            errors.append("Unbalanced parentheses")
        
        if content.count('[') != content.count(']'):
            errors.append("Unbalanced brackets")
        
        # فحص النقاط المنقوطة المفقودة في نهاية الدوال
        lines = content.split('\n')
        for i, line in enumerate(lines):
            line = line.strip()
            if (line.endswith('}') and not line.endswith(';') and 
                not line.endswith('{') and not line.endswith('()') and
                'function' not in line and 'class' not in line):
                # قد تكون نقطة منقوطة مفقودة
                pass
        
        return errors
    
    async def test_system_integration(self):
        """اختبار تكامل النظام"""
        print("\n🔗 اختبار تكامل النظام...")
        
        # اختبار تحميل dashboard.html
        if os.path.exists("dashboard.html"):
            try:
                with open("dashboard.html", 'r', encoding='utf-8') as f:
                    dashboard_content = f.read()
                
                # فحص تحميل الـ scripts
                required_scripts = [
                    "easy-control-panel.js",
                    "mcp-tools-integration.js",
                    "push-pull-update-system.js",
                    "automated-deployment-system.js"
                ]
                
                for script in required_scripts:
                    if script in dashboard_content:
                        self.add_test_result("system_integration", f"Script {script} loaded in dashboard", True)
                        print(f"  ✅ {script} - Loaded in dashboard")
                    else:
                        self.add_test_result("system_integration", f"Script {script} not loaded in dashboard", False)
                        print(f"  ❌ {script} - Not loaded in dashboard")
                
                # فحص تهيئة النظام
                if "window.easyControlPanel" in dashboard_content:
                    self.add_test_result("system_integration", "Easy Control Panel initialization found", True)
                    print(f"  ✅ Easy Control Panel - Initialization found")
                else:
                    self.add_test_result("system_integration", "Easy Control Panel initialization missing", False)
                    print(f"  ❌ Easy Control Panel - Initialization missing")
                
            except Exception as e:
                self.add_test_result("system_integration", f"Error reading dashboard.html: {e}", False)
                print(f"  ❌ Dashboard - Read error: {e}")
    
    async def test_core_features(self):
        """اختبار الميزات الأساسية"""
        print("\n⚡ اختبار الميزات الأساسية...")
        
        # اختبار Easy Control Panel
        if os.path.exists("easy-control-panel.js"):
            try:
                with open("easy-control-panel.js", 'r', encoding='utf-8') as f:
                    ecp_content = f.read()
                
                features = [
                    "EasyControlPanel",
                    "createControlPanelUI",
                    "handleAction",
                    "toggleControlPanel"
                ]
                
                for feature in features:
                    if feature in ecp_content:
                        self.add_test_result("core_features", f"ECP feature {feature} found", True)
                        print(f"  ✅ ECP - {feature}")
                    else:
                        self.add_test_result("core_features", f"ECP feature {feature} missing", False)
                        print(f"  ❌ ECP - {feature} missing")
                        
            except Exception as e:
                self.add_test_result("core_features", f"Error testing ECP: {e}", False)
        
        # اختبار MCP Tools Integration
        if os.path.exists("mcp-tools-integration.js"):
            try:
                with open("mcp-tools-integration.js", 'r', encoding='utf-8') as f:
                    mcp_content = f.read()
                
                features = [
                    "MCPToolsIntegration",
                    "loadExistingMCPTools",
                    "createMissingTools",
                    "handleToolAction"
                ]
                
                for feature in features:
                    if feature in mcp_content:
                        self.add_test_result("core_features", f"MCP feature {feature} found", True)
                        print(f"  ✅ MCP - {feature}")
                    else:
                        self.add_test_result("core_features", f"MCP feature {feature} missing", False)
                        print(f"  ❌ MCP - {feature} missing")
                        
            except Exception as e:
                self.add_test_result("core_features", f"Error testing MCP: {e}", False)
        
        # اختبار Push/Pull Update System
        if os.path.exists("push-pull-update-system.js"):
            try:
                with open("push-pull-update-system.js", 'r', encoding='utf-8') as f:
                    update_content = f.read()
                
                features = [
                    "PushPullUpdateSystem",
                    "checkForUpdates",
                    "pullUpdates",
                    "pushChanges"
                ]
                
                for feature in features:
                    if feature in update_content:
                        self.add_test_result("core_features", f"Update feature {feature} found", True)
                        print(f"  ✅ Update - {feature}")
                    else:
                        self.add_test_result("core_features", f"Update feature {feature} missing", False)
                        print(f"  ❌ Update - {feature} missing")
                        
            except Exception as e:
                self.add_test_result("core_features", f"Error testing Update System: {e}", False)
        
        # اختبار Automated Deployment System
        if os.path.exists("automated-deployment-system.js"):
            try:
                with open("automated-deployment-system.js", 'r', encoding='utf-8') as f:
                    deploy_content = f.read()
                
                features = [
                    "AutomatedDeploymentSystem",
                    "deployToEnvironment",
                    "executeDeploymentPipeline",
                    "performHealthCheck"
                ]
                
                for feature in features:
                    if feature in deploy_content:
                        self.add_test_result("core_features", f"Deploy feature {feature} found", True)
                        print(f"  ✅ Deploy - {feature}")
                    else:
                        self.add_test_result("core_features", f"Deploy feature {feature} missing", False)
                        print(f"  ❌ Deploy - {feature} missing")
                        
            except Exception as e:
                self.add_test_result("core_features", f"Error testing Deploy System: {e}", False)
    
    async def test_performance(self):
        """اختبار الأداء"""
        print("\n⚡ اختبار الأداء...")
        
        js_files = [
            "easy-control-panel.js",
            "mcp-tools-integration.js",
            "push-pull-update-system.js",
            "automated-deployment-system.js"
        ]
        
        total_size = 0
        for js_file in js_files:
            if os.path.exists(js_file):
                size = os.path.getsize(js_file)
                total_size += size
                
                if size < 100000:  # أقل من 100KB
                    self.add_test_result("performance", f"{js_file} size OK ({size} bytes)", True)
                    print(f"  ✅ {js_file} - Size OK ({size:,} bytes)")
                else:
                    self.add_test_result("performance", f"{js_file} size large ({size} bytes)", False)
                    print(f"  ⚠️ {js_file} - Size large ({size:,} bytes)")
        
        if total_size < 500000:  # أقل من 500KB إجمالي
            self.add_test_result("performance", f"Total JS size OK ({total_size} bytes)", True)
            print(f"  ✅ Total JS size OK ({total_size:,} bytes)")
        else:
            self.add_test_result("performance", f"Total JS size large ({total_size} bytes)", False)
            print(f"  ⚠️ Total JS size large ({total_size:,} bytes)")
    
    def add_test_result(self, category: str, description: str, passed: bool):
        """إضافة نتيجة اختبار"""
        self.testResults["total_tests"] += 1
        if passed:
            self.testResults["passed_tests"] += 1
        else:
            self.testResults["failed_tests"] += 1
        
        self.testResults["test_details"].append({
            "category": category,
            "description": description,
            "passed": passed,
            "timestamp": datetime.now().isoformat()
        })
    
    def display_results(self):
        """عرض النتائج"""
        print("\n📊 نتائج الاختبارات")
        print("=" * 60)
        
        total = self.testResults["total_tests"]
        passed = self.testResults["passed_tests"]
        failed = self.testResults["failed_tests"]
        
        print(f"إجمالي الاختبارات: {total}")
        print(f"نجح: {passed}")
        print(f"فشل: {failed}")
        print(f"نسبة النجاح: {(passed/total*100):.1f}%" if total > 0 else "0%")
        
        if failed > 0:
            print(f"\n❌ الاختبارات الفاشلة:")
            for test in self.testResults["test_details"]:
                if not test["passed"]:
                    print(f"  - {test['description']}")
        
        print(f"\n✅ الاختبارات الناجحة:")
        for test in self.testResults["test_details"]:
            if test["passed"]:
                print(f"  - {test['description']}")
    
    async def save_test_report(self):
        """حفظ تقرير الاختبارات"""
        report_file = f"test_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        
        try:
            with open(report_file, 'w', encoding='utf-8') as f:
                json.dump(self.testResults, f, indent=2, ensure_ascii=False)
            
            print(f"\n💾 تم حفظ تقرير الاختبارات: {report_file}")
            
        except Exception as e:
            print(f"\n❌ خطأ في حفظ التقرير: {e}")
    
    async def test_mcp_agents(self):
        """اختبار وكلاء MCP"""
        print("\n🤖 اختبار وكلاء MCP...")
        
        # اختبار Git Agent
        if os.path.exists("git_agent.py"):
            try:
                with open("git_agent.py", 'r', encoding='utf-8') as f:
                    git_content = f.read()
                
                features = [
                    "GitAgent",
                    "clone_repository",
                    "commit_changes",
                    "push_changes"
                ]
                
                for feature in features:
                    if feature in git_content:
                        self.add_test_result("mcp_agents", f"Git Agent feature {feature} found", True)
                        print(f"  ✅ Git Agent - {feature}")
                    else:
                        self.add_test_result("mcp_agents", f"Git Agent feature {feature} missing", False)
                        print(f"  ❌ Git Agent - {feature} missing")
                        
            except Exception as e:
                self.add_test_result("mcp_agents", f"Error testing Git Agent: {e}", False)
        
        # اختبار Docker Agent
        if os.path.exists("docker_agent.py"):
            try:
                with open("docker_agent.py", 'r', encoding='utf-8') as f:
                    docker_content = f.read()
                
                features = [
                    "DockerAgent",
                    "build_image",
                    "run_container",
                    "stop_container"
                ]
                
                for feature in features:
                    if feature in docker_content:
                        self.add_test_result("mcp_agents", f"Docker Agent feature {feature} found", True)
                        print(f"  ✅ Docker Agent - {feature}")
                    else:
                        self.add_test_result("mcp_agents", f"Docker Agent feature {feature} missing", False)
                        print(f"  ❌ Docker Agent - {feature} missing")
                        
            except Exception as e:
                self.add_test_result("mcp_agents", f"Error testing Docker Agent: {e}", False)
        
        # اختبار MCP Registry
        if os.path.exists("mcp_agents_registry.json"):
            try:
                with open("mcp_agents_registry.json", 'r', encoding='utf-8') as f:
                    registry_data = json.load(f)
                
                if "agents" in registry_data and len(registry_data["agents"]) > 0:
                    self.add_test_result("mcp_agents", f"MCP Registry has {len(registry_data['agents'])} agents", True)
                    print(f"  ✅ MCP Registry - {len(registry_data['agents'])} agents registered")
                else:
                    self.add_test_result("mcp_agents", "MCP Registry empty or invalid", False)
                    print(f"  ❌ MCP Registry - Empty or invalid")
                    
            except Exception as e:
                self.add_test_result("mcp_agents", f"Error reading MCP Registry: {e}", False)

async def main():
    """الدالة الرئيسية"""
    print("🚀 بدء اختبارات نظام AuraOS")
    print("=" * 60)
    
    tester = AuraOSSystemTester()
    await tester.run_all_tests()
    await tester.test_mcp_agents()
    
    print("\n🎉 انتهت الاختبارات!")
    print("=" * 60)

if __name__ == "__main__":
    asyncio.run(main())
