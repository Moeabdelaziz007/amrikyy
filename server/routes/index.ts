// =============================================================================
// 🚀 AuraOS Routes - Main Entry Point
// =============================================================================
// 
// This file serves as the main entry point for all routes
// Individual route modules are imported and registered here
//
// =============================================================================

import type { Express } from 'express';
import { createServer, type Server } from 'http';
import { WebSocketServer, WebSocket } from 'ws';

// Import route modules
import { setupAuthRoutes } from './routes/auth-routes.js';
import { setupAPIRoutes } from './routes/api-routes.js';
import { setupWebSocketRoutes } from './routes/websocket-routes.js';
import { setupTelegramRoutes } from './routes/telegram-routes.js';
import { setupAIRoutes } from './routes/ai-routes.js';
import { setupAutomationRoutes } from './routes/automation-routes.js';
import { setupEnterpriseRoutes } from './routes/enterprise-routes.js';
import { setupTravelRoutes } from './routes/travel-routes.js';
import { setupMonitoringRoutes } from './routes/monitoring-routes.js';
import advancedAIRoutes from './routes/advanced-ai-routes.js';

// Import services
import { initializeServices } from './services/service-initializer.js';
import { getLogger } from './lib/advanced-logger.js';

// =============================================================================
// 🚀 Main Routes Setup Function
// =============================================================================

export async function setupRoutes(app: Express): Promise<Server> {
  const logger = getLogger();
  
  try {
    logger.info('Setting up AuraOS routes...');

    // Initialize all services
    await initializeServices();

    // Setup route modules
    setupAuthRoutes(app);
    setupAPIRoutes(app);
    setupWebSocketRoutes(app);
    setupTelegramRoutes(app);
    setupAIRoutes(app);
    setupAutomationRoutes(app);
    setupEnterpriseRoutes(app);
    setupTravelRoutes(app);
    setupMonitoringRoutes(app);
    
    // Setup advanced AI routes
    app.use('/api/advanced-ai', advancedAIRoutes);

    // Setup WebSocket server
    const server = createServer(app);
    const wss = new WebSocketServer({ server });

    // WebSocket connection handling
    wss.on('connection', (ws: WebSocket) => {
      logger.info('New WebSocket connection established');
      
      ws.on('message', (message: string) => {
        try {
          const data = JSON.parse(message);
          logger.debug('WebSocket message received', { data });
          
          // Handle different message types
          handleWebSocketMessage(ws, data);
        } catch (error) {
          logger.error('Failed to parse WebSocket message', { error, message });
          ws.send(JSON.stringify({ error: 'Invalid message format' }));
        }
      });

      ws.on('close', () => {
        logger.info('WebSocket connection closed');
      });

      ws.on('error', (error) => {
        logger.error('WebSocket error', { error });
      });
    });

    logger.info('AuraOS routes setup completed successfully');
    return server;

  } catch (error) {
    logger.error('Failed to setup routes', { error });
    throw error;
  }
}

// =============================================================================
// 🔧 WebSocket Message Handler
// =============================================================================

function handleWebSocketMessage(ws: WebSocket, data: any): void {
  const logger = getLogger();
  
  switch (data.type) {
    case 'ping':
      ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
      break;
      
    case 'subscribe':
      // Handle subscription logic
      logger.info('WebSocket subscription request', { data });
      break;
      
    case 'unsubscribe':
      // Handle unsubscription logic
      logger.info('WebSocket unsubscription request', { data });
      break;
      
    default:
      logger.warn('Unknown WebSocket message type', { type: data.type });
      ws.send(JSON.stringify({ error: 'Unknown message type' }));
  }
}

// =============================================================================
// 📋 Export Types
// =============================================================================

export interface RouteConfig {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  handler: (req: any, res: any) => Promise<void>;
  middleware?: any[];
  auth?: boolean;
}

export interface WebSocketMessage {
  type: string;
  data?: any;
  timestamp?: number;
}

export default setupRoutes;
