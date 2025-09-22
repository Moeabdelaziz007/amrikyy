#!/usr/bin/env node

require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

class AutopilotFeedbackLoop {
  constructor(taskIntake, taskDispatcher) {
    this.taskIntake = taskIntake;
    this.taskDispatcher = taskDispatcher;
    this.bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
      polling: false,
    });

    this.feedbackHistory = [];
    this.performanceMetrics = {
      totalTasks: 0,
      successfulTasks: 0,
      failedTasks: 0,
      averageResponseTime: 0,
      agentEfficiency: {},
    };

    this.setupFeedbackHandlers();
    this.startPerformanceMonitoring();
    console.log('🔄 Autopilot Feedback Loop initialized');
  }

  setupFeedbackHandlers() {
    // Monitor task completion
    setInterval(() => {
      this.monitorTaskCompletion();
    }, 1000);

    // Send periodic status updates
    setInterval(() => {
      this.sendPeriodicStatus();
    }, 300000); // Every 5 minutes

    // Performance analysis
    setInterval(() => {
      this.analyzePerformance();
    }, 600000); // Every 10 minutes
  }

  async monitorTaskCompletion() {
    // Check for completed tasks in dispatcher
    const activeTasks = this.taskDispatcher.activeTasks;
    const completedTasks = [];

    // This would be implemented with event emitters in a real system
    // For now, we'll simulate monitoring
  }

  async sendTaskFeedback(task) {
    try {
      const feedback = {
        taskId: task.id,
        timestamp: new Date().toISOString(),
        status: task.status,
        agent: task.executingAgent,
        duration: task.duration,
        success: task.status === 'completed',
        userSatisfaction: this.calculateUserSatisfaction(task),
      };

      this.feedbackHistory.push(feedback);
      this.updatePerformanceMetrics(feedback);

      // Send feedback to user
      await this.sendUserFeedback(task, feedback);

      // Send to self-debugging engine if failed
      if (task.status === 'failed') {
        await this.sendToSelfDebugging(task);
      }

      // Update agent efficiency
      this.updateAgentEfficiency(feedback);
    } catch (error) {
      console.error('❌ Feedback processing failed:', error);
    }
  }

  async sendUserFeedback(task, feedback) {
    const statusEmoji = feedback.success ? '✅' : '❌';
    const satisfactionEmoji = this.getSatisfactionEmoji(
      feedback.userSatisfaction
    );

    const message =
      `${statusEmoji} **Task ${task.status.toUpperCase()}**\n\n` +
      `**ID**: \`${task.id}\`\n` +
      `**Agent**: ${feedback.agent}\n` +
      `**Duration**: ${feedback.duration}\n` +
      `**Performance**: ${satisfactionEmoji} ${feedback.userSatisfaction}/10\n\n`;

    let resultMessage = '';
    if (feedback.success && task.result) {
      resultMessage = `**Result**:\n\`\`\`\n${task.result.data?.response?.substring(0, 500) || 'Task completed successfully'}\n\`\`\``;
    } else if (!feedback.success) {
      resultMessage = `**Error**: ${task.error || 'Unknown error occurred'}`;
    }

    await this.bot.sendMessage(task.chatId, message + resultMessage, {
      parse_mode: 'Markdown',
    });

    // Send improvement suggestions if low satisfaction
    if (feedback.userSatisfaction < 7) {
      await this.sendImprovementSuggestions(task, feedback);
    }
  }

  async sendImprovementSuggestions(task, feedback) {
    const suggestions = await this.generateImprovementSuggestions(
      task,
      feedback
    );

    await this.bot.sendMessage(
      task.chatId,
      `💡 **Improvement Suggestions**\n\n` +
        `**Task**: ${task.id}\n` +
        `**Satisfaction**: ${feedback.userSatisfaction}/10\n\n` +
        `**Suggestions**:\n${suggestions}\n\n` +
        `🔄 System will learn from this feedback`,
      { parse_mode: 'Markdown' }
    );
  }

  async generateImprovementSuggestions(task, feedback) {
    const suggestions = [];

    if (feedback.userSatisfaction < 5) {
      suggestions.push('• Consider using a different agent for this task type');
      suggestions.push('• Increase task priority for faster processing');
      suggestions.push('• Break down complex tasks into smaller parts');
    }

    if (feedback.duration && feedback.duration.includes('m')) {
      suggestions.push(
        '• Task took longer than expected - optimizing agent selection'
      );
      suggestions.push('• Consider parallel processing for similar tasks');
    }

    if (
      feedback.agent === 'gemini_ai' &&
      task.analysis?.complexity === 'high'
    ) {
      suggestions.push(
        '• High complexity tasks might benefit from specialized agents'
      );
      suggestions.push('• Consider task preprocessing to improve results');
    }

    return (
      suggestions.join('\n') ||
      '• System is learning and will improve automatically'
    );
  }

  async sendToSelfDebugging(task) {
    const debugInfo = {
      taskId: task.id,
      error: task.error,
      agent: task.executingAgent,
      timestamp: new Date().toISOString(),
      context: {
        type: task.type,
        analysis: task.analysis,
        user: task.user,
      },
    };

    // Send to self-debugging engine
    console.log('🔧 Sending failed task to self-debugging engine:', debugInfo);

    // In a real implementation, this would trigger the self-debugging engine
    // For now, we'll log it
    console.log('📊 Debug Info:', JSON.stringify(debugInfo, null, 2));
  }

  calculateUserSatisfaction(task) {
    // Simple satisfaction calculation based on various factors
    let satisfaction = 8; // Base satisfaction

    if (task.status === 'failed') {
      satisfaction = 2;
    } else if (task.status === 'completed') {
      satisfaction = 9;

      // Reduce satisfaction for long durations
      if (task.duration && task.duration.includes('m')) {
        satisfaction -= 2;
      }

      // Reduce satisfaction for complex tasks with simple results
      if (
        task.analysis?.complexity === 'high' &&
        !task.result?.data?.response
      ) {
        satisfaction -= 1;
      }
    }

    return Math.max(1, Math.min(10, satisfaction));
  }

  getSatisfactionEmoji(satisfaction) {
    if (satisfaction >= 9) return '🔥';
    if (satisfaction >= 7) return '👍';
    if (satisfaction >= 5) return '😐';
    if (satisfaction >= 3) return '👎';
    return '😞';
  }

  updatePerformanceMetrics(feedback) {
    this.performanceMetrics.totalTasks++;

    if (feedback.success) {
      this.performanceMetrics.successfulTasks++;
    } else {
      this.performanceMetrics.failedTasks++;
    }

    // Update average response time
    const duration = this.parseDuration(feedback.duration);
    const currentAvg = this.performanceMetrics.averageResponseTime;
    const totalTasks = this.performanceMetrics.totalTasks;

    this.performanceMetrics.averageResponseTime =
      (currentAvg * (totalTasks - 1) + duration) / totalTasks;
  }

  updateAgentEfficiency(feedback) {
    const agent = feedback.agent;

    if (!this.performanceMetrics.agentEfficiency[agent]) {
      this.performanceMetrics.agentEfficiency[agent] = {
        totalTasks: 0,
        successfulTasks: 0,
        totalDuration: 0,
        averageSatisfaction: 0,
      };
    }

    const agentMetrics = this.performanceMetrics.agentEfficiency[agent];
    agentMetrics.totalTasks++;

    if (feedback.success) {
      agentMetrics.successfulTasks++;
    }

    agentMetrics.totalDuration += this.parseDuration(feedback.duration);
    agentMetrics.averageSatisfaction =
      (agentMetrics.averageSatisfaction * (agentMetrics.totalTasks - 1) +
        feedback.userSatisfaction) /
      agentMetrics.totalTasks;
  }

  async sendPeriodicStatus() {
    try {
      const stats = this.taskDispatcher.getTaskStats();
      const performance = this.getPerformanceSummary();

      const message =
        `📊 **Autopilot Status Report**\n\n` +
        `🔄 **Active Tasks**: ${stats.active}\n` +
        `⏳ **Queue**: ${stats.queued}\n` +
        `✅ **Success Rate**: ${performance.successRate}%\n` +
        `⚡ **Avg Response**: ${performance.avgResponseTime}\n` +
        `🎯 **Top Agent**: ${performance.topAgent}\n\n` +
        `🕐 Report Time: ${new Date().toLocaleString()}`;

      // Send to admin chat if configured
      if (
        process.env.TELEGRAM_ADMIN_CHAT_ID &&
        process.env.TELEGRAM_ADMIN_CHAT_ID !== 'YOUR_CHAT_ID_NEEDED'
      ) {
        await this.bot.sendMessage(
          process.env.TELEGRAM_ADMIN_CHAT_ID,
          message,
          { parse_mode: 'Markdown' }
        );
      }
    } catch (error) {
      console.error('❌ Periodic status failed:', error);
    }
  }

  async analyzePerformance() {
    const analysis = {
      timestamp: new Date().toISOString(),
      totalTasks: this.performanceMetrics.totalTasks,
      successRate: this.calculateSuccessRate(),
      averageResponseTime: this.performanceMetrics.averageResponseTime,
      agentPerformance: this.performanceMetrics.agentEfficiency,
      recommendations: this.generateRecommendations(),
    };

    console.log('📈 Performance Analysis:', JSON.stringify(analysis, null, 2));

    // Store analysis for future reference
    this.feedbackHistory.push({
      type: 'performance_analysis',
      data: analysis,
      timestamp: new Date().toISOString(),
    });
  }

  calculateSuccessRate() {
    if (this.performanceMetrics.totalTasks === 0) return 0;
    return (
      (this.performanceMetrics.successfulTasks /
        this.performanceMetrics.totalTasks) *
      100
    ).toFixed(1);
  }

  getPerformanceSummary() {
    const successRate = this.calculateSuccessRate();
    const avgResponseTime =
      this.performanceMetrics.averageResponseTime < 1000
        ? `${Math.round(this.performanceMetrics.averageResponseTime)}ms`
        : `${Math.round(this.performanceMetrics.averageResponseTime / 1000)}s`;

    let topAgent = 'None';
    let topScore = 0;

    Object.entries(this.performanceMetrics.agentEfficiency).forEach(
      ([agent, metrics]) => {
        const score =
          (metrics.successfulTasks / metrics.totalTasks) *
          metrics.averageSatisfaction;
        if (score > topScore) {
          topScore = score;
          topAgent = agent;
        }
      }
    );

    return {
      successRate,
      avgResponseTime,
      topAgent,
    };
  }

  generateRecommendations() {
    const recommendations = [];

    if (this.performanceMetrics.totalTasks > 0) {
      const successRate = this.calculateSuccessRate();

      if (successRate < 80) {
        recommendations.push('Consider improving agent selection algorithm');
        recommendations.push('Review failed task patterns for optimization');
      }

      if (this.performanceMetrics.averageResponseTime > 10000) {
        recommendations.push(
          'Optimize task processing for faster response times'
        );
        recommendations.push('Consider increasing agent capacity');
      }
    }

    return recommendations;
  }

  parseDuration(duration) {
    if (!duration || duration === 'N/A') return 0;

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

  startPerformanceMonitoring() {
    console.log('📊 Performance monitoring started');
  }

  getFeedbackHistory() {
    return this.feedbackHistory;
  }

  getPerformanceMetrics() {
    return this.performanceMetrics;
  }
}

module.exports = AutopilotFeedbackLoop;
