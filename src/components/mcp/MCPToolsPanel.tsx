import React, { useState, useMemo } from 'react';
import { GlassCard } from '../dashboard/GlassCard';

interface MCPTool {
  id: string;
  name: string;
  description: string;
  category:
    | 'communication'
    | 'automation'
    | 'analysis'
    | 'integration'
    | 'utility';
  status: 'active' | 'inactive' | 'testing' | 'error';
  lastUsed?: string;
  successRate: number;
  tags: string[];
  apiEndpoint?: string;
  documentation?: string;
}

interface MCPToolsPanelProps {
  className?: string;
}

export const MCPToolsPanel: React.FC<MCPToolsPanelProps> = ({
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showLiveTest, setShowLiveTest] = useState<string | null>(null);

  const tools: MCPTool[] = [
    {
      id: 'telegram-bot',
      name: 'Telegram Bot',
      description: 'Automated messaging and bot interactions',
      category: 'communication',
      status: 'active',
      lastUsed: '2 min ago',
      successRate: 98,
      tags: ['messaging', 'bot', 'automation'],
      apiEndpoint: '/api/mcp/telegram',
      documentation: 'https://docs.auraos.com/mcp/telegram',
    },
    {
      id: 'github-integration',
      name: 'GitHub Integration',
      description: 'Repository management and code analysis',
      category: 'integration',
      status: 'active',
      lastUsed: '5 min ago',
      successRate: 95,
      tags: ['git', 'repository', 'code'],
      apiEndpoint: '/api/mcp/github',
    },
    {
      id: 'ai-analysis',
      name: 'AI Analysis Engine',
      description: 'Content analysis and sentiment detection',
      category: 'analysis',
      status: 'testing',
      lastUsed: '1 hour ago',
      successRate: 87,
      tags: ['ai', 'analysis', 'sentiment'],
      apiEndpoint: '/api/mcp/ai-analysis',
    },
    {
      id: 'workflow-automation',
      name: 'Workflow Automation',
      description: 'Automated task execution and scheduling',
      category: 'automation',
      status: 'active',
      lastUsed: '30 sec ago',
      successRate: 92,
      tags: ['automation', 'workflow', 'scheduling'],
    },
    {
      id: 'data-processor',
      name: 'Data Processor',
      description: 'Real-time data processing and transformation',
      category: 'utility',
      status: 'error',
      lastUsed: '2 hours ago',
      successRate: 76,
      tags: ['data', 'processing', 'transformation'],
    },
    {
      id: 'notification-service',
      name: 'Notification Service',
      description: 'Multi-channel notification delivery',
      category: 'communication',
      status: 'active',
      lastUsed: '10 min ago',
      successRate: 99,
      tags: ['notifications', 'alerts', 'delivery'],
    },
  ];

  const categories = [
    { id: 'all', name: 'All Tools', count: tools.length },
    {
      id: 'communication',
      name: 'Communication',
      count: tools.filter(t => t.category === 'communication').length,
    },
    {
      id: 'automation',
      name: 'Automation',
      count: tools.filter(t => t.category === 'automation').length,
    },
    {
      id: 'analysis',
      name: 'Analysis',
      count: tools.filter(t => t.category === 'analysis').length,
    },
    {
      id: 'integration',
      name: 'Integration',
      count: tools.filter(t => t.category === 'integration').length,
    },
    {
      id: 'utility',
      name: 'Utility',
      count: tools.filter(t => t.category === 'utility').length,
    },
  ];

  const filteredTools = useMemo(() => {
    return tools.filter(tool => {
      const matchesTab = activeTab === 'all' || tool.category === activeTab;
      const matchesCategory =
        selectedCategory === 'all' || tool.category === selectedCategory;
      const matchesSearch =
        searchQuery === '' ||
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.tags.some(tag =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        );

      return matchesTab && matchesCategory && matchesSearch;
    });
  }, [activeTab, selectedCategory, searchQuery, tools]);

  const getStatusColor = (status: MCPTool['status']) => {
    switch (status) {
      case 'active':
        return 'text-status-success bg-status-success-bg border-status-success';
      case 'testing':
        return 'text-status-warning bg-status-warning-bg border-status-warning';
      case 'error':
        return 'text-status-error bg-status-error-bg border-status-error';
      case 'inactive':
        return 'text-text-secondary bg-glass-secondary border-glass-border';
      default:
        return 'text-text-primary bg-glass-primary border-glass-border';
    }
  };

  const getCategoryIcon = (category: MCPTool['category']) => {
    switch (category) {
      case 'communication':
        return '💬';
      case 'automation':
        return '⚙️';
      case 'analysis':
        return '📊';
      case 'integration':
        return '🔗';
      case 'utility':
        return '🛠️';
      default:
        return '📦';
    }
  };

  const handleLiveTest = (toolId: string) => {
    setShowLiveTest(showLiveTest === toolId ? null : toolId);
  };

  return (
    <GlassCard
      title="MCP Tools Dashboard"
      subtitle="Model Context Protocol Integration"
      glowColor="blue"
      className={className}
    >
      {/* Search and Filter Bar */}
      <div className="mb-6 space-y-4">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search tools, descriptions, or tags..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 bg-glass-primary border border-glass-border rounded-lg text-text-primary placeholder-text-secondary focus:border-cyber-blue focus:outline-none focus:ring-2 focus:ring-cyber-blue/20"
            />
            <div className="absolute right-3 top-2.5 text-text-secondary">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="px-4 py-2 bg-glass-primary border border-glass-border rounded-lg text-text-primary focus:border-cyber-blue focus:outline-none"
          >
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name} ({cat.count})
              </option>
            ))}
          </select>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === cat.id
                  ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white shadow-glow-blue-md'
                  : 'bg-glass-secondary text-text-secondary hover:bg-glass-primary hover:text-text-primary'
              }`}
            >
              {cat.name} ({cat.count})
            </button>
          ))}
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTools.map(tool => (
          <div
            key={tool.id}
            className={`p-4 rounded-lg border backdrop-blur-sm transition-all duration-200 hover:shadow-glow-blue-sm ${getStatusColor(tool.status)}`}
          >
            {/* Tool Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">
                  {getCategoryIcon(tool.category)}
                </span>
                <div>
                  <h3 className="font-bold text-sm">{tool.name}</h3>
                  <div className="text-xs opacity-70 capitalize">
                    {tool.category}
                  </div>
                </div>
              </div>
              <div
                className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(tool.status)}`}
              >
                {tool.status}
              </div>
            </div>

            {/* Description */}
            <p className="text-xs mb-3 opacity-80 line-clamp-2">
              {tool.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1 mb-3">
              {tool.tags.slice(0, 3).map(tag => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-glass-secondary text-xs rounded-full border border-glass-border"
                >
                  {tag}
                </span>
              ))}
              {tool.tags.length > 3 && (
                <span className="px-2 py-1 bg-glass-secondary text-xs rounded-full border border-glass-border">
                  +{tool.tags.length - 3}
                </span>
              )}
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs">
                <div className="font-medium">Success Rate</div>
                <div className="text-status-success">{tool.successRate}%</div>
              </div>
              <div className="text-xs">
                <div className="font-medium">Last Used</div>
                <div className="opacity-70">{tool.lastUsed}</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-3">
              <div className="w-full bg-glass-secondary rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    tool.successRate >= 90
                      ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                      : tool.successRate >= 75
                        ? 'bg-gradient-to-r from-yellow-400 to-orange-500'
                        : 'bg-gradient-to-r from-red-400 to-pink-500'
                  }`}
                  style={{ width: `${tool.successRate}%` }}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => handleLiveTest(tool.id)}
                className="flex-1 px-3 py-1.5 bg-gradient-to-r from-cyan-400 to-blue-500 text-white text-xs rounded-md hover:shadow-glow-blue-sm transition-all duration-200"
              >
                {showLiveTest === tool.id ? 'Hide Test' : 'Live Test'}
              </button>
              {tool.documentation && (
                <button className="px-3 py-1.5 bg-glass-primary border border-glass-border text-text-primary text-xs rounded-md hover:bg-glass-secondary transition-all duration-200">
                  Docs
                </button>
              )}
            </div>

            {/* Live Test Panel */}
            {showLiveTest === tool.id && (
              <div className="mt-3 p-3 bg-glass-secondary rounded-lg border border-glass-border">
                <div className="text-xs font-medium mb-2">Live Test</div>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Test input..."
                    className="w-full px-2 py-1 text-xs bg-bg-primary border border-glass-border rounded focus:border-cyber-blue focus:outline-none"
                  />
                  <button className="w-full px-2 py-1 bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xs rounded hover:shadow-glow-green-sm transition-all duration-200">
                    Execute Test
                  </button>
                </div>
                <div className="mt-2 text-xs text-text-secondary">
                  API: {tool.apiEndpoint}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-4 gap-4 pt-4 border-t border-glass-border">
        <div className="text-center">
          <div className="text-lg font-bold text-status-success">
            {tools.filter(t => t.status === 'active').length}
          </div>
          <div className="text-xs text-text-secondary">Active</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-status-warning">
            {tools.filter(t => t.status === 'testing').length}
          </div>
          <div className="text-xs text-text-secondary">Testing</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-status-error">
            {tools.filter(t => t.status === 'error').length}
          </div>
          <div className="text-xs text-text-secondary">Errors</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-text-primary">
            {Math.round(
              tools.reduce((acc, t) => acc + t.successRate, 0) / tools.length
            )}
            %
          </div>
          <div className="text-xs text-text-secondary">Avg Success</div>
        </div>
      </div>
    </GlassCard>
  );
};

export default MCPToolsPanel;
