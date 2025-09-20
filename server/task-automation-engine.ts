// Advanced Task Automation System
import { EventEmitter } from 'events';
import { v4 as uuidv4 } from 'uuid';
import * as cron from 'node-cron';

export interface TaskDefinition {
  id: string;
  name: string;
  description: string;
  type: TaskType;
  config: TaskConfig;
  dependencies: TaskDependency[];
  resources: ResourceRequirement[];
  retryPolicy: RetryPolicy;
  timeout: number;
  priority: number;
  tags: string[];
  metadata: TaskMetadata;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskExecution {
  id: string;
  taskId: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled' | 'retrying';
  input: any;
  output?: any;
  startedAt?: Date;
  completedAt?: Date;
  error?: ExecutionError;
  metrics: ExecutionMetrics;
  resources: ResourceAllocation;
  retryCount: number;
  maxRetries: number;
}

export interface TaskSchedule {
  id: string;
  taskId: string;
  cronExpression: string;
  timezone: string;
  nextRunAt: Date;
  isActive: boolean;
  lastRunAt?: Date;
  runCount: number;
  maxRuns?: number;
  createdAt: Date;
}

export interface TaskType {
  name: string;
  description: string;
  configSchema: any;
  processor: TaskProcessor;
}

export interface TaskConfig {
  [key: string]: any;
}

export interface TaskDependency {
  taskId: string;
  condition: 'completed' | 'failed' | 'any';
  timeout?: number;
}

export interface ResourceRequirement {
  type: 'cpu' | 'memory' | 'storage' | 'network' | 'custom';
  amount: number;
  unit: string;
  constraints?: ResourceConstraint[];
}

export interface ResourceConstraint {
  type: 'min' | 'max' | 'exact';
  value: number;
}

export interface RetryPolicy {
  maxRetries: number;
  retryDelay: number;
  backoffMultiplier: number;
  retryOn: string[];
  maxRetryDelay: number;
}

export interface TaskMetadata {
  author: string;
  category: string;
  version: string;
  permissions: Permission[];
  environment: string;
}

export interface Permission {
  userId: string;
  role: 'viewer' | 'executor' | 'admin';
  grantedAt: Date;
  grantedBy: string;
}

export interface ExecutionError {
  code: string;
  message: string;
  stack?: string;
  timestamp: Date;
  retryable: boolean;
}

export interface ExecutionMetrics {
  executionTime: number;
  memoryUsage: number;
  cpuUsage: number;
  networkCalls: number;
  diskIO: number;
  customMetrics: Record<string, number>;
}

export interface ResourceAllocation {
  cpu: number;
  memory: number;
  storage: number;
  network: number;
  custom: Record<string, number>;
}

export interface TaskProcessor {
  execute: (config: TaskConfig, context: ExecutionContext) => Promise<ExecutionResult>;
  validate: (config: TaskConfig) => Promise<ValidationResult>;
  estimateResources: (config: TaskConfig) => Promise<ResourceRequirement[]>;
}

export interface ExecutionContext {
  taskId: string;
  executionId: string;
  input: any;
  variables: Record<string, any>;
  environment: string;
  userId: string;
  sessionId: string;
}

export interface ExecutionResult {
  success: boolean;
  output?: any;
  error?: string;
  metrics?: Partial<ExecutionMetrics>;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export interface TaskQueue {
  id: string;
  name: string;
  priority: number;
  concurrency: number;
  tasks: string[];
  isActive: boolean;
}

export interface Worker {
  id: string;
  name: string;
  capabilities: string[];
  status: 'idle' | 'busy' | 'offline';
  currentTask?: string;
  lastHeartbeat: Date;
  metrics: WorkerMetrics;
}

export interface WorkerMetrics {
  totalTasks: number;
  completedTasks: number;
  failedTasks: number;
  averageExecutionTime: number;
  cpuUsage: number;
  memoryUsage: number;
  uptime: number;
}

export class TaskAutomationEngine extends EventEmitter {
  private tasks: Map<string, TaskDefinition> = new Map();
  private executions: Map<string, TaskExecution> = new Map();
  private schedules: Map<string, TaskSchedule> = new Map();
  private queues: Map<string, TaskQueue> = new Map();
  private workers: Map<string, Worker> = new Map();
  private taskTypes: Map<string, TaskType> = new Map();
  private executionQueue: TaskExecution[] = [];
  private isProcessing = false;
  private scheduler: NodeJS.Timeout | null = null;

  constructor() {
    super();
    this.initializeTaskTypes();
    this.startScheduler();
    this.startExecutionProcessor();
    this.startWorkerHeartbeat();
  }

  /**
   * Create a new task
   */
  async createTask(definition: Omit<TaskDefinition, 'id' | 'createdAt' | 'updatedAt'>): Promise<TaskDefinition> {
    const task: TaskDefinition = {
      ...definition,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Validate task definition
    const validation = await this.validateTask(task);
    if (!validation.valid) {
      throw new Error(`Invalid task definition: ${validation.errors.join(', ')}`);
    }

    this.tasks.set(task.id, task);
    this.emit('task:created', task);
    
    return task;
  }

  /**
   * Update an existing task
   */
  async updateTask(id: string, updates: Partial<TaskDefinition>): Promise<TaskDefinition> {
    const existing = this.tasks.get(id);
    if (!existing) {
      throw new Error(`Task ${id} not found`);
    }

    const updated: TaskDefinition = {
      ...existing,
      ...updates,
      id,
      updatedAt: new Date()
    };

    // Validate updated task
    const validation = await this.validateTask(updated);
    if (!validation.valid) {
      throw new Error(`Invalid task definition: ${validation.errors.join(', ')}`);
    }

    this.tasks.set(id, updated);
    this.emit('task:updated', updated);
    
    return updated;
  }

  /**
   * Delete a task
   */
  async deleteTask(id: string): Promise<void> {
    const task = this.tasks.get(id);
    if (!task) {
      throw new Error(`Task ${id} not found`);
    }

    // Check if task is currently running
    const runningExecutions = Array.from(this.executions.values())
      .filter(exec => exec.taskId === id && exec.status === 'running');
    
    if (runningExecutions.length > 0) {
      throw new Error(`Cannot delete task ${id}: ${runningExecutions.length} executions are still running`);
    }

    // Remove associated schedules
    const taskSchedules = Array.from(this.schedules.values())
      .filter(schedule => schedule.taskId === id);
    
    for (const schedule of taskSchedules) {
      this.schedules.delete(schedule.id);
    }

    this.tasks.delete(id);
    this.emit('task:deleted', { id });
  }

  /**
   * Get a task by ID
   */
  async getTask(id: string): Promise<TaskDefinition> {
    const task = this.tasks.get(id);
    if (!task) {
      throw new Error(`Task ${id} not found`);
    }
    return task;
  }

  /**
   * List tasks with optional filters
   */
  async listTasks(filters: {
    type?: string;
    status?: string;
    category?: string;
    author?: string;
    tags?: string[];
    limit?: number;
    offset?: number;
  } = {}): Promise<TaskDefinition[]> {
    let tasks = Array.from(this.tasks.values());

    // Apply filters
    if (filters.type) {
      tasks = tasks.filter(t => t.type.name === filters.type);
    }
    if (filters.category) {
      tasks = tasks.filter(t => t.metadata.category === filters.category);
    }
    if (filters.author) {
      tasks = tasks.filter(t => t.metadata.author === filters.author);
    }
    if (filters.tags && filters.tags.length > 0) {
      tasks = tasks.filter(t => 
        filters.tags!.some(tag => t.tags.includes(tag))
      );
    }

    // Apply pagination
    const offset = filters.offset || 0;
    const limit = filters.limit || 50;
    
    return tasks.slice(offset, offset + limit);
  }

  /**
   * Schedule a task
   */
  async scheduleTask(taskId: string, schedule: {
    cronExpression: string;
    timezone?: string;
    maxRuns?: number;
  }): Promise<TaskSchedule> {
    const task = await this.getTask(taskId);
    
    // Validate cron expression
    if (!cron.validate(schedule.cronExpression)) {
      throw new Error(`Invalid cron expression: ${schedule.cronExpression}`);
    }

    const taskSchedule: TaskSchedule = {
      id: uuidv4(),
      taskId,
      cronExpression: schedule.cronExpression,
      timezone: schedule.timezone || 'UTC',
      nextRunAt: this.calculateNextRun(schedule.cronExpression, schedule.timezone),
      isActive: true,
      runCount: 0,
      maxRuns: schedule.maxRuns,
      createdAt: new Date()
    };

    this.schedules.set(taskSchedule.id, taskSchedule);
    this.emit('task:scheduled', taskSchedule);
    
    return taskSchedule;
  }

  /**
   * Unschedule a task
   */
  async unscheduleTask(taskId: string): Promise<void> {
    const taskSchedules = Array.from(this.schedules.values())
      .filter(schedule => schedule.taskId === taskId);
    
    for (const schedule of taskSchedules) {
      schedule.isActive = false;
      this.schedules.delete(schedule.id);
    }

    this.emit('task:unscheduled', { taskId });
  }

  /**
   * Get task schedule
   */
  async getTaskSchedule(taskId: string): Promise<TaskSchedule[]> {
    return Array.from(this.schedules.values())
      .filter(schedule => schedule.taskId === taskId);
  }

  /**
   * Execute a task
   */
  async executeTask(taskId: string, input: any = {}): Promise<TaskExecution> {
    const task = await this.getTask(taskId);
    
    // Check dependencies
    const dependencyStatus = await this.checkDependencies(task.dependencies);
    if (!dependencyStatus.allSatisfied) {
      throw new Error(`Task dependencies not satisfied: ${dependencyStatus.failedDependencies.join(', ')}`);
    }

    // Allocate resources
    const resources = await this.allocateResources(task.resources);
    if (!resources.success) {
      throw new Error(`Failed to allocate resources: ${resources.error}`);
    }

    const execution: TaskExecution = {
      id: uuidv4(),
      taskId,
      status: 'pending',
      input,
      metrics: {
        executionTime: 0,
        memoryUsage: 0,
        cpuUsage: 0,
        networkCalls: 0,
        diskIO: 0,
        customMetrics: {}
      },
      resources: resources.allocation,
      retryCount: 0,
      maxRetries: task.retryPolicy.maxRetries
    };

    this.executions.set(execution.id, execution);
    this.executionQueue.push(execution);
    
    this.emit('task:execution:started', execution);
    
    return execution;
  }

  /**
   * Cancel task execution
   */
  async cancelExecution(executionId: string): Promise<void> {
    const execution = this.executions.get(executionId);
    if (!execution) {
      throw new Error(`Execution ${executionId} not found`);
    }

    if (execution.status === 'completed' || execution.status === 'failed') {
      throw new Error(`Cannot cancel execution ${executionId}: status is ${execution.status}`);
    }

    execution.status = 'cancelled';
    execution.completedAt = new Date();
    
    // Release resources
    await this.releaseResources(execution.resources);
    
    this.emit('task:execution:cancelled', execution);
  }

  /**
   * Retry task execution
   */
  async retryExecution(executionId: string): Promise<TaskExecution> {
    const execution = this.executions.get(executionId);
    if (!execution) {
      throw new Error(`Execution ${executionId} not found`);
    }

    if (execution.status !== 'failed') {
      throw new Error(`Cannot retry execution ${executionId}: status is ${execution.status}`);
    }

    if (execution.retryCount >= execution.maxRetries) {
      throw new Error(`Maximum retry count reached for execution ${executionId}`);
    }

    // Create new execution with incremented retry count
    const retryExecution: TaskExecution = {
      ...execution,
      id: uuidv4(),
      status: 'retrying',
      retryCount: execution.retryCount + 1,
      startedAt: undefined,
      completedAt: undefined,
      error: undefined
    };

    this.executions.set(retryExecution.id, retryExecution);
    this.executionQueue.push(retryExecution);
    
    this.emit('task:execution:retrying', retryExecution);
    
    return retryExecution;
  }

  /**
   * Get execution status
   */
  async getExecutionStatus(executionId: string): Promise<TaskExecution> {
    const execution = this.executions.get(executionId);
    if (!execution) {
      throw new Error(`Execution ${executionId} not found`);
    }
    return execution;
  }

  /**
   * Get execution metrics
   */
  async getExecutionMetrics(executionId: string): Promise<ExecutionMetrics> {
    const execution = this.executions.get(executionId);
    if (!execution) {
      throw new Error(`Execution ${executionId} not found`);
    }
    return execution.metrics;
  }

  /**
   * Get execution logs
   */
  async getExecutionLogs(executionId: string): Promise<ExecutionLog[]> {
    const execution = this.executions.get(executionId);
    if (!execution) {
      throw new Error(`Execution ${executionId} not found`);
    }
    
    // In a real implementation, this would fetch from a logging service
    return [{
      timestamp: new Date(),
      level: 'info',
      message: `Task execution ${execution.status}`,
      executionId,
      taskId: execution.taskId
    }];
  }

  /**
   * Register a worker
   */
  async registerWorker(worker: Omit<Worker, 'id' | 'lastHeartbeat'>): Promise<Worker> {
    const registeredWorker: Worker = {
      ...worker,
      id: uuidv4(),
      lastHeartbeat: new Date()
    };

    this.workers.set(registeredWorker.id, registeredWorker);
    this.emit('worker:registered', registeredWorker);
    
    return registeredWorker;
  }

  /**
   * Unregister a worker
   */
  async unregisterWorker(workerId: string): Promise<void> {
    const worker = this.workers.get(workerId);
    if (!worker) {
      throw new Error(`Worker ${workerId} not found`);
    }

    // Cancel any running tasks on this worker
    const runningExecutions = Array.from(this.executions.values())
      .filter(exec => exec.status === 'running');
    
    for (const execution of runningExecutions) {
      // In a real implementation, you would check which worker is handling this execution
      await this.cancelExecution(execution.id);
    }

    this.workers.delete(workerId);
    this.emit('worker:unregistered', { workerId });
  }

  /**
   * Get worker status
   */
  async getWorkerStatus(workerId: string): Promise<Worker> {
    const worker = this.workers.get(workerId);
    if (!worker) {
      throw new Error(`Worker ${workerId} not found`);
    }
    return worker;
  }

  /**
   * List workers
   */
  async listWorkers(): Promise<Worker[]> {
    return Array.from(this.workers.values());
  }

  /**
   * Validate task definition
   */
  private async validateTask(task: TaskDefinition): Promise<ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check required fields
    if (!task.name) errors.push('Task name is required');
    if (!task.type) errors.push('Task type is required');
    if (!task.config) errors.push('Task configuration is required');

    // Validate task type
    const taskType = this.taskTypes.get(task.type.name);
    if (!taskType) {
      errors.push(`Unknown task type: ${task.type.name}`);
    } else {
      // Validate configuration using task type validator
      const configValidation = await taskType.processor.validate(task.config);
      if (!configValidation.valid) {
        errors.push(...configValidation.errors);
      }
      warnings.push(...configValidation.warnings);
    }

    // Validate dependencies
    for (const dependency of task.dependencies) {
      const dependentTask = this.tasks.get(dependency.taskId);
      if (!dependentTask) {
        errors.push(`Dependency task ${dependency.taskId} not found`);
      }
    }

    // Validate resources
    for (const resource of task.resources) {
      if (resource.amount <= 0) {
        errors.push(`Resource amount must be positive: ${resource.type}`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Check task dependencies
   */
  private async checkDependencies(dependencies: TaskDependency[]): Promise<{
    allSatisfied: boolean;
    failedDependencies: string[];
  }> {
    const failedDependencies: string[] = [];

    for (const dependency of dependencies) {
      const dependentExecutions = Array.from(this.executions.values())
        .filter(exec => exec.taskId === dependency.taskId);
      
      if (dependentExecutions.length === 0) {
        failedDependencies.push(dependency.taskId);
        continue;
      }

      const latestExecution = dependentExecutions
        .sort((a, b) => (b.startedAt?.getTime() || 0) - (a.startedAt?.getTime() || 0))[0];

      switch (dependency.condition) {
        case 'completed':
          if (latestExecution.status !== 'completed') {
            failedDependencies.push(dependency.taskId);
          }
          break;
        case 'failed':
          if (latestExecution.status !== 'failed') {
            failedDependencies.push(dependency.taskId);
          }
          break;
        case 'any':
          if (latestExecution.status === 'running') {
            failedDependencies.push(dependency.taskId);
          }
          break;
      }
    }

    return {
      allSatisfied: failedDependencies.length === 0,
      failedDependencies
    };
  }

  /**
   * Allocate resources for task execution
   */
  private async allocateResources(requirements: ResourceRequirement[]): Promise<{
    success: boolean;
    allocation?: ResourceAllocation;
    error?: string;
  }> {
    // In a real implementation, this would check available resources
    // and allocate them from a resource pool
    
    const allocation: ResourceAllocation = {
      cpu: 0,
      memory: 0,
      storage: 0,
      network: 0,
      custom: {}
    };

    for (const requirement of requirements) {
      switch (requirement.type) {
        case 'cpu':
          allocation.cpu = requirement.amount;
          break;
        case 'memory':
          allocation.memory = requirement.amount;
          break;
        case 'storage':
          allocation.storage = requirement.amount;
          break;
        case 'network':
          allocation.network = requirement.amount;
          break;
        case 'custom':
          allocation.custom[requirement.unit] = requirement.amount;
          break;
      }
    }

    return {
      success: true,
      allocation
    };
  }

  /**
   * Release resources after task completion
   */
  private async releaseResources(allocation: ResourceAllocation): Promise<void> {
    // In a real implementation, this would release resources back to the pool
    console.log('Releasing resources:', allocation);
  }

  /**
   * Calculate next run time for cron expression
   */
  private calculateNextRun(cronExpression: string, timezone?: string): Date {
    // In a real implementation, this would use a proper cron library
    // For now, return a date 1 hour from now
    const nextRun = new Date();
    nextRun.setHours(nextRun.getHours() + 1);
    return nextRun;
  }

  /**
   * Initialize built-in task types
   */
  private initializeTaskTypes(): void {
    // HTTP Request Task Type
    this.taskTypes.set('http_request', {
      name: 'http_request',
      description: 'Execute HTTP request',
      configSchema: {
        type: 'object',
        properties: {
          url: { type: 'string' },
          method: { type: 'string', enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] },
          headers: { type: 'object' },
          body: { type: 'object' },
          timeout: { type: 'number' }
        },
        required: ['url']
      },
      processor: {
        execute: async (config, context) => {
          const { url, method = 'GET', headers = {}, body, timeout = 30000 } = config;
          
          try {
            const response = await fetch(url, {
              method,
              headers: {
                'Content-Type': 'application/json',
                ...headers
              },
              body: body ? JSON.stringify(body) : undefined,
              signal: AbortSignal.timeout(timeout)
            });

            const responseData = await response.json();
            
            return {
              success: response.ok,
              output: { response: responseData, status: response.status },
              error: response.ok ? undefined : `HTTP ${response.status}: ${response.statusText}`
            };
          } catch (error) {
            return {
              success: false,
              error: error.message
            };
          }
        },
        validate: async (config) => {
          const errors: string[] = [];
          if (!config.url) errors.push('URL is required');
          if (config.timeout && config.timeout <= 0) errors.push('Timeout must be positive');
          return { valid: errors.length === 0, errors, warnings: [] };
        },
        estimateResources: async (config) => {
          return [
            { type: 'network', amount: 1, unit: 'MB' },
            { type: 'cpu', amount: 0.1, unit: 'cores' }
          ];
        }
      }
    });

    // Database Query Task Type
    this.taskTypes.set('database_query', {
      name: 'database_query',
      description: 'Execute database query',
      configSchema: {
        type: 'object',
        properties: {
          query: { type: 'string' },
          parameters: { type: 'array' },
          timeout: { type: 'number' }
        },
        required: ['query']
      },
      processor: {
        execute: async (config, context) => {
          // This would integrate with your database service
          return {
            success: true,
            output: { query: config.query, result: 'mock_result' }
          };
        },
        validate: async (config) => {
          const errors: string[] = [];
          if (!config.query) errors.push('Query is required');
          return { valid: errors.length === 0, errors, warnings: [] };
        },
        estimateResources: async (config) => {
          return [
            { type: 'cpu', amount: 0.2, unit: 'cores' },
            { type: 'memory', amount: 50, unit: 'MB' }
          ];
        }
      }
    });

    // File Operation Task Type
    this.taskTypes.set('file_operation', {
      name: 'file_operation',
      description: 'Perform file operation',
      configSchema: {
        type: 'object',
        properties: {
          operation: { type: 'string', enum: ['read', 'write', 'delete', 'copy', 'move'] },
          sourcePath: { type: 'string' },
          targetPath: { type: 'string' },
          content: { type: 'string' }
        },
        required: ['operation']
      },
      processor: {
        execute: async (config, context) => {
          // This would integrate with your file service
          return {
            success: true,
            output: { operation: config.operation, path: config.sourcePath }
          };
        },
        validate: async (config) => {
          const errors: string[] = [];
          if (!config.operation) errors.push('Operation is required');
          if (['write', 'copy', 'move'].includes(config.operation) && !config.content && !config.sourcePath) {
            errors.push('Content or source path required for this operation');
          }
          return { valid: errors.length === 0, errors, warnings: [] };
        },
        estimateResources: async (config) => {
          return [
            { type: 'storage', amount: 1, unit: 'MB' },
            { type: 'cpu', amount: 0.1, unit: 'cores' }
          ];
        }
      }
    });

    // Custom Function Task Type
    this.taskTypes.set('custom_function', {
      name: 'custom_function',
      description: 'Execute custom function',
      configSchema: {
        type: 'object',
        properties: {
          functionCode: { type: 'string' },
          parameters: { type: 'object' }
        },
        required: ['functionCode']
      },
      processor: {
        execute: async (config, context) => {
          try {
            // In production, use a safer evaluation method
            const result = eval(config.functionCode);
            return {
              success: true,
              output: { result }
            };
          } catch (error) {
            return {
              success: false,
              error: error.message
            };
          }
        },
        validate: async (config) => {
          const errors: string[] = [];
          if (!config.functionCode) errors.push('Function code is required');
          return { valid: errors.length === 0, errors, warnings: [] };
        },
        estimateResources: async (config) => {
          return [
            { type: 'cpu', amount: 0.5, unit: 'cores' },
            { type: 'memory', amount: 100, unit: 'MB' }
          ];
        }
      }
    });
  }

  /**
   * Start the scheduler
   */
  private startScheduler(): void {
    this.scheduler = setInterval(() => {
      this.processScheduledTasks();
    }, 60000); // Check every minute
  }

  /**
   * Process scheduled tasks
   */
  private processScheduledTasks(): void {
    const now = new Date();
    
    for (const schedule of this.schedules.values()) {
      if (!schedule.isActive) continue;
      if (schedule.nextRunAt > now) continue;
      if (schedule.maxRuns && schedule.runCount >= schedule.maxRuns) continue;

      // Execute the scheduled task
      this.executeTask(schedule.taskId).catch(error => {
        console.error(`Error executing scheduled task ${schedule.taskId}:`, error);
      });

      // Update schedule
      schedule.lastRunAt = now;
      schedule.runCount++;
      schedule.nextRunAt = this.calculateNextRun(schedule.cronExpression, schedule.timezone);
    }
  }

  /**
   * Start the execution processor
   */
  private startExecutionProcessor(): void {
    setInterval(async () => {
      if (this.isProcessing || this.executionQueue.length === 0) {
        return;
      }

      this.isProcessing = true;
      
      try {
        const execution = this.executionQueue.shift();
        if (execution) {
          await this.processExecution(execution);
        }
      } catch (error) {
        console.error('Error processing execution:', error);
      } finally {
        this.isProcessing = false;
      }
    }, 100); // Process every 100ms
  }

  /**
   * Process task execution
   */
  private async processExecution(execution: TaskExecution): Promise<void> {
    try {
      const task = this.tasks.get(execution.taskId);
      if (!task) {
        throw new Error(`Task ${execution.taskId} not found`);
      }

      execution.status = 'running';
      execution.startedAt = new Date();

      const taskType = this.taskTypes.get(task.type.name);
      if (!taskType) {
        throw new Error(`Task type ${task.type.name} not found`);
      }

      const context: ExecutionContext = {
        taskId: execution.taskId,
        executionId: execution.id,
        input: execution.input,
        variables: {},
        environment: task.metadata.environment,
        userId: task.metadata.author,
        sessionId: execution.id
      };

      const startTime = Date.now();
      const result = await taskType.processor.execute(task.config, context);
      const executionTime = Date.now() - startTime;

      execution.metrics.executionTime = executionTime;
      execution.status = result.success ? 'completed' : 'failed';
      execution.completedAt = new Date();
      execution.output = result.output;
      
      if (!result.success) {
        execution.error = {
          code: 'EXECUTION_ERROR',
          message: result.error || 'Unknown error',
          timestamp: new Date(),
          retryable: true
        };
      }

      // Release resources
      await this.releaseResources(execution.resources);

      this.emit('task:execution:completed', execution);

    } catch (error) {
      execution.status = 'failed';
      execution.error = {
        code: 'EXECUTION_ERROR',
        message: error.message,
        stack: error.stack,
        timestamp: new Date(),
        retryable: true
      };
      execution.completedAt = new Date();
      
      // Release resources
      await this.releaseResources(execution.resources);
      
      this.emit('task:execution:failed', execution);
    }
  }

  /**
   * Start worker heartbeat monitoring
   */
  private startWorkerHeartbeat(): void {
    setInterval(() => {
      const now = new Date();
      const heartbeatTimeout = 30000; // 30 seconds

      for (const worker of this.workers.values()) {
        if (now.getTime() - worker.lastHeartbeat.getTime() > heartbeatTimeout) {
          worker.status = 'offline';
          this.emit('worker:offline', worker);
        }
      }
    }, 10000); // Check every 10 seconds
  }
}

export interface ExecutionLog {
  timestamp: Date;
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  executionId: string;
  taskId: string;
  details?: any;
}

// Export the task automation engine instance
export const taskAutomationEngine = new TaskAutomationEngine();
