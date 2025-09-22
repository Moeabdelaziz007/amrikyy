// Performance Analytics Component
// Advanced performance monitoring and optimization insights

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Activity,
  Zap,
  Clock,
  Target,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
  Settings,
  Monitor,
  Cpu,
  HardDrive,
  Wifi,
} from 'lucide-react';
import AdvancedAnalyticsService, {
  PerformanceMetric,
} from '../../lib/advanced-analytics-service';

interface PerformanceAnalyticsProps {
  userId: string;
}

export const PerformanceAnalytics: React.FC<PerformanceAnalyticsProps> = ({
  userId,
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<'hour' | 'day' | 'week' | 'month'>(
    'day'
  );

  useEffect(() => {
    loadPerformanceMetrics();
    setupRealTimeUpdates();
  }, [userId, timeRange]);

  const loadPerformanceMetrics = async () => {
    try {
      setLoading(true);
      setError(null);

      const data =
        await AdvancedAnalyticsService.monitorPerformanceMetrics(userId);
      setMetrics(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load performance metrics'
      );
    } finally {
      setLoading(false);
    }
  };

  const setupRealTimeUpdates = () => {
    const interval = setInterval(async () => {
      try {
        const data =
          await AdvancedAnalyticsService.monitorPerformanceMetrics(userId);
        setMetrics(data);
      } catch (err) {
        console.error('Failed to update performance metrics:', err);
      }
    }, 60 * 1000); // Update every minute

    return () => clearInterval(interval);
  };

  const handleRefresh = () => {
    loadPerformanceMetrics();
  };

  const handleExportMetrics = () => {
    const metricsData = {
      metrics,
      exportedAt: new Date().toISOString(),
      userId,
      timeRange,
    };

    const blob = new Blob([JSON.stringify(metricsData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `performance-metrics-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getMetricIcon = (metric: string) => {
    switch (metric) {
      case 'session_duration':
        return <Clock className="h-5 w-5" />;
      case 'error_rate':
        return <AlertTriangle className="h-5 w-5" />;
      case 'engagement_score':
        return <Target className="h-5 w-5" />;
      case 'feature_adoption':
        return <Zap className="h-5 w-5" />;
      case 'response_time':
        return <Activity className="h-5 w-5" />;
      case 'memory_usage':
        return <HardDrive className="h-5 w-5" />;
      case 'cpu_usage':
        return <Cpu className="h-5 w-5" />;
      case 'network_latency':
        return <Wifi className="h-5 w-5" />;
      default:
        return <BarChart3 className="h-5 w-5" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'declining':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving':
        return 'text-green-600';
      case 'declining':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getPercentileColor = (percentile: number) => {
    if (percentile > 80) return 'text-green-600';
    if (percentile > 60) return 'text-yellow-600';
    if (percentile > 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getMetricStatus = (metric: PerformanceMetric) => {
    if (metric.percentile > 80)
      return {
        status: 'excellent',
        color: 'text-green-600',
        icon: CheckCircle,
      };
    if (metric.percentile > 60)
      return { status: 'good', color: 'text-blue-600', icon: CheckCircle };
    if (metric.percentile > 40)
      return { status: 'fair', color: 'text-yellow-600', icon: Activity };
    return { status: 'poor', color: 'text-red-600', icon: XCircle };
  };

  const formatMetricValue = (value: number, unit: string) => {
    if (unit === 'percentage') return `${value.toFixed(1)}%`;
    if (unit === 'minutes') return `${value.toFixed(1)}m`;
    if (unit === 'score') return `${value.toFixed(0)}/100`;
    if (unit === 'features') return `${value.toFixed(0)}`;
    if (unit === 'ms') return `${value.toFixed(0)}ms`;
    if (unit === 'MB') return `${value.toFixed(1)}MB`;
    return `${value.toFixed(2)} ${unit}`;
  };

  const filteredMetrics =
    selectedMetric === 'all'
      ? metrics
      : metrics.filter(m => m.metric === selectedMetric);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading performance metrics...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Performance Analytics</h2>
          <p className="text-muted-foreground">
            Real-time performance monitoring and optimization insights
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleExportMetrics} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
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

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium">Time Range:</label>
          <select
            value={timeRange}
            onChange={e =>
              setTimeRange(e.target.value as 'hour' | 'day' | 'week' | 'month')
            }
            className="px-3 py-2 border rounded-md text-sm"
          >
            <option value="hour">Last Hour</option>
            <option value="day">Last Day</option>
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium">Metric:</label>
          <select
            value={selectedMetric}
            onChange={e => setSelectedMetric(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm"
          >
            <option value="all">All Metrics</option>
            <option value="session_duration">Session Duration</option>
            <option value="error_rate">Error Rate</option>
            <option value="engagement_score">Engagement Score</option>
            <option value="feature_adoption">Feature Adoption</option>
            <option value="response_time">Response Time</option>
            <option value="memory_usage">Memory Usage</option>
            <option value="cpu_usage">CPU Usage</option>
            <option value="network_latency">Network Latency</option>
          </select>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.slice(0, 4).map(metric => {
          const status = getMetricStatus(metric);
          const StatusIcon = status.icon;

          return (
            <Card
              key={metric.id}
              className="transition-all duration-200 hover:shadow-lg"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium capitalize">
                  {metric.metric.replace('_', ' ')}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  {getMetricIcon(metric.metric)}
                  <StatusIcon className={`h-4 w-4 ${status.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">
                  {formatMetricValue(metric.value, metric.unit)}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getTrendIcon(metric.trend)}
                    <span
                      className={`text-sm font-medium ${getTrendColor(metric.trend)}`}
                    >
                      {metric.trend}
                    </span>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-sm font-medium ${getPercentileColor(metric.percentile)}`}
                    >
                      {metric.percentile.toFixed(1)}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      percentile
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <Progress value={metric.percentile} className="h-2" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Detailed Metrics */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="benchmarks">Benchmarks</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Metrics List */}
            <Card>
              <CardHeader>
                <CardTitle>All Performance Metrics</CardTitle>
                <CardDescription>
                  Complete list of performance indicators
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredMetrics.map(metric => {
                    const status = getMetricStatus(metric);
                    const StatusIcon = status.icon;

                    return (
                      <div
                        key={metric.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          {getMetricIcon(metric.metric)}
                          <div>
                            <div className="font-medium capitalize">
                              {metric.metric.replace('_', ' ')}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {formatMetricValue(metric.value, metric.unit)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="flex items-center space-x-2">
                              {getTrendIcon(metric.trend)}
                              <span
                                className={`text-sm font-medium ${getTrendColor(metric.trend)}`}
                              >
                                {metric.trend}
                              </span>
                            </div>
                            <div
                              className={`text-sm font-medium ${getPercentileColor(metric.percentile)}`}
                            >
                              {metric.percentile.toFixed(1)}%
                            </div>
                          </div>
                          <StatusIcon className={`h-5 w-5 ${status.color}`} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Performance Chart Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
                <CardDescription>
                  Visual representation of performance over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Performance chart visualization</p>
                    <p className="text-sm">
                      Chart component would be integrated here
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Improving Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  <span>Improving Metrics</span>
                </CardTitle>
                <CardDescription>
                  Metrics showing positive trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {metrics
                    .filter(m => m.trend === 'improving')
                    .map(metric => (
                      <div
                        key={metric.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-2">
                          {getMetricIcon(metric.metric)}
                          <span className="text-sm font-medium capitalize">
                            {metric.metric.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-green-600">
                            {formatMetricValue(metric.value, metric.unit)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {metric.percentile.toFixed(1)}% percentile
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Declining Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingDown className="h-5 w-5 text-red-500" />
                  <span>Declining Metrics</span>
                </CardTitle>
                <CardDescription>Metrics requiring attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {metrics
                    .filter(m => m.trend === 'declining')
                    .map(metric => (
                      <div
                        key={metric.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-2">
                          {getMetricIcon(metric.metric)}
                          <span className="text-sm font-medium capitalize">
                            {metric.metric.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-red-600">
                            {formatMetricValue(metric.value, metric.unit)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {metric.percentile.toFixed(1)}% percentile
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="benchmarks" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Benchmark Comparison */}
            <Card>
              <CardHeader>
                <CardTitle>Benchmark Comparison</CardTitle>
                <CardDescription>
                  How your metrics compare to industry standards
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {metrics.map(metric => (
                    <div key={metric.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium capitalize">
                          {metric.metric.replace('_', ' ')}
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-muted-foreground">
                            {formatMetricValue(metric.value, metric.unit)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            vs{' '}
                            {formatMetricValue(metric.benchmark, metric.unit)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Progress
                          value={(metric.value / metric.benchmark) * 100}
                          className="flex-1 h-2"
                        />
                        <span className="text-xs text-muted-foreground">
                          {((metric.value / metric.benchmark) * 100).toFixed(0)}
                          %
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Score */}
            <Card>
              <CardHeader>
                <CardTitle>Overall Performance Score</CardTitle>
                <CardDescription>Composite performance rating</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <div className="text-4xl font-bold text-primary">
                    {Math.round(
                      metrics.reduce((sum, m) => sum + m.percentile, 0) /
                        metrics.length
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Overall Score
                  </div>
                  <Progress
                    value={
                      metrics.reduce((sum, m) => sum + m.percentile, 0) /
                      metrics.length
                    }
                    className="h-3"
                  />
                  <div className="text-xs text-muted-foreground">
                    Based on {metrics.length} performance metrics
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <div className="space-y-4">
            {/* Performance Alerts */}
            {metrics
              .filter(m => m.percentile < 40 || m.trend === 'declining')
              .map(metric => (
                <Alert
                  key={metric.id}
                  variant={metric.percentile < 20 ? 'destructive' : 'default'}
                >
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="flex items-center justify-between">
                      <div>
                        <strong>{metric.metric.replace('_', ' ')}</strong>{' '}
                        requires attention
                        <div className="text-sm text-muted-foreground mt-1">
                          Current:{' '}
                          {formatMetricValue(metric.value, metric.unit)} |
                          Benchmark:{' '}
                          {formatMetricValue(metric.benchmark, metric.unit)} |
                          Percentile: {metric.percentile.toFixed(1)}%
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <Settings className="h-4 w-4 mr-2" />
                        Optimize
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>
              ))}

            {metrics.filter(m => m.percentile < 40 || m.trend === 'declining')
              .length === 0 && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    All Metrics Performing Well
                  </h3>
                  <p className="text-muted-foreground text-center">
                    No performance alerts at this time. All metrics are within
                    acceptable ranges.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PerformanceAnalytics;
