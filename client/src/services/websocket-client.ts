// WebSocket Client for Real-Time Automation Updates
import { automationApi } from './automation-api';

export interface WebSocketMessage {
  type:
    | 'task_update'
    | 'execution_update'
    | 'workspace_update'
    | 'system_health'
    | 'alert'
    | 'notification'
    | 'data_response'
    | 'error';
  data: any;
  timestamp: string;
  userId?: string;
  workspaceId?: string;
}

export interface WebSocketEventHandlers {
  onTaskUpdate?: (data: any) => void;
  onExecutionUpdate?: (data: any) => void;
  onWorkspaceUpdate?: (data: any) => void;
  onSystemHealth?: (data: any) => void;
  onAlert?: (data: any) => void;
  onNotification?: (data: any) => void;
  onDataResponse?: (requestType: string, data: any) => void;
  onError?: (error: any) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onReconnect?: () => void;
}

export class AutomationWebSocketClient {
  private ws: WebSocket | null = null;
  private url: string;
  private token: string;
  private workspaceId?: string;
  private handlers: WebSocketEventHandlers = {};
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 1000;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private isConnecting = false;
  private isManualDisconnect = false;

  constructor(
    serverUrl: string = 'ws://localhost:3001',
    token: string,
    workspaceId?: string
  ) {
    this.url = `${serverUrl}/ws/automation`;
    this.token = token;
    this.workspaceId = workspaceId;
  }

  public connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (
        this.isConnecting ||
        (this.ws && this.ws.readyState === WebSocket.OPEN)
      ) {
        resolve();
        return;
      }

      this.isConnecting = true;
      this.isManualDisconnect = false;

      try {
        const wsUrl = new URL(this.url);
        wsUrl.searchParams.set('token', this.token);
        if (this.workspaceId) {
          wsUrl.searchParams.set('workspaceId', this.workspaceId);
        }

        this.ws = new WebSocket(wsUrl.toString());

        this.ws.onopen = () => {
          console.log('🔌 WebSocket connected to AuraOS Automation');
          this.isConnecting = false;
          this.reconnectAttempts = 0;
          this.startHeartbeat();
          this.handlers.onConnect?.();
          resolve();
        };

        this.ws.onmessage = event => {
          this.handleMessage(event.data);
        };

        this.ws.onclose = event => {
          console.log('🔌 WebSocket disconnected:', event.code, event.reason);
          this.isConnecting = false;
          this.stopHeartbeat();
          this.handlers.onDisconnect?.();

          if (
            !this.isManualDisconnect &&
            this.reconnectAttempts < this.maxReconnectAttempts
          ) {
            this.scheduleReconnect();
          }
        };

        this.ws.onerror = error => {
          console.error('🔌 WebSocket error:', error);
          this.isConnecting = false;
          this.handlers.onError?.(error);
          reject(error);
        };
      } catch (error) {
        this.isConnecting = false;
        reject(error);
      }
    });
  }

  public disconnect(): void {
    this.isManualDisconnect = true;
    this.stopHeartbeat();

    if (this.ws) {
      this.ws.close(1000, 'Client disconnect');
      this.ws = null;
    }
  }

  public subscribe(subscriptions: string[]): void {
    this.sendMessage({
      type: 'subscribe',
      data: { subscriptions },
    });
  }

  public unsubscribe(subscriptions: string[]): void {
    this.sendMessage({
      type: 'unsubscribe',
      data: { subscriptions },
    });
  }

  public requestData(type: string, params?: any): void {
    this.sendMessage({
      type: 'get_data',
      data: { type, params },
    });
  }

  public ping(): void {
    this.sendMessage({
      type: 'ping',
      data: {},
    });
  }

  public setEventHandlers(handlers: WebSocketEventHandlers): void {
    this.handlers = { ...this.handlers, ...handlers };
  }

  private handleMessage(data: string): void {
    try {
      const message: WebSocketMessage = JSON.parse(data);

      switch (message.type) {
        case 'task_update':
          this.handlers.onTaskUpdate?.(message.data);
          break;
        case 'execution_update':
          this.handlers.onExecutionUpdate?.(message.data);
          break;
        case 'workspace_update':
          this.handlers.onWorkspaceUpdate?.(message.data);
          break;
        case 'system_health':
          this.handlers.onSystemHealth?.(message.data);
          break;
        case 'alert':
          this.handlers.onAlert?.(message.data);
          break;
        case 'notification':
          this.handlers.onNotification?.(message.data);
          break;
        case 'data_response':
          this.handlers.onDataResponse?.(
            message.data.requestType,
            message.data.data
          );
          break;
        case 'error':
          this.handlers.onError?.(message.data);
          break;
        default:
          console.warn('Unknown WebSocket message type:', message.type);
      }
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
      this.handlers.onError?.(error);
    }
  }

  private sendMessage(message: any): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify(message));
      } catch (error) {
        console.error('Error sending WebSocket message:', error);
      }
    } else {
      console.warn('WebSocket not connected, cannot send message:', message);
    }
  }

  private scheduleReconnect(): void {
    this.reconnectAttempts++;
    const delay =
      this.reconnectInterval * Math.pow(2, this.reconnectAttempts - 1);

    console.log(
      `🔄 Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`
    );

    setTimeout(() => {
      if (!this.isManualDisconnect) {
        this.connect()
          .then(() => {
            this.handlers.onReconnect?.();
          })
          .catch(error => {
            console.error('Reconnection failed:', error);
          });
      }
    }, delay);
  }

  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      this.ping();
    }, 30000); // 30 seconds
  }

  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  public getConnectionState(): number {
    return this.ws?.readyState ?? WebSocket.CLOSED;
  }

  public isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  public updateWorkspace(workspaceId?: string): void {
    this.workspaceId = workspaceId;
    if (this.isConnected()) {
      this.disconnect();
      this.connect();
    }
  }

  public updateToken(token: string): void {
    this.token = token;
    if (this.isConnected()) {
      this.disconnect();
      this.connect();
    }
  }
}

// React Hook for WebSocket Integration
import { useEffect, useRef, useState, useCallback } from 'react';

export function useAutomationWebSocket(
  serverUrl?: string,
  workspaceId?: string,
  handlers?: WebSocketEventHandlers
) {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const wsClientRef = useRef<AutomationWebSocketClient | null>(null);

  const connect = useCallback(async () => {
    try {
      const token = localStorage.getItem('auth_token') || 'demo-token';
      wsClientRef.current = new AutomationWebSocketClient(
        serverUrl,
        token,
        workspaceId
      );

      wsClientRef.current.setEventHandlers({
        ...handlers,
        onConnect: () => {
          setIsConnected(true);
          setConnectionError(null);
          handlers?.onConnect?.();
        },
        onDisconnect: () => {
          setIsConnected(false);
          handlers?.onDisconnect?.();
        },
        onError: error => {
          setConnectionError(error.message || 'WebSocket error');
          handlers?.onError?.(error);
        },
        onReconnect: () => {
          setIsConnected(true);
          setConnectionError(null);
          handlers?.onReconnect?.();
        },
      });

      await wsClientRef.current.connect();

      // Subscribe to common events
      wsClientRef.current.subscribe([
        'task_update',
        'execution_update',
        'workspace_update',
        'system_health',
        'alert',
        'notification',
      ]);
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
      setConnectionError(
        error instanceof Error ? error.message : 'Connection failed'
      );
    }
  }, [serverUrl, workspaceId, handlers]);

  const disconnect = useCallback(() => {
    wsClientRef.current?.disconnect();
    setIsConnected(false);
  }, []);

  const subscribe = useCallback((subscriptions: string[]) => {
    wsClientRef.current?.subscribe(subscriptions);
  }, []);

  const unsubscribe = useCallback((subscriptions: string[]) => {
    wsClientRef.current?.unsubscribe(subscriptions);
  }, []);

  const requestData = useCallback((type: string, params?: any) => {
    wsClientRef.current?.requestData(type, params);
  }, []);

  const ping = useCallback(() => {
    wsClientRef.current?.ping();
  }, []);

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  useEffect(() => {
    if (wsClientRef.current && workspaceId) {
      wsClientRef.current.updateWorkspace(workspaceId);
    }
  }, [workspaceId]);

  return {
    isConnected,
    connectionError,
    connect,
    disconnect,
    subscribe,
    unsubscribe,
    requestData,
    ping,
  };
}

// Export singleton client instance
let globalWsClient: AutomationWebSocketClient | null = null;

export function getGlobalWebSocketClient(): AutomationWebSocketClient | null {
  return globalWsClient;
}

export function initializeGlobalWebSocketClient(
  serverUrl?: string,
  workspaceId?: string
): AutomationWebSocketClient {
  const token = localStorage.getItem('auth_token') || 'demo-token';
  globalWsClient = new AutomationWebSocketClient(serverUrl, token, workspaceId);
  return globalWsClient;
}
