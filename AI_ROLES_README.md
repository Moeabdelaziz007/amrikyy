# AI Development Roles Configuration

## Overview

This configuration system defines specific AI agent roles for enhanced development workflow using **Cursor IDE** and **Gemini AI** integration. The system provides structured roles that can be activated based on different development scenarios and user needs.

## 🎯 Purpose

- **Standardize AI assistance** across different development tasks
- **Provide bilingual support** (Arabic/English) for international development teams
- **Integrate seamlessly** with Cursor IDE and Gemini AI API
- **Ensure consistent** and predictable AI behavior for each role

## 📁 Files Structure

```
├── ai-roles-config.yaml          # Main YAML configuration file
├── ai-roles-config.json          # JSON format for programmatic access
├── ai-roles-types.ts             # TypeScript interfaces and types
└── AI_ROLES_README.md            # This documentation file
```

## 🤖 Defined Roles

### 1. Code_Explainer (مفسر الكود)
**Priority:** High  
**Purpose:** يشرح الكود المحدد للمطور سواء بلغة تقنية أو مبسطة

**Responsibilities:**
- تقديم شرح خطوة بخطوة لأي snippet
- توليد تعليقات (Docstrings, Inline comments)
- تبسيط الكود المعقد لفهم أسرع

**Tools:**
- `Cursor_Selection` - Select code in editor
- `Gemini_ExplainCode_API` - AI-powered explanation
- `Documentation_Links` - Reference materials

**Hotkey:** `Ctrl+Shift+E`

---

### 2. Code_Generator (مولد الكود)
**Priority:** High  
**Purpose:** يولّد كود جديد أو يكمل الأكواد الحالية

**Responsibilities:**
- استكمال الكود (Autocomplete)
- توليد وظائف/Classes بناءً على أوامر المستخدم
- اقتراح Patterns جاهزة

**Tools:**
- `Cursor_Editor` - Direct code editing
- `Gemini_CodeGen_API` - AI code generation
- `Local_Project_Context` - Project awareness

**Hotkey:** `Ctrl+Shift+G`

---

### 3. Code_Fixer (مصلح الكود)
**Priority:** Critical  
**Purpose:** يكتشف الأخطاء (Syntax, Logic) ويصلحها

**Responsibilities:**
- تشخيص الأخطاء مباشرة من الـEditor
- اقتراح أو تنفيذ الإصلاحات
- تقديم تفسير لكل إصلاح

**Tools:**
- `Cursor_Debugger` - Built-in debugging
- `Gemini_FixCode_API` - AI-powered fixes
- `Linter/Formatter` - Code quality tools

**Hotkey:** `Ctrl+Shift+F`

---

### 4. Test_Generator (مولد الاختبارات)
**Priority:** High  
**Purpose:** يولّد اختبارات (Unit, Integration) للكود المكتوب

**Responsibilities:**
- إنشاء ملفات اختبار جاهزة
- تغطية الحواف (Edge Cases)
- تشغيل الاختبارات وتحليل النتائج

**Tools:**
- `Cursor_TestRunner` - Test execution
- `Gemini_GenerateTests_API` - AI test generation
- `CI_Integration` - Continuous integration

**Hotkey:** `Ctrl+Shift+T`

---

### 5. Refactor_Assistant (مساعد إعادة الهيكلة)
**Priority:** Medium  
**Purpose:** يساعد في إعادة كتابة الكود ليكون أوضح وأكفأ

**Responsibilities:**
- إعادة تنظيم الكود
- تحسين الأداء
- فرض معايير الكود (PEP8, ESLint, Prettier)

**Tools:**
- `Cursor_Editor` - Code editing capabilities
- `Gemini_Refactor_API` - AI refactoring
- `Project_Linter` - Code standards enforcement

**Hotkey:** `Ctrl+Shift+R`

---

### 6. Knowledge_Advisor (مستشار المعرفة)
**Priority:** Medium  
**Purpose:** يدمج المعرفة الخارجية داخل Cursor IDE

**Responsibilities:**
- البحث عن حلول من StackOverflow/GitHub
- دمج Documentation داخل الـEditor
- توفير روابط سياقية

**Tools:**
- `Gemini_Search_API` - AI-powered search
- `External_Docs` - Documentation integration
- `Cursor_SidePanel` - UI integration

**Hotkey:** `Ctrl+Shift+K`

## ⚙️ Configuration

### Integration Settings

```yaml
integration_settings:
  cursor_ide:
    auto_activation: true
    hotkeys:
      explain: "Ctrl+Shift+E"
      generate: "Ctrl+Shift+G"
      fix: "Ctrl+Shift+F"
      test: "Ctrl+Shift+T"
      refactor: "Ctrl+Shift+R"
      knowledge: "Ctrl+Shift+K"
  
  gemini_api:
    model: "gemini-pro"
    temperature: 0.7
    max_tokens: 2048
    language_preference: "bilingual"
```

### Priority Order

The system follows this priority order for role activation:

1. **Code_Fixer** (Critical) - Error resolution
2. **Code_Generator** (High) - Code creation
3. **Code_Explainer** (High) - Code understanding
4. **Test_Generator** (High) - Test creation
5. **Refactor_Assistant** (Medium) - Code improvement
6. **Knowledge_Advisor** (Medium) - Knowledge lookup

## 🔄 Workflows

### Development Cycle
- **New File** → `Code_Generator` + `Code_Explainer`
- **Error Occurred** → `Code_Fixer` + `Code_Explainer`
- **Test Request** → `Test_Generator` + `Code_Explainer`
- **Optimization Request** → `Refactor_Assistant` + `Code_Explainer`

### Learning Cycle
- **Code Understanding** → `Code_Explainer` + `Knowledge_Advisor`
- **Best Practices** → `Knowledge_Advisor` + `Refactor_Assistant`
- **Documentation** → `Knowledge_Advisor` + `Code_Explainer`

## 🚀 Usage Examples

### Using TypeScript Types

```typescript
import { AIRolesConfiguration, RoleManager } from './ai-roles-types';

// Load configuration
const config: AIRolesConfiguration = await loadConfiguration('ai-roles-config.json');

// Get specific role
const explainerRole = config.roles.find(role => role.name === 'Code_Explainer');

// Activate role
const roleManager: RoleManager = new RoleManager(config);
const response = await roleManager.activateRole({
  role: 'Code_Explainer',
  trigger: 'code_selection',
  context: {
    code_selection: 'function calculateTotal(items) { ... }'
  },
  timestamp: new Date()
});
```

### Using YAML Configuration

```yaml
# Load roles configuration
roles:
  - name: "Code_Explainer"
    activation_triggers:
      - "code_selection"
      - "explain_request"
    tools:
      - "Cursor_Selection"
      - "Gemini_ExplainCode_API"
```

## 🔧 Integration with Cursor IDE

### Setup Steps

1. **Install Required Extensions:**
   ```bash
   # Install Cursor AI extension
   # Configure Gemini API key
   ```

2. **Configure Hotkeys:**
   ```json
   {
     "key": "ctrl+shift+e",
     "command": "ai.explain.code",
     "when": "editorHasSelection"
   }
   ```

3. **Load Configuration:**
   ```javascript
   // Load role configuration
   const config = await loadAIRolesConfig('ai-roles-config.json');
   ```

### API Integration

```javascript
// Example: Activate Code_Explainer role
async function explainCode(selectedCode) {
  const response = await geminiAPI.explain({
    code: selectedCode,
    language: 'javascript',
    context: 'function explanation',
    format: 'markdown_with_code_blocks'
  });
  
  return {
    explanation: response.explanation,
    simplified: response.simplified,
    documentation: response.links
  };
}
```

## 🌐 Bilingual Support

The system supports both Arabic and English languages:

- **Arabic Interface:** Primary language for user interactions
- **English Documentation:** Technical documentation and API references
- **Bilingual Responses:** AI responses in both languages when needed

### Language Configuration

```yaml
gemini_api:
  language_preference: "bilingual"  # Options: arabic, english, bilingual
  response_format: "markdown"
  include_translations: true
```

## 📊 Validation Rules

### Required Fields
- `name` - Role identifier
- `description` - Role purpose
- `responsibilities` - Role duties
- `tools` - Available tools

### Optional Fields
- `english_description` - English translation
- `examples` - Usage examples
- `priority` - Role priority level

### Constraints
- Maximum 10 roles per configuration
- Maximum 10 responsibilities per role
- Maximum 5 tools per role

## 🔍 Testing

### Validation Script

```bash
# Validate configuration
npm run validate-roles

# Test role activation
npm run test-roles

# Integration test
npm run test-cursor-integration
```

### Example Test Cases

```javascript
describe('AI Roles Configuration', () => {
  test('should load valid configuration', async () => {
    const config = await loadConfiguration('ai-roles-config.json');
    expect(config.roles).toHaveLength(6);
  });

  test('should activate Code_Explainer role', async () => {
    const response = await roleManager.activateRole({
      role: 'Code_Explainer',
      trigger: 'code_selection',
      context: { code_selection: 'test code' },
      timestamp: new Date()
    });
    
    expect(response.role).toBe('Code_Explainer');
    expect(response.explanation).toBeDefined();
  });
});
```

## 📝 Contributing

### Adding New Roles

1. **Define Role in YAML:**
   ```yaml
   - name: "New_Role_Name"
     description: "Role description in Arabic"
     english_description: "Role description in English"
     priority: "medium"
     responsibilities: [...]
     tools: [...]
   ```

2. **Add TypeScript Types:**
   ```typescript
   export interface NewRoleType extends AIRole {
     name: 'New_Role_Name';
     // specific properties
   }
   ```

3. **Update Validation Rules:**
   ```yaml
   validation:
     required_fields:
       - "new_required_field"
   ```

### Modifying Existing Roles

1. Update the role definition in both YAML and JSON files
2. Update corresponding TypeScript interfaces
3. Run validation tests
4. Update documentation

## 🐛 Troubleshooting

### Common Issues

1. **Role Not Activating:**
   - Check activation triggers
   - Verify tool availability
   - Check priority configuration

2. **Configuration Loading Error:**
   - Validate YAML/JSON syntax
   - Check required fields
   - Verify file permissions

3. **API Integration Issues:**
   - Verify Gemini API key
   - Check API rate limits
   - Validate request format

### Debug Mode

```javascript
// Enable debug logging
const config = await loadConfiguration('ai-roles-config.json', {
  debug: true,
  verbose: true
});
```

## 📄 License

This configuration system is part of the AuraOS project and follows the same licensing terms.

## 🤝 Support

For support and questions:
- Create an issue in the project repository
- Contact the AuraOS development team
- Check the troubleshooting section above

---

**Last Updated:** 2024  
**Version:** 1.0.0  
**Compatible With:** Cursor IDE, Gemini AI API, AuraOS Framework
