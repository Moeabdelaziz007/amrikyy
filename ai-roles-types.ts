/**
 * AI Development Roles TypeScript Interfaces
 * Provides type safety for AI role configurations in Cursor IDE + Gemini integration
 *
 * @fileoverview Type definitions for AI development roles system
 * @version 1.0.0
 * @author AuraOS Development Team
 */

export interface AIRoleMetadata {
  name: string;
  version: string;
  description: string;
  author: string;
  last_updated: string;
  compatible_with: string[];
}

export interface AIRole {
  name: string;
  description: string;
  english_description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  activation_triggers: string[];
  responsibilities: string[];
  tools: string[];
  output_format: string;
  examples: string[];
}

export interface IntegrationSettings {
  cursor_ide: {
    auto_activation: boolean;
    hotkeys: {
      explain: string;
      generate: string;
      fix: string;
      test: string;
      refactor: string;
      knowledge: string;
    };
  };
  gemini_api: {
    model: string;
    temperature: number;
    max_tokens: number;
    language_preference: 'arabic' | 'english' | 'bilingual';
  };
  output_settings: {
    include_code_blocks: boolean;
    include_explanations: boolean;
    include_links: boolean;
    format: 'markdown' | 'html' | 'plain';
  };
}

export interface WorkflowStep {
  trigger: string;
  roles: string[];
}

export interface Workflows {
  development_cycle: WorkflowStep[];
  learning_cycle: WorkflowStep[];
}

export interface ValidationRules {
  required_fields: string[];
  optional_fields: string[];
  constraints: {
    max_roles: number;
    max_responsibilities_per_role: number;
    max_tools_per_role: number;
  };
}

export interface AIRolesConfiguration {
  metadata: AIRoleMetadata;
  roles: AIRole[];
  configuration: {
    default_role: string;
    fallback_role: string;
    priority_order: string[];
    integration_settings: IntegrationSettings;
  };
  workflows: Workflows;
  validation: ValidationRules;
}

// Role-specific interfaces
export interface CodeExplainerRole extends AIRole {
  name: 'Code_Explainer';
  tools: ['Cursor_Selection', 'Gemini_ExplainCode_API', 'Documentation_Links'];
  output_format: 'markdown_with_code_blocks';
}

export interface CodeGeneratorRole extends AIRole {
  name: 'Code_Generator';
  tools: ['Cursor_Editor', 'Gemini_CodeGen_API', 'Local_Project_Context'];
  output_format: 'executable_code';
}

export interface CodeFixerRole extends AIRole {
  name: 'Code_Fixer';
  tools: ['Cursor_Debugger', 'Gemini_FixCode_API', 'Linter/Formatter'];
  output_format: 'fix_with_explanation';
}

export interface TestGeneratorRole extends AIRole {
  name: 'Test_Generator';
  tools: ['Cursor_TestRunner', 'Gemini_GenerateTests_API', 'CI_Integration'];
  output_format: 'test_files_with_coverage';
}

export interface RefactorAssistantRole extends AIRole {
  name: 'Refactor_Assistant';
  tools: ['Cursor_Editor', 'Gemini_Refactor_API', 'Project_Linter'];
  output_format: 'refactored_code_with_changes';
}

export interface KnowledgeAdvisorRole extends AIRole {
  name: 'Knowledge_Advisor';
  tools: ['Gemini_Search_API', 'External_Docs', 'Cursor_SidePanel'];
  output_format: 'knowledge_summary_with_links';
}

// Union type for all specific roles
export type SpecificAIRole =
  | CodeExplainerRole
  | CodeGeneratorRole
  | CodeFixerRole
  | TestGeneratorRole
  | RefactorAssistantRole
  | KnowledgeAdvisorRole;

// Utility types for role management
export type RoleName = AIRole['name'];
export type RolePriority = AIRole['priority'];
export type ActivationTrigger = string;
export type ToolName = string;

// Event types for role activation
export interface RoleActivationEvent {
  role: RoleName;
  trigger: ActivationTrigger;
  context: {
    file_path?: string;
    code_selection?: string;
    error_message?: string;
    user_request?: string;
  };
  timestamp: Date;
}

// Response types for each role
export interface CodeExplanationResponse {
  role: 'Code_Explainer';
  explanation: string;
  code_blocks: string[];
  documentation_links: string[];
  simplified_version?: string;
}

export interface CodeGenerationResponse {
  role: 'Code_Generator';
  generated_code: string;
  completion_suggestions: string[];
  pattern_recommendations: string[];
}

export interface CodeFixResponse {
  role: 'Code_Fixer';
  fixes: Array<{
    original: string;
    fixed: string;
    explanation: string;
    severity: 'error' | 'warning' | 'suggestion';
  }>;
  diagnostics: string[];
}

export interface TestGenerationResponse {
  role: 'Test_Generator';
  test_files: Array<{
    filename: string;
    content: string;
    test_type: 'unit' | 'integration' | 'e2e';
  }>;
  coverage_analysis: string;
  edge_cases: string[];
}

export interface RefactorResponse {
  role: 'Refactor_Assistant';
  refactored_code: string;
  changes_summary: Array<{
    type: 'rename' | 'extract' | 'optimize' | 'reorganize';
    description: string;
    before: string;
    after: string;
  }>;
  performance_improvements: string[];
}

export interface KnowledgeResponse {
  role: 'Knowledge_Advisor';
  search_results: Array<{
    source: string;
    title: string;
    url: string;
    relevance_score: number;
    excerpt: string;
  }>;
  documentation: string[];
  best_practices: string[];
}

// Union type for all role responses
export type RoleResponse =
  | CodeExplanationResponse
  | CodeGenerationResponse
  | CodeFixResponse
  | TestGenerationResponse
  | RefactorResponse
  | KnowledgeResponse;

// Configuration loader interface
export interface ConfigurationLoader {
  loadFromYAML(path: string): Promise<AIRolesConfiguration>;
  loadFromJSON(path: string): Promise<AIRolesConfiguration>;
  validate(config: AIRolesConfiguration): boolean;
  save(config: AIRolesConfiguration, path: string): Promise<void>;
}

// Role manager interface
export interface RoleManager {
  getRole(name: RoleName): AIRole | undefined;
  getRolesByPriority(priority: RolePriority): AIRole[];
  getRolesByTrigger(trigger: ActivationTrigger): AIRole[];
  activateRole(event: RoleActivationEvent): Promise<RoleResponse>;
  deactivateRole(role: RoleName): void;
  isRoleActive(role: RoleName): boolean;
}

// Constants for role names
export const ROLE_NAMES = {
  CODE_EXPLAINER: 'Code_Explainer',
  CODE_GENERATOR: 'Code_Generator',
  CODE_FIXER: 'Code_Fixer',
  TEST_GENERATOR: 'Test_Generator',
  REFACTOR_ASSISTANT: 'Refactor_Assistant',
  KNOWLEDGE_ADVISOR: 'Knowledge_Advisor',
} as const;

// Constants for priorities
export const ROLE_PRIORITIES = {
  CRITICAL: 'critical',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
} as const;

// Constants for output formats
export const OUTPUT_FORMATS = {
  MARKDOWN_WITH_CODE_BLOCKS: 'markdown_with_code_blocks',
  EXECUTABLE_CODE: 'executable_code',
  FIX_WITH_EXPLANATION: 'fix_with_explanation',
  TEST_FILES_WITH_COVERAGE: 'test_files_with_coverage',
  REFACTORED_CODE_WITH_CHANGES: 'refactored_code_with_changes',
  KNOWLEDGE_SUMMARY_WITH_LINKS: 'knowledge_summary_with_links',
} as const;

// Type guards
export function isCodeExplainerRole(role: AIRole): role is CodeExplainerRole {
  return role.name === 'Code_Explainer';
}

export function isCodeGeneratorRole(role: AIRole): role is CodeGeneratorRole {
  return role.name === 'Code_Generator';
}

export function isCodeFixerRole(role: AIRole): role is CodeFixerRole {
  return role.name === 'Code_Fixer';
}

export function isTestGeneratorRole(role: AIRole): role is TestGeneratorRole {
  return role.name === 'Test_Generator';
}

export function isRefactorAssistantRole(
  role: AIRole
): role is RefactorAssistantRole {
  return role.name === 'Refactor_Assistant';
}

export function isKnowledgeAdvisorRole(
  role: AIRole
): role is KnowledgeAdvisorRole {
  return role.name === 'Knowledge_Advisor';
}

export default AIRolesConfiguration;
