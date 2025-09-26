import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Cpu, 
  MemoryStick, 
  HardDrive, 
  Network, 
  Battery, 
  Power, 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart, 
  LineChart, 
  Layers, 
  Grid, 
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
  Heart, 
  Brain, 
  Microscope, 
  FlaskConical, 
  Beaker, 
  TestTube, 
  Calculator, 
  Code, 
  Terminal, 
  Server, 
  Wifi, 
  Bluetooth, 
  Radio, 
  Signal, 
  Cloud, 
  Sun, 
  Moon, 
  Thermometer, 
  Gauge, 
  Lock, 
  Unlock, 
  Shield, 
  Key, 
  Database, 
  Search, 
  Filter, 
  List, 
  Grid as GridIcon, 
  Timer, 
  History, 
  Bookmark, 
  Tag, 
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
  Play,
  Pause,
  RotateCcw,
  Settings,
  Plus,
  Minus,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  RefreshCw,
  Download,
  Upload,
  Save,
  Trash2,
  Copy,
  Share,
  Eye,
  EyeOff,
  Edit,
  Clock,
  Calendar,
  Target,
  Zap
} from 'lucide-react';

interface Resource {
  id: string;
  name: string;
  type: 'cpu' | 'memory' | 'storage' | 'network' | 'gpu' | 'database' | 'api' | 'service';
  category: 'compute' | 'storage' | 'network' | 'database' | 'external';
  status: 'available' | 'allocated' | 'reserved' | 'maintenance' | 'error';
  capacity: number;
  used: number;
  available: number;
  utilization: number; // percentage
  performance: ResourcePerformance;
  allocation: ResourceAllocation[];
  metadata: ResourceMetadata;
  lastUpdated: Date;
}

interface ResourcePerformance {
  throughput: number;
  latency: number;
  errorRate: number;
  availability: number;
  efficiency: number;
  cost: number;
  energy: number;
}

interface ResourceAllocation {
  id: string;
  taskId: string;
  taskName: string;
  allocated: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  startTime: Date;
  endTime: Date | null;
  status: 'active' | 'completed' | 'cancelled' | 'suspended';
  efficiency: number;
  cost: number;
}

interface ResourceMetadata {
  location: string;
  provider: string;
  region: string;
  zone: string;
  instance: string;
  specifications: Record<string, any>;
  tags: string[];
  cost: number;
  energy: number;
  carbon: number;
}

interface AllocationStrategy {
  id: string;
  name: string;
  description: string;
  type: 'load-balancing' | 'cost-optimization' | 'performance' | 'energy-efficiency' | 'hybrid';
  parameters: Record<string, any>;
  effectiveness: number;
  cost: number;
  performance: number;
  energy: number;
  isActive: boolean;
  lastUsed: Date;
  usageCount: number;
}

interface ResourceOptimization {
  id: string;
  resourceId: string;
  strategy: string;
  currentAllocation: number;
  suggestedAllocation: number;
  reason: string;
  impact: 'positive' | 'neutral' | 'negative';
  confidence: number;
  estimatedSavings: number;
  performanceGain: number;
  energyReduction: number;
  createdAt: Date;
}

interface ResourcePool {
  id: string;
  name: string;
  description: string;
  resources: string[];
  totalCapacity: number;
  usedCapacity: number;
  availableCapacity: number;
  utilization: number;
  strategy: string;
  performance: ResourcePerformance;
  cost: number;
  energy: number;
  lastOptimized: Date;
}

export const IntelligentResourceAllocation: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'resources' | 'allocation' | 'optimization' | 'pools' | 'analytics'>('resources');
  const [loading, setLoading] = useState(true);
  const [selectedResource, setSelectedResource] = useState<string | null>(null);

  // Mock data - in production, this would come from resource management APIs
  const [resources] = useState<Resource[]>([
    {
      id: '1',
      name: 'CPU Cluster Alpha',
      type: 'cpu',
      category: 'compute',
      status: 'available',
      capacity: 100,
      used: 75,
      available: 25,
      utilization: 75,
      performance: {
        throughput: 95,
        latency: 2,
        errorRate: 0.1,
        availability: 99.9,
        efficiency: 92,
        cost: 150,
        energy: 85
      },
      allocation: [
        {
          id: '1',
          taskId: 'task-1',
          taskName: 'Data Processing',
          allocated: 50,
          priority: 'high',
          startTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
          endTime: null,
          status: 'active',
          efficiency: 88,
          cost: 75
        },
        {
          id: '2',
          taskId: 'task-2',
          taskName: 'ML Training',
          allocated: 25,
          priority: 'medium',
          startTime: new Date(Date.now() - 1 * 60 * 60 * 1000),
          endTime: null,
          status: 'active',
          efficiency: 95,
          cost: 37.5
        }
      ],
      metadata: {
        location: 'us-east-1',
        provider: 'AWS',
        region: 'Virginia',
        zone: 'us-east-1a',
        instance: 'c5.2xlarge',
        specifications: { cores: 8, memory: '16GB', storage: '100GB' },
        tags: ['production', 'compute', 'high-performance'],
        cost: 150,
        energy: 85,
        carbon: 12
      },
      lastUpdated: new Date(Date.now() - 5 * 60 * 1000)
    },
    {
      id: '2',
      name: 'Memory Pool Beta',
      type: 'memory',
      category: 'compute',
      status: 'available',
      capacity: 64,
      used: 48,
      available: 16,
      utilization: 75,
      performance: {
        throughput: 98,
        latency: 1,
        errorRate: 0.05,
        availability: 99.95,
        efficiency: 94,
        cost: 80,
        energy: 45
      },
      allocation: [
        {
          id: '3',
          taskId: 'task-3',
          taskName: 'Cache Management',
          allocated: 32,
          priority: 'high',
          startTime: new Date(Date.now() - 3 * 60 * 60 * 1000),
          endTime: null,
          status: 'active',
          efficiency: 96,
          cost: 40
        },
        {
          id: '4',
          taskId: 'task-4',
          taskName: 'Data Analysis',
          allocated: 16,
          priority: 'medium',
          startTime: new Date(Date.now() - 1 * 60 * 60 * 1000),
          endTime: null,
          status: 'active',
          efficiency: 92,
          cost: 20
        }
      ],
      metadata: {
        location: 'us-west-2',
        provider: 'AWS',
        region: 'Oregon',
        zone: 'us-west-2b',
        instance: 'r5.xlarge',
        specifications: { memory: '32GB', storage: '500GB' },
        tags: ['production', 'memory', 'cache'],
        cost: 80,
        energy: 45,
        carbon: 8
      },
      lastUpdated: new Date(Date.now() - 3 * 60 * 1000)
    },
    {
      id: '3',
      name: 'Storage Cluster Gamma',
      type: 'storage',
      category: 'storage',
      status: 'available',
      capacity: 1000,
      used: 750,
      available: 250,
      utilization: 75,
      performance: {
        throughput: 90,
        latency: 5,
        errorRate: 0.02,
        availability: 99.99,
        efficiency: 88,
        cost: 200,
        energy: 120
      },
      allocation: [
        {
          id: '5',
          taskId: 'task-5',
          taskName: 'Database Storage',
          allocated: 500,
          priority: 'critical',
          startTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
          endTime: null,
          status: 'active',
          efficiency: 95,
          cost: 100
        },
        {
          id: '6',
          taskId: 'task-6',
          taskName: 'Backup Storage',
          allocated: 250,
          priority: 'medium',
          startTime: new Date(Date.now() - 12 * 60 * 60 * 1000),
          endTime: null,
          status: 'active',
          efficiency: 85,
          cost: 50
        }
      ],
      metadata: {
        location: 'eu-west-1',
        provider: 'AWS',
        region: 'Ireland',
        zone: 'eu-west-1a',
        instance: 'i3.2xlarge',
        specifications: { storage: '1.9TB NVMe', network: '10 Gbps' },
        tags: ['production', 'storage', 'database'],
        cost: 200,
        energy: 120,
        carbon: 18
      },
      lastUpdated: new Date(Date.now() - 2 * 60 * 1000)
    }
  ]);

  const [strategies] = useState<AllocationStrategy[]>([
    {
      id: '1',
      name: 'Load Balancing',
      description: 'Distribute workload evenly across available resources',
      type: 'load-balancing',
      parameters: { threshold: 80, rebalanceInterval: 300 },
      effectiveness: 92,
      cost: 100,
      performance: 95,
      energy: 88,
      isActive: true,
      lastUsed: new Date(Date.now() - 1 * 60 * 60 * 1000),
      usageCount: 156
    },
    {
      id: '2',
      name: 'Cost Optimization',
      description: 'Minimize costs while maintaining performance',
      type: 'cost-optimization',
      parameters: { maxCost: 500, performanceThreshold: 80 },
      effectiveness: 88,
      cost: 75,
      performance: 85,
      energy: 90,
      isActive: true,
      lastUsed: new Date(Date.now() - 2 * 60 * 60 * 1000),
      usageCount: 89
    },
    {
      id: '3',
      name: 'Energy Efficiency',
      description: 'Optimize for energy consumption and carbon footprint',
      type: 'energy-efficiency',
      parameters: { maxEnergy: 200, carbonThreshold: 50 },
      effectiveness: 85,
      cost: 90,
      performance: 80,
      energy: 95,
      isActive: false,
      lastUsed: new Date(Date.now() - 6 * 60 * 60 * 1000),
      usageCount: 45
    }
  ]);

  const [optimizations] = useState<ResourceOptimization[]>([
    {
      id: '1',
      resourceId: '1',
      strategy: 'Load Balancing',
      currentAllocation: 75,
      suggestedAllocation: 60,
      reason: 'Reduce CPU utilization to improve performance',
      impact: 'positive',
      confidence: 85,
      estimatedSavings: 25,
      performanceGain: 15,
      energyReduction: 10,
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000)
    },
    {
      id: '2',
      resourceId: '2',
      strategy: 'Cost Optimization',
      currentAllocation: 75,
      suggestedAllocation: 70,
      reason: 'Optimize memory allocation for cost efficiency',
      impact: 'positive',
      confidence: 78,
      estimatedSavings: 15,
      performanceGain: 5,
      energyReduction: 8,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
    }
  ]);

  const [pools] = useState<ResourcePool[]>([
    {
      id: '1',
      name: 'Production Pool',
      description: 'High-performance resources for production workloads',
      resources: ['1', '2', '3'],
      totalCapacity: 1164,
      usedCapacity: 873,
      availableCapacity: 291,
      utilization: 75,
      strategy: 'Load Balancing',
      performance: {
        throughput: 94,
        latency: 3,
        errorRate: 0.06,
        availability: 99.95,
        efficiency: 91,
        cost: 430,
        energy: 250
      },
      cost: 430,
      energy: 250,
      lastOptimized: new Date(Date.now() - 1 * 60 * 60 * 1000)
    }
  ]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'cpu': return <Cpu className="w-4 h-4" />;
      case 'memory': return <MemoryStick className="w-4 h-4" />;
      case 'storage': return <HardDrive className="w-4 h-4" />;
      case 'network': return <Network className="w-4 h-4" />;
      case 'gpu': return <Activity className="w-4 h-4" />;
      case 'database': return <Database className="w-4 h-4" />;
      case 'api': return <Globe className="w-4 h-4" />;
      case 'service': return <Server className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'text-green-500';
      case 'allocated': return 'text-blue-500';
      case 'reserved': return 'text-yellow-500';
      case 'maintenance': return 'text-orange-500';
      case 'error': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'allocated': return <Activity className="w-4 h-4 text-blue-500" />;
      case 'reserved': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'maintenance': return <Settings className="w-4 h-4 text-orange-500" />;
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <Info className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'high': return 'text-orange-500';
      case 'critical': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'positive': return 'text-green-500';
      case 'neutral': return 'text-gray-500';
      case 'negative': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const formatCapacity = (value: number, type: string) => {
    switch (type) {
      case 'cpu': return `${value} cores`;
      case 'memory': return `${value} GB`;
      case 'storage': return `${value} GB`;
      case 'network': return `${value} Mbps`;
      default: return `${value}`;
    }
  };

  const formatCost = (cost: number) => {
    return `$${cost.toFixed(2)}`;
  };

  const formatEnergy = (energy: number) => {
    return `${energy} kWh`;
  };

  const createResource = () => {
    console.log('Creating new resource...');
  };

  const optimizeResources = () => {
    console.log('Optimizing resources...');
  };

  const createPool = () => {
    console.log('Creating new resource pool...');
  };

  if (loading) {
    return (
      <div className="intelligent-resource-allocation">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading intelligent resource allocation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="intelligent-resource-allocation">
      <div className="allocation-header">
        <div className="header-content">
          <div className="header-title">
            <Cpu className="header-icon" />
            <h1>Intelligent Resource Allocation</h1>
          </div>
          <div className="header-controls">
            <button className="action-button" onClick={createResource}>
              <Plus className="button-icon" />
              Add Resource
            </button>
            <button className="action-button" onClick={optimizeResources}>
              <Zap className="button-icon" />
              Optimize
            </button>
            <button className="action-button" onClick={createPool}>
              <Layers className="button-icon" />
              Create Pool
            </button>
          </div>
        </div>
      </div>

      <div className="allocation-tabs">
        <button 
          className={`tab ${activeTab === 'resources' ? 'active' : ''}`}
          onClick={() => setActiveTab('resources')}
        >
          <Cpu className="tab-icon" />
          Resources
        </button>
        <button 
          className={`tab ${activeTab === 'allocation' ? 'active' : ''}`}
          onClick={() => setActiveTab('allocation')}
        >
          <Target className="tab-icon" />
          Allocation
        </button>
        <button 
          className={`tab ${activeTab === 'optimization' ? 'active' : ''}`}
          onClick={() => setActiveTab('optimization')}
        >
          <TrendingUp className="tab-icon" />
          Optimization
        </button>
        <button 
          className={`tab ${activeTab === 'pools' ? 'active' : ''}`}
          onClick={() => setActiveTab('pools')}
        >
          <Layers className="tab-icon" />
          Pools
        </button>
        <button 
          className={`tab ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          <BarChart3 className="tab-icon" />
          Analytics
        </button>
      </div>

      <div className="allocation-content">
        {activeTab === 'resources' && (
          <div className="resources-tab">
            <div className="resources-list">
              <h3>Resources</h3>
              {resources.map((resource) => (
                <div 
                  key={resource.id} 
                  className={`resource-item ${selectedResource === resource.id ? 'selected' : ''}`}
                  onClick={() => setSelectedResource(resource.id)}
                >
                  <div className="resource-icon">
                    {getTypeIcon(resource.type)}
                  </div>
                  <div className="resource-info">
                    <div className="resource-header">
                      <h4 className="resource-name">{resource.name}</h4>
                      <div className="resource-badges">
                        <span className={`status-badge ${getStatusColor(resource.status)}`}>
                          {getStatusIcon(resource.status)}
                          {resource.status}
                        </span>
                        <span className="type-badge">{resource.type}</span>
                        <span className="category-badge">{resource.category}</span>
                      </div>
                    </div>
                    <div className="resource-details">
                      <div className="detail-row">
                        <span className="detail-label">Capacity:</span>
                        <span className="detail-value">{formatCapacity(resource.capacity, resource.type)}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Used:</span>
                        <span className="detail-value">{formatCapacity(resource.used, resource.type)}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Available:</span>
                        <span className="detail-value">{formatCapacity(resource.available, resource.type)}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Utilization:</span>
                        <span className="detail-value">{resource.utilization}%</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Cost:</span>
                        <span className="detail-value">{formatCost(resource.metadata.cost)}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Energy:</span>
                        <span className="detail-value">{formatEnergy(resource.metadata.energy)}</span>
                      </div>
                    </div>
                    <div className="resource-performance">
                      <h5>Performance Metrics:</h5>
                      <div className="performance-grid">
                        <div className="metric">
                          <span className="metric-label">Throughput:</span>
                          <span className="metric-value">{resource.performance.throughput}%</span>
                        </div>
                        <div className="metric">
                          <span className="metric-label">Latency:</span>
                          <span className="metric-value">{resource.performance.latency}ms</span>
                        </div>
                        <div className="metric">
                          <span className="metric-label">Availability:</span>
                          <span className="metric-value">{resource.performance.availability}%</span>
                        </div>
                        <div className="metric">
                          <span className="metric-label">Efficiency:</span>
                          <span className="metric-value">{resource.performance.efficiency}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="resource-allocation">
                      <h5>Current Allocations:</h5>
                      {resource.allocation.map((alloc) => (
                        <div key={alloc.id} className="allocation-item">
                          <div className="allocation-header">
                            <span className="allocation-task">{alloc.taskName}</span>
                            <span className={`allocation-priority ${getPriorityColor(alloc.priority)}`}>
                              {alloc.priority}
                            </span>
                          </div>
                          <div className="allocation-details">
                            <span>Allocated: {formatCapacity(alloc.allocated, resource.type)}</span>
                            <span>Efficiency: {alloc.efficiency}%</span>
                            <span>Cost: {formatCost(alloc.cost)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="resource-tags">
                      {resource.metadata.tags.map((tag, index) => (
                        <span key={index} className="tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="resource-actions">
                    <button className="action-button">
                      <Settings className="w-4 h-4" />
                      Configure
                    </button>
                    <button className="action-button">
                      <TrendingUp className="w-4 h-4" />
                      Optimize
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'allocation' && (
          <div className="allocation-tab">
            <div className="allocation-strategies">
              <h3>Allocation Strategies</h3>
              {strategies.map((strategy) => (
                <div key={strategy.id} className="strategy-item">
                  <div className="strategy-icon">
                    <Target className="w-5 h-5" />
                  </div>
                  <div className="strategy-info">
                    <div className="strategy-header">
                      <h4 className="strategy-name">{strategy.name}</h4>
                      <div className="strategy-badges">
                        <span className="type-badge">{strategy.type}</span>
                        {strategy.isActive && (
                          <span className="active-badge">
                            <CheckCircle className="w-3 h-3" />
                            Active
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="strategy-description">{strategy.description}</p>
                    <div className="strategy-details">
                      <div className="detail-row">
                        <span className="detail-label">Effectiveness:</span>
                        <span className="detail-value">{strategy.effectiveness}%</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Cost:</span>
                        <span className="detail-value">{formatCost(strategy.cost)}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Performance:</span>
                        <span className="detail-value">{strategy.performance}%</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Energy:</span>
                        <span className="detail-value">{strategy.energy}%</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Usage Count:</span>
                        <span className="detail-value">{strategy.usageCount}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Last Used:</span>
                        <span className="detail-value">{strategy.lastUsed.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="strategy-actions">
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

        {activeTab === 'optimization' && (
          <div className="optimization-tab">
            <div className="optimization-list">
              <h3>Resource Optimizations</h3>
              {optimizations.map((optimization) => (
                <div key={optimization.id} className="optimization-item">
                  <div className="optimization-icon">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div className="optimization-info">
                    <div className="optimization-header">
                      <h4 className="optimization-title">Resource Optimization</h4>
                      <div className="optimization-badges">
                        <span className={`impact-badge ${getImpactColor(optimization.impact)}`}>
                          {optimization.impact}
                        </span>
                        <span className="confidence-badge">{optimization.confidence}% confidence</span>
                      </div>
                    </div>
                    <div className="optimization-details">
                      <div className="detail-row">
                        <span className="detail-label">Strategy:</span>
                        <span className="detail-value">{optimization.strategy}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Current Allocation:</span>
                        <span className="detail-value">{optimization.currentAllocation}%</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Suggested Allocation:</span>
                        <span className="detail-value">{optimization.suggestedAllocation}%</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Reason:</span>
                        <span className="detail-value">{optimization.reason}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Estimated Savings:</span>
                        <span className="detail-value">{formatCost(optimization.estimatedSavings)}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Performance Gain:</span>
                        <span className="detail-value">{optimization.performanceGain}%</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Energy Reduction:</span>
                        <span className="detail-value">{optimization.energyReduction}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="optimization-actions">
                    <button className="action-button">
                      <CheckCircle className="w-4 h-4" />
                      Apply
                    </button>
                    <button className="action-button">
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'pools' && (
          <div className="pools-tab">
            <div className="pools-list">
              <h3>Resource Pools</h3>
              {pools.map((pool) => (
                <div key={pool.id} className="pool-item">
                  <div className="pool-icon">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div className="pool-info">
                    <div className="pool-header">
                      <h4 className="pool-name">{pool.name}</h4>
                      <div className="pool-badges">
                        <span className="strategy-badge">{pool.strategy}</span>
                        <span className="utilization-badge">{pool.utilization}% utilized</span>
                      </div>
                    </div>
                    <p className="pool-description">{pool.description}</p>
                    <div className="pool-details">
                      <div className="detail-row">
                        <span className="detail-label">Total Capacity:</span>
                        <span className="detail-value">{pool.totalCapacity}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Used Capacity:</span>
                        <span className="detail-value">{pool.usedCapacity}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Available Capacity:</span>
                        <span className="detail-value">{pool.availableCapacity}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Resources:</span>
                        <span className="detail-value">{pool.resources.length}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Cost:</span>
                        <span className="detail-value">{formatCost(pool.cost)}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Energy:</span>
                        <span className="detail-value">{formatEnergy(pool.energy)}</span>
                      </div>
                    </div>
                    <div className="pool-performance">
                      <h5>Pool Performance:</h5>
                      <div className="performance-grid">
                        <div className="metric">
                          <span className="metric-label">Throughput:</span>
                          <span className="metric-value">{pool.performance.throughput}%</span>
                        </div>
                        <div className="metric">
                          <span className="metric-label">Latency:</span>
                          <span className="metric-value">{pool.performance.latency}ms</span>
                        </div>
                        <div className="metric">
                          <span className="metric-label">Availability:</span>
                          <span className="metric-value">{pool.performance.availability}%</span>
                        </div>
                        <div className="metric">
                          <span className="metric-label">Efficiency:</span>
                          <span className="metric-value">{pool.performance.efficiency}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="pool-actions">
                    <button className="action-button">
                      <Settings className="w-4 h-4" />
                      Configure
                    </button>
                    <button className="action-button">
                      <TrendingUp className="w-4 h-4" />
                      Optimize
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
              <h3>Resource Analytics</h3>
              <div className="analytics-grid">
                <div className="metric-card">
                  <div className="metric-header">
                    <Cpu className="metric-icon" />
                    <span className="metric-label">Total Resources</span>
                  </div>
                  <div className="metric-value">{resources.length}</div>
                  <div className="metric-status">
                    {resources.filter(r => r.status === 'available').length} available
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-header">
                    <Activity className="metric-icon" />
                    <span className="metric-label">Average Utilization</span>
                  </div>
                  <div className="metric-value">
                    {Math.round(resources.reduce((sum, r) => sum + r.utilization, 0) / resources.length)}%
                  </div>
                  <div className="metric-status">Across all resources</div>
                </div>

                <div className="metric-card">
                  <div className="metric-header">
                    <TrendingUp className="metric-icon" />
                    <span className="metric-label">Total Cost</span>
                  </div>
                  <div className="metric-value">
                    {formatCost(resources.reduce((sum, r) => sum + r.metadata.cost, 0))}
                  </div>
                  <div className="metric-status">Per hour</div>
                </div>

                <div className="metric-card">
                  <div className="metric-header">
                    <Battery className="metric-icon" />
                    <span className="metric-label">Total Energy</span>
                  </div>
                  <div className="metric-value">
                    {formatEnergy(resources.reduce((sum, r) => sum + r.metadata.energy, 0))}
                  </div>
                  <div className="metric-status">Per hour</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
