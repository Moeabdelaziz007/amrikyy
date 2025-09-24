import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { logger } from './src/utils/logger.js';
import { redisClient } from './src/services/redis.js';
import { messageBroker } from './src/services/messageBroker.js';
import { autopilotHandler } from './src/handlers/autopilotHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize services
async function initializeServices() {
  try {
    // Connect to Redis
    await redisClient.connect();
    logger.info('Autopilot Service: Connected to Redis');

    // Initialize message broker
    await messageBroker.initialize();
    logger.info('Autopilot Service: Message broker initialized');

    // Start listening for events
    await messageBroker.subscribeToEvents('autopilot-service', autopilotHandler.handleEvent);
    logger.info('Autopilot Service: Started listening for events');

    logger.info('Autopilot Service: All services initialized successfully');
  } catch (error) {
    logger.error('Autopilot Service: Failed to initialize services:', error);
    process.exit(1);
  }
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    service: 'autopilot-service',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Autopilot API endpoints
app.get('/api/status', (req, res) => {
  res.json({
    service: 'autopilot',
    status: 'active',
    capabilities: [
      'task-execution',
      'workflow-automation',
      'ai-integration',
      'monitoring'
    ]
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Autopilot Service Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('Autopilot Service: SIGTERM received, shutting down gracefully');
  await redisClient.quit();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('Autopilot Service: SIGINT received, shutting down gracefully');
  await redisClient.quit();
  process.exit(0);
});

// Start server
async function startServer() {
  await initializeServices();
  
  app.listen(PORT, () => {
    logger.info(`Autopilot Service running on port ${PORT}`);
    logger.info(`Environment: ${process.env.NODE_ENV}`);
  });
}

startServer().catch((error) => {
  logger.error('Failed to start Autopilot Service:', error);
  process.exit(1);
});

export default app;
