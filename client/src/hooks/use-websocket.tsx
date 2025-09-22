'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.useWebSocket = useWebSocket;
const react_1 = require('react');
function useWebSocket(path, onMessage, options = {}) {
  const wsRef = (0, react_1.useRef)(null);
  const reconnectTimeoutRef = (0, react_1.useRef)(null);
  const heartbeatTimeoutRef = (0, react_1.useRef)(null);
  const reconnectAttemptsRef = (0, react_1.useRef)(0);
  const isManualCloseRef = (0, react_1.useRef)(false);
  const {
    reconnectInterval = 3000,
    maxReconnectAttempts = 5,
    heartbeatInterval = 30000,
  } = options;
  const connect = (0, react_1.useCallback)(() => {
    if (
      wsRef.current?.readyState === WebSocket.OPEN ||
      wsRef.current?.readyState === WebSocket.CONNECTING
    ) {
      return;
    }
    try {
      // Use the correct WebSocket URL - check if we're in production
      let wsUrl;
      if (
        process.env.NODE_ENV === 'production' &&
        window.location.hostname !== 'localhost'
      ) {
        // In production, use the deployed URL
        wsUrl = `wss://aios-97581.web.app${path}`;
      } else {
        // In development or local production, use local server
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        // Use localhost for development, but allow for different ports
        const host =
          window.location.hostname === 'localhost'
            ? 'localhost:8080'
            : window.location.host;
        wsUrl = `${protocol}//${host}${path}`;
      }
      console.log('Attempting WebSocket connection to:', wsUrl);
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;
      ws.onopen = () => {
        console.log('✅ WebSocket connected successfully');
        reconnectAttemptsRef.current = 0;
        isManualCloseRef.current = false;
        // Start heartbeat
        startHeartbeat();
      };
      ws.onmessage = event => {
        try {
          const data = JSON.parse(event.data);
          // Handle heartbeat pong
          if (data.type === 'pong') {
            return;
          }
          onMessage(data);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };
      ws.onclose = event => {
        console.log('WebSocket disconnected:', event.code, event.reason);
        // Clear heartbeat
        if (heartbeatTimeoutRef.current) {
          clearTimeout(heartbeatTimeoutRef.current);
        }
        // Attempt reconnection if not manual close and within retry limit
        if (
          !isManualCloseRef.current &&
          reconnectAttemptsRef.current < maxReconnectAttempts
        ) {
          reconnectAttemptsRef.current++;
          console.log(
            `Attempting reconnection ${reconnectAttemptsRef.current}/${maxReconnectAttempts} in ${reconnectInterval}ms`
          );
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectInterval);
        } else if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
          console.error(
            'Max reconnection attempts reached. WebSocket connection failed.'
          );
        }
      };
      ws.onerror = error => {
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
    }
  }, [path, onMessage, reconnectInterval, maxReconnectAttempts]);
  const startHeartbeat = (0, react_1.useCallback)(() => {
    const sendHeartbeat = () => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({ type: 'ping', timestamp: Date.now() })
        );
        heartbeatTimeoutRef.current = setTimeout(
          sendHeartbeat,
          heartbeatInterval
        );
      }
    };
    heartbeatTimeoutRef.current = setTimeout(sendHeartbeat, heartbeatInterval);
  }, [heartbeatInterval]);
  const disconnect = (0, react_1.useCallback)(() => {
    isManualCloseRef.current = true;
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (heartbeatTimeoutRef.current) {
      clearTimeout(heartbeatTimeoutRef.current);
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);
  (0, react_1.useEffect)(() => {
    connect();
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);
  return {
    ws: wsRef.current,
    connect,
    disconnect,
    isConnected: wsRef.current?.readyState === WebSocket.OPEN,
  };
}
