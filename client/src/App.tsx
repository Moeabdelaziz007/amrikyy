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
import { EnhancedToastProvider } from '@/components/ui/enhanced-popup-system';
import { queryClient } from '@/lib/queryClient';

// Lazy load pages for better performance
const AmrikyyPage = lazy(() => import('@/pages/AuraOS'));
const GalleryPage = lazy(() => import('@/pages/Gallery'));
const Dashboard = lazy(() => import('@/pages/dashboard'));
const SocialFeed = lazy(() => import('@/pages/social-feed'));
const Workflows = lazy(() => import('@/pages/workflows'));
const AIAgents = lazy(() => import('@/pages/ai-agents'));
const TelegramPage = lazy(() => import('@/pages/telegram'));
const SmartLearningPage = lazy(() => import('@/pages/smart-learning'));
const AdvancedAIToolsPage = lazy(() => import('@/pages/advanced-ai-tools'));
const LearningDashboard = lazy(() => import('@/pages/learning-dashboard'));
const MCPToolsPage = lazy(() => import('@/pages/mcp-tools').then(m => ({ default: m.default })));
const PromptLibraryPage = lazy(() => import('@/pages/prompt-library').then(m => ({ default: m.default })));
const AnalyticsPage = lazy(() => import('@/pages/analytics').then(m => ({ default: m.default })));
const SettingsPage = lazy(() => import('@/pages/settings').then(m => ({ default: m.default })));
const AutomationPage = lazy(() => import('@/pages/automation').then(m => ({ default: m.default })));
const AutomationTasksPage = lazy(() => import('@/pages/automation-tasks').then(m => ({ default: m.default })));
const PopupShowcasePage = lazy(() => import('@/pages/popup-showcase'));
const PopupTestPage = lazy(() => import('@/pages/popup-test'));
const NotFound = lazy(() => import('@/pages/not-found').then(m => ({ default: m.default })));
const DebugView = lazy(() => import('@/pages/DebugView').then(m => ({ default: m.default })));
const Workspace = lazy(() => import('@/pages/Workspace').then(m => ({ default: m.default })));
const AITravelAgencyPage = lazy(() => import('@/pages/ai-travel-agency').then(m => ({ default: m.default })));
const ModernDesktopPage = lazy(() => import('@/pages/ModernDesktopPage'));

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
          <Route path="/amrikyy" component={AmrikyyPage} />
          <Route path="/gallery" component={GalleryPage} />
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
          <Route path="/popup-showcase" component={PopupShowcasePage} />
          <Route path="/popup-test" component={PopupTestPage} />
          <Route path="/debug" component={DebugView} />
          <Route path="/workspace" component={Workspace} />
          <Route path="/ai-travel-agency" component={AITravelAgencyPage} />
          <Route path="/modern-desktop" component={ModernDesktopPage} />
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
            <EnhancedToastProvider>
              <TooltipProvider>
                <Router>
                  <KeyboardNavigation>
                    <AppRouter />
                  </KeyboardNavigation>
                  <Toaster />
                </Router>
              </TooltipProvider>
            </EnhancedToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
