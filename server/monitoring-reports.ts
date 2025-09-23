// Advanced Monitoring and Reporting System
// نظام المراقبة والتقارير المتقدم

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface EventLog {
  id: string;
  timestamp: Date;
  type: 'user_action' | 'system_event' | 'error' | 'performance' | 'autopilot';
  level: 'info' | 'warning' | 'error' | 'critical';
  source: string;
  message: string;
  data?: any;
  userId?: number;
  chatId?: number;
  duration?: number;
  memory?: number;
  cpu?: number;
}

export interface PerformanceMetrics {
  responseTime: number;
  memoryUsage: number;
  cpuUsage: number;
  activeUsers: number;
  totalRequests: number;
  errorRate: number;
  timestamp: Date;
}

export interface BotUsageReport {
  period: string;
  totalUsers: number;
  activeUsers: number;
  totalMessages: number;
  commandsUsed: Record<string, number>;
  averageResponseTime: number;
  errorCount: number;
  topUsers: Array<{ userId: number; messageCount: number; username?: string }>;
  generatedAt: Date;
}

export interface AutopilotReport {
  period: string;
  totalTasks: number;
  completedTasks: number;
  failedTasks: number;
  averageTaskDuration: number;
  systemUptime: number;
  memoryUsage: number;
  cpuUsage: number;
  generatedAt: Date;
}

export class MonitoringReportsService {
  private eventLogs: EventLog[] = [];
  private performanceMetrics: PerformanceMetrics[] = [];
  private botUsageStats: Map<number, any> = new Map();
  private autopilotStats: Map<string, any> = new Map();
  private reportInterval: NodeJS.Timeout | null = null;
  private logInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.startMonitoring();
    console.log('📊 Monitoring and Reports Service initialized');
  }

  /**
   * بدء المراقبة
   */
  private startMonitoring(): void {
    // مراقبة الأداء كل 30 ثانية
    this.performanceInterval = setInterval(() => {
      this.collectPerformanceMetrics();
    }, 30000);

    // إنشاء تقارير دورية كل ساعة
    this.reportInterval = setInterval(() => {
      this.generatePeriodicReports();
    }, 3600000);

    // حفظ السجلات كل 5 دقائق
    this.logInterval = setInterval(() => {
      this.saveEventLogs();
    }, 300000);
  }

  /**
   * تسجيل حدث
   */
  public logEvent(event: Omit<EventLog, 'id' | 'timestamp'>): void {
    const logEntry: EventLog = {
      id: this.generateEventId(),
      timestamp: new Date(),
      ...event
    };

    this.eventLogs.push(logEntry);

    // حفظ في ملف منفصل
    this.saveEventToFile(logEntry);

    // تحديث الإحصائيات
    this.updateStats(logEntry);

    console.log(`📝 Event logged: ${event.type} - ${event.message}`);
  }

  /**
   * تسجيل أداء النظام
   */
  public logPerformance(metrics: Omit<PerformanceMetrics, 'timestamp'>): void {
    const performanceEntry: PerformanceMetrics = {
      ...metrics,
      timestamp: new Date()
    };

    this.performanceMetrics.push(performanceEntry);

    // الاحتفاظ بآخر 1000 قياس
    if (this.performanceMetrics.length > 1000) {
      this.performanceMetrics.shift();
    }
  }

  /**
   * تسجيل استخدام البوت
   */
  public logBotUsage(userId: number, command: string, responseTime: number, success: boolean): void {
    if (!this.botUsageStats.has(userId)) {
      this.botUsageStats.set(userId, {
        userId,
        messageCount: 0,
        commands: {},
        totalResponseTime: 0,
        errorCount: 0,
        lastActivity: new Date()
      });
    }

    const userStats = this.botUsageStats.get(userId)!;
    userStats.messageCount++;
    userStats.commands[command] = (userStats.commands[command] || 0) + 1;
    userStats.totalResponseTime += responseTime;
    userStats.lastActivity = new Date();

    if (!success) {
      userStats.errorCount++;
    }

    // تسجيل الحدث
    this.logEvent({
      type: 'user_action',
      level: success ? 'info' : 'error',
      source: 'bot',
      message: `User ${userId} executed command: ${command}`,
      data: { command, responseTime, success },
      userId,
      duration: responseTime
    });
  }

  /**
   * تسجيل نشاط Autopilot
   */
  public logAutopilotActivity(activity: string, data: any): void {
    this.logEvent({
      type: 'autopilot',
      level: 'info',
      source: 'autopilot',
      message: activity,
      data
    });
  }

  /**
   * جمع مقاييس الأداء
   */
  private collectPerformanceMetrics(): void {
    const memUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();

    this.logPerformance({
      responseTime: this.calculateAverageResponseTime(),
      memoryUsage: memUsage.heapUsed,
      cpuUsage: cpuUsage.user + cpuUsage.system,
      activeUsers: this.botUsageStats.size,
      totalRequests: this.eventLogs.length,
      errorRate: this.calculateErrorRate()
    });
  }

  /**
   * إنشاء تقارير دورية
   */
  private generatePeriodicReports(): void {
    this.generateBotUsageReport();
    this.generateAutopilotReport();
    this.generateSystemHealthReport();
  }

  /**
   * إنشاء تقرير استخدام البوت
   */
  public generateBotUsageReport(): BotUsageReport {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 3600000);

    // تصفية الأحداث في آخر ساعة
    const recentEvents = this.eventLogs.filter(
      event => event.timestamp >= oneHourAgo && event.type === 'user_action'
    );

    // حساب الإحصائيات
    const totalUsers = this.botUsageStats.size;
    const activeUsers = Array.from(this.botUsageStats.values()).filter(
      stats => stats.lastActivity >= oneHourAgo
    ).length;

    const totalMessages = recentEvents.length;
    const commandsUsed: Record<string, number> = {};
    let totalResponseTime = 0;
    let errorCount = 0;

    recentEvents.forEach(event => {
      if (event.data?.command) {
        commandsUsed[event.data.command] = (commandsUsed[event.data.command] || 0) + 1;
      }
      if (event.duration) {
        totalResponseTime += event.duration;
      }
      if (event.level === 'error') {
        errorCount++;
      }
    });

    const averageResponseTime = totalMessages > 0 ? totalResponseTime / totalMessages : 0;

    // أفضل المستخدمين
    const topUsers = Array.from(this.botUsageStats.values())
      .sort((a, b) => b.messageCount - a.messageCount)
      .slice(0, 10)
      .map(stats => ({
        userId: stats.userId,
        messageCount: stats.messageCount,
        username: `user_${stats.userId}`
      }));

    const report: BotUsageReport = {
      period: 'Last Hour',
      totalUsers,
      activeUsers,
      totalMessages,
      commandsUsed,
      averageResponseTime,
      errorCount,
      topUsers,
      generatedAt: now
    };

    // حفظ التقرير
    this.saveReportToFile('bot-usage', report);

    return report;
  }

  /**
   * إنشاء تقرير Autopilot
   */
  public generateAutopilotReport(): AutopilotReport {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 3600000);

    // تصفية أحداث Autopilot
    const autopilotEvents = this.eventLogs.filter(
      event => event.timestamp >= oneHourAgo && event.type === 'autopilot'
    );

    // حساب الإحصائيات
    const totalTasks = autopilotEvents.filter(event => 
      event.message.includes('task') || event.message.includes('مهمة')
    ).length;

    const completedTasks = autopilotEvents.filter(event => 
      event.message.includes('completed') || event.message.includes('مكتمل')
    ).length;

    const failedTasks = autopilotEvents.filter(event => 
      event.message.includes('failed') || event.message.includes('فشل')
    ).length;

    // حساب متوسط مدة المهام
    const taskDurations = autopilotEvents
      .filter(event => event.duration)
      .map(event => event.duration!);
    
    const averageTaskDuration = taskDurations.length > 0 
      ? taskDurations.reduce((a, b) => a + b, 0) / taskDurations.length 
      : 0;

    // إحصائيات النظام
    const latestMetrics = this.performanceMetrics[this.performanceMetrics.length - 1];
    const systemUptime = process.uptime();
    const memoryUsage = latestMetrics?.memoryUsage || process.memoryUsage().heapUsed;
    const cpuUsage = latestMetrics?.cpuUsage || 0;

    const report: AutopilotReport = {
      period: 'Last Hour',
      totalTasks,
      completedTasks,
      failedTasks,
      averageTaskDuration,
      systemUptime,
      memoryUsage,
      cpuUsage,
      generatedAt: now
    };

    // حفظ التقرير
    this.saveReportToFile('autopilot', report);

    return report;
  }

  /**
   * إنشاء تقرير صحة النظام
   */
  public generateSystemHealthReport(): any {
    const now = new Date();
    const latestMetrics = this.performanceMetrics[this.performanceMetrics.length - 1];

    const report = {
      timestamp: now,
      uptime: process.uptime(),
      memory: {
        used: process.memoryUsage().heapUsed,
        total: process.memoryUsage().heapTotal,
        external: process.memoryUsage().external
      },
      performance: {
        averageResponseTime: this.calculateAverageResponseTime(),
        errorRate: this.calculateErrorRate(),
        activeUsers: this.botUsageStats.size
      },
      events: {
        total: this.eventLogs.length,
        errors: this.eventLogs.filter(e => e.level === 'error').length,
        warnings: this.eventLogs.filter(e => e.level === 'warning').length
      },
      health: this.calculateSystemHealth()
    };

    // حفظ التقرير
    this.saveReportToFile('system-health', report);

    return report;
  }

  /**
   * حساب متوسط وقت الاستجابة
   */
  private calculateAverageResponseTime(): number {
    const recentEvents = this.eventLogs
      .filter(event => event.duration && event.timestamp >= new Date(Date.now() - 3600000))
      .map(event => event.duration!);

    return recentEvents.length > 0 
      ? recentEvents.reduce((a, b) => a + b, 0) / recentEvents.length 
      : 0;
  }

  /**
   * حساب معدل الأخطاء
   */
  private calculateErrorRate(): number {
    const recentEvents = this.eventLogs.filter(
      event => event.timestamp >= new Date(Date.now() - 3600000)
    );

    if (recentEvents.length === 0) return 0;

    const errorEvents = recentEvents.filter(event => event.level === 'error');
    return (errorEvents.length / recentEvents.length) * 100;
  }

  /**
   * حساب صحة النظام
   */
  private calculateSystemHealth(): 'healthy' | 'warning' | 'critical' {
    const errorRate = this.calculateErrorRate();
    const avgResponseTime = this.calculateAverageResponseTime();
    const memoryUsage = process.memoryUsage().heapUsed / process.memoryUsage().heapTotal;

    if (errorRate > 10 || avgResponseTime > 5000 || memoryUsage > 0.9) {
      return 'critical';
    }
    if (errorRate > 5 || avgResponseTime > 2000 || memoryUsage > 0.7) {
      return 'warning';
    }
    return 'healthy';
  }

  /**
   * حفظ الحدث في ملف
   */
  private saveEventToFile(event: EventLog): void {
    const logDir = path.join(__dirname, '../logs');
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    const logFile = path.join(logDir, `events-${event.timestamp.toISOString().split('T')[0]}.json`);
    const logEntry = JSON.stringify(event, null, 2) + '\n';

    fs.appendFileSync(logFile, logEntry);
  }

  /**
   * حفظ التقرير في ملف
   */
  private saveReportToFile(type: string, report: any): void {
    const reportsDir = path.join(__dirname, '../reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    const reportFile = path.join(reportsDir, `${type}-${new Date().toISOString().split('T')[0]}.json`);
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
  }

  /**
   * حفظ سجلات الأحداث
   */
  private saveEventLogs(): void {
    const logDir = path.join(__dirname, '../logs');
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    const logFile = path.join(logDir, `events-${new Date().toISOString().split('T')[0]}.json`);
    fs.writeFileSync(logFile, JSON.stringify(this.eventLogs, null, 2));
  }

  /**
   * تحديث الإحصائيات
   */
  private updateStats(event: EventLog): void {
    // تحديث إحصائيات المستخدم
    if (event.userId) {
      if (!this.botUsageStats.has(event.userId)) {
        this.botUsageStats.set(event.userId, {
          userId: event.userId,
          messageCount: 0,
          commands: {},
          totalResponseTime: 0,
          errorCount: 0,
          lastActivity: new Date()
        });
      }

      const userStats = this.botUsageStats.get(event.userId)!;
      userStats.lastActivity = new Date();
      
      if (event.level === 'error') {
        userStats.errorCount++;
      }
    }

    // تحديث إحصائيات Autopilot
    if (event.type === 'autopilot') {
      const autopilotKey = event.message.split(' ')[0];
      if (!this.autopilotStats.has(autopilotKey)) {
        this.autopilotStats.set(autopilotKey, {
          count: 0,
          lastActivity: new Date()
        });
      }

      const autopilotStat = this.autopilotStats.get(autopilotKey)!;
      autopilotStat.count++;
      autopilotStat.lastActivity = new Date();
    }
  }

  /**
   * إنشاء معرف فريد للحدث
   */
  private generateEventId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * الحصول على الإحصائيات الحالية
   */
  public getCurrentStats(): any {
    return {
      totalEvents: this.eventLogs.length,
      activeUsers: this.botUsageStats.size,
      averageResponseTime: this.calculateAverageResponseTime(),
      errorRate: this.calculateErrorRate(),
      systemHealth: this.calculateSystemHealth(),
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage()
    };
  }

  /**
   * الحصول على أحداث المستخدم
   */
  public getUserEvents(userId: number, limit: number = 50): EventLog[] {
    return this.eventLogs
      .filter(event => event.userId === userId)
      .slice(-limit)
      .reverse();
  }

  /**
   * إيقاف المراقبة
   */
  public stopMonitoring(): void {
    if (this.performanceInterval) {
      clearInterval(this.performanceInterval);
    }
    if (this.reportInterval) {
      clearInterval(this.reportInterval);
    }
    if (this.logInterval) {
      clearInterval(this.logInterval);
    }
  }
}

// تصدير الدالة لإنشاء الخدمة
export function createMonitoringReportsService(): MonitoringReportsService {
  return new MonitoringReportsService();
}
