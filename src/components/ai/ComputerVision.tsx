import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Camera, 
  Image, 
  Eye, 
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
  BarChart3,
  Activity,
  TrendingUp,
  Brain,
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

interface ImageAnalysis {
  id: string;
  imageUrl: string;
  filename: string;
  size: number;
  dimensions: { width: number; height: number };
  format: string;
  objects: DetectedObject[];
  faces: DetectedFace[];
  text: ExtractedText[];
  colors: ColorAnalysis[];
  features: ImageFeatures;
  metadata: ImageMetadata;
  confidence: number;
  processingTime: number;
  createdAt: Date;
}

interface DetectedObject {
  id: string;
  label: string;
  confidence: number;
  boundingBox: BoundingBox;
  category: string;
  attributes: ObjectAttribute[];
}

interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ObjectAttribute {
  name: string;
  value: string;
  confidence: number;
}

interface DetectedFace {
  id: string;
  confidence: number;
  boundingBox: BoundingBox;
  landmarks: FaceLandmark[];
  emotions: Emotion[];
  age: number;
  gender: string;
  attributes: FaceAttribute[];
}

interface FaceLandmark {
  type: 'eye' | 'nose' | 'mouth' | 'eyebrow' | 'chin';
  x: number;
  y: number;
  confidence: number;
}

interface Emotion {
  name: string;
  confidence: number;
}

interface FaceAttribute {
  name: string;
  value: string;
  confidence: number;
}

interface ExtractedText {
  text: string;
  confidence: number;
  boundingBox: BoundingBox;
  language: string;
}

interface ColorAnalysis {
  color: string;
  percentage: number;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
}

interface ImageFeatures {
  brightness: number;
  contrast: number;
  sharpness: number;
  blur: number;
  noise: number;
  saturation: number;
  hue: number;
  exposure: number;
}

interface ImageMetadata {
  camera: string;
  lens: string;
  focalLength: number;
  aperture: number;
  shutterSpeed: string;
  iso: number;
  flash: boolean;
  whiteBalance: string;
  gps: { lat: number; lng: number } | null;
  timestamp: Date;
  software: string;
}

interface VisionTask {
  id: string;
  name: string;
  description: string;
  type: 'object_detection' | 'face_recognition' | 'text_extraction' | 'color_analysis' | 'feature_extraction' | 'classification' | 'segmentation';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  input: string;
  output: any;
  confidence: number;
  processingTime: number;
  createdAt: Date;
  completedAt: Date | null;
}

interface VisionModel {
  id: string;
  name: string;
  description: string;
  type: 'object_detection' | 'face_recognition' | 'text_extraction' | 'color_analysis' | 'feature_extraction' | 'classification' | 'segmentation';
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
  gpuUsage: number;
}

interface VisionSettings {
  defaultModel: string;
  confidenceThreshold: number;
  maxImageSize: number;
  enableRealTime: boolean;
  enableBatchProcessing: boolean;
  enableCaching: boolean;
  enableLogging: boolean;
  models: string[];
  apiKeys: Record<string, string>;
  processingOptions: ProcessingOptions;
}

interface ProcessingOptions {
  enableObjectDetection: boolean;
  enableFaceRecognition: boolean;
  enableTextExtraction: boolean;
  enableColorAnalysis: boolean;
  enableFeatureExtraction: boolean;
  enableClassification: boolean;
  enableSegmentation: boolean;
  maxObjects: number;
  maxFaces: number;
  maxTextRegions: number;
}

export const ComputerVision: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'analyze' | 'tasks' | 'models' | 'settings' | 'insights'>('analyze');
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string>('default');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock data
  const [analyses] = useState<ImageAnalysis[]>([
    {
      id: '1',
      imageUrl: '/api/placeholder/400/300',
      filename: 'sample-image.jpg',
      size: 1024000,
      dimensions: { width: 1920, height: 1080 },
      format: 'JPEG',
      objects: [
        {
          id: '1',
          label: 'person',
          confidence: 0.95,
          boundingBox: { x: 100, y: 50, width: 200, height: 300 },
          category: 'human',
          attributes: [
            { name: 'pose', value: 'standing', confidence: 0.9 },
            { name: 'clothing', value: 'casual', confidence: 0.8 }
          ]
        }
      ],
      faces: [
        {
          id: '1',
          confidence: 0.98,
          boundingBox: { x: 120, y: 80, width: 80, height: 100 },
          landmarks: [
            { type: 'eye', x: 140, y: 100, confidence: 0.95 },
            { type: 'nose', x: 160, y: 120, confidence: 0.9 }
          ],
          emotions: [
            { name: 'happy', confidence: 0.8 },
            { name: 'confident', confidence: 0.7 }
          ],
          age: 25,
          gender: 'male',
          attributes: [
            { name: 'glasses', value: 'no', confidence: 0.9 },
            { name: 'beard', value: 'no', confidence: 0.8 }
          ]
        }
      ],
      text: [
        {
          text: 'Hello World',
          confidence: 0.95,
          boundingBox: { x: 50, y: 400, width: 100, height: 20 },
          language: 'en'
        }
      ],
      colors: [
        { color: '#FF5733', percentage: 30, rgb: { r: 255, g: 87, b: 51 }, hsl: { h: 10, s: 100, l: 60 } },
        { color: '#33FF57', percentage: 25, rgb: { r: 51, g: 255, b: 87 }, hsl: { h: 130, s: 100, l: 60 } }
      ],
      features: {
        brightness: 0.7,
        contrast: 0.8,
        sharpness: 0.9,
        blur: 0.1,
        noise: 0.05,
        saturation: 0.8,
        hue: 0.5,
        exposure: 0.6
      },
      metadata: {
        camera: 'Canon EOS R5',
        lens: 'RF 24-70mm f/2.8L IS USM',
        focalLength: 50,
        aperture: 2.8,
        shutterSpeed: '1/125',
        iso: 400,
        flash: false,
        whiteBalance: 'auto',
        gps: { lat: 37.7749, lng: -122.4194 },
        timestamp: new Date(),
        software: 'Adobe Lightroom'
      },
      confidence: 0.92,
      processingTime: 2500,
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000)
    }
  ]);

  const [tasks] = useState<VisionTask[]>([
    {
      id: '1',
      name: 'Object Detection',
      description: 'Detect objects in uploaded image',
      type: 'object_detection',
      status: 'completed',
      input: 'sample-image.jpg',
      output: { objects: 3, faces: 1, text: 2 },
      confidence: 0.95,
      processingTime: 2500,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000 + 2500)
    }
  ]);

  const [models] = useState<VisionModel[]>([
    {
      id: '1',
      name: 'YOLO v8 Object Detection',
      description: 'Advanced object detection using YOLO v8 architecture',
      type: 'object_detection',
      version: '8.0.0',
      accuracy: 0.92,
      trainingData: 5000000,
      lastTrained: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      status: 'active',
      parameters: { classes: 80, inputSize: 640, confidence: 0.5 },
      performance: {
        accuracy: 0.92,
        precision: 0.91,
        recall: 0.93,
        f1Score: 0.92,
        trainingTime: 7200,
        inferenceTime: 50,
        memoryUsage: 1024,
        gpuUsage: 80
      }
    }
  ]);

  const [settings] = useState<VisionSettings>({
    defaultModel: 'yolo-v8',
    confidenceThreshold: 0.7,
    maxImageSize: 10 * 1024 * 1024, // 10MB
    enableRealTime: true,
    enableBatchProcessing: true,
    enableCaching: true,
    enableLogging: true,
    models: ['yolo-v8', 'resnet', 'efficientnet'],
    apiKeys: {
      google: 'AIza***',
      azure: '***',
      aws: '***'
    },
    processingOptions: {
      enableObjectDetection: true,
      enableFaceRecognition: true,
      enableTextExtraction: true,
      enableColorAnalysis: true,
      enableFeatureExtraction: true,
      enableClassification: true,
      enableSegmentation: true,
      maxObjects: 100,
      maxFaces: 50,
      maxTextRegions: 200
    }
  });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'object_detection': return <Target className="w-4 h-4" />;
      case 'face_recognition': return <User className="w-4 h-4" />;
      case 'text_extraction': return <FileText className="w-4 h-4" />;
      case 'color_analysis': return <Palette className="w-4 h-4" />;
      case 'feature_extraction': return <Layers className="w-4 h-4" />;
      case 'classification': return <Layers className="w-4 h-4" />;
      case 'segmentation': return <Grid3X3 className="w-4 h-4" />;
      default: return <Eye className="w-4 h-4" />;
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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = () => {
    if (selectedImage) {
      console.log('Analyzing image:', selectedImage.name);
    }
  };

  const createTask = () => {
    console.log('Creating vision task...');
  };

  const trainModel = () => {
    console.log('Training vision model...');
  };

  if (loading) {
    return (
      <div className="computer-vision">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading computer vision...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="computer-vision">
      <div className="vision-header">
        <div className="header-content">
          <div className="header-title">
            <Eye className="header-icon" />
            <h1>Computer Vision</h1>
          </div>
          <div className="header-controls">
            <button className="action-button" onClick={analyzeImage}>
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

      <div className="vision-tabs">
        <button 
          className={`tab ${activeTab === 'analyze' ? 'active' : ''}`}
          onClick={() => setActiveTab('analyze')}
        >
          <Camera className="tab-icon" />
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

      <div className="vision-content">
        {activeTab === 'analyze' && (
          <div className="analyze-tab">
            <div className="analysis-interface">
              <div className="input-section">
                <h3>Image Analysis</h3>
                <div className="input-controls">
                  <select 
                    value={selectedModel} 
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="model-selector"
                    title="Select vision model"
                  >
                    <option value="default">Default Model</option>
                    <option value="yolo-v8">YOLO v8</option>
                    <option value="resnet">ResNet</option>
                    <option value="efficientnet">EfficientNet</option>
                  </select>
                  <button className="action-button" onClick={analyzeImage}>
                    <Play className="w-4 h-4" />
                    Analyze
                  </button>
                </div>
                <div className="image-upload">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="file-input"
                    title="Upload image for analysis"
                  />
                  <button 
                    className="upload-button"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-4 h-4" />
                    Upload Image
                  </button>
                  {imagePreview && (
                    <div className="image-preview">
                      <img src={imagePreview} alt="Preview" />
                    </div>
                  )}
                </div>
              </div>

              <div className="results-section">
                <h3>Analysis Results</h3>
                {analyses.map((analysis) => (
                  <div key={analysis.id} className="analysis-result">
                    <div className="result-header">
                      <h4>Image Analysis</h4>
                      <div className="result-badges">
                        <span className="format-badge">{analysis.format}</span>
                        <span className="confidence-badge">{Math.round(analysis.confidence * 100)}% confidence</span>
                        <span className="time-badge">{analysis.processingTime}ms</span>
                      </div>
                    </div>

                    <div className="result-content">
                      <div className="image-info">
                        <div className="info-grid">
                          <div className="info-item">
                            <span className="info-label">Filename:</span>
                            <span className="info-value">{analysis.filename}</span>
                          </div>
                          <div className="info-item">
                            <span className="info-label">Size:</span>
                            <span className="info-value">{(analysis.size / 1024 / 1024).toFixed(2)} MB</span>
                          </div>
                          <div className="info-item">
                            <span className="info-label">Dimensions:</span>
                            <span className="info-value">{analysis.dimensions.width} × {analysis.dimensions.height}</span>
                          </div>
                          <div className="info-item">
                            <span className="info-label">Format:</span>
                            <span className="info-value">{analysis.format}</span>
                          </div>
                        </div>
                      </div>

                      <div className="objects-analysis">
                        <h5>Detected Objects ({analysis.objects.length})</h5>
                        {analysis.objects.map((object) => (
                          <div key={object.id} className="object-item">
                            <div className="object-header">
                              <span className="object-label">{object.label}</span>
                              <span className="object-confidence">{Math.round(object.confidence * 100)}%</span>
                            </div>
                            <div className="object-details">
                              <div className="detail-row">
                                <span className="detail-label">Category:</span>
                                <span className="detail-value">{object.category}</span>
                              </div>
                              <div className="detail-row">
                                <span className="detail-label">Bounding Box:</span>
                                <span className="detail-value">
                                  ({object.boundingBox.x}, {object.boundingBox.y}) - 
                                  {object.boundingBox.width} × {object.boundingBox.height}
                                </span>
                              </div>
                              <div className="object-attributes">
                                <h6>Attributes:</h6>
                                {object.attributes.map((attr, index) => (
                                  <div key={index} className="attribute-item">
                                    <span className="attribute-name">{attr.name}:</span>
                                    <span className="attribute-value">{attr.value}</span>
                                    <span className="attribute-confidence">{Math.round(attr.confidence * 100)}%</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="faces-analysis">
                        <h5>Detected Faces ({analysis.faces.length})</h5>
                        {analysis.faces.map((face) => (
                          <div key={face.id} className="face-item">
                            <div className="face-header">
                              <span className="face-confidence">{Math.round(face.confidence * 100)}%</span>
                            </div>
                            <div className="face-details">
                              <div className="detail-row">
                                <span className="detail-label">Age:</span>
                                <span className="detail-value">{face.age} years</span>
                              </div>
                              <div className="detail-row">
                                <span className="detail-label">Gender:</span>
                                <span className="detail-value">{face.gender}</span>
                              </div>
                              <div className="face-emotions">
                                <h6>Emotions:</h6>
                                {face.emotions.map((emotion, index) => (
                                  <div key={index} className="emotion-item">
                                    <span className="emotion-name">{emotion.name}</span>
                                    <span className="emotion-confidence">{Math.round(emotion.confidence * 100)}%</span>
                                  </div>
                                ))}
                              </div>
                              <div className="face-attributes">
                                <h6>Attributes:</h6>
                                {face.attributes.map((attr, index) => (
                                  <div key={index} className="attribute-item">
                                    <span className="attribute-name">{attr.name}:</span>
                                    <span className="attribute-value">{attr.value}</span>
                                    <span className="attribute-confidence">{Math.round(attr.confidence * 100)}%</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="text-analysis">
                        <h5>Extracted Text ({analysis.text.length})</h5>
                        {analysis.text.map((text, index) => (
                          <div key={index} className="text-item">
                            <div className="text-content">"{text.text}"</div>
                            <div className="text-details">
                              <span className="text-language">{text.language}</span>
                              <span className="text-confidence">{Math.round(text.confidence * 100)}%</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="colors-analysis">
                        <h5>Color Analysis</h5>
                        <div className="colors-grid">
                          {analysis.colors.map((color, index) => (
                            <div key={index} className="color-item">
                              <div 
                                className="color-swatch" 
                                style={{ backgroundColor: color.color }}
                              ></div>
                              <div className="color-info">
                                <span className="color-hex">{color.color}</span>
                                <span className="color-percentage">{color.percentage}%</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="features-analysis">
                        <h5>Image Features</h5>
                        <div className="features-grid">
                          <div className="feature-item">
                            <span className="feature-label">Brightness:</span>
                            <span className="feature-value">{Math.round(analysis.features.brightness * 100)}%</span>
                          </div>
                          <div className="feature-item">
                            <span className="feature-label">Contrast:</span>
                            <span className="feature-value">{Math.round(analysis.features.contrast * 100)}%</span>
                          </div>
                          <div className="feature-item">
                            <span className="feature-label">Sharpness:</span>
                            <span className="feature-value">{Math.round(analysis.features.sharpness * 100)}%</span>
                          </div>
                          <div className="feature-item">
                            <span className="feature-label">Saturation:</span>
                            <span className="feature-value">{Math.round(analysis.features.saturation * 100)}%</span>
                          </div>
                        </div>
                      </div>

                      <div className="metadata-analysis">
                        <h5>Image Metadata</h5>
                        <div className="metadata-grid">
                          <div className="metadata-item">
                            <span className="metadata-label">Camera:</span>
                            <span className="metadata-value">{analysis.metadata.camera}</span>
                          </div>
                          <div className="metadata-item">
                            <span className="metadata-label">Lens:</span>
                            <span className="metadata-value">{analysis.metadata.lens}</span>
                          </div>
                          <div className="metadata-item">
                            <span className="metadata-label">Focal Length:</span>
                            <span className="metadata-value">{analysis.metadata.focalLength}mm</span>
                          </div>
                          <div className="metadata-item">
                            <span className="metadata-label">Aperture:</span>
                            <span className="metadata-value">f/{analysis.metadata.aperture}</span>
                          </div>
                          <div className="metadata-item">
                            <span className="metadata-label">ISO:</span>
                            <span className="metadata-value">{analysis.metadata.iso}</span>
                          </div>
                          <div className="metadata-item">
                            <span className="metadata-label">Shutter Speed:</span>
                            <span className="metadata-value">{analysis.metadata.shutterSpeed}</span>
                          </div>
                        </div>
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
              <h3>Vision Tasks</h3>
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
                        <span className="detail-value">{task.input}</span>
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
              <h3>Vision Models</h3>
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
                        <div className="metric">
                          <span className="metric-label">GPU Usage:</span>
                          <span className="metric-value">{model.performance.gpuUsage}%</span>
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
            <div className="vision-settings">
              <h3>Vision Settings</h3>
              <div className="settings-grid">
                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Default Model</h4>
                    <p>Set the default model for image analysis</p>
                  </div>
                  <select 
                    value={settings.defaultModel} 
                    className="setting-input"
                    title="Select default model"
                  >
                    <option value="yolo-v8">YOLO v8</option>
                    <option value="resnet">ResNet</option>
                    <option value="efficientnet">EfficientNet</option>
                  </select>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Confidence Threshold</h4>
                    <p>Minimum confidence level for detection results</p>
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
                    <h4>Max Image Size</h4>
                    <p>Maximum file size for image uploads (MB)</p>
                  </div>
                  <input 
                    type="number" 
                    value={settings.maxImageSize / 1024 / 1024} 
                    className="setting-input"
                    title="Set max image size"
                  />
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Real-time Processing</h4>
                    <p>Enable real-time image analysis</p>
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
                    <p>Enable batch processing for multiple images</p>
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
                    <h4>Object Detection</h4>
                    <p>Enable object detection in images</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={settings.processingOptions.enableObjectDetection} 
                      title="Enable object detection"
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Face Recognition</h4>
                    <p>Enable face recognition in images</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={settings.processingOptions.enableFaceRecognition} 
                      title="Enable face recognition"
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Text Extraction</h4>
                    <p>Enable text extraction from images</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={settings.processingOptions.enableTextExtraction} 
                      title="Enable text extraction"
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Color Analysis</h4>
                    <p>Enable color analysis in images</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={settings.processingOptions.enableColorAnalysis} 
                      title="Enable color analysis"
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
            <div className="vision-insights">
              <h3>Vision Insights</h3>
              <div className="insights-grid">
                <div className="metric-card">
                  <div className="metric-header">
                    <Camera className="metric-icon" />
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
