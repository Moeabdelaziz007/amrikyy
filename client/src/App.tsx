import { Suspense, lazy } from 'react';
import { Router, Route, Switch } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
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
const NotFound = lazy(() => import('@/pages/not-found'));
const DebugView = lazy(() => import('@/pages/DebugView'));
const Workspace = lazy(() => import('@/pages/Workspace'));

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
          <Route path="/debug" component={DebugView} />
          <Route path="/workspace" component={Workspace} />
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