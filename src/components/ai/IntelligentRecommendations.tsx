import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Lightbulb, 
  Target, 
  Star, 
  Heart, 
  TrendingUp, 
  BarChart3, 
  Activity, 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Play, 
  Pause, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Info, 
  RefreshCw, 
  Download, 
  Upload, 
  Save, 
  Copy, 
  Share, 
  Eye, 
  EyeOff, 
  Clock, 
  Calendar, 
  User, 
  Users, 
  Globe, 
  Shield, 
  Lock, 
  Unlock, 
  Key, 
  Database, 
  Server, 
  Cloud, 
  Wifi, 
  Bluetooth, 
  Battery, 
  Power, 
  Thermometer, 
  Gauge, 
  Timer, 
  History, 
  Bookmark, 
  Tag, 
  Flag, 
  Pin, 
  Home, 
  Building, 
  Car, 
  Plane, 
  Ship, 
  Train, 
  Bike, 
  Truck, 
  Bus, 
  Tent, 
  Umbrella, 
  Trees, 
  Flower, 
  Leaf, 
  Sprout, 
  Bug, 
  Fish, 
  Bird, 
  Cat, 
  Dog, 
  Rabbit, 
  Mouse, 
  Turtle, 
  Butterfly, 
  Ant, 
  Spider, 
  Ladybug, 
  Dragonfly, 
  Firefly, 
  Cricket, 
  Grasshopper, 
  Mantis, 
  Beetle, 
  Worm, 
  Snail, 
  Octopus, 
  Squid, 
  Jellyfish, 
  Starfish, 
  Crab, 
  Lobster, 
  Ship as Shrimp, 
  Penguin, 
  Owl, 
  Eagle, 
  Hawk, 
  Falcon, 
  Carrot as Parrot, 
  Crown as Crow,
  Mic,
  Volume2,
  VolumeX,
  Headphones,
  Monitor,
  Smartphone,
  Laptop,
  Watch,
  Glasses,
  Eye as EyeIcon,
  Hand,
  Foot,
  Microscope,
  FlaskConical,
  Beaker,
  TestTube,
  Calculator,
  Code,
  Terminal,
  Cpu,
  MemoryStick,
  HardDrive,
  Network,
  Search,
  Filter,
  List,
  Grid,
  Layers,
  Navigation,
  Compass,
  Sparkles,
  Hexagon,
  Circle,
  Square,
  Triangle,
  Diamond,
  Microphone,
  Video,
  Camera,
  Image,
  File,
  Folder,
  FolderOpen,
  Printer,
  CloudOff,
  WifiOff,
  BatteryCharging,
  BatteryFull,
  BatteryLow,
  Sun,
  Moon,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Wind,
  Droplet,
  Brain,
  MessageSquare,
  Target as TargetIcon,
  Scan,
  QrCode,
  Focus,
  Maximize,
  Minimize,
  RotateCw,
  RotateCcw,
  FlipHorizontal,
  FlipVertical,
  Crop,
  Palette,
  Contrast,
  Brightness,
  Filter as FilterIcon,
  Blur,
  Sharpen,
  Layers as LayersIcon,
  Grid3X3,
  Square as SquareIcon,
  Circle as CircleIcon,
  Triangle as TriangleIcon,
  Diamond as DiamondIcon,
  Hexagon as HexagonIcon,
  Star as StarIcon,
  Heart as HeartIcon,
  Zap,
  Sparkles as SparklesIcon,
  Crown,
  Gem,
  Award,
  Trophy,
  Medal,
  Badge,
  Certificate,
  Diploma,
  Scroll,
  Book,
  BookOpen,
  Library,
  Archive,
  Folder as FolderIcon,
  FolderOpen as FolderOpenIcon,
  FileText,
  FileImage,
  FileVideo,
  FileAudio,
  FileCode,
  FileSpreadsheet,
  FilePdf,
  FileWord,
  FileExcel,
  FilePowerpoint,
  FileZip,
  FileArchive,
  FileCheck,
  FileX,
  FilePlus,
  FileMinus,
  FileEdit,
  FileSearch,
  FileDownload,
  FileUpload,
  FileShare,
  FileCopy,
  FileMove,
  FileDelete,
  FileRestore,
  FileArchive as FileArchiveIcon,
  FileUnarchive,
  FileCompress,
  FileExtract,
  FileMerge,
  FileSplit,
  FileConvert,
  FileOptimize,
  FileValidate,
  FileRepair,
  FileBackup,
  FileSync,
  FileVersion,
  FileHistory,
  FileCompare,
  FileDiff,
  FileMerge as FileMergeIcon,
  FileSplit as FileSplitIcon,
  FileConvert as FileConvertIcon,
  FileOptimize as FileOptimizeIcon,
  FileValidate as FileValidateIcon,
  FileRepair as FileRepairIcon,
  FileBackup as FileBackupIcon,
  FileSync as FileSyncIcon,
  FileVersion as FileVersionIcon,
  FileHistory as FileHistoryIcon,
  FileCompare as FileCompareIcon,
  FileDiff as FileDiffIcon
} from 'lucide-react';

interface Recommendation {
  id: string;
  title: string;
  description: string;
  type: 'product' | 'content' | 'action' | 'optimization' | 'personalization' | 'discovery';
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  relevance: number;
  impact: number;
  effort: number;
  status: 'pending' | 'accepted' | 'rejected' | 'implemented' | 'expired';
  source: string;
  reasoning: string[];
  benefits: string[];
  risks: string[];
  alternatives: string[];
  metadata: RecommendationMetadata;
  createdAt: Date;
  expiresAt: Date;
  userFeedback: UserFeedback | null;
}

interface RecommendationMetadata {
  tags: string[];
  keywords: string[];
  targetAudience: string[];
  businessValue: number;
  technicalComplexity: number;
  implementationTime: number;
  cost: number;
  roi: number;
  dependencies: string[];
  prerequisites: string[];
}

interface UserFeedback {
  rating: number; // 1-5
  comment: string;
  helpful: boolean;
  implemented: boolean;
  timestamp: Date;
}

interface RecommendationEngine {
  id: string;
  name: string;
  description: string;
  type: 'collaborative' | 'content-based' | 'hybrid' | 'deep-learning' | 'rule-based';
  version: string;
  accuracy: number;
  coverage: number;
  diversity: number;
  novelty: number;
  status: 'active' | 'training' | 'inactive' | 'error';
  parameters: Record<string, any>;
  performance: EnginePerformance;
  features: string[];
  algorithms: string[];
}

interface EnginePerformance {
  precision: number;
  recall: number;
  f1Score: number;
  ndcg: number;
  map: number;
  mrr: number;
  trainingTime: number;
  inferenceTime: number;
  memoryUsage: number;
  cpuUsage: number;
}

interface RecommendationSettings {
  defaultEngine: string;
  confidenceThreshold: number;
  maxRecommendations: number;
  enableRealTime: boolean;
  enablePersonalization: boolean;
  enableDiversity: boolean;
  enableNovelty: boolean;
  enableExploration: boolean;
  engines: string[];
  categories: string[];
  filters: RecommendationFilters;
  preferences: UserPreferences;
}

interface RecommendationFilters {
  minConfidence: number;
  maxAge: number;
  categories: string[];
  types: string[];
  priorities: string[];
  sources: string[];
}

interface UserPreferences {
  interests: string[];
  dislikes: string[];
  behavior: string[];
  demographics: Record<string, any>;
  context: Record<string, any>;
  history: Record<string, any>;
}

export const IntelligentRecommendations: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'recommendations' | 'engines' | 'settings' | 'insights'>('recommendations');
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');

  // Mock data
  const [recommendations] = useState<Recommendation[]>([
    {
      id: '1',
      title: 'Optimize Database Queries',
      description: 'Implement query optimization to improve application performance by 30%',
      type: 'optimization',
      category: 'performance',
      priority: 'high',
      confidence: 0.92,
      relevance: 0.88,
      impact: 0.85,
      effort: 0.60,
      status: 'pending',
      source: 'Performance Analysis',
      reasoning: [
        'Current queries are taking 2-3 seconds on average',
        'Database load is consistently high during peak hours',
        'User experience is being impacted by slow response times'
      ],
      benefits: [
        '30% improvement in response times',
        'Reduced server load and costs',
        'Better user experience and satisfaction'
      ],
      risks: [
        'Potential downtime during implementation',
        'Risk of breaking existing functionality',
        'Requires thorough testing'
      ],
      alternatives: [
        'Implement caching layer',
        'Add database indexes',
        'Optimize application code'
      ],
      metadata: {
        tags: ['database', 'performance', 'optimization'],
        keywords: ['query', 'database', 'performance', 'optimization'],
        targetAudience: ['developers', 'devops'],
        businessValue: 0.85,
        technicalComplexity: 0.70,
        implementationTime: 2,
        cost: 5000,
        roi: 3.2,
        dependencies: ['database access', 'testing environment'],
        prerequisites: ['performance monitoring', 'query analysis']
      },
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      userFeedback: null
    }
  ]);

  const [engines] = useState<RecommendationEngine[]>([
    {
      id: '1',
      name: 'Hybrid Recommendation Engine',
      description: 'Combines collaborative filtering with content-based recommendations',
      type: 'hybrid',
      version: '3.2.0',
      accuracy: 0.89,
      coverage: 0.85,
      diversity: 0.78,
      novelty: 0.82,
      status: 'active',
      parameters: { alpha: 0.7, beta: 0.3, k: 50 },
      performance: {
        precision: 0.87,
        recall: 0.91,
        f1Score: 0.89,
        ndcg: 0.85,
        map: 0.83,
        mrr: 0.88,
        trainingTime: 1800,
        inferenceTime: 25,
        memoryUsage: 256,
        cpuUsage: 15
      },
      features: ['collaborative', 'content-based', 'hybrid'],
      algorithms: ['matrix-factorization', 'content-similarity', 'deep-learning']
    }
  ]);

  const [settings] = useState<RecommendationSettings>({
    defaultEngine: 'hybrid-engine',
    confidenceThreshold: 0.7,
    maxRecommendations: 20,
    enableRealTime: true,
    enablePersonalization: true,
    enableDiversity: true,
    enableNovelty: true,
    enableExploration: true,
    engines: ['hybrid-engine', 'collaborative', 'content-based'],
    categories: ['performance', 'security', 'optimization', 'personalization'],
    filters: {
      minConfidence: 0.6,
      maxAge: 30,
      categories: ['performance', 'security'],
      types: ['optimization', 'action'],
      priorities: ['high', 'medium'],
      sources: ['performance-analysis', 'user-behavior']
    },
    preferences: {
      interests: ['performance', 'security', 'optimization'],
      dislikes: ['complex', 'expensive'],
      behavior: ['frequent-user', 'power-user'],
      demographics: { role: 'developer', experience: 'senior' },
      context: { timezone: 'UTC', language: 'en' },
      history: { totalRecommendations: 150, acceptedRate: 0.75 }
    }
  });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'product': return <Star className="w-4 h-4" />;
      case 'content': return <FileText className="w-4 h-4" />;
      case 'action': return <Target className="w-4 h-4" />;
      case 'optimization': return <Zap className="w-4 h-4" />;
      case 'personalization': return <User className="w-4 h-4" />;
      case 'discovery': return <Search className="w-4 h-4" />;
      default: return <Lightbulb className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-500';
      case 'high': return 'text-orange-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-500';
      case 'training': return 'text-blue-500';
      case 'inactive': return 'text-gray-500';
      case 'error': return 'text-red-500';
      case 'pending': return 'text-yellow-500';
      case 'accepted': return 'text-green-500';
      case 'rejected': return 'text-red-500';
      case 'implemented': return 'text-blue-500';
      case 'expired': return 'text-gray-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'training': return <Activity className="w-4 h-4 text-blue-500" />;
      case 'inactive': return <XCircle className="w-4 h-4 text-gray-500" />;
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'accepted': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'implemented': return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'expired': return <Clock className="w-4 h-4 text-gray-500" />;
      default: return <Info className="w-4 h-4 text-gray-500" />;
    }
  };

  const acceptRecommendation = (id: string) => {
    console.log('Accepting recommendation:', id);
  };

  const rejectRecommendation = (id: string) => {
    console.log('Rejecting recommendation:', id);
  };

  const provideFeedback = (id: string, rating: number, comment: string) => {
    console.log('Providing feedback for recommendation:', id, rating, comment);
  };

  if (loading) {
    return (
      <div className="intelligent-recommendations">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading intelligent recommendations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="intelligent-recommendations">
      <div className="recommendations-header">
        <div className="header-content">
          <div className="header-title">
            <Lightbulb className="header-icon" />
            <h1>Intelligent Recommendations</h1>
          </div>
          <div className="header-controls">
            <button className="action-button">
              <RefreshCw className="button-icon" />
              Refresh
            </button>
            <button className="action-button">
              <Settings className="button-icon" />
              Settings
            </button>
          </div>
        </div>
      </div>

      <div className="recommendations-tabs">
        <button 
          className={`tab ${activeTab === 'recommendations' ? 'active' : ''}`}
          onClick={() => setActiveTab('recommendations')}
        >
          <Lightbulb className="tab-icon" />
          Recommendations
        </button>
        <button 
          className={`tab ${activeTab === 'engines' ? 'active' : ''}`}
          onClick={() => setActiveTab('engines')}
        >
          <Brain className="tab-icon" />
          Engines
        </button>
        <button 
          className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <Settings className="tab-icon" />
          Settings
        </button>
        <button 
          className={`tab ${activeTab === 'insights' ? 'active' : ''}`}
          onClick={() => setActiveTab('insights')}
        >
          <BarChart3 className="tab-icon" />
          Insights
        </button>
      </div>

      <div className="recommendations-content">
        {activeTab === 'recommendations' && (
          <div className="recommendations-tab">
            <div className="recommendations-interface">
              <div className="filters-section">
                <h3>Filters</h3>
                <div className="filter-controls">
                  <select 
                    value={selectedCategory} 
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="filter-select"
                    title="Filter by category"
                  >
                    <option value="all">All Categories</option>
                    <option value="performance">Performance</option>
                    <option value="security">Security</option>
                    <option value="optimization">Optimization</option>
                    <option value="personalization">Personalization</option>
                  </select>
                  <select 
                    value={selectedPriority} 
                    onChange={(e) => setSelectedPriority(e.target.value)}
                    className="filter-select"
                    title="Filter by priority"
                  >
                    <option value="all">All Priorities</option>
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div className="recommendations-list">
                <h3>Recommendations ({recommendations.length})</h3>
                {recommendations.map((recommendation) => (
                  <div key={recommendation.id} className="recommendation-item">
                    <div className="recommendation-icon">
                      {getTypeIcon(recommendation.type)}
                    </div>
                    <div className="recommendation-info">
                      <div className="recommendation-header">
                        <h4 className="recommendation-title">{recommendation.title}</h4>
                        <div className="recommendation-badges">
                          <span className={`priority-badge ${getPriorityColor(recommendation.priority)}`}>
                            {recommendation.priority}
                          </span>
                          <span className="type-badge">{recommendation.type}</span>
                          <span className="category-badge">{recommendation.category}</span>
                          <span className={`status-badge ${getStatusColor(recommendation.status)}`}>
                            {getStatusIcon(recommendation.status)}
                            {recommendation.status}
                          </span>
                        </div>
                      </div>
                      <p className="recommendation-description">{recommendation.description}</p>
                      
                      <div className="recommendation-metrics">
                        <div className="metric-item">
                          <span className="metric-label">Confidence:</span>
                          <span className="metric-value">{Math.round(recommendation.confidence * 100)}%</span>
                        </div>
                        <div className="metric-item">
                          <span className="metric-label">Relevance:</span>
                          <span className="metric-value">{Math.round(recommendation.relevance * 100)}%</span>
                        </div>
                        <div className="metric-item">
                          <span className="metric-label">Impact:</span>
                          <span className="metric-value">{Math.round(recommendation.impact * 100)}%</span>
                        </div>
                        <div className="metric-item">
                          <span className="metric-label">Effort:</span>
                          <span className="metric-value">{Math.round(recommendation.effort * 100)}%</span>
                        </div>
                      </div>

                      <div className="recommendation-details">
                        <div className="detail-section">
                          <h5>Reasoning</h5>
                          <ul className="reasoning-list">
                            {recommendation.reasoning.map((reason, index) => (
                              <li key={index} className="reasoning-item">{reason}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="detail-section">
                          <h5>Benefits</h5>
                          <ul className="benefits-list">
                            {recommendation.benefits.map((benefit, index) => (
                              <li key={index} className="benefit-item">{benefit}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="detail-section">
                          <h5>Risks</h5>
                          <ul className="risks-list">
                            {recommendation.risks.map((risk, index) => (
                              <li key={index} className="risk-item">{risk}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="detail-section">
                          <h5>Alternatives</h5>
                          <ul className="alternatives-list">
                            {recommendation.alternatives.map((alternative, index) => (
                              <li key={index} className="alternative-item">{alternative}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="recommendation-metadata">
                        <div className="metadata-grid">
                          <div className="metadata-item">
                            <span className="metadata-label">Source:</span>
                            <span className="metadata-value">{recommendation.source}</span>
                          </div>
                          <div className="metadata-item">
                            <span className="metadata-label">Business Value:</span>
                            <span className="metadata-value">{Math.round(recommendation.metadata.businessValue * 100)}%</span>
                          </div>
                          <div className="metadata-item">
                            <span className="metadata-label">Implementation Time:</span>
                            <span className="metadata-value">{recommendation.metadata.implementationTime} days</span>
                          </div>
                          <div className="metadata-item">
                            <span className="metadata-label">Cost:</span>
                            <span className="metadata-value">${recommendation.metadata.cost.toLocaleString()}</span>
                          </div>
                          <div className="metadata-item">
                            <span className="metadata-label">ROI:</span>
                            <span className="metadata-value">{recommendation.metadata.roi}x</span>
                          </div>
                          <div className="metadata-item">
                            <span className="metadata-label">Created:</span>
                            <span className="metadata-value">{recommendation.createdAt.toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="recommendation-tags">
                        {recommendation.metadata.tags.map((tag, index) => (
                          <span key={index} className="tag">{tag}</span>
                        ))}
                      </div>
                    </div>
                    <div className="recommendation-actions">
                      <button 
                        className="action-button accept"
                        onClick={() => acceptRecommendation(recommendation.id)}
                      >
                        <CheckCircle className="w-4 h-4" />
                        Accept
                      </button>
                      <button 
                        className="action-button reject"
                        onClick={() => rejectRecommendation(recommendation.id)}
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                      <button className="action-button">
                        <Info className="w-4 h-4" />
                        Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'engines' && (
          <div className="engines-tab">
            <div className="engines-list">
              <h3>Recommendation Engines</h3>
              {engines.map((engine) => (
                <div key={engine.id} className="engine-item">
                  <div className="engine-icon">
                    <Brain className="w-5 h-5" />
                  </div>
                  <div className="engine-info">
                    <div className="engine-header">
                      <h4 className="engine-name">{engine.name}</h4>
                      <div className="engine-badges">
                        <span className={`status-badge ${getStatusColor(engine.status)}`}>
                          {getStatusIcon(engine.status)}
                          {engine.status}
                        </span>
                        <span className="type-badge">{engine.type}</span>
                        <span className="version-badge">v{engine.version}</span>
                      </div>
                    </div>
                    <p className="engine-description">{engine.description}</p>
                    <div className="engine-details">
                      <div className="detail-row">
                        <span className="detail-label">Accuracy:</span>
                        <span className="detail-value">{Math.round(engine.accuracy * 100)}%</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Coverage:</span>
                        <span className="detail-value">{Math.round(engine.coverage * 100)}%</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Diversity:</span>
                        <span className="detail-value">{Math.round(engine.diversity * 100)}%</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Novelty:</span>
                        <span className="detail-value">{Math.round(engine.novelty * 100)}%</span>
                      </div>
                    </div>
                    <div className="engine-performance">
                      <h5>Performance Metrics:</h5>
                      <div className="performance-grid">
                        <div className="metric">
                          <span className="metric-label">Precision:</span>
                          <span className="metric-value">{Math.round(engine.performance.precision * 100)}%</span>
                        </div>
                        <div className="metric">
                          <span className="metric-label">Recall:</span>
                          <span className="metric-value">{Math.round(engine.performance.recall * 100)}%</span>
                        </div>
                        <div className="metric">
                          <span className="metric-label">F1 Score:</span>
                          <span className="metric-value">{Math.round(engine.performance.f1Score * 100)}%</span>
                        </div>
                        <div className="metric">
                          <span className="metric-label">NDCG:</span>
                          <span className="metric-value">{engine.performance.ndcg.toFixed(3)}</span>
                        </div>
                        <div className="metric">
                          <span className="metric-label">MAP:</span>
                          <span className="metric-value">{engine.performance.map.toFixed(3)}</span>
                        </div>
                        <div className="metric">
                          <span className="metric-label">MRR:</span>
                          <span className="metric-value">{engine.performance.mrr.toFixed(3)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="engine-features">
                      <h5>Features:</h5>
                      <div className="features-list">
                        {engine.features.map((feature, index) => (
                          <span key={index} className="feature-tag">{feature}</span>
                        ))}
                      </div>
                    </div>
                    <div className="engine-algorithms">
                      <h5>Algorithms:</h5>
                      <div className="algorithms-list">
                        {engine.algorithms.map((algorithm, index) => (
                          <span key={index} className="algorithm-tag">{algorithm}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="engine-actions">
                    <button className="action-button">
                      <Play className="w-4 h-4" />
                      Test
                    </button>
                    <button className="action-button">
                      <Settings className="w-4 h-4" />
                      Configure
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="settings-tab">
            <div className="recommendations-settings">
              <h3>Recommendation Settings</h3>
              <div className="settings-grid">
                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Default Engine</h4>
                    <p>Set the default recommendation engine</p>
                  </div>
                  <select 
                    value={settings.defaultEngine} 
                    className="setting-input"
                    title="Select default engine"
                  >
                    <option value="hybrid-engine">Hybrid Engine</option>
                    <option value="collaborative">Collaborative</option>
                    <option value="content-based">Content-Based</option>
                  </select>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Confidence Threshold</h4>
                    <p>Minimum confidence level for recommendations</p>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.1" 
                    value={settings.confidenceThreshold} 
                    className="setting-input"
                    title="Set confidence threshold"
                  />
                  <span className="setting-value">{Math.round(settings.confidenceThreshold * 100)}%</span>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Max Recommendations</h4>
                    <p>Maximum number of recommendations to show</p>
                  </div>
                  <input 
                    type="number" 
                    value={settings.maxRecommendations} 
                    className="setting-input"
                    title="Set max recommendations"
                  />
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Real-time Recommendations</h4>
                    <p>Enable real-time recommendation updates</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={settings.enableRealTime} 
                      title="Enable real-time recommendations"
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Personalization</h4>
                    <p>Enable personalized recommendations</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={settings.enablePersonalization} 
                      title="Enable personalization"
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Diversity</h4>
                    <p>Enable diverse recommendation results</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={settings.enableDiversity} 
                      title="Enable diversity"
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Novelty</h4>
                    <p>Enable novel and unexpected recommendations</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={settings.enableNovelty} 
                      title="Enable novelty"
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Exploration</h4>
                    <p>Enable exploration of new recommendation types</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={settings.enableExploration} 
                      title="Enable exploration"
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="insights-tab">
            <div className="recommendations-insights">
              <h3>Recommendation Insights</h3>
              <div className="insights-grid">
                <div className="metric-card">
                  <div className="metric-header">
                    <Lightbulb className="metric-icon" />
                    <span className="metric-label">Total Recommendations</span>
                  </div>
                  <div className="metric-value">{recommendations.length}</div>
                  <div className="metric-status">All time</div>
                </div>

                <div className="metric-card">
                  <div className="metric-header">
                    <Brain className="metric-icon" />
                    <span className="metric-label">Active Engines</span>
                  </div>
                  <div className="metric-value">{engines.filter(e => e.status === 'active').length}</div>
                  <div className="metric-status">Ready for use</div>
                </div>

                <div className="metric-card">
                  <div className="metric-header">
                    <CheckCircle className="metric-icon" />
                    <span className="metric-label">Acceptance Rate</span>
                  </div>
                  <div className="metric-value">
                    {Math.round((recommendations.filter(r => r.status === 'accepted').length / recommendations.length) * 100)}%
                  </div>
                  <div className="metric-status">User satisfaction</div>
                </div>

                <div className="metric-card">
                  <div className="metric-header">
                    <Target className="metric-icon" />
                    <span className="metric-label">Avg Confidence</span>
                  </div>
                  <div className="metric-value">
                    {Math.round(recommendations.reduce((sum, r) => sum + r.confidence, 0) / recommendations.length * 100)}%
                  </div>
                  <div className="metric-status">Recommendation quality</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
