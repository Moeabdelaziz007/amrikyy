import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Activity, 
  Clock, 
  Zap, 
  Target, 
  Award, 
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Search,
  Eye,
  Settings,
  PieChart,
  LineChart,
  BarChart,
  MousePointer,
  Keyboard,
  Monitor,
  Smartphone,
  Globe,
  Database,
  Cpu,
  HardDrive,
  Wifi,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface AnalyticsMetric {
  id: string;
  name: string;
  value: number;
  previousValue: number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  unit: string;
  category: string;
}

interface UserActivity {
  id: string;
  userId: string;
  userName: string;
  action: string;
  timestamp: Date;
  duration: number;
  device: string;
  location: string;
  success: boolean;
}

interface PerformanceData {
  timestamp: Date;
  cpu: number;
  memory: number;
  disk: number;
  network: number;
  responseTime: number;
  errorRate: number;
}

interface UsageStatistics {
  totalUsers: number;
  activeUsers: number;
  totalSessions: number;
  averageSessionDuration: number;
  pageViews: number;
  bounceRate: number;
  conversionRate: number;
  topPages: Array<{ page: string; views: number; uniqueViews: number }>;
  topDevices: Array<{ device: string; percentage: number }>;
  topCountries: Array<{ country: string; percentage: number }>;
  hourlyDistribution: Array<{ hour: number; users: number }>;
}

export const EnhancedAnalyticsDashboard: React.FC = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<AnalyticsMetric[]>([]);
  const [userActivities, setUserActivities] = useState<UserActivity[]>([]);
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [usageStats, setUsageStats] = useState<UsageStatistics>({
    totalUsers: 0,
    activeUsers: 0,
    totalSessions: 0,
    averageSessionDuration: 0,
    pageViews: 0,
    bounceRate: 0,
    conversionRate: 0,
    topPages: [],
    topDevices: [],
    topCountries: [],
    hourlyDistribution: []
  });
  const [selectedTab, setSelectedTab] = useState<'overview' | 'users' | 'performance' | 'real-time'>('overview');
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('24h');
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    loadAnalyticsData();
    
    // Set up real-time updates
    const interval = setInterval(() => {
      if (autoRefresh) {
        loadAnalyticsData();
      }
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [timeRange, autoRefresh]);

  const loadAnalyticsData = async () => {
    try {
      await Promise.all([
        loadMetrics(),
        loadUserActivities(),
        loadPerformanceData(),
        loadUsageStatistics()
      ]);
    } catch (error) {
      console.error('Failed to load analytics data:', error);
      // Use mock data if API fails
      setMetrics(getMockMetrics());
      setUserActivities(getMockUserActivities());
      setPerformanceData(getMockPerformanceData());
      setUsageStats(getMockUsageStatistics());
    } finally {
      setLoading(false);
    }
  };

  const loadMetrics = async () => {
    try {
      const response = await fetch(`/api/analytics/metrics?range=${timeRange}`);
      const data = await response.json();
      
      if (data.metrics) {
        setMetrics(data.metrics);
      } else {
        setMetrics(getMockMetrics());
      }
    } catch (error) {
      console.error('Failed to load metrics:', error);
      setMetrics(getMockMetrics());
    }
  };

  const loadUserActivities = async () => {
    try {
      const response = await fetch(`/api/analytics/activities?range=${timeRange}`);
      const data = await response.json();
      
      if (data.activities) {
        setUserActivities(data.activities.map((activity: any) => ({
          ...activity,
          timestamp: new Date(activity.timestamp)
        })));
      } else {
        setUserActivities(getMockUserActivities());
      }
    } catch (error) {
      console.error('Failed to load user activities:', error);
      setUserActivities(getMockUserActivities());
    }
  };

  const loadPerformanceData = async () => {
    try {
      const response = await fetch(`/api/analytics/performance?range=${timeRange}`);
      const data = await response.json();
      
      if (data.performance) {
        setPerformanceData(data.performance.map((point: any) => ({
          ...point,
          timestamp: new Date(point.timestamp)
        })));
      } else {
        setPerformanceData(getMockPerformanceData());
      }
    } catch (error) {
      console.error('Failed to load performance data:', error);
      setPerformanceData(getMockPerformanceData());
    }
  };

  const loadUsageStatistics = async () => {
    try {
      const response = await fetch(`/api/analytics/usage?range=${timeRange}`);
      const data = await response.json();
      
      if (data.statistics) {
        setUsageStats(data.statistics);
      } else {
        setUsageStats(getMockUsageStatistics());
      }
    } catch (error) {
      console.error('Failed to load usage statistics:', error);
      setUsageStats(getMockUsageStatistics());
    }
  };

  const exportData = async (format: 'csv' | 'json' | 'pdf') => {
    try {
      const response = await fetch(`/api/analytics/export?format=${format}&range=${timeRange}`, {
        method: 'POST'
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics-${timeRange}.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        alert(`Analytics data exported as ${format.toUpperCase()} successfully!`);
      } else {
        throw new Error('Export failed');
      }
    } catch (error) {
      console.error('Failed to export data:', error);
      alert(`Failed to export data as ${format.toUpperCase()}. Please try again.`);
    }
  };

  const getChangeIcon = (changeType: string) => {
    switch (changeType) {
      case 'increase':
        return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'decrease':
        return <TrendingDown className="w-4 h-4 text-red-400" />;
      default:
        return <Activity className="w-4 h-4 text-gray-400" />;
    }
  };

  const getChangeColor = (changeType: string) => {
    switch (changeType) {
      case 'increase':
        return 'text-green-400';
      case 'decrease':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getDeviceIcon = (device: string) => {
    switch (device.toLowerCase()) {
      case 'desktop':
        return <Monitor className="w-4 h-4 text-blue-400" />;
      case 'mobile':
        return <Smartphone className="w-4 h-4 text-green-400" />;
      case 'tablet':
        return <Monitor className="w-4 h-4 text-purple-400" />;
      default:
        return <Globe className="w-4 h-4 text-gray-400" />;
    }
  };

  const getActivityIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case 'login':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'logout':
        return <XCircle className="w-4 h-4 text-red-400" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      default:
        return <Activity className="w-4 h-4 text-blue-400" />;
    }
  };

  // Mock data functions
  const getMockMetrics = (): AnalyticsMetric[] => [
    {
      id: '1',
      name: 'Total Users',
      value: 1247,
      previousValue: 1189,
      change: 4.9,
      changeType: 'increase',
      unit: 'users',
      category: 'users'
    },
    {
      id: '2',
      name: 'Active Sessions',
      value: 89,
      previousValue: 76,
      change: 17.1,
      changeType: 'increase',
      unit: 'sessions',
      category: 'engagement'
    },
    {
      id: '3',
      name: 'Page Views',
      value: 5672,
      previousValue: 5234,
      change: 8.4,
      changeType: 'increase',
      unit: 'views',
      category: 'traffic'
    },
    {
      id: '4',
      name: 'Bounce Rate',
      value: 34.2,
      previousValue: 38.7,
      change: -11.6,
      changeType: 'decrease',
      unit: '%',
      category: 'engagement'
    },
    {
      id: '5',
      name: 'Conversion Rate',
      value: 2.8,
      previousValue: 2.3,
      change: 21.7,
      changeType: 'increase',
      unit: '%',
      category: 'conversion'
    },
    {
      id: '6',
      name: 'Average Response Time',
      value: 245,
      previousValue: 289,
      change: -15.2,
      changeType: 'decrease',
      unit: 'ms',
      category: 'performance'
    }
  ];

  const getMockUserActivities = (): UserActivity[] => [
    {
      id: '1',
      userId: 'user1',
      userName: 'John Doe',
      action: 'login',
      timestamp: new Date(Date.now() - 1000 * 60 * 2),
      duration: 0,
      device: 'desktop',
      location: 'New York, US',
      success: true
    },
    {
      id: '2',
      userId: 'user2',
      userName: 'Jane Smith',
      action: 'file_upload',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      duration: 1200,
      device: 'mobile',
      location: 'London, UK',
      success: true
    },
    {
      id: '3',
      userId: 'user3',
      userName: 'Mike Johnson',
      action: 'error',
      timestamp: new Date(Date.now() - 1000 * 60 * 8),
      duration: 500,
      device: 'tablet',
      location: 'Tokyo, JP',
      success: false
    },
    {
      id: '4',
      userId: 'user4',
      userName: 'Sarah Wilson',
      action: 'api_call',
      timestamp: new Date(Date.now() - 1000 * 60 * 12),
      duration: 340,
      device: 'desktop',
      location: 'Sydney, AU',
      success: true
    }
  ];

  const getMockPerformanceData = (): PerformanceData[] => [
    {
      timestamp: new Date(Date.now() - 1000 * 60 * 10),
      cpu: 45.2,
      memory: 67.8,
      disk: 23.4,
      network: 12.6,
      responseTime: 245,
      errorRate: 0.2
    },
    {
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      cpu: 52.1,
      memory: 71.2,
      disk: 24.8,
      network: 15.3,
      responseTime: 289,
      errorRate: 0.4
    },
    {
      timestamp: new Date(Date.now()),
      cpu: 48.7,
      memory: 69.5,
      disk: 23.9,
      network: 13.8,
      responseTime: 267,
      errorRate: 0.3
    }
  ];

  const getMockUsageStatistics = (): UsageStatistics => ({
    totalUsers: 1247,
    activeUsers: 89,
    totalSessions: 456,
    averageSessionDuration: 18.5,
    pageViews: 5672,
    bounceRate: 34.2,
    conversionRate: 2.8,
    topPages: [
      { page: '/dashboard', views: 1234, uniqueViews: 567 },
      { page: '/files', views: 987, uniqueViews: 445 },
      { page: '/settings', views: 654, uniqueViews: 234 },
      { page: '/analytics', views: 432, uniqueViews: 189 }
    ],
    topDevices: [
      { device: 'Desktop', percentage: 65.2 },
      { device: 'Mobile', percentage: 28.7 },
      { device: 'Tablet', percentage: 6.1 }
    ],
    topCountries: [
      { country: 'United States', percentage: 34.5 },
      { country: 'United Kingdom', percentage: 18.2 },
      { country: 'Germany', percentage: 12.8 },
      { country: 'Canada', percentage: 8.9 }
    ],
    hourlyDistribution: Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      users: Math.floor(Math.random() * 50) + 10
    }))
  });

  if (loading) {
    return (
      <div className="flex h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400 mx-auto mb-4"></div>
            <p className="text-white text-lg">Loading analytics...</p>
            <p className="text-gray-400">Processing data insights</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <BarChart3 className="w-8 h-8 text-purple-400" />
            <div>
              <h1 className="text-2xl font-bold text-white">Analytics Dashboard</h1>
              <p className="text-gray-400">Real-time insights and performance metrics</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="rounded"
              />
              <span className="text-gray-400 text-sm">Auto-refresh</span>
            </div>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="bg-white/5 border border-white/20 text-white rounded px-3 py-2"
            >
              <option value="1h">Last Hour</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
            <Button
              onClick={loadAnalyticsData}
              variant="outline"
              className="text-purple-400 border-purple-400 hover:bg-purple-400 hover:text-white"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button
              onClick={() => exportData('csv')}
              variant="outline"
              className="text-green-400 border-green-400 hover:bg-green-400 hover:text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="p-6 border-b border-white/10 bg-black/20">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {metrics.map(metric => (
              <Card key={metric.id} className="bg-white/5 border-white/10">
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    {getChangeIcon(metric.changeType)}
                  </div>
                  <p className="text-2xl font-bold text-white">{metric.value.toLocaleString()}</p>
                  <p className="text-gray-400 text-sm mb-1">{metric.name}</p>
                  <p className={`text-xs ${getChangeColor(metric.changeType)}`}>
                    {metric.change > 0 ? '+' : ''}{metric.change.toFixed(1)}% vs previous
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'performance', label: 'Performance', icon: Zap },
            { id: 'real-time', label: 'Real-time', icon: Activity }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as any)}
              className={`flex items-center space-x-2 px-6 py-4 border-b-2 transition-colors ${
                selectedTab === tab.id
                  ? 'border-purple-400 text-purple-400 bg-purple-400/10'
                  : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <ScrollArea className="flex-1">
          <div className="p-6">
            {selectedTab === 'overview' && (
              <div className="space-y-6">
                {/* Top Pages */}
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center space-x-2">
                      <Target className="w-5 h-5 text-blue-400" />
                      <span>Top Pages</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {usageStats.topPages.map((page, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <span className="text-purple-400 font-bold">#{index + 1}</span>
                            <span className="text-white">{page.page}</span>
                          </div>
                          <div className="text-right">
                            <p className="text-white font-semibold">{page.views.toLocaleString()} views</p>
                            <p className="text-gray-400 text-sm">{page.uniqueViews.toLocaleString()} unique</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Device Distribution */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center space-x-2">
                        <Monitor className="w-5 h-5 text-green-400" />
                        <span>Device Distribution</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {usageStats.topDevices.map((device, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              {getDeviceIcon(device.device)}
                              <span className="text-white">{device.device}</span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <div className="w-24 bg-gray-700 rounded-full h-2">
                                <div 
                                  className="bg-green-500 h-2 rounded-full"
                                  style={{ width: `${device.percentage}%` }}
                                />
                              </div>
                              <span className="text-white font-semibold">{device.percentage}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center space-x-2">
                        <Globe className="w-5 h-5 text-blue-400" />
                        <span>Top Countries</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {usageStats.topCountries.map((country, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className="text-white">{country.country}</span>
                            <div className="flex items-center space-x-3">
                              <div className="w-24 bg-gray-700 rounded-full h-2">
                                <div 
                                  className="bg-blue-500 h-2 rounded-full"
                                  style={{ width: `${country.percentage}%` }}
                                />
                              </div>
                              <span className="text-white font-semibold">{country.percentage}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {selectedTab === 'users' && (
              <div className="space-y-6">
                {/* User Activities */}
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center space-x-2">
                      <Activity className="w-5 h-5 text-green-400" />
                      <span>Recent User Activities</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {userActivities.map(activity => (
                        <div key={activity.id} className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-white/10">
                          <div className="flex items-center space-x-4">
                            {getActivityIcon(activity.action)}
                            <div>
                              <h4 className="text-white font-semibold">{activity.userName}</h4>
                              <p className="text-gray-400 text-sm">{activity.action.replace('_', ' ')}</p>
                              <p className="text-gray-500 text-xs">
                                {activity.timestamp.toLocaleString()} • {activity.duration}ms
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-2">
                              {getDeviceIcon(activity.device)}
                              <span className="text-gray-400 text-sm">{activity.device}</span>
                            </div>
                            <Badge variant="outline" className={
                              activity.success ? 'text-green-400 border-green-400' : 'text-red-400 border-red-400'
                            }>
                              {activity.success ? 'Success' : 'Failed'}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* User Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="bg-white/5 border-white/10">
                    <CardContent className="p-6 text-center">
                      <Users className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                      <p className="text-3xl font-bold text-white">{usageStats.totalUsers}</p>
                      <p className="text-gray-400">Total Users</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-white/5 border-white/10">
                    <CardContent className="p-6 text-center">
                      <Activity className="w-12 h-12 text-green-400 mx-auto mb-4" />
                      <p className="text-3xl font-bold text-white">{usageStats.activeUsers}</p>
                      <p className="text-gray-400">Active Users</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-white/5 border-white/10">
                    <CardContent className="p-6 text-center">
                      <Clock className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                      <p className="text-3xl font-bold text-white">{usageStats.averageSessionDuration}m</p>
                      <p className="text-gray-400">Avg Session</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {selectedTab === 'performance' && (
              <div className="space-y-6">
                {/* Performance Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="bg-white/5 border-white/10">
                    <CardContent className="p-4 text-center">
                      <Cpu className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-white">
                        {performanceData[performanceData.length - 1]?.cpu.toFixed(1)}%
                      </p>
                      <p className="text-gray-400 text-sm">CPU Usage</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-white/5 border-white/10">
                    <CardContent className="p-4 text-center">
                      <Database className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-white">
                        {performanceData[performanceData.length - 1]?.memory.toFixed(1)}%
                      </p>
                      <p className="text-gray-400 text-sm">Memory Usage</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-white/5 border-white/10">
                    <CardContent className="p-4 text-center">
                      <HardDrive className="w-8 h-8 text-green-400 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-white">
                        {performanceData[performanceData.length - 1]?.disk.toFixed(1)}%
                      </p>
                      <p className="text-gray-400 text-sm">Disk Usage</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-white/5 border-white/10">
                    <CardContent className="p-4 text-center">
                      <Wifi className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-white">
                        {performanceData[performanceData.length - 1]?.network.toFixed(1)}%
                      </p>
                      <p className="text-gray-400 text-sm">Network</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Performance Chart */}
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center space-x-2">
                      <LineChart className="w-5 h-5 text-purple-400" />
                      <span>Performance Trends</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center">
                      <div className="text-center">
                        <BarChart3 className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                        <p className="text-white text-lg">Performance Chart</p>
                        <p className="text-gray-400">Interactive performance visualization</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {selectedTab === 'real-time' && (
              <div className="space-y-6">
                {/* Real-time Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center space-x-2">
                        <Activity className="w-5 h-5 text-green-400" />
                        <span>Live Activity</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {userActivities.slice(0, 5).map(activity => (
                          <div key={activity.id} className="flex items-center space-x-3 p-3 bg-black/20 rounded">
                            <div className={`w-2 h-2 rounded-full ${activity.success ? 'bg-green-500' : 'bg-red-500'}`} />
                            <span className="text-white text-sm">{activity.userName}</span>
                            <span className="text-gray-400 text-sm">{activity.action}</span>
                            <span className="text-gray-500 text-xs ml-auto">
                              {activity.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center space-x-2">
                        <Zap className="w-5 h-5 text-yellow-400" />
                        <span>System Status</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Response Time</span>
                          <span className="text-white font-semibold">
                            {performanceData[performanceData.length - 1]?.responseTime}ms
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Error Rate</span>
                          <span className="text-white font-semibold">
                            {performanceData[performanceData.length - 1]?.errorRate}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Uptime</span>
                          <span className="text-green-400 font-semibold">99.9%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Active Connections</span>
                          <span className="text-white font-semibold">1,247</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
