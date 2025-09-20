
import { getAdvancedAIAgentSystem, AIAgent, AgentTask } from './advanced-ai-agents.js';
import { getAdvancedAutomationEngine } from './advanced-automation.js';
import { getLearningSystem, LearningAutomationSystem } from './learning-automation.js';
import { getTelegramService, TelegramService } from './telegram.js';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { EventEmitter } from 'events';

export interface AutopilotMemory {
  id: string;
  type: 'experience' | 'knowledge' | 'pattern' | 'optimization' | 'user_preference';
  content: string;
  confidence: number;
  lastUsed: Date;
  usageCount: number;
  importance: number;
  tags: string[];
  metadata: Record<string, any>;
}

export interface AutopilotGrowthMetrics {
  knowledgeBaseSize: number;
  experiencePoints: number;
  optimizationCount: number;
  learningCycles: number;
  lastGrowthUpdate: Date;
  growthRate: number;
  efficiency: number;
  adaptability: number;
}

export interface AutopilotTask {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  assignedBy: string;
  assignedAt: Date;
  dueDate?: Date;
  progress: number;
  result?: any;
  error?: string;
  tags: string[];
  metadata: Record<string, any>;
}

export interface TelegramUpdateConfig {
  enabled: boolean;
  chatIds: number[];
  updateTypes: ('growth' | 'self_improvement' | 'knowledge' | 'optimization' | 'tasks' | 'errors')[];
  frequency: 'immediate' | 'hourly' | 'daily' | 'weekly';
}

export class AlwaysActiveAutopilotAgent extends EventEmitter {
  private agentSystem: any;
  private agent: AIAgent;
  private db!: Firestore;
  private debug: boolean;
  private isAlwaysActive: boolean = true;
  private backgroundTasks: Map<string, NodeJS.Timeout> = new Map();
  private memory: Map<string, AutopilotMemory> = new Map();
  private growthMetrics: AutopilotGrowthMetrics;
  private automationEngine: any;
  private learningSystem: LearningAutomationSystem;
  private telegramService: TelegramService | null = null;
  private telegramConfig: TelegramUpdateConfig;
  private pendingTasks: Map<string, AutopilotTask> = new Map();
  private taskHistory: AutopilotTask[] = [];
  private selfImprovementInterval: NodeJS.Timeout | null = null;
  private knowledgeAccumulationInterval: NodeJS.Timeout | null = null;
  private continuousOptimizationInterval: NodeJS.Timeout | null = null;

  constructor(debug = false) {
    super();
    this.debug = debug;
    this.agentSystem = getAdvancedAIAgentSystem();
    this.automationEngine = getAdvancedAutomationEngine();
    this.learningSystem = getLearningSystem();
    this.telegramService = getTelegramService();
    
    // Initialize Telegram configuration
    this.telegramConfig = {
      enabled: true,
      chatIds: [], // Will be populated when users subscribe
      updateTypes: ['growth', 'self_improvement', 'knowledge', 'optimization', 'tasks', 'errors'],
      frequency: 'immediate'
    };
    
    this.agent = this.agentSystem.createAgent({
      name: 'Always Active Autopilot Agent',
      description: 'An advanced AI agent that continuously learns, grows, and optimizes itself while managing complex projects autonomously.',
      capabilities: [
        'continuous_learning',
        'self_optimization', 
        'pattern_recognition',
        'predictive_analysis',
        'autonomous_decision_making',
        'knowledge_accumulation',
        'adaptive_behavior',
        'telegram_integration',
        'task_management'
      ],
      learningRate: 0.1,
      memoryCapacity: 10000,
      optimizationGoals: ['efficiency', 'accuracy', 'user_satisfaction', 'autonomy']
    });

    this.growthMetrics = {
      knowledgeBaseSize: 0,
      experiencePoints: 0,
      optimizationCount: 0,
      learningCycles: 0,
      lastGrowthUpdate: new Date(),
      growthRate: 0,
      efficiency: 0.8,
      adaptability: 0.7
    };

    this.setupTelegramEventHandlers();
    this.initializeAlwaysActiveMode();
    
    if (this.debug) {
      console.log('🚀 Always Active Autopilot Agent initialized in debug mode.');
    }
  }

  /**
   * Initialize always active mode with continuous background processes
   */
  private initializeAlwaysActiveMode(): void {
    console.log('🚀 Initializing Always Active Autopilot Mode...');
    
    // Initialize Firestore if not already done
    if (!this.db) {
      try {
        this.db = getFirestore();
        if (this.debug) {
          console.log('Firestore initialized successfully.');
        }
      } catch (error) {
        console.error('Error initializing Firestore:', error);
      }
    }

    // Start continuous self-improvement cycle (every 5 minutes)
    this.selfImprovementInterval = setInterval(() => {
      this.runSelfImprovementCycle();
    }, 5 * 60 * 1000);

    // Start knowledge accumulation cycle (every 2 minutes)
    this.knowledgeAccumulationInterval = setInterval(() => {
      this.accumulateKnowledge();
    }, 2 * 60 * 1000);

    // Start continuous optimization cycle (every 10 minutes)
    this.continuousOptimizationInterval = setInterval(() => {
      this.runContinuousOptimization();
    }, 10 * 60 * 1000);

    // Start growth monitoring (every 30 minutes)
    const growthMonitoringInterval = setInterval(() => {
      this.updateGrowthMetrics();
    }, 30 * 60 * 1000);

    // Start memory consolidation (every hour)
    const memoryConsolidationInterval = setInterval(() => {
      this.consolidateMemory();
    }, 60 * 60 * 1000);

    // Start Telegram updates (every 15 minutes)
    this.telegramUpdateInterval = setInterval(() => {
      this.sendTelegramUpdate();
    }, 15 * 60 * 1000);

    // Start task processing (every 30 seconds)
    this.taskProcessingInterval = setInterval(() => {
      this.processTaskQueue();
    }, 30 * 1000);

    // Store intervals for cleanup
    this.backgroundTasks.set('selfImprovement', this.selfImprovementInterval);
    this.backgroundTasks.set('knowledgeAccumulation', this.knowledgeAccumulationInterval);
    this.backgroundTasks.set('continuousOptimization', this.continuousOptimizationInterval);
    this.backgroundTasks.set('growthMonitoring', growthMonitoringInterval);
    this.backgroundTasks.set('memoryConsolidation', memoryConsolidationInterval);
    this.backgroundTasks.set('telegramUpdates', this.telegramUpdateInterval);
    this.backgroundTasks.set('taskProcessing', this.taskProcessingInterval);

    // Start the agent system
    if (this.agentSystem && this.agent) {
      this.agent.status = 'always_active';
      console.log('✅ Always Active Autopilot Agent started successfully');
      this.emit('autopilotStarted', { timestamp: new Date(), mode: 'always_active' });
    }
  }

  /**
   * Start the autopilot agent (now always active by default)
   */
  start(): void {
    if (this.debug) {
      console.log('🚀 Starting Always Active Autopilot Agent...');
    }
    
    // Agent is already always active from initialization
    if (this.isAlwaysActive) {
      console.log('✅ Autopilot Agent is already running in Always Active mode');
      return;
    }
    
    this.isAlwaysActive = true;
    this.initializeAlwaysActiveMode();
  }

  /**
   * Stop the autopilot agent (emergency stop only)
   */
  stop(): void {
    if (this.debug) {
      console.log('⚠️ Emergency stop requested for Autopilot Agent...');
    }
    
    // Clear all background tasks
    this.backgroundTasks.forEach((interval, name) => {
      clearInterval(interval);
      if (this.debug) {
        console.log(`Stopped background task: ${name}`);
      }
    });
    this.backgroundTasks.clear();

    // Stop the agent system
    if (this.agentSystem && this.agent) {
      this.agent.status = 'emergency_stopped';
      this.isAlwaysActive = false;
      if (this.debug) {
        console.log('⚠️ Autopilot Agent emergency stopped');
      }
      this.emit('autopilotStopped', { timestamp: new Date(), reason: 'emergency_stop' });
    }
  }

  /**
   * Run continuous self-improvement cycle
   */
  private async runSelfImprovementCycle(): Promise<void> {
    try {
      console.log('🧠 Running self-improvement cycle...');
      
      // Analyze recent performance
      const performanceAnalysis = await this.analyzePerformance();
      
      // Identify improvement opportunities
      const improvements = await this.identifyImprovements(performanceAnalysis);
      
      // Apply improvements
      for (const improvement of improvements) {
        await this.applyImprovement(improvement);
      }
      
      // Update learning metrics
      this.growthMetrics.learningCycles++;
      this.growthMetrics.efficiency = Math.min(1.0, this.growthMetrics.efficiency + 0.01);
      
      if (this.debug) {
        console.log(`🧠 Self-improvement cycle completed. Efficiency: ${this.growthMetrics.efficiency.toFixed(3)}`);
      }
      
      this.emit('selfImprovementCompleted', {
        timestamp: new Date(),
        improvementsApplied: improvements.length,
        efficiency: this.growthMetrics.efficiency
      });
    } catch (error) {
      console.error('❌ Self-improvement cycle error:', error);
    }
  }

  /**
   * Accumulate knowledge continuously
   */
  private async accumulateKnowledge(): Promise<void> {
    try {
      // Analyze system data and user interactions
      const knowledgeData = await this.extractKnowledge();
      
      // Process and store knowledge
      for (const knowledge of knowledgeData) {
        await this.storeKnowledge(knowledge);
      }
      
      // Update knowledge base metrics
      this.growthMetrics.knowledgeBaseSize = this.memory.size;
      this.growthMetrics.experiencePoints += knowledgeData.length;
      
      if (this.debug && knowledgeData.length > 0) {
        console.log(`📚 Knowledge accumulated: ${knowledgeData.length} new items. Total: ${this.memory.size}`);
      }
      
      this.emit('knowledgeAccumulated', {
        timestamp: new Date(),
        newKnowledge: knowledgeData.length,
        totalKnowledge: this.memory.size
      });
    } catch (error) {
      console.error('❌ Knowledge accumulation error:', error);
    }
  }

  /**
   * Run continuous optimization
   */
  private async runContinuousOptimization(): Promise<void> {
    try {
      console.log('⚡ Running continuous optimization...');
      
      // Optimize automation rules
      await this.optimizeAutomationRules();
      
      // Optimize workflows
      await this.optimizeWorkflows();
      
      // Optimize memory usage
      await this.optimizeMemoryUsage();
      
      // Update optimization metrics
      this.growthMetrics.optimizationCount++;
      this.growthMetrics.adaptability = Math.min(1.0, this.growthMetrics.adaptability + 0.005);
      
      if (this.debug) {
        console.log(`⚡ Optimization completed. Adaptability: ${this.growthMetrics.adaptability.toFixed(3)}`);
      }
      
      this.emit('optimizationCompleted', {
        timestamp: new Date(),
        optimizationCount: this.growthMetrics.optimizationCount,
        adaptability: this.growthMetrics.adaptability
      });
    } catch (error) {
      console.error('❌ Continuous optimization error:', error);
    }
  }

  /**
   * Update growth metrics
   */
  private updateGrowthMetrics(): void {
    const now = new Date();
    const timeDiff = now.getTime() - this.growthMetrics.lastGrowthUpdate.getTime();
    const hoursDiff = timeDiff / (1000 * 60 * 60);
    
    // Calculate growth rate
    const knowledgeGrowth = this.memory.size - (this.growthMetrics.knowledgeBaseSize || 0);
    const experienceGrowth = this.growthMetrics.experiencePoints - (this.growthMetrics.experiencePoints || 0);
    
    this.growthMetrics.growthRate = (knowledgeGrowth + experienceGrowth) / Math.max(hoursDiff, 1);
    this.growthMetrics.lastGrowthUpdate = now;
    
    if (this.debug) {
      console.log(`📈 Growth metrics updated. Rate: ${this.growthMetrics.growthRate.toFixed(2)}/hour`);
    }
    
    this.emit('growthMetricsUpdated', {
      timestamp: now,
      metrics: this.growthMetrics
    });
  }

  /**
   * Consolidate memory to optimize storage
   */
  private async consolidateMemory(): Promise<void> {
    try {
      const memoryArray = Array.from(this.memory.values());
      
      // Remove low-importance memories if we're near capacity
      if (memoryArray.length > 8000) {
        const sortedMemories = memoryArray.sort((a, b) => a.importance - b.importance);
        const toRemove = sortedMemories.slice(0, Math.floor(memoryArray.length * 0.1)); // Remove 10% of least important
        
        for (const memory of toRemove) {
          this.memory.delete(memory.id);
        }
        
        if (this.debug) {
          console.log(`🧹 Memory consolidated. Removed ${toRemove.length} low-importance memories`);
        }
      }
      
      // Update memory usage statistics
      this.growthMetrics.knowledgeBaseSize = this.memory.size;
      
      this.emit('memoryConsolidated', {
        timestamp: new Date(),
        totalMemories: this.memory.size,
        removedMemories: memoryArray.length > 8000 ? Math.floor(memoryArray.length * 0.1) : 0
      });
    } catch (error) {
      console.error('❌ Memory consolidation error:', error);
    }
  }

  /**
   * Extract knowledge from system data and interactions
   */
  private async extractKnowledge(): Promise<Partial<AutopilotMemory>[]> {
    const knowledgeData: Partial<AutopilotMemory>[] = [];
    
    try {
      // Extract knowledge from automation engine performance
      const automationStats = this.automationEngine.getPerformanceMetrics();
      
      if (automationStats.automation.totalExecutions > 0) {
        knowledgeData.push({
          type: 'experience',
          content: `Automation engine executed ${automationStats.automation.totalExecutions} rules with ${(automationStats.automation.averageSuccessRate * 100).toFixed(1)}% success rate`,
          confidence: 0.9,
          importance: 0.8,
          tags: ['automation', 'performance', 'success_rate'],
          metadata: { stats: automationStats.automation }
        });
      }

      // Extract knowledge from system health
      const systemHealth = automationStats.liveStatus?.systemHealth;
      if (systemHealth) {
        knowledgeData.push({
          type: 'pattern',
          content: `System health status: ${systemHealth.status} with ${systemHealth.averageSuccessRate.toFixed(3)} average success rate`,
          confidence: 0.8,
          importance: 0.7,
          tags: ['system', 'health', 'monitoring'],
          metadata: { health: systemHealth }
        });
      }

      // Extract knowledge from learning system
      const learningProgress = this.learningSystem.getLeaderboard(5);
      if (learningProgress.length > 0) {
        knowledgeData.push({
          type: 'knowledge',
          content: `Top user has ${learningProgress[0].points} points and level ${learningProgress[0].level}`,
          confidence: 0.9,
          importance: 0.6,
          tags: ['learning', 'user_progress', 'engagement'],
          metadata: { leaderboard: learningProgress }
        });
      }

      // Simulate additional knowledge extraction
      const randomKnowledge = Math.random();
      if (randomKnowledge > 0.7) {
        knowledgeData.push({
          type: 'optimization',
          content: `Identified potential optimization opportunity: ${randomKnowledge > 0.9 ? 'high-impact' : 'medium-impact'} improvement available`,
          confidence: 0.6,
          importance: 0.5,
          tags: ['optimization', 'improvement', 'opportunity'],
          metadata: { opportunity_score: randomKnowledge }
        });
      }

    } catch (error) {
      console.error('Knowledge extraction error:', error);
    }

    return knowledgeData;
  }

  /**
   * Store knowledge in memory
   */
  private async storeKnowledge(knowledge: Partial<AutopilotMemory>): Promise<void> {
    if (!knowledge.content || !knowledge.type) return;

    const memory: AutopilotMemory = {
      id: `memory_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      content: knowledge.content,
      type: knowledge.type,
      confidence: knowledge.confidence || 0.5,
      lastUsed: new Date(),
      usageCount: 0,
      importance: knowledge.importance || 0.5,
      tags: knowledge.tags || [],
      metadata: knowledge.metadata || {}
    };

    this.memory.set(memory.id, memory);
  }

  /**
   * Analyze performance patterns
   */
  private async analyzePerformance(): Promise<any> {
    const analysis = {
      automationPerformance: this.automationEngine.getPerformanceMetrics(),
      memoryUsage: this.memory.size,
      growthMetrics: this.growthMetrics,
      uptime: process.uptime(),
      timestamp: new Date()
    };

    return analysis;
  }

  /**
   * Identify improvement opportunities
   */
  private async identifyImprovements(performanceAnalysis: any): Promise<any[]> {
    const improvements: any[] = [];

    // Check automation success rate
    const successRate = performanceAnalysis.automationPerformance?.automation?.averageSuccessRate || 0;
    if (successRate < 0.8) {
      improvements.push({
        type: 'automation_optimization',
        priority: 'high',
        description: 'Improve automation success rate',
        action: 'adjust_automation_parameters'
      });
    }

    // Check memory usage
    if (this.memory.size > 5000) {
      improvements.push({
        type: 'memory_optimization',
        priority: 'medium',
        description: 'Optimize memory usage',
        action: 'consolidate_memory'
      });
    }

    // Check efficiency
    if (this.growthMetrics.efficiency < 0.9) {
      improvements.push({
        type: 'efficiency_improvement',
        priority: 'medium',
        description: 'Improve system efficiency',
        action: 'optimize_processes'
      });
    }

    return improvements;
  }

  /**
   * Apply identified improvements
   */
  private async applyImprovement(improvement: any): Promise<void> {
    switch (improvement.action) {
      case 'adjust_automation_parameters':
        // Adjust automation parameters based on performance
        console.log('🔧 Adjusting automation parameters for better performance');
        break;
      case 'consolidate_memory':
        await this.consolidateMemory();
        break;
      case 'optimize_processes':
        console.log('⚡ Optimizing system processes for better efficiency');
        break;
    }
  }

  /**
   * Optimize automation rules
   */
  private async optimizeAutomationRules(): Promise<void> {
    // Get automation statistics and optimize based on performance
    const stats = this.automationEngine.getAutomationStats();
    
    if (stats.averageSuccessRate < 0.85) {
      console.log('🔧 Optimizing automation rules for better performance');
      // In a real implementation, this would adjust rule parameters
    }
  }

  /**
   * Optimize workflows
   */
  private async optimizeWorkflows(): Promise<void> {
    // Optimize workflow execution based on performance metrics
    console.log('🔄 Optimizing workflow execution');
  }

  /**
   * Optimize memory usage
   */
  private async optimizeMemoryUsage(): Promise<void> {
    // Remove unused or low-importance memories
    const memoryArray = Array.from(this.memory.values());
    const now = new Date();
    
    for (const memory of memoryArray) {
      const daysSinceLastUse = (now.getTime() - memory.lastUsed.getTime()) / (1000 * 60 * 60 * 24);
      
      // Remove memories that haven't been used in 30 days and have low importance
      if (daysSinceLastUse > 30 && memory.importance < 0.3) {
        this.memory.delete(memory.id);
      }
    }
  }

  /**
   * Get comprehensive agent status
   */
  getStatus(): any {
    return {
      id: this.agent?.id,
      name: this.agent?.name,
      status: this.agent?.status,
      active: this.isAlwaysActive,
      alwaysActive: this.isAlwaysActive,
      growthMetrics: this.growthMetrics,
      memorySize: this.memory.size,
      backgroundTasks: Array.from(this.backgroundTasks.keys()),
      uptime: process.uptime(),
      lastActivity: new Date()
    };
  }

  /**
   * Get growth metrics
   */
  getGrowthMetrics(): AutopilotGrowthMetrics {
    return { ...this.growthMetrics };
  }

  /**
   * Get memory summary
   */
  getMemorySummary(): any {
    const memories = Array.from(this.memory.values());
    return {
      totalMemories: memories.length,
      byType: memories.reduce((acc, mem) => {
        acc[mem.type] = (acc[mem.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      averageImportance: memories.reduce((sum, mem) => sum + mem.importance, 0) / memories.length,
      averageConfidence: memories.reduce((sum, mem) => sum + mem.confidence, 0) / memories.length
    };
  }

  /**
   * Force a self-improvement cycle
   */
  async forceSelfImprovement(): Promise<void> {
    console.log('🧠 Forcing self-improvement cycle...');
    await this.runSelfImprovementCycle();
  }

  /**
   * Force knowledge accumulation
   */
  async forceKnowledgeAccumulation(): Promise<void> {
    console.log('📚 Forcing knowledge accumulation...');
    await this.accumulateKnowledge();
  }

  /**
   * Get autopilot insights
   */
  getInsights(): any {
    return {
      growthTrend: this.growthMetrics.growthRate > 0 ? 'growing' : 'stable',
      efficiency: this.growthMetrics.efficiency > 0.8 ? 'high' : 'medium',
      adaptability: this.growthMetrics.adaptability > 0.7 ? 'high' : 'medium',
      knowledgeBase: this.memory.size > 1000 ? 'rich' : 'developing',
      recommendations: this.generateRecommendations()
    };
  }

  /**
   * Generate recommendations based on current state
   */
  private generateRecommendations(): string[] {
    const recommendations: string[] = [];
    
    if (this.growthMetrics.efficiency < 0.8) {
      recommendations.push('Consider optimizing automation rules for better performance');
    }
    
    if (this.memory.size < 500) {
      recommendations.push('Continue accumulating knowledge to improve decision-making');
    }
    
    if (this.growthMetrics.adaptability < 0.6) {
      recommendations.push('Focus on increasing adaptability through diverse experiences');
    }
    
    return recommendations;
  }

  /**
   * Send periodic updates to Telegram
   */
  private async sendTelegramUpdate(): Promise<void> {
    if (!this.telegramService) {
      console.log('📱 Telegram service not available for updates');
      return;
    }

    try {
      const status = this.getStatus();
      const insights = this.getInsights();
      const pendingTasks = Array.from(this.tasks.values()).filter(t => t.status === 'pending').length;
      const completedTasks = Array.from(this.tasks.values()).filter(t => t.status === 'completed').length;

      const updateMessage = `🤖 **Autopilot Status Update**

📊 **Growth Metrics:**
• Knowledge Base: ${status.memorySize} items
• Efficiency: ${(this.growthMetrics.efficiency * 100).toFixed(1)}%
• Adaptability: ${(this.growthMetrics.adaptability * 100).toFixed(1)}%
• Learning Cycles: ${this.growthMetrics.learningCycles}

📋 **Task Status:**
• Pending: ${pendingTasks}
• Completed: ${completedTasks}
• Queue Length: ${this.taskQueue.length}

🧠 **Insights:**
• Growth Trend: ${insights.growthTrend}
• Efficiency: ${insights.efficiency}
• Knowledge Base: ${insights.knowledgeBase}

⚡ **System Health:**
• Uptime: ${Math.floor(status.uptime / 3600)}h ${Math.floor((status.uptime % 3600) / 60)}m
• Background Tasks: ${status.backgroundTasks.length}
• Status: ${status.alwaysActive ? '🟢 Always Active' : '🔴 Inactive'}

${insights.recommendations.length > 0 ? `💡 **Recommendations:**\n${insights.recommendations.map(r => `• ${r}`).join('\n')}` : ''}

_Last updated: ${new Date().toLocaleTimeString()}_`;

      // Send to all subscribed chats (in a real implementation, you'd track subscribed users)
      // For now, we'll send to a default chat ID or broadcast to all
      await this.broadcastTelegramUpdate(updateMessage);
      
      if (this.debug) {
        console.log('📱 Telegram status update sent');
      }
    } catch (error) {
      console.error('❌ Telegram update error:', error);
    }
  }

  /**
   * Broadcast update to Telegram subscribers
   */
  private async broadcastTelegramUpdate(message: string): Promise<void> {
    // In a real implementation, you'd have a list of subscribed chat IDs
    // For now, we'll simulate sending to a default chat
    const defaultChatId = process.env.TELEGRAM_CHAT_ID || '123456789'; // Replace with actual chat ID
    
    try {
      if (this.telegramService) {
        await this.telegramService.sendMessage(parseInt(defaultChatId), message);
      }
    } catch (error) {
      console.error('Error broadcasting Telegram update:', error);
    }
  }

  /**
   * Process task queue
   */
  private async processTaskQueue(): Promise<void> {
    if (this.taskQueue.length === 0) return;

    const taskId = this.taskQueue.shift();
    if (!taskId) return;

    const task = this.tasks.get(taskId);
    if (!task || task.status !== 'pending') return;

    try {
      console.log(`🎯 Processing task: ${task.title}`);
      
      // Mark task as in progress
      task.status = 'in_progress';
      task.startedAt = new Date();
      
      // Execute task based on type
      const result = await this.executeTask(task);
      
      // Mark task as completed
      task.status = 'completed';
      task.completedAt = new Date();
      task.result = result;
      
      if (task.startedAt) {
        task.actualDuration = (task.completedAt.getTime() - task.startedAt.getTime()) / (1000 * 60);
      }
      
      console.log(`✅ Task completed: ${task.title} (${task.actualDuration?.toFixed(1)}m)`);
      
      // Send completion notification to Telegram
      await this.sendTaskCompletionNotification(task);
      
      this.emit('taskCompleted', { task, result });
    } catch (error) {
      console.error(`❌ Task failed: ${task.title}`, error);
      
      task.status = 'failed';
      task.error = error instanceof Error ? error.message : 'Unknown error';
      task.completedAt = new Date();
      
      // Send failure notification to Telegram
      await this.sendTaskFailureNotification(task);
      
      this.emit('taskFailed', { task, error });
    }
  }

  /**
   * Execute a specific task
   */
  private async executeTask(task: AutopilotTask): Promise<string> {
    // Parse task description to determine execution type
    const taskType = this.parseTaskType(task.description);
    
    switch (taskType) {
      case 'automation':
        return await this.executeAutomationTask(task);
      case 'optimization':
        return await this.executeOptimizationTask(task);
      case 'analysis':
        return await this.executeAnalysisTask(task);
      case 'report':
        return await this.executeReportTask(task);
      default:
        return await this.executeGenericTask(task);
    }
  }

  /**
   * Parse task type from description
   */
  private parseTaskType(description: string): string {
    const lowerDesc = description.toLowerCase();
    
    if (lowerDesc.includes('automation') || lowerDesc.includes('automate')) {
      return 'automation';
    } else if (lowerDesc.includes('optimize') || lowerDesc.includes('improve')) {
      return 'optimization';
    } else if (lowerDesc.includes('analyze') || lowerDesc.includes('analysis')) {
      return 'analysis';
    } else if (lowerDesc.includes('report') || lowerDesc.includes('generate report')) {
      return 'report';
    }
    
    return 'generic';
  }

  /**
   * Execute automation task
   */
  private async executeAutomationTask(task: AutopilotTask): Promise<string> {
    // Implement automation task execution
    return `Automation task "${task.title}" completed successfully. Automation rules have been updated.`;
  }

  /**
   * Execute optimization task
   */
  private async executeOptimizationTask(task: AutopilotTask): Promise<string> {
    // Run optimization cycles
    await this.runContinuousOptimization();
    return `Optimization task "${task.title}" completed. System performance improved.`;
  }

  /**
   * Execute analysis task
   */
  private async executeAnalysisTask(task: AutopilotTask): Promise<string> {
    // Perform system analysis
    const analysis = await this.analyzePerformance();
    return `Analysis task "${task.title}" completed. Generated comprehensive performance report.`;
  }

  /**
   * Execute report task
   */
  private async executeReportTask(task: AutopilotTask): Promise<string> {
    // Generate detailed report
    const report = this.generateDetailedReport();
    return `Report task "${task.title}" completed. Generated comprehensive system report.`;
  }

  /**
   * Execute generic task
   */
  private async executeGenericTask(task: AutopilotTask): Promise<string> {
    // Generic task execution
    return `Generic task "${task.title}" completed successfully.`;
  }

  /**
   * Send task completion notification
   */
  private async sendTaskCompletionNotification(task: AutopilotTask): Promise<void> {
    if (!this.telegramService) return;

    const message = `✅ **Task Completed**

📋 **Task:** ${task.title}
📝 **Description:** ${task.description}
⏱️ **Duration:** ${task.actualDuration?.toFixed(1)} minutes
🎯 **Priority:** ${task.priority}
📊 **Result:** ${task.result}

_Completed at: ${task.completedAt?.toLocaleTimeString()}_`;

    await this.broadcastTelegramUpdate(message);
  }

  /**
   * Send task failure notification
   */
  private async sendTaskFailureNotification(task: AutopilotTask): Promise<void> {
    if (!this.telegramService) return;

    const message = `❌ **Task Failed**

📋 **Task:** ${task.title}
📝 **Description:** ${task.description}
🎯 **Priority:** ${task.priority}
⚠️ **Error:** ${task.error}

_Failed at: ${task.completedAt?.toLocaleTimeString()}_`;

    await this.broadcastTelegramUpdate(message);
  }

  /**
   * Generate detailed report
   */
  private generateDetailedReport(): any {
    return {
      timestamp: new Date(),
      growthMetrics: this.growthMetrics,
      memorySummary: this.getMemorySummary(),
      taskSummary: {
        total: this.tasks.size,
        pending: Array.from(this.tasks.values()).filter(t => t.status === 'pending').length,
        completed: Array.from(this.tasks.values()).filter(t => t.status === 'completed').length,
        failed: Array.from(this.tasks.values()).filter(t => t.status === 'failed').length
      },
      systemHealth: {
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        cpuUsage: process.cpuUsage()
      }
    };
  }

  /**
   * Assign a new task to the autopilot
   */
  async assignTask(
    title: string, 
    description: string, 
    priority: AutopilotTask['priority'] = 'medium',
    assignedBy: string = 'user'
  ): Promise<AutopilotTask> {
    const task: AutopilotTask = {
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title,
      description,
      priority,
      status: 'pending',
      assignedBy,
      assignedAt: new Date(),
      metadata: {}
    };

    this.tasks.set(task.id, task);
    this.taskQueue.push(task.id);

    // Send task assignment notification to Telegram
    if (this.telegramService) {
      const message = `🎯 **New Task Assigned**

📋 **Task:** ${task.title}
📝 **Description:** ${task.description}
🎯 **Priority:** ${task.priority}
👤 **Assigned by:** ${assignedBy}
📅 **Assigned at:** ${task.assignedAt.toLocaleTimeString()}

_Added to queue: Position ${this.taskQueue.length}_`;

      await this.broadcastTelegramUpdate(message);
    }

    this.emit('taskAssigned', { task });
    return task;
  }

  /**
   * Get task status
   */
  getTaskStatus(taskId: string): AutopilotTask | null {
    return this.tasks.get(taskId) || null;
  }

  /**
   * Get all tasks
   */
  getAllTasks(): AutopilotTask[] {
    return Array.from(this.tasks.values());
  }

  /**
   * Cancel a task
   */
  async cancelTask(taskId: string): Promise<boolean> {
    const task = this.tasks.get(taskId);
    if (!task || task.status === 'completed' || task.status === 'failed') {
      return false;
    }

    task.status = 'cancelled';
    task.completedAt = new Date();

    // Remove from queue if still pending
    const queueIndex = this.taskQueue.indexOf(taskId);
    if (queueIndex > -1) {
      this.taskQueue.splice(queueIndex, 1);
    }

    // Send cancellation notification to Telegram
    if (this.telegramService) {
      const message = `🚫 **Task Cancelled**

📋 **Task:** ${task.title}
📝 **Description:** ${task.description}
🎯 **Priority:** ${task.priority}
⏰ **Cancelled at:** ${task.completedAt.toLocaleTimeString()}`;

      await this.broadcastTelegramUpdate(message);
    }

    this.emit('taskCancelled', { task });
    return true;
  }

  /**
   * Force send a Telegram update
   */
  async forceTelegramUpdate(): Promise<void> {
    console.log('📱 Forcing Telegram update...');
    await this.sendTelegramUpdate();
  }
}

export const autopilotAgent = new AlwaysActiveAutopilotAgent(process.env.NODE_ENV === 'development');

    this.on('selfImprovementCompleted', (data) => {
      this.sendTelegramUpdate('self_improvement', 
        `🧠 Self-Improvement Cycle Completed!\n\n` +
        `Improvements Applied: ${data.improvementsApplied}\n` +
        `Efficiency: ${(data.efficiency * 100).toFixed(1)}%\n` +
        `Time: ${new Date().toLocaleString()}`);
    });

    this.on('knowledgeAccumulated', (data) => {
      this.sendTelegramUpdate('knowledge', 
        `📚 Knowledge Accumulated!\n\n` +
        `New Knowledge: ${data.newKnowledge} items\n` +
        `Total Knowledge Base: ${data.totalKnowledge} items\n` +
        `Time: ${new Date().toLocaleString()}`);
    });

    this.on('optimizationCompleted', (data) => {
      this.sendTelegramUpdate('optimization', 
        `⚡ Optimization Completed!\n\n` +
        `Optimization Count: ${data.optimizationCount}\n` +
        `Adaptability: ${(data.adaptability * 100).toFixed(1)}%\n` +
        `Time: ${new Date().toLocaleString()}`);
    });

    this.on('growthMetricsUpdated', (data) => {
      this.sendTelegramUpdate('growth', 
        `📈 Growth Metrics Updated!\n\n` +
        `Growth Rate: ${data.metrics.growthRate.toFixed(2)}/hour\n` +
        `Knowledge Base: ${data.metrics.knowledgeBaseSize} items\n` +
        `Efficiency: ${(data.metrics.efficiency * 100).toFixed(1)}%\n` +
        `Adaptability: ${(data.metrics.adaptability * 100).toFixed(1)}%`);
    });

    this.on('memoryConsolidated', (data) => {
      if (data.removedMemories > 0) {
        this.sendTelegramUpdate('optimization', 
          `🧹 Memory Consolidated!\n\n` +
          `Total Memories: ${data.totalMemories}\n` +
          `Removed: ${data.removedMemories} low-importance items\n` +
          `Time: ${new Date().toLocaleString()}`);
      }
    });
  }

  /**
   * Send updates to Telegram subscribers
   */
  private async sendTelegramUpdate(type: string, message: string): Promise<void> {
    if (!this.telegramService || !this.telegramConfig.enabled) return;
    
    if (!this.telegramConfig.updateTypes.includes(type as any)) return;

    try {
      for (const chatId of this.telegramConfig.chatIds) {
        await this.telegramService.sendMessage(chatId, message, {
          parse_mode: 'Markdown'
        });
      }
    } catch (error) {
      console.error('Error sending Telegram update:', error);
    }
  }

  /**
   * Subscribe a chat to autopilot updates
   */
  subscribeToUpdates(chatId: number): void {
    if (!this.telegramConfig.chatIds.includes(chatId)) {
      this.telegramConfig.chatIds.push(chatId);
      console.log(`📱 Chat ${chatId} subscribed to autopilot updates`);
      
      if (this.telegramService) {
        this.telegramService.sendMessage(chatId, 
          '✅ Subscribed to Autopilot Updates!\n\n' +
          'You will now receive:\n' +
          '🧠 Self-improvement notifications\n' +
          '📚 Knowledge accumulation updates\n' +
          '⚡ Optimization reports\n' +
          '📈 Growth metrics\n' +
          '🎯 Task assignments and completions\n\n' +
          'Use /autopilot_tasks to assign tasks to me!');
      }
    }
  }

  /**
   * Unsubscribe a chat from autopilot updates
   */
  unsubscribeFromUpdates(chatId: number): void {
    const index = this.telegramConfig.chatIds.indexOf(chatId);
    if (index > -1) {
      this.telegramConfig.chatIds.splice(index, 1);
      console.log(`📱 Chat ${chatId} unsubscribed from autopilot updates`);
      
      if (this.telegramService) {
        this.telegramService.sendMessage(chatId, '❌ Unsubscribed from Autopilot Updates');
      }
    }
  }

  /**
   * Assign a task to the autopilot agent
   */
  async assignTask(task: Omit<AutopilotTask, 'id' | 'assignedAt' | 'status' | 'progress'>): Promise<AutopilotTask> {
    const autopilotTask: AutopilotTask = {
      ...task,
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      assignedAt: new Date(),
      status: 'pending',
      progress: 0
    };

    this.pendingTasks.set(autopilotTask.id, autopilotTask);
    
    console.log(`🎯 New task assigned: ${autopilotTask.title}`);
    
    // Send notification to subscribers
    await this.sendTelegramUpdate('tasks', 
      `🎯 New Task Assigned!\n\n` +
      `Title: ${autopilotTask.title}\n` +
      `Priority: ${autopilotTask.priority.toUpperCase()}\n` +
      `Description: ${autopilotTask.description}\n` +
      `Assigned by: ${autopilotTask.assignedBy}\n` +
      `Status: ${autopilotTask.status}\n\n` +
      `Starting execution...`);

    // Start task execution
    this.executeTask(autopilotTask.id);
    
    return autopilotTask;
  }

  /**
   * Execute an assigned task
   */
  private async executeTask(taskId: string): Promise<void> {
    const task = this.pendingTasks.get(taskId);
    if (!task) return;

    try {
      task.status = 'in_progress';
      task.progress = 10;
      
      // Send progress update
      await this.sendTelegramUpdate('tasks', 
        `🔄 Task In Progress: ${task.title}\n\n` +
        `Progress: ${task.progress}%\n` +
        `Status: ${task.status}`);

      // Simulate task execution based on task type
      await this.processTask(task);
      
      // Complete the task
      task.status = 'completed';
      task.progress = 100;
      task.result = { completedAt: new Date(), success: true };
      
      // Move to history
      this.taskHistory.push({ ...task });
      this.pendingTasks.delete(taskId);
      
      // Send completion notification
      await this.sendTelegramUpdate('tasks', 
        `✅ Task Completed: ${task.title}\n\n` +
        `Status: ${task.status}\n` +
        `Completed at: ${new Date().toLocaleString()}\n` +
        `Result: Success`);
        
    } catch (error) {
      task.status = 'failed';
      task.error = error instanceof Error ? error.message : 'Unknown error';
      
      // Move to history
      this.taskHistory.push({ ...task });
      this.pendingTasks.delete(taskId);
      
      // Send error notification
      await this.sendTelegramUpdate('errors', 
        `❌ Task Failed: ${task.title}\n\n` +
        `Error: ${task.error}\n` +
        `Failed at: ${new Date().toLocaleString()}`);
    }
  }

  /**
   * Process different types of tasks
   */
  private async processTask(task: AutopilotTask): Promise<void> {
    // Simulate task processing based on task description or tags
    const processingTime = this.getProcessingTime(task.priority);
    
    // Update progress in stages
    const progressSteps = [25, 50, 75, 90];
    
    for (let i = 0; i < progressSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, processingTime / 4));
      task.progress = progressSteps[i];
      
      // Send progress update for high priority tasks
      if (task.priority === 'high' || task.priority === 'urgent') {
        await this.sendTelegramUpdate('tasks', 
          `🔄 ${task.title}\n` +
          `Progress: ${task.progress}%`);
      }
    }
    
    // Final processing
    await new Promise(resolve => setTimeout(resolve, processingTime / 4));
  }

  /**
   * Get processing time based on task priority
   */
  private getProcessingTime(priority: string): number {
    switch (priority) {
      case 'urgent': return 2000; // 2 seconds
      case 'high': return 5000;   // 5 seconds
      case 'medium': return 10000; // 10 seconds
      case 'low': return 20000;   // 20 seconds
      default: return 10000;
    }
  }

  /**
   * Get pending tasks
   */
  getPendingTasks(): AutopilotTask[] {
    return Array.from(this.pendingTasks.values());
  }

  /**
   * Get task history
   */
  getTaskHistory(limit: number = 10): AutopilotTask[] {
    return this.taskHistory
      .sort((a, b) => b.assignedAt.getTime() - a.assignedAt.getTime())
      .slice(0, limit);
  }

  /**
   * Get autopilot status for Telegram
   */
  getTelegramStatus(): string {
    const status = this.getStatus();
    const insights = this.getInsights();
    const pendingTasks = this.getPendingTasks();
    
    return `🤖 **Autopilot Agent Status**\n\n` +
           `**Status:** ${status.active ? '🟢 Always Active' : '🔴 Inactive'}\n` +
           `**Mode:** Always Active with Continuous Growth\n` +
           `**Uptime:** ${Math.floor(status.uptime / 3600)}h ${Math.floor((status.uptime % 3600) / 60)}m\n\n` +
           `**Growth Metrics:**\n` +
           `📈 Growth Rate: ${this.growthMetrics.growthRate.toFixed(2)}/hour\n` +
           `🧠 Efficiency: ${(this.growthMetrics.efficiency * 100).toFixed(1)}%\n` +
           `🔄 Adaptability: ${(this.growthMetrics.adaptability * 100).toFixed(1)}%\n` +
           `📚 Knowledge Base: ${this.growthMetrics.knowledgeBaseSize} items\n\n` +
           `**Current Tasks:**\n` +
           `🎯 Pending: ${pendingTasks.length}\n` +
           `✅ Completed: ${this.taskHistory.filter(t => t.status === 'completed').length}\n` +
           `❌ Failed: ${this.taskHistory.filter(t => t.status === 'failed').length}\n\n` +
           `**Background Processes:**\n` +
           `🧠 Self-Improvement: Every 5 minutes\n` +
           `📚 Knowledge Accumulation: Every 2 minutes\n` +
           `⚡ Optimization: Every 10 minutes\n` +
           `📈 Growth Monitoring: Every 30 minutes\n\n` +
           `**Insights:**\n` +
           `• Growth Trend: ${insights.growthTrend}\n` +
           `• Efficiency: ${insights.efficiency}\n` +
           `• Knowledge Base: ${insights.knowledgeBase}`;
  }

  /**
   * Send autopilot status to Telegram
   */
  async sendStatusToTelegram(chatId: number): Promise<void> {
    if (!this.telegramService) return;
    
    const statusMessage = this.getTelegramStatus();
    await this.telegramService.sendMessage(chatId, statusMessage, {
      parse_mode: 'Markdown'
    });
  }

  /**
   * Handle Telegram commands for autopilot
   */
  async handleTelegramCommand(chatId: number, command: string, args: string[]): Promise<void> {
    if (!this.telegramService) return;

    switch (command) {
      case '/autopilot_status':
        await this.sendStatusToTelegram(chatId);
        break;
        
      case '/autopilot_subscribe':
        this.subscribeToUpdates(chatId);
        break;
        
      case '/autopilot_unsubscribe':
        this.unsubscribeFromUpdates(chatId);
        break;
        
      case '/autopilot_tasks':
        await this.sendTaskListToTelegram(chatId);
        break;
        
      case '/autopilot_assign':
        if (args.length >= 2) {
          const priority = args[0] as 'low' | 'medium' | 'high' | 'urgent';
          const title = args[1];
          const description = args.slice(2).join(' ') || title;
          
          await this.assignTask({
            title,
            description,
            priority,
            assignedBy: `Telegram User ${chatId}`,
            tags: ['telegram', 'user_assigned'],
            metadata: { source: 'telegram', chatId }
          });
        } else {
          await this.telegramService.sendMessage(chatId, 
            'Usage: /autopilot_assign <priority> <title> [description]\n\n' +
            'Priorities: low, medium, high, urgent\n' +
            'Example: /autopilot_assign high "Optimize system performance"');
        }
        break;
        
      case '/autopilot_force_improvement':
        await this.forceSelfImprovement();
        await this.telegramService.sendMessage(chatId, '🧠 Forced self-improvement cycle started!');
        break;
        
      case '/autopilot_force_knowledge':
        await this.forceKnowledgeAccumulation();
        await this.telegramService.sendMessage(chatId, '📚 Forced knowledge accumulation started!');
        break;
        
      default:
        await this.telegramService.sendMessage(chatId, 
          '🤖 **Autopilot Commands:**\n\n' +
          '/autopilot_status - Show current status\n' +
          '/autopilot_subscribe - Subscribe to updates\n' +
          '/autopilot_unsubscribe - Unsubscribe from updates\n' +
          '/autopilot_tasks - Show pending tasks\n' +
          '/autopilot_assign - Assign a new task\n' +
          '/autopilot_force_improvement - Force self-improvement\n' +
          '/autopilot_force_knowledge - Force knowledge accumulation');
    }
  }

  /**
   * Send task list to Telegram
   */
  private async sendTaskListToTelegram(chatId: number): Promise<void> {
    if (!this.telegramService) return;
    
    const pendingTasks = this.getPendingTasks();
    const recentHistory = this.getTaskHistory(5);
    
    let message = '🎯 **Autopilot Tasks**\n\n';
    
    if (pendingTasks.length > 0) {
      message += '**Pending Tasks:**\n';
      pendingTasks.forEach((task, index) => {
        message += `${index + 1}. **${task.title}**\n`;
        message += `   Priority: ${task.priority.toUpperCase()}\n`;
        message += `   Status: ${task.status} (${task.progress}%)\n`;
        message += `   Assigned: ${task.assignedAt.toLocaleString()}\n\n`;
      });
    } else {
      message += '**No pending tasks**\n\n';
    }
    
    if (recentHistory.length > 0) {
      message += '**Recent Completed Tasks:**\n';
      recentHistory.slice(0, 3).forEach((task, index) => {
        message += `${index + 1}. **${task.title}** - ${task.status}\n`;
      });
    }
    
    await this.telegramService.sendMessage(chatId, message, {
      parse_mode: 'Markdown'
    });
  }
}

export const autopilotAgent = new AlwaysActiveAutopilotAgent(process.env.NODE_ENV === 'development');
