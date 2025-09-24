// A2A API Gateway - Main Entry Point
// Production-ready API Gateway for A2A Integration System

import express, { Application, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

// Import custom modules
import { Logger } from './src/utils/logger.js';
import { RedisClient } from './src/services/redis.js';
import { MessageBroker } from './src/services/messageBroker.js';
import { AuthService } from './src/services/auth.js';
import { MetricsCollector } from './src/services/metrics.js';
import { HealthChecker } from './src/services/health.js';

// Import routes
import { authRoutes } from './src/routes/auth.js';
import { messageRoutes } from './src/routes/messages.js';
import { webhookRoutes } from './src/routes/webhooks.js';
import { metricsRoutes } from './src/routes/metrics.js';
import { healthRoutes } from './src/routes/health.js';

// Load environment variables
dotenv.config();

// Types
interface GatewayConfig {
  port: number;
  host: string;
  nodeEnv: string;
  jwtSecret: string;
  redis: {
    host: string;
    port: number;
    password?: string;
    db: number;
  };
  rabbitmq: {
    url: string;
    exchange: string;
    queuePrefix: string;
  };
  rateLimit: {
    windowMs: number;
    max: number;
  };
  cors: {
    origins: string[];
  };
  websocket: {
    port: number;
    path: string;
  };
}

class A2AAPIGateway {
  private app: Application;
  private server: any;
  private wss: WebSocketServer;
  private config: GatewayConfig;
  private logger: Logger;
  private redis: RedisClient;
  private messageBroker: MessageBroker;
  private authService: AuthService;
  private metricsCollector: MetricsCollector;
  private healthChecker: HealthChecker;
  private isRunning: boolean = false;

  constructor() {
    this.config = this.loadConfig();
    this.logger = new Logger(this.config.nodeEnv);
    this.redis = new RedisClient(this.config.redis);
    this.messageBroker = new MessageBroker(this.config.rabbitmq);
    this.authService = new AuthService(this.config.jwtSecret);
    this.metricsCollector = new MetricsCollector();
    this.healthChecker = new HealthChecker();
    
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
    this.setupWebSocket();
    this.setupErrorHandling();
  }

  private loadConfig(): GatewayConfig {
    return {
      port: parseInt(process.env.PORT || '3001'),
      host: process.env.HOST || '0.0.0.0',
      nodeEnv: process.env.NODE_ENV || 'development',
      jwtSecret: process.env.JWT_SECRET || 'default-secret-change-me',
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD,
        db: parseInt(process.env.REDIS_DB || '0'),
      },
      rabbitmq: {
        url: process.env.RABBITMQ_URL || 'amqp://localhost:5672',
        exchange: process.env.RABBITMQ_EXCHANGE || 'a2a_events',
        queuePrefix: process.env.RABBITMQ_QUEUE_PREFIX || 'a2a',
      },
      rateLimit: {
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
        max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '1000'),
      },
      cors: {
        origins: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
      },
      websocket: {
        port: parseInt(process.env.WS_PORT || '3004'),
        path: process.env.WS_PATH || '/ws/a2a',
      },
    };
  }

  private setupMiddleware(): void {
    // Security middleware
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
      crossOriginEmbedderPolicy: false,
    }));

    // CORS
    this.app.use(cors({
      origin: this.config.cors.origins,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Request-ID'],
    }));

    // Compression
    this.app.use(compression());

    // Request logging
    this.app.use(morgan('combined', {
      stream: {
        write: (message: string) => {
          this.logger.info(message.trim());
        },
      },
    }));

    // Request ID middleware
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      req.id = req.headers['x-request-id'] as string || uuidv4();
      res.setHeader('X-Request-ID', req.id);
      next();
    });

    // Rate limiting
    const limiter = rateLimit({
      windowMs: this.config.rateLimit.windowMs,
      max: this.config.rateLimit.max,
      message: {
        error: 'Too many requests',
        retryAfter: Math.ceil(this.config.rateLimit.windowMs / 1000),
      },
      standardHeaders: true,
      legacyHeaders: false,
      keyGenerator: (req: Request) => {
        return req.ip || 'unknown';
      },
    });

    this.app.use('/api', limiter);

    // Body parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Metrics middleware
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      const startTime = Date.now();
      
      res.on('finish', () => {
        const duration = Date.now() - startTime;
        this.metricsCollector.recordRequest({
          method: req.method,
          url: req.url,
          statusCode: res.statusCode,
          duration,
          userAgent: req.get('User-Agent'),
          ip: req.ip,
        });
      });

      next();
    });
  }

  private setupRoutes(): void {
    // API routes
    this.app.use('/api/auth', authRoutes);
    this.app.use('/api/messages', messageRoutes);
    this.app.use('/api/webhooks', webhookRoutes);
    this.app.use('/api/metrics', metricsRoutes);
    this.app.use('/api/health', healthRoutes);

    // Root endpoint
    this.app.get('/', (req: Request, res: Response) => {
      res.json({
        name: 'A2A API Gateway',
        version: '1.0.0',
        status: 'running',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      });
    });

    // 404 handler
    this.app.use('*', (req: Request, res: Response) => {
      res.status(404).json({
        error: 'Not Found',
        message: `Route ${req.method} ${req.originalUrl} not found`,
        timestamp: new Date().toISOString(),
      });
    });
  }

  private setupWebSocket(): void {
    this.server = createServer(this.app);
    this.wss = new WebSocketServer({ 
      server: this.server,
      path: this.config.websocket.path,
    });

    this.wss.on('connection', (ws, req) => {
      const clientId = uuidv4();
      const clientIP = req.socket.remoteAddress || 'unknown';

      this.logger.info('WebSocket connection established', {
        clientId,
        clientIP,
        userAgent: req.headers['user-agent'],
      });

      // Send welcome message
      ws.send(JSON.stringify({
        type: 'welcome',
        clientId,
        timestamp: new Date().toISOString(),
        message: 'Connected to A2A API Gateway',
      }));

      ws.on('message', async (data: Buffer) => {
        try {
          const message = JSON.parse(data.toString());
          await this.handleWebSocketMessage(ws, message, clientId);
        } catch (error) {
          this.logger.error('WebSocket message error', { error, clientId });
          ws.send(JSON.stringify({
            type: 'error',
            message: 'Invalid message format',
            timestamp: new Date().toISOString(),
          }));
        }
      });

      ws.on('close', () => {
        this.logger.info('WebSocket connection closed', { clientId });
      });

      ws.on('error', (error) => {
        this.logger.error('WebSocket error', { error, clientId });
      });
    });
  }

  private async handleWebSocketMessage(ws: any, message: any, clientId: string): Promise<void> {
    try {
      switch (message.type) {
        case 'auth':
          await this.handleWebSocketAuth(ws, message, clientId);
          break;
        case 'subscribe':
          await this.handleWebSocketSubscribe(ws, message, clientId);
          break;
        case 'publish':
          await this.handleWebSocketPublish(ws, message, clientId);
          break;
        default:
          ws.send(JSON.stringify({
            type: 'error',
            message: 'Unknown message type',
            timestamp: new Date().toISOString(),
          }));
      }
    } catch (error) {
      this.logger.error('WebSocket message handling error', { error, clientId });
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Message processing failed',
        timestamp: new Date().toISOString(),
      }));
    }
  }

  private async handleWebSocketAuth(ws: any, message: any, clientId: string): Promise<void> {
    try {
      const { token } = message.payload;
      const decoded = await this.authService.verifyToken(token);
      
      ws.userId = decoded.userId;
      ws.authenticated = true;

      ws.send(JSON.stringify({
        type: 'auth_success',
        clientId,
        userId: decoded.userId,
        timestamp: new Date().toISOString(),
      }));

      this.logger.info('WebSocket authentication successful', { clientId, userId: decoded.userId });
    } catch (error) {
      ws.send(JSON.stringify({
        type: 'auth_error',
        message: 'Authentication failed',
        timestamp: new Date().toISOString(),
      }));
    }
  }

  private async handleWebSocketSubscribe(ws: any, message: any, clientId: string): Promise<void> {
    if (!ws.authenticated) {
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Authentication required',
        timestamp: new Date().toISOString(),
      }));
      return;
    }

    const { topics } = message.payload;
    ws.subscribedTopics = topics || [];

    ws.send(JSON.stringify({
      type: 'subscribe_success',
      topics: ws.subscribedTopics,
      timestamp: new Date().toISOString(),
    }));

    this.logger.info('WebSocket subscription successful', { clientId, topics: ws.subscribedTopics });
  }

  private async handleWebSocketPublish(ws: any, message: any, clientId: string): Promise<void> {
    if (!ws.authenticated) {
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Authentication required',
        timestamp: new Date().toISOString(),
      }));
      return;
    }

    const { topic, payload } = message.payload;
    
    // Publish message to broker
    await this.messageBroker.publish(topic, {
      ...payload,
      source: 'websocket',
      clientId,
      userId: ws.userId,
      timestamp: new Date().toISOString(),
    });

    ws.send(JSON.stringify({
      type: 'publish_success',
      topic,
      timestamp: new Date().toISOString(),
    }));

    this.logger.info('WebSocket message published', { clientId, topic });
  }

  private setupErrorHandling(): void {
    // Global error handler
    this.app.use((error: any, req: Request, res: Response, next: NextFunction) => {
      this.logger.error('Unhandled error', {
        error: error.message,
        stack: error.stack,
        url: req.url,
        method: req.method,
        requestId: req.id,
      });

      res.status(error.status || 500).json({
        error: 'Internal Server Error',
        message: this.config.nodeEnv === 'development' ? error.message : 'Something went wrong',
        requestId: req.id,
        timestamp: new Date().toISOString(),
      });
    });

    // Process error handlers
    process.on('uncaughtException', (error) => {
      this.logger.error('Uncaught Exception', { error: error.message, stack: error.stack });
      this.shutdown();
    });

    process.on('unhandledRejection', (reason, promise) => {
      this.logger.error('Unhandled Rejection', { reason, promise });
    });

    process.on('SIGTERM', () => {
      this.logger.info('SIGTERM received, shutting down gracefully');
      this.shutdown();
    });

    process.on('SIGINT', () => {
      this.logger.info('SIGINT received, shutting down gracefully');
      this.shutdown();
    });
  }

  public async start(): Promise<void> {
    if (this.isRunning) {
      this.logger.warn('Gateway is already running');
      return;
    }

    try {
      // Initialize services
      await this.redis.connect();
      await this.messageBroker.connect();
      await this.healthChecker.start();

      // Start server
      this.server.listen(this.config.port, this.config.host, () => {
        this.isRunning = true;
        this.logger.info('A2A API Gateway started', {
          port: this.config.port,
          host: this.config.host,
          websocketPort: this.config.websocket.port,
          environment: this.config.nodeEnv,
        });
      });

    } catch (error) {
      this.logger.error('Failed to start gateway', { error });
      throw error;
    }
  }

  public async shutdown(): Promise<void> {
    if (!this.isRunning) {
      return;
    }

    this.logger.info('Shutting down A2A API Gateway...');

    try {
      // Close WebSocket connections
      this.wss.clients.forEach((ws) => {
        ws.close();
      });

      // Close server
      this.server.close(() => {
        this.logger.info('HTTP server closed');
      });

      // Disconnect services
      await this.redis.disconnect();
      await this.messageBroker.disconnect();
      await this.healthChecker.stop();

      this.isRunning = false;
      this.logger.info('A2A API Gateway shutdown complete');

    } catch (error) {
      this.logger.error('Error during shutdown', { error });
    }
  }

  public getApp(): Application {
    return this.app;
  }

  public getServer(): any {
    return this.server;
  }

  public getWebSocketServer(): WebSocketServer {
    return this.wss;
  }

  public isHealthy(): boolean {
    return this.isRunning && this.redis.isConnected() && this.messageBroker.isConnected();
  }
}

// Create and export gateway instance
const gateway = new A2AAPIGateway();

// Start gateway if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  gateway.start().catch((error) => {
    console.error('Failed to start gateway:', error);
    process.exit(1);
  });
}

export default gateway;
export { A2AAPIGateway };
