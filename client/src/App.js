"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const wouter_1 = require("wouter");
const react_1 = require("react");
const queryClient_1 = require("./lib/queryClient");
const react_query_1 = require("@tanstack/react-query");
const toaster_1 = require("@/components/ui/toaster");
const tooltip_1 = require("@/components/ui/tooltip");
const use_theme_1 = require("@/hooks/use-theme");
const use_auth_1 = require("@/hooks/use-auth");
const protected_route_1 = require("@/components/auth/protected-route");
const error_boundary_1 = require("@/components/ui/error-boundary");
const keyboard_navigation_1 = require("@/components/ui/keyboard-navigation");
const page_tracker_1 = require("@/components/analytics/page-tracker");
const page_tracker_2 = require("@/components/analytics/page-tracker");
// Lazy load pages for better performance
const Dashboard = (0, react_1.lazy)(() => Promise.resolve().then(() => require("@/pages/dashboard")));
const SocialFeed = (0, react_1.lazy)(() => Promise.resolve().then(() => require("@/pages/social-feed")));
const Workflows = (0, react_1.lazy)(() => Promise.resolve().then(() => require("@/pages/workflows")));
const AIAgents = (0, react_1.lazy)(() => Promise.resolve().then(() => require("@/pages/ai-agents")));
const MCPToolsPage = (0, react_1.lazy)(() => Promise.resolve().then(() => require("@/pages/mcp-tools")));
const PromptLibraryPage = (0, react_1.lazy)(() => Promise.resolve().then(() => require("@/pages/prompt-library")));
const TelegramPage = (0, react_1.lazy)(() => Promise.resolve().then(() => require("@/pages/telegram")));
const SmartLearningPage = (0, react_1.lazy)(() => Promise.resolve().then(() => require("@/pages/smart-learning")));
const AdvancedAIToolsPage = (0, react_1.lazy)(() => Promise.resolve().then(() => require("@/pages/advanced-ai-tools")));
const LearningDashboard = (0, react_1.lazy)(() => Promise.resolve().then(() => require("@/pages/learning-dashboard")));
const NotFound = (0, react_1.lazy)(() => Promise.resolve().then(() => require("@/pages/not-found")));
const DebugView = (0, react_1.lazy)(() => Promise.resolve().then(() => require("@/pages/DebugView")));
const Workspace = (0, react_1.lazy)(() => Promise.resolve().then(() => require("@/pages/Workspace")));
// Loading component
const PageLoader = () => (<div className="flex items-center justify-center h-screen">
    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>);
function Router() {
    (0, page_tracker_1.useRouterTracking)(); // Track router navigation
    return (<protected_route_1.default>
      <react_1.Suspense fallback={<PageLoader />}>
        <wouter_1.Switch>
          <wouter_1.Route path="/" component={(0, page_tracker_2.withPageTracking)(Dashboard, 'Dashboard')}/>
          <wouter_1.Route path="/social-feed" component={(0, page_tracker_2.withPageTracking)(SocialFeed, 'Social Feed')}/>
          <wouter_1.Route path="/workflows" component={(0, page_tracker_2.withPageTracking)(Workflows, 'Workflows')}/>
          <wouter_1.Route path="/ai-agents" component={(0, page_tracker_2.withPageTracking)(AIAgents, 'AI Agents')}/>
          <wouter_1.Route path="/mcp-tools" component={(0, page_tracker_2.withPageTracking)(MCPToolsPage, 'MCP Tools')}/>
          <wouter_1.Route path="/prompt-library" component={(0, page_tracker_2.withPageTracking)(PromptLibraryPage, 'Prompt Library')}/>
          <wouter_1.Route path="/telegram" component={(0, page_tracker_2.withPageTracking)(TelegramPage, 'Telegram')}/>
          <wouter_1.Route path="/smart-learning" component={(0, page_tracker_2.withPageTracking)(SmartLearningPage, 'Smart Learning')}/>
          <wouter_1.Route path="/advanced-ai-tools" component={(0, page_tracker_2.withPageTracking)(AdvancedAIToolsPage, 'Advanced AI Tools')}/>
          <wouter_1.Route path="/learning" component={(0, page_tracker_2.withPageTracking)(LearningDashboard, 'Learning Dashboard')}/>
          <wouter_1.Route path="/debug" component={(0, page_tracker_2.withPageTracking)(DebugView, 'Debug View')}/>
          <wouter_1.Route path="/workspace" component={(0, page_tracker_2.withPageTracking)(Workspace, 'Workspace')}/>
          <wouter_1.Route component={(0, page_tracker_2.withPageTracking)(NotFound, 'Not Found')}/>
        </wouter_1.Switch>
      </react_1.Suspense>
    </protected_route_1.default>);
}
function App() {
    return (<error_boundary_1.ErrorBoundary>
      <use_auth_1.AuthProvider>
        <react_query_1.QueryClientProvider client={queryClient_1.queryClient}>
          <use_theme_1.ThemeProvider>
            <tooltip_1.TooltipProvider>
              <keyboard_navigation_1.KeyboardShortcuts shortcuts={keyboard_navigation_1.COMMON_SHORTCUTS}>
                <toaster_1.Toaster />
                <Router />
              </keyboard_navigation_1.KeyboardShortcuts>
            </tooltip_1.TooltipProvider>
          </use_theme_1.ThemeProvider>
        </react_query_1.QueryClientProvider>
      </use_auth_1.AuthProvider>
    </error_boundary_1.ErrorBoundary>);
}
exports.default = App;
