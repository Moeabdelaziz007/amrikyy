/**
 * 🧪 MCP Test Dashboard
 * Comprehensive testing interface for all automation features
 */

import React, { useState, useEffect } from 'react';
import {
  TestTube,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  BarChart3,
  Activity,
  Cpu,
  Database,
  Network,
  Shield,
  Zap,
  Brain,
  Layers,
  Globe,
  Factory,
  Accessibility,
  Server,
  RefreshCw,
  Eye,
  EyeOff,
  Download,
  Upload,
  Settings,
  Filter,
  Search,
  Star,
  Sparkles,
  TrendingUp,
  TrendingDown,
  ArrowUp,
  ArrowDown,
  ChevronRight,
  ChevronDown,
  Maximize2,
  Minimize2,
  XCircle as CloseIcon,
  Info,
  HelpCircle,
  BookOpen,
  FileText,
  Code,
  Terminal,
  Monitor,
  Smartphone,
  Tablet,
  Laptop,
  HardDrive,
  Wifi,
  Battery,
  Thermometer,
  Wind,
  Droplets,
  Sun,
  Moon,
  Star as StarIcon,
  Heart,
  Target,
  Rocket,
  Bot,
  MessageSquare,
  Users,
  Calendar,
  Image,
  Music,
  Video,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Share,
  Lock,
  Unlock,
  Key,
  User,
  UserCheck,
  UserPlus,
  UserMinus,
  UserX,
  Mail,
  Phone,
  MapPin,
  Navigation,
  Compass,
  Home,
  Building,
  Car,
  Plane,
  Train,
  Ship,
  Truck,
  Bike,
  Walk,
  Run,
  Heart as HeartIcon,
  HeartHandshake,
  Handshake,
  Gift,
  Award,
  Trophy,
  Medal,
  Crown,
  Gem,
  Diamond,
  Coins,
  CreditCard,
  Wallet,
  PiggyBank,
  Banknote,
  DollarSign,
  Euro,
  PoundSterling,
  Yen,
  Bitcoin,
  TrendingDown as TrendingDownIcon,
  ArrowUp as ArrowUpIcon,
  ArrowDown as ArrowDownIcon,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  ArrowUpLeft,
  ArrowDownLeft,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsUp,
  ChevronsDown,
  ChevronsLeft,
  ChevronsRight,
  Plus,
  Minus,
  X,
  Check,
  Circle,
  Square,
  Triangle,
  Hexagon,
  Octagon,
  Pentagon
} from 'lucide-react';
import { mcpTestRunner, TestSuite, TestResult } from '../../lib/mcp-test-runner';

interface TestDashboardProps {
  onClose: () => void;
}

const TestDashboard: React.FC<TestDashboardProps> = ({ onClose }) => {
  const [testSuites, setTestSuites] = useState<TestSuite[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedSuite, setSelectedSuite] = useState<string>('');
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [healthStatus, setHealthStatus] = useState<{ [serverId: string]: boolean }>({});
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'passed' | 'failed' | 'skipped'>('all');

  useEffect(() => {
    loadTestSuites();
    runHealthChecks();
  }, []);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        runHealthChecks();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const loadTestSuites = () => {
    const suites = mcpTestRunner.getTestSuites();
    setTestSuites(suites);
  };

  const runHealthChecks = async () => {
    const health = await mcpTestRunner.runHealthChecks();
    setHealthStatus(health);
  };

  const runAllTests = async () => {
    setIsRunning(true);
    try {
      const results = await mcpTestRunner.runAllTests();
      setTestSuites(results);
      const allResults = results.flatMap(suite => suite.results);
      setTestResults(allResults);
    } catch (error) {
      console.error('Test execution failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const runSuiteTests = async (suiteName: string) => {
    setIsRunning(true);
    try {
      const suite = mcpTestRunner.getSuiteByName(suiteName);
      if (suite) {
        await mcpTestRunner.runTestSuite(suite);
        setTestSuites(mcpTestRunner.getTestSuites());
        const allResults = mcpTestRunner.getTestSuites().flatMap(s => s.results);
        setTestResults(allResults);
      }
    } catch (error) {
      console.error('Suite test execution failed:', error);
    } finally {
      setIsRunning(false);
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
      default: return <Server className="w-5 h-5" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return <CheckCircle2 className="w-5 h-5 text-green-400" />;
      case 'failed': return <XCircle className="w-5 h-5 text-red-400" />;
      case 'skipped': return <Clock className="w-5 h-5 text-yellow-400" />;
      default: return <AlertTriangle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'failed': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'skipped': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const filteredResults = testResults.filter(result => {
    if (filterStatus === 'all') return true;
    return result.status === filterStatus;
  });

  const totalTests = testSuites.reduce((sum, suite) => sum + suite.totalTests, 0);
  const totalPassed = testSuites.reduce((sum, suite) => sum + suite.passedTests, 0);
  const totalFailed = testSuites.reduce((sum, suite) => sum + suite.failedTests, 0);
  const totalSkipped = testSuites.reduce((sum, suite) => sum + suite.skippedTests, 0);
  const passRate = totalTests > 0 ? ((totalPassed / totalTests) * 100).toFixed(1) : '0';

  return (
    <div className="test-dashboard glass-premium">
      {/* Header */}
      <div className="dashboard-header flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 via-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
            <TestTube className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white gradient-text">MCP Test Dashboard</h2>
            <p className="text-sm text-gray-400">Comprehensive automation testing suite</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`p-2 rounded-full transition-colors ${
              autoRefresh ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-gray-400 hover:text-white'
            }`}
            title={autoRefresh ? 'Disable Auto Refresh' : 'Enable Auto Refresh'}
          >
            {autoRefresh ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
          <button
            onClick={runHealthChecks}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
            title="Refresh Health Checks"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-red-500/20 hover:bg-red-500/30 transition-colors text-red-400"
            title="Close Dashboard"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Test Controls */}
      <div className="test-controls p-4 bg-white/5 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={runAllTests}
              disabled={isRunning}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                isRunning
                  ? 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
                  : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
              }`}
            >
              {isRunning ? (
                <RotateCcw className="w-4 h-4 animate-spin" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              {isRunning ? 'Running Tests...' : 'Run All Tests'}
            </button>
            
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="all">All Results</option>
                <option value="passed">Passed</option>
                <option value="failed">Failed</option>
                <option value="skipped">Skipped</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span>Pass Rate: <span className="text-white font-medium">{passRate}%</span></span>
            <span>Total: <span className="text-white font-medium">{totalTests}</span></span>
            <span>Passed: <span className="text-green-400 font-medium">{totalPassed}</span></span>
            <span>Failed: <span className="text-red-400 font-medium">{totalFailed}</span></span>
          </div>
        </div>
      </div>

      {/* Health Status */}
      <div className="health-status p-4 bg-white/5 border-b border-white/10">
        <h3 className="text-lg font-bold text-white mb-3 gradient-text">Server Health Status</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {Object.entries(healthStatus).map(([serverId, isHealthy]) => (
            <div
              key={serverId}
              className={`health-card p-3 rounded-lg border transition-all ${
                isHealthy
                  ? 'bg-green-500/20 border-green-500/30 text-green-400'
                  : 'bg-red-500/20 border-red-500/30 text-red-400'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                {getServerIcon(serverId)}
                <span className="text-sm font-medium capitalize">
                  {serverId.replace('-mcp', '').replace('-', ' ')}
                </span>
              </div>
              <div className="flex items-center gap-1">
                {isHealthy ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <XCircle className="w-4 h-4" />
                )}
                <span className="text-xs">
                  {isHealthy ? 'Healthy' : 'Unhealthy'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Test Suites */}
      <div className="test-suites p-4 bg-white/5 border-b border-white/10">
        <h3 className="text-lg font-bold text-white mb-3 gradient-text">Test Suites</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {testSuites.map(suite => (
            <div
              key={suite.name}
              className="suite-card bg-white/5 glass-premium border border-white/10 hover:border-white/20 transition-all duration-300 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-white">{suite.name}</h4>
                <button
                  onClick={() => runSuiteTests(suite.name)}
                  disabled={isRunning}
                  className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors disabled:opacity-50"
                >
                  <Play className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-2 mb-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Total Tests</span>
                  <span className="text-white">{suite.totalTests}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Passed</span>
                  <span className="text-green-400">{suite.passedTests}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Failed</span>
                  <span className="text-red-400">{suite.failedTests}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Skipped</span>
                  <span className="text-yellow-400">{suite.skippedTests}</span>
                </div>
              </div>
              
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(suite.passedTests / suite.totalTests) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Test Results */}
      <div className="test-results p-4 overflow-y-auto max-h-[40vh]">
        <h3 className="text-lg font-bold text-white mb-3 gradient-text">Test Results</h3>
        <div className="space-y-2">
          {filteredResults.map((result, index) => (
            <div
              key={index}
              className={`result-item p-3 rounded-lg border transition-all ${
                result.status === 'passed'
                  ? 'bg-green-500/10 border-green-500/20'
                  : result.status === 'failed'
                    ? 'bg-red-500/10 border-red-500/20'
                    : 'bg-yellow-500/10 border-yellow-500/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(result.status)}
                  <div>
                    <h4 className="font-medium text-white">{result.testName}</h4>
                    <p className="text-sm text-gray-400">
                      {result.serverId.replace('-mcp', '').replace('-', ' ')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(result.status)}`}>
                    {result.status}
                  </span>
                  <span className="text-sm text-gray-400">{result.executionTime}ms</span>
                  {result.error && (
                    <AlertTriangle className="w-4 h-4 text-red-400" title={result.error} />
                  )}
                </div>
              </div>
              
              {result.error && (
                <div className="mt-2 p-2 bg-red-500/20 border border-red-500/30 rounded text-sm text-red-400">
                  {result.error}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestDashboard;
