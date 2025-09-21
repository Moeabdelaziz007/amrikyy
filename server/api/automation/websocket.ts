// WebSocket Server for Real-Time Automation Updates
import { WebSocketServer, WebSocket } from 'ws';
import { IncomingMessage } from 'http';
import { URL } from 'url';
// Note: Direct API calls will be made instead of using automationApi import
import { db } from './database';

// WebSocket message types
export interface WebSocketMessage {
  type: 'task_update' | 'execution_update' | 'workspace_update' | 'system_health' | 'alert' | 'notification';
  data: any;
  timestamp: string;
  userId?: string;
  workspaceId?: string;
}

export interface ClientConnection {
  ws: WebSocket;
  userId: string;
  workspaceId?: string;
  subscriptions: string[];
  lastPing: number;
}

export class AutomationWebSocketServer {
  private wss: WebSocketServer;
  private clients: Map<string, ClientConnection> = new Map();
  private heartbeatInterval: NodeJS.Timeout | null = null;

  constructor(server: any) {
    this.wss = new WebSocketServer({
      server,
      path: '/ws/automation',
      perMessageDeflate: false
    });

    this.setupWebSocketServer();
    this.startHeartbeat();
  }

  private setupWebSocketServer() {
    this.wss.on('connection', (ws: WebSocket, request: IncomingMessage) => {
      this.handleConnection(ws, request);
    });

    this.wss.on('error', (error) => {
      console.error('WebSocket server error:', error);
    });

    console.log('🔌 WebSocket server initialized on /ws/automation');
  }

  private handleConnection(ws: WebSocket, request: IncomingMessage) {
    try {
      // Extract user info from query params or headers
      const url = new URL(request.url || '', `http://${request.headers.host}`);
      const token = url.searchParams.get('token') || request.headers.authorization?.replace('Bearer ', '');
      const workspaceId = url.searchParams.get('workspaceId');

      if (!token) {
        ws.close(1008, 'Authentication required');
        return;
      }

      // In a real app, verify JWT token here
      const userId = this.extractUserIdFromToken(token);
      const connectionId = this.generateConnectionId();

      const connection: ClientConnection = {
        ws,
        userId,
        workspaceId: workspaceId || undefined,
        subscriptions: ['system_health'], // Default subscriptions
        lastPing: Date.now()
      };

      this.clients.set(connectionId, connection);
      console.log(`📱 Client connected: ${userId} (${connectionId})`);

      // Send welcome message
      this.sendMessage(ws, {
        type: 'notification',
        data: {
          message: 'Connected to AuraOS Automation',
          status: 'connected'
        },
        timestamp: new Date().toISOString(),
        userId
      });

      // Setup message handlers
      ws.on('message', (data) => {
        this.handleMessage(connectionId, data);
      });

      ws.on('close', () => {
        this.handleDisconnection(connectionId);
      });

      ws.on('error', (error) => {
        console.error(`WebSocket error for client ${connectionId}:`, error);
        this.handleDisconnection(connectionId);
      });

      ws.on('pong', () => {
        const connection = this.clients.get(connectionId);
        if (connection) {
          connection.lastPing = Date.now();
        }
      });

    } catch (error) {
      console.error('Error handling WebSocket connection:', error);
      ws.close(1011, 'Server error');
    }
  }

  private handleMessage(connectionId: string, data: Buffer) {
    try {
      const message = JSON.parse(data.toString());
      const connection = this.clients.get(connectionId);

      if (!connection) return;

      switch (message.type) {
        case 'subscribe':
          this.handleSubscribe(connectionId, message.data);
          break;
        case 'unsubscribe':
          this.handleUnsubscribe(connectionId, message.data);
          break;
        case 'ping':
          this.handlePing(connectionId);
          break;
        case 'get_data':
          this.handleGetData(connectionId, message.data);
          break;
        default:
          console.warn(`Unknown message type: ${message.type}`);
      }
    } catch (error) {
      console.error('Error handling WebSocket message:', error);
    }
  }

  private handleSubscribe(connectionId: string, data: any) {
    const connection = this.clients.get(connectionId);
    if (!connection) return;

    const { subscriptions } = data;
    if (Array.isArray(subscriptions)) {
      connection.subscriptions = [...new Set([...connection.subscriptions, ...subscriptions])];
      console.log(`📡 Client ${connectionId} subscribed to:`, connection.subscriptions);
    }
  }

  private handleUnsubscribe(connectionId: string, data: any) {
    const connection = this.clients.get(connectionId);
    if (!connection) return;

    const { subscriptions } = data;
    if (Array.isArray(subscriptions)) {
      connection.subscriptions = connection.subscriptions.filter(sub => !subscriptions.includes(sub));
      console.log(`📡 Client ${connectionId} unsubscribed from:`, subscriptions);
    }
  }

  private handlePing(connectionId: string) {
    const connection = this.clients.get(connectionId);
    if (connection) {
      this.sendMessage(connection.ws, {
        type: 'notification',
        data: { message: 'pong' },
        timestamp: new Date().toISOString()
      });
    }
  }

  private async handleGetData(connectionId: string, data: any) {
    const connection = this.clients.get(connectionId);
    if (!connection) return;

    try {
      const { type, params } = data;
      let responseData: any = null;

      switch (type) {
        case 'workspaces':
          // Simplified response for demo
          responseData = { message: 'Workspaces data not implemented in demo' };
          break;
        case 'tasks':
          // Simplified response for demo
          responseData = { message: 'Tasks data not implemented in demo' };
          break;
        case 'executions':
          // Simplified response for demo
          responseData = { message: 'Executions data not implemented in demo' };
          break;
        case 'system_health':
          // Simplified response for demo
          responseData = { 
            status: 'healthy',
            message: 'System health data not implemented in demo' 
          };
          break;
        default:
          console.warn(`Unknown data request type: ${type}`);
          return;
      }

      this.sendMessage(connection.ws, {
        type: 'data_response',
        data: {
          requestType: type,
          data: responseData
        },
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Error handling get_data request:', error);
      this.sendMessage(connection.ws, {
        type: 'error',
        data: {
          message: 'Failed to fetch data',
          error: error instanceof Error ? error.message : 'Unknown error'
        },
        timestamp: new Date().toISOString()
      });
    }
  }

  private handleDisconnection(connectionId: string) {
    const connection = this.clients.get(connectionId);
    if (connection) {
      console.log(`📱 Client disconnected: ${connection.userId} (${connectionId})`);
      this.clients.delete(connectionId);
    }
  }

  // Public methods for broadcasting updates
  public broadcastTaskUpdate(taskData: any, workspaceId?: string) {
    this.broadcast({
      type: 'task_update',
      data: taskData,
      timestamp: new Date().toISOString(),
      workspaceId
    }, workspaceId);
  }

  public broadcastExecutionUpdate(executionData: any, workspaceId?: string) {
    this.broadcast({
      type: 'execution_update',
      data: executionData,
      timestamp: new Date().toISOString(),
      workspaceId
    }, workspaceId);
  }

  public broadcastWorkspaceUpdate(workspaceData: any, workspaceId?: string) {
    this.broadcast({
      type: 'workspace_update',
      data: workspaceData,
      timestamp: new Date().toISOString(),
      workspaceId
    }, workspaceId);
  }

  public broadcastSystemHealth(healthData: any) {
    this.broadcast({
      type: 'system_health',
      data: healthData,
      timestamp: new Date().toISOString()
    });
  }

  public broadcastAlert(alertData: any, workspaceId?: string) {
    this.broadcast({
      type: 'alert',
      data: alertData,
      timestamp: new Date().toISOString(),
      workspaceId
    }, workspaceId);
  }

  public sendNotification(userId: string, message: string, data?: any) {
    const connection = Array.from(this.clients.values()).find(c => c.userId === userId);
    if (connection) {
      this.sendMessage(connection.ws, {
        type: 'notification',
        data: {
          message,
          ...data
        },
        timestamp: new Date().toISOString(),
        userId
      });
    }
  }

  private broadcast(message: WebSocketMessage, workspaceId?: string) {
    const connections = Array.from(this.clients.values()).filter(connection => {
      // Check if client is subscribed to this message type
      if (!connection.subscriptions.includes(message.type)) return false;
      
      // Check workspace filter
      if (workspaceId && connection.workspaceId !== workspaceId) return false;
      
      // Check if connection is still alive
      return this.isConnectionAlive(connection);
    });

    connections.forEach(connection => {
      this.sendMessage(connection.ws, message);
    });

    console.log(`📡 Broadcasted ${message.type} to ${connections.length} clients`);
  }

  private sendMessage(ws: WebSocket, message: WebSocketMessage) {
    if (ws.readyState === WebSocket.OPEN) {
      try {
        ws.send(JSON.stringify(message));
      } catch (error) {
        console.error('Error sending WebSocket message:', error);
      }
    }
  }

  private isConnectionAlive(connection: ClientConnection): boolean {
    const now = Date.now();
    const timeSinceLastPing = now - connection.lastPing;
    return timeSinceLastPing < 60000; // 60 seconds timeout
  }

  private startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      this.clients.forEach((connection, connectionId) => {
        if (this.isConnectionAlive(connection)) {
          connection.ws.ping();
        } else {
          console.log(`💔 Removing dead connection: ${connectionId}`);
          this.handleDisconnection(connectionId);
        }
      });
    }, 30000); // 30 seconds heartbeat
  }

  private extractUserIdFromToken(token: string): string {
    // In a real app, decode JWT token here
    // For demo purposes, return a mock user ID
    return 'user-123';
  }

  private generateConnectionId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  public getConnectedClients(): number {
    return this.clients.size;
  }

  public getClientInfo(): Array<{ userId: string; workspaceId?: string; subscriptions: string[] }> {
    return Array.from(this.clients.values()).map(connection => ({
      userId: connection.userId,
      workspaceId: connection.workspaceId,
      subscriptions: connection.subscriptions
    }));
  }

  public shutdown() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    this.clients.forEach((connection) => {
      connection.ws.close(1001, 'Server shutting down');
    });

    this.wss.close();
    console.log('🔌 WebSocket server shut down');
  }
}

// Export singleton instance
let wsServer: AutomationWebSocketServer | null = null;

export function initializeWebSocketServer(server: any): AutomationWebSocketServer {
  if (!wsServer) {
    wsServer = new AutomationWebSocketServer(server);
  }
  return wsServer;
}

export function getWebSocketServer(): AutomationWebSocketServer | null {
  return wsServer;
}
