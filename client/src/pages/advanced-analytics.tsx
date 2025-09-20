// Advanced Analytics Page
// Main page for advanced analytics features

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  BarChart3, 
  Shield, 
  FileText, 
  TrendingUp, 
  Users, 
  Activity, 
  Zap, 
  Eye, 
  Clock,
  AlertTriangle,
  CheckCircle,
  Settings,
  RefreshCw,
  Download,
  Plus
} from 'lucide-react';
import AdvancedAnalyticsDashboard from '../components/analytics/advanced-analytics-dashboard';
import PredictiveAnalytics from '../components/analytics/predictive-analytics';
import PerformanceAnalytics from '../components/analytics/performance-analytics';
import SecurityAnalytics from '../components/analytics/security-analytics';
import AutomatedReports from '../components/analytics/automated-reports';
import { useAuth } from '../hooks/use-auth';

const AdvancedAnalyticsPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading advanced analytics...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertTriangle className="h-8 w-8 mx-auto mb-4 text-red-500" />
          <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
          <p className="text-muted-foreground">Please log in to access advanced analytics.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Advanced Analytics</h1>
              <p className="text-xl text-muted-foreground">
                AI-powered insights, predictive analytics, and comprehensive reporting
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export All
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Insights</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">
                +3 from last week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Performance Score</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87/100</div>
              <p className="text-xs text-muted-foreground">
                +5 from last week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Security Alerts</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">
                0 critical issues
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reports Generated</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                This month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="predictive">Predictive</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <AdvancedAnalyticsDashboard userId={user.uid} />
          </TabsContent>

          <TabsContent value="predictive" className="space-y-6">
            <PredictiveAnalytics userId={user.uid} />
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <PerformanceAnalytics userId={user.uid} />
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <SecurityAnalytics userId={user.uid} />
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <AutomatedReports userId={user.uid} />
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* AI Insights */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Brain className="h-5 w-5" />
                    <span>AI-Generated Insights</span>
                  </CardTitle>
                  <CardDescription>Latest AI-powered insights and recommendations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <Badge variant="outline" className="text-xs">High Confidence</Badge>
                      </div>
                      <p className="text-sm font-medium mb-2">
                        User engagement is increasing. Expected session duration will be longer in the next week.
                      </p>
                      <div className="text-xs text-muted-foreground">
                        Confidence: 85% • Timeframe: Short (1-7 days)
                      </div>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Users className="h-4 w-4 text-blue-500" />
                        <Badge variant="outline" className="text-xs">Medium Confidence</Badge>
                      </div>
                      <p className="text-sm font-medium mb-2">
                        User retention is improving. Expected to maintain engagement in the next month.
                      </p>
                      <div className="text-xs text-muted-foreground">
                        Confidence: 72% • Timeframe: Medium (1-4 weeks)
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                        <Badge variant="outline" className="text-xs">High Confidence</Badge>
                      </div>
                      <p className="text-sm font-medium mb-2">
                        High error rate detected (3.2%). Performance issues may increase user frustration.
                      </p>
                      <div className="text-xs text-muted-foreground">
                        Confidence: 91% • Timeframe: Short (1-7 days)
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Performance Insights */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5" />
                    <span>Performance Insights</span>
                  </CardTitle>
                  <CardDescription>Key performance indicators and trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium">Session Duration</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-green-600">18.5m</div>
                        <div className="text-xs text-muted-foreground">+2.3m</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium">Engagement Score</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-green-600">87/100</div>
                        <div className="text-xs text-muted-foreground">+5</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                        <span className="text-sm font-medium">Error Rate</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-orange-600">3.2%</div>
                        <div className="text-xs text-muted-foreground">+0.8%</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium">Feature Adoption</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-green-600">6 features</div>
                        <div className="text-xs text-muted-foreground">+1</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Security Insights */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5" />
                    <span>Security Insights</span>
                  </CardTitle>
                  <CardDescription>Security monitoring and threat detection</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium">Threat Detection</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-green-600">99.8%</div>
                        <div className="text-xs text-muted-foreground">Excellent</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium">Response Time</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-green-600">2.3s</div>
                        <div className="text-xs text-muted-foreground">Fast</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm font-medium">Active Alerts</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-yellow-600">2</div>
                        <div className="text-xs text-muted-foreground">Low priority</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium">System Uptime</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-green-600">99.9%</div>
                        <div className="text-xs text-muted-foreground">Excellent</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Reports */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5" />
                    <span>Recent Reports</span>
                  </CardTitle>
                  <CardDescription>Latest automated reports</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Clock className="h-4 w-4 text-blue-500" />
                        <div>
                          <div className="text-sm font-medium">Daily Analytics Report</div>
                          <div className="text-xs text-muted-foreground">Generated 2 hours ago</div>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <BarChart3 className="h-4 w-4 text-green-500" />
                        <div>
                          <div className="text-sm font-medium">Weekly Performance Report</div>
                          <div className="text-xs text-muted-foreground">Generated 1 day ago</div>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Shield className="h-4 w-4 text-purple-500" />
                        <div>
                          <div className="text-sm font-medium">Monthly Security Report</div>
                          <div className="text-xs text-muted-foreground">Generated 1 week ago</div>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdvancedAnalyticsPage;
