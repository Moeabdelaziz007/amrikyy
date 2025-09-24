// A2A Message Broker - نظام إدارة الرسائل المتقدم
// نظام إدارة الرسائل غير المتزامنة والطوابير

import { EventEmitter } from 'events';
import Redis from 'ioredis';
import { getLogger } from './lib/advanced-logger.js';

// Types and Interfaces
interface MessageBrokerConfig {
  redis: {
    host: string;
    port: number;
    password?: string;
    db?: number;
  };
  queues: {
    telegram: string;
    autopilot: string;
    application: string;
    gateway: string;
    notifications: string;
    errors: string;
  };
  retryPolicy: {
    maxRetries: number;
    retryDelay: number;
    backoffMultiplier: number;
  };
  deadLetterQueue: boolean;
  messageTTL: number;
}

interface BrokerMessage {
  id: string;
  type: 'request' | 'response' | 'notification' | 'error' | 'command';
  source: string;
  target: string;
  payload: any;
  timestamp: Date;
  correlationId?: string;
  priority: 'low' | 'normal' | 'high' | 'critical';
  retryCount: number;
  maxRetries: number;
  expiresAt?: Date;
  metadata?: any;
}

interface QueueStats {
  name: string;
  size: number;
  processed: number;
  failed: number;
  retries: number;
  avgProcessingTime: number;
}

interface ConsumerConfig {
  queueName: string;
  handler: (message: BrokerMessage) => Promise<void>;
  concurrency: number;
  autoAck: boolean;
  retryOnError: boolean;
}

export class A2AMessageBroker extends EventEmitter {
  private redis: Redis;
  private config: MessageBrokerConfig;
  private consumers: Map<string, ConsumerConfig> = new Map();
  private isRunning: boolean = false;
  private logger: any;
  private processingStats: Map<string, QueueStats> = new Map();
  private deadLetterQueues: Map<string, string> = new Map();

  constructor(config: Partial<MessageBrokerConfig> = {}) {
    super();
    
    this.config = {
      redis: {
        host: config.redis?.host || process.env.REDIS_HOST || 'localhost',
        port: config.redis?.port || parseInt(process.env.REDIS_PORT || '6379'),
        password: config.redis?.password || process.env.REDIS_PASSWORD,
        db: config.redis?.db || parseInt(process.env.REDIS_DB || '0'),
      },
      queues: {
        telegram: config.queues?.telegram || 'a2a:telegram',
        autopilot: config.queues?.autopilot || 'a2a:autopilot',
        application: config.queues?.application || 'a2a:application',
        gateway: config.queues?.gateway || 'a2a:gateway',
        notifications: config.queues?.notifications || 'a2a:notifications',
        errors: config.queues?.errors || 'a2a:errors',
      },
      retryPolicy: {
        maxRetries: config.retryPolicy?.maxRetries || 3,
        retryDelay: config.retryPolicy?.retryDelay || 1000,
        backoffMultiplier: config.retryPolicy?.backoffMultiplier || 2,
      },
      deadLetterQueue: config.deadLetterQueue !== false,
      messageTTL: config.messageTTL || 24 * 60 * 60 * 1000, // 24 hours
    };

    this.logger = getLogger();
    this.initializeRedis();
    this.setupDeadLetterQueues();
    this.initializeStats();

    this.logger.info('🚀 A2A Message Broker initialized');
  }

  private initializeRedis(): void {
    this.redis = new Redis({
      host: this.config.redis.host,
      port: this.config.redis.port,
      password: this.config.redis.password,
      db: this.config.redis.db,
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    });

    this.redis.on('connect', () => {
      this.logger.info('Connected to Redis', {
        host: this.config.redis.host,
        port: this.config.redis.port,
      });
    });

    this.redis.on('error', (error) => {
      this.logger.error('Redis connection error', { error });
      this.emit('redisError', error);
    });

    this.redis.on('close', () => {
      this.logger.warn('Redis connection closed');
      this.emit('redisDisconnected');
    });
  }

  private setupDeadLetterQueues(): void {
    if (!this.config.deadLetterQueue) return;

    Object.values(this.config.queues).forEach(queueName => {
      const deadLetterQueue = `${queueName}:dlq`;
      this.deadLetterQueues.set(queueName, deadLetterQueue);
    });
  }

  private initializeStats(): void {
    Object.values(this.config.queues).forEach(queueName => {
      this.processingStats.set(queueName, {
        name: queueName,
        size: 0,
        processed: 0,
        failed: 0,
        retries: 0,
        avgProcessingTime: 0,
      });
    });
  }

  // Message publishing
  public async publishMessage(
    queueName: string,
    message: Partial<BrokerMessage>
  ): Promise<string> {
    try {
      const fullMessage: BrokerMessage = {
        id: this.generateMessageId(),
        type: message.type || 'notification',
        source: message.source || 'unknown',
        target: message.target || 'unknown',
        payload: message.payload || {},
        timestamp: new Date(),
        correlationId: message.correlationId,
        priority: message.priority || 'normal',
        retryCount: 0,
        maxRetries: this.config.retryPolicy.maxRetries,
        expiresAt: new Date(Date.now() + this.config.messageTTL),
        metadata: message.metadata || {},
      };

      // Serialize message
      const serializedMessage = JSON.stringify(fullMessage);

      // Add to queue with priority
      const priorityScore = this.getPriorityScore(fullMessage.priority);
      await this.redis.zadd(queueName, priorityScore, serializedMessage);

      // Update stats
      this.updateQueueStats(queueName, 'published');

      this.logger.debug('Message published', {
        messageId: fullMessage.id,
        queue: queueName,
        type: fullMessage.type,
        priority: fullMessage.priority,
      });

      this.emit('messagePublished', fullMessage);
      return fullMessage.id;
    } catch (error) {
      this.logger.error('Failed to publish message', { error, queueName });
      throw error;
    }
  }

  // Message consumption
  public async consumeMessages(config: ConsumerConfig): Promise<void> {
    try {
      this.consumers.set(config.queueName, config);
      
      this.logger.info('Starting consumer', {
        queue: config.queueName,
        concurrency: config.concurrency,
      });

      // Start multiple workers for concurrency
      for (let i = 0; i < config.concurrency; i++) {
        this.startWorker(config.queueName, i);
      }

      this.emit('consumerStarted', config);
    } catch (error) {
      this.logger.error('Failed to start consumer', { error, config });
      throw error;
    }
  }

  private async startWorker(queueName: string, workerId: number): Promise<void> {
    const consumer = this.consumers.get(queueName);
    if (!consumer) return;

    this.logger.debug('Starting worker', { queue: queueName, workerId });

    while (this.isRunning) {
      try {
        // Get message from queue (blocking with timeout)
        const result = await this.redis.bzpopmax(queueName, 1);
        
        if (!result) {
          // No messages, continue polling
          await this.sleep(100);
          continue;
        }

        const [, serializedMessage] = result;
        const message: BrokerMessage = JSON.parse(serializedMessage);

        // Check if message has expired
        if (message.expiresAt && message.expiresAt < new Date()) {
          this.logger.warn('Message expired', { messageId: message.id });
          await this.handleExpiredMessage(message, queueName);
          continue;
        }

        // Process message
        const startTime = Date.now();
        await this.processMessage(message, consumer, queueName);
        const processingTime = Date.now() - startTime;

        // Update stats
        this.updateProcessingStats(queueName, processingTime);

        this.logger.debug('Message processed', {
          messageId: message.id,
          queue: queueName,
          workerId,
          processingTime,
        });

      } catch (error) {
        this.logger.error('Worker error', { error, queue: queueName, workerId });
        await this.sleep(1000); // Wait before retrying
      }
    }
  }

  private async processMessage(
    message: BrokerMessage,
    consumer: ConsumerConfig,
    queueName: string
  ): Promise<void> {
    try {
      // Execute handler
      await consumer.handler(message);

      // Auto-acknowledge if enabled
      if (consumer.autoAck) {
        this.updateQueueStats(queueName, 'processed');
        this.emit('messageProcessed', message);
      }

    } catch (error) {
      this.logger.error('Message processing failed', {
        error,
        messageId: message.id,
        queue: queueName,
        retryCount: message.retryCount,
      });

      // Handle retry logic
      if (consumer.retryOnError && message.retryCount < message.maxRetries) {
        await this.retryMessage(message, queueName);
      } else {
        await this.handleFailedMessage(message, queueName, error);
      }
    }
  }

  private async retryMessage(message: BrokerMessage, queueName: string): Promise<void> {
    try {
      message.retryCount++;
      
      // Calculate retry delay with exponential backoff
      const delay = this.config.retryPolicy.retryDelay * 
        Math.pow(this.config.retryPolicy.backoffMultiplier, message.retryCount - 1);

      // Schedule retry
      setTimeout(async () => {
        const priorityScore = this.getPriorityScore(message.priority);
        const serializedMessage = JSON.stringify(message);
        
        await this.redis.zadd(queueName, priorityScore, serializedMessage);
        
        this.updateQueueStats(queueName, 'retry');
        this.logger.info('Message scheduled for retry', {
          messageId: message.id,
          retryCount: message.retryCount,
          delay,
        });
      }, delay);

    } catch (error) {
      this.logger.error('Failed to schedule retry', { error, messageId: message.id });
      await this.handleFailedMessage(message, queueName, error);
    }
  }

  private async handleFailedMessage(
    message: BrokerMessage,
    queueName: string,
    error: any
  ): Promise<void> {
    try {
      // Move to dead letter queue if enabled
      if (this.config.deadLetterQueue) {
        const deadLetterQueue = this.deadLetterQueues.get(queueName);
        if (deadLetterQueue) {
          const failedMessage = {
            ...message,
            error: error.message,
            failedAt: new Date(),
          };
          
          const serializedMessage = JSON.stringify(failedMessage);
          await this.redis.lpush(deadLetterQueue, serializedMessage);
          
          this.logger.warn('Message moved to dead letter queue', {
            messageId: message.id,
            queue: queueName,
            deadLetterQueue,
          });
        }
      }

      this.updateQueueStats(queueName, 'failed');
      this.emit('messageFailed', { message, error });

    } catch (error) {
      this.logger.error('Failed to handle failed message', { error, messageId: message.id });
    }
  }

  private async handleExpiredMessage(message: BrokerMessage, queueName: string): Promise<void> {
    try {
      // Move expired message to dead letter queue
      if (this.config.deadLetterQueue) {
        const deadLetterQueue = this.deadLetterQueues.get(queueName);
        if (deadLetterQueue) {
          const expiredMessage = {
            ...message,
            expiredAt: new Date(),
            reason: 'expired',
          };
          
          const serializedMessage = JSON.stringify(expiredMessage);
          await this.redis.lpush(deadLetterQueue, serializedMessage);
        }
      }

      this.updateQueueStats(queueName, 'expired');
      this.emit('messageExpired', message);

    } catch (error) {
      this.logger.error('Failed to handle expired message', { error, messageId: message.id });
    }
  }

  // Queue management
  public async getQueueSize(queueName: string): Promise<number> {
    try {
      return await this.redis.zcard(queueName);
    } catch (error) {
      this.logger.error('Failed to get queue size', { error, queueName });
      return 0;
    }
  }

  public async getQueueStats(queueName: string): Promise<QueueStats | null> {
    const stats = this.processingStats.get(queueName);
    if (!stats) return null;

    // Update current size
    stats.size = await this.getQueueSize(queueName);
    
    return { ...stats };
  }

  public async getAllQueueStats(): Promise<QueueStats[]> {
    const allStats: QueueStats[] = [];
    
    for (const queueName of Object.values(this.config.queues)) {
      const stats = await this.getQueueStats(queueName);
      if (stats) {
        allStats.push(stats);
      }
    }
    
    return allStats;
  }

  public async purgeQueue(queueName: string): Promise<void> {
    try {
      await this.redis.del(queueName);
      this.logger.info('Queue purged', { queueName });
      this.emit('queuePurged', queueName);
    } catch (error) {
      this.logger.error('Failed to purge queue', { error, queueName });
      throw error;
    }
  }

  public async purgeAllQueues(): Promise<void> {
    try {
      const queueNames = Object.values(this.config.queues);
      await this.redis.del(...queueNames);
      
      this.logger.info('All queues purged');
      this.emit('allQueuesPurged');
    } catch (error) {
      this.logger.error('Failed to purge all queues', { error });
      throw error;
    }
  }

  // Dead letter queue management
  public async getDeadLetterMessages(queueName: string, limit: number = 100): Promise<BrokerMessage[]> {
    try {
      const deadLetterQueue = this.deadLetterQueues.get(queueName);
      if (!deadLetterQueue) {
        throw new Error('Dead letter queue not configured');
      }

      const messages = await this.redis.lrange(deadLetterQueue, 0, limit - 1);
      return messages.map(msg => JSON.parse(msg));
    } catch (error) {
      this.logger.error('Failed to get dead letter messages', { error, queueName });
      throw error;
    }
  }

  public async reprocessDeadLetterMessage(
    queueName: string,
    messageId: string
  ): Promise<void> {
    try {
      const deadLetterQueue = this.deadLetterQueues.get(queueName);
      if (!deadLetterQueue) {
        throw new Error('Dead letter queue not configured');
      }

      // Find and remove message from dead letter queue
      const messages = await this.redis.lrange(deadLetterQueue, 0, -1);
      let messageToReprocess: BrokerMessage | null = null;
      let messageIndex = -1;

      for (let i = 0; i < messages.length; i++) {
        const message: BrokerMessage = JSON.parse(messages[i]);
        if (message.id === messageId) {
          messageToReprocess = message;
          messageIndex = i;
          break;
        }
      }

      if (!messageToReprocess) {
        throw new Error('Message not found in dead letter queue');
      }

      // Remove from dead letter queue
      await this.redis.lrem(deadLetterQueue, 1, messages[messageIndex]);

      // Reset retry count and republish
      messageToReprocess.retryCount = 0;
      messageToReprocess.expiresAt = new Date(Date.now() + this.config.messageTTL);

      await this.publishMessage(queueName, messageToReprocess);

      this.logger.info('Dead letter message reprocessed', { messageId, queueName });
      this.emit('messageReprocessed', messageToReprocess);

    } catch (error) {
      this.logger.error('Failed to reprocess dead letter message', { error, messageId });
      throw error;
    }
  }

  // Utility methods
  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getPriorityScore(priority: string): number {
    const priorityScores = {
      critical: 1000,
      high: 750,
      normal: 500,
      low: 250,
    };
    
    return priorityScores[priority] || 500;
  }

  private updateQueueStats(queueName: string, action: string): void {
    const stats = this.processingStats.get(queueName);
    if (!stats) return;

    switch (action) {
      case 'published':
        stats.size++;
        break;
      case 'processed':
        stats.processed++;
        stats.size = Math.max(0, stats.size - 1);
        break;
      case 'failed':
        stats.failed++;
        stats.size = Math.max(0, stats.size - 1);
        break;
      case 'retry':
        stats.retries++;
        break;
      case 'expired':
        stats.size = Math.max(0, stats.size - 1);
        break;
    }
  }

  private updateProcessingStats(queueName: string, processingTime: number): void {
    const stats = this.processingStats.get(queueName);
    if (!stats) return;

    // Update average processing time using exponential moving average
    const alpha = 0.1;
    stats.avgProcessingTime = 
      alpha * processingTime + (1 - alpha) * stats.avgProcessingTime;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Public control methods
  public async start(): Promise<void> {
    if (this.isRunning) {
      this.logger.warn('Message broker is already running');
      return;
    }

    try {
      // Connect to Redis
      await this.redis.connect();
      
      this.isRunning = true;
      this.logger.info('A2A Message Broker started', {
        redis: {
          host: this.config.redis.host,
          port: this.config.redis.port,
        },
        queues: Object.values(this.config.queues),
        deadLetterQueues: this.config.deadLetterQueue,
      });

      this.emit('brokerStarted');
    } catch (error) {
      this.logger.error('Failed to start message broker', { error });
      throw error;
    }
  }

  public async stop(): Promise<void> {
    if (!this.isRunning) {
      this.logger.warn('Message broker is not running');
      return;
    }

    try {
      this.isRunning = false;
      
      // Stop all consumers
      this.consumers.clear();
      
      // Close Redis connection
      await this.redis.quit();
      
      this.logger.info('A2A Message Broker stopped');
      this.emit('brokerStopped');
    } catch (error) {
      this.logger.error('Failed to stop message broker', { error });
      throw error;
    }
  }

  public isHealthy(): boolean {
    return this.isRunning && this.redis.status === 'ready';
  }

  public getConfig(): MessageBrokerConfig {
    return { ...this.config };
  }
}

// Export singleton instance
let brokerInstance: A2AMessageBroker | null = null;

export function getA2AMessageBroker(config?: Partial<MessageBrokerConfig>): A2AMessageBroker {
  if (!brokerInstance) {
    brokerInstance = new A2AMessageBroker(config);
  }
  return brokerInstance;
}

export function initializeA2AMessageBroker(config?: Partial<MessageBrokerConfig>): A2AMessageBroker {
  return getA2AMessageBroker(config);
}
