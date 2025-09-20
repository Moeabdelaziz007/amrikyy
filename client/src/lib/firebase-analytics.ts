// Firebase Integration for Advanced Analytics
// Complete Firebase setup and integration for the analytics system

import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  connectFirestoreEmulator,
  enableNetwork,
  disableNetwork 
} from 'firebase/firestore';
import { 
  getAuth, 
  connectAuthEmulator,
  signInAnonymously,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { 
  getStorage, 
  connectStorageEmulator 
} from 'firebase/storage';
import { 
  getFunctions, 
  connectFunctionsEmulator 
} from 'firebase/functions';
import { 
  getAnalytics, 
  logEvent,
  setUserId,
  setUserProperties,
  setCurrentScreen
} from 'firebase/analytics';

// Firebase Configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "your-api-key",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "your-project.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "your-project-id",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "your-project.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "your-app-id",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-XXXXXXXXXX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

// Development mode setup
if (process.env.NODE_ENV === 'development') {
  // Connect to Firebase emulators
  try {
    connectFirestoreEmulator(db, 'localhost', 8080);
    connectAuthEmulator(auth, 'http://localhost:9099');
    connectStorageEmulator(storage, 'localhost', 9199);
    connectFunctionsEmulator(functions, 'localhost', 5001);
  } catch (error) {
    console.log('Firebase emulators already connected or not available');
  }
}

// Firebase Analytics Integration
export class FirebaseAnalyticsIntegration {
  private static instance: FirebaseAnalyticsIntegration;
  private currentUser: User | null = null;

  private constructor() {
    this.setupAuthListener();
  }

  public static getInstance(): FirebaseAnalyticsIntegration {
    if (!FirebaseAnalyticsIntegration.instance) {
      FirebaseAnalyticsIntegration.instance = new FirebaseAnalyticsIntegration();
    }
    return FirebaseAnalyticsIntegration.instance;
  }

  private setupAuthListener() {
    onAuthStateChanged(auth, (user) => {
      this.currentUser = user;
      if (user && analytics) {
        setUserId(analytics, user.uid);
        setUserProperties(analytics, {
          user_type: user.isAnonymous ? 'anonymous' : 'authenticated',
          login_method: user.providerData[0]?.providerId || 'unknown'
        });
      }
    });
  }

  // Track custom events
  public trackEvent(eventName: string, parameters?: Record<string, any>) {
    if (analytics) {
      logEvent(analytics, eventName, {
        ...parameters,
        timestamp: Date.now(),
        user_id: this.currentUser?.uid || 'anonymous'
      });
    }
  }

  // Track page views
  public trackPageView(pageName: string, pageTitle?: string) {
    if (analytics) {
      setCurrentScreen(analytics, pageName);
      logEvent(analytics, 'page_view', {
        page_name: pageName,
        page_title: pageTitle || pageName,
        timestamp: Date.now()
      });
    }
  }

  // Track user interactions
  public trackUserInteraction(action: string, target: string, details?: Record<string, any>) {
    this.trackEvent('user_interaction', {
      action,
      target,
      ...details
    });
  }

  // Track performance metrics
  public trackPerformance(metricName: string, value: number, unit?: string) {
    this.trackEvent('performance_metric', {
      metric_name: metricName,
      value,
      unit: unit || 'count',
      timestamp: Date.now()
    });
  }

  // Track errors
  public trackError(error: Error, context?: string) {
    this.trackEvent('error_occurred', {
      error_message: error.message,
      error_stack: error.stack,
      context: context || 'unknown',
      timestamp: Date.now()
    });
  }
}

// Firestore Collections Configuration
export const COLLECTIONS = {
  USER_HISTORY: 'user_history',
  USER_SESSIONS: 'user_sessions',
  USER_ANALYTICS: 'user_analytics',
  PREDICTIVE_INSIGHTS: 'predictive_insights',
  PERFORMANCE_METRICS: 'performance_metrics',
  SECURITY_ALERTS: 'security_alerts',
  BEHAVIOR_PATTERNS: 'behavior_patterns',
  AUTOMATED_REPORTS: 'automated_reports',
  ANALYTICS_DASHBOARDS: 'analytics_dashboards',
  USER_INTERACTIONS: 'user_interactions',
  SYSTEM_EVENTS: 'system_events',
  ERROR_LOGS: 'error_logs'
} as const;

// Firestore Types
export interface FirestoreUserHistory {
  id: string;
  userId: string;
  action: {
    type: string;
    category: string;
    description: string;
    target?: string;
    targetType?: string;
    details?: Record<string, any>;
  };
  timestamp: Date;
  sessionId: string;
  metadata?: Record<string, any>;
  success: boolean;
  errorMessage?: string;
  duration?: number;
}

export interface FirestoreUserSession {
  id: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  deviceInfo: {
    userAgent: string;
    platform: string;
    language: string;
    timezone: string;
    screenResolution: string;
    viewport: string;
  };
  location?: {
    country: string;
    region: string;
    city: string;
  };
  actions: number;
  lastActivity: Date;
  isActive: boolean;
}

export interface FirestorePredictiveInsight {
  id: string;
  userId: string;
  type: 'user_behavior' | 'performance' | 'engagement' | 'retention' | 'conversion';
  prediction: string;
  confidence: number;
  timeframe: 'short' | 'medium' | 'long';
  factors: string[];
  recommendations: string[];
  createdAt: Date;
  expiresAt: Date;
}

export interface FirestorePerformanceMetric {
  id: string;
  userId: string;
  metric: string;
  value: number;
  unit: string;
  trend: 'improving' | 'stable' | 'declining';
  benchmark: number;
  percentile: number;
  timestamp: Date;
}

export interface FirestoreSecurityAlert {
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

// Firebase Service Class
export class FirebaseAnalyticsService {
  private static instance: FirebaseAnalyticsService;
  private analyticsIntegration: FirebaseAnalyticsIntegration;

  private constructor() {
    this.analyticsIntegration = FirebaseAnalyticsIntegration.getInstance();
  }

  public static getInstance(): FirebaseAnalyticsService {
    if (!FirebaseAnalyticsService.instance) {
      FirebaseAnalyticsService.instance = new FirebaseAnalyticsService();
    }
    return FirebaseAnalyticsService.instance;
  }

  // Initialize analytics for a user
  public async initializeUserAnalytics(userId: string): Promise<void> {
    try {
      // Track initialization event
      this.analyticsIntegration.trackEvent('analytics_initialized', {
        user_id: userId,
        timestamp: Date.now()
      });

      // Create initial user session
      await this.createUserSession(userId);
      
      console.log('User analytics initialized successfully');
    } catch (error) {
      console.error('Failed to initialize user analytics:', error);
      this.analyticsIntegration.trackError(error as Error, 'analytics_initialization');
      throw error;
    }
  }

  // Create a new user session
  public async createUserSession(userId: string): Promise<string> {
    try {
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const sessionData: FirestoreUserSession = {
        id: sessionId,
        userId,
        startTime: new Date(),
        deviceInfo: this.getDeviceInfo(),
        location: await this.getLocationInfo(),
        actions: 0,
        lastActivity: new Date(),
        isActive: true
      };

      // Save to Firestore
      await this.saveToFirestore(COLLECTIONS.USER_SESSIONS, sessionId, sessionData);
      
      // Track session creation
      this.analyticsIntegration.trackEvent('session_created', {
        session_id: sessionId,
        user_id: userId
      });

      return sessionId;
    } catch (error) {
      console.error('Failed to create user session:', error);
      this.analyticsIntegration.trackError(error as Error, 'session_creation');
      throw error;
    }
  }

  // Track user action
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
    success: boolean = true,
    errorMessage?: string
  ): Promise<void> {
    try {
      const historyId = `history_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const historyData: FirestoreUserHistory = {
        id: historyId,
        userId,
        action,
        timestamp: new Date(),
        sessionId: sessionId || 'unknown',
        success,
        errorMessage
      };

      // Save to Firestore
      await this.saveToFirestore(COLLECTIONS.USER_HISTORY, historyId, historyData);
      
      // Track in Firebase Analytics
      this.analyticsIntegration.trackUserInteraction(action.type, action.target || 'unknown', {
        category: action.category,
        success,
        session_id: sessionId
      });

      // Update session activity
      if (sessionId) {
        await this.updateSessionActivity(sessionId);
      }
    } catch (error) {
      console.error('Failed to track user action:', error);
      this.analyticsIntegration.trackError(error as Error, 'action_tracking');
    }
  }

  // Save predictive insight
  public async savePredictiveInsight(insight: FirestorePredictiveInsight): Promise<void> {
    try {
      await this.saveToFirestore(COLLECTIONS.PREDICTIVE_INSIGHTS, insight.id, insight);
      
      // Track insight generation
      this.analyticsIntegration.trackEvent('predictive_insight_generated', {
        insight_type: insight.type,
        confidence: insight.confidence,
        user_id: insight.userId
      });
    } catch (error) {
      console.error('Failed to save predictive insight:', error);
      this.analyticsIntegration.trackError(error as Error, 'insight_saving');
    }
  }

  // Save performance metric
  public async savePerformanceMetric(metric: FirestorePerformanceMetric): Promise<void> {
    try {
      await this.saveToFirestore(COLLECTIONS.PERFORMANCE_METRICS, metric.id, metric);
      
      // Track performance metric
      this.analyticsIntegration.trackPerformance(metric.metric, metric.value, metric.unit);
    } catch (error) {
      console.error('Failed to save performance metric:', error);
      this.analyticsIntegration.trackError(error as Error, 'metric_saving');
    }
  }

  // Save security alert
  public async saveSecurityAlert(alert: FirestoreSecurityAlert): Promise<void> {
    try {
      await this.saveToFirestore(COLLECTIONS.SECURITY_ALERTS, alert.id, alert);
      
      // Track security alert
      this.analyticsIntegration.trackEvent('security_alert_created', {
        alert_type: alert.type,
        severity: alert.severity,
        user_id: alert.userId
      });
    } catch (error) {
      console.error('Failed to save security alert:', error);
      this.analyticsIntegration.trackError(error as Error, 'alert_saving');
    }
  }

  // Get user analytics data
  public async getUserAnalyticsData(userId: string, limit: number = 1000): Promise<any[]> {
    try {
      const { getDocs, query, collection, where, orderBy, limit: limitQuery } = await import('firebase/firestore');
      
      const q = query(
        collection(db, COLLECTIONS.USER_HISTORY),
        where('userId', '==', userId),
        orderBy('timestamp', 'desc'),
        limitQuery(limit)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp.toDate()
      }));
    } catch (error) {
      console.error('Failed to get user analytics data:', error);
      this.analyticsIntegration.trackError(error as Error, 'data_retrieval');
      return [];
    }
  }

  // Get user sessions
  public async getUserSessions(userId: string, limit: number = 100): Promise<FirestoreUserSession[]> {
    try {
      const { getDocs, query, collection, where, orderBy, limit: limitQuery } = await import('firebase/firestore');
      
      const q = query(
        collection(db, COLLECTIONS.USER_SESSIONS),
        where('userId', '==', userId),
        orderBy('startTime', 'desc'),
        limitQuery(limit)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        startTime: doc.data().startTime.toDate(),
        endTime: doc.data().endTime?.toDate(),
        lastActivity: doc.data().lastActivity.toDate()
      })) as FirestoreUserSession[];
    } catch (error) {
      console.error('Failed to get user sessions:', error);
      this.analyticsIntegration.trackError(error as Error, 'sessions_retrieval');
      return [];
    }
  }

  // Get predictive insights
  public async getPredictiveInsights(userId: string, limit: number = 50): Promise<FirestorePredictiveInsight[]> {
    try {
      const { getDocs, query, collection, where, orderBy, limit: limitQuery } = await import('firebase/firestore');
      
      const q = query(
        collection(db, COLLECTIONS.PREDICTIVE_INSIGHTS),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limitQuery(limit)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
        expiresAt: doc.data().expiresAt.toDate()
      })) as FirestorePredictiveInsight[];
    } catch (error) {
      console.error('Failed to get predictive insights:', error);
      this.analyticsIntegration.trackError(error as Error, 'insights_retrieval');
      return [];
    }
  }

  // Get performance metrics
  public async getPerformanceMetrics(userId: string, limit: number = 100): Promise<FirestorePerformanceMetric[]> {
    try {
      const { getDocs, query, collection, where, orderBy, limit: limitQuery } = await import('firebase/firestore');
      
      const q = query(
        collection(db, COLLECTIONS.PERFORMANCE_METRICS),
        where('userId', '==', userId),
        orderBy('timestamp', 'desc'),
        limitQuery(limit)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp.toDate()
      })) as FirestorePerformanceMetric[];
    } catch (error) {
      console.error('Failed to get performance metrics:', error);
      this.analyticsIntegration.trackError(error as Error, 'metrics_retrieval');
      return [];
    }
  }

  // Get security alerts
  public async getSecurityAlerts(userId: string, limit: number = 50): Promise<FirestoreSecurityAlert[]> {
    try {
      const { getDocs, query, collection, where, orderBy, limit: limitQuery } = await import('firebase/firestore');
      
      const q = query(
        collection(db, COLLECTIONS.SECURITY_ALERTS),
        where('userId', '==', userId),
        orderBy('timestamp', 'desc'),
        limitQuery(limit)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp.toDate(),
        resolvedAt: doc.data().resolvedAt?.toDate()
      })) as FirestoreSecurityAlert[];
    } catch (error) {
      console.error('Failed to get security alerts:', error);
      this.analyticsIntegration.trackError(error as Error, 'alerts_retrieval');
      return [];
    }
  }

  // Update session activity
  private async updateSessionActivity(sessionId: string): Promise<void> {
    try {
      const { updateDoc, doc, increment, serverTimestamp } = await import('firebase/firestore');
      
      await updateDoc(doc(db, COLLECTIONS.USER_SESSIONS, sessionId), {
        actions: increment(1),
        lastActivity: serverTimestamp()
      });
    } catch (error) {
      console.error('Failed to update session activity:', error);
    }
  }

  // Save data to Firestore
  private async saveToFirestore(collection: string, docId: string, data: any): Promise<void> {
    try {
      const { setDoc, doc, serverTimestamp } = await import('firebase/firestore');
      
      // Convert Date objects to Firestore Timestamps
      const processedData = this.processDataForFirestore(data);
      
      await setDoc(doc(db, collection, docId), {
        ...processedData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Failed to save to Firestore:', error);
      throw error;
    }
  }

  // Process data for Firestore (convert Date objects to Timestamps)
  private processDataForFirestore(data: any): any {
    const processed = { ...data };
    
    // Convert Date objects to Firestore Timestamps
    Object.keys(processed).forEach(key => {
      if (processed[key] instanceof Date) {
        processed[key] = processed[key];
      }
    });
    
    return processed;
  }

  // Get device information
  private getDeviceInfo() {
    if (typeof navigator === 'undefined') {
      return {
        userAgent: 'Unknown',
        platform: 'Unknown',
        language: 'Unknown',
        timezone: 'Unknown',
        screenResolution: 'Unknown',
        viewport: 'Unknown'
      };
    }

    return {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      screenResolution: `${screen.width}x${screen.height}`,
      viewport: `${window.innerWidth}x${window.innerHeight}`
    };
  }

  // Get location information (mock implementation)
  private async getLocationInfo() {
    // In a real implementation, you might use a geolocation service
    return {
      country: 'Unknown',
      region: 'Unknown',
      city: 'Unknown'
    };
  }

  // Network status management
  public async enableNetwork(): Promise<void> {
    try {
      await enableNetwork(db);
      console.log('Firestore network enabled');
    } catch (error) {
      console.error('Failed to enable network:', error);
    }
  }

  public async disableNetwork(): Promise<void> {
    try {
      await disableNetwork(db);
      console.log('Firestore network disabled');
    } catch (error) {
      console.error('Failed to disable network:', error);
    }
  }
}

// Export the service instance
export const firebaseAnalyticsService = FirebaseAnalyticsService.getInstance();

// Export Firebase Analytics integration
export const firebaseAnalytics = FirebaseAnalyticsIntegration.getInstance();

// Export default
export default {
  db,
  auth,
  storage,
  functions,
  analytics,
  firebaseAnalyticsService,
  firebaseAnalytics,
  COLLECTIONS
};
