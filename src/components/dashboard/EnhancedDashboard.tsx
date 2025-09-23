import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Brain,
  Mic,
  Camera,
  BarChart3,
  Cpu,
  Clock,
  FolderOpen,
  Bell,
  Activity,
  Zap,
  Shield,
  Settings,
} from 'lucide-react';

interface ToolStatus {
  name: string;
  status: 'active' | 'inactive' | 'error';
  lastUsed: string;
  successRate: number;
  description: string;
  icon: React.ReactNode;
}

interface SystemMetrics {
  cpu: number;
  memory: number;
  disk: number;
  network: number;
}

export const EnhancedDashboard: React.FC = () => {
  const [tools, setTools] = useState<ToolStatus[]>([
    {
      name: 'AI Text Analysis',
      status: 'active',
      lastUsed: '2 minutes ago',
      successRate: 98,
      description: 'Analyze text using spaCy NLP',
      icon: <Brain className="h-5 w-5" />,
    },
    {
      name: 'Speech to Text',
      status: 'active',
      lastUsed: '5 minutes ago',
      successRate: 95,
      description: 'Convert speech to text using Whisper',
      icon: <Mic className="h-5 w-5" />,
    },
    {
      name: 'Image Analysis',
      status: 'active',
      lastUsed: '1 minute ago',
      successRate: 92,
      description: 'Analyze images using OpenCV',
      icon: <Camera className="h-5 w-5" />,
    },
    {
      name: 'Predictive Analysis',
      status: 'active',
      lastUsed: '3 minutes ago',
      successRate: 96,
      description: 'Perform predictive analysis using TensorFlow',
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      name: 'System Health',
      status: 'active',
      lastUsed: '30 seconds ago',
      successRate: 99,
      description: 'Monitor system health and performance',
      icon: <Cpu className="h-5 w-5" />,
    },
    {
      name: 'Task Scheduler',
      status: 'active',
      lastUsed: '10 minutes ago',
      successRate: 100,
      description: 'Schedule and manage automated tasks',
      icon: <Clock className="h-5 w-5" />,
    },
    {
      name: 'File Organizer',
      status: 'active',
      lastUsed: '15 minutes ago',
      successRate: 94,
      description: 'Organize files using AI-based categorization',
      icon: <FolderOpen className="h-5 w-5" />,
    },
    {
      name: 'Notification Manager',
      status: 'active',
      lastUsed: '1 minute ago',
      successRate: 97,
      description: 'Manage notifications with AI-powered filtering',
      icon: <Bell className="h-5 w-5" />,
    },
  ]);

  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpu: 45,
    memory: 62,
    disk: 78,
    network: 23,
  });

  const [recentActivity, setRecentActivity] = useState([
    {
      id: 1,
      action: 'AI Text Analysis',
      status: 'success',
      timestamp: '2 minutes ago',
      details: 'Analyzed 1,247 words with 98% accuracy',
    },
    {
      id: 2,
      action: 'Image Analysis',
      status: 'success',
      timestamp: '5 minutes ago',
      details: 'Detected 3 objects in uploaded image',
    },
    {
      id: 3,
      action: 'Task Scheduler',
      status: 'success',
      timestamp: '10 minutes ago',
      details: 'Scheduled backup task for 2:00 AM',
    },
    {
      id: 4,
      action: 'File Organizer',
      status: 'success',
      timestamp: '15 minutes ago',
      details: 'Organized 25 files into 4 categories',
    },
  ]);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setMetrics(prev => ({
        cpu: Math.max(0, Math.min(100, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.max(
          0,
          Math.min(100, prev.memory + (Math.random() - 0.5) * 5)
        ),
        disk: Math.max(0, Math.min(100, prev.disk + (Math.random() - 0.5) * 2)),
        network: Math.max(
          0,
          Math.min(100, prev.network + (Math.random() - 0.5) * 15)
        ),
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'inactive':
        return 'bg-yellow-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'inactive':
        return (
          <Badge className="bg-yellow-100 text-yellow-800">Inactive</Badge>
        );
      case 'error':
        return <Badge className="bg-red-100 text-red-800">Error</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            🚀 AuraOS Enhanced Dashboard
          </h1>
          <p className="text-slate-300 text-lg">
            AI-Powered Operating System with Advanced Automation Tools
          </p>
        </div>

        {/* System Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">CPU Usage</p>
                  <p className="text-2xl font-bold text-white">
                    {metrics.cpu.toFixed(1)}%
                  </p>
                </div>
                <Cpu className="h-8 w-8 text-blue-400" />
              </div>
              <Progress value={metrics.cpu} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Memory Usage</p>
                  <p className="text-2xl font-bold text-white">
                    {metrics.memory.toFixed(1)}%
                  </p>
                </div>
                <Activity className="h-8 w-8 text-green-400" />
              </div>
              <Progress value={metrics.memory} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Disk Usage</p>
                  <p className="text-2xl font-bold text-white">
                    {metrics.disk.toFixed(1)}%
                  </p>
                </div>
                <FolderOpen className="h-8 w-8 text-yellow-400" />
              </div>
              <Progress value={metrics.disk} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Network</p>
                  <p className="text-2xl font-bold text-white">
                    {metrics.network.toFixed(1)}%
                  </p>
                </div>
                <Zap className="h-8 w-8 text-purple-400" />
              </div>
              <Progress value={metrics.network} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="tools" className="space-y-6">
          <TabsList className="bg-slate-800/50 border-slate-700">
            <TabsTrigger
              value="tools"
              className="data-[state=active]:bg-slate-700"
            >
              AI Tools
            </TabsTrigger>
            <TabsTrigger
              value="activity"
              className="data-[state=active]:bg-slate-700"
            >
              Recent Activity
            </TabsTrigger>
            <TabsTrigger
              value="monitoring"
              className="data-[state=active]:bg-slate-700"
            >
              Monitoring
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="data-[state=active]:bg-slate-700"
            >
              Settings
            </TabsTrigger>
          </TabsList>

          {/* AI Tools Tab */}
          <TabsContent value="tools" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools.map((tool, index) => (
                <Card
                  key={index}
                  className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-colors"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-slate-700 rounded-lg">
                          {tool.icon}
                        </div>
                        <div>
                          <CardTitle className="text-white text-lg">
                            {tool.name}
                          </CardTitle>
                          <p className="text-slate-400 text-sm">
                            {tool.description}
                          </p>
                        </div>
                      </div>
                      {getStatusBadge(tool.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Success Rate</span>
                        <span className="text-white font-medium">
                          {tool.successRate}%
                        </span>
                      </div>
                      <Progress value={tool.successRate} className="h-2" />
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Last Used</span>
                        <span className="text-white">{tool.lastUsed}</span>
                      </div>
                      <div className="flex space-x-2 pt-2">
                        <Button
                          size="sm"
                          className="flex-1 bg-blue-600 hover:bg-blue-700"
                        >
                          Test
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
                        >
                          Configure
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Recent Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>Recent Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map(activity => (
                    <div
                      key={activity.id}
                      className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-3 h-3 rounded-full ${getStatusColor(activity.status)}`}
                        />
                        <div>
                          <p className="text-white font-medium">
                            {activity.action}
                          </p>
                          <p className="text-slate-400 text-sm">
                            {activity.details}
                          </p>
                        </div>
                      </div>
                      <span className="text-slate-400 text-sm">
                        {activity.timestamp}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Monitoring Tab */}
          <TabsContent value="monitoring" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <Shield className="h-5 w-5" />
                    <span>Security Status</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Firewall</span>
                      <Badge className="bg-green-100 text-green-800">
                        Active
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Antivirus</span>
                      <Badge className="bg-green-100 text-green-800">
                        Updated
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Encryption</span>
                      <Badge className="bg-green-100 text-green-800">
                        Enabled
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">
                        AI Threat Detection
                      </span>
                      <Badge className="bg-green-100 text-green-800">
                        Monitoring
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5" />
                    <span>Performance Metrics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-400">Response Time</span>
                        <span className="text-white">45ms</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-400">Throughput</span>
                        <span className="text-white">1.2GB/s</span>
                      </div>
                      <Progress value={78} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-400">Error Rate</span>
                        <span className="text-white">0.1%</span>
                      </div>
                      <Progress value={95} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>System Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-white font-medium mb-3">
                        AI Configuration
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Auto-learning</span>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Enabled
                          </Button>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">
                            Predictive mode
                          </span>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Enabled
                          </Button>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Voice commands</span>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Enabled
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-white font-medium mb-3">
                        Automation Settings
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Auto-backup</span>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Enabled
                          </Button>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">
                            Smart notifications
                          </span>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Enabled
                          </Button>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">
                            File organization
                          </span>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Enabled
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
