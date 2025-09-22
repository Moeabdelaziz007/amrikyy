// Advanced Analytics Service for AuraOS
// AI-powered analytics with predictive insights and advanced reporting

import {
  firebaseAnalyticsService,
  firebaseAnalytics,
  COLLECTIONS,
  FirestoreUserHistory,
  FirestoreUserSession,
  FirestorePredictiveInsight,
  FirestorePerformanceMetric,
  FirestoreSecurityAlert,
} from './firebase-analytics';
import {
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  updateDoc,
  increment,
  writeBatch,
  Timestamp,
  onSnapshot,
  startAfter,
} from 'firebase/firestore';

// Types for Advanced Analytics
export interface PredictiveInsight {
  id: string;
  userId: string;
  type:
    | 'user_behavior'
    | 'performance'
    | 'engagement'
    | 'retention'
    | 'conversion';
  prediction: string;
  confidence: number; // 0-100
  timeframe: 'short' | 'medium' | 'long'; // 1-7 days, 1-4 weeks, 1-12 months
  factors: string[];
  recommendations: string[];
  createdAt: Date;
  expiresAt: Date;
}

export interface PerformanceMetric {
  id: string;
  userId: string;
  metric: string;
  value: number;
  unit: string;
  trend: 'improving' | 'stable' | 'declining';
  benchmark: number;
  percentile: number; // 0-100
  timestamp: Date;
}

export interface UserBehaviorPattern {
  id: string;
  userId: string;
  pattern: string;
  frequency: number;
  confidence: number;
  triggers: string[];
  outcomes: string[];
  lastSeen: Date;
  createdAt: Date;
}

export interface SecurityAlert {
  id: string;
  userId: string;
  type: 'suspicious_activity' | 'anomaly' | 'security_breach' | 'data_leak';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  details: Record<string, any>;
  timestamp: Date;
  resolved: boolean;
  resolvedAt?: Date;
}

export interface AutomatedReport {
  id: string;
  userId: string;
  type: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  title: string;
  content: string;
  insights: PredictiveInsight[];
  metrics: PerformanceMetric[];
  generatedAt: Date;
  scheduledFor: Date;
}

export interface AnalyticsDashboard {
  userId: string;
  widgets: {
    id: string;
    type: 'chart' | 'metric' | 'insight' | 'alert';
    title: string;
    data: any;
    position: { x: number; y: number; w: number; h: number };
    config: Record<string, any>;
  }[];
  layout: 'grid' | 'custom';
  lastUpdated: Date;
}

/**
 * Advanced Analytics Service
 * Provides AI-powered insights, predictive analytics, and advanced reporting
 */
export class AdvancedAnalyticsService {
  private static aiModelEndpoint =
    process.env.REACT_APP_AI_MODEL_ENDPOINT || '/api/ai/analytics';
  private static predictionCache = new Map<string, PredictiveInsight[]>();
  private static cacheExpiry = 30 * 60 * 1000; // 30 minutes

  /**
   * Generate predictive insights for a user
   */
  static async generatePredictiveInsights(
    userId: string
  ): Promise<PredictiveInsight[]> {
    try {
      // Check cache first
      const cacheKey = `insights_${userId}`;
      const cached = this.predictionCache.get(cacheKey);
      if (cached && this.isCacheValid(cacheKey)) {
        return cached;
      }

      // Get user data for analysis
      const userData = await this.getUserAnalyticsData(userId);

      // Generate insights using AI model
      const insights = await this.runAIAnalysis(userData);

      // Save insights to Firebase
      await this.savePredictiveInsightsToFirebase(userId, insights);

      // Cache results
      this.predictionCache.set(cacheKey, insights);

      // Track insight generation
      firebaseAnalytics.trackEvent('predictive_insights_generated', {
        user_id: userId,
        insights_count: insights.length,
        high_confidence_count: insights.filter(i => i.confidence > 80).length,
      });

      return insights;
    } catch (error) {
      console.error('Failed to generate predictive insights:', error);
      firebaseAnalytics.trackError(
        error as Error,
        'predictive_insights_generation'
      );
      throw error;
    }
  }

  /**
   * Analyze user behavior patterns
   */
  static async analyzeBehaviorPatterns(
    userId: string
  ): Promise<UserBehaviorPattern[]> {
    try {
      const userHistory = await this.getUserHistoryData(userId);
      const patterns = this.identifyBehaviorPatterns(userHistory);

      // Save patterns to database
      await this.saveBehaviorPatterns(userId, patterns);

      return patterns;
    } catch (error) {
      console.error('Failed to analyze behavior patterns:', error);
      throw error;
    }
  }

  /**
   * Monitor performance metrics
   */
  static async monitorPerformanceMetrics(
    userId: string
  ): Promise<PerformanceMetric[]> {
    try {
      const metrics = await this.collectPerformanceMetrics(userId);

      // Analyze trends
      const analyzedMetrics = await this.analyzePerformanceTrends(
        userId,
        metrics
      );

      // Save metrics
      await this.savePerformanceMetrics(userId, analyzedMetrics);

      return analyzedMetrics;
    } catch (error) {
      console.error('Failed to monitor performance metrics:', error);
      throw error;
    }
  }

  /**
   * Detect security anomalies
   */
  static async detectSecurityAnomalies(
    userId: string
  ): Promise<SecurityAlert[]> {
    try {
      const userActivity = await this.getUserActivityData(userId);
      const anomalies = this.identifySecurityAnomalies(userActivity);

      // Create security alerts
      const alerts = await this.createSecurityAlerts(userId, anomalies);

      return alerts;
    } catch (error) {
      console.error('Failed to detect security anomalies:', error);
      throw error;
    }
  }

  /**
   * Generate automated reports
   */
  static async generateAutomatedReport(
    userId: string,
    reportType: 'daily' | 'weekly' | 'monthly' | 'quarterly'
  ): Promise<AutomatedReport> {
    try {
      const reportData = await this.collectReportData(userId, reportType);
      const insights = await this.generatePredictiveInsights(userId);
      const metrics = await this.monitorPerformanceMetrics(userId);

      const report: AutomatedReport = {
        id: this.generateReportId(),
        userId,
        type: reportType,
        title: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Analytics Report`,
        content: await this.generateReportContent(
          reportData,
          insights,
          metrics
        ),
        insights,
        metrics,
        generatedAt: new Date(),
        scheduledFor: this.getNextScheduledTime(reportType),
      };

      // Save report
      await this.saveAutomatedReport(report);

      return report;
    } catch (error) {
      console.error('Failed to generate automated report:', error);
      throw error;
    }
  }

  /**
   * Create custom analytics dashboard
   */
  static async createAnalyticsDashboard(
    userId: string,
    widgets: any[]
  ): Promise<AnalyticsDashboard> {
    try {
      const dashboard: AnalyticsDashboard = {
        userId,
        widgets,
        layout: 'custom',
        lastUpdated: new Date(),
      };

      // Save dashboard
      await setDoc(doc(db, 'analytics_dashboards', userId), {
        ...dashboard,
        lastUpdated: Timestamp.fromDate(dashboard.lastUpdated),
      });

      return dashboard;
    } catch (error) {
      console.error('Failed to create analytics dashboard:', error);
      throw error;
    }
  }

  /**
   * Get real-time analytics data
   */
  static async getRealTimeAnalytics(userId: string): Promise<any> {
    try {
      const [insights, metrics, alerts, patterns] = await Promise.all([
        this.getLatestInsights(userId),
        this.getLatestMetrics(userId),
        this.getActiveAlerts(userId),
        this.getLatestPatterns(userId),
      ]);

      return {
        insights,
        metrics,
        alerts,
        patterns,
        timestamp: new Date(),
      };
    } catch (error) {
      console.error('Failed to get real-time analytics:', error);
      throw error;
    }
  }

  /**
   * Set up automated monitoring
   */
  static async setupAutomatedMonitoring(userId: string): Promise<void> {
    try {
      // Set up periodic insight generation
      setInterval(
        async () => {
          try {
            await this.generatePredictiveInsights(userId);
          } catch (error) {
            console.error('Failed to generate periodic insights:', error);
          }
        },
        24 * 60 * 60 * 1000
      ); // Daily

      // Set up performance monitoring
      setInterval(
        async () => {
          try {
            await this.monitorPerformanceMetrics(userId);
          } catch (error) {
            console.error('Failed to monitor performance:', error);
          }
        },
        60 * 60 * 1000
      ); // Hourly

      // Set up security monitoring
      setInterval(
        async () => {
          try {
            await this.detectSecurityAnomalies(userId);
          } catch (error) {
            console.error('Failed to detect security anomalies:', error);
          }
        },
        15 * 60 * 1000
      ); // Every 15 minutes

      console.log('Automated monitoring setup completed');
    } catch (error) {
      console.error('Failed to setup automated monitoring:', error);
      throw error;
    }
  }

  // Private helper methods

  private static async getUserAnalyticsData(userId: string): Promise<any> {
    // Collect comprehensive user data for AI analysis
    const [history, sessions, interactions] = await Promise.all([
      this.getUserHistoryData(userId),
      this.getUserSessionsData(userId),
      this.getUserInteractionsData(userId),
    ]);

    return {
      history,
      sessions,
      interactions,
      timestamp: new Date(),
    };
  }

  private static async getUserHistoryData(userId: string): Promise<any[]> {
    try {
      return await firebaseAnalyticsService.getUserAnalyticsData(userId, 1000);
    } catch (error) {
      console.error('Failed to get user history data:', error);
      firebaseAnalytics.trackError(error as Error, 'user_history_retrieval');
      return [];
    }
  }

  private static async getUserSessionsData(userId: string): Promise<any[]> {
    try {
      return await firebaseAnalyticsService.getUserSessions(userId, 100);
    } catch (error) {
      console.error('Failed to get user sessions data:', error);
      firebaseAnalytics.trackError(error as Error, 'user_sessions_retrieval');
      return [];
    }
  }

  private static async getUserInteractionsData(userId: string): Promise<any[]> {
    const q = query(
      collection(db, 'user_interactions'),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(500)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp.toDate(),
    }));
  }

  private static async getUserActivityData(userId: string): Promise<any[]> {
    const q = query(
      collection(db, 'user_activity'),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(200)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp.toDate(),
    }));
  }

  private static async runAIAnalysis(
    userData: any
  ): Promise<PredictiveInsight[]> {
    try {
      // In a real implementation, this would call an AI/ML service
      // For now, we'll generate mock insights based on patterns
      const insights: PredictiveInsight[] = [];

      // Analyze user engagement patterns
      const engagementInsight = this.generateEngagementInsight(userData);
      if (engagementInsight) insights.push(engagementInsight);

      // Analyze performance patterns
      const performanceInsight = this.generatePerformanceInsight(userData);
      if (performanceInsight) insights.push(performanceInsight);

      // Analyze retention patterns
      const retentionInsight = this.generateRetentionInsight(userData);
      if (retentionInsight) insights.push(retentionInsight);

      return insights;
    } catch (error) {
      console.error('AI analysis failed:', error);
      return [];
    }
  }

  private static generateEngagementInsight(
    userData: any
  ): PredictiveInsight | null {
    const sessions = userData.sessions;
    if (sessions.length < 5) return null;

    const avgSessionDuration =
      sessions.reduce((sum: number, s: any) => sum + (s.duration || 0), 0) /
      sessions.length;

    const recentSessions = sessions.slice(0, 5);
    const recentAvgDuration =
      recentSessions.reduce(
        (sum: number, s: any) => sum + (s.duration || 0),
        0
      ) / recentSessions.length;

    const trend =
      recentAvgDuration > avgSessionDuration ? 'increasing' : 'decreasing';
    const confidence = Math.min(
      85,
      Math.max(
        60,
        (Math.abs(recentAvgDuration - avgSessionDuration) /
          avgSessionDuration) *
          100
      )
    );

    return {
      id: this.generateInsightId(),
      userId: userData.userId,
      type: 'engagement',
      prediction: `User engagement is ${trend}. Expected session duration will be ${trend === 'increasing' ? 'longer' : 'shorter'} in the next week.`,
      confidence: Math.round(confidence),
      timeframe: 'short',
      factors: ['session_duration', 'user_activity', 'feature_usage'],
      recommendations: [
        trend === 'increasing'
          ? 'Consider adding more engaging features'
          : 'Investigate potential usability issues',
        'Monitor user feedback for engagement insights',
        'A/B test new features to maintain engagement',
      ],
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    };
  }

  private static generatePerformanceInsight(
    userData: any
  ): PredictiveInsight | null {
    const history = userData.history;
    const errorCount = history.filter((h: any) => !h.success).length;
    const errorRate = (errorCount / history.length) * 100;

    if (errorRate > 5) {
      return {
        id: this.generateInsightId(),
        userId: userData.userId,
        type: 'performance',
        prediction: `High error rate detected (${errorRate.toFixed(1)}%). Performance issues may increase user frustration.`,
        confidence: Math.min(95, Math.max(70, errorRate * 10)),
        timeframe: 'short',
        factors: ['error_rate', 'user_feedback', 'system_performance'],
        recommendations: [
          'Investigate and fix common error sources',
          'Implement better error handling and user feedback',
          'Monitor system performance metrics',
        ],
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
      };
    }

    return null;
  }

  private static generateRetentionInsight(
    userData: any
  ): PredictiveInsight | null {
    const sessions = userData.sessions;
    if (sessions.length < 10) return null;

    const recentSessions = sessions.slice(0, 5);
    const olderSessions = sessions.slice(5, 10);

    const recentFrequency = recentSessions.length / 7; // sessions per day
    const olderFrequency = olderSessions.length / 7;

    const retentionTrend =
      recentFrequency > olderFrequency ? 'improving' : 'declining';
    const confidence = Math.min(
      90,
      Math.max(65, Math.abs(recentFrequency - olderFrequency) * 20)
    );

    return {
      id: this.generateInsightId(),
      userId: userData.userId,
      type: 'retention',
      prediction: `User retention is ${retentionTrend}. Expected to ${retentionTrend === 'improving' ? 'maintain' : 'lose'} engagement in the next month.`,
      confidence: Math.round(confidence),
      timeframe: 'medium',
      factors: ['session_frequency', 'feature_adoption', 'user_satisfaction'],
      recommendations: [
        retentionTrend === 'improving'
          ? 'Continue current engagement strategies'
          : 'Implement retention campaigns',
        'Send personalized recommendations based on user behavior',
        'Monitor user satisfaction metrics',
      ],
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    };
  }

  private static identifyBehaviorPatterns(
    history: any[]
  ): UserBehaviorPattern[] {
    const patterns: UserBehaviorPattern[] = [];

    // Analyze time-based patterns
    const hourlyActivity = this.analyzeHourlyActivity(history);
    if (hourlyActivity.confidence > 70) {
      patterns.push({
        id: this.generatePatternId(),
        userId: history[0]?.userId || 'unknown',
        pattern: `Peak activity between ${hourlyActivity.peakStart}-${hourlyActivity.peakEnd}`,
        frequency: hourlyActivity.frequency,
        confidence: hourlyActivity.confidence,
        triggers: ['time_of_day', 'user_schedule'],
        outcomes: ['high_engagement', 'feature_usage'],
        lastSeen: new Date(),
        createdAt: new Date(),
      });
    }

    // Analyze feature usage patterns
    const featurePatterns = this.analyzeFeatureUsage(history);
    patterns.push(...featurePatterns);

    return patterns;
  }

  private static analyzeHourlyActivity(history: any[]): any {
    const hourlyCounts: number[] = new Array(24).fill(0);

    history.forEach(action => {
      const hour = new Date(action.timestamp).getHours();
      hourlyCounts[hour]++;
    });

    const maxCount = Math.max(...hourlyCounts);
    const peakHour = hourlyCounts.indexOf(maxCount);

    return {
      peakStart: peakHour,
      peakEnd: peakHour + 2,
      frequency: maxCount,
      confidence: Math.min(95, (maxCount / history.length) * 100),
    };
  }

  private static analyzeFeatureUsage(history: any[]): UserBehaviorPattern[] {
    const featureCounts: Record<string, number> = {};

    history.forEach(action => {
      const feature = action.action?.category || 'unknown';
      featureCounts[feature] = (featureCounts[feature] || 0) + 1;
    });

    const patterns: UserBehaviorPattern[] = [];
    Object.entries(featureCounts).forEach(([feature, count]) => {
      if (count > 10) {
        // Only significant patterns
        patterns.push({
          id: this.generatePatternId(),
          userId: history[0]?.userId || 'unknown',
          pattern: `Frequent use of ${feature} features`,
          frequency: count,
          confidence: Math.min(90, (count / history.length) * 100),
          triggers: ['user_preference', 'feature_value'],
          outcomes: ['high_engagement', 'feature_mastery'],
          lastSeen: new Date(),
          createdAt: new Date(),
        });
      }
    });

    return patterns;
  }

  private static async collectPerformanceMetrics(
    userId: string
  ): Promise<PerformanceMetric[]> {
    const metrics: PerformanceMetric[] = [];

    // Get user performance data
    const userData = await this.getUserAnalyticsData(userId);

    // Calculate various performance metrics
    const sessionDuration = this.calculateAverageSessionDuration(
      userData.sessions
    );
    const errorRate = this.calculateErrorRate(userData.history);
    const engagementScore = this.calculateEngagementScore(userData);
    const featureAdoption = this.calculateFeatureAdoption(userData.history);

    metrics.push(
      {
        id: this.generateMetricId(),
        userId,
        metric: 'session_duration',
        value: sessionDuration,
        unit: 'minutes',
        trend: 'stable',
        benchmark: 15, // 15 minutes benchmark
        percentile: Math.min(100, (sessionDuration / 15) * 100),
        timestamp: new Date(),
      },
      {
        id: this.generateMetricId(),
        userId,
        metric: 'error_rate',
        value: errorRate,
        unit: 'percentage',
        trend: errorRate < 2 ? 'improving' : 'declining',
        benchmark: 2, // 2% benchmark
        percentile: Math.max(0, 100 - (errorRate / 2) * 100),
        timestamp: new Date(),
      },
      {
        id: this.generateMetricId(),
        userId,
        metric: 'engagement_score',
        value: engagementScore,
        unit: 'score',
        trend: 'stable',
        benchmark: 70, // 70/100 benchmark
        percentile: Math.min(100, (engagementScore / 70) * 100),
        timestamp: new Date(),
      },
      {
        id: this.generateMetricId(),
        userId,
        metric: 'feature_adoption',
        value: featureAdoption,
        unit: 'features',
        trend: 'stable',
        benchmark: 5, // 5 features benchmark
        percentile: Math.min(100, (featureAdoption / 5) * 100),
        timestamp: new Date(),
      }
    );

    return metrics;
  }

  private static calculateAverageSessionDuration(sessions: any[]): number {
    const sessionsWithDuration = sessions.filter(s => s.duration);
    if (sessionsWithDuration.length === 0) return 0;

    const totalDuration = sessionsWithDuration.reduce(
      (sum, session) => sum + (session.duration || 0),
      0
    );

    return totalDuration / sessionsWithDuration.length / (1000 * 60); // Convert to minutes
  }

  private static calculateErrorRate(history: any[]): number {
    const errorCount = history.filter(action => !action.success).length;
    return (errorCount / history.length) * 100;
  }

  private static calculateEngagementScore(userData: any): number {
    const sessions = userData.sessions;
    const history = userData.history;

    if (sessions.length === 0) return 0;

    const avgSessionDuration = this.calculateAverageSessionDuration(sessions);
    const actionFrequency = history.length / sessions.length;
    const featureDiversity = new Set(history.map(h => h.action?.category)).size;

    // Calculate composite engagement score (0-100)
    const durationScore = Math.min(30, (avgSessionDuration / 30) * 30);
    const frequencyScore = Math.min(30, (actionFrequency / 20) * 30);
    const diversityScore = Math.min(40, (featureDiversity / 10) * 40);

    return Math.round(durationScore + frequencyScore + diversityScore);
  }

  private static calculateFeatureAdoption(history: any[]): number {
    const uniqueFeatures = new Set(history.map(h => h.action?.category));
    return uniqueFeatures.size;
  }

  private static identifySecurityAnomalies(activity: any[]): any[] {
    const anomalies: any[] = [];

    // Detect unusual activity patterns
    const recentActivity = activity.slice(0, 10);
    const olderActivity = activity.slice(10, 20);

    if (recentActivity.length > 0 && olderActivity.length > 0) {
      const recentFrequency = recentActivity.length / 24; // activities per hour
      const olderFrequency = olderActivity.length / 24;

      if (recentFrequency > olderFrequency * 3) {
        // 3x increase
        anomalies.push({
          type: 'suspicious_activity',
          severity: 'medium',
          description: 'Unusual increase in user activity detected',
          details: {
            recentFrequency,
            olderFrequency,
            increaseFactor: recentFrequency / olderFrequency,
          },
        });
      }
    }

    // Detect error spikes
    const errorCount = activity.filter(a => !a.success).length;
    const errorRate = (errorCount / activity.length) * 100;

    if (errorRate > 20) {
      // More than 20% errors
      anomalies.push({
        type: 'anomaly',
        severity: 'high',
        description: 'High error rate detected',
        details: {
          errorRate,
          errorCount,
          totalActivities: activity.length,
        },
      });
    }

    return anomalies;
  }

  private static async createSecurityAlerts(
    userId: string,
    anomalies: any[]
  ): Promise<SecurityAlert[]> {
    const alerts: SecurityAlert[] = [];

    anomalies.forEach(anomaly => {
      alerts.push({
        id: this.generateAlertId(),
        userId,
        type: anomaly.type,
        severity: anomaly.severity,
        description: anomaly.description,
        details: anomaly.details,
        timestamp: new Date(),
        resolved: false,
      });
    });

    // Save alerts to database
    if (alerts.length > 0) {
      const batch = writeBatch(db);
      alerts.forEach(alert => {
        const docRef = doc(collection(db, 'security_alerts'));
        batch.set(docRef, {
          ...alert,
          timestamp: Timestamp.fromDate(alert.timestamp),
        });
      });
      await batch.commit();
    }

    return alerts;
  }

  private static async collectReportData(
    userId: string,
    reportType: string
  ): Promise<any> {
    const now = new Date();
    const startDate = this.getReportStartDate(now, reportType);

    const [history, sessions, insights, metrics] = await Promise.all([
      this.getUserHistoryData(userId),
      this.getUserSessionsData(userId),
      this.getLatestInsights(userId),
      this.getLatestMetrics(userId),
    ]);

    return {
      userId,
      reportType,
      period: { start: startDate, end: now },
      history: history.filter(h => h.timestamp >= startDate),
      sessions: sessions.filter(s => s.startTime >= startDate),
      insights,
      metrics,
    };
  }

  private static getReportStartDate(now: Date, reportType: string): Date {
    const start = new Date(now);

    switch (reportType) {
      case 'daily':
        start.setDate(start.getDate() - 1);
        break;
      case 'weekly':
        start.setDate(start.getDate() - 7);
        break;
      case 'monthly':
        start.setMonth(start.getMonth() - 1);
        break;
      case 'quarterly':
        start.setMonth(start.getMonth() - 3);
        break;
    }

    return start;
  }

  private static async generateReportContent(
    reportData: any,
    insights: PredictiveInsight[],
    metrics: PerformanceMetric[]
  ): Promise<string> {
    const { reportType, history, sessions } = reportData;

    let content = `# ${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Analytics Report\n\n`;

    // Summary
    content += `## Summary\n`;
    content += `- Total Actions: ${history.length}\n`;
    content += `- Total Sessions: ${sessions.length}\n`;
    content += `- Average Session Duration: ${this.calculateAverageSessionDuration(sessions).toFixed(1)} minutes\n`;
    content += `- Key Insights: ${insights.length}\n\n`;

    // Insights
    if (insights.length > 0) {
      content += `## Predictive Insights\n`;
      insights.forEach(insight => {
        content += `### ${insight.type.replace('_', ' ').toUpperCase()}\n`;
        content += `**Prediction:** ${insight.prediction}\n`;
        content += `**Confidence:** ${insight.confidence}%\n`;
        content += `**Recommendations:**\n`;
        insight.recommendations.forEach(rec => {
          content += `- ${rec}\n`;
        });
        content += `\n`;
      });
    }

    // Metrics
    if (metrics.length > 0) {
      content += `## Performance Metrics\n`;
      metrics.forEach(metric => {
        content += `### ${metric.metric.replace('_', ' ').toUpperCase()}\n`;
        content += `**Value:** ${metric.value} ${metric.unit}\n`;
        content += `**Trend:** ${metric.trend}\n`;
        content += `**Percentile:** ${metric.percentile.toFixed(1)}%\n\n`;
      });
    }

    return content;
  }

  private static getNextScheduledTime(reportType: string): Date {
    const now = new Date();

    switch (reportType) {
      case 'daily':
        return new Date(now.getTime() + 24 * 60 * 60 * 1000);
      case 'weekly':
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      case 'monthly':
        return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      case 'quarterly':
        return new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
      default:
        return new Date(now.getTime() + 24 * 60 * 60 * 1000);
    }
  }

  // Firebase operations
  private static async savePredictiveInsightsToFirebase(
    userId: string,
    insights: PredictiveInsight[]
  ): Promise<void> {
    try {
      for (const insight of insights) {
        const firestoreInsight: FirestorePredictiveInsight = {
          id: insight.id,
          userId: insight.userId,
          type: insight.type,
          prediction: insight.prediction,
          confidence: insight.confidence,
          timeframe: insight.timeframe,
          factors: insight.factors,
          recommendations: insight.recommendations,
          createdAt: insight.createdAt,
          expiresAt: insight.expiresAt,
        };

        await firebaseAnalyticsService.savePredictiveInsight(firestoreInsight);
      }
    } catch (error) {
      console.error('Failed to save predictive insights to Firebase:', error);
      firebaseAnalytics.trackError(error as Error, 'firebase_insights_saving');
      throw error;
    }
  }

  // Database operations (legacy - keeping for compatibility)
  private static async savePredictiveInsights(
    userId: string,
    insights: PredictiveInsight[]
  ): Promise<void> {
    await this.savePredictiveInsightsToFirebase(userId, insights);
  }

  private static async saveBehaviorPatterns(
    userId: string,
    patterns: UserBehaviorPattern[]
  ): Promise<void> {
    const batch = writeBatch(db);

    patterns.forEach(pattern => {
      const docRef = doc(collection(db, 'behavior_patterns'));
      batch.set(docRef, {
        ...pattern,
        lastSeen: Timestamp.fromDate(pattern.lastSeen),
        createdAt: Timestamp.fromDate(pattern.createdAt),
      });
    });

    await batch.commit();
  }

  private static async savePerformanceMetrics(
    userId: string,
    metrics: PerformanceMetric[]
  ): Promise<void> {
    const batch = writeBatch(db);

    metrics.forEach(metric => {
      const docRef = doc(collection(db, 'performance_metrics'));
      batch.set(docRef, {
        ...metric,
        timestamp: Timestamp.fromDate(metric.timestamp),
      });
    });

    await batch.commit();
  }

  private static async saveAutomatedReport(
    report: AutomatedReport
  ): Promise<void> {
    await setDoc(doc(db, 'automated_reports', report.id), {
      ...report,
      generatedAt: Timestamp.fromDate(report.generatedAt),
      scheduledFor: Timestamp.fromDate(report.scheduledFor),
    });
  }

  // Getter methods
  private static async getLatestInsights(
    userId: string
  ): Promise<PredictiveInsight[]> {
    const q = query(
      collection(db, 'predictive_insights'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(10)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      expiresAt: doc.data().expiresAt.toDate(),
    })) as PredictiveInsight[];
  }

  private static async getLatestMetrics(
    userId: string
  ): Promise<PerformanceMetric[]> {
    const q = query(
      collection(db, 'performance_metrics'),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(20)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp.toDate(),
    })) as PerformanceMetric[];
  }

  private static async getActiveAlerts(
    userId: string
  ): Promise<SecurityAlert[]> {
    const q = query(
      collection(db, 'security_alerts'),
      where('userId', '==', userId),
      where('resolved', '==', false),
      orderBy('timestamp', 'desc'),
      limit(10)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp.toDate(),
      resolvedAt: doc.data().resolvedAt?.toDate(),
    })) as SecurityAlert[];
  }

  private static async getLatestPatterns(
    userId: string
  ): Promise<UserBehaviorPattern[]> {
    const q = query(
      collection(db, 'behavior_patterns'),
      where('userId', '==', userId),
      orderBy('lastSeen', 'desc'),
      limit(10)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      lastSeen: doc.data().lastSeen.toDate(),
      createdAt: doc.data().createdAt.toDate(),
    })) as UserBehaviorPattern[];
  }

  // Utility methods
  private static generateInsightId(): string {
    return `insight_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private static generatePatternId(): string {
    return `pattern_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private static generateMetricId(): string {
    return `metric_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private static generateAlertId(): string {
    return `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private static generateReportId(): string {
    return `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private static isCacheValid(cacheKey: string): boolean {
    // Simple cache validation - in production, you'd want more sophisticated caching
    return true;
  }
}

export default AdvancedAnalyticsService;
