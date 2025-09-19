"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Dashboard;
const react_query_1 = require("@tanstack/react-query");
const react_1 = require("react");
const sidebar_1 = require("@/components/layout/sidebar");
const header_1 = require("@/components/layout/header");
const stats_grid_1 = require("@/components/dashboard/stats-grid");
const post_card_1 = require("@/components/social/post-card");
const agent_template_card_1 = require("@/components/agents/agent-template-card");
const chat_widget_1 = require("@/components/chat/chat-widget");
const card_1 = require("@/components/ui/card");
const button_1 = require("@/components/ui/button");
const user_history_analytics_1 = require("@/components/analytics/user-history-analytics");
const ai_personalization_dashboard_1 = require("@/components/ai/ai-personalization-dashboard");
const workflow_marketplace_1 = require("@/components/workflow/workflow-marketplace");
function Dashboard() {
    const [showAnalytics, setShowAnalytics] = (0, react_1.useState)(false);
    const [showAIFeatures, setShowAIFeatures] = (0, react_1.useState)(false);
    const [showWorkflows, setShowWorkflows] = (0, react_1.useState)(false);
    const { data: posts, isLoading: postsLoading } = (0, react_query_1.useQuery)({
        queryKey: ['/api/posts'],
    });
    const { data: agentTemplates, isLoading: templatesLoading } = (0, react_query_1.useQuery)({
        queryKey: ['/api/agent-templates'],
    });
    const { data: userAgents, isLoading: agentsLoading } = (0, react_query_1.useQuery)({
        queryKey: ['/api/user-agents'],
        queryFn: () => fetch('/api/user-agents?userId=user-1').then(res => res.json()),
    });
    return (<div className="flex h-screen overflow-hidden bg-background carbon-texture">
      <sidebar_1.default />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header_1.default title="Dashboard" subtitle="Manage your AI-powered social platform"/>
        
        <main className="flex-1 overflow-auto cyber-scrollbar">
          <div className="p-6 max-w-7xl mx-auto">
            {showAnalytics ? (<div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold neon-text">User Analytics</h1>
                  <button_1.Button variant="outline" onClick={() => setShowAnalytics(false)} className="neon-glow-sm">
                    Back to Dashboard
                  </button_1.Button>
                </div>
                <user_history_analytics_1.default />
              </div>) : showAIFeatures ? (<div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold neon-text">AI Personalization</h1>
                  <button_1.Button variant="outline" onClick={() => setShowAIFeatures(false)} className="neon-glow-sm">
                    Back to Dashboard
                  </button_1.Button>
                </div>
                <ai_personalization_dashboard_1.default />
              </div>) : showWorkflows ? (<div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold neon-text">Workflow Marketplace</h1>
                  <button_1.Button variant="outline" onClick={() => setShowWorkflows(false)} className="neon-glow-sm">
                    Back to Dashboard
                  </button_1.Button>
                </div>
                <workflow_marketplace_1.default />
              </div>) : (<>
                <stats_grid_1.default />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
              {/* Left Column: Social Feed */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold neon-text animate-neon-flicker">Recent Posts</h2>
                  <div className="flex items-center gap-2">
                    <button_1.Button variant="neon" size="sm" data-testid="filter-all">
                      All
                    </button_1.Button>
                    <button_1.Button variant="cyber" size="sm" data-testid="filter-ai-generated">
                      AI Generated
                    </button_1.Button>
                    <button_1.Button variant="outline" size="sm" data-testid="filter-manual">
                      Manual
                    </button_1.Button>
                  </div>
                </div>

                {postsLoading ? (<div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (<card_1.Card key={i} className="p-6 animate-pulse">
                        <div className="space-y-3">
                          <div className="h-4 bg-muted rounded w-3/4"></div>
                          <div className="h-3 bg-muted rounded w-1/2"></div>
                          <div className="h-32 bg-muted rounded"></div>
                        </div>
                      </card_1.Card>))}
                  </div>) : (<div className="space-y-6">
                    {posts?.map((post) => (<post_card_1.default key={post.id} post={post}/>))}
                  </div>)}

                {/* Workflow Builder Preview */}
                <card_1.Card className="relative overflow-hidden">
                  <card_1.CardHeader>
                    <div className="flex items-center justify-between">
                      <card_1.CardTitle className="gradient-cyber-primary bg-clip-text text-transparent">Visual Workflow Builder</card_1.CardTitle>
                      <button_1.Button variant="holographic" size="sm" data-testid="link-open-editor">
                        Open Editor
                      </button_1.Button>
                    </div>
                  </card_1.CardHeader>
                  <card_1.CardContent>
                    <div className="relative bg-gradient-to-br from-muted/30 to-muted/10 rounded-xl p-6 min-h-[300px] overflow-hidden border border-primary/20">
                      {/* Cyberpunk Grid Background */}
                      <div className="absolute inset-0 opacity-10">
                        <div className="grid grid-cols-12 grid-rows-8 h-full w-full">
                          {Array.from({ length: 96 }).map((_, i) => (<div key={i} className="border border-primary/20"></div>))}
                        </div>
                      </div>
                      
                      <div className="relative flex items-center justify-center space-x-8">
                        {/* Trigger Node */}
                        <div className="gradient-cyber-primary text-white px-6 py-4 rounded-xl shadow-lg cursor-move transition-all duration-300 hover:scale-105 neon-glow-md hover:neon-glow-lg animate-hologram-flicker" data-testid="workflow-node-trigger">
                          <div className="flex items-center gap-3">
                            <i className="fas fa-play-circle text-xl"></i>
                            <div>
                              <div className="text-sm font-bold">Trigger</div>
                              <div className="text-xs opacity-80">New Mention</div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center">
                          <div className="h-0.5 w-16 bg-gradient-to-r from-primary to-accent"></div>
                          <i className="fas fa-chevron-right text-primary ml-2 animate-neon-pulse"></i>
                        </div>

                        {/* AI Node */}
                        <div className="gradient-cyber-secondary text-white px-6 py-4 rounded-xl shadow-lg cursor-move transition-all duration-300 hover:scale-105 neon-glow-md hover:neon-glow-lg animate-hologram-flicker" data-testid="workflow-node-ai">
                          <div className="flex items-center gap-3">
                            <i className="fas fa-robot text-xl"></i>
                            <div>
                              <div className="text-sm font-bold">AI Analysis</div>
                              <div className="text-xs opacity-80">Sentiment Check</div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center">
                          <div className="h-0.5 w-16 bg-gradient-to-r from-accent to-primary"></div>
                          <i className="fas fa-chevron-right text-accent ml-2 animate-neon-pulse"></i>
                        </div>

                        {/* Action Node */}
                        <div className="gradient-cyber-tertiary text-white px-6 py-4 rounded-xl shadow-lg cursor-move transition-all duration-300 hover:scale-105 neon-glow-md hover:neon-glow-lg animate-hologram-flicker" data-testid="workflow-node-action">
                          <div className="flex items-center gap-3">
                            <i className="fas fa-reply text-xl"></i>
                            <div>
                              <div className="text-sm font-bold">Auto Reply</div>
                              <div className="text-xs opacity-80">Generate Response</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground" data-testid="text-last-run">Last run: 2 minutes ago</span>
                          <div className="flex items-center gap-4">
                            <span className="text-primary neon-text" data-testid="text-successful-runs">✓ 12 successful runs today</span>
                            <span className="text-muted-foreground" data-testid="text-errors">• 0 errors</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </card_1.CardContent>
                </card_1.Card>
              </div>

              {/* Right Column: AI Agents & Templates */}
              <div className="space-y-6">
                {/* AI Agent Templates */}
                <card_1.Card className="relative overflow-hidden">
                  <card_1.CardHeader>
                    <div className="flex items-center justify-between">
                      <card_1.CardTitle className="gradient-cyber-primary bg-clip-text text-transparent">AI Agent Templates</card_1.CardTitle>
                      <button_1.Button variant="neon" size="sm" data-testid="link-view-all-templates">
                        View All
                      </button_1.Button>
                    </div>
                  </card_1.CardHeader>
                  <card_1.CardContent className="space-y-3">
                    {templatesLoading ? (<div className="space-y-3">
                        {Array.from({ length: 3 }).map((_, i) => (<div key={i} className="p-4 bg-muted/50 rounded-lg animate-pulse">
                            <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-muted rounded w-1/2"></div>
                          </div>))}
                      </div>) : (agentTemplates?.slice(0, 3).map((template) => (<agent_template_card_1.default key={template.id} template={template}/>)))}

                    <button_1.Button className="w-full gradient-cyber-primary hover:gradient-cyber-secondary transition-all duration-300 neon-glow-md hover:neon-glow-lg" data-testid="button-create-agent">
                      <i className="fas fa-plus mr-2"></i>
                      Create Custom Agent
                    </button_1.Button>
                  </card_1.CardContent>
                </card_1.Card>

                {/* Active Automations */}
                <card_1.Card className="relative overflow-hidden">
                  <card_1.CardHeader>
                    <card_1.CardTitle className="gradient-cyber-secondary bg-clip-text text-transparent">Active Automations</card_1.CardTitle>
                  </card_1.CardHeader>
                  <card_1.CardContent className="space-y-4">
                    {agentsLoading ? (<div className="space-y-4">
                        {Array.from({ length: 3 }).map((_, i) => (<div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg animate-pulse">
                            <div className="h-4 bg-muted rounded w-3/4"></div>
                          </div>))}
                      </div>) : (<>
                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl border border-primary/20 neon-glow-sm hover:neon-glow-md transition-all duration-300" data-testid="automation-daily-scheduler">
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-primary rounded-full animate-neon-pulse neon-glow-sm"></div>
                            <div>
                              <p className="text-sm font-medium text-foreground neon-text">Daily Content Scheduler</p>
                              <p className="text-xs text-muted-foreground">Last run: 30 min ago</p>
                            </div>
                          </div>
                          <button_1.Button variant="ghost" size="sm" data-testid="button-automation-options">
                            <i className="fas fa-ellipsis-v"></i>
                          </button_1.Button>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-accent/10 to-primary/10 rounded-xl border border-accent/20 neon-glow-sm hover:neon-glow-md transition-all duration-300" data-testid="automation-engagement-tracker">
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-accent rounded-full animate-neon-pulse neon-glow-sm"></div>
                            <div>
                              <p className="text-sm font-medium text-foreground neon-text">Engagement Tracker</p>
                              <p className="text-xs text-muted-foreground">Last run: 1 hour ago</p>
                            </div>
                          </div>
                          <button_1.Button variant="ghost" size="sm" data-testid="button-automation-options">
                            <i className="fas fa-ellipsis-v"></i>
                          </button_1.Button>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-xl border border-yellow-500/20 neon-glow-sm hover:neon-glow-md transition-all duration-300" data-testid="automation-hashtag-optimizer">
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-yellow-500 rounded-full animate-neon-pulse neon-glow-sm"></div>
                            <div>
                              <p className="text-sm font-medium text-foreground neon-text">Hashtag Optimizer</p>
                              <p className="text-xs text-muted-foreground">Paused</p>
                            </div>
                          </div>
                          <button_1.Button variant="ghost" size="sm" data-testid="button-automation-options">
                            <i className="fas fa-ellipsis-v"></i>
                          </button_1.Button>
                        </div>
                      </>)}
                  </card_1.CardContent>
                </card_1.Card>

                {/* Quick Actions */}
                <card_1.Card className="relative overflow-hidden">
                  <card_1.CardHeader>
                    <card_1.CardTitle className="gradient-cyber-tertiary bg-clip-text text-transparent">Quick Actions</card_1.CardTitle>
                  </card_1.CardHeader>
                  <card_1.CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      <button_1.Button variant="ghost" className="p-4 bg-gradient-to-br from-primary/20 to-primary/10 text-primary hover:from-primary/30 hover:to-primary/20 h-auto flex-col neon-glow-sm hover:neon-glow-md transition-all duration-300" data-testid="button-schedule-post">
                        <i className="fas fa-calendar-plus text-xl mb-2"></i>
                        <span className="text-sm font-medium">Schedule Post</span>
                      </button_1.Button>
                      
                      <button_1.Button variant="ghost" className="p-4 bg-gradient-to-br from-purple-500/20 to-purple-500/10 text-purple-400 hover:from-purple-500/30 hover:to-purple-500/20 h-auto flex-col neon-glow-sm hover:neon-glow-md transition-all duration-300" data-testid="button-ai-personalization" onClick={() => setShowAIFeatures(true)}>
                        <i className="fas fa-brain text-xl mb-2"></i>
                        <span className="text-sm font-medium">AI Personalization</span>
                      </button_1.Button>
                      
                      <button_1.Button variant="ghost" className="p-4 bg-gradient-to-br from-blue-500/20 to-blue-500/10 text-blue-400 hover:from-blue-500/30 hover:to-blue-500/20 h-auto flex-col neon-glow-sm hover:neon-glow-md transition-all duration-300" data-testid="button-view-analytics" onClick={() => setShowAnalytics(true)}>
                        <i className="fas fa-chart-bar text-xl mb-2"></i>
                        <span className="text-sm font-medium">Analytics</span>
                      </button_1.Button>
                      
                      <button_1.Button variant="ghost" className="p-4 bg-gradient-to-br from-orange-500/20 to-orange-500/10 text-orange-400 hover:from-orange-500/30 hover:to-orange-500/20 h-auto flex-col neon-glow-sm hover:neon-glow-md transition-all duration-300" data-testid="button-workflow-marketplace" onClick={() => setShowWorkflows(true)}>
                        <i className="fas fa-cogs text-xl mb-2"></i>
                        <span className="text-sm font-medium">Workflows</span>
                      </button_1.Button>
                    </div>
                  </card_1.CardContent>
                </card_1.Card>
              </div>
            </div>
              </>)}
          </div>
        </main>
      </div>

      <chat_widget_1.default />
    </div>);
}
