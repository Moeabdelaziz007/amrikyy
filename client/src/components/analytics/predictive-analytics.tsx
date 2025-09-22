// Predictive Analytics Component
// AI-powered predictions and forecasting

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
  TrendingUp,
  TrendingDown,
  Target,
  Clock,
  Zap,
  Users,
  BarChart3,
  RefreshCw,
  Download,
  Settings,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import AdvancedAnalyticsService, {
  PredictiveInsight,
} from '../../lib/advanced-analytics-service';

interface PredictiveAnalyticsProps {
  userId: string;
}

export const PredictiveAnalytics: React.FC<PredictiveAnalyticsProps> = ({
  userId,
}) => {
  const [insights, setInsights] = useState<PredictiveInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState<
    'short' | 'medium' | 'long'
  >('short');
  const [selectedType, setSelectedType] = useState<string>('all');

  useEffect(() => {
    loadPredictiveInsights();
  }, [userId, selectedTimeframe, selectedType]);

  const loadPredictiveInsights = async () => {
    try {
      setLoading(true);
      setError(null);

      const data =
        await AdvancedAnalyticsService.generatePredictiveInsights(userId);

      // Filter insights based on selected criteria
      let filteredInsights = data;

      if (selectedTimeframe !== 'all') {
        filteredInsights = filteredInsights.filter(
          insight => insight.timeframe === selectedTimeframe
        );
      }

      if (selectedType !== 'all') {
        filteredInsights = filteredInsights.filter(
          insight => insight.type === selectedType
        );
      }

      setInsights(filteredInsights);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load predictive insights'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadPredictiveInsights();
  };

  const handleExportInsights = () => {
    const insightsData = {
      insights,
      exportedAt: new Date().toISOString(),
      userId,
      filters: {
        timeframe: selectedTimeframe,
        type: selectedType,
      },
    };

    const blob = new Blob([JSON.stringify(insightsData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `predictive-insights-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'user_behavior':
        return <Users className="h-5 w-5" />;
      case 'performance':
        return <BarChart3 className="h-5 w-5" />;
      case 'engagement':
        return <Target className="h-5 w-5" />;
      case 'retention':
        return <Clock className="h-5 w-5" />;
      case 'conversion':
        return <Zap className="h-5 w-5" />;
      default:
        return <Brain className="h-5 w-5" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence > 80) return 'text-green-600';
    if (confidence > 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceBgColor = (confidence: number) => {
    if (confidence > 80) return 'bg-green-50 border-green-200';
    if (confidence > 60) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  const getTimeframeLabel = (timeframe: string) => {
    switch (timeframe) {
      case 'short':
        return '1-7 days';
      case 'medium':
        return '1-4 weeks';
      case 'long':
        return '1-12 months';
      default:
        return timeframe;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'user_behavior':
        return 'User Behavior';
      case 'performance':
        return 'Performance';
      case 'engagement':
        return 'Engagement';
      case 'retention':
        return 'Retention';
      case 'conversion':
        return 'Conversion';
      default:
        return type;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-6 w-6 animate-spin" />
        <span className="ml-2">Generating predictive insights...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Predictive Analytics</h2>
          <p className="text-muted-foreground">
            AI-powered predictions and forecasting based on user behavior
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleExportInsights} variant="outline" size="sm">
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
          <label className="text-sm font-medium">Timeframe:</label>
          <select
            value={selectedTimeframe}
            onChange={e =>
              setSelectedTimeframe(
                e.target.value as 'short' | 'medium' | 'long'
              )
            }
            className="px-3 py-2 border rounded-md text-sm"
          >
            <option value="short">Short (1-7 days)</option>
            <option value="medium">Medium (1-4 weeks)</option>
            <option value="long">Long (1-12 months)</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium">Type:</label>
          <select
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm"
          >
            <option value="all">All Types</option>
            <option value="user_behavior">User Behavior</option>
            <option value="performance">Performance</option>
            <option value="engagement">Engagement</option>
            <option value="retention">Retention</option>
            <option value="conversion">Conversion</option>
          </select>
        </div>
      </div>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {insights.map(insight => (
          <Card
            key={insight.id}
            className={`transition-all duration-200 hover:shadow-lg ${getConfidenceBgColor(insight.confidence)}`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getInsightIcon(insight.type)}
                  <CardTitle className="text-lg">
                    {getTypeLabel(insight.type)}
                  </CardTitle>
                </div>
                <Badge variant="outline" className="text-xs">
                  {getTimeframeLabel(insight.timeframe)}
                </Badge>
              </div>
              <CardDescription>
                Confidence:{' '}
                <span
                  className={`font-medium ${getConfidenceColor(insight.confidence)}`}
                >
                  {insight.confidence}%
                </span>
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Prediction */}
              <div>
                <h4 className="text-sm font-medium mb-2">Prediction</h4>
                <p className="text-sm text-muted-foreground">
                  {insight.prediction}
                </p>
              </div>

              {/* Confidence Bar */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">
                    Confidence
                  </span>
                  <span
                    className={`text-xs font-medium ${getConfidenceColor(insight.confidence)}`}
                  >
                    {insight.confidence}%
                  </span>
                </div>
                <Progress value={insight.confidence} className="h-2" />
              </div>

              {/* Key Factors */}
              <div>
                <h4 className="text-sm font-medium mb-2">Key Factors</h4>
                <div className="flex flex-wrap gap-1">
                  {insight.factors.slice(0, 3).map((factor, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {factor.replace('_', ' ')}
                    </Badge>
                  ))}
                  {insight.factors.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{insight.factors.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>

              {/* Top Recommendation */}
              <div>
                <h4 className="text-sm font-medium mb-2">Top Recommendation</h4>
                <p className="text-sm text-muted-foreground">
                  {insight.recommendations[0]}
                </p>
              </div>

              {/* Expiry Warning */}
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>Expires: {insight.expiresAt.toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Insights Message */}
      {insights.length === 0 && !loading && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Brain className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">
              No Predictive Insights Available
            </h3>
            <p className="text-muted-foreground text-center max-w-md">
              We need more user data to generate accurate predictions. Continue
              using the platform to build insights.
            </p>
            <Button onClick={handleRefresh} className="mt-4">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Insights Summary */}
      {insights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Insights Summary</CardTitle>
            <CardDescription>
              Overview of all predictive insights
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {insights.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Insights
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {insights.filter(i => i.confidence > 80).length}
                </div>
                <div className="text-sm text-muted-foreground">
                  High Confidence
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {new Set(insights.map(i => i.type)).size}
                </div>
                <div className="text-sm text-muted-foreground">Categories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round(
                    insights.reduce((sum, i) => sum + i.confidence, 0) /
                      insights.length
                  )}
                  %
                </div>
                <div className="text-sm text-muted-foreground">
                  Avg Confidence
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PredictiveAnalytics;
