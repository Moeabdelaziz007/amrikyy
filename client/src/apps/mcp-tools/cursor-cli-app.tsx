'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.default = CursorCLIApp;
const react_1 = require('react');
const card_1 = require('@/components/ui/card');
const button_1 = require('@/components/ui/button');
const input_1 = require('@/components/ui/input');
const textarea_1 = require('@/components/ui/textarea');
const select_1 = require('@/components/ui/select');
const badge_1 = require('@/components/ui/badge');
const alert_1 = require('@/components/ui/alert');
const lucide_react_1 = require('lucide-react');
function CursorCLIApp({ onExecute }) {
  const [command, setCommand] = (0, react_1.useState)('');
  const [model, setModel] = (0, react_1.useState)('claude-3.5-sonnet');
  const [operationType, setOperationType] = (0, react_1.useState)('explain');
  const [context, setContext] = (0, react_1.useState)('');
  const [filePath, setFilePath] = (0, react_1.useState)('');
  const [isLoading, setIsLoading] = (0, react_1.useState)(false);
  const [result, setResult] = (0, react_1.useState)(null);
  const handleExecute = async () => {
    if (!command.trim()) return;
    setIsLoading(true);
    try {
      // Simulate Cursor CLI execution
      await new Promise(resolve =>
        setTimeout(resolve, Math.random() * 2000 + 1000)
      );
      const mockResult = {
        success: true,
        model,
        operation_type: operationType,
        command,
        context: context || 'No additional context provided',
        file_path: filePath || 'No specific file targeted',
        output: generateCursorCLIOutput(operationType, command),
        timestamp: new Date().toISOString(),
        execution_time_ms: Math.floor(Math.random() * 2000) + 500,
        suggestions: [
          'Consider implementing the suggested improvements',
          'Run tests to verify functionality',
          'Review the generated code for your specific use case',
          'Add proper error handling if not already present',
        ],
      };
      setResult(mockResult);
      onExecute?.(mockResult);
    } catch (error) {
      setResult({
        success: false,
        error: 'Failed to execute Cursor CLI command',
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsLoading(false);
    }
  };
  const generateCursorCLIOutput = (operation, cmd) => {
    const responses = {
      explain: `**Code Explanation:**\n\n${cmd}\n\nThis code appears to be implementing an ${operation} operation. Here's what it does:\n\n1. **Purpose**: The code is designed to ${cmd.toLowerCase()}\n2. **Key Components**: \n   - Main logic handles the core functionality\n   - Error handling ensures robustness\n   - Performance optimizations are in place\n\n3. **Flow**: The execution follows a logical sequence that ensures proper data handling and user experience.\n\n**Recommendations:**\n- Consider adding more detailed comments\n- Implement additional error handling for edge cases\n- Add unit tests for better coverage`,
      refactor: `**Refactoring Suggestions:**\n\nFor: ${cmd}\n\n**Current Issues Identified:**\n- Code duplication detected\n- Complex nested conditions\n- Missing error handling\n\n**Proposed Refactoring:**\n\n\`\`\`typescript\n// Refactored version\nfunction optimizedFunction() {\n  // Simplified logic\n  // Better error handling\n  // Improved readability\n}\n\`\`\`\n\n**Benefits:**\n- 40% reduction in code complexity\n- Improved maintainability\n- Better performance\n- Enhanced readability`,
      debug: `**Debug Analysis:**\n\nIssue: ${cmd}\n\n**Potential Problems:**\n1. **Null Reference**: Possible undefined variable access\n2. **Type Mismatch**: Inconsistent data types\n3. **Logic Error**: Incorrect conditional statement\n\n**Debugging Steps:**\n1. Add console.log statements at key points\n2. Check variable values before operations\n3. Verify data types and structures\n4. Test edge cases\n\n**Suggested Fix:**\n\`\`\`typescript\n// Add proper null checks\nif (variable && variable.property) {\n  // Safe operation\n}\n\`\`\``,
      optimize: `**Performance Optimization:**\n\nTarget: ${cmd}\n\n**Current Performance Issues:**\n- O(n²) time complexity detected\n- Memory leaks in event handlers\n- Inefficient DOM queries\n\n**Optimization Strategies:**\n\n1. **Algorithm Optimization:**\n   - Replace nested loops with hash maps\n   - Use memoization for repeated calculations\n   - Implement lazy loading\n\n2. **Memory Management:**\n   - Remove event listeners properly\n   - Use WeakMap for object references\n   - Implement object pooling\n\n3. **Rendering Optimization:**\n   - Use virtual scrolling\n   - Implement debouncing\n   - Batch DOM updates\n\n**Expected Improvements:**\n- 60% faster execution time\n- 50% reduction in memory usage\n- Smoother user experience`,
      generate: `**Code Generation:**\n\nRequest: ${cmd}\n\n**Generated Implementation:**\n\n\`\`\`typescript\n// Generated code based on requirements\ninterface GeneratedInterface {\n  id: string;\n  name: string;\n  createdAt: Date;\n}\n\nclass GeneratedClass {\n  private data: GeneratedInterface[] = [];\n\n  constructor(private config: Config) {\n    this.initialize();\n  }\n\n  private initialize(): void {\n    // Initialization logic\n  }\n\n  public processData(input: any): GeneratedInterface[] {\n    // Processing logic\n    return this.data;\n  }\n\n  private validateInput(input: any): boolean {\n    // Validation logic\n    return true;\n  }\n}\n\`\`\`\n\n**Features Included:**\n- TypeScript interfaces\n- Error handling\n- Input validation\n- Clean architecture\n- Documentation`,
      review: `**Code Review:**\n\nReviewing: ${cmd}\n\n**Overall Assessment:** ⭐⭐⭐⭐☆ (4/5)\n\n**Strengths:**\n✅ Clean, readable code structure\n✅ Proper error handling\n✅ Good naming conventions\n✅ Appropriate use of TypeScript features\n\n**Areas for Improvement:**\n⚠️ Missing unit tests\n⚠️ Some functions could be more modular\n⚠️ Consider adding JSDoc comments\n⚠️ Magic numbers should be constants\n\n**Security Considerations:**\n🔒 Input validation looks good\n🔒 No obvious security vulnerabilities\n🔒 Proper sanitization implemented\n\n**Performance Notes:**\n⚡ Efficient algorithms used\n⚡ Memory usage is reasonable\n⚡ No obvious performance bottlenecks`,
      test: `**Test Generation:**\n\nFor: ${cmd}\n\n**Generated Test Suite:**\n\n\`\`\`typescript\nimport { describe, it, expect, beforeEach, jest } from '@jest/globals';\nimport { FunctionToTest } from './function-to-test';\n\ndescribe('FunctionToTest', () => {\n  let instance: FunctionToTest;\n\n  beforeEach(() => {\n    instance = new FunctionToTest();\n  });\n\n  describe('basic functionality', () => {\n    it('should handle normal input correctly', () => {\n      const input = 'test input';\n      const result = instance.process(input);\n      expect(result).toBeDefined();\n      expect(result.success).toBe(true);\n    });\n\n    it('should handle edge cases', () => {\n      const result = instance.process(null);\n      expect(result.error).toBeDefined();\n    });\n\n    it('should handle empty input', () => {\n      const result = instance.process('');\n      expect(result).toEqual({ success: false, error: 'Empty input' });\n    });\n  });\n\n  describe('error handling', () => {\n    it('should throw error for invalid input', () => {\n      expect(() => instance.process(undefined)).toThrow();\n    });\n  });\n});\n\`\`\`\n\n**Test Coverage:**\n- ✅ Happy path scenarios\n- ✅ Edge cases\n- ✅ Error conditions\n- ✅ Input validation\n- ✅ Output verification`,
    };
    return responses[operation] || responses.explain;
  };
  return (
    <div className="space-y-6">
      <card_1.Card className="glass-card">
        <card_1.CardHeader>
          <card_1.CardTitle className="flex items-center gap-2">
            <lucide_react_1.Code className="w-5 h-5 text-primary" />
            Cursor CLI
          </card_1.CardTitle>
          <p className="text-sm text-muted-foreground">
            Execute commands to LLMs via Cursor CLI with advanced capabilities
          </p>
        </card_1.CardHeader>
        <card_1.CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Command <span className="text-red-500">*</span>
            </label>
            <input_1.Input
              placeholder="Enter your command (e.g., 'explain this React component')"
              value={command}
              onChange={e => setCommand(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Model</label>
              <select_1.Select value={model} onValueChange={setModel}>
                <select_1.SelectTrigger>
                  <select_1.SelectValue />
                </select_1.SelectTrigger>
                <select_1.SelectContent>
                  <select_1.SelectItem value="claude-3.5-sonnet">
                    Claude 3.5 Sonnet
                  </select_1.SelectItem>
                  <select_1.SelectItem value="gpt-4">GPT-4</select_1.SelectItem>
                  <select_1.SelectItem value="claude-3-opus">
                    Claude 3 Opus
                  </select_1.SelectItem>
                </select_1.SelectContent>
              </select_1.Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Operation Type</label>
              <select_1.Select
                value={operationType}
                onValueChange={setOperationType}
              >
                <select_1.SelectTrigger>
                  <select_1.SelectValue />
                </select_1.SelectTrigger>
                <select_1.SelectContent>
                  <select_1.SelectItem value="explain">
                    Explain
                  </select_1.SelectItem>
                  <select_1.SelectItem value="refactor">
                    Refactor
                  </select_1.SelectItem>
                  <select_1.SelectItem value="debug">Debug</select_1.SelectItem>
                  <select_1.SelectItem value="optimize">
                    Optimize
                  </select_1.SelectItem>
                  <select_1.SelectItem value="generate">
                    Generate
                  </select_1.SelectItem>
                  <select_1.SelectItem value="review">
                    Review
                  </select_1.SelectItem>
                  <select_1.SelectItem value="test">Test</select_1.SelectItem>
                </select_1.SelectContent>
              </select_1.Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Context (Optional)</label>
            <textarea_1.Textarea
              placeholder="Additional context for the command"
              value={context}
              onChange={e => setContext(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">File Path (Optional)</label>
            <input_1.Input
              placeholder="Path to the file to operate on"
              value={filePath}
              onChange={e => setFilePath(e.target.value)}
            />
          </div>

          <button_1.Button
            onClick={handleExecute}
            disabled={isLoading || !command.trim()}
            className="w-full gradient-cyber-primary hover:gradient-cyber-secondary"
          >
            {isLoading ? (
              <>
                <lucide_react_1.Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Executing...
              </>
            ) : (
              <>
                <lucide_react_1.Play className="w-4 h-4 mr-2" />
                Execute Command
              </>
            )}
          </button_1.Button>
        </card_1.CardContent>
      </card_1.Card>

      {result && (
        <card_1.Card className="glass-card">
          <card_1.CardHeader>
            <card_1.CardTitle className="flex items-center gap-2">
              {result.success ? (
                <lucide_react_1.CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <lucide_react_1.XCircle className="w-5 h-5 text-red-500" />
              )}
              Execution Results
            </card_1.CardTitle>
          </card_1.CardHeader>
          <card_1.CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <badge_1.Badge
                  variant={result.success ? 'default' : 'destructive'}
                >
                  {result.success ? 'Success' : 'Error'}
                </badge_1.Badge>
                <span className="text-sm text-muted-foreground">
                  {result.execution_time_ms}ms
                </span>
                <span className="text-sm text-muted-foreground">
                  Model: {result.model}
                </span>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <pre className="text-sm whitespace-pre-wrap">
                  {result.output || result.error}
                </pre>
              </div>

              {result.suggestions && (
                <div>
                  <h4 className="font-medium mb-2">Suggestions:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {result.suggestions.map((suggestion, index) => (
                      <li key={index}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </card_1.CardContent>
        </card_1.Card>
      )}

      <alert_1.Alert>
        <lucide_react_1.Brain className="h-4 w-4" />
        <alert_1.AlertDescription>
          Cursor CLI provides advanced AI-powered code analysis, refactoring,
          debugging, and generation capabilities. All operations are simulated
          for demonstration purposes.
        </alert_1.AlertDescription>
      </alert_1.Alert>
    </div>
  );
}
