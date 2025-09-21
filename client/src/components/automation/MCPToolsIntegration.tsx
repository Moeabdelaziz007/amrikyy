// Advanced MCP (Model Context Protocol) Tools Integration
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Code, Database, Globe, Search, Download, Upload, Settings, 
  Play, Pause, Square, RefreshCw, CheckCircle, XCircle, AlertCircle,
  Activity, TrendingUp, Users, Shield, Lock, Eye, EyeOff, 
  Plus, Edit3, Trash2, Copy, Share2, Zap, Bot, Cpu, Network,
  ChevronDown, ChevronRight, Star, Heart, MessageSquare,
  Calendar, Timer, Target, Lightbulb, Cloud, Archive
} from 'lucide-react';

interface MCPTool {
  id: string;
  name: string;
  description: string;
  category: 'development' | 'data' | 'database' | 'web' | 'ai' | 'automation' | 'integration';
  icon: string;
  version: string;
  status: 'active' | 'inactive' | 'error' | 'updating';
  capabilities: string[];
  usage: number;
  lastUsed: string;
  performance: ToolPerformance;
  settings: ToolSettings;
  dependencies: string[];
  integrations: ToolIntegration[];
  documentation: string;
  examples: ToolExample[];
  isOfficial: boolean;
  isVerified: boolean;
  rating: number;
  downloads: number;
  author: {
    id: string;
    name: string;
    avatar: string;
    verified: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

interface ToolPerformance {
  avgResponseTime: number;
  successRate: number;
  errorRate: number;
  uptime: number;
  resourceUsage: {
    cpu: number;
    memory: number;
    storage: number;
  };
}

interface ToolSettings {
  autoUpdate: boolean;
  notifications: boolean;
  logging: boolean;
  rateLimit: number;
  timeout: number;
  retryAttempts: number;
  security: {
    encryption: boolean;
    authentication: boolean;
    authorization: boolean;
  };
}

interface ToolIntegration {
  id: string;
  name: string;
  type: 'api' | 'webhook' | 'database' | 'file' | 'message';
  status: 'connected' | 'disconnected' | 'error';
  config: Record<string, any>;
  lastSync: string;
}

interface ToolExample {
  id: string;
  name: string;
  description: string;
  code: string;
  language: string;
  category: string;
  tags: string[];
}

interface MCPToolsIntegrationProps {
  tools: MCPTool[];
  onToolInstall: (toolId: string) => void;
  onToolUninstall: (toolId: string) => void;
  onToolConfigure: (toolId: string, settings: Partial<ToolSettings>) => void;
  onToolExecute: (toolId: string, parameters: Record<string, any>) => void;
  onToolUpdate: (toolId: string) => void;
}

export default function MCPToolsIntegration({
  tools,
  onToolInstall,
  onToolUninstall,
  onToolConfigure,
  onToolExecute,
  onToolUpdate
}: MCPToolsIntegrationProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'usage' | 'rating' | 'updated'>('usage');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedTool, setSelectedTool] = useState<MCPTool | null>(null);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [showInstallModal, setShowInstallModal] = useState<boolean>(false);
  const [expandedTools, setExpandedTools] = useState<Set<string>>(new Set());

  const categories = [
    { id: 'all', name: 'All Tools', icon: '🔧', count: tools.length },
    { id: 'development', name: 'Development', icon: '💻', count: tools.filter(t => t.category === 'development').length },
    { id: 'data', name: 'Data Processing', icon: '📊', count: tools.filter(t => t.category === 'data').length },
    { id: 'database', name: 'Database', icon: '🗄️', count: tools.filter(t => t.category === 'database').length },
    { id: 'web', name: 'Web Tools', icon: '🌐', count: tools.filter(t => t.category === 'web').length },
    { id: 'ai', name: 'AI & ML', icon: '🤖', count: tools.filter(t => t.category === 'ai').length },
    { id: 'automation', name: 'Automation', icon: '⚡', count: tools.filter(t => t.category === 'automation').length },
    { id: 'integration', name: 'Integration', icon: '🔗', count: tools.filter(t => t.category === 'integration').length }
  ];

  const filteredTools = tools.filter(tool => {
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.capabilities.some(cap => cap.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterStatus === 'all' || tool.status === filterStatus;
    return matchesCategory && matchesSearch && matchesFilter;
  });

  const sortedTools = [...filteredTools].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'usage':
        return b.usage - a.usage;
      case 'rating':
        return b.rating - a.rating;
      case 'updated':
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      default:
        return 0;
    }
  });

  const toggleToolExpansion = useCallback((toolId: string) => {
    setExpandedTools(prev => {
      const newSet = new Set(prev);
      if (newSet.has(toolId)) {
        newSet.delete(toolId);
      } else {
        newSet.add(toolId);
      }
      return newSet;
    });
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'inactive':
        return <XCircle className="w-5 h-5 text-gray-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'updating':
        return <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'updating':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'development':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'data':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'database':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'web':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'ai':
        return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'automation':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'integration':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
            <Code className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">MCP Tools Integration</h2>
            <p className="text-gray-600">Connect and manage Model Context Protocol tools</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowInstallModal(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Install Tool
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Tools</p>
              <p className="text-3xl font-bold text-gray-900">{tools.length}</p>
              <p className="text-xs text-green-600 mt-1">+3 this week</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <Code className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Active Tools</p>
              <p className="text-3xl font-bold text-gray-900">
                {tools.filter(t => t.status === 'active').length}
              </p>
              <p className="text-xs text-green-600 mt-1">98% uptime</p>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Avg Performance</p>
              <p className="text-3xl font-bold text-gray-900">
                {Math.round(tools.reduce((acc, tool) => acc + tool.performance.successRate, 0) / tools.length || 0)}%
              </p>
              <p className="text-xs text-blue-600 mt-1">+2.1% improvement</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-xl">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Usage</p>
              <p className="text-3xl font-bold text-gray-900">
                {Math.round(tools.reduce((acc, tool) => acc + tool.usage, 0) / tools.length || 0)}%
              </p>
              <p className="text-xs text-orange-600 mt-1">Peak efficiency</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-xl">
              <Activity className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search tools..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="error">Error</option>
              <option value="updating">Updating</option>
            </select>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="usage">Usage</option>
                <option value="name">Name</option>
                <option value="rating">Rating</option>
                <option value="updated">Updated</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">View:</label>
              <div className="flex rounded-lg border border-gray-300">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                  </div>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <div className="w-4 h-4 space-y-0.5">
                    <div className="h-0.5 bg-current rounded"></div>
                    <div className="h-0.5 bg-current rounded"></div>
                    <div className="h-0.5 bg-current rounded"></div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Categories Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                    selectedCategory === category.id 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{category.icon}</span>
                    <span>{category.name}</span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    selectedCategory === category.id ? 'bg-white/20' : 'bg-gray-100'
                  }`}>
                    {category.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tools Grid/List */}
        <div className="lg:col-span-3">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {sortedTools.map((tool) => (
                <div key={tool.id} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{tool.icon}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900">{tool.name}</h3>
                        <p className="text-sm text-gray-500">v{tool.version}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(tool.status)}
                      {tool.isVerified && (
                        <div className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center">
                          <Shield className="w-3 h-3 text-blue-600" />
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4 text-sm line-clamp-2">{tool.description}</p>

                  <div className="flex items-center justify-between mb-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getCategoryColor(tool.category)}`}>
                      {tool.category}
                    </span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium text-gray-700">{tool.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Usage</span>
                      <span className="font-medium">{tool.usage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${tool.usage}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {tool.capabilities.slice(0, 3).map((capability) => (
                      <span key={capability} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                        {capability}
                      </span>
                    ))}
                    {tool.capabilities.length > 3 && (
                      <span className="text-xs text-gray-500">+{tool.capabilities.length - 3}</span>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setSelectedTool(tool);
                        setShowDetails(true);
                      }}
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      Configure
                    </button>
                    <button
                      onClick={() => onToolExecute(tool.id, {})}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Play className="w-4 h-4" />
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {sortedTools.map((tool) => (
                <div key={tool.id} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="flex-shrink-0">
                        <span className="text-2xl">{tool.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{tool.name}</h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(tool.status)}`}>
                            {tool.status}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getCategoryColor(tool.category)}`}>
                            {tool.category}
                          </span>
                          {tool.isVerified && (
                            <div className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center">
                              <Shield className="w-3 h-3 text-blue-600" />
                            </div>
                          )}
                        </div>
                        <p className="text-gray-600 mb-2 text-sm">{tool.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>v{tool.version}</span>
                          <span>Usage: {tool.usage}%</span>
                          <span>Rating: {tool.rating.toFixed(1)}</span>
                          <span>Downloads: {tool.downloads}</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {tool.capabilities.slice(0, 4).map((capability) => (
                            <span key={capability} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                              {capability}
                            </span>
                          ))}
                          {tool.capabilities.length > 4 && (
                            <span className="text-xs text-gray-500">+{tool.capabilities.length - 4}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onToolExecute(tool.id, {})}
                        className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                      >
                        <Play className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedTool(tool);
                          setShowDetails(true);
                        }}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Settings className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tool Details Modal */}
      {showDetails && selectedTool && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-3xl">{selectedTool.icon}</span>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{selectedTool.name}</h3>
                    <p className="text-gray-600">v{selectedTool.version} by {selectedTool.author.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDetails(false)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <h4 className="font-semibold text-gray-900 mb-3">Description</h4>
                  <p className="text-gray-600 mb-6">{selectedTool.description}</p>

                  <h4 className="font-semibold text-gray-900 mb-3">Capabilities</h4>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {selectedTool.capabilities.map((capability) => (
                      <span key={capability} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {capability}
                      </span>
                    ))}
                  </div>

                  <h4 className="font-semibold text-gray-900 mb-3">Performance Metrics</h4>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600">Success Rate</p>
                      <p className="text-2xl font-bold text-gray-900">{(selectedTool.performance.successRate * 100).toFixed(1)}%</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600">Avg Response Time</p>
                      <p className="text-2xl font-bold text-gray-900">{selectedTool.performance.avgResponseTime}ms</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Quick Actions</h4>
                    <div className="space-y-2">
                      <button
                        onClick={() => onToolExecute(selectedTool.id, {})}
                        className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                      >
                        Execute Tool
                      </button>
                      <button
                        onClick={() => onToolUpdate(selectedTool.id)}
                        className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                      >
                        Update Tool
                      </button>
                      <button
                        onClick={() => onToolUninstall(selectedTool.id)}
                        className="w-full border border-red-300 text-red-700 px-4 py-2 rounded-lg font-medium hover:bg-red-50 transition-colors"
                      >
                        Uninstall
                      </button>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Statistics</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Usage</span>
                        <span className="font-medium">{selectedTool.usage}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Rating</span>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="font-medium">{selectedTool.rating.toFixed(1)}</span>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Downloads</span>
                        <span className="font-medium">{selectedTool.downloads}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Last Used</span>
                        <span className="font-medium">{new Date(selectedTool.lastUsed).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
