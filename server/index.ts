// Main Server Entry Point for AuraOS Automation Platform
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { config } from 'dotenv';
import { createServer } from 'http';
import { dbManager } from './api/automation/database';
import automationRoutes from './api/automation/routes';
import { initializeWebSocketServer, getWebSocketServer } from './api/automation/websocket';

// Load environment variables
config();

const app = express();
const server = createServer(app);
const PORT = 3001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const dbHealthy = await dbManager.isHealthy();
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: dbHealthy ? 'connected' : 'disconnected',
      uptime: process.uptime()
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Health check failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// API Routes
app.use('/api/v1', automationRoutes);

// Error handling middleware
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', error);
  
  res.status(error.status || 500).json({
    success: false,
    error: {
      code: error.code || 'INTERNAL_ERROR',
      message: error.message || 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Endpoint not found'
    }
  });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  try {
    const wsServer = getWebSocketServer();
    if (wsServer) {
      wsServer.shutdown();
    }
    await dbManager.disconnect();
    server.close();
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully...');
  try {
    const wsServer = getWebSocketServer();
    if (wsServer) {
      wsServer.shutdown();
    }
    await dbManager.disconnect();
    server.close();
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
});

// Start server
async function startServer() {
  try {
    // Connect to database
    await dbManager.connect();
    
    // Initialize WebSocket server
    const wsServer = initializeWebSocketServer(server);
    
    // Start HTTP server
    server.listen(PORT, () => {
      console.log(`🚀 AuraOS Automation API Server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🔧 API endpoints: http://localhost:${PORT}/api/v1`);
      console.log(`🔌 WebSocket: ws://localhost:${PORT}/ws/automation`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`👥 Connected clients: ${wsServer.getConnectedClients()}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();