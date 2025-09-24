// A2A Autopilot Integration Layer - طبقة تكامل الأوتوبيلوت
// واجهة برمجية متخصصة للتواصل مع نظام الأوتوبيلوت

import { EventEmitter } from 'events';
import { getLogger } from './lib/advanced-logger.js';
import { getAdvancedAutomationEngine } from './advanced-automation.js';
import { getIntelligentWorkflowOrchestrator } from './intelligent-workflow.js';

// Types and Interfaces
interface AutopilotConfig {
  enabled: boolean;
  autoStart: boolean;
  maxConcurrentTasks: number;
  taskTimeout: number;
  retryPolicy: {
    maxRetries: number;
    retryDelay: number;
    backoffMultiplier: number;
  };
  monitoring: {
    enabled: boolean;
    interval: number;
    metricsRetention: number;
  };
}

interface AutopilotTask {
  id: string;
  type: 'automation' | 'workflow' | 'command' | 'monitoring';
  name: string;
  description: string;
  payload: any;
  priority: 'low' | 'normal' | 'high' | 'critical';
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  error?: string;
  retryCount: number;
  maxRetries: number;
  metadata?: any;
}

interface AutopilotMetrics {
  totalTasks: number;
  completedTasks: number;
  failedTasks: number;
  activeTasks: number;
  averageExecutionTime: number;
  successRate: number;
  uptime: number;
  lastActivity: Date;
}

interface AutopilotStatus {
  isRunning: boolean;
  isHealthy: boolean;
  activeTasks: number;
  queuedTasks: number;
  lastHeartbeat: Date;
  version: string;
  capabilities: string[];
}

interface AutopilotCommand {
  id: string;
  type: 'start' | 'stop' | 'pause' | 'resume' | 'restart' | 'status' | 'metrics';
  payload?: any;
  timestamp: Date;
  source: string;
}

export class A2AAutopilotIntegration extends EventEmitter {
  private config: AutopilotConfig;
  private automationEngine: any;
  private workflowOrchestrator: any;
  private logger: any;
  private isInitialized: boolean = false;
  private isRunning: boolean = false;
  private startTime: Date = new Date();
  private tasks: Map<string, AutopilotTask> = new Map();
  private metrics: AutopilotMetrics;
  private monitoringInterval?: NodeJS.Timeout;
  private taskQueue: AutopilotTask[] = [];
  private activeTasks: Set<string> = new Set();

  constructor(config: Partial<AutopilotConfig> = {}) {
    super();
    
    this.config = {
      enabled: config.enabled !== false,
      autoStart: config.autoStart !== false,
      maxConcurrentTasks: config.maxConcurrentTasks || 10,
      taskTimeout: config.taskTimeout || 300000, // 5 minutes
      retryPolicy: {
        maxRetries: config.retryPolicy?.maxRetries || 3,
        retryDelay: config.retryPolicy?.retryDelay || 1000,
        backoffMultiplier: config.retryPolicy?.backoffMultiplier || 2,
      },
      monitoring: {
        enabled: config.monitoring?.enabled !== false,
        interval: config.monitoring?.interval || 30000, // 30 seconds
        metricsRetention: config.monitoring?.metricsRetention || 24 * 60 * 60 * 1000, // 24 hours
      },
    };

    this.logger = getLogger();
    this.metrics = {
      totalTasks: 0,
      completedTasks: 0,
      failedTasks: 0,
      activeTasks: 0,
      averageExecutionTime: 0,
      successRate: 0,
      uptime: 0,
      lastActivity: new Date(),
    };

    this.logger.info('🚀 A2A Autopilot Integration initialized');
  }

  // Initialization
  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      this.logger.warn('Autopilot integration is already initialized');
      return;
    }

    try {
      this.logger.info('Initializing Autopilot Integration...');

      // Initialize automation engine
      this.automationEngine = getAdvancedAutomationEngine();
      this.logger.info('   ✅ Automation Engine initialized');

      // Initialize workflow orchestrator
      this.workflowOrchestrator = getIntelligentWorkflowOrchestrator();
      this.logger.info('   ✅ Workflow Orchestrator initialized');

      // Setup monitoring if enabled
      if (this.config.monitoring.enabled) {
        this.setupMonitoring();
        this.logger.info('   ✅ Monitoring setup completed');
      }

      // Auto-start if enabled
      if (this.config.autoStart) {
        await this.start();
      }

      this.isInitialized = true;
      this.logger.info('✅ Autopilot Integration ready');

      this.emit('initialized');
    } catch (error) {
      this.logger.error('Failed to initialize Autopilot Integration', { error });
      throw error;
    }
  }

  // Task Management
  public async createTask(taskData: Partial<AutopilotTask>): Promise<string> {
    try {
      const task: AutopilotTask = {
        id: this.generateTaskId(),
        type: taskData.type || 'automation',
        name: taskData.name || 'Unnamed Task',
        description: taskData.description || '',
        payload: taskData.payload || {},
        priority: taskData.priority || 'normal',
        status: 'pending',
        createdAt: new Date(),
        retryCount: 0,
        maxRetries: this.config.retryPolicy.maxRetries,
        metadata: taskData.metadata || {},
      };

      this.tasks.set(task.id, task);
      this.taskQueue.push(task);
      this.metrics.totalTasks++;

      this.logger.info('Task created', {
        taskId: task.id,
        type: task.type,
        name: task.name,
        priority: task.priority,
      });

      this.emit('taskCreated', task);

      // Process task queue
      this.processTaskQueue();

      return task.id;
    } catch (error) {
      this.logger.error('Failed to create task', { error });
      throw error;
    }
  }

  public async executeTask(taskId: string): Promise<void> {
    try {
      const task = this.tasks.get(taskId);
      if (!task) {
        throw new Error(`Task ${taskId} not found`);
      }

      if (task.status !== 'pending') {
        throw new Error(`Task ${taskId} is not in pending status`);
      }

      // Check if we can start more tasks
      if (this.activeTasks.size >= this.config.maxConcurrentTasks) {
        this.logger.warn('Maximum concurrent tasks reached', {
          active: this.activeTasks.size,
          max: this.config.maxConcurrentTasks,
        });
        return;
      }

      // Start task execution
      task.status = 'running';
      task.startedAt = new Date();
      this.activeTasks.add(taskId);
      this.metrics.activeTasks = this.activeTasks.size;

      this.logger.info('Task execution started', {
        taskId,
        type: task.type,
        name: task.name,
      });

      this.emit('taskStarted', task);

      // Execute task based on type
      await this.executeTaskByType(task);

    } catch (error) {
      this.logger.error('Failed to execute task', { error, taskId });
      await this.handleTaskError(taskId, error);
    }
  }

  private async executeTaskByType(task: AutopilotTask): Promise<void> {
    const startTime = Date.now();

    try {
      switch (task.type) {
        case 'automation':
          await this.executeAutomationTask(task);
          break;
        case 'workflow':
          await this.executeWorkflowTask(task);
          break;
        case 'command':
          await this.executeCommandTask(task);
          break;
        case 'monitoring':
          await this.executeMonitoringTask(task);
          break;
        default:
          throw new Error(`Unknown task type: ${task.type}`);
      }

      // Task completed successfully
      const executionTime = Date.now() - startTime;
      await this.completeTask(task.id, executionTime);

    } catch (error) {
      const executionTime = Date.now() - startTime;
      await this.handleTaskError(task.id, error, executionTime);
    }
  }

  private async executeAutomationTask(task: AutopilotTask): Promise<void> {
    try {
      const { ruleId, parameters } = task.payload;
      
      if (!ruleId) {
        throw new Error('Rule ID is required for automation tasks');
      }

      // Execute automation rule
      const result = await this.automationEngine.executeRule(ruleId, parameters);
      
      task.metadata = {
        ...task.metadata,
        result,
        executedAt: new Date(),
      };

      this.logger.info('Automation task executed', {
        taskId: task.id,
        ruleId,
        result,
      });

    } catch (error) {
      this.logger.error('Automation task execution failed', { error, taskId: task.id });
      throw error;
    }
  }

  private async executeWorkflowTask(task: AutopilotTask): Promise<void> {
    try {
      const { workflowId, input } = task.payload;
      
      if (!workflowId) {
        throw new Error('Workflow ID is required for workflow tasks');
      }

      // Execute workflow
      const result = await this.workflowOrchestrator.executeWorkflow(workflowId, input);
      
      task.metadata = {
        ...task.metadata,
        result,
        executedAt: new Date(),
      };

      this.logger.info('Workflow task executed', {
        taskId: task.id,
        workflowId,
        result,
      });

    } catch (error) {
      this.logger.error('Workflow task execution failed', { error, taskId: task.id });
      throw error;
    }
  }

  private async executeCommandTask(task: AutopilotTask): Promise<void> {
    try {
      const { command, args } = task.payload;
      
      if (!command) {
        throw new Error('Command is required for command tasks');
      }

      // Execute command
      const result = await this.executeSystemCommand(command, args);
      
      task.metadata = {
        ...task.metadata,
        result,
        executedAt: new Date(),
      };

      this.logger.info('Command task executed', {
        taskId: task.id,
        command,
        result,
      });

    } catch (error) {
      this.logger.error('Command task execution failed', { error, taskId: task.id });
      throw error;
    }
  }

  private async executeMonitoringTask(task: AutopilotTask): Promise<void> {
    try {
      const { metrics, alerts } = task.payload;

      // Collect system metrics
      const systemMetrics = await this.collectSystemMetrics();
      
      // Check alerts
      const triggeredAlerts = await this.checkAlerts(systemMetrics, alerts);
      
      task.metadata = {
        ...task.metadata,
        systemMetrics,
        triggeredAlerts,
        executedAt: new Date(),
      };

      this.logger.info('Monitoring task executed', {
        taskId: task.id,
        metrics: Object.keys(systemMetrics),
        alerts: triggeredAlerts.length,
      });

    } catch (error) {
      this.logger.error('Monitoring task execution failed', { error, taskId: task.id });
      throw error;
    }
  }

  private async completeTask(taskId: string, executionTime: number): Promise<void> {
    try {
      const task = this.tasks.get(taskId);
      if (!task) return;

      task.status = 'completed';
      task.completedAt = new Date();
      this.activeTasks.delete(taskId);
      this.metrics.activeTasks = this.activeTasks.size;
      this.metrics.completedTasks++;

      // Update average execution time
      this.updateAverageExecutionTime(executionTime);

      this.logger.info('Task completed', {
        taskId,
        executionTime: `${executionTime}ms`,
        status: task.status,
      });

      this.emit('taskCompleted', task);

      // Process next task in queue
      this.processTaskQueue();

    } catch (error) {
      this.logger.error('Failed to complete task', { error, taskId });
    }
  }

  private async handleTaskError(taskId: string, error: any, executionTime?: number): Promise<void> {
    try {
      const task = this.tasks.get(taskId);
      if (!task) return;

      task.error = error.message;
      task.retryCount++;

      // Check if we should retry
      if (task.retryCount < task.maxRetries) {
        task.status = 'pending';
        this.activeTasks.delete(taskId);
        this.metrics.activeTasks = this.activeTasks.size;

        // Schedule retry with exponential backoff
        const retryDelay = this.config.retryPolicy.retryDelay * 
          Math.pow(this.config.retryPolicy.backoffMultiplier, task.retryCount - 1);

        setTimeout(() => {
          this.taskQueue.push(task);
          this.processTaskQueue();
        }, retryDelay);

        this.logger.warn('Task scheduled for retry', {
          taskId,
          retryCount: task.retryCount,
          maxRetries: task.maxRetries,
          retryDelay,
        });

        this.emit('taskRetry', task);
      } else {
        // Task failed permanently
        task.status = 'failed';
        task.completedAt = new Date();
        this.activeTasks.delete(taskId);
        this.metrics.activeTasks = this.activeTasks.size;
        this.metrics.failedTasks++;

        if (executionTime) {
          this.updateAverageExecutionTime(executionTime);
        }

        this.logger.error('Task failed permanently', {
          taskId,
          error: error.message,
          retryCount: task.retryCount,
        });

        this.emit('taskFailed', task);
      }

    } catch (error) {
      this.logger.error('Failed to handle task error', { error, taskId });
    }
  }

  // Task Queue Processing
  private processTaskQueue(): void {
    if (this.activeTasks.size >= this.config.maxConcurrentTasks) {
      return; // Cannot process more tasks
    }

    // Sort tasks by priority
    this.taskQueue.sort((a, b) => {
      const priorityOrder = { critical: 4, high: 3, normal: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });

    // Process tasks
    while (this.taskQueue.length > 0 && this.activeTasks.size < this.config.maxConcurrentTasks) {
      const task = this.taskQueue.shift();
      if (task && task.status === 'pending') {
        this.executeTask(task.id).catch(error => {
          this.logger.error('Failed to execute queued task', { error, taskId: task.id });
        });
      }
    }
  }

  // Command Execution
  public async executeCommand(command: AutopilotCommand): Promise<any> {
    try {
      this.logger.info('Executing autopilot command', {
        commandId: command.id,
        type: command.type,
        source: command.source,
      });

      let result: any;

      switch (command.type) {
        case 'start':
          result = await this.start();
          break;
        case 'stop':
          result = await this.stop();
          break;
        case 'pause':
          result = await this.pause();
          break;
        case 'resume':
          result = await this.resume();
          break;
        case 'restart':
          result = await this.restart();
          break;
        case 'status':
          result = await this.getStatus();
          break;
        case 'metrics':
          result = await this.getMetrics();
          break;
        default:
          throw new Error(`Unknown command type: ${command.type}`);
      }

      this.emit('commandExecuted', { command, result });
      return result;

    } catch (error) {
      this.logger.error('Command execution failed', { error, command });
      throw error;
    }
  }

  // Control Methods
  public async start(): Promise<void> {
    if (this.isRunning) {
      this.logger.warn('Autopilot is already running');
      return;
    }

    try {
      this.isRunning = true;
      this.startTime = new Date();
      this.metrics.lastActivity = new Date();

      this.logger.info('Autopilot started');
      this.emit('started');

    } catch (error) {
      this.logger.error('Failed to start autopilot', { error });
      throw error;
    }
  }

  public async stop(): Promise<void> {
    if (!this.isRunning) {
      this.logger.warn('Autopilot is not running');
      return;
    }

    try {
      this.isRunning = false;

      // Cancel all pending tasks
      for (const task of this.taskQueue) {
        if (task.status === 'pending') {
          task.status = 'cancelled';
          task.completedAt = new Date();
        }
      }

      // Wait for active tasks to complete (with timeout)
      const timeout = 30000; // 30 seconds
      const startTime = Date.now();

      while (this.activeTasks.size > 0 && (Date.now() - startTime) < timeout) {
        await this.sleep(1000);
      }

      // Force cancel remaining tasks
      for (const taskId of this.activeTasks) {
        const task = this.tasks.get(taskId);
        if (task) {
          task.status = 'cancelled';
          task.completedAt = new Date();
        }
      }

      this.activeTasks.clear();
      this.metrics.activeTasks = 0;

      this.logger.info('Autopilot stopped');
      this.emit('stopped');

    } catch (error) {
      this.logger.error('Failed to stop autopilot', { error });
      throw error;
    }
  }

  public async pause(): Promise<void> {
    if (!this.isRunning) {
      throw new Error('Autopilot is not running');
    }

    // Pause task processing
    this.taskQueue = [];
    this.logger.info('Autopilot paused');
    this.emit('paused');
  }

  public async resume(): Promise<void> {
    if (!this.isRunning) {
      throw new Error('Autopilot is not running');
    }

    // Resume task processing
    this.processTaskQueue();
    this.logger.info('Autopilot resumed');
    this.emit('resumed');
  }

  public async restart(): Promise<void> {
    await this.stop();
    await this.sleep(1000);
    await this.start();
  }

  // Status and Metrics
  public async getStatus(): Promise<AutopilotStatus> {
    return {
      isRunning: this.isRunning,
      isHealthy: this.isHealthy(),
      activeTasks: this.activeTasks.size,
      queuedTasks: this.taskQueue.length,
      lastHeartbeat: this.metrics.lastActivity,
      version: '1.0.0',
      capabilities: [
        'automation',
        'workflow',
        'command',
        'monitoring',
        'retry',
        'priority',
        'metrics',
      ],
    };
  }

  public async getMetrics(): Promise<AutopilotMetrics> {
    this.metrics.uptime = Date.now() - this.startTime.getTime();
    this.metrics.successRate = this.metrics.totalTasks > 0 
      ? (this.metrics.completedTasks / this.metrics.totalTasks) * 100 
      : 0;

    return { ...this.metrics };
  }

  public async getTask(taskId: string): Promise<AutopilotTask | null> {
    return this.tasks.get(taskId) || null;
  }

  public async getAllTasks(): Promise<AutopilotTask[]> {
    return Array.from(this.tasks.values());
  }

  public async getTasksByStatus(status: string): Promise<AutopilotTask[]> {
    return Array.from(this.tasks.values()).filter(task => task.status === status);
  }

  // Monitoring
  private setupMonitoring(): void {
    if (!this.config.monitoring.enabled) return;

    this.monitoringInterval = setInterval(() => {
      this.collectMetrics();
    }, this.config.monitoring.interval);

    this.logger.info('Monitoring setup completed', {
      interval: this.config.monitoring.interval,
    });
  }

  private async collectMetrics(): Promise<void> {
    try {
      this.metrics.lastActivity = new Date();
      this.metrics.uptime = Date.now() - this.startTime.getTime();

      this.emit('metricsCollected', this.metrics);
    } catch (error) {
      this.logger.error('Failed to collect metrics', { error });
    }
  }

  private async collectSystemMetrics(): Promise<any> {
    return {
      cpu: process.cpuUsage(),
      memory: process.memoryUsage(),
      uptime: process.uptime(),
      timestamp: new Date(),
    };
  }

  private async checkAlerts(metrics: any, alerts: any[]): Promise<any[]> {
    // Simple alert checking implementation
    const triggeredAlerts: any[] = [];
    
    for (const alert of alerts) {
      // Check memory usage
      if (alert.type === 'memory' && metrics.memory.heapUsed > alert.threshold) {
        triggeredAlerts.push({
          type: 'memory',
          message: `Memory usage exceeded threshold: ${metrics.memory.heapUsed}`,
          threshold: alert.threshold,
          current: metrics.memory.heapUsed,
        });
      }
    }

    return triggeredAlerts;
  }

  private async executeSystemCommand(command: string, args: string[] = []): Promise<any> {
    // Simple command execution (in a real implementation, use child_process)
    return {
      command,
      args,
      executedAt: new Date(),
      result: 'Command executed successfully',
    };
  }

  // Utility methods
  private generateTaskId(): string {
    return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private updateAverageExecutionTime(executionTime: number): void {
    const alpha = 0.1;
    this.metrics.averageExecutionTime = 
      alpha * executionTime + (1 - alpha) * this.metrics.averageExecutionTime;
  }

  private isHealthy(): boolean {
    return this.isRunning && this.isInitialized;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Cleanup
  public async cleanup(): Promise<void> {
    try {
      if (this.monitoringInterval) {
        clearInterval(this.monitoringInterval);
      }

      await this.stop();
      this.tasks.clear();
      this.taskQueue = [];
      this.activeTasks.clear();

      this.logger.info('Autopilot integration cleaned up');
    } catch (error) {
      this.logger.error('Failed to cleanup autopilot integration', { error });
    }
  }
}

// Export singleton instance
let autopilotInstance: A2AAutopilotIntegration | null = null;

export function getA2AAutopilotIntegration(config?: Partial<AutopilotConfig>): A2AAutopilotIntegration {
  if (!autopilotInstance) {
    autopilotInstance = new A2AAutopilotIntegration(config);
  }
  return autopilotInstance;
}

export function initializeA2AAutopilotIntegration(config?: Partial<AutopilotConfig>): A2AAutopilotIntegration {
  return getA2AAutopilotIntegration(config);
}
