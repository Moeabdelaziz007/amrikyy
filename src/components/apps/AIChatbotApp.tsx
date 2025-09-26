import { Send, Bot, User, Sparkles, Trash2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const AIChatbotApp = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content:
        "Hello! I'm your AI assistant powered by AuraOS AI System. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        'I understand your question. Let me help you with that.',
        "That's an interesting point. Here's what I think...",
        'Based on my analysis, I can suggest the following approach...',
        "I'm here to assist you with any questions or tasks you have.",
        'Let me break this down for you in a clear and helpful way.',
        'I can help you solve this problem step by step.',
      ];

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const clearChat = () => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: 'Chat cleared! How can I help you today?',
        timestamp: new Date(),
      },
    ]);
  };

  const exportChat = () => {
    const chatContent = messages
      .map(
        msg =>
          `[${msg.timestamp.toLocaleTimeString()}] ${msg.role === 'user' ? 'You' : 'AI'}: ${msg.content}`
      )
      .join('\n\n');

    const blob = new Blob([chatContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ai-chat-history.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-green-900/20 to-emerald-900/20">
      {/* Header */}
      <div className="p-4 border-b border-white/10 glass flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-semibold">AI Assistant</h2>
            <p className="text-xs text-muted-foreground">
              Powered by AuraOS AI
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={exportChat}
            variant="outline"
            size="sm"
            className="glass border-white/20 hover:bg-white/10"
          >
            <Download className="w-4 h-4" />
          </Button>
          <Button
            onClick={clearChat}
            variant="outline"
            size="sm"
            className="glass border-destructive/30 hover:bg-destructive/20"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map(message => (
            <div
              key={message.id}
              className={cn(
                'flex gap-3 animate-slide-up',
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-gradient-secondary flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}

              <div
                className={cn(
                  'max-w-[70%] p-3 rounded-2xl glass border',
                  message.role === 'user'
                    ? 'bg-primary/20 border-primary/30 text-primary-foreground'
                    : 'border-white/20'
                )}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>

              {message.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex gap-3 animate-slide-up">
              <div className="w-8 h-8 rounded-full bg-gradient-secondary flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="glass border border-white/20 p-3 rounded-2xl">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-accent rounded-full animate-bounce" />
                  <div
                    className="w-2 h-2 bg-accent rounded-full animate-bounce"
                    style={{ animationDelay: '0.1s' }}
                  />
                  <div
                    className="w-2 h-2 bg-accent rounded-full animate-bounce"
                    style={{ animationDelay: '0.2s' }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-white/10 glass">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Input
              value={inputMessage}
              onChange={e => setInputMessage(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && sendMessage()}
              placeholder="Type your message..."
              className="pr-12 glass border-white/20 bg-white/5"
              disabled={isTyping}
            />
            <Sparkles className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-accent animate-glow-pulse" />
          </div>
          <Button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isTyping}
            className="bg-gradient-primary hover:opacity-90"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          {[
            'What can you do?',
            'Help me plan my day',
            'Explain AI technology',
            'Creative writing tips',
          ].map(suggestion => (
            <Button
              key={suggestion}
              onClick={() => setInputMessage(suggestion)}
              variant="outline"
              size="sm"
              className="glass border-white/20 hover:bg-white/10 text-xs"
            >
              {suggestion}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
