import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Brain, 
  Cpu, 
  Database, 
  Zap, 
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
  Star, 
  Heart, 
  Shield, 
  Lock, 
  Unlock, 
  Key, 
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
  TrendingUp,
  BarChart3,
  Activity,
  Target,
  Lightbulb,
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
  Zap as ZapIcon,
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

interface AIModel {
  id: string;
  name: string;
  description: string;
  type: 'transformer' | 'cnn' | 'rnn' | 'lstm' | 'gru' | 'gan' | 'vae' | 'bert' | 'gpt' | 'resnet' | 'efficientnet';
  version: string;
  architecture: string;
  parameters: number;
  size: number;
  accuracy: number;
  trainingData: number;
  lastTrained: Date;
  status: 'active' | 'training' | 'inactive' | 'error';
  performance: ModelPerformance;
  capabilities: string[];
  useCases: string[];
  requirements: ModelRequirements;
  metadata: ModelMetadata;
}

interface ModelPerformance {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  trainingTime: number;
  inferenceTime: number;
  memoryUsage: number;
  gpuUsage: number;
  cpuUsage: number;
  throughput: number;
  latency: number;
  energyConsumption: number;
}

interface ModelRequirements {
  minMemory: number;
  minStorage: number;
  minCpu: number;
  minGpu: number;
  frameworks: string[];
  dependencies: string[];
  os: string[];
  python: string;
  cuda: string;
}

interface ModelMetadata {
  author: string;
  license: string;
  repository: string;
  paper: string;
  tags: string[];
  categories: string[];
  benchmarks: Benchmark[];
  citations: number;
  downloads: number;
  stars: number;
}

interface Benchmark {
  name: string;
  score: number;
  metric: string;
  dataset: string;
  rank: number;
}

interface TrainingJob {
  id: string;
  modelId: string;
  name: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  progress: number;
  startTime: Date;
  endTime: Date | null;
  duration: number;
  dataset: string;
  hyperparameters: Record<string, any>;
  metrics: TrainingMetrics;
  logs: TrainingLog[];
  resources: ResourceUsage;
}

interface TrainingMetrics {
  loss: number;
  accuracy: number;
  validationLoss: number;
  validationAccuracy: number;
  learningRate: number;
  epoch: number;
  batchSize: number;
  gradientNorm: number;
}

interface TrainingLog {
  timestamp: Date;
  level: 'info' | 'warning' | 'error';
  message: string;
  data: any;
}

interface ResourceUsage {
  cpu: number;
  memory: number;
  gpu: number;
  storage: number;
  network: number;
}

interface ModelSettings {
  defaultModel: string;
  enableAutoTraining: boolean;
  enableDistributedTraining: boolean;
  enableModelVersioning: boolean;
  enableModelServing: boolean;
  maxConcurrentJobs: number;
  defaultFramework: string;
  defaultDevice: string;
  models: string[];
  frameworks: string[];
  devices: string[];
}

export const AdvancedAIModels: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'models' | 'training' | 'serving' | 'settings' | 'insights'>('models');
  const [loading, setLoading] = useState(true);

  // Mock data
  const [models] = useState<AIModel[]>([
    {
      id: '1',
      name: 'GPT-4 Vision',
      description: 'Advanced multimodal language model with vision capabilities',
      type: 'gpt',
      version: '4.0.0',
      architecture: 'Transformer',
      parameters: 1750000000000,
      size: 7000000000000,
      accuracy: 0.95,
      trainingData: 1000000000000,
      lastTrained: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      status: 'active',
      performance: {
        accuracy: 0.95,
        precision: 0.94,
        recall: 0.96,
        f1Score: 0.95,
        trainingTime: 86400,
        inferenceTime: 200,
        memoryUsage: 8192,
        gpuUsage: 80,
        cpuUsage: 20,
        throughput: 50,
        latency: 200,
        energyConsumption: 100
      },
      capabilities: ['text-generation', 'image-understanding', 'code-generation', 'reasoning'],
      useCases: ['content-creation', 'code-assistance', 'image-analysis', 'conversation'],
      requirements: {
        minMemory: 16384,
        minStorage: 100,
        minCpu: 8,
        minGpu: 1,
        frameworks: ['pytorch', 'tensorflow'],
        dependencies: ['transformers', 'torch'],
        os: ['linux', 'windows', 'macos'],
        python: '3.8+',
        cuda: '11.0+'
      },
      metadata: {
        author: 'OpenAI',
        license: 'Commercial',
        repository: 'https://github.com/openai/gpt-4',
        paper: 'https://arxiv.org/abs/2303.08774',
        tags: ['nlp', 'vision', 'multimodal', 'transformer'],
        categories: ['language-model', 'vision-model'],
        benchmarks: [
          { name: 'MMLU', score: 86.4, metric: 'accuracy', dataset: 'MMLU', rank: 1 },
          { name: 'HellaSwag', score: 95.3, metric: 'accuracy', dataset: 'HellaSwag', rank: 1 }
        ],
        citations: 15000,
        downloads: 1000000,
        stars: 50000
      }
    }
  ]);

  const [trainingJobs] = useState<TrainingJob[]>([
    {
      id: '1',
      modelId: '1',
      name: 'Fine-tune GPT-4 Vision',
      description: 'Fine-tuning GPT-4 Vision for specific domain tasks',
      status: 'running',
      progress: 65,
      startTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
      endTime: null,
      duration: 7200,
      dataset: 'custom-dataset-v1',
      hyperparameters: {
        learningRate: 0.0001,
        batchSize: 32,
        epochs: 100,
        optimizer: 'adamw'
      },
      metrics: {
        loss: 0.15,
        accuracy: 0.92,
        validationLoss: 0.18,
        validationAccuracy: 0.90,
        learningRate: 0.0001,
        epoch: 65,
        batchSize: 32,
        gradientNorm: 0.5
      },
      logs: [
        { timestamp: new Date(), level: 'info', message: 'Training started', data: {} },
        { timestamp: new Date(), level: 'info', message: 'Epoch 65 completed', data: { accuracy: 0.92 } }
      ],
      resources: {
        cpu: 80,
        memory: 90,
        gpu: 95,
        storage: 60,
        network: 30
      }
    }
  ]);

  const [settings] = useState<ModelSettings>({
    defaultModel: 'gpt-4-vision',
    enableAutoTraining: true,
    enableDistributedTraining: true,
    enableModelVersioning: true,
    enableModelServing: true,
    maxConcurrentJobs: 5,
    defaultFramework: 'pytorch',
    defaultDevice: 'gpu',
    models: ['gpt-4-vision', 'bert-base', 'resnet-50'],
    frameworks: ['pytorch', 'tensorflow', 'jax'],
    devices: ['gpu', 'cpu', 'tpu']
  });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'transformer': return <Brain className="w-4 h-4" />;
      case 'cnn': return <Grid className="w-4 h-4" />;
      case 'rnn': return <Layers className="w-4 h-4" />;
      case 'lstm': return <MemoryStick className="w-4 h-4" />;
      case 'gru': return <Cpu className="w-4 h-4" />;
      case 'gan': return <Zap className="w-4 h-4" />;
      case 'vae': return <Database className="w-4 h-4" />;
      case 'bert': return <Book className="w-4 h-4" />;
      case 'gpt': return <MessageSquare className="w-4 h-4" />;
      case 'resnet': return <Network className="w-4 h-4" />;
      case 'efficientnet': return <Target className="w-4 h-4" />;
      default: return <Brain className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-500';
      case 'training': return 'text-blue-500';
      case 'inactive': return 'text-gray-500';
      case 'error': return 'text-red-500';
      case 'pending': return 'text-yellow-500';
      case 'running': return 'text-blue-500';
      case 'completed': return 'text-green-500';
      case 'failed': return 'text-red-500';
      case 'cancelled': return 'text-gray-500';
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
      case 'running': return <Activity className="w-4 h-4 text-blue-500" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'cancelled': return <XCircle className="w-4 h-4 text-gray-500" />;
      default: return <Info className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)}B`;
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatBytes = (bytes: number) => {
    if (bytes >= 1000000000000) return `${(bytes / 1000000000000).toFixed(1)}TB`;
    if (bytes >= 1000000000) return `${(bytes / 1000000000).toFixed(1)}GB`;
    if (bytes >= 1000000) return `${(bytes / 1000000).toFixed(1)}MB`;
    if (bytes >= 1000) return `${(bytes / 1000).toFixed(1)}KB`;
    return `${bytes}B`;
  };

  if (loading) {
    return (
      <div className="advanced-ai-models">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading advanced AI models...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="advanced-ai-models">
      <div className="models-header">
        <div className="header-content">
          <div className="header-title">
            <Brain className="header-icon" />
            <h1>Advanced AI Models</h1>
          </div>
          <div className="header-controls">
            <button className="action-button">
              <Plus className="button-icon" />
              Add Model
            </button>
            <button className="action-button">
              <Play className="button-icon" />
              Train
            </button>
            <button className="action-button">
              <Settings className="button-icon" />
              Settings
            </button>
          </div>
        </div>
      </div>

      <div className="models-tabs">
        <button 
          className={`tab ${activeTab === 'models' ? 'active' : ''}`}
          onClick={() => setActiveTab('models')}
        >
          <Brain className="tab-icon" />
          Models
        </button>
        <button 
          className={`tab ${activeTab === 'training' ? 'active' : ''}`}
          onClick={() => setActiveTab('training')}
        >
          <Activity className="tab-icon" />
          Training
        </button>
        <button 
          className={`tab ${activeTab === 'serving' ? 'active' : ''}`}
          onClick={() => setActiveTab('serving')}
        >
          <Server className="tab-icon" />
          Serving
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

      <div className="models-content">
        {activeTab === 'models' && (
          <div className="models-tab">
            <div className="models-list">
              <h3>AI Models ({models.length})</h3>
              {models.map((model) => (
                <div key={model.id} className="model-item">
                  <div className="model-icon">
                    {getTypeIcon(model.type)}
                  </div>
                  <div className="model-info">
                    <div className="model-header">
                      <h4 className="model-name">{model.name}</h4>
                      <div className="model-badges">
                        <span className={`status-badge ${getStatusColor(model.status)}`}>
                          {getStatusIcon(model.status)}
                          {model.status}
                        </span>
                        <span className="type-badge">{model.type}</span>
                        <span className="version-badge">v{model.version}</span>
                      </div>
                    </div>
                    <p className="model-description">{model.description}</p>
                    <div className="model-details">
                      <div className="detail-row">
                        <span className="detail-label">Architecture:</span>
                        <span className="detail-value">{model.architecture}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Parameters:</span>
                        <span className="detail-value">{formatNumber(model.parameters)}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Size:</span>
                        <span className="detail-value">{formatBytes(model.size)}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Accuracy:</span>
                        <span className="detail-value">{Math.round(model.accuracy * 100)}%</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Training Data:</span>
                        <span className="detail-value">{formatNumber(model.trainingData)} samples</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Last Trained:</span>
                        <span className="detail-value">{model.lastTrained.toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="model-performance">
                      <h5>Performance Metrics:</h5>
                      <div className="performance-grid">
                        <div className="metric">
                          <span className="metric-label">Precision:</span>
                          <span className="metric-value">{Math.round(model.performance.precision * 100)}%</span>
                        </div>
                        <div className="metric">
                          <span className="metric-label">Recall:</span>
                          <span className="metric-value">{Math.round(model.performance.recall * 100)}%</span>
                        </div>
                        <div className="metric">
                          <span className="metric-label">F1 Score:</span>
                          <span className="metric-value">{Math.round(model.performance.f1Score * 100)}%</span>
                        </div>
                        <div className="metric">
                          <span className="metric-label">Inference Time:</span>
                          <span className="metric-value">{model.performance.inferenceTime}ms</span>
                        </div>
                        <div className="metric">
                          <span className="metric-label">Throughput:</span>
                          <span className="metric-value">{model.performance.throughput} req/s</span>
                        </div>
                        <div className="metric">
                          <span className="metric-label">Latency:</span>
                          <span className="metric-value">{model.performance.latency}ms</span>
                        </div>
                      </div>
                    </div>
                    <div className="model-capabilities">
                      <h5>Capabilities:</h5>
                      <div className="capabilities-list">
                        {model.capabilities.map((capability, index) => (
                          <span key={index} className="capability-tag">{capability}</span>
                        ))}
                      </div>
                    </div>
                    <div className="model-use-cases">
                      <h5>Use Cases:</h5>
                      <div className="use-cases-list">
                        {model.useCases.map((useCase, index) => (
                          <span key={index} className="use-case-tag">{useCase}</span>
                        ))}
                      </div>
                    </div>
                    <div className="model-requirements">
                      <h5>Requirements:</h5>
                      <div className="requirements-grid">
                        <div className="requirement-item">
                          <span className="requirement-label">Min Memory:</span>
                          <span className="requirement-value">{formatBytes(model.requirements.minMemory * 1024 * 1024 * 1024)}</span>
                        </div>
                        <div className="requirement-item">
                          <span className="requirement-label">Min Storage:</span>
                          <span className="requirement-value">{model.requirements.minStorage}GB</span>
                        </div>
                        <div className="requirement-item">
                          <span className="requirement-label">Min CPU:</span>
                          <span className="requirement-value">{model.requirements.minCpu} cores</span>
                        </div>
                        <div className="requirement-item">
                          <span className="requirement-label">Min GPU:</span>
                          <span className="requirement-value">{model.requirements.minGpu} GPU(s)</span>
                        </div>
                      </div>
                    </div>
                    <div className="model-metadata">
                      <h5>Metadata:</h5>
                      <div className="metadata-grid">
                        <div className="metadata-item">
                          <span className="metadata-label">Author:</span>
                          <span className="metadata-value">{model.metadata.author}</span>
                        </div>
                        <div className="metadata-item">
                          <span className="metadata-label">License:</span>
                          <span className="metadata-value">{model.metadata.license}</span>
                        </div>
                        <div className="metadata-item">
                          <span className="metadata-label">Citations:</span>
                          <span className="metadata-value">{formatNumber(model.metadata.citations)}</span>
                        </div>
                        <div className="metadata-item">
                          <span className="metadata-label">Downloads:</span>
                          <span className="metadata-value">{formatNumber(model.metadata.downloads)}</span>
                        </div>
                        <div className="metadata-item">
                          <span className="metadata-label">Stars:</span>
                          <span className="metadata-value">{formatNumber(model.metadata.stars)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="model-benchmarks">
                      <h5>Benchmarks:</h5>
                      <div className="benchmarks-list">
                        {model.metadata.benchmarks.map((benchmark, index) => (
                          <div key={index} className="benchmark-item">
                            <span className="benchmark-name">{benchmark.name}</span>
                            <span className="benchmark-score">{benchmark.score}</span>
                            <span className="benchmark-metric">{benchmark.metric}</span>
                            <span className="benchmark-rank">#{benchmark.rank}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="model-actions">
                    <button className="action-button">
                      <Play className="w-4 h-4" />
                      Deploy
                    </button>
                    <button className="action-button">
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button className="action-button">
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'training' && (
          <div className="training-tab">
            <div className="training-jobs">
              <h3>Training Jobs ({trainingJobs.length})</h3>
              {trainingJobs.map((job) => (
                <div key={job.id} className="job-item">
                  <div className="job-icon">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div className="job-info">
                    <div className="job-header">
                      <h4 className="job-name">{job.name}</h4>
                      <div className="job-badges">
                        <span className={`status-badge ${getStatusColor(job.status)}`}>
                          {getStatusIcon(job.status)}
                          {job.status}
                        </span>
                        <span className="progress-badge">{job.progress}%</span>
                      </div>
                    </div>
                    <p className="job-description">{job.description}</p>
                    <div className="job-details">
                      <div className="detail-row">
                        <span className="detail-label">Model:</span>
                        <span className="detail-value">{job.modelId}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Dataset:</span>
                        <span className="detail-value">{job.dataset}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Start Time:</span>
                        <span className="detail-value">{job.startTime.toLocaleString()}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Duration:</span>
                        <span className="detail-value">{Math.round(job.duration / 60)} minutes</span>
                      </div>
                    </div>
                    <div className="job-progress">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${job.progress}%` }}
                        ></div>
                      </div>
                      <span className="progress-text">{job.progress}% complete</span>
                    </div>
                    <div className="job-metrics">
                      <h5>Current Metrics:</h5>
                      <div className="metrics-grid">
                        <div className="metric">
                          <span className="metric-label">Loss:</span>
                          <span className="metric-value">{job.metrics.loss.toFixed(4)}</span>
                        </div>
                        <div className="metric">
                          <span className="metric-label">Accuracy:</span>
                          <span className="metric-value">{Math.round(job.metrics.accuracy * 100)}%</span>
                        </div>
                        <div className="metric">
                          <span className="metric-label">Validation Loss:</span>
                          <span className="metric-value">{job.metrics.validationLoss.toFixed(4)}</span>
                        </div>
                        <div className="metric">
                          <span className="metric-label">Validation Accuracy:</span>
                          <span className="metric-value">{Math.round(job.metrics.validationAccuracy * 100)}%</span>
                        </div>
                        <div className="metric">
                          <span className="metric-label">Epoch:</span>
                          <span className="metric-value">{job.metrics.epoch}</span>
                        </div>
                        <div className="metric">
                          <span className="metric-label">Learning Rate:</span>
                          <span className="metric-value">{job.metrics.learningRate}</span>
                        </div>
                      </div>
                    </div>
                    <div className="job-resources">
                      <h5>Resource Usage:</h5>
                      <div className="resources-grid">
                        <div className="resource-item">
                          <span className="resource-label">CPU:</span>
                          <span className="resource-value">{job.resources.cpu}%</span>
                        </div>
                        <div className="resource-item">
                          <span className="resource-label">Memory:</span>
                          <span className="resource-value">{job.resources.memory}%</span>
                        </div>
                        <div className="resource-item">
                          <span className="resource-label">GPU:</span>
                          <span className="resource-value">{job.resources.gpu}%</span>
                        </div>
                        <div className="resource-item">
                          <span className="resource-label">Storage:</span>
                          <span className="resource-value">{job.resources.storage}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="job-actions">
                    <button className="action-button">
                      <Pause className="w-4 h-4" />
                      Pause
                    </button>
                    <button className="action-button">
                      <Eye className="w-4 h-4" />
                      Logs
                    </button>
                    <button className="action-button">
                      <XCircle className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'serving' && (
          <div className="serving-tab">
            <div className="serving-status">
              <h3>Model Serving</h3>
              <div className="serving-info">
                <p>Model serving capabilities will be available soon.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="settings-tab">
            <div className="model-settings">
              <h3>Model Settings</h3>
              <div className="settings-grid">
                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Default Model</h4>
                    <p>Set the default model for inference</p>
                  </div>
                  <select 
                    value={settings.defaultModel} 
                    className="setting-input"
                    title="Select default model"
                  >
                    <option value="gpt-4-vision">GPT-4 Vision</option>
                    <option value="bert-base">BERT Base</option>
                    <option value="resnet-50">ResNet-50</option>
                  </select>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Auto Training</h4>
                    <p>Enable automatic model training</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={settings.enableAutoTraining} 
                      title="Enable auto training"
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Distributed Training</h4>
                    <p>Enable distributed training across multiple nodes</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={settings.enableDistributedTraining} 
                      title="Enable distributed training"
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Model Versioning</h4>
                    <p>Enable automatic model versioning</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={settings.enableModelVersioning} 
                      title="Enable model versioning"
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Model Serving</h4>
                    <p>Enable model serving capabilities</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={settings.enableModelServing} 
                      title="Enable model serving"
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Max Concurrent Jobs</h4>
                    <p>Maximum number of concurrent training jobs</p>
                  </div>
                  <input 
                    type="number" 
                    value={settings.maxConcurrentJobs} 
                    className="setting-input"
                    title="Set max concurrent jobs"
                  />
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Default Framework</h4>
                    <p>Set the default ML framework</p>
                  </div>
                  <select 
                    value={settings.defaultFramework} 
                    className="setting-input"
                    title="Select default framework"
                  >
                    <option value="pytorch">PyTorch</option>
                    <option value="tensorflow">TensorFlow</option>
                    <option value="jax">JAX</option>
                  </select>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Default Device</h4>
                    <p>Set the default compute device</p>
                  </div>
                  <select 
                    value={settings.defaultDevice} 
                    className="setting-input"
                    title="Select default device"
                  >
                    <option value="gpu">GPU</option>
                    <option value="cpu">CPU</option>
                    <option value="tpu">TPU</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="insights-tab">
            <div className="model-insights">
              <h3>Model Insights</h3>
              <div className="insights-grid">
                <div className="metric-card">
                  <div className="metric-header">
                    <Brain className="metric-icon" />
                    <span className="metric-label">Total Models</span>
                  </div>
                  <div className="metric-value">{models.length}</div>
                  <div className="metric-status">Available</div>
                </div>

                <div className="metric-card">
                  <div className="metric-header">
                    <Activity className="metric-icon" />
                    <span className="metric-label">Active Training</span>
                  </div>
                  <div className="metric-value">{trainingJobs.filter(j => j.status === 'running').length}</div>
                  <div className="metric-status">In progress</div>
                </div>

                <div className="metric-card">
                  <div className="metric-header">
                    <CheckCircle className="metric-icon" />
                    <span className="metric-label">Completed Jobs</span>
                  </div>
                  <div className="metric-value">{trainingJobs.filter(j => j.status === 'completed').length}</div>
                  <div className="metric-status">Successfully trained</div>
                </div>

                <div className="metric-card">
                  <div className="metric-header">
                    <Clock className="metric-icon" />
                    <span className="metric-label">Avg Training Time</span>
                  </div>
                  <div className="metric-value">
                    {Math.round(trainingJobs.reduce((sum, j) => sum + j.duration, 0) / trainingJobs.length / 60)} min
                  </div>
                  <div className="metric-status">Per job</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
