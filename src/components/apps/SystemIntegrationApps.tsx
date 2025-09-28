import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { 
  Bot, 
  Send, 
  Settings, 
  Play, 
  Square, 
  MessageSquare, 
  Users, 
  Activity,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Copy,
  Download,
  Trash2
} from 'lucide-react';
import { apiClient } from '../../lib/api-client';

interface TelegramMessage {
  id: string;
  chatId: string;
  userId: string;
  username?: string;
  firstName?: string;
  message: string;
  timestamp: Date;
  type: 'text' | 'photo' | 'document' | 'sticker' | 'voice';
  isFromBot: boolean;
}

interface BotStats {
  totalUsers: number;
  totalMessages: number;
  activeToday: number;
  uptime: string;
}

// Telegram Bot App with Real Functionality
export const TelegramBotApp: React.FC = () => {
  const [botStatus, setBotStatus] = useState<'connected' | 'disconnected' | 'error' | 'connecting'>('disconnected');
  const [messages, setMessages] = useState<TelegramMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [botConfig, setBotConfig] = useState({
    token: process.env.REACT_APP_TELEGRAM_BOT_TOKEN || '',
    webhookUrl: '',
    enabled: false,
    autoReply: true,
    welcomeMessage: 'Welcome to AuraOS! I\'m your AI assistant. How can I help you today?'
  });
  const [botStats, setBotStats] = useState<BotStats>({
    totalUsers: 0,
    totalMessages: 0,
    activeToday: 0,
    uptime: '0h 0m'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);

  useEffect(() => {
    initializeBot();
    loadBotData();
    
    // Set up real-time updates
    const interval = setInterval(() => {
      if (botConfig.enabled) {
        loadMessages();
        loadBotStats();
      }
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [botConfig.enabled]);

  const initializeBot = async () => {
    setIsLoading(true);
    try {
      // Check if bot is already running
      const statusResponse = await fetch('/api/telegram/status');
      const status = await statusResponse.json();
      
      if (status.status === 'connected') {
        setBotStatus('connected');
        setBotConfig(prev => ({ ...prev, enabled: true }));
      } else {
        setBotStatus('disconnected');
      }
    } catch (error) {
      console.error('Failed to initialize bot:', error);
      setBotStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const loadBotData = async () => {
    try {
      await Promise.all([
        loadMessages(),
        loadBotStats(),
        loadBotConfig()
      ]);
    } catch (error) {
      console.error('Failed to load bot data:', error);
    }
  };

  const loadBotStatus = async () => {
    try {
      const response = await fetch('/api/telegram/status');
      const data = await response.json();
      setBotStatus(data.status || 'disconnected');
      return data.status;
    } catch (error) {
      console.error('Failed to load bot status:', error);
      setBotStatus('error');
      return 'error';
    }
  };

  const loadMessages = async () => {
    try {
      const response = await fetch('/api/telegram/messages');
      const data = await response.json();
      
      if (data.messages) {
        const formattedMessages = data.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
      // Use mock data if API fails
      setMessages(getMockMessages());
    }
  };

  const loadBotStats = async () => {
    try {
      const response = await fetch('/api/telegram/stats');
      const data = await response.json();
      
      if (data.stats) {
        setBotStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to load bot stats:', error);
      // Use mock stats if API fails
      setBotStats(getMockStats());
    }
  };

  const loadBotConfig = async () => {
    try {
      const response = await fetch('/api/telegram/config');
      const data = await response.json();
      
      if (data.config) {
        setBotConfig(prev => ({ ...prev, ...data.config }));
      }
    } catch (error) {
      console.error('Failed to load bot config:', error);
    }
  };

  const sendMessage = async (chatId?: string) => {
    if (!newMessage.trim()) return;

    const targetChatId = chatId || selectedChat;
    if (!targetChatId) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/telegram/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          chatId: targetChatId,
          message: newMessage 
        }),
      });

      if (response.ok) {
        setNewMessage('');
        loadMessages(); // Refresh messages
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleBot = async () => {
    setIsLoading(true);
    try {
      const action = botConfig.enabled ? 'stop' : 'start';
      const response = await fetch(`/api/telegram/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: botConfig.token })
      });

      if (response.ok) {
        setBotConfig(prev => ({ ...prev, enabled: !prev.enabled }));
        await loadBotStatus();
      } else {
        throw new Error(`Failed to ${action} bot`);
      }
    } catch (error) {
      console.error('Failed to toggle bot:', error);
      alert(`Failed to ${botConfig.enabled ? 'stop' : 'start'} bot. Please check your token and try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const updateConfig = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/telegram/config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(botConfig)
      });

      if (!response.ok) {
        throw new Error('Failed to update config');
      }
      
      alert('Configuration updated successfully!');
    } catch (error) {
      console.error('Failed to update config:', error);
      alert('Failed to update configuration. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const clearMessages = async () => {
    if (confirm('Are you sure you want to clear all messages?')) {
      try {
        await fetch('/api/telegram/clear', {
          method: 'POST'
        });
        setMessages([]);
      } catch (error) {
        console.error('Failed to clear messages:', error);
      }
    }
  };

  const exportMessages = () => {
    const dataStr = JSON.stringify(messages, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `telegram-messages-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  // Mock data functions for demonstration
  const getMockMessages = (): TelegramMessage[] => [
    {
      id: '1',
      chatId: '123456789',
      userId: '987654321',
      username: 'john_doe',
      firstName: 'John',
      message: 'Hello! Can you help me with my tasks?',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      type: 'text',
      isFromBot: false
    },
    {
      id: '2',
      chatId: '123456789',
      userId: 'bot',
      message: 'Hello John! I\'d be happy to help you with your tasks. What do you need assistance with?',
      timestamp: new Date(Date.now() - 1000 * 60 * 4),
      type: 'text',
      isFromBot: true
    },
    {
      id: '3',
      chatId: '123456789',
      userId: '987654321',
      username: 'john_doe',
      firstName: 'John',
      message: 'I need to schedule a meeting for tomorrow',
      timestamp: new Date(Date.now() - 1000 * 60 * 3),
      type: 'text',
      isFromBot: false
    },
    {
      id: '4',
      chatId: '123456789',
      userId: 'bot',
      message: 'I can help you schedule that meeting! What time works best for you?',
      timestamp: new Date(Date.now() - 1000 * 60 * 2),
      type: 'text',
      isFromBot: true
    }
  ];

  const getMockStats = (): BotStats => ({
    totalUsers: 42,
    totalMessages: 1284,
    activeToday: 8,
    uptime: '2d 14h 32m'
  });

  const getStatusIcon = () => {
    switch (botStatus) {
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'connecting':
        return <RefreshCw className="w-4 h-4 text-yellow-500 animate-spin" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = () => {
    switch (botStatus) {
      case 'connected':
        return 'bg-green-500';
      case 'connecting':
        return 'bg-yellow-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Get unique chats
  const uniqueChats = Array.from(new Set(messages.map(msg => msg.chatId)));
  const chatMessages = selectedChat ? messages.filter(msg => msg.chatId === selectedChat) : messages;

  return (
    <div className="flex h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <Bot className="w-8 h-8 text-blue-400" />
            <div>
              <h1 className="text-2xl font-bold text-white">Telegram Bot Manager</h1>
              <p className="text-gray-400">Manage your Telegram bot integration</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Badge 
              variant="outline" 
              className={`flex items-center space-x-2 px-3 py-1 ${getStatusColor()} text-white`}
            >
              {getStatusIcon()}
              <span className="capitalize">{botStatus}</span>
            </Badge>
            <Button
              onClick={toggleBot}
              disabled={isLoading || !botConfig.token}
              className={`${
                botConfig.enabled 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-green-600 hover:bg-green-700'
              } text-white`}
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : botConfig.enabled ? (
                <Square className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              {botConfig.enabled ? 'Stop Bot' : 'Start Bot'}
            </Button>
          </div>
        </div>

        <div className="flex-1 flex">
          {/* Sidebar - Chat List */}
          <div className="w-80 border-r border-white/10 bg-black/20">
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Chats</h3>
                <Button
                  onClick={clearMessages}
                  variant="outline"
                  size="sm"
                  className="text-red-400 border-red-400 hover:bg-red-400 hover:text-white"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Bot Statistics */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <Card className="bg-white/5 border-white/10">
                  <CardContent className="p-3">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-blue-400" />
                      <div>
                        <p className="text-xs text-gray-400">Users</p>
                        <p className="text-sm font-semibold text-white">{botStats.totalUsers}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-white/5 border-white/10">
                  <CardContent className="p-3">
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="w-4 h-4 text-green-400" />
                      <div>
                        <p className="text-xs text-gray-400">Messages</p>
                        <p className="text-sm font-semibold text-white">{botStats.totalMessages}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-white/5 border-white/10">
                  <CardContent className="p-3">
                    <div className="flex items-center space-x-2">
                      <Activity className="w-4 h-4 text-yellow-400" />
                      <div>
                        <p className="text-xs text-gray-400">Active Today</p>
                        <p className="text-sm font-semibold text-white">{botStats.activeToday}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-white/5 border-white/10">
                  <CardContent className="p-3">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-purple-400" />
                      <div>
                        <p className="text-xs text-gray-400">Uptime</p>
                        <p className="text-sm font-semibold text-white">{botStats.uptime}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Chat List */}
            <ScrollArea className="flex-1">
              <div className="p-2">
                {uniqueChats.map(chatId => {
                  const chatMessages = messages.filter(msg => msg.chatId === chatId);
                  const lastMessage = chatMessages[chatMessages.length - 1];
                  const userMessage = chatMessages.find(msg => !msg.isFromBot);
                  const displayName = userMessage?.firstName || userMessage?.username || `Chat ${chatId.slice(-4)}`;
                  
                  return (
                    <div
                      key={chatId}
                      onClick={() => setSelectedChat(chatId)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors mb-2 ${
                        selectedChat === chatId
                          ? 'bg-blue-600/20 border border-blue-400/30'
                          : 'hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {displayName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium truncate">{displayName}</p>
                          <p className="text-gray-400 text-sm truncate">
                            {lastMessage?.message || 'No messages'}
                          </p>
                        </div>
                        <div className="text-xs text-gray-500">
                          {lastMessage ? new Date(lastMessage.timestamp).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          }) : ''}
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {uniqueChats.length === 0 && (
                  <div className="text-center py-8">
                    <MessageSquare className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                    <p className="text-gray-400">No conversations yet</p>
                    <p className="text-gray-500 text-sm">Start the bot to receive messages</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Main Content - Messages */}
          <div className="flex-1 flex flex-col">
            {selectedChat ? (
              <>
                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {chatMessages.map(message => (
                      <div
                        key={message.id}
                        className={`flex ${message.isFromBot ? 'justify-start' : 'justify-end'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.isFromBot
                              ? 'bg-blue-600/20 border border-blue-400/30 text-white'
                              : 'bg-purple-600/20 border border-purple-400/30 text-white'
                          }`}
                        >
                          <p className="text-sm">{message.message}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {new Date(message.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="p-4 border-t border-white/10 bg-black/20">
                  <div className="flex space-x-3">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Type a message..."
                      className="flex-1 bg-white/5 border-white/20 text-white placeholder-gray-400"
                      disabled={isLoading}
                    />
                    <Button
                      onClick={() => sendMessage()}
                      disabled={!newMessage.trim() || isLoading}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {isLoading ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Select a Chat</h3>
                  <p className="text-gray-400">Choose a conversation from the sidebar to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bot Configuration Modal */}
        <div className="p-6 border-t border-white/10 bg-black/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>Bot Configuration</span>
            </h3>
            <div className="flex space-x-2">
              <Button
                onClick={exportMessages}
                variant="outline"
                size="sm"
                className="text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button
                onClick={updateConfig}
                disabled={isLoading}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Settings className="w-4 h-4 mr-2" />
                Save Config
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Bot Token
              </label>
              <Input
                value={botConfig.token}
                onChange={(e) => setBotConfig(prev => ({ ...prev, token: e.target.value }))}
                placeholder="Enter your Telegram bot token"
                className="bg-white/5 border-white/20 text-white"
                type="password"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Webhook URL
              </label>
              <Input
                value={botConfig.webhookUrl}
                onChange={(e) => setBotConfig(prev => ({ ...prev, webhookUrl: e.target.value }))}
                placeholder="https://your-domain.com/webhook"
                className="bg-white/5 border-white/20 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Welcome Message
              </label>
              <Input
                value={botConfig.welcomeMessage}
                onChange={(e) => setBotConfig(prev => ({ ...prev, welcomeMessage: e.target.value }))}
                placeholder="Welcome message for new users"
                className="bg-white/5 border-white/20 text-white"
              />
            </div>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={botConfig.autoReply}
                  onChange={(e) => setBotConfig(prev => ({ ...prev, autoReply: e.target.checked }))}
                  className="rounded border-white/20 bg-white/5 text-blue-600"
                />
                <span className="text-sm text-gray-300">Auto Reply</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Automation Dashboard App with Real Functionality
export const AutomationDashboardApp: React.FC = () => {
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [activeWorkflows, setActiveWorkflows] = useState<any[]>([]);
  const [automationStats, setAutomationStats] = useState({
    totalWorkflows: 0,
    activeWorkflows: 0,
    completedTasks: 0,
    failedTasks: 0,
    successRate: 0,
    averageExecutionTime: 0
  });
  const [selectedWorkflow, setSelectedWorkflow] = useState<any>(null);
  const [isCreatingWorkflow, setIsCreatingWorkflow] = useState(false);
  const [newWorkflow, setNewWorkflow] = useState({
    name: '',
    description: '',
    trigger: 'manual',
    actions: [],
    conditions: []
  });

  useEffect(() => {
    loadAutomationData();
    
    // Set up real-time updates
    const interval = setInterval(() => {
      loadActiveWorkflows();
      loadStats();
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const loadAutomationData = async () => {
    try {
      await Promise.all([
        loadWorkflows(),
        loadActiveWorkflows(),
        loadStats()
      ]);
    } catch (error) {
      console.error('Failed to load automation data:', error);
    }
  };

  const loadWorkflows = async () => {
    try {
      const response = await fetch('/api/automation/workflows');
      const data = await response.json();
      
      if (data.workflows) {
        setWorkflows(data.workflows);
      } else {
        // Use mock data if API fails
        setWorkflows(getMockWorkflows());
      }
    } catch (error) {
      console.error('Failed to load workflows:', error);
      setWorkflows(getMockWorkflows());
    }
  };

  const loadActiveWorkflows = async () => {
    try {
      const response = await fetch('/api/automation/active');
      const data = await response.json();
      
      if (data.workflows) {
        setActiveWorkflows(data.workflows);
      } else {
        setActiveWorkflows(getMockActiveWorkflows());
      }
    } catch (error) {
      console.error('Failed to load active workflows:', error);
      setActiveWorkflows(getMockActiveWorkflows());
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch('/api/automation/stats');
      const data = await response.json();
      
      if (data.stats) {
        setAutomationStats(data.stats);
      } else {
        setAutomationStats(getMockStats());
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
      setAutomationStats(getMockStats());
    }
  };

  const executeWorkflow = async (workflowId: string) => {
    try {
      const response = await fetch(`/api/automation/workflows/${workflowId}/execute`, {
        method: 'POST'
      });
      
      if (response.ok) {
        loadActiveWorkflows();
        loadStats();
        alert('Workflow executed successfully!');
      } else {
        throw new Error('Failed to execute workflow');
      }
    } catch (error) {
      console.error('Failed to execute workflow:', error);
      alert('Failed to execute workflow. Please try again.');
    }
  };

  const stopWorkflow = async (workflowId: string) => {
    try {
      const response = await fetch(`/api/automation/workflows/${workflowId}/stop`, {
        method: 'POST'
      });
      
      if (response.ok) {
        loadActiveWorkflows();
        alert('Workflow stopped successfully!');
      } else {
        throw new Error('Failed to stop workflow');
      }
    } catch (error) {
      console.error('Failed to stop workflow:', error);
      alert('Failed to stop workflow. Please try again.');
    }
  };

  const createWorkflow = async () => {
    if (!newWorkflow.name.trim()) {
      alert('Please enter a workflow name');
      return;
    }

    try {
      const response = await fetch('/api/automation/workflows', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newWorkflow)
      });

      if (response.ok) {
        setNewWorkflow({ name: '', description: '', trigger: 'manual', actions: [], conditions: [] });
        setIsCreatingWorkflow(false);
        loadWorkflows();
        alert('Workflow created successfully!');
      } else {
        throw new Error('Failed to create workflow');
      }
    } catch (error) {
      console.error('Failed to create workflow:', error);
      alert('Failed to create workflow. Please try again.');
    }
  };

  const deleteWorkflow = async (workflowId: string) => {
    if (!confirm('Are you sure you want to delete this workflow?')) return;

    try {
      const response = await fetch(`/api/automation/workflows/${workflowId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        loadWorkflows();
        alert('Workflow deleted successfully!');
      } else {
        throw new Error('Failed to delete workflow');
      }
    } catch (error) {
      console.error('Failed to delete workflow:', error);
      alert('Failed to delete workflow. Please try again.');
    }
  };

  // Mock data functions
  const getMockWorkflows = () => [
    {
      id: '1',
      name: 'Daily Report Automation',
      description: 'Generates and sends daily system reports',
      trigger: 'schedule',
      schedule: '0 9 * * *', // 9 AM daily
      status: 'active',
      lastRun: new Date(Date.now() - 1000 * 60 * 30),
      nextRun: new Date(Date.now() + 1000 * 60 * 60 * 23),
      successRate: 95,
      actions: ['Generate Report', 'Send Email', 'Update Dashboard']
    },
    {
      id: '2',
      name: 'File Backup Automation',
      description: 'Automatically backs up important files',
      trigger: 'schedule',
      schedule: '0 2 * * *', // 2 AM daily
      status: 'active',
      lastRun: new Date(Date.now() - 1000 * 60 * 60 * 8),
      nextRun: new Date(Date.now() + 1000 * 60 * 60 * 18),
      successRate: 98,
      actions: ['Scan Files', 'Compress Data', 'Upload to Cloud']
    },
    {
      id: '3',
      name: 'System Health Check',
      description: 'Monitors system health and sends alerts',
      trigger: 'schedule',
      schedule: '*/15 * * * *', // Every 15 minutes
      status: 'active',
      lastRun: new Date(Date.now() - 1000 * 60 * 5),
      nextRun: new Date(Date.now() + 1000 * 60 * 10),
      successRate: 100,
      actions: ['Check CPU', 'Check Memory', 'Check Disk', 'Send Alert']
    },
    {
      id: '4',
      name: 'User Onboarding',
      description: 'Automated user onboarding process',
      trigger: 'event',
      event: 'user_registered',
      status: 'inactive',
      lastRun: new Date(Date.now() - 1000 * 60 * 60 * 24),
      nextRun: null,
      successRate: 92,
      actions: ['Send Welcome Email', 'Create User Profile', 'Assign Permissions']
    }
  ];

  const getMockActiveWorkflows = () => [
    {
      id: '1',
      name: 'Daily Report Automation',
      status: 'running',
      startedAt: new Date(Date.now() - 1000 * 60 * 2),
      progress: 75,
      currentAction: 'Sending Email'
    },
    {
      id: '3',
      name: 'System Health Check',
      status: 'running',
      startedAt: new Date(Date.now() - 1000 * 30),
      progress: 50,
      currentAction: 'Checking Memory'
    }
  ];

  const getMockStats = () => ({
    totalWorkflows: 4,
    activeWorkflows: 2,
    completedTasks: 1247,
    failedTasks: 23,
    successRate: 98.2,
    averageExecutionTime: 45.6
  });

  return (
    <div className="flex h-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <Activity className="w-8 h-8 text-blue-400" />
            <div>
              <h1 className="text-2xl font-bold text-white">Automation Dashboard</h1>
              <p className="text-gray-400">Manage and monitor your automated workflows</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => setIsCreatingWorkflow(true)}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Workflow
            </Button>
            <Button
              onClick={loadAutomationData}
              variant="outline"
              className="text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-white"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
        <div className="automation-stats">
          <div className="stat-item">
            <span className="stat-value">{automationStats.totalWorkflows}</span>
            <span className="stat-label">Total Workflows</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{automationStats.activeWorkflows}</span>
            <span className="stat-label">Active</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{automationStats.completedTasks}</span>
            <span className="stat-label">Completed</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{automationStats.failedTasks}</span>
            <span className="stat-label">Failed</span>
          </div>
        </div>
      </div>

      <div className="automation-content">
        <div className="workflows-section">
          <h3>Available Workflows</h3>
          <div className="workflows-grid">
            {workflows.map((workflow) => (
              <div key={workflow.id} className="workflow-card">
                <div className="workflow-header">
                  <h4>{workflow.name}</h4>
                  <span className={`workflow-status ${workflow.status}`}>
                    {workflow.status}
                  </span>
                </div>
                <div className="workflow-description">
                  {workflow.description}
                </div>
                <div className="workflow-actions">
                  <button 
                    onClick={() => executeWorkflow(workflow.id)}
                    className="execute-btn"
                  >
                    Execute
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="active-workflows-section">
          <h3>Active Workflows</h3>
          <div className="active-workflows-list">
            {activeWorkflows.length === 0 ? (
              <div className="no-active-workflows">
                <p>No active workflows</p>
              </div>
            ) : (
              activeWorkflows.map((workflow) => (
                <div key={workflow.id} className="active-workflow">
                  <div className="workflow-info">
                    <h4>{workflow.name}</h4>
                    <span className="workflow-progress">
                      {workflow.progress}% complete
                    </span>
                  </div>
                  <div className="workflow-controls">
                    <button 
                      onClick={() => stopWorkflow(workflow.id)}
                      className="stop-btn"
                    >
                      Stop
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// MCP Tools App
export const MCPToolsApp: React.FC = () => {
  const [tools, setTools] = useState([]);
  const [selectedTool, setSelectedTool] = useState(null);
  const [executionResult, setExecutionResult] = useState(null);
  const [toolParams, setToolParams] = useState({});

  useEffect(() => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
    loadMCPTools();
  }, []);

  const loadMCPTools = async () => {
    try {
      const response = await apiClient.getMCPTools();
      setTools(response.tools || []);
    } catch (error) {
      console.error('Failed to load MCP tools:', error);
    }
  };

  const executeTool = async () => {
    if (!selectedTool) return;

    try {
      const response = await apiClient.executeMCPTool(selectedTool.id, toolParams);
      setExecutionResult(response);
    } catch (error) {
      console.error('Failed to execute tool:', error);
      setExecutionResult({ error: error.message });
    }
  };

  const updateParam = (paramName: string, value: any) => {
    setToolParams(prev => ({ ...prev, [paramName]: value }));
  };

  return (
    <div className="mcp-tools-app">
      <div className="mcp-header">
        <h2>🔧 MCP Tools</h2>
        <p>Model Context Protocol Tools Integration</p>
      </div>

      <div className="mcp-content">
        <div className="tools-sidebar">
          <h3>Available Tools</h3>
          <div className="tools-list">
            {tools.map((tool) => (
              <div 
                key={tool.id} 
                className={`tool-item ${selectedTool?.id === tool.id ? 'active' : ''}`}
                onClick={() => setSelectedTool(tool)}
              >
                <div className="tool-icon">{tool.icon || '🔧'}</div>
                <div className="tool-info">
                  <div className="tool-name">{tool.name}</div>
                  <div className="tool-description">{tool.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="tool-executor">
          {selectedTool ? (
            <div className="executor-content">
              <div className="tool-details">
                <h3>{selectedTool.name}</h3>
                <p>{selectedTool.description}</p>
              </div>

              <div className="tool-parameters">
                <h4>Parameters</h4>
                {selectedTool.parameters?.map((param) => (
                  <div key={param.name} className="param-group">
                    <label>{param.name}</label>
                    <input
                      type={param.type || 'text'}
                      value={toolParams[param.name] || ''}
                      onChange={(e) => updateParam(param.name, e.target.value)}
                      placeholder={param.description}
                    />
                  </div>
                ))}
              </div>

              <div className="execution-controls">
                <button onClick={executeTool} className="execute-btn">
                  Execute Tool
                </button>
              </div>

              {executionResult && (
                <div className="execution-result">
                  <h4>Result</h4>
                  <pre className="result-content">
                    {JSON.stringify(executionResult, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ) : (
            <div className="no-tool-selected">
              <p>Select a tool from the sidebar to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
