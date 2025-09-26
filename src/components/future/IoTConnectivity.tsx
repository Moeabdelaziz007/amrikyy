import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Wifi, 
  Bluetooth, 
  Radio, 
  Zap, 
  Thermometer, 
  Droplets,
  Sun,
  Moon,
  Wind,
  Gauge,
  Activity,
  Battery,
  Signal,
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
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Home,
  Building,
  Car,
  Smartphone,
  Laptop,
  Monitor,
  Camera,
  Speaker,
  Headphones,
  Mic,
  Lightbulb,
  Fan,
  Tv,
  Refrigerator,
  WashingMachine,
  Coffee,
  Lock as LockIcon,
  Shield,
  Key,
  Database,
  Network,
  Globe,
  MapPin,
  Clock,
  Calendar,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react';

interface IoTDevice {
  id: string;
  name: string;
  type: 'sensor' | 'actuator' | 'camera' | 'speaker' | 'light' | 'thermostat' | 'security' | 'appliance';
  category: 'home' | 'office' | 'industrial' | 'automotive' | 'healthcare';
  status: 'online' | 'offline' | 'error' | 'maintenance';
  connection: 'wifi' | 'bluetooth' | 'zigbee' | 'zwave' | 'lora' | 'cellular';
  location: string;
  room: string;
  ipAddress: string;
  macAddress: string;
  firmware: string;
  battery: number;
  signal: number;
  lastSeen: Date;
  data: DeviceData[];
  properties: Record<string, any>;
  isSecure: boolean;
  isAutomated: boolean;
}

interface DeviceData {
  timestamp: Date;
  type: 'temperature' | 'humidity' | 'pressure' | 'light' | 'motion' | 'sound' | 'power' | 'custom';
  value: number;
  unit: string;
  quality: 'good' | 'warning' | 'error';
}

interface AutomationRule {
  id: string;
  name: string;
  description: string;
  trigger: AutomationTrigger;
  action: AutomationAction;
  conditions: AutomationCondition[];
  isActive: boolean;
  lastExecuted: Date | null;
  executionCount: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

interface AutomationTrigger {
  type: 'schedule' | 'sensor' | 'time' | 'location' | 'manual';
  device?: string;
  condition?: string;
  value?: any;
  time?: string;
  location?: string;
}

interface AutomationAction {
  type: 'device' | 'notification' | 'scene' | 'script';
  target: string;
  command: string;
  parameters: Record<string, any>;
}

interface AutomationCondition {
  device: string;
  property: string;
  operator: 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'contains';
  value: any;
}

interface IoTNetwork {
  id: string;
  name: string;
  type: 'wifi' | 'bluetooth' | 'zigbee' | 'zwave' | 'lora' | 'cellular';
  ssid?: string;
  password?: string;
  channel: number;
  frequency: string;
  range: number;
  devices: number;
  maxDevices: number;
  security: 'open' | 'wpa2' | 'wpa3' | 'wep';
  encryption: string;
  isActive: boolean;
}

export const IoTConnectivity: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'devices' | 'networks' | 'automation' | 'analytics'>('devices');
  const [loading, setLoading] = useState(true);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);

  // Mock data - in production, this would come from IoT APIs
  const [devices] = useState<IoTDevice[]>([
    {
      id: '1',
      name: 'Living Room Thermostat',
      type: 'thermostat',
      category: 'home',
      status: 'online',
      connection: 'wifi',
      location: 'Living Room',
      room: 'living-room',
      ipAddress: '192.168.1.100',
      macAddress: 'AA:BB:CC:DD:EE:FF',
      firmware: 'v2.1.4',
      battery: 85,
      signal: 95,
      lastSeen: new Date(Date.now() - 2 * 60 * 1000),
      data: [
        { timestamp: new Date(), type: 'temperature', value: 22.5, unit: '°C', quality: 'good' },
        { timestamp: new Date(), type: 'humidity', value: 45, unit: '%', quality: 'good' }
      ],
      properties: { targetTemp: 22, mode: 'auto', fanSpeed: 'medium' },
      isSecure: true,
      isAutomated: true
    },
    {
      id: '2',
      name: 'Smart Light Bulb',
      type: 'light',
      category: 'home',
      status: 'online',
      connection: 'zigbee',
      location: 'Bedroom',
      room: 'bedroom',
      ipAddress: 'N/A',
      macAddress: '11:22:33:44:55:66',
      firmware: 'v1.8.2',
      battery: 0,
      signal: 88,
      lastSeen: new Date(Date.now() - 1 * 60 * 1000),
      data: [
        { timestamp: new Date(), type: 'light', value: 80, unit: '%', quality: 'good' }
      ],
      properties: { brightness: 80, color: '#ffffff', isOn: true },
      isSecure: true,
      isAutomated: true
    },
    {
      id: '3',
      name: 'Security Camera',
      type: 'camera',
      category: 'home',
      status: 'online',
      connection: 'wifi',
      location: 'Front Door',
      room: 'entrance',
      ipAddress: '192.168.1.101',
      macAddress: '77:88:99:AA:BB:CC',
      firmware: 'v3.0.1',
      battery: 0,
      signal: 92,
      lastSeen: new Date(Date.now() - 30 * 1000),
      data: [
        { timestamp: new Date(), type: 'motion', value: 1, unit: 'detected', quality: 'good' }
      ],
      properties: { resolution: '1080p', nightVision: true, recording: true },
      isSecure: true,
      isAutomated: false
    }
  ]);

  const [networks] = useState<IoTNetwork[]>([
    {
      id: '1',
      name: 'Home WiFi',
      type: 'wifi',
      ssid: 'AmrikyyAIOS_Home',
      channel: 6,
      frequency: '2.4GHz',
      range: 50,
      devices: 12,
      maxDevices: 50,
      security: 'wpa3',
      encryption: 'AES-256',
      isActive: true
    },
    {
      id: '2',
      name: 'Zigbee Network',
      type: 'zigbee',
      channel: 11,
      frequency: '2.4GHz',
      range: 30,
      devices: 8,
      maxDevices: 100,
      security: 'wpa2',
      encryption: 'AES-128',
      isActive: true
    }
  ]);

  const [automationRules] = useState<AutomationRule[]>([
    {
      id: '1',
      name: 'Auto Temperature Control',
      description: 'Automatically adjust temperature based on time and occupancy',
      trigger: { type: 'schedule', time: '06:00' },
      action: { type: 'device', target: 'thermostat', command: 'setTemperature', parameters: { temp: 22 } },
      conditions: [],
      isActive: true,
      lastExecuted: new Date(Date.now() - 2 * 60 * 60 * 1000),
      executionCount: 45,
      priority: 'medium'
    },
    {
      id: '2',
      name: 'Motion-Activated Lights',
      description: 'Turn on lights when motion is detected',
      trigger: { type: 'sensor', device: 'camera', condition: 'motion' },
      action: { type: 'device', target: 'light', command: 'turnOn', parameters: { brightness: 100 } },
      conditions: [
        { device: 'light', property: 'isOn', operator: 'eq', value: false }
      ],
      isActive: true,
      lastExecuted: new Date(Date.now() - 15 * 60 * 1000),
      executionCount: 23,
      priority: 'high'
    }
  ]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'sensor': return <Activity className="w-4 h-4" />;
      case 'actuator': return <Zap className="w-4 h-4" />;
      case 'camera': return <Camera className="w-4 h-4" />;
      case 'speaker': return <Speaker className="w-4 h-4" />;
      case 'light': return <Lightbulb className="w-4 h-4" />;
      case 'thermostat': return <Thermometer className="w-4 h-4" />;
      case 'security': return <Shield className="w-4 h-4" />;
      case 'appliance': return <Refrigerator className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  const getConnectionIcon = (connection: string) => {
    switch (connection) {
      case 'wifi': return <Wifi className="w-4 h-4" />;
      case 'bluetooth': return <Bluetooth className="w-4 h-4" />;
      case 'zigbee': return <Radio className="w-4 h-4" />;
      case 'zwave': return <Radio className="w-4 h-4" />;
      case 'lora': return <Radio className="w-4 h-4" />;
      case 'cellular': return <Signal className="w-4 h-4" />;
      default: return <Network className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-500';
      case 'offline': return 'text-gray-500';
      case 'error': return 'text-red-500';
      case 'maintenance': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'offline': return <XCircle className="w-4 h-4 text-gray-500" />;
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'maintenance': return <Settings className="w-4 h-4 text-yellow-500" />;
      default: return <Info className="w-4 h-4 text-gray-500" />;
    }
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'good': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'error': return 'text-red-500';
      default: return 'text-gray-500';
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

  const formatSignal = (signal: number) => {
    if (signal >= 80) return 'Excellent';
    if (signal >= 60) return 'Good';
    if (signal >= 40) return 'Fair';
    return 'Poor';
  };

  const addDevice = () => {
    console.log('Adding new IoT device...');
  };

  const createNetwork = () => {
    console.log('Creating new IoT network...');
  };

  const createAutomation = () => {
    console.log('Creating new automation rule...');
  };

  if (loading) {
    return (
      <div className="iot-connectivity">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading IoT connectivity...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="iot-connectivity">
      <div className="iot-header">
        <div className="header-content">
          <div className="header-title">
            <Wifi className="header-icon" />
            <h1>IoT Connectivity</h1>
          </div>
          <div className="header-controls">
            <button className="action-button" onClick={addDevice}>
              <Plus className="button-icon" />
              Add Device
            </button>
            <button className="action-button" onClick={createNetwork}>
              <Network className="button-icon" />
              Create Network
            </button>
            <button className="action-button" onClick={createAutomation}>
              <Zap className="button-icon" />
              Create Automation
            </button>
          </div>
        </div>
      </div>

      <div className="iot-tabs">
        <button 
          className={`tab ${activeTab === 'devices' ? 'active' : ''}`}
          onClick={() => setActiveTab('devices')}
        >
          <Settings className="tab-icon" />
          Devices
        </button>
        <button 
          className={`tab ${activeTab === 'networks' ? 'active' : ''}`}
          onClick={() => setActiveTab('networks')}
        >
          <Network className="tab-icon" />
          Networks
        </button>
        <button 
          className={`tab ${activeTab === 'automation' ? 'active' : ''}`}
          onClick={() => setActiveTab('automation')}
        >
          <Zap className="tab-icon" />
          Automation
        </button>
        <button 
          className={`tab ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          <BarChart3 className="tab-icon" />
          Analytics
        </button>
      </div>

      <div className="iot-content">
        {activeTab === 'devices' && (
          <div className="devices-tab">
            <div className="devices-list">
              <h3>IoT Devices</h3>
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
                        <span className="type-badge">{device.type}</span>
                        {device.isSecure && (
                          <span className="secure-badge">
                            <Shield className="w-3 h-3" />
                            Secure
                          </span>
                        )}
                        {device.isAutomated && (
                          <span className="automated-badge">
                            <Zap className="w-3 h-3" />
                            Automated
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
                        <span className="detail-label">Connection:</span>
                        <span className="detail-value">
                          {getConnectionIcon(device.connection)}
                          {device.connection}
                        </span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Signal:</span>
                        <span className="detail-value">{formatSignal(device.signal)} ({device.signal}%)</span>
                      </div>
                      {device.battery > 0 && (
                        <div className="detail-row">
                          <span className="detail-label">Battery:</span>
                          <span className="detail-value">{device.battery}%</span>
                        </div>
                      )}
                      <div className="detail-row">
                        <span className="detail-label">Last Seen:</span>
                        <span className="detail-value">{device.lastSeen.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="device-data">
                      <h5>Recent Data:</h5>
                      {device.data.map((data, index) => (
                        <div key={index} className="data-item">
                          <span className="data-type">{data.type}:</span>
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
                      Refresh
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'networks' && (
          <div className="networks-tab">
            <div className="networks-list">
              <h3>IoT Networks</h3>
              {networks.map((network) => (
                <div key={network.id} className="network-item">
                  <div className="network-icon">
                    {getConnectionIcon(network.type)}
                  </div>
                  <div className="network-info">
                    <div className="network-header">
                      <h4 className="network-name">{network.name}</h4>
                      <div className="network-badges">
                        <span className="type-badge">{network.type}</span>
                        {network.isActive && (
                          <span className="active-badge">
                            <CheckCircle className="w-3 h-3" />
                            Active
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="network-details">
                      <div className="detail-row">
                        <span className="detail-label">SSID:</span>
                        <span className="detail-value">{network.ssid || 'N/A'}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Channel:</span>
                        <span className="detail-value">{network.channel}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Frequency:</span>
                        <span className="detail-value">{network.frequency}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Range:</span>
                        <span className="detail-value">{network.range}m</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Devices:</span>
                        <span className="detail-value">{network.devices}/{network.maxDevices}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Security:</span>
                        <span className="detail-value">{network.security}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Encryption:</span>
                        <span className="detail-value">{network.encryption}</span>
                      </div>
                    </div>
                  </div>
                  <div className="network-actions">
                    <button className="action-button">
                      <Settings className="w-4 h-4" />
                      Configure
                    </button>
                    <button className="action-button">
                      <RefreshCw className="w-4 h-4" />
                      Scan
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'automation' && (
          <div className="automation-tab">
            <div className="automation-list">
              <h3>Automation Rules</h3>
              {automationRules.map((rule) => (
                <div key={rule.id} className="automation-item">
                  <div className="automation-icon">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div className="automation-info">
                    <div className="automation-header">
                      <h4 className="automation-name">{rule.name}</h4>
                      <div className="automation-badges">
                        <span className={`priority-badge ${getPriorityColor(rule.priority)}`}>
                          {rule.priority}
                        </span>
                        {rule.isActive && (
                          <span className="active-badge">
                            <CheckCircle className="w-3 h-3" />
                            Active
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="automation-description">{rule.description}</p>
                    <div className="automation-details">
                      <div className="detail-row">
                        <span className="detail-label">Trigger:</span>
                        <span className="detail-value">{rule.trigger.type}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Action:</span>
                        <span className="detail-value">{rule.action.type}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Executions:</span>
                        <span className="detail-value">{rule.executionCount}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Last Executed:</span>
                        <span className="detail-value">
                          {rule.lastExecuted ? rule.lastExecuted.toLocaleString() : 'Never'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="automation-actions">
                    <button className="action-button">
                      <Play className="w-4 h-4" />
                      Test
                    </button>
                    <button className="action-button">
                      <Settings className="w-4 h-4" />
                      Edit
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
              <h3>IoT Analytics</h3>
              <div className="analytics-grid">
                <div className="metric-card">
                  <div className="metric-header">
                    <Settings className="metric-icon" />
                    <span className="metric-label">Total Devices</span>
                  </div>
                  <div className="metric-value">{devices.length}</div>
                  <div className="metric-status">
                    {devices.filter(d => d.status === 'online').length} online
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-header">
                    <Network className="metric-icon" />
                    <span className="metric-label">Networks</span>
                  </div>
                  <div className="metric-value">{networks.length}</div>
                  <div className="metric-status">
                    {networks.filter(n => n.isActive).length} active
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-header">
                    <Zap className="metric-icon" />
                    <span className="metric-label">Automations</span>
                  </div>
                  <div className="metric-value">{automationRules.length}</div>
                  <div className="metric-status">
                    {automationRules.filter(r => r.isActive).length} active
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-header">
                    <Activity className="metric-icon" />
                    <span className="metric-label">Data Points</span>
                  </div>
                  <div className="metric-value">
                    {devices.reduce((sum, device) => sum + device.data.length, 0)}
                  </div>
                  <div className="metric-status">Last hour</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
