// A2A SDK for Node.js Applications
// SDK للتطبيقات الخارجية للتفاعل مع نظام A2A

import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { EventEmitter } from 'events';
import WebSocket from 'ws';

// Types and Interfaces
interface A2AConfig {
  gatewayUrl: string;
  apiKey?: string;
  token?: string;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

interface A2AMessage {
  id: string;
  type: string;
  source: string;
  target: string;
  payload: any;
  timestamp: string;
  correlationId?: string;
  priority?: 'low' | 'normal' | 'high' | 'critical';
}

interface A2AWebSocketMessage {
  type: 'auth' | 'subscribe' | 'publish' | 'message' | 'error';
  payload?: any;
  clientId?: string;
  timestamp?: string;
}

interface A2AHealthStatus {
  overall: 'healthy' | 'unhealthy' | 'degraded';
  checks: Array<{
    name: string;
    status: 'healthy' | 'unhealthy' | 'degraded';
    responseTime?: number;
    message?: string;
  }>;
  timestamp: string;
}

interface A2AMetrics {
  requests: {
    totalRequests: number;
    averageResponseTime: number;
    requestsPerMinute: number;
    statusCodeDistribution: Record<string, number>;
  };
  system: {
    cpu: { usage: number; loadAverage: number[] };
    memory: { used: number; total: number; percentage: number };
    uptime: number;
  };
  health: {
    isHealthy: boolean;
    uptime: number;
    memoryUsage: number;
    cpuUsage: number;
    requestRate: number;
    errorRate: number;
  };
}

export class A2AClient extends EventEmitter {
  private config: A2AConfig;
  private httpClient: AxiosInstance;
  private wsClient: WebSocket | null = null;
  private isConnected: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectDelay: number = 1000;
  private subscribedTopics: Set<string> = new Set();

  constructor(config: A2AConfig) {
    super();
    
    this.config = {
      gatewayUrl: config.gatewayUrl,
      apiKey: config.apiKey,
      token: config.token,
      timeout: config.timeout || 30000,
      retries: config.retries || 3,
      retryDelay: config.retryDelay || 1000,
    };

    this.httpClient = axios.create({
      baseURL: this.config.gatewayUrl,
      timeout: this.config.timeout,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'A2A-SDK-Node/1.0.0',
      },
    });

    this.setupHttpClient();
  }

  private setupHttpClient(): void {
    // Request interceptor
    this.httpClient.interceptors.request.use(
      (config) => {
        if (this.config.apiKey) {
          config.headers['Authorization'] = `Bearer ${this.config.apiKey}`;
        } else if (this.config.token) {
          config.headers['Authorization'] = `Bearer ${this.config.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.httpClient.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          this.emit('unauthorized');
        }
        return Promise.reject(error);
      }
    );
  }

  // Authentication methods
  async login(username: string, password: string): Promise<{ token: string; user: any }> {
    try {
      const response = await this.httpClient.post('/api/auth/login', {
        username,
        password,
      });

      this.config.token = response.data.token;
      this.emit('authenticated', response.data.user);

      return response.data;
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }

  async register(userData: {
    username: string;
    email: string;
    password: string;
    role?: string;
  }): Promise<{ user: any }> {
    try {
      const response = await this.httpClient.post('/api/auth/register', userData);
      this.emit('registered', response.data.user);
      return response.data;
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }

  async refreshToken(): Promise<{ token: string }> {
    try {
      const response = await this.httpClient.post('/api/auth/refresh', {
        token: this.config.token,
      });

      this.config.token = response.data.token;
      return response.data;
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }

  // Message publishing
  async publishMessage(
    topic: string,
    message: Partial<A2AMessage>
  ): Promise<{ messageId: string; timestamp: string }> {
    try {
      const response = await this.httpClient.post('/api/messages/publish', {
        topic,
        type: message.type || 'notification',
        target: message.target || 'gateway',
        payload: message.payload,
        priority: message.priority || 'normal',
        correlationId: message.correlationId,
      });

      this.emit('messagePublished', {
        topic,
        messageId: response.data.messageId,
        timestamp: response.data.timestamp,
      });

      return response.data;
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }

  // Message subscription
  async subscribeToTopic(
    topic: string,
    handler?: string
  ): Promise<{ topic: string; handler?: string }> {
    try {
      const response = await this.httpClient.post('/api/messages/subscribe', {
        topic,
        handler,
      });

      this.subscribedTopics.add(topic);
      this.emit('subscribed', { topic, handler });

      return response.data;
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }

  async unsubscribeFromTopic(topic: string): Promise<{ topic: string }> {
    try {
      const response = await this.httpClient.delete(`/api/messages/subscribe/${topic}`);

      this.subscribedTopics.delete(topic);
      this.emit('unsubscribed', { topic });

      return response.data;
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }

  // WebSocket connection
  async connectWebSocket(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const wsUrl = this.config.gatewayUrl.replace('http', 'ws') + '/ws/a2a';
        this.wsClient = new WebSocket(wsUrl);

        this.wsClient.on('open', () => {
          this.isConnected = true;
          this.reconnectAttempts = 0;
          this.emit('connected');
          
          // Authenticate if token is available
          if (this.config.token) {
            this.authenticateWebSocket();
          }
          
          resolve();
        });

        this.wsClient.on('message', (data: string) => {
          try {
            const message: A2AWebSocketMessage = JSON.parse(data);
            this.handleWebSocketMessage(message);
          } catch (error) {
            this.emit('error', error);
          }
        });

        this.wsClient.on('close', () => {
          this.isConnected = false;
          this.emit('disconnected');
          this.attemptReconnect();
        });

        this.wsClient.on('error', (error) => {
          this.emit('error', error);
          reject(error);
        });

      } catch (error) {
        reject(error);
      }
    });
  }

  private authenticateWebSocket(): void {
    if (this.wsClient && this.isConnected) {
      this.wsClient.send(JSON.stringify({
        type: 'auth',
        payload: { token: this.config.token },
      }));
    }
  }

  private handleWebSocketMessage(message: A2AWebSocketMessage): void {
    switch (message.type) {
      case 'auth_success':
        this.emit('authenticated', message.payload);
        break;
      case 'auth_error':
        this.emit('authError', message.payload);
        break;
      case 'subscribe_success':
        this.emit('subscribeSuccess', message.payload);
        break;
      case 'publish_success':
        this.emit('publishSuccess', message.payload);
        break;
      case 'message':
        this.emit('message', message.payload);
        break;
      case 'error':
        this.emit('error', message.payload);
        break;
      default:
        this.emit('unknownMessage', message);
    }
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
      
      setTimeout(() => {
        this.emit('reconnecting', { attempt: this.reconnectAttempts });
        this.connectWebSocket().catch((error) => {
          this.emit('reconnectFailed', { attempt: this.reconnectAttempts, error });
        });
      }, delay);
    } else {
      this.emit('reconnectFailed', { attempts: this.reconnectAttempts });
    }
  }

  // WebSocket message publishing
  async publishWebSocketMessage(topic: string, payload: any): Promise<void> {
    if (!this.wsClient || !this.isConnected) {
      throw new Error('WebSocket not connected');
    }

    this.wsClient.send(JSON.stringify({
      type: 'publish',
      payload: { topic, payload },
    }));
  }

  // WebSocket subscription
  async subscribeWebSocket(topics: string[]): Promise<void> {
    if (!this.wsClient || !this.isConnected) {
      throw new Error('WebSocket not connected');
    }

    this.wsClient.send(JSON.stringify({
      type: 'subscribe',
      payload: { topics },
    }));
  }

  // Health and status
  async getHealthStatus(): Promise<A2AHealthStatus> {
    try {
      const response = await this.httpClient.get('/api/health');
      return response.data;
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }

  async getMetrics(): Promise<A2AMetrics> {
    try {
      const response = await this.httpClient.get('/api/metrics');
      return response.data.metrics;
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }

  async getSystemStatus(): Promise<any> {
    try {
      const response = await this.httpClient.get('/');
      return response.data;
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }

  // Queue management
  async getQueueInfo(queueName: string): Promise<any> {
    try {
      const response = await this.httpClient.get(`/api/messages/queues/${queueName}`);
      return response.data;
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }

  async purgeQueue(queueName: string): Promise<void> {
    try {
      await this.httpClient.delete(`/api/messages/queues/${queueName}`);
      this.emit('queuePurged', { queueName });
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }

  // Custom metrics
  async recordCustomMetric(name: string, value: number, labels?: Record<string, string>): Promise<void> {
    try {
      await this.httpClient.post('/api/metrics/custom', {
        name,
        value,
        labels,
      });
      this.emit('metricRecorded', { name, value, labels });
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }

  async incrementCounter(name: string, labels?: Record<string, string>): Promise<number> {
    try {
      const response = await this.httpClient.post(`/api/metrics/counters/${name}/increment`, {
        labels,
      });
      return response.data.value;
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }

  async setGauge(name: string, value: number, labels?: Record<string, string>): Promise<void> {
    try {
      await this.httpClient.post(`/api/metrics/gauges/${name}`, {
        value,
        labels,
      });
      this.emit('gaugeSet', { name, value, labels });
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }

  // Utility methods
  isWebSocketConnected(): boolean {
    return this.isConnected && this.wsClient?.readyState === WebSocket.OPEN;
  }

  getSubscribedTopics(): string[] {
    return Array.from(this.subscribedTopics);
  }

  // Cleanup
  async disconnect(): Promise<void> {
    if (this.wsClient) {
      this.wsClient.close();
      this.wsClient = null;
    }
    this.isConnected = false;
    this.emit('disconnected');
  }

  // Event handlers
  on(event: 'connected', listener: () => void): this;
  on(event: 'disconnected', listener: () => void): this;
  on(event: 'authenticated', listener: (user: any) => void): this;
  on(event: 'message', listener: (message: any) => void): this;
  on(event: 'error', listener: (error: any) => void): this;
  on(event: 'messagePublished', listener: (data: any) => void): this;
  on(event: 'subscribed', listener: (data: any) => void): this;
  on(event: 'unsubscribed', listener: (data: any) => void): this;
  on(event: 'reconnecting', listener: (data: any) => void): this;
  on(event: 'reconnectFailed', listener: (data: any) => void): this;
  on(event: string | symbol, listener: (...args: any[]) => void): this {
    return super.on(event, listener);
  }
}

// Factory function
export function createA2AClient(config: A2AConfig): A2AClient {
  return new A2AClient(config);
}

// Default export
export default A2AClient;
