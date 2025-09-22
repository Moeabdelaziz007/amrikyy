#!/usr/bin/env node

require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * 🔄 Autopilot Feedback Loop System
 * تحليل النتائج وإصلاح الأخطاء تلقائيًا
 * نظام التغذية الراجعة الذكي
 */
class FeedbackLoop {
  constructor(taskIntake, taskDispatcher, taskExecutor) {
    this.taskIntake = taskIntake;
    this.taskDispatcher = taskDispatcher;
    this.taskExecutor = taskExecutor;
    this.bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
      polling: false,
    });
    this.genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });

    this.feedbackHistory = [];
    this.performanceMetrics = {
      totalTasks: 0,
      successfulTasks: 0,
      failedTasks: 0,
      averageResponseTime: 0,
      averageSatisfaction: 0,
      agentEfficiency: {},
      errorPatterns: new Map(),
      improvementSuggestions: [],
    };

    this.setupFeedbackHandlers();
    this.startPerformanceMonitoring();
    this.startErrorAnalysis();

    console.log('🔄 Feedback Loop initialized');
  }

  /**
   * إعداد معالجات التغذية الراجعة
   */
  setupFeedbackHandlers() {
    // مراقبة اكتمال المهام كل ثانية
    this.taskMonitorInterval = setInterval(() => {
      this.monitorTaskCompletion();
    }, 1000);

    // إرسال تقارير دورية كل 5 دقائق
    this.statusInterval = setInterval(() => {
      this.sendPeriodicStatus();
    }, 300000);

    // تحليل الأداء كل 10 دقائق
    this.analysisInterval = setInterval(() => {
      this.analyzePerformance();
    }, 600000);

    // تحليل الأخطاء كل 15 دقيقة
    this.errorAnalysisInterval = setInterval(() => {
      this.analyzeErrorPatterns();
    }, 900000);
  }

  /**
   * مراقبة اكتمال المهام
   */
  async monitorTaskCompletion() {
    try {
      const activeTasks = this.taskDispatcher.getTaskStats().active;
      const completedTasks = this.taskIntake.getTaskHistory();

      // البحث عن المهام المكتملة حديثاً
      const recentCompleted = completedTasks.filter(task => {
        const completionTime = new Date(task.endTime || task.timestamp);
        const now = new Date();
        return now - completionTime < 60000; // آخر دقيقة
      });

      // معالجة المهام المكتملة حديثاً
      for (const task of recentCompleted) {
        if (!this.feedbackHistory.find(f => f.taskId === task.id)) {
          await this.processTaskFeedback(task);
        }
      }
    } catch (error) {
      console.error('❌ Task monitoring failed:', error);
    }
  }

  /**
   * معالجة تغذية راجعة للمهمة
   */
  async processTaskFeedback(task) {
    try {
      const feedback = {
        taskId: task.id,
        timestamp: new Date().toISOString(),
        status: task.status,
        agent: task.executingAgent || task.assignedAgent,
        duration: task.duration,
        success: task.status === 'completed',
        userSatisfaction: await this.calculateUserSatisfaction(task),
        quality: task.result?.quality || 0.8,
        complexity: task.analysis?.complexity || 'medium',
      };

      this.feedbackHistory.push(feedback);
      this.updatePerformanceMetrics(feedback);

      // إرسال التغذية الراجعة للمستخدم
      await this.sendUserFeedback(task, feedback);

      // إرسال للتصحيح الذاتي إذا فشلت
      if (task.status === 'failed') {
        await this.sendToSelfDebugging(task);
      }

      // تحديث كفاءة الوكيل
      this.updateAgentEfficiency(feedback);

      // تحليل أنماط الأخطاء
      if (!feedback.success) {
        this.analyzeErrorPattern(task);
      }

      console.log(
        `📊 Feedback processed for task ${task.id}: ${feedback.userSatisfaction}/10`
      );
    } catch (error) {
      console.error('❌ Feedback processing failed:', error);
    }
  }

  /**
   * حساب رضا المستخدم
   */
  async calculateUserSatisfaction(task) {
    let satisfaction = 8; // الرضا الأساسي

    if (task.status === 'failed') {
      satisfaction = 2;
    } else if (task.status === 'completed') {
      satisfaction = 9;

      // تقليل الرضا للمدة الطويلة
      if (task.duration && this.parseDuration(task.duration) > 30000) {
        satisfaction -= 2;
      }

      // تقليل الرضا للمهام المعقدة مع نتائج بسيطة
      if (
        task.analysis?.complexity === 'high' &&
        !task.result?.data?.response
      ) {
        satisfaction -= 1;
      }

      // زيادة الرضا للجودة العالية
      if (task.result?.quality && task.result.quality > 0.9) {
        satisfaction += 1;
      }

      // تقليل الرضا للأخطاء في التنفيذ
      if (task.error) {
        satisfaction -= 3;
      }
    }

    return Math.max(1, Math.min(10, satisfaction));
  }

  /**
   * إرسال التغذية الراجعة للمستخدم
   */
  async sendUserFeedback(task, feedback) {
    const statusEmoji = feedback.success ? '✅' : '❌';
    const satisfactionEmoji = this.getSatisfactionEmoji(
      feedback.userSatisfaction
    );
    const qualityEmoji = this.getQualityEmoji(feedback.quality);

    const message =
      `${statusEmoji} **تم ${task.status === 'completed' ? 'إكمال' : 'فشل'} المهمة**\n\n` +
      `**المعرف**: \`${task.id}\`\n` +
      `**الوكيل**: ${feedback.agent}\n` +
      `**المدة**: ${feedback.duration}\n` +
      `**الأداء**: ${satisfactionEmoji} ${feedback.userSatisfaction}/10\n` +
      `**الجودة**: ${qualityEmoji} ${Math.round(feedback.quality * 100)}%\n\n`;

    let resultMessage = '';
    if (feedback.success && task.result) {
      const response = task.result.data?.response || 'تم إكمال المهمة بنجاح';
      resultMessage = `**النتيجة**:\n\`\`\`\n${response.substring(0, 500)}${response.length > 500 ? '...' : ''}\n\`\`\``;
    } else if (!feedback.success) {
      resultMessage = `**الخطأ**: ${task.error || 'حدث خطأ غير معروف'}`;
    }

    await this.bot.sendMessage(task.chatId, message + resultMessage, {
      parse_mode: 'Markdown',
    });

    // إرسال اقتراحات التحسين إذا كان الرضا منخفض
    if (feedback.userSatisfaction < 7) {
      await this.sendImprovementSuggestions(task, feedback);
    }

    // إرسال تحليل إضافي للمهام المعقدة
    if (task.analysis?.complexity === 'high' && feedback.success) {
      await this.sendComplexTaskAnalysis(task, feedback);
    }
  }

  /**
   * إرسال اقتراحات التحسين
   */
  async sendImprovementSuggestions(task, feedback) {
    const suggestions = await this.generateImprovementSuggestions(
      task,
      feedback
    );

    await this.bot.sendMessage(
      task.chatId,
      `💡 **اقتراحات التحسين**\n\n` +
        `**المهمة**: ${task.id}\n` +
        `**الرضا**: ${feedback.userSatisfaction}/10\n` +
        `**الجودة**: ${Math.round(feedback.quality * 100)}%\n\n` +
        `**الاقتراحات**:\n${suggestions}\n\n` +
        `🔄 النظام سيتعلم من هذه التغذية الراجعة`,
      { parse_mode: 'Markdown' }
    );
  }

  /**
   * إرسال تحليل المهام المعقدة
   */
  async sendComplexTaskAnalysis(task, feedback) {
    const analysis = await this.generateComplexTaskAnalysis(task, feedback);

    await this.bot.sendMessage(
      task.chatId,
      `🧠 **تحليل المهمة المعقدة**\n\n` +
        `**المهمة**: ${task.id}\n` +
        `**التعقيد**: ${task.analysis?.complexity}\n` +
        `**الوكيل**: ${feedback.agent}\n\n` +
        `**التحليل**:\n${analysis}`,
      { parse_mode: 'Markdown' }
    );
  }

  /**
   * توليد اقتراحات التحسين
   */
  async generateImprovementSuggestions(task, feedback) {
    try {
      const prompt = `
            Generate improvement suggestions for this task execution:

            Task: ${task.content}
            Status: ${task.status}
            Satisfaction: ${feedback.userSatisfaction}/10
            Quality: ${feedback.quality}
            Agent: ${feedback.agent}
            Duration: ${feedback.duration}

            Provide specific, actionable suggestions in Arabic.
            `;

      const result = await this.model.generateContent(prompt);
      const suggestions = result.response.text();

      return suggestions;
    } catch (error) {
      const suggestions = [];

      if (feedback.userSatisfaction < 5) {
        suggestions.push('• فكر في استخدام وكيل مختلف لهذا النوع من المهام');
        suggestions.push('• زيادة أولوية المهمة للمعالجة الأسرع');
        suggestions.push('• تقسيم المهام المعقدة إلى أجزاء أصغر');
      }

      if (feedback.duration && this.parseDuration(feedback.duration) > 30000) {
        suggestions.push(
          '• المهمة استغرقت وقتاً أطول من المتوقع - تحسين اختيار الوكيل'
        );
        suggestions.push('• فكر في المعالجة المتوازية للمهام المشابهة');
      }

      if (
        feedback.agent === 'gemini_ai' &&
        task.analysis?.complexity === 'high'
      ) {
        suggestions.push('• المهام عالية التعقيد قد تستفيد من وكلاء متخصصين');
        suggestions.push('• فكر في المعالجة المسبقة للمهمة لتحسين النتائج');
      }

      return suggestions.join('\n') || '• النظام يتعلم وسيتحسن تلقائياً';
    }
  }

  /**
   * توليد تحليل المهام المعقدة
   */
  async generateComplexTaskAnalysis(task, feedback) {
    try {
      const prompt = `
            Analyze this complex task execution:

            Task: ${task.content}
            Complexity: ${task.analysis?.complexity}
            Agent: ${feedback.agent}
            Duration: ${feedback.duration}
            Quality: ${feedback.quality}

            Provide detailed analysis in Arabic about:
            1. Task execution strategy
            2. Performance insights
            3. Optimization opportunities
            4. Future recommendations
            `;

      const result = await this.model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      return `تحليل المهمة المعقدة:\n• تم تنفيذ المهمة بنجاح\n• الجودة: ${Math.round(feedback.quality * 100)}%\n• المدة: ${feedback.duration}\n• الوكيل: ${feedback.agent}`;
    }
  }

  /**
   * إرسال للتصحيح الذاتي
   */
  async sendToSelfDebugging(task) {
    const debugInfo = {
      taskId: task.id,
      error: task.error,
      agent: task.executingAgent || task.assignedAgent,
      timestamp: new Date().toISOString(),
      context: {
        type: task.type,
        analysis: task.analysis,
        user: task.user,
        content: task.content,
      },
      feedback: {
        satisfaction: await this.calculateUserSatisfaction(task),
        quality: task.result?.quality || 0,
      },
    };

    console.log('🔧 Sending failed task to self-debugging engine:', debugInfo);

    // في التطبيق الحقيقي، هذا سيؤدي إلى تشغيل محرك التصحيح الذاتي
    // الآن سنسجله فقط
    console.log('📊 Debug Info:', JSON.stringify(debugInfo, null, 2));
  }

  /**
   * تحديث مقاييس الأداء
   */
  updatePerformanceMetrics(feedback) {
    this.performanceMetrics.totalTasks++;

    if (feedback.success) {
      this.performanceMetrics.successfulTasks++;
    } else {
      this.performanceMetrics.failedTasks++;
    }

    // تحديث متوسط وقت الاستجابة
    const duration = this.parseDuration(feedback.duration);
    const currentAvg = this.performanceMetrics.averageResponseTime;
    const totalTasks = this.performanceMetrics.totalTasks;

    this.performanceMetrics.averageResponseTime =
      (currentAvg * (totalTasks - 1) + duration) / totalTasks;

    // تحديث متوسط الرضا
    const currentSatisfactionAvg = this.performanceMetrics.averageSatisfaction;
    this.performanceMetrics.averageSatisfaction =
      (currentSatisfactionAvg * (totalTasks - 1) + feedback.userSatisfaction) /
      totalTasks;
  }

  /**
   * تحديث كفاءة الوكيل
   */
  updateAgentEfficiency(feedback) {
    const agent = feedback.agent;

    if (!this.performanceMetrics.agentEfficiency[agent]) {
      this.performanceMetrics.agentEfficiency[agent] = {
        totalTasks: 0,
        successfulTasks: 0,
        totalDuration: 0,
        averageSatisfaction: 0,
        averageQuality: 0,
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
    agentMetrics.averageQuality =
      (agentMetrics.averageQuality * (agentMetrics.totalTasks - 1) +
        feedback.quality) /
      agentMetrics.totalTasks;
  }

  /**
   * تحليل أنماط الأخطاء
   */
  analyzeErrorPattern(task) {
    const errorKey = task.error || 'unknown_error';

    if (!this.performanceMetrics.errorPatterns.has(errorKey)) {
      this.performanceMetrics.errorPatterns.set(errorKey, {
        count: 0,
        tasks: [],
        agents: new Set(),
        lastOccurrence: null,
      });
    }

    const pattern = this.performanceMetrics.errorPatterns.get(errorKey);
    pattern.count++;
    pattern.tasks.push(task.id);
    pattern.agents.add(task.executingAgent || task.assignedAgent);
    pattern.lastOccurrence = new Date().toISOString();

    // إذا تكرر الخطأ أكثر من 3 مرات، أضف اقتراح تحسين
    if (pattern.count >= 3) {
      this.performanceMetrics.improvementSuggestions.push({
        type: 'error_pattern',
        error: errorKey,
        count: pattern.count,
        suggestion: `تحسين معالجة خطأ: ${errorKey}`,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * إرسال التقارير الدورية
   */
  async sendPeriodicStatus() {
    try {
      const stats = this.taskDispatcher.getTaskStats();
      const performance = this.getPerformanceSummary();

      const message =
        `📊 **تقرير حالة Autopilot الدوري**\n\n` +
        `🔄 **المهام النشطة**: ${stats.active}\n` +
        `⏳ **قائمة الانتظار**: ${stats.queued}\n` +
        `✅ **معدل النجاح**: ${performance.successRate}%\n` +
        `⚡ **متوسط الاستجابة**: ${performance.avgResponseTime}\n` +
        `🎯 **أفضل وكيل**: ${performance.topAgent}\n` +
        `😊 **متوسط الرضا**: ${performance.avgSatisfaction}/10\n\n` +
        `🕐 وقت التقرير: ${new Date().toLocaleString()}`;

      // إرسال للمدير إذا تم تكوينه
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

  /**
   * تحليل الأداء
   */
  async analyzePerformance() {
    const analysis = {
      timestamp: new Date().toISOString(),
      totalTasks: this.performanceMetrics.totalTasks,
      successRate: this.calculateSuccessRate(),
      averageResponseTime: this.performanceMetrics.averageResponseTime,
      averageSatisfaction: this.performanceMetrics.averageSatisfaction,
      agentPerformance: this.performanceMetrics.agentEfficiency,
      errorPatterns: Object.fromEntries(this.performanceMetrics.errorPatterns),
      recommendations: this.generateRecommendations(),
    };

    console.log('📈 Performance Analysis:', JSON.stringify(analysis, null, 2));

    // حفظ التحليل للمرجع المستقبلي
    this.feedbackHistory.push({
      type: 'performance_analysis',
      data: analysis,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * تحليل أنماط الأخطاء
   */
  async analyzeErrorPatterns() {
    const errorAnalysis = {
      timestamp: new Date().toISOString(),
      totalErrors: this.performanceMetrics.failedTasks,
      errorPatterns: Object.fromEntries(this.performanceMetrics.errorPatterns),
      topErrors: this.getTopErrors(),
      suggestions: this.generateErrorSuggestions(),
    };

    console.log(
      '🔍 Error Pattern Analysis:',
      JSON.stringify(errorAnalysis, null, 2)
    );

    // إضافة اقتراحات التحسين
    this.performanceMetrics.improvementSuggestions.push({
      type: 'error_analysis',
      data: errorAnalysis,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * الحصول على أفضل الأخطاء
   */
  getTopErrors() {
    const errors = Array.from(this.performanceMetrics.errorPatterns.entries())
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 5);

    return errors.map(([error, data]) => ({
      error,
      count: data.count,
      agents: Array.from(data.agents),
    }));
  }

  /**
   * توليد اقتراحات الأخطاء
   */
  generateErrorSuggestions() {
    const suggestions = [];

    this.performanceMetrics.errorPatterns.forEach((data, error) => {
      if (data.count >= 3) {
        suggestions.push({
          error,
          count: data.count,
          suggestion: `تحسين معالجة خطأ: ${error}`,
          priority: data.count >= 5 ? 'high' : 'medium',
        });
      }
    });

    return suggestions;
  }

  /**
   * حساب معدل النجاح
   */
  calculateSuccessRate() {
    if (this.performanceMetrics.totalTasks === 0) return 0;
    return (
      (this.performanceMetrics.successfulTasks /
        this.performanceMetrics.totalTasks) *
      100
    ).toFixed(1);
  }

  /**
   * الحصول على ملخص الأداء
   */
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
      avgSatisfaction: this.performanceMetrics.averageSatisfaction.toFixed(1),
    };
  }

  /**
   * توليد التوصيات
   */
  generateRecommendations() {
    const recommendations = [];

    if (this.performanceMetrics.totalTasks > 0) {
      const successRate = this.calculateSuccessRate();

      if (successRate < 80) {
        recommendations.push('فكر في تحسين خوارزمية اختيار الوكيل');
        recommendations.push('راجع أنماط المهام الفاشلة للتحسين');
      }

      if (this.performanceMetrics.averageResponseTime > 10000) {
        recommendations.push('حسن معالجة المهام لاستجابة أسرع');
        recommendations.push('فكر في زيادة قدرة الوكلاء');
      }

      if (this.performanceMetrics.averageSatisfaction < 7) {
        recommendations.push('حسن جودة النتائج لرضا أفضل');
        recommendations.push('راجع عملية تحليل المهام');
      }
    }

    return recommendations;
  }

  /**
   * الحصول على رمز الرضا
   */
  getSatisfactionEmoji(satisfaction) {
    if (satisfaction >= 9) return '🔥';
    if (satisfaction >= 7) return '👍';
    if (satisfaction >= 5) return '😐';
    if (satisfaction >= 3) return '👎';
    return '😞';
  }

  /**
   * الحصول على رمز الجودة
   */
  getQualityEmoji(quality) {
    if (quality >= 0.9) return '💎';
    if (quality >= 0.8) return '⭐';
    if (quality >= 0.7) return '✅';
    if (quality >= 0.6) return '⚠️';
    return '❌';
  }

  /**
   * تحليل المدة إلى ميلي ثانية
   */
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

  /**
   * بدء مراقبة الأداء
   */
  startPerformanceMonitoring() {
    console.log('📊 Performance monitoring started');
  }

  /**
   * بدء تحليل الأخطاء
   */
  startErrorAnalysis() {
    console.log('🔍 Error analysis started');
  }

  /**
   * الحصول على تاريخ التغذية الراجعة
   */
  getFeedbackHistory() {
    return this.feedbackHistory;
  }

  /**
   * الحصول على مقاييس الأداء
   */
  getPerformanceMetrics() {
    return this.performanceMetrics;
  }

  /**
   * إيقاف النظام
   */
  stop() {
    if (this.taskMonitorInterval) clearInterval(this.taskMonitorInterval);
    if (this.statusInterval) clearInterval(this.statusInterval);
    if (this.analysisInterval) clearInterval(this.analysisInterval);
    if (this.errorAnalysisInterval) clearInterval(this.errorAnalysisInterval);

    console.log('🛑 Feedback Loop stopped');
  }
}

module.exports = FeedbackLoop;
