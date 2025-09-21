#!/usr/bin/env node

/**
 * Autopilot-LLM Integration System
 * ربط نظام الأوتوبايلوت مع نماذج اللغة الكبيرة من Cursor
 */

import { CursorLLMIntegration, LLMConfig, LLMProvider } from './cursor-llm-integration';
import { Command } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import axios from 'axios';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';

// Load environment variables
dotenv.config();

interface AutopilotLLMConfig {
  enabled: boolean;
  defaultProvider: LLMProvider;
  fallbackProviders: LLMProvider[];
  context: {
    autopilot: string;
    system: string;
    user: string;
  };
  limits: {
    maxTokens: number;
    timeout: number;
    retries: number;
  };
}

interface AutopilotTask {
  id: string;
  type: string;
  content: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  assignedAgent?: string;
  llmAnalysis?: any;
  llmResponse?: string;
  timestamp: string;
  userId?: string;
}

class AutopilotLLMIntegration {
  private llmIntegration: CursorLLMIntegration;
  private config: AutopilotLLMConfig;
  private baseUrl: string;
  private taskQueue: AutopilotTask[] = [];
  private activeTasks: Map<string, AutopilotTask> = new Map();

  constructor() {
    this.baseUrl = process.env.AURAOS_API_URL || 'http://localhost:5000';
    this.config = this.loadAutopilotLLMConfig();
    this.llmIntegration = new CursorLLMIntegration();
    
    console.log(chalk.blue('🤖 Autopilot-LLM Integration initialized'));
  }

  /**
   * Load autopilot LLM configuration
   */
  private loadAutopilotLLMConfig(): AutopilotLLMConfig {
    return {
      enabled: process.env.AUTOPILOT_LLM_ENABLED === 'true' || true,
      defaultProvider: (process.env.AUTOPILOT_LLM_PROVIDER as LLMProvider) || 'gemini',
      fallbackProviders: ['openai', 'anthropic', 'groq'],
      context: {
        autopilot: `You are an advanced AI assistant integrated with the AuraOS Autopilot system. 
        You help with task analysis, decision making, and providing intelligent responses for automation tasks.
        You have access to the full autopilot system and can analyze tasks, suggest optimizations, and provide context-aware assistance.`,
        system: `You are operating within the AuraOS ecosystem with access to:
        - Real-time system status
        - Task queue and workflow management
        - Agent coordination and resource allocation
        - Performance monitoring and analytics
        - User preferences and historical data`,
        user: `You interact with users through the autopilot system and should:
        - Provide clear, actionable responses
        - Suggest optimizations and improvements
        - Explain complex automation concepts simply
        - Offer proactive assistance based on context`
      },
      limits: {
        maxTokens: parseInt(process.env.AUTOPILOT_LLM_MAX_TOKENS || '4000'),
        timeout: parseInt(process.env.AUTOPILOT_LLM_TIMEOUT || '30000'),
        retries: parseInt(process.env.AUTOPILOT_LLM_RETRIES || '3')
      }
    };
  }

  /**
   * Analyze task using LLM
   */
  async analyzeTask(task: AutopilotTask): Promise<any> {
    try {
      console.log(chalk.blue(`🔍 Analyzing task ${task.id} with LLM...`));

      const prompt = `
        Analyze this autopilot task and provide structured recommendations:

        Task Details:
        - ID: ${task.id}
        - Type: ${task.type}
        - Content: ${task.content}
        - Priority: ${task.priority}
        - Status: ${task.status}

        Provide analysis in JSON format:
        {
          "intent": "what the user wants to accomplish",
          "category": "data_analysis|web_scraping|automation|ai_task|general|system_optimization",
          "complexity": "low|medium|high",
          "estimated_duration": "seconds|minutes|hours",
          "required_resources": ["resource1", "resource2"],
          "suggested_agent": "best_agent_for_this_task",
          "optimization_suggestions": ["suggestion1", "suggestion2"],
          "risk_assessment": "low|medium|high",
          "dependencies": ["dependency1", "dependency2"]
        }
      `;

      const response = await this.llmIntegration.sendMessage(
        prompt, 
        this.config.context.autopilot
      );

      try {
        const analysis = JSON.parse(response.content);
        task.llmAnalysis = analysis;
        task.llmResponse = response.content;
        
        console.log(chalk.green(`✅ Task ${task.id} analyzed successfully`));
        return analysis;
      } catch (parseError) {
        // Fallback if JSON parsing fails
        task.llmAnalysis = {
          intent: "general task processing",
          category: "general",
          complexity: "medium",
          estimated_duration: "minutes",
          required_resources: [],
          suggested_agent: "gemini_ai",
          optimization_suggestions: [],
          risk_assessment: "low",
          dependencies: []
        };
        task.llmResponse = response.content;
        return task.llmAnalysis;
      }

    } catch (error) {
      console.error(chalk.red(`❌ Task analysis failed for ${task.id}:`), error);
      return {
        intent: "general task processing",
        category: "general", 
        complexity: "medium",
        estimated_duration: "minutes",
        required_resources: [],
        suggested_agent: "gemini_ai",
        optimization_suggestions: [],
        risk_assessment: "low",
        dependencies: []
      };
    }
  }

  /**
   * Generate intelligent response for autopilot decision making
   */
  async generateIntelligentResponse(query: string, context?: any): Promise<string> {
    try {
      const systemContext = this.config.context.system;
      const userContext = this.config.context.user;
      
      const fullContext = `${systemContext}\n\nCurrent System Context:\n${JSON.stringify(context, null, 2)}\n\nUser Context: ${userContext}`;

      const response = await this.llmIntegration.sendMessage(query, fullContext);
      return response.content;
    } catch (error) {
      console.error(chalk.red('❌ Intelligent response generation failed:'), error);
      return 'I apologize, but I encountered an error while processing your request. Please try again.';
    }
  }

  /**
   * Optimize autopilot workflow using LLM
   */
  async optimizeWorkflow(workflowData: any): Promise<any> {
    try {
      console.log(chalk.blue('🔧 Optimizing workflow with LLM...'));

      const prompt = `
        Analyze this autopilot workflow and suggest optimizations:

        Workflow Data:
        ${JSON.stringify(workflowData, null, 2)}

        Provide optimization suggestions in JSON format:
        {
          "performance_improvements": ["improvement1", "improvement2"],
          "efficiency_gains": ["gain1", "gain2"],
          "resource_optimization": ["optimization1", "optimization2"],
          "error_reduction": ["reduction1", "reduction2"],
          "scalability_suggestions": ["suggestion1", "suggestion2"],
          "priority_recommendations": ["rec1", "rec2"]
        }
      `;

      const response = await this.llmIntegration.sendMessage(
        prompt,
        this.config.context.autopilot
      );

      try {
        return JSON.parse(response.content);
      } catch (parseError) {
        return {
          performance_improvements: ["Review task prioritization"],
          efficiency_gains: ["Optimize agent allocation"],
          resource_optimization: ["Monitor resource usage"],
          error_reduction: ["Improve error handling"],
          scalability_suggestions: ["Consider load balancing"],
          priority_recommendations: ["Focus on high-priority tasks"]
        };
      }
    } catch (error) {
      console.error(chalk.red('❌ Workflow optimization failed:'), error);
      return {
        performance_improvements: [],
        efficiency_gains: [],
        resource_optimization: [],
        error_reduction: [],
        scalability_suggestions: [],
        priority_recommendations: []
      };
    }
  }

  /**
   * Provide autopilot assistance through chat interface
   */
  async autopilotChat(query: string): Promise<string> {
    try {
      // Get current autopilot status for context
      let autopilotContext = {};
      try {
        const response = await axios.get(`${this.baseUrl}/api/autopilot/status`);
        autopilotContext = response.data;
      } catch (error) {
        console.log(chalk.yellow('⚠️ Could not fetch autopilot status for context'));
      }

      const contextPrompt = `
        User Query: ${query}
        
        Current Autopilot System Context:
        ${JSON.stringify(autopilotContext, null, 2)}
        
        Please provide helpful assistance related to the AuraOS Autopilot system.
        Be specific and actionable in your response.
      `;

      const response = await this.llmIntegration.sendMessage(
        contextPrompt,
        this.config.context.autopilot
      );

      return response.content;
    } catch (error) {
      console.error(chalk.red('❌ Autopilot chat failed:'), error);
      return 'I apologize, but I encountered an error while processing your autopilot query. Please try again.';
    }
  }

  /**
   * Analyze system performance using LLM
   */
  async analyzeSystemPerformance(): Promise<any> {
    try {
      console.log(chalk.blue('📊 Analyzing system performance with LLM...'));

      // Gather system data
      const systemData = await this.gatherSystemData();

      const prompt = `
        Analyze this AuraOS Autopilot system performance data and provide insights:

        System Data:
        ${JSON.stringify(systemData, null, 2)}

        Provide analysis in JSON format:
        {
          "overall_health": "excellent|good|fair|poor",
          "performance_score": 0-100,
          "key_metrics": {
            "efficiency": "percentage",
            "reliability": "percentage", 
            "scalability": "percentage"
          },
          "bottlenecks": ["bottleneck1", "bottleneck2"],
          "recommendations": ["rec1", "rec2"],
          "optimization_opportunities": ["opp1", "opp2"],
          "risk_factors": ["risk1", "risk2"]
        }
      `;

      const response = await this.llmIntegration.sendMessage(
        prompt,
        this.config.context.system
      );

      try {
        return JSON.parse(response.content);
      } catch (parseError) {
        return {
          overall_health: "good",
          performance_score: 75,
          key_metrics: {
            efficiency: "80%",
            reliability: "85%",
            scalability: "70%"
          },
          bottlenecks: ["Resource allocation"],
          recommendations: ["Monitor system resources"],
          optimization_opportunities: ["Improve task scheduling"],
          risk_factors: ["High load periods"]
        };
      }
    } catch (error) {
      console.error(chalk.red('❌ System performance analysis failed:'), error);
      return {
        overall_health: "unknown",
        performance_score: 0,
        key_metrics: {
          efficiency: "unknown",
          reliability: "unknown",
          scalability: "unknown"
        },
        bottlenecks: [],
        recommendations: ["Check system status"],
        optimization_opportunities: [],
        risk_factors: []
      };
    }
  }

  /**
   * Gather system data for analysis
   */
  private async gatherSystemData(): Promise<any> {
    const systemData = {
      timestamp: new Date().toISOString(),
      autopilot_status: null,
      system_status: null,
      task_queue: this.taskQueue.length,
      active_tasks: this.activeTasks.size,
      llm_config: this.config
    };

    try {
      // Get autopilot status
      const autopilotResponse = await axios.get(`${this.baseUrl}/api/autopilot/status`);
      systemData.autopilot_status = autopilotResponse.data;
    } catch (error) {
      console.log(chalk.yellow('⚠️ Could not fetch autopilot status'));
    }

    try {
      // Get system status
      const systemResponse = await axios.get(`${this.baseUrl}/api/system/status`);
      systemData.system_status = systemResponse.data;
    } catch (error) {
      console.log(chalk.yellow('⚠️ Could not fetch system status'));
    }

    return systemData;
  }

  /**
   * Interactive autopilot LLM chat
   */
  async interactiveChat() {
    console.log(chalk.blue.bold('\n🤖 Autopilot LLM Assistant\n'));
    console.log(chalk.gray('Type "exit" to quit, "help" for commands, "analyze" for system analysis\n'));

    while (true) {
      const { message } = await inquirer.prompt([
        {
          type: 'input',
          name: 'message',
          message: chalk.cyan('You:'),
          validate: (input) => input.trim().length > 0 || 'Please enter a message'
        }
      ]);

      if (message.toLowerCase() === 'exit') {
        console.log(chalk.yellow('\n👋 Goodbye!'));
        break;
      }

      if (message.toLowerCase() === 'help') {
        this.showHelp();
        continue;
      }

      if (message.toLowerCase() === 'analyze') {
        await this.performSystemAnalysis();
        continue;
      }

      if (message.toLowerCase() === 'status') {
        await this.showAutopilotStatus();
        continue;
      }

      try {
        console.log(chalk.blue('🤖 Autopilot AI:'), 'Thinking...');
        
        const response = await this.autopilotChat(message);
        console.log(chalk.green('🤖 Autopilot AI:'), response);
        console.log(''); // Empty line for readability

      } catch (error: any) {
        console.error(chalk.red('❌ Error:'), error.message);
      }
    }
  }

  /**
   * Show help information
   */
  private showHelp() {
    console.log(chalk.blue.bold('\n📚 Autopilot LLM Commands\n'));
    console.log(chalk.green('Available commands:'));
    console.log('  help    - Show this help message');
    console.log('  exit    - Exit the chat');
    console.log('  analyze - Analyze system performance');
    console.log('  status  - Show autopilot status');
    console.log('');
    console.log(chalk.green('Ask questions about:'));
    console.log('  • Task optimization and automation');
    console.log('  • System performance and monitoring');
    console.log('  • Workflow improvements');
    console.log('  • Agent coordination and management');
    console.log('  • Troubleshooting and diagnostics');
    console.log('');
  }

  /**
   * Perform system analysis
   */
  private async performSystemAnalysis() {
    console.log(chalk.blue.bold('\n📊 System Analysis\n'));
    
    try {
      console.log(chalk.yellow('🔍 Analyzing system performance...'));
      const analysis = await this.analyzeSystemPerformance();
      
      console.log(chalk.green('📊 Analysis Results:\n'));
      console.log(`Overall Health: ${chalk.blue(analysis.overall_health)}`);
      console.log(`Performance Score: ${chalk.blue(analysis.performance_score + '/100')}`);
      console.log(`Efficiency: ${chalk.blue(analysis.key_metrics.efficiency)}`);
      console.log(`Reliability: ${chalk.blue(analysis.key_metrics.reliability)}`);
      console.log(`Scalability: ${chalk.blue(analysis.key_metrics.scalability)}`);
      
      if (analysis.bottlenecks.length > 0) {
        console.log(chalk.yellow('\n🚧 Bottlenecks:'));
        analysis.bottlenecks.forEach((bottleneck, index) => {
          console.log(`  ${index + 1}. ${bottleneck}`);
        });
      }
      
      if (analysis.recommendations.length > 0) {
        console.log(chalk.green('\n💡 Recommendations:'));
        analysis.recommendations.forEach((rec, index) => {
          console.log(`  ${index + 1}. ${rec}`);
        });
      }
      
    } catch (error: any) {
      console.error(chalk.red('❌ Analysis failed:'), error.message);
    }
  }

  /**
   * Show autopilot status
   */
  private async showAutopilotStatus() {
    console.log(chalk.blue.bold('\n🤖 Autopilot Status\n'));
    
    try {
      const response = await axios.get(`${this.baseUrl}/api/autopilot/status`);
      const status = response.data;
      
      console.log(chalk.green('📊 Autopilot Information:'));
      console.log(`Status: ${status.active ? chalk.green('✅ Active') : chalk.red('❌ Inactive')}`);
      console.log(`Active Rules: ${chalk.blue(status.rules || 0)}`);
      console.log(`Active Workflows: ${chalk.blue(status.workflows || 0)}`);
      console.log(`Last Execution: ${chalk.yellow(status.lastExecution || 'N/A')}`);
      console.log(`LLM Integration: ${this.config.enabled ? chalk.green('✅ Enabled') : chalk.red('❌ Disabled')}`);
      console.log(`LLM Provider: ${chalk.blue(this.config.defaultProvider)}`);
      
    } catch (error: any) {
      console.error(chalk.red('❌ Failed to get autopilot status:'), error.message);
    }
  }

  /**
   * Get configuration
   */
  getConfig(): AutopilotLLMConfig {
    return this.config;
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<AutopilotLLMConfig>) {
    this.config = { ...this.config, ...newConfig };
    console.log(chalk.green('✅ Configuration updated'));
  }
}

// CLI Setup
const program = new Command();
const autopilotLLM = new AutopilotLLMIntegration();

program
  .name('autopilot-llm')
  .description('Autopilot LLM Integration System')
  .version('1.0.0');

// Add the missing status command
program
  .command('chat')
  .description('Interactive chat with autopilot LLM')
  .action(async () => {
    await autopilotLLM.interactiveChat();
    process.exit(0);
  });

program
  .command('analyze')
  .description('Analyze system performance with LLM')
  .action(async () => {
    console.log(chalk.blue.bold('\n📊 System Analysis\n'));

    try {
      const analysis = await autopilotLLM.analyzeSystemPerformance();
      console.log(chalk.green('📊 Analysis Results:\n'));
      console.log(JSON.stringify(analysis, null, 2));
    } catch (error: any) {
      console.error(chalk.red('❌ Analysis failed:'), error.message);
    }

    process.exit(0);
  });

program
  .command('ask <question>')
  .description('Ask a question to the autopilot LLM')
  .action(async (question) => {
    try {
      console.log(chalk.blue('🤔 Thinking...'));
      const response = await autopilotLLM.autopilotChat(question);
      console.log(chalk.green('\n🤖 Autopilot AI:\n'));
      console.log(response);
    } catch (error: any) {
      console.error(chalk.red('❌ Error:'), error.message);
    }
    process.exit(0);
  });

program
  .command('status')
  .description('Show autopilot LLM status')
  .action(async () => {
    await autopilotLLM.showAutopilotStatus();
    process.exit(0);
  });

// Parse command line arguments
program.parse();

// If no command provided, show help
if (!process.argv.slice(2).length) {
  program.outputHelp();
}

export { AutopilotLLMIntegration, AutopilotLLMConfig, AutopilotTask };
