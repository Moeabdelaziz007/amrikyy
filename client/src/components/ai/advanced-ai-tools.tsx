'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.default = AdvancedAITools;
const react_1 = require('react');
const react_query_1 = require('@tanstack/react-query');
const use_auth_1 = require('@/hooks/use-auth');
const card_1 = require('@/components/ui/card');
const button_1 = require('@/components/ui/button');
const input_1 = require('@/components/ui/input');
const textarea_1 = require('@/components/ui/textarea');
const select_1 = require('@/components/ui/select');
const badge_1 = require('@/components/ui/badge');
const progress_1 = require('@/components/ui/progress');
const alert_1 = require('@/components/ui/alert');
const separator_1 = require('@/components/ui/separator');
const tabs_1 = require('@/components/ui/tabs');
const label_1 = require('@/components/ui/label');
function AdvancedAITools() {
  const { user } = (0, use_auth_1.useAuth)();
  const queryClient = (0, react_query_1.useQueryClient)();
  const [selectedTool, setSelectedTool] = (0, react_1.useState)(null);
  const [toolParams, setToolParams] = (0, react_1.useState)({});
  const [activeTab, setActiveTab] = (0, react_1.useState)('tools');
  // Fetch AI tools
  const { data: tools, isLoading: toolsLoading } = (0, react_query_1.useQuery)({
    queryKey: ['/api/ai-tools'],
    refetchInterval: 30000,
  });
  // Fetch tool categories
  const { data: categories } = (0, react_query_1.useQuery)({
    queryKey: ['/api/ai-tools/categories'],
    refetchInterval: 30000,
  });
  // Fetch tool analytics
  const { data: analytics } = (0, react_query_1.useQuery)({
    queryKey: ['/api/ai-tools/analytics'],
    refetchInterval: 30000,
  });
  // Execute tool mutation
  const executeToolMutation = (0, react_query_1.useMutation)({
    mutationFn: async ({ toolId, params }) => {
      const response = await fetch(`/api/ai-tools/${toolId}/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          params,
          context: {
            userId: user?.uid,
            sessionId: `session_${Date.now()}`,
            metadata: { source: 'ui' },
          },
        }),
      });
      if (!response.ok) throw new Error('Failed to execute tool');
      return response.json();
    },
  });
  // Discover tools mutation
  const discoverToolsMutation = (0, react_query_1.useMutation)({
    mutationFn: async ({ query, category }) => {
      const response = await fetch('/api/ai-tools/discover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, category }),
      });
      if (!response.ok) throw new Error('Failed to discover tools');
      return response.json();
    },
  });
  const handleToolSelect = tool => {
    setSelectedTool(tool);
    setToolParams({});
  };
  const handleParamChange = (paramName, value) => {
    setToolParams(prev => ({
      ...prev,
      [paramName]: value,
    }));
  };
  const handleExecuteTool = () => {
    if (!selectedTool) return;
    executeToolMutation.mutate({
      toolId: selectedTool.id,
      params: toolParams,
    });
  };
  const getToolIcon = category => {
    const icons = {
      content: 'fas fa-edit',
      analysis: 'fas fa-chart-line',
      data_extraction: 'fas fa-download',
      media: 'fas fa-image',
      integration: 'fas fa-plug',
      automation: 'fas fa-cogs',
      monitoring: 'fas fa-eye',
      nlp: 'fas fa-language',
    };
    return icons[category] || 'fas fa-tool';
  };
  const getCategoryColor = category => {
    const colors = {
      content: 'bg-blue-500',
      analysis: 'bg-green-500',
      data_extraction: 'bg-purple-500',
      media: 'bg-pink-500',
      integration: 'bg-orange-500',
      automation: 'bg-red-500',
      monitoring: 'bg-yellow-500',
      nlp: 'bg-indigo-500',
    };
    return colors[category] || 'bg-gray-500';
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Advanced AI Tools
          </h1>
          <p className="text-muted-foreground">
            Powerful AI tools with MCP integration
          </p>
        </div>
        <badge_1.Badge variant="outline" className="text-sm">
          <i className="fas fa-brain mr-2"></i>
          MCP Enabled
        </badge_1.Badge>
      </div>

      {/* Analytics Overview */}
      {analytics && (
        <card_1.Card>
          <card_1.CardHeader>
            <card_1.CardTitle className="flex items-center gap-2">
              <i className="fas fa-chart-bar text-primary"></i>
              Tools Analytics
            </card_1.CardTitle>
          </card_1.CardHeader>
          <card_1.CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {analytics.totalTools || 0}
                </div>
                <div className="text-sm text-muted-foreground">Total Tools</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">
                  {analytics.categories?.length || 0}
                </div>
                <div className="text-sm text-muted-foreground">Categories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">
                  {analytics.totalExecutions || 0}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Executions
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">
                  {Math.round(
                    (analytics.toolStats?.reduce(
                      (sum, tool) => sum + tool.usage.successRate,
                      0
                    ) /
                      (analytics.toolStats?.length || 1)) *
                      100
                  )}
                  %
                </div>
                <div className="text-sm text-muted-foreground">
                  Avg Success Rate
                </div>
              </div>
            </div>
          </card_1.CardContent>
        </card_1.Card>
      )}

      {/* Main Interface */}
      <tabs_1.Tabs value={activeTab} onValueChange={setActiveTab}>
        <tabs_1.TabsList className="grid w-full grid-cols-3">
          <tabs_1.TabsTrigger value="tools">AI Tools</tabs_1.TabsTrigger>
          <tabs_1.TabsTrigger value="discover">Discover</tabs_1.TabsTrigger>
          <tabs_1.TabsTrigger value="analytics">Analytics</tabs_1.TabsTrigger>
        </tabs_1.TabsList>

        {/* AI Tools Tab */}
        <tabs_1.TabsContent value="tools">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tools List */}
            <card_1.Card>
              <card_1.CardHeader>
                <card_1.CardTitle>Available Tools</card_1.CardTitle>
              </card_1.CardHeader>
              <card_1.CardContent className="space-y-4">
                {toolsLoading ? (
                  <div className="animate-pulse space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-16 bg-muted rounded"></div>
                    ))}
                  </div>
                ) : tools ? (
                  tools.map(tool => (
                    <div
                      key={tool.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${selectedTool?.id === tool.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
                      onClick={() => handleToolSelect(tool)}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-10 h-10 rounded-lg ${getCategoryColor(tool.category)} flex items-center justify-center`}
                        >
                          <i
                            className={`${getToolIcon(tool.category)} text-white`}
                          ></i>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-sm">
                              {tool.name}
                            </h3>
                            <badge_1.Badge
                              variant="secondary"
                              className="text-xs"
                            >
                              v{tool.version}
                            </badge_1.Badge>
                            {tool.isActive ? (
                              <badge_1.Badge
                                variant="default"
                                className="text-xs"
                              >
                                Active
                              </badge_1.Badge>
                            ) : (
                              <badge_1.Badge
                                variant="outline"
                                className="text-xs"
                              >
                                Inactive
                              </badge_1.Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {tool.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>{tool.usage.totalCalls} calls</span>
                            <span>
                              {Math.round(tool.usage.successRate * 100)}%
                              success
                            </span>
                            <span>{tool.usage.averageExecutionTime}ms avg</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <alert_1.Alert>
                    <alert_1.AlertDescription>
                      No AI tools available
                    </alert_1.AlertDescription>
                  </alert_1.Alert>
                )}
              </card_1.CardContent>
            </card_1.Card>

            {/* Tool Execution */}
            <card_1.Card>
              <card_1.CardHeader>
                <card_1.CardTitle>
                  {selectedTool
                    ? `Execute: ${selectedTool.name}`
                    : 'Select a Tool'}
                </card_1.CardTitle>
              </card_1.CardHeader>
              <card_1.CardContent className="space-y-4">
                {selectedTool ? (
                  <>
                    <div className="space-y-4">
                      {selectedTool.parameters.map(param => (
                        <div key={param.name}>
                          <label_1.Label
                            htmlFor={param.name}
                            className="text-sm font-medium"
                          >
                            {param.name}
                            {param.required && (
                              <span className="text-red-500 ml-1">*</span>
                            )}
                          </label_1.Label>
                          <div className="mt-1">
                            {param.type === 'string' &&
                            param.name.includes('text') ? (
                              <textarea_1.Textarea
                                id={param.name}
                                placeholder={param.description}
                                value={toolParams[param.name] || ''}
                                onChange={e =>
                                  handleParamChange(param.name, e.target.value)
                                }
                                rows={3}
                              />
                            ) : param.type === 'boolean' ? (
                              <select_1.Select
                                value={toolParams[param.name]?.toString() || ''}
                                onValueChange={value =>
                                  handleParamChange(
                                    param.name,
                                    value === 'true'
                                  )
                                }
                              >
                                <select_1.SelectTrigger>
                                  <select_1.SelectValue
                                    placeholder={param.description}
                                  />
                                </select_1.SelectTrigger>
                                <select_1.SelectContent>
                                  <select_1.SelectItem value="true">
                                    True
                                  </select_1.SelectItem>
                                  <select_1.SelectItem value="false">
                                    False
                                  </select_1.SelectItem>
                                </select_1.SelectContent>
                              </select_1.Select>
                            ) : (
                              <input_1.Input
                                id={param.name}
                                type={
                                  param.type === 'number' ? 'number' : 'text'
                                }
                                placeholder={param.description}
                                value={toolParams[param.name] || ''}
                                onChange={e =>
                                  handleParamChange(
                                    param.name,
                                    param.type === 'number'
                                      ? Number(e.target.value)
                                      : e.target.value
                                  )
                                }
                              />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {param.description}
                          </p>
                        </div>
                      ))}
                    </div>

                    <button_1.Button
                      onClick={handleExecuteTool}
                      disabled={executeToolMutation.isPending}
                      className="w-full"
                    >
                      {executeToolMutation.isPending
                        ? 'Executing...'
                        : 'Execute Tool'}
                    </button_1.Button>

                    {executeToolMutation.isError && (
                      <alert_1.Alert variant="destructive">
                        <alert_1.AlertDescription>
                          {executeToolMutation.error?.message}
                        </alert_1.AlertDescription>
                      </alert_1.Alert>
                    )}

                    {executeToolMutation.isSuccess &&
                      executeToolMutation.data && (
                        <div className="space-y-4">
                          <separator_1.Separator />
                          <div>
                            <h4 className="font-medium mb-2">
                              Execution Result:
                            </h4>
                            <div className="p-4 bg-muted rounded-lg">
                              <pre className="whitespace-pre-wrap text-sm">
                                {JSON.stringify(
                                  executeToolMutation.data.data,
                                  null,
                                  2
                                )}
                              </pre>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Success:</span>{' '}
                              {executeToolMutation.data.success ? 'Yes' : 'No'}
                            </div>
                            <div>
                              <span className="font-medium">
                                Execution Time:
                              </span>{' '}
                              {executeToolMutation.data.executionTime}ms
                            </div>
                            <div>
                              <span className="font-medium">Confidence:</span>{' '}
                              {Math.round(
                                executeToolMutation.data.confidence * 100
                              )}
                              %
                            </div>
                            <div>
                              <span className="font-medium">Tool Used:</span>{' '}
                              {executeToolMutation.data.toolUsed}
                            </div>
                          </div>

                          {executeToolMutation.data.suggestions &&
                            executeToolMutation.data.suggestions.length > 0 && (
                              <div>
                                <span className="font-medium">
                                  Suggestions:
                                </span>
                                <ul className="text-sm text-muted-foreground mt-1">
                                  {executeToolMutation.data.suggestions.map(
                                    (suggestion, index) => (
                                      <li key={index}>• {suggestion}</li>
                                    )
                                  )}
                                </ul>
                              </div>
                            )}
                        </div>
                      )}
                  </>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <i className="fas fa-tools text-4xl mb-4"></i>
                    <p>Select a tool from the list to execute it</p>
                  </div>
                )}
              </card_1.CardContent>
            </card_1.Card>
          </div>
        </tabs_1.TabsContent>

        {/* Discover Tab */}
        <tabs_1.TabsContent value="discover">
          <card_1.Card>
            <card_1.CardHeader>
              <card_1.CardTitle>Discover AI Tools</card_1.CardTitle>
            </card_1.CardHeader>
            <card_1.CardContent className="space-y-4">
              <div className="flex gap-4">
                <input_1.Input
                  placeholder="Search for tools..."
                  value={discoverToolsMutation.variables?.query || ''}
                  onChange={e => {
                    // This would be handled by a search input component
                  }}
                />
                <select_1.Select>
                  <select_1.SelectTrigger className="w-48">
                    <select_1.SelectValue placeholder="Category" />
                  </select_1.SelectTrigger>
                  <select_1.SelectContent>
                    {categories?.map(category => (
                      <select_1.SelectItem key={category} value={category}>
                        {category}
                      </select_1.SelectItem>
                    ))}
                  </select_1.SelectContent>
                </select_1.Select>
                <button_1.Button
                  onClick={() => {
                    const query = 'content generation';
                    const category = 'content';
                    discoverToolsMutation.mutate({ query, category });
                  }}
                >
                  Search
                </button_1.Button>
              </div>

              {discoverToolsMutation.isSuccess &&
                discoverToolsMutation.data && (
                  <div className="space-y-4">
                    <h4 className="font-medium">Search Results:</h4>
                    {discoverToolsMutation.data.map(tool => (
                      <div key={tool.id} className="p-4 border rounded-lg">
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-8 h-8 rounded ${getCategoryColor(tool.category)} flex items-center justify-center`}
                          >
                            <i
                              className={`${getToolIcon(tool.category)} text-white text-sm`}
                            ></i>
                          </div>
                          <div className="flex-1">
                            <h5 className="font-semibold">{tool.name}</h5>
                            <p className="text-sm text-muted-foreground">
                              {tool.description}
                            </p>
                            <div className="flex gap-2 mt-2">
                              {tool.capabilities.map(capability => (
                                <badge_1.Badge
                                  key={capability}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {capability}
                                </badge_1.Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
            </card_1.CardContent>
          </card_1.Card>
        </tabs_1.TabsContent>

        {/* Analytics Tab */}
        <tabs_1.TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <card_1.Card>
              <card_1.CardHeader>
                <card_1.CardTitle>Tool Performance</card_1.CardTitle>
              </card_1.CardHeader>
              <card_1.CardContent>
                {analytics?.toolStats ? (
                  <div className="space-y-4">
                    {analytics.toolStats.map(tool => (
                      <div key={tool.id} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{tool.name}</span>
                          <span>
                            {Math.round(tool.usage.successRate * 100)}%
                          </span>
                        </div>
                        <progress_1.Progress
                          value={tool.usage.successRate * 100}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <i className="fas fa-chart-line text-4xl mb-4"></i>
                    <p>No analytics data available</p>
                  </div>
                )}
              </card_1.CardContent>
            </card_1.Card>

            <card_1.Card>
              <card_1.CardHeader>
                <card_1.CardTitle>Category Distribution</card_1.CardTitle>
              </card_1.CardHeader>
              <card_1.CardContent>
                {categories ? (
                  <div className="space-y-4">
                    {categories.map(category => {
                      const categoryTools =
                        tools?.filter(tool => tool.category === category) || [];
                      const percentage = tools
                        ? (categoryTools.length / tools.length) * 100
                        : 0;
                      return (
                        <div key={category} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="capitalize">{category}</span>
                            <span>{categoryTools.length} tools</span>
                          </div>
                          <progress_1.Progress value={percentage} />
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <i className="fas fa-chart-pie text-4xl mb-4"></i>
                    <p>No category data available</p>
                  </div>
                )}
              </card_1.CardContent>
            </card_1.Card>
          </div>
        </tabs_1.TabsContent>
      </tabs_1.Tabs>
    </div>
  );
}
