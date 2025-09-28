import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { 
  Zap, 
  Search, 
  Database, 
  Globe, 
  GitBranch, 
  MessageSquare, 
  Settings, 
  Play, 
  Square, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Code,
  FileText,
  Terminal,
  Network,
  Lock,
  Key,
  Activity,
  BarChart3,
  Clock,
  Download,
  Upload,
  Trash2,
  Plus,
  Eye,
  Edit
} from 'lucide-react';

interface MCPTool {
  id: string;
  name: string;
  description: string;
  category: 'context' | 'git' | 'ai' | 'database' | 'api' | 'security';
  status: 'active' | 'inactive' | 'error';
  version: string;
  endpoints: string[];
  lastUsed?: Date;
  usageCount: number;
  capabilities: string[];
}

interface MCPConnection {
  id: string;
  name: string;
  type: 'context7' | 'gitkraken' | 'custom';
  endpoint: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSync: Date;
  tools: MCPTool[];
}

interface MCPUsage {
  toolId: string;
  timestamp: Date;
  operation: string;
  duration: number;
  success: boolean;
  error?: string;
}

export const EnhancedMCPToolsApp: React.FC = () => {
  const { user } = useAuth();
  const [connections, setConnections] = useState<MCPConnection[]>([]);
  const [selectedConnection, setSelectedConnection] = useState<MCPConnection | null>(null);
  const [tools, setTools] = useState<MCPTool[]>([]);
  const [usage, setUsage] = useState<MCPUsage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'tools' | 'connections' | 'usage'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isTesting, setIsTesting] = useState(false);
  const [testResults, setTestResults] = useState<{[key: string]: any}>({});

  useEffect(() => {
    loadMCPData();
    
    // Set up real-time updates
    const interval = setInterval(() => {
      loadMCPData();
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const loadMCPData = async () => {
    try {
      await Promise.all([
        loadConnections(),
        loadTools(),
        loadUsage()
      ]);
    } catch (error) {
      console.error('Failed to load MCP data:', error);
      // Use mock data if API fails
      setConnections(getMockConnections());
      setTools(getMockTools());
      setUsage(getMockUsage());
    } finally {
      setLoading(false);
    }
  };

  const loadConnections = async () => {
    try {
      const response = await fetch('/api/mcp/connections');
      const data = await response.json();
      
      if (data.connections) {
        setConnections(data.connections.map((conn: any) => ({
          ...conn,
          lastSync: new Date(conn.lastSync),
          tools: conn.tools.map((tool: any) => ({
            ...tool,
            lastUsed: tool.lastUsed ? new Date(tool.lastUsed) : undefined
          }))
        })));
      } else {
        setConnections(getMockConnections());
      }
    } catch (error) {
      console.error('Failed to load MCP connections:', error);
      setConnections(getMockConnections());
    }
  };

  const loadTools = async () => {
    try {
      const response = await fetch('/api/mcp/tools');
      const data = await response.json();
      
      if (data.tools) {
        setTools(data.tools.map((tool: any) => ({
          ...tool,
          lastUsed: tool.lastUsed ? new Date(tool.lastUsed) : undefined
        })));
      } else {
        setTools(getMockTools());
      }
    } catch (error) {
      console.error('Failed to load MCP tools:', error);
      setTools(getMockTools());
    }
  };

  const loadUsage = async () => {
    try {
      const response = await fetch('/api/mcp/usage');
      const data = await response.json();
      
      if (data.usage) {
        setUsage(data.usage.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        })));
      } else {
        setUsage(getMockUsage());
      }
    } catch (error) {
      console.error('Failed to load MCP usage:', error);
      setUsage(getMockUsage());
    }
  };

  const testMCPTool = async (tool: MCPTool) => {
    setIsTesting(true);
    try {
      const response = await fetch(`/api/mcp/tools/${tool.id}/test`, {
        method: 'POST'
      });
      
      if (response.ok) {
        const result = await response.json();
        setTestResults(prev => ({ ...prev, [tool.id]: result }));
        alert(`Tool ${tool.name} test completed successfully!`);
      } else {
        throw new Error('Test failed');
      }
    } catch (error) {
      console.error('Failed to test MCP tool:', error);
      setTestResults(prev => ({ ...prev, [tool.id]: { error: 'Test failed' } }));
      alert(`Failed to test ${tool.name}. Please try again.`);
    } finally {
      setIsTesting(false);
    }
  };

  const executeMCPTool = async (tool: MCPTool, parameters: any) => {
    try {
      const response = await fetch(`/api/mcp/tools/${tool.id}/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parameters)
      });
      
      if (response.ok) {
        const result = await response.json();
        loadUsage(); // Refresh usage data
        return result;
      } else {
        throw new Error('Execution failed');
      }
    } catch (error) {
      console.error('Failed to execute MCP tool:', error);
      throw error;
    }
  };

  const createConnection = async (connectionData: any) => {
    try {
      const response = await fetch('/api/mcp/connections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(connectionData)
      });
      
      if (response.ok) {
        loadConnections();
        alert('MCP connection created successfully!');
      } else {
        throw new Error('Failed to create connection');
      }
    } catch (error) {
      console.error('Failed to create MCP connection:', error);
      alert('Failed to create MCP connection. Please try again.');
    }
  };

  const deleteConnection = async (connectionId: string) => {
    if (!confirm('Are you sure you want to delete this MCP connection?')) return;

    try {
      const response = await fetch(`/api/mcp/connections/${connectionId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        loadConnections();
        alert('MCP connection deleted successfully!');
      } else {
        throw new Error('Failed to delete connection');
      }
    } catch (error) {
      console.error('Failed to delete MCP connection:', error);
      alert('Failed to delete MCP connection. Please try again.');
    }
  };

  const getToolIcon = (category: string) => {
    switch (category) {
      case 'context':
        return <Database className="w-5 h-5 text-blue-400" />;
      case 'git':
        return <GitBranch className="w-5 h-5 text-green-400" />;
      case 'ai':
        return <Zap className="w-5 h-5 text-purple-400" />;
      case 'database':
        return <Database className="w-5 h-5 text-orange-400" />;
      case 'api':
        return <Globe className="w-5 h-5 text-cyan-400" />;
      case 'security':
        return <Lock className="w-5 h-5 text-red-400" />;
      default:
        return <Code className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-600 text-white';
      case 'inactive':
        return 'bg-gray-600 text-white';
      case 'error':
        return 'bg-red-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  const getConnectionStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'disconnected':
        return <XCircle className="w-4 h-4 text-gray-400" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
      default:
        return <XCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  // Mock data functions
  const getMockConnections = (): MCPConnection[] => [
    {
      id: '1',
      name: 'Context7 Integration',
      type: 'context7',
      endpoint: 'https://api.context7.com/mcp',
      status: 'connected',
      lastSync: new Date(Date.now() - 1000 * 60 * 5),
      tools: []
    },
    {
      id: '2',
      name: 'GitKraken MCP',
      type: 'gitkraken',
      endpoint: 'https://api.gitkraken.com/mcp',
      status: 'connected',
      lastSync: new Date(Date.now() - 1000 * 60 * 10),
      tools: []
    },
    {
      id: '3',
      name: 'Custom MCP Server',
      type: 'custom',
      endpoint: 'http://localhost:3001/mcp',
      status: 'disconnected',
      lastSync: new Date(Date.now() - 1000 * 60 * 60 * 2),
      tools: []
    }
  ];

  const getMockTools = (): MCPTool[] => [
    {
      id: '1',
      name: 'Context7 Resolve Library',
      description: 'Resolves library names to Context7-compatible IDs',
      category: 'context',
      status: 'active',
      version: '1.0.0',
      endpoints: ['/resolve-library-id'],
      lastUsed: new Date(Date.now() - 1000 * 60 * 15),
      usageCount: 245,
      capabilities: ['library-resolution', 'search', 'metadata']
    },
    {
      id: '2',
      name: 'Context7 Get Docs',
      description: 'Fetches up-to-date documentation for libraries',
      category: 'context',
      status: 'active',
      version: '1.0.0',
      endpoints: ['/get-library-docs'],
      lastUsed: new Date(Date.now() - 1000 * 60 * 8),
      usageCount: 189,
      capabilities: ['documentation', 'api-reference', 'examples']
    },
    {
      id: '3',
      name: 'GitKraken Status',
      description: 'Shows the working tree status',
      category: 'git',
      status: 'active',
      version: '1.0.0',
      endpoints: ['/git-status'],
      lastUsed: new Date(Date.now() - 1000 * 60 * 3),
      usageCount: 156,
      capabilities: ['git-status', 'file-tracking', 'branch-info']
    },
    {
      id: '4',
      name: 'GitKraken Add/Commit',
      description: 'Add file contents to index or record changes',
      category: 'git',
      status: 'active',
      version: '1.0.0',
      endpoints: ['/git-add-or-commit'],
      lastUsed: new Date(Date.now() - 1000 * 60 * 12),
      usageCount: 98,
      capabilities: ['git-add', 'git-commit', 'staging']
    },
    {
      id: '5',
      name: 'GitKraken Branch',
      description: 'List or create branches',
      category: 'git',
      status: 'active',
      version: '1.0.0',
      endpoints: ['/git-branch'],
      lastUsed: new Date(Date.now() - 1000 * 60 * 20),
      usageCount: 67,
      capabilities: ['branch-management', 'branch-creation', 'branch-listing']
    },
    {
      id: '6',
      name: 'GitKraken Issues',
      description: 'Manage GitHub/GitLab issues and pull requests',
      category: 'git',
      status: 'active',
      version: '1.0.0',
      endpoints: ['/issues-get-detail', '/issues-assigned-to-me'],
      lastUsed: new Date(Date.now() - 1000 * 60 * 30),
      usageCount: 134,
      capabilities: ['issue-management', 'pr-tracking', 'assignments']
    }
  ];

  const getMockUsage = (): MCPUsage[] => [
    {
      toolId: '1',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      operation: 'resolve-library-id',
      duration: 250,
      success: true
    },
    {
      toolId: '2',
      timestamp: new Date(Date.now() - 1000 * 60 * 8),
      operation: 'get-library-docs',
      duration: 1200,
      success: true
    },
    {
      toolId: '3',
      timestamp: new Date(Date.now() - 1000 * 60 * 3),
      operation: 'git-status',
      duration: 180,
      success: true
    },
    {
      toolId: '4',
      timestamp: new Date(Date.now() - 1000 * 60 * 12),
      operation: 'git-add-or-commit',
      duration: 450,
      success: true
    },
    {
      toolId: '5',
      timestamp: new Date(Date.now() - 1000 * 60 * 20),
      operation: 'git-branch',
      duration: 320,
      success: true
    }
  ];

  const filteredTools = tools.filter(tool => {
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = ['all', 'context', 'git', 'ai', 'database', 'api', 'security'];

  if (loading) {
    return (
      <div className="flex h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400 mx-auto mb-4"></div>
            <p className="text-white text-lg">Loading MCP Tools...</p>
            <p className="text-gray-400">Connecting to Model Context Protocol</p>
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
            <Zap className="w-8 h-8 text-purple-400" />
            <div>
              <h1 className="text-2xl font-bold text-white">MCP Tools Manager</h1>
              <p className="text-gray-400">Model Context Protocol integration and management</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              onClick={loadMCPData}
              variant="outline"
              className="text-purple-400 border-purple-400 hover:bg-purple-400 hover:text-white"
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
                <Network className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{connections.length}</p>
                <p className="text-gray-400 text-sm">MCP Connections</p>
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4 text-center">
                <Code className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{tools.length}</p>
                <p className="text-gray-400 text-sm">Available Tools</p>
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4 text-center">
                <Activity className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{usage.length}</p>
                <p className="text-gray-400 text-sm">Total Operations</p>
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4 text-center">
                <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">
                  {Math.round((usage.filter(u => u.success).length / usage.length) * 100) || 0}%
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
            { id: 'tools', label: 'Tools', icon: Code },
            { id: 'connections', label: 'Connections', icon: Network },
            { id: 'usage', label: 'Usage', icon: Activity }
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
                {/* Recent Usage */}
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center space-x-2">
                      <Activity className="w-5 h-5 text-purple-400" />
                      <span>Recent MCP Operations</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {usage.slice(0, 5).map((item, index) => {
                        const tool = tools.find(t => t.id === item.toolId);
                        return (
                          <div key={index} className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-white/10">
                            <div className="flex items-center space-x-4">
                              <div className={`w-3 h-3 rounded-full ${item.success ? 'bg-green-500' : 'bg-red-500'}`} />
                              <div>
                                <h4 className="text-white font-semibold">{tool?.name || 'Unknown Tool'}</h4>
                                <p className="text-gray-400 text-sm">{item.operation}</p>
                                <p className="text-gray-500 text-xs">
                                  {item.timestamp.toLocaleString()} • {item.duration}ms
                                </p>
                              </div>
                            </div>
                            <Badge variant="outline" className={item.success ? 'text-green-400 border-green-400' : 'text-red-400 border-red-400'}>
                              {item.success ? 'Success' : 'Failed'}
                            </Badge>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Active Connections */}
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center space-x-2">
                      <Network className="w-5 h-5 text-blue-400" />
                      <span>MCP Connections</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {connections.map(connection => (
                        <div key={connection.id} className="p-4 bg-black/20 rounded-lg border border-white/10">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              {getConnectionStatusIcon(connection.status)}
                              <div>
                                <h4 className="text-white font-semibold">{connection.name}</h4>
                                <p className="text-gray-400 text-sm">{connection.type}</p>
                              </div>
                            </div>
                            <Badge className={getStatusColor(connection.status)}>
                              {connection.status}
                            </Badge>
                          </div>
                          <p className="text-gray-300 text-sm mb-3">{connection.endpoint}</p>
                          <div className="flex items-center justify-between text-xs text-gray-400">
                            <span>Last sync: {connection.lastSync.toLocaleTimeString()}</span>
                            <span>{connection.tools.length} tools</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {selectedTab === 'tools' && (
              <div className="space-y-6">
                {/* Filters */}
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search MCP tools..."
                      className="pl-10 bg-white/5 border-white/20 text-white placeholder-gray-400 w-64"
                    />
                  </div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-white/5 border border-white/20 text-white rounded px-3 py-2"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tools Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTools.map(tool => (
                    <Card key={tool.id} className="bg-white/5 border-white/10">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {getToolIcon(tool.category)}
                            <div>
                              <CardTitle className="text-white text-lg">{tool.name}</CardTitle>
                              <Badge className={getStatusColor(tool.status)}>
                                {tool.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-300 mb-4">{tool.description}</p>
                        
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Version:</span>
                            <span className="text-white">{tool.version}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Usage Count:</span>
                            <span className="text-white">{tool.usageCount}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Last Used:</span>
                            <span className="text-white">
                              {tool.lastUsed ? tool.lastUsed.toLocaleTimeString() : 'Never'}
                            </span>
                          </div>
                        </div>

                        <div className="mt-4">
                          <p className="text-gray-400 text-sm mb-2">Capabilities:</p>
                          <div className="flex flex-wrap gap-1">
                            {tool.capabilities.slice(0, 3).map(capability => (
                              <Badge key={capability} variant="outline" className="text-xs text-gray-400 border-gray-400">
                                {capability}
                              </Badge>
                            ))}
                            {tool.capabilities.length > 3 && (
                              <Badge variant="outline" className="text-xs text-gray-400 border-gray-400">
                                +{tool.capabilities.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex space-x-2 mt-4">
                          <Button
                            onClick={() => testMCPTool(tool)}
                            disabled={isTesting}
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
                          >
                            {isTesting ? (
                              <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                              <Play className="w-4 h-4" />
                            )}
                            Test
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-gray-400 border-gray-400 hover:bg-gray-400 hover:text-white"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {selectedTab === 'connections' && (
              <div className="space-y-6">
                {/* Connection Management */}
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center space-x-2">
                      <Network className="w-5 h-5 text-blue-400" />
                      <span>MCP Connections</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {connections.map(connection => (
                        <div key={connection.id} className="p-4 bg-black/20 rounded-lg border border-white/10">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              {getConnectionStatusIcon(connection.status)}
                              <div>
                                <h4 className="text-white font-semibold">{connection.name}</h4>
                                <p className="text-gray-400 text-sm">{connection.endpoint}</p>
                                <p className="text-gray-500 text-xs">
                                  Type: {connection.type} • Last sync: {connection.lastSync.toLocaleString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge className={getStatusColor(connection.status)}>
                                {connection.status}
                              </Badge>
                              <Button
                                onClick={() => deleteConnection(connection.id)}
                                size="sm"
                                variant="outline"
                                className="text-red-400 border-red-400 hover:bg-red-400 hover:text-white"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {selectedTab === 'usage' && (
              <div className="space-y-6">
                {/* Usage Statistics */}
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center space-x-2">
                      <Activity className="w-5 h-5 text-purple-400" />
                      <span>MCP Usage Statistics</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {usage.map((item, index) => {
                        const tool = tools.find(t => t.id === item.toolId);
                        return (
                          <div key={index} className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-white/10">
                            <div className="flex items-center space-x-4">
                              <div className={`w-3 h-3 rounded-full ${item.success ? 'bg-green-500' : 'bg-red-500'}`} />
                              <div>
                                <h4 className="text-white font-semibold">{tool?.name || 'Unknown Tool'}</h4>
                                <p className="text-gray-400 text-sm">{item.operation}</p>
                                <p className="text-gray-500 text-xs">
                                  {item.timestamp.toLocaleString()} • Duration: {item.duration}ms
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <Badge variant="outline" className={item.success ? 'text-green-400 border-green-400' : 'text-red-400 border-red-400'}>
                                {item.success ? 'Success' : 'Failed'}
                              </Badge>
                              <span className="text-gray-400 text-sm">{item.duration}ms</span>
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
      </div>
    </div>
  );
};
