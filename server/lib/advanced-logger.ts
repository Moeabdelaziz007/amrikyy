// =============================================================================
// 📝 AuraOS Advanced Logging Service
// =============================================================================
// 
// Comprehensive logging service with multiple transports, levels, and features
// Supports structured logging, performance monitoring, and error tracking
//
// =============================================================================

import fs from 'fs';
import path from 'path';
import { EventEmitter } from 'events';

// =============================================================================
// 🔧 Types and Interfaces
// =============================================================================

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
  VERBOSE = 4,
}

export enum LogTransport {
  CONSOLE = 'console',
  FILE = 'file',
  DATABASE = 'database',
  REMOTE = 'remote',
  MEMORY = 'memory',
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  metadata?: {
    userId?: string;
    sessionId?: string;
    requestId?: string;
    component?: string;
    action?: string;
    duration?: number;
    memory?: number;
    cpu?: number;
  };
  stack?: string;
  tags?: string[];
}

export interface LogConfig {
  level: LogLevel;
  transports: LogTransport[];
  filePath?: string;
  maxFileSize?: number;
  maxFiles?: number;
  enablePerformanceMonitoring?: boolean;
  enableMemoryMonitoring?: boolean;
  enableErrorTracking?: boolean;
  enableStructuredLogging?: boolean;
  remoteEndpoint?: string;
  remoteApiKey?: string;
}

// =============================================================================
// 🚀 Advanced Logger Class
// =============================================================================

export class AuraOSLogger extends EventEmitter {
  private config: LogConfig;
  private logBuffer: LogEntry[] = [];
  private performanceMetrics: Map<string, number> = new Map();
  private errorCounts: Map<string, number> = new Map();
  private isInitialized = false;

  constructor(config: Partial<LogConfig> = {}) {
    super();
    
    this.config = {
      level: LogLevel.INFO,
      transports: [LogTransport.CONSOLE],
      maxFileSize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5,
      enablePerformanceMonitoring: true,
      enableMemoryMonitoring: true,
      enableErrorTracking: true,
      enableStructuredLogging: true,
      ...config,
    };

    this.initialize();
  }

  // =============================================================================
  // 🔧 Initialization
  // =============================================================================

  private initialize(): void {
    try {
      // Create log directory if file transport is enabled
      if (this.config.transports.includes(LogTransport.FILE) && this.config.filePath) {
        const logDir = path.dirname(this.config.filePath);
        if (!fs.existsSync(logDir)) {
          fs.mkdirSync(logDir, { recursive: true });
        }
      }

      // Setup performance monitoring
      if (this.config.enablePerformanceMonitoring) {
        this.setupPerformanceMonitoring();
      }

      // Setup memory monitoring
      if (this.config.enableMemoryMonitoring) {
        this.setupMemoryMonitoring();
      }

      // Setup error tracking
      if (this.config.enableErrorTracking) {
        this.setupErrorTracking();
      }

      this.isInitialized = true;
      this.info('AuraOS Logger initialized successfully', {
        config: {
          level: LogLevel[this.config.level],
          transports: this.config.transports,
          performanceMonitoring: this.config.enablePerformanceMonitoring,
          memoryMonitoring: this.config.enableMemoryMonitoring,
          errorTracking: this.config.enableErrorTracking,
        },
      });

    } catch (error) {
      console.error('Failed to initialize AuraOS Logger:', error);
      throw error;
    }
  }

  // =============================================================================
  // 📝 Core Logging Methods
  // =============================================================================

  public error(message: string, context?: Record<string, any>, metadata?: LogEntry['metadata']): void {
    this.log(LogLevel.ERROR, message, context, metadata);
  }

  public warn(message: string, context?: Record<string, any>, metadata?: LogEntry['metadata']): void {
    this.log(LogLevel.WARN, message, context, metadata);
  }

  public info(message: string, context?: Record<string, any>, metadata?: LogEntry['metadata']): void {
    this.log(LogLevel.INFO, message, context, metadata);
  }

  public debug(message: string, context?: Record<string, any>, metadata?: LogEntry['metadata']): void {
    this.log(LogLevel.DEBUG, message, context, metadata);
  }

  public verbose(message: string, context?: Record<string, any>, metadata?: LogEntry['metadata']): void {
    this.log(LogLevel.VERBOSE, message, context, metadata);
  }

  // =============================================================================
  // 🔍 Main Log Method
  // =============================================================================

  private log(level: LogLevel, message: string, context?: Record<string, any>, metadata?: LogEntry['metadata']): void {
    if (level > this.config.level) {
      return; // Skip if level is below configured threshold
    }

    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      metadata: {
        ...metadata,
        memory: this.config.enableMemoryMonitoring ? this.getMemoryUsage() : undefined,
      },
      tags: this.generateTags(level, context),
    };

    // Add stack trace for errors
    if (level === LogLevel.ERROR) {
      logEntry.stack = new Error().stack;
    }

    // Process through transports
    this.processTransports(logEntry);

    // Add to buffer for memory transport
    if (this.config.transports.includes(LogTransport.MEMORY)) {
      this.addToBuffer(logEntry);
    }

    // Emit event for external listeners
    this.emit('log', logEntry);

    // Track errors
    if (level === LogLevel.ERROR && this.config.enableErrorTracking) {
      this.trackError(message, context);
    }
  }

  // =============================================================================
  // 🚚 Transport Processing
  // =============================================================================

  private processTransports(logEntry: LogEntry): void {
    this.config.transports.forEach(transport => {
      try {
        switch (transport) {
          case LogTransport.CONSOLE:
            this.logToConsole(logEntry);
            break;
          case LogTransport.FILE:
            this.logToFile(logEntry);
            break;
          case LogTransport.DATABASE:
            this.logToDatabase(logEntry);
            break;
          case LogTransport.REMOTE:
            this.logToRemote(logEntry);
            break;
        }
      } catch (error) {
        console.error(`Failed to log to ${transport}:`, error);
      }
    });
  }

  private logToConsole(logEntry: LogEntry): void {
    const levelName = LogLevel[logEntry.level];
    const timestamp = logEntry.timestamp;
    const contextStr = logEntry.context ? JSON.stringify(logEntry.context, null, 2) : '';
    const metadataStr = logEntry.metadata ? JSON.stringify(logEntry.metadata, null, 2) : '';

    const logMessage = `[${timestamp}] ${levelName}: ${logEntry.message}`;
    
    switch (logEntry.level) {
      case LogLevel.ERROR:
        console.error(logMessage);
        if (contextStr) console.error('Context:', contextStr);
        if (metadataStr) console.error('Metadata:', metadataStr);
        if (logEntry.stack) console.error('Stack:', logEntry.stack);
        break;
      case LogLevel.WARN:
        console.warn(logMessage);
        if (contextStr) console.warn('Context:', contextStr);
        if (metadataStr) console.warn('Metadata:', metadataStr);
        break;
      case LogLevel.INFO:
        console.info(logMessage);
        if (contextStr) console.info('Context:', contextStr);
        if (metadataStr) console.info('Metadata:', metadataStr);
        break;
      case LogLevel.DEBUG:
        console.debug(logMessage);
        if (contextStr) console.debug('Context:', contextStr);
        if (metadataStr) console.debug('Metadata:', metadataStr);
        break;
      case LogLevel.VERBOSE:
        console.log(logMessage);
        if (contextStr) console.log('Context:', contextStr);
        if (metadataStr) console.log('Metadata:', metadataStr);
        break;
    }
  }

  private logToFile(logEntry: LogEntry): void {
    if (!this.config.filePath) return;

    const logLine = this.config.enableStructuredLogging
      ? JSON.stringify(logEntry) + '\n'
      : `[${logEntry.timestamp}] ${LogLevel[logEntry.level]}: ${logEntry.message}\n`;

    fs.appendFileSync(this.config.filePath, logLine);

    // Rotate file if it exceeds max size
    this.rotateLogFile();
  }

  private logToDatabase(logEntry: LogEntry): void {
    // Implementation would depend on your database choice
    // This is a placeholder for database logging
    console.log('Database logging not implemented yet');
  }

  private logToRemote(logEntry: LogEntry): void {
    if (!this.config.remoteEndpoint || !this.config.remoteApiKey) return;

    // Implementation would send logs to remote service
    // This is a placeholder for remote logging
    console.log('Remote logging not implemented yet');
  }

  // =============================================================================
  // 🔄 Log Rotation
  // =============================================================================

  private rotateLogFile(): void {
    if (!this.config.filePath || !fs.existsSync(this.config.filePath)) return;

    const stats = fs.statSync(this.config.filePath);
    if (stats.size < this.config.maxFileSize!) return;

    const basePath = this.config.filePath.replace(/\.log$/, '');
    const ext = '.log';

    // Rotate existing files
    for (let i = this.config.maxFiles! - 1; i > 0; i--) {
      const oldFile = `${basePath}.${i}${ext}`;
      const newFile = `${basePath}.${i + 1}${ext}`;
      
      if (fs.existsSync(oldFile)) {
        if (i === this.config.maxFiles! - 1) {
          fs.unlinkSync(oldFile); // Delete oldest file
        } else {
          fs.renameSync(oldFile, newFile);
        }
      }
    }

    // Move current file to .1
    fs.renameSync(this.config.filePath, `${basePath}.1${ext}`);
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
  }

  private getPerformanceMetrics(): Record<string, number> {
    const metrics: Record<string, number> = {};
    
    // CPU usage (simplified)
    const startUsage = process.cpuUsage();
    setTimeout(() => {
      const endUsage = process.cpuUsage(startUsage);
      metrics.cpuUser = endUsage.user / 1000000; // Convert to seconds
      metrics.cpuSystem = endUsage.system / 1000000;
    }, 100);

    // Memory usage
    const memUsage = process.memoryUsage();
    metrics.memoryRss = memUsage.rss;
    metrics.memoryHeapTotal = memUsage.heapTotal;
    metrics.memoryHeapUsed = memUsage.heapUsed;
    metrics.memoryExternal = memUsage.external;

    // Uptime
    metrics.uptime = process.uptime();

    return metrics;
  }

  // =============================================================================
  // 🧠 Memory Monitoring
  // =============================================================================

  private setupMemoryMonitoring(): void {
    setInterval(() => {
      const memUsage = this.getMemoryUsage();
      if (memUsage > 100 * 1024 * 1024) { // 100MB threshold
        this.warn('High memory usage detected', { memoryUsage: memUsage });
      }
    }, 30000); // Every 30 seconds
  }

  private getMemoryUsage(): number {
    return process.memoryUsage().heapUsed;
  }

  // =============================================================================
  // 🚨 Error Tracking
  // =============================================================================

  private setupErrorTracking(): void {
    process.on('uncaughtException', (error) => {
      this.error('Uncaught Exception', { error: error.message, stack: error.stack });
    });

    process.on('unhandledRejection', (reason, promise) => {
      this.error('Unhandled Rejection', { reason, promise });
    });
  }

  private trackError(message: string, context?: Record<string, any>): void {
    const errorKey = `${message}:${JSON.stringify(context)}`;
    const count = this.errorCounts.get(errorKey) || 0;
    this.errorCounts.set(errorKey, count + 1);

    // Alert if error occurs frequently
    if (count > 10) {
      this.warn('Frequent error detected', { errorKey, count });
    }
  }

  // =============================================================================
  // 🔧 Utility Methods
  // =============================================================================

  private addToBuffer(logEntry: LogEntry): void {
    this.logBuffer.push(logEntry);
    
    // Keep buffer size manageable
    if (this.logBuffer.length > 1000) {
      this.logBuffer = this.logBuffer.slice(-500);
    }
  }

  private generateTags(level: LogLevel, context?: Record<string, any>): string[] {
    const tags: string[] = [];
    
    // Add level tag
    tags.push(LogLevel[level].toLowerCase());
    
    // Add context-based tags
    if (context) {
      if (context.userId) tags.push('user-action');
      if (context.component) tags.push(`component:${context.component}`);
      if (context.action) tags.push(`action:${context.action}`);
    }
    
    return tags;
  }

  // =============================================================================
  // 📋 Public API Methods
  // =============================================================================

  public getLogs(level?: LogLevel, limit = 100): LogEntry[] {
    let logs = this.logBuffer;
    
    if (level !== undefined) {
      logs = logs.filter(log => log.level === level);
    }
    
    return logs.slice(-limit);
  }

  public getErrorCounts(): Map<string, number> {
    return new Map(this.errorCounts);
  }

  public getPerformanceMetrics(): Record<string, number> {
    return this.getPerformanceMetrics();
  }

  public clearLogs(): void {
    this.logBuffer = [];
    this.errorCounts.clear();
  }

  public setLevel(level: LogLevel): void {
    this.config.level = level;
    this.info('Log level changed', { newLevel: LogLevel[level] });
  }

  public addTransport(transport: LogTransport): void {
    if (!this.config.transports.includes(transport)) {
      this.config.transports.push(transport);
      this.info('Transport added', { transport });
    }
  }

  public removeTransport(transport: LogTransport): void {
    const index = this.config.transports.indexOf(transport);
    if (index > -1) {
      this.config.transports.splice(index, 1);
      this.info('Transport removed', { transport });
    }
  }

  // =============================================================================
  // 🎯 Specialized Logging Methods
  // =============================================================================

  public logUserAction(userId: string, action: string, context?: Record<string, any>): void {
    this.info(`User action: ${action}`, context, {
      userId,
      action,
      component: 'user-action',
    });
  }

  public logPerformance(operation: string, duration: number, context?: Record<string, any>): void {
    this.info(`Performance: ${operation}`, context, {
      action: 'performance',
      duration,
      component: 'performance',
    });
  }

  public logSecurity(event: string, context?: Record<string, any>): void {
    this.warn(`Security event: ${event}`, context, {
      action: 'security',
      component: 'security',
    });
  }

  public logAPI(method: string, endpoint: string, statusCode: number, duration?: number): void {
    this.info(`API ${method} ${endpoint}`, {
      method,
      endpoint,
      statusCode,
      duration,
    }, {
      action: 'api-call',
      component: 'api',
      duration,
    });
  }
}

// =============================================================================
// 🚀 Singleton Instance
// =============================================================================

let loggerInstance: AuraOSLogger | null = null;

export function getLogger(config?: Partial<LogConfig>): AuraOSLogger {
  if (!loggerInstance) {
    loggerInstance = new AuraOSLogger(config);
  }
  return loggerInstance;
}

export function createLogger(config?: Partial<LogConfig>): AuraOSLogger {
  return new AuraOSLogger(config);
}

// =============================================================================
// 📋 Usage Examples
// =============================================================================

/*
// Basic usage:
import { getLogger, LogLevel } from '@/lib/logger';

const logger = getLogger({
  level: LogLevel.INFO,
  transports: ['console', 'file'],
  filePath: './logs/auraos.log',
  enablePerformanceMonitoring: true,
});

logger.info('Application started');
logger.error('Something went wrong', { error: 'Database connection failed' });

// User action logging:
logger.logUserAction('user123', 'login', { ip: '192.168.1.1' });

// Performance logging:
logger.logPerformance('database-query', 150, { query: 'SELECT * FROM users' });

// API logging:
logger.logAPI('GET', '/api/users', 200, 45);

// Security logging:
logger.logSecurity('failed-login', { userId: 'user123', ip: '192.168.1.1' });
*/

export default AuraOSLogger;
