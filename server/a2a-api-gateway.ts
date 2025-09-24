// A2A API Gateway - نظام بوابة API للتكامل الشامل
// نظام إدارة جميع الاتصالات بين التطبيقات والأوتوبيلوت وبوت تيليجرام

import express, { Request, Response, NextFunction } from 'express';
import { WebSocketServer, WebSocket } from 'ws';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';
import { createHash, randomBytes } from 'crypto';
import { EventEmitter } from 'events';
import { getLogger } from './lib/advanced-logger.js';

// Types and Interfaces
interface A2AConfig {
  port: number;
  jwtSecret: string;
  rateLimitWindow: number;
  maxRequestsPerWindow: number;
  enableWebSocket: boolean;
  enableTelegramIntegration: boolean;
  enableAutopilotIntegration: boolean;
  enableApplicationIntegration: boolean;
}

interface A2AMessage {
  id: string;
  type: 'request' | 'response' | 'notification' | 'error';
  source: 'application' | 'autopilot' | 'telegram' | 'gateway';
  target: 'application' | 'autopilot' | 'telegram' | 'gateway';
  payload: any;
  timestamp: Date;
  correlationId?: string;
  priority: 'low' | 'normal' | 'high' | 'critical';
}

interface A2AConnection {
  id: string;
  type: 'application' | 'autopilot' | 'telegram';
  clientId: string;
  ws?: WebSocket;
  lastSeen: Date;
  isActive: boolean;
  metadata: any;
}

interface A2AMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  activeConnections: number;
  messagesPerSecond: number;
  uptime: number;
}

export class A2AAPIGateway extends EventEmitter {
  private app: express.Application;
  private server: any;
  private wss: WebSocketServer;
  private config: A2AConfig;
  private connections: Map<string, A2AConnection> = new Map();
  private messageQueue: A2AMessage[] = [];
  private metrics: A2AMetrics;
  private logger: any;
  private isRunning: boolean = false;
  private startTime: Date = new Date();

  constructor(config: Partial<A2AConfig> = {}) {
    super();
    
    this.config = {
      port: config.port || 3001,
      jwtSecret: config.jwtSecret || process.env.JWT_SECRET || 'auraos-a2a-secret',
      rateLimitWindow: config.rateLimitWindow || 15 * 60 * 1000, // 15 minutes
      maxRequestsPerWindow: config.maxRequestsPerWindow || 1000,
      enableWebSocket: config.enableWebSocket !== false,
      enableTelegramIntegration: config.enableTelegramIntegration !== false,
      enableAutopilotIntegration: config.enableAutopilotIntegration !== false,
      enableApplicationIntegration: config.enableApplicationIntegration !== false,
    };

    this.logger = getLogger();
    this.metrics = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      averageResponseTime: 0,
      activeConnections: 0,
      messagesPerSecond: 0,
      uptime: 0,
    };

    this.initializeApp();
    this.setupMiddleware();
    this.setupRoutes();
    this.setupWebSocket();
    this.setupMessageProcessor();
    this.setupMetricsCollector();

    this.logger.info('🚀 A2A API Gateway initialized');
  }

  private initializeApp(): void {
    this.app = express();
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true }));
  }

  private setupMiddleware(): void {
    // Security middleware
    this.app.use(helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
    }));

    // CORS configuration
    this.app.use(cors({
      origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    }));

    // Rate limiting
    const limiter = rateLimit({
      windowMs: this.config.rateLimitWindow,
      max: this.config.maxRequestsPerWindow,
      message: {
        error: 'Too many requests',
        retryAfter: Math.ceil(this.config.rateLimitWindow / 1000),
      },
      standardHeaders: true,
      legacyHeaders: false,
    });

    this.app.use('/api/a2a', limiter);

    // Request logging
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      this.metrics.totalRequests++;
      const startTime = Date.now();
      
      res.on('finish', () => {
        const responseTime = Date.now() - startTime;
        this.updateResponseTime(responseTime);
        
        if (res.statusCode >= 200 && res.statusCode < 400) {
          this.metrics.successfulRequests++;
        } else {
          this.metrics.failedRequests++;
        }

        this.logger.info('A2A Request', {
          method: req.method,
          url: req.url,
          statusCode: res.statusCode,
          responseTime: `${responseTime}ms`,
          userAgent: req.get('User-Agent'),
        });
      });

      next();
    });
  }

  private setupRoutes(): void {
    // Health check endpoint
    this.app.get('/api/a2a/health', (req: Request, res: Response) => {
      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: Date.now() - this.startTime.getTime(),
        metrics: this.metrics,
        connections: this.connections.size,
        version: '1.0.0',
      });
    });

    // Authentication endpoint
    this.app.post('/api/a2a/auth', this.handleAuthentication.bind(this));

    // Message routing endpoints
    this.app.post('/api/a2a/message', this.handleMessage.bind(this));
    this.app.get('/api/a2a/messages', this.getMessages.bind(this));
    this.app.delete('/api/a2a/message/:id', this.deleteMessage.bind(this));

    // Connection management
    this.app.get('/api/a2a/connections', this.getConnections.bind(this));
    this.app.post('/api/a2a/connections/:id/heartbeat', this.handleHeartbeat.bind(this));
    this.app.delete('/api/a2a/connections/:id', this.disconnectClient.bind(this));

    // Metrics endpoint
    this.app.get('/api/a2a/metrics', this.getMetrics.bind(this));

    // Webhook endpoints for external integrations
    this.app.post('/api/a2a/webhook/telegram', this.handleTelegramWebhook.bind(this));
    this.app.post('/api/a2a/webhook/autopilot', this.handleAutopilotWebhook.bind(this));
    this.app.post('/api/a2a/webhook/application', this.handleApplicationWebhook.bind(this));

    // Error handling
    this.app.use(this.errorHandler.bind(this));
  }

  private setupWebSocket(): void {
    if (!this.config.enableWebSocket) return;

    this.wss = new WebSocketServer({ 
      port: this.config.port + 1,
      path: '/ws/a2a',
    });

    this.wss.on('connection', (ws: WebSocket, req) => {
      const clientId = this.generateClientId();
      const connection: A2AConnection = {
        id: clientId,
        type: 'application', // Default type, will be updated after authentication
        clientId,
        ws,
        lastSeen: new Date(),
        isActive: true,
        metadata: {
          userAgent: req.headers['user-agent'],
          ip: req.socket.remoteAddress,
        },
      };

      this.connections.set(clientId, connection);
      this.metrics.activeConnections = this.connections.size;

      this.logger.info('New WebSocket connection', { clientId });

      ws.on('message', (data: string) => {
        try {
          const message = JSON.parse(data) as A2AMessage;
          this.handleWebSocketMessage(connection, message);
        } catch (error) {
          this.logger.error('Invalid WebSocket message', { error, clientId });
          ws.send(JSON.stringify({
            type: 'error',
            message: 'Invalid message format',
          }));
        }
      });

      ws.on('close', () => {
        this.handleDisconnection(connection);
      });

      ws.on('error', (error) => {
        this.logger.error('WebSocket error', { error, clientId });
        this.handleDisconnection(connection);
      });

      // Send welcome message
      ws.send(JSON.stringify({
        type: 'welcome',
        clientId,
        timestamp: new Date().toISOString(),
        message: 'Connected to A2A API Gateway',
      }));
    });
  }

  private setupMessageProcessor(): void {
    // Process message queue every 100ms
    setInterval(() => {
      this.processMessageQueue();
    }, 100);

    // Clean up old messages every hour
    setInterval(() => {
      this.cleanupOldMessages();
    }, 60 * 60 * 1000);
  }

  private setupMetricsCollector(): void {
    // Update metrics every 5 seconds
    setInterval(() => {
      this.updateMetrics();
    }, 5000);
  }

  // Authentication handler
  private async handleAuthentication(req: Request, res: Response): Promise<void> {
    try {
      const { clientId, clientSecret, connectionType } = req.body;

      if (!clientId || !clientSecret) {
        res.status(400).json({
          error: 'Client ID and secret are required',
        });
        return;
      }

      // Validate client credentials
      const isValid = await this.validateClientCredentials(clientId, clientSecret);
      if (!isValid) {
        res.status(401).json({
          error: 'Invalid client credentials',
        });
        return;
      }

      // Generate JWT token
      const token = jwt.sign(
        {
          clientId,
          connectionType: connectionType || 'application',
          iat: Math.floor(Date.now() / 1000),
        },
        this.config.jwtSecret,
        { expiresIn: '24h' }
      );

      res.json({
        token,
        expiresIn: '24h',
        clientId,
        connectionType: connectionType || 'application',
      });

      this.logger.info('Client authenticated', { clientId, connectionType });
    } catch (error) {
      this.logger.error('Authentication error', { error });
      res.status(500).json({
        error: 'Internal server error',
      });
    }
  }

  // Message handling
  private async handleMessage(req: Request, res: Response): Promise<void> {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, this.config.jwtSecret) as any;

      const message: A2AMessage = {
        id: this.generateMessageId(),
        type: req.body.type || 'request',
        source: decoded.connectionType,
        target: req.body.target || 'gateway',
        payload: req.body.payload,
        timestamp: new Date(),
        correlationId: req.body.correlationId,
        priority: req.body.priority || 'normal',
      };

      // Add to message queue
      this.messageQueue.push(message);

      // Process immediately if high priority
      if (message.priority === 'critical' || message.priority === 'high') {
        await this.processMessage(message);
      }

      res.json({
        messageId: message.id,
        status: 'queued',
        timestamp: message.timestamp,
      });

      this.emit('messageReceived', message);
    } catch (error) {
      this.logger.error('Message handling error', { error });
      res.status(500).json({
        error: 'Failed to process message',
      });
    }
  }

  // WebSocket message handling
  private async handleWebSocketMessage(connection: A2AConnection, message: A2AMessage): Promise<void> {
    try {
      // Authenticate WebSocket connection
      if (message.type === 'auth') {
        const { token } = message.payload;
        const decoded = jwt.verify(token, this.config.jwtSecret) as any;
        
        connection.type = decoded.connectionType;
        connection.metadata.authenticated = true;
        
        connection.ws?.send(JSON.stringify({
          type: 'auth_success',
          clientId: connection.clientId,
          connectionType: connection.type,
        }));
        
        return;
      }

      // Process authenticated messages
      if (!connection.metadata.authenticated) {
        connection.ws?.send(JSON.stringify({
          type: 'error',
          message: 'Authentication required',
        }));
        return;
      }

      message.id = this.generateMessageId();
      message.source = connection.type;
      message.timestamp = new Date();

      this.messageQueue.push(message);
      await this.processMessage(message);

    } catch (error) {
      this.logger.error('WebSocket message error', { error, clientId: connection.clientId });
      connection.ws?.send(JSON.stringify({
        type: 'error',
        message: 'Failed to process message',
      }));
    }
  }

  // Message processing
  private async processMessage(message: A2AMessage): Promise<void> {
    try {
      this.logger.info('Processing message', {
        id: message.id,
        type: message.type,
        source: message.source,
        target: message.target,
      });

      // Route message based on target
      switch (message.target) {
        case 'telegram':
          await this.routeToTelegram(message);
          break;
        case 'autopilot':
          await this.routeToAutopilot(message);
          break;
        case 'application':
          await this.routeToApplication(message);
          break;
        case 'gateway':
          await this.handleGatewayMessage(message);
          break;
        default:
          this.logger.warn('Unknown message target', { target: message.target });
      }

      this.emit('messageProcessed', message);
    } catch (error) {
      this.logger.error('Message processing error', { error, messageId: message.id });
      this.emit('messageError', { message, error });
    }
  }

  // Message routing methods
  private async routeToTelegram(message: A2AMessage): Promise<void> {
    if (!this.config.enableTelegramIntegration) {
      throw new Error('Telegram integration is disabled');
    }

    // Route to Telegram bot
    const telegramConnections = Array.from(this.connections.values())
      .filter(conn => conn.type === 'telegram' && conn.isActive);

    for (const connection of telegramConnections) {
      if (connection.ws) {
        connection.ws.send(JSON.stringify(message));
      }
    }

    this.logger.info('Message routed to Telegram', { messageId: message.id });
  }

  private async routeToAutopilot(message: A2AMessage): Promise<void> {
    if (!this.config.enableAutopilotIntegration) {
      throw new Error('Autopilot integration is disabled');
    }

    // Route to Autopilot system
    const autopilotConnections = Array.from(this.connections.values())
      .filter(conn => conn.type === 'autopilot' && conn.isActive);

    for (const connection of autopilotConnections) {
      if (connection.ws) {
        connection.ws.send(JSON.stringify(message));
      }
    }

    this.logger.info('Message routed to Autopilot', { messageId: message.id });
  }

  private async routeToApplication(message: A2AMessage): Promise<void> {
    if (!this.config.enableApplicationIntegration) {
      throw new Error('Application integration is disabled');
    }

    // Route to applications
    const applicationConnections = Array.from(this.connections.values())
      .filter(conn => conn.type === 'application' && conn.isActive);

    for (const connection of applicationConnections) {
      if (connection.ws) {
        connection.ws.send(JSON.stringify(message));
      }
    }

    this.logger.info('Message routed to Applications', { messageId: message.id });
  }

  private async handleGatewayMessage(message: A2AMessage): Promise<void> {
    // Handle gateway-specific messages
    switch (message.type) {
      case 'request':
        await this.handleGatewayRequest(message);
        break;
      case 'notification':
        await this.handleGatewayNotification(message);
        break;
      default:
        this.logger.warn('Unknown gateway message type', { type: message.type });
    }
  }

  private async handleGatewayRequest(message: A2AMessage): Promise<void> {
    // Process gateway requests
    const response: A2AMessage = {
      id: this.generateMessageId(),
      type: 'response',
      source: 'gateway',
      target: message.source,
      payload: {
        status: 'success',
        data: { message: 'Gateway request processed' },
      },
      timestamp: new Date(),
      correlationId: message.correlationId,
      priority: message.priority,
    };

    this.messageQueue.push(response);
  }

  private async handleGatewayNotification(message: A2AMessage): Promise<void> {
    // Broadcast notifications to all connected clients
    const notification: A2AMessage = {
      id: this.generateMessageId(),
      type: 'notification',
      source: 'gateway',
      target: 'all',
      payload: message.payload,
      timestamp: new Date(),
      priority: message.priority,
    };

    // Broadcast to all active connections
    for (const connection of this.connections.values()) {
      if (connection.ws && connection.isActive) {
        connection.ws.send(JSON.stringify(notification));
      }
    }
  }

  // Webhook handlers
  private async handleTelegramWebhook(req: Request, res: Response): Promise<void> {
    try {
      const update = req.body;
      
      const message: A2AMessage = {
        id: this.generateMessageId(),
        type: 'notification',
        source: 'telegram',
        target: 'gateway',
        payload: update,
        timestamp: new Date(),
        priority: 'normal',
      };

      this.messageQueue.push(message);
      await this.processMessage(message);

      res.json({ status: 'ok' });
    } catch (error) {
      this.logger.error('Telegram webhook error', { error });
      res.status(500).json({ error: 'Webhook processing failed' });
    }
  }

  private async handleAutopilotWebhook(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body;
      
      const message: A2AMessage = {
        id: this.generateMessageId(),
        type: 'notification',
        source: 'autopilot',
        target: 'gateway',
        payload: data,
        timestamp: new Date(),
        priority: 'normal',
      };

      this.messageQueue.push(message);
      await this.processMessage(message);

      res.json({ status: 'ok' });
    } catch (error) {
      this.logger.error('Autopilot webhook error', { error });
      res.status(500).json({ error: 'Webhook processing failed' });
    }
  }

  private async handleApplicationWebhook(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body;
      
      const message: A2AMessage = {
        id: this.generateMessageId(),
        type: 'notification',
        source: 'application',
        target: 'gateway',
        payload: data,
        timestamp: new Date(),
        priority: 'normal',
      };

      this.messageQueue.push(message);
      await this.processMessage(message);

      res.json({ status: 'ok' });
    } catch (error) {
      this.logger.error('Application webhook error', { error });
      res.status(500).json({ error: 'Webhook processing failed' });
    }
  }

  // Utility methods
  private generateClientId(): string {
    return `client_${randomBytes(16).toString('hex')}`;
  }

  private generateMessageId(): string {
    return `msg_${Date.now()}_${randomBytes(8).toString('hex')}`;
  }

  private async validateClientCredentials(clientId: string, clientSecret: string): Promise<boolean> {
    // In a real implementation, this would validate against a database
    // For now, we'll use a simple validation
    const expectedSecret = createHash('sha256').update(clientId).digest('hex');
    return clientSecret === expectedSecret;
  }

  private processMessageQueue(): void {
    if (this.messageQueue.length === 0) return;

    const messages = this.messageQueue.splice(0, 10); // Process up to 10 messages at a time
    
    for (const message of messages) {
      this.processMessage(message).catch(error => {
        this.logger.error('Queue processing error', { error, messageId: message.id });
      });
    }
  }

  private cleanupOldMessages(): void {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    this.messageQueue = this.messageQueue.filter(msg => msg.timestamp > oneHourAgo);
  }

  private updateMetrics(): void {
    this.metrics.uptime = Date.now() - this.startTime.getTime();
    this.metrics.activeConnections = this.connections.size;
    
    // Calculate messages per second
    const now = Date.now();
    const messagesInLastSecond = this.messageQueue.filter(
      msg => now - msg.timestamp.getTime() < 1000
    ).length;
    this.metrics.messagesPerSecond = messagesInLastSecond;
  }

  private updateResponseTime(responseTime: number): void {
    // Update average response time using exponential moving average
    const alpha = 0.1;
    this.metrics.averageResponseTime = 
      alpha * responseTime + (1 - alpha) * this.metrics.averageResponseTime;
  }

  private handleDisconnection(connection: A2AConnection): void {
    connection.isActive = false;
    this.connections.delete(connection.id);
    this.metrics.activeConnections = this.connections.size;
    
    this.logger.info('Client disconnected', { clientId: connection.clientId });
    this.emit('clientDisconnected', connection);
  }

  // API endpoints
  private async getMessages(req: Request, res: Response): Promise<void> {
    try {
      const { limit = 50, offset = 0, type, source, target } = req.query;
      
      let filteredMessages = this.messageQueue;
      
      if (type) filteredMessages = filteredMessages.filter(msg => msg.type === type);
      if (source) filteredMessages = filteredMessages.filter(msg => msg.source === source);
      if (target) filteredMessages = filteredMessages.filter(msg => msg.target === target);
      
      const paginatedMessages = filteredMessages
        .slice(Number(offset), Number(offset) + Number(limit))
        .map(msg => ({
          id: msg.id,
          type: msg.type,
          source: msg.source,
          target: msg.target,
          timestamp: msg.timestamp,
          priority: msg.priority,
          correlationId: msg.correlationId,
        }));

      res.json({
        messages: paginatedMessages,
        total: filteredMessages.length,
        limit: Number(limit),
        offset: Number(offset),
      });
    } catch (error) {
      this.logger.error('Get messages error', { error });
      res.status(500).json({ error: 'Failed to retrieve messages' });
    }
  }

  private async deleteMessage(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const messageIndex = this.messageQueue.findIndex(msg => msg.id === id);
      
      if (messageIndex === -1) {
        res.status(404).json({ error: 'Message not found' });
        return;
      }
      
      this.messageQueue.splice(messageIndex, 1);
      res.json({ success: true });
    } catch (error) {
      this.logger.error('Delete message error', { error });
      res.status(500).json({ error: 'Failed to delete message' });
    }
  }

  private async getConnections(req: Request, res: Response): Promise<void> {
    try {
      const connections = Array.from(this.connections.values()).map(conn => ({
        id: conn.id,
        type: conn.type,
        clientId: conn.clientId,
        lastSeen: conn.lastSeen,
        isActive: conn.isActive,
        metadata: {
          userAgent: conn.metadata.userAgent,
          ip: conn.metadata.ip,
          authenticated: conn.metadata.authenticated,
        },
      }));

      res.json({
        connections,
        total: connections.length,
        active: connections.filter(conn => conn.isActive).length,
      });
    } catch (error) {
      this.logger.error('Get connections error', { error });
      res.status(500).json({ error: 'Failed to retrieve connections' });
    }
  }

  private async handleHeartbeat(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const connection = this.connections.get(id);
      
      if (!connection) {
        res.status(404).json({ error: 'Connection not found' });
        return;
      }
      
      connection.lastSeen = new Date();
      connection.isActive = true;
      
      res.json({ 
        success: true, 
        lastSeen: connection.lastSeen,
        isActive: connection.isActive,
      });
    } catch (error) {
      this.logger.error('Heartbeat error', { error });
      res.status(500).json({ error: 'Failed to update heartbeat' });
    }
  }

  private async disconnectClient(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const connection = this.connections.get(id);
      
      if (!connection) {
        res.status(404).json({ error: 'Connection not found' });
        return;
      }
      
      if (connection.ws) {
        connection.ws.close();
      }
      
      this.handleDisconnection(connection);
      res.json({ success: true });
    } catch (error) {
      this.logger.error('Disconnect client error', { error });
      res.status(500).json({ error: 'Failed to disconnect client' });
    }
  }

  private async getMetrics(req: Request, res: Response): Promise<void> {
    try {
      res.json({
        ...this.metrics,
        uptime: Math.floor(this.metrics.uptime / 1000), // Convert to seconds
        messageQueueSize: this.messageQueue.length,
        connections: {
          total: this.connections.size,
          byType: {
            application: Array.from(this.connections.values()).filter(c => c.type === 'application').length,
            autopilot: Array.from(this.connections.values()).filter(c => c.type === 'autopilot').length,
            telegram: Array.from(this.connections.values()).filter(c => c.type === 'telegram').length,
          },
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      this.logger.error('Get metrics error', { error });
      res.status(500).json({ error: 'Failed to retrieve metrics' });
    }
  }

  private errorHandler(error: any, req: Request, res: Response, next: NextFunction): void {
    this.logger.error('A2A Gateway error', { error, url: req.url, method: req.method });
    
    res.status(500).json({
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
    });
  }

  // Public methods
  public async start(): Promise<void> {
    if (this.isRunning) {
      this.logger.warn('A2A Gateway is already running');
      return;
    }

    return new Promise((resolve, reject) => {
      this.server = this.app.listen(this.config.port, (error?: Error) => {
        if (error) {
          this.logger.error('Failed to start A2A Gateway', { error });
          reject(error);
          return;
        }

        this.isRunning = true;
        this.logger.info('A2A API Gateway started', {
          port: this.config.port,
          webSocketPort: this.config.port + 1,
          features: {
            webSocket: this.config.enableWebSocket,
            telegram: this.config.enableTelegramIntegration,
            autopilot: this.config.enableAutopilotIntegration,
            application: this.config.enableApplicationIntegration,
          },
        });

        resolve();
      });
    });
  }

  public async stop(): Promise<void> {
    if (!this.isRunning) {
      this.logger.warn('A2A Gateway is not running');
      return;
    }

    return new Promise((resolve) => {
      // Close all WebSocket connections
      for (const connection of this.connections.values()) {
        if (connection.ws) {
          connection.ws.close();
        }
      }

      // Close HTTP server
      if (this.server) {
        this.server.close(() => {
          this.isRunning = false;
          this.logger.info('A2A API Gateway stopped');
          resolve();
        });
      } else {
        this.isRunning = false;
        resolve();
      }
    });
  }

  public getMetrics(): A2AMetrics {
    return { ...this.metrics };
  }

  public getConnections(): A2AConnection[] {
    return Array.from(this.connections.values());
  }

  public async broadcastMessage(message: Partial<A2AMessage>): Promise<void> {
    const fullMessage: A2AMessage = {
      id: this.generateMessageId(),
      type: message.type || 'notification',
      source: message.source || 'gateway',
      target: message.target || 'all',
      payload: message.payload || {},
      timestamp: new Date(),
      priority: message.priority || 'normal',
      correlationId: message.correlationId,
    };

    this.messageQueue.push(fullMessage);
    await this.processMessage(fullMessage);
  }
}

// Export singleton instance
let gatewayInstance: A2AAPIGateway | null = null;

export function getA2AAPIGateway(config?: Partial<A2AConfig>): A2AAPIGateway {
  if (!gatewayInstance) {
    gatewayInstance = new A2AAPIGateway(config);
  }
  return gatewayInstance;
}

export function initializeA2AAPIGateway(config?: Partial<A2AConfig>): A2AAPIGateway {
  return getA2AAPIGateway(config);
}
