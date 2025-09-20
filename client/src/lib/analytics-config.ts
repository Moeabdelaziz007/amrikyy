// Advanced Analytics Configuration
// Configuration settings for the advanced analytics system

export interface AnalyticsConfig {
  // AI Model Configuration
  ai: {
    enabled: boolean;
    modelEndpoint: string;
    apiKey?: string;
    timeout: number;
    retryAttempts: number;
    confidenceThreshold: number;
  };

  // Performance Monitoring
  performance: {
    enabled: boolean;
    collectionInterval: number; // milliseconds
    metricsRetentionDays: number;
    realTimeUpdates: boolean;
    thresholds: {
      sessionDuration: { warning: number; critical: number };
      errorRate: { warning: number; critical: number };
      engagementScore: { warning: number; critical: number };
      responseTime: { warning: number; critical: number };
    };
  };

  // Security Monitoring
  security: {
    enabled: boolean;
    anomalyDetection: boolean;
    threatDetection: boolean;
    realTimeMonitoring: boolean;
    alertThresholds: {
      suspiciousActivity: number;
      errorSpike: number;
      unusualPatterns: number;
    };
    notificationChannels: string[];
  };

  // Predictive Analytics
  predictive: {
    enabled: boolean;
    modelTypes: string[];
    predictionHorizons: {
      short: number; // days
      medium: number; // weeks
      long: number; // months
    };
    confidenceLevels: {
      high: number;
      medium: number;
      low: number;
    };
    autoRefresh: boolean;
    refreshInterval: number; // hours
  };

  // Automated Reports
  reports: {
    enabled: boolean;
    schedules: {
      daily: { enabled: boolean; time: string; timezone: string };
      weekly: { enabled: boolean; day: string; time: string; timezone: string };
      monthly: { enabled: boolean; day: number; time: string; timezone: string };
      quarterly: { enabled: boolean; day: number; time: string; timezone: string };
    };
    templates: {
      performance: boolean;
      security: boolean;
      userBehavior: boolean;
      engagement: boolean;
      custom: string[];
    };
    notifications: {
      email: boolean;
      push: boolean;
      webhook: boolean;
      webhookUrl?: string;
    };
    retention: {
      generatedReports: number; // days
      scheduledReports: number; // days
    };
  };

  // Data Collection
  dataCollection: {
    enabled: boolean;
    userTracking: boolean;
    sessionTracking: boolean;
    interactionTracking: boolean;
    performanceTracking: boolean;
    errorTracking: boolean;
    privacyMode: boolean;
    dataRetentionDays: number;
    anonymizeData: boolean;
  };

  // Storage Configuration
  storage: {
    provider: 'firebase' | 'mongodb' | 'postgresql' | 'custom';
    config: Record<string, any>;
    backupEnabled: boolean;
    backupInterval: number; // hours
    compressionEnabled: boolean;
  };

  // API Configuration
  api: {
    enabled: boolean;
    endpoints: {
      insights: string;
      metrics: string;
      alerts: string;
      reports: string;
    };
    rateLimiting: {
      enabled: boolean;
      requestsPerMinute: number;
      burstLimit: number;
    };
    authentication: {
      required: boolean;
      method: 'jwt' | 'api-key' | 'oauth';
      config: Record<string, any>;
    };
  };

  // UI Configuration
  ui: {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    timezone: string;
    dateFormat: string;
    numberFormat: string;
    charts: {
      defaultType: 'line' | 'bar' | 'pie' | 'area';
      animationEnabled: boolean;
      colorScheme: string;
    };
    notifications: {
      position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
      duration: number; // seconds
      maxVisible: number;
    };
  };

  // Feature Flags
  features: {
    realTimeAnalytics: boolean;
    predictiveInsights: boolean;
    securityMonitoring: boolean;
    automatedReports: boolean;
    customDashboards: boolean;
    dataExport: boolean;
    apiAccess: boolean;
    webhooks: boolean;
  };
}

// Default Configuration
export const defaultAnalyticsConfig: AnalyticsConfig = {
  ai: {
    enabled: true,
    modelEndpoint: '/api/ai/analytics',
    timeout: 30000,
    retryAttempts: 3,
    confidenceThreshold: 60,
  },

  performance: {
    enabled: true,
    collectionInterval: 60000, // 1 minute
    metricsRetentionDays: 90,
    realTimeUpdates: true,
    thresholds: {
      sessionDuration: { warning: 10, critical: 5 }, // minutes
      errorRate: { warning: 5, critical: 10 }, // percentage
      engagementScore: { warning: 60, critical: 40 }, // score
      responseTime: { warning: 2000, critical: 5000 }, // milliseconds
    },
  },

  security: {
    enabled: true,
    anomalyDetection: true,
    threatDetection: true,
    realTimeMonitoring: true,
    alertThresholds: {
      suspiciousActivity: 3,
      errorSpike: 20, // percentage
      unusualPatterns: 5,
    },
    notificationChannels: ['email', 'push'],
  },

  predictive: {
    enabled: true,
    modelTypes: ['user_behavior', 'performance', 'engagement', 'retention', 'conversion'],
    predictionHorizons: {
      short: 7, // days
      medium: 4, // weeks
      long: 3, // months
    },
    confidenceLevels: {
      high: 80,
      medium: 60,
      low: 40,
    },
    autoRefresh: true,
    refreshInterval: 24, // hours
  },

  reports: {
    enabled: true,
    schedules: {
      daily: { enabled: true, time: '09:00', timezone: 'UTC' },
      weekly: { enabled: true, day: 'Monday', time: '09:00', timezone: 'UTC' },
      monthly: { enabled: true, day: 1, time: '09:00', timezone: 'UTC' },
      quarterly: { enabled: false, day: 1, time: '09:00', timezone: 'UTC' },
    },
    templates: {
      performance: true,
      security: true,
      userBehavior: true,
      engagement: true,
      custom: [],
    },
    notifications: {
      email: true,
      push: true,
      webhook: false,
    },
    retention: {
      generatedReports: 365, // days
      scheduledReports: 90, // days
    },
  },

  dataCollection: {
    enabled: true,
    userTracking: true,
    sessionTracking: true,
    interactionTracking: true,
    performanceTracking: true,
    errorTracking: true,
    privacyMode: false,
    dataRetentionDays: 365,
    anonymizeData: false,
  },

  storage: {
    provider: 'firebase',
    config: {},
    backupEnabled: true,
    backupInterval: 24, // hours
    compressionEnabled: true,
  },

  api: {
    enabled: true,
    endpoints: {
      insights: '/api/analytics/insights',
      metrics: '/api/analytics/metrics',
      alerts: '/api/analytics/alerts',
      reports: '/api/analytics/reports',
    },
    rateLimiting: {
      enabled: true,
      requestsPerMinute: 100,
      burstLimit: 200,
    },
    authentication: {
      required: true,
      method: 'jwt',
      config: {},
    },
  },

  ui: {
    theme: 'auto',
    language: 'en',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    numberFormat: 'en-US',
    charts: {
      defaultType: 'line',
      animationEnabled: true,
      colorScheme: 'default',
    },
    notifications: {
      position: 'top-right',
      duration: 5,
      maxVisible: 3,
    },
  },

  features: {
    realTimeAnalytics: true,
    predictiveInsights: true,
    securityMonitoring: true,
    automatedReports: true,
    customDashboards: true,
    dataExport: true,
    apiAccess: true,
    webhooks: false,
  },
};

// Configuration Manager
export class AnalyticsConfigManager {
  private static instance: AnalyticsConfigManager;
  private config: AnalyticsConfig;

  private constructor() {
    this.config = this.loadConfig();
  }

  public static getInstance(): AnalyticsConfigManager {
    if (!AnalyticsConfigManager.instance) {
      AnalyticsConfigManager.instance = new AnalyticsConfigManager();
    }
    return AnalyticsConfigManager.instance;
  }

  public getConfig(): AnalyticsConfig {
    return { ...this.config };
  }

  public updateConfig(updates: Partial<AnalyticsConfig>): void {
    this.config = { ...this.config, ...updates };
    this.saveConfig();
  }

  public resetToDefaults(): void {
    this.config = { ...defaultAnalyticsConfig };
    this.saveConfig();
  }

  public isFeatureEnabled(feature: keyof AnalyticsConfig['features']): boolean {
    return this.config.features[feature];
  }

  public isAIModelEnabled(): boolean {
    return this.config.ai.enabled;
  }

  public isPerformanceMonitoringEnabled(): boolean {
    return this.config.performance.enabled;
  }

  public isSecurityMonitoringEnabled(): boolean {
    return this.config.security.enabled;
  }

  public isPredictiveAnalyticsEnabled(): boolean {
    return this.config.predictive.enabled;
  }

  public isAutomatedReportsEnabled(): boolean {
    return this.config.reports.enabled;
  }

  public getAIConfig() {
    return this.config.ai;
  }

  public getPerformanceConfig() {
    return this.config.performance;
  }

  public getSecurityConfig() {
    return this.config.security;
  }

  public getPredictiveConfig() {
    return this.config.predictive;
  }

  public getReportsConfig() {
    return this.config.reports;
  }

  public getDataCollectionConfig() {
    return this.config.dataCollection;
  }

  public getStorageConfig() {
    return this.config.storage;
  }

  public getAPIConfig() {
    return this.config.api;
  }

  public getUIConfig() {
    return this.config.ui;
  }

  private loadConfig(): AnalyticsConfig {
    try {
      const savedConfig = localStorage.getItem('analytics-config');
      if (savedConfig) {
        const parsed = JSON.parse(savedConfig);
        return { ...defaultAnalyticsConfig, ...parsed };
      }
    } catch (error) {
      console.error('Failed to load analytics config:', error);
    }
    return { ...defaultAnalyticsConfig };
  }

  private saveConfig(): void {
    try {
      localStorage.setItem('analytics-config', JSON.stringify(this.config));
    } catch (error) {
      console.error('Failed to save analytics config:', error);
    }
  }
}

// Environment-specific configurations
export const getEnvironmentConfig = (): Partial<AnalyticsConfig> => {
  const env = process.env.NODE_ENV;
  
  switch (env) {
    case 'development':
      return {
        ai: {
          enabled: true,
          modelEndpoint: 'http://localhost:3001/api/ai/analytics',
          timeout: 10000,
          retryAttempts: 1,
          confidenceThreshold: 50,
        },
        performance: {
          collectionInterval: 30000, // 30 seconds for faster testing
        },
        dataCollection: {
          privacyMode: false,
          anonymizeData: false,
        },
        features: {
          realTimeAnalytics: true,
          predictiveInsights: true,
          securityMonitoring: true,
          automatedReports: true,
          customDashboards: true,
          dataExport: true,
          apiAccess: true,
          webhooks: true,
        },
      };

    case 'production':
      return {
        ai: {
          enabled: true,
          modelEndpoint: '/api/ai/analytics',
          timeout: 30000,
          retryAttempts: 3,
          confidenceThreshold: 70,
        },
        performance: {
          collectionInterval: 60000, // 1 minute
        },
        dataCollection: {
          privacyMode: true,
          anonymizeData: true,
        },
        features: {
          realTimeAnalytics: true,
          predictiveInsights: true,
          securityMonitoring: true,
          automatedReports: true,
          customDashboards: true,
          dataExport: true,
          apiAccess: false, // Disable API access in production by default
          webhooks: false,
        },
      };

    case 'test':
      return {
        ai: {
          enabled: false, // Disable AI in tests
        },
        performance: {
          collectionInterval: 1000, // 1 second for fast tests
        },
        dataCollection: {
          enabled: false, // Disable data collection in tests
        },
        features: {
          realTimeAnalytics: false,
          predictiveInsights: false,
          securityMonitoring: false,
          automatedReports: false,
          customDashboards: false,
          dataExport: false,
          apiAccess: false,
          webhooks: false,
        },
      };

    default:
      return {};
  }
};

// Validation functions
export const validateConfig = (config: AnalyticsConfig): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Validate AI configuration
  if (config.ai.enabled) {
    if (!config.ai.modelEndpoint) {
      errors.push('AI model endpoint is required when AI is enabled');
    }
    if (config.ai.timeout < 1000) {
      errors.push('AI timeout must be at least 1000ms');
    }
    if (config.ai.confidenceThreshold < 0 || config.ai.confidenceThreshold > 100) {
      errors.push('AI confidence threshold must be between 0 and 100');
    }
  }

  // Validate performance configuration
  if (config.performance.enabled) {
    if (config.performance.collectionInterval < 1000) {
      errors.push('Performance collection interval must be at least 1000ms');
    }
    if (config.performance.metricsRetentionDays < 1) {
      errors.push('Metrics retention days must be at least 1');
    }
  }

  // Validate security configuration
  if (config.security.enabled) {
    if (config.security.alertThresholds.suspiciousActivity < 1) {
      errors.push('Suspicious activity threshold must be at least 1');
    }
    if (config.security.alertThresholds.errorSpike < 0 || config.security.alertThresholds.errorSpike > 100) {
      errors.push('Error spike threshold must be between 0 and 100');
    }
  }

  // Validate predictive configuration
  if (config.predictive.enabled) {
    if (config.predictive.predictionHorizons.short < 1) {
      errors.push('Short prediction horizon must be at least 1 day');
    }
    if (config.predictive.predictionHorizons.medium < 1) {
      errors.push('Medium prediction horizon must be at least 1 week');
    }
    if (config.predictive.predictionHorizons.long < 1) {
      errors.push('Long prediction horizon must be at least 1 month');
    }
  }

  // Validate reports configuration
  if (config.reports.enabled) {
    if (config.reports.retention.generatedReports < 1) {
      errors.push('Generated reports retention must be at least 1 day');
    }
    if (config.reports.retention.scheduledReports < 1) {
      errors.push('Scheduled reports retention must be at least 1 day');
    }
  }

  // Validate data collection configuration
  if (config.dataCollection.enabled) {
    if (config.dataCollection.dataRetentionDays < 1) {
      errors.push('Data retention days must be at least 1');
    }
  }

  // Validate API configuration
  if (config.api.enabled) {
    if (config.api.rateLimiting.requestsPerMinute < 1) {
      errors.push('API requests per minute must be at least 1');
    }
    if (config.api.rateLimiting.burstLimit < config.api.rateLimiting.requestsPerMinute) {
      errors.push('API burst limit must be greater than or equal to requests per minute');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

// Export the configuration manager instance
export const analyticsConfig = AnalyticsConfigManager.getInstance();

export default analyticsConfig;
