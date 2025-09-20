/**
 * Core Task Automation Engine
 */

import { v4 as uuidv4 } from 'uuid';
import { 
  Task, 
  TaskType, 
  TaskExecution, 
  ExecutionStatus, 
  TaskConfig,
  TaskMetadata
} from './types/task';
// Import appropriate adapter based on environment
const isDevelopment = process.env.NODE_ENV === 'development';
const adapter = isDevelopment 
  ? require('./adapters/mockFirestoreAdapter')
  : require('./adapters/firestoreAdapter');

const { 
  saveTask, 
  getTask, 
  saveTaskExecution, 
  getTaskExecution,
  getTaskExecutions 
} = adapter;

export class TaskAutomationEngine {
  private taskExecutors: Map<TaskType, (config: TaskConfig, input?: any) => Promise<any>>;

  constructor() {
    this.taskExecutors = new Map();
    this.initializeDefaultExecutors();
  }

  /**
   * Initialize default task executors
   */
  private initializeDefaultExecutors(): void {
    // HTTP Request executor
    this.taskExecutors.set(TaskType.HTTP_REQUEST, async (config: TaskConfig) => {
      const { url, method = 'GET', headers = {}, body } = config;
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: body ? JSON.stringify(body) : undefined
      });

      return {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        data: await response.text()
      };
    });

    // Database Query executor (mock)
    this.taskExecutors.set(TaskType.DATABASE_QUERY, async (config: TaskConfig) => {
      const { query, database } = config;
      
      // Mock database query execution
      return {
        query,
        database,
        result: `Mock result for query: ${query}`,
        rowCount: Math.floor(Math.random() * 100)
      };
    });

    // File Operation executor (mock)
    this.taskExecutors.set(TaskType.FILE_OPERATION, async (config: TaskConfig) => {
      const { operation, path } = config;
      
      // Mock file operation
      return {
        operation,
        path,
        success: true,
        message: `Mock ${operation} operation on ${path}`
      };
    });

    // Email Send executor (mock)
    this.taskExecutors.set(TaskType.EMAIL_SEND, async (config: TaskConfig) => {
      const { to, subject } = config;
      
      return {
        to,
        subject,
        messageId: uuidv4(),
        status: 'sent'
      };
    });

    // Telegram Notify executor (mock)
    this.taskExecutors.set(TaskType.TELEGRAM_NOTIFY, async (config: TaskConfig) => {
      const { chatId, message } = config;
      
      return {
        chatId,
        message,
        messageId: uuidv4(),
        status: 'sent'
      };
    });

    // Slack Notify executor (mock)
    this.taskExecutors.set(TaskType.SLACK_NOTIFY, async (config: TaskConfig) => {
      const { channel, text } = config;
      
      return {
        channel,
        text,
        timestamp: Date.now(),
        status: 'sent'
      };
    });

    // Custom Script executor (mock)
    this.taskExecutors.set(TaskType.CUSTOM_SCRIPT, async (config: TaskConfig) => {
      const { script, language = 'javascript' } = config;
      
      return {
        script,
        language,
        output: `Mock execution of ${language} script`,
        success: true
      };
    });
  }

  /**
   * Create a new task
   */
  async createTask(
    name: string,
    type: TaskType,
    config: TaskConfig,
    metadata: TaskMetadata = {}
  ): Promise<Task> {
    const task: Task = {
      id: uuidv4(),
      name,
      type,
      config,
      metadata: {
        priority: 1,
        timeout: 30000,
        retryCount: 3,
        retryDelay: 1000,
        ...metadata
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await saveTask(task);
    return task;
  }

  /**
   * Get a task by ID
   */
  async getTask(id: string): Promise<Task | null> {
    return await getTask(id);
  }

  /**
   * Execute a task
   */
  async executeTask(taskId: string, input?: any): Promise<TaskExecution> {
    const task = await getTask(taskId);
    if (!task) {
      throw new Error(`Task with ID ${taskId} not found`);
    }

    const executionId = uuidv4();
    const startTime = new Date();

    // Create execution record
    const execution: TaskExecution = {
      id: executionId,
      taskId,
      status: ExecutionStatus.RUNNING,
      input,
      startedAt: startTime,
      metrics: {}
    };

    await saveTaskExecution(execution);

    try {
      // Get the appropriate executor
      const executor = this.taskExecutors.get(task.type);
      if (!executor) {
        throw new Error(`No executor found for task type: ${task.type}`);
      }

      // Execute the task with timeout
      const result = await this.executeWithTimeout(
        executor(task.config, input),
        task.metadata.timeout || 30000
      );

      const endTime = new Date();
      const duration = endTime.getTime() - startTime.getTime();

      // Update execution with success
      execution.status = ExecutionStatus.COMPLETED;
      execution.output = result;
      execution.completedAt = endTime;
      execution.metrics = {
        duration,
        retryCount: 0
      };

      await saveTaskExecution(execution);
      return execution;

    } catch (error) {
      const endTime = new Date();
      const duration = endTime.getTime() - startTime.getTime();

      // Update execution with error
      execution.status = ExecutionStatus.FAILED;
      execution.error = error instanceof Error ? error.message : String(error);
      execution.completedAt = endTime;
      execution.metrics = {
        duration,
        retryCount: 0
      };

      await saveTaskExecution(execution);
      return execution;
    }
  }

  /**
   * Execute a task with timeout
   */
  private async executeWithTimeout<T>(
    promise: Promise<T>,
    timeoutMs: number
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`Task execution timed out after ${timeoutMs}ms`));
      }, timeoutMs);

      promise
        .then(resolve)
        .catch(reject)
        .finally(() => clearTimeout(timer));
    });
  }

  /**
   * Get task execution by ID
   */
  async getTaskExecution(executionId: string): Promise<TaskExecution | null> {
    return await getTaskExecution(executionId);
  }

  /**
   * Get all executions for a task
   */
  async getTaskExecutions(taskId: string): Promise<TaskExecution[]> {
    return await getTaskExecutions(taskId);
  }

  /**
   * Register a custom task executor
   */
  registerExecutor(
    type: TaskType,
    executor: (config: TaskConfig, input?: any) => Promise<any>
  ): void {
    this.taskExecutors.set(type, executor);
  }

  /**
   * Get available task types
   */
  getAvailableTaskTypes(): TaskType[] {
    return Array.from(this.taskExecutors.keys());
  }
}

// Export singleton instance
export const taskAutomationEngine = new TaskAutomationEngine();
