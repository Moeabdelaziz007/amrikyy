/**
 * أنواع البيانات لمحرك سير العمل
 * Workflow Engine Types
 */

export interface Position {
  x: number;
  y: number;
}

export interface NodeData {
  id: string;
  type: NodeType;
  label: string;
  position: Position;
  data: Record<string, any>;
  config: NodeConfig;
  status: NodeStatus;
  createdAt: Date;
  updatedAt: Date;
}

export enum NodeType {
  START = 'start',
  END = 'end',
  PROCESS = 'process',
  DECISION = 'decision',
  API_CALL = 'api_call',
  SLACK = 'slack',
  DISCORD = 'discord',
  GITHUB_ACTION = 'github_action',
  DELAY = 'delay',
  CONDITION = 'condition',
  PARALLEL = 'parallel',
  MERGE = 'merge'
}

export enum NodeStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  SUCCESS = 'success',
  FAILED = 'failed',
  SKIPPED = 'skipped',
  CANCELLED = 'cancelled'
}

export interface NodeConfig {
  retryCount?: number;
  timeout?: number;
  onError?: 'continue' | 'stop' | 'retry';
  dependencies?: string[];
  conditions?: Condition[];
}

export interface Condition {
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'not_contains';
  value: any;
}

export interface Connection {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  label?: string;
  type: ConnectionType;
  condition?: Condition;
}

export enum ConnectionType {
  SUCCESS = 'success',
  FAILURE = 'failure',
  CONDITIONAL = 'conditional',
  DEFAULT = 'default'
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  nodes: NodeData[];
  connections: Connection[];
  variables: Record<string, any>;
  settings: WorkflowSettings;
  status: WorkflowStatus;
  createdAt: Date;
  updatedAt: Date;
  version: number;
}

export enum WorkflowStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  PAUSED = 'paused',
  ARCHIVED = 'archived'
}

export interface WorkflowSettings {
  maxConcurrentExecutions: number;
  timeout: number;
  retryPolicy: RetryPolicy;
  notifications: NotificationConfig[];
}

export interface RetryPolicy {
  maxRetries: number;
  delay: number;
  backoffMultiplier: number;
  maxDelay: number;
}

export interface NotificationConfig {
  type: 'email' | 'slack' | 'discord' | 'webhook';
  config: Record<string, any>;
  events: NotificationEvent[];
}

export enum NotificationEvent {
  WORKFLOW_STARTED = 'workflow_started',
  WORKFLOW_COMPLETED = 'workflow_completed',
  WORKFLOW_FAILED = 'workflow_failed',
  NODE_FAILED = 'node_failed',
  WORKFLOW_PAUSED = 'workflow_paused'
}

export interface Execution {
  id: string;
  workflowId: string;
  status: ExecutionStatus;
  startTime: Date;
  endTime?: Date;
  nodeExecutions: NodeExecution[];
  variables: Record<string, any>;
  logs: ExecutionLog[];
}

export enum ExecutionStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  PAUSED = 'paused'
}

export interface NodeExecution {
  nodeId: string;
  status: NodeStatus;
  startTime: Date;
  endTime?: Date;
  input: Record<string, any>;
  output?: Record<string, any>;
  error?: string;
  retryCount: number;
}

export interface ExecutionLog {
  timestamp: Date;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  nodeId?: string;
  data?: any;
}

// API Integration Types
export interface ApiCredentials {
  id: string;
  name: string;
  type: ApiProvider;
  credentials: Record<string, string>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum ApiProvider {
  SLACK = 'slack',
  DISCORD = 'discord',
  GITHUB_ACTIONS = 'github_actions',
  TELEGRAM = 'telegram',
  EMAIL = 'email',
  WEBHOOK = 'webhook'
}

// DAG Types
export interface DAGNode {
  id: string;
  dependencies: string[];
  dependents: string[];
  level: number;
  isEntry: boolean;
  isExit: boolean;
}

export interface DAGValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  cycles: string[][];
}

export interface TopologicalOrder {
  nodes: string[];
  levels: number[][];
  totalLevels: number;
}
