// Production Deployment Configuration for Cursor-Telegram Integration
import { config } from 'dotenv';
import { EnhancedCursorTelegramIntegration } from './enhanced-cursor-telegram-integration.js';
import express from 'express';
import cors from 'cors';

// Load environment variables
config();

class CursorTelegramDeployment {
  private app: express.Application;
  private telegramIntegration: EnhancedCursorTelegramIntegration;
  private port: number;
  private isProduction: boolean;

  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.isProduction = process.env.NODE_ENV === 'production';

    this.setupMiddleware();
    this.setupRoutes();
    this.initializeTelegramIntegration();
  }

  private setupMiddleware() {
    // CORS configuration
    this.app.use(
      cors({
        origin: this.isProduction
          ? [
              'https://aios-97581.web.app',
              'https://aios-97581.firebaseapp.com',
              'https://amrikyyybot.vercel.app',
            ]
          : ['http://localhost:3000', 'http://localhost:5173'],
        credentials: true,
      })
    );

    // Body parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Security headers
    this.app.use((req, res, next) => {
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'DENY');
      res.setHeader('X-XSS-Protection', '1; mode=block');
      res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
      next();
    });

    // Request logging
    if (!this.isProduction) {
      this.app.use((req, res, next) => {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
        next();
      });
    }
  }

  private setupRoutes() {
    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        telegram: this.telegramIntegration?.getStatus() || {
          isConnected: false,
        },
      });
    });

    // Cursor-Telegram API routes
    this.app.use('/api/cursor-telegram', this.createCursorTelegramRoutes());

    // Root endpoint
    this.app.get('/', (req, res) => {
      res.json({
        message: 'Cursor-Telegram Integration API',
        version: '1.0.0',
        status: 'running',
        endpoints: {
          health: '/health',
          cursorTelegram: '/api/cursor-telegram',
          documentation: '/api/cursor-telegram/commands',
        },
      });
    });

    // 404 handler
    this.app.use('*', (req, res) => {
      res.status(404).json({
        error: 'Not Found',
        message: 'The requested endpoint does not exist',
        availableEndpoints: [
          '/health',
          '/api/cursor-telegram/status',
          '/api/cursor-telegram/commands',
        ],
      });
    });

    // Error handler
    this.app.use(
      (
        error: any,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
      ) => {
        console.error('Error:', error);
        res.status(500).json({
          error: 'Internal Server Error',
          message: this.isProduction ? 'Something went wrong' : error.message,
          timestamp: new Date().toISOString(),
        });
      }
    );
  }

  private createCursorTelegramRoutes() {
    const router = express.Router();

    // Get integration status
    router.get('/status', (req, res) => {
      try {
        const status = this.telegramIntegration.getStatus();
        res.json({
          success: true,
          data: {
            ...status,
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV || 'development',
            features: {
              codeGeneration: true,
              codeExplanation: true,
              codeRefactoring: true,
              debugging: true,
              testGeneration: true,
              generalQueries: true,
              fallbackMode: true,
            },
          },
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message,
        });
      }
    });

    // Get available commands
    router.get('/commands', (req, res) => {
      try {
        const commands = [
          {
            command: 'cursor',
            description: 'Ask Cursor AI anything',
            category: 'AI',
          },
          {
            command: 'code',
            description: 'Generate code based on description',
            category: 'AI',
          },
          {
            command: 'explain',
            description: 'Explain how code works',
            category: 'AI',
          },
          {
            command: 'refactor',
            description: 'Refactor code for better quality',
            category: 'AI',
          },
          {
            command: 'debug',
            description: 'Debug and fix code issues',
            category: 'AI',
          },
          {
            command: 'test',
            description: 'Generate comprehensive tests',
            category: 'AI',
          },
          {
            command: 'connect',
            description: 'Connect this chat to Cursor',
            category: 'Connection',
          },
          {
            command: 'help',
            description: 'Show help message',
            category: 'Connection',
          },
          {
            command: 'status',
            description: 'Check integration status',
            category: 'Connection',
          },
        ];

        res.json({
          success: true,
          data: commands,
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message,
        });
      }
    });

    // Send message to Cursor-connected chat
    router.post('/send-to-cursor', async (req, res) => {
      try {
        const { message } = req.body;

        if (!message) {
          return res.status(400).json({
            success: false,
            error: 'message is required',
          });
        }

        await this.telegramIntegration.sendToCursor(message);

        res.json({
          success: true,
          message: 'Message sent to Cursor chat successfully',
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message,
        });
      }
    });

    // Connect chat to Cursor
    router.post('/connect', async (req, res) => {
      try {
        const { chatId } = req.body;

        if (!chatId) {
          return res.status(400).json({
            success: false,
            error: 'chatId is required',
          });
        }

        res.json({
          success: true,
          message: 'Chat connected to Cursor successfully',
          chatId,
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message,
        });
      }
    });

    // Disconnect chat from Cursor
    router.post('/disconnect', async (req, res) => {
      try {
        this.telegramIntegration.disconnectCursor();

        res.json({
          success: true,
          message: 'Chat disconnected from Cursor successfully',
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message,
        });
      }
    });

    return router;
  }

  private initializeTelegramIntegration() {
    try {
      const telegramToken =
        process.env.TELEGRAM_BOT_TOKEN ||
        '8310343758:AAFLtyqdQ5PE8YtyChwJ4uGfAgy4s5qMYi0';
      const geminiApiKey =
        process.env.GEMINI_API_KEY || 'AIzaSyAA01N65C8bwPf1WnNj9qsR7nHfmXYoLjU';

      this.telegramIntegration = new EnhancedCursorTelegramIntegration(
        telegramToken,
        geminiApiKey
      );

      console.log('✅ Telegram integration initialized successfully');
      console.log(`🤖 Bot Token: ${telegramToken.substring(0, 10)}...`);
      console.log(`🔑 Gemini API: ${geminiApiKey.substring(0, 10)}...`);
    } catch (error) {
      console.error('❌ Failed to initialize Telegram integration:', error);
      process.exit(1);
    }
  }

  public start() {
    this.app.listen(this.port, () => {
      console.log('🚀 Cursor-Telegram Integration Server Started');
      console.log('='.repeat(50));
      console.log(`🌐 Server: http://localhost:${this.port}`);
      console.log(`📊 Health: http://localhost:${this.port}/health`);
      console.log(`🔌 API: http://localhost:${this.port}/api/cursor-telegram`);
      console.log(`📱 Telegram Bot: @Amrikyyybot`);
      console.log(`👨‍💻 Cursor Integration: Active`);
      console.log(`🔑 Gemini API: Connected`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log('='.repeat(50));
      console.log('✅ Ready for production deployment!');
    });
  }

  public getApp() {
    return this.app;
  }

  public getTelegramIntegration() {
    return this.telegramIntegration;
  }
}

// Export for use in other modules
export { CursorTelegramDeployment };

// Start server if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const deployment = new CursorTelegramDeployment();
  deployment.start();
}

export default CursorTelegramDeployment;
