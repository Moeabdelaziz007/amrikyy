/**
 * 🚀 Advanced MCP Automation Dashboard
 * Latest December 2024 automation features for Amrikyy AIOS System
 */

import {
  Activity,
  Bot,
  Zap,
  Shield,
  Brain,
  Cpu,
  Database,
  Network,
  Play,
  Pause,
  RotateCcw,
  Settings,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Loader2,
  RefreshCw,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
  XCircle,
  Star,
  Sparkles,
  Target,
  Workflow,
  Layers,
  GitBranch,
  Code,
  TestTube,
  Accessibility,
  Globe,
  Factory,
  Cog,
  Gauge,
  Monitor,
  Smartphone,
  Tablet,
  Laptop,
  Server,
  Cloud,
  HardDrive,
  Wifi,
  Bluetooth,
  Usb,
  Battery,
  Thermometer,
  Wind,
  Droplets,
  Sun,
  Moon,
} from 'lucide-react';
import { mcpServerManager, MCPExecutionResult, ProcessIntelligence, DigitalTwin } from '../../lib/mcp-servers';

interface AdvancedAutomationDashboardProps {
  onClose: () => void;
}

const AdvancedAutomationDashboard: React.FC<AdvancedAutomationDashboardProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'mcp-servers' | 'process-intelligence' | 'digital-twin' | 'security'>('overview');
  const [isRealTimeMode, setIsRealTimeMode] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedServer, setSelectedServer] = useState<string>('');
  const [executionResults, setExecutionResults] = useState<MCPExecutionResult[]>([]);
  const [processIntelligence, setProcessIntelligence] = useState<ProcessIntelligence | null>(null);
  const [digitalTwins, setDigitalTwins] = useState<DigitalTwin[]>([]);
  const [systemMetrics, setSystemMetrics] = useState({
    cpuUsage: 35,
    memoryUsage: 60,
    diskUsage: 45,
    networkActivity: 12,
    activeProcesses: 8,
    automationTasks: 15,
    successRate: 95.2,
    averageResponseTime: 120
  });

  // Load initial data
  useEffect(() => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    if (isRealTimeMode) {
      // Simulate real-time data updates
      setSystemMetrics(prev => ({
        ...prev,
        cpuUsage: parseFloat((Math.random() * (70 - 20) + 20).toFixed(1)),
        memoryUsage: parseFloat((Math.random() * (80 - 40) + 40).toFixed(1)),
        diskUsage: parseFloat((Math.random() * (60 - 30) + 30).toFixed(1)),
        networkActivity: parseFloat((Math.random() * (20 - 5) + 5).toFixed(1)),
        activeProcesses: Math.floor(Math.random() * 10) + 3,
        automationTasks: Math.floor(Math.random() * 20) + 10,
        successRate: parseFloat((Math.random() * (99 - 85) + 85).toFixed(1)),
        averageResponseTime: Math.floor(Math.random() * 200) + 50
      }));

      // Load process intelligence data
      setProcessIntelligence({
        realTimeMetrics: {
          cpuUsage: Math.random() * 50 + 25,
          memoryUsage: Math.random() * 40 + 30,
          diskUsage: Math.random() * 30 + 20,
          networkActivity: Math.random() * 15 + 5,
          responseTime: Math.random() * 100 + 50,
          throughput: Math.random() * 1000 + 500,
          errorRate: Math.random() * 5
        },
        predictiveAnalytics: {
          futureLoad: [80, 85, 90, 88, 92, 95, 90],
          failureProbability: Math.random() * 10,
          optimizationSuggestions: [
            'Increase cache size for better performance',
            'Optimize database queries',
            'Implement load balancing'
          ],
          resourceRequirements: {
            cpu: Math.random() * 20 + 10,
            memory: Math.random() * 30 + 20,
            storage: Math.random() * 50 + 30
          }
        },
        anomalyDetection: {
          detected: Math.random() > 0.8,
          severity: Math.random() > 0.5 ? 'medium' : 'low',
          description: 'Unusual CPU spike detected',
          recommendations: ['Check running processes', 'Monitor resource usage']
        },
        performanceTrends: {
          performance: [85, 87, 89, 91, 88, 93, 90],
          efficiency: [78, 80, 82, 85, 83, 87, 84],
          reliability: [95, 96, 97, 98, 97, 99, 98],
          userSatisfaction: [88, 90, 92, 94, 91, 95, 93]
        }
      });
    }
  };

  const executeMCPServer = async (serverId: string, command: string) => {
    try {
      const result = await mcpServerManager.executeCommand(serverId, command);
      setExecutionResults(prev => [result, ...prev.slice(0, 9)]);
      return result;
    } catch (error) {
      console.error('MCP execution error:', error);
    }
  };

  const getServerIcon = (serverId: string) => {
    switch (serverId) {
      case 'playwright-mcp': return <Globe className="w-5 h-5" />;
      case 'selenium-mcp': return <TestTube className="w-5 h-5" />;
      case 'accessibility-scanner': return <Accessibility className="w-5 h-5" />;
      case 'opc-ua-fx': return <Factory className="w-5 h-5" />;
      case 'process-mining-ai': return <Brain className="w-5 h-5" />;
      case 'digital-twin-engine': return <Layers className="w-5 h-5" />;
      default: return <Cog className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-400/20';
      case 'inactive': return 'text-gray-400 bg-gray-400/20';
      case 'updating': return 'text-yellow-400 bg-yellow-400/20';
      case 'error': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* System Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="metric-card bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30">
          <div className="flex items-center gap-2 text-blue-300 mb-2">
            <Cpu className="w-5 h-5" />
            <span className="text-sm font-medium">CPU Usage</span>
          </div>
          <p className="text-3xl font-bold text-white">{systemMetrics.cpuUsage.toFixed(1)}%</p>
          <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
            <div className="bg-blue-500 h-2 rounded-full transition-all duration-500" style={{ width: `${systemMetrics.cpuUsage}%` }}></div>
          </div>
        </div>

        <div className="metric-card bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30">
          <div className="flex items-center gap-2 text-green-300 mb-2">
            <Database className="w-5 h-5" />
            <span className="text-sm font-medium">Memory Usage</span>
          </div>
          <p className="text-3xl font-bold text-white">{systemMetrics.memoryUsage.toFixed(1)}%</p>
          <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
            <div className="bg-green-500 h-2 rounded-full transition-all duration-500" style={{ width: `${systemMetrics.memoryUsage}%` }}></div>
          </div>
        </div>

        <div className="metric-card bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30">
          <div className="flex items-center gap-2 text-orange-300 mb-2">
            <HardDrive className="w-5 h-5" />
            <span className="text-sm font-medium">Disk Usage</span>
          </div>
          <p className="text-3xl font-bold text-white">{systemMetrics.diskUsage.toFixed(1)}%</p>
          <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
            <div className="bg-orange-500 h-2 rounded-full transition-all duration-500" style={{ width: `${systemMetrics.diskUsage}%` }}></div>
          </div>
        </div>

        <div className="metric-card bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30">
          <div className="flex items-center gap-2 text-purple-300 mb-2">
            <Network className="w-5 h-5" />
            <span className="text-sm font-medium">Network Activity</span>
          </div>
          <p className="text-3xl font-bold text-white">{systemMetrics.networkActivity.toFixed(1)}%</p>
          <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
            <div className="bg-purple-500 h-2 rounded-full transition-all duration-500" style={{ width: `${systemMetrics.networkActivity}%` }}></div>
          </div>
        </div>
      </div>

      {/* Automation Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat-card bg-white/5 glass-premium border border-white/10">
          <div className="flex items-center gap-2 text-blue-300 mb-2">
            <Activity className="w-5 h-5" />
            <span className="text-sm font-medium">Active Processes</span>
          </div>
          <p className="text-2xl font-bold text-white">{systemMetrics.activeProcesses}</p>
        </div>

        <div className="stat-card bg-white/5 glass-premium border border-white/10">
          <div className="flex items-center gap-2 text-green-300 mb-2">
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-sm font-medium">Success Rate</span>
          </div>
          <p className="text-2xl font-bold text-white">{systemMetrics.successRate.toFixed(1)}%</p>
        </div>

        <div className="stat-card bg-white/5 glass-premium border border-white/10">
          <div className="flex items-center gap-2 text-purple-300 mb-2">
            <Clock className="w-5 h-5" />
            <span className="text-sm font-medium">Avg Response Time</span>
          </div>
          <p className="text-2xl font-bold text-white">{systemMetrics.averageResponseTime}ms</p>
        </div>
      </div>

      {/* Recent Executions */}
      <div className="executions-section bg-white/5 glass-premium border border-white/10">
        <h4 className="text-lg font-bold text-white mb-4 gradient-text">Recent MCP Executions</h4>
        <div className="space-y-3">
          {executionResults.slice(0, 5).map((result, index) => (
            <div key={index} className="execution-item bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-between p-3">
              <div className="flex items-center gap-3">
                {result.success ? (
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                )}
                <div>
                  <p className="text-white font-medium">MCP Execution #{index + 1}</p>
                  <p className="text-gray-400 text-xs">
                    {result.data?.action || 'Generic execution'} - {result.executionTime}ms
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  result.success ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {result.success ? 'Success' : 'Failed'}
                </span>
                <span className="text-gray-400 text-sm">
                  CPU: {result.metrics.cpuUsage.toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderMCPServers = () => (
    <div className="space-y-6">
      {/* MCP Servers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mcpServerManager.getAllServers().map(server => (
          <div key={server.id} className="server-card bg-white/5 glass-premium border border-white/10 hover:border-white/20 transition-all duration-300">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {getServerIcon(server.id)}
                  <span className="font-medium text-white">{server.name}</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(server.status)}`}>
                  {server.status}
                </span>
              </div>
              
              <p className="text-gray-400 text-sm mb-3">{server.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Reliability</span>
                  <span className="text-white">{server.performance.reliability}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-1">
                  <div className="bg-green-500 h-1 rounded-full" style={{ width: `${server.performance.reliability}%` }}></div>
                </div>
                
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Speed</span>
                  <span className="text-white">{server.performance.speed}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-1">
                  <div className="bg-blue-500 h-1 rounded-full" style={{ width: `${server.performance.speed}%` }}></div>
                </div>
                
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Accuracy</span>
                  <span className="text-white">{server.performance.accuracy}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-1">
                  <div className="bg-purple-500 h-1 rounded-full" style={{ width: `${server.performance.accuracy}%` }}></div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => executeMCPServer(server.id, 'test')}
                  className="flex-1 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg text-sm transition-colors"
                >
                  Test
                </button>
                <button
                  onClick={() => executeMCPServer(server.id, 'health-check')}
                  className="flex-1 px-3 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg text-sm transition-colors"
                >
                  Health
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProcessIntelligence = () => (
    <div className="space-y-6">
      {/* Predictive Analytics */}
      <div className="predictive-section bg-white/5 glass-premium border border-white/10">
        <h4 className="text-lg font-bold text-white mb-4 gradient-text">Predictive Analytics</h4>
        {processIntelligence && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 className="text-white font-medium mb-3">Future Load Prediction</h5>
              <div className="space-y-2">
                {processIntelligence.predictiveAnalytics.futureLoad.map((load, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <span className="text-gray-400 text-sm w-16">+{index + 1}h</span>
                    <div className="flex-1 bg-gray-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" style={{ width: `${load}%` }}></div>
                    </div>
                    <span className="text-white text-sm w-12">{load.toFixed(0)}%</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h5 className="text-white font-medium mb-3">Optimization Suggestions</h5>
              <div className="space-y-2">
                {processIntelligence.predictiveAnalytics.optimizationSuggestions.map((suggestion, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-white/5 rounded-lg">
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                    <span className="text-gray-300 text-sm">{suggestion}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Anomaly Detection */}
      <div className="anomaly-section bg-white/5 glass-premium border border-white/10">
        <h4 className="text-lg font-bold text-white mb-4 gradient-text">Anomaly Detection</h4>
        {processIntelligence && (
          <div className={`p-4 rounded-lg ${
            processIntelligence.anomalyDetection.detected 
              ? 'bg-red-500/20 border border-red-500/30' 
              : 'bg-green-500/20 border border-green-500/30'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              {processIntelligence.anomalyDetection.detected ? (
                <AlertTriangle className="w-5 h-5 text-red-400" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-green-400" />
              )}
              <span className="font-medium text-white">
                {processIntelligence.anomalyDetection.detected ? 'Anomaly Detected' : 'System Normal'}
              </span>
            </div>
            <p className="text-gray-300 text-sm mb-2">
              {processIntelligence.anomalyDetection.description}
            </p>
            {processIntelligence.anomalyDetection.recommendations.length > 0 && (
              <div className="space-y-1">
                <span className="text-gray-400 text-xs">Recommendations:</span>
                {processIntelligence.anomalyDetection.recommendations.map((rec, index) => (
                  <div key={index} className="text-gray-300 text-xs">• {rec}</div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className={`advanced-automation-dashboard ${isExpanded ? 'expanded' : 'compact'} glass-premium transition-all duration-500`}>
      {/* Header */}
      <div className="dashboard-header flex items-center justify-between bg-white/5 dark:bg-black/10 p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white gradient-text">Advanced Automation Hub</h3>
            <p className="text-sm text-gray-400">Latest MCP Tools & AI-Powered Automation</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRealTimeMode(!isRealTimeMode)}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
            title={isRealTimeMode ? 'Disable Real-time Updates' : 'Enable Real-time Updates'}
          >
            {isRealTimeMode ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
            title={isExpanded ? 'Minimize Dashboard' : 'Maximize Dashboard'}
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-red-500/20 hover:bg-red-500/30 transition-colors text-red-400"
            title="Close Dashboard"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="tabs-navigation flex border-b border-white/10">
        {[
          { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
          { id: 'mcp-servers', label: 'MCP Servers', icon: <Server className="w-4 h-4" /> },
          { id: 'process-intelligence', label: 'Process Intelligence', icon: <Brain className="w-4 h-4" /> },
          { id: 'digital-twin', label: 'Digital Twins', icon: <Layers className="w-4 h-4" /> },
          { id: 'security', label: 'Security', icon: <Shield className="w-4 h-4" /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-500/10'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="dashboard-content p-6 overflow-y-auto max-h-[70vh]">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'mcp-servers' && renderMCPServers()}
        {activeTab === 'process-intelligence' && renderProcessIntelligence()}
        {activeTab === 'digital-twin' && (
          <div className="text-center py-12">
            <Layers className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">Digital Twin Engine</h3>
            <p className="text-gray-400">Virtual process representations coming soon...</p>
          </div>
        )}
        {activeTab === 'security' && (
          <div className="text-center py-12">
            <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">Security Automation</h3>
            <p className="text-gray-400">AI-powered threat detection coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancedAutomationDashboard;
