import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Brain, 
  Activity, 
  Zap, 
  Eye, 
  Ear, 
  Mic, 
  Hand, 
  Foot, 
  Heart, 
  Lungs, 
  Liver, 
  Kidney, 
  Stomach, 
  Headphones, 
  Monitor, 
  Smartphone, 
  Laptop, 
  Watch, 
  Glasses, 
  Camera, 
  Video, 
  Speaker, 
  Volume2, 
  VolumeX, 
  Settings, 
  Plus, 
  Minus, 
  Play, 
  Pause, 
  RotateCcw, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Info, 
  Download, 
  Upload, 
  Save, 
  Trash2, 
  Copy, 
  Share, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart, 
  LineChart, 
  Target, 
  Navigation, 
  Compass, 
  Globe, 
  Star, 
  Sparkles, 
  Hexagon, 
  Circle, 
  Square, 
  Triangle, 
  Diamond, 
  Heart as HeartIcon, 
  Zap as Lightning, 
  Microscope, 
  FlaskConical, 
  Beaker, 
  TestTube, 
  Calculator, 
  Function, 
  Sigma, 
  Pi, 
  Infinity, 
  Hash, 
  Code, 
  Terminal, 
  Server, 
  HardDrive, 
  MemoryStick, 
  Cpu, 
  Wifi, 
  Bluetooth, 
  Radio, 
  Signal, 
  Network, 
  Cloud, 
  Sun, 
  Moon, 
  Thermometer, 
  Gauge, 
  Battery, 
  Power, 
  Lock, 
  Unlock, 
  Shield, 
  Key, 
  Database, 
  Layers, 
  Grid, 
  Search, 
  Filter, 
  Sort, 
  List, 
  Grid as GridIcon, 
  Calendar, 
  Clock, 
  Timer, 
  Stopwatch, 
  History, 
  Bookmark, 
  Tag, 
  Label, 
  Flag, 
  Pin, 
  MapPin, 
  Home, 
  Building, 
  Car, 
  Plane, 
  Ship, 
  Train, 
  Bike, 
  Truck, 
  Bus, 
  Motorcycle, 
  Scooter, 
  Skateboard, 
  Surfboard, 
  Ski, 
  Snowboard, 
  Tent, 
  Umbrella, 
  Tree, 
  Flower, 
  Leaf, 
  Seed, 
  Sprout, 
  Bug, 
  Fish, 
  Bird, 
  Cat, 
  Dog, 
  Rabbit, 
  Mouse, 
  Hamster, 
  Turtle, 
  Snake, 
  Lizard, 
  Frog, 
  Butterfly, 
  Bee, 
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
  Shrimp, 
  Penguin, 
  Owl, 
  Eagle, 
  Hawk, 
  Falcon, 
  Parrot, 
  Toucan, 
  Flamingo, 
  Peacock, 
  Swan, 
  Duck, 
  Goose, 
  Chicken, 
  Rooster, 
  Turkey, 
  Pigeon, 
  Dove, 
  Crow, 
  Raven, 
  Magpie, 
  Jay, 
  Cardinal, 
  Bluebird, 
  Robin, 
  Sparrow, 
  Finch, 
  Canary, 
  Hummingbird, 
  Woodpecker, 
  Kingfisher, 
  Heron, 
  Stork, 
  Crane, 
  Pelican, 
  Albatross, 
  Seagull, 
  Tern, 
  Sandpiper, 
  Plover, 
  Curlew, 
  Godwit, 
  Snipe, 
  Woodcock, 
  Sanderling, 
  Dunlin, 
  Knot, 
  Turnstone, 
  Oystercatcher, 
  Avocet, 
  Stilt, 
  Phalarope, 
  Jaeger, 
  Skua, 
  Gull, 
  Kittiwake, 
  Fulmar, 
  Petrel, 
  Shearwater, 
  StormPetrel, 
  DivingPetrel, 
  Prion, 
  Albatross as AlbatrossIcon, 
  WanderingAlbatross, 
  RoyalAlbatross, 
  BlackBrowedAlbatross, 
  GreyHeadedAlbatross, 
  YellowNosedAlbatross, 
  SootyAlbatross, 
  LightMantledAlbatross, 
  WavedAlbatross, 
  ShortTailedAlbatross, 
  LaysanAlbatross, 
  BlackFootedAlbatross, 
  GalapagosAlbatross, 
  TristanAlbatross, 
  AmsterdamAlbatross, 
  AntipodeanAlbatross, 
  GibsonAlbatross, 
  NorthernRoyalAlbatross, 
  SouthernRoyalAlbatross, 
  ShyAlbatross, 
  WhiteCappedAlbatross, 
  SalvinAlbatross, 
  ChathamAlbatross, 
  BullerAlbatross, 
  PacificAlbatross, 
  AtlanticAlbatross, 
  IndianAlbatross, 
  AntarcticAlbatross, 
  SubantarcticAlbatross, 
  TemperateAlbatross, 
  TropicalAlbatross, 
  EquatorialAlbatross, 
  PolarAlbatross, 
  ArcticAlbatross, 
  BorealAlbatross, 
  AustralAlbatross, 
  NeotropicalAlbatross, 
  PalearcticAlbatross, 
  NearcticAlbatross, 
  AfrotropicalAlbatross, 
  IndomalayanAlbatross, 
  OceanicAlbatross, 
  PelagicAlbatross, 
  CoastalAlbatross, 
  InshoreAlbatross, 
  OffshoreAlbatross, 
  DeepWaterAlbatross, 
  ShallowWaterAlbatross, 
  SurfaceAlbatross, 
  DivingAlbatross, 
  FlyingAlbatross, 
  GlidingAlbatross, 
  SoaringAlbatross, 
  HoveringAlbatross, 
  PerchingAlbatross, 
  RoostingAlbatross, 
  NestingAlbatross, 
  BreedingAlbatross, 
  MigratingAlbatross, 
  ResidentAlbatross, 
  EndemicAlbatross, 
  NativeAlbatross, 
  IntroducedAlbatross, 
  InvasiveAlbatross, 
  EndangeredAlbatross, 
  ThreatenedAlbatross, 
  VulnerableAlbatross, 
  NearThreatenedAlbatross, 
  LeastConcernAlbatross, 
  DataDeficientAlbatross, 
  NotEvaluatedAlbatross, 
  ExtinctAlbatross, 
  ExtinctInWildAlbatross, 
  CriticallyEndangeredAlbatross, 
  EndangeredAlbatross as EndangeredAlbatrossIcon, 
  VulnerableAlbatross as VulnerableAlbatrossIcon, 
  NearThreatenedAlbatross as NearThreatenedAlbatrossIcon, 
  LeastConcernAlbatross as LeastConcernAlbatrossIcon, 
  DataDeficientAlbatross as DataDeficientAlbatrossIcon, 
  NotEvaluatedAlbatross as NotEvaluatedAlbatrossIcon, 
  ExtinctAlbatross as ExtinctAlbatrossIcon, 
  ExtinctInWildAlbatross as ExtinctInWildAlbatrossIcon, 
  CriticallyEndangeredAlbatross as CriticallyEndangeredAlbatrossIcon
} from 'lucide-react';

interface NeuralDevice {
  id: string;
  name: string;
  type: 'eeg' | 'ecog' | 'dbs' | 'cochlear' | 'retinal' | 'prosthetic' | 'sensory' | 'motor';
  category: 'medical' | 'research' | 'consumer' | 'military' | 'entertainment';
  status: 'active' | 'inactive' | 'calibrating' | 'error' | 'maintenance';
  connection: 'wired' | 'wireless' | 'implanted' | 'external';
  location: string;
  electrodes: number;
  samplingRate: number;
  resolution: number;
  latency: number;
  battery: number;
  signal: number;
  lastCalibration: Date;
  data: NeuralData[];
  properties: Record<string, any>;
  isSecure: boolean;
  isCalibrated: boolean;
}

interface NeuralData {
  timestamp: Date;
  type: 'eeg' | 'ecog' | 'spike' | 'lfp' | 'emg' | 'eog' | 'ecg' | 'custom';
  channel: number;
  value: number;
  unit: string;
  quality: 'excellent' | 'good' | 'fair' | 'poor' | 'noise';
  frequency: number;
  amplitude: number;
  phase: number;
}

interface BrainSignal {
  id: string;
  name: string;
  type: 'alpha' | 'beta' | 'gamma' | 'theta' | 'delta' | 'mu' | 'spindle' | 'custom';
  frequency: { min: number; max: number };
  amplitude: { min: number; max: number };
  location: string;
  function: string;
  isActive: boolean;
  strength: number;
  coherence: number;
  lastDetected: Date;
}

interface NeuralPattern {
  id: string;
  name: string;
  description: string;
  type: 'motor' | 'sensory' | 'cognitive' | 'emotional' | 'memory' | 'language';
  complexity: 'simple' | 'moderate' | 'complex' | 'advanced';
  electrodes: number[];
  features: PatternFeature[];
  isLearned: boolean;
  accuracy: number;
  lastUsed: Date;
  uses: number;
}

interface PatternFeature {
  name: string;
  type: 'frequency' | 'amplitude' | 'phase' | 'coherence' | 'entropy';
  value: number;
  threshold: number;
  weight: number;
}

interface NeuralInterface {
  id: string;
  name: string;
  type: 'bci' | 'bmi' | 'neural-prosthesis' | 'brain-stimulation' | 'neural-recording';
  purpose: 'control' | 'communication' | 'rehabilitation' | 'enhancement' | 'research';
  status: 'active' | 'inactive' | 'testing' | 'error';
  devices: string[];
  algorithms: string[];
  applications: string[];
  performance: NeuralPerformance;
  lastUpdate: Date;
}

interface NeuralPerformance {
  accuracy: number;
  latency: number;
  throughput: number;
  reliability: number;
  userSatisfaction: number;
}

export const NeuralInterfaces: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'devices' | 'signals' | 'patterns' | 'interfaces' | 'analytics'>('devices');
  const [loading, setLoading] = useState(true);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);

  // Mock data - in production, this would come from neural interface APIs
  const [devices] = useState<NeuralDevice[]>([
    {
      id: '1',
      name: 'EEG Headset Pro',
      type: 'eeg',
      category: 'consumer',
      status: 'active',
      connection: 'wireless',
      location: 'Scalp',
      electrodes: 64,
      samplingRate: 1000,
      resolution: 24,
      latency: 5,
      battery: 85,
      signal: 95,
      lastCalibration: new Date(Date.now() - 1 * 60 * 60 * 1000),
      data: [
        { timestamp: new Date(), type: 'eeg', channel: 1, value: 12.5, unit: 'μV', quality: 'excellent', frequency: 10, amplitude: 15, phase: 0.5 }
      ],
      properties: { impedance: 5, noise: 2, drift: 0.1 },
      isSecure: true,
      isCalibrated: true
    },
    {
      id: '2',
      name: 'ECoG Grid Array',
      type: 'ecog',
      category: 'medical',
      status: 'active',
      connection: 'wired',
      location: 'Cortex',
      electrodes: 256,
      samplingRate: 2000,
      resolution: 32,
      latency: 1,
      battery: 0,
      signal: 98,
      lastCalibration: new Date(Date.now() - 2 * 60 * 60 * 1000),
      data: [
        { timestamp: new Date(), type: 'ecog', channel: 1, value: 45.2, unit: 'μV', quality: 'excellent', frequency: 50, amplitude: 60, phase: 0.8 }
      ],
      properties: { impedance: 2, noise: 1, drift: 0.05 },
      isSecure: true,
      isCalibrated: true
    },
    {
      id: '3',
      name: 'DBS Stimulator',
      type: 'dbs',
      category: 'medical',
      status: 'active',
      connection: 'implanted',
      location: 'Subthalamic Nucleus',
      electrodes: 4,
      samplingRate: 500,
      resolution: 16,
      latency: 0.5,
      battery: 92,
      signal: 99,
      lastCalibration: new Date(Date.now() - 3 * 60 * 60 * 1000),
      data: [
        { timestamp: new Date(), type: 'spike', channel: 1, value: 0.8, unit: 'V', quality: 'excellent', frequency: 130, amplitude: 2.5, phase: 0.2 }
      ],
      properties: { impedance: 1, noise: 0.5, drift: 0.02 },
      isSecure: true,
      isCalibrated: true
    }
  ]);

  const [signals] = useState<BrainSignal[]>([
    {
      id: '1',
      name: 'Alpha Waves',
      type: 'alpha',
      frequency: { min: 8, max: 12 },
      amplitude: { min: 10, max: 50 },
      location: 'Occipital',
      function: 'Relaxation and meditation',
      isActive: true,
      strength: 75,
      coherence: 0.8,
      lastDetected: new Date(Date.now() - 5 * 60 * 1000)
    },
    {
      id: '2',
      name: 'Beta Waves',
      type: 'beta',
      frequency: { min: 13, max: 30 },
      amplitude: { min: 5, max: 25 },
      location: 'Frontal',
      function: 'Active concentration and alertness',
      isActive: true,
      strength: 85,
      coherence: 0.7,
      lastDetected: new Date(Date.now() - 2 * 60 * 1000)
    },
    {
      id: '3',
      name: 'Gamma Waves',
      type: 'gamma',
      frequency: { min: 30, max: 100 },
      amplitude: { min: 2, max: 15 },
      location: 'Distributed',
      function: 'Higher cognitive processing',
      isActive: true,
      strength: 60,
      coherence: 0.9,
      lastDetected: new Date(Date.now() - 1 * 60 * 1000)
    }
  ]);

  const [patterns] = useState<NeuralPattern[]>([
    {
      id: '1',
      name: 'Motor Imagery - Left Hand',
      description: 'Neural pattern for imagining left hand movement',
      type: 'motor',
      complexity: 'moderate',
      electrodes: [1, 2, 3, 4, 5, 6, 7, 8],
      features: [
        { name: 'Mu Rhythm', type: 'frequency', value: 10, threshold: 8, weight: 0.3 },
        { name: 'Beta Power', type: 'amplitude', value: 15, threshold: 12, weight: 0.4 },
        { name: 'Coherence', type: 'coherence', value: 0.7, threshold: 0.6, weight: 0.3 }
      ],
      isLearned: true,
      accuracy: 92,
      lastUsed: new Date(Date.now() - 30 * 60 * 1000),
      uses: 156
    },
    {
      id: '2',
      name: 'Visual Attention',
      description: 'Neural pattern for visual attention tasks',
      type: 'cognitive',
      complexity: 'complex',
      electrodes: [9, 10, 11, 12, 13, 14, 15, 16],
      features: [
        { name: 'Alpha Suppression', type: 'amplitude', value: 8, threshold: 10, weight: 0.4 },
        { name: 'Gamma Increase', type: 'frequency', value: 45, threshold: 40, weight: 0.3 },
        { name: 'Phase Locking', type: 'phase', value: 0.8, threshold: 0.7, weight: 0.3 }
      ],
      isLearned: true,
      accuracy: 88,
      lastUsed: new Date(Date.now() - 15 * 60 * 1000),
      uses: 89
    }
  ]);

  const [interfaces] = useState<NeuralInterface[]>([
    {
      id: '1',
      name: 'BCI Control System',
      type: 'bci',
      purpose: 'control',
      status: 'active',
      devices: ['EEG Headset Pro'],
      algorithms: ['Motor Imagery', 'P300', 'SSVEP'],
      applications: ['Cursor Control', 'Wheelchair Navigation', 'Prosthetic Control'],
      performance: {
        accuracy: 92,
        latency: 150,
        throughput: 8,
        reliability: 95,
        userSatisfaction: 88
      },
      lastUpdate: new Date(Date.now() - 1 * 60 * 60 * 1000)
    },
    {
      id: '2',
      name: 'Neural Prosthesis',
      type: 'neural-prosthesis',
      purpose: 'rehabilitation',
      status: 'active',
      devices: ['ECoG Grid Array', 'DBS Stimulator'],
      algorithms: ['Spike Sorting', 'Neural Decoding', 'Stimulation Control'],
      applications: ['Motor Recovery', 'Sensory Restoration', 'Pain Management'],
      performance: {
        accuracy: 95,
        latency: 50,
        throughput: 12,
        reliability: 98,
        userSatisfaction: 92
      },
      lastUpdate: new Date(Date.now() - 2 * 60 * 60 * 1000)
    }
  ]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'eeg': return <Brain className="w-4 h-4" />;
      case 'ecog': return <Activity className="w-4 h-4" />;
      case 'dbs': return <Zap className="w-4 h-4" />;
      case 'cochlear': return <Ear className="w-4 h-4" />;
      case 'retinal': return <Eye className="w-4 h-4" />;
      case 'prosthetic': return <Hand className="w-4 h-4" />;
      case 'sensory': return <Hand className="w-4 h-4" />;
      case 'motor': return <Zap className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-500';
      case 'inactive': return 'text-gray-500';
      case 'calibrating': return 'text-yellow-500';
      case 'error': return 'text-red-500';
      case 'maintenance': return 'text-orange-500';
      case 'testing': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'inactive': return <XCircle className="w-4 h-4 text-gray-500" />;
      case 'calibrating': return <Settings className="w-4 h-4 text-yellow-500" />;
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'maintenance': return <Settings className="w-4 h-4 text-orange-500" />;
      case 'testing': return <TestTube className="w-4 h-4 text-blue-500" />;
      default: return <Info className="w-4 h-4 text-gray-500" />;
    }
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent': return 'text-green-500';
      case 'good': return 'text-blue-500';
      case 'fair': return 'text-yellow-500';
      case 'poor': return 'text-orange-500';
      case 'noise': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'simple': return 'text-green-500';
      case 'moderate': return 'text-yellow-500';
      case 'complex': return 'text-orange-500';
      case 'advanced': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const formatSamplingRate = (rate: number) => {
    if (rate >= 1000) {
      return `${(rate / 1000).toFixed(1)}kHz`;
    }
    return `${rate}Hz`;
  };

  const formatLatency = (latency: number) => {
    if (latency >= 1000) {
      return `${(latency / 1000).toFixed(1)}s`;
    }
    return `${latency}ms`;
  };

  const addDevice = () => {
    console.log('Adding new neural device...');
  };

  const createPattern = () => {
    console.log('Creating new neural pattern...');
  };

  const createInterface = () => {
    console.log('Creating new neural interface...');
  };

  if (loading) {
    return (
      <div className="neural-interfaces">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading neural interfaces...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="neural-interfaces">
      <div className="neural-header">
        <div className="header-content">
          <div className="header-title">
            <Brain className="header-icon" />
            <h1>Neural Interfaces</h1>
          </div>
          <div className="header-controls">
            <button className="action-button" onClick={addDevice}>
              <Plus className="button-icon" />
              Add Device
            </button>
            <button className="action-button" onClick={createPattern}>
              <Brain className="button-icon" />
              Create Pattern
            </button>
            <button className="action-button" onClick={createInterface}>
              <Activity className="button-icon" />
              Create Interface
            </button>
          </div>
        </div>
      </div>

      <div className="neural-tabs">
        <button 
          className={`tab ${activeTab === 'devices' ? 'active' : ''}`}
          onClick={() => setActiveTab('devices')}
        >
          <Settings className="tab-icon" />
          Devices
        </button>
        <button 
          className={`tab ${activeTab === 'signals' ? 'active' : ''}`}
          onClick={() => setActiveTab('signals')}
        >
          <Activity className="tab-icon" />
          Signals
        </button>
        <button 
          className={`tab ${activeTab === 'patterns' ? 'active' : ''}`}
          onClick={() => setActiveTab('patterns')}
        >
          <Brain className="tab-icon" />
          Patterns
        </button>
        <button 
          className={`tab ${activeTab === 'interfaces' ? 'active' : ''}`}
          onClick={() => setActiveTab('interfaces')}
        >
          <Zap className="tab-icon" />
          Interfaces
        </button>
        <button 
          className={`tab ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          <BarChart3 className="tab-icon" />
          Analytics
        </button>
      </div>

      <div className="neural-content">
        {activeTab === 'devices' && (
          <div className="devices-tab">
            <div className="devices-list">
              <h3>Neural Devices</h3>
              {devices.map((device) => (
                <div 
                  key={device.id} 
                  className={`device-item ${selectedDevice === device.id ? 'selected' : ''}`}
                  onClick={() => setSelectedDevice(device.id)}
                >
                  <div className="device-icon">
                    {getDeviceIcon(device.type)}
                  </div>
                  <div className="device-info">
                    <div className="device-header">
                      <h4 className="device-name">{device.name}</h4>
                      <div className="device-badges">
                        <span className={`status-badge ${getStatusColor(device.status)}`}>
                          {getStatusIcon(device.status)}
                          {device.status}
                        </span>
                        <span className="type-badge">{device.type.toUpperCase()}</span>
                        <span className="category-badge">{device.category}</span>
                        {device.isSecure && (
                          <span className="secure-badge">
                            <Shield className="w-3 h-3" />
                            Secure
                          </span>
                        )}
                        {device.isCalibrated && (
                          <span className="calibrated-badge">
                            <CheckCircle className="w-3 h-3" />
                            Calibrated
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="device-details">
                      <div className="detail-row">
                        <span className="detail-label">Location:</span>
                        <span className="detail-value">{device.location}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Electrodes:</span>
                        <span className="detail-value">{device.electrodes}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Sampling Rate:</span>
                        <span className="detail-value">{formatSamplingRate(device.samplingRate)}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Resolution:</span>
                        <span className="detail-value">{device.resolution} bits</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Latency:</span>
                        <span className="detail-value">{formatLatency(device.latency)}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Connection:</span>
                        <span className="detail-value">{device.connection}</span>
                      </div>
                      {device.battery > 0 && (
                        <div className="detail-row">
                          <span className="detail-label">Battery:</span>
                          <span className="detail-value">{device.battery}%</span>
                        </div>
                      )}
                      <div className="detail-row">
                        <span className="detail-label">Signal:</span>
                        <span className="detail-value">{device.signal}%</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Last Calibration:</span>
                        <span className="detail-value">{device.lastCalibration.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="device-data">
                      <h5>Recent Data:</h5>
                      {device.data.map((data, index) => (
                        <div key={index} className="data-item">
                          <span className="data-type">{data.type.toUpperCase()}:</span>
                          <span className="data-value">{data.value} {data.unit}</span>
                          <span className={`data-quality ${getQualityColor(data.quality)}`}>
                            {data.quality}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="device-actions">
                    <button className="action-button">
                      <Settings className="w-4 h-4" />
                      Configure
                    </button>
                    <button className="action-button">
                      <RefreshCw className="w-4 h-4" />
                      Calibrate
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'signals' && (
          <div className="signals-tab">
            <div className="signals-list">
              <h3>Brain Signals</h3>
              {signals.map((signal) => (
                <div key={signal.id} className="signal-item">
                  <div className="signal-icon">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div className="signal-info">
                    <div className="signal-header">
                      <h4 className="signal-name">{signal.name}</h4>
                      <div className="signal-badges">
                        <span className="type-badge">{signal.type}</span>
                        {signal.isActive && (
                          <span className="active-badge">
                            <CheckCircle className="w-3 h-3" />
                            Active
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="signal-details">
                      <div className="detail-row">
                        <span className="detail-label">Frequency:</span>
                        <span className="detail-value">{signal.frequency.min}-{signal.frequency.max} Hz</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Amplitude:</span>
                        <span className="detail-value">{signal.amplitude.min}-{signal.amplitude.max} μV</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Location:</span>
                        <span className="detail-value">{signal.location}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Function:</span>
                        <span className="detail-value">{signal.function}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Strength:</span>
                        <span className="detail-value">{signal.strength}%</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Coherence:</span>
                        <span className="detail-value">{signal.coherence.toFixed(2)}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Last Detected:</span>
                        <span className="detail-value">{signal.lastDetected.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="signal-actions">
                    <button className="action-button">
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                    <button className="action-button">
                      <Settings className="w-4 h-4" />
                      Analyze
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'patterns' && (
          <div className="patterns-tab">
            <div className="patterns-list">
              <h3>Neural Patterns</h3>
              {patterns.map((pattern) => (
                <div key={pattern.id} className="pattern-item">
                  <div className="pattern-icon">
                    <Brain className="w-5 h-5" />
                  </div>
                  <div className="pattern-info">
                    <div className="pattern-header">
                      <h4 className="pattern-name">{pattern.name}</h4>
                      <div className="pattern-badges">
                        <span className="type-badge">{pattern.type}</span>
                        <span className={`complexity-badge ${getComplexityColor(pattern.complexity)}`}>
                          {pattern.complexity}
                        </span>
                        {pattern.isLearned && (
                          <span className="learned-badge">
                            <CheckCircle className="w-3 h-3" />
                            Learned
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="pattern-description">{pattern.description}</p>
                    <div className="pattern-details">
                      <div className="detail-row">
                        <span className="detail-label">Electrodes:</span>
                        <span className="detail-value">{pattern.electrodes.join(', ')}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Accuracy:</span>
                        <span className="detail-value">{pattern.accuracy}%</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Uses:</span>
                        <span className="detail-value">{pattern.uses}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Last Used:</span>
                        <span className="detail-value">{pattern.lastUsed.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="pattern-features">
                      <h5>Features:</h5>
                      {pattern.features.map((feature, index) => (
                        <div key={index} className="feature-item">
                          <span className="feature-name">{feature.name}:</span>
                          <span className="feature-value">{feature.value}</span>
                          <span className="feature-weight">({feature.weight})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="pattern-actions">
                    <button className="action-button">
                      <Play className="w-4 h-4" />
                      Execute
                    </button>
                    <button className="action-button">
                      <Settings className="w-4 h-4" />
                      Train
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'interfaces' && (
          <div className="interfaces-tab">
            <div className="interfaces-list">
              <h3>Neural Interfaces</h3>
              {interfaces.map((interface_) => (
                <div key={interface_.id} className="interface-item">
                  <div className="interface-icon">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div className="interface-info">
                    <div className="interface-header">
                      <h4 className="interface-name">{interface_.name}</h4>
                      <div className="interface-badges">
                        <span className="type-badge">{interface_.type}</span>
                        <span className="purpose-badge">{interface_.purpose}</span>
                        <span className={`status-badge ${getStatusColor(interface_.status)}`}>
                          {getStatusIcon(interface_.status)}
                          {interface_.status}
                        </span>
                      </div>
                    </div>
                    <div className="interface-details">
                      <div className="detail-row">
                        <span className="detail-label">Devices:</span>
                        <span className="detail-value">{interface_.devices.join(', ')}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Algorithms:</span>
                        <span className="detail-value">{interface_.algorithms.join(', ')}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Applications:</span>
                        <span className="detail-value">{interface_.applications.join(', ')}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Last Update:</span>
                        <span className="detail-value">{interface_.lastUpdate.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="interface-performance">
                      <h5>Performance:</h5>
                      <div className="performance-grid">
                        <div className="metric">
                          <span className="metric-label">Accuracy:</span>
                          <span className="metric-value">{interface_.performance.accuracy}%</span>
                        </div>
                        <div className="metric">
                          <span className="metric-label">Latency:</span>
                          <span className="metric-value">{interface_.performance.latency}ms</span>
                        </div>
                        <div className="metric">
                          <span className="metric-label">Throughput:</span>
                          <span className="metric-value">{interface_.performance.throughput} bps</span>
                        </div>
                        <div className="metric">
                          <span className="metric-label">Reliability:</span>
                          <span className="metric-value">{interface_.performance.reliability}%</span>
                        </div>
                        <div className="metric">
                          <span className="metric-label">User Satisfaction:</span>
                          <span className="metric-value">{interface_.performance.userSatisfaction}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="interface-actions">
                    <button className="action-button">
                      <Play className="w-4 h-4" />
                      Activate
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

        {activeTab === 'analytics' && (
          <div className="analytics-tab">
            <div className="analytics-dashboard">
              <h3>Neural Analytics</h3>
              <div className="analytics-grid">
                <div className="metric-card">
                  <div className="metric-header">
                    <Settings className="metric-icon" />
                    <span className="metric-label">Total Devices</span>
                  </div>
                  <div className="metric-value">{devices.length}</div>
                  <div className="metric-status">
                    {devices.filter(d => d.status === 'active').length} active
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-header">
                    <Activity className="metric-icon" />
                    <span className="metric-label">Active Signals</span>
                  </div>
                  <div className="metric-value">{signals.filter(s => s.isActive).length}</div>
                  <div className="metric-status">
                    {signals.length} total signals
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-header">
                    <Brain className="metric-icon" />
                    <span className="metric-label">Learned Patterns</span>
                  </div>
                  <div className="metric-value">{patterns.filter(p => p.isLearned).length}</div>
                  <div className="metric-status">
                    {patterns.length} total patterns
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-header">
                    <Zap className="metric-icon" />
                    <span className="metric-label">Active Interfaces</span>
                  </div>
                  <div className="metric-value">{interfaces.filter(i => i.status === 'active').length}</div>
                  <div className="metric-status">
                    {interfaces.length} total interfaces
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
