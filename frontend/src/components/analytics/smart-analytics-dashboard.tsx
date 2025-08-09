'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  BarChart3,
  TrendingUp,
  Users,
  Zap,
  RefreshCw,
  Download,
  Database,
  Brain,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  Eye,
  MessageSquare,
  Share2,
  Target
} from 'lucide-react'

interface AnalyticsData {
  totalQueries: number
  successRate: number
  responseTime: number
  activeUsers: number
  aiAccuracy: number
  vectorDbSize: string
  systemHealth: number
  aiUsage: number
  trends: {
    queries: number
    successRate: number
    responseTime: number
    users: number
  }
}

interface LiveActivity {
  id: string
  type: 'query' | 'success' | 'error'
  message: string
  timestamp: string
  responseTime?: number
  accuracy?: number
}

export function SmartAnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData>({
    totalQueries: 12847,
    successRate: 98.3,
    responseTime: 1.2,
    activeUsers: 342,
    aiAccuracy: 94.7,
    vectorDbSize: '25.6K',
    systemHealth: 99.1,
    aiUsage: 67.8,
    trends: {
      queries: 12.5,
      successRate: 2.1,
      responseTime: -8.3,
      users: 5.7
    }
  })

  const [liveActivity, setLiveActivity] = useState<LiveActivity[]>([])
  const [isLive, setIsLive] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  // Simulate real-time data updates
  useEffect(() => {
    if (!isLive) return

    const interval = setInterval(() => {
      // Update main metrics
      setData(prev => ({
        ...prev,
        totalQueries: prev.totalQueries + Math.floor(Math.random() * 5),
        successRate: Math.max(95, Math.min(100, prev.successRate + (Math.random() - 0.5) * 0.5)),
        responseTime: Math.max(0.8, Math.min(2.0, prev.responseTime + (Math.random() - 0.5) * 0.1)),
        activeUsers: Math.max(200, Math.min(500, prev.activeUsers + Math.floor((Math.random() - 0.5) * 10))),
        aiAccuracy: Math.max(90, Math.min(98, prev.aiAccuracy + (Math.random() - 0.5) * 0.3)),
        aiUsage: Math.max(60, Math.min(80, prev.aiUsage + (Math.random() - 0.5) * 2))
      }))

      // Add new live activity
      const activities = [
        { type: 'query' as const, message: 'New LinkedIn post generated', accuracy: Math.floor(Math.random() * 10) + 90 },
        { type: 'query' as const, message: 'Quantum ID created successfully', accuracy: Math.floor(Math.random() * 8) + 92 },
        { type: 'success' as const, message: 'Analytics query processed', responseTime: Math.random() * 0.5 + 0.8 },
        { type: 'query' as const, message: 'News data fetched and analyzed', accuracy: Math.floor(Math.random() * 5) + 95 },
        { type: 'success' as const, message: 'Vector database updated', responseTime: Math.random() * 0.3 + 1.0 }
      ]

      const randomActivity = activities[Math.floor(Math.random() * activities.length)]
      const newActivity: LiveActivity = {
        id: Date.now().toString(),
        ...randomActivity,
        timestamp: new Date().toISOString()
      }

      setLiveActivity(prev => [newActivity, ...prev.slice(0, 9)])
      setLastUpdate(new Date())
    }, 2000)

    return () => clearInterval(interval)
  }, [isLive])

  const toggleLive = () => {
    setIsLive(!isLive)
  }

  const exportData = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      metrics: data,
      liveActivity: liveActivity.slice(0, 5)
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `amrikyy-analytics-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const getTrendIcon = (value: number) => {
    if (value > 0) return <ArrowUp className="w-4 h-4 text-green-400" />
    if (value < 0) return <ArrowDown className="w-4 h-4 text-red-400" />
    return <div className="w-4 h-4" />
  }

  const getTrendColor = (value: number) => {
    if (value > 0) return 'text-green-400'
    if (value < 0) return 'text-red-400'
    return 'text-gray-400'
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Amrikyy Smart Analytics Dashboard
          </h1>
          <p className="text-gray-300 text-lg mt-2">Real-time analytics and performance monitoring</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge variant={isLive ? "default" : "secondary"} className={isLive ? "bg-green-600" : "bg-gray-600"}>
            {isLive ? "Live" : "Paused"}
          </Badge>
          <Button
            onClick={toggleLive}
            variant="outline"
            className="border-blue-500/20 text-blue-400 hover:bg-blue-500/10"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLive ? 'animate-spin' : ''}`} />
            {isLive ? 'Pause' : 'Resume'}
          </Button>
          <Button
            onClick={exportData}
            variant="outline"
            className="border-purple-500/20 text-purple-400 hover:bg-purple-500/10"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Main Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-900/50 backdrop-blur-lg rounded-2xl border border-blue-500/20 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-400" />
              <span className="text-gray-300">Total Queries</span>
            </div>
            <div className="flex items-center gap-1">
              {getTrendIcon(data.trends.queries)}
              <span className={`text-sm ${getTrendColor(data.trends.queries)}`}>
                {data.trends.queries > 0 ? '+' : ''}{data.trends.queries}%
              </span>
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {data.totalQueries.toLocaleString()}
          </div>
          <div className="text-sm text-gray-400">from last hour</div>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-lg rounded-2xl border border-green-500/20 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-gray-300">Success Rate</span>
            </div>
            <div className="flex items-center gap-1">
              {getTrendIcon(data.trends.successRate)}
              <span className={`text-sm ${getTrendColor(data.trends.successRate)}`}>
                +{data.trends.successRate}%
              </span>
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {data.successRate.toFixed(1)}%
          </div>
          <div className="text-sm text-gray-400">Excellent performance</div>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-lg rounded-2xl border border-yellow-500/20 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-400" />
              <span className="text-gray-300">Response Time</span>
            </div>
            <div className="flex items-center gap-1">
              {getTrendIcon(data.trends.responseTime)}
              <span className={`text-sm ${getTrendColor(data.trends.responseTime)}`}>
                {data.trends.responseTime}%
              </span>
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {data.responseTime.toFixed(1)}s
          </div>
          <div className="text-sm text-gray-400">Average response time</div>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-lg rounded-2xl border border-purple-500/20 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-400" />
              <span className="text-gray-300">Active Users</span>
            </div>
            <div className="flex items-center gap-1">
              {getTrendIcon(data.trends.users)}
              <span className={`text-sm ${getTrendColor(data.trends.users)}`}>
                +{data.trends.users}%
              </span>
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {data.activeUsers}
          </div>
          <div className="text-sm text-gray-400">Currently online</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Performance */}
          <div className="bg-gray-900/50 backdrop-blur-lg rounded-2xl border border-cyan-500/20 p-6">
            <h3 className="text-xl font-semibold text-cyan-400 mb-6 flex items-center gap-2">
              <Brain className="w-6 h-6" />
              AI Performance
            </h3>
            <div className="text-sm text-gray-400 mb-4">RAG accuracy and AI metrics</div>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300">AI Accuracy</span>
                  <span className="text-cyan-400 font-semibold">{data.aiAccuracy.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${data.aiAccuracy}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300">Vector DB Size</span>
                  <span className="text-cyan-400 font-semibold">{data.vectorDbSize} docs</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                    style={{ width: '78%' }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* System Health */}
          <div className="bg-gray-900/50 backdrop-blur-lg rounded-2xl border border-green-500/20 p-6">
            <h3 className="text-xl font-semibold text-green-400 mb-6 flex items-center gap-2">
              <Activity className="w-6 h-6" />
              System Health
            </h3>
            <div className="text-sm text-gray-400 mb-4">Infrastructure performance status</div>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300">Overall Health</span>
                  <span className="text-green-400 font-semibold">{data.systemHealth.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                    style={{ width: `${data.systemHealth}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300">AI Usage</span>
                  <span className="text-orange-400 font-semibold">{data.aiUsage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full"
                    style={{ width: `${data.aiUsage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Quantum Tools */}
          <div className="bg-gray-900/50 backdrop-blur-lg rounded-2xl border border-purple-500/20 p-6">
            <h3 className="text-xl font-semibold text-purple-400 mb-6 flex items-center gap-2">
              <Zap className="w-6 h-6" />
              Quantum Tools
            </h3>
            <div className="text-sm text-gray-400 mb-4">AI-powered dashboard actions</div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <Button
                variant="outline"
                className="border-blue-500/20 text-blue-400 hover:bg-blue-500/10"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
              <Button
                variant="outline"
                className="border-green-500/20 text-green-400 hover:bg-green-500/10"
              >
                <Users className="w-4 h-4 mr-2" />
                User Analysis
              </Button>
              <Button
                variant="outline"
                className="border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/10"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Performance Trends
              </Button>
              <Button
                variant="outline"
                className="border-purple-500/20 text-purple-400 hover:bg-purple-500/10"
              >
                <Database className="w-4 h-4 mr-2" />
                Optimize Vector DB
              </Button>
            </div>
          </div>
        </div>

        {/* Right Column - Live Activity */}
        <div className="space-y-6">
          <div className="bg-gray-900/50 backdrop-blur-lg rounded-2xl border border-orange-500/20 p-6">
            <h3 className="text-xl font-semibold text-orange-400 mb-6 flex items-center gap-2">
              <Eye className="w-6 h-6" />
              Real-time Activity Monitor
            </h3>
            <div className="text-sm text-gray-400 mb-4">Live query and performance tracking</div>
            
            {/* Live Stats */}
            <div className="grid grid-cols-1 gap-4 mb-6">
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Queries</span>
                  <span className="text-2xl font-bold text-blue-400">42</span>
                </div>
                <div className="text-xs text-gray-500">Queries/min</div>
              </div>
              
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Response Time</span>
                  <span className="text-2xl font-bold text-yellow-400">{data.responseTime.toFixed(1)}s</span>
                </div>
                <div className="text-xs text-gray-500">Response Time</div>
              </div>
              
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Accuracy</span>
                  <span className="text-2xl font-bold text-green-400">{data.aiAccuracy.toFixed(1)}%</span>
                </div>
                <div className="text-xs text-gray-500">Accuracy</div>
              </div>
            </div>

            {/* Activity Feed */}
            <div className="space-y-3 max-h-64 overflow-y-auto">
              <div className="text-sm font-medium text-gray-300 mb-3">
                Monitoring live data streams...
              </div>
              {liveActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-800/30 rounded-lg">
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                    activity.type === 'query' ? 'bg-blue-400' :
                    activity.type === 'success' ? 'bg-green-400' : 'bg-red-400'
                  }`}></div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-gray-300">{activity.message}</div>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-xs text-gray-500">
                        {new Date(activity.timestamp).toLocaleTimeString()}
                      </span>
                      {activity.responseTime && (
                        <span className="text-xs text-yellow-400">
                          {activity.responseTime.toFixed(1)}s
                        </span>
                      )}
                      {activity.accuracy && (
                        <span className="text-xs text-green-400">
                          {activity.accuracy}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Status */}
          <div className="bg-gray-900/50 backdrop-blur-lg rounded-2xl border border-green-500/20 p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <div className="text-lg font-semibold text-green-400 mb-2">
                All systems operational
              </div>
              <div className="text-sm text-gray-400">
                Last updated: {lastUpdate.toLocaleTimeString()} • System uptime: 99.9% • Data refreshes every 2 seconds
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
