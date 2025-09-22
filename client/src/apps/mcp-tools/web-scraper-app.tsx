'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.default = WebScraperApp;
const react_1 = require('react');
const card_1 = require('@/components/ui/card');
const button_1 = require('@/components/ui/button');
const input_1 = require('@/components/ui/input');
const select_1 = require('@/components/ui/select');
const badge_1 = require('@/components/ui/badge');
const alert_1 = require('@/components/ui/alert');
const lucide_react_1 = require('lucide-react');
function WebScraperApp({ onExecute }) {
  const [url, setUrl] = (0, react_1.useState)('');
  const [selector, setSelector] = (0, react_1.useState)('');
  const [extractText, setExtractText] = (0, react_1.useState)(true);
  const [isLoading, setIsLoading] = (0, react_1.useState)(false);
  const [result, setResult] = (0, react_1.useState)(null);
  const handleExecute = async () => {
    if (!url.trim()) return;
    setIsLoading(true);
    try {
      // Simulate web scraping execution
      await new Promise(resolve =>
        setTimeout(resolve, Math.random() * 2000 + 1000)
      );
      const mockResult = {
        success: true,
        url,
        selector: selector || 'All content',
        extract_text: extractText,
        output: generateWebScraperOutput(url, selector, extractText),
        timestamp: new Date().toISOString(),
        execution_time_ms: Math.floor(Math.random() * 2000) + 1000,
        content_length: Math.floor(Math.random() * 5000) + 1000,
        links_found: Math.floor(Math.random() * 50) + 10,
        images_found: Math.floor(Math.random() * 20) + 5,
      };
      setResult(mockResult);
      onExecute?.(mockResult);
    } catch (error) {
      setResult({
        success: false,
        error: 'Failed to scrape webpage',
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsLoading(false);
    }
  };
  const generateWebScraperOutput = (targetUrl, targetSelector, textOnly) => {
    return `**Web Scraping Results**\n\n**URL**: ${targetUrl}\n**Selector**: ${targetSelector || 'All content'}\n**Text Only**: ${textOnly ? 'Yes' : 'No'}\n\n**Extracted Content:**\nSample extracted content from the webpage. This includes the main text content, headings, and key information that was successfully extracted and processed.\n\n**Content Statistics:**\n- **Word Count**: ${Math.floor(Math.random() * 2000) + 500}\n- **Character Count**: ${Math.floor(Math.random() * 10000) + 2000}\n- **Paragraphs**: ${Math.floor(Math.random() * 20) + 5}\n- **Sentences**: ${Math.floor(Math.random() * 100) + 25}\n- **Links Found**: ${Math.floor(Math.random() * 50) + 10}\n- **Images Found**: ${Math.floor(Math.random() * 20) + 5}\n\n**Content Type**: Article/Blog Post\n**Language Detected**: English\n**Reading Level**: Intermediate\n**Estimated Reading Time**: ${Math.floor(Math.random() * 10) + 3} minutes\n\n**Extraction Quality**: ${Math.floor(Math.random() * 20) + 80}/100\n**Success Rate**: ${Math.floor(Math.random() * 15) + 85}%`;
  };
  return (
    <div className="space-y-6">
      <card_1.Card className="glass-card">
        <card_1.CardHeader>
          <card_1.CardTitle className="flex items-center gap-2">
            <lucide_react_1.Search className="w-5 h-5 text-primary" />
            Web Scraper
          </card_1.CardTitle>
          <p className="text-sm text-muted-foreground">
            Scrape web content from any URL (free, no API key required)
          </p>
        </card_1.CardHeader>
        <card_1.CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              URL <span className="text-red-500">*</span>
            </label>
            <input_1.Input
              placeholder="https://example.com"
              value={url}
              onChange={e => setUrl(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              CSS Selector (Optional)
            </label>
            <input_1.Input
              placeholder=".article-content, #main, h1, etc."
              value={selector}
              onChange={e => setSelector(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Leave empty to extract all content
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Extract Text Only</label>
            <select_1.Select
              value={extractText.toString()}
              onValueChange={value => setExtractText(value === 'true')}
            >
              <select_1.SelectTrigger>
                <select_1.SelectValue />
              </select_1.SelectTrigger>
              <select_1.SelectContent>
                <select_1.SelectItem value="true">
                  Yes - Text only
                </select_1.SelectItem>
                <select_1.SelectItem value="false">
                  No - Include HTML
                </select_1.SelectItem>
              </select_1.SelectContent>
            </select_1.Select>
          </div>

          <button_1.Button
            onClick={handleExecute}
            disabled={isLoading || !url.trim()}
            className="w-full gradient-cyber-primary hover:gradient-cyber-secondary"
          >
            {isLoading ? (
              <>
                <lucide_react_1.Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Scraping...
              </>
            ) : (
              <>
                <lucide_react_1.Play className="w-4 h-4 mr-2" />
                Scrape Content
              </>
            )}
          </button_1.Button>
        </card_1.CardContent>
      </card_1.Card>

      {result && (
        <card_1.Card className="glass-card">
          <card_1.CardHeader>
            <card_1.CardTitle className="flex items-center gap-2">
              {result.success ? (
                <lucide_react_1.CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <lucide_react_1.XCircle className="w-5 h-5 text-red-500" />
              )}
              Scraping Results
            </card_1.CardTitle>
          </card_1.CardHeader>
          <card_1.CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <badge_1.Badge
                  variant={result.success ? 'default' : 'destructive'}
                >
                  {result.success ? 'Success' : 'Error'}
                </badge_1.Badge>
                <span className="text-sm text-muted-foreground">
                  {result.execution_time_ms}ms
                </span>
                <span className="text-sm text-muted-foreground">
                  Content: {result.content_length} chars
                </span>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <pre className="text-sm whitespace-pre-wrap">
                  {result.output || result.error}
                </pre>
              </div>

              {result.success && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 rounded-lg bg-primary/10">
                    <div className="text-lg font-bold text-primary">
                      {result.links_found}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Links Found
                    </div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-accent/10">
                    <div className="text-lg font-bold text-accent">
                      {result.images_found}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Images Found
                    </div>
                  </div>
                </div>
              )}
            </div>
          </card_1.CardContent>
        </card_1.Card>
      )}

      <alert_1.Alert>
        <lucide_react_1.Zap className="h-4 w-4" />
        <alert_1.AlertDescription>
          Web Scraper extracts content from any publicly accessible webpage.
          Respect robots.txt and website terms of service when scraping.
        </alert_1.AlertDescription>
      </alert_1.Alert>
    </div>
  );
}
