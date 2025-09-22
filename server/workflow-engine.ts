// Advanced Workflow Engine Implementation
import { EventEmitter } from 'events';
import { v4 as uuidv4 } from 'uuid';

export interface WorkflowNode {
  id: string;
  type: 'trigger' | 'action' | 'condition' | 'transform' | 'delay' | 'webhook';
  name: string;
  config: Record<string, any>;
  position: { x: number; y: number };
  connections: string[];
  validation?: NodeValidation;
}

export interface WorkflowConnection {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  condition?: string;
  label?: string;
}

export interface WorkflowDefinition {
  id: string;
  name: string;
  description: string;
  version: string;
  nodes: WorkflowNode[];
  connections: WorkflowConnection[];
  variables: WorkflowVariable[];
  settings: WorkflowSettings;
  metadata: WorkflowMetadata;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  status: 'running' | 'completed' | 'failed' | 'paused' | 'cancelled';
  input: any;
  output?: any;
  startedAt: Date;
  completedAt?: Date;
  error?: ExecutionError;
  metrics: ExecutionMetrics;
  context: ExecutionContext;
}

export interface ExecutionContext {
  variables: Record<string, any>;
  currentNodeId?: string;
  executionPath: string[];
  retryCount: number;
  maxRetries: number;
}

export interface ExecutionError {
  code: string;
  message: string;
  nodeId?: string;
  stack?: string;
  timestamp: Date;
}

export interface ExecutionMetrics {
  totalNodes: number;
  executedNodes: number;
  executionTime: number;
  memoryUsage: number;
  cpuUsage: number;
  networkCalls: number;
}

export interface WorkflowVariable {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  value: any;
  description?: string;
}

export interface WorkflowSettings {
  timeout: number;
  retryPolicy: RetryPolicy;
  concurrency: number;
  errorHandling: ErrorHandlingStrategy;
  logging: LoggingConfig;
}

export interface RetryPolicy {
  maxRetries: number;
  retryDelay: number;
  backoffMultiplier: number;
  retryOn: string[];
}

export interface ErrorHandlingStrategy {
  onError: 'stop' | 'continue' | 'retry' | 'fallback';
  fallbackNodeId?: string;
  notificationChannels: string[];
}

export interface LoggingConfig {
  level: 'debug' | 'info' | 'warn' | 'error';
  includeInput: boolean;
  includeOutput: boolean;
  includeMetrics: boolean;
}

export interface NodeValidation {
  required: string[];
  schema?: any;
  customValidator?: (config: any) => ValidationResult;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export interface WorkflowMetadata {
  tags: string[];
  category: string;
  author: string;
  lastModifiedBy: string;
  permissions: Permission[];
}

export interface Permission {
  userId: string;
  role: 'viewer' | 'editor' | 'admin';
  grantedAt: Date;
  grantedBy: string;
}

export class WorkflowEngine extends EventEmitter {
  private workflows: Map<string, WorkflowDefinition> = new Map();
  private executions: Map<string, WorkflowExecution> = new Map();
  private nodeProcessors: Map<string, NodeProcessor> = new Map();
  private executionQueue: WorkflowExecution[] = [];
  private isProcessing = false;

  constructor() {
    super();
    this.initializeNodeProcessors();
    this.startExecutionProcessor();
  }

  /**
   * Create a new workflow
   */
  async createWorkflow(
    definition: Omit<WorkflowDefinition, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<WorkflowDefinition> {
    const workflow: WorkflowDefinition = {
      ...definition,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Validate workflow definition
    const validation = await this.validateWorkflow(workflow);
    if (!validation.valid) {
      throw new Error(
        `Invalid workflow definition: ${validation.errors.join(', ')}`
      );
    }

    this.workflows.set(workflow.id, workflow);
    this.emit('workflow:created', workflow);

    return workflow;
  }

  /**
   * Update an existing workflow
   */
  async updateWorkflow(
    id: string,
    updates: Partial<WorkflowDefinition>
  ): Promise<WorkflowDefinition> {
    const existing = this.workflows.get(id);
    if (!existing) {
      throw new Error(`Workflow ${id} not found`);
    }

    const updated: WorkflowDefinition = {
      ...existing,
      ...updates,
      id,
      updatedAt: new Date(),
    };

    // Validate updated workflow
    const validation = await this.validateWorkflow(updated);
    if (!validation.valid) {
      throw new Error(
        `Invalid workflow definition: ${validation.errors.join(', ')}`
      );
    }

    this.workflows.set(id, updated);
    this.emit('workflow:updated', updated);

    return updated;
  }

  /**
   * Delete a workflow
   */
  async deleteWorkflow(id: string): Promise<void> {
    const workflow = this.workflows.get(id);
    if (!workflow) {
      throw new Error(`Workflow ${id} not found`);
    }

    // Check if workflow is currently running
    const runningExecutions = Array.from(this.executions.values()).filter(
      exec => exec.workflowId === id && exec.status === 'running'
    );

    if (runningExecutions.length > 0) {
      throw new Error(
        `Cannot delete workflow ${id}: ${runningExecutions.length} executions are still running`
      );
    }

    this.workflows.delete(id);
    this.emit('workflow:deleted', { id });
  }

  /**
   * Get a workflow by ID
   */
  async getWorkflow(id: string): Promise<WorkflowDefinition> {
    const workflow = this.workflows.get(id);
    if (!workflow) {
      throw new Error(`Workflow ${id} not found`);
    }
    return workflow;
  }

  /**
   * List workflows with optional filters
   */
  async listWorkflows(
    filters: {
      status?: string;
      category?: string;
      author?: string;
      tags?: string[];
      limit?: number;
      offset?: number;
    } = {}
  ): Promise<WorkflowDefinition[]> {
    let workflows = Array.from(this.workflows.values());

    // Apply filters
    if (filters.category) {
      workflows = workflows.filter(
        w => w.metadata.category === filters.category
      );
    }
    if (filters.author) {
      workflows = workflows.filter(w => w.metadata.author === filters.author);
    }
    if (filters.tags && filters.tags.length > 0) {
      workflows = workflows.filter(w =>
        filters.tags!.some(tag => w.metadata.tags.includes(tag))
      );
    }

    // Apply pagination
    const offset = filters.offset || 0;
    const limit = filters.limit || 50;

    return workflows.slice(offset, offset + limit);
  }

  /**
   * Execute a workflow
   */
  async executeWorkflow(
    workflowId: string,
    input: any = {}
  ): Promise<WorkflowExecution> {
    const workflow = await this.getWorkflow(workflowId);

    const execution: WorkflowExecution = {
      id: uuidv4(),
      workflowId,
      status: 'running',
      input,
      startedAt: new Date(),
      metrics: {
        totalNodes: workflow.nodes.length,
        executedNodes: 0,
        executionTime: 0,
        memoryUsage: 0,
        cpuUsage: 0,
        networkCalls: 0,
      },
      context: {
        variables: { ...input },
        executionPath: [],
        retryCount: 0,
        maxRetries: workflow.settings.retryPolicy.maxRetries,
      },
    };

    this.executions.set(execution.id, execution);
    this.executionQueue.push(execution);

    this.emit('workflow:execution:started', execution);

    return execution;
  }

  /**
   * Get execution status
   */
  async getExecutionStatus(executionId: string): Promise<WorkflowExecution> {
    const execution = this.executions.get(executionId);
    if (!execution) {
      throw new Error(`Execution ${executionId} not found`);
    }
    return execution;
  }

  /**
   * Pause workflow execution
   */
  async pauseExecution(executionId: string): Promise<void> {
    const execution = this.executions.get(executionId);
    if (!execution) {
      throw new Error(`Execution ${executionId} not found`);
    }

    if (execution.status !== 'running') {
      throw new Error(
        `Cannot pause execution ${executionId}: status is ${execution.status}`
      );
    }

    execution.status = 'paused';
    this.emit('workflow:execution:paused', execution);
  }

  /**
   * Resume workflow execution
   */
  async resumeExecution(executionId: string): Promise<void> {
    const execution = this.executions.get(executionId);
    if (!execution) {
      throw new Error(`Execution ${executionId} not found`);
    }

    if (execution.status !== 'paused') {
      throw new Error(
        `Cannot resume execution ${executionId}: status is ${execution.status}`
      );
    }

    execution.status = 'running';
    this.executionQueue.push(execution);
    this.emit('workflow:execution:resumed', execution);
  }

  /**
   * Cancel workflow execution
   */
  async cancelExecution(executionId: string): Promise<void> {
    const execution = this.executions.get(executionId);
    if (!execution) {
      throw new Error(`Execution ${executionId} not found`);
    }

    if (execution.status === 'completed' || execution.status === 'failed') {
      throw new Error(
        `Cannot cancel execution ${executionId}: status is ${execution.status}`
      );
    }

    execution.status = 'cancelled';
    execution.completedAt = new Date();
    this.emit('workflow:execution:cancelled', execution);
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
    return execution.context.executionPath.map(nodeId => ({
      timestamp: new Date(),
      level: 'info',
      message: `Executed node ${nodeId}`,
      nodeId,
      executionId,
    }));
  }

  /**
   * Validate workflow definition
   */
  private async validateWorkflow(
    workflow: WorkflowDefinition
  ): Promise<ValidationResult> {
    const errors: string[] = [];

    // Check if workflow has at least one node
    if (workflow.nodes.length === 0) {
      errors.push('Workflow must have at least one node');
    }

    // Check if workflow has at least one trigger node
    const triggerNodes = workflow.nodes.filter(node => node.type === 'trigger');
    if (triggerNodes.length === 0) {
      errors.push('Workflow must have at least one trigger node');
    }

    // Validate each node
    for (const node of workflow.nodes) {
      const nodeValidation = await this.validateNode(node);
      if (!nodeValidation.valid) {
        errors.push(`Node ${node.id}: ${nodeValidation.errors.join(', ')}`);
      }
    }

    // Validate connections
    for (const connection of workflow.connections) {
      const sourceNode = workflow.nodes.find(
        n => n.id === connection.sourceNodeId
      );
      const targetNode = workflow.nodes.find(
        n => n.id === connection.targetNodeId
      );

      if (!sourceNode) {
        errors.push(
          `Connection ${connection.id}: source node ${connection.sourceNodeId} not found`
        );
      }
      if (!targetNode) {
        errors.push(
          `Connection ${connection.id}: target node ${connection.targetNodeId} not found`
        );
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate individual node
   */
  private async validateNode(node: WorkflowNode): Promise<ValidationResult> {
    const errors: string[] = [];

    // Check required fields
    if (!node.id) errors.push('Node ID is required');
    if (!node.name) errors.push('Node name is required');
    if (!node.type) errors.push('Node type is required');

    // Validate node configuration based on type
    const processor = this.nodeProcessors.get(node.type);
    if (processor && processor.validate) {
      const validation = await processor.validate(node.config);
      if (!validation.valid) {
        errors.push(...validation.errors);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Initialize node processors
   */
  private initializeNodeProcessors(): void {
    // Trigger node processor
    this.nodeProcessors.set('trigger', {
      execute: async (config, context) => {
        // Trigger nodes typically don't execute, they just start the workflow
        return { success: true, output: context.input };
      },
      validate: async config => {
        const errors: string[] = [];
        if (!config.eventType)
          errors.push('Event type is required for trigger nodes');
        return { valid: errors.length === 0, errors };
      },
    });

    // Action node processor
    this.nodeProcessors.set('action', {
      execute: async (config, context) => {
        // Execute the action based on configuration
        const actionType = config.actionType;
        const actionConfig = config.config || {};

        switch (actionType) {
          case 'http_request':
            return await this.executeHttpRequest(actionConfig, context);
          case 'database_query':
            return await this.executeDatabaseQuery(actionConfig, context);
          case 'file_operation':
            return await this.executeFileOperation(actionConfig, context);
          case 'custom_function':
            return await this.executeCustomFunction(actionConfig, context);
          default:
            throw new Error(`Unknown action type: ${actionType}`);
        }
      },
      validate: async config => {
        const errors: string[] = [];
        if (!config.actionType) errors.push('Action type is required');
        return { valid: errors.length === 0, errors };
      },
    });

    // Condition node processor
    this.nodeProcessors.set('condition', {
      execute: async (config, context) => {
        const condition = config.condition;
        const result = this.evaluateCondition(condition, context);
        return { success: true, output: { condition: result } };
      },
      validate: async config => {
        const errors: string[] = [];
        if (!config.condition) errors.push('Condition is required');
        return { valid: errors.length === 0, errors };
      },
    });

    // Transform node processor
    this.nodeProcessors.set('transform', {
      execute: async (config, context) => {
        const transformation = config.transformation;
        const result = this.applyTransformation(transformation, context);
        return { success: true, output: result };
      },
      validate: async config => {
        const errors: string[] = [];
        if (!config.transformation) errors.push('Transformation is required');
        return { valid: errors.length === 0, errors };
      },
    });

    // Delay node processor
    this.nodeProcessors.set('delay', {
      execute: async (config, context) => {
        const delayMs = config.delayMs || 1000;
        await new Promise(resolve => setTimeout(resolve, delayMs));
        return { success: true, output: context.variables };
      },
      validate: async config => {
        const errors: string[] = [];
        if (config.delayMs && config.delayMs < 0) {
          errors.push('Delay must be a positive number');
        }
        return { valid: errors.length === 0, errors };
      },
    });

    // Webhook node processor
    this.nodeProcessors.set('webhook', {
      execute: async (config, context) => {
        const webhookUrl = config.url;
        const method = config.method || 'POST';
        const headers = config.headers || {};
        const body = config.body || context.variables;

        const response = await fetch(webhookUrl, {
          method,
          headers: {
            'Content-Type': 'application/json',
            ...headers,
          },
          body: JSON.stringify(body),
        });

        const responseData = await response.json();
        return { success: response.ok, output: responseData };
      },
      validate: async config => {
        const errors: string[] = [];
        if (!config.url) errors.push('Webhook URL is required');
        return { valid: errors.length === 0, errors };
      },
    });
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
   * Process workflow execution
   */
  private async processExecution(execution: WorkflowExecution): Promise<void> {
    try {
      const workflow = this.workflows.get(execution.workflowId);
      if (!workflow) {
        throw new Error(`Workflow ${execution.workflowId} not found`);
      }

      // Find the next node to execute
      const currentNodeId = execution.context.currentNodeId;
      let nextNodeId: string | undefined;

      if (!currentNodeId) {
        // Start with trigger nodes
        const triggerNodes = workflow.nodes.filter(
          node => node.type === 'trigger'
        );
        if (triggerNodes.length > 0) {
          nextNodeId = triggerNodes[0].id;
        }
      } else {
        // Find connected nodes
        const connections = workflow.connections.filter(
          conn => conn.sourceNodeId === currentNodeId
        );
        if (connections.length > 0) {
          nextNodeId = connections[0].targetNodeId;
        }
      }

      if (!nextNodeId) {
        // No more nodes to execute
        execution.status = 'completed';
        execution.completedAt = new Date();
        execution.metrics.executionTime =
          execution.completedAt.getTime() - execution.startedAt.getTime();
        this.emit('workflow:execution:completed', execution);
        return;
      }

      // Execute the node
      const node = workflow.nodes.find(n => n.id === nextNodeId);
      if (!node) {
        throw new Error(`Node ${nextNodeId} not found`);
      }

      const processor = this.nodeProcessors.get(node.type);
      if (!processor) {
        throw new Error(`No processor found for node type: ${node.type}`);
      }

      const startTime = Date.now();
      const result = await processor.execute(node.config, execution.context);
      const executionTime = Date.now() - startTime;

      // Update execution context
      execution.context.currentNodeId = nextNodeId;
      execution.context.executionPath.push(nextNodeId);
      execution.metrics.executedNodes++;
      execution.metrics.executionTime += executionTime;

      // Update variables if result contains output
      if (result.output) {
        execution.context.variables = {
          ...execution.context.variables,
          ...result.output,
        };
      }

      // Check if execution should continue
      if (execution.status === 'running') {
        this.executionQueue.push(execution);
      }

      this.emit('workflow:execution:node:completed', {
        executionId: execution.id,
        nodeId: nextNodeId,
        result,
        executionTime,
      });
    } catch (error) {
      execution.status = 'failed';
      execution.error = {
        code: 'EXECUTION_ERROR',
        message: error.message,
        stack: error.stack,
        timestamp: new Date(),
      };
      execution.completedAt = new Date();

      this.emit('workflow:execution:failed', execution);
    }
  }

  /**
   * Execute HTTP request action
   */
  private async executeHttpRequest(
    config: any,
    context: ExecutionContext
  ): Promise<ExecutionResult> {
    const { url, method = 'GET', headers = {}, body } = config;

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      const responseData = await response.json();

      return {
        success: response.ok,
        output: { response: responseData, status: response.status },
        error: response.ok
          ? undefined
          : `HTTP ${response.status}: ${response.statusText}`,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Execute database query action
   */
  private async executeDatabaseQuery(
    config: any,
    context: ExecutionContext
  ): Promise<ExecutionResult> {
    // This would integrate with your database service
    // For now, return a mock result
    return {
      success: true,
      output: { query: config.query, result: 'mock_result' },
    };
  }

  /**
   * Execute file operation action
   */
  private async executeFileOperation(
    config: any,
    context: ExecutionContext
  ): Promise<ExecutionResult> {
    // This would integrate with your file service
    // For now, return a mock result
    return {
      success: true,
      output: { operation: config.operation, file: config.file },
    };
  }

  /**
   * Execute custom function action
   */
  private async executeCustomFunction(
    config: any,
    context: ExecutionContext
  ): Promise<ExecutionResult> {
    try {
      // This would execute a custom function defined in the workflow
      const functionCode = config.functionCode;
      const result = eval(functionCode); // In production, use a safer evaluation method

      return {
        success: true,
        output: { result },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Evaluate condition
   */
  private evaluateCondition(
    condition: string,
    context: ExecutionContext
  ): boolean {
    try {
      // Simple condition evaluation - in production, use a proper expression evaluator
      return eval(condition);
    } catch (error) {
      console.error('Error evaluating condition:', error);
      return false;
    }
  }

  /**
   * Apply transformation
   */
  private applyTransformation(
    transformation: any,
    context: ExecutionContext
  ): any {
    // Apply data transformation based on configuration
    // This is a simplified implementation
    return transformation;
  }
}

export interface NodeProcessor {
  execute: (config: any, context: ExecutionContext) => Promise<ExecutionResult>;
  validate?: (config: any) => Promise<ValidationResult>;
}

export interface ExecutionResult {
  success: boolean;
  output?: any;
  error?: string;
}

export interface ExecutionLog {
  timestamp: Date;
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  nodeId?: string;
  executionId: string;
}

// Export the workflow engine instance
export const workflowEngine = new WorkflowEngine();
