import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { 
  RefreshCw, 
  Play, 
  Square, 
  Pause, 
  Settings, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Activity,
  Database,
  Globe,
  Wifi,
  WifiOff,
  Zap,
  Sync,
  Download,
  Upload,
  Trash2,
  Plus,
  Eye,
  Edit,
  Filter,
  Search,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

interface SyncRule {
  id: string;
  name: string;
  source: string;
  destination: string;
  frequency: 'real-time' | 'minute' | 'hourly' | 'daily';
  status: 'active' | 'paused' | 'error' | 'disabled';
  lastSync?: Date;
  nextSync?: Date;
  syncCount: number;
  errorCount: number;
  dataTypes: string[];
  filters: any;
  transformation: any;
  conflictResolution: 'source-wins' | 'destination-wins' | 'manual';
}

interface SyncLog {
  id: string;
  ruleId: string;
  timestamp: Date;
  status: 'success' | 'error' | 'warning';
  recordsProcessed: number;
  recordsAdded: number;
  recordsUpdated: number;
  recordsDeleted: number;
  duration: number;
  errorMessage?: string;
  details: any;
}

interface SyncStatistics {
  totalRules: number;
  activeRules: number;
  totalSyncs: number;
  successfulSyncs: number;
  failedSyncs: number;
  totalRecords: number;
  averageSyncTime: number;
  last24Hours: {
    syncs: number;
    records: number;
    errors: number;
  };
}

export const EnhancedRealtimeSyncManager: React.FC = () => {
  const { user } = useAuth();
  const [syncRules, setSyncRules] = useState<SyncRule[]>([]);
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>([]);
  const [statistics, setStatistics] = useState<SyncStatistics>({
    totalRules: 0,
    activeRules: 0,
    totalSyncs: 0,
    successfulSyncs: 0,
    failedSyncs: 0,
    totalRecords: 0,
    averageSyncTime: 0,
    last24Hours: { syncs: 0, records: 0, errors: 0 }
  });
  const [selectedTab, setSelectedTab] = useState<'overview' | 'rules' | 'logs' | 'analytics'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isCreatingRule, setIsCreatingRule] = useState(false);
  const [selectedRule, setSelectedRule] = useState<SyncRule | null>(null);
  const [loading, setLoading] = useState(true);
  const [wsConnection, setWsConnection] = useState<WebSocket | null>(null);

  useEffect(() => {
    loadSyncData();
    initializeWebSocket();
    
    // Set up real-time updates
    const interval = setInterval(() => {
      loadSyncData();
    }, 5000); // Update every 5 seconds

    return () => {
      clearInterval(interval);
      if (wsConnection) {
        wsConnection.close();
      }
    };
  }, []);

  const initializeWebSocket = () => {
    try {
      const ws = new WebSocket('ws://localhost:8080/sync');
      ws.onopen = () => {
        console.log('WebSocket connected for real-time sync');
        setWsConnection(ws);
      };
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'sync_update') {
          loadSyncData();
        }
      };
      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setWsConnection(null);
        // Attempt to reconnect after 5 seconds
        setTimeout(initializeWebSocket, 5000);
      };
      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      console.error('Failed to initialize WebSocket:', error);
    }
  };

  const loadSyncData = async () => {
    try {
      await Promise.all([
        loadSyncRules(),
        loadSyncLogs(),
        loadStatistics()
      ]);
    } catch (error) {
      console.error('Failed to load sync data:', error);
      // Use mock data if API fails
      setSyncRules(getMockSyncRules());
      setSyncLogs(getMockSyncLogs());
      setStatistics(getMockStatistics());
    } finally {
      setLoading(false);
    }
  };

  const loadSyncRules = async () => {
    try {
      const response = await fetch('/api/sync/rules');
      const data = await response.json();
      
      if (data.rules) {
        setSyncRules(data.rules.map((rule: any) => ({
          ...rule,
          lastSync: rule.lastSync ? new Date(rule.lastSync) : undefined,
          nextSync: rule.nextSync ? new Date(rule.nextSync) : undefined
        })));
      } else {
        setSyncRules(getMockSyncRules());
      }
    } catch (error) {
      console.error('Failed to load sync rules:', error);
      setSyncRules(getMockSyncRules());
    }
  };

  const loadSyncLogs = async () => {
    try {
      const response = await fetch('/api/sync/logs');
      const data = await response.json();
      
      if (data.logs) {
        setSyncLogs(data.logs.map((log: any) => ({
          ...log,
          timestamp: new Date(log.timestamp)
        })));
      } else {
        setSyncLogs(getMockSyncLogs());
      }
    } catch (error) {
      console.error('Failed to load sync logs:', error);
      setSyncLogs(getMockSyncLogs());
    }
  };

  const loadStatistics = async () => {
    try {
      const response = await fetch('/api/sync/statistics');
      const data = await response.json();
      
      if (data.statistics) {
        setStatistics(data.statistics);
      } else {
        setStatistics(getMockStatistics());
      }
    } catch (error) {
      console.error('Failed to load sync statistics:', error);
      setStatistics(getMockStatistics());
    }
  };

  const createSyncRule = async (ruleData: any) => {
    try {
      const response = await fetch('/api/sync/rules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ruleData)
      });

      if (response.ok) {
        loadSyncRules();
        setIsCreatingRule(false);
        alert('Sync rule created successfully!');
      } else {
        throw new Error('Failed to create sync rule');
      }
    } catch (error) {
      console.error('Failed to create sync rule:', error);
      alert('Failed to create sync rule. Please try again.');
    }
  };

  const updateSyncRule = async (ruleId: string, updates: any) => {
    try {
      const response = await fetch(`/api/sync/rules/${ruleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates)
      });

      if (response.ok) {
        loadSyncRules();
        alert('Sync rule updated successfully!');
      } else {
        throw new Error('Failed to update sync rule');
      }
    } catch (error) {
      console.error('Failed to update sync rule:', error);
      alert('Failed to update sync rule. Please try again.');
    }
  };

  const deleteSyncRule = async (ruleId: string) => {
    if (!confirm('Are you sure you want to delete this sync rule?')) return;

    try {
      const response = await fetch(`/api/sync/rules/${ruleId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        loadSyncRules();
        alert('Sync rule deleted successfully!');
      } else {
        throw new Error('Failed to delete sync rule');
      }
    } catch (error) {
      console.error('Failed to delete sync rule:', error);
      alert('Failed to delete sync rule. Please try again.');
    }
  };

  const toggleSyncRule = async (ruleId: string) => {
    const rule = syncRules.find(r => r.id === ruleId);
    if (!rule) return;

    const newStatus = rule.status === 'active' ? 'paused' : 'active';
    await updateSyncRule(ruleId, { status: newStatus });
  };

  const runSyncRule = async (ruleId: string) => {
    try {
      const response = await fetch(`/api/sync/rules/${ruleId}/run`, {
        method: 'POST'
      });

      if (response.ok) {
        loadSyncData();
        alert('Sync rule executed successfully!');
      } else {
        throw new Error('Failed to run sync rule');
      }
    } catch (error) {
      console.error('Failed to run sync rule:', error);
      alert('Failed to run sync rule. Please try again.');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'paused':
        return <Pause className="w-4 h-4 text-yellow-400" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'disabled':
        return <XCircle className="w-4 h-4 text-gray-400" />;
      default:
        return <XCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-600 text-white';
      case 'paused':
        return 'bg-yellow-600 text-white';
      case 'error':
        return 'bg-red-600 text-white';
      case 'disabled':
        return 'bg-gray-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  const getLogStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      default:
        return <XCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getFrequencyIcon = (frequency: string) => {
    switch (frequency) {
      case 'real-time':
        return <Zap className="w-4 h-4 text-purple-400" />;
      case 'minute':
        return <Clock className="w-4 h-4 text-blue-400" />;
      case 'hourly':
        return <Clock className="w-4 h-4 text-green-400" />;
      case 'daily':
        return <Clock className="w-4 h-4 text-orange-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  // Mock data functions
  const getMockSyncRules = (): SyncRule[] => [
    {
      id: '1',
      name: 'User Data Sync',
      source: 'Database A',
      destination: 'Database B',
      frequency: 'real-time',
      status: 'active',
      lastSync: new Date(Date.now() - 1000 * 60 * 2),
      nextSync: new Date(Date.now() + 1000 * 60 * 58),
      syncCount: 1247,
      errorCount: 3,
      dataTypes: ['users', 'profiles', 'settings'],
      filters: { active: true },
      transformation: { mapFields: true },
      conflictResolution: 'source-wins'
    },
    {
      id: '2',
      name: 'File Backup Sync',
      source: 'Local Storage',
      destination: 'Cloud Storage',
      frequency: 'hourly',
      status: 'active',
      lastSync: new Date(Date.now() - 1000 * 60 * 30),
      nextSync: new Date(Date.now() + 1000 * 60 * 30),
      syncCount: 892,
      errorCount: 1,
      dataTypes: ['files', 'metadata'],
      filters: { size: '>1MB' },
      transformation: { compress: true },
      conflictResolution: 'destination-wins'
    },
    {
      id: '3',
      name: 'Analytics Data Sync',
      source: 'Analytics API',
      destination: 'Data Warehouse',
      frequency: 'daily',
      status: 'paused',
      lastSync: new Date(Date.now() - 1000 * 60 * 60 * 24),
      nextSync: new Date(Date.now() + 1000 * 60 * 60 * 23),
      syncCount: 567,
      errorCount: 0,
      dataTypes: ['events', 'metrics', 'reports'],
      filters: { dateRange: 'last30days' },
      transformation: { aggregate: true },
      conflictResolution: 'source-wins'
    },
    {
      id: '4',
      name: 'Inventory Sync',
      source: 'ERP System',
      destination: 'E-commerce Platform',
      frequency: 'minute',
      status: 'error',
      lastSync: new Date(Date.now() - 1000 * 60 * 60 * 2),
      nextSync: new Date(Date.now() + 1000 * 60 * 58),
      syncCount: 234,
      errorCount: 12,
      dataTypes: ['products', 'inventory', 'pricing'],
      filters: { category: 'active' },
      transformation: { formatPrice: true },
      conflictResolution: 'manual'
    }
  ];

  const getMockSyncLogs = (): SyncLog[] => [
    {
      id: '1',
      ruleId: '1',
      timestamp: new Date(Date.now() - 1000 * 60 * 2),
      status: 'success',
      recordsProcessed: 150,
      recordsAdded: 12,
      recordsUpdated: 138,
      recordsDeleted: 0,
      duration: 1250,
      details: { source: 'Database A', destination: 'Database B' }
    },
    {
      id: '2',
      ruleId: '2',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      status: 'success',
      recordsProcessed: 45,
      recordsAdded: 45,
      recordsUpdated: 0,
      recordsDeleted: 0,
      duration: 3200,
      details: { source: 'Local Storage', destination: 'Cloud Storage' }
    },
    {
      id: '3',
      ruleId: '4',
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
      status: 'error',
      recordsProcessed: 0,
      recordsAdded: 0,
      recordsUpdated: 0,
      recordsDeleted: 0,
      duration: 5000,
      errorMessage: 'Connection timeout to ERP system',
      details: { source: 'ERP System', destination: 'E-commerce Platform' }
    },
    {
      id: '4',
      ruleId: '1',
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      status: 'success',
      recordsProcessed: 89,
      recordsAdded: 5,
      recordsUpdated: 84,
      recordsDeleted: 0,
      duration: 980,
      details: { source: 'Database A', destination: 'Database B' }
    }
  ];

  const getMockStatistics = (): SyncStatistics => ({
    totalRules: 4,
    activeRules: 2,
    totalSyncs: 2940,
    successfulSyncs: 2898,
    failedSyncs: 42,
    totalRecords: 156789,
    averageSyncTime: 1850,
    last24Hours: {
      syncs: 156,
      records: 8945,
      errors: 3
    }
  });

  const filteredRules = syncRules.filter(rule => {
    const matchesStatus = selectedStatus === 'all' || rule.status === selectedStatus;
    const matchesSearch = searchQuery === '' || 
      rule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.destination.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const filteredLogs = syncLogs.filter(log => {
    const matchesStatus = selectedStatus === 'all' || log.status === selectedStatus;
    const matchesSearch = searchQuery === '' || 
      log.ruleId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const statuses = ['all', 'active', 'paused', 'error', 'disabled'];

  if (loading) {
    return (
      <div className="flex h-full bg-gradient-to-br from-slate-900 via-green-900 to-slate-900">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-400 mx-auto mb-4"></div>
            <p className="text-white text-lg">Loading sync data...</p>
            <p className="text-gray-400">Initializing real-time synchronization</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-gradient-to-br from-slate-900 via-green-900 to-slate-900">
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <RefreshCw className="w-8 h-8 text-green-400" />
            <div>
              <h1 className="text-2xl font-bold text-white">Real-time Sync Manager</h1>
              <p className="text-gray-400">Manage data synchronization across systems</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {wsConnection ? (
                <Wifi className="w-5 h-5 text-green-400" />
              ) : (
                <WifiOff className="w-5 h-5 text-red-400" />
              )}
              <span className="text-gray-400 text-sm">
                {wsConnection ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            <Button
              onClick={() => setIsCreatingRule(true)}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Rule
            </Button>
            <Button
              onClick={loadSyncData}
              variant="outline"
              className="text-green-400 border-green-400 hover:bg-green-400 hover:text-white"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Statistics */}
        <div className="p-6 border-b border-white/10 bg-black/20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4 text-center">
                <Sync className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{statistics.totalRules}</p>
                <p className="text-gray-400 text-sm">Total Rules</p>
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4 text-center">
                <Activity className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{statistics.activeRules}</p>
                <p className="text-gray-400 text-sm">Active Rules</p>
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4 text-center">
                <Database className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{statistics.totalRecords.toLocaleString()}</p>
                <p className="text-gray-400 text-sm">Records Synced</p>
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4 text-center">
                <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">
                  {Math.round((statistics.successfulSyncs / statistics.totalSyncs) * 100) || 0}%
                </p>
                <p className="text-gray-400 text-sm">Success Rate</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'rules', label: 'Rules', icon: Sync },
            { id: 'logs', label: 'Logs', icon: Activity },
            { id: 'analytics', label: 'Analytics', icon: TrendingUp }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as any)}
              className={`flex items-center space-x-2 px-6 py-4 border-b-2 transition-colors ${
                selectedTab === tab.id
                  ? 'border-green-400 text-green-400 bg-green-400/10'
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
            {/* Filters */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search sync rules..."
                  className="pl-10 bg-white/5 border-white/20 text-white placeholder-gray-400 w-64"
                />
              </div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-white/5 border border-white/20 text-white rounded px-3 py-2"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {selectedTab === 'overview' && (
              <div className="space-y-6">
                {/* Active Rules */}
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center space-x-2">
                      <Sync className="w-5 h-5 text-green-400" />
                      <span>Active Sync Rules</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {syncRules.filter(rule => rule.status === 'active').map(rule => (
                        <div key={rule.id} className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-white/10">
                          <div className="flex items-center space-x-4">
                            {getStatusIcon(rule.status)}
                            <div>
                              <h4 className="text-white font-semibold">{rule.name}</h4>
                              <p className="text-gray-400 text-sm">
                                {rule.source} → {rule.destination}
                              </p>
                              <p className="text-gray-500 text-xs">
                                {getFrequencyIcon(rule.frequency)} {rule.frequency} • Last sync: {rule.lastSync?.toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={getStatusColor(rule.status)}>
                              {rule.status}
                            </Badge>
                            <Button
                              onClick={() => runSyncRule(rule.id)}
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <Play className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Sync Activity */}
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center space-x-2">
                      <Activity className="w-5 h-5 text-blue-400" />
                      <span>Recent Sync Activity</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {syncLogs.slice(0, 5).map(log => {
                        const rule = syncRules.find(r => r.id === log.ruleId);
                        return (
                          <div key={log.id} className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-white/10">
                            <div className="flex items-center space-x-4">
                              {getLogStatusIcon(log.status)}
                              <div>
                                <h4 className="text-white font-semibold">{rule?.name || 'Unknown Rule'}</h4>
                                <p className="text-gray-400 text-sm">
                                  {log.recordsProcessed} records • {log.duration}ms
                                </p>
                                <p className="text-gray-500 text-xs">
                                  {log.timestamp.toLocaleString()}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge variant="outline" className={
                                log.status === 'success' ? 'text-green-400 border-green-400' : 
                                log.status === 'error' ? 'text-red-400 border-red-400' : 
                                'text-yellow-400 border-yellow-400'
                              }>
                                {log.status}
                              </Badge>
                              <div className="text-xs text-gray-400 mt-1">
                                +{log.recordsAdded} • ~{log.recordsUpdated} • -{log.recordsDeleted}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {selectedTab === 'rules' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredRules.map(rule => (
                    <Card key={rule.id} className="bg-white/5 border-white/10">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {getStatusIcon(rule.status)}
                            <div>
                              <CardTitle className="text-white text-lg">{rule.name}</CardTitle>
                              <Badge className={getStatusColor(rule.status)}>
                                {rule.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3 mb-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">Source:</span>
                            <span className="text-white">{rule.source}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">Destination:</span>
                            <span className="text-white">{rule.destination}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">Frequency:</span>
                            <span className="text-white flex items-center space-x-1">
                              {getFrequencyIcon(rule.frequency)}
                              <span>{rule.frequency}</span>
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">Sync Count:</span>
                            <span className="text-white">{rule.syncCount}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">Error Count:</span>
                            <span className="text-white">{rule.errorCount}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">Last Sync:</span>
                            <span className="text-white">
                              {rule.lastSync?.toLocaleTimeString() || 'Never'}
                            </span>
                          </div>
                        </div>

                        <div className="mb-4">
                          <p className="text-gray-400 text-sm mb-2">Data Types:</p>
                          <div className="flex flex-wrap gap-1">
                            {rule.dataTypes.map(type => (
                              <Badge key={type} variant="outline" className="text-xs text-gray-400 border-gray-400">
                                {type}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <Button
                            onClick={() => runSyncRule(rule.id)}
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white flex-1"
                          >
                            <Play className="w-4 h-4 mr-1" />
                            Run
                          </Button>
                          <Button
                            onClick={() => toggleSyncRule(rule.id)}
                            size="sm"
                            variant="outline"
                            className="text-yellow-400 border-yellow-400 hover:bg-yellow-400 hover:text-white"
                          >
                            {rule.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                          </Button>
                          <Button
                            onClick={() => deleteSyncRule(rule.id)}
                            size="sm"
                            variant="outline"
                            className="text-red-400 border-red-400 hover:bg-red-400 hover:text-white"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {selectedTab === 'logs' && (
              <div className="space-y-6">
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center space-x-2">
                      <Activity className="w-5 h-5 text-blue-400" />
                      <span>Sync Logs</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {filteredLogs.map(log => {
                        const rule = syncRules.find(r => r.id === log.ruleId);
                        return (
                          <div key={log.id} className="p-4 bg-black/20 rounded-lg border border-white/10">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-3">
                                {getLogStatusIcon(log.status)}
                                <div>
                                  <h4 className="text-white font-semibold">{rule?.name || 'Unknown Rule'}</h4>
                                  <p className="text-gray-400 text-sm">
                                    {log.timestamp.toLocaleString()} • {log.duration}ms
                                  </p>
                                </div>
                              </div>
                              <Badge variant="outline" className={
                                log.status === 'success' ? 'text-green-400 border-green-400' : 
                                log.status === 'error' ? 'text-red-400 border-red-400' : 
                                'text-yellow-400 border-yellow-400'
                              }>
                                {log.status}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-4 gap-4 text-sm">
                              <div className="text-center">
                                <p className="text-gray-400">Processed</p>
                                <p className="text-white font-semibold">{log.recordsProcessed}</p>
                              </div>
                              <div className="text-center">
                                <p className="text-gray-400">Added</p>
                                <p className="text-green-400 font-semibold">+{log.recordsAdded}</p>
                              </div>
                              <div className="text-center">
                                <p className="text-gray-400">Updated</p>
                                <p className="text-blue-400 font-semibold">~{log.recordsUpdated}</p>
                              </div>
                              <div className="text-center">
                                <p className="text-gray-400">Deleted</p>
                                <p className="text-red-400 font-semibold">-{log.recordsDeleted}</p>
                              </div>
                            </div>
                            {log.errorMessage && (
                              <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded">
                                <p className="text-red-400 text-sm">{log.errorMessage}</p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {selectedTab === 'analytics' && (
              <div className="space-y-6">
                {/* Performance Metrics */}
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5 text-green-400" />
                      <span>Performance Analytics</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="p-4 bg-black/20 rounded-lg border border-white/10 text-center">
                        <p className="text-gray-400 text-sm">Total Syncs (24h)</p>
                        <p className="text-2xl font-bold text-white">{statistics.last24Hours.syncs}</p>
                      </div>
                      <div className="p-4 bg-black/20 rounded-lg border border-white/10 text-center">
                        <p className="text-gray-400 text-sm">Records Synced (24h)</p>
                        <p className="text-2xl font-bold text-white">{statistics.last24Hours.records.toLocaleString()}</p>
                      </div>
                      <div className="p-4 bg-black/20 rounded-lg border border-white/10 text-center">
                        <p className="text-gray-400 text-sm">Average Sync Time</p>
                        <p className="text-2xl font-bold text-white">{statistics.averageSyncTime}ms</p>
                      </div>
                      <div className="p-4 bg-black/20 rounded-lg border border-white/10 text-center">
                        <p className="text-gray-400 text-sm">Error Rate</p>
                        <p className="text-2xl font-bold text-red-400">
                          {Math.round((statistics.failedSyncs / statistics.totalSyncs) * 100) || 0}%
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Rule Performance */}
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center space-x-2">
                      <BarChart3 className="w-5 h-5 text-blue-400" />
                      <span>Rule Performance</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {syncRules.map(rule => {
                        const ruleLogs = syncLogs.filter(log => log.ruleId === rule.id);
                        const avgDuration = ruleLogs.length > 0 
                          ? ruleLogs.reduce((sum, log) => sum + log.duration, 0) / ruleLogs.length 
                          : 0;
                        const successRate = ruleLogs.length > 0
                          ? (ruleLogs.filter(log => log.status === 'success').length / ruleLogs.length) * 100
                          : 0;

                        return (
                          <div key={rule.id} className="p-4 bg-black/20 rounded-lg border border-white/10">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <h4 className="text-white font-semibold">{rule.name}</h4>
                                <p className="text-gray-400 text-sm">
                                  {rule.source} → {rule.destination}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-white font-semibold">{Math.round(successRate)}%</p>
                                <p className="text-gray-400 text-sm">Success Rate</p>
                              </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div className="text-center">
                                <p className="text-gray-400">Total Syncs</p>
                                <p className="text-white font-semibold">{rule.syncCount}</p>
                              </div>
                              <div className="text-center">
                                <p className="text-gray-400">Avg Duration</p>
                                <p className="text-white font-semibold">{Math.round(avgDuration)}ms</p>
                              </div>
                              <div className="text-center">
                                <p className="text-gray-400">Errors</p>
                                <p className="text-red-400 font-semibold">{rule.errorCount}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Create Rule Modal */}
        {isCreatingRule && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-lg bg-slate-800 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Create Sync Rule</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Rule Name
                    </label>
                    <Input
                      placeholder="Enter rule name"
                      className="bg-white/5 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Frequency
                    </label>
                    <select className="w-full p-2 bg-white/5 border border-white/20 text-white rounded">
                      <option value="real-time">Real-time</option>
                      <option value="minute">Every Minute</option>
                      <option value="hourly">Hourly</option>
                      <option value="daily">Daily</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Source
                  </label>
                  <Input
                    placeholder="Source system"
                    className="bg-white/5 border-white/20 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Destination
                  </label>
                  <Input
                    placeholder="Destination system"
                    className="bg-white/5 border-white/20 text-white"
                  />
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => createSyncRule({})}
                    className="bg-green-600 hover:bg-green-700 text-white flex-1"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Rule
                  </Button>
                  <Button
                    onClick={() => setIsCreatingRule(false)}
                    variant="outline"
                    className="text-gray-400 border-gray-400 hover:bg-gray-400 hover:text-white"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
