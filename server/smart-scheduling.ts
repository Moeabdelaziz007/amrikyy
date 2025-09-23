// Smart Scheduling System - نظام الجدولة الذكية
// تحليل أنماط الاستخدام وتحديد أوقات إرسال الرسائل المثلى

import TelegramBot from 'node-telegram-bot-api';
import { createMonitoringReportsService } from './monitoring-reports.js';

export interface UserPattern {
  userId: number;
  chatId: number;
  username?: string;
  activeHours: number[]; // ساعات النشاط (0-23)
  activeDays: number[]; // أيام النشاط (0-6)
  averageResponseTime: number;
  preferredMessageTypes: string[];
  timezone: string;
  lastActivity: Date;
  totalInteractions: number;
  engagementScore: number;
}

export interface SmartSchedule {
  id: string;
  userId: number;
  type: 'reminder' | 'update' | 'notification' | 'report';
  priority: 'low' | 'medium' | 'high' | 'critical';
  content: string;
  scheduledTime: Date;
  optimalTime: Date;
  status: 'pending' | 'sent' | 'failed' | 'cancelled';
  retryCount: number;
  maxRetries: number;
  conditions?: Record<string, any>;
}

export interface UsageAnalytics {
  userId: number;
  period: string;
  totalMessages: number;
  activeHours: Record<number, number>; // hour -> count
  activeDays: Record<number, number>; // day -> count
  responseTimes: number[];
  engagementLevel: 'low' | 'medium' | 'high' | 'very_high';
  preferredContent: string[];
  optimalSendTimes: Date[];
  lastUpdated: Date;
}

export class SmartSchedulingSystem {
  private bot: TelegramBot;
  private monitoringService: any;
  private userPatterns: Map<number, UserPattern> = new Map();
  private smartSchedules: Map<string, SmartSchedule> = new Map();
  private usageAnalytics: Map<number, UsageAnalytics> = new Map();
  private scheduledJobs: Map<string, NodeJS.Timeout> = new Map();
  private isActive: boolean = false;

  constructor(bot: TelegramBot) {
    this.bot = bot;
    this.monitoringService = createMonitoringReportsService();
    console.log('📅 Smart Scheduling System initialized');
  }

  /**
   * بدء نظام الجدولة الذكية
   */
  public async start(): Promise<void> {
    if (this.isActive) {
      console.log('⚠️ Smart Scheduling System is already active');
      return;
    }

    this.isActive = true;
    console.log('🚀 Starting Smart Scheduling System...');

    // بدء تحليل أنماط الاستخدام
    await this.startUsageAnalysis();

    // بدء معالج الجدولة الذكية
    await this.startSmartScheduler();

    // بدء مراقبة الأداء
    await this.startPerformanceMonitoring();

    this.monitoringService.logEvent({
      type: 'system_event',
      level: 'info',
      source: 'smart_scheduling',
      message: 'Smart Scheduling System started successfully'
    });

    console.log('✅ Smart Scheduling System started successfully');
  }

  /**
   * تحليل أنماط الاستخدام
   */
  public async analyzeUserPattern(userId: number, chatId: number, message: string): Promise<void> {
    try {
      const now = new Date();
      const hour = now.getHours();
      const day = now.getDay();

      // الحصول على أو إنشاء نمط المستخدم
      let pattern = this.userPatterns.get(userId);
      if (!pattern) {
        pattern = {
          userId,
          chatId,
          activeHours: [],
          activeDays: [],
          averageResponseTime: 0,
          preferredMessageTypes: [],
          timezone: 'UTC',
          lastActivity: now,
          totalInteractions: 0,
          engagementScore: 0
        };
        this.userPatterns.set(userId, pattern);
      }

      // تحديث النمط
      pattern.lastActivity = now;
      pattern.totalInteractions++;

      // تحديث ساعات النشاط
      if (!pattern.activeHours.includes(hour)) {
        pattern.activeHours.push(hour);
      }

      // تحديث أيام النشاط
      if (!pattern.activeDays.includes(day)) {
        pattern.activeDays.push(day);
      }

      // تحليل نوع الرسالة
      const messageType = this.analyzeMessageType(message);
      if (!pattern.preferredMessageTypes.includes(messageType)) {
        pattern.preferredMessageTypes.push(messageType);
      }

      // حساب نقاط التفاعل
      pattern.engagementScore = this.calculateEngagementScore(pattern);

      // تحديث التحليلات
      await this.updateUsageAnalytics(userId, pattern);

      console.log(`📊 User pattern updated for ${userId}: ${pattern.engagementScore} engagement`);

    } catch (error) {
      console.error('❌ Error analyzing user pattern:', error);
      this.monitoringService.logEvent({
        type: 'error',
        level: 'error',
        source: 'smart_scheduling',
        message: 'Error analyzing user pattern',
        data: { userId, error: error.message }
      });
    }
  }

  /**
   * تحليل نوع الرسالة
   */
  private analyzeMessageType(message: string): string {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('مهمة') || lowerMessage.includes('task')) {
      return 'task_management';
    }
    if (lowerMessage.includes('تذكير') || lowerMessage.includes('reminder')) {
      return 'reminder';
    }
    if (lowerMessage.includes('حالة') || lowerMessage.includes('status')) {
      return 'status_inquiry';
    }
    if (lowerMessage.includes('مرحبا') || lowerMessage.includes('hello')) {
      return 'greeting';
    }
    if (lowerMessage.includes('مساعدة') || lowerMessage.includes('help')) {
      return 'help_request';
    }

    return 'general_chat';
  }

  /**
   * حساب نقاط التفاعل
   */
  private calculateEngagementScore(pattern: UserPattern): number {
    let score = 0;

    // نقاط للتفاعل الكلي
    score += Math.min(pattern.totalInteractions * 0.1, 50);

    // نقاط لتنوع ساعات النشاط
    score += pattern.activeHours.length * 2;

    // نقاط لتنوع أيام النشاط
    score += pattern.activeDays.length * 3;

    // نقاط لتنوع أنواع الرسائل
    score += pattern.preferredMessageTypes.length * 5;

    // نقاط للنشاط الحديث
    const hoursSinceLastActivity = (Date.now() - pattern.lastActivity.getTime()) / (1000 * 60 * 60);
    if (hoursSinceLastActivity < 24) {
      score += 20;
    } else if (hoursSinceLastActivity < 168) { // أسبوع
      score += 10;
    }

    return Math.min(score, 100);
  }

  /**
   * تحديث تحليلات الاستخدام
   */
  private async updateUsageAnalytics(userId: number, pattern: UserPattern): Promise<void> {
    const now = new Date();
    const period = `${now.getFullYear()}-${now.getMonth() + 1}`;

    let analytics = this.usageAnalytics.get(userId);
    if (!analytics) {
      analytics = {
        userId,
        period,
        totalMessages: 0,
        activeHours: {},
        activeDays: {},
        responseTimes: [],
        engagementLevel: 'low',
        preferredContent: [],
        optimalSendTimes: [],
        lastUpdated: now
      };
      this.usageAnalytics.set(userId, analytics);
    }

    // تحديث الإحصائيات
    analytics.totalMessages++;
    analytics.lastUpdated = now;

    // تحديث ساعات النشاط
    const hour = now.getHours();
    analytics.activeHours[hour] = (analytics.activeHours[hour] || 0) + 1;

    // تحديث أيام النشاط
    const day = now.getDay();
    analytics.activeDays[day] = (analytics.activeDays[day] || 0) + 1;

    // تحديث مستوى التفاعل
    analytics.engagementLevel = this.determineEngagementLevel(pattern.engagementScore);

    // حساب أوقات الإرسال المثلى
    analytics.optimalSendTimes = this.calculateOptimalSendTimes(analytics);

    console.log(`📈 Usage analytics updated for user ${userId}`);
  }

  /**
   * تحديد مستوى التفاعل
   */
  private determineEngagementLevel(score: number): 'low' | 'medium' | 'high' | 'very_high' {
    if (score >= 80) return 'very_high';
    if (score >= 60) return 'high';
    if (score >= 40) return 'medium';
    return 'low';
  }

  /**
   * حساب أوقات الإرسال المثلى
   */
  private calculateOptimalSendTimes(analytics: UsageAnalytics): Date[] {
    const optimalTimes: Date[] = [];
    const now = new Date();

    // العثور على الساعات الأكثر نشاطاً
    const sortedHours = Object.entries(analytics.activeHours)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);

    for (const [hour, count] of sortedHours) {
      const optimalTime = new Date(now);
      optimalTime.setHours(parseInt(hour), 0, 0, 0);
      optimalTimes.push(optimalTime);
    }

    return optimalTimes;
  }

  /**
   * جدولة رسالة ذكية
   */
  public async scheduleSmartMessage(
    userId: number,
    type: 'reminder' | 'update' | 'notification' | 'report',
    content: string,
    priority: 'low' | 'medium' | 'high' | 'critical' = 'medium',
    conditions?: Record<string, any>
  ): Promise<string> {
    try {
      const scheduleId = `schedule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // حساب الوقت المثلى للإرسال
      const optimalTime = await this.calculateOptimalSendTime(userId, type, priority);

      const schedule: SmartSchedule = {
        id: scheduleId,
        userId,
        type,
        priority,
        content,
        scheduledTime: optimalTime,
        optimalTime,
        status: 'pending',
        retryCount: 0,
        maxRetries: 3,
        conditions
      };

      this.smartSchedules.set(scheduleId, schedule);

      // جدولة الإرسال
      await this.scheduleMessage(schedule);

      this.monitoringService.logEvent({
        type: 'system_event',
        level: 'info',
        source: 'smart_scheduling',
        message: `Smart message scheduled: ${type}`,
        data: { scheduleId, userId, type, priority, scheduledTime: optimalTime }
      });

      console.log(`📅 Smart message scheduled: ${scheduleId} for ${optimalTime.toLocaleString('ar-SA')}`);
      return scheduleId;

    } catch (error) {
      console.error('❌ Error scheduling smart message:', error);
      this.monitoringService.logEvent({
        type: 'error',
        level: 'error',
        source: 'smart_scheduling',
        message: 'Error scheduling smart message',
        data: { userId, type, error: error.message }
      });
      throw error;
    }
  }

  /**
   * حساب الوقت المثلى للإرسال
   */
  private async calculateOptimalSendTime(
    userId: number,
    type: string,
    priority: string
  ): Promise<Date> {
    const now = new Date();
    const pattern = this.userPatterns.get(userId);
    const analytics = this.usageAnalytics.get(userId);

    // إذا كانت الأولوية حرجة، أرسل فوراً
    if (priority === 'critical') {
      return new Date(now.getTime() + 5 * 60 * 1000); // بعد 5 دقائق
    }

    // إذا كانت الأولوية عالية، أرسل في أقرب وقت مثلى
    if (priority === 'high') {
      const nextOptimalTime = this.getNextOptimalTime(analytics);
      if (nextOptimalTime) {
        return nextOptimalTime;
      }
    }

    // للأولوية المتوسطة والمنخفضة، استخدم النمط
    if (pattern && pattern.activeHours.length > 0) {
      const nextActiveHour = this.getNextActiveHour(pattern.activeHours);
      const optimalTime = new Date(now);
      optimalTime.setHours(nextActiveHour, 0, 0, 0);
      
      // إذا كان الوقت المثلى في الماضي، أضف يوم
      if (optimalTime <= now) {
        optimalTime.setDate(optimalTime.getDate() + 1);
      }
      
      return optimalTime;
    }

    // افتراضي: بعد ساعتين
    return new Date(now.getTime() + 2 * 60 * 60 * 1000);
  }

  /**
   * الحصول على أقرب وقت مثلى
   */
  private getNextOptimalTime(analytics: UsageAnalytics | undefined): Date | null {
    if (!analytics || analytics.optimalSendTimes.length === 0) {
      return null;
    }

    const now = new Date();
    const futureTimes = analytics.optimalSendTimes.filter(time => time > now);
    
    if (futureTimes.length > 0) {
      return futureTimes[0];
    }

    return null;
  }

  /**
   * الحصول على أقرب ساعة نشطة
   */
  private getNextActiveHour(activeHours: number[]): number {
    const now = new Date();
    const currentHour = now.getHours();

    // العثور على أقرب ساعة نشطة
    const sortedHours = activeHours.sort((a, b) => a - b);
    
    for (const hour of sortedHours) {
      if (hour > currentHour) {
        return hour;
      }
    }

    // إذا لم توجد ساعة نشطة اليوم، استخدم أول ساعة نشطة
    return sortedHours[0];
  }

  /**
   * بدء تحليل أنماط الاستخدام
   */
  private async startUsageAnalysis(): Promise<void> {
    console.log('📊 Starting usage pattern analysis...');

    // تحليل الأنماط كل ساعة
    setInterval(async () => {
      await this.analyzeAllUserPatterns();
    }, 60 * 60 * 1000);

    // تحليل فوري
    await this.analyzeAllUserPatterns();
  }

  /**
   * تحليل جميع أنماط المستخدمين
   */
  private async analyzeAllUserPatterns(): Promise<void> {
    console.log('📊 Analyzing all user patterns...');

    for (const [userId, pattern] of this.userPatterns) {
      try {
        // تحديث نقاط التفاعل
        pattern.engagementScore = this.calculateEngagementScore(pattern);

        // تحديث التحليلات
        await this.updateUsageAnalytics(userId, pattern);

        // إنشاء تذكيرات ذكية
        await this.createSmartReminders(userId, pattern);

      } catch (error) {
        console.error(`❌ Error analyzing pattern for user ${userId}:`, error);
      }
    }

    console.log(`📊 Analyzed patterns for ${this.userPatterns.size} users`);
  }

  /**
   * إنشاء تذكيرات ذكية
   */
  private async createSmartReminders(userId: number, pattern: UserPattern): Promise<void> {
    try {
      // تذكير للمستخدمين غير النشطين
      if (pattern.engagementScore < 30) {
        const hoursSinceLastActivity = (Date.now() - pattern.lastActivity.getTime()) / (1000 * 60 * 60);
        
        if (hoursSinceLastActivity > 48) { // بعد يومين
          await this.scheduleSmartMessage(
            userId,
            'reminder',
            'مرحباً! لم نراك منذ فترة. هل تريد المساعدة في إدارة مهامك؟',
            'medium'
          );
        }
      }

      // تذكير للمستخدمين النشطين جداً
      if (pattern.engagementScore > 80) {
        const hoursSinceLastActivity = (Date.now() - pattern.lastActivity.getTime()) / (1000 * 60 * 60);
        
        if (hoursSinceLastActivity > 6) { // بعد 6 ساعات
          await this.scheduleSmartMessage(
            userId,
            'update',
            'لديك مهام جديدة في انتظارك! هل تريد مراجعتها؟',
            'low'
          );
        }
      }

    } catch (error) {
      console.error(`❌ Error creating smart reminders for user ${userId}:`, error);
    }
  }

  /**
   * بدء معالج الجدولة الذكية
   */
  private async startSmartScheduler(): Promise<void> {
    console.log('⏰ Starting smart scheduler...');

    // معالجة الجدولة كل دقيقة
    setInterval(async () => {
      await this.processScheduledMessages();
    }, 60 * 1000);
  }

  /**
   * معالجة الرسائل المجدولة
   */
  private async processScheduledMessages(): Promise<void> {
    const now = new Date();
    const pendingSchedules = Array.from(this.smartSchedules.values())
      .filter(schedule => 
        schedule.status === 'pending' && 
        schedule.scheduledTime <= now
      );

    for (const schedule of pendingSchedules) {
      try {
        await this.sendScheduledMessage(schedule);
      } catch (error) {
        console.error(`❌ Error sending scheduled message ${schedule.id}:`, error);
        await this.handleScheduleError(schedule, error);
      }
    }
  }

  /**
   * إرسال رسالة مجدولة
   */
  private async sendScheduledMessage(schedule: SmartSchedule): Promise<void> {
    try {
      console.log(`📤 Sending scheduled message: ${schedule.id}`);

      // إرسال الرسالة
      await this.bot.sendMessage(schedule.userId, schedule.content, {
        parse_mode: 'HTML'
      });

      // تحديث الحالة
      schedule.status = 'sent';

      this.monitoringService.logEvent({
        type: 'system_event',
        level: 'info',
        source: 'smart_scheduling',
        message: `Scheduled message sent: ${schedule.type}`,
        data: { scheduleId: schedule.id, userId: schedule.userId }
      });

      console.log(`✅ Scheduled message sent: ${schedule.id}`);

    } catch (error) {
      throw error;
    }
  }

  /**
   * معالجة أخطاء الجدولة
   */
  private async handleScheduleError(schedule: SmartSchedule, error: any): Promise<void> {
    schedule.retryCount++;

    if (schedule.retryCount >= schedule.maxRetries) {
      schedule.status = 'failed';
      console.log(`❌ Schedule failed after ${schedule.maxRetries} retries: ${schedule.id}`);
    } else {
      // إعادة جدولة بعد 30 دقيقة
      schedule.scheduledTime = new Date(Date.now() + 30 * 60 * 1000);
      console.log(`🔄 Retrying schedule ${schedule.id} in 30 minutes`);
    }

    this.monitoringService.logEvent({
      type: 'error',
      level: 'error',
      source: 'smart_scheduling',
      message: `Schedule error: ${schedule.type}`,
      data: { scheduleId: schedule.id, error: error.message, retryCount: schedule.retryCount }
    });
  }

  /**
   * جدولة رسالة
   */
  private async scheduleMessage(schedule: SmartSchedule): Promise<void> {
    const delay = schedule.scheduledTime.getTime() - Date.now();
    
    if (delay > 0) {
      const timeout = setTimeout(async () => {
        await this.sendScheduledMessage(schedule);
      }, delay);

      this.scheduledJobs.set(schedule.id, timeout);
    }
  }

  /**
   * بدء مراقبة الأداء
   */
  private async startPerformanceMonitoring(): Promise<void> {
    console.log('📊 Starting performance monitoring...');

    // مراقبة الأداء كل 5 دقائق
    setInterval(async () => {
      await this.monitorPerformance();
    }, 5 * 60 * 1000);
  }

  /**
   * مراقبة الأداء
   */
  private async monitorPerformance(): Promise<void> {
    try {
      const stats = this.getPerformanceStats();
      
      // تسجيل الأداء
      this.monitoringService.logPerformance({
        responseTime: stats.averageResponseTime,
        memoryUsage: process.memoryUsage().heapUsed,
        cpuUsage: 0,
        activeUsers: stats.activeUsers,
        totalRequests: stats.totalSchedules,
        errorRate: stats.errorRate
      });

      // تنبيهات الأداء
      if (stats.errorRate > 10) {
        this.monitoringService.logEvent({
          type: 'performance',
          level: 'warning',
          source: 'smart_scheduling',
          message: 'High error rate in smart scheduling',
          data: { errorRate: stats.errorRate }
        });
      }

    } catch (error) {
      console.error('❌ Error monitoring performance:', error);
    }
  }

  /**
   * الحصول على إحصائيات الأداء
   */
  public getPerformanceStats(): any {
    const totalSchedules = this.smartSchedules.size;
    const failedSchedules = Array.from(this.smartSchedules.values())
      .filter(schedule => schedule.status === 'failed').length;
    
    const errorRate = totalSchedules > 0 ? (failedSchedules / totalSchedules) * 100 : 0;

    return {
      activeUsers: this.userPatterns.size,
      totalSchedules,
      pendingSchedules: Array.from(this.smartSchedules.values())
        .filter(schedule => schedule.status === 'pending').length,
      sentSchedules: Array.from(this.smartSchedules.values())
        .filter(schedule => schedule.status === 'sent').length,
      failedSchedules,
      errorRate,
      averageResponseTime: 0, // سيتم حسابها من المراقبة
      engagementLevels: this.getEngagementLevels()
    };
  }

  /**
   * الحصول على مستويات التفاعل
   */
  private getEngagementLevels(): Record<string, number> {
    const levels = { low: 0, medium: 0, high: 0, very_high: 0 };

    for (const analytics of this.usageAnalytics.values()) {
      levels[analytics.engagementLevel]++;
    }

    return levels;
  }

  /**
   * الحصول على إحصائيات مفصلة
   */
  public getDetailedStats(): any {
    return {
      isActive: this.isActive,
      userPatterns: this.userPatterns.size,
      smartSchedules: this.smartSchedules.size,
      usageAnalytics: this.usageAnalytics.size,
      scheduledJobs: this.scheduledJobs.size,
      performance: this.getPerformanceStats()
    };
  }

  /**
   * إيقاف النظام
   */
  public async stop(): Promise<void> {
    if (!this.isActive) return;

    console.log('⏹️ Stopping Smart Scheduling System...');

    // إيقاف جميع المهام المجدولة
    for (const [jobId, job] of this.scheduledJobs) {
      clearTimeout(job);
    }
    this.scheduledJobs.clear();

    this.isActive = false;

    this.monitoringService.logEvent({
      type: 'system_event',
      level: 'info',
      source: 'smart_scheduling',
      message: 'Smart Scheduling System stopped'
    });

    console.log('✅ Smart Scheduling System stopped');
  }
}

// تصدير الدالة لإنشاء الخدمة
export function createSmartSchedulingSystem(bot: TelegramBot): SmartSchedulingSystem {
  return new SmartSchedulingSystem(bot);
}
