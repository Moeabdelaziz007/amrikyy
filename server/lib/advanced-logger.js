/**
 * 📝 Advanced Logger for AuraOS
 * مسجل محسن
 */

const fs = require('fs');
const path = require('path');
const { createWriteStream } = require('fs');

const LogLevel = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  CRITICAL: 4
};

class EnhancedLogger {
  constructor(config = {}) {
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

    this.logStream = null;
    this.currentLogFile = "";
    this.logBuffer = [];
    this.bufferSize = 100;
    this.flushInterval = null;

    this.initializeLogging();
  }

  initializeLogging() {
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
        level: Object.keys(LogLevel)[this.config.level],
        enableConsole: this.config.enableConsole,
        enableFile: this.config.enableFile,
        enableDatabase: this.config.enableDatabase
      }
    });
  }

  setupLogFile() {
    const timestamp = new Date().toISOString().split('T')[0];
    this.currentLogFile = path.join(this.config.logDirectory, `auraos-${timestamp}.log`);

    if (this.logStream) {
      this.logStream.end();
    }

    this.logStream = createWriteStream(this.currentLogFile, { flags: 'a' });
    this.checkLogRotation();
  }

  checkLogRotation() {
    if (!fs.existsSync(this.currentLogFile)) return;

    const stats = fs.statSync(this.currentLogFile);
    const fileSizeMB = stats.size / (1024 * 1024);

    if (fileSizeMB >= this.config.maxFileSize) {
      this.rotateLogFile();
    }
  }

  rotateLogFile() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const rotatedFile = path.join(this.config.logDirectory, `auraos-${timestamp}.log`);
    
    fs.renameSync(this.currentLogFile, rotatedFile);
    this.cleanupOldLogs();
    this.setupLogFile();
  }

  cleanupOldLogs() {
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

  log(level, message, source = "system", context, error) {
    if (level < this.config.level) return;

    const entry = {
      timestamp: new Date().toISOString(),
      level: Object.keys(LogLevel)[level],
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

  logToConsole(entry) {
    const levelName = entry.level;
    const timestamp = this.config.enableTimestamp ? `[${entry.timestamp}]` : "";
    const source = this.config.enableSource ? `[${entry.source}]` : "";
    const levelColor = this.getLevelColor(LogLevel[levelName]);
    const message = entry.context ? `${entry.message} ${JSON.stringify(entry.context)}` : entry.message;

    if (this.config.enableColors) {
      console.log(`${levelColor}${levelName}${timestamp}${source} ${message}\x1B[0m`);
    } else {
      console.log(`${levelName}${timestamp}${source} ${message}`);
    }

    if (entry.stack && LogLevel[levelName] >= LogLevel.ERROR) {
      console.error(entry.stack);
    }
  }

  logToFile(entry) {
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

  flushBuffer() {
    if (this.logBuffer.length === 0) return;
    // In a real implementation, this would write to a database
    this.logBuffer = [];
  }

  getLevelColor(level) {
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
  debug(message, source = "system", context) {
    this.log(LogLevel.DEBUG, message, source, context);
  }

  info(message, source = "system", context) {
    this.log(LogLevel.INFO, message, source, context);
  }

  warn(message, source = "system", context) {
    this.log(LogLevel.WARN, message, source, context);
  }

  error(message, source = "system", context, error) {
    this.log(LogLevel.ERROR, message, source, context, error);
  }

  critical(message, source = "system", context, error) {
    this.log(LogLevel.CRITICAL, message, source, context, error);
  }

  // Specialized logging methods
  logRequest(method, url, statusCode, duration, userId, requestId) {
    this.info(`HTTP ${method} ${url}`, "http", {
      method,
      url,
      statusCode,
      duration,
      userId,
      requestId
    });
  }

  logAgentActivity(agentId, action, result, context) {
    this.info(`Agent ${agentId}: ${action}`, "ai-agent", {
      agentId,
      action,
      result,
      ...context
    });
  }

  logAutopilotActivity(action, ruleId, workflowId, context) {
    this.info(`Autopilot: ${action}`, "autopilot", {
      action,
      ruleId,
      workflowId,
      ...context
    });
  }

  logPerformance(metric, value, unit, context) {
    this.info(`Performance: ${metric} = ${value}${unit}`, "performance", {
      metric,
      value,
      unit,
      ...context
    });
  }

  // Utility methods
  getRecentLogs(limit = 100, level) {
    // In a real implementation, this would read from a database
    return [];
  }

  searchLogs(query, startDate, endDate, level) {
    // In a real implementation, this would search a database
    return [];
  }

  updateConfig(newConfig) {
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
let enhancedLogger;

function getLogger() {
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

module.exports = { EnhancedLogger, getLogger, LogLevel };
