#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
HTTPie MCP Agent - وكيل HTTP للتعامل مع APIs
تحويل httpie إلى عضو ذكي في Learning Hub
"""

import asyncio
import json
import sys
import os
from datetime import datetime
from typing import Dict, List, Any, Optional
from pathlib import Path

# إضافة المسار للاستيراد
sys.path.append(str(Path(__file__).parent))

from mcp_agent_template import MCPAgentBase, MCPAgentManifest

class HTTPieAgent(MCPAgentBase):
    """
    وكيل HTTPie للتعامل مع APIs
    """
    
    def __init__(self, manifest_path: str):
        super().__init__(manifest_path)
        self.supported_methods = ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"]
        self.default_headers = {
            "User-Agent": "AuraOS-HTTPie-Agent/1.0",
            "Accept": "application/json"
        }
    
    async def _build_cli_command(self, command_name: str, params: Dict[str, Any], command_config: Dict[str, Any]) -> List[str]:
        """بناء أمر HTTPie"""
        try:
            method = params.get("method", "GET").upper()
            url = params.get("url", "")
            
            if not url:
                raise ValueError("URL مطلوب")
            
            # بناء الأمر الأساسي
            command = ["http", method, url]
            
            # إضافة Headers
            headers = params.get("headers", {})
            merged_headers = {**self.default_headers, **headers}
            
            for key, value in merged_headers.items():
                command.extend([f"{key}:{value}"])
            
            # إضافة Query Parameters
            query_params = params.get("query_params", {})
            if query_params:
                for key, value in query_params.items():
                    command.append(f"{key}=={value}")
            
            # إضافة Body للطلبات POST/PUT/PATCH
            if method in ["POST", "PUT", "PATCH"]:
                body = params.get("body")
                if body:
                    if isinstance(body, dict):
                        # إرسال كـ JSON
                        command.append("json")
                        for key, value in body.items():
                            command.append(f"{key}={value}")
                    elif isinstance(body, str):
                        # إرسال كـ نص
                        command.append(f"body={body}")
            
            # إضافة خيارات إضافية
            options = params.get("options", {})
            
            if options.get("verbose", False):
                command.append("--verbose")
            
            if options.get("follow_redirects", True):
                command.append("--follow")
            
            if options.get("timeout"):
                command.append(f"--timeout={options['timeout']}")
            
            if options.get("output_file"):
                command.append(f"--output={options['output_file']}")
            
            return command
            
        except Exception as e:
            logger.error(f"❌ خطأ في بناء أمر HTTPie: {e}")
            raise
    
    async def _process_result(self, result: Dict[str, Any], command_config: Dict[str, Any]) -> Dict[str, Any]:
        """معالجة نتيجة HTTPie"""
        try:
            output = result["stdout"]
            error = result["stderr"]
            
            # محاولة تحليل JSON response
            json_response = None
            try:
                # البحث عن JSON في الناتج
                lines = output.split('\n')
                json_start = -1
                json_end = -1
                
                for i, line in enumerate(lines):
                    if line.strip().startswith('{') or line.strip().startswith('['):
                        json_start = i
                        break
                
                if json_start != -1:
                    # البحث عن نهاية JSON
                    json_lines = []
                    brace_count = 0
                    bracket_count = 0
                    
                    for i in range(json_start, len(lines)):
                        line = lines[i]
                        json_lines.append(line)
                        
                        for char in line:
                            if char == '{':
                                brace_count += 1
                            elif char == '}':
                                brace_count -= 1
                            elif char == '[':
                                bracket_count += 1
                            elif char == ']':
                                bracket_count -= 1
                        
                        if brace_count == 0 and bracket_count == 0 and (line.strip().endswith('}') or line.strip().endswith(']')):
                            break
                    
                    json_text = '\n'.join(json_lines)
                    json_response = json.loads(json_text)
            
            except (json.JSONDecodeError, ValueError):
                pass
            
            # استخراج معلومات HTTP
            http_info = self._extract_http_info(output)
            
            processed_result = {
                "success": result["returncode"] == 0,
                "http_info": http_info,
                "json_response": json_response,
                "raw_output": output,
                "error_output": error,
                "response_size": len(output),
                "has_json": json_response is not None
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
    
    def _extract_http_info(self, output: str) -> Dict[str, Any]:
        """استخراج معلومات HTTP من الناتج"""
        http_info = {
            "status_code": None,
            "status_text": None,
            "content_type": None,
            "content_length": None,
            "response_time": None
        }
        
        try:
            lines = output.split('\n')
            
            for line in lines:
                line = line.strip()
                
                # البحث عن Status Code
                if line.startswith('HTTP/'):
                    parts = line.split(' ', 2)
                    if len(parts) >= 2:
                        http_info["status_code"] = int(parts[1])
                        if len(parts) >= 3:
                            http_info["status_text"] = parts[2]
                
                # البحث عن Content-Type
                elif line.lower().startswith('content-type:'):
                    http_info["content_type"] = line.split(':', 1)[1].strip()
                
                # البحث عن Content-Length
                elif line.lower().startswith('content-length:'):
                    try:
                        http_info["content_length"] = int(line.split(':', 1)[1].strip())
                    except ValueError:
                        pass
        
        except Exception as e:
            logger.warning(f"⚠️ خطأ في استخراج معلومات HTTP: {e}")
        
        return http_info
    
    async def test_api_endpoint(self, url: str, method: str = "GET") -> Dict[str, Any]:
        """اختبار نقطة نهاية API"""
        try:
            result = await self.execute_command("request", {
                "method": method,
                "url": url,
                "options": {"verbose": True}
            })
            
            return result
            
        except Exception as e:
            logger.error(f"❌ خطأ في اختبار API: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    async def get_agent_info(self) -> Dict[str, Any]:
        """الحصول على معلومات الوكيل"""
        base_info = await super().get_agent_info()
        
        base_info.update({
            "supported_methods": self.supported_methods,
            "default_headers": self.default_headers,
            "specialized_features": [
                "API Testing",
                "JSON Response Parsing",
                "HTTP Status Analysis",
                "Request/Response Logging"
            ]
        })
        
        return base_info

def create_httpie_manifest():
    """إنشاء ملف تعريف HTTPie Agent"""
    manifest = MCPAgentManifest(
        agent_name="httpie-agent",
        cli_tool="http",
        description="وكيل HTTP للتعامل مع APIs واختبار نقاط النهاية"
    )
    
    # إضافة القدرات
    manifest.add_capability("api_testing")
    manifest.add_capability("http_requests")
    manifest.add_capability("json_parsing")
    manifest.add_capability("api_exploration")
    
    # إضافة الأوامر
    manifest.add_command("request", {
        "description": "إرسال طلب HTTP",
        "parameters": ["method", "url"],
        "optional_parameters": ["headers", "body", "query_params", "options"],
        "output_type": "http_response"
    })
    
    manifest.add_command("get", {
        "description": "إرسال طلب GET",
        "parameters": ["url"],
        "optional_parameters": ["headers", "query_params", "options"],
        "output_type": "http_response"
    })
    
    manifest.add_command("post", {
        "description": "إرسال طلب POST",
        "parameters": ["url"],
        "optional_parameters": ["headers", "body", "query_params", "options"],
        "output_type": "http_response"
    })
    
    manifest.add_command("test_endpoint", {
        "description": "اختبار نقطة نهاية API",
        "parameters": ["url"],
        "optional_parameters": ["method"],
        "output_type": "test_result"
    })
    
    # إضافة مخططات الإدخال
    manifest.add_input_schema("http_request", {
        "type": "object",
        "properties": {
            "method": {"type": "string", "enum": ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"]},
            "url": {"type": "string", "format": "uri"},
            "headers": {"type": "object"},
            "body": {"type": ["object", "string"]},
            "query_params": {"type": "object"},
            "options": {
                "type": "object",
                "properties": {
                    "verbose": {"type": "boolean"},
                    "follow_redirects": {"type": "boolean"},
                    "timeout": {"type": "number"},
                    "output_file": {"type": "string"}
                }
            }
        },
        "required": ["method", "url"]
    })
    
    # إضافة مخططات الإخراج
    manifest.add_output_schema("http_response", {
        "type": "object",
        "properties": {
            "success": {"type": "boolean"},
            "http_info": {
                "type": "object",
                "properties": {
                    "status_code": {"type": "integer"},
                    "status_text": {"type": "string"},
                    "content_type": {"type": "string"},
                    "content_length": {"type": "integer"}
                }
            },
            "json_response": {"type": ["object", "array"]},
            "raw_output": {"type": "string"},
            "response_size": {"type": "integer"},
            "has_json": {"type": "boolean"}
        }
    })
    
    # إضافة التبعيات
    manifest.add_dependency("httpie")
    
    return manifest

# مثال على الاستخدام
async def demo_httpie_agent():
    """عرض توضيحي لـ HTTPie Agent"""
    print("🎬 بدء العرض التوضيحي لـ HTTPie Agent")
    print("=" * 60)
    
    # إنشاء ملف التعريف
    print("\n📋 إنشاء ملف تعريف HTTPie Agent...")
    manifest = create_httpie_manifest()
    
    manifest_path = "httpie_agent_manifest.json"
    manifest.save(manifest_path)
    print(f"✅ تم حفظ ملف التعريف: {manifest_path}")
    
    # إنشاء الوكيل
    print("\n🤖 إنشاء HTTPie Agent...")
    httpie_agent = HTTPieAgent(manifest_path)
    
    try:
        # تهيئة الوكيل
        await httpie_agent.initialize()
        
        # اختبار طلب GET
        print("\n🌐 اختبار طلب GET...")
        
        get_result = await httpie_agent.execute_command("get", {
            "url": "https://httpbin.org/get",
            "query_params": {
                "test": "auraos",
                "agent": "httpie"
            },
            "options": {
                "verbose": True
            }
        })
        
        if get_result["success"]:
            print("✅ تم إرسال طلب GET بنجاح:")
            print(f"   Status Code: {get_result['result']['http_info'].get('status_code', 'N/A')}")
            print(f"   Content Type: {get_result['result']['http_info'].get('content_type', 'N/A')}")
            print(f"   Response Size: {get_result['result']['response_size']} bytes")
            print(f"   Has JSON: {get_result['result']['has_json']}")
            
            if get_result['result']['json_response']:
                print(f"   JSON Response Keys: {list(get_result['result']['json_response'].keys())}")
        else:
            print(f"❌ فشل في إرسال طلب GET: {get_result.get('error', 'خطأ غير معروف')}")
        
        # اختبار طلب POST
        print("\n📤 اختبار طلب POST...")
        
        post_result = await httpie_agent.execute_command("post", {
            "url": "https://httpbin.org/post",
            "body": {
                "message": "Hello from AuraOS HTTPie Agent!",
                "timestamp": datetime.now().isoformat(),
                "agent": "httpie-agent"
            },
            "headers": {
                "X-Custom-Header": "AuraOS-Test"
            }
        })
        
        if post_result["success"]:
            print("✅ تم إرسال طلب POST بنجاح:")
            print(f"   Status Code: {post_result['result']['http_info'].get('status_code', 'N/A')}")
            print(f"   Response Size: {post_result['result']['response_size']} bytes")
            
            if post_result['result']['json_response']:
                json_data = post_result['result']['json_response']
                if 'json' in json_data:
                    print(f"   Received Data: {json_data['json']}")
        else:
            print(f"❌ فشل في إرسال طلب POST: {post_result.get('error', 'خطأ غير معروف')}")
        
        # اختبار نقطة نهاية
        print("\n🧪 اختبار نقطة نهاية...")
        
        test_result = await httpie_agent.test_api_endpoint("https://httpbin.org/status/200")
        
        if test_result["success"]:
            print("✅ تم اختبار نقطة النهاية بنجاح:")
            print(f"   Status Code: {test_result['result']['http_info'].get('status_code', 'N/A')}")
        else:
            print(f"❌ فشل في اختبار نقطة النهاية: {test_result.get('error', 'خطأ غير معروف')}")
        
        # عرض معلومات الوكيل
        print("\n📊 معلومات HTTPie Agent:")
        agent_info = await httpie_agent.get_agent_info()
        
        print(f"   الاسم: {agent_info['name']}")
        print(f"   الأداة CLI: {agent_info['cli_tool']}")
        print(f"   الطرق المدعومة: {agent_info['supported_methods']}")
        print(f"   القدرات: {agent_info['capabilities']}")
        print(f"   الأوامر: {agent_info['commands']}")
        print(f"   الميزات المتخصصة: {agent_info['specialized_features']}")
        
    except Exception as e:
        print(f"❌ خطأ في العرض التوضيحي: {e}")
    
    finally:
        # إغلاق الوكيل
        await httpie_agent.shutdown()
        
        # حذف ملف التعريف
        if os.path.exists(manifest_path):
            os.remove(manifest_path)
            print(f"🗑️ تم حذف ملف التعريف: {manifest_path}")
    
    print("\n🎉 انتهى العرض التوضيحي!")

if __name__ == "__main__":
    asyncio.run(demo_httpie_agent())
