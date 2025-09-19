"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TelegramIntegration;
const react_1 = require("react");
const react_query_1 = require("@tanstack/react-query");
const card_1 = require("@/components/ui/card");
const button_1 = require("@/components/ui/button");
const badge_1 = require("@/components/ui/badge");
const input_1 = require("@/components/ui/input");
const textarea_1 = require("@/components/ui/textarea");
const alert_1 = require("@/components/ui/alert");
const separator_1 = require("@/components/ui/separator");
function TelegramIntegration() {
    const [message, setMessage] = (0, react_1.useState)('');
    const [chatId, setChatId] = (0, react_1.useState)('');
    const [broadcastMessage, setBroadcastMessage] = (0, react_1.useState)('');
    const [chatIds, setChatIds] = (0, react_1.useState)('');
    const queryClient = (0, react_query_1.useQueryClient)();
    // Fetch Telegram bot status
    const { data: botStatus, isLoading: statusLoading, error: statusError } = (0, react_query_1.useQuery)({
        queryKey: ['/api/telegram/status'],
        refetchInterval: 30000, // Refresh every 30 seconds
    });
    // Send message mutation
    const sendMessageMutation = (0, react_query_1.useMutation)({
        mutationFn: async (data) => {
            const response = await fetch('/api/telegram/send-message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok)
                throw new Error('Failed to send message');
            return response.json();
        },
        onSuccess: () => {
            setMessage('');
            queryClient.invalidateQueries({ queryKey: ['/api/telegram/status'] });
        },
    });
    // Broadcast message mutation
    const broadcastMutation = (0, react_query_1.useMutation)({
        mutationFn: async (data) => {
            const response = await fetch('/api/telegram/broadcast', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok)
                throw new Error('Failed to broadcast message');
            return response.json();
        },
        onSuccess: () => {
            setBroadcastMessage('');
            setChatIds('');
            queryClient.invalidateQueries({ queryKey: ['/api/telegram/status'] });
        },
    });
    const handleSendMessage = () => {
        if (!message || !chatId)
            return;
        sendMessageMutation.mutate({ chatId, message });
    };
    const handleBroadcast = () => {
        if (!broadcastMessage || !chatIds)
            return;
        const chatIdArray = chatIds.split(',').map(id => id.trim()).filter(id => id);
        if (chatIdArray.length === 0)
            return;
        broadcastMutation.mutate({ message: broadcastMessage, chatIds: chatIdArray });
    };
    return (<div className="space-y-6">
      {/* Bot Status */}
      <card_1.Card>
        <card_1.CardHeader>
          <card_1.CardTitle className="flex items-center gap-2">
            <i className="fab fa-telegram text-blue-500"></i>
            Telegram Bot Status
          </card_1.CardTitle>
        </card_1.CardHeader>
        <card_1.CardContent>
          {statusLoading ? (<div className="animate-pulse space-y-2">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>) : statusError ? (<alert_1.Alert variant="destructive">
              <alert_1.AlertDescription>
                Failed to load Telegram bot status. Please check your configuration.
              </alert_1.AlertDescription>
            </alert_1.Alert>) : botStatus ? (<div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <badge_1.Badge variant={botStatus.connected ? "default" : "secondary"}>
                    {botStatus.connected ? "🟢 Connected" : "🔴 Disconnected"}
                  </badge_1.Badge>
                  <span className="text-sm text-muted-foreground">
                    @{botStatus.botInfo.username}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Bot ID:</span> {botStatus.botInfo.id}
                </div>
                <div>
                  <span className="font-medium">Name:</span> {botStatus.botInfo.firstName}
                </div>
                <div>
                  <span className="font-medium">Can Join Groups:</span> 
                  {botStatus.botInfo.canJoinGroups ? " ✅" : " ❌"}
                </div>
                <div>
                  <span className="font-medium">Read Group Messages:</span> 
                  {botStatus.botInfo.canReadAllGroupMessages ? " ✅" : " ❌"}
                </div>
              </div>
            </div>) : null}
        </card_1.CardContent>
      </card_1.Card>

      {/* Send Message */}
      <card_1.Card>
        <card_1.CardHeader>
          <card_1.CardTitle>Send Message</card_1.CardTitle>
        </card_1.CardHeader>
        <card_1.CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Chat ID</label>
              <input_1.Input placeholder="Enter chat ID (e.g., 123456789)" value={chatId} onChange={(e) => setChatId(e.target.value)}/>
            </div>
            <div>
              <label className="text-sm font-medium">Message</label>
              <textarea_1.Textarea placeholder="Enter your message..." value={message} onChange={(e) => setMessage(e.target.value)} rows={3}/>
            </div>
          </div>
          
          <button_1.Button onClick={handleSendMessage} disabled={!message || !chatId || sendMessageMutation.isPending} className="w-full">
            {sendMessageMutation.isPending ? "Sending..." : "Send Message"}
          </button_1.Button>
          
          {sendMessageMutation.isError && (<alert_1.Alert variant="destructive">
              <alert_1.AlertDescription>
                Failed to send message: {sendMessageMutation.error?.message}
              </alert_1.AlertDescription>
            </alert_1.Alert>)}
          
          {sendMessageMutation.isSuccess && (<alert_1.Alert>
              <alert_1.AlertDescription>
                ✅ Message sent successfully! Message ID: {sendMessageMutation.data?.messageId}
              </alert_1.AlertDescription>
            </alert_1.Alert>)}
        </card_1.CardContent>
      </card_1.Card>

      <separator_1.Separator />

      {/* Broadcast Message */}
      <card_1.Card>
        <card_1.CardHeader>
          <card_1.CardTitle>Broadcast Message</card_1.CardTitle>
        </card_1.CardHeader>
        <card_1.CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Chat IDs (comma-separated)</label>
            <input_1.Input placeholder="123456789, 987654321, 555666777" value={chatIds} onChange={(e) => setChatIds(e.target.value)}/>
            <p className="text-xs text-muted-foreground mt-1">
              Enter multiple chat IDs separated by commas
            </p>
          </div>
          
          <div>
            <label className="text-sm font-medium">Broadcast Message</label>
            <textarea_1.Textarea placeholder="Enter your broadcast message..." value={broadcastMessage} onChange={(e) => setBroadcastMessage(e.target.value)} rows={4}/>
          </div>
          
          <button_1.Button onClick={handleBroadcast} disabled={!broadcastMessage || !chatIds || broadcastMutation.isPending} className="w-full" variant="outline">
            {broadcastMutation.isPending ? "Broadcasting..." : "Broadcast Message"}
          </button_1.Button>
          
          {broadcastMutation.isError && (<alert_1.Alert variant="destructive">
              <alert_1.AlertDescription>
                Failed to broadcast message: {broadcastMutation.error?.message}
              </alert_1.AlertDescription>
            </alert_1.Alert>)}
          
          {broadcastMutation.isSuccess && (<alert_1.Alert>
              <alert_1.AlertDescription>
                ✅ Broadcast completed! Check results: {broadcastMutation.data?.results?.length} messages processed
              </alert_1.AlertDescription>
            </alert_1.Alert>)}
        </card_1.CardContent>
      </card_1.Card>

      {/* Quick Actions */}
      <card_1.Card>
        <card_1.CardHeader>
          <card_1.CardTitle>Quick Actions</card_1.CardTitle>
        </card_1.CardHeader>
        <card_1.CardContent>
          <div className="grid grid-cols-2 gap-4">
            <button_1.Button variant="outline" onClick={() => {
            setChatId('123456789');
            setMessage('/start');
        }}>
              <i className="fas fa-play mr-2"></i>
              Send /start Command
            </button_1.Button>
            
            <button_1.Button variant="outline" onClick={() => {
            setChatId('123456789');
            setMessage('/help');
        }}>
              <i className="fas fa-question-circle mr-2"></i>
              Send /help Command
            </button_1.Button>
            
            <button_1.Button variant="outline" onClick={() => {
            setChatId('123456789');
            setMessage('/status');
        }}>
              <i className="fas fa-chart-bar mr-2"></i>
              Send /status Command
            </button_1.Button>
            
            <button_1.Button variant="outline" onClick={() => {
            setChatId('123456789');
            setMessage('/posts');
        }}>
              <i className="fas fa-list mr-2"></i>
              Send /posts Command
            </button_1.Button>
          </div>
        </card_1.CardContent>
      </card_1.Card>
    </div>);
}
