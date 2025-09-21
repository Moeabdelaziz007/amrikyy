// Database Types and API Interfaces for Automation Platform
import { z } from 'zod';

// User Management
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'admin' | 'user' | 'viewer';
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  isActive: boolean;
}

// Workspace Management
export interface Workspace {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  isPublic: boolean;
  isDefault: boolean;
  ownerId: string;
  taskCount: number;
  tags: string[];
  settings: {
    autoSave: boolean;
    notifications: boolean;
    theme: 'light' | 'dark' | 'auto';
    layout: 'grid' | 'list' | 'kanban';
    sortBy: 'name' | 'date' | 'priority' | 'status';
    groupBy: 'none' | 'status' | 'priority' | 'category';
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkspaceMember {
  id: string;
  workspaceId: string;
  userId: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  permissions: string[];
  joinedAt: Date;
  invitedBy: string;
}

// Automation Tasks
export interface AutomationTask {
  id: string;
  name: string;
  description: string;
  workspaceId: string;
  userId: string;
  type: 'workflow' | 'trigger' | 'action' | 'condition' | 'ai' | 'mcp';
  category: 'social_media' | 'email' | 'data' | 'ai' | 'integration' | 'notification';
  status: 'active' | 'inactive' | 'draft' | 'error' | 'running' | 'paused';
  priority: 'low' | 'medium' | 'high' | 'critical';
  tags: string[];
  config: Record<string, any>;
  schedule?: {
    enabled: boolean;
    cron: string;
    timezone: string;
    nextRun?: Date;
  };
  dependencies: string[];
  variables: Record<string, any>;
  aiOptimized: boolean;
  mcpEnabled: boolean;
  complexity: 'simple' | 'intermediate' | 'advanced';
  executionCount: number;
  successRate: number;
  avgDuration: number;
  lastRun?: Date;
  nextRun?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Task Execution History
export interface TaskExecution {
  id: string;
  taskId: string;
  userId: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled' | 'retrying';
  startedAt: Date;
  completedAt?: Date;
  duration?: number;
  input?: Record<string, any>;
  output?: Record<string, any>;
  error?: {
    message: string;
    stack?: string;
    code?: string;
  };
  retryCount: number;
  maxRetries: number;
  metrics: {
    cpuUsage: number;
    memoryUsage: number;
    networkIO: number;
    diskIO: number;
  };
  logs: ExecutionLog[];
}

export interface ExecutionLog {
  id: string;
  executionId: string;
  timestamp: Date;
  level: 'info' | 'warning' | 'error' | 'debug';
  message: string;
  source: string;
  data?: Record<string, any>;
}

// MCP Tools
export interface MCPTool {
  id: string;
  name: string;
  description: string;
  category: 'development' | 'data' | 'database' | 'web' | 'ai' | 'automation' | 'integration';
  icon: string;
  version: string;
  status: 'active' | 'inactive' | 'error' | 'updating';
  capabilities: string[];
  usage: number;
  lastUsed: Date;
  performance: {
    avgResponseTime: number;
    successRate: number;
    errorRate: number;
    uptime: number;
    resourceUsage: {
      cpu: number;
      memory: number;
      storage: number;
    };
  };
  settings: {
    autoUpdate: boolean;
    notifications: boolean;
    logging: boolean;
    rateLimit: number;
    timeout: number;
    retryAttempts: number;
    security: {
      encryption: boolean;
      authentication: boolean;
      authorization: boolean;
    };
  };
  dependencies: string[];
  integrations: ToolIntegration[];
  documentation: string;
  examples: ToolExample[];
  isOfficial: boolean;
  isVerified: boolean;
  rating: number;
  downloads: number;
  author: {
    id: string;
    name: string;
    avatar: string;
    verified: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface ToolIntegration {
  id: string;
  toolId: string;
  name: string;
  type: 'api' | 'webhook' | 'database' | 'file' | 'message';
  status: 'connected' | 'disconnected' | 'error';
  config: Record<string, any>;
  lastSync: Date;
  userId: string;
}

export interface ToolExample {
  id: string;
  toolId: string;
  name: string;
  description: string;
  code: string;
  language: string;
  complexity: 'simple' | 'intermediate' | 'advanced';
  successRate: number;
  performance: {
    executionTime: number;
    resourceUsage: number;
    accuracy: number;
  };
}

// AI Workflow Optimizer
export interface WorkflowSuggestion {
  id: string;
  title: string;
  description: string;
  category: 'optimization' | 'automation' | 'integration' | 'performance' | 'security' | 'scalability';
  priority: 'low' | 'medium' | 'high' | 'critical';
  impact: 'low' | 'medium' | 'high' | 'transformational';
  effort: 'low' | 'medium' | 'high' | 'extensive';
  confidence: number;
  estimatedSavings: {
    time: number;
    cost: number;
    resources: number;
  };
  implementation: {
    steps: string[];
    requirements: string[];
    timeline: string;
    dependencies: string[];
  };
  aiReasoning: string;
  examples: WorkflowExample[];
  tags: string[];
  applicableTasks: string[];
  userId: string;
  applied: boolean;
  appliedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkflowExample {
  id: string;
  suggestionId: string;
  name: string;
  description: string;
  code: string;
  language: string;
  complexity: 'simple' | 'intermediate' | 'advanced';
  successRate: number;
  performance: {
    executionTime: number;
    resourceUsage: number;
    accuracy: number;
  };
}

export interface OptimizationResult {
  id: string;
  taskId: string;
  userId: string;
  before: {
    executionTime: number;
    resourceUsage: number;
    errorRate: number;
    cost: number;
  };
  after: {
    executionTime: number;
    resourceUsage: number;
    errorRate: number;
    cost: number;
  };
  improvements: {
    timeSaved: number;
    resourceSaved: number;
    errorReduction: number;
    costReduction: number;
  };
  aiInsights: string[];
  recommendations: string[];
  appliedAt: Date;
}

// Workflow Builder
export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  userId: string;
  isPublic: boolean;
  isOfficial: boolean;
  nodes: WorkflowNode[];
  connections: WorkflowConnection[];
  variables: WorkflowVariable[];
  settings: WorkflowSettings;
  metadata: {
    version: string;
    author: string;
    createdAt: Date;
    updatedAt: Date;
    tags: string[];
    downloads: number;
    rating: number;
  };
}

export interface WorkflowNode {
  id: string;
  workflowId: string;
  type: 'trigger' | 'action' | 'condition' | 'delay' | 'webhook' | 'ai' | 'data' | 'loop' | 'merge';
  name: string;
  description: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  config: Record<string, any>;
  inputs: NodePort[];
  outputs: NodePort[];
  status: 'idle' | 'running' | 'success' | 'error' | 'warning';
  data: any;
  isLocked: boolean;
  isCollapsed: boolean;
}

export interface NodePort {
  id: string;
  nodeId: string;
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'any';
  required: boolean;
  defaultValue?: any;
  description: string;
}

export interface WorkflowConnection {
  id: string;
  workflowId: string;
  sourceNodeId: string;
  sourcePortId: string;
  targetNodeId: string;
  targetPortId: string;
  type: 'data' | 'control' | 'conditional';
  label?: string;
  isActive: boolean;
  conditions?: Record<string, any>;
}

export interface WorkflowVariable {
  id: string;
  workflowId: string;
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  value: any;
  description: string;
  isGlobal: boolean;
  scope: string;
}

export interface WorkflowSettings {
  workflowId: string;
  name: string;
  description: string;
  version: string;
  timeout: number;
  retryAttempts: number;
  parallelExecution: boolean;
  errorHandling: 'stop' | 'continue' | 'retry';
  logging: boolean;
  notifications: boolean;
  scheduling?: {
    enabled: boolean;
    cron: string;
    timezone: string;
  };
}

// System Monitoring
export interface SystemHealth {
  id: string;
  overall: 'healthy' | 'warning' | 'critical';
  components: {
    cpu: MonitoringMetric;
    memory: MonitoringMetric;
    disk: MonitoringMetric;
    network: MonitoringMetric;
    database: MonitoringMetric;
    queue: MonitoringMetric;
  };
  alerts: SystemAlert[];
  timestamp: Date;
}

export interface MonitoringMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
  threshold: {
    warning: number;
    critical: number;
  };
  status: 'healthy' | 'warning' | 'critical';
  timestamp: Date;
  history: Array<{
    timestamp: Date;
    value: number;
  }>;
}

export interface SystemAlert {
  id: string;
  type: 'info' | 'warning' | 'error' | 'critical';
  title: string;
  message: string;
  timestamp: Date;
  source: string;
  resolved: boolean;
  resolvedAt?: Date;
  resolvedBy?: string;
  actions: string[];
  userId?: string;
}

// API Request/Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  filters?: Record<string, any>;
}

// Validation Schemas
export const CreateWorkspaceSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500),
  color: z.string().regex(/^#[0-9A-F]{6}$/i),
  icon: z.string().min(1),
  isPublic: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
});

export const CreateTaskSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(1000),
  workspaceId: z.string().uuid(),
  type: z.enum(['workflow', 'trigger', 'action', 'condition', 'ai', 'mcp']),
  category: z.enum(['social_media', 'email', 'data', 'ai', 'integration', 'notification']),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
  tags: z.array(z.string()).default([]),
  config: z.record(z.any()).default({}),
  schedule: z.object({
    enabled: z.boolean(),
    cron: z.string(),
    timezone: z.string(),
  }).optional(),
  variables: z.record(z.any()).default({}),
});

export const CreateWorkflowSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(1000),
  category: z.string(),
  isPublic: z.boolean().default(false),
  nodes: z.array(z.any()),
  connections: z.array(z.any()),
  variables: z.array(z.any()).default([]),
  settings: z.object({
    name: z.string(),
    description: z.string(),
    version: z.string(),
    timeout: z.number().min(1).max(3600),
    retryAttempts: z.number().min(0).max(10),
    parallelExecution: z.boolean(),
    errorHandling: z.enum(['stop', 'continue', 'retry']),
    logging: z.boolean(),
    notifications: z.boolean(),
  }),
});

export const UpdateTaskStatusSchema = z.object({
  status: z.enum(['active', 'inactive', 'draft', 'error', 'running', 'paused']),
  reason: z.string().optional(),
});

export const ExecuteTaskSchema = z.object({
  taskId: z.string().uuid(),
  input: z.record(z.any()).optional(),
  variables: z.record(z.any()).optional(),
});

export const CreateSuggestionSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(1000),
  category: z.enum(['optimization', 'automation', 'integration', 'performance', 'security', 'scalability']),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
  impact: z.enum(['low', 'medium', 'high', 'transformational']),
  effort: z.enum(['low', 'medium', 'high', 'extensive']),
  confidence: z.number().min(0).max(1),
  estimatedSavings: z.object({
    time: z.number(),
    cost: z.number(),
    resources: z.number(),
  }),
  implementation: z.object({
    steps: z.array(z.string()),
    requirements: z.array(z.string()),
    timeline: z.string(),
    dependencies: z.array(z.string()),
  }),
  aiReasoning: z.string(),
  tags: z.array(z.string()).default([]),
  applicableTasks: z.array(z.string()).default([]),
});
