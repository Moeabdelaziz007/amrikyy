import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageSquare, 
  Send, 
  Bot, 
  Users, 
  Settings, 
  Play, 
  Pause, 
  RotateCcw,
  CheckCircle,
  XCircle,
  Clock,
  Activity
} from 'lucide-react';
import { apiClient } from '@/lib/api-client';

interface TelegramControlPanelProps {
  onExecute?: (data: any) => void;
}

interface TelegramMessage {
  id: string;
  text: string;
  from: string;
  timestamp: Date;
  type: 'incoming' | 'outgoing';
}

interface TelegramBotStatus {
  isActive: boolean;
  connectedUsers: number;
  totalMessages: number;
  lastActivity: Date;
}

export default function TelegramControlPanel({ onExecute }: TelegramControlPanelProps) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<TelegramMessage[]>([]);
  const [botStatus, setBotStatus] = useState<TelegramBotStatus>({
    isActive: false,
    connectedUsers: 0,
    totalMessages: 0,
    lastActivity: new Date()
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [botSettings, setBotSettings] = useState({
    autoReply: true,
    welcomeMessage: 'Welcome to AuraOS! How can I help you today?',
    commands: ['/help', '/status', '/tasks', '/autopilot']
  });

  // Load bot status and messages
  useEffect(() => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
    loadBotStatus();
    loadRecentMessages();
  }, []);

  const loadBotStatus = async () => {
    try {
      const status = await apiClient.request('/api/telegram/status');
      setBotStatus(status);
    } catch (err) {
      console.warn('Failed to load bot status:', err);
      // Use mock data for development
      setBotStatus({
        isActive: true,
        connectedUsers: 5,
        totalMessages: 127,
        lastActivity: new Date()
      });
    }
  };

  const loadRecentMessages = async () => {
    try {
      const response = await apiClient.request('/api/telegram/messages');
      setMessages(response.messages || []);
    } catch (err) {
      console.warn('Failed to load messages:', err);
      // Use mock data for development
      setMessages([
        {
          id: '1',
          text: 'Hello! Can you help me with automation?',
          from: 'user123',
          timestamp: new Date(Date.now() - 300000),
          type: 'incoming'
        },
        {
          id: '2',
          text: 'Of course! I can help you set up automated workflows.',
          from: 'auraos_bot',
          timestamp: new Date(Date.now() - 240000),
          type: 'outgoing'
        },
        {
          id: '3',
          text: '/status',
          from: 'user456',
          timestamp: new Date(Date.now() - 120000),
          type: 'incoming'
        },
        {
          id: '4',
          text: 'System Status: All services running normally ✅',
          from: 'auraos_bot',
          timestamp: new Date(Date.now() - 60000),
          type: 'outgoing'
        }
      ]);
    }
  };

  const sendMessage = async () => {
    if (!message.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.request('/api/telegram/send', {
        method: 'POST',
        body: JSON.stringify({
          message: message.trim(),
          broadcast: false
        })
      });
      
      // Add to local messages
      const newMessage: TelegramMessage = {
        id: Date.now().toString(),
        text: message.trim(),
        from: 'auraos_bot',
        timestamp: new Date(),
        type: 'outgoing'
      };
      
      setMessages(prev => [newMessage, ...prev]);
      setMessage('');
      onExecute?.(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleBot = async () => {
    setIsLoading(true);
    try {
      const action = botStatus.isActive ? 'stop' : 'start';
      await apiClient.request(`/api/telegram/${action}`, { method: 'POST' });
      
      setBotStatus(prev => ({ ...prev, isActive: !prev.isActive }));
      onExecute?.({ action, status: !botStatus.isActive });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle bot');
    } finally {
      setIsLoading(false);
    }
  };

  const broadcastMessage = async () => {
    if (!message.trim()) return;
    
    setIsLoading(true);
    try {
      await apiClient.request('/api/telegram/broadcast', {
        method: 'POST',
        body: JSON.stringify({
          message: message.trim()
        })
      });
      
      setMessage('');
      onExecute?.({ action: 'broadcast', message: message.trim() });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to broadcast message');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          Telegram Control Panel
        </CardTitle>
        <CardDescription>
          Manage your Telegram bot and communicate with users
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="messages" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="status">Status</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="commands">Commands</TabsTrigger>
          </TabsList>
          
          <TabsContent value="messages" className="space-y-4">
            {/* Message Input */}
            <div className="flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                disabled={isLoading}
              />
              <Button onClick={sendMessage} disabled={isLoading || !message.trim()}>
                <Send className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                onClick={broadcastMessage} 
                disabled={isLoading || !message.trim()}
              >
                <Users className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Messages List */}
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-3 rounded-lg ${
                    msg.type === 'outgoing'
                      ? 'bg-blue-100 ml-8'
                      : 'bg-gray-100 mr-8'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium">{msg.from}</p>
                      <p className="text-sm">{msg.text}</p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {msg.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="status" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    <span className="text-sm font-medium">Bot Status</span>
                  </div>
                  <div className="mt-2">
                    <Badge variant={botStatus.isActive ? 'default' : 'secondary'}>
                      {botStatus.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span className="text-sm font-medium">Connected Users</span>
                  </div>
                  <div className="mt-2 text-2xl font-bold">
                    {botStatus.connectedUsers}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    <span className="text-sm font-medium">Total Messages</span>
                  </div>
                  <div className="mt-2 text-2xl font-bold">
                    {botStatus.totalMessages}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm font-medium">Last Activity</span>
                  </div>
                  <div className="mt-2 text-sm">
                    {botStatus.lastActivity.toLocaleTimeString()}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={toggleBot} 
                disabled={isLoading}
                variant={botStatus.isActive ? 'destructive' : 'default'}
              >
                {botStatus.isActive ? (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    Stop Bot
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Start Bot
                  </>
                )}
              </Button>
              
              <Button variant="outline" onClick={loadBotStatus}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Auto Reply</label>
                <input
                  type="checkbox"
                  checked={botSettings.autoReply}
                  onChange={(e) => setBotSettings(prev => ({ ...prev, autoReply: e.target.checked }))}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Welcome Message</label>
                <Input
                  value={botSettings.welcomeMessage}
                  onChange={(e) => setBotSettings(prev => ({ ...prev, welcomeMessage: e.target.value }))}
                  placeholder="Welcome message for new users"
                />
              </div>
              
              <Button onClick={() => onExecute?.({ action: 'save_settings', settings: botSettings })}>
                <Settings className="h-4 w-4 mr-2" />
                Save Settings
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="commands" className="space-y-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Available Commands</h4>
              {botSettings.commands.map((cmd, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-gray-100 rounded">
                  <code className="text-sm">{cmd}</code>
                  <Badge variant="outline">Active</Badge>
                </div>
              ))}
            </div>
            
            <div className="text-sm text-gray-600">
              <p><strong>/help</strong> - Show available commands</p>
              <p><strong>/status</strong> - Check system status</p>
              <p><strong>/tasks</strong> - View automation tasks</p>
              <p><strong>/autopilot</strong> - Control autopilot mode</p>
            </div>
          </TabsContent>
        </Tabs>
        
        {error && (
          <Alert className="mt-4">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
