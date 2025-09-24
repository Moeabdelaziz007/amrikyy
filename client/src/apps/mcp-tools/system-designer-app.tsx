import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Architecture, Layers, Database, Globe, Code } from 'lucide-react';
import { apiClient } from '@/lib/api-client';

interface SystemDesignerAppProps {
  onExecute?: (data: any) => void;
}

export default function SystemDesignerApp({ onExecute }: SystemDesignerAppProps) {
  const [requirements, setRequirements] = useState('');
  const [complexity, setComplexity] = useState('medium');
  const [frontend, setFrontend] = useState('react');
  const [backend, setBackend] = useState('nodejs');
  const [database, setDatabase] = useState('postgresql');
  const [context, setContext] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const executeDesigner = async () => {
    setLoading(true);
    setError(null);
    setOutput(null);
    
    // Validate inputs
    if (!requirements.trim()) {
      setError('Requirements are required');
      setLoading(false);
      return;
    }
    
    try {
      // Try to use real API first, fallback to mock
      try {
        const apiResult = await apiClient.executeMCPTool('system-designer', {
          requirements: requirements.trim(),
          complexity,
          technology_stack: {
            frontend,
            backend,
            database,
          },
          context: context.trim() || undefined,
        });
        
        setOutput(apiResult);
        onExecute?.(apiResult);
      } catch (apiError) {
        console.warn('API call failed, using mock design:', apiError);
        
        // Fallback to mock design
        const mockResult = {
          success: true,
          design: `Mock system design for ${complexity} complexity:\n\nRequirements: ${requirements}\n\nTech Stack: ${frontend} + ${backend} + ${database}\n\nArchitecture: Microservices with API Gateway\nDatabase: ${database} with caching layer\nFrontend: ${frontend} with responsive design\nBackend: ${backend} with RESTful APIs`,
          timestamp: new Date().toISOString(),
        };
        
        setOutput(mockResult);
        onExecute?.(mockResult);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'System design failed');
    } finally {
      setLoading(false);
    }
  };

  const complexityOptions = [
    { value: 'simple', label: 'Simple' },
    { value: 'medium', label: 'Medium' },
    { value: 'complex', label: 'Complex' },
    { value: 'enterprise', label: 'Enterprise' },
  ];

  const techStacks = {
    frontend: [
      { value: 'react', label: 'React' },
      { value: 'vue', label: 'Vue.js' },
      { value: 'angular', label: 'Angular' },
      { value: 'svelte', label: 'Svelte' },
    ],
    backend: [
      { value: 'nodejs', label: 'Node.js' },
      { value: 'python', label: 'Python' },
      { value: 'java', label: 'Java' },
      { value: 'go', label: 'Go' },
    ],
    database: [
      { value: 'postgresql', label: 'PostgreSQL' },
      { value: 'mysql', label: 'MySQL' },
      { value: 'mongodb', label: 'MongoDB' },
      { value: 'redis', label: 'Redis' },
    ],
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Architecture className="h-5 w-5" />
            System Designer
          </CardTitle>
          <CardDescription>
            Generate system architecture designs based on your requirements
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Requirements</label>
            <Textarea
              placeholder="Describe your system requirements..."
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              rows={4}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Complexity</label>
              <Select value={complexity} onValueChange={setComplexity}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {complexityOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Frontend</label>
              <Select value={frontend} onValueChange={setFrontend}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {techStacks.frontend.map((tech) => (
                    <SelectItem key={tech.value} value={tech.value}>
                      {tech.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Backend</label>
              <Select value={backend} onValueChange={setBackend}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {techStacks.backend.map((tech) => (
                    <SelectItem key={tech.value} value={tech.value}>
                      {tech.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Database</label>
              <Select value={database} onValueChange={setDatabase}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {techStacks.database.map((tech) => (
                    <SelectItem key={tech.value} value={tech.value}>
                      {tech.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Additional Context</label>
            <Textarea
              placeholder="Any additional context or constraints..."
              value={context}
              onChange={(e) => setContext(e.target.value)}
              rows={2}
            />
          </div>
          
          <Button 
            onClick={executeDesigner} 
            disabled={isLoading || !requirements.trim()}
            className="w-full"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Designing...
              </>
            ) : (
              <>
                <Layers className="w-4 h-4 mr-2" />
                Generate Design
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
              <Code className="h-5 w-5" />
              System Design
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {complexity}
                </Badge>
                <Badge variant="outline">
                  {frontend} + {backend} + {database}
                </Badge>
              </div>
              
              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap text-sm">
                  {output.design || output.architecture || JSON.stringify(output, null, 2)}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}