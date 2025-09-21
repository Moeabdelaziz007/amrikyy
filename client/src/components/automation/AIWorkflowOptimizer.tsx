// Advanced AI-Powered Workflow Optimizer and Suggestions Engine
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Bot, Brain, Zap, TrendingUp, Target, Lightbulb, Settings, 
  Play, Pause, Square, RefreshCw, CheckCircle, XCircle, AlertCircle,
  Activity, BarChart3, Users, Clock, Star, Heart, Share2, 
  Plus, Edit3, Trash2, Copy, Download, Upload, Eye, EyeOff,
  ChevronDown, ChevronRight, MessageSquare, Calendar, Timer,
  Filter, Search, SortAsc, SortDesc, FilterIcon, Sliders,
  ArrowRight, ArrowLeft, Maximize2, Minimize2, ExternalLink,
  Code, Database, Globe, Shield, Lock, Unlock, Key
} from 'lucide-react';

interface WorkflowSuggestion {
  id: string;
  title: string;
  description: string;
  category: 'optimization' | 'automation' | 'integration' | 'performance' | 'security' | 'scalability';
  priority: 'low' | 'medium' | 'high' | 'critical';
  impact: 'low' | 'medium' | 'high' | 'transformational';
  effort: 'low' | 'medium' | 'high' | 'extensive';
  confidence: number;
  estimatedSavings: {
    time: number;
    cost: number;
    resources: number;
  };
  implementation: {
    steps: string[];
    requirements: string[];
    timeline: string;
    dependencies: string[];
  };
  aiReasoning: string;
  examples: WorkflowExample[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface WorkflowExample {
  id: string;
  name: string;
  description: string;
  code: string;
  language: string;
  complexity: 'simple' | 'intermediate' | 'advanced';
  successRate: number;
  performance: {
    executionTime: number;
    resourceUsage: number;
    accuracy: number;
  };
}

interface OptimizationResult {
  id: string;
  workflowId: string;
  before: {
    executionTime: number;
    resourceUsage: number;
    errorRate: number;
    cost: number;
  };
  after: {
    executionTime: number;
    resourceUsage: number;
    errorRate: number;
    cost: number;
  };
  improvements: {
    timeSaved: number;
    resourceSaved: number;
    errorReduction: number;
    costReduction: number;
  };
  aiInsights: string[];
  recommendations: string[];
  appliedAt: string;
}

interface AIPattern {
  id: string;
  name: string;
  description: string;
  category: 'performance' | 'reliability' | 'security' | 'maintainability';
  frequency: number;
  successRate: number;
  applications: string[];
  benefits: string[];
  implementation: string;
}

interface AIWorkflowOptimizerProps {
  suggestions: WorkflowSuggestion[];
  optimizations: OptimizationResult[];
  patterns: AIPattern[];
  onApplySuggestion: (suggestionId: string) => void;
  onOptimizeWorkflow: (workflowId: string) => void;
  onGenerateSuggestions: (workflowId?: string) => void;
  onAnalyzePatterns: () => void;
}

export default function AIWorkflowOptimizer({
  suggestions,
  optimizations,
  patterns,
  onApplySuggestion,
  onOptimizeWorkflow,
  onGenerateSuggestions,
  onAnalyzePatterns
}: AIWorkflowOptimizerProps) {
  const [selectedTab, setSelectedTab] = useState<'suggestions' | 'optimizations' | 'patterns' | 'insights'>('suggestions');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<'priority' | 'impact' | 'confidence' | 'savings'>('priority');
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<WorkflowSuggestion | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  const filteredSuggestions = suggestions.filter(suggestion => {
    const matchesCategory = filterCategory === 'all' || suggestion.category === filterCategory;
    const matchesPriority = filterPriority === 'all' || suggestion.priority === filterPriority;
    const matchesSearch = suggestion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         suggestion.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         suggestion.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesPriority && matchesSearch;
  });

  const sortedSuggestions = [...filteredSuggestions].sort((a, b) => {
    switch (sortBy) {
      case 'priority':
        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      case 'impact':
        const impactOrder = { transformational: 4, high: 3, medium: 2, low: 1 };
        return impactOrder[b.impact] - impactOrder[a.impact];
      case 'confidence':
        return b.confidence - a.confidence;
      case 'savings':
        return (b.estimatedSavings.time + b.estimatedSavings.cost) - (a.estimatedSavings.time + a.estimatedSavings.cost);
      default:
        return 0;
    }
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'optimization':
        return <TrendingUp className="w-5 h-5" />;
      case 'automation':
        return <Zap className="w-5 h-5" />;
      case 'integration':
        return <Globe className="w-5 h-5" />;
      case 'performance':
        return <Activity className="w-5 h-5" />;
      case 'security':
        return <Shield className="w-5 h-5" />;
      case 'scalability':
        return <BarChart3 className="w-5 h-5" />;
      default:
        return <Lightbulb className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'optimization':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'automation':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'integration':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'performance':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'security':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'scalability':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'transformational':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'high':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'extensive':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleAnalyze = useCallback(async () => {
    setIsAnalyzing(true);
    await onAnalyzePatterns();
    setIsAnalyzing(false);
  }, [onAnalyzePatterns]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl">
            <Bot className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">AI Workflow Optimizer</h2>
            <p className="text-gray-600">Intelligent suggestions and automated optimizations</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors disabled:opacity-50"
          >
            {isAnalyzing ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Brain className="w-4 h-4 mr-2" />
            )}
            {isAnalyzing ? 'Analyzing...' : 'Analyze Patterns'}
          </button>
          <button
            onClick={() => onGenerateSuggestions()}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <Lightbulb className="w-4 h-4 mr-2" />
            Generate Suggestions
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Active Suggestions</p>
              <p className="text-3xl font-bold text-gray-900">{suggestions.length}</p>
              <p className="text-xs text-green-600 mt-1">+{Math.floor(suggestions.length * 0.2)} new</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-xl">
              <Lightbulb className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Applied Optimizations</p>
              <p className="text-3xl font-bold text-gray-900">{optimizations.length}</p>
              <p className="text-xs text-blue-600 mt-1">98% success rate</p>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Time Saved</p>
              <p className="text-3xl font-bold text-gray-900">
                {Math.round(optimizations.reduce((acc, opt) => acc + opt.improvements.timeSaved, 0) / 60)}h
              </p>
              <p className="text-xs text-orange-600 mt-1">This month</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-xl">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Cost Reduction</p>
              <p className="text-3xl font-bold text-gray-900">
                ${Math.round(optimizations.reduce((acc, opt) => acc + opt.improvements.costReduction, 0))}
              </p>
              <p className="text-xs text-green-600 mt-1">Total savings</p>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { id: 'suggestions', label: 'AI Suggestions', icon: Lightbulb },
              { id: 'optimizations', label: 'Optimizations', icon: TrendingUp },
              { id: 'patterns', label: 'Patterns', icon: Brain },
              { id: 'insights', label: 'Insights', icon: BarChart3 }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  selectedTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Filters */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search suggestions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="all">All Categories</option>
                <option value="optimization">Optimization</option>
                <option value="automation">Automation</option>
                <option value="integration">Integration</option>
                <option value="performance">Performance</option>
                <option value="security">Security</option>
                <option value="scalability">Scalability</option>
              </select>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="all">All Priorities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="priority">Priority</option>
                  <option value="impact">Impact</option>
                  <option value="confidence">Confidence</option>
                  <option value="savings">Savings</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {selectedTab === 'suggestions' && (
            <div className="space-y-6">
              {sortedSuggestions.map((suggestion) => (
                <div key={suggestion.id} className="bg-gradient-to-r from-white to-purple-50 rounded-xl p-6 shadow-lg border border-purple-100 hover:shadow-xl transition-all duration-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        {getCategoryIcon(suggestion.category)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{suggestion.title}</h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getCategoryColor(suggestion.category)}`}>
                            {suggestion.category}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(suggestion.priority)}`}>
                            {suggestion.priority}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getImpactColor(suggestion.impact)}`}>
                            {suggestion.impact}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-3">{suggestion.description}</p>
                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Target className="w-4 h-4" />
                            <span>Confidence: {(suggestion.confidence * 100).toFixed(0)}%</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>Time: {suggestion.estimatedSavings.time}h saved</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <TrendingUp className="w-4 h-4" />
                            <span>Cost: ${suggestion.estimatedSavings.cost} saved</span>
                          </div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getEffortColor(suggestion.effort)}`}>
                            {suggestion.effort} effort
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedSuggestion(suggestion);
                          setShowDetails(true);
                        }}
                        className="p-2 text-gray-400 hover:text-purple-600 transition-colors"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => onApplySuggestion(suggestion.id)}
                        className="inline-flex items-center px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                  </div>

                  {/* AI Reasoning */}
                  <div className="bg-purple-50 rounded-lg p-4 mb-4">
                    <div className="flex items-start space-x-3">
                      <Bot className="w-5 h-5 text-purple-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-purple-900 mb-1">AI Reasoning</h4>
                        <p className="text-sm text-purple-700">{suggestion.aiReasoning}</p>
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {suggestion.tags.map((tag) => (
                      <span key={tag} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedTab === 'optimizations' && (
            <div className="space-y-6">
              {optimizations.map((optimization) => (
                <div key={optimization.id} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Workflow Optimization #{optimization.id}</h3>
                    <span className="text-sm text-gray-500">
                      Applied {new Date(optimization.appliedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Before</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Execution Time:</span>
                          <span className="font-medium">{optimization.before.executionTime}ms</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Resource Usage:</span>
                          <span className="font-medium">{optimization.before.resourceUsage}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Error Rate:</span>
                          <span className="font-medium">{(optimization.before.errorRate * 100).toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Cost:</span>
                          <span className="font-medium">${optimization.before.cost}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">After</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Execution Time:</span>
                          <span className="font-medium text-green-600">{optimization.after.executionTime}ms</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Resource Usage:</span>
                          <span className="font-medium text-green-600">{optimization.after.resourceUsage}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Error Rate:</span>
                          <span className="font-medium text-green-600">{(optimization.after.errorRate * 100).toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Cost:</span>
                          <span className="font-medium text-green-600">${optimization.after.cost}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-medium text-green-900 mb-2">Improvements</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">{optimization.improvements.timeSaved}ms</p>
                        <p className="text-green-700">Time Saved</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">{optimization.improvements.resourceSaved}%</p>
                        <p className="text-green-700">Resource Saved</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">{(optimization.improvements.errorReduction * 100).toFixed(1)}%</p>
                        <p className="text-green-700">Error Reduction</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">${optimization.improvements.costReduction}</p>
                        <p className="text-green-700">Cost Reduction</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h4 className="font-medium text-gray-900 mb-2">AI Insights</h4>
                    <div className="space-y-1">
                      {optimization.aiInsights.map((insight, index) => (
                        <p key={index} className="text-sm text-gray-600">• {insight}</p>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedTab === 'patterns' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {patterns.map((pattern) => (
                <div key={pattern.id} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Brain className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{pattern.name}</h3>
                        <p className="text-sm text-gray-500">{pattern.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{(pattern.successRate * 100).toFixed(0)}%</p>
                      <p className="text-xs text-gray-500">Success Rate</p>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4 text-sm">{pattern.description}</p>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Frequency</span>
                        <span className="font-medium">{pattern.frequency}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(pattern.frequency * 10, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h4 className="font-medium text-gray-900 mb-2 text-sm">Benefits</h4>
                    <div className="space-y-1">
                      {pattern.benefits.slice(0, 3).map((benefit, index) => (
                        <p key={index} className="text-xs text-gray-600">• {benefit}</p>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4">
                    <h4 className="font-medium text-gray-900 mb-2 text-sm">Applications</h4>
                    <div className="flex flex-wrap gap-1">
                      {pattern.applications.slice(0, 3).map((app) => (
                        <span key={app} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                          {app}
                        </span>
                      ))}
                      {pattern.applications.length > 3 && (
                        <span className="text-xs text-gray-500">+{pattern.applications.length - 3}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedTab === 'insights' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl p-6 text-white">
                <h3 className="text-xl font-bold mb-2">AI-Powered Insights</h3>
                <p className="text-purple-100 mb-4">
                  Discover hidden patterns and optimization opportunities in your workflows
                </p>
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors disabled:opacity-50"
                >
                  {isAnalyzing ? 'Analyzing...' : 'Generate Insights'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                  <h4 className="font-semibold text-gray-900 mb-4">Performance Trends</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Average Response Time</span>
                      <span className="font-medium text-green-600">↓ 23%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Error Rate</span>
                      <span className="font-medium text-green-600">↓ 45%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Resource Usage</span>
                      <span className="font-medium text-orange-600">↑ 12%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                  <h4 className="font-semibold text-gray-900 mb-4">Optimization Opportunities</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Parallel Processing</span>
                      <span className="font-medium text-blue-600">High Impact</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Caching Strategy</span>
                      <span className="font-medium text-green-600">Medium Impact</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Error Handling</span>
                      <span className="font-medium text-purple-600">Critical</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Suggestion Details Modal */}
      {showDetails && selectedSuggestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    {getCategoryIcon(selectedSuggestion.category)}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{selectedSuggestion.title}</h3>
                    <p className="text-gray-600">{selectedSuggestion.description}</p>
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
                  <h4 className="font-semibold text-gray-900 mb-3">Implementation Steps</h4>
                  <div className="space-y-2 mb-6">
                    {selectedSuggestion.implementation.steps.map((step, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <p className="text-gray-600">{step}</p>
                      </div>
                    ))}
                  </div>

                  <h4 className="font-semibold text-gray-900 mb-3">AI Reasoning</h4>
                  <div className="bg-purple-50 rounded-lg p-4 mb-6">
                    <div className="flex items-start space-x-3">
                      <Bot className="w-5 h-5 text-purple-600 mt-0.5" />
                      <p className="text-purple-700">{selectedSuggestion.aiReasoning}</p>
                    </div>
                  </div>

                  <h4 className="font-semibold text-gray-900 mb-3">Requirements</h4>
                  <div className="space-y-1 mb-6">
                    {selectedSuggestion.implementation.requirements.map((req, index) => (
                      <p key={index} className="text-gray-600">• {req}</p>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Estimated Impact</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Time Saved</span>
                        <span className="font-medium">{selectedSuggestion.estimatedSavings.time}h</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Cost Saved</span>
                        <span className="font-medium">${selectedSuggestion.estimatedSavings.cost}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Resources Saved</span>
                        <span className="font-medium">{selectedSuggestion.estimatedSavings.resources}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Implementation Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Timeline:</span>
                        <span className="font-medium">{selectedSuggestion.implementation.timeline}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Confidence:</span>
                        <span className="font-medium">{(selectedSuggestion.confidence * 100).toFixed(0)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Priority:</span>
                        <span className="font-medium capitalize">{selectedSuggestion.priority}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Effort:</span>
                        <span className="font-medium capitalize">{selectedSuggestion.effort}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={() => onApplySuggestion(selectedSuggestion.id)}
                      className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                    >
                      Apply Suggestion
                    </button>
                    <button
                      onClick={() => setShowDetails(false)}
                      className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
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
