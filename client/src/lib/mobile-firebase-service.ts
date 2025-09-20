// Mobile Firebase Integration
// Firebase integration optimized for mobile devices

import { 
  firebaseAnalyticsService,
  firebaseAnalytics,
  COLLECTIONS 
} from '../lib/firebase-analytics';
import { 
  FirestoreUserHistory,
  FirestoreUserSession,
  FirestorePredictiveInsight,
  FirestorePerformanceMetric,
  FirestoreSecurityAlert
} from '../lib/firebase-analytics';

// Mobile-specific Firebase operations
export class MobileFirebaseService {
  private static instance: MobileFirebaseService;
  private isOnline: boolean = navigator.onLine;
  private offlineQueue: any[] = [];

  private constructor() {
    this.setupOfflineDetection();
    this.setupNetworkSync();
  }

  public static getInstance(): MobileFirebaseService {
    if (!MobileFirebaseService.instance) {
      MobileFirebaseService.instance = new MobileFirebaseService();
    }
    return MobileFirebaseService.instance;
  }

  // Setup offline detection
  private setupOfflineDetection() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.syncOfflineQueue();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  // Setup network sync
  private setupNetworkSync() {
    // Sync every 30 seconds when online
    setInterval(() => {
      if (this.isOnline) {
        this.syncOfflineQueue();
      }
    }, 30000);
  }

  // Sync offline queue
  private async syncOfflineQueue() {
    if (this.offlineQueue.length === 0) return;

    try {
      for (const operation of this.offlineQueue) {
        await this.executeOperation(operation);
      }
      this.offlineQueue = [];
    } catch (error) {
      console.error('Failed to sync offline queue:', error);
    }
  }

  // Execute operation
  private async executeOperation(operation: any) {
    switch (operation.type) {
      case 'trackAction':
        await firebaseAnalyticsService.trackUserAction(
          operation.userId,
          operation.action,
          operation.sessionId,
          operation.success
        );
        break;
      case 'saveInsight':
        await firebaseAnalyticsService.savePredictiveInsight(operation.insight);
        break;
      case 'saveMetric':
        await firebaseAnalyticsService.savePerformanceMetric(operation.metric);
        break;
      case 'saveAlert':
        await firebaseAnalyticsService.saveSecurityAlert(operation.alert);
        break;
    }
  }

  // Track user action (with offline support)
  public async trackUserAction(
    userId: string,
    action: {
      type: string;
      category: string;
      description: string;
      target?: string;
      targetType?: string;
      details?: Record<string, any>;
    },
    sessionId?: string,
    success: boolean = true
  ): Promise<void> {
    const operation = {
      type: 'trackAction',
      userId,
      action,
      sessionId,
      success,
      timestamp: Date.now()
    };

    if (this.isOnline) {
      try {
        await firebaseAnalyticsService.trackUserAction(userId, action, sessionId, success);
      } catch (error) {
        this.offlineQueue.push(operation);
        throw error;
      }
    } else {
      this.offlineQueue.push(operation);
    }
  }

  // Save predictive insight (with offline support)
  public async savePredictiveInsight(insight: FirestorePredictiveInsight): Promise<void> {
    const operation = {
      type: 'saveInsight',
      insight,
      timestamp: Date.now()
    };

    if (this.isOnline) {
      try {
        await firebaseAnalyticsService.savePredictiveInsight(insight);
      } catch (error) {
        this.offlineQueue.push(operation);
        throw error;
      }
    } else {
      this.offlineQueue.push(operation);
    }
  }

  // Save performance metric (with offline support)
  public async savePerformanceMetric(metric: FirestorePerformanceMetric): Promise<void> {
    const operation = {
      type: 'saveMetric',
      metric,
      timestamp: Date.now()
    };

    if (this.isOnline) {
      try {
        await firebaseAnalyticsService.savePerformanceMetric(metric);
      } catch (error) {
        this.offlineQueue.push(operation);
        throw error;
      }
    } else {
      this.offlineQueue.push(operation);
    }
  }

  // Save security alert (with offline support)
  public async saveSecurityAlert(alert: FirestoreSecurityAlert): Promise<void> {
    const operation = {
      type: 'saveAlert',
      alert,
      timestamp: Date.now()
    };

    if (this.isOnline) {
      try {
        await firebaseAnalyticsService.saveSecurityAlert(alert);
      } catch (error) {
        this.offlineQueue.push(operation);
        throw error;
      }
    } else {
      this.offlineQueue.push(operation);
    }
  }

  // Get user analytics data (with caching)
  public async getUserAnalyticsData(userId: string, limit: number = 1000): Promise<any[]> {
    const cacheKey = `user_analytics_${userId}_${limit}`;
    
    // Check cache first
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      // Use cache if less than 5 minutes old
      if (Date.now() - timestamp < 5 * 60 * 1000) {
        return data;
      }
    }

    try {
      const data = await firebaseAnalyticsService.getUserAnalyticsData(userId, limit);
      
      // Cache the data
      localStorage.setItem(cacheKey, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
      
      return data;
    } catch (error) {
      // Return cached data if available
      if (cached) {
        const { data } = JSON.parse(cached);
        return data;
      }
      throw error;
    }
  }

  // Get user sessions (with caching)
  public async getUserSessions(userId: string, limit: number = 100): Promise<FirestoreUserSession[]> {
    const cacheKey = `user_sessions_${userId}_${limit}`;
    
    // Check cache first
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      // Use cache if less than 10 minutes old
      if (Date.now() - timestamp < 10 * 60 * 1000) {
        return data;
      }
    }

    try {
      const data = await firebaseAnalyticsService.getUserSessions(userId, limit);
      
      // Cache the data
      localStorage.setItem(cacheKey, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
      
      return data;
    } catch (error) {
      // Return cached data if available
      if (cached) {
        const { data } = JSON.parse(cached);
        return data;
      }
      throw error;
    }
  }

  // Get predictive insights (with caching)
  public async getPredictiveInsights(userId: string, limit: number = 50): Promise<FirestorePredictiveInsight[]> {
    const cacheKey = `predictive_insights_${userId}_${limit}`;
    
    // Check cache first
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      // Use cache if less than 15 minutes old
      if (Date.now() - timestamp < 15 * 60 * 1000) {
        return data;
      }
    }

    try {
      const data = await firebaseAnalyticsService.getPredictiveInsights(userId, limit);
      
      // Cache the data
      localStorage.setItem(cacheKey, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
      
      return data;
    } catch (error) {
      // Return cached data if available
      if (cached) {
        const { data } = JSON.parse(cached);
        return data;
      }
      throw error;
    }
  }

  // Get performance metrics (with caching)
  public async getPerformanceMetrics(userId: string, limit: number = 100): Promise<FirestorePerformanceMetric[]> {
    const cacheKey = `performance_metrics_${userId}_${limit}`;
    
    // Check cache first
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      // Use cache if less than 5 minutes old
      if (Date.now() - timestamp < 5 * 60 * 1000) {
        return data;
      }
    }

    try {
      const data = await firebaseAnalyticsService.getPerformanceMetrics(userId, limit);
      
      // Cache the data
      localStorage.setItem(cacheKey, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
      
      return data;
    } catch (error) {
      // Return cached data if available
      if (cached) {
        const { data } = JSON.parse(cached);
        return data;
      }
      throw error;
    }
  }

  // Get security alerts (with caching)
  public async getSecurityAlerts(userId: string, limit: number = 50): Promise<FirestoreSecurityAlert[]> {
    const cacheKey = `security_alerts_${userId}_${limit}`;
    
    // Check cache first
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      // Use cache if less than 5 minutes old
      if (Date.now() - timestamp < 5 * 60 * 1000) {
        return data;
      }
    }

    try {
      const data = await firebaseAnalyticsService.getSecurityAlerts(userId, limit);
      
      // Cache the data
      localStorage.setItem(cacheKey, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
      
      return data;
    } catch (error) {
      // Return cached data if available
      if (cached) {
        const { data } = JSON.parse(cached);
        return data;
      }
      throw error;
    }
  }

  // Clear cache
  public clearCache(): void {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('user_analytics_') || 
          key.startsWith('user_sessions_') || 
          key.startsWith('predictive_insights_') || 
          key.startsWith('performance_metrics_') || 
          key.startsWith('security_alerts_')) {
        localStorage.removeItem(key);
      }
    });
  }

  // Get cache size
  public getCacheSize(): number {
    let size = 0;
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('user_analytics_') || 
          key.startsWith('user_sessions_') || 
          key.startsWith('predictive_insights_') || 
          key.startsWith('performance_metrics_') || 
          key.startsWith('security_alerts_')) {
        size += localStorage.getItem(key)?.length || 0;
      }
    });
    return size;
  }

  // Get offline queue size
  public getOfflineQueueSize(): number {
    return this.offlineQueue.length;
  }

  // Get network status
  public getNetworkStatus(): { isOnline: boolean; queueSize: number; cacheSize: number } {
    return {
      isOnline: this.isOnline,
      queueSize: this.offlineQueue.length,
      cacheSize: this.getCacheSize()
    };
  }
}

// Export the service instance
export const mobileFirebaseService = MobileFirebaseService.getInstance();

// Export default
export default mobileFirebaseService;