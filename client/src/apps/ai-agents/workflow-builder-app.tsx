'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.default = WorkflowBuilderApp;
const react_1 = require('react');
const card_1 = require('@/components/ui/card');
const button_1 = require('@/components/ui/button');
const input_1 = require('@/components/ui/input');
const textarea_1 = require('@/components/ui/textarea');
const select_1 = require('@/components/ui/select');
const badge_1 = require('@/components/ui/badge');
const alert_1 = require('@/components/ui/alert');
const tabs_1 = require('@/components/ui/tabs');
const lucide_react_1 = require('lucide-react');
const availableAgents = [
  { id: 'research-agent', name: 'Research Agent', icon: '🔍', color: 'blue' },
  {
    id: 'development-agent',
    name: 'Development Agent',
    icon: '💻',
    color: 'green',
  },
  { id: 'content-agent', name: 'Content Agent', icon: '📝', color: 'purple' },
  {
    id: 'analytics-agent',
    name: 'Analytics Agent',
    icon: '📊',
    color: 'orange',
  },
  {
    id: 'automation-agent',
    name: 'Automation Agent',
    icon: '⚙️',
    color: 'red',
  },
  { id: 'super-agent', name: 'Super Agent', icon: '🚀', color: 'gradient' },
];
const availablePlugins = [
  { id: 'cursor_cli', name: 'Cursor CLI', category: 'Development' },
  { id: 'comet_chrome', name: 'Comet Chrome', category: 'Web' },
  { id: 'web_scraper', name: 'Web Scraper', category: 'Web' },
  { id: 'data_analyzer', name: 'Data Analyzer', category: 'Analytics' },
  { id: 'text_processor', name: 'Text Processor', category: 'Text' },
  { id: 'ai_generation_tool', name: 'AI Generator', category: 'AI' },
  { id: 'file_operations', name: 'File Operations', category: 'System' },
  { id: 'image_processor', name: 'Image Processor', category: 'Media' },
  { id: 'database_operations', name: 'Database Operations', category: 'Data' },
  { id: 'api_tester', name: 'API Tester', category: 'Development' },
  { id: 'code_generator', name: 'Code Generator', category: 'Development' },
  { id: 'data_visualizer', name: 'Data Visualizer', category: 'Analytics' },
  { id: 'automation', name: 'Automation', category: 'System' },
  { id: 'knowledge_base', name: 'Knowledge Base', category: 'AI' },
  { id: 'system_info', name: 'System Info', category: 'System' },
  { id: 'code_formatter', name: 'Code Formatter', category: 'Development' },
];
function WorkflowBuilderApp() {
  const [workflows, setWorkflows] = (0, react_1.useState)([]);
  const [selectedWorkflow, setSelectedWorkflow] = (0, react_1.useState)(null);
  const [isExecuting, setIsExecuting] = (0, react_1.useState)(false);
  const [activeTab, setActiveTab] = (0, react_1.useState)('builder');
  const createNewWorkflow = () => {
    const newWorkflow = {
      id: `workflow-${Date.now()}`,
      name: 'New Workflow',
      description: 'A new automated workflow',
      steps: [],
      connections: [],
      status: 'draft',
      createdAt: new Date().toISOString(),
    };
    setWorkflows(prev => [...prev, newWorkflow]);
    setSelectedWorkflow(newWorkflow);
  };
  const addStep = type => {
    if (!selectedWorkflow) return;
    const newStep = {
      id: `step-${Date.now()}`,
      type,
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} Step`,
      config: {},
      position: { x: 100, y: 100 + selectedWorkflow.steps.length * 150 },
    };
    const updatedWorkflow = {
      ...selectedWorkflow,
      steps: [...selectedWorkflow.steps, newStep],
    };
    setSelectedWorkflow(updatedWorkflow);
    setWorkflows(prev =>
      prev.map(w => (w.id === selectedWorkflow.id ? updatedWorkflow : w))
    );
  };
  const updateStep = (stepId, updates) => {
    if (!selectedWorkflow) return;
    const updatedWorkflow = {
      ...selectedWorkflow,
      steps: selectedWorkflow.steps.map(step =>
        step.id === stepId ? { ...step, ...updates } : step
      ),
    };
    setSelectedWorkflow(updatedWorkflow);
    setWorkflows(prev =>
      prev.map(w => (w.id === selectedWorkflow.id ? updatedWorkflow : w))
    );
  };
  const deleteStep = stepId => {
    if (!selectedWorkflow) return;
    const updatedWorkflow = {
      ...selectedWorkflow,
      steps: selectedWorkflow.steps.filter(step => step.id !== stepId),
      connections: selectedWorkflow.connections.filter(
        conn => conn.from !== stepId && conn.to !== stepId
      ),
    };
    setSelectedWorkflow(updatedWorkflow);
    setWorkflows(prev =>
      prev.map(w => (w.id === selectedWorkflow.id ? updatedWorkflow : w))
    );
  };
  const addConnection = (from, to) => {
    if (!selectedWorkflow) return;
    const connection = { from, to };
    const updatedWorkflow = {
      ...selectedWorkflow,
      connections: [...selectedWorkflow.connections, connection],
    };
    setSelectedWorkflow(updatedWorkflow);
    setWorkflows(prev =>
      prev.map(w => (w.id === selectedWorkflow.id ? updatedWorkflow : w))
    );
  };
  const executeWorkflow = async () => {
    if (!selectedWorkflow) return;
    setIsExecuting(true);
    try {
      // Simulate workflow execution
      await new Promise(resolve =>
        setTimeout(resolve, Math.random() * 5000 + 2000)
      );
      const updatedWorkflow = {
        ...selectedWorkflow,
        lastRun: new Date().toISOString(),
      };
      setSelectedWorkflow(updatedWorkflow);
      setWorkflows(prev =>
        prev.map(w => (w.id === selectedWorkflow.id ? updatedWorkflow : w))
      );
    } finally {
      setIsExecuting(false);
    }
  };
  const saveWorkflow = () => {
    if (!selectedWorkflow) return;
    const updatedWorkflow = {
      ...selectedWorkflow,
      status: 'active',
    };
    setSelectedWorkflow(updatedWorkflow);
    setWorkflows(prev =>
      prev.map(w => (w.id === selectedWorkflow.id ? updatedWorkflow : w))
    );
  };
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold neon-text">Workflow Builder</h1>
          <p className="text-muted-foreground mt-2">
            Create complex automated workflows using AI agents and MCP plugins
          </p>
        </div>
        <div className="flex gap-2">
          <button_1.Button onClick={createNewWorkflow}>
            <lucide_react_1.Plus className="w-4 h-4 mr-2" />
            New Workflow
          </button_1.Button>
          {selectedWorkflow && (
            <>
              <button_1.Button onClick={saveWorkflow} variant="outline">
                <lucide_react_1.Save className="w-4 h-4 mr-2" />
                Save
              </button_1.Button>
              <button_1.Button
                onClick={executeWorkflow}
                disabled={isExecuting}
                className="gradient-cyber-primary hover:gradient-cyber-secondary"
              >
                {isExecuting ? (
                  <>
                    <lucide_react_1.Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Executing...
                  </>
                ) : (
                  <>
                    <lucide_react_1.Play className="w-4 h-4 mr-2" />
                    Execute
                  </>
                )}
              </button_1.Button>
            </>
          )}
        </div>
      </div>

      <tabs_1.Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <tabs_1.TabsList className="grid w-full grid-cols-3">
          <tabs_1.TabsTrigger value="builder">
            Workflow Builder
          </tabs_1.TabsTrigger>
          <tabs_1.TabsTrigger value="library">
            Workflow Library
          </tabs_1.TabsTrigger>
          <tabs_1.TabsTrigger value="executions">Executions</tabs_1.TabsTrigger>
        </tabs_1.TabsList>

        <tabs_1.TabsContent value="builder" className="space-y-6">
          {selectedWorkflow ? (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-1 space-y-4">
                <card_1.Card className="glass-card">
                  <card_1.CardHeader>
                    <card_1.CardTitle>Workflow Details</card_1.CardTitle>
                  </card_1.CardHeader>
                  <card_1.CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Name</label>
                      <input_1.Input
                        value={selectedWorkflow.name}
                        onChange={e =>
                          setSelectedWorkflow({
                            ...selectedWorkflow,
                            name: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Description</label>
                      <textarea_1.Textarea
                        value={selectedWorkflow.description}
                        onChange={e =>
                          setSelectedWorkflow({
                            ...selectedWorkflow,
                            description: e.target.value,
                          })
                        }
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Status</label>
                      <select_1.Select
                        value={selectedWorkflow.status}
                        onValueChange={value =>
                          setSelectedWorkflow({
                            ...selectedWorkflow,
                            status: value,
                          })
                        }
                      >
                        <select_1.SelectTrigger>
                          <select_1.SelectValue />
                        </select_1.SelectTrigger>
                        <select_1.SelectContent>
                          <select_1.SelectItem value="draft">
                            Draft
                          </select_1.SelectItem>
                          <select_1.SelectItem value="active">
                            Active
                          </select_1.SelectItem>
                          <select_1.SelectItem value="paused">
                            Paused
                          </select_1.SelectItem>
                        </select_1.SelectContent>
                      </select_1.Select>
                    </div>
                  </card_1.CardContent>
                </card_1.Card>

                <card_1.Card className="glass-card">
                  <card_1.CardHeader>
                    <card_1.CardTitle>Add Steps</card_1.CardTitle>
                  </card_1.CardHeader>
                  <card_1.CardContent className="space-y-2">
                    <button_1.Button
                      onClick={() => addStep('agent')}
                      variant="outline"
                      className="w-full justify-start"
                    >
                      <lucide_react_1.Bot className="w-4 h-4 mr-2" />
                      AI Agent
                    </button_1.Button>
                    <button_1.Button
                      onClick={() => addStep('plugin')}
                      variant="outline"
                      className="w-full justify-start"
                    >
                      <lucide_react_1.Zap className="w-4 h-4 mr-2" />
                      MCP Plugin
                    </button_1.Button>
                    <button_1.Button
                      onClick={() => addStep('condition')}
                      variant="outline"
                      className="w-full justify-start"
                    >
                      <lucide_react_1.Workflow className="w-4 h-4 mr-2" />
                      Condition
                    </button_1.Button>
                    <button_1.Button
                      onClick={() => addStep('delay')}
                      variant="outline"
                      className="w-full justify-start"
                    >
                      <lucide_react_1.ArrowRight className="w-4 h-4 mr-2" />
                      Delay
                    </button_1.Button>
                  </card_1.CardContent>
                </card_1.Card>
              </div>

              <div className="lg:col-span-3">
                <card_1.Card className="glass-card">
                  <card_1.CardHeader>
                    <card_1.CardTitle>Workflow Canvas</card_1.CardTitle>
                  </card_1.CardHeader>
                  <card_1.CardContent>
                    <div className="min-h-[600px] border-2 border-dashed border-border rounded-lg p-6">
                      {selectedWorkflow.steps.length === 0 ? (
                        <div className="flex items-center justify-center h-full">
                          <div className="text-center">
                            <lucide_react_1.Workflow className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                            <h3 className="text-lg font-medium mb-2">
                              Empty Workflow
                            </h3>
                            <p className="text-muted-foreground">
                              Add steps from the sidebar to build your workflow
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {selectedWorkflow.steps.map((step, index) => (
                            <div
                              key={step.id}
                              className="flex items-center gap-4"
                            >
                              <card_1.Card className="flex-1">
                                <card_1.CardContent className="p-4">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      {step.type === 'agent' && (
                                        <lucide_react_1.Bot className="w-4 h-4" />
                                      )}
                                      {step.type === 'plugin' && (
                                        <lucide_react_1.Zap className="w-4 h-4" />
                                      )}
                                      {step.type === 'condition' && (
                                        <lucide_react_1.Workflow className="w-4 h-4" />
                                      )}
                                      {step.type === 'delay' && (
                                        <lucide_react_1.ArrowRight className="w-4 h-4" />
                                      )}
                                      <span className="font-medium">
                                        {step.name}
                                      </span>
                                      <badge_1.Badge variant="outline">
                                        {step.type}
                                      </badge_1.Badge>
                                    </div>
                                    <button_1.Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => deleteStep(step.id)}
                                    >
                                      <lucide_react_1.Trash2 className="w-4 h-4" />
                                    </button_1.Button>
                                  </div>

                                  {step.type === 'agent' && (
                                    <div className="mt-2">
                                      <select_1.Select
                                        value={step.config.agentId || ''}
                                        onValueChange={value =>
                                          updateStep(step.id, {
                                            config: {
                                              ...step.config,
                                              agentId: value,
                                            },
                                          })
                                        }
                                      >
                                        <select_1.SelectTrigger>
                                          <select_1.SelectValue placeholder="Select Agent" />
                                        </select_1.SelectTrigger>
                                        <select_1.SelectContent>
                                          {availableAgents.map(agent => (
                                            <select_1.SelectItem
                                              key={agent.id}
                                              value={agent.id}
                                            >
                                              {agent.icon} {agent.name}
                                            </select_1.SelectItem>
                                          ))}
                                        </select_1.SelectContent>
                                      </select_1.Select>
                                    </div>
                                  )}

                                  {step.type === 'plugin' && (
                                    <div className="mt-2">
                                      <select_1.Select
                                        value={step.config.pluginId || ''}
                                        onValueChange={value =>
                                          updateStep(step.id, {
                                            config: {
                                              ...step.config,
                                              pluginId: value,
                                            },
                                          })
                                        }
                                      >
                                        <select_1.SelectTrigger>
                                          <select_1.SelectValue placeholder="Select Plugin" />
                                        </select_1.SelectTrigger>
                                        <select_1.SelectContent>
                                          {availablePlugins.map(plugin => (
                                            <select_1.SelectItem
                                              key={plugin.id}
                                              value={plugin.id}
                                            >
                                              {plugin.name} ({plugin.category})
                                            </select_1.SelectItem>
                                          ))}
                                        </select_1.SelectContent>
                                      </select_1.Select>
                                    </div>
                                  )}

                                  {step.type === 'condition' && (
                                    <div className="mt-2">
                                      <input_1.Input
                                        placeholder="Condition expression"
                                        value={step.config.condition || ''}
                                        onChange={e =>
                                          updateStep(step.id, {
                                            config: {
                                              ...step.config,
                                              condition: e.target.value,
                                            },
                                          })
                                        }
                                      />
                                    </div>
                                  )}

                                  {step.type === 'delay' && (
                                    <div className="mt-2">
                                      <input_1.Input
                                        type="number"
                                        placeholder="Delay in seconds"
                                        value={step.config.delay || ''}
                                        onChange={e =>
                                          updateStep(step.id, {
                                            config: {
                                              ...step.config,
                                              delay: Number(e.target.value),
                                            },
                                          })
                                        }
                                      />
                                    </div>
                                  )}
                                </card_1.CardContent>
                              </card_1.Card>

                              {index < selectedWorkflow.steps.length - 1 && (
                                <div className="flex flex-col items-center">
                                  <lucide_react_1.ArrowRight className="w-4 h-4 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </card_1.CardContent>
                </card_1.Card>
              </div>
            </div>
          ) : (
            <card_1.Card className="glass-card">
              <card_1.CardContent className="text-center py-12">
                <lucide_react_1.Workflow className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-medium mb-2">
                  No Workflow Selected
                </h3>
                <p className="text-muted-foreground mb-4">
                  Create a new workflow or select an existing one to start
                  building
                </p>
                <button_1.Button onClick={createNewWorkflow}>
                  <lucide_react_1.Plus className="w-4 h-4 mr-2" />
                  Create New Workflow
                </button_1.Button>
              </card_1.CardContent>
            </card_1.Card>
          )}
        </tabs_1.TabsContent>

        <tabs_1.TabsContent value="library" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workflows.map(workflow => (
              <card_1.Card
                key={workflow.id}
                className="glass-card cursor-pointer hover:scale-105 transition-all"
                onClick={() => setSelectedWorkflow(workflow)}
              >
                <card_1.CardHeader>
                  <card_1.CardTitle className="flex items-center justify-between">
                    {workflow.name}
                    <badge_1.Badge
                      variant={
                        workflow.status === 'active' ? 'default' : 'secondary'
                      }
                    >
                      {workflow.status}
                    </badge_1.Badge>
                  </card_1.CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {workflow.description}
                  </p>
                </card_1.CardHeader>
                <card_1.CardContent>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="font-medium">Steps:</span>{' '}
                      {workflow.steps.length}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Created:</span>{' '}
                      {new Date(workflow.createdAt).toLocaleDateString()}
                    </div>
                    {workflow.lastRun && (
                      <div className="text-sm">
                        <span className="font-medium">Last Run:</span>{' '}
                        {new Date(workflow.lastRun).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </card_1.CardContent>
              </card_1.Card>
            ))}
          </div>
        </tabs_1.TabsContent>

        <tabs_1.TabsContent value="executions" className="space-y-6">
          <card_1.Card className="glass-card">
            <card_1.CardHeader>
              <card_1.CardTitle>Execution History</card_1.CardTitle>
            </card_1.CardHeader>
            <card_1.CardContent>
              <div className="text-center py-12">
                <lucide_react_1.Workflow className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-medium mb-2">No Executions Yet</h3>
                <p className="text-muted-foreground">
                  Execute workflows to see their execution history here
                </p>
              </div>
            </card_1.CardContent>
          </card_1.Card>
        </tabs_1.TabsContent>
      </tabs_1.Tabs>

      <alert_1.Alert>
        <lucide_react_1.Workflow className="h-4 w-4" />
        <alert_1.AlertDescription>
          Workflow Builder allows you to create complex automated workflows by
          combining AI agents and MCP plugins. Build sophisticated automation
          pipelines for any task.
        </alert_1.AlertDescription>
      </alert_1.Alert>
    </div>
  );
}
