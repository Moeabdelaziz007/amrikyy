#!/usr/bin/env node

require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

class TaskDispatcher {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });

    this.agents = new Map();
    this.taskQueue = [];
    this.activeTasks = new Map();
    this.agentStats = new Map();

    this.initializeAgents();
    this.startDispatcher();
    console.log('🚀 Task Dispatcher initialized with MCP Agents');
  }

  initializeAgents() {
    // Gemini AI Agent
    this.agents.set('gemini_ai', {
      name: 'Gemini AI Agent',
      type: 'ai_analysis',
      capabilities: [
        'text_analysis',
        'data_processing',
        'content_generation',
        'translation',
      ],
      status: 'online',
      load: 0,
      maxConcurrentTasks: 5,
    });

    // HTTPie Agent (Web Scraping & API calls)
    this.agents.set('httpie_agent', {
      name: 'HTTPie Agent',
      type: 'web_automation',
      capabilities: [
        'web_scraping',
        'api_calls',
        'http_requests',
        'data_extraction',
      ],
      status: 'online',
      load: 0,
      maxConcurrentTasks: 3,
    });

    // JQ Agent (Data Processing)
    this.agents.set('jq_agent', {
      name: 'JQ Data Agent',
      type: 'data_processing',
      capabilities: [
        'json_processing',
        'data_filtering',
        'data_transformation',
      ],
      status: 'online',
      load: 0,
      maxConcurrentTasks: 10,
    });

    // Automation Agent
    this.agents.set('automation_agent', {
      name: 'Automation Agent',
      type: 'automation',
      capabilities: [
        'task_automation',
        'workflow_execution',
        'system_commands',
      ],
      status: 'online',
      load: 0,
      maxConcurrentTasks: 2,
    });

    // File Agent
    this.agents.set('file_agent', {
      name: 'File Management Agent',
      type: 'file_operations',
      capabilities: [
        'file_operations',
        'directory_management',
        'file_processing',
      ],
      status: 'online',
      load: 0,
      maxConcurrentTasks: 5,
    });

    console.log(`✅ Initialized ${this.agents.size} MCP Agents`);
  }

  startDispatcher() {
    // Process tasks every 2 seconds
    setInterval(() => {
      this.processTaskQueue();
    }, 2000);

    // Update agent stats every 30 seconds
    setInterval(() => {
      this.updateAgentStats();
    }, 30000);

    console.log('🔄 Task Dispatcher started');
  }

  async processTaskQueue() {
    if (this.taskQueue.length === 0) return;

    // Sort tasks by priority
    this.taskQueue.sort((a, b) => {
      const priorityOrder = { urgent: 3, high: 2, medium: 1, low: 0 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });

    // Process tasks
    for (let i = this.taskQueue.length - 1; i >= 0; i--) {
      const task = this.taskQueue[i];
      const agent = this.selectBestAgent(task);

      if (
        agent &&
        this.agents.get(agent).load < this.agents.get(agent).maxConcurrentTasks
      ) {
        this.taskQueue.splice(i, 1);
        await this.executeTask(task, agent);
      }
    }
  }

  selectBestAgent(task) {
    const analysis = task.analysis || {};
    const requiredAgents = analysis.required_agents || [task.assignedAgent];

    let bestAgent = null;
    let bestScore = -1;

    for (const agentName of requiredAgents) {
      const agent = this.agents.get(agentName);
      if (!agent || agent.status !== 'online') continue;

      const score = this.calculateAgentScore(agent, task);
      if (score > bestScore) {
        bestScore = score;
        bestAgent = agentName;
      }
    }

    return bestAgent || 'gemini_ai'; // Fallback to Gemini AI
  }

  calculateAgentScore(agent, task) {
    let score = 100; // Base score

    // Reduce score based on current load
    score -= (agent.load / agent.maxConcurrentTasks) * 50;

    // Increase score for matching capabilities
    const analysis = task.analysis || {};
    const category = analysis.category || 'general';

    const categoryMatch = {
      data_analysis: ['gemini_ai', 'jq_agent'],
      web_scraping: ['httpie_agent'],
      automation: ['automation_agent'],
      ai_task: ['gemini_ai'],
      file_operations: ['file_agent'],
      general: ['gemini_ai'],
    };

    if (
      categoryMatch[category] &&
      categoryMatch[category].includes(
        agent.name.toLowerCase().replace(' ', '_')
      )
    ) {
      score += 30;
    }

    return Math.max(0, score);
  }

  async executeTask(task, agentName) {
    try {
      console.log(`🎯 Executing task ${task.id} with ${agentName}`);

      // Update task status
      task.status = 'executing';
      task.executingAgent = agentName;
      task.startTime = new Date().toISOString();

      // Add to active tasks
      this.activeTasks.set(task.id, task);

      // Update agent load
      this.agents.get(agentName).load++;

      // Execute based on agent type
      const result = await this.executeWithAgent(task, agentName);

      // Update task with result
      task.status = result.success ? 'completed' : 'failed';
      task.endTime = new Date().toISOString();
      task.result = result;
      task.duration = this.calculateDuration(task.startTime, task.endTime);

      // Update agent load
      this.agents.get(agentName).load--;

      // Move to completed
      this.activeTasks.delete(task.id);

      // Update stats
      this.updateTaskStats(task, agentName);

      console.log(`✅ Task ${task.id} completed in ${task.duration}`);
    } catch (error) {
      console.error(`❌ Task ${task.id} execution failed:`, error);

      task.status = 'failed';
      task.error = error.message;
      task.endTime = new Date().toISOString();

      this.agents.get(agentName).load--;
      this.activeTasks.delete(task.id);
    }
  }

  async executeWithAgent(task, agentName) {
    const agent = this.agents.get(agentName);

    switch (agent.type) {
      case 'ai_analysis':
        return await this.executeGeminiTask(task);

      case 'web_automation':
        return await this.executeHttpieTask(task);

      case 'data_processing':
        return await this.executeJQTask(task);

      case 'automation':
        return await this.executeAutomationTask(task);

      case 'file_operations':
        return await this.executeFileTask(task);

      default:
        return await this.executeGeminiTask(task);
    }
  }

  async executeGeminiTask(task) {
    try {
      const prompt = `
            Execute this task using your AI capabilities:

            Task: ${task.content}
            Type: ${task.type}
            Analysis: ${JSON.stringify(task.analysis)}

            Provide a comprehensive response with:
            1. Task execution details
            2. Results or findings
            3. Recommendations if applicable
            4. Any relevant data or insights

            Format your response as a structured analysis.
            `;

      const result = await this.model.generateContent(prompt);
      const response = result.response.text();

      return {
        success: true,
        message: 'Task completed successfully with Gemini AI',
        data: {
          response: response,
          agent: 'gemini_ai',
          timestamp: new Date().toISOString(),
        },
        agent: 'gemini_ai',
      };
    } catch (error) {
      return {
        success: false,
        message: `Gemini AI execution failed: ${error.message}`,
        error: error.message,
        agent: 'gemini_ai',
      };
    }
  }

  async executeHttpieTask(task) {
    // Simulate HTTPie agent execution
    return {
      success: true,
      message: 'Web scraping/API call completed',
      data: {
        result: 'HTTP request executed successfully',
        agent: 'httpie_agent',
        timestamp: new Date().toISOString(),
      },
      agent: 'httpie_agent',
    };
  }

  async executeJQTask(task) {
    // Simulate JQ agent execution
    return {
      success: true,
      message: 'Data processing completed',
      data: {
        result: 'JSON data processed successfully',
        agent: 'jq_agent',
        timestamp: new Date().toISOString(),
      },
      agent: 'jq_agent',
    };
  }

  async executeAutomationTask(task) {
    // Simulate automation agent execution
    return {
      success: true,
      message: 'Automation task completed',
      data: {
        result: 'Automation workflow executed',
        agent: 'automation_agent',
        timestamp: new Date().toISOString(),
      },
      agent: 'automation_agent',
    };
  }

  async executeFileTask(task) {
    // Simulate file agent execution
    return {
      success: true,
      message: 'File operation completed',
      data: {
        result: 'File operation executed successfully',
        agent: 'file_agent',
        timestamp: new Date().toISOString(),
      },
      agent: 'file_agent',
    };
  }

  updateTaskStats(task, agentName) {
    if (!this.agentStats.has(agentName)) {
      this.agentStats.set(agentName, {
        totalTasks: 0,
        completedTasks: 0,
        failedTasks: 0,
        totalDuration: 0,
      });
    }

    const stats = this.agentStats.get(agentName);
    stats.totalTasks++;

    if (task.status === 'completed') {
      stats.completedTasks++;
    } else {
      stats.failedTasks++;
    }

    if (task.duration) {
      const durationMs = this.parseDuration(task.duration);
      stats.totalDuration += durationMs;
    }
  }

  updateAgentStats() {
    console.log('📊 Agent Statistics:');
    this.agentStats.forEach((stats, agentName) => {
      const successRate =
        stats.totalTasks > 0
          ? ((stats.completedTasks / stats.totalTasks) * 100).toFixed(1)
          : 0;

      console.log(
        `  ${agentName}: ${stats.completedTasks}/${stats.totalTasks} (${successRate}%)`
      );
    });
  }

  calculateDuration(start, end) {
    if (!start || !end) return 'N/A';
    const startTime = new Date(start);
    const endTime = new Date(end);
    const diffMs = endTime - startTime;

    if (diffMs < 1000) return `${diffMs}ms`;
    if (diffMs < 60000) return `${Math.floor(diffMs / 1000)}s`;
    return `${Math.floor(diffMs / 60000)}m ${Math.floor((diffMs % 60000) / 1000)}s`;
  }

  parseDuration(duration) {
    // Parse duration string to milliseconds
    if (duration.includes('ms')) return parseInt(duration);
    if (duration.includes('s')) return parseInt(duration) * 1000;
    if (duration.includes('m')) {
      const parts = duration.split('m');
      const minutes = parseInt(parts[0]);
      const seconds = parts[1] ? parseInt(parts[1].replace('s', '')) : 0;
      return (minutes * 60 + seconds) * 1000;
    }
    return 0;
  }

  // Public methods for task intake system
  addTask(task) {
    this.taskQueue.push(task);
    console.log(
      `📥 Task ${task.id} added to queue (${this.taskQueue.length} in queue)`
    );
  }

  getAgentStatus() {
    const status = {};
    this.agents.forEach((agent, name) => {
      status[name] = {
        status: agent.status,
        load: agent.load,
        maxLoad: agent.maxConcurrentTasks,
        capabilities: agent.capabilities,
      };
    });
    return status;
  }

  getTaskStats() {
    return {
      queued: this.taskQueue.length,
      active: this.activeTasks.size,
      agents: this.getAgentStatus(),
    };
  }
}

module.exports = TaskDispatcher;
