import React, { useEffect, useState, useRef } from 'react';

interface WebSocketMessage {
  type: 'system' | 'agent' | 'automation' | 'user' | 'error' | 'success';
  level: 'info' | 'warning' | 'error' | 'success' | 'debug';
  source: string;
  message: string;
  timestamp: number;
  data?: any;
}

interface WebSocketIntegrationProps {
  onMessage?: (message: WebSocketMessage) => void;
  onConnectionChange?: (connected: boolean) => void;
  autoReconnect?: boolean;
  reconnectInterval?: number;
}

export class WebSocketIntegration {
  private ws: WebSocket | null = null;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 5000;
  private messageQueue: WebSocketMessage[] = [];
  private listeners: Map<string, ((data: any) => void)[]> = new Map();

  constructor(
    private url: string,
    private options: WebSocketIntegrationProps = {}
  ) {
    this.reconnectInterval = options.reconnectInterval || 5000;
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
          console.log('WebSocket connected');
          this.reconnectAttempts = 0;
          this.options.onConnectionChange?.(true);
          this.processMessageQueue();
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };

        this.ws.onclose = (event) => {
          console.log('WebSocket disconnected:', event.code, event.reason);
          this.options.onConnectionChange?.(false);
          
          if (this.options.autoReconnect !== false && this.reconnectAttempts < this.maxReconnectAttempts) {
            this.scheduleReconnect();
          }
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          reject(error);
        };

      } catch (error) {
        reject(error);
      }
    });
  }

  private scheduleReconnect(): void {
    this.reconnectAttempts++;
    const delay = this.reconnectInterval * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);
    
    this.reconnectTimeout = setTimeout(() => {
      this.connect().catch(console.error);
    }, delay);
  }

  private processMessageQueue(): void {
    while (this.messageQueue.length > 0 && this.isConnected()) {
      const message = this.messageQueue.shift();
      if (message) {
        this.send(message);
      }
    }
  }

  private handleMessage(message: WebSocketMessage): void {
    this.options.onMessage?.(message);
    
    // Emit to specific listeners
    const listeners = this.listeners.get(message.type) || [];
    listeners.forEach(listener => listener(message));
  }

  send(message: WebSocketMessage): void {
    if (this.isConnected() && this.ws) {
      this.ws.send(JSON.stringify(message));
    } else {
      // Queue message for when connection is restored
      this.messageQueue.push(message);
    }
  }

  subscribe(type: string, callback: (data: any) => void): () => void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, []);
    }
    this.listeners.get(type)!.push(callback);

    // Return unsubscribe function
    return () => {
      const listeners = this.listeners.get(type);
      if (listeners) {
        const index = listeners.indexOf(callback);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      }
    };
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  disconnect(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

// React Hook for WebSocket Integration
export const useWebSocket = (
  url: string,
  options: WebSocketIntegrationProps = {}
) => {
  const [ws, setWs] = useState<WebSocketIntegration | null>(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const websocket = new WebSocketIntegration(url, {
      ...options,
      onConnectionChange: (isConnected) => {
        setConnected(isConnected);
        options.onConnectionChange?.(isConnected);
      },
      onMessage: (message) => {
        setMessages(prev => [...prev.slice(-99), message]);
        options.onMessage?.(message);
      }
    });

    websocket.connect()
      .then(() => {
        setWs(websocket);
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
      });

    return () => {
      websocket.disconnect();
    };
  }, [url]);

  const sendMessage = (message: Omit<WebSocketMessage, 'timestamp'>) => {
    if (ws) {
      ws.send({
        ...message,
        timestamp: Date.now()
      });
    }
  };

  const subscribe = (type: string, callback: (data: any) => void) => {
    return ws?.subscribe(type, callback);
  };

  return {
    connected,
    messages,
    error,
    sendMessage,
    subscribe,
    ws
  };
};

// Real-time Data Provider Component
export const RealtimeDataProvider: React.FC<{
  children: React.ReactNode;
  wsUrl: string;
  onSystemUpdate?: (data: any) => void;
  onAgentUpdate?: (data: any) => void;
  onAutomationUpdate?: (data: any) => void;
}> = ({ children, wsUrl, onSystemUpdate, onAgentUpdate, onAutomationUpdate }) => {
  const { connected, messages, sendMessage, subscribe } = useWebSocket(wsUrl);

  useEffect(() => {
    const unsubscribeSystem = subscribe?.('system', (data) => {
      onSystemUpdate?.(data);
    });

    const unsubscribeAgent = subscribe?.('agent', (data) => {
      onAgentUpdate?.(data);
    });

    const unsubscribeAutomation = subscribe?.('automation', (data) => {
      onAutomationUpdate?.(data);
    });

    return () => {
      unsubscribeSystem?.();
      unsubscribeAgent?.();
      unsubscribeAutomation?.();
    };
  }, [subscribe, onSystemUpdate, onAgentUpdate, onAutomationUpdate]);

  return (
    <div className="realtime-provider">
      {/* Connection Status Indicator */}
      <div className={`fixed top-4 right-4 z-50 px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
        connected 
          ? 'bg-status-success text-white shadow-glow-green-sm' 
          : 'bg-status-error text-white shadow-glow-red-sm'
      }`}>
        {connected ? '🟢 Connected' : '🔴 Disconnected'}
      </div>
      
      {children}
    </div>
  );
};

// Live Data Display Component
export const LiveDataDisplay: React.FC<{
  type: 'system' | 'agent' | 'automation';
  title: string;
  className?: string;
}> = ({ type, title, className = '' }) => {
  const [data, setData] = useState<any>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const { subscribe } = useWebSocket('ws://localhost:8080/ws');

  useEffect(() => {
    const unsubscribe = subscribe?.(type, (newData) => {
      setData(newData);
      setLastUpdate(new Date());
    });

    return unsubscribe;
  }, [subscribe, type]);

  return (
    <div className={`p-4 bg-glass-primary border border-glass-border rounded-lg ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="cyberpunk-heading-2">{title}</h3>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            data ? 'bg-status-success animate-pulse' : 'bg-glass-border'
          }`} />
          {lastUpdate && (
            <span className="text-xs text-text-secondary">
              {lastUpdate.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>
      
      {data ? (
        <div className="space-y-2">
          <pre className="text-xs text-text-primary font-mono bg-glass-secondary p-2 rounded overflow-auto max-h-32">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      ) : (
        <div className="text-center text-text-secondary text-sm">
          Waiting for {type} data...
        </div>
      )}
    </div>
  );
};

export default WebSocketIntegration;
