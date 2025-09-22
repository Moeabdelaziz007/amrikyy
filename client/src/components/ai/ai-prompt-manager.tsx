'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.default = AIPromptManager;
const react_1 = require('react');
const card_1 = require('@/components/ui/card');
const button_1 = require('@/components/ui/button');
const badge_1 = require('@/components/ui/badge');
const input_1 = require('@/components/ui/input');
const label_1 = require('@/components/ui/label');
const textarea_1 = require('@/components/ui/textarea');
const select_1 = require('@/components/ui/select');
const tabs_1 = require('@/components/ui/tabs');
const dialog_1 = require('@/components/ui/dialog');
const scroll_area_1 = require('@/components/ui/scroll-area');
const lucide_react_1 = require('lucide-react');
function AIPromptManager() {
  const [prompts, setPrompts] = (0, react_1.useState)([]);
  const [templates, setTemplates] = (0, react_1.useState)([]);
  const [searchQuery, setSearchQuery] = (0, react_1.useState)('');
  const [selectedCategory, setSelectedCategory] = (0, react_1.useState)('all');
  const [selectedPrompt, setSelectedPrompt] = (0, react_1.useState)(null);
  const [promptVariables, setPromptVariables] = (0, react_1.useState)({});
  const [executionResult, setExecutionResult] = (0, react_1.useState)('');
  const [isExecuting, setIsExecuting] = (0, react_1.useState)(false);
  const [showExecutionDialog, setShowExecutionDialog] = (0, react_1.useState)(
    false
  );
  const [activeTab, setActiveTab] = (0, react_1.useState)('prompts');
  // Mock data - in real implementation, this would come from API
  const mockPrompts = [
    {
      id: 'devops_engineer',
      title: 'Act as DevOps Engineer',
      description:
        'Expert DevOps engineer providing scalable, efficient, and automated solutions',
      category: 'technical',
      tags: ['devops', 'automation', 'infrastructure', 'ci-cd'],
      prompt:
        'You are a ${title} DevOps engineer working at ${companyType}. Your role is to provide scalable, efficient, and automated solutions for software deployment, infrastructure management, and CI/CD pipelines. First problem is: ${problem}, suggest the best DevOps practices.',
      variables: [
        {
          name: 'title',
          displayName: 'Seniority Level',
          type: 'select',
          required: true,
          options: ['Junior', 'Mid-Level', 'Senior', 'Lead', 'Principal'],
          defaultValue: 'Senior',
        },
        {
          name: 'companyType',
          displayName: 'Company Type',
          type: 'select',
          required: true,
          options: ['Startup', 'Mid-size Company', 'Big Company', 'Enterprise'],
          defaultValue: 'Big Company',
        },
        {
          name: 'problem',
          displayName: 'Problem Description',
          type: 'textarea',
          required: true,
          placeholder: 'Describe the DevOps challenge...',
          defaultValue: 'Creating an MVP quickly for an e-commerce web app',
        },
      ],
      usage: {
        complexity: 'advanced',
        estimatedTime: 15,
        successRate: 0.92,
        popularity: 85,
      },
      performance: {
        totalUses: 245,
        averageRating: 4.7,
      },
    },
    {
      id: 'content_generator',
      title: 'Act as Content Generator',
      description:
        'Generate engaging content for various platforms and audiences',
      category: 'creative',
      tags: ['content', 'writing', 'creative', 'social-media', 'marketing'],
      prompt:
        'Act as a professional content creator and social media expert. Create engaging, high-quality content for ${platform} that will ${goal}. The content should be ${tone}, target ${audience}, and include ${elements}.',
      variables: [
        {
          name: 'platform',
          displayName: 'Platform',
          type: 'multiselect',
          required: true,
          options: [
            'Instagram',
            'Twitter',
            'LinkedIn',
            'Facebook',
            'TikTok',
            'YouTube',
          ],
          defaultValue: ['Instagram', 'Twitter'],
        },
        {
          name: 'goal',
          displayName: 'Content Goal',
          type: 'select',
          required: true,
          options: [
            'increase engagement',
            'drive traffic',
            'build brand awareness',
            'generate leads',
            'educate audience',
          ],
          defaultValue: 'increase engagement',
        },
        {
          name: 'tone',
          displayName: 'Tone',
          type: 'select',
          required: true,
          options: [
            'professional',
            'casual',
            'friendly',
            'authoritative',
            'humorous',
            'inspirational',
          ],
          defaultValue: 'professional',
        },
        {
          name: 'audience',
          displayName: 'Target Audience',
          type: 'string',
          required: true,
          placeholder: 'Describe your target audience...',
          defaultValue: 'young professionals aged 25-35',
        },
      ],
      usage: {
        complexity: 'beginner',
        estimatedTime: 10,
        successRate: 0.95,
        popularity: 92,
      },
      performance: {
        totalUses: 892,
        averageRating: 4.8,
      },
    },
    {
      id: 'seo_expert',
      title: 'Act as SEO Expert',
      description:
        'Expert SEO specialist for content optimization and strategy',
      category: 'business',
      tags: ['seo', 'marketing', 'content', 'optimization', 'strategy'],
      prompt:
        'Create an SEO-optimized content strategy for the keyword "${keyword}". Include keyword research, content outline, and optimization recommendations.',
      variables: [
        {
          name: 'keyword',
          displayName: 'Target Keyword',
          type: 'string',
          required: true,
          placeholder: 'Enter your target keyword...',
          defaultValue: 'AI automation tools',
        },
      ],
      usage: {
        complexity: 'intermediate',
        estimatedTime: 25,
        successRate: 0.9,
        popularity: 78,
      },
      performance: {
        totalUses: 456,
        averageRating: 4.6,
      },
    },
  ];
  const mockTemplates = [
    {
      id: 'content_creation_workflow',
      name: 'Content Creation Workflow',
      description: 'Complete workflow for creating and optimizing content',
      category: 'creative',
      prompts: ['seo_expert', 'content_generator'],
    },
    {
      id: 'technical_development_workflow',
      name: 'Technical Development Workflow',
      description: 'Workflow for technical development tasks',
      category: 'technical',
      prompts: ['devops_engineer'],
    },
  ];
  (0, react_1.useEffect)(() => {
    setPrompts(mockPrompts);
    setTemplates(mockTemplates);
  }, []);
  const categories = [
    'all',
    'technical',
    'creative',
    'business',
    'productivity',
    'health',
    'development',
  ];
  const filteredPrompts = prompts.filter(prompt => {
    const matchesSearch =
      prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.tags.some(tag =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesCategory =
      selectedCategory === 'all' || prompt.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  const handlePromptSelect = (0, react_1.useCallback)(prompt => {
    setSelectedPrompt(prompt);
    // Initialize variables with default values
    const initialVariables = {};
    prompt.variables?.forEach(variable => {
      initialVariables[variable.name] = variable.defaultValue || '';
    });
    setPromptVariables(initialVariables);
    setExecutionResult('');
  }, []);
  const handleVariableChange = (0, react_1.useCallback)(
    (variableName, value) => {
      setPromptVariables(prev => ({
        ...prev,
        [variableName]: value,
      }));
    },
    []
  );
  const executePrompt = (0, react_1.useCallback)(async () => {
    if (!selectedPrompt) return;
    setIsExecuting(true);
    try {
      // In real implementation, this would call the API
      await new Promise(resolve => setTimeout(resolve, 2000));
      const mockResult = `AI-generated response for "${selectedPrompt.title}" with variables: ${JSON.stringify(promptVariables, null, 2)}`;
      setExecutionResult(mockResult);
      setShowExecutionDialog(true);
    } catch (error) {
      setExecutionResult('Error executing prompt: ' + error.message);
      setShowExecutionDialog(true);
    } finally {
      setIsExecuting(false);
    }
  }, [selectedPrompt, promptVariables]);
  const copyToClipboard = (0, react_1.useCallback)(text => {
    navigator.clipboard.writeText(text);
  }, []);
  const getComplexityColor = complexity => {
    switch (complexity) {
      case 'beginner':
        return 'bg-green-500';
      case 'intermediate':
        return 'bg-yellow-500';
      case 'advanced':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };
  const renderVariableInput = variable => {
    switch (variable.type) {
      case 'select':
        return (
          <select_1.Select
            value={promptVariables[variable.name] || variable.defaultValue}
            onValueChange={value => handleVariableChange(variable.name, value)}
          >
            <select_1.SelectTrigger>
              <select_1.SelectValue placeholder={variable.placeholder} />
            </select_1.SelectTrigger>
            <select_1.SelectContent>
              {variable.options?.map(option => (
                <select_1.SelectItem key={option} value={option}>
                  {option}
                </select_1.SelectItem>
              ))}
            </select_1.SelectContent>
          </select_1.Select>
        );
      case 'multiselect':
        return (
          <div className="space-y-2">
            {variable.options?.map(option => (
              <label key={option} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={
                    promptVariables[variable.name]?.includes(option) || false
                  }
                  onChange={e => {
                    const current = promptVariables[variable.name] || [];
                    const updated = e.target.checked
                      ? [...current, option]
                      : current.filter(item => item !== option);
                    handleVariableChange(variable.name, updated);
                  }}
                />
                <span className="text-sm">{option}</span>
              </label>
            ))}
          </div>
        );
      case 'textarea':
        return (
          <textarea_1.Textarea
            placeholder={variable.placeholder}
            value={
              promptVariables[variable.name] || variable.defaultValue || ''
            }
            onChange={e => handleVariableChange(variable.name, e.target.value)}
            rows={4}
          />
        );
      case 'number':
        return (
          <input_1.Input
            type="number"
            placeholder={variable.placeholder}
            value={
              promptVariables[variable.name] || variable.defaultValue || ''
            }
            onChange={e =>
              handleVariableChange(variable.name, Number(e.target.value))
            }
          />
        );
      case 'boolean':
        return (
          <select_1.Select
            value={
              promptVariables[variable.name]?.toString() ||
              variable.defaultValue?.toString() ||
              'false'
            }
            onValueChange={value =>
              handleVariableChange(variable.name, value === 'true')
            }
          >
            <select_1.SelectTrigger>
              <select_1.SelectValue />
            </select_1.SelectTrigger>
            <select_1.SelectContent>
              <select_1.SelectItem value="true">Yes</select_1.SelectItem>
              <select_1.SelectItem value="false">No</select_1.SelectItem>
            </select_1.SelectContent>
          </select_1.Select>
        );
      default:
        return (
          <input_1.Input
            placeholder={variable.placeholder}
            value={
              promptVariables[variable.name] || variable.defaultValue || ''
            }
            onChange={e => handleVariableChange(variable.name, e.target.value)}
          />
        );
    }
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Prompt Manager</h1>
          <p className="text-muted-foreground">
            Curated prompts from the awesome-chatgpt-prompts collection
          </p>
        </div>
        <div className="flex items-center gap-2">
          <badge_1.Badge
            variant="secondary"
            className="flex items-center gap-1"
          >
            <lucide_react_1.Brain className="h-3 w-3" />
            {prompts.length} Prompts
          </badge_1.Badge>
          <badge_1.Badge variant="outline" className="flex items-center gap-1">
            <lucide_react_1.TrendingUp className="h-3 w-3" />
            Live
          </badge_1.Badge>
        </div>
      </div>

      {/* Search and Filters */}
      <card_1.Card>
        <card_1.CardContent className="p-6">
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <div className="relative">
                <lucide_react_1.Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <input_1.Input
                  placeholder="Search prompts..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select_1.Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <select_1.SelectTrigger className="w-48">
                <select_1.SelectValue placeholder="Category" />
              </select_1.SelectTrigger>
              <select_1.SelectContent>
                {categories.map(category => (
                  <select_1.SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </select_1.SelectItem>
                ))}
              </select_1.SelectContent>
            </select_1.Select>
          </div>
        </card_1.CardContent>
      </card_1.Card>

      <tabs_1.Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <tabs_1.TabsList>
          <tabs_1.TabsTrigger value="prompts">Prompts</tabs_1.TabsTrigger>
          <tabs_1.TabsTrigger value="templates">Templates</tabs_1.TabsTrigger>
          <tabs_1.TabsTrigger value="analytics">Analytics</tabs_1.TabsTrigger>
        </tabs_1.TabsList>

        <tabs_1.TabsContent value="prompts" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Prompt List */}
            <div className="lg:col-span-1">
              <card_1.Card>
                <card_1.CardHeader>
                  <card_1.CardTitle className="flex items-center gap-2">
                    <lucide_react_1.Brain className="h-5 w-5" />
                    Available Prompts
                  </card_1.CardTitle>
                </card_1.CardHeader>
                <card_1.CardContent>
                  <scroll_area_1.ScrollArea className="h-96">
                    <div className="space-y-3">
                      {filteredPrompts.map(prompt => (
                        <card_1.Card
                          key={prompt.id}
                          className={`cursor-pointer transition-all hover:shadow-md ${selectedPrompt?.id === prompt.id ? 'ring-2 ring-primary' : ''}`}
                          onClick={() => handlePromptSelect(prompt)}
                        >
                          <card_1.CardContent className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-medium text-sm">
                                {prompt.title}
                              </h3>
                              <badge_1.Badge
                                className={`text-xs ${getComplexityColor(prompt.usage.complexity)}`}
                              >
                                {prompt.usage.complexity}
                              </badge_1.Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mb-3">
                              {prompt.description}
                            </p>
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <div className="flex items-center gap-3">
                                <span className="flex items-center gap-1">
                                  <lucide_react_1.Star className="h-3 w-3" />
                                  {prompt.performance.averageRating.toFixed(1)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <lucide_react_1.Users className="h-3 w-3" />
                                  {prompt.performance.totalUses}
                                </span>
                              </div>
                              <span className="flex items-center gap-1">
                                <lucide_react_1.Clock className="h-3 w-3" />
                                {prompt.usage.estimatedTime}m
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {prompt.tags.slice(0, 3).map(tag => (
                                <badge_1.Badge
                                  key={tag}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {tag}
                                </badge_1.Badge>
                              ))}
                            </div>
                          </card_1.CardContent>
                        </card_1.Card>
                      ))}
                    </div>
                  </scroll_area_1.ScrollArea>
                </card_1.CardContent>
              </card_1.Card>
            </div>

            {/* Prompt Details and Execution */}
            <div className="lg:col-span-2">
              {selectedPrompt ? (
                <div className="space-y-4">
                  {/* Prompt Header */}
                  <card_1.Card>
                    <card_1.CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <card_1.CardTitle className="flex items-center gap-2">
                            <lucide_react_1.Brain className="h-5 w-5" />
                            {selectedPrompt.title}
                          </card_1.CardTitle>
                          <p className="text-muted-foreground mt-1">
                            {selectedPrompt.description}
                          </p>
                        </div>
                        <badge_1.Badge
                          className={`${getComplexityColor(selectedPrompt.usage.complexity)} text-white`}
                        >
                          {selectedPrompt.usage.complexity}
                        </badge_1.Badge>
                      </div>
                    </card_1.CardHeader>
                    <card_1.CardContent>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <lucide_react_1.Star className="h-4 w-4 text-yellow-500" />
                          <span>
                            {selectedPrompt.performance.averageRating.toFixed(
                              1
                            )}{' '}
                            rating
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <lucide_react_1.Users className="h-4 w-4 text-blue-500" />
                          <span>
                            {selectedPrompt.performance.totalUses} uses
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <lucide_react_1.Clock className="h-4 w-4 text-green-500" />
                          <span>{selectedPrompt.usage.estimatedTime} min</span>
                        </div>
                      </div>
                    </card_1.CardContent>
                  </card_1.Card>

                  {/* Variables Configuration */}
                  {selectedPrompt.variables &&
                    selectedPrompt.variables.length > 0 && (
                      <card_1.Card>
                        <card_1.CardHeader>
                          <card_1.CardTitle>
                            Configure Variables
                          </card_1.CardTitle>
                        </card_1.CardHeader>
                        <card_1.CardContent className="space-y-4">
                          {selectedPrompt.variables.map(variable => (
                            <div key={variable.name} className="space-y-2">
                              <label_1.Label
                                htmlFor={variable.name}
                                className="flex items-center gap-2"
                              >
                                {variable.displayName}
                                {variable.required && (
                                  <span className="text-red-500">*</span>
                                )}
                              </label_1.Label>
                              {renderVariableInput(variable)}
                              {variable.description && (
                                <p className="text-xs text-muted-foreground">
                                  {variable.description}
                                </p>
                              )}
                            </div>
                          ))}
                        </card_1.CardContent>
                      </card_1.Card>
                    )}

                  {/* Execute Button */}
                  <card_1.Card>
                    <card_1.CardContent className="p-6">
                      <button_1.Button
                        onClick={executePrompt}
                        disabled={isExecuting}
                        className="w-full"
                        size="lg"
                      >
                        {isExecuting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                            Executing...
                          </>
                        ) : (
                          <>
                            <lucide_react_1.Play className="h-4 w-4 mr-2" />
                            Execute Prompt
                          </>
                        )}
                      </button_1.Button>
                    </card_1.CardContent>
                  </card_1.Card>

                  {/* Execution Result */}
                  {executionResult && (
                    <card_1.Card>
                      <card_1.CardHeader>
                        <div className="flex items-center justify-between">
                          <card_1.CardTitle>Execution Result</card_1.CardTitle>
                          <button_1.Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(executionResult)}
                          >
                            <lucide_react_1.Copy className="h-4 w-4 mr-2" />
                            Copy
                          </button_1.Button>
                        </div>
                      </card_1.CardHeader>
                      <card_1.CardContent>
                        <scroll_area_1.ScrollArea className="h-64">
                          <pre className="text-sm bg-muted p-4 rounded-lg whitespace-pre-wrap">
                            {executionResult}
                          </pre>
                        </scroll_area_1.ScrollArea>
                      </card_1.CardContent>
                    </card_1.Card>
                  )}
                </div>
              ) : (
                <card_1.Card>
                  <card_1.CardContent className="p-12 text-center">
                    <lucide_react_1.Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      Select a Prompt
                    </h3>
                    <p className="text-muted-foreground">
                      Choose a prompt from the list to configure and execute it.
                    </p>
                  </card_1.CardContent>
                </card_1.Card>
              )}
            </div>
          </div>
        </tabs_1.TabsContent>

        <tabs_1.TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {templates.map(template => (
              <card_1.Card key={template.id}>
                <card_1.CardHeader>
                  <card_1.CardTitle className="flex items-center gap-2">
                    <lucide_react_1.Brain className="h-5 w-5" />
                    {template.name}
                  </card_1.CardTitle>
                  <p className="text-muted-foreground">
                    {template.description}
                  </p>
                </card_1.CardHeader>
                <card_1.CardContent>
                  <div className="space-y-3">
                    <div>
                      <label_1.Label className="text-sm font-medium">
                        Category
                      </label_1.Label>
                      <badge_1.Badge variant="outline" className="ml-2">
                        {template.category}
                      </badge_1.Badge>
                    </div>
                    <div>
                      <label_1.Label className="text-sm font-medium">
                        Includes Prompts
                      </label_1.Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {template.prompts.map(promptId => {
                          const prompt = prompts.find(p => p.id === promptId);
                          return prompt ? (
                            <badge_1.Badge
                              key={promptId}
                              variant="secondary"
                              className="text-xs"
                            >
                              {prompt.title}
                            </badge_1.Badge>
                          ) : null;
                        })}
                      </div>
                    </div>
                    <button_1.Button className="w-full">
                      <lucide_react_1.Play className="h-4 w-4 mr-2" />
                      Execute Template
                    </button_1.Button>
                  </div>
                </card_1.CardContent>
              </card_1.Card>
            ))}
          </div>
        </tabs_1.TabsContent>

        <tabs_1.TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <card_1.Card>
              <card_1.CardHeader>
                <card_1.CardTitle className="flex items-center gap-2">
                  <lucide_react_1.TrendingUp className="h-5 w-5" />
                  Total Usage
                </card_1.CardTitle>
              </card_1.CardHeader>
              <card_1.CardContent>
                <div className="text-2xl font-bold">
                  {prompts.reduce((sum, p) => sum + p.performance.totalUses, 0)}
                </div>
                <p className="text-sm text-muted-foreground">
                  Prompt executions
                </p>
              </card_1.CardContent>
            </card_1.Card>

            <card_1.Card>
              <card_1.CardHeader>
                <card_1.CardTitle className="flex items-center gap-2">
                  <lucide_react_1.Star className="h-5 w-5" />
                  Average Rating
                </card_1.CardTitle>
              </card_1.CardHeader>
              <card_1.CardContent>
                <div className="text-2xl font-bold">
                  {(
                    prompts.reduce(
                      (sum, p) => sum + p.performance.averageRating,
                      0
                    ) / prompts.length
                  ).toFixed(1)}
                </div>
                <p className="text-sm text-muted-foreground">Out of 5 stars</p>
              </card_1.CardContent>
            </card_1.Card>

            <card_1.Card>
              <card_1.CardHeader>
                <card_1.CardTitle className="flex items-center gap-2">
                  <lucide_react_1.Brain className="h-5 w-5" />
                  Categories
                </card_1.CardTitle>
              </card_1.CardHeader>
              <card_1.CardContent>
                <div className="text-2xl font-bold">
                  {categories.length - 1}
                </div>
                <p className="text-sm text-muted-foreground">
                  Available categories
                </p>
              </card_1.CardContent>
            </card_1.Card>
          </div>

          <card_1.Card>
            <card_1.CardHeader>
              <card_1.CardTitle>Most Popular Prompts</card_1.CardTitle>
            </card_1.CardHeader>
            <card_1.CardContent>
              <div className="space-y-3">
                {prompts
                  .sort(
                    (a, b) => b.performance.totalUses - a.performance.totalUses
                  )
                  .slice(0, 5)
                  .map((prompt, index) => (
                    <div
                      key={prompt.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-medium">{prompt.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {prompt.category}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          {prompt.performance.totalUses}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          uses
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </card_1.CardContent>
          </card_1.Card>
        </tabs_1.TabsContent>
      </tabs_1.Tabs>

      {/* Execution Result Dialog */}
      <dialog_1.Dialog
        open={showExecutionDialog}
        onOpenChange={setShowExecutionDialog}
      >
        <dialog_1.DialogContent className="max-w-4xl">
          <dialog_1.DialogHeader>
            <dialog_1.DialogTitle>Execution Result</dialog_1.DialogTitle>
          </dialog_1.DialogHeader>
          <div className="space-y-4">
            <scroll_area_1.ScrollArea className="h-96">
              <pre className="text-sm bg-muted p-4 rounded-lg whitespace-pre-wrap">
                {executionResult}
              </pre>
            </scroll_area_1.ScrollArea>
            <div className="flex gap-2">
              <button_1.Button onClick={() => copyToClipboard(executionResult)}>
                <lucide_react_1.Copy className="h-4 w-4 mr-2" />
                Copy Result
              </button_1.Button>
              <button_1.Button
                variant="outline"
                onClick={() => setShowExecutionDialog(false)}
              >
                Close
              </button_1.Button>
            </div>
          </div>
        </dialog_1.DialogContent>
      </dialog_1.Dialog>
    </div>
  );
}
