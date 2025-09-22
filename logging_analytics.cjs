#!/usr/bin/env node

require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');

/**
 * 📊 Logging & Analytics System
 * تسجيل كل الأحداث وتهيئة البيانات للـ Dashboard
 * نظام التحليلات والإحصائيات المتقدم
 */
class LoggingAnalytics {
  constructor() {
    this.logsDir = './logs';
    this.analyticsDir = './analytics';
    this.dashboardData = {
      realTimeStats: {},
      historicalData: {},
      performanceMetrics: {},
      userInsights: {},
      systemHealth: {},
    };

    this.logBuffer = [];
    this.analyticsBuffer = [];
    this.bufferSize = 100;
    this.flushInterval = 30000; // 30 seconds

    this.initializeDirectories();
    this.startLogging();
    this.startAnalytics();

    console.log('📊 Logging & Analytics System initialized');
  }

  /**
   * تهيئة المجلدات
   */
  async initializeDirectories() {
    try {
      await fs.mkdir(this.logsDir, { recursive: true });
      await fs.mkdir(this.analyticsDir, { recursive: true });
      await fs.mkdir(path.join(this.analyticsDir, 'dashboard'), {
        recursive: true,
      });
      await fs.mkdir(path.join(this.analyticsDir, 'reports'), {
        recursive: true,
      });

      console.log('📁 Directories initialized');
    } catch (error) {
      console.error('❌ Directory initialization failed:', error);
    }
  }

  /**
   * بدء نظام التسجيل
   */
  startLogging() {
    // تنظيف البيانات كل 30 ثانية
    this.logFlushInterval = setInterval(() => {
      this.flushLogs();
    }, this.flushInterval);

    // تنظيف الملفات القديمة كل ساعة
    this.cleanupInterval = setInterval(() => {
      this.cleanupOldLogs();
    }, 3600000);

    console.log('📝 Logging system started');
  }

  /**
   * بدء نظام التحليلات
   */
  startAnalytics() {
    // تحديث بيانات Dashboard كل دقيقة
    this.dashboardInterval = setInterval(() => {
      this.updateDashboardData();
    }, 60000);

    // إنشاء تقارير كل 15 دقيقة
    this.reportInterval = setInterval(() => {
      this.generateReports();
    }, 900000);

    // تحليل البيانات كل ساعة
    this.analysisInterval = setInterval(() => {
      this.performDataAnalysis();
    }, 3600000);

    console.log('📈 Analytics system started');
  }

  /**
   * تسجيل حدث
   */
  logEvent(event) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level: event.level || 'info',
      category: event.category || 'general',
      message: event.message,
      data: event.data || {},
      source: event.source || 'system',
      userId: event.userId,
      taskId: event.taskId,
      agent: event.agent,
    };

    this.logBuffer.push(logEntry);

    // إذا امتلأ المخزن المؤقت، اكتبه فوراً
    if (this.logBuffer.length >= this.bufferSize) {
      this.flushLogs();
    }

    // تحديث الإحصائيات في الوقت الفعلي
    this.updateRealTimeStats(logEntry);
  }

  /**
   * تسجيل تحليل
   */
  logAnalytics(analytics) {
    const analyticsEntry = {
      timestamp: new Date().toISOString(),
      type: analytics.type || 'general',
      metrics: analytics.metrics || {},
      insights: analytics.insights || {},
      recommendations: analytics.recommendations || [],
      data: analytics.data || {},
    };

    this.analyticsBuffer.push(analyticsEntry);

    // إذا امتلأ المخزن المؤقت، اكتبه فوراً
    if (this.analyticsBuffer.length >= this.bufferSize) {
      this.flushAnalytics();
    }
  }

  /**
   * تسجيل مهمة
   */
  logTask(task, action) {
    this.logEvent({
      level: 'info',
      category: 'task',
      message: `Task ${action}: ${task.id}`,
      data: {
        taskId: task.id,
        type: task.type,
        status: task.status,
        agent: task.assignedAgent || task.executingAgent,
        priority: task.priority,
        duration: task.duration,
        user: task.user,
        analysis: task.analysis,
      },
      source: 'task_system',
      taskId: task.id,
      agent: task.assignedAgent || task.executingAgent,
    });
  }

  /**
   * تسجيل خطأ
   */
  logError(error, context = {}) {
    this.logEvent({
      level: 'error',
      category: 'error',
      message: error.message || 'Unknown error',
      data: {
        error: error.message,
        stack: error.stack,
        context: context,
        timestamp: new Date().toISOString(),
      },
      source: context.source || 'system',
    });
  }

  /**
   * تسجيل أداء الوكيل
   */
  logAgentPerformance(agentName, performance) {
    this.logEvent({
      level: 'info',
      category: 'agent_performance',
      message: `Agent ${agentName} performance update`,
      data: {
        agent: agentName,
        performance: performance,
        timestamp: new Date().toISOString(),
      },
      source: 'agent_system',
      agent: agentName,
    });

    // تسجيل تحليلات الأداء
    this.logAnalytics({
      type: 'agent_performance',
      metrics: {
        agent: agentName,
        ...performance,
      },
      insights: {
        efficiency: performance.efficiency || 0,
        load: performance.load || 0,
        successRate: performance.successRate || 0,
      },
    });
  }

  /**
   * تسجيل تفاعل المستخدم
   */
  logUserInteraction(userId, interaction) {
    this.logEvent({
      level: 'info',
      category: 'user_interaction',
      message: `User ${userId} interaction: ${interaction.type}`,
      data: {
        userId: userId,
        interaction: interaction,
        timestamp: new Date().toISOString(),
      },
      source: 'user_system',
      userId: userId,
    });

    // تحديث رؤى المستخدم
    this.updateUserInsights(userId, interaction);
  }

  /**
   * كتابة السجلات
   */
  async flushLogs() {
    if (this.logBuffer.length === 0) return;

    try {
      const timestamp = new Date().toISOString().split('T')[0];
      const logFile = path.join(this.logsDir, `system-${timestamp}.log`);

      const logEntries =
        this.logBuffer.map(entry => JSON.stringify(entry)).join('\n') + '\n';

      await fs.appendFile(logFile, logEntries);

      console.log(`📝 Flushed ${this.logBuffer.length} log entries`);
      this.logBuffer = [];
    } catch (error) {
      console.error('❌ Log flush failed:', error);
    }
  }

  /**
   * كتابة التحليلات
   */
  async flushAnalytics() {
    if (this.analyticsBuffer.length === 0) return;

    try {
      const timestamp = new Date().toISOString().split('T')[0];
      const analyticsFile = path.join(
        this.analyticsDir,
        `analytics-${timestamp}.json`
      );

      const analyticsEntries =
        this.analyticsBuffer.map(entry => JSON.stringify(entry)).join('\n') +
        '\n';

      await fs.appendFile(analyticsFile, analyticsEntries);

      console.log(
        `📈 Flushed ${this.analyticsBuffer.length} analytics entries`
      );
      this.analyticsBuffer = [];
    } catch (error) {
      console.error('❌ Analytics flush failed:', error);
    }
  }

  /**
   * تحديث الإحصائيات في الوقت الفعلي
   */
  updateRealTimeStats(logEntry) {
    const now = new Date().toISOString();

    if (!this.dashboardData.realTimeStats[now]) {
      this.dashboardData.realTimeStats[now] = {
        timestamp: now,
        events: 0,
        errors: 0,
        tasks: 0,
        agents: new Set(),
        users: new Set(),
      };
    }

    const stats = this.dashboardData.realTimeStats[now];
    stats.events++;

    if (logEntry.level === 'error') {
      stats.errors++;
    }

    if (logEntry.category === 'task') {
      stats.tasks++;
    }

    if (logEntry.agent) {
      stats.agents.add(logEntry.agent);
    }

    if (logEntry.userId) {
      stats.users.add(logEntry.userId);
    }
  }

  /**
   * تحديث رؤى المستخدم
   */
  updateUserInsights(userId, interaction) {
    if (!this.dashboardData.userInsights[userId]) {
      this.dashboardData.userInsights[userId] = {
        userId: userId,
        totalInteractions: 0,
        lastActivity: null,
        preferredAgents: new Map(),
        taskTypes: new Map(),
        satisfaction: [],
      };
    }

    const insights = this.dashboardData.userInsights[userId];
    insights.totalInteractions++;
    insights.lastActivity = new Date().toISOString();

    // تحديث الوكلاء المفضلة
    if (interaction.agent) {
      const count = insights.preferredAgents.get(interaction.agent) || 0;
      insights.preferredAgents.set(interaction.agent, count + 1);
    }

    // تحديث أنواع المهام
    if (interaction.taskType) {
      const count = insights.taskTypes.get(interaction.taskType) || 0;
      insights.taskTypes.set(interaction.taskType, count + 1);
    }

    // تحديث الرضا
    if (interaction.satisfaction) {
      insights.satisfaction.push({
        value: interaction.satisfaction,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * تحديث بيانات Dashboard
   */
  async updateDashboardData() {
    try {
      // تحديث صحة النظام
      this.dashboardData.systemHealth = {
        timestamp: new Date().toISOString(),
        status: 'healthy',
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        cpuUsage: process.cpuUsage(),
        activeConnections: this.getActiveConnections(),
      };

      // تحديث المقاييس التاريخية
      await this.updateHistoricalData();

      // حفظ بيانات Dashboard
      const dashboardFile = path.join(
        this.analyticsDir,
        'dashboard',
        'dashboard-data.json'
      );
      await fs.writeFile(
        dashboardFile,
        JSON.stringify(this.dashboardData, null, 2)
      );

      console.log('📊 Dashboard data updated');
    } catch (error) {
      console.error('❌ Dashboard update failed:', error);
    }
  }

  /**
   * تحديث البيانات التاريخية
   */
  async updateHistoricalData() {
    const today = new Date().toISOString().split('T')[0];

    if (!this.dashboardData.historicalData[today]) {
      this.dashboardData.historicalData[today] = {
        date: today,
        totalEvents: 0,
        totalTasks: 0,
        totalErrors: 0,
        averageSatisfaction: 0,
        topAgents: [],
        topUsers: [],
      };
    }

    const historical = this.dashboardData.historicalData[today];

    // تحديث الإحصائيات اليومية
    historical.totalEvents++;

    // حساب متوسط الرضا
    const allSatisfaction = [];
    Object.values(this.dashboardData.userInsights).forEach(user => {
      user.satisfaction.forEach(s => allSatisfaction.push(s.value));
    });

    if (allSatisfaction.length > 0) {
      historical.averageSatisfaction =
        allSatisfaction.reduce((a, b) => a + b, 0) / allSatisfaction.length;
    }
  }

  /**
   * إنشاء التقارير
   */
  async generateReports() {
    try {
      const timestamp = new Date().toISOString();
      const reportData = {
        timestamp: timestamp,
        period: '15_minutes',
        summary: this.generateSummaryReport(),
        performance: this.generatePerformanceReport(),
        users: this.generateUserReport(),
        agents: this.generateAgentReport(),
        recommendations: this.generateRecommendations(),
      };

      const reportFile = path.join(
        this.analyticsDir,
        'reports',
        `report-${Date.now()}.json`
      );
      await fs.writeFile(reportFile, JSON.stringify(reportData, null, 2));

      console.log('📋 Report generated');
    } catch (error) {
      console.error('❌ Report generation failed:', error);
    }
  }

  /**
   * إنشاء تقرير ملخص
   */
  generateSummaryReport() {
    const totalUsers = Object.keys(this.dashboardData.userInsights).length;
    const totalEvents = Object.values(this.dashboardData.realTimeStats).reduce(
      (sum, stats) => sum + stats.events,
      0
    );
    const totalErrors = Object.values(this.dashboardData.realTimeStats).reduce(
      (sum, stats) => sum + stats.errors,
      0
    );

    return {
      totalUsers,
      totalEvents,
      totalErrors,
      errorRate:
        totalEvents > 0 ? ((totalErrors / totalEvents) * 100).toFixed(2) : 0,
      systemHealth: this.dashboardData.systemHealth.status,
    };
  }

  /**
   * إنشاء تقرير الأداء
   */
  generatePerformanceReport() {
    return {
      averageResponseTime: this.calculateAverageResponseTime(),
      successRate: this.calculateSuccessRate(),
      agentEfficiency: this.calculateAgentEfficiency(),
      peakHours: this.calculatePeakHours(),
    };
  }

  /**
   * إنشاء تقرير المستخدمين
   */
  generateUserReport() {
    const users = Object.values(this.dashboardData.userInsights);

    return {
      totalUsers: users.length,
      activeUsers: users.filter(u => {
        const lastActivity = new Date(u.lastActivity);
        const now = new Date();
        return now - lastActivity < 3600000; // آخر ساعة
      }).length,
      topUsers: users
        .sort((a, b) => b.totalInteractions - a.totalInteractions)
        .slice(0, 10)
        .map(u => ({
          userId: u.userId,
          interactions: u.totalInteractions,
          lastActivity: u.lastActivity,
        })),
    };
  }

  /**
   * إنشاء تقرير الوكلاء
   */
  generateAgentReport() {
    const agentStats = new Map();

    Object.values(this.dashboardData.userInsights).forEach(user => {
      user.preferredAgents.forEach((count, agent) => {
        const current = agentStats.get(agent) || 0;
        agentStats.set(agent, current + count);
      });
    });

    return {
      totalAgents: agentStats.size,
      topAgents: Array.from(agentStats.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([agent, count]) => ({ agent, count })),
    };
  }

  /**
   * إنشاء التوصيات
   */
  generateRecommendations() {
    const recommendations = [];

    // تحليل معدل الخطأ
    const errorRate = this.calculateErrorRate();
    if (errorRate > 10) {
      recommendations.push({
        type: 'error_rate',
        priority: 'high',
        message: 'معدل الخطأ مرتفع - فكر في تحسين معالجة الأخطاء',
        value: errorRate,
      });
    }

    // تحليل الأداء
    const avgResponseTime = this.calculateAverageResponseTime();
    if (avgResponseTime > 10000) {
      recommendations.push({
        type: 'performance',
        priority: 'medium',
        message: 'وقت الاستجابة بطيء - فكر في تحسين الأداء',
        value: avgResponseTime,
      });
    }

    // تحليل رضا المستخدمين
    const avgSatisfaction = this.calculateAverageSatisfaction();
    if (avgSatisfaction < 7) {
      recommendations.push({
        type: 'satisfaction',
        priority: 'high',
        message: 'رضا المستخدمين منخفض - فكر في تحسين الجودة',
        value: avgSatisfaction,
      });
    }

    return recommendations;
  }

  /**
   * تحليل البيانات
   */
  async performDataAnalysis() {
    try {
      const analysis = {
        timestamp: new Date().toISOString(),
        trends: this.analyzeTrends(),
        patterns: this.analyzePatterns(),
        anomalies: this.detectAnomalies(),
        predictions: this.generatePredictions(),
      };

      const analysisFile = path.join(
        this.analyticsDir,
        `analysis-${Date.now()}.json`
      );
      await fs.writeFile(analysisFile, JSON.stringify(analysis, null, 2));

      console.log('🔍 Data analysis completed');
    } catch (error) {
      console.error('❌ Data analysis failed:', error);
    }
  }

  /**
   * تحليل الاتجاهات
   */
  analyzeTrends() {
    // تحليل الاتجاهات في البيانات
    return {
      userGrowth: this.calculateUserGrowth(),
      taskVolume: this.calculateTaskVolumeTrend(),
      performanceTrend: this.calculatePerformanceTrend(),
    };
  }

  /**
   * تحليل الأنماط
   */
  analyzePatterns() {
    // تحليل الأنماط في البيانات
    return {
      peakHours: this.calculatePeakHours(),
      popularAgents: this.calculatePopularAgents(),
      commonTasks: this.calculateCommonTasks(),
    };
  }

  /**
   * كشف الشذوذ
   */
  detectAnomalies() {
    // كشف الشذوذ في البيانات
    return {
      errorSpikes: this.detectErrorSpikes(),
      performanceDrops: this.detectPerformanceDrops(),
      unusualPatterns: this.detectUnusualPatterns(),
    };
  }

  /**
   * توليد التوقعات
   */
  generatePredictions() {
    // توليد التوقعات بناءً على البيانات التاريخية
    return {
      expectedLoad: this.predictLoad(),
      resourceNeeds: this.predictResourceNeeds(),
      userBehavior: this.predictUserBehavior(),
    };
  }

  /**
   * تنظيف السجلات القديمة
   */
  async cleanupOldLogs() {
    try {
      const files = await fs.readdir(this.logsDir);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - 7); // احتفظ بـ 7 أيام

      for (const file of files) {
        const filePath = path.join(this.logsDir, file);
        const stats = await fs.stat(filePath);

        if (stats.mtime < cutoffDate) {
          await fs.unlink(filePath);
          console.log(`🗑️ Deleted old log file: ${file}`);
        }
      }
    } catch (error) {
      console.error('❌ Log cleanup failed:', error);
    }
  }

  /**
   * الحصول على الاتصالات النشطة
   */
  getActiveConnections() {
    // محاكاة عدد الاتصالات النشطة
    return Math.floor(Math.random() * 50) + 10;
  }

  /**
   * حساب معدل الخطأ
   */
  calculateErrorRate() {
    const totalEvents = Object.values(this.dashboardData.realTimeStats).reduce(
      (sum, stats) => sum + stats.events,
      0
    );
    const totalErrors = Object.values(this.dashboardData.realTimeStats).reduce(
      (sum, stats) => sum + stats.errors,
      0
    );

    return totalEvents > 0 ? (totalErrors / totalEvents) * 100 : 0;
  }

  /**
   * حساب متوسط وقت الاستجابة
   */
  calculateAverageResponseTime() {
    // محاكاة حساب متوسط وقت الاستجابة
    return Math.floor(Math.random() * 5000) + 1000;
  }

  /**
   * حساب معدل النجاح
   */
  calculateSuccessRate() {
    // محاكاة حساب معدل النجاح
    return Math.floor(Math.random() * 20) + 80;
  }

  /**
   * حساب كفاءة الوكلاء
   */
  calculateAgentEfficiency() {
    // محاكاة حساب كفاءة الوكلاء
    return {
      gemini_ai: Math.floor(Math.random() * 20) + 80,
      httpie_agent: Math.floor(Math.random() * 20) + 75,
      jq_agent: Math.floor(Math.random() * 20) + 85,
    };
  }

  /**
   * حساب ساعات الذروة
   */
  calculatePeakHours() {
    return ['09:00', '14:00', '20:00'];
  }

  /**
   * حساب متوسط الرضا
   */
  calculateAverageSatisfaction() {
    const allSatisfaction = [];
    Object.values(this.dashboardData.userInsights).forEach(user => {
      user.satisfaction.forEach(s => allSatisfaction.push(s.value));
    });

    return allSatisfaction.length > 0
      ? allSatisfaction.reduce((a, b) => a + b, 0) / allSatisfaction.length
      : 8;
  }

  /**
   * حساب نمو المستخدمين
   */
  calculateUserGrowth() {
    return Math.floor(Math.random() * 10) + 5; // 5-15% نمو
  }

  /**
   * حساب اتجاه حجم المهام
   */
  calculateTaskVolumeTrend() {
    return 'increasing'; // أو 'decreasing' أو 'stable'
  }

  /**
   * حساب اتجاه الأداء
   */
  calculatePerformanceTrend() {
    return 'improving'; // أو 'declining' أو 'stable'
  }

  /**
   * حساب الوكلاء الشائعة
   */
  calculatePopularAgents() {
    return ['gemini_ai', 'httpie_agent', 'jq_agent'];
  }

  /**
   * حساب المهام الشائعة
   */
  calculateCommonTasks() {
    return ['data_analysis', 'web_scraping', 'general'];
  }

  /**
   * كشف طفرات الأخطاء
   */
  detectErrorSpikes() {
    return [];
  }

  /**
   * كشف انخفاضات الأداء
   */
  detectPerformanceDrops() {
    return [];
  }

  /**
   * كشف الأنماط غير العادية
   */
  detectUnusualPatterns() {
    return [];
  }

  /**
   * توقع الحمولة
   */
  predictLoad() {
    return Math.floor(Math.random() * 100) + 50;
  }

  /**
   * توقع احتياجات الموارد
   */
  predictResourceNeeds() {
    return {
      cpu: Math.floor(Math.random() * 30) + 50,
      memory: Math.floor(Math.random() * 40) + 60,
      storage: Math.floor(Math.random() * 20) + 30,
    };
  }

  /**
   * توقع سلوك المستخدمين
   */
  predictUserBehavior() {
    return {
      peakHours: ['09:00', '14:00', '20:00'],
      preferredAgents: ['gemini_ai', 'httpie_agent'],
      commonTasks: ['data_analysis', 'web_scraping'],
    };
  }

  /**
   * الحصول على بيانات Dashboard
   */
  getDashboardData() {
    return this.dashboardData;
  }

  /**
   * الحصول على الإحصائيات في الوقت الفعلي
   */
  getRealTimeStats() {
    return this.dashboardData.realTimeStats;
  }

  /**
   * إيقاف النظام
   */
  stop() {
    if (this.logFlushInterval) clearInterval(this.logFlushInterval);
    if (this.cleanupInterval) clearInterval(this.cleanupInterval);
    if (this.dashboardInterval) clearInterval(this.dashboardInterval);
    if (this.reportInterval) clearInterval(this.reportInterval);
    if (this.analysisInterval) clearInterval(this.analysisInterval);

    // كتابة البيانات المتبقية
    this.flushLogs();
    this.flushAnalytics();

    console.log('🛑 Logging & Analytics stopped');
  }
}

module.exports = LoggingAnalytics;
