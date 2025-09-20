import { Request, Response } from 'express';

// Security event types
export enum SecurityEventType {
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILED = 'LOGIN_FAILED',
  LOGOUT = 'LOGOUT',
  UNAUTHORIZED_ACCESS = 'UNAUTHORIZED_ACCESS',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  SUSPICIOUS_REQUEST = 'SUSPICIOUS_REQUEST',
  DATA_ACCESS = 'DATA_ACCESS',
  ADMIN_ACTION = 'ADMIN_ACTION',
  FILE_UPLOAD = 'FILE_UPLOAD',
  PASSWORD_CHANGE = 'PASSWORD_CHANGE',
  ACCOUNT_LOCKED = 'ACCOUNT_LOCKED',
  SQL_INJECTION_ATTEMPT = 'SQL_INJECTION_ATTEMPT',
  XSS_ATTEMPT = 'XSS_ATTEMPT',
  PATH_TRAVERSAL_ATTEMPT = 'PATH_TRAVERSAL_ATTEMPT',
  CSRF_ATTEMPT = 'CSRF_ATTEMPT'
}

// Security event interface
export interface SecurityEvent {
  id: string;
  type: SecurityEventType;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  timestamp: Date;
  userId?: string;
  userRole?: string;
  ipAddress: string;
  userAgent: string;
  endpoint: string;
  method: string;
  statusCode: number;
  details: Record<string, any>;
  sessionId?: string;
  geolocation?: {
    country?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
  };
}

// Security monitoring configuration
interface SecurityMonitoringConfig {
  enableRealTimeAlerts: boolean;
  enableGeolocationTracking: boolean;
  enableSessionTracking: boolean;
  logRetentionDays: number;
  alertThresholds: {
    failedLogins: number;
    suspiciousRequests: number;
    rateLimitViolations: number;
  };
  alertChannels: ('email' | 'webhook' | 'slack')[];
}

const defaultConfig: SecurityMonitoringConfig = {
  enableRealTimeAlerts: true,
  enableGeolocationTracking: false,
  enableSessionTracking: true,
  logRetentionDays: 90,
  alertThresholds: {
    failedLogins: 5,
    suspiciousRequests: 10,
    rateLimitViolations: 20
  },
  alertChannels: ['webhook']
};

// Security event storage (in production, use a proper database)
const securityEvents: SecurityEvent[] = [];
const userActivityCounters = new Map<string, Map<string, number>>();
const ipActivityCounters = new Map<string, Map<string, number>>();

// Security monitoring class
export class SecurityMonitor {
  private config: SecurityMonitoringConfig;
  private alertCooldowns = new Map<string, number>();

  constructor(config: Partial<SecurityMonitoringConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
  }

  // Log security event
  async logSecurityEvent(event: Omit<SecurityEvent, 'id' | 'timestamp'>): Promise<void> {
    const securityEvent: SecurityEvent = {
      ...event,
      id: this.generateEventId(),
      timestamp: new Date()
    };

    // Store event
    securityEvents.push(securityEvent);

    // Update counters
    this.updateCounters(securityEvent);

    // Check for alerts
    await this.checkAlerts(securityEvent);

    // Log to console (in production, use proper logging service)
    this.logToConsole(securityEvent);

    // Cleanup old events
    this.cleanupOldEvents();
  }

  // Create security event from request
  createEventFromRequest(
    req: Request,
    res: Response,
    eventType: SecurityEventType,
    severity: SecurityEvent['severity'] = 'MEDIUM',
    details: Record<string, any> = {}
  ): Omit<SecurityEvent, 'id' | 'timestamp'> {
    const user = (req as any).user;

    return {
      type: eventType,
      severity,
      userId: user?.uid,
      userRole: user?.role,
      ipAddress: req.ip || req.connection.remoteAddress || 'unknown',
      userAgent: req.get('User-Agent') || 'unknown',
      endpoint: req.originalUrl,
      method: req.method,
      statusCode: res.statusCode,
      details,
      sessionId: user?.sessionId
    };
  }

  // Get security events
  getSecurityEvents(filters: {
    type?: SecurityEventType;
    severity?: SecurityEvent['severity'];
    userId?: string;
    ipAddress?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  } = {}): SecurityEvent[] {
    let filteredEvents = [...securityEvents];

    if (filters.type) {
      filteredEvents = filteredEvents.filter(event => event.type === filters.type);
    }

    if (filters.severity) {
      filteredEvents = filteredEvents.filter(event => event.severity === filters.severity);
    }

    if (filters.userId) {
      filteredEvents = filteredEvents.filter(event => event.userId === filters.userId);
    }

    if (filters.ipAddress) {
      filteredEvents = filteredEvents.filter(event => event.ipAddress === filters.ipAddress);
    }

    if (filters.startDate) {
      filteredEvents = filteredEvents.filter(event => event.timestamp >= filters.startDate!);
    }

    if (filters.endDate) {
      filteredEvents = filteredEvents.filter(event => event.timestamp <= filters.endDate!);
    }

    // Sort by timestamp (newest first)
    filteredEvents.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    if (filters.limit) {
      filteredEvents = filteredEvents.slice(0, filters.limit);
    }

    return filteredEvents;
  }

  // Get security statistics
  getSecurityStatistics(timeRange: '1h' | '24h' | '7d' | '30d' = '24h'): {
    totalEvents: number;
    eventsByType: Record<string, number>;
    eventsBySeverity: Record<string, number>;
    topIPAddresses: Array<{ ip: string; count: number }>;
    topUsers: Array<{ userId: string; count: number }>;
    criticalEvents: number;
    suspiciousIPs: string[];
  } {
    const now = new Date();
    const startTime = new Date(now.getTime() - this.getTimeRangeMs(timeRange));

    const relevantEvents = securityEvents.filter(event => event.timestamp >= startTime);

    const eventsByType: Record<string, number> = {};
    const eventsBySeverity: Record<string, number> = {};
    const ipCounts = new Map<string, number>();
    const userCounts = new Map<string, number>();
    let criticalEvents = 0;
    const suspiciousIPs = new Set<string>();

    for (const event of relevantEvents) {
      // Count by type
      eventsByType[event.type] = (eventsByType[event.type] || 0) + 1;

      // Count by severity
      eventsBySeverity[event.severity] = (eventsBySeverity[event.severity] || 0) + 1;

      // Count by IP
      ipCounts.set(event.ipAddress, (ipCounts.get(event.ipAddress) || 0) + 1);

      // Count by user
      if (event.userId) {
        userCounts.set(event.userId, (userCounts.get(event.userId) || 0) + 1);
      }

      // Count critical events
      if (event.severity === 'CRITICAL') {
        criticalEvents++;
      }

      // Identify suspicious IPs
      if (event.type === SecurityEventType.SUSPICIOUS_REQUEST ||
          event.type === SecurityEventType.SQL_INJECTION_ATTEMPT ||
          event.type === SecurityEventType.XSS_ATTEMPT) {
        suspiciousIPs.add(event.ipAddress);
      }
    }

    return {
      totalEvents: relevantEvents.length,
      eventsByType,
      eventsBySeverity,
      topIPAddresses: Array.from(ipCounts.entries())
        .map(([ip, count]) => ({ ip, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10),
      topUsers: Array.from(userCounts.entries())
        .map(([userId, count]) => ({ userId, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10),
      criticalEvents,
      suspiciousIPs: Array.from(suspiciousIPs)
    };
  }

  // Detect suspicious patterns
  detectSuspiciousPatterns(req: Request): {
    isSuspicious: boolean;
    patterns: string[];
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  } {
    const patterns: string[] = [];
    let severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';

    const url = req.originalUrl.toLowerCase();
    const userAgent = (req.get('User-Agent') || '').toLowerCase();
    const body = JSON.stringify(req.body || {}).toLowerCase();

    // SQL Injection patterns
    const sqlPatterns = [
      /union.*select/i,
      /select.*from/i,
      /insert.*into/i,
      /update.*set/i,
      /delete.*from/i,
      /drop.*table/i,
      /exec\s*\(/i,
      /script.*alert/i
    ];

    for (const pattern of sqlPatterns) {
      if (pattern.test(url) || pattern.test(body)) {
        patterns.push('SQL_INJECTION_ATTEMPT');
        severity = 'HIGH';
      }
    }

    // XSS patterns
    const xssPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /<iframe/i,
      /<object/i,
      /<embed/i
    ];

    for (const pattern of xssPatterns) {
      if (pattern.test(url) || pattern.test(body)) {
        patterns.push('XSS_ATTEMPT');
        severity = 'HIGH';
      }
    }

    // Path traversal patterns
    const pathTraversalPatterns = [
      /\.\.\//,
      /\.\.\\/,
      /%2e%2e%2f/i,
      /%2e%2e%5c/i
    ];

    for (const pattern of pathTraversalPatterns) {
      if (pattern.test(url)) {
        patterns.push('PATH_TRAVERSAL_ATTEMPT');
        severity = 'MEDIUM';
      }
    }

    // Suspicious user agents
    const suspiciousUserAgents = [
      /bot/i,
      /crawler/i,
      /spider/i,
      /scraper/i,
      /curl/i,
      /wget/i,
      /python/i,
      /php/i
    ];

    for (const pattern of suspiciousUserAgents) {
      if (pattern.test(userAgent)) {
        patterns.push('SUSPICIOUS_USER_AGENT');
        severity = 'LOW';
      }
    }

    return {
      isSuspicious: patterns.length > 0,
      patterns,
      severity: patterns.length > 2 ? 'CRITICAL' : severity
    };
  }

  // Private methods
  private generateEventId(): string {
    return 'sec_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  private updateCounters(event: SecurityEvent): void {
    // Update user activity counter
    if (event.userId) {
      const userCounters = userActivityCounters.get(event.userId) || new Map();
      const count = userCounters.get(event.type) || 0;
      userCounters.set(event.type, count + 1);
      userActivityCounters.set(event.userId, userCounters);
    }

    // Update IP activity counter
    const ipCounters = ipActivityCounters.get(event.ipAddress) || new Map();
    const count = ipCounters.get(event.type) || 0;
    ipCounters.set(event.type, count + 1);
    ipActivityCounters.set(event.ipAddress, ipCounters);
  }

  private async checkAlerts(event: SecurityEvent): Promise<void> {
    if (!this.config.enableRealTimeAlerts) return;

    const alertKey = `${event.type}_${event.userId || event.ipAddress}`;
    const cooldownMs = 5 * 60 * 1000; // 5 minutes

    // Check cooldown
    const lastAlert = this.alertCooldowns.get(alertKey);
    if (lastAlert && Date.now() - lastAlert < cooldownMs) {
      return;
    }

    // Check thresholds
    let shouldAlert = false;

    if (event.type === SecurityEventType.LOGIN_FAILED) {
      const userCounters = userActivityCounters.get(event.userId || '');
      const failedLogins = userCounters?.get(SecurityEventType.LOGIN_FAILED) || 0;
      if (failedLogins >= this.config.alertThresholds.failedLogins) {
        shouldAlert = true;
      }
    }

    if (event.type === SecurityEventType.SUSPICIOUS_REQUEST) {
      const ipCounters = ipActivityCounters.get(event.ipAddress);
      const suspiciousRequests = ipCounters?.get(SecurityEventType.SUSPICIOUS_REQUEST) || 0;
      if (suspiciousRequests >= this.config.alertThresholds.suspiciousRequests) {
        shouldAlert = true;
      }
    }

    if (event.type === SecurityEventType.RATE_LIMIT_EXCEEDED) {
      const ipCounters = ipActivityCounters.get(event.ipAddress);
      const rateLimitViolations = ipCounters?.get(SecurityEventType.RATE_LIMIT_EXCEEDED) || 0;
      if (rateLimitViolations >= this.config.alertThresholds.rateLimitViolations) {
        shouldAlert = true;
      }
    }

    // Always alert on critical events
    if (event.severity === 'CRITICAL') {
      shouldAlert = true;
    }

    if (shouldAlert) {
      await this.sendAlert(event);
      this.alertCooldowns.set(alertKey, Date.now());
    }
  }

  private async sendAlert(event: SecurityEvent): Promise<void> {
    const alertMessage = {
      title: `Security Alert: ${event.type}`,
      severity: event.severity,
      timestamp: event.timestamp.toISOString(),
      details: {
        type: event.type,
        userId: event.userId,
        ipAddress: event.ipAddress,
        endpoint: event.endpoint,
        method: event.method,
        userAgent: event.userAgent,
        details: event.details
      }
    };

    // Log alert
    console.warn('SECURITY ALERT:', alertMessage);

    // In production, send to alert channels
    for (const channel of this.config.alertChannels) {
      try {
        switch (channel) {
          case 'webhook':
            await this.sendWebhookAlert(alertMessage);
            break;
          case 'email':
            await this.sendEmailAlert(alertMessage);
            break;
          case 'slack':
            await this.sendSlackAlert(alertMessage);
            break;
        }
      } catch (error) {
        console.error(`Failed to send alert via ${channel}:`, error);
      }
    }
  }

  private async sendWebhookAlert(alert: any): Promise<void> {
    // In production, implement webhook alerting
    console.log('Webhook alert would be sent:', alert);
  }

  private async sendEmailAlert(alert: any): Promise<void> {
    // In production, implement email alerting
    console.log('Email alert would be sent:', alert);
  }

  private async sendSlackAlert(alert: any): Promise<void> {
    // In production, implement Slack alerting
    console.log('Slack alert would be sent:', alert);
  }

  private logToConsole(event: SecurityEvent): void {
    const logLevel = event.severity === 'CRITICAL' ? 'error' : 
                    event.severity === 'HIGH' ? 'warn' : 'info';
    
    console[logLevel](`Security Event [${event.severity}]:`, {
      type: event.type,
      userId: event.userId,
      ipAddress: event.ipAddress,
      endpoint: event.endpoint,
      method: event.method,
      timestamp: event.timestamp.toISOString()
    });
  }

  private cleanupOldEvents(): void {
    const cutoffDate = new Date(Date.now() - (this.config.logRetentionDays * 24 * 60 * 60 * 1000));
    const initialLength = securityEvents.length;
    
    // Remove old events
    for (let i = securityEvents.length - 1; i >= 0; i--) {
      if (securityEvents[i].timestamp < cutoffDate) {
        securityEvents.splice(i, 1);
      }
    }

    const removedCount = initialLength - securityEvents.length;
    if (removedCount > 0) {
      console.log(`Cleaned up ${removedCount} old security events`);
    }
  }

  private getTimeRangeMs(timeRange: string): number {
    switch (timeRange) {
      case '1h': return 60 * 60 * 1000;
      case '24h': return 24 * 60 * 60 * 1000;
      case '7d': return 7 * 24 * 60 * 60 * 1000;
      case '30d': return 30 * 24 * 60 * 60 * 1000;
      default: return 24 * 60 * 60 * 1000;
    }
  }
}

// Global security monitor instance
export const securityMonitor = new SecurityMonitor();

// Middleware for automatic security event logging
export const securityEventLogger = (req: Request, res: Response, next: any) => {
  const startTime = Date.now();

  res.on('finish', async () => {
    const duration = Date.now() - startTime;
    const user = (req as any).user;

    // Determine event type based on response
    let eventType: SecurityEventType;
    let severity: SecurityEvent['severity'] = 'LOW';

    if (res.statusCode === 401) {
      eventType = SecurityEventType.UNAUTHORIZED_ACCESS;
      severity = 'MEDIUM';
    } else if (res.statusCode === 403) {
      eventType = SecurityEventType.UNAUTHORIZED_ACCESS;
      severity = 'HIGH';
    } else if (res.statusCode === 429) {
      eventType = SecurityEventType.RATE_LIMIT_EXCEEDED;
      severity = 'MEDIUM';
    } else if (req.method === 'POST' && req.originalUrl.includes('/login')) {
      eventType = res.statusCode === 200 ? SecurityEventType.LOGIN_SUCCESS : SecurityEventType.LOGIN_FAILED;
      severity = res.statusCode === 200 ? 'LOW' : 'MEDIUM';
    } else if (req.method === 'POST' && req.originalUrl.includes('/logout')) {
      eventType = SecurityEventType.LOGOUT;
      severity = 'LOW';
    } else {
      eventType = SecurityEventType.DATA_ACCESS;
      severity = 'LOW';
    }

    // Check for suspicious patterns
    const suspiciousCheck = securityMonitor.detectSuspiciousPatterns(req);
    if (suspiciousCheck.isSuspicious) {
      await securityMonitor.logSecurityEvent(
        securityMonitor.createEventFromRequest(req, res, SecurityEventType.SUSPICIOUS_REQUEST, suspiciousCheck.severity, {
          detectedPatterns: suspiciousCheck.patterns
        })
      );
    }

    // Log the main event
    await securityMonitor.logSecurityEvent(
      securityMonitor.createEventFromRequest(req, res, eventType, severity, {
        duration,
        responseSize: res.get('Content-Length') || 0
      })
    );
  });

  next();
};
