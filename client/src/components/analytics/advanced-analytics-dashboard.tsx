// Advanced Analytics Dashboard Component
// Provides AI-powered insights, predictive analytics, and advanced reporting

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Brain, 
  BarChart3, 
  Shield, 
  Clock,
  Target,
  Zap,
  Users,
  Eye,
  Download,
  RefreshCw,
  Settings,
  Bell
} from 'lucide-react';
import AdvancedAnalyticsService, { 
  PredictiveInsight, 
  PerformanceMetric, 
  SecurityAlert, 
  UserBehaviorPattern 
} from '../lib/advanced-analytics-service';
import { useFirebaseAnalytics } from '../../hooks/use-firebase-analytics';

interface AdvancedAnalyticsDashboardProps {
  userId: string;
}

export const AdvancedAnalyticsDashboard: React.FC<AdvancedAnalyticsDashboardProps> = ({ userId }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
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
    isInitialized
  } = useFirebaseAnalytics();

  useEffect(() => {
    loadAnalyticsData();
    setupRealTimeUpdates();
  }, [userId]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [insightsData, metricsData, alertsData, patternsData] = await Promise.all([
        AdvancedAnalyticsService.generatePredictiveInsights(userId),
        AdvancedAnalyticsService.monitorPerformanceMetrics(userId),
        AdvancedAnalyticsService.detectSecurityAnomalies(userId),
        AdvancedAnalyticsService.analyzeBehaviorPatterns(userId)
      ]);

      setInsights(insightsData);
      setMetrics(metricsData);
      setAlerts(alertsData);
      setPatterns(patternsData);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const setupRealTimeUpdates = () => {
    // Set up periodic updates
    const interval = setInterval(async () => {
      try {
        const realTimeData = await AdvancedAnalyticsService.getRealTimeAnalytics(userId);
        setInsights(realTimeData.insights);
        setMetrics(realTimeData.metrics);
        setAlerts(realTimeData.alerts);
        setPatterns(realTimeData.patterns);
        setLastUpdated(new Date());
      } catch (err) {
        console.error('Failed to update real-time data:', err);
      }
    }, 5 * 60 * 1000); // Update every 5 minutes

    return () => clearInterval(interval);
  };

  const handleRefresh = () => {
    loadAnalyticsData();
  };

  const handleExportReport = async () => {
    try {
      const report = await AdvancedAnalyticsService.generateAutomatedReport(userId, 'monthly');
      
      // Create and download report
      const blob = new Blob([report.content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-report-${new Date().toISOString().split('T')[0]}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export report');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading advanced analytics...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Advanced Analytics</h1>
          <p className="text-muted-foreground">
            AI-powered insights and predictive analytics
          </p>
          {lastUpdated && (
            <p className="text-sm text-muted-foreground mt-1">
              Last updated: {lastUpdated.toLocaleString()}
            </p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleExportReport} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Security Alerts */}
      {alerts.length > 0 && (
        <Alert variant={alerts.some(a => a.severity === 'critical') ? 'destructive' : 'default'}>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            {alerts.length} security alert{alerts.length > 1 ? 's' : ''} detected
            {alerts.some(a => a.severity === 'critical') && ' - Critical issues require immediate attention'}
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="patterns">Behavior</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <OverviewTab 
            insights={insights} 
            metrics={metrics} 
            alerts={alerts} 
            patterns={patterns} 
          />
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <InsightsTab insights={insights} />
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <PerformanceTab metrics={metrics} />
        </TabsContent>

        <TabsContent value="patterns" className="space-y-6">
          <PatternsTab patterns={patterns} />
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <SecurityTab alerts={alerts} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Overview Tab Component
const OverviewTab: React.FC<{
  insights: PredictiveInsight[];
  metrics: PerformanceMetric[];
  alerts: SecurityAlert[];
  patterns: UserBehaviorPattern[];
}> = ({ insights, metrics, alerts, patterns }) => {
  const criticalAlerts = alerts.filter(a => a.severity === 'critical').length;
  const highConfidenceInsights = insights.filter(i => i.confidence > 80).length;
  const improvingMetrics = metrics.filter(m => m.trend === 'improving').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Key Metrics Cards */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">AI Insights</CardTitle>
          <Brain className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{insights.length}</div>
          <p className="text-xs text-muted-foreground">
            {highConfidenceInsights} high confidence
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Performance</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.length}</div>
          <p className="text-xs text-muted-foreground">
            {improvingMetrics} improving trends
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Behavior Patterns</CardTitle>
          <Eye className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{patterns.length}</div>
          <p className="text-xs text-muted-foreground">
            Identified patterns
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Security Alerts</CardTitle>
          <Shield className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{alerts.length}</div>
          <p className="text-xs text-muted-foreground">
            {criticalAlerts} critical
          </p>
        </CardContent>
      </Card>

      {/* Recent Insights */}
      <Card className="col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle>Recent AI Insights</CardTitle>
          <CardDescription>Latest predictive insights</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {insights.slice(0, 3).map((insight) => (
              <div key={insight.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    insight.confidence > 80 ? 'bg-green-500' : 
                    insight.confidence > 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{insight.prediction}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {insight.confidence}% confidence
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {insight.timeframe}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Overview */}
      <Card className="col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
          <CardDescription>Key performance indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {metrics.slice(0, 4).map((metric) => (
              <div key={metric.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium capitalize">
                    {metric.metric.replace('_', ' ')}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                      {metric.value} {metric.unit}
                    </span>
                    {metric.trend === 'improving' ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : metric.trend === 'declining' ? (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    ) : (
                      <Activity className="h-4 w-4 text-gray-500" />
                    )}
                  </div>
                </div>
                <Progress value={metric.percentile} className="h-2" />
                <div className="text-xs text-muted-foreground">
                  {metric.percentile.toFixed(1)}% percentile
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Insights Tab Component
const InsightsTab: React.FC<{ insights: PredictiveInsight[] }> = ({ insights }) => {
  const [selectedInsight, setSelectedInsight] = useState<PredictiveInsight | null>(null);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'user_behavior': return <Users className="h-5 w-5" />;
      case 'performance': return <BarChart3 className="h-5 w-5" />;
      case 'engagement': return <Target className="h-5 w-5" />;
      case 'retention': return <Clock className="h-5 w-5" />;
      case 'conversion': return <Zap className="h-5 w-5" />;
      default: return <Brain className="h-5 w-5" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence > 80) return 'text-green-600';
    if (confidence > 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Insights List */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>AI-Generated Insights</CardTitle>
          <CardDescription>Predictive insights based on user behavior analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {insights.map((insight) => (
              <div 
                key={insight.id} 
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedInsight?.id === insight.id ? 'bg-accent' : 'hover:bg-muted'
                }`}
                onClick={() => setSelectedInsight(insight)}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    {getInsightIcon(insight.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-xs">
                        {insight.type.replace('_', ' ')}
                      </Badge>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant={insight.confidence > 80 ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {insight.confidence}% confidence
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {insight.timeframe}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm font-medium mb-2">{insight.prediction}</p>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span>Created: {insight.createdAt.toLocaleDateString()}</span>
                      <span>Expires: {insight.expiresAt.toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insight Details */}
      <Card>
        <CardHeader>
          <CardTitle>Insight Details</CardTitle>
          <CardDescription>
            {selectedInsight ? 'Selected insight information' : 'Select an insight to view details'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {selectedInsight ? (
            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium mb-2">Prediction</div>
                <p className="text-sm text-muted-foreground">
                  {selectedInsight.prediction}
                </p>
              </div>
              
              <div>
                <div className="text-sm font-medium mb-2">Confidence</div>
                <div className="flex items-center space-x-2">
                  <Progress value={selectedInsight.confidence} className="flex-1" />
                  <span className={`text-sm font-medium ${getConfidenceColor(selectedInsight.confidence)}`}>
                    {selectedInsight.confidence}%
                  </span>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium mb-2">Timeframe</div>
                <Badge variant="outline">{selectedInsight.timeframe}</Badge>
              </div>

              <div>
                <div className="text-sm font-medium mb-2">Key Factors</div>
                <div className="flex flex-wrap gap-1">
                  {selectedInsight.factors.map((factor, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {factor.replace('_', ' ')}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-sm font-medium mb-2">Recommendations</div>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {selectedInsight.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-primary">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="text-center text-muted-foreground">
              <Brain className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Click on an insight to view details</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Performance Tab Component
const PerformanceTab: React.FC<{ metrics: PerformanceMetric[] }> = ({ metrics }) => {
  const [selectedMetric, setSelectedMetric] = useState<PerformanceMetric | null>(null);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'declining': return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving': return 'text-green-600';
      case 'declining': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Metrics List */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
          <CardDescription>Real-time performance indicators and trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {metrics.map((metric) => (
              <div 
                key={metric.id} 
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedMetric?.id === metric.id ? 'bg-accent' : 'hover:bg-muted'
                }`}
                onClick={() => setSelectedMetric(metric)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getTrendIcon(metric.trend)}
                    <div>
                      <div className="font-medium capitalize">
                        {metric.metric.replace('_', ' ')}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {metric.value} {metric.unit}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-medium ${getTrendColor(metric.trend)}`}>
                      {metric.trend}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {metric.percentile.toFixed(1)}% percentile
                    </div>
                  </div>
                </div>
                <div className="mt-3">
                  <Progress value={metric.percentile} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Metric Details */}
      <Card>
        <CardHeader>
          <CardTitle>Metric Details</CardTitle>
          <CardDescription>
            {selectedMetric ? 'Selected metric information' : 'Select a metric to view details'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {selectedMetric ? (
            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium mb-2">Current Value</div>
                <div className="text-2xl font-bold">
                  {selectedMetric.value} {selectedMetric.unit}
                </div>
              </div>
              
              <div>
                <div className="text-sm font-medium mb-2">Trend</div>
                <div className="flex items-center space-x-2">
                  {getTrendIcon(selectedMetric.trend)}
                  <span className={`text-sm font-medium ${getTrendColor(selectedMetric.trend)}`}>
                    {selectedMetric.trend}
                  </span>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium mb-2">Percentile</div>
                <div className="space-y-2">
                  <Progress value={selectedMetric.percentile} className="h-2" />
                  <div className="text-sm text-muted-foreground">
                    {selectedMetric.percentile.toFixed(1)}% percentile
                  </div>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium mb-2">Benchmark</div>
                <div className="text-sm text-muted-foreground">
                  {selectedMetric.benchmark} {selectedMetric.unit}
                </div>
              </div>

              <div>
                <div className="text-sm font-medium mb-2">Last Updated</div>
                <div className="text-sm text-muted-foreground">
                  {selectedMetric.timestamp.toLocaleString()}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-muted-foreground">
              <BarChart3 className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Click on a metric to view details</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Patterns Tab Component
const PatternsTab: React.FC<{ patterns: UserBehaviorPattern[] }> = ({ patterns }) => {
  const [selectedPattern, setSelectedPattern] = useState<UserBehaviorPattern | null>(null);

  const getConfidenceColor = (confidence: number) => {
    if (confidence > 80) return 'text-green-600';
    if (confidence > 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Patterns List */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Behavior Patterns</CardTitle>
          <CardDescription>Identified user behavior patterns and trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {patterns.map((pattern) => (
              <div 
                key={pattern.id} 
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedPattern?.id === pattern.id ? 'bg-accent' : 'hover:bg-muted'
                }`}
                onClick={() => setSelectedPattern(pattern)}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <Eye className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-xs">
                        Pattern
                      </Badge>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant={pattern.confidence > 80 ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {pattern.confidence}% confidence
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {pattern.frequency} occurrences
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm font-medium mb-2">{pattern.pattern}</p>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span>Last seen: {pattern.lastSeen.toLocaleDateString()}</span>
                      <span>Created: {pattern.createdAt.toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pattern Details */}
      <Card>
        <CardHeader>
          <CardTitle>Pattern Details</CardTitle>
          <CardDescription>
            {selectedPattern ? 'Selected pattern information' : 'Select a pattern to view details'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {selectedPattern ? (
            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium mb-2">Pattern Description</div>
                <p className="text-sm text-muted-foreground">
                  {selectedPattern.pattern}
                </p>
              </div>
              
              <div>
                <div className="text-sm font-medium mb-2">Confidence</div>
                <div className="flex items-center space-x-2">
                  <Progress value={selectedPattern.confidence} className="flex-1" />
                  <span className={`text-sm font-medium ${getConfidenceColor(selectedPattern.confidence)}`}>
                    {selectedPattern.confidence}%
                  </span>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium mb-2">Frequency</div>
                <div className="text-sm text-muted-foreground">
                  {selectedPattern.frequency} occurrences
                </div>
              </div>

              <div>
                <div className="text-sm font-medium mb-2">Triggers</div>
                <div className="flex flex-wrap gap-1">
                  {selectedPattern.triggers.map((trigger, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {trigger.replace('_', ' ')}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-sm font-medium mb-2">Outcomes</div>
                <div className="flex flex-wrap gap-1">
                  {selectedPattern.outcomes.map((outcome, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {outcome.replace('_', ' ')}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-sm font-medium mb-2">Last Seen</div>
                <div className="text-sm text-muted-foreground">
                  {selectedPattern.lastSeen.toLocaleString()}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-muted-foreground">
              <Eye className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Click on a pattern to view details</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Security Tab Component
const SecurityTab: React.FC<{ alerts: SecurityAlert[] }> = ({ alerts }) => {
  const [selectedAlert, setSelectedAlert] = useState<SecurityAlert | null>(null);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'high': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'medium': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'low': return <Bell className="h-4 w-4 text-blue-500" />;
      default: return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Alerts List */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Security Alerts</CardTitle>
          <CardDescription>Security monitoring and anomaly detection</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div 
                key={alert.id} 
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedAlert?.id === alert.id ? 'bg-accent' : 'hover:bg-muted'
                }`}
                onClick={() => setSelectedAlert(alert)}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    {getSeverityIcon(alert.severity)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getSeverityColor(alert.severity)}`}
                      >
                        {alert.severity}
                      </Badge>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {alert.type.replace('_', ' ')}
                        </Badge>
                        {alert.resolved && (
                          <Badge variant="default" className="text-xs">
                            Resolved
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-sm font-medium mb-2">{alert.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span>Detected: {alert.timestamp.toLocaleDateString()}</span>
                      {alert.resolvedAt && (
                        <span>Resolved: {alert.resolvedAt.toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alert Details */}
      <Card>
        <CardHeader>
          <CardTitle>Alert Details</CardTitle>
          <CardDescription>
            {selectedAlert ? 'Selected alert information' : 'Select an alert to view details'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {selectedAlert ? (
            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium mb-2">Description</div>
                <p className="text-sm text-muted-foreground">
                  {selectedAlert.description}
                </p>
              </div>
              
              <div>
                <div className="text-sm font-medium mb-2">Severity</div>
                <div className="flex items-center space-x-2">
                  {getSeverityIcon(selectedAlert.severity)}
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getSeverityColor(selectedAlert.severity)}`}
                  >
                    {selectedAlert.severity}
                  </Badge>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium mb-2">Type</div>
                <Badge variant="outline" className="text-xs">
                  {selectedAlert.type.replace('_', ' ')}
                </Badge>
              </div>

              <div>
                <div className="text-sm font-medium mb-2">Status</div>
                <Badge variant={selectedAlert.resolved ? 'default' : 'destructive'} className="text-xs">
                  {selectedAlert.resolved ? 'Resolved' : 'Active'}
                </Badge>
              </div>

              <div>
                <div className="text-sm font-medium mb-2">Details</div>
                <div className="text-sm text-muted-foreground">
                  <pre className="whitespace-pre-wrap text-xs">
                    {JSON.stringify(selectedAlert.details, null, 2)}
                  </pre>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium mb-2">Detected</div>
                <div className="text-sm text-muted-foreground">
                  {selectedAlert.timestamp.toLocaleString()}
                </div>
              </div>

              {selectedAlert.resolvedAt && (
                <div>
                  <div className="text-sm font-medium mb-2">Resolved</div>
                  <div className="text-sm text-muted-foreground">
                    {selectedAlert.resolvedAt.toLocaleString()}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-muted-foreground">
              <Shield className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Click on an alert to view details</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedAnalyticsDashboard;
