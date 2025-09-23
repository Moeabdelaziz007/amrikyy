// UX Enhancement System - نظام تحسين تجربة المستخدم
// تحسين تجربة المستخدم والتفاعل مع الواجهة

import TelegramBot from 'node-telegram-bot-api';
import { createMonitoringReportsService } from './monitoring-reports.js';

export interface UserPreference {
  userId: number;
  chatId: number;
  language: 'ar' | 'en' | 'auto';
  theme: 'light' | 'dark' | 'auto';
  notifications: {
    enabled: boolean;
    sound: boolean;
    vibration: boolean;
    schedule: {
      start: string;
      end: string;
    };
  };
  interface: {
    compactMode: boolean;
    showEmojis: boolean;
    showTimestamps: boolean;
    showTyping: boolean;
  };
  shortcuts: Record<string, string>;
  accessibility: {
    highContrast: boolean;
    largeText: boolean;
    screenReader: boolean;
  };
  updatedAt: Date;
}

export interface UserSession {
  userId: number;
  chatId: number;
  sessionId: string;
  startTime: Date;
  lastActivity: Date;
  totalMessages: number;
  currentFlow: string;
  context: Record<string, any>;
  preferences: UserPreference;
  performance: {
    averageResponseTime: number;
    satisfactionScore: number;
    errorCount: number;
  };
}

export interface UXMetric {
  metric: string;
  value: number;
  timestamp: Date;
  userId?: number;
  context?: Record<string, any>;
}

export interface UXInsight {
  type: 'performance' | 'usability' | 'satisfaction' | 'accessibility';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  recommendations: string[];
  affectedUsers: number;
  impact: number;
}

export class UXEnhancementSystem {
  private bot: TelegramBot;
  private monitoringService: any;
  private userPreferences: Map<number, UserPreference> = new Map();
  private userSessions: Map<number, UserSession> = new Map();
  private uxMetrics: Map<string, UXMetric> = new Map();
  private uxInsights: Map<string, UXInsight> = new Map();
  private isActive: boolean = false;

  constructor(bot: TelegramBot) {
    this.bot = bot;
    this.monitoringService = createMonitoringReportsService();
    this.initializeDefaultPreferences();
    console.log('🎨 UX Enhancement System initialized');
  }

  /**
   * تهيئة التفضيلات الافتراضية
   */
  private initializeDefaultPreferences(): void {
    // سيتم إنشاء تفضيلات افتراضية عند أول تفاعل للمستخدم
  }

  /**
   * بدء نظام تحسين تجربة المستخدم
   */
  public async start(): Promise<void> {
    if (this.isActive) {
      console.log('⚠️ UX Enhancement System is already active');
      return;
    }

    this.isActive = true;
    console.log('🚀 Starting UX Enhancement System...');

    // بدء مراقبة تجربة المستخدم
    await this.startUXMonitoring();

    // بدء تحليل الرؤى
    await this.startInsightsAnalysis();

    // بدء تحسين الأداء
    await this.startPerformanceOptimization();

    this.monitoringService.logEvent({
      type: 'system_event',
      level: 'info',
      source: 'ux_enhancement',
      message: 'UX Enhancement System started successfully'
    });

    console.log('✅ UX Enhancement System started successfully');
  }

  /**
   * إنشاء جلسة مستخدم جديدة
   */
  public async createUserSession(
    userId: number,
    chatId: number,
    context?: Record<string, any>
  ): Promise<UserSession> {
    try {
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // الحصول على أو إنشاء تفضيلات المستخدم
      let preferences = this.userPreferences.get(userId);
      if (!preferences) {
        preferences = await this.createDefaultPreferences(userId, chatId);
        this.userPreferences.set(userId, preferences);
      }

      const session: UserSession = {
        userId,
        chatId,
        sessionId,
        startTime: new Date(),
        lastActivity: new Date(),
        totalMessages: 0,
        currentFlow: 'main_menu',
        context: context || {},
        preferences,
        performance: {
          averageResponseTime: 0,
          satisfactionScore: 0,
          errorCount: 0
        }
      };

      this.userSessions.set(userId, session);

      this.monitoringService.logEvent({
        type: 'user_action',
        level: 'info',
        source: 'ux_enhancement',
        message: 'New user session created',
        data: { userId, sessionId, chatId }
      });

      console.log(`🎨 New user session created: ${sessionId} for user ${userId}`);
      return session;

    } catch (error) {
      console.error('❌ Error creating user session:', error);
      this.monitoringService.logEvent({
        type: 'error',
        level: 'error',
        source: 'ux_enhancement',
        message: 'Error creating user session',
        data: { userId, error: error.message }
      });
      throw error;
    }
  }

  /**
   * إنشاء تفضيلات افتراضية
   */
  private async createDefaultPreferences(userId: number, chatId: number): Promise<UserPreference> {
    return {
      userId,
      chatId,
      language: 'ar',
      theme: 'auto',
      notifications: {
        enabled: true,
        sound: true,
        vibration: false,
        schedule: {
          start: '09:00',
          end: '22:00'
        }
      },
      interface: {
        compactMode: false,
        showEmojis: true,
        showTimestamps: true,
        showTyping: true
      },
      shortcuts: {
        'help': '/help',
        'status': '/status',
        'menu': '/menu'
      },
      accessibility: {
        highContrast: false,
        largeText: false,
        screenReader: false
      },
      updatedAt: new Date()
    };
  }

  /**
   * تحديث جلسة المستخدم
   */
  public async updateUserSession(
    userId: number,
    updates: Partial<UserSession>
  ): Promise<void> {
    try {
      const session = this.userSessions.get(userId);
      if (!session) {
        console.log(`⚠️ Session not found for user ${userId}`);
        return;
      }

      // تحديث الجلسة
      Object.assign(session, updates);
      session.lastActivity = new Date();

      // تحديث مقاييس الأداء
      if (updates.performance) {
        session.performance = { ...session.performance, ...updates.performance };
      }

      console.log(`🎨 User session updated: ${session.sessionId}`);

    } catch (error) {
      console.error('❌ Error updating user session:', error);
    }
  }

  /**
   * تحسين الرسالة حسب تفضيلات المستخدم
   */
  public async enhanceMessage(
    userId: number,
    message: string,
    type: 'text' | 'keyboard' | 'media' = 'text'
  ): Promise<string> {
    try {
      const session = this.userSessions.get(userId);
      if (!session) {
        return message;
      }

      const preferences = session.preferences;
      let enhancedMessage = message;

      // تحسين حسب اللغة
      if (preferences.language === 'ar') {
        enhancedMessage = this.enhanceForArabic(enhancedMessage);
      } else if (preferences.language === 'en') {
        enhancedMessage = this.enhanceForEnglish(enhancedMessage);
      }

      // تحسين حسب الواجهة
      if (preferences.interface.showEmojis) {
        enhancedMessage = this.addEmojis(enhancedMessage);
      }

      if (preferences.interface.compactMode) {
        enhancedMessage = this.makeCompact(enhancedMessage);
      }

      // تحسين حسب إمكانية الوصول
      if (preferences.accessibility.largeText) {
        enhancedMessage = this.makeLargeText(enhancedMessage);
      }

      if (preferences.accessibility.highContrast) {
        enhancedMessage = this.addHighContrast(enhancedMessage);
      }

      // تسجيل مقياس تحسين الرسالة
      this.recordUXMetric('message_enhancement', 1, userId, {
        originalLength: message.length,
        enhancedLength: enhancedMessage.length,
        enhancements: this.getEnhancementTypes(preferences)
      });

      return enhancedMessage;

    } catch (error) {
      console.error('❌ Error enhancing message:', error);
      return message;
    }
  }

  /**
   * تحسين للغة العربية
   */
  private enhanceForArabic(message: string): string {
    // إضافة تحسينات خاصة بالعربية
    return message
      .replace(/\bمرحبا\b/g, 'مرحباً')
      .replace(/\bشكرا\b/g, 'شكراً')
      .replace(/\bالا\b/g, 'إلا');
  }

  /**
   * تحسين للغة الإنجليزية
   */
  private enhanceForEnglish(message: string): string {
    // إضافة تحسينات خاصة بالإنجليزية
    return message
      .replace(/\bhello\b/g, 'Hello')
      .replace(/\bthanks\b/g, 'Thanks')
      .replace(/\bplease\b/g, 'Please');
  }

  /**
   * إضافة الرموز التعبيرية
   */
  private addEmojis(message: string): string {
    const emojiMap: Record<string, string> = {
      'مرحباً': 'مرحباً 👋',
      'شكراً': 'شكراً 🙏',
      'مهمة': 'مهمة 📋',
      'تذكير': 'تذكير ⏰',
      'حالة': 'حالة 📊',
      'مساعدة': 'مساعدة ❓',
      'نجح': 'نجح ✅',
      'فشل': 'فشل ❌',
      'تحذير': 'تحذير ⚠️',
      'معلومات': 'معلومات ℹ️'
    };

    let enhancedMessage = message;
    for (const [word, emoji] of Object.entries(emojiMap)) {
      enhancedMessage = enhancedMessage.replace(new RegExp(`\\b${word}\\b`, 'g'), emoji);
    }

    return enhancedMessage;
  }

  /**
   * جعل الرسالة مدمجة
   */
  private makeCompact(message: string): string {
    return message
      .replace(/\n\s*\n/g, '\n')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * جعل النص كبير
   */
  private makeLargeText(message: string): string {
    return message
      .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
      .replace(/\*(.*?)\*/g, '<i>$1</i>');
  }

  /**
   * إضافة تباين عالي
   */
  private addHighContrast(message: string): string {
    return message
      .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
      .replace(/\*(.*?)\*/g, '<i>$1</i>');
  }

  /**
   * الحصول على أنواع التحسينات
   */
  private getEnhancementTypes(preferences: UserPreference): string[] {
    const enhancements: string[] = [];

    if (preferences.language !== 'auto') {
      enhancements.push('language');
    }

    if (preferences.interface.showEmojis) {
      enhancements.push('emojis');
    }

    if (preferences.interface.compactMode) {
      enhancements.push('compact');
    }

    if (preferences.accessibility.largeText) {
      enhancements.push('large_text');
    }

    if (preferences.accessibility.highContrast) {
      enhancements.push('high_contrast');
    }

    return enhancements;
  }

  /**
   * تسجيل مقياس تجربة المستخدم
   */
  public recordUXMetric(
    metric: string,
    value: number,
    userId?: number,
    context?: Record<string, any>
  ): void {
    try {
      const metricId = `ux_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const uxMetric: UXMetric = {
        metric,
        value,
        timestamp: new Date(),
        userId,
        context
      };

      this.uxMetrics.set(metricId, uxMetric);

      console.log(`📊 UX metric recorded: ${metric} = ${value}`);

    } catch (error) {
      console.error('❌ Error recording UX metric:', error);
    }
  }

  /**
   * بدء مراقبة تجربة المستخدم
   */
  private async startUXMonitoring(): Promise<void> {
    console.log('🎨 Starting UX monitoring...');

    // مراقبة تجربة المستخدم كل دقيقة
    setInterval(async () => {
      await this.monitorUXMetrics();
    }, 60 * 1000);

    // مراقبة فورية
    await this.monitorUXMetrics();
  }

  /**
   * مراقبة مقاييس تجربة المستخدم
   */
  private async monitorUXMetrics(): Promise<void> {
    console.log('🎨 Monitoring UX metrics...');

    try {
      // مراقبة وقت الاستجابة
      await this.monitorResponseTime();

      // مراقبة رضا المستخدم
      await this.monitorUserSatisfaction();

      // مراقبة إمكانية الوصول
      await this.monitorAccessibility();

      // مراقبة الأداء
      await this.monitorPerformance();

    } catch (error) {
      console.error('❌ Error monitoring UX metrics:', error);
    }
  }

  /**
   * مراقبة وقت الاستجابة
   */
  private async monitorResponseTime(): Promise<void> {
    const sessions = Array.from(this.userSessions.values());
    const totalResponseTime = sessions.reduce((sum, session) => 
      sum + session.performance.averageResponseTime, 0);
    const averageResponseTime = sessions.length > 0 ? totalResponseTime / sessions.length : 0;

    this.recordUXMetric('average_response_time', averageResponseTime, undefined, {
      totalSessions: sessions.length,
      metric: 'response_time'
    });

    // إنشاء رؤية إذا كان وقت الاستجابة بطيء
    if (averageResponseTime > 2000) {
      await this.createUXInsight({
        type: 'performance',
        title: 'بطء في وقت الاستجابة',
        description: `متوسط وقت الاستجابة ${averageResponseTime.toFixed(2)}ms يتجاوز المعيار المطلوب`,
        severity: 'high',
        recommendations: [
          'تحسين خوارزميات المعالجة',
          'استخدام التخزين المؤقت',
          'تحسين قاعدة البيانات'
        ],
        affectedUsers: sessions.length,
        impact: 0.8
      });
    }
  }

  /**
   * مراقبة رضا المستخدم
   */
  private async monitorUserSatisfaction(): Promise<void> {
    const sessions = Array.from(this.userSessions.values());
    const totalSatisfaction = sessions.reduce((sum, session) => 
      sum + session.performance.satisfactionScore, 0);
    const averageSatisfaction = sessions.length > 0 ? totalSatisfaction / sessions.length : 0;

    this.recordUXMetric('user_satisfaction', averageSatisfaction, undefined, {
      totalSessions: sessions.length,
      metric: 'satisfaction'
    });

    // إنشاء رؤية إذا كان الرضا منخفض
    if (averageSatisfaction < 70) {
      await this.createUXInsight({
        type: 'satisfaction',
        title: 'انخفاض في رضا المستخدمين',
        description: `متوسط رضا المستخدمين ${averageSatisfaction.toFixed(1)}% أقل من المعيار المطلوب`,
        severity: 'high',
        recommendations: [
          'تحسين واجهة المستخدم',
          'إضافة ميزات جديدة',
          'تحسين الاستجابة للطلبات'
        ],
        affectedUsers: sessions.length,
        impact: 0.9
      });
    }
  }

  /**
   * مراقبة إمكانية الوصول
   */
  private async monitorAccessibility(): Promise<void> {
    const sessions = Array.from(this.userSessions.values());
    const accessibilityUsers = sessions.filter(session => 
      session.preferences.accessibility.highContrast || 
      session.preferences.accessibility.largeText ||
      session.preferences.accessibility.screenReader
    ).length;

    const accessibilityRate = sessions.length > 0 ? (accessibilityUsers / sessions.length) * 100 : 0;

    this.recordUXMetric('accessibility_usage', accessibilityRate, undefined, {
      totalSessions: sessions.length,
      accessibilityUsers,
      metric: 'accessibility'
    });

    // إنشاء رؤية إذا كان استخدام إمكانية الوصول منخفض
    if (accessibilityRate < 10) {
      await this.createUXInsight({
        type: 'accessibility',
        title: 'انخفاض في استخدام إمكانية الوصول',
        description: `فقط ${accessibilityRate.toFixed(1)}% من المستخدمين يستخدمون ميزات إمكانية الوصول`,
        severity: 'medium',
        recommendations: [
          'تحسين ميزات إمكانية الوصول',
          'إضافة المزيد من الخيارات',
          'توعية المستخدمين بالميزات المتاحة'
        ],
        affectedUsers: sessions.length,
        impact: 0.6
      });
    }
  }

  /**
   * مراقبة الأداء
   */
  private async monitorPerformance(): Promise<void> {
    const sessions = Array.from(this.userSessions.values());
    const totalErrors = sessions.reduce((sum, session) => 
      sum + session.performance.errorCount, 0);
    const averageErrors = sessions.length > 0 ? totalErrors / sessions.length : 0;

    this.recordUXMetric('average_errors', averageErrors, undefined, {
      totalSessions: sessions.length,
      totalErrors,
      metric: 'errors'
    });

    // إنشاء رؤية إذا كان عدد الأخطاء مرتفع
    if (averageErrors > 5) {
      await this.createUXInsight({
        type: 'performance',
        title: 'ارتفاع في عدد الأخطاء',
        description: `متوسط الأخطاء ${averageErrors.toFixed(1)} لكل جلسة يتجاوز المعيار المقبول`,
        severity: 'critical',
        recommendations: [
          'مراجعة كود النظام',
          'تحسين معالجة الأخطاء',
          'إضافة المزيد من الاختبارات'
        ],
        affectedUsers: sessions.length,
        impact: 0.95
      });
    }
  }

  /**
   * بدء تحليل الرؤى
   */
  private async startInsightsAnalysis(): Promise<void> {
    console.log('🔍 Starting insights analysis...');

    // تحليل الرؤى كل 30 دقيقة
    setInterval(async () => {
      await this.analyzeUXInsights();
    }, 30 * 60 * 1000);

    // تحليل فوري
    await this.analyzeUXInsights();
  }

  /**
   * تحليل رؤى تجربة المستخدم
   */
  private async analyzeUXInsights(): Promise<void> {
    console.log('🔍 Analyzing UX insights...');

    try {
      // تحليل الاتجاهات
      await this.analyzeTrends();

      // تحليل الأنماط
      await this.analyzePatterns();

      // تحليل التوصيات
      await this.analyzeRecommendations();

    } catch (error) {
      console.error('❌ Error analyzing UX insights:', error);
    }
  }

  /**
   * تحليل الاتجاهات
   */
  private async analyzeTrends(): Promise<void> {
    const metrics = Array.from(this.uxMetrics.values());
    const recentMetrics = metrics.filter(metric => 
      Date.now() - metric.timestamp.getTime() < 24 * 60 * 60 * 1000 // آخر 24 ساعة
    );

    // تحليل اتجاه وقت الاستجابة
    const responseTimeMetrics = recentMetrics.filter(m => m.metric === 'average_response_time');
    if (responseTimeMetrics.length > 0) {
      const trend = this.calculateTrend(responseTimeMetrics.map(m => m.value));
      if (trend > 0.1) {
        await this.createUXInsight({
          type: 'performance',
          title: 'اتجاه متزايد في وقت الاستجابة',
          description: 'وقت الاستجابة يزداد بمرور الوقت',
          severity: 'medium',
          recommendations: ['مراقبة الأداء', 'تحسين النظام'],
          affectedUsers: 0,
          impact: 0.7
        });
      }
    }
  }

  /**
   * تحليل الأنماط
   */
  private async analyzePatterns(): Promise<void> {
    const sessions = Array.from(this.userSessions.values());
    
    // تحليل أنماط الاستخدام
    const peakHours = this.analyzePeakHours(sessions);
    const commonFlows = this.analyzeCommonFlows(sessions);
    const userPreferences = this.analyzeUserPreferences(sessions);

    // إنشاء رؤى بناءً على الأنماط
    if (peakHours.length > 0) {
      await this.createUXInsight({
        type: 'usability',
        title: 'أنماط الاستخدام المكتشفة',
        description: `ساعات الذروة: ${peakHours.join(', ')}`,
        severity: 'low',
        recommendations: ['تحسين الأداء في ساعات الذروة'],
        affectedUsers: sessions.length,
        impact: 0.5
      });
    }
  }

  /**
   * تحليل التوصيات
   */
  private async analyzeRecommendations(): Promise<void> {
    const insights = Array.from(this.uxInsights.values());
    const highPriorityInsights = insights.filter(insight => 
      insight.severity === 'high' || insight.severity === 'critical'
    );

    if (highPriorityInsights.length > 0) {
      console.log(`🔍 Found ${highPriorityInsights.length} high priority insights`);
      
      // إرسال تنبيه للمطورين
      this.monitoringService.logEvent({
        type: 'system_event',
        level: 'warning',
        source: 'ux_enhancement',
        message: 'High priority UX insights detected',
        data: { insightsCount: highPriorityInsights.length }
      });
    }
  }

  /**
   * إنشاء رؤية تجربة المستخدم
   */
  private async createUXInsight(insight: Omit<UXInsight, 'type'> & { type: UXInsight['type'] }): Promise<void> {
    try {
      const insightId = `insight_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const uxInsight: UXInsight = {
        ...insight,
        type: insight.type
      };

      this.uxInsights.set(insightId, uxInsight);

      this.monitoringService.logEvent({
        type: 'system_event',
        level: 'info',
        source: 'ux_enhancement',
        message: 'UX insight created',
        data: { insightId, type: insight.type, severity: insight.severity }
      });

      console.log(`🔍 UX insight created: ${insight.title} (${insight.severity})`);

    } catch (error) {
      console.error('❌ Error creating UX insight:', error);
    }
  }

  /**
   * حساب الاتجاه
   */
  private calculateTrend(values: number[]): number {
    if (values.length < 2) return 0;
    
    const first = values[0];
    const last = values[values.length - 1];
    
    return (last - first) / first;
  }

  /**
   * تحليل ساعات الذروة
   */
  private analyzePeakHours(sessions: UserSession[]): number[] {
    const hourCounts: Record<number, number> = {};
    
    sessions.forEach(session => {
      const hour = session.startTime.getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });

    return Object.entries(hourCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([hour]) => parseInt(hour));
  }

  /**
   * تحليل التدفقات الشائعة
   */
  private analyzeCommonFlows(sessions: UserSession[]): string[] {
    const flowCounts: Record<string, number> = {};
    
    sessions.forEach(session => {
      flowCounts[session.currentFlow] = (flowCounts[session.currentFlow] || 0) + 1;
    });

    return Object.entries(flowCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([flow]) => flow);
  }

  /**
   * تحليل تفضيلات المستخدم
   */
  private analyzeUserPreferences(sessions: UserSession[]): Record<string, any> {
    const preferences: Record<string, any> = {
      languages: {},
      themes: {},
      accessibility: {}
    };

    sessions.forEach(session => {
      const pref = session.preferences;
      
      preferences.languages[pref.language] = (preferences.languages[pref.language] || 0) + 1;
      preferences.themes[pref.theme] = (preferences.themes[pref.theme] || 0) + 1;
      
      if (pref.accessibility.highContrast) {
        preferences.accessibility.highContrast = (preferences.accessibility.highContrast || 0) + 1;
      }
      if (pref.accessibility.largeText) {
        preferences.accessibility.largeText = (preferences.accessibility.largeText || 0) + 1;
      }
    });

    return preferences;
  }

  /**
   * بدء تحسين الأداء
   */
  private async startPerformanceOptimization(): Promise<void> {
    console.log('⚡ Starting performance optimization...');

    // تحسين الأداء كل 5 دقائق
    setInterval(async () => {
      await this.optimizePerformance();
    }, 5 * 60 * 1000);
  }

  /**
   * تحسين الأداء
   */
  private async optimizePerformance(): Promise<void> {
    console.log('⚡ Optimizing performance...');

    try {
      // تحسين الجلسات
      await this.optimizeSessions();

      // تحسين المقاييس
      await this.optimizeMetrics();

      // تحسين الرؤى
      await this.optimizeInsights();

    } catch (error) {
      console.error('❌ Error optimizing performance:', error);
    }
  }

  /**
   * تحسين الجلسات
   */
  private async optimizeSessions(): Promise<void> {
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // 24 ساعة

    for (const [userId, session] of this.userSessions) {
      if (now - session.lastActivity.getTime() > maxAge) {
        this.userSessions.delete(userId);
        console.log(`🗑️ Removed old session: ${session.sessionId}`);
      }
    }
  }

  /**
   * تحسين المقاييس
   */
  private async optimizeMetrics(): Promise<void> {
    const now = Date.now();
    const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 أيام

    for (const [metricId, metric] of this.uxMetrics) {
      if (now - metric.timestamp.getTime() > maxAge) {
        this.uxMetrics.delete(metricId);
      }
    }
  }

  /**
   * تحسين الرؤى
   */
  private async optimizeInsights(): Promise<void> {
    const now = Date.now();
    const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 يوم

    for (const [insightId, insight] of this.uxInsights) {
      if (now - Date.now() > maxAge) {
        this.uxInsights.delete(insightId);
      }
    }
  }

  /**
   * الحصول على تفضيلات المستخدم
   */
  public getUserPreferences(userId: number): UserPreference | undefined {
    return this.userPreferences.get(userId);
  }

  /**
   * تحديث تفضيلات المستخدم
   */
  public async updateUserPreferences(
    userId: number,
    updates: Partial<UserPreference>
  ): Promise<void> {
    try {
      const preferences = this.userPreferences.get(userId);
      if (!preferences) {
        console.log(`⚠️ Preferences not found for user ${userId}`);
        return;
      }

      Object.assign(preferences, updates);
      preferences.updatedAt = new Date();

      this.monitoringService.logEvent({
        type: 'user_action',
        level: 'info',
        source: 'ux_enhancement',
        message: 'User preferences updated',
        data: { userId, updates }
      });

      console.log(`🎨 User preferences updated: ${userId}`);

    } catch (error) {
      console.error('❌ Error updating user preferences:', error);
    }
  }

  /**
   * الحصول على جلسة المستخدم
   */
  public getUserSession(userId: number): UserSession | undefined {
    return this.userSessions.get(userId);
  }

  /**
   * الحصول على الرؤى
   */
  public getUXInsights(): UXInsight[] {
    return Array.from(this.uxInsights.values());
  }

  /**
   * الحصول على المقاييس
   */
  public getUXMetrics(): UXMetric[] {
    return Array.from(this.uxMetrics.values());
  }

  /**
   * الحصول على إحصائيات شاملة
   */
  public getOverallStats(): any {
    return {
      activeSessions: this.userSessions.size,
      totalMetrics: this.uxMetrics.size,
      totalInsights: this.uxInsights.size,
      averageResponseTime: this.calculateAverageResponseTime(),
      averageSatisfaction: this.calculateAverageSatisfaction(),
      accessibilityUsage: this.calculateAccessibilityUsage()
    };
  }

  /**
   * حساب متوسط وقت الاستجابة
   */
  private calculateAverageResponseTime(): number {
    const sessions = Array.from(this.userSessions.values());
    if (sessions.length === 0) return 0;
    
    const total = sessions.reduce((sum, session) => 
      sum + session.performance.averageResponseTime, 0);
    
    return total / sessions.length;
  }

  /**
   * حساب متوسط الرضا
   */
  private calculateAverageSatisfaction(): number {
    const sessions = Array.from(this.userSessions.values());
    if (sessions.length === 0) return 0;
    
    const total = sessions.reduce((sum, session) => 
      sum + session.performance.satisfactionScore, 0);
    
    return total / sessions.length;
  }

  /**
   * حساب استخدام إمكانية الوصول
   */
  private calculateAccessibilityUsage(): number {
    const sessions = Array.from(this.userSessions.values());
    if (sessions.length === 0) return 0;
    
    const accessibilityUsers = sessions.filter(session => 
      session.preferences.accessibility.highContrast || 
      session.preferences.accessibility.largeText ||
      session.preferences.accessibility.screenReader
    ).length;
    
    return (accessibilityUsers / sessions.length) * 100;
  }

  /**
   * إيقاف نظام تحسين تجربة المستخدم
   */
  public async stop(): Promise<void> {
    if (!this.isActive) return;

    console.log('⏹️ Stopping UX Enhancement System...');

    this.isActive = false;

    this.monitoringService.logEvent({
      type: 'system_event',
      level: 'info',
      source: 'ux_enhancement',
      message: 'UX Enhancement System stopped'
    });

    console.log('✅ UX Enhancement System stopped');
  }
}

// تصدير الدالة لإنشاء الخدمة
export function createUXEnhancementSystem(bot: TelegramBot): UXEnhancementSystem {
  return new UXEnhancementSystem(bot);
}
