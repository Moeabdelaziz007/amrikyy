"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnhancedLogger = exports.enhancedLogger = exports.LogLevel = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const fs_2 = require("fs");
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["DEBUG"] = 0] = "DEBUG";
    LogLevel[LogLevel["INFO"] = 1] = "INFO";
    LogLevel[LogLevel["WARN"] = 2] = "WARN";
    LogLevel[LogLevel["ERROR"] = 3] = "ERROR";
    LogLevel[LogLevel["CRITICAL"] = 4] = "CRITICAL";
})(LogLevel || (exports.LogLevel = LogLevel = {}));
class EnhancedLogger {
    config;
    logStream = null;
    currentLogFile = '';
    logBuffer = [];
    bufferSize = 100;
    flushInterval = null;
    constructor(config = {}) {
        this.config = {
            level: LogLevel.INFO,
            enableConsole: true,
            enableFile: true,
            enableDatabase: false,
            logDirectory: './logs',
            maxFileSize: 10, // 10MB
            maxFiles: 5,
            enableColors: true,
            enableTimestamp: true,
            enableSource: true,
            ...config
        };
        this.initializeLogging();
    }
    /**
     * Initialize logging system
     */
    initializeLogging() {
        // Create logs directory if it doesn't exist
        if (this.config.enableFile && !fs_1.default.existsSync(this.config.logDirectory)) {
            fs_1.default.mkdirSync(this.config.logDirectory, { recursive: true });
        }
        // Set up log file rotation
        if (this.config.enableFile) {
            this.setupLogFile();
        }
        // Set up buffer flushing
        if (this.config.enableDatabase) {
            this.flushInterval = setInterval(() => {
                this.flushBuffer();
            }, 5000); // Flush every 5 seconds
        }
        // Log initialization
        this.info('Enhanced Logger initialized', 'logger', {
            config: {
                level: LogLevel[this.config.level],
                enableConsole: this.config.enableConsole,
                enableFile: this.config.enableFile,
                enableDatabase: this.config.enableDatabase
            }
        });
    }
    /**
     * Set up log file with rotation
     */
    setupLogFile() {
        const timestamp = new Date().toISOString().split('T')[0];
        this.currentLogFile = path_1.default.join(this.config.logDirectory, `auraos-${timestamp}.log`);
        // Close existing stream
        if (this.logStream) {
            this.logStream.end();
        }
        // Create new stream
        this.logStream = (0, fs_2.createWriteStream)(this.currentLogFile, { flags: 'a' });
        // Check file size and rotate if necessary
        this.checkLogRotation();
    }
    /**
     * Check if log rotation is needed
     */
    checkLogRotation() {
        if (!fs_1.default.existsSync(this.currentLogFile))
            return;
        const stats = fs_1.default.statSync(this.currentLogFile);
        const fileSizeMB = stats.size / (1024 * 1024);
        if (fileSizeMB >= this.config.maxFileSize) {
            this.rotateLogFile();
        }
    }
    /**
     * Rotate log files
     */
    rotateLogFile() {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const rotatedFile = path_1.default.join(this.config.logDirectory, `auraos-${timestamp}.log`);
        // Rename current file
        fs_1.default.renameSync(this.currentLogFile, rotatedFile);
        // Clean up old files
        this.cleanupOldLogs();
        // Set up new log file
        this.setupLogFile();
    }
    /**
     * Clean up old log files
     */
    cleanupOldLogs() {
        try {
            const files = fs_1.default.readdirSync(this.config.logDirectory)
                .filter(file => file.startsWith('auraos-') && file.endsWith('.log'))
                .map(file => ({
                name: file,
                path: path_1.default.join(this.config.logDirectory, file),
                mtime: fs_1.default.statSync(path_1.default.join(this.config.logDirectory, file)).mtime
            }))
                .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
            // Remove files beyond maxFiles limit
            if (files.length > this.config.maxFiles) {
                files.slice(this.config.maxFiles).forEach(file => {
                    fs_1.default.unlinkSync(file.path);
                    this.debug(`Removed old log file: ${file.name}`, 'logger');
                });
            }
        }
        catch (error) {
            console.error('Failed to cleanup old logs:', error);
        }
    }
    /**
     * Log a message with specified level
     */
    log(level, message, source = 'system', context, error) {
        if (level < this.config.level)
            return;
        const entry = {
            timestamp: new Date().toISOString(),
            level,
            message,
            source,
            context,
            stack: error?.stack,
            userId: context?.userId,
            sessionId: context?.sessionId,
            requestId: context?.requestId
        };
        // Console logging
        if (this.config.enableConsole) {
            this.logToConsole(entry);
        }
        // File logging
        if (this.config.enableFile) {
            this.logToFile(entry);
        }
        // Database logging
        if (this.config.enableDatabase) {
            this.logBuffer.push(entry);
            if (this.logBuffer.length >= this.bufferSize) {
                this.flushBuffer();
            }
        }
    }
    /**
     * Log to console with colors
     */
    logToConsole(entry) {
        const levelName = LogLevel[entry.level];
        const timestamp = this.config.enableTimestamp ? `[${entry.timestamp}]` : '';
        const source = this.config.enableSource ? `[${entry.source}]` : '';
        const levelColor = this.getLevelColor(entry.level);
        const message = entry.context ? `${entry.message} ${JSON.stringify(entry.context)}` : entry.message;
        if (this.config.enableColors) {
            console.log(`${levelColor}${levelName}${timestamp}${source} ${message}\x1b[0m`);
        }
        else {
            console.log(`${levelName}${timestamp}${source} ${message}`);
        }
        // Log stack trace for errors
        if (entry.stack && entry.level >= LogLevel.ERROR) {
            console.error(entry.stack);
        }
    }
    /**
     * Log to file
     */
    logToFile(entry) {
        if (!this.logStream)
            return;
        const logLine = JSON.stringify({
            timestamp: entry.timestamp,
            level: LogLevel[entry.level],
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
    /**
     * Flush log buffer to database
     */
    flushBuffer() {
        if (this.logBuffer.length === 0)
            return;
        // This would integrate with your database system
        // For now, we'll just clear the buffer
        this.logBuffer = [];
    }
    /**
     * Get color for log level
     */
    getLevelColor(level) {
        const colors = {
            [LogLevel.DEBUG]: '\x1b[36m', // Cyan
            [LogLevel.INFO]: '\x1b[32m', // Green
            [LogLevel.WARN]: '\x1b[33m', // Yellow
            [LogLevel.ERROR]: '\x1b[31m', // Red
            [LogLevel.CRITICAL]: '\x1b[35m' // Magenta
        };
        return colors[level] || '';
    }
    /**
     * Debug level logging
     */
    debug(message, source = 'system', context) {
        this.log(LogLevel.DEBUG, message, source, context);
    }
    /**
     * Info level logging
     */
    info(message, source = 'system', context) {
        this.log(LogLevel.INFO, message, source, context);
    }
    /**
     * Warning level logging
     */
    warn(message, source = 'system', context) {
        this.log(LogLevel.WARN, message, source, context);
    }
    /**
     * Error level logging
     */
    error(message, source = 'system', context, error) {
        this.log(LogLevel.ERROR, message, source, context, error);
    }
    /**
     * Critical level logging
     */
    critical(message, source = 'system', context, error) {
        this.log(LogLevel.CRITICAL, message, source, context, error);
    }
    /**
     * Log HTTP requests
     */
    logRequest(method, url, statusCode, duration, userId, requestId) {
        this.info(`HTTP ${method} ${url}`, 'http', {
            method,
            url,
            statusCode,
            duration,
            userId,
            requestId
        });
    }
    /**
     * Log AI agent activities
     */
    logAgentActivity(agentId, action, result, context) {
        this.info(`Agent ${agentId}: ${action}`, 'ai-agent', {
            agentId,
            action,
            result,
            ...context
        });
    }
    /**
     * Log autopilot activities
     */
    logAutopilotActivity(action, ruleId, workflowId, context) {
        this.info(`Autopilot: ${action}`, 'autopilot', {
            action,
            ruleId,
            workflowId,
            ...context
        });
    }
    /**
     * Log system performance metrics
     */
    logPerformance(metric, value, unit, context) {
        this.info(`Performance: ${metric} = ${value}${unit}`, 'performance', {
            metric,
            value,
            unit,
            ...context
        });
    }
    /**
     * Get recent logs
     */
    getRecentLogs(limit = 100, level) {
        // This would read from your database or log files
        // For now, return empty array
        return [];
    }
    /**
     * Search logs
     */
    searchLogs(query, startDate, endDate, level) {
        // This would search through your database or log files
        // For now, return empty array
        return [];
    }
    /**
     * Update configuration
     */
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        this.info('Logger configuration updated', 'logger', { newConfig });
    }
    /**
     * Cleanup resources
     */
    cleanup() {
        if (this.flushInterval) {
            clearInterval(this.flushInterval);
        }
        if (this.logStream) {
            this.logStream.end();
        }
        // Flush remaining buffer
        this.flushBuffer();
    }
}
exports.EnhancedLogger = EnhancedLogger;
// Create singleton instance
const enhancedLogger = new EnhancedLogger({
    level: process.env.LOG_LEVEL ? parseInt(process.env.LOG_LEVEL) : LogLevel.INFO,
    enableConsole: process.env.NODE_ENV !== 'production',
    enableFile: true,
    enableDatabase: false, // Set to true when you want to store logs in database
    logDirectory: './logs',
    maxFileSize: 10,
    maxFiles: 5
});
exports.enhancedLogger = enhancedLogger;
exports.default = enhancedLogger;
