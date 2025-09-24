import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Languages, MessageSquare, User, Settings } from 'lucide-react';
import { apiClient } from '@/lib/api-client';

interface MultilingualAssistantAppProps {
  onExecute?: (data: any) => void;
}

export default function MultilingualAssistantApp({ onExecute }: MultilingualAssistantAppProps) {
  const [message, setMessage] = useState('');
  const [language, setLanguage] = useState('en');
  const [userProfile, setUserProfile] = useState('');
  const [context, setContext] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const executeAssistant = async () => {
    setLoading(true);
    setError(null);
    setOutput(null);
    
    // Validate inputs
    if (!message.trim()) {
      setError('Message is required');
      setLoading(false);
      return;
    }
    
    try {
      // Try to use real API first, fallback to mock
      try {
        const apiResult = await apiClient.executeMCPTool('multilingual-assistant', {
          message: message.trim(),
          language,
          user_profile: userProfile ? JSON.parse(userProfile) : undefined,
          context: context.trim() || undefined,
        });
        
        setOutput(apiResult);
        onExecute?.(apiResult);
      } catch (apiError) {
        console.warn('API call failed, using mock response:', apiError);
        
        // Fallback to mock response
        const mockResult = {
          success: true,
          response: `Mock response in ${language}: ${message}`,
          language,
          timestamp: new Date().toISOString(),
        };
        
        setOutput(mockResult);
        onExecute?.(mockResult);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Assistant execution failed');
    } finally {
      setLoading(false);
    }
  };

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'ar', name: 'العربية' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'zh', name: '中文' },
    { code: 'ja', name: '日本語' },
    { code: 'ko', name: '한국어' },
    { code: 'ru', name: 'Русский' },
    { code: 'pt', name: 'Português' },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Languages className="h-5 w-5" />
            Multilingual Assistant
          </CardTitle>
          <CardDescription>
            Get AI assistance in multiple languages with context awareness
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Message</label>
            <Textarea
              placeholder="Enter your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Language</label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">User Profile (JSON)</label>
            <Textarea
              placeholder='{"name": "John", "preferences": {...}}'
              value={userProfile}
              onChange={(e) => setUserProfile(e.target.value)}
              rows={2}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Context</label>
            <Textarea
              placeholder="Additional context for the assistant..."
              value={context}
              onChange={(e) => setContext(e.target.value)}
              rows={2}
            />
          </div>
          
          <Button 
            onClick={executeAssistant} 
            disabled={isLoading || !message.trim()}
            className="w-full"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Processing...
              </>
            ) : (
              <>
                <MessageSquare className="w-4 h-4 mr-2" />
                Execute Assistant
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {output && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Assistant Response
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {output.language || language}
                </Badge>
                <Badge variant="outline">
                  {output.timestamp ? new Date(output.timestamp).toLocaleString() : 'Now'}
                </Badge>
              </div>
              
              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap text-sm">
                  {output.response || output.message || JSON.stringify(output, null, 2)}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}