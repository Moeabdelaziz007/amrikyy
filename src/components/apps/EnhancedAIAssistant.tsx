import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { 
  Bot, 
  Send, 
  Mic, 
  MicOff, 
  Settings, 
  RefreshCw, 
  Download, 
  Upload,
  FileText,
  Image,
  Code,
  Zap,
  Brain,
  MessageSquare,
  User,
  Clock,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Star,
  Bookmark,
  History,
  Lightbulb,
  Target,
  TrendingUp,
  Activity,
  Globe,
  Database,
  Cpu,
  Lock,
  Unlock
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  type: 'text' | 'code' | 'image' | 'file';
  metadata?: any;
  rating?: 'positive' | 'negative' | null;
  isTyping?: boolean;
}

interface AICapability {
  id: string;
  name: string;
  description: string;
  category: 'text' | 'code' | 'image' | 'data' | 'system';
  enabled: boolean;
  icon: React.ComponentType<any>;
}

interface AIAssistant {
  id: string;
  name: string;
  description: string;
  personality: string;
  capabilities: string[];
  isActive: boolean;
  responseTime: number;
  usageCount: number;
}

export const EnhancedAIAssistant: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedAssistant, setSelectedAssistant] = useState<string>('default');
  const [assistants, setAssistants] = useState<AIAssistant[]>([]);
  const [capabilities, setCapabilities] = useState<AICapability[]>([]);
  const [selectedTab, setSelectedTab] = useState<'chat' | 'assistants' | 'capabilities' | 'history'>('chat');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    loadAIData();
    initializeSpeechRecognition();
    
    // Auto-scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [messages]);

  const initializeSpeechRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  };

  const loadAIData = async () => {
    try {
      await Promise.all([
        loadAssistants(),
        loadCapabilities(),
        loadChatHistory()
      ]);
    } catch (error) {
      console.error('Failed to load AI data:', error);
      // Use mock data if API fails
      setAssistants(getMockAssistants());
      setCapabilities(getMockCapabilities());
      setMessages(getMockMessages());
    } finally {
      setLoading(false);
    }
  };

  const loadAssistants = async () => {
    try {
      const response = await fetch('/api/ai/assistants');
      const data = await response.json();
      
      if (data.assistants) {
        setAssistants(data.assistants);
      } else {
        setAssistants(getMockAssistants());
      }
    } catch (error) {
      console.error('Failed to load assistants:', error);
      setAssistants(getMockAssistants());
    }
  };

  const loadCapabilities = async () => {
    try {
      const response = await fetch('/api/ai/capabilities');
      const data = await response.json();
      
      if (data.capabilities) {
        setCapabilities(data.capabilities);
      } else {
        setCapabilities(getMockCapabilities());
      }
    } catch (error) {
      console.error('Failed to load capabilities:', error);
      setCapabilities(getMockCapabilities());
    }
  };

  const loadChatHistory = async () => {
    try {
      const response = await fetch('/api/ai/chat-history');
      const data = await response.json();
      
      if (data.messages) {
        setMessages(data.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })));
      } else {
        setMessages(getMockMessages());
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
      setMessages(getMockMessages());
    }
  };

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          assistantId: selectedAssistant,
          conversationId: 'current'
        })
      });

      if (response.ok) {
        const data = await response.json();
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.response,
          timestamp: new Date(),
          type: data.type || 'text',
          metadata: data.metadata
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error('Failed to get AI response');
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const rateMessage = async (messageId: string, rating: 'positive' | 'negative') => {
    try {
      const response = await fetch(`/api/ai/rate-message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messageId, rating })
      });

      if (response.ok) {
        setMessages(prev => prev.map(msg => 
          msg.id === messageId ? { ...msg, rating } : msg
        ));
      }
    } catch (error) {
      console.error('Failed to rate message:', error);
    }
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const clearChat = () => {
    if (confirm('Are you sure you want to clear the chat history?')) {
      setMessages([]);
    }
  };

  const exportChat = async () => {
    try {
      const response = await fetch('/api/ai/export-chat', {
        method: 'POST'
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'chat-history.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        alert('Chat history exported successfully!');
      } else {
        throw new Error('Export failed');
      }
    } catch (error) {
      console.error('Failed to export chat:', error);
      alert('Failed to export chat history. Please try again.');
    }
  };

  const getCapabilityIcon = (category: string) => {
    switch (category) {
      case 'text':
        return <FileText className="w-5 h-5 text-blue-400" />;
      case 'code':
        return <Code className="w-5 h-5 text-green-400" />;
      case 'image':
        return <Image className="w-5 h-5 text-purple-400" />;
      case 'data':
        return <Database className="w-5 h-5 text-orange-400" />;
      case 'system':
        return <Cpu className="w-5 h-5 text-red-400" />;
      default:
        return <Zap className="w-5 h-5 text-gray-400" />;
    }
  };

  // Mock data functions
  const getMockAssistants = (): AIAssistant[] => [
    {
      id: 'default',
      name: 'General Assistant',
      description: 'Helpful AI assistant for general tasks',
      personality: 'Friendly and professional',
      capabilities: ['text', 'code', 'data'],
      isActive: true,
      responseTime: 1.2,
      usageCount: 1247
    },
    {
      id: 'coding',
      name: 'Code Expert',
      description: 'Specialized in programming and development',
      personality: 'Technical and precise',
      capabilities: ['code', 'system'],
      isActive: true,
      responseTime: 0.8,
      usageCount: 892
    },
    {
      id: 'creative',
      name: 'Creative Assistant',
      description: 'Helps with creative writing and brainstorming',
      personality: 'Imaginative and inspiring',
      capabilities: ['text', 'image'],
      isActive: true,
      responseTime: 1.5,
      usageCount: 567
    }
  ];

  const getMockCapabilities = (): AICapability[] => [
    {
      id: '1',
      name: 'Text Generation',
      description: 'Generate and edit text content',
      category: 'text',
      enabled: true,
      icon: FileText
    },
    {
      id: '2',
      name: 'Code Assistance',
      description: 'Help with programming and code review',
      category: 'code',
      enabled: true,
      icon: Code
    },
    {
      id: '3',
      name: 'Image Analysis',
      description: 'Analyze and describe images',
      category: 'image',
      enabled: true,
      icon: Image
    },
    {
      id: '4',
      name: 'Data Processing',
      description: 'Process and analyze data',
      category: 'data',
      enabled: true,
      icon: Database
    },
    {
      id: '5',
      name: 'System Control',
      description: 'Control system operations',
      category: 'system',
      enabled: false,
      icon: Cpu
    }
  ];

  const getMockMessages = (): ChatMessage[] => [
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI assistant. How can I help you today?',
      timestamp: new Date(Date.now() - 1000 * 60 * 10),
      type: 'text'
    },
    {
      id: '2',
      role: 'user',
      content: 'Can you help me write a React component?',
      timestamp: new Date(Date.now() - 1000 * 60 * 8),
      type: 'text'
    },
    {
      id: '3',
      role: 'assistant',
      content: 'Of course! Here\'s a simple React component:\n\n```jsx\nimport React from \'react\';\n\nconst MyComponent = () => {\n  return (\n    <div>\n      <h1>Hello World!</h1>\n    </div>\n  );\n};\n\nexport default MyComponent;\n```',
      timestamp: new Date(Date.now() - 1000 * 60 * 7),
      type: 'code',
      rating: 'positive'
    }
  ];

  const filteredAssistants = assistants.filter(assistant => {
    const matchesSearch = searchQuery === '' || 
      assistant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assistant.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const filteredCapabilities = capabilities.filter(capability => {
    const matchesSearch = searchQuery === '' || 
      capability.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      capability.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400 mx-auto mb-4"></div>
            <p className="text-white text-lg">Loading AI Assistant...</p>
            <p className="text-gray-400">Initializing artificial intelligence</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <Bot className="w-8 h-8 text-purple-400" />
            <div>
              <h1 className="text-2xl font-bold text-white">AI Assistant</h1>
              <p className="text-gray-400">Intelligent conversation and task assistance</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              onClick={exportChat}
              variant="outline"
              className="text-purple-400 border-purple-400 hover:bg-purple-400 hover:text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button
              onClick={clearChat}
              variant="outline"
              className="text-red-400 border-red-400 hover:bg-red-400 hover:text-white"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10">
          {[
            { id: 'chat', label: 'Chat', icon: MessageSquare },
            { id: 'assistants', label: 'Assistants', icon: Bot },
            { id: 'capabilities', label: 'Capabilities', icon: Zap },
            { id: 'history', label: 'History', icon: History }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as any)}
              className={`flex items-center space-x-2 px-6 py-4 border-b-2 transition-colors ${
                selectedTab === tab.id
                  ? 'border-purple-400 text-purple-400 bg-purple-400/10'
                  : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        {selectedTab === 'chat' && (
          <div className="flex-1 flex flex-col">
            {/* Chat Messages */}
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-4">
                {messages.map(message => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-3xl p-4 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-purple-600 text-white'
                          : 'bg-white/5 text-white border border-white/10'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        {message.role === 'assistant' && (
                          <Bot className="w-6 h-6 text-purple-400 mt-1 flex-shrink-0" />
                        )}
                        {message.role === 'user' && (
                          <User className="w-6 h-6 text-white mt-1 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="font-semibold">
                              {message.role === 'user' ? 'You' : 'AI Assistant'}
                            </span>
                            <span className="text-xs text-gray-400">
                              {message.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                          
                          {message.type === 'code' ? (
                            <pre className="bg-black/20 p-3 rounded text-sm overflow-x-auto">
                              <code>{message.content}</code>
                            </pre>
                          ) : (
                            <p className="whitespace-pre-wrap">{message.content}</p>
                          )}

                          {message.role === 'assistant' && (
                            <div className="flex items-center space-x-2 mt-3">
                              <Button
                                onClick={() => copyMessage(message.content)}
                                size="sm"
                                variant="outline"
                                className="text-gray-400 border-gray-400 hover:bg-gray-400 hover:text-white"
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                              <Button
                                onClick={() => rateMessage(message.id, 'positive')}
                                size="sm"
                                variant="outline"
                                className={`${message.rating === 'positive' ? 'bg-green-500 text-white' : 'text-gray-400 border-gray-400 hover:bg-gray-400 hover:text-white'}`}
                              >
                                <ThumbsUp className="w-3 h-3" />
                              </Button>
                              <Button
                                onClick={() => rateMessage(message.id, 'negative')}
                                size="sm"
                                variant="outline"
                                className={`${message.rating === 'negative' ? 'bg-red-500 text-white' : 'text-gray-400 border-gray-400 hover:bg-gray-400 hover:text-white'}`}
                              >
                                <ThumbsDown className="w-3 h-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white/5 text-white border border-white/10 rounded-lg p-4 max-w-3xl">
                      <div className="flex items-center space-x-3">
                        <Bot className="w-6 h-6 text-purple-400" />
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div ref={messagesEndRef} />
            </ScrollArea>

            {/* Chat Input */}
            <div className="p-6 border-t border-white/10 bg-black/20">
              <div className="flex items-center space-x-4">
                <div className="flex-1 relative">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage(inputMessage)}
                    placeholder="Ask me anything..."
                    className="pr-12 bg-white/5 border-white/20 text-white placeholder-gray-400"
                  />
                  <Button
                    onClick={toggleListening}
                    size="sm"
                    className={`absolute right-2 top-1/2 transform -translate-y-1/2 ${
                      isListening 
                        ? 'bg-red-600 hover:bg-red-700 text-white' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </Button>
                </div>
                <Button
                  onClick={() => sendMessage(inputMessage)}
                  disabled={!inputMessage.trim() || isTyping}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'assistants' && (
          <ScrollArea className="flex-1">
            <div className="p-6">
              {/* Search */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search assistants..."
                  className="pl-10 bg-white/5 border-white/20 text-white placeholder-gray-400"
                />
              </div>

              {/* Assistants Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAssistants.map(assistant => (
                  <Card key={assistant.id} className="bg-white/5 border-white/10">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Bot className="w-6 h-6 text-purple-400" />
                          <div>
                            <CardTitle className="text-white text-lg">{assistant.name}</CardTitle>
                            <Badge variant="outline" className={
                              assistant.isActive ? 'text-green-400 border-green-400' : 'text-gray-400 border-gray-400'
                            }>
                              {assistant.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 mb-4">{assistant.description}</p>
                      
                      <div className="space-y-3 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Personality:</span>
                          <span className="text-white">{assistant.personality}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Response Time:</span>
                          <span className="text-white">{assistant.responseTime}s</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Usage Count:</span>
                          <span className="text-white">{assistant.usageCount}</span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-gray-400 text-sm mb-2">Capabilities:</p>
                        <div className="flex flex-wrap gap-1">
                          {assistant.capabilities.map(capability => (
                            <Badge key={capability} variant="outline" className="text-xs text-gray-400 border-gray-400">
                              {capability}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <Button
                        onClick={() => setSelectedAssistant(assistant.id)}
                        className={`w-full ${
                          selectedAssistant === assistant.id
                            ? 'bg-purple-600 text-white'
                            : 'bg-green-600 hover:bg-green-700 text-white'
                        }`}
                      >
                        {selectedAssistant === assistant.id ? 'Selected' : 'Select'}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </ScrollArea>
        )}

        {selectedTab === 'capabilities' && (
          <ScrollArea className="flex-1">
            <div className="p-6">
              {/* Search */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search capabilities..."
                  className="pl-10 bg-white/5 border-white/20 text-white placeholder-gray-400"
                />
              </div>

              {/* Capabilities Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCapabilities.map(capability => (
                  <Card key={capability.id} className="bg-white/5 border-white/10">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {getCapabilityIcon(capability.category)}
                          <div>
                            <CardTitle className="text-white text-lg">{capability.name}</CardTitle>
                            <Badge variant="outline" className={
                              capability.enabled ? 'text-green-400 border-green-400' : 'text-gray-400 border-gray-400'
                            }>
                              {capability.enabled ? 'Enabled' : 'Disabled'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 mb-4">{capability.description}</p>
                      
                      <div className="flex justify-between text-sm mb-4">
                        <span className="text-gray-400">Category:</span>
                        <span className="text-white capitalize">{capability.category}</span>
                      </div>

                      <Button
                        variant="outline"
                        className={`w-full ${
                          capability.enabled 
                            ? 'text-green-400 border-green-400 hover:bg-green-400 hover:text-white'
                            : 'text-gray-400 border-gray-400 hover:bg-gray-400 hover:text-white'
                        }`}
                      >
                        {capability.enabled ? <Unlock className="w-4 h-4 mr-2" /> : <Lock className="w-4 h-4 mr-2" />}
                        {capability.enabled ? 'Enabled' : 'Disabled'}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </ScrollArea>
        )}

        {selectedTab === 'history' && (
          <ScrollArea className="flex-1">
            <div className="p-6">
              <div className="space-y-4">
                {messages.map(message => (
                  <div key={message.id} className="p-4 bg-black/20 rounded-lg border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        {message.role === 'assistant' ? (
                          <Bot className="w-5 h-5 text-purple-400" />
                        ) : (
                          <User className="w-5 h-5 text-blue-400" />
                        )}
                        <span className="text-white font-semibold">
                          {message.role === 'user' ? 'You' : 'AI Assistant'}
                        </span>
                        <span className="text-gray-400 text-sm">
                          {message.timestamp.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {message.rating && (
                          <Badge variant="outline" className={
                            message.rating === 'positive' ? 'text-green-400 border-green-400' : 'text-red-400 border-red-400'
                          }>
                            {message.rating === 'positive' ? '👍' : '👎'}
                          </Badge>
                        )}
                        <Button
                          onClick={() => copyMessage(message.content)}
                          size="sm"
                          variant="outline"
                          className="text-gray-400 border-gray-400 hover:bg-gray-400 hover:text-white"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm">
                      {message.content.length > 100 
                        ? `${message.content.substring(0, 100)}...` 
                        : message.content
                      }
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
};
