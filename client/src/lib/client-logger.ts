// =============================================================================
// 📝 AuraOS Client-Side Logging Service
// =============================================================================
//
// Client-side logging service with browser-specific features
// Supports console, localStorage, remote logging, and error tracking
//
// =============================================================================

// =============================================================================
// 🔧 Types and Interfaces
// =============================================================================

export enum ClientLogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
  VERBOSE = 4,
}

export enum ClientLogTransport {
  CONSOLE = 'console',
  LOCAL_STORAGE = 'localStorage',
  SESSION_STORAGE = 'sessionStorage',
  REMOTE = 'remote',
  MEMORY = 'memory',
}

export interface ClientLogEntry {
  timestamp: string;
  level: ClientLogLevel;
  message: string;
  context?: Record<string, any>;
  metadata?: {
    userId?: string;
    sessionId?: string;
    requestId?: string;
    component?: string;
    action?: string;
    url?: string;
    userAgent?: string;
    viewport?: { width: number; height: number };
    memory?: number;
    performance?: number;
  };
  stack?: string;
  tags?: string[];
}

export interface ClientLogConfig {
  level: ClientLogLevel;
  transports: ClientLogTransport[];
  maxLocalStorageSize?: number;
  maxMemoryLogs?: number;
  enablePerformanceMonitoring?: boolean;
  enableErrorTracking?: boolean;
  enableStructuredLogging?: boolean;
  remoteEndpoint?: string;
  remoteApiKey?: string;
  enableConsoleColors?: boolean;
}

// =============================================================================
// 🚀 Client Logger Class
// =============================================================================

export class AuraOSClientLogger {
  private config: ClientLogConfig;
  private logBuffer: ClientLogEntry[] = [];
  private errorCounts: Map<string, number> = new Map();
  private performanceMetrics: Map<string, number> = new Map();
  private isInitialized = false;
  private sessionId: string;

  constructor(config: Partial<ClientLogConfig> = {}) {
    this.config = {
      level: ClientLogLevel.INFO,
      transports: [ClientLogTransport.CONSOLE],
      maxLocalStorageSize: 5 * 1024 * 1024, // 5MB
      maxMemoryLogs: 1000,
      enablePerformanceMonitoring: true,
      enableErrorTracking: true,
      enableStructuredLogging: true,
      enableConsoleColors: true,
      ...config,
    };

    this.sessionId = this.generateSessionId();
    this.initialize();
  }

  // =============================================================================
  // 🔧 Initialization
  // =============================================================================

  private initialize(): void {
    try {
      // Setup performance monitoring
      if (this.config.enablePerformanceMonitoring) {
        this.setupPerformanceMonitoring();
      }

      // Setup error tracking
      if (this.config.enableErrorTracking) {
        this.setupErrorTracking();
      }

      // Setup localStorage cleanup
      if (this.config.transports.includes(ClientLogTransport.LOCAL_STORAGE)) {
        this.cleanupLocalStorage();
      }

      this.isInitialized = true;
      this.info('AuraOS Client Logger initialized successfully', {
        config: {
          level: ClientLogLevel[this.config.level],
          transports: this.config.transports,
          sessionId: this.sessionId,
        },
      });
    } catch (error) {
      console.error('Failed to initialize AuraOS Client Logger:', error);
      throw error;
    }
  }

  // =============================================================================
  // 📝 Core Logging Methods
  // =============================================================================

  public error(
    message: string,
    context?: Record<string, any>,
    metadata?: ClientLogEntry['metadata']
  ): void {
    this.log(ClientLogLevel.ERROR, message, context, metadata);
  }

  public warn(
    message: string,
    context?: Record<string, any>,
    metadata?: ClientLogEntry['metadata']
  ): void {
    this.log(ClientLogLevel.WARN, message, context, metadata);
  }

  public info(
    message: string,
    context?: Record<string, any>,
    metadata?: ClientLogEntry['metadata']
  ): void {
    this.log(ClientLogLevel.INFO, message, context, metadata);
  }

  public debug(
    message: string,
    context?: Record<string, any>,
    metadata?: ClientLogEntry['metadata']
  ): void {
    this.log(ClientLogLevel.DEBUG, message, context, metadata);
  }

  public verbose(
    message: string,
    context?: Record<string, any>,
    metadata?: ClientLogEntry['metadata']
  ): void {
    this.log(ClientLogLevel.VERBOSE, message, context, metadata);
  }

  // =============================================================================
  // 🔍 Main Log Method
  // =============================================================================

  private log(
    level: ClientLogLevel,
    message: string,
    context?: Record<string, any>,
    metadata?: ClientLogEntry['metadata']
  ): void {
    if (level > this.config.level) {
      return; // Skip if level is below configured threshold
    }

    const logEntry: ClientLogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      metadata: {
        ...metadata,
        sessionId: this.sessionId,
        url: window.location.href,
        userAgent: navigator.userAgent,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight,
        },
        memory: this.config.enablePerformanceMonitoring
          ? this.getMemoryUsage()
          : undefined,
        performance: this.config.enablePerformanceMonitoring
          ? this.getPerformanceMetrics()
          : undefined,
      },
      tags: this.generateTags(level, context),
    };

    // Add stack trace for errors
    if (level === ClientLogLevel.ERROR) {
      logEntry.stack = new Error().stack;
    }

    // Process through transports
    this.processTransports(logEntry);

    // Add to buffer for memory transport
    if (this.config.transports.includes(ClientLogTransport.MEMORY)) {
      this.addToBuffer(logEntry);
    }

    // Track errors
    if (level === ClientLogLevel.ERROR && this.config.enableErrorTracking) {
      this.trackError(message, context);
    }
  }

  // =============================================================================
  // 🚚 Transport Processing
  // =============================================================================

  private processTransports(logEntry: ClientLogEntry): void {
    this.config.transports.forEach(transport => {
      try {
        switch (transport) {
          case ClientLogTransport.CONSOLE:
            this.logToConsole(logEntry);
            break;
          case ClientLogTransport.LOCAL_STORAGE:
            this.logToLocalStorage(logEntry);
            break;
          case ClientLogTransport.SESSION_STORAGE:
            this.logToSessionStorage(logEntry);
            break;
          case ClientLogTransport.REMOTE:
            this.logToRemote(logEntry);
            break;
        }
      } catch (error) {
        console.error(`Failed to log to ${transport}:`, error);
      }
    });
  }

  private logToConsole(logEntry: ClientLogEntry): void {
    const levelName = ClientLogLevel[logEntry.level];
    const timestamp = logEntry.timestamp;
    const contextStr = logEntry.context
      ? JSON.stringify(logEntry.context, null, 2)
      : '';
    const metadataStr = logEntry.metadata
      ? JSON.stringify(logEntry.metadata, null, 2)
      : '';

    const logMessage = `[${timestamp}] ${levelName}: ${logEntry.message}`;

    // Apply colors if enabled
    if (this.config.enableConsoleColors) {
      const colors = {
        [ClientLogLevel.ERROR]: 'color: red; font-weight: bold;',
        [ClientLogLevel.WARN]: 'color: orange; font-weight: bold;',
        [ClientLogLevel.INFO]: 'color: blue;',
        [ClientLogLevel.DEBUG]: 'color: gray;',
        [ClientLogLevel.VERBOSE]: 'color: lightgray;',
      };

      console.log(`%c${logMessage}`, colors[logEntry.level]);
    } else {
      switch (logEntry.level) {
        case ClientLogLevel.ERROR:
          console.error(logMessage);
          break;
        case ClientLogLevel.WARN:
          console.warn(logMessage);
          break;
        case ClientLogLevel.INFO:
          console.info(logMessage);
          break;
        case ClientLogLevel.DEBUG:
          console.debug(logMessage);
          break;
        case ClientLogLevel.VERBOSE:
          console.log(logMessage);
          break;
      }
    }

    if (contextStr) console.log('Context:', contextStr);
    if (metadataStr) console.log('Metadata:', metadataStr);
    if (logEntry.stack) console.error('Stack:', logEntry.stack);
  }

  private logToLocalStorage(logEntry: ClientLogEntry): void {
    try {
      const key = 'auraos_logs';
      const existingLogs = this.getStoredLogs(key);
      const logs = [...existingLogs, logEntry];

      // Keep only recent logs to avoid exceeding storage limit
      const maxLogs = Math.floor(
        this.config.maxLocalStorageSize! / JSON.stringify(logEntry).length
      );
      const trimmedLogs = logs.slice(-maxLogs);

      localStorage.setItem(key, JSON.stringify(trimmedLogs));
    } catch (error) {
      console.warn('Failed to store log in localStorage:', error);
    }
  }

  private logToSessionStorage(logEntry: ClientLogEntry): void {
    try {
      const key = 'auraos_session_logs';
      const existingLogs = this.getStoredLogs(key);
      const logs = [...existingLogs, logEntry];

      // Keep only recent logs
      const trimmedLogs = logs.slice(-100);

      sessionStorage.setItem(key, JSON.stringify(trimmedLogs));
    } catch (error) {
      console.warn('Failed to store log in sessionStorage:', error);
    }
  }

  private logToRemote(logEntry: ClientLogEntry): void {
    if (!this.config.remoteEndpoint || !this.config.remoteApiKey) return;

    // Send to remote endpoint
    fetch(this.config.remoteEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.config.remoteApiKey}`,
      },
      body: JSON.stringify(logEntry),
    }).catch(error => {
      console.warn('Failed to send log to remote endpoint:', error);
    });
  }

  // =============================================================================
  // 📊 Performance Monitoring
  // =============================================================================

  private setupPerformanceMonitoring(): void {
    // Monitor performance metrics
    setInterval(() => {
      const metrics = this.getPerformanceMetrics();
      this.debug('Performance metrics', { metrics });
    }, 60000); // Every minute

    // Monitor memory usage
    if ('memory' in performance) {
      setInterval(() => {
        const memUsage = this.getMemoryUsage();
        if (memUsage > 50 * 1024 * 1024) {
          // 50MB threshold
          this.warn('High memory usage detected', { memoryUsage: memUsage });
        }
      }, 30000); // Every 30 seconds
    }
  }

  private getPerformanceMetrics(): number {
    // Get performance metrics from Performance API
    const navigation = performance.getEntriesByType(
      'navigation'
    )[0] as PerformanceNavigationTiming;
    if (navigation) {
      return navigation.loadEventEnd - navigation.loadEventStart;
    }
    return 0;
  }

  private getMemoryUsage(): number {
    if ('memory' in performance) {
      return (performance as any).memory.usedJSHeapSize;
    }
    return 0;
  }

  // =============================================================================
  // 🚨 Error Tracking
  // =============================================================================

  private setupErrorTracking(): void {
    // Global error handler
    window.addEventListener('error', event => {
      this.error('Global error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error?.stack,
      });
    });

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', event => {
      this.error('Unhandled promise rejection', {
        reason: event.reason,
        promise: event.promise,
      });
    });

    // Resource loading errors
    window.addEventListener(
      'error',
      event => {
        if (event.target !== window) {
          this.warn('Resource loading error', {
            tagName: (event.target as HTMLElement).tagName,
            src:
              (event.target as HTMLImageElement).src ||
              (event.target as HTMLLinkElement).href,
          });
        }
      },
      true
    );
  }

  private trackError(message: string, context?: Record<string, any>): void {
    const errorKey = `${message}:${JSON.stringify(context)}`;
    const count = this.errorCounts.get(errorKey) || 0;
    this.errorCounts.set(errorKey, count + 1);

    // Alert if error occurs frequently
    if (count > 5) {
      this.warn('Frequent error detected', { errorKey, count });
    }
  }

  // =============================================================================
  // 🔧 Utility Methods
  // =============================================================================

  private addToBuffer(logEntry: ClientLogEntry): void {
    this.logBuffer.push(logEntry);

    // Keep buffer size manageable
    if (this.logBuffer.length > this.config.maxMemoryLogs!) {
      this.logBuffer = this.logBuffer.slice(-this.config.maxMemoryLogs! / 2);
    }
  }

  private generateTags(
    level: ClientLogLevel,
    context?: Record<string, any>
  ): string[] {
    const tags: string[] = [];

    // Add level tag
    tags.push(ClientLogLevel[level].toLowerCase());

    // Add context-based tags
    if (context) {
      if (context.userId) tags.push('user-action');
      if (context.component) tags.push(`component:${context.component}`);
      if (context.action) tags.push(`action:${context.action}`);
    }

    return tags;
  }

  private generateSessionId(): string {
    return (
      'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now()
    );
  }

  private getStoredLogs(key: string): ClientLogEntry[] {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private cleanupLocalStorage(): void {
    try {
      const keys = Object.keys(localStorage);
      const logKeys = keys.filter(key => key.startsWith('auraos_logs'));

      let totalSize = 0;
      logKeys.forEach(key => {
        totalSize += localStorage.getItem(key)?.length || 0;
      });

      if (totalSize > this.config.maxLocalStorageSize!) {
        // Remove oldest logs
        const logs = this.getStoredLogs('auraos_logs');
        const trimmedLogs = logs.slice(-Math.floor(logs.length / 2));
        localStorage.setItem('auraos_logs', JSON.stringify(trimmedLogs));
      }
    } catch (error) {
      console.warn('Failed to cleanup localStorage:', error);
    }
  }

  // =============================================================================
  // 📋 Public API Methods
  // =============================================================================

  public getLogs(level?: ClientLogLevel, limit = 100): ClientLogEntry[] {
    let logs = this.logBuffer;

    if (level !== undefined) {
      logs = logs.filter(log => log.level === level);
    }

    return logs.slice(-limit);
  }

  public getStoredLogs(level?: ClientLogLevel, limit = 100): ClientLogEntry[] {
    const logs = this.getStoredLogs('auraos_logs');

    if (level !== undefined) {
      return logs.filter(log => log.level === level).slice(-limit);
    }

    return logs.slice(-limit);
  }

  public getErrorCounts(): Map<string, number> {
    return new Map(this.errorCounts);
  }

  public clearLogs(): void {
    this.logBuffer = [];
    this.errorCounts.clear();
    localStorage.removeItem('auraos_logs');
    sessionStorage.removeItem('auraos_session_logs');
  }

  public setLevel(level: ClientLogLevel): void {
    this.config.level = level;
    this.info('Log level changed', { newLevel: ClientLogLevel[level] });
  }

  public addTransport(transport: ClientLogTransport): void {
    if (!this.config.transports.includes(transport)) {
      this.config.transports.push(transport);
      this.info('Transport added', { transport });
    }
  }

  public removeTransport(transport: ClientLogTransport): void {
    const index = this.config.transports.indexOf(transport);
    if (index > -1) {
      this.config.transports.splice(index, 1);
      this.info('Transport removed', { transport });
    }
  }

  // =============================================================================
  // 🎯 Specialized Logging Methods
  // =============================================================================

  public logUserAction(
    userId: string,
    action: string,
    context?: Record<string, any>
  ): void {
    this.info(`User action: ${action}`, context, {
      userId,
      action,
      component: 'user-action',
    });
  }

  public logPerformance(
    operation: string,
    duration: number,
    context?: Record<string, any>
  ): void {
    this.info(`Performance: ${operation}`, context, {
      action: 'performance',
      duration,
      component: 'performance',
    });
  }

  public logNavigation(
    from: string,
    to: string,
    context?: Record<string, any>
  ): void {
    this.info(`Navigation: ${from} → ${to}`, context, {
      action: 'navigation',
      component: 'router',
    });
  }

  public logAPI(
    method: string,
    endpoint: string,
    statusCode: number,
    duration?: number
  ): void {
    this.info(
      `API ${method} ${endpoint}`,
      {
        method,
        endpoint,
        statusCode,
        duration,
      },
      {
        action: 'api-call',
        component: 'api',
        duration,
      }
    );
  }

  public logSecurity(event: string, context?: Record<string, any>): void {
    this.warn(`Security event: ${event}`, context, {
      action: 'security',
      component: 'security',
    });
  }
}

// =============================================================================
// 🚀 Singleton Instance
// =============================================================================

let clientLoggerInstance: AuraOSClientLogger | null = null;

export function getClientLogger(
  config?: Partial<ClientLogConfig>
): AuraOSClientLogger {
  if (!clientLoggerInstance) {
    clientLoggerInstance = new AuraOSClientLogger(config);
  }
  return clientLoggerInstance;
}

export function createClientLogger(
  config?: Partial<ClientLogConfig>
): AuraOSClientLogger {
  return new AuraOSClientLogger(config);
}

// =============================================================================
// 📋 Usage Examples
// =============================================================================

/*
// Basic usage:
import { getClientLogger, ClientLogLevel } from '@/lib/client-logger';

const logger = getClientLogger({
  level: ClientLogLevel.INFO,
  transports: ['console', 'localStorage'],
  enablePerformanceMonitoring: true,
});

logger.info('Application started');
logger.error('Something went wrong', { error: 'Network request failed' });

// User action logging:
logger.logUserAction('user123', 'click', { element: 'button', page: 'dashboard' });

// Performance logging:
logger.logPerformance('api-call', 150, { endpoint: '/api/users' });

// Navigation logging:
logger.logNavigation('/dashboard', '/settings');

// API logging:
logger.logAPI('GET', '/api/users', 200, 45);

// Security logging:
logger.logSecurity('suspicious-activity', { ip: '192.168.1.1' });
*/

export default AuraOSClientLogger;
