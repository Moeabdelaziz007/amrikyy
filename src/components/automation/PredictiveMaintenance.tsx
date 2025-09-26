import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Wrench, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Activity, 
  Settings, 
  Plus, 
  Eye, 
  Edit, 
  Zap,
  Cpu,
  HardDrive,
  MemoryStick,
  Network,
  Server,
  Database,
  Cloud,
  Shield,
  Target,
  Calendar,
  Timer,
  Gauge,
  Thermometer,
  Battery,
  Power,
  Info,
  RefreshCw,
  XCircle,
  Play
} from 'lucide-react';

interface MaintenanceTask {
  id: string;
  name: string;
  description: string;
  type: 'preventive' | 'predictive' | 'corrective' | 'emergency';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'overdue';
  component: string;
  predictedFailure: Date | null;
  scheduledDate: Date;
  estimatedDuration: number;
  actualDuration: number | null;
  cost: number;
  technician: string;
  notes: string[];
  history: MaintenanceHistory[];
  createdAt: Date;
  updatedAt: Date;
}

interface MaintenanceHistory {
  id: string;
  taskId: string;
  action: string;
  timestamp: Date;
  technician: string;
  notes: string;
  duration: number;
  cost: number;
  status: 'success' | 'failure' | 'partial';
}

interface Component {
  id: string;
  name: string;
  type: 'cpu' | 'memory' | 'storage' | 'network' | 'power' | 'cooling' | 'other';
  status: 'healthy' | 'warning' | 'critical' | 'failed';
  healthScore: number;
  lastMaintenance: Date | null;
  nextMaintenance: Date | null;
  failureProbability: number;
  remainingLife: number;
  metrics: ComponentMetrics;
  alerts: ComponentAlert[];
  location: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  warrantyExpiry: Date | null;
  cost: number;
  createdAt: Date;
  updatedAt: Date;
}

interface ComponentMetrics {
  temperature: number;
  voltage: number;
  current: number;
  power: number;
  utilization: number;
  errorRate: number;
  throughput: number;
  latency: number;
  availability: number;
  lastUpdated: Date;
}

interface ComponentAlert {
  id: string;
  type: 'warning' | 'error' | 'critical';
  message: string;
  timestamp: Date;
  acknowledged: boolean;
  resolved: boolean;
  severity: number;
}

interface MaintenancePrediction {
  id: string;
  componentId: string;
  componentName: string;
  failureType: string;
  probability: number;
  timeToFailure: number;
  confidence: number;
  factors: string[];
  recommendations: string[];
  estimatedCost: number;
  impact: 'low' | 'medium' | 'high' | 'critical';
  createdAt: Date;
}

export const PredictiveMaintenance: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'components' | 'tasks' | 'predictions' | 'analytics'>('dashboard');
  const [loading, setLoading] = useState(true);

  // Mock data
  const [components] = useState<Component[]>([
    {
      id: '1',
      name: 'CPU Cluster Alpha',
      type: 'cpu',
      status: 'warning',
      healthScore: 75,
      lastMaintenance: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      nextMaintenance: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      failureProbability: 25,
      remainingLife: 85,
      metrics: {
        temperature: 75,
        voltage: 12.1,
        current: 8.5,
        power: 102,
        utilization: 85,
        errorRate: 0.5,
        throughput: 95,
        latency: 2,
        availability: 99.5,
        lastUpdated: new Date(Date.now() - 5 * 60 * 1000)
      },
      alerts: [
        {
          id: '1',
          type: 'warning',
          message: 'Temperature approaching threshold',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          acknowledged: false,
          resolved: false,
          severity: 3
        }
      ],
      location: 'Data Center A',
      manufacturer: 'Intel',
      model: 'Xeon E5-2680',
      serialNumber: 'CPU-001-2023',
      warrantyExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      cost: 2500,
      createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 5 * 60 * 1000)
    }
  ]);

  const [tasks] = useState<MaintenanceTask[]>([
    {
      id: '1',
      name: 'CPU Thermal Paste Replacement',
      description: 'Replace thermal paste on CPU Cluster Alpha',
      type: 'predictive',
      priority: 'high',
      status: 'scheduled',
      component: 'CPU Cluster Alpha',
      predictedFailure: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      estimatedDuration: 120,
      actualDuration: null,
      cost: 150,
      technician: 'John Smith',
      notes: ['High temperature readings detected', 'Thermal paste degradation expected'],
      history: [],
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    }
  ]);

  const [predictions] = useState<MaintenancePrediction[]>([
    {
      id: '1',
      componentId: '1',
      componentName: 'CPU Cluster Alpha',
      failureType: 'Thermal degradation',
      probability: 75,
      timeToFailure: 14,
      confidence: 85,
      factors: ['High temperature', 'Aging thermal paste', 'Increased utilization'],
      recommendations: ['Replace thermal paste', 'Check cooling system', 'Monitor temperature'],
      estimatedCost: 150,
      impact: 'high',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
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
      case 'power': return <Power className="w-4 h-4" />;
      case 'cooling': return <Thermometer className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'critical': return 'text-orange-500';
      case 'failed': return 'text-red-500';
      case 'scheduled': return 'text-blue-500';
      case 'in-progress': return 'text-purple-500';
      case 'completed': return 'text-green-500';
      case 'cancelled': return 'text-gray-500';
      case 'overdue': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'critical': return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'failed': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'scheduled': return <Calendar className="w-4 h-4 text-blue-500" />;
      case 'in-progress': return <Activity className="w-4 h-4 text-purple-500" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'cancelled': return <XCircle className="w-4 h-4 text-gray-500" />;
      case 'overdue': return <Clock className="w-4 h-4 text-red-500" />;
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

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    if (score >= 40) return 'text-orange-500';
    return 'text-red-500';
  };

  if (loading) {
    return (
      <div className="predictive-maintenance">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading predictive maintenance...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="predictive-maintenance">
      <div className="maintenance-header">
        <div className="header-content">
          <div className="header-title">
            <Wrench className="header-icon" />
            <h1>Predictive Maintenance</h1>
          </div>
          <div className="header-controls">
            <button className="action-button">
              <Plus className="button-icon" />
              Schedule Task
            </button>
            <button className="action-button">
              <Zap className="button-icon" />
              Run Analysis
            </button>
            <button className="action-button">
              <RefreshCw className="button-icon" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="maintenance-tabs">
        <button 
          className={`tab ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <BarChart3 className="tab-icon" />
          Dashboard
        </button>
        <button 
          className={`tab ${activeTab === 'components' ? 'active' : ''}`}
          onClick={() => setActiveTab('components')}
        >
          <Cpu className="tab-icon" />
          Components
        </button>
        <button 
          className={`tab ${activeTab === 'tasks' ? 'active' : ''}`}
          onClick={() => setActiveTab('tasks')}
        >
          <Target className="tab-icon" />
          Tasks
        </button>
        <button 
          className={`tab ${activeTab === 'predictions' ? 'active' : ''}`}
          onClick={() => setActiveTab('predictions')}
        >
          <TrendingUp className="tab-icon" />
          Predictions
        </button>
        <button 
          className={`tab ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          <BarChart3 className="tab-icon" />
          Analytics
        </button>
      </div>

      <div className="maintenance-content">
        {activeTab === 'dashboard' && (
          <div className="dashboard-tab">
            <div className="dashboard-grid">
              <div className="metric-card">
                <div className="metric-header">
                  <Cpu className="metric-icon" />
                  <span className="metric-label">Total Components</span>
                </div>
                <div className="metric-value">{components.length}</div>
                <div className="metric-status">
                  {components.filter(c => c.status === 'healthy').length} healthy
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-header">
                  <AlertTriangle className="metric-icon" />
                  <span className="metric-label">Critical Alerts</span>
                </div>
                <div className="metric-value">
                  {components.reduce((sum, c) => sum + c.alerts.filter(a => a.type === 'critical').length, 0)}
                </div>
                <div className="metric-status">Require immediate attention</div>
              </div>

              <div className="metric-card">
                <div className="metric-header">
                  <Target className="metric-icon" />
                  <span className="metric-label">Scheduled Tasks</span>
                </div>
                <div className="metric-value">{tasks.length}</div>
                <div className="metric-status">
                  {tasks.filter(t => t.status === 'scheduled').length} pending
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-header">
                  <TrendingUp className="metric-icon" />
                  <span className="metric-label">Predictions</span>
                </div>
                <div className="metric-value">{predictions.length}</div>
                <div className="metric-status">
                  {predictions.filter(p => p.probability > 50).length} high probability
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'components' && (
          <div className="components-tab">
            <div className="components-list">
              <h3>Components</h3>
              {components.map((component) => (
                <div key={component.id} className="component-item">
                  <div className="component-icon">
                    {getTypeIcon(component.type)}
                  </div>
                  <div className="component-info">
                    <div className="component-header">
                      <h4 className="component-name">{component.name}</h4>
                      <div className="component-badges">
                        <span className={`status-badge ${getStatusColor(component.status)}`}>
                          {getStatusIcon(component.status)}
                          {component.status}
                        </span>
                        <span className={`health-badge ${getHealthColor(component.healthScore)}`}>
                          Health: {component.healthScore}%
                        </span>
                        <span className="type-badge">{component.type}</span>
                      </div>
                    </div>
                    <div className="component-details">
                      <div className="detail-row">
                        <span className="detail-label">Failure Probability:</span>
                        <span className="detail-value">{component.failureProbability}%</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Remaining Life:</span>
                        <span className="detail-value">{component.remainingLife}%</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Last Maintenance:</span>
                        <span className="detail-value">
                          {component.lastMaintenance ? component.lastMaintenance.toLocaleDateString() : 'Never'}
                        </span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Next Maintenance:</span>
                        <span className="detail-value">
                          {component.nextMaintenance ? component.nextMaintenance.toLocaleDateString() : 'Not scheduled'}
                        </span>
                      </div>
                    </div>
                    <div className="component-metrics">
                      <h5>Current Metrics:</h5>
                      <div className="metrics-grid">
                        <div className="metric">
                          <span className="metric-label">Temperature:</span>
                          <span className="metric-value">{component.metrics.temperature}°C</span>
                        </div>
                        <div className="metric">
                          <span className="metric-label">Utilization:</span>
                          <span className="metric-value">{component.metrics.utilization}%</span>
                        </div>
                        <div className="metric">
                          <span className="metric-label">Error Rate:</span>
                          <span className="metric-value">{component.metrics.errorRate}%</span>
                        </div>
                        <div className="metric">
                          <span className="metric-label">Availability:</span>
                          <span className="metric-value">{component.metrics.availability}%</span>
                        </div>
                      </div>
                    </div>
                    {component.alerts.length > 0 && (
                      <div className="component-alerts">
                        <h5>Active Alerts:</h5>
                        {component.alerts.map((alert) => (
                          <div key={alert.id} className="alert-item">
                            <div className="alert-header">
                              <span className="alert-message">{alert.message}</span>
                              <span className={`alert-type ${alert.type}`}>{alert.type}</span>
                            </div>
                            <div className="alert-details">
                              <span>Severity: {alert.severity}/5</span>
                              <span>Time: {alert.timestamp.toLocaleString()}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="component-actions">
                    <button className="action-button">
                      <Eye className="w-4 h-4" />
                      View Details
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

        {activeTab === 'tasks' && (
          <div className="tasks-tab">
            <div className="tasks-list">
              <h3>Maintenance Tasks</h3>
              {tasks.map((task) => (
                <div key={task.id} className="task-item">
                  <div className="task-icon">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <div className="task-info">
                    <div className="task-header">
                      <h4 className="task-name">{task.name}</h4>
                      <div className="task-badges">
                        <span className={`status-badge ${getStatusColor(task.status)}`}>
                          {getStatusIcon(task.status)}
                          {task.status}
                        </span>
                        <span className={`priority-badge ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                        <span className="type-badge">{task.type}</span>
                      </div>
                    </div>
                    <p className="task-description">{task.description}</p>
                    <div className="task-details">
                      <div className="detail-row">
                        <span className="detail-label">Component:</span>
                        <span className="detail-value">{task.component}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Scheduled Date:</span>
                        <span className="detail-value">{task.scheduledDate.toLocaleDateString()}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Estimated Duration:</span>
                        <span className="detail-value">{task.estimatedDuration} minutes</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Technician:</span>
                        <span className="detail-value">{task.technician}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Cost:</span>
                        <span className="detail-value">${task.cost}</span>
                      </div>
                      {task.predictedFailure && (
                        <div className="detail-row">
                          <span className="detail-label">Predicted Failure:</span>
                          <span className="detail-value">{task.predictedFailure.toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                    {task.notes.length > 0 && (
                      <div className="task-notes">
                        <h5>Notes:</h5>
                        <ul>
                          {task.notes.map((note, index) => (
                            <li key={index}>{note}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <div className="task-actions">
                    <button className="action-button">
                      <Play className="w-4 h-4" />
                      Start
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

        {activeTab === 'predictions' && (
          <div className="predictions-tab">
            <div className="predictions-list">
              <h3>Failure Predictions</h3>
              {predictions.map((prediction) => (
                <div key={prediction.id} className="prediction-item">
                  <div className="prediction-icon">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div className="prediction-info">
                    <div className="prediction-header">
                      <h4 className="prediction-title">{prediction.failureType}</h4>
                      <div className="prediction-badges">
                        <span className="probability-badge">{prediction.probability}% probability</span>
                        <span className="confidence-badge">{prediction.confidence}% confidence</span>
                        <span className={`impact-badge ${prediction.impact}`}>{prediction.impact}</span>
                      </div>
                    </div>
                    <div className="prediction-details">
                      <div className="detail-row">
                        <span className="detail-label">Component:</span>
                        <span className="detail-value">{prediction.componentName}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Time to Failure:</span>
                        <span className="detail-value">{prediction.timeToFailure} days</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Estimated Cost:</span>
                        <span className="detail-value">${prediction.estimatedCost}</span>
                      </div>
                    </div>
                    <div className="prediction-factors">
                      <h5>Contributing Factors:</h5>
                      <ul>
                        {prediction.factors.map((factor, index) => (
                          <li key={index}>{factor}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="prediction-recommendations">
                      <h5>Recommendations:</h5>
                      <ul>
                        {prediction.recommendations.map((rec, index) => (
                          <li key={index}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="prediction-actions">
                    <button className="action-button">
                      <Target className="w-4 h-4" />
                      Schedule Maintenance
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

        {activeTab === 'analytics' && (
          <div className="analytics-tab">
            <div className="analytics-dashboard">
              <h3>Maintenance Analytics</h3>
              <div className="analytics-grid">
                <div className="metric-card">
                  <div className="metric-header">
                    <Gauge className="metric-icon" />
                    <span className="metric-label">Average Health Score</span>
                  </div>
                  <div className="metric-value">
                    {Math.round(components.reduce((sum, c) => sum + c.healthScore, 0) / components.length)}%
                  </div>
                  <div className="metric-status">Across all components</div>
                </div>

                <div className="metric-card">
                  <div className="metric-header">
                    <Clock className="metric-icon" />
                    <span className="metric-label">Avg Time to Failure</span>
                  </div>
                  <div className="metric-value">
                    {Math.round(predictions.reduce((sum, p) => sum + p.timeToFailure, 0) / predictions.length)} days
                  </div>
                  <div className="metric-status">Predicted average</div>
                </div>

                <div className="metric-card">
                  <div className="metric-header">
                    <Target className="metric-icon" />
                    <span className="metric-label">Maintenance Efficiency</span>
                  </div>
                  <div className="metric-value">87%</div>
                  <div className="metric-status">Tasks completed on time</div>
                </div>

                <div className="metric-card">
                  <div className="metric-header">
                    <TrendingUp className="metric-icon" />
                    <span className="metric-label">Cost Savings</span>
                  </div>
                  <div className="metric-value">$12,500</div>
                  <div className="metric-status">This month</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
