import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useWebSocket } from '@/hooks/use-websocket';
import { apiRequest } from '@/lib/queryClient';
import { ErrorHandler } from '@/lib/error-handling';
import { cn } from '@/lib/utils';

// Enhanced Chat Widget with Modern Design
export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputMode, setInputMode] = useState('text');
  const [attachments, setAttachments] = useState([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  // WebSocket connection for real-time updates
  const { isConnected, sendMessage: sendWSMessage } = useWebSocket('/ws', (data) => {
    if (data.type === 'chat_message') {
      setMessages(prev => [
        ...prev,
        {
          id: data.id,
          type: 'ai',
          content: data.content,
          timestamp: new Date(data.timestamp),
          metadata: data.metadata || {},
        },
      ]);
      setIsTyping(false);
    } else if (data.type === 'typing') {
      setIsTyping(true);
    }
  });

  // Fetch chat history
  const {
    data: chatHistory,
    isError: isHistoryError,
    error: historyError,
  } = useQuery({
    queryKey: ['/api/chat/history'],
    queryFn: () =>
      fetch('/api/chat/history?userId=user-1&limit=20').then(res => {
        if (!res.ok) throw new Error('Failed to fetch chat history');
        return res.json();
      }),
    enabled: isOpen,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Handle errors
  useEffect(() => {
    if (isHistoryError) {
      ErrorHandler.getInstance().handleError(historyError, {
        logToConsole: true,
        reportToService: true,
      });
    }
  }, [isHistoryError, historyError]);

  // Chat mutation for sending messages
  const chatMutation = useMutation({
    mutationFn: async (messageData) => {
      const response = await apiRequest('POST', '/api/chat', {
        message: messageData.message,
        userId: 'user-1',
        attachments: messageData.attachments || [],
        mode: messageData.mode || 'text',
      });
      return response.json();
    },
    onSuccess: (data) => {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          type: 'ai',
          content: data.response,
          timestamp: new Date(),
          metadata: data.metadata || {},
          suggestions: data.suggestions || [],
        },
      ]);
      setIsTyping(false);
    },
    onError: (error) => {
      ErrorHandler.getInstance().handleError(error, {
        logToConsole: true,
        reportToService: true,
      });
      setIsTyping(false);
    },
  });

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Load chat history
  useEffect(() => {
    if (isOpen && messages.length === 0 && chatHistory) {
      const welcomeMessage = {
        id: 'welcome',
        type: 'ai',
        content: "Hi! I'm your AI assistant. How can I help you today?",
        timestamp: new Date(),
        metadata: { isWelcome: true },
        suggestions: [
          'Show me AuraOS features',
          'Help with installation',
          'Explain AI capabilities',
          'Get technical support'
        ],
      };
      const history = chatHistory.map(m => ({
        ...m,
        type: m.role,
        timestamp: new Date(m.timestamp),
        metadata: m.metadata || {},
      }));
      setMessages([welcomeMessage, ...history]);
    } else if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          type: 'ai',
          content: "Hi! I'm your AI assistant. I can help you create content, set up automations, or analyze your social media performance. What would you like to do?",
          timestamp: new Date(),
          metadata: { isWelcome: true },
          suggestions: [
            'Try voice commands',
            'Upload an image',
            'Ask for help',
            'Explore features'
          ],
        },
      ]);
    }
  }, [isOpen, chatHistory]);

  // Send message handler
  const handleSendMessage = useCallback(() => {
    if (!message.trim() && attachments.length === 0) return;

    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date(),
      attachments: [...attachments],
    };

    setMessages(prev => [...prev, userMessage]);
    
    // Send via WebSocket for real-time updates
    sendWSMessage({
      type: 'chat_message',
      message: message,
      attachments: attachments,
      mode: inputMode,
    });

    // Also send via API for persistence
    chatMutation.mutate({
      message,
      attachments,
      mode: inputMode,
    });

    setMessage('');
    setAttachments([]);
    setIsTyping(true);
  }, [message, attachments, inputMode, sendWSMessage, chatMutation]);

  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newAttachments = files.map(file => ({
      id: Date.now().toString() + Math.random(),
      file,
      type: file.type.startsWith('image/') ? 'image' : 'file',
      name: file.name,
      size: file.size,
    }));
    setAttachments(prev => [...prev, ...newAttachments]);
  };

  // Remove attachment
  const removeAttachment = (id) => {
    setAttachments(prev => prev.filter(att => att.id !== id));
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setMessage(suggestion);
    inputRef.current?.focus();
  };

  // Toggle input mode
  const toggleInputMode = (mode) => {
    setInputMode(mode);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="relative">
        {/* Chat Toggle Button */}
        <Button
          className={cn(
            "w-16 h-16 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 group relative overflow-hidden",
            "bg-gradient-to-br from-primary via-accent to-secondary",
            "hover:scale-110 active:scale-95",
            "before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/20 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300"
          )}
          onClick={() => setIsOpen(!isOpen)}
          data-testid="button-toggle-chat"
        >
          <div className="relative z-10">
            <i
              className={cn(
                "fas text-xl transition-all duration-300",
                isOpen ? 'fa-times' : 'fa-robot',
                "group-hover:scale-110 group-hover:rotate-12"
              )}
            />
          </div>
          
          {/* Pulse animation when receiving messages */}
          {isTyping && (
            <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
          )}
          
          {/* Connection status indicator */}
          <div className={cn(
            "absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-background transition-colors",
            isConnected ? "bg-green-500" : "bg-red-500"
          )} />
        </Button>

        {/* Chat Window */}
        {isOpen && (
          <Card
            className={cn(
              "absolute bottom-20 right-0 w-96 h-[600px] shadow-2xl",
              "bg-gradient-to-br from-background/95 via-background/90 to-background/95",
              "backdrop-blur-xl border border-border/50",
              "animate-in slide-in-from-bottom-4 fade-in duration-300"
            )}
            data-testid="chat-widget"
          >
            {/* Header */}
            <CardHeader className="p-4 border-b border-border/50 bg-gradient-to-r from-primary/10 to-accent/10">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10 ring-2 ring-primary/20">
                  <AvatarImage src="/ai-avatar.png" alt="AI Assistant" />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground font-bold">
                    <i className="fas fa-robot text-lg" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground">AuraOS AI</h4>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={isConnected ? 'default' : 'destructive'}
                      className="text-xs px-2 py-1"
                    >
                      <div className={cn(
                        "w-2 h-2 rounded-full mr-1",
                        isConnected ? "bg-green-500" : "bg-red-500"
                      )} />
                      {isConnected ? 'Online' : 'Offline'}
                    </Badge>
                    {isTyping && (
                      <Badge variant="secondary" className="text-xs animate-pulse">
                        Typing...
                      </Badge>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="hover:bg-destructive/10 hover:text-destructive"
                  data-testid="button-close-chat"
                >
                  <i className="fas fa-times" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-0 flex flex-col h-full">
              {/* Messages Area */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={cn(
                        "flex gap-3 animate-in slide-in-from-right-2 fade-in duration-300",
                        msg.type === 'user' ? 'justify-end' : 'justify-start'
                      )}
                    >
                      {msg.type === 'ai' && (
                        <Avatar className="w-8 h-8 flex-shrink-0 ring-1 ring-primary/20">
                          <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground">
                            <i className="fas fa-robot text-xs" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      
                      <div className="flex flex-col max-w-[80%]">
                        {/* Message Bubble */}
                        <div
                          className={cn(
                            "p-4 rounded-2xl text-sm relative overflow-hidden",
                            "backdrop-blur-sm border",
                            msg.type === 'user' 
                              ? "bg-gradient-to-br from-primary to-accent text-primary-foreground ml-auto border-primary/30" 
                              : "bg-gradient-to-br from-muted/80 to-muted/60 text-foreground border-border/30",
                            "shadow-lg hover:shadow-xl transition-shadow duration-300"
                          )}
                        >
                          {/* Message content */}
                          <div className="relative z-10">
                            {msg.content}
                            
                            {/* Attachments */}
                            {msg.attachments && msg.attachments.length > 0 && (
                              <div className="mt-2 space-y-2">
                                {msg.attachments.map((att) => (
                                  <div key={att.id} className="flex items-center gap-2 p-2 bg-background/50 rounded-lg">
                                    <i className={cn(
                                      "fas text-xs",
                                      att.type === 'image' ? 'fa-image' : 'fa-file'
                                    )} />
                                    <span className="text-xs truncate">{att.name}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          
                          {/* Gradient overlay */}
                          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                        </div>
                        
                        {/* Message metadata */}
                        <div className={cn(
                          "flex items-center gap-2 mt-1 text-xs text-muted-foreground",
                          msg.type === 'user' ? 'justify-end' : 'justify-start'
                        )}>
                          <span>{msg.timestamp.toLocaleTimeString()}</span>
                          {msg.type === 'ai' && (
                            <div className="flex items-center gap-1">
                              <i className="fas fa-check-double text-primary" />
                              <span>Delivered</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Suggestions */}
                        {msg.suggestions && msg.suggestions.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {msg.suggestions.map((suggestion, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="text-xs h-7 px-3 hover:bg-primary/10 hover:border-primary/30 transition-all duration-200"
                              >
                                <i className="fas fa-lightbulb mr-1 text-xs" />
                                {suggestion}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {msg.type === 'user' && (
                        <Avatar className="w-8 h-8 flex-shrink-0 ring-1 ring-primary/20">
                          <AvatarFallback className="bg-gradient-to-br from-accent to-secondary text-accent-foreground">
                            <i className="fas fa-user text-xs" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}
                  
                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex gap-3 justify-start animate-in slide-in-from-left-2 fade-in duration-300">
                      <Avatar className="w-8 h-8 flex-shrink-0 ring-1 ring-primary/20">
                        <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground">
                          <i className="fas fa-robot text-xs" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-gradient-to-br from-muted/80 to-muted/60 p-4 rounded-2xl border border-border/30 backdrop-blur-sm">
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                          <span className="text-sm text-muted-foreground">AI is thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Error Message */}
                  {chatMutation.isError && (
                    <div className="flex gap-3 justify-start animate-in slide-in-from-left-2 fade-in duration-300">
                      <Avatar className="w-8 h-8 flex-shrink-0 ring-1 ring-destructive/20">
                        <AvatarFallback className="bg-destructive text-destructive-foreground">
                          <i className="fas fa-exclamation-triangle text-xs" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-2xl backdrop-blur-sm">
                        <p className="font-medium text-destructive">Error sending message</p>
                        <p className="text-xs mt-1 text-destructive/80">
                          {chatMutation.error?.message || 'Please try again'}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => chatMutation.reset()}
                          className="mt-2 h-6 text-xs hover:bg-destructive/20"
                        >
                          Try Again
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Input Area */}
              <div className="p-4 border-t border-border/50 bg-gradient-to-r from-muted/30 to-muted/20">
                {/* Input Mode Tabs */}
                <div className="flex gap-1 mb-3">
                  {[
                    { mode: 'text', icon: 'fa-keyboard', label: 'Text' },
                    { mode: 'voice', icon: 'fa-microphone', label: 'Voice' },
                    { mode: 'image', icon: 'fa-image', label: 'Image' },
                  ].map(({ mode, icon, label }) => (
                    <Button
                      key={mode}
                      variant={inputMode === mode ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => toggleInputMode(mode)}
                      className={cn(
                        "flex-1 h-8 text-xs transition-all duration-200",
                        inputMode === mode 
                          ? "bg-primary text-primary-foreground shadow-md" 
                          : "hover:bg-muted/50"
                      )}
                    >
                      <i className={cn("fas", icon, "mr-1")} />
                      {label}
                    </Button>
                  ))}
                </div>

                {/* Attachments Preview */}
                {attachments.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-2">
                    {attachments.map((att) => (
                      <div key={att.id} className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg text-xs">
                        <i className={cn(
                          "fas",
                          att.type === 'image' ? 'fa-image' : 'fa-file'
                        )} />
                        <span className="truncate max-w-20">{att.name}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAttachment(att.id)}
                          className="h-4 w-4 p-0 hover:bg-destructive/20 hover:text-destructive"
                        >
                          <i className="fas fa-times text-xs" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Input Field */}
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Input
                      ref={inputRef}
                      placeholder="Type a message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      disabled={chatMutation.isPending}
                      className="pr-12 bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20"
                    />
                    
                    {/* File Upload Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-muted/50"
                    >
                      <i className="fas fa-paperclip text-xs" />
                    </Button>
                    
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      accept="image/*,.pdf,.doc,.docx,.txt"
                    />
                  </div>
                  
                  <Button
                    onClick={handleSendMessage}
                    disabled={chatMutation.isPending || (!message.trim() && attachments.length === 0)}
                    className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                  >
                    {chatMutation.isPending ? (
                      <LoadingSpinner size="sm" variant="default" />
                    ) : (
                      <i className="fas fa-paper-plane" />
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}