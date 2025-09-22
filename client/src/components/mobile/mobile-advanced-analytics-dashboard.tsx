// Mobile-Optimized Advanced Analytics Dashboard
// Responsive dashboard specifically designed for mobile devices

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Brain,
  BarChart3,
  Shield,
  FileText,
  TrendingUp,
  TrendingDown,
  Activity,
  Users,
  Clock,
  Target,
  Zap,
  Eye,
  Download,
  RefreshCw,
  Settings,
  Bell,
  Menu,
  X,
  ChevronDown,
  ChevronUp,
  Smartphone,
  Tablet,
  Monitor,
  AlertTriangle,
  CheckCircle,
  Info,
} from 'lucide-react';

import { useFirebaseAnalytics } from '@/hooks/use-firebase-analytics';
import {
  MobileAnalyticsCard,
  MobileSwipeableTabs,
  MobileCollapsibleSection,
  MobilePerformanceChart,
  MobileActionButton,
  MobileLoadingSkeleton,
  MobileErrorState,
  MobileDeviceInfo,
  useMobileDetection,
} from './mobile-analytics-components';

interface MobileAdvancedAnalyticsDashboardProps {
  userId: string;
}

export const MobileAdvancedAnalyticsDashboard: React.FC<
  MobileAdvancedAnalyticsDashboardProps
> = ({ userId }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { isMobile, isTablet, isDesktop } = useMobileDetection();

  // Use Firebase Analytics Hook
  const {
    userHistory,
    userSessions,
    predictiveInsights,
    performanceMetrics,
    securityAlerts,
    loading,
    errors,
    trackAction,
    refreshData,
    generateInsights,
    analyzePatterns,
    monitorPerformance,
    detectAnomalies,
    isInitialized,
  } = useFirebaseAnalytics();

  useEffect(() => {
    loadAnalyticsData();
    setupRealTimeUpdates();
  }, [userId]);

  const loadAnalyticsData = async () => {
    try {
      await refreshData();
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error loading analytics data:', error);
    }
  };

  const setupRealTimeUpdates = () => {
    // Set up real-time updates for mobile
    const interval = setInterval(() => {
      if (isInitialized) {
        refreshData();
      }
    }, 30000); // Update every 30 seconds on mobile

    return () => clearInterval(interval);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await loadAnalyticsData();
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleGenerateInsights = async () => {
    try {
      await generateInsights();
      await loadAnalyticsData();
    } catch (error) {
      console.error('Error generating insights:', error);
    }
  };

  const handleAnalyzePatterns = async () => {
    try {
      await analyzePatterns();
      await loadAnalyticsData();
    } catch (error) {
      console.error('Error analyzing patterns:', error);
    }
  };

  const handleMonitorPerformance = async () => {
    try {
      await monitorPerformance();
      await loadAnalyticsData();
    } catch (error) {
      console.error('Error monitoring performance:', error);
    }
  };

  const handleDetectAnomalies = async () => {
    try {
      await detectAnomalies();
      await loadAnalyticsData();
    } catch (error) {
      console.error('Error detecting anomalies:', error);
    }
  };

  // Overview Tab Content
  const OverviewContent = () => (
    <div className="space-y-4">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-2 gap-3">
        <MobileAnalyticsCard
          title="Total Users"
          value={userHistory?.length || 0}
          change={12}
          changeType="increase"
          icon={<Users className="w-4 h-4" />}
          description="Active users"
        />
        <MobileAnalyticsCard
          title="Sessions"
          value={userSessions?.length || 0}
          change={8}
          changeType="increase"
          icon={<Activity className="w-4 h-4" />}
          description="User sessions"
        />
        <MobileAnalyticsCard
          title="Insights"
          value={predictiveInsights?.length || 0}
          change={15}
          changeType="increase"
          icon={<Brain className="w-4 h-4" />}
          description="AI insights"
        />
        <MobileAnalyticsCard
          title="Alerts"
          value={securityAlerts?.length || 0}
          change={-5}
          changeType="decrease"
          icon={<Shield className="w-4 h-4" />}
          description="Security alerts"
        />
      </div>

      {/* Performance Overview */}
      <MobileCollapsibleSection
        title="Performance Overview"
        icon={<BarChart3 className="w-5 h-5" />}
        defaultOpen={true}
      >
        <div className="space-y-3">
          {performanceMetrics?.slice(0, 3).map((metric, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{metric.name}</span>
                <Badge
                  variant={
                    metric.value > 80
                      ? 'default'
                      : metric.value > 60
                        ? 'secondary'
                        : 'destructive'
                  }
                >
                  {metric.value}%
                </Badge>
              </div>
              <Progress value={metric.value} className="h-2" />
            </div>
          ))}
        </div>
      </MobileCollapsibleSection>

      {/* Recent Insights */}
      <MobileCollapsibleSection
        title="Recent Insights"
        icon={<Brain className="w-5 h-5" />}
        defaultOpen={false}
      >
        <div className="space-y-3">
          {predictiveInsights?.slice(0, 3).map((insight, index) => (
            <Card key={index} className="p-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold">{insight.title}</h4>
                  <Badge
                    variant={insight.confidence > 80 ? 'default' : 'secondary'}
                  >
                    {insight.confidence}%
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {insight.description}
                </p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {insight.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(insight.timestamp).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </MobileCollapsibleSection>
    </div>
  );

  // Insights Tab Content
  const InsightsContent = () => (
    <div className="space-y-4">
      {/* Generate Insights Button */}
      <MobileActionButton
        icon={<Brain className="w-4 h-4" />}
        label="Generate New Insights"
        onClick={handleGenerateInsights}
        variant="default"
        className="w-full"
      />

      {/* Insights List */}
      <div className="space-y-3">
        {predictiveInsights?.map((insight, index) => (
          <Card key={index} className="p-4">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">{insight.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {insight.description}
                  </p>
                </div>
                <Badge
                  variant={insight.confidence > 80 ? 'default' : 'secondary'}
                >
                  {insight.confidence}%
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {insight.category}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {new Date(insight.timestamp).toLocaleDateString()}
                </span>
              </div>

              {insight.recommendations &&
                insight.recommendations.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold">Recommendations:</h4>
                    <ul className="space-y-1">
                      {insight.recommendations
                        .slice(0, 2)
                        .map((rec, recIndex) => (
                          <li
                            key={recIndex}
                            className="text-xs text-muted-foreground"
                          >
                            • {rec}
                          </li>
                        ))}
                    </ul>
                  </div>
                )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  // Performance Tab Content
  const PerformanceContent = () => (
    <div className="space-y-4">
      {/* Performance Actions */}
      <div className="grid grid-cols-2 gap-3">
        <MobileActionButton
          icon={<BarChart3 className="w-4 h-4" />}
          label="Monitor Performance"
          onClick={handleMonitorPerformance}
          variant="outline"
        />
        <MobileActionButton
          icon={<Activity className="w-4 h-4" />}
          label="Analyze Patterns"
          onClick={handleAnalyzePatterns}
          variant="outline"
        />
      </div>

      {/* Performance Metrics */}
      <MobilePerformanceChart
        data={
          performanceMetrics?.map(metric => ({
            label: metric.name,
            value: metric.value,
            color:
              metric.value > 80
                ? '#10b981'
                : metric.value > 60
                  ? '#f59e0b'
                  : '#ef4444',
          })) || []
        }
        title="Performance Metrics"
      />

      {/* Performance Alerts */}
      <MobileCollapsibleSection
        title="Performance Alerts"
        icon={<AlertTriangle className="w-5 h-5" />}
        defaultOpen={false}
      >
        <div className="space-y-2">
          {performanceMetrics
            ?.filter(metric => metric.value < 60)
            .map((metric, index) => (
              <Alert key={index} variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-1">
                    <h4 className="font-semibold text-sm">{metric.name}</h4>
                    <p className="text-xs">
                      Performance is below threshold: {metric.value}%
                    </p>
                  </div>
                </AlertDescription>
              </Alert>
            ))}
        </div>
      </MobileCollapsibleSection>
    </div>
  );

  // Security Tab Content
  const SecurityContent = () => (
    <div className="space-y-4">
      {/* Security Actions */}
      <MobileActionButton
        icon={<Shield className="w-4 h-4" />}
        label="Detect Anomalies"
        onClick={handleDetectAnomalies}
        variant="default"
        className="w-full"
      />

      {/* Security Alerts */}
      <div className="space-y-3">
        {securityAlerts?.map((alert, index) => (
          <Card key={index} className="p-4">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">{alert.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {alert.description}
                  </p>
                </div>
                <Badge
                  variant={
                    alert.severity === 'high'
                      ? 'destructive'
                      : alert.severity === 'medium'
                        ? 'secondary'
                        : 'outline'
                  }
                >
                  {alert.severity}
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {alert.category}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {new Date(alert.timestamp).toLocaleDateString()}
                </span>
              </div>

              {alert.recommendations && alert.recommendations.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold">Recommendations:</h4>
                  <ul className="space-y-1">
                    {alert.recommendations.slice(0, 2).map((rec, recIndex) => (
                      <li
                        key={recIndex}
                        className="text-xs text-muted-foreground"
                      >
                        • {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  // Reports Tab Content
  const ReportsContent = () => (
    <div className="space-y-4">
      {/* Report Actions */}
      <div className="grid grid-cols-2 gap-3">
        <MobileActionButton
          icon={<Download className="w-4 h-4" />}
          label="Export Report"
          onClick={() => {
            /* Export logic */
          }}
          variant="outline"
        />
        <MobileActionButton
          icon={<FileText className="w-4 h-4" />}
          label="Generate Report"
          onClick={() => {
            /* Generate logic */
          }}
          variant="outline"
        />
      </div>

      {/* Recent Reports */}
      <MobileCollapsibleSection
        title="Recent Reports"
        icon={<FileText className="w-5 h-5" />}
        defaultOpen={true}
      >
        <div className="space-y-3">
          {[1, 2, 3].map((report, index) => (
            <Card key={index} className="p-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold">Report #{report}</h4>
                  <Badge variant="outline" className="text-xs">
                    PDF
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Generated on {new Date().toLocaleDateString()}
                </p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Eye className="w-3 h-3 mr-1" />
                    View
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Download className="w-3 h-3 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </MobileCollapsibleSection>
    </div>
  );

  // Loading State
  if (loading) {
    return (
      <div className="space-y-4">
        <MobileLoadingSkeleton lines={5} />
      </div>
    );
  }

  // Error State
  if (errors.length > 0) {
    return (
      <MobileErrorState
        title="Error Loading Analytics"
        message={errors[0]}
        onRetry={handleRefresh}
      />
    );
  }

  // Main Dashboard
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background border-b p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">Advanced Analytics</h1>
            <p className="text-sm text-muted-foreground">
              {lastUpdated
                ? `Last updated: ${lastUpdated.toLocaleTimeString()}`
                : 'Loading...'}
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw
              className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`}
            />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4">
        <MobileSwipeableTabs
          tabs={[
            {
              id: 'overview',
              label: 'Overview',
              icon: <BarChart3 className="w-4 h-4" />,
              content: <OverviewContent />,
            },
            {
              id: 'insights',
              label: 'Insights',
              icon: <Brain className="w-4 h-4" />,
              content: <InsightsContent />,
            },
            {
              id: 'performance',
              label: 'Performance',
              icon: <Activity className="w-4 h-4" />,
              content: <PerformanceContent />,
            },
            {
              id: 'security',
              label: 'Security',
              icon: <Shield className="w-4 h-4" />,
              content: <SecurityContent />,
            },
            {
              id: 'reports',
              label: 'Reports',
              icon: <FileText className="w-4 h-4" />,
              content: <ReportsContent />,
            },
          ]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      {/* Device Info (for debugging) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="p-4">
          <MobileDeviceInfo />
        </div>
      )}
    </div>
  );
};

export default MobileAdvancedAnalyticsDashboard;
