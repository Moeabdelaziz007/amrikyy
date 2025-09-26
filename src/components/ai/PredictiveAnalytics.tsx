import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  TrendingUp, 
  BarChart3, 
  LineChart, 
  PieChart, 
  Activity, 
  Target, 
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

interface Prediction {
  id: string;
  name: string;
  description: string;
  type: 'forecast' | 'classification' | 'regression' | 'anomaly' | 'trend' | 'pattern';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  input: any;
  output: PredictionOutput;
  confidence: number;
  accuracy: number;
  processingTime: number;
  createdAt: Date;
  completedAt: Date | null;
  model: string;
  parameters: Record<string, any>;
}

interface PredictionOutput {
  predictions: PredictionValue[];
  confidence: number;
  accuracy: number;
  metrics: PredictionMetrics;
  visualization: VisualizationData;
  insights: string[];
  recommendations: string[];
}

interface PredictionValue {
  timestamp: Date;
  value: number;
  confidence: number;
  upperBound: number;
  lowerBound: number;
  actual?: number;
  error?: number;
}

interface PredictionMetrics {
  mse: number;
  rmse: number;
  mae: number;
  mape: number;
  r2: number;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
}

interface VisualizationData {
  type: 'line' | 'bar' | 'scatter' | 'heatmap' | 'histogram';
  data: any[];
  labels: string[];
  colors: string[];
  title: string;
  xAxis: string;
  yAxis: string;
}

interface PredictionModel {
  id: string;
  name: string;
  description: string;
  type: 'forecast' | 'classification' | 'regression' | 'anomaly' | 'trend' | 'pattern';
  version: string;
  accuracy: number;
  trainingData: number;
  lastTrained: Date;
  status: 'active' | 'training' | 'inactive' | 'error';
  parameters: Record<string, any>;
  performance: ModelPerformance;
  features: string[];
  target: string;
  algorithm: string;
}

interface ModelPerformance {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  trainingTime: number;
  inferenceTime: number;
  memoryUsage: number;
  cpuUsage: number;
  validationScore: number;
  testScore: number;
}

interface AnalyticsDataset {
  id: string;
  name: string;
  description: string;
  source: string;
  size: number;
  features: number;
  samples: number;
  lastUpdated: Date;
  quality: number;
  status: 'active' | 'processing' | 'error';
  schema: DatasetSchema;
  statistics: DatasetStatistics;
}

interface DatasetSchema {
  columns: ColumnInfo[];
  types: Record<string, string>;
  constraints: Record<string, any>;
}

interface ColumnInfo {
  name: string;
  type: string;
  nullable: boolean;
  unique: boolean;
  description: string;
  examples: any[];
}

interface DatasetStatistics {
  mean: Record<string, number>;
  median: Record<string, number>;
  mode: Record<string, any>;
  std: Record<string, number>;
  min: Record<string, number>;
  max: Record<string, number>;
  correlation: Record<string, Record<string, number>>;
  distribution: Record<string, any>;
}

interface AnalyticsSettings {
  defaultModel: string;
  confidenceThreshold: number;
  maxProcessingTime: number;
  enableRealTime: boolean;
  enableBatchProcessing: boolean;
  enableCaching: boolean;
  enableLogging: boolean;
  models: string[];
  datasets: string[];
  apiKeys: Record<string, string>;
  processingOptions: ProcessingOptions;
}

interface ProcessingOptions {
  enableForecasting: boolean;
  enableClassification: boolean;
  enableRegression: boolean;
  enableAnomalyDetection: boolean;
  enableTrendAnalysis: boolean;
  enablePatternRecognition: boolean;
  maxPredictions: number;
  predictionHorizon: number;
  confidenceLevel: number;
}

export const PredictiveAnalytics: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'predict' | 'models' | 'datasets' | 'settings' | 'insights'>('predict');
  const [loading, setLoading] = useState(true);
  const [selectedModel, setSelectedModel] = useState<string>('default');
  const [selectedDataset, setSelectedDataset] = useState<string>('default');

  // Mock data
  const [predictions] = useState<Prediction[]>([
    {
      id: '1',
      name: 'Sales Forecast',
      description: 'Predict sales for the next 12 months',
      type: 'forecast',
      status: 'completed',
      input: { period: '12 months', features: ['seasonality', 'trend', 'promotions'] },
      output: {
        predictions: [
          { timestamp: new Date('2024-02-01'), value: 15000, confidence: 0.85, upperBound: 18000, lowerBound: 12000 },
          { timestamp: new Date('2024-03-01'), value: 16500, confidence: 0.82, upperBound: 19500, lowerBound: 13500 },
          { timestamp: new Date('2024-04-01'), value: 18000, confidence: 0.80, upperBound: 21000, lowerBound: 15000 }
        ],
        confidence: 0.82,
        accuracy: 0.88,
        metrics: {
          mse: 1250000,
          rmse: 1118,
          mae: 850,
          mape: 0.05,
          r2: 0.88,
          accuracy: 0.88,
          precision: 0.85,
          recall: 0.90,
          f1Score: 0.87
        },
        visualization: {
          type: 'line',
          data: [15000, 16500, 18000],
          labels: ['Feb', 'Mar', 'Apr'],
          colors: ['#3b82f6'],
          title: 'Sales Forecast',
          xAxis: 'Month',
          yAxis: 'Sales ($)'
        },
        insights: [
          'Sales are expected to grow by 20% over the next 3 months',
          'Seasonal patterns show peak sales in Q2',
          'Promotional campaigns have significant impact on sales'
        ],
        recommendations: [
          'Increase inventory for Q2 peak season',
          'Plan promotional campaigns for March',
          'Monitor competitor pricing strategies'
        ]
      },
      confidence: 0.82,
      accuracy: 0.88,
      processingTime: 4500,
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      completedAt: new Date(Date.now() - 1 * 60 * 60 * 1000 + 4500),
      model: 'LSTM-Forecast-v2',
      parameters: { epochs: 100, batchSize: 32, learningRate: 0.001 }
    }
  ]);

  const [models] = useState<PredictionModel[]>([
    {
      id: '1',
      name: 'LSTM Sales Forecast',
      description: 'Long Short-Term Memory network for time series forecasting',
      type: 'forecast',
      version: '2.1.0',
      accuracy: 0.88,
      trainingData: 50000,
      lastTrained: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      status: 'active',
      parameters: { layers: 3, units: 128, dropout: 0.2 },
      performance: {
        accuracy: 0.88,
        precision: 0.85,
        recall: 0.90,
        f1Score: 0.87,
        trainingTime: 3600,
        inferenceTime: 100,
        memoryUsage: 512,
        cpuUsage: 30,
        validationScore: 0.86,
        testScore: 0.88
      },
      features: ['sales', 'seasonality', 'trend', 'promotions', 'competitors'],
      target: 'future_sales',
      algorithm: 'LSTM'
    }
  ]);

  const [datasets] = useState<AnalyticsDataset[]>([
    {
      id: '1',
      name: 'Sales Dataset',
      description: 'Historical sales data with features and targets',
      source: 'CRM System',
      size: 1024000,
      features: 15,
      samples: 50000,
      lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      quality: 0.95,
      status: 'active',
      schema: {
        columns: [
          { name: 'date', type: 'datetime', nullable: false, unique: false, description: 'Sale date', examples: ['2024-01-01', '2024-01-02'] },
          { name: 'sales', type: 'float', nullable: false, unique: false, description: 'Sales amount', examples: [15000, 16500] },
          { name: 'region', type: 'string', nullable: false, unique: false, description: 'Sales region', examples: ['North', 'South'] }
        ],
        types: { date: 'datetime', sales: 'float', region: 'string' },
        constraints: { sales: { min: 0 }, date: { format: 'YYYY-MM-DD' } }
      },
      statistics: {
        mean: { sales: 15000, temperature: 22.5 },
        median: { sales: 14500, temperature: 22.0 },
        mode: { sales: 15000, region: 'North' },
        std: { sales: 2500, temperature: 5.2 },
        min: { sales: 5000, temperature: 10.0 },
        max: { sales: 30000, temperature: 35.0 },
        correlation: { sales: { temperature: 0.65, promotions: 0.78 } },
        distribution: { sales: 'normal', region: 'categorical' }
      }
    }
  ]);

  const [settings] = useState<AnalyticsSettings>({
    defaultModel: 'lstm-forecast',
    confidenceThreshold: 0.8,
    maxProcessingTime: 10000,
    enableRealTime: true,
    enableBatchProcessing: true,
    enableCaching: true,
    enableLogging: true,
    models: ['lstm-forecast', 'arima', 'prophet'],
    datasets: ['sales', 'weather', 'stock'],
    apiKeys: {
      openai: 'sk-***',
      google: 'AIza***',
      azure: '***'
    },
    processingOptions: {
      enableForecasting: true,
      enableClassification: true,
      enableRegression: true,
      enableAnomalyDetection: true,
      enableTrendAnalysis: true,
      enablePatternRecognition: true,
      maxPredictions: 100,
      predictionHorizon: 12,
      confidenceLevel: 0.95
    }
  });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'forecast': return <TrendingUp className="w-4 h-4" />;
      case 'classification': return <Target className="w-4 h-4" />;
      case 'regression': return <LineChart className="w-4 h-4" />;
      case 'anomaly': return <AlertTriangle className="w-4 h-4" />;
      case 'trend': return <BarChart3 className="w-4 h-4" />;
      case 'pattern': return <Layers className="w-4 h-4" />;
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
      case 'processing': return 'text-blue-500';
      case 'completed': return 'text-green-500';
      case 'failed': return 'text-red-500';
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
      case 'processing': return <Activity className="w-4 h-4 text-blue-500" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Info className="w-4 h-4 text-gray-500" />;
    }
  };

  const createPrediction = () => {
    console.log('Creating prediction...');
  };

  const trainModel = () => {
    console.log('Training model...');
  };

  if (loading) {
    return (
      <div className="predictive-analytics">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading predictive analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="predictive-analytics">
      <div className="analytics-header">
        <div className="header-content">
          <div className="header-title">
            <TrendingUp className="header-icon" />
            <h1>Predictive Analytics</h1>
          </div>
          <div className="header-controls">
            <button className="action-button" onClick={createPrediction}>
              <Zap className="button-icon" />
              Predict
            </button>
            <button className="action-button" onClick={trainModel}>
              <Brain className="button-icon" />
              Train Model
            </button>
          </div>
        </div>
      </div>

      <div className="analytics-tabs">
        <button 
          className={`tab ${activeTab === 'predict' ? 'active' : ''}`}
          onClick={() => setActiveTab('predict')}
        >
          <TrendingUp className="tab-icon" />
          Predict
        </button>
        <button 
          className={`tab ${activeTab === 'models' ? 'active' : ''}`}
          onClick={() => setActiveTab('models')}
        >
          <Brain className="tab-icon" />
          Models
        </button>
        <button 
          className={`tab ${activeTab === 'datasets' ? 'active' : ''}`}
          onClick={() => setActiveTab('datasets')}
        >
          <Database className="tab-icon" />
          Datasets
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

      <div className="analytics-content">
        {activeTab === 'predict' && (
          <div className="predict-tab">
            <div className="prediction-interface">
              <div className="input-section">
                <h3>Create Prediction</h3>
                <div className="input-controls">
                  <select 
                    value={selectedModel} 
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="model-selector"
                    title="Select prediction model"
                  >
                    <option value="default">Default Model</option>
                    <option value="lstm-forecast">LSTM Forecast</option>
                    <option value="arima">ARIMA</option>
                    <option value="prophet">Prophet</option>
                  </select>
                  <select 
                    value={selectedDataset} 
                    onChange={(e) => setSelectedDataset(e.target.value)}
                    className="dataset-selector"
                    title="Select dataset"
                  >
                    <option value="default">Default Dataset</option>
                    <option value="sales">Sales Dataset</option>
                    <option value="weather">Weather Dataset</option>
                    <option value="stock">Stock Dataset</option>
                  </select>
                  <button className="action-button" onClick={createPrediction}>
                    <Play className="w-4 h-4" />
                    Predict
                  </button>
                </div>
              </div>

              <div className="results-section">
                <h3>Prediction Results</h3>
                {predictions.map((prediction) => (
                  <div key={prediction.id} className="prediction-result">
                    <div className="result-header">
                      <h4>{prediction.name}</h4>
                      <div className="result-badges">
                        <span className="type-badge">{prediction.type}</span>
                        <span className="confidence-badge">{Math.round(prediction.confidence * 100)}% confidence</span>
                        <span className="accuracy-badge">{Math.round(prediction.accuracy * 100)}% accuracy</span>
                        <span className="time-badge">{prediction.processingTime}ms</span>
                      </div>
                    </div>

                    <div className="result-content">
                      <div className="prediction-overview">
                        <div className="overview-grid">
                          <div className="overview-item">
                            <span className="overview-label">Model:</span>
                            <span className="overview-value">{prediction.model}</span>
                          </div>
                          <div className="overview-item">
                            <span className="overview-label">Type:</span>
                            <span className="overview-value">{prediction.type}</span>
                          </div>
                          <div className="overview-item">
                            <span className="overview-label">Confidence:</span>
                            <span className="overview-value">{Math.round(prediction.confidence * 100)}%</span>
                          </div>
                          <div className="overview-item">
                            <span className="overview-label">Accuracy:</span>
                            <span className="overview-value">{Math.round(prediction.accuracy * 100)}%</span>
                          </div>
                        </div>
                      </div>

                      <div className="predictions-list">
                        <h5>Predictions ({prediction.output.predictions.length})</h5>
                        {prediction.output.predictions.map((pred, index) => (
                          <div key={index} className="prediction-item">
                            <div className="prediction-header">
                              <span className="prediction-timestamp">{pred.timestamp.toLocaleDateString()}</span>
                              <span className="prediction-confidence">{Math.round(pred.confidence * 100)}%</span>
                            </div>
                            <div className="prediction-details">
                              <div className="prediction-value">
                                <span className="value-label">Predicted:</span>
                                <span className="value-number">{pred.value.toLocaleString()}</span>
                              </div>
                              <div className="prediction-bounds">
                                <span className="bound-label">Range:</span>
                                <span className="bound-value">
                                  {pred.lowerBound.toLocaleString()} - {pred.upperBound.toLocaleString()}
                                </span>
                              </div>
                              {pred.actual && (
                                <div className="prediction-actual">
                                  <span className="actual-label">Actual:</span>
                                  <span className="actual-value">{pred.actual.toLocaleString()}</span>
                                  {pred.error && (
                                    <span className="error-value">Error: {pred.error.toLocaleString()}</span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="metrics-analysis">
                        <h5>Performance Metrics</h5>
                        <div className="metrics-grid">
                          <div className="metric-item">
                            <span className="metric-label">MSE:</span>
                            <span className="metric-value">{prediction.output.metrics.mse.toLocaleString()}</span>
                          </div>
                          <div className="metric-item">
                            <span className="metric-label">RMSE:</span>
                            <span className="metric-value">{prediction.output.metrics.rmse.toLocaleString()}</span>
                          </div>
                          <div className="metric-item">
                            <span className="metric-label">MAE:</span>
                            <span className="metric-value">{prediction.output.metrics.mae.toLocaleString()}</span>
                          </div>
                          <div className="metric-item">
                            <span className="metric-label">MAPE:</span>
                            <span className="metric-value">{Math.round(prediction.output.metrics.mape * 100)}%</span>
                          </div>
                          <div className="metric-item">
                            <span className="metric-label">R²:</span>
                            <span className="metric-value">{prediction.output.metrics.r2.toFixed(3)}</span>
                          </div>
                          <div className="metric-item">
                            <span className="metric-label">F1 Score:</span>
                            <span className="metric-value">{prediction.output.metrics.f1Score.toFixed(3)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="insights-analysis">
                        <h5>Insights</h5>
                        <div className="insights-list">
                          {prediction.output.insights.map((insight, index) => (
                            <div key={index} className="insight-item">
                              <Info className="w-4 h-4 insight-icon" />
                              <span className="insight-text">{insight}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="recommendations-analysis">
                        <h5>Recommendations</h5>
                        <div className="recommendations-list">
                          {prediction.output.recommendations.map((recommendation, index) => (
                            <div key={index} className="recommendation-item">
                              <Target className="w-4 h-4 recommendation-icon" />
                              <span className="recommendation-text">{recommendation}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'models' && (
          <div className="models-tab">
            <div className="models-list">
              <h3>Prediction Models</h3>
              {models.map((model) => (
                <div key={model.id} className="model-item">
                  <div className="model-icon">
                    <Brain className="w-5 h-5" />
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
                        <span className="detail-label">Algorithm:</span>
                        <span className="detail-value">{model.algorithm}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Accuracy:</span>
                        <span className="detail-value">{Math.round(model.accuracy * 100)}%</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Training Data:</span>
                        <span className="detail-value">{model.trainingData.toLocaleString()} samples</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Features:</span>
                        <span className="detail-value">{model.features.length}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Target:</span>
                        <span className="detail-value">{model.target}</span>
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
                          <span className="metric-label">Validation Score:</span>
                          <span className="metric-value">{Math.round(model.performance.validationScore * 100)}%</span>
                        </div>
                        <div className="metric">
                          <span className="metric-label">Test Score:</span>
                          <span className="metric-value">{Math.round(model.performance.testScore * 100)}%</span>
                        </div>
                        <div className="metric">
                          <span className="metric-label">Inference Time:</span>
                          <span className="metric-value">{model.performance.inferenceTime}ms</span>
                        </div>
                      </div>
                    </div>
                    <div className="model-features">
                      <h5>Features:</h5>
                      <div className="features-list">
                        {model.features.map((feature, index) => (
                          <span key={index} className="feature-tag">{feature}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="model-actions">
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

        {activeTab === 'datasets' && (
          <div className="datasets-tab">
            <div className="datasets-list">
              <h3>Analytics Datasets</h3>
              {datasets.map((dataset) => (
                <div key={dataset.id} className="dataset-item">
                  <div className="dataset-icon">
                    <Database className="w-5 h-5" />
                  </div>
                  <div className="dataset-info">
                    <div className="dataset-header">
                      <h4 className="dataset-name">{dataset.name}</h4>
                      <div className="dataset-badges">
                        <span className={`status-badge ${getStatusColor(dataset.status)}`}>
                          {getStatusIcon(dataset.status)}
                          {dataset.status}
                        </span>
                        <span className="quality-badge">{Math.round(dataset.quality * 100)}% quality</span>
                        <span className="size-badge">{(dataset.size / 1024 / 1024).toFixed(2)} MB</span>
                      </div>
                    </div>
                    <p className="dataset-description">{dataset.description}</p>
                    <div className="dataset-details">
                      <div className="detail-row">
                        <span className="detail-label">Source:</span>
                        <span className="detail-value">{dataset.source}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Samples:</span>
                        <span className="detail-value">{dataset.samples.toLocaleString()}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Features:</span>
                        <span className="detail-value">{dataset.features}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Last Updated:</span>
                        <span className="detail-value">{dataset.lastUpdated.toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="dataset-schema">
                      <h5>Schema:</h5>
                      <div className="schema-list">
                        {dataset.schema.columns.map((column, index) => (
                          <div key={index} className="column-item">
                            <span className="column-name">{column.name}</span>
                            <span className="column-type">{column.type}</span>
                            <span className="column-nullable">{column.nullable ? 'nullable' : 'required'}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="dataset-statistics">
                      <h5>Statistics:</h5>
                      <div className="statistics-grid">
                        <div className="stat-item">
                          <span className="stat-label">Mean:</span>
                          <span className="stat-value">{Object.keys(dataset.statistics.mean).length} features</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-label">Std Dev:</span>
                          <span className="stat-value">{Object.keys(dataset.statistics.std).length} features</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-label">Min:</span>
                          <span className="stat-value">{Object.keys(dataset.statistics.min).length} features</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-label">Max:</span>
                          <span className="stat-value">{Object.keys(dataset.statistics.max).length} features</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="dataset-actions">
                    <button className="action-button">
                      <Eye className="w-4 h-4" />
                      View
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

        {activeTab === 'settings' && (
          <div className="settings-tab">
            <div className="analytics-settings">
              <h3>Analytics Settings</h3>
              <div className="settings-grid">
                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Default Model</h4>
                    <p>Set the default model for predictions</p>
                  </div>
                  <select 
                    value={settings.defaultModel} 
                    className="setting-input"
                    title="Select default model"
                  >
                    <option value="lstm-forecast">LSTM Forecast</option>
                    <option value="arima">ARIMA</option>
                    <option value="prophet">Prophet</option>
                  </select>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Confidence Threshold</h4>
                    <p>Minimum confidence level for predictions</p>
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
                    <h4>Max Processing Time</h4>
                    <p>Maximum time allowed for predictions (ms)</p>
                  </div>
                  <input 
                    type="number" 
                    value={settings.maxProcessingTime} 
                    className="setting-input"
                    title="Set max processing time"
                  />
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Real-time Processing</h4>
                    <p>Enable real-time predictions</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={settings.enableRealTime} 
                      title="Enable real-time processing"
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Batch Processing</h4>
                    <p>Enable batch processing for multiple predictions</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={settings.enableBatchProcessing} 
                      title="Enable batch processing"
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Caching</h4>
                    <p>Cache prediction results for improved performance</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={settings.enableCaching} 
                      title="Enable caching"
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Forecasting</h4>
                    <p>Enable time series forecasting</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={settings.processingOptions.enableForecasting} 
                      title="Enable forecasting"
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Classification</h4>
                    <p>Enable classification predictions</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={settings.processingOptions.enableClassification} 
                      title="Enable classification"
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Anomaly Detection</h4>
                    <p>Enable anomaly detection</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={settings.processingOptions.enableAnomalyDetection} 
                      title="Enable anomaly detection"
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Prediction Horizon</h4>
                    <p>Number of future periods to predict</p>
                  </div>
                  <input 
                    type="number" 
                    value={settings.processingOptions.predictionHorizon} 
                    className="setting-input"
                    title="Set prediction horizon"
                  />
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Confidence Level</h4>
                    <p>Statistical confidence level for predictions</p>
                  </div>
                  <input 
                    type="range" 
                    min="0.8" 
                    max="0.99" 
                    step="0.01" 
                    value={settings.processingOptions.confidenceLevel} 
                    className="setting-input"
                    title="Set confidence level"
                  />
                  <span className="setting-value">{Math.round(settings.processingOptions.confidenceLevel * 100)}%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="insights-tab">
            <div className="analytics-insights">
              <h3>Analytics Insights</h3>
              <div className="insights-grid">
                <div className="metric-card">
                  <div className="metric-header">
                    <TrendingUp className="metric-icon" />
                    <span className="metric-label">Total Predictions</span>
                  </div>
                  <div className="metric-value">{predictions.length}</div>
                  <div className="metric-status">All time</div>
                </div>

                <div className="metric-card">
                  <div className="metric-header">
                    <Brain className="metric-icon" />
                    <span className="metric-label">Active Models</span>
                  </div>
                  <div className="metric-value">{models.filter(m => m.status === 'active').length}</div>
                  <div className="metric-status">Ready for use</div>
                </div>

                <div className="metric-card">
                  <div className="metric-header">
                    <Database className="metric-icon" />
                    <span className="metric-label">Datasets</span>
                  </div>
                  <div className="metric-value">{datasets.length}</div>
                  <div className="metric-status">Available</div>
                </div>

                <div className="metric-card">
                  <div className="metric-header">
                    <Clock className="metric-icon" />
                    <span className="metric-label">Avg Processing Time</span>
                  </div>
                  <div className="metric-value">
                    {Math.round(predictions.reduce((sum, p) => sum + p.processingTime, 0) / predictions.length)}ms
                  </div>
                  <div className="metric-status">Per prediction</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
