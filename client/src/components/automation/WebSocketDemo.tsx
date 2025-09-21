// WebSocket Demo Component for Testing Real-Time Features
import React, { useState, useEffect } from 'react';
import { useAutomationWebSocket } from '@/services/websocket-client';
import { 
  Wifi, 
  WifiOff, 
  Activity, 
  Bell, 
  Zap, 
  RefreshCw,
  Send,
  MessageSquare
} from 'lucide-react';

interface WebSocketDemoProps {
  workspaceId?: string;
}

export default function WebSocketDemo({ workspaceId }: WebSocketDemoProps) {
  const [messages, setMessages] = useState<Array<{
    id: string;
    type: string;
    data: any;
    timestamp: string;
  }>>([]);
  
  const [testMessage, setTestMessage] = useState('');

  const {
    isConnected,
    connectionError,
    connect,
    disconnect,
    subscribe,
    unsubscribe,
    requestData,
    ping
  } = useAutomationWebSocket(
    'ws://localhost:3001',
    workspaceId,
    {
      onTaskUpdate: (data) => {
        addMessage('Task Update', data);
      },
      onExecutionUpdate: (data) => {
        addMessage('Execution Update', data);
      },
      onWorkspaceUpdate: (data) => {
        addMessage('Workspace Update', data);
      },
      onSystemHealth: (data) => {
        addMessage('System Health', data);
      },
      onAlert: (data) => {
        addMessage('Alert', data);
      },
      onNotification: (data) => {
        addMessage('Notification', data);
      },
      onDataResponse: (requestType, data) => {
        addMessage(`Data Response: ${requestType}`, data);
      },
      onError: (error) => {
        addMessage('Error', error);
      },
      onConnect: () => {
        addMessage('System', { message: 'WebSocket connected successfully' });
        // Subscribe to all events for demo
        subscribe(['task_update', 'execution_update', 'workspace_update', 'system_health', 'alert', 'notification']);
      },
      onDisconnect: () => {
        addMessage('System', { message: 'WebSocket disconnected' });
      },
      onReconnect: () => {
        addMessage('System', { message: 'WebSocket reconnected' });
      }
    }
  );

  const addMessage = (type: string, data: any) => {
    const message = {
      id: Date.now().toString(),
      type,
      data,
      timestamp: new Date().toLocaleTimeString()
    };
    setMessages(prev => [message, ...prev.slice(0, 49)]); // Keep last 50 messages
  };

  const handleSendTestMessage = () => {
    if (testMessage.trim()) {
      addMessage('Test Message', { message: testMessage });
      setTestMessage('');
    }
  };

  const handleRequestData = (type: string) => {
    requestData(type);
    addMessage('Request Sent', { type });
  };

  const handlePing = () => {
    ping();
    addMessage('Ping', { timestamp: new Date().toISOString() });
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            {isConnected ? (
              <Wifi className="w-6 h-6 text-blue-600" />
            ) : (
              <WifiOff className="w-6 h-6 text-red-600" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              WebSocket Demo
            </h3>
            <p className="text-sm text-gray-500">
              {isConnected ? 'Connected and receiving live updates' : 'Disconnected'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={isConnected ? disconnect : connect}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              isConnected 
                ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            {isConnected ? 'Disconnect' : 'Connect'}
          </button>
          
          <button
            onClick={handlePing}
            disabled={!isConnected}
            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Ping
          </button>
        </div>
      </div>

      {connectionError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">
            <strong>Connection Error:</strong> {connectionError}
          </p>
        </div>
      )}

      {/* Test Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Request Data</h4>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleRequestData('workspaces')}
              disabled={!isConnected}
              className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200 disabled:opacity-50"
            >
              Workspaces
            </button>
            <button
              onClick={() => handleRequestData('tasks')}
              disabled={!isConnected}
              className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200 disabled:opacity-50"
            >
              Tasks
            </button>
            <button
              onClick={() => handleRequestData('executions')}
              disabled={!isConnected}
              className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200 disabled:opacity-50"
            >
              Executions
            </button>
            <button
              onClick={() => handleRequestData('system_health')}
              disabled={!isConnected}
              className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200 disabled:opacity-50"
            >
              Health
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Subscriptions</h4>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => subscribe(['task_update'])}
              disabled={!isConnected}
              className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200 disabled:opacity-50"
            >
              Subscribe Tasks
            </button>
            <button
              onClick={() => subscribe(['execution_update'])}
              disabled={!isConnected}
              className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200 disabled:opacity-50"
            >
              Subscribe Executions
            </button>
            <button
              onClick={() => unsubscribe(['task_update', 'execution_update'])}
              disabled={!isConnected}
              className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs hover:bg-orange-200 disabled:opacity-50"
            >
              Unsubscribe
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Actions</h4>
          <button
            onClick={clearMessages}
            className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 transition-colors"
          >
            Clear Messages
          </button>
        </div>
      </div>

      {/* Test Message Input */}
      <div className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={testMessage}
            onChange={(e) => setTestMessage(e.target.value)}
            placeholder="Send a test message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => e.key === 'Enter' && handleSendTestMessage()}
          />
          <button
            onClick={handleSendTestMessage}
            disabled={!testMessage.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Display */}
      <div className="bg-gray-50 rounded-lg p-4 h-96 overflow-y-auto">
        <div className="flex items-center gap-2 mb-3">
          <MessageSquare className="w-4 h-4 text-gray-600" />
          <h4 className="text-sm font-medium text-gray-700">
            Live Messages ({messages.length})
          </h4>
        </div>
        
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No messages yet. Connect to start receiving live updates.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {messages.map((message) => (
              <div
                key={message.id}
                className="bg-white rounded-lg p-3 border border-gray-200"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-gray-600">
                    {message.type}
                  </span>
                  <span className="text-xs text-gray-500">
                    {message.timestamp}
                  </span>
                </div>
                <pre className="text-xs text-gray-800 overflow-x-auto">
                  {JSON.stringify(message.data, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Connection Stats */}
      <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-4">
          <span>Status: {isConnected ? 'Connected' : 'Disconnected'}</span>
          {workspaceId && <span>Workspace: {workspaceId}</span>}
        </div>
        <span>Messages: {messages.length}</span>
      </div>
    </div>
  );
}
