'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.default = MultilingualAssistantApp;
const react_1 = require('react');
const card_1 = require('@/components/ui/card');
const button_1 = require('@/components/ui/button');
const input_1 = require('@/components/ui/input');
const textarea_1 = require('@/components/ui/textarea');
const select_1 = require('@/components/ui/select');
const lucide_react_1 = require('lucide-react');
function MultilingualAssistantApp() {
  const [message, setMessage] = (0, react_1.useState)('');
  const [language, setLanguage] = (0, react_1.useState)('auto');
  const [userProfile, setUserProfile] = (0, react_1.useState)('');
  const [context, setContext] = (0, react_1.useState)('');
  const [output, setOutput] = (0, react_1.useState)(null);
  const [loading, setLoading] = (0, react_1.useState)(false);
  const [error, setError] = (0, react_1.useState)(null);
  const executeAssistant = async () => {
    setLoading(true);
    setError(null);
    setOutput(null);
    try {
      const response = await fetch('http://localhost:3001/mcp/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tool: 'multilingual_assistant',
          params: {
            message,
            language,
            user_profile: userProfile ? JSON.parse(userProfile) : undefined,
            context,
          },
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || 'Failed to execute Multilingual Assistant'
        );
      }
      const data = await response.json();
      setOutput(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <card_1.Card className="w-full">
      <card_1.CardHeader>
        <card_1.CardTitle className="flex items-center gap-2">
          <lucide_react_1.Languages className="h-5 w-5" /> Multilingual
          Assistant
        </card_1.CardTitle>
        <p className="text-muted-foreground">
          Advanced AI assistant with Arabic and English support for technical
          creativity, education, and wellness.
        </p>
      </card_1.CardHeader>
      <card_1.CardContent className="space-y-4">
        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-foreground mb-1"
          >
            Message
          </label>
          <textarea_1.Textarea
            id="message"
            placeholder="Type your message in Arabic or English..."
            value={message}
            onChange={e => setMessage(e.target.value)}
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="language"
              className="block text-sm font-medium text-foreground mb-1"
            >
              Language
            </label>
            <select_1.Select value={language} onValueChange={setLanguage}>
              <select_1.SelectTrigger className="w-full">
                <select_1.SelectValue placeholder="Select language" />
              </select_1.SelectTrigger>
              <select_1.SelectContent>
                <select_1.SelectItem value="auto">
                  Auto-detect
                </select_1.SelectItem>
                <select_1.SelectItem value="arabic">
                  Arabic (العربية)
                </select_1.SelectItem>
                <select_1.SelectItem value="english">
                  English
                </select_1.SelectItem>
              </select_1.SelectContent>
            </select_1.Select>
          </div>
          <div>
            <label
              htmlFor="userProfile"
              className="block text-sm font-medium text-foreground mb-1"
            >
              User Profile (JSON)
            </label>
            <input_1.Input
              id="userProfile"
              placeholder='{"id": "user123", "name": "John"}'
              value={userProfile}
              onChange={e => setUserProfile(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="context"
            className="block text-sm font-medium text-foreground mb-1"
          >
            Context (optional)
          </label>
          <textarea_1.Textarea
            id="context"
            placeholder="Additional context for the conversation"
            value={context}
            onChange={e => setContext(e.target.value)}
            rows={2}
          />
        </div>

        <button_1.Button
          onClick={executeAssistant}
          disabled={loading || !message}
          className="w-full"
        >
          {loading ? (
            <>
              <lucide_react_1.Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <lucide_react_1.Play className="mr-2 h-4 w-4" />
              Execute Assistant
            </>
          )}
        </button_1.Button>

        {error && (
          <div className="mt-4 text-red-500 flex items-center gap-2">
            <lucide_react_1.XCircle className="h-5 w-5" />
            Error: {error}
          </div>
        )}

        {output && (
          <div className="mt-4 space-y-2">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <lucide_react_1.CheckCircle className="h-5 w-5 text-green-500" />{' '}
              Response
            </h3>
            <card_1.Card className="bg-muted/20 p-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Language:</span>
                  <span className="text-sm">{output.detected_language}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Type:</span>
                  <span className="text-sm">{output.response_type}</span>
                </div>
                <div className="mt-3">
                  <span className="text-sm font-medium">Response:</span>
                  <div className="mt-1 p-3 bg-background rounded-lg whitespace-pre-wrap text-sm">
                    {output.response}
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-sm font-medium">Capabilities:</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {output.capabilities?.map((capability, index) => (
                      <span
                        key={index}
                        className="text-xs bg-primary/20 text-primary px-2 py-1 rounded"
                      >
                        {capability}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </card_1.Card>
          </div>
        )}
      </card_1.CardContent>
    </card_1.Card>
  );
}
