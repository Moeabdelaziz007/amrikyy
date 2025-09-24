// Message Broker Service - خدمة إدارة الرسائل مع RabbitMQ
import amqp from 'amqplib';
import { Logger } from '../utils/logger.js';

interface MessageBrokerConfig {
  url: string;
  exchange: string;
  queuePrefix: string;
}

interface Message {
  id: string;
  type: string;
  source: string;
  target: string;
  payload: any;
  timestamp: string;
  correlationId?: string;
  priority?: number;
}

export class MessageBroker {
  private connection: amqp.Connection | null = null;
  private channel: amqp.Channel | null = null;
  private config: MessageBrokerConfig;
  private logger: Logger;
  private isConnected: boolean = false;
  private consumers: Map<string, (message: Message) => Promise<void>> = new Map();

  constructor(config: MessageBrokerConfig) {
    this.config = config;
    this.logger = new Logger();
  }

  async connect(): Promise<void> {
    try {
      this.connection = await amqp.connect(this.config.url);
      this.channel = await this.connection.createChannel();

      // Setup exchange
      await this.channel.assertExchange(this.config.exchange, 'topic', {
        durable: true,
      });

      this.isConnected = true;
      this.logger.info('Message broker connected', {
        url: this.config.url,
        exchange: this.config.exchange,
      });

      // Setup connection event handlers
      this.connection.on('error', (error) => {
        this.logger.error('Message broker connection error', { error });
        this.isConnected = false;
      });

      this.connection.on('close', () => {
        this.logger.warn('Message broker connection closed');
        this.isConnected = false;
      });

    } catch (error) {
      this.logger.error('Failed to connect to message broker', { error });
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      if (this.channel) {
        await this.channel.close();
      }
      if (this.connection) {
        await this.connection.close();
      }
      this.isConnected = false;
      this.logger.info('Message broker disconnected');
    } catch (error) {
      this.logger.error('Failed to disconnect from message broker', { error });
    }
  }

  async publish(topic: string, message: Message): Promise<void> {
    if (!this.channel) {
      throw new Error('Message broker not connected');
    }

    try {
      const queueName = `${this.config.queuePrefix}.${topic}`;
      
      // Assert queue
      await this.channel.assertQueue(queueName, {
        durable: true,
        arguments: {
          'x-message-ttl': 86400000, // 24 hours
          'x-max-retries': 3,
        },
      });

      // Bind queue to exchange
      await this.channel.bindQueue(queueName, this.config.exchange, topic);

      // Publish message
      const messageBuffer = Buffer.from(JSON.stringify(message));
      const published = this.channel.publish(
        this.config.exchange,
        topic,
        messageBuffer,
        {
          persistent: true,
          priority: message.priority || 0,
          messageId: message.id,
          correlationId: message.correlationId,
          timestamp: Date.now(),
        }
      );

      if (!published) {
        throw new Error('Failed to publish message');
      }

      this.logger.debug('Message published', {
        topic,
        messageId: message.id,
        type: message.type,
      });

    } catch (error) {
      this.logger.error('Failed to publish message', { error, topic, messageId: message.id });
      throw error;
    }
  }

  async subscribe(topic: string, handler: (message: Message) => Promise<void>): Promise<void> {
    if (!this.channel) {
      throw new Error('Message broker not connected');
    }

    try {
      const queueName = `${this.config.queuePrefix}.${topic}`;
      
      // Assert queue
      await this.channel.assertQueue(queueName, {
        durable: true,
        arguments: {
          'x-message-ttl': 86400000, // 24 hours
          'x-max-retries': 3,
        },
      });

      // Bind queue to exchange
      await this.channel.bindQueue(queueName, this.config.exchange, topic);

      // Store consumer handler
      this.consumers.set(topic, handler);

      // Setup consumer
      await this.channel.consume(queueName, async (msg) => {
        if (!msg) return;

        try {
          const message: Message = JSON.parse(msg.content.toString());
          
          // Process message
          await handler(message);
          
          // Acknowledge message
          this.channel!.ack(msg);
          
          this.logger.debug('Message processed', {
            topic,
            messageId: message.id,
            type: message.type,
          });

        } catch (error) {
          this.logger.error('Message processing error', { error, topic });
          
          // Reject message and requeue
          this.channel!.nack(msg, false, true);
        }
      }, {
        noAck: false,
      });

      this.logger.info('Subscribed to topic', { topic, queueName });

    } catch (error) {
      this.logger.error('Failed to subscribe to topic', { error, topic });
      throw error;
    }
  }

  async unsubscribe(topic: string): Promise<void> {
    if (!this.channel) {
      throw new Error('Message broker not connected');
    }

    try {
      const queueName = `${this.config.queuePrefix}.${topic}`;
      
      // Cancel consumer
      await this.channel.cancel(queueName);
      
      // Remove handler
      this.consumers.delete(topic);
      
      this.logger.info('Unsubscribed from topic', { topic });

    } catch (error) {
      this.logger.error('Failed to unsubscribe from topic', { error, topic });
      throw error;
    }
  }

  async createQueue(queueName: string, options: any = {}): Promise<void> {
    if (!this.channel) {
      throw new Error('Message broker not connected');
    }

    try {
      const fullQueueName = `${this.config.queuePrefix}.${queueName}`;
      
      await this.channel.assertQueue(fullQueueName, {
        durable: true,
        ...options,
      });

      this.logger.info('Queue created', { queueName: fullQueueName });

    } catch (error) {
      this.logger.error('Failed to create queue', { error, queueName });
      throw error;
    }
  }

  async deleteQueue(queueName: string): Promise<void> {
    if (!this.channel) {
      throw new Error('Message broker not connected');
    }

    try {
      const fullQueueName = `${this.config.queuePrefix}.${queueName}`;
      
      await this.channel.deleteQueue(fullQueueName);
      
      this.logger.info('Queue deleted', { queueName: fullQueueName });

    } catch (error) {
      this.logger.error('Failed to delete queue', { error, queueName });
      throw error;
    }
  }

  async getQueueInfo(queueName: string): Promise<any> {
    if (!this.channel) {
      throw new Error('Message broker not connected');
    }

    try {
      const fullQueueName = `${this.config.queuePrefix}.${queueName}`;
      
      const queueInfo = await this.channel.checkQueue(fullQueueName);
      
      return queueInfo;

    } catch (error) {
      this.logger.error('Failed to get queue info', { error, queueName });
      throw error;
    }
  }

  async purgeQueue(queueName: string): Promise<void> {
    if (!this.channel) {
      throw new Error('Message broker not connected');
    }

    try {
      const fullQueueName = `${this.config.queuePrefix}.${queueName}`;
      
      await this.channel.purgeQueue(fullQueueName);
      
      this.logger.info('Queue purged', { queueName: fullQueueName });

    } catch (error) {
      this.logger.error('Failed to purge queue', { error, queueName });
      throw error;
    }
  }

  // Health check
  async ping(): Promise<boolean> {
    try {
      if (!this.connection || !this.channel) {
        return false;
      }

      // Try to create a temporary queue to test connectivity
      const testQueue = `test.${Date.now()}`;
      await this.channel.assertQueue(testQueue, { autoDelete: true });
      await this.channel.deleteQueue(testQueue);
      
      return true;
    } catch (error) {
      this.logger.error('Message broker ping failed', { error });
      return false;
    }
  }

  // Get connection status
  isConnectedToBroker(): boolean {
    return this.isConnected;
  }

  // Get channel for advanced operations
  getChannel(): amqp.Channel | null {
    return this.channel;
  }

  // Get connection for advanced operations
  getConnection(): amqp.Connection | null {
    return this.connection;
  }
}
