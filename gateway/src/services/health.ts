// Health Check Service - خدمة فحص صحة النظام
import { Logger } from '../utils/logger.js';
import { RedisClient } from './redis.js';
import { MessageBroker } from './messageBroker.js';

interface HealthCheck {
  name: string;
  status: 'healthy' | 'unhealthy' | 'degraded';
  message?: string;
  responseTime?: number;
  timestamp: Date;
  details?: any;
}

interface ServiceHealth {
  name: string;
  url?: string;
  timeout: number;
  checkFunction: () => Promise<boolean>;
}

export class HealthChecker {
  private logger: Logger;
  private checks: Map<string, ServiceHealth> = new Map();
  private healthHistory: HealthCheck[] = [];
  private isRunning: boolean = false;
  private checkInterval?: NodeJS.Timeout;
  private maxHistorySize: number = 100;

  constructor() {
    this.logger = new Logger();
    this.setupDefaultChecks();
  }

  private setupDefaultChecks(): void {
    // System health check
    this.addCheck('system', {
      name: 'System',
      timeout: 5000,
      checkFunction: async () => {
        try {
          const memoryUsage = process.memoryUsage();
          const cpuUsage = process.cpuUsage();
          
          // Check memory usage
          const memoryPercentage = (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100;
          if (memoryPercentage > 90) {
            return false;
          }
          
          // Check if process is responsive
          const startTime = Date.now();
          await new Promise(resolve => setTimeout(resolve, 1));
          const responseTime = Date.now() - startTime;
          
          return responseTime < 1000; // Should respond within 1 second
        } catch (error) {
          this.logger.error('System health check failed', { error });
          return false;
        }
      },
    });

    // Database health check (Redis)
    this.addCheck('redis', {
      name: 'Redis',
      timeout: 5000,
      checkFunction: async () => {
        try {
          // This would be injected from the main application
          return true; // Placeholder
        } catch (error) {
          this.logger.error('Redis health check failed', { error });
          return false;
        }
      },
    });

    // Message broker health check
    this.addCheck('messageBroker', {
      name: 'Message Broker',
      timeout: 5000,
      checkFunction: async () => {
        try {
          // This would be injected from the main application
          return true; // Placeholder
        } catch (error) {
          this.logger.error('Message broker health check failed', { error });
          return false;
        }
      },
    });
  }

  addCheck(id: string, service: ServiceHealth): void {
    this.checks.set(id, service);
    this.logger.info('Health check added', { id, name: service.name });
  }

  removeCheck(id: string): void {
    this.checks.delete(id);
    this.logger.info('Health check removed', { id });
  }

  async start(intervalMs: number = 30000): Promise<void> {
    if (this.isRunning) {
      this.logger.warn('Health checker is already running');
      return;
    }

    this.isRunning = true;
    this.logger.info('Health checker started', { intervalMs });

    // Run initial check
    await this.runAllChecks();

    // Schedule periodic checks
    this.checkInterval = setInterval(async () => {
      await this.runAllChecks();
    }, intervalMs);
  }

  async stop(): Promise<void> {
    if (!this.isRunning) {
      return;
    }

    this.isRunning = false;

    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = undefined;
    }

    this.logger.info('Health checker stopped');
  }

  async runAllChecks(): Promise<HealthCheck[]> {
    const results: HealthCheck[] = [];

    for (const [id, service] of this.checks) {
      try {
        const result = await this.runCheck(id, service);
        results.push(result);
      } catch (error) {
        this.logger.error('Health check error', { error, checkId: id });
        
        results.push({
          name: service.name,
          status: 'unhealthy',
          message: `Check failed: ${error}`,
          timestamp: new Date(),
        });
      }
    }

    // Store results in history
    this.healthHistory.push(...results);
    
    // Keep only recent history
    if (this.healthHistory.length > this.maxHistorySize) {
      this.healthHistory = this.healthHistory.slice(-this.maxHistorySize);
    }

    return results;
  }

  async runCheck(id: string, service: ServiceHealth): Promise<HealthCheck> {
    const startTime = Date.now();
    
    try {
      // Set timeout
      const timeoutPromise = new Promise<boolean>((_, reject) => {
        setTimeout(() => reject(new Error('Health check timeout')), service.timeout);
      });

      // Run health check
      const checkPromise = service.checkFunction();
      
      const isHealthy = await Promise.race([checkPromise, timeoutPromise]);
      const responseTime = Date.now() - startTime;

      const status = isHealthy ? 'healthy' : 'unhealthy';
      
      this.logger.debug('Health check completed', {
        id,
        name: service.name,
        status,
        responseTime,
      });

      return {
        name: service.name,
        status,
        responseTime,
        timestamp: new Date(),
      };

    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      this.logger.error('Health check failed', {
        id,
        name: service.name,
        error: error.message,
        responseTime,
      });

      return {
        name: service.name,
        status: 'unhealthy',
        message: error.message,
        responseTime,
        timestamp: new Date(),
      };
    }
  }

  async runSingleCheck(id: string): Promise<HealthCheck | null> {
    const service = this.checks.get(id);
    if (!service) {
      return null;
    }

    return await this.runCheck(id, service);
  }

  getHealthStatus(): {
    overall: 'healthy' | 'unhealthy' | 'degraded';
    checks: HealthCheck[];
    timestamp: Date;
  } {
    const recentChecks = this.getRecentChecks();
    
    if (recentChecks.length === 0) {
      return {
        overall: 'unhealthy',
        checks: [],
        timestamp: new Date(),
      };
    }

    const healthyCount = recentChecks.filter(check => check.status === 'healthy').length;
    const degradedCount = recentChecks.filter(check => check.status === 'degraded').length;
    const unhealthyCount = recentChecks.filter(check => check.status === 'unhealthy').length;

    let overall: 'healthy' | 'unhealthy' | 'degraded';
    
    if (unhealthyCount > 0) {
      overall = 'unhealthy';
    } else if (degradedCount > 0) {
      overall = 'degraded';
    } else {
      overall = 'healthy';
    }

    return {
      overall,
      checks: recentChecks,
      timestamp: new Date(),
    };
  }

  getRecentChecks(): HealthCheck[] {
    const now = Date.now();
    const fiveMinutesAgo = now - 5 * 60 * 1000;
    
    return this.healthHistory.filter(
      check => check.timestamp.getTime() > fiveMinutesAgo
    );
  }

  getHealthHistory(): HealthCheck[] {
    return [...this.healthHistory];
  }

  getCheckStatus(id: string): HealthCheck | null {
    const recentChecks = this.getRecentChecks();
    return recentChecks.find(check => check.name === id) || null;
  }

  // External service health checks
  async checkHttpService(url: string, timeout: number = 5000): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'User-Agent': 'A2A-Health-Checker/1.0',
        },
      });

      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      this.logger.error('HTTP service check failed', { error, url });
      return false;
    }
  }

  async checkTcpService(host: string, port: number, timeout: number = 5000): Promise<boolean> {
    try {
      const net = require('net');
      
      return new Promise((resolve) => {
        const socket = new net.Socket();
        
        const timeoutId = setTimeout(() => {
          socket.destroy();
          resolve(false);
        }, timeout);

        socket.connect(port, host, () => {
          clearTimeout(timeoutId);
          socket.destroy();
          resolve(true);
        });

        socket.on('error', () => {
          clearTimeout(timeoutId);
          resolve(false);
        });
      });
    } catch (error) {
      this.logger.error('TCP service check failed', { error, host, port });
      return false;
    }
  }

  // Database health checks
  async checkRedis(redisClient: RedisClient): Promise<boolean> {
    try {
      return await redisClient.ping();
    } catch (error) {
      this.logger.error('Redis health check failed', { error });
      return false;
    }
  }

  async checkMessageBroker(messageBroker: MessageBroker): Promise<boolean> {
    try {
      return await messageBroker.ping();
    } catch (error) {
      this.logger.error('Message broker health check failed', { error });
      return false;
    }
  }

  // Custom health check functions
  async checkDiskSpace(path: string, minFreeBytes: number = 1024 * 1024 * 1024): Promise<boolean> {
    try {
      const fs = require('fs');
      const stats = fs.statSync(path);
      
      // This is a simplified check - in production you'd use a proper disk space library
      return true; // Placeholder
    } catch (error) {
      this.logger.error('Disk space check failed', { error, path });
      return false;
    }
  }

  async checkMemoryUsage(maxPercentage: number = 90): Promise<boolean> {
    try {
      const memoryUsage = process.memoryUsage();
      const percentage = (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100;
      return percentage < maxPercentage;
    } catch (error) {
      this.logger.error('Memory usage check failed', { error });
      return false;
    }
  }

  // Health check configuration
  configureCheck(id: string, config: Partial<ServiceHealth>): void {
    const existingCheck = this.checks.get(id);
    if (!existingCheck) {
      this.logger.warn('Health check not found for configuration', { id });
      return;
    }

    const updatedCheck = { ...existingCheck, ...config };
    this.checks.set(id, updatedCheck);
    
    this.logger.info('Health check configured', { id, config });
  }

  // Get all registered checks
  getRegisteredChecks(): Array<{ id: string; name: string; timeout: number }> {
    return Array.from(this.checks.entries()).map(([id, service]) => ({
      id,
      name: service.name,
      timeout: service.timeout,
    }));
  }

  // Clear health history
  clearHistory(): void {
    this.healthHistory = [];
    this.logger.info('Health check history cleared');
  }

  // Get health metrics
  getHealthMetrics(): {
    totalChecks: number;
    healthyChecks: number;
    unhealthyChecks: number;
    degradedChecks: number;
    averageResponseTime: number;
    uptime: number;
  } {
    const recentChecks = this.getRecentChecks();
    
    const totalChecks = recentChecks.length;
    const healthyChecks = recentChecks.filter(check => check.status === 'healthy').length;
    const unhealthyChecks = recentChecks.filter(check => check.status === 'unhealthy').length;
    const degradedChecks = recentChecks.filter(check => check.status === 'degraded').length;
    
    const averageResponseTime = totalChecks > 0
      ? recentChecks.reduce((sum, check) => sum + (check.responseTime || 0), 0) / totalChecks
      : 0;

    return {
      totalChecks,
      healthyChecks,
      unhealthyChecks,
      degradedChecks,
      averageResponseTime,
      uptime: process.uptime(),
    };
  }
}
