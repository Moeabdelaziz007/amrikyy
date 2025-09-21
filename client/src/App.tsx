import { Suspense, lazy } from 'react';
import { Router, Route, Switch } from 'wouter';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ThemeProvider } from '@/hooks/use-theme';
import { AuthProvider } from '@/hooks/use-auth';
import ProtectedRoute from '@/components/auth/protected-route';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { KeyboardNavigation } from '@/components/ui/keyboard-navigation';
import { queryClient } from '@/lib/queryClient';

// Lazy load pages for better performance
const Dashboard = lazy(() => import('@/pages/dashboard'));
const SocialFeed = lazy(() => import('@/pages/social-feed'));
const Workflows = lazy(() => import('@/pages/workflows'));
const AIAgents = lazy(() => import('@/pages/ai-agents'));
const TelegramPage = lazy(() => import('@/pages/telegram'));
const SmartLearningPage = lazy(() => import('@/pages/smart-learning'));
const AdvancedAIToolsPage = lazy(() => import('@/pages/advanced-ai-tools'));
const LearningDashboard = lazy(() => import('@/pages/learning-dashboard'));
const MCPToolsPage = lazy(() => import('@/pages/mcp-tools'));
const PromptLibraryPage = lazy(() => import('@/pages/prompt-library'));
const AnalyticsPage = lazy(() => import('@/pages/analytics'));
const SettingsPage = lazy(() => import('@/pages/settings'));
const AutomationPage = lazy(() => import('@/pages/automation'));
const AutomationTasksPage = lazy(() => import('@/pages/automation-tasks'));
const NotFound = lazy(() => import('@/pages/not-found'));
const DebugView = lazy(() => import('@/pages/DebugView'));
const Workspace = lazy(() => import('@/pages/Workspace'));
const AITravelAgencyPage = lazy(() => import('@/pages/ai-travel-agency'));

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function AppRouter() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<PageLoader />}>
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/social-feed" component={SocialFeed} />
          <Route path="/workflows" component={Workflows} />
          <Route path="/ai-agents" component={AIAgents} />
          <Route path="/telegram" component={TelegramPage} />
          <Route path="/smart-learning" component={SmartLearningPage} />
          <Route path="/advanced-ai-tools" component={AdvancedAIToolsPage} />
          <Route path="/learning" component={LearningDashboard} />
          <Route path="/mcp-tools" component={MCPToolsPage} />
          <Route path="/prompt-library" component={PromptLibraryPage} />
          <Route path="/analytics" component={AnalyticsPage} />
          <Route path="/settings" component={SettingsPage} />
          <Route path="/automation" component={AutomationPage} />
          <Route path="/automation-tasks" component={AutomationTasksPage} />
          <Route path="/debug" component={DebugView} />
          <Route path="/workspace" component={Workspace} />
          <Route path="/ai-travel-agency" component={AITravelAgencyPage} />
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <TooltipProvider>
              <Router>
                <KeyboardNavigation>
                  <AppRouter />
                </KeyboardNavigation>
                <Toaster />
              </Router>
            </TooltipProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}