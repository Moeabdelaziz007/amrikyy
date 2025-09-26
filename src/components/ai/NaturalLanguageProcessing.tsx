import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  MessageSquare, 
  Brain, 
  Zap, 
  Target, 
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
  Droplet
} from 'lucide-react';

interface NLPAnalysis {
  id: string;
  text: string;
  language: string;
  sentiment: SentimentAnalysis;
  entities: Entity[];
  keywords: Keyword[];
  topics: Topic[];
  summary: string;
  confidence: number;
  processingTime: number;
  createdAt: Date;
}

interface SentimentAnalysis {
  overall: 'positive' | 'negative' | 'neutral';
  score: number; // -1 to 1
  confidence: number;
  emotions: Emotion[];
  aspects: AspectSentiment[];
}

interface Emotion {
  name: string;
  score: number;
  confidence: number;
}

interface AspectSentiment {
  aspect: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  score: number;
  confidence: number;
}

interface Entity {
  text: string;
  type: 'person' | 'organization' | 'location' | 'date' | 'money' | 'percent' | 'misc';
  confidence: number;
  startIndex: number;
  endIndex: number;
}

interface Keyword {
  text: string;
  score: number;
  relevance: number;
  frequency: number;
}

interface Topic {
  name: string;
  score: number;
  keywords: string[];
  confidence: number;
}

interface NLPTask {
  id: string;
  name: string;
  description: string;
  type: 'sentiment' | 'entity' | 'keyword' | 'topic' | 'summary' | 'translation' | 'classification';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  input: string;
  output: any;
  confidence: number;
  processingTime: number;
  createdAt: Date;
  completedAt: Date | null;
}

interface NLPModel {
  id: string;
  name: string;
  description: string;
  type: 'sentiment' | 'entity' | 'keyword' | 'topic' | 'summary' | 'translation' | 'classification';
  version: string;
  accuracy: number;
  trainingData: number;
  lastTrained: Date;
  status: 'active' | 'training' | 'inactive' | 'error';
  parameters: Record<string, any>;
  performance: ModelPerformance;
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
}

interface NLPSettings {
  defaultLanguage: string;
  autoDetectLanguage: boolean;
  confidenceThreshold: number;
  maxProcessingTime: number;
  enableRealTime: boolean;
  enableBatchProcessing: boolean;
  enableCaching: boolean;
  enableLogging: boolean;
  models: string[];
  apiKeys: Record<string, string>;
}

export const NaturalLanguageProcessing: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'analyze' | 'tasks' | 'models' | 'settings' | 'insights'>('analyze');
  const [loading, setLoading] = useState(true);
  const [inputText, setInputText] = useState('');
  const [selectedModel, setSelectedModel] = useState<string>('default');

  // Mock data
  const [analyses] = useState<NLPAnalysis[]>([
    {
      id: '1',
      text: 'I love this new AI system! It\'s amazing how well it works.',
      language: 'en',
      sentiment: {
        overall: 'positive',
        score: 0.8,
        confidence: 0.95,
        emotions: [
          { name: 'joy', score: 0.9, confidence: 0.92 },
          { name: 'excitement', score: 0.7, confidence: 0.88 }
        ],
        aspects: [
          { aspect: 'AI system', sentiment: 'positive', score: 0.9, confidence: 0.94 }
        ]
      },
      entities: [
        { text: 'AI system', type: 'misc', confidence: 0.9, startIndex: 20, endIndex: 29 }
      ],
      keywords: [
        { text: 'love', score: 0.9, relevance: 0.95, frequency: 1 },
        { text: 'amazing', score: 0.8, relevance: 0.9, frequency: 1 },
        { text: 'works', score: 0.7, relevance: 0.85, frequency: 1 }
      ],
      topics: [
        { name: 'Technology', score: 0.8, keywords: ['AI', 'system'], confidence: 0.9 }
      ],
      summary: 'Positive sentiment about a new AI system that works well.',
      confidence: 0.92,
      processingTime: 150,
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000)
    }
  ]);

  const [tasks] = useState<NLPTask[]>([
    {
      id: '1',
      name: 'Sentiment Analysis',
      description: 'Analyze sentiment of customer feedback',
      type: 'sentiment',
      status: 'completed',
      input: 'I love this new AI system!',
      output: { sentiment: 'positive', score: 0.8 },
      confidence: 0.95,
      processingTime: 120,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000 + 120 * 1000)
    }
  ]);

  const [models] = useState<NLPModel[]>([
    {
      id: '1',
      name: 'Sentiment Analysis Model',
      description: 'Advanced sentiment analysis using transformer architecture',
      type: 'sentiment',
      version: '2.1.0',
      accuracy: 0.94,
      trainingData: 1000000,
      lastTrained: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      status: 'active',
      parameters: { layers: 12, heads: 16, hiddenSize: 768 },
      performance: {
        accuracy: 0.94,
        precision: 0.93,
        recall: 0.95,
        f1Score: 0.94,
        trainingTime: 3600,
        inferenceTime: 50,
        memoryUsage: 512,
        cpuUsage: 25
      }
    }
  ]);

  const [settings] = useState<NLPSettings>({
    defaultLanguage: 'en',
    autoDetectLanguage: true,
    confidenceThreshold: 0.7,
    maxProcessingTime: 5000,
    enableRealTime: true,
    enableBatchProcessing: true,
    enableCaching: true,
    enableLogging: true,
    models: ['sentiment', 'entity', 'keyword'],
    apiKeys: {
      openai: 'sk-***',
      google: 'AIza***',
      azure: '***'
    }
  });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'sentiment': return <Heart className="w-4 h-4" />;
      case 'entity': return <Target className="w-4 h-4" />;
      case 'keyword': return <Tag className="w-4 h-4" />;
      case 'topic': return <Star className="w-4 h-4" />;
      case 'summary': return <File className="w-4 h-4" />;
      case 'translation': return <Globe className="w-4 h-4" />;
      case 'classification': return <Layers className="w-4 h-4" />;
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

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-500';
      case 'negative': return 'text-red-500';
      case 'neutral': return 'text-gray-500';
      default: return 'text-gray-500';
    }
  };

  const getEntityTypeColor = (type: string) => {
    switch (type) {
      case 'person': return 'text-blue-500';
      case 'organization': return 'text-purple-500';
      case 'location': return 'text-green-500';
      case 'date': return 'text-orange-500';
      case 'money': return 'text-yellow-500';
      case 'percent': return 'text-cyan-500';
      case 'misc': return 'text-gray-500';
      default: return 'text-gray-500';
    }
  };

  const analyzeText = () => {
    console.log('Analyzing text:', inputText);
  };

  const createTask = () => {
    console.log('Creating NLP task...');
  };

  const trainModel = () => {
    console.log('Training model...');
  };

  if (loading) {
    return (
      <div className="natural-language-processing">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading natural language processing...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="natural-language-processing">
      <div className="nlp-header">
        <div className="header-content">
          <div className="header-title">
            <MessageSquare className="header-icon" />
            <h1>Natural Language Processing</h1>
          </div>
          <div className="header-controls">
            <button className="action-button" onClick={analyzeText}>
              <Zap className="button-icon" />
              Analyze
            </button>
            <button className="action-button" onClick={createTask}>
              <Plus className="button-icon" />
              Create Task
            </button>
            <button className="action-button" onClick={trainModel}>
              <Brain className="button-icon" />
              Train Model
            </button>
          </div>
        </div>
      </div>

      <div className="nlp-tabs">
        <button 
          className={`tab ${activeTab === 'analyze' ? 'active' : ''}`}
          onClick={() => setActiveTab('analyze')}
        >
          <MessageSquare className="tab-icon" />
          Analyze
        </button>
        <button 
          className={`tab ${activeTab === 'tasks' ? 'active' : ''}`}
          onClick={() => setActiveTab('tasks')}
        >
          <Target className="tab-icon" />
          Tasks
        </button>
        <button 
          className={`tab ${activeTab === 'models' ? 'active' : ''}`}
          onClick={() => setActiveTab('models')}
        >
          <Brain className="tab-icon" />
          Models
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

      <div className="nlp-content">
        {activeTab === 'analyze' && (
          <div className="analyze-tab">
            <div className="analysis-interface">
              <div className="input-section">
                <h3>Text Analysis</h3>
                <div className="input-controls">
                  <select 
                    value={selectedModel} 
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="model-selector"
                    title="Select NLP model"
                  >
                    <option value="default">Default Model</option>
                    <option value="sentiment">Sentiment Analysis</option>
                    <option value="entity">Entity Recognition</option>
                    <option value="keyword">Keyword Extraction</option>
                  </select>
                  <button className="action-button" onClick={analyzeText}>
                    <Play className="w-4 h-4" />
                    Analyze
                  </button>
                </div>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Enter text to analyze..."
                  className="text-input"
                  rows={6}
                />
              </div>

              <div className="results-section">
                <h3>Analysis Results</h3>
                {analyses.map((analysis) => (
                  <div key={analysis.id} className="analysis-result">
                    <div className="result-header">
                      <h4>Text Analysis</h4>
                      <div className="result-badges">
                        <span className="language-badge">{analysis.language}</span>
                        <span className="confidence-badge">{Math.round(analysis.confidence * 100)}% confidence</span>
                        <span className="time-badge">{analysis.processingTime}ms</span>
                      </div>
                    </div>

                    <div className="result-content">
                      <div className="text-preview">
                        <p>"{analysis.text}"</p>
                      </div>

                      <div className="sentiment-analysis">
                        <h5>Sentiment Analysis</h5>
                        <div className="sentiment-overview">
                          <div className="sentiment-score">
                            <span className="sentiment-label">Overall Sentiment:</span>
                            <span className={`sentiment-value ${getSentimentColor(analysis.sentiment.overall)}`}>
                              {analysis.sentiment.overall} ({analysis.sentiment.score.toFixed(2)})
                            </span>
                          </div>
                          <div className="sentiment-confidence">
                            <span>Confidence: {Math.round(analysis.sentiment.confidence * 100)}%</span>
                          </div>
                        </div>

                        <div className="emotions-list">
                          <h6>Emotions Detected:</h6>
                          {analysis.sentiment.emotions.map((emotion, index) => (
                            <div key={index} className="emotion-item">
                              <span className="emotion-name">{emotion.name}</span>
                              <span className="emotion-score">{emotion.score.toFixed(2)}</span>
                              <span className="emotion-confidence">{Math.round(emotion.confidence * 100)}%</span>
                            </div>
                          ))}
                        </div>

                        <div className="aspect-sentiment">
                          <h6>Aspect Sentiment:</h6>
                          {analysis.sentiment.aspects.map((aspect, index) => (
                            <div key={index} className="aspect-item">
                              <span className="aspect-name">{aspect.aspect}</span>
                              <span className={`aspect-sentiment ${getSentimentColor(aspect.sentiment)}`}>
                                {aspect.sentiment} ({aspect.score.toFixed(2)})
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="entities-analysis">
                        <h5>Named Entities</h5>
                        {analysis.entities.map((entity, index) => (
                          <div key={index} className="entity-item">
                            <span className="entity-text">{entity.text}</span>
                            <span className={`entity-type ${getEntityTypeColor(entity.type)}`}>
                              {entity.type}
                            </span>
                            <span className="entity-confidence">{Math.round(entity.confidence * 100)}%</span>
                          </div>
                        ))}
                      </div>

                      <div className="keywords-analysis">
                        <h5>Keywords</h5>
                        {analysis.keywords.map((keyword, index) => (
                          <div key={index} className="keyword-item">
                            <span className="keyword-text">{keyword.text}</span>
                            <span className="keyword-score">Score: {keyword.score.toFixed(2)}</span>
                            <span className="keyword-relevance">Relevance: {keyword.relevance.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>

                      <div className="topics-analysis">
                        <h5>Topics</h5>
                        {analysis.topics.map((topic, index) => (
                          <div key={index} className="topic-item">
                            <span className="topic-name">{topic.name}</span>
                            <span className="topic-score">Score: {topic.score.toFixed(2)}</span>
                            <span className="topic-keywords">Keywords: {topic.keywords.join(', ')}</span>
                          </div>
                        ))}
                      </div>

                      <div className="summary-analysis">
                        <h5>Summary</h5>
                        <p className="summary-text">{analysis.summary}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="tasks-tab">
            <div className="tasks-list">
              <h3>NLP Tasks</h3>
              {tasks.map((task) => (
                <div key={task.id} className="task-item">
                  <div className="task-icon">
                    {getTypeIcon(task.type)}
                  </div>
                  <div className="task-info">
                    <div className="task-header">
                      <h4 className="task-name">{task.name}</h4>
                      <div className="task-badges">
                        <span className={`status-badge ${getStatusColor(task.status)}`}>
                          {getStatusIcon(task.status)}
                          {task.status}
                        </span>
                        <span className="type-badge">{task.type}</span>
                        <span className="confidence-badge">{Math.round(task.confidence * 100)}%</span>
                      </div>
                    </div>
                    <p className="task-description">{task.description}</p>
                    <div className="task-details">
                      <div className="detail-row">
                        <span className="detail-label">Input:</span>
                        <span className="detail-value">"{task.input}"</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Processing Time:</span>
                        <span className="detail-value">{task.processingTime}ms</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Created:</span>
                        <span className="detail-value">{task.createdAt.toLocaleString()}</span>
                      </div>
                      {task.completedAt && (
                        <div className="detail-row">
                          <span className="detail-label">Completed:</span>
                          <span className="detail-value">{task.completedAt.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                    <div className="task-output">
                      <h5>Output:</h5>
                      <div className="output-content">
                        {typeof task.output === 'object' 
                          ? JSON.stringify(task.output, null, 2) 
                          : task.output.toString()}
                      </div>
                    </div>
                  </div>
                  <div className="task-actions">
                    <button className="action-button">
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                    <button className="action-button">
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'models' && (
          <div className="models-tab">
            <div className="models-list">
              <h3>NLP Models</h3>
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
                        <span className="detail-label">Accuracy:</span>
                        <span className="detail-value">{Math.round(model.accuracy * 100)}%</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Training Data:</span>
                        <span className="detail-value">{model.trainingData.toLocaleString()} samples</span>
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

        {activeTab === 'settings' && (
          <div className="settings-tab">
            <div className="nlp-settings">
              <h3>NLP Settings</h3>
              <div className="settings-grid">
                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Default Language</h4>
                    <p>Set the default language for text analysis</p>
                  </div>
                  <select 
                    value={settings.defaultLanguage} 
                    className="setting-input"
                    title="Select default language"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="zh">Chinese</option>
                    <option value="ja">Japanese</option>
                    <option value="ar">Arabic</option>
                  </select>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Auto-detect Language</h4>
                    <p>Automatically detect the language of input text</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={settings.autoDetectLanguage} 
                      title="Enable auto-detect language"
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Confidence Threshold</h4>
                    <p>Minimum confidence level for analysis results</p>
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
                    <p>Maximum time allowed for text analysis (ms)</p>
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
                    <p>Enable real-time text analysis</p>
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
                    <p>Enable batch processing for multiple texts</p>
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
                    <p>Cache analysis results for improved performance</p>
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
                    <h4>Logging</h4>
                    <p>Enable detailed logging for debugging</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={settings.enableLogging} 
                      title="Enable logging"
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
            <div className="nlp-insights">
              <h3>NLP Insights</h3>
              <div className="insights-grid">
                <div className="metric-card">
                  <div className="metric-header">
                    <MessageSquare className="metric-icon" />
                    <span className="metric-label">Total Analyses</span>
                  </div>
                  <div className="metric-value">{analyses.length}</div>
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
                    <Target className="metric-icon" />
                    <span className="metric-label">Completed Tasks</span>
                  </div>
                  <div className="metric-value">{tasks.filter(t => t.status === 'completed').length}</div>
                  <div className="metric-status">Successfully processed</div>
                </div>

                <div className="metric-card">
                  <div className="metric-header">
                    <Clock className="metric-icon" />
                    <span className="metric-label">Avg Processing Time</span>
                  </div>
                  <div className="metric-value">
                    {Math.round(analyses.reduce((sum, a) => sum + a.processingTime, 0) / analyses.length)}ms
                  </div>
                  <div className="metric-status">Per analysis</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
