"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ChatWidget;
const react_1 = require("react");
const react_query_1 = require("@tanstack/react-query");
const card_1 = require("@/components/ui/card");
const button_1 = require("@/components/ui/button");
const input_1 = require("@/components/ui/input");
const badge_1 = require("@/components/ui/badge");
const scroll_area_1 = require("@/components/ui/scroll-area");
const avatar_1 = require("@/components/ui/avatar");
const loading_spinner_1 = require("@/components/ui/loading-spinner");
const use_websocket_1 = require("@/hooks/use-websocket");
const queryClient_1 = require("@/lib/queryClient");
const error_handling_1 = require("@/lib/error-handling");
function ChatWidget() {
    const [isOpen, setIsOpen] = (0, react_1.useState)(false);
    const [message, setMessage] = (0, react_1.useState)("");
    const [messages, setMessages] = (0, react_1.useState)([]);
    const messagesEndRef = (0, react_1.useRef)(null);
    const { isConnected } = (0, use_websocket_1.useWebSocket)('/ws', (data) => {
        if (data.type === 'chat_message') {
            setMessages(prev => [
                ...prev,
                { id: data.id, type: 'ai', content: data.content, timestamp: new Date(data.timestamp) }
            ]);
        }
    });
    const { data: chatHistory, isError: isHistoryError, error: historyError } = (0, react_query_1.useQuery)({
        queryKey: ['/api/chat/history'],
        queryFn: () => fetch('/api/chat/history?userId=user-1&limit=10').then(res => {
            if (!res.ok)
                throw new Error('Failed to fetch chat history');
            return res.json();
        }),
        enabled: isOpen,
    });
    (0, react_1.useEffect)(() => {
        if (isHistoryError) {
            error_handling_1.ErrorHandler.getInstance().handleError(historyError, {
                logToConsole: true,
                reportToService: true,
                // Assuming the handler will show a non-intrusive toast for this type of error
            });
        }
    }, [isHistoryError, historyError]);
    const chatMutation = (0, react_query_1.useMutation)({
        mutationFn: async (userMessage) => {
            const response = await (0, queryClient_1.apiRequest)('POST', '/api/chat', {
                message: userMessage,
                userId: 'user-1',
            });
            // apiRequest should throw on non-ok responses
            return response.json();
        },
        onSuccess: (data) => {
            setMessages(prev => [
                ...prev,
                { id: Date.now().toString(), type: 'ai', content: data.response, timestamp: new Date() }
            ]);
        },
        onError: (error) => {
            // Report to centralized handler, but don't show a global toast 
            // as we have a local error UI.
            error_handling_1.ErrorHandler.getInstance().handleError(error, {
                logToConsole: true,
                reportToService: true,
            });
        },
    });
    const handleSendMessage = () => {
        if (!message.trim())
            return;
        const userMessage = { id: Date.now().toString(), type: 'user', content: message, timestamp: new Date() };
        setMessages(prev => [...prev, userMessage]);
        chatMutation.mutate(message);
        setMessage("");
    };
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };
    (0, react_1.useEffect)(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    (0, react_1.useEffect)(() => {
        if (isOpen && messages.length === 0 && chatHistory) {
            const welcomeMessage = {
                id: 'welcome',
                type: 'ai',
                content: "Hi! I'm your AI assistant. How can I help you today?",
                timestamp: new Date()
            };
            const history = chatHistory.map(m => ({ ...m, type: m.role, timestamp: new Date(m.timestamp) }));
            setMessages([welcomeMessage, ...history]);
        }
        else if (isOpen && messages.length === 0) {
            setMessages([{
                    id: 'welcome',
                    type: 'ai',
                    content: "Hi! I'm your AI assistant. I can help you create content, set up automations, or analyze your social media performance. What would you like to do?",
                    timestamp: new Date()
                }]);
        }
    }, [isOpen, chatHistory]);
    return (<div className="fixed bottom-6 right-6 z-50">
      <div className="relative">
        <button_1.Button className="w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 group" onClick={() => setIsOpen(!isOpen)} data-testid="button-toggle-chat">
          <i className={`fas ${isOpen ? 'fa-times' : 'fa-robot'} text-lg group-hover:scale-110 transition-transform`}></i>
        </button_1.Button>
        
        {isOpen && (<card_1.Card className="absolute bottom-16 right-0 w-80 shadow-xl glass-card neon-glow-md" data-testid="chat-widget">
            <card_1.CardHeader className="p-4 border-b">
                <div className="flex items-center gap-3">
                    <avatar_1.Avatar className="w-8 h-8">
                        <avatar_1.AvatarImage src="" alt="AI Assistant"/>
                        <avatar_1.AvatarFallback className="bg-gradient-to-r from-primary to-accent text-primary-foreground">
                            <i className="fas fa-robot text-sm"></i>
                        </avatar_1.AvatarFallback>
                    </avatar_1.Avatar>
                    <div className="flex-1">
                        <h4 className="font-medium text-foreground">AI Assistant</h4>
                        <badge_1.Badge variant={isConnected ? 'default' : 'destructive'} className="text-xs">
                            {isConnected ? 'Online' : 'Offline'}
                        </badge_1.Badge>
                    </div>
                    <button_1.Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} data-testid="button-close-chat">
                        <i className="fas fa-times"></i>
                    </button_1.Button>
                </div>
            </card_1.CardHeader>
            
            <card_1.CardContent className="p-0">
              <scroll_area_1.ScrollArea className="h-60 p-4 cyber-scrollbar">
                <div className="space-y-4">
                  {messages.map((msg) => (<div key={msg.id} className={`flex gap-3 ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      {msg.type === 'ai' && (<avatar_1.Avatar className="w-6 h-6 flex-shrink-0">
                          <avatar_1.AvatarFallback className="bg-primary text-primary-foreground">
                            <i className="fas fa-robot text-xs"></i>
                          </avatar_1.AvatarFallback>
                        </avatar_1.Avatar>)}
                      <div className={`max-w-[80%] p-3 rounded-lg text-sm ${msg.type === 'user' ? 'bg-primary text-primary-foreground ml-auto' : 'bg-muted text-foreground'}`}>
                        {msg.content}
                      </div>
                    </div>))}
                  {chatMutation.isPending && (<div className="flex gap-3 justify-start">
                      <avatar_1.Avatar className="w-6 h-6 flex-shrink-0"><avatar_1.AvatarFallback className="bg-primary text-primary-foreground"><i className="fas fa-robot text-xs"></i></avatar_1.AvatarFallback></avatar_1.Avatar>
                      <div className="bg-muted text-foreground p-3 rounded-lg text-sm"><loading_spinner_1.LoadingSpinner size="sm" variant="cyber" text="AI is thinking..."/></div>
                    </div>)}
                  {chatMutation.isError && (<div className="flex gap-3 justify-start">
                      <avatar_1.Avatar className="w-6 h-6 flex-shrink-0"><avatar_1.AvatarFallback className="bg-destructive text-destructive-foreground"><i className="fas fa-exclamation-triangle text-xs"></i></avatar_1.AvatarFallback></avatar_1.Avatar>
                      <div className="bg-destructive/10 border border-destructive/20 text-destructive p-3 rounded-lg text-sm">
                        <p className="font-medium">Error sending message</p>
                        <p className="text-xs mt-1">{chatMutation.error?.message || 'Please try again'}</p>
                        <button_1.Button variant="ghost" size="sm" onClick={() => chatMutation.reset()} className="mt-2 h-6 text-xs">Try Again</button_1.Button>
                      </div>
                    </div>)}
                  <div ref={messagesEndRef}/>
                </div>
              </scroll_area_1.ScrollArea>
              
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <input_1.Input placeholder="Type a message..." value={message} onChange={(e) => setMessage(e.target.value)} onKeyPress={handleKeyPress} disabled={chatMutation.isPending} className="neon-input"/>
                  <button_1.Button onClick={handleSendMessage} disabled={chatMutation.isPending || !message.trim()} className="neon-button">
                    <i className="fas fa-paper-plane"></i>
                  </button_1.Button>
                </div>
              </div>
            </card_1.CardContent>
          </card_1.Card>)}
      </div>
    </div>);
}
