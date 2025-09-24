// Redis Client Service - خدمة Redis للذاكرة المؤقتة والجلسات
import Redis from 'ioredis';
import { Logger } from '../utils/logger.js';

interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  db: number;
}

export class RedisClient {
  private client: Redis;
  private config: RedisConfig;
  private logger: Logger;
  private isConnected: boolean = false;

  constructor(config: RedisConfig) {
    this.config = config;
    this.logger = new Logger();

    this.client = new Redis({
      host: config.host,
      port: config.port,
      password: config.password,
      db: config.db,
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3,
      lazyConnect: true,
      keepAlive: 30000,
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.client.on('connect', () => {
      this.isConnected = true;
      this.logger.info('Redis connected', {
        host: this.config.host,
        port: this.config.port,
        db: this.config.db,
      });
    });

    this.client.on('error', (error) => {
      this.logger.error('Redis connection error', { error: error.message });
      this.isConnected = false;
    });

    this.client.on('close', () => {
      this.logger.warn('Redis connection closed');
      this.isConnected = false;
    });

    this.client.on('reconnecting', () => {
      this.logger.info('Redis reconnecting...');
    });
  }

  async connect(): Promise<void> {
    try {
      await this.client.connect();
    } catch (error) {
      this.logger.error('Failed to connect to Redis', { error });
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      await this.client.quit();
      this.isConnected = false;
    } catch (error) {
      this.logger.error('Failed to disconnect from Redis', { error });
    }
  }

  // Cache operations
  async set(key: string, value: any, ttl?: number): Promise<void> {
    try {
      const serializedValue = JSON.stringify(value);
      if (ttl) {
        await this.client.setex(key, ttl, serializedValue);
      } else {
        await this.client.set(key, serializedValue);
      }
    } catch (error) {
      this.logger.error('Redis SET error', { error, key });
      throw error;
    }
  }

  async get(key: string): Promise<any> {
    try {
      const value = await this.client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      this.logger.error('Redis GET error', { error, key });
      throw error;
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.client.del(key);
    } catch (error) {
      this.logger.error('Redis DEL error', { error, key });
      throw error;
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      this.logger.error('Redis EXISTS error', { error, key });
      throw error;
    }
  }

  // Session management
  async setSession(sessionId: string, sessionData: any, ttl: number = 3600): Promise<void> {
    const key = `session:${sessionId}`;
    await this.set(key, sessionData, ttl);
  }

  async getSession(sessionId: string): Promise<any> {
    const key = `session:${sessionId}`;
    return await this.get(key);
  }

  async deleteSession(sessionId: string): Promise<void> {
    const key = `session:${sessionId}`;
    await this.del(key);
  }

  // Rate limiting
  async checkRateLimit(key: string, limit: number, window: number): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
    try {
      const now = Date.now();
      const windowStart = now - window;
      
      // Remove old entries
      await this.client.zremrangebyscore(key, 0, windowStart);
      
      // Count current entries
      const currentCount = await this.client.zcard(key);
      
      if (currentCount >= limit) {
        const oldestEntry = await this.client.zrange(key, 0, 0, 'WITHSCORES');
        const resetTime = oldestEntry.length > 0 ? parseInt(oldestEntry[1]) + window : now + window;
        
        return {
          allowed: false,
          remaining: 0,
          resetTime,
        };
      }
      
      // Add current request
      await this.client.zadd(key, now, `${now}-${Math.random()}`);
      await this.client.expire(key, Math.ceil(window / 1000));
      
      return {
        allowed: true,
        remaining: limit - currentCount - 1,
        resetTime: now + window,
      };
    } catch (error) {
      this.logger.error('Rate limit check error', { error, key });
      throw error;
    }
  }

  // Pub/Sub
  async publish(channel: string, message: any): Promise<void> {
    try {
      const serializedMessage = JSON.stringify(message);
      await this.client.publish(channel, serializedMessage);
    } catch (error) {
      this.logger.error('Redis PUBLISH error', { error, channel });
      throw error;
    }
  }

  async subscribe(channel: string, callback: (message: any) => void): Promise<void> {
    try {
      const subscriber = this.client.duplicate();
      await subscriber.subscribe(channel);
      
      subscriber.on('message', (receivedChannel, message) => {
        if (receivedChannel === channel) {
          try {
            const parsedMessage = JSON.parse(message);
            callback(parsedMessage);
          } catch (error) {
            this.logger.error('Message parsing error', { error, channel });
          }
        }
      });
    } catch (error) {
      this.logger.error('Redis SUBSCRIBE error', { error, channel });
      throw error;
    }
  }

  // Health check
  async ping(): Promise<boolean> {
    try {
      const result = await this.client.ping();
      return result === 'PONG';
    } catch (error) {
      this.logger.error('Redis PING error', { error });
      return false;
    }
  }

  // Get connection status
  isConnectedToRedis(): boolean {
    return this.isConnected;
  }

  // Get Redis client for advanced operations
  getClient(): Redis {
    return this.client;
  }
}
