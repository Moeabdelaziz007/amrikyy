#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
JQ MCP Agent - وكيل JSON Parser للتعامل مع البيانات
تحويل jq إلى عضو ذكي في Learning Hub
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

class JQAgent(MCPAgentBase):
    """
    وكيل JQ لمعالجة وتحليل JSON
    """
    
    def __init__(self, manifest_path: str):
        super().__init__(manifest_path)
        self.supported_filters = [
            "select", "map", "filter", "group_by", "sort_by",
            "unique", "flatten", "keys", "values", "length",
            "has", "type", "tonumber", "tostring", "fromjson", "tojson"
        ]
        self.common_patterns = {
            "extract_values": ".field_name",
            "filter_objects": "select(.condition)",
            "transform_data": "map(.field | transformation)",
            "aggregate_data": "group_by(.field) | map({key: .[0].field, count: length})",
            "flatten_structure": "flatten",
            "sort_data": "sort_by(.field)"
        }
    
    async def _build_cli_command(self, command_name: str, params: Dict[str, Any], command_config: Dict[str, Any]) -> List[str]:
        """بناء أمر JQ"""
        try:
            command = ["jq"]
            
            # إضافة خيارات JQ
            options = params.get("options", {})
            
            if options.get("compact", False):
                command.append("-c")
            
            if options.get("raw_output", False):
                command.append("-r")
            
            if options.get("null_input", False):
                command.append("-n")
            
            if options.get("slurp", False):
                command.append("-s")
            
            # إضافة الفلتر
            filter_expr = params.get("filter", ".")
            
            # معالجة الفلترات المعقدة
            if isinstance(filter_expr, dict):
                filter_expr = self._build_complex_filter(filter_expr)
            
            command.append(filter_expr)
            
            return command
            
        except Exception as e:
            logger.error(f"❌ خطأ في بناء أمر JQ: {e}")
            raise
    
    def _build_complex_filter(self, filter_config: Dict[str, Any]) -> str:
        """بناء فلتر معقد"""
        try:
            filter_type = filter_config.get("type", "simple")
            
            if filter_type == "extract":
                field = filter_config.get("field", "")
                return f".{field}"
            
            elif filter_type == "filter":
                condition = filter_config.get("condition", "true")
                return f"select({condition})"
            
            elif filter_type == "map":
                transformation = filter_config.get("transformation", ".")
                return f"map({transformation})"
            
            elif filter_type == "group_by":
                field = filter_config.get("field", "")
                return f"group_by(.{field})"
            
            elif filter_type == "sort":
                field = filter_config.get("field", "")
                return f"sort_by(.{field})"
            
            elif filter_type == "aggregate":
                field = filter_config.get("field", "")
                operation = filter_config.get("operation", "count")
                
                if operation == "count":
                    return f"group_by(.{field}) | map({{key: .[0].{field}, count: length}})"
                elif operation == "sum":
                    return f"map(.{field}) | add"
                elif operation == "avg":
                    return f"map(.{field}) | add / length"
            
            elif filter_type == "custom":
                return filter_config.get("expression", ".")
            
            else:
                return "."
                
        except Exception as e:
            logger.error(f"❌ خطأ في بناء الفلتر المعقد: {e}")
            return "."
    
    async def _process_result(self, result: Dict[str, Any], command_config: Dict[str, Any]) -> Dict[str, Any]:
        """معالجة نتيجة JQ"""
        try:
            output = result["stdout"].strip()
            error = result["stderr"].strip()
            
            # محاولة تحليل JSON
            parsed_json = None
            json_type = None
            
            if output:
                try:
                    parsed_json = json.loads(output)
                    json_type = type(parsed_json).__name__
                except json.JSONDecodeError:
                    # قد يكون الناتج نص عادي
                    parsed_json = output
                    json_type = "string"
            
            # تحليل الأخطاء
            error_analysis = self._analyze_jq_error(error)
            
            processed_result = {
                "success": result["returncode"] == 0,
                "output": output,
                "parsed_json": parsed_json,
                "json_type": json_type,
                "output_length": len(output),
                "error": error if error else None,
                "error_analysis": error_analysis,
                "is_valid_json": parsed_json is not None and json_type != "string"
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
    
    def _analyze_jq_error(self, error: str) -> Dict[str, Any]:
        """تحليل أخطاء JQ"""
        if not error:
            return {"has_error": False}
        
        error_analysis = {
            "has_error": True,
            "error_type": "unknown",
            "suggestion": None
        }
        
        error_lower = error.lower()
        
        if "parse error" in error_lower:
            error_analysis["error_type"] = "parse_error"
            error_analysis["suggestion"] = "تحقق من صحة الفلتر JSON"
        
        elif "invalid path expression" in error_lower:
            error_analysis["error_type"] = "path_error"
            error_analysis["suggestion"] = "تحقق من مسار الحقل المطلوب"
        
        elif "cannot index" in error_lower:
            error_analysis["error_type"] = "index_error"
            error_analysis["suggestion"] = "تأكد من أن البيانات تحتوي على الحقل المطلوب"
        
        elif "break" in error_lower:
            error_analysis["error_type"] = "break_error"
            error_analysis["suggestion"] = "استخدم break بحذر في الفلاتر المعقدة"
        
        return error_analysis
    
    async def parse_json(self, json_data: str, filter_expr: str = ".") -> Dict[str, Any]:
        """تحليل JSON"""
        try:
            result = await self.execute_command("parse", {
                "filter": filter_expr,
                "input": json_data
            })
            
            return result
            
        except Exception as e:
            logger.error(f"❌ خطأ في تحليل JSON: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    async def extract_field(self, json_data: str, field_path: str) -> Dict[str, Any]:
        """استخراج حقل محدد"""
        try:
            result = await self.execute_command("extract", {
                "filter": {"type": "extract", "field": field_path},
                "input": json_data
            })
            
            return result
            
        except Exception as e:
            logger.error(f"❌ خطأ في استخراج الحقل: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    async def filter_data(self, json_data: str, condition: str) -> Dict[str, Any]:
        """تصفية البيانات"""
        try:
            result = await self.execute_command("filter", {
                "filter": {"type": "filter", "condition": condition},
                "input": json_data
            })
            
            return result
            
        except Exception as e:
            logger.error(f"❌ خطأ في تصفية البيانات: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    async def transform_data(self, json_data: str, transformation: str) -> Dict[str, Any]:
        """تحويل البيانات"""
        try:
            result = await self.execute_command("transform", {
                "filter": {"type": "map", "transformation": transformation},
                "input": json_data
            })
            
            return result
            
        except Exception as e:
            logger.error(f"❌ خطأ في تحويل البيانات: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    async def get_agent_info(self) -> Dict[str, Any]:
        """الحصول على معلومات الوكيل"""
        base_info = await super().get_agent_info()
        
        base_info.update({
            "supported_filters": self.supported_filters,
            "common_patterns": list(self.common_patterns.keys()),
            "specialized_features": [
                "JSON Parsing",
                "Data Filtering",
                "Data Transformation",
                "Data Aggregation",
                "Error Analysis",
                "Pattern Matching"
            ]
        })
        
        return base_info

def create_jq_manifest():
    """إنشاء ملف تعريف JQ Agent"""
    manifest = MCPAgentManifest(
        agent_name="jq-agent",
        cli_tool="jq",
        description="وكيل JQ لمعالجة وتحليل البيانات JSON"
    )
    
    # إضافة القدرات
    manifest.add_capability("json_parsing")
    manifest.add_capability("data_filtering")
    manifest.add_capability("data_transformation")
    manifest.add_capability("data_aggregation")
    manifest.add_capability("pattern_matching")
    
    # إضافة الأوامر
    manifest.add_command("parse", {
        "description": "تحليل JSON باستخدام فلتر",
        "parameters": ["filter", "input"],
        "optional_parameters": ["options"],
        "output_type": "parsed_data"
    })
    
    manifest.add_command("extract", {
        "description": "استخراج حقل محدد من JSON",
        "parameters": ["field_path", "input"],
        "optional_parameters": ["options"],
        "output_type": "extracted_data"
    })
    
    manifest.add_command("filter", {
        "description": "تصفية البيانات بناءً على شرط",
        "parameters": ["condition", "input"],
        "optional_parameters": ["options"],
        "output_type": "filtered_data"
    })
    
    manifest.add_command("transform", {
        "description": "تحويل البيانات باستخدام map",
        "parameters": ["transformation", "input"],
        "optional_parameters": ["options"],
        "output_type": "transformed_data"
    })
    
    manifest.add_command("aggregate", {
        "description": "تجميع البيانات",
        "parameters": ["field", "operation", "input"],
        "optional_parameters": ["options"],
        "output_type": "aggregated_data"
    })
    
    manifest.add_command("validate", {
        "description": "التحقق من صحة JSON",
        "parameters": ["input"],
        "optional_parameters": ["options"],
        "output_type": "validation_result"
    })
    
    # إضافة مخططات الإدخال
    manifest.add_input_schema("jq_filter", {
        "type": "object",
        "properties": {
            "filter": {
                "type": ["string", "object"],
                "description": "فلتر JQ أو كائن فلتر معقد"
            },
            "input": {
                "type": "string",
                "description": "البيانات JSON المراد معالجتها"
            },
            "options": {
                "type": "object",
                "properties": {
                    "compact": {"type": "boolean"},
                    "raw_output": {"type": "boolean"},
                    "null_input": {"type": "boolean"},
                    "slurp": {"type": "boolean"}
                }
            }
        },
        "required": ["filter", "input"]
    })
    
    # إضافة مخططات الإخراج
    manifest.add_output_schema("parsed_data", {
        "type": "object",
        "properties": {
            "success": {"type": "boolean"},
            "output": {"type": "string"},
            "parsed_json": {"type": ["object", "array", "string", "number", "boolean"]},
            "json_type": {"type": "string"},
            "output_length": {"type": "integer"},
            "is_valid_json": {"type": "boolean"},
            "error_analysis": {
                "type": "object",
                "properties": {
                    "has_error": {"type": "boolean"},
                    "error_type": {"type": "string"},
                    "suggestion": {"type": "string"}
                }
            }
        }
    })
    
    # إضافة التبعيات
    manifest.add_dependency("jq")
    
    return manifest

# مثال على الاستخدام
async def demo_jq_agent():
    """عرض توضيحي لـ JQ Agent"""
    print("🎬 بدء العرض التوضيحي لـ JQ Agent")
    print("=" * 60)
    
    # إنشاء ملف التعريف
    print("\n📋 إنشاء ملف تعريف JQ Agent...")
    manifest = create_jq_manifest()
    
    manifest_path = "jq_agent_manifest.json"
    manifest.save(manifest_path)
    print(f"✅ تم حفظ ملف التعريف: {manifest_path}")
    
    # إنشاء الوكيل
    print("\n🤖 إنشاء JQ Agent...")
    jq_agent = JQAgent(manifest_path)
    
    try:
        # تهيئة الوكيل
        await jq_agent.initialize()
        
        # بيانات JSON للاختبار
        test_json = json.dumps({
            "users": [
                {"id": 1, "name": "أحمد", "age": 25, "city": "القاهرة", "active": True},
                {"id": 2, "name": "فاطمة", "age": 30, "city": "الإسكندرية", "active": False},
                {"id": 3, "name": "محمد", "age": 22, "city": "القاهرة", "active": True},
                {"id": 4, "name": "عائشة", "age": 28, "city": "الجيزة", "active": True}
            ],
            "total": 4,
            "metadata": {
                "created_at": "2024-01-15T10:00:00Z",
                "version": "1.0"
            }
        })
        
        # اختبار التحليل الأساسي
        print("\n🔍 اختبار التحليل الأساسي...")
        
        basic_result = await jq_agent.execute_command("parse", {
            "filter": ".",
            "input": test_json
        })
        
        if basic_result["success"]:
            print("✅ تم التحليل الأساسي بنجاح:")
            print(f"   نوع البيانات: {basic_result['result']['json_type']}")
            print(f"   حجم الناتج: {basic_result['result']['output_length']} حرف")
            print(f"   JSON صحيح: {basic_result['result']['is_valid_json']}")
        else:
            print(f"❌ فشل في التحليل الأساسي: {basic_result.get('error', 'خطأ غير معروف')}")
        
        # اختبار استخراج حقل
        print("\n📤 اختبار استخراج حقل...")
        
        extract_result = await jq_agent.execute_command("extract", {
            "filter": {"type": "extract", "field": "users"},
            "input": test_json
        })
        
        if extract_result["success"]:
            print("✅ تم استخراج حقل المستخدمين بنجاح:")
            print(f"   عدد المستخدمين: {len(extract_result['result']['parsed_json'])}")
            print(f"   نوع البيانات: {extract_result['result']['json_type']}")
        else:
            print(f"❌ فشل في استخراج الحقل: {extract_result.get('error', 'خطأ غير معروف')}")
        
        # اختبار التصفية
        print("\n🔍 اختبار تصفية البيانات...")
        
        filter_result = await jq_agent.execute_command("filter", {
            "filter": {"type": "filter", "condition": ".active == true"},
            "input": test_json
        })
        
        if filter_result["success"]:
            print("✅ تم تصفية المستخدمين النشطين بنجاح:")
            active_users = filter_result['result']['parsed_json']
            print(f"   عدد المستخدمين النشطين: {len(active_users)}")
            
            if active_users:
                print(f"   أسماء المستخدمين النشطين: {[user['name'] for user in active_users]}")
        else:
            print(f"❌ فشل في التصفية: {filter_result.get('error', 'خطأ غير معروف')}")
        
        # اختبار التحويل
        print("\n🔄 اختبار تحويل البيانات...")
        
        transform_result = await jq_agent.execute_command("transform", {
            "filter": {"type": "map", "transformation": "{id: .id, name: .name, age_group: (if .age < 25 then \"young\" elif .age < 30 then \"adult\" else \"senior\" end)}"},
            "input": test_json
        })
        
        if transform_result["success"]:
            print("✅ تم تحويل البيانات بنجاح:")
            transformed_data = transform_result['result']['parsed_json']
            print(f"   عدد العناصر المحولة: {len(transformed_data)}")
            
            if transformed_data:
                print(f"   مثال على البيانات المحولة: {transformed_data[0]}")
        else:
            print(f"❌ فشل في التحويل: {transform_result.get('error', 'خطأ غير معروف')}")
        
        # اختبار التجميع
        print("\n📊 اختبار تجميع البيانات...")
        
        aggregate_result = await jq_agent.execute_command("aggregate", {
            "filter": {"type": "aggregate", "field": "city", "operation": "count"},
            "input": test_json
        })
        
        if aggregate_result["success"]:
            print("✅ تم تجميع البيانات بنجاح:")
            aggregated_data = aggregate_result['result']['parsed_json']
            print(f"   عدد المدن: {len(aggregated_data)}")
            
            if aggregated_data:
                print(f"   توزيع المستخدمين حسب المدينة:")
                for item in aggregated_data:
                    print(f"     {item['key']}: {item['count']} مستخدم")
        else:
            print(f"❌ فشل في التجميع: {aggregate_result.get('error', 'خطأ غير معروف')}")
        
        # اختبار التحقق من صحة JSON
        print("\n✅ اختبار التحقق من صحة JSON...")
        
        invalid_json = '{"invalid": json, "missing": quote}'
        
        validate_result = await jq_agent.execute_command("validate", {
            "filter": ".",
            "input": invalid_json
        })
        
        if not validate_result["success"]:
            print("✅ تم اكتشاف JSON غير صحيح:")
            error_analysis = validate_result['result']['error_analysis']
            print(f"   نوع الخطأ: {error_analysis.get('error_type', 'unknown')}")
            print(f"   الاقتراح: {error_analysis.get('suggestion', 'N/A')}")
        else:
            print("⚠️ لم يتم اكتشاف خطأ في JSON غير صحيح")
        
        # عرض معلومات الوكيل
        print("\n📊 معلومات JQ Agent:")
        agent_info = await jq_agent.get_agent_info()
        
        print(f"   الاسم: {agent_info['name']}")
        print(f"   الأداة CLI: {agent_info['cli_tool']}")
        print(f"   الفلاتر المدعومة: {len(agent_info['supported_filters'])} فلتر")
        print(f"   الأنماط الشائعة: {agent_info['common_patterns']}")
        print(f"   القدرات: {agent_info['capabilities']}")
        print(f"   الميزات المتخصصة: {agent_info['specialized_features']}")
        
    except Exception as e:
        print(f"❌ خطأ في العرض التوضيحي: {e}")
    
    finally:
        # إغلاق الوكيل
        await jq_agent.shutdown()
        
        # حذف ملف التعريف
        if os.path.exists(manifest_path):
            os.remove(manifest_path)
            print(f"🗑️ تم حذف ملف التعريف: {manifest_path}")
    
    print("\n🎉 انتهى العرض التوضيحي!")

if __name__ == "__main__":
    asyncio.run(demo_jq_agent())
