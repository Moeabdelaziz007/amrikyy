"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AIAgentsPage;
const react_1 = require("react");
const card_1 = require("@/components/ui/card");
const button_1 = require("@/components/ui/button");
const badge_1 = require("@/components/ui/badge");
const alert_1 = require("@/components/ui/alert");
const tabs_1 = require("@/components/ui/tabs");
const lucide_react_1 = require("lucide-react");
const ai_agents_app_1 = require("@/apps/ai-agents/ai-agents-app");
const plugin_manager_app_1 = require("@/apps/ai-agents/plugin-manager-app");
const workflow_builder_app_1 = require("@/apps/ai-agents/workflow-builder-app");
function AIAgentsPage() {
    const [activeTab, setActiveTab] = (0, react_1.useState)('agents');
    return (<div className="flex h-screen overflow-hidden bg-background carbon-texture">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-6 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold neon-text">AI Agents & Plugins</h1>
              <p className="text-muted-foreground mt-2">
                Powerful AI agents with MCP plugin capabilities for complex task automation
              </p>
            </div>
            <badge_1.Badge variant="outline" className="text-sm">
              Advanced AI System
            </badge_1.Badge>
          </div>
        </div>

        <div className="flex-1 overflow-auto cyber-scrollbar">
          <div className="p-6 max-w-7xl mx-auto">
            <tabs_1.Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <tabs_1.TabsList className="grid w-full grid-cols-4">
                <tabs_1.TabsTrigger value="agents">AI Agents</tabs_1.TabsTrigger>
                <tabs_1.TabsTrigger value="plugins">Plugin Manager</tabs_1.TabsTrigger>
                <tabs_1.TabsTrigger value="workflows">Workflow Builder</tabs_1.TabsTrigger>
                <tabs_1.TabsTrigger value="overview">Overview</tabs_1.TabsTrigger>
              </tabs_1.TabsList>

              <tabs_1.TabsContent value="agents" className="space-y-6">
                <ai_agents_app_1.default />
              </tabs_1.TabsContent>

              <tabs_1.TabsContent value="plugins" className="space-y-6">
                <plugin_manager_app_1.default />
              </tabs_1.TabsContent>

              <tabs_1.TabsContent value="workflows" className="space-y-6">
                <workflow_builder_app_1.default />
              </tabs_1.TabsContent>

              <tabs_1.TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <card_1.Card className="glass-card">
                    <card_1.CardHeader>
                      <card_1.CardTitle className="flex items-center gap-2">
                        <lucide_react_1.Bot className="w-5 h-5 text-primary"/>
                        AI Agents
                      </card_1.CardTitle>
                    </card_1.CardHeader>
                    <card_1.CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Intelligent agents that can use multiple MCP tools as plugins to handle complex tasks
                      </p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Available Agents:</span>
                          <span className="font-medium">6</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Active Agents:</span>
                          <span className="font-medium text-green-500">6</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Total Capabilities:</span>
                          <span className="font-medium">25+</span>
                        </div>
                      </div>
                      <button_1.Button className="w-full mt-4" onClick={() => setActiveTab('agents')}>
                        Manage Agents
                      </button_1.Button>
                    </card_1.CardContent>
                  </card_1.Card>

                  <card_1.Card className="glass-card">
                    <card_1.CardHeader>
                      <card_1.CardTitle className="flex items-center gap-2">
                        <lucide_react_1.Plug className="w-5 h-5 text-primary"/>
                        MCP Plugins
                      </card_1.CardTitle>
                    </card_1.CardHeader>
                    <card_1.CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Manage and configure MCP tools that agents can use as plugins
                      </p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Available Plugins:</span>
                          <span className="font-medium">16</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Active Plugins:</span>
                          <span className="font-medium text-green-500">15</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Categories:</span>
                          <span className="font-medium">8</span>
                        </div>
                      </div>
                      <button_1.Button className="w-full mt-4" onClick={() => setActiveTab('plugins')}>
                        Manage Plugins
                      </button_1.Button>
                    </card_1.CardContent>
                  </card_1.Card>

                  <card_1.Card className="glass-card">
                    <card_1.CardHeader>
                      <card_1.CardTitle className="flex items-center gap-2">
                        <lucide_react_1.Workflow className="w-5 h-5 text-primary"/>
                        Workflows
                      </card_1.CardTitle>
                    </card_1.CardHeader>
                    <card_1.CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Create complex automated workflows using agents and plugins
                      </p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Workflows Created:</span>
                          <span className="font-medium">0</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Active Workflows:</span>
                          <span className="font-medium text-green-500">0</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Executions:</span>
                          <span className="font-medium">0</span>
                        </div>
                      </div>
                      <button_1.Button className="w-full mt-4" onClick={() => setActiveTab('workflows')}>
                        Build Workflows
                      </button_1.Button>
                    </card_1.CardContent>
                  </card_1.Card>
                </div>

                <card_1.Card className="glass-card">
                  <card_1.CardHeader>
                    <card_1.CardTitle className="flex items-center gap-2">
                      <lucide_react_1.Brain className="w-5 h-5 text-primary"/>
                      System Overview
                    </card_1.CardTitle>
                  </card_1.CardHeader>
                  <card_1.CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="text-center p-4 rounded-lg bg-primary/10">
                        <div className="text-2xl font-bold text-primary">100%</div>
                        <div className="text-sm text-muted-foreground">System Uptime</div>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-accent/10">
                        <div className="text-2xl font-bold text-accent">2.1s</div>
                        <div className="text-sm text-muted-foreground">Avg Response</div>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-green-500/10">
                        <div className="text-2xl font-bold text-green-500">1,247</div>
                        <div className="text-sm text-muted-foreground">Tasks Completed</div>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-blue-500/10">
                        <div className="text-2xl font-bold text-blue-500">24/7</div>
                        <div className="text-sm text-muted-foreground">Availability</div>
                      </div>
                    </div>
                  </card_1.CardContent>
                </card_1.Card>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <card_1.Card className="glass-card">
                    <card_1.CardHeader>
                      <card_1.CardTitle>Agent Types</card_1.CardTitle>
                    </card_1.CardHeader>
                    <card_1.CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-2 rounded bg-blue-500/10">
                          <span className="text-lg">🔍</span>
                          <div>
                            <div className="font-medium">Research Agent</div>
                            <div className="text-sm text-muted-foreground">Web research & analysis</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-2 rounded bg-green-500/10">
                          <span className="text-lg">💻</span>
                          <div>
                            <div className="font-medium">Development Agent</div>
                            <div className="text-sm text-muted-foreground">Code analysis & debugging</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-2 rounded bg-purple-500/10">
                          <span className="text-lg">📝</span>
                          <div>
                            <div className="font-medium">Content Agent</div>
                            <div className="text-sm text-muted-foreground">Content creation & optimization</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-2 rounded bg-orange-500/10">
                          <span className="text-lg">📊</span>
                          <div>
                            <div className="font-medium">Analytics Agent</div>
                            <div className="text-sm text-muted-foreground">Data analysis & visualization</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-2 rounded bg-red-500/10">
                          <span className="text-lg">⚙️</span>
                          <div>
                            <div className="font-medium">Automation Agent</div>
                            <div className="text-sm text-muted-foreground">Workflow automation</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-2 rounded bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                          <span className="text-lg">🚀</span>
                          <div>
                            <div className="font-medium">Super Agent</div>
                            <div className="text-sm opacity-90">All capabilities combined</div>
                          </div>
                        </div>
                      </div>
                    </card_1.CardContent>
                  </card_1.Card>

                  <card_1.Card className="glass-card">
                    <card_1.CardHeader>
                      <card_1.CardTitle>Plugin Categories</card_1.CardTitle>
                    </card_1.CardHeader>
                    <card_1.CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-2 rounded bg-muted/50">
                          <span className="font-medium">Development</span>
                          <badge_1.Badge variant="outline">5 plugins</badge_1.Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded bg-muted/50">
                          <span className="font-medium">Web</span>
                          <badge_1.Badge variant="outline">3 plugins</badge_1.Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded bg-muted/50">
                          <span className="font-medium">Analytics</span>
                          <badge_1.Badge variant="outline">2 plugins</badge_1.Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded bg-muted/50">
                          <span className="font-medium">AI</span>
                          <badge_1.Badge variant="outline">2 plugins</badge_1.Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded bg-muted/50">
                          <span className="font-medium">System</span>
                          <badge_1.Badge variant="outline">3 plugins</badge_1.Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded bg-muted/50">
                          <span className="font-medium">Text</span>
                          <badge_1.Badge variant="outline">1 plugin</badge_1.Badge>
                        </div>
                      </div>
                    </card_1.CardContent>
                  </card_1.Card>
                </div>
              </tabs_1.TabsContent>
            </tabs_1.Tabs>
          </div>
        </div>
      </div>

      <alert_1.Alert className="fixed bottom-4 right-4 w-96">
        <lucide_react_1.Brain className="h-4 w-4"/>
        <alert_1.AlertDescription>
          AI Agents with Plugins provide powerful task automation by combining multiple MCP tools. 
          Each agent has specialized capabilities and can orchestrate complex workflows using their plugin ecosystem.
        </alert_1.AlertDescription>
      </alert_1.Alert>
    </div>);
}
