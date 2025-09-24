/**
 * 📝 Enhanced Logger for AuraOS
 * مسجل محسن
 * 
 * This module provides comprehensive logging with rotation, multiple outputs, and structured logging
 */

import fs from 'fs';
import path from 'path';
import { createWriteStream } from 'fs';

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  CRITICAL = 4
}

export interface LoggerConfig {
  level: LogLevel;
  enableConsole: boolean;
  enableFile: boolean;
  enableDatabase: boolean;
  logDirectory: string;
  maxFileSize: number; // in MB
  maxFiles: number;
  enableColors: boolean;
  enableTimestamp: boolean;
  enableSource: boolean;
}

export interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
  source: string;
  context?: any;
  stack?: string;
  userId?: string;
  sessionId?: string;
  requestId?: string;
}

export class EnhancedLogger {
  private config: LoggerConfig;
  private logStream: fs.WriteStream | null = null;
  private currentLogFile = "";
  private logBuffer: LogEntry[] = [];
  private bufferSize = 100;
  private flushInterval: NodeJS.Timeout | null = null;

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = {
      level: LogLevel.INFO,
      enableConsole: true,
      enableFile: true,
      enableDatabase: false,
      logDirectory: "./logs",
      maxFileSize: 10, // 10MB
      maxFiles: 5,
      enableColors: true,
      enableTimestamp: true,
      enableSource: true,
      ...config
    };

    this.initializeLogging();
  }

  private initializeLogging() {
    if (this.config.enableFile && !fs.existsSync(this.config.logDirectory)) {
      fs.mkdirSync(this.config.logDirectory, { recursive: true });
    }

    if (this.config.enableFile) {
      this.setupLogFile();
    }

    if (this.config.enableDatabase) {
      this.flushInterval = setInterval(() => {
        this.flushBuffer();
      }, 5000);
    }

    this.info("Enhanced Logger initialized", "logger", {
      config: {
        level: LogLevel[this.config.level],
        enableConsole: this.config.enableConsole,
        enableFile: this.config.enableFile,
        enableDatabase: this.config.enableDatabase
      }
    });
  }

  private setupLogFile() {
    const timestamp = new Date().toISOString().split('T')[0];
    this.currentLogFile = path.join(this.config.logDirectory, `auraos-${timestamp}.log`);

    if (this.logStream) {
      this.logStream.end();
    }

    this.logStream = createWriteStream(this.currentLogFile, { flags: 'a' });
    this.checkLogRotation();
  }

  private checkLogRotation() {
    if (!fs.existsSync(this.currentLogFile)) return;

    const stats = fs.statSync(this.currentLogFile);
    const fileSizeMB = stats.size / (1024 * 1024);

    if (fileSizeMB >= this.config.maxFileSize) {
      this.rotateLogFile();
    }
  }

  private rotateLogFile() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const rotatedFile = path.join(this.config.logDirectory, `auraos-${timestamp}.log`);
    
    fs.renameSync(this.currentLogFile, rotatedFile);
    this.cleanupOldLogs();
    this.setupLogFile();
  }

  private cleanupOldLogs() {
    try {
      const files = fs.readdirSync(this.config.logDirectory)
        .filter(file => file.startsWith('auraos-') && file.endsWith('.log'))
        .map(file => ({
          name: file,
          path: path.join(this.config.logDirectory, file),
          mtime: fs.statSync(path.join(this.config.logDirectory, file)).mtime
        }))
        .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());

      if (files.length > this.config.maxFiles) {
        files.slice(this.config.maxFiles).forEach(file => {
          fs.unlinkSync(file.path);
          this.debug(`Removed old log file: ${file.name}`, "logger");
        });
      }
    } catch (error) {
      console.error("Failed to cleanup old logs:", error);
    }
  }

  private log(level: LogLevel, message: string, source: string = "system", context?: any, error?: Error) {
    if (level < this.config.level) return;

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: LogLevel[level],
      message,
      source,
      context,
      stack: error?.stack,
      userId: context?.userId,
      sessionId: context?.sessionId,
      requestId: context?.requestId
    };

    if (this.config.enableConsole) {
      this.logToConsole(entry);
    }

    if (this.config.enableFile) {
      this.logToFile(entry);
    }

    if (this.config.enableDatabase) {
      this.logBuffer.push(entry);
      if (this.logBuffer.length >= this.bufferSize) {
        this.flushBuffer();
      }
    }
  }

  private logToConsole(entry: LogEntry) {
    const levelName = entry.level;
    const timestamp = this.config.enableTimestamp ? `[${entry.timestamp}]` : "";
    const source = this.config.enableSource ? `[${entry.source}]` : "";
    const levelColor = this.getLevelColor(LogLevel[levelName as keyof typeof LogLevel]);
    const message = entry.context ? `${entry.message} ${JSON.stringify(entry.context)}` : entry.message;

    if (this.config.enableColors) {
      console.log(`${levelColor}${levelName}${timestamp}${source} ${message}\x1B[0m`);
    } else {
      console.log(`${levelName}${timestamp}${source} ${message}`);
    }

    if (entry.stack && LogLevel[levelName as keyof typeof LogLevel] >= LogLevel.ERROR) {
      console.error(entry.stack);
    }
  }

  private logToFile(entry: LogEntry) {
    if (!this.logStream) return;

    const logLine = JSON.stringify({
      timestamp: entry.timestamp,
      level: entry.level,
      message: entry.message,
      source: entry.source,
      context: entry.context,
      stack: entry.stack,
      userId: entry.userId,
      sessionId: entry.sessionId,
      requestId: entry.requestId
    }) + '\n';

    this.logStream.write(logLine);
  }

  private flushBuffer() {
    if (this.logBuffer.length === 0) return;
    // In a real implementation, this would write to a database
    this.logBuffer = [];
  }

  private getLevelColor(level: LogLevel): string {
    const colors = {
      [LogLevel.DEBUG]: '\x1B[36m',    // Cyan
      [LogLevel.INFO]: '\x1B[32m',     // Green
      [LogLevel.WARN]: '\x1B[33m',     // Yellow
      [LogLevel.ERROR]: '\x1B[31m',    // Red
      [LogLevel.CRITICAL]: '\x1B[35m'  // Magenta
    };
    return colors[level] || "";
  }

  // Public logging methods
  debug(message: string, source: string = "system", context?: any) {
    this.log(LogLevel.DEBUG, message, source, context);
  }

  info(message: string, source: string = "system", context?: any) {
    this.log(LogLevel.INFO, message, source, context);
  }

  warn(message: string, source: string = "system", context?: any) {
    this.log(LogLevel.WARN, message, source, context);
  }

  error(message: string, source: string = "system", context?: any, error?: Error) {
    this.log(LogLevel.ERROR, message, source, context, error);
  }

  critical(message: string, source: string = "system", context?: any, error?: Error) {
    this.log(LogLevel.CRITICAL, message, source, context, error);
  }

  // Specialized logging methods
  logRequest(method: string, url: string, statusCode: number, duration: number, userId?: string, requestId?: string) {
    this.info(`HTTP ${method} ${url}`, "http", {
      method,
      url,
      statusCode,
      duration,
      userId,
      requestId
    });
  }

  logAgentActivity(agentId: string, action: string, result: any, context?: any) {
    this.info(`Agent ${agentId}: ${action}`, "ai-agent", {
      agentId,
      action,
      result,
      ...context
    });
  }

  logAutopilotActivity(action: string, ruleId?: string, workflowId?: string, context?: any) {
    this.info(`Autopilot: ${action}`, "autopilot", {
      action,
      ruleId,
      workflowId,
      ...context
    });
  }

  logPerformance(metric: string, value: number, unit: string, context?: any) {
    this.info(`Performance: ${metric} = ${value}${unit}`, "performance", {
      metric,
      value,
      unit,
      ...context
    });
  }

  // Utility methods
  getRecentLogs(limit: number = 100, level?: LogLevel): LogEntry[] {
    // In a real implementation, this would read from a database
    return [];
  }

  searchLogs(query: string, startDate?: Date, endDate?: Date, level?: LogLevel): LogEntry[] {
    // In a real implementation, this would search a database
    return [];
  }

  updateConfig(newConfig: Partial<LoggerConfig>) {
    this.config = { ...this.config, ...newConfig };
    this.info("Logger configuration updated", "logger", { newConfig });
  }

  cleanup() {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
    }
    if (this.logStream) {
      this.logStream.end();
    }
    this.flushBuffer();
  }
}

// Export singleton instance
let enhancedLogger: EnhancedLogger;

export function getLogger(): EnhancedLogger {
  if (!enhancedLogger) {
    enhancedLogger = new EnhancedLogger({
      level: process.env.LOG_LEVEL ? parseInt(process.env.LOG_LEVEL) : LogLevel.INFO,
      enableConsole: process.env.NODE_ENV !== "production",
      enableFile: true,
      enableDatabase: false, // Set to true when you want to store logs in database
      logDirectory: "./logs",
      maxFileSize: 10,
      maxFiles: 5
    });
  }
  return enhancedLogger;
}