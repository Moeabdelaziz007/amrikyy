// Database Schema for Automation Platform
import {
  pgTable,
  text,
  timestamp,
  uuid,
  jsonb,
  boolean,
  integer,
  real,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const userRoleEnum = pgEnum('user_role', ['admin', 'user', 'viewer']);
export const taskTypeEnum = pgEnum('task_type', [
  'workflow',
  'trigger',
  'action',
  'condition',
  'ai',
  'mcp',
]);
export const taskCategoryEnum = pgEnum('task_category', [
  'social_media',
  'email',
  'data',
  'ai',
  'integration',
  'notification',
]);
export const taskStatusEnum = pgEnum('task_status', [
  'active',
  'inactive',
  'draft',
  'error',
  'running',
  'paused',
]);
export const taskPriorityEnum = pgEnum('task_priority', [
  'low',
  'medium',
  'high',
  'critical',
]);
export const executionStatusEnum = pgEnum('execution_status', [
  'pending',
  'running',
  'completed',
  'failed',
  'cancelled',
  'retrying',
]);
export const logLevelEnum = pgEnum('log_level', [
  'info',
  'warning',
  'error',
  'debug',
]);
export const mcpToolCategoryEnum = pgEnum('mcp_tool_category', [
  'development',
  'data',
  'database',
  'web',
  'ai',
  'automation',
  'integration',
]);
export const mcpToolStatusEnum = pgEnum('mcp_tool_status', [
  'active',
  'inactive',
  'error',
  'updating',
]);
export const suggestionCategoryEnum = pgEnum('suggestion_category', [
  'optimization',
  'automation',
  'integration',
  'performance',
  'security',
  'scalability',
]);
export const suggestionPriorityEnum = pgEnum('suggestion_priority', [
  'low',
  'medium',
  'high',
  'critical',
]);
export const suggestionImpactEnum = pgEnum('suggestion_impact', [
  'low',
  'medium',
  'high',
  'transformational',
]);
export const suggestionEffortEnum = pgEnum('suggestion_effort', [
  'low',
  'medium',
  'high',
  'extensive',
]);
export const alertTypeEnum = pgEnum('alert_type', [
  'info',
  'warning',
  'error',
  'critical',
]);
export const healthStatusEnum = pgEnum('health_status', [
  'healthy',
  'warning',
  'critical',
]);
export const trendEnum = pgEnum('trend', ['up', 'down', 'stable']);
export const workspaceRoleEnum = pgEnum('workspace_role', [
  'owner',
  'admin',
  'editor',
  'viewer',
]);
export const nodeTypeEnum = pgEnum('node_type', [
  'trigger',
  'action',
  'condition',
  'delay',
  'webhook',
  'ai',
  'data',
  'loop',
  'merge',
]);
export const nodeStatusEnum = pgEnum('node_status', [
  'idle',
  'running',
  'success',
  'error',
  'warning',
]);
export const portTypeEnum = pgEnum('port_type', [
  'string',
  'number',
  'boolean',
  'object',
  'array',
  'any',
]);
export const connectionTypeEnum = pgEnum('connection_type', [
  'data',
  'control',
  'conditional',
]);
export const themeEnum = pgEnum('theme', ['light', 'dark', 'auto']);
export const layoutEnum = pgEnum('layout', ['grid', 'list', 'kanban']);
export const sortByEnum = pgEnum('sort_by', [
  'name',
  'date',
  'priority',
  'status',
]);
export const groupByEnum = pgEnum('group_by', [
  'none',
  'status',
  'priority',
  'category',
]);
export const errorHandlingEnum = pgEnum('error_handling', [
  'stop',
  'continue',
  'retry',
]);

// Users table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  avatar: text('avatar'),
  role: userRoleEnum('role').notNull().default('user'),
  permissions: jsonb('permissions').$type<string[]>().default([]),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  lastLoginAt: timestamp('last_login_at'),
  isActive: boolean('is_active').notNull().default(true),
});

// Workspaces table
export const workspaces = pgTable('workspaces', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description'),
  color: text('color').notNull().default('#3B82F6'),
  icon: text('icon').notNull().default('📁'),
  isPublic: boolean('is_public').notNull().default(false),
  isDefault: boolean('is_default').notNull().default(false),
  ownerId: uuid('owner_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  taskCount: integer('task_count').notNull().default(0),
  tags: jsonb('tags').$type<string[]>().default([]),
  settings: jsonb('settings')
    .$type<{
      autoSave: boolean;
      notifications: boolean;
      theme: 'light' | 'dark' | 'auto';
      layout: 'grid' | 'list' | 'kanban';
      sortBy: 'name' | 'date' | 'priority' | 'status';
      groupBy: 'none' | 'status' | 'priority' | 'category';
    }>()
    .notNull()
    .default({
      autoSave: true,
      notifications: true,
      theme: 'light',
      layout: 'grid',
      sortBy: 'name',
      groupBy: 'none',
    }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Workspace members table
export const workspaceMembers = pgTable('workspace_members', {
  id: uuid('id').primaryKey().defaultRandom(),
  workspaceId: uuid('workspace_id')
    .notNull()
    .references(() => workspaces.id, { onDelete: 'cascade' }),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  role: workspaceRoleEnum('role').notNull().default('viewer'),
  permissions: jsonb('permissions').$type<string[]>().default([]),
  joinedAt: timestamp('joined_at').notNull().defaultNow(),
  invitedBy: uuid('invited_by').references(() => users.id),
});

// Automation tasks table
export const automationTasks = pgTable('automation_tasks', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description'),
  workspaceId: uuid('workspace_id')
    .notNull()
    .references(() => workspaces.id, { onDelete: 'cascade' }),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  type: taskTypeEnum('type').notNull(),
  category: taskCategoryEnum('category').notNull(),
  status: taskStatusEnum('status').notNull().default('draft'),
  priority: taskPriorityEnum('priority').notNull().default('medium'),
  tags: jsonb('tags').$type<string[]>().default([]),
  config: jsonb('config').$type<Record<string, any>>().default({}),
  schedule: jsonb('schedule').$type<{
    enabled: boolean;
    cron: string;
    timezone: string;
    nextRun?: Date;
  }>(),
  dependencies: jsonb('dependencies').$type<string[]>().default([]),
  variables: jsonb('variables').$type<Record<string, any>>().default({}),
  aiOptimized: boolean('ai_optimized').notNull().default(false),
  mcpEnabled: boolean('mcp_enabled').notNull().default(false),
  complexity: text('complexity').notNull().default('simple'), // 'simple' | 'intermediate' | 'advanced'
  executionCount: integer('execution_count').notNull().default(0),
  successRate: real('success_rate').notNull().default(0),
  avgDuration: integer('avg_duration').notNull().default(0), // in milliseconds
  lastRun: timestamp('last_run'),
  nextRun: timestamp('next_run'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Task executions table
export const taskExecutions = pgTable('task_executions', {
  id: uuid('id').primaryKey().defaultRandom(),
  taskId: uuid('task_id')
    .notNull()
    .references(() => automationTasks.id, { onDelete: 'cascade' }),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  status: executionStatusEnum('status').notNull().default('pending'),
  startedAt: timestamp('started_at').notNull().defaultNow(),
  completedAt: timestamp('completed_at'),
  duration: integer('duration'), // in milliseconds
  input: jsonb('input').$type<Record<string, any>>(),
  output: jsonb('output').$type<Record<string, any>>(),
  error: jsonb('error').$type<{
    message: string;
    stack?: string;
    code?: string;
  }>(),
  retryCount: integer('retry_count').notNull().default(0),
  maxRetries: integer('max_retries').notNull().default(3),
  metrics: jsonb('metrics')
    .$type<{
      cpuUsage: number;
      memoryUsage: number;
      networkIO: number;
      diskIO: number;
    }>()
    .notNull()
    .default({
      cpuUsage: 0,
      memoryUsage: 0,
      networkIO: 0,
      diskIO: 0,
    }),
});

// Execution logs table
export const executionLogs = pgTable('execution_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  executionId: uuid('execution_id')
    .notNull()
    .references(() => taskExecutions.id, { onDelete: 'cascade' }),
  timestamp: timestamp('timestamp').notNull().defaultNow(),
  level: logLevelEnum('level').notNull().default('info'),
  message: text('message').notNull(),
  source: text('source').notNull(),
  data: jsonb('data').$type<Record<string, any>>(),
});

// MCP tools table
export const mcpTools = pgTable('mcp_tools', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  category: mcpToolCategoryEnum('category').notNull(),
  icon: text('icon').notNull(),
  version: text('version').notNull(),
  status: mcpToolStatusEnum('status').notNull().default('inactive'),
  capabilities: jsonb('capabilities').$type<string[]>().notNull().default([]),
  usage: integer('usage').notNull().default(0), // percentage
  lastUsed: timestamp('last_used').notNull().defaultNow(),
  performance: jsonb('performance')
    .$type<{
      avgResponseTime: number;
      successRate: number;
      errorRate: number;
      uptime: number;
      resourceUsage: {
        cpu: number;
        memory: number;
        storage: number;
      };
    }>()
    .notNull()
    .default({
      avgResponseTime: 0,
      successRate: 0,
      errorRate: 0,
      uptime: 0,
      resourceUsage: { cpu: 0, memory: 0, storage: 0 },
    }),
  settings: jsonb('settings')
    .$type<{
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
    }>()
    .notNull()
    .default({
      autoUpdate: true,
      notifications: true,
      logging: true,
      rateLimit: 1000,
      timeout: 30000,
      retryAttempts: 3,
      security: { encryption: true, authentication: true, authorization: true },
    }),
  dependencies: jsonb('dependencies').$type<string[]>().default([]),
  integrations: jsonb('integrations').$type<any[]>().default([]),
  documentation: text('documentation'),
  examples: jsonb('examples').$type<any[]>().default([]),
  isOfficial: boolean('is_official').notNull().default(false),
  isVerified: boolean('is_verified').notNull().default(false),
  rating: real('rating').notNull().default(0),
  downloads: integer('downloads').notNull().default(0),
  author: jsonb('author')
    .$type<{
      id: string;
      name: string;
      avatar: string;
      verified: boolean;
    }>()
    .notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Tool integrations table
export const toolIntegrations = pgTable('tool_integrations', {
  id: uuid('id').primaryKey().defaultRandom(),
  toolId: uuid('tool_id')
    .notNull()
    .references(() => mcpTools.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  type: text('type').notNull(), // 'api' | 'webhook' | 'database' | 'file' | 'message'
  status: text('status').notNull().default('disconnected'), // 'connected' | 'disconnected' | 'error'
  config: jsonb('config').$type<Record<string, any>>().default({}),
  lastSync: timestamp('last_sync').notNull().defaultNow(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
});

// Workflow suggestions table
export const workflowSuggestions = pgTable('workflow_suggestions', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  category: suggestionCategoryEnum('category').notNull(),
  priority: suggestionPriorityEnum('priority').notNull().default('medium'),
  impact: suggestionImpactEnum('impact').notNull().default('medium'),
  effort: suggestionEffortEnum('effort').notNull().default('medium'),
  confidence: real('confidence').notNull().default(0), // 0-1
  estimatedSavings: jsonb('estimated_savings')
    .$type<{
      time: number;
      cost: number;
      resources: number;
    }>()
    .notNull()
    .default({ time: 0, cost: 0, resources: 0 }),
  implementation: jsonb('implementation')
    .$type<{
      steps: string[];
      requirements: string[];
      timeline: string;
      dependencies: string[];
    }>()
    .notNull(),
  aiReasoning: text('ai_reasoning').notNull(),
  examples: jsonb('examples').$type<any[]>().default([]),
  tags: jsonb('tags').$type<string[]>().default([]),
  applicableTasks: jsonb('applicable_tasks').$type<string[]>().default([]),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  applied: boolean('applied').notNull().default(false),
  appliedAt: timestamp('applied_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Optimization results table
export const optimizationResults = pgTable('optimization_results', {
  id: uuid('id').primaryKey().defaultRandom(),
  taskId: uuid('task_id')
    .notNull()
    .references(() => automationTasks.id, { onDelete: 'cascade' }),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  before: jsonb('before')
    .$type<{
      executionTime: number;
      resourceUsage: number;
      errorRate: number;
      cost: number;
    }>()
    .notNull(),
  after: jsonb('after')
    .$type<{
      executionTime: number;
      resourceUsage: number;
      errorRate: number;
      cost: number;
    }>()
    .notNull(),
  improvements: jsonb('improvements')
    .$type<{
      timeSaved: number;
      resourceSaved: number;
      errorReduction: number;
      costReduction: number;
    }>()
    .notNull(),
  aiInsights: jsonb('ai_insights').$type<string[]>().default([]),
  recommendations: jsonb('recommendations').$type<string[]>().default([]),
  appliedAt: timestamp('applied_at').notNull().defaultNow(),
});

// Workflow templates table
export const workflowTemplates = pgTable('workflow_templates', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  category: text('category').notNull(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  isPublic: boolean('is_public').notNull().default(false),
  isOfficial: boolean('is_official').notNull().default(false),
  nodes: jsonb('nodes').$type<any[]>().default([]),
  connections: jsonb('connections').$type<any[]>().default([]),
  variables: jsonb('variables').$type<any[]>().default([]),
  settings: jsonb('settings')
    .$type<{
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
    }>()
    .notNull(),
  metadata: jsonb('metadata')
    .$type<{
      version: string;
      author: string;
      createdAt: Date;
      updatedAt: Date;
      tags: string[];
      downloads: number;
      rating: number;
    }>()
    .notNull(),
});

// System health table
export const systemHealth = pgTable('system_health', {
  id: uuid('id').primaryKey().defaultRandom(),
  overall: healthStatusEnum('overall').notNull().default('healthy'),
  components: jsonb('components')
    .$type<{
      cpu: any;
      memory: any;
      disk: any;
      network: any;
      database: any;
      queue: any;
    }>()
    .notNull(),
  alerts: jsonb('alerts').$type<any[]>().default([]),
  timestamp: timestamp('timestamp').notNull().defaultNow(),
});

// Monitoring metrics table
export const monitoringMetrics = pgTable('monitoring_metrics', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  value: real('value').notNull(),
  unit: text('unit').notNull(),
  trend: trendEnum('trend').notNull().default('stable'),
  change: real('change').notNull().default(0),
  threshold: jsonb('threshold')
    .$type<{
      warning: number;
      critical: number;
    }>()
    .notNull(),
  status: healthStatusEnum('status').notNull().default('healthy'),
  timestamp: timestamp('timestamp').notNull().defaultNow(),
  history: jsonb('history')
    .$type<
      Array<{
        timestamp: Date;
        value: number;
      }>
    >()
    .default([]),
});

// System alerts table
export const systemAlerts = pgTable('system_alerts', {
  id: uuid('id').primaryKey().defaultRandom(),
  type: alertTypeEnum('type').notNull().default('info'),
  title: text('title').notNull(),
  message: text('message').notNull(),
  timestamp: timestamp('timestamp').notNull().defaultNow(),
  source: text('source').notNull(),
  resolved: boolean('resolved').notNull().default(false),
  resolvedAt: timestamp('resolved_at'),
  resolvedBy: uuid('resolved_by').references(() => users.id),
  actions: jsonb('actions').$type<string[]>().default([]),
  userId: uuid('user_id').references(() => users.id),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  workspaces: many(workspaces),
  tasks: many(automationTasks),
  executions: many(taskExecutions),
  suggestions: many(workflowSuggestions),
  templates: many(workflowTemplates),
}));

export const workspacesRelations = relations(workspaces, ({ one, many }) => ({
  owner: one(users, {
    fields: [workspaces.ownerId],
    references: [users.id],
  }),
  members: many(workspaceMembers),
  tasks: many(automationTasks),
}));

export const workspaceMembersRelations = relations(
  workspaceMembers,
  ({ one }) => ({
    workspace: one(workspaces, {
      fields: [workspaceMembers.workspaceId],
      references: [workspaces.id],
    }),
    user: one(users, {
      fields: [workspaceMembers.userId],
      references: [users.id],
    }),
    invitedBy: one(users, {
      fields: [workspaceMembers.invitedBy],
      references: [users.id],
    }),
  })
);

export const automationTasksRelations = relations(
  automationTasks,
  ({ one, many }) => ({
    workspace: one(workspaces, {
      fields: [automationTasks.workspaceId],
      references: [workspaces.id],
    }),
    user: one(users, {
      fields: [automationTasks.userId],
      references: [users.id],
    }),
    executions: many(taskExecutions),
    optimizationResults: many(optimizationResults),
  })
);

export const taskExecutionsRelations = relations(
  taskExecutions,
  ({ one, many }) => ({
    task: one(automationTasks, {
      fields: [taskExecutions.taskId],
      references: [automationTasks.id],
    }),
    user: one(users, {
      fields: [taskExecutions.userId],
      references: [users.id],
    }),
    logs: many(executionLogs),
  })
);

export const executionLogsRelations = relations(executionLogs, ({ one }) => ({
  execution: one(taskExecutions, {
    fields: [executionLogs.executionId],
    references: [taskExecutions.id],
  }),
}));

export const mcpToolsRelations = relations(mcpTools, ({ many }) => ({
  integrations: many(toolIntegrations),
}));

export const toolIntegrationsRelations = relations(
  toolIntegrations,
  ({ one }) => ({
    tool: one(mcpTools, {
      fields: [toolIntegrations.toolId],
      references: [mcpTools.id],
    }),
    user: one(users, {
      fields: [toolIntegrations.userId],
      references: [users.id],
    }),
  })
);

export const workflowSuggestionsRelations = relations(
  workflowSuggestions,
  ({ one }) => ({
    user: one(users, {
      fields: [workflowSuggestions.userId],
      references: [users.id],
    }),
  })
);

export const optimizationResultsRelations = relations(
  optimizationResults,
  ({ one }) => ({
    task: one(automationTasks, {
      fields: [optimizationResults.taskId],
      references: [automationTasks.id],
    }),
    user: one(users, {
      fields: [optimizationResults.userId],
      references: [users.id],
    }),
  })
);

export const workflowTemplatesRelations = relations(
  workflowTemplates,
  ({ one }) => ({
    user: one(users, {
      fields: [workflowTemplates.userId],
      references: [users.id],
    }),
  })
);

export const systemAlertsRelations = relations(systemAlerts, ({ one }) => ({
  resolvedBy: one(users, {
    fields: [systemAlerts.resolvedBy],
    references: [users.id],
  }),
  user: one(users, {
    fields: [systemAlerts.userId],
    references: [users.id],
  }),
}));
