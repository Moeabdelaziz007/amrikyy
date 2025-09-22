// Firebase Integration Hook
// React hook for Firebase analytics integration

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../hooks/use-auth';
import {
  firebaseAnalyticsService,
  firebaseAnalytics,
  COLLECTIONS,
} from '../lib/firebase-analytics';
import {
  FirestoreUserHistory,
  FirestoreUserSession,
  FirestorePredictiveInsight,
  FirestorePerformanceMetric,
  FirestoreSecurityAlert,
} from '../lib/firebase-analytics';

interface UseFirebaseAnalyticsReturn {
  // Data
  userHistory: FirestoreUserHistory[];
  userSessions: FirestoreUserSession[];
  predictiveInsights: FirestorePredictiveInsight[];
  performanceMetrics: FirestorePerformanceMetric[];
  securityAlerts: FirestoreSecurityAlert[];

  // Loading states
  loading: {
    history: boolean;
    sessions: boolean;
    insights: boolean;
    metrics: boolean;
    alerts: boolean;
  };

  // Error states
  errors: {
    history: string | null;
    sessions: string | null;
    insights: string | null;
    metrics: string | null;
    alerts: string | null;
  };

  // Actions
  trackAction: (action: {
    type: string;
    category: string;
    description: string;
    target?: string;
    targetType?: string;
    details?: Record<string, any>;
  }) => Promise<void>;

  trackPageView: (pageName: string, pageTitle?: string) => void;
  trackUserInteraction: (
    action: string,
    target: string,
    details?: Record<string, any>
  ) => void;
  trackPerformance: (metricName: string, value: number, unit?: string) => void;
  trackError: (error: Error, context?: string) => void;

  // Data operations
  refreshData: () => Promise<void>;
  refreshHistory: () => Promise<void>;
  refreshSessions: () => Promise<void>;
  refreshInsights: () => Promise<void>;
  refreshMetrics: () => Promise<void>;
  refreshAlerts: () => Promise<void>;

  // Analytics operations
  generateInsights: () => Promise<void>;
  analyzePatterns: () => Promise<void>;
  monitorPerformance: () => Promise<void>;
  detectAnomalies: () => Promise<void>;

  // Utility
  isInitialized: boolean;
  currentSession: string | null;
}

export const useFirebaseAnalytics = (): UseFirebaseAnalyticsReturn => {
  const { user } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentSession, setCurrentSession] = useState<string | null>(null);

  // Data states
  const [userHistory, setUserHistory] = useState<FirestoreUserHistory[]>([]);
  const [userSessions, setUserSessions] = useState<FirestoreUserSession[]>([]);
  const [predictiveInsights, setPredictiveInsights] = useState<
    FirestorePredictiveInsight[]
  >([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<
    FirestorePerformanceMetric[]
  >([]);
  const [securityAlerts, setSecurityAlerts] = useState<
    FirestoreSecurityAlert[]
  >([]);

  // Loading states
  const [loading, setLoading] = useState({
    history: false,
    sessions: false,
    insights: false,
    metrics: false,
    alerts: false,
  });

  // Error states
  const [errors, setErrors] = useState({
    history: null as string | null,
    sessions: null as string | null,
    insights: null as string | null,
    metrics: null as string | null,
    alerts: null as string | null,
  });

  // Initialize analytics when user changes
  useEffect(() => {
    if (user && !isInitialized) {
      initializeAnalytics();
    } else if (!user && isInitialized) {
      cleanup();
    }
  }, [user, isInitialized]);

  // Initialize analytics
  const initializeAnalytics = async () => {
    if (!user) return;

    try {
      await firebaseAnalyticsService.initializeUserAnalytics(user.uid);
      const sessionId = await firebaseAnalyticsService.createUserSession(
        user.uid
      );
      setCurrentSession(sessionId);
      setIsInitialized(true);

      // Load initial data
      await loadAllData();

      // Track initialization
      firebaseAnalytics.trackEvent('analytics_hook_initialized', {
        user_id: user.uid,
        session_id: sessionId,
      });
    } catch (error) {
      console.error('Failed to initialize analytics:', error);
      firebaseAnalytics.trackError(error as Error, 'analytics_initialization');
    }
  };

  // Cleanup when user logs out
  const cleanup = () => {
    setUserHistory([]);
    setUserSessions([]);
    setPredictiveInsights([]);
    setPerformanceMetrics([]);
    setSecurityAlerts([]);
    setCurrentSession(null);
    setIsInitialized(false);
  };

  // Load all data
  const loadAllData = async () => {
    if (!user) return;

    await Promise.all([
      loadUserHistory(),
      loadUserSessions(),
      loadPredictiveInsights(),
      loadPerformanceMetrics(),
      loadSecurityAlerts(),
    ]);
  };

  // Load user history
  const loadUserHistory = async () => {
    if (!user) return;

    setLoading(prev => ({ ...prev, history: true }));
    setErrors(prev => ({ ...prev, history: null }));

    try {
      const data = await firebaseAnalyticsService.getUserAnalyticsData(
        user.uid,
        1000
      );
      setUserHistory(data);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to load user history';
      setErrors(prev => ({ ...prev, history: errorMessage }));
      firebaseAnalytics.trackError(error as Error, 'user_history_loading');
    } finally {
      setLoading(prev => ({ ...prev, history: false }));
    }
  };

  // Load user sessions
  const loadUserSessions = async () => {
    if (!user) return;

    setLoading(prev => ({ ...prev, sessions: true }));
    setErrors(prev => ({ ...prev, sessions: null }));

    try {
      const data = await firebaseAnalyticsService.getUserSessions(
        user.uid,
        100
      );
      setUserSessions(data);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to load user sessions';
      setErrors(prev => ({ ...prev, sessions: errorMessage }));
      firebaseAnalytics.trackError(error as Error, 'user_sessions_loading');
    } finally {
      setLoading(prev => ({ ...prev, sessions: false }));
    }
  };

  // Load predictive insights
  const loadPredictiveInsights = async () => {
    if (!user) return;

    setLoading(prev => ({ ...prev, insights: true }));
    setErrors(prev => ({ ...prev, insights: null }));

    try {
      const data = await firebaseAnalyticsService.getPredictiveInsights(
        user.uid,
        50
      );
      setPredictiveInsights(data);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to load predictive insights';
      setErrors(prev => ({ ...prev, insights: errorMessage }));
      firebaseAnalytics.trackError(
        error as Error,
        'predictive_insights_loading'
      );
    } finally {
      setLoading(prev => ({ ...prev, insights: false }));
    }
  };

  // Load performance metrics
  const loadPerformanceMetrics = async () => {
    if (!user) return;

    setLoading(prev => ({ ...prev, metrics: true }));
    setErrors(prev => ({ ...prev, metrics: null }));

    try {
      const data = await firebaseAnalyticsService.getPerformanceMetrics(
        user.uid,
        100
      );
      setPerformanceMetrics(data);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to load performance metrics';
      setErrors(prev => ({ ...prev, metrics: errorMessage }));
      firebaseAnalytics.trackError(
        error as Error,
        'performance_metrics_loading'
      );
    } finally {
      setLoading(prev => ({ ...prev, metrics: false }));
    }
  };

  // Load security alerts
  const loadSecurityAlerts = async () => {
    if (!user) return;

    setLoading(prev => ({ ...prev, alerts: true }));
    setErrors(prev => ({ ...prev, alerts: null }));

    try {
      const data = await firebaseAnalyticsService.getSecurityAlerts(
        user.uid,
        50
      );
      setSecurityAlerts(data);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to load security alerts';
      setErrors(prev => ({ ...prev, alerts: errorMessage }));
      firebaseAnalytics.trackError(error as Error, 'security_alerts_loading');
    } finally {
      setLoading(prev => ({ ...prev, alerts: false }));
    }
  };

  // Track user action
  const trackAction = useCallback(
    async (action: {
      type: string;
      category: string;
      description: string;
      target?: string;
      targetType?: string;
      details?: Record<string, any>;
    }) => {
      if (!user || !currentSession) return;

      try {
        await firebaseAnalyticsService.trackUserAction(
          user.uid,
          action,
          currentSession,
          true
        );

        // Refresh history to show new action
        await loadUserHistory();
      } catch (error) {
        console.error('Failed to track action:', error);
        firebaseAnalytics.trackError(error as Error, 'action_tracking');
      }
    },
    [user, currentSession]
  );

  // Track page view
  const trackPageView = useCallback((pageName: string, pageTitle?: string) => {
    firebaseAnalytics.trackPageView(pageName, pageTitle);
  }, []);

  // Track user interaction
  const trackUserInteraction = useCallback(
    (action: string, target: string, details?: Record<string, any>) => {
      firebaseAnalytics.trackUserInteraction(action, target, details);
    },
    []
  );

  // Track performance metric
  const trackPerformance = useCallback(
    (metricName: string, value: number, unit?: string) => {
      firebaseAnalytics.trackPerformance(metricName, value, unit);
    },
    []
  );

  // Track error
  const trackError = useCallback((error: Error, context?: string) => {
    firebaseAnalytics.trackError(error, context);
  }, []);

  // Refresh all data
  const refreshData = useCallback(async () => {
    await loadAllData();
  }, [user]);

  // Refresh specific data
  const refreshHistory = useCallback(async () => {
    await loadUserHistory();
  }, [user]);

  const refreshSessions = useCallback(async () => {
    await loadUserSessions();
  }, [user]);

  const refreshInsights = useCallback(async () => {
    await loadPredictiveInsights();
  }, [user]);

  const refreshMetrics = useCallback(async () => {
    await loadPerformanceMetrics();
  }, [user]);

  const refreshAlerts = useCallback(async () => {
    await loadSecurityAlerts();
  }, [user]);

  // Analytics operations
  const generateInsights = useCallback(async () => {
    if (!user) return;

    try {
      // This would call the advanced analytics service
      // For now, just refresh insights
      await loadPredictiveInsights();
    } catch (error) {
      console.error('Failed to generate insights:', error);
      firebaseAnalytics.trackError(error as Error, 'insights_generation');
    }
  }, [user]);

  const analyzePatterns = useCallback(async () => {
    if (!user) return;

    try {
      // This would call the advanced analytics service
      // For now, just refresh history
      await loadUserHistory();
    } catch (error) {
      console.error('Failed to analyze patterns:', error);
      firebaseAnalytics.trackError(error as Error, 'pattern_analysis');
    }
  }, [user]);

  const monitorPerformance = useCallback(async () => {
    if (!user) return;

    try {
      // This would call the advanced analytics service
      // For now, just refresh metrics
      await loadPerformanceMetrics();
    } catch (error) {
      console.error('Failed to monitor performance:', error);
      firebaseAnalytics.trackError(error as Error, 'performance_monitoring');
    }
  }, [user]);

  const detectAnomalies = useCallback(async () => {
    if (!user) return;

    try {
      // This would call the advanced analytics service
      // For now, just refresh alerts
      await loadSecurityAlerts();
    } catch (error) {
      console.error('Failed to detect anomalies:', error);
      firebaseAnalytics.trackError(error as Error, 'anomaly_detection');
    }
  }, [user]);

  return {
    // Data
    userHistory,
    userSessions,
    predictiveInsights,
    performanceMetrics,
    securityAlerts,

    // Loading states
    loading,

    // Error states
    errors,

    // Actions
    trackAction,
    trackPageView,
    trackUserInteraction,
    trackPerformance,
    trackError,

    // Data operations
    refreshData,
    refreshHistory,
    refreshSessions,
    refreshInsights,
    refreshMetrics,
    refreshAlerts,

    // Analytics operations
    generateInsights,
    analyzePatterns,
    monitorPerformance,
    detectAnomalies,

    // Utility
    isInitialized,
    currentSession,
  };
};

export default useFirebaseAnalytics;
