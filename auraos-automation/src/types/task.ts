/**
 * Core task types for the AuraOS Automation Engine
 */

export interface Task {
  id: string;
  name: string;
  type: TaskType;
  config: TaskConfig;
  metadata: TaskMetadata;
  createdAt: Date;
  updatedAt: Date;
}

export enum TaskType {
  HTTP_REQUEST = 'http_request',
  DATABASE_QUERY = 'database_query',
  FILE_OPERATION = 'file_operation',
  EMAIL_SEND = 'email_send',
  TELEGRAM_NOTIFY = 'telegram_notify',
  SLACK_NOTIFY = 'slack_notify',
  CUSTOM_SCRIPT = 'custom_script',
}

export interface TaskConfig {
  [key: string]: any;
}

export interface TaskMetadata {
  description?: string;
  tags?: string[];
  priority?: number;
  timeout?: number;
  retryCount?: number;
  retryDelay?: number;
}

export interface TaskExecution {
  id: string;
  taskId: string;
  status: ExecutionStatus;
  input?: any;
  output?: any;
  error?: string;
  startedAt: Date;
  completedAt?: Date;
  metrics: ExecutionMetrics;
}

export enum ExecutionStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

export interface ExecutionMetrics {
  duration?: number;
  memoryUsage?: number;
  cpuUsage?: number;
  retryCount?: number;
}

export interface TaskSchedule {
  id: string;
  taskId: string;
  cronExpression: string;
  nextRunAt?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Worker {
  id: string;
  status: WorkerStatus;
  lastHeartbeat: Date;
  capabilities: string[];
  metadata?: any;
}

export enum WorkerStatus {
  IDLE = 'idle',
  BUSY = 'busy',
  OFFLINE = 'offline',
}
