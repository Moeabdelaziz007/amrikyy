import { storage } from './storage.js';

export interface LearningContext {
  userId: string;
  sessionId: string;
  taskType: string;
  inputData: any;
  description: string;
  timestamp: Date;
  metadata?: Record<string, any>;
  feedback?: {
    rating: number;
    comment?: string;
    timestamp: Date;
  };
}

export interface TaskPattern {
  patternId: string;
  taskType: string;
  inputSignature: string;
  outputSignature: string;
  successRate: number;
  adaptationCount: number;
  examples: any[];
  createdAt: Date;
  lastUsed: Date;
}

export interface PerformanceMetrics {
  overallAccuracy: number;
  taskSpecificAccuracy: Map<string, number>;
  averageResponseTime: number;
  totalRequests: number;
  successfulRequests: number;
}

export interface MetaLearningState {
  userId: string;
  learningRate: number;
  adaptationStrategies: Map<string, AdaptationStrategy>;
  taskPatterns: Map<string, TaskPattern>;
  performanceMetrics: PerformanceMetrics;
  lastUpdated: Date;
  createdAt: Date;
}

export interface AdaptationStrategy {
  name: string;
  description: string;
  execute: (context: LearningContext, state: MetaLearningState) => Promise<any>;
}

export interface Reward {
  value: number; // -1 to 1, where 1 is best
  confidence: number; // 0 to 1, how certain we are about the reward
  source: 'user_feedback' | 'system_evaluation' | 'inferred';
  metadata?: Record<string, any>;
}

export interface LearningResult {
  success: boolean;
  output?: any;
  error?: string;
  confidence: number;
  explanation: string;
  executionTime: number;
  strategy: string;
  adaptationType: string;
  reward: Reward;
}


export class SmartLearningAIMetaLoop {
  private learningStates: Map<string, MetaLearningState> = new Map();
  private defaultLearningRate: number = 0.1;

  constructor() {
    this.initializeDefaultStrategies();
  }

  private initializeDefaultStrategies(): void {
    // Initialize with some default adaptation strategies
    const defaultStrategies = new Map<string, AdaptationStrategy>();
    
    defaultStrategies.set('basic_learning', {
      name: 'Basic Learning',
      description: 'Standard learning approach with default parameters',
      execute: async (context: LearningContext, state: MetaLearningState) => {
        // Basic implementation - can be enhanced
        return { success: true, output: 'Basic learning result', confidence: 0.7 };
      }
    });

    // Store default strategies in a global state if needed
    // This could be enhanced to load from storage
  }

  public async initializeLearningState(userId: string): Promise<MetaLearningState> {
    const existingState = this.learningStates.get(userId);
    if (existingState) {
      return existingState;
    }

    const newState: MetaLearningState = {
      userId,
      learningRate: this.defaultLearningRate,
      adaptationStrategies: new Map(),
      taskPatterns: new Map(),
      performanceMetrics: {
        overallAccuracy: 0.5,
        taskSpecificAccuracy: new Map(),
        averageResponseTime: 0,
        totalRequests: 0,
        successfulRequests: 0
      },
      lastUpdated: new Date(),
      createdAt: new Date()
    };

    this.learningStates.set(userId, newState);
    await this.saveLearningState(newState);
    return newState;
  }

  public getLearningState(userId: string): MetaLearningState | undefined {
    return this.learningStates.get(userId);
  }

  public getAllLearningStates(): Map<string, MetaLearningState> {
    return this.learningStates;
  }

  public addAdaptationStrategy(name: string, strategy: AdaptationStrategy): void {
    // Add strategy to all existing learning states
    for (const state of this.learningStates.values()) {
      state.adaptationStrategies.set(name, strategy);
    }
  }

  private async saveLearningState(state: MetaLearningState): Promise<void> {
    try {
      // Save to storage (could be file system, database, etc.)
      await storage.set(`learning_state_${state.userId}`, JSON.stringify(state, this.mapReplacer));
    } catch (error) {
      console.error('Failed to save learning state:', error);
    }
  }

  private async loadLearningState(userId: string): Promise<MetaLearningState | null> {
    try {
      const data = await storage.get(`learning_state_${userId}`);
      if (data) {
        return JSON.parse(data, this.mapReviver);
      }
    } catch (error) {
      console.error('Failed to load learning state:', error);
    }
    return null;
  }

  private mapReplacer(key: string, value: any): any {
    if (value instanceof Map) {
      return {
        dataType: 'Map',
        value: Array.from(value.entries())
      };
    }
    return value;
  }

  private mapReviver(key: string, value: any): any {
    if (typeof value === 'object' && value !== null) {
      if (value.dataType === 'Map') {
        return new Map(value.value);
      }
    }
    return value;
  }

  async processLearningRequest(context: LearningContext): Promise<LearningResult> {
    const startTime = Date.now();
    
    // Step 1: Get or create learning state
    let learningState = this.getLearningState(context.userId);
    if (!learningState) {
      learningState = await this.initializeLearningState(context.userId);
    }

    // Step 2: Select adaptation strategy
    const strategy = this.selectAdaptationStrategy(learningState, context);
    
    // Step 3: Execute the strategy
    let result: LearningResult;
    try {
      const strategyResult = await strategy.execute(context, learningState);
      result = {
        success: true,
        output: strategyResult.output || strategyResult,
        confidence: strategyResult.confidence || 0.7,
        explanation: `Executed strategy: ${strategy.name}`,
        executionTime: Date.now() - startTime,
        strategy: strategy.name,
        adaptationType: 'strategy_execution',
        reward: { value: 0, confidence: 0.5, source: 'system_evaluation' }
      };
    } catch (error) {
      result = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        confidence: 0.1,
        explanation: `Strategy execution failed: ${strategy.name}`,
        executionTime: Date.now() - startTime,
        strategy: strategy.name,
        adaptationType: 'strategy_execution',
        reward: { value: -0.5, confidence: 0.8, source: 'system_evaluation' }
      };
    }
    
    // Step 4: Calculate Reward
    const reward = this.calculateReward(context, result);
    result.reward = reward;

    // Step 5: Update learning state
    await this.updateLearningState(learningState, context, result);

    // Step 6: Store adaptation record
    await this.recordAdaptation(learningState, context, result);

    return result;
  }

  private selectAdaptationStrategy(state: MetaLearningState, context: LearningContext): AdaptationStrategy {
    // Simple strategy selection - can be enhanced with more sophisticated logic
    const strategies = Array.from(state.adaptationStrategies.values());
    
    if (strategies.length === 0) {
      // Return a default strategy if none are available
      return {
        name: 'default',
        description: 'Default strategy',
        execute: async (context: LearningContext, state: MetaLearningState) => {
          return { success: true, output: 'Default execution', confidence: 0.5 };
        }
      };
    }

    // For now, return the first available strategy
    // In a more sophisticated implementation, this would consider:
    // - Task type matching
    // - Historical performance
    // - Current learning state
    return strategies[0];
  }

  private async updateLearningState(
    state: MetaLearningState, 
    context: LearningContext, 
    result: LearningResult
  ): Promise<void> {
    // Update performance metrics
    await this.updatePerformanceMetrics(state, context, result);
    
    // Update task patterns
    await this.updateTaskPatterns(state, context, result);
    
    // Update overall state
    state.lastUpdated = new Date();
    state.performanceMetrics.totalRequests++;
    if (result.success) {
      state.performanceMetrics.successfulRequests++;
    }
    
    // Save updated state
    await this.saveLearningState(state);
  }

  private async recordAdaptation(
    state: MetaLearningState, 
    context: LearningContext, 
    result: LearningResult
  ): Promise<void> {
    // Record the adaptation for future analysis
    const adaptationRecord = {
      userId: context.userId,
      timestamp: new Date(),
      strategy: result.strategy,
      success: result.success,
      confidence: result.confidence,
      executionTime: result.executionTime,
      taskType: context.taskType
    };

    try {
      await storage.set(`adaptation_${Date.now()}_${context.userId}`, JSON.stringify(adaptationRecord));
    } catch (error) {
      console.error('Failed to record adaptation:', error);
    }
  }

  private generateTaskSignature(context: LearningContext): string {
    // Generate a signature based on task type and input characteristics
    return `${context.taskType}_${typeof context.inputData}_${context.inputData?.length || 0}`;
  }

  private generateOutputSignature(output: any): string {
    // Generate a signature for the output
    return `${typeof output}_${output?.length || 0}`;
  }

  private calculateReward(context: LearningContext, result: LearningResult): Reward {
    let value = 0;
    let confidence = 0.5;

    // Rule-based reward calculation
    if (result.success) {
      value += 0.5 * result.confidence;
      confidence = result.confidence;
    } else {
      value -= 0.5;
      confidence = 1.0;
    }

    if (context.feedback) {
      // More sophisticated feedback processing would go here
    }

    return {
      value,
      confidence,
      source: 'system_evaluation',
    };
  }

  private async updateTaskPatterns(
    state: MetaLearningState, 
    context: LearningContext, 
    result: LearningResult
  ): Promise<void> {
      const signature = this.generateTaskSignature(context);
      let pattern = state.taskPatterns.get(signature);

      if (!pattern) {
          pattern = {
              patternId: signature,
              taskType: context.taskType,
              inputSignature: signature,
              outputSignature: this.generateOutputSignature(result.output),
              successRate: result.success ? 1 : 0,
              adaptationCount: 1,
              examples: [],
              createdAt: new Date(),
              lastUsed: new Date(),
          };
          state.taskPatterns.set(signature, pattern);
      } else {
          pattern.adaptationCount++;
          pattern.lastUsed = new Date();
          
          // Confidence-weighted learning
          const alpha = 0.1 * result.confidence;
          pattern.successRate = alpha * (result.success ? 1 : 0) + (1 - alpha) * pattern.successRate;
      }

      // Add example to pattern
      pattern.examples.push({
        input: context.inputData,
        output: result.output,
        success: result.success,
        timestamp: new Date()
      });

      // Keep only recent examples (last 10)
      if (pattern.examples.length > 10) {
        pattern.examples = pattern.examples.slice(-10);
      }
  }

  private async updatePerformanceMetrics(
    state: MetaLearningState, 
    context: LearningContext, 
    result: LearningResult
  ): Promise<void> {
      const taskType = context.taskType;
      const currentAccuracy = state.performanceMetrics.taskSpecificAccuracy.get(taskType) || 0.5;

      // Update task-specific accuracy with reward
      const alpha = 0.1;
      const newAccuracy = alpha * result.reward.value + (1 - alpha) * currentAccuracy;
      state.performanceMetrics.taskSpecificAccuracy.set(taskType, newAccuracy);
      
      // Update overall accuracy
      const totalAccuracy = Array.from(state.performanceMetrics.taskSpecificAccuracy.values())
        .reduce((sum, acc) => sum + acc, 0);
      state.performanceMetrics.overallAccuracy = totalAccuracy / state.performanceMetrics.taskSpecificAccuracy.size;

      // Update average response time
      const currentAvgTime = state.performanceMetrics.averageResponseTime;
      const newAvgTime = (currentAvgTime * state.performanceMetrics.totalRequests + result.executionTime) / 
        (state.performanceMetrics.totalRequests + 1);
      state.performanceMetrics.averageResponseTime = newAvgTime;
  }
}

// Export singleton instance
let smartLearningAI: SmartLearningAIMetaLoop | null = null;

export function getSmartLearningAI(): SmartLearningAIMetaLoop {
  if (!smartLearningAI) {
    smartLearningAI = new SmartLearningAIMetaLoop();
  }
  return smartLearningAI;
}
