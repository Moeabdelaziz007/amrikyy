// Sample Workflow Implementation - Service Monitoring with Telegram Notifications
import { workflowEngine } from './workflow-engine';
import { taskAutomationEngine } from './task-automation-engine';
import { databaseService } from './database-service';

export interface ServiceMonitorConfig {
  serviceUrl: string;
  checkInterval: number; // in minutes
  telegramBotToken: string;
  telegramChatId: string;
  alertThresholds: {
    responseTime: number; // in milliseconds
    errorRate: number; // percentage
    uptime: number; // percentage
  };
}

export interface ServiceHealthCheck {
  url: string;
  status: 'healthy' | 'degraded' | 'down';
  responseTime: number;
  errorRate: number;
  uptime: number;
  lastCheck: Date;
  errors: string[];
}

export class ServiceMonitoringWorkflow {
  private config: ServiceMonitorConfig;
  private isRunning = false;
  private checkInterval: NodeJS.Timeout | null = null;

  constructor(config: ServiceMonitorConfig) {
    this.config = config;
  }

  /**
   * Initialize the service monitoring workflow
   */
  async initialize(): Promise<void> {
    try {
      // Create the monitoring workflow
      const workflowDefinition = {
        name: 'Service Health Monitoring',
        description: 'Monitor service health and send Telegram notifications',
        version: '1.0.0',
        nodes: [
          {
            id: 'trigger',
            type: 'trigger',
            name: 'Health Check Trigger',
            config: {
              eventType: 'scheduled_check',
              schedule: `*/${this.config.checkInterval} * * * *`, // Every X minutes
            },
            position: { x: 100, y: 100 },
          },
          {
            id: 'health_check',
            type: 'action',
            name: 'Perform Health Check',
            config: {
              actionType: 'http_request',
              url: this.config.serviceUrl,
              method: 'GET',
              timeout: 10000,
              headers: {
                'User-Agent': 'AuraOS-HealthCheck/1.0',
              },
            },
            position: { x: 300, y: 100 },
          },
          {
            id: 'analyze_results',
            type: 'condition',
            name: 'Analyze Health Results',
            config: {
              condition: `
                const responseTime = context.variables.responseTime;
                const errorRate = context.variables.errorRate;
                const uptime = context.variables.uptime;
                
                if (responseTime > ${this.config.alertThresholds.responseTime} || 
                    errorRate > ${this.config.alertThresholds.errorRate} || 
                    uptime < ${this.config.alertThresholds.uptime}) {
                  return 'degraded';
                } else if (context.variables.status === 'error') {
                  return 'down';
                } else {
                  return 'healthy';
                }
              `,
            },
            position: { x: 500, y: 100 },
          },
          {
            id: 'send_alert',
            type: 'action',
            name: 'Send Telegram Alert',
            config: {
              actionType: 'http_request',
              url: `https://api.telegram.org/bot${this.config.telegramBotToken}/sendMessage`,
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: {
                chat_id: this.config.telegramChatId,
                text: `
🚨 Service Alert: ${this.config.serviceUrl}

Status: {{context.variables.healthStatus}}
Response Time: {{context.variables.responseTime}}ms
Error Rate: {{context.variables.errorRate}}%
Uptime: {{context.variables.uptime}}%

Time: {{context.variables.timestamp}}
                `,
                parse_mode: 'Markdown',
              },
            },
            position: { x: 700, y: 200 },
          },
          {
            id: 'log_results',
            type: 'action',
            name: 'Log Health Results',
            config: {
              actionType: 'database_query',
              query: `
                INSERT INTO service_health_logs (
                  service_url, status, response_time, error_rate, 
                  uptime, timestamp, errors
                ) VALUES (
                  '${this.config.serviceUrl}',
                  '{{context.variables.healthStatus}}',
                  {{context.variables.responseTime}},
                  {{context.variables.errorRate}},
                  {{context.variables.uptime}},
                  '{{context.variables.timestamp}}',
                  '{{context.variables.errors}}'
                )
              `,
            },
            position: { x: 700, y: 100 },
          },
        ],
        connections: [
          {
            id: 'conn1',
            sourceNodeId: 'trigger',
            targetNodeId: 'health_check',
          },
          {
            id: 'conn2',
            sourceNodeId: 'health_check',
            targetNodeId: 'analyze_results',
          },
          {
            id: 'conn3',
            sourceNodeId: 'analyze_results',
            targetNodeId: 'send_alert',
            condition: 'context.variables.healthStatus !== "healthy"',
          },
          {
            id: 'conn4',
            sourceNodeId: 'analyze_results',
            targetNodeId: 'log_results',
          },
        ],
        variables: [
          {
            name: 'serviceUrl',
            type: 'string',
            value: this.config.serviceUrl,
          },
          {
            name: 'alertThresholds',
            type: 'object',
            value: this.config.alertThresholds,
          },
        ],
        settings: {
          timeout: 300000, // 5 minutes
          retryPolicy: {
            maxRetries: 3,
            retryDelay: 5000,
            backoffMultiplier: 2,
            retryOn: ['network_error', 'timeout_error'],
          },
          concurrency: 1,
          errorHandling: {
            onError: 'continue',
            notificationChannels: ['telegram'],
          },
          logging: {
            level: 'info',
            includeInput: true,
            includeOutput: true,
            includeMetrics: true,
          },
        },
        metadata: {
          tags: ['monitoring', 'telegram', 'health-check'],
          category: 'infrastructure',
          author: 'system',
          lastModifiedBy: 'system',
          permissions: [
            { userId: 'admin', role: 'admin' },
            { userId: 'monitor', role: 'viewer' },
          ],
        },
      };

      // Create workflow in database
      const workflow = await databaseService.createWorkflow({
        ...workflowDefinition,
        status: 'active',
        createdBy: 'system',
      });

      console.log(`✅ Service monitoring workflow created: ${workflow.id}`);

      // Create scheduled task for health checks
      const taskDefinition = {
        name: `Health Check - ${this.config.serviceUrl}`,
        description: `Automated health check for ${this.config.serviceUrl}`,
        type: { name: 'workflow_trigger' },
        config: {
          workflowId: workflow.id,
          triggerType: 'scheduled',
          schedule: `*/${this.config.checkInterval} * * * *`,
          input: {
            serviceUrl: this.config.serviceUrl,
            timestamp: new Date().toISOString(),
          },
        },
        dependencies: [],
        resources: [
          { type: 'cpu', amount: 0.1, unit: 'cores' },
          { type: 'memory', amount: 50, unit: 'MB' },
          { type: 'network', amount: 1, unit: 'MB' },
        ],
        retryPolicy: {
          maxRetries: 3,
          retryDelay: 5000,
          backoffMultiplier: 2,
          retryOn: ['network_error', 'timeout_error'],
          maxRetryDelay: 60000,
        },
        timeout: 300000, // 5 minutes
        priority: 5,
        tags: ['monitoring', 'health-check', 'scheduled'],
        metadata: {
          author: 'system',
          category: 'monitoring',
          version: '1.0.0',
          permissions: [
            { userId: 'admin', role: 'admin' },
            { userId: 'monitor', role: 'viewer' },
          ],
          environment: 'production',
        },
      };

      const task = await databaseService.createTask({
        ...taskDefinition,
        status: 'pending',
        createdBy: 'system',
      });

      // Schedule the task
      const schedule = await databaseService.createTaskSchedule({
        taskId: task.id,
        cronExpression: `*/${this.config.checkInterval} * * * *`,
        timezone: 'UTC',
        nextRunAt: this.calculateNextRun(this.config.checkInterval),
        isActive: true,
        runCount: 0,
      });

      console.log(`✅ Health check task scheduled: ${task.id}`);

      // Start the monitoring
      this.startMonitoring();
    } catch (error) {
      console.error(
        '❌ Failed to initialize service monitoring workflow:',
        error
      );
      throw error;
    }
  }

  /**
   * Start the monitoring process
   */
  private startMonitoring(): void {
    if (this.isRunning) {
      console.log('⚠️ Service monitoring is already running');
      return;
    }

    this.isRunning = true;
    console.log(
      `🚀 Starting service monitoring for: ${this.config.serviceUrl}`
    );

    // Set up real-time monitoring
    this.setupRealTimeMonitoring();
  }

  /**
   * Stop the monitoring process
   */
  async stopMonitoring(): Promise<void> {
    if (!this.isRunning) {
      console.log('⚠️ Service monitoring is not running');
      return;
    }

    this.isRunning = false;

    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }

    console.log('🛑 Service monitoring stopped');
  }

  /**
   * Perform a manual health check
   */
  async performHealthCheck(): Promise<ServiceHealthCheck> {
    const startTime = Date.now();
    let status: 'healthy' | 'degraded' | 'down' = 'healthy';
    let responseTime = 0;
    let errorRate = 0;
    let uptime = 100;
    const errors: string[] = [];

    try {
      const response = await fetch(this.config.serviceUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'AuraOS-HealthCheck/1.0',
        },
        signal: AbortSignal.timeout(10000),
      });

      responseTime = Date.now() - startTime;

      if (!response.ok) {
        status = 'down';
        errors.push(`HTTP ${response.status}: ${response.statusText}`);
      } else if (responseTime > this.config.alertThresholds.responseTime) {
        status = 'degraded';
        errors.push(
          `Response time ${responseTime}ms exceeds threshold ${this.config.alertThresholds.responseTime}ms`
        );
      }
    } catch (error) {
      status = 'down';
      responseTime = Date.now() - startTime;
      errors.push(`Network error: ${error.message}`);
    }

    const healthCheck: ServiceHealthCheck = {
      url: this.config.serviceUrl,
      status,
      responseTime,
      errorRate,
      uptime,
      lastCheck: new Date(),
      errors,
    };

    // Log the health check result
    await this.logHealthCheck(healthCheck);

    // Send alert if service is degraded or down
    if (status !== 'healthy') {
      await this.sendTelegramAlert(healthCheck);
    }

    return healthCheck;
  }

  /**
   * Send Telegram alert
   */
  private async sendTelegramAlert(
    healthCheck: ServiceHealthCheck
  ): Promise<void> {
    try {
      const message = `
🚨 *Service Alert*

*Service:* ${healthCheck.url}
*Status:* ${healthCheck.status.toUpperCase()}
*Response Time:* ${healthCheck.responseTime}ms
*Last Check:* ${healthCheck.lastCheck.toISOString()}

${healthCheck.errors.length > 0 ? `*Errors:*\n${healthCheck.errors.map(e => `• ${e}`).join('\n')}` : ''}

_Time: ${new Date().toLocaleString()}_
      `;

      const response = await fetch(
        `https://api.telegram.org/bot${this.config.telegramBotToken}/sendMessage`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chat_id: this.config.telegramChatId,
            text: message,
            parse_mode: 'Markdown',
          }),
        }
      );

      if (!response.ok) {
        console.error('Failed to send Telegram alert:', await response.text());
      } else {
        console.log('✅ Telegram alert sent successfully');
      }
    } catch (error) {
      console.error('❌ Error sending Telegram alert:', error);
    }
  }

  /**
   * Log health check results
   */
  private async logHealthCheck(healthCheck: ServiceHealthCheck): Promise<void> {
    try {
      // In a real implementation, this would log to a database
      console.log('📊 Health Check Result:', {
        url: healthCheck.url,
        status: healthCheck.status,
        responseTime: healthCheck.responseTime,
        timestamp: healthCheck.lastCheck,
      });

      // You could also store this in Firestore
      // await databaseService.createHealthLog(healthCheck);
    } catch (error) {
      console.error('❌ Error logging health check:', error);
    }
  }

  /**
   * Set up real-time monitoring
   */
  private setupRealTimeMonitoring(): void {
    // Listen to workflow execution events
    workflowEngine.on('workflow:execution:completed', execution => {
      console.log(`✅ Workflow execution completed: ${execution.id}`);
    });

    workflowEngine.on('workflow:execution:failed', execution => {
      console.error(
        `❌ Workflow execution failed: ${execution.id}`,
        execution.error
      );
    });

    // Listen to task execution events
    taskAutomationEngine.on('task:execution:completed', execution => {
      console.log(`✅ Task execution completed: ${execution.id}`);
    });

    taskAutomationEngine.on('task:execution:failed', execution => {
      console.error(
        `❌ Task execution failed: ${execution.id}`,
        execution.error
      );
    });
  }

  /**
   * Calculate next run time for cron expression
   */
  private calculateNextRun(intervalMinutes: number): Date {
    const now = new Date();
    const nextRun = new Date(now.getTime() + intervalMinutes * 60 * 1000);
    return nextRun;
  }

  /**
   * Get monitoring status
   */
  getStatus(): {
    isRunning: boolean;
    config: ServiceMonitorConfig;
    lastCheck?: Date;
  } {
    return {
      isRunning: this.isRunning,
      config: this.config,
    };
  }
}

// Example usage
export async function createSampleServiceMonitoring(): Promise<ServiceMonitoringWorkflow> {
  const config: ServiceMonitorConfig = {
    serviceUrl: 'https://api.github.com/status',
    checkInterval: 5, // Check every 5 minutes
    telegramBotToken: process.env.TELEGRAM_BOT_TOKEN || 'your_bot_token',
    telegramChatId: process.env.TELEGRAM_CHAT_ID || 'your_chat_id',
    alertThresholds: {
      responseTime: 5000, // 5 seconds
      errorRate: 5, // 5%
      uptime: 95, // 95%
    },
  };

  const monitor = new ServiceMonitoringWorkflow(config);
  await monitor.initialize();

  return monitor;
}

// Export for use in other modules
export { ServiceMonitoringWorkflow };
