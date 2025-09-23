// AI Integration Service - نظام التكامل الشامل بالذكاء الاصطناعي
// خدمة تجمع بين Teleauto.ai و Telepilot.co

import TelegramBot from 'node-telegram-bot-api';
import { createTeleautoIntegration } from './teleauto-integration.js';
import { createTelepilotIntegration } from './telepilot-integration.js';
import { createMonitoringReportsService } from './monitoring-reports.js';

export interface AIIntegrationConfig {
  teleauto: {
    enabled: boolean;
    rssFeeds: string[];
    publishingSchedule: string;
    channels: string[];
  };
  telepilot: {
    enabled: boolean;
    nlpModel: string;
    autoActions: boolean;
    smartResponses: boolean;
  };
  monitoring: {
    enabled: boolean;
    logLevel: 'info' | 'warning' | 'error';
    reportInterval: number;
  };
}

export interface SystemStatus {
  overall: 'healthy' | 'warning' | 'critical';
  components: {
    teleauto: 'active' | 'inactive' | 'error';
    telepilot: 'active' | 'inactive' | 'error';
    monitoring: 'active' | 'inactive' | 'error';
  };
  performance: {
    responseTime: number;
    memoryUsage: number;
    cpuUsage: number;
    uptime: number;
  };
  stats: {
    totalUsers: number;
    activeUsers: number;
    contentPublished: number;
    tasksAutomated: number;
    smartInteractions: number;
  };
}

export class AIIntegrationService {
  private bot: TelegramBot;
  private teleautoIntegration: any;
  private telepilotIntegration: any;
  private monitoringService: any;
  private config: AIIntegrationConfig;
  private isActive: boolean = false;
  private startTime: Date = new Date();

  constructor(bot: TelegramBot, config?: Partial<AIIntegrationConfig>) {
    this.bot = bot;
    this.config = this.mergeConfig(config);
    this.monitoringService = createMonitoringReportsService();
    
    // تهيئة التكاملات
    if (this.config.teleauto.enabled) {
      this.teleautoIntegration = createTeleautoIntegration(bot);
    }
    
    if (this.config.telepilot.enabled) {
      this.telepilotIntegration = createTelepilotIntegration(bot);
    }

    console.log('🤖 AI Integration Service initialized');
  }

  /**
   * دمج الإعدادات
   */
  private mergeConfig(config?: Partial<AIIntegrationConfig>): AIIntegrationConfig {
    const defaultConfig: AIIntegrationConfig = {
      teleauto: {
        enabled: true,
        rssFeeds: [],
        publishingSchedule: '0 */6 * * *', // كل 6 ساعات
        channels: []
      },
      telepilot: {
        enabled: true,
        nlpModel: 'gemini-pro',
        autoActions: true,
        smartResponses: true
      },
      monitoring: {
        enabled: true,
        logLevel: 'info',
        reportInterval: 3600000 // كل ساعة
      }
    };

    return {
      ...defaultConfig,
      ...config,
      teleauto: { ...defaultConfig.teleauto, ...config?.teleauto },
      telepilot: { ...defaultConfig.telepilot, ...config?.telepilot },
      monitoring: { ...defaultConfig.monitoring, ...config?.monitoring }
    };
  }

  /**
   * بدء النظام الكامل
   */
  public async start(): Promise<void> {
    if (this.isActive) {
      console.log('⚠️ AI Integration Service is already active');
      return;
    }

    console.log('🚀 Starting AI Integration Service...');
    this.startTime = new Date();

    try {
      // بدء Teleauto.ai
      if (this.config.teleauto.enabled && this.teleautoIntegration) {
        console.log('📰 Starting Teleauto.ai integration...');
        await this.teleautoIntegration.start();
      }

      // بدء Telepilot.co
      if (this.config.telepilot.enabled && this.telepilotIntegration) {
        console.log('🧠 Starting Telepilot.co integration...');
        await this.telepilotIntegration.start();
      }

      // بدء المراقبة
      if (this.config.monitoring.enabled) {
        console.log('📊 Starting monitoring system...');
        await this.startMonitoring();
      }

      this.isActive = true;

      this.monitoringService.logEvent({
        type: 'system_event',
        level: 'info',
        source: 'ai_integration',
        message: 'AI Integration Service started successfully',
        data: { config: this.config }
      });

      console.log('✅ AI Integration Service started successfully');

    } catch (error) {
      console.error('❌ Error starting AI Integration Service:', error);
      this.monitoringService.logEvent({
        type: 'error',
        level: 'critical',
        source: 'ai_integration',
        message: 'Failed to start AI Integration Service',
        data: { error: error.message }
      });
      throw error;
    }
  }

  /**
   * معالجة رسالة المستخدم بذكاء
   */
  public async processSmartMessage(
    userId: number,
    chatId: number,
    message: string
  ): Promise<any> {
    if (!this.isActive) {
      throw new Error('AI Integration Service is not active');
    }

    try {
      console.log(`🧠 Processing smart message from user ${userId}`);

      let response = null;

      // معالجة باستخدام Telepilot.co
      if (this.config.telepilot.enabled && this.telepilotIntegration) {
        response = await this.telepilotIntegration.processUserMessage(userId, chatId, message);
      }

      // معالجة إضافية باستخدام Teleauto.ai إذا لزم الأمر
      if (this.config.teleauto.enabled && this.teleautoIntegration) {
        // يمكن إضافة منطق إضافي هنا
      }

      // تسجيل التفاعل
      this.monitoringService.logEvent({
        type: 'user_action',
        level: 'info',
        source: 'ai_integration',
        message: 'Smart message processed',
        data: { userId, chatId, messageLength: message.length }
      });

      return response;

    } catch (error) {
      console.error('❌ Error processing smart message:', error);
      this.monitoringService.logEvent({
        type: 'error',
        level: 'error',
        source: 'ai_integration',
        message: 'Error processing smart message',
        data: { userId, chatId, error: error.message }
      });
      throw error;
    }
  }

  /**
   * نشر محتوى تلقائي
   */
  public async publishContent(
    content: string,
    channelId?: string,
    priority: 'low' | 'medium' | 'high' = 'medium'
  ): Promise<string | null> {
    if (!this.isActive || !this.config.teleauto.enabled || !this.teleautoIntegration) {
      throw new Error('Teleauto.ai integration is not available');
    }

    try {
      console.log(`📢 Publishing content with priority: ${priority}`);

      // إنشاء منشور جديد
      const post = {
        id: `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: this.extractTitle(content),
        content: content,
        source: 'AI Integration Service',
        category: 'automated',
        priority: priority,
        status: 'draft' as const,
        channelId: channelId
      };

      // إضافة إلى قائمة المحتوى
      this.teleautoIntegration.contentQueue.push(post);

      // نشر فوري إذا كانت الأولوية عالية
      if (priority === 'high') {
        await this.teleautoIntegration.publishContent(post);
      }

      this.monitoringService.logEvent({
        type: 'system_event',
        level: 'info',
        source: 'ai_integration',
        message: 'Content published',
        data: { postId: post.id, priority, channelId }
      });

      return post.id;

    } catch (error) {
      console.error('❌ Error publishing content:', error);
      this.monitoringService.logEvent({
        type: 'error',
        level: 'error',
        source: 'ai_integration',
        message: 'Error publishing content',
        data: { error: error.message }
      });
      return null;
    }
  }

  /**
   * إنشاء مهمة تلقائية
   */
  public async createAutomatedTask(
    title: string,
    description: string,
    priority: 'low' | 'medium' | 'high' | 'critical' = 'medium',
    parameters?: Record<string, any>
  ): Promise<string | null> {
    if (!this.isActive || !this.config.telepilot.enabled || !this.telepilotIntegration) {
      throw new Error('Telepilot.co integration is not available');
    }

    try {
      console.log(`⚙️ Creating automated task: ${title}`);

      const taskId = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const task = {
        id: taskId,
        title: title,
        description: description,
        type: 'create' as const,
        priority: priority,
        status: 'pending' as const,
        parameters: parameters || {},
        createdAt: new Date()
      };

      this.telepilotIntegration.taskAutomations.set(taskId, task);

      this.monitoringService.logEvent({
        type: 'system_event',
        level: 'info',
        source: 'ai_integration',
        message: 'Automated task created',
        data: { taskId, title, priority }
      });

      return taskId;

    } catch (error) {
      console.error('❌ Error creating automated task:', error);
      this.monitoringService.logEvent({
        type: 'error',
        level: 'error',
        source: 'ai_integration',
        message: 'Error creating automated task',
        data: { error: error.message }
      });
      return null;
    }
  }

  /**
   * بدء نظام المراقبة
   */
  private async startMonitoring(): Promise<void> {
    // مراقبة الأداء كل 5 دقائق
    setInterval(async () => {
      await this.monitorPerformance();
    }, 5 * 60 * 1000);

    // تقرير شامل كل ساعة
    setInterval(async () => {
      await this.generateComprehensiveReport();
    }, this.config.monitoring.reportInterval);
  }

  /**
   * مراقبة الأداء
   */
  private async monitorPerformance(): Promise<void> {
    try {
      const stats = this.getSystemStatus();
      
      // تسجيل الأداء
      this.monitoringService.logPerformance({
        responseTime: stats.performance.responseTime,
        memoryUsage: stats.performance.memoryUsage,
        cpuUsage: stats.performance.cpuUsage,
        activeUsers: stats.stats.activeUsers,
        totalRequests: stats.stats.smartInteractions,
        errorRate: 0 // سيتم حسابها من الأحداث
      });

      // تنبيهات الأداء
      if (stats.performance.responseTime > 2000) {
        this.monitoringService.logEvent({
          type: 'performance',
          level: 'warning',
          source: 'ai_integration',
          message: 'High response time detected',
          data: { responseTime: stats.performance.responseTime }
        });
      }

      if (stats.performance.memoryUsage > 500 * 1024 * 1024) { // 500MB
        this.monitoringService.logEvent({
          type: 'performance',
          level: 'warning',
          source: 'ai_integration',
          message: 'High memory usage detected',
          data: { memoryUsage: stats.performance.memoryUsage }
        });
      }

    } catch (error) {
      console.error('❌ Error monitoring performance:', error);
    }
  }

  /**
   * إنشاء تقرير شامل
   */
  private async generateComprehensiveReport(): Promise<void> {
    try {
      const stats = this.getSystemStatus();
      
      const report = {
        timestamp: new Date().toISOString(),
        systemStatus: stats,
        teleautoStats: this.teleautoIntegration?.getStats() || null,
        telepilotStats: this.telepilotIntegration?.getStats() || null,
        recommendations: this.generateRecommendations(stats)
      };

      // حفظ التقرير
      const fs = await import('fs');
      const path = await import('path');
      
      const reportsDir = path.join(process.cwd(), 'reports');
      if (!fs.existsSync(reportsDir)) {
        fs.mkdirSync(reportsDir, { recursive: true });
      }

      const reportFile = path.join(reportsDir, `ai-integration-${new Date().toISOString().split('T')[0]}.json`);
      fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));

      console.log(`📊 Comprehensive AI report generated: ${reportFile}`);

    } catch (error) {
      console.error('❌ Error generating comprehensive report:', error);
    }
  }

  /**
   * إنشاء التوصيات
   */
  private generateRecommendations(stats: SystemStatus): string[] {
    const recommendations: string[] = [];

    if (stats.performance.responseTime > 1000) {
      recommendations.push('تحسين وقت الاستجابة - مراجعة الخوارزميات');
    }

    if (stats.performance.memoryUsage > 300 * 1024 * 1024) {
      recommendations.push('تحسين استخدام الذاكرة - مراقبة التسريبات');
    }

    if (stats.stats.activeUsers < 5) {
      recommendations.push('زيادة التفاعل مع المستخدمين - تحسين المحتوى');
    }

    if (stats.components.teleauto === 'error') {
      recommendations.push('إصلاح مشاكل Teleauto.ai - مراجعة الإعدادات');
    }

    if (stats.components.telepilot === 'error') {
      recommendations.push('إصلاح مشاكل Telepilot.co - مراجعة النماذج');
    }

    return recommendations;
  }

  /**
   * استخراج العنوان من المحتوى
   */
  private extractTitle(content: string): string {
    const lines = content.split('\n');
    const firstLine = lines[0].trim();
    
    if (firstLine.length > 100) {
      return firstLine.substring(0, 100) + '...';
    }
    
    return firstLine || 'محتوى تلقائي';
  }

  /**
   * الحصول على حالة النظام
   */
  public getSystemStatus(): SystemStatus {
    const memUsage = process.memoryUsage();
    const uptime = process.uptime();

    return {
      overall: this.calculateOverallHealth(),
      components: {
        teleauto: this.teleautoIntegration?.isActive ? 'active' : 'inactive',
        telepilot: this.telepilotIntegration?.isActive ? 'active' : 'inactive',
        monitoring: this.monitoringService ? 'active' : 'inactive'
      },
      performance: {
        responseTime: this.calculateAverageResponseTime(),
        memoryUsage: memUsage.heapUsed,
        cpuUsage: this.calculateCPUUsage(),
        uptime: uptime
      },
      stats: {
        totalUsers: this.telepilotIntegration?.userContexts?.size || 0,
        activeUsers: this.telepilotIntegration?.userContexts?.size || 0,
        contentPublished: this.teleautoIntegration?.contentQueue?.filter((p: any) => p.status === 'published').length || 0,
        tasksAutomated: this.telepilotIntegration?.taskAutomations?.size || 0,
        smartInteractions: this.telepilotIntegration?.userContexts?.size || 0
      }
    };
  }

  /**
   * حساب الصحة العامة للنظام
   */
  private calculateOverallHealth(): 'healthy' | 'warning' | 'critical' {
    const stats = this.getSystemStatus();
    
    let score = 100;

    // خصم نقاط للمكونات غير النشطة
    if (stats.components.teleauto === 'inactive') score -= 20;
    if (stats.components.telepilot === 'inactive') score -= 20;
    if (stats.components.monitoring === 'inactive') score -= 10;

    // خصم نقاط للأداء
    if (stats.performance.responseTime > 2000) score -= 15;
    if (stats.performance.memoryUsage > 500 * 1024 * 1024) score -= 15;
    if (stats.performance.cpuUsage > 80) score -= 10;

    if (score >= 80) return 'healthy';
    if (score >= 60) return 'warning';
    return 'critical';
  }

  /**
   * حساب متوسط وقت الاستجابة
   */
  private calculateAverageResponseTime(): number {
    // محاكاة حساب وقت الاستجابة
    return Math.random() * 100 + 50; // 50-150ms
  }

  /**
   * حساب استخدام CPU
   */
  private calculateCPUUsage(): number {
    // محاكاة حساب استخدام CPU
    return Math.random() * 20 + 5; // 5-25%
  }

  /**
   * الحصول على إحصائيات مفصلة
   */
  public getDetailedStats(): any {
    return {
      system: this.getSystemStatus(),
      teleauto: this.teleautoIntegration?.getStats() || null,
      telepilot: this.telepilotIntegration?.getStats() || null,
      monitoring: this.monitoringService?.getCurrentStats() || null,
      uptime: process.uptime(),
      startTime: this.startTime,
      isActive: this.isActive
    };
  }

  /**
   * إيقاف النظام
   */
  public async stop(): Promise<void> {
    if (!this.isActive) return;

    console.log('⏹️ Stopping AI Integration Service...');

    try {
      // إيقاف Teleauto.ai
      if (this.teleautoIntegration) {
        await this.teleautoIntegration.stop();
      }

      // إيقاف Telepilot.co
      if (this.telepilotIntegration) {
        await this.telepilotIntegration.stop();
      }

      this.isActive = false;

      this.monitoringService.logEvent({
        type: 'system_event',
        level: 'info',
        source: 'ai_integration',
        message: 'AI Integration Service stopped'
      });

      console.log('✅ AI Integration Service stopped');

    } catch (error) {
      console.error('❌ Error stopping AI Integration Service:', error);
      this.monitoringService.logEvent({
        type: 'error',
        level: 'error',
        source: 'ai_integration',
        message: 'Error stopping AI Integration Service',
        data: { error: error.message }
      });
    }
  }
}

// تصدير الدالة لإنشاء الخدمة
export function createAIIntegrationService(
  bot: TelegramBot,
  config?: Partial<AIIntegrationConfig>
): AIIntegrationService {
  return new AIIntegrationService(bot, config);
}
