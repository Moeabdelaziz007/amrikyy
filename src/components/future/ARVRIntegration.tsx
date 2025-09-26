import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Eye, 
  EyeOff, 
  Camera, 
  Video, 
  Volume2, 
  VolumeX,
  Settings,
  Play,
  Pause,
  RotateCcw,
  Maximize,
  Minimize,
  Move,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Layers,
  Grid,
  Target,
  Navigation,
  Compass,
  MapPin,
  Globe,
  Star,
  Sparkles,
  Zap,
  Shield,
  Wifi,
  Bluetooth,
  Monitor,
  Smartphone,
  Headphones,
  Mic,
  MicOff,
  Download,
  Upload,
  Share,
  Save,
  Trash2,
  Plus,
  Minus,
  Check,
  X,
  AlertTriangle,
  Info,
  RefreshCw
} from 'lucide-react';

interface ARScene {
  id: string;
  name: string;
  description: string;
  type: 'ar' | 'vr' | 'mixed';
  environment: string;
  objects: ARObject[];
  lighting: LightingSettings;
  audio: AudioSettings;
  interactions: Interaction[];
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
  creator: string;
  tags: string[];
}

interface ARObject {
  id: string;
  name: string;
  type: 'model' | 'image' | 'video' | 'text' | 'light' | 'sound';
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  scale: { x: number; y: number; z: number };
  properties: Record<string, any>;
  visible: boolean;
  interactive: boolean;
}

interface LightingSettings {
  ambient: number;
  directional: number;
  pointLights: PointLight[];
  shadows: boolean;
  reflections: boolean;
}

interface PointLight {
  id: string;
  position: { x: number; y: number; z: number };
  color: string;
  intensity: number;
  range: number;
}

interface AudioSettings {
  enabled: boolean;
  volume: number;
  spatial: boolean;
  reverb: boolean;
  sources: AudioSource[];
}

interface AudioSource {
  id: string;
  name: string;
  position: { x: number; y: number; z: number };
  volume: number;
  loop: boolean;
  file: string;
}

interface Interaction {
  id: string;
  trigger: 'touch' | 'gaze' | 'voice' | 'gesture' | 'proximity';
  action: 'move' | 'rotate' | 'scale' | 'play' | 'pause' | 'show' | 'hide' | 'custom';
  target: string;
  parameters: Record<string, any>;
}

interface VRDevice {
  id: string;
  name: string;
  type: 'headset' | 'controller' | 'tracker' | 'haptic';
  status: 'connected' | 'disconnected' | 'error';
  battery: number;
  firmware: string;
  capabilities: string[];
}

export const ARVRIntegration: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'scenes' | 'objects' | 'devices' | 'settings'>('scenes');
  const [loading, setLoading] = useState(true);
  const [isARActive, setIsARActive] = useState(false);
  const [isVRActive, setIsVRActive] = useState(false);
  const [selectedScene, setSelectedScene] = useState<string | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Mock data - in production, this would come from AR/VR APIs
  const [arScenes] = useState<ARScene[]>([
    {
      id: '1',
      name: 'Virtual Office',
      description: 'Immersive virtual office environment',
      type: 'vr',
      environment: 'modern-office',
      objects: [],
      lighting: {
        ambient: 0.4,
        directional: 0.8,
        pointLights: [],
        shadows: true,
        reflections: true
      },
      audio: {
        enabled: true,
        volume: 0.7,
        spatial: true,
        reverb: false,
        sources: []
      },
      interactions: [],
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      isPublic: true,
      creator: 'user@example.com',
      tags: ['office', 'productivity', 'vr']
    },
    {
      id: '2',
      name: 'AR Shopping',
      description: 'Augmented reality shopping experience',
      type: 'ar',
      environment: 'retail-store',
      objects: [],
      lighting: {
        ambient: 0.6,
        directional: 0.9,
        pointLights: [],
        shadows: false,
        reflections: false
      },
      audio: {
        enabled: true,
        volume: 0.5,
        spatial: false,
        reverb: false,
        sources: []
      },
      interactions: [],
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
      isPublic: true,
      creator: 'user@example.com',
      tags: ['shopping', 'retail', 'ar']
    },
    {
      id: '3',
      name: 'Mixed Reality Lab',
      description: 'Mixed reality laboratory environment',
      type: 'mixed',
      environment: 'laboratory',
      objects: [],
      lighting: {
        ambient: 0.3,
        directional: 0.7,
        pointLights: [],
        shadows: true,
        reflections: true
      },
      audio: {
        enabled: true,
        volume: 0.6,
        spatial: true,
        reverb: true,
        sources: []
      },
      interactions: [],
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isPublic: false,
      creator: 'user@example.com',
      tags: ['lab', 'research', 'mixed-reality']
    }
  ]);

  const [vrDevices] = useState<VRDevice[]>([
    {
      id: '1',
      name: 'Meta Quest 3',
      type: 'headset',
      status: 'connected',
      battery: 85,
      firmware: 'v57.0.0.123.456',
      capabilities: ['hand-tracking', 'eye-tracking', 'passthrough', 'spatial-audio']
    },
    {
      id: '2',
      name: 'Quest Touch Pro Controllers',
      type: 'controller',
      status: 'connected',
      battery: 92,
      firmware: 'v2.1.4',
      capabilities: ['haptic-feedback', 'finger-tracking', 'pressure-sensing']
    },
    {
      id: '3',
      name: 'HTC Vive Tracker',
      type: 'tracker',
      status: 'disconnected',
      battery: 0,
      firmware: 'v1.0.8',
      capabilities: ['6dof-tracking', 'sub-millimeter-precision']
    }
  ]);

  const [arObjects] = useState<ARObject[]>([
    {
      id: '1',
      name: '3D Model - Chair',
      type: 'model',
      position: { x: 0, y: 0, z: -2 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
      properties: { model: 'chair.glb', material: 'wood' },
      visible: true,
      interactive: true
    },
    {
      id: '2',
      name: 'Info Panel',
      type: 'text',
      position: { x: 1, y: 1.5, z: -1 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
      properties: { text: 'Welcome to AR Space', fontSize: 24, color: '#ffffff' },
      visible: true,
      interactive: false
    },
    {
      id: '3',
      name: 'Ambient Light',
      type: 'light',
      position: { x: 0, y: 3, z: 0 },
      rotation: { x: -90, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
      properties: { intensity: 0.8, color: '#ffffff', type: 'directional' },
      visible: false,
      interactive: false
    }
  ]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isARActive) {
      startCamera();
    } else {
      stopCamera();
    }
  }, [isARActive]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'ar': return <Eye className="w-4 h-4" />;
      case 'vr': return <Monitor className="w-4 h-4" />;
      case 'mixed': return <Layers className="w-4 h-4" />;
      default: return <Eye className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'ar': return 'text-blue-500';
      case 'vr': return 'text-purple-500';
      case 'mixed': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'headset': return <Monitor className="w-4 h-4" />;
      case 'controller': return <Target className="w-4 h-4" />;
      case 'tracker': return <Navigation className="w-4 h-4" />;
      case 'haptic': return <Zap className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-500';
      case 'disconnected': return 'text-gray-500';
      case 'error': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getObjectIcon = (type: string) => {
    switch (type) {
      case 'model': return <Layers className="w-4 h-4" />;
      case 'image': return <Camera className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'text': return <Target className="w-4 h-4" />;
      case 'light': return <Sparkles className="w-4 h-4" />;
      case 'sound': return <Volume2 className="w-4 h-4" />;
      default: return <Layers className="w-4 h-4" />;
    }
  };

  const startAR = () => {
    setIsARActive(true);
    setIsVRActive(false);
  };

  const startVR = () => {
    setIsVRActive(true);
    setIsARActive(false);
  };

  const stopARVR = () => {
    setIsARActive(false);
    setIsVRActive(false);
  };

  const createScene = () => {
    // In production, this would create a new AR/VR scene
    console.log('Creating new AR/VR scene...');
  };

  const exportScene = (sceneId: string) => {
    // In production, this would export the scene
    console.log('Exporting scene:', sceneId);
  };

  const shareScene = (sceneId: string) => {
    // In production, this would share the scene
    console.log('Sharing scene:', sceneId);
  };

  if (loading) {
    return (
      <div className="ar-vr-integration">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading AR/VR integration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ar-vr-integration">
      <div className="arvr-header">
        <div className="header-content">
          <div className="header-title">
            <Eye className="header-icon" />
            <h1>AR/VR Integration</h1>
          </div>
          <div className="header-controls">
            <button 
              className={`action-button ${isARActive ? 'active' : ''}`}
              onClick={startAR}
            >
              <Eye className="button-icon" />
              Start AR
            </button>
            <button 
              className={`action-button ${isVRActive ? 'active' : ''}`}
              onClick={startVR}
            >
              <Monitor className="button-icon" />
              Start VR
            </button>
            <button 
              className="action-button danger"
              onClick={stopARVR}
              disabled={!isARActive && !isVRActive}
            >
              <X className="button-icon" />
              Stop
            </button>
          </div>
        </div>
      </div>

      <div className="arvr-tabs">
        <button 
          className={`tab ${activeTab === 'scenes' ? 'active' : ''}`}
          onClick={() => setActiveTab('scenes')}
        >
          <Layers className="tab-icon" />
          Scenes
        </button>
        <button 
          className={`tab ${activeTab === 'objects' ? 'active' : ''}`}
          onClick={() => setActiveTab('objects')}
        >
          <Target className="tab-icon" />
          Objects
        </button>
        <button 
          className={`tab ${activeTab === 'devices' ? 'active' : ''}`}
          onClick={() => setActiveTab('devices')}
        >
          <Settings className="tab-icon" />
          Devices
        </button>
        <button 
          className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <Settings className="tab-icon" />
          Settings
        </button>
      </div>

      <div className="arvr-content">
        {activeTab === 'scenes' && (
          <div className="scenes-tab">
            <div className="scenes-header">
              <h3>AR/VR Scenes</h3>
              <button className="action-button" onClick={createScene}>
                <Plus className="button-icon" />
                Create Scene
              </button>
            </div>

            <div className="scenes-grid">
              {arScenes.map((scene) => (
                <div 
                  key={scene.id} 
                  className={`scene-card ${selectedScene === scene.id ? 'selected' : ''}`}
                  onClick={() => setSelectedScene(scene.id)}
                >
                  <div className="scene-header">
                    <div className="scene-icon">
                      {getTypeIcon(scene.type)}
                    </div>
                    <div className="scene-badges">
                      <span className={`type-badge ${getTypeColor(scene.type)}`}>
                        {scene.type.toUpperCase()}
                      </span>
                      {scene.isPublic && (
                        <span className="public-badge">
                          <Globe className="w-3 h-3" />
                          Public
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="scene-info">
                    <h4 className="scene-name">{scene.name}</h4>
                    <p className="scene-description">{scene.description}</p>
                    <div className="scene-details">
                      <span>Environment: {scene.environment}</span>
                      <span>Objects: {scene.objects.length}</span>
                      <span>Updated: {scene.updatedAt.toLocaleDateString()}</span>
                    </div>
                    <div className="scene-tags">
                      {scene.tags.map((tag, index) => (
                        <span key={index} className="tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="scene-actions">
                    <button className="play-button" title="Play Scene">
                      <Play className="w-4 h-4" />
                    </button>
                    <button 
                      className="export-button"
                      title="Export Scene"
                      onClick={(e) => {
                        e.stopPropagation();
                        exportScene(scene.id);
                      }}
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button 
                      className="share-button"
                      title="Share Scene"
                      onClick={(e) => {
                        e.stopPropagation();
                        shareScene(scene.id);
                      }}
                    >
                      <Share className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'objects' && (
          <div className="objects-tab">
            <div className="objects-header">
              <h3>AR Objects</h3>
              <button className="action-button">
                <Plus className="button-icon" />
                Add Object
              </button>
            </div>

            <div className="objects-list">
              {arObjects.map((object) => (
                <div key={object.id} className="object-item">
                  <div className="object-icon">
                    {getObjectIcon(object.type)}
                  </div>
                  <div className="object-info">
                    <div className="object-header">
                      <h4 className="object-name">{object.name}</h4>
                      <div className="object-badges">
                        <span className="type-badge">{object.type}</span>
                        {object.visible && (
                          <span className="visible-badge">
                            <Eye className="w-3 h-3" />
                            Visible
                          </span>
                        )}
                        {object.interactive && (
                          <span className="interactive-badge">
                            <Target className="w-3 h-3" />
                            Interactive
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="object-details">
                      <span>Position: ({object.position.x}, {object.position.y}, {object.position.z})</span>
                      <span>Rotation: ({object.rotation.x}°, {object.rotation.y}°, {object.rotation.z}°)</span>
                      <span>Scale: ({object.scale.x}, {object.scale.y}, {object.scale.z})</span>
                    </div>
                  </div>
                  <div className="object-actions">
                    <button className="edit-button">
                      <Settings className="w-4 h-4" />
                      Edit
                    </button>
                    <button className="delete-button" title="Delete Object">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'devices' && (
          <div className="devices-tab">
            <div className="devices-header">
              <h3>VR Devices</h3>
              <button className="action-button">
                <RefreshCw className="button-icon" />
                Refresh
              </button>
            </div>

            <div className="devices-list">
              {vrDevices.map((device) => (
                <div key={device.id} className="device-item">
                  <div className="device-icon">
                    {getDeviceIcon(device.type)}
                  </div>
                  <div className="device-info">
                    <div className="device-header">
                      <h4 className="device-name">{device.name}</h4>
                      <div className="device-badges">
                        <span className={`status-badge ${getStatusColor(device.status)}`}>
                          {device.status}
                        </span>
                        <span className="type-badge">{device.type}</span>
                      </div>
                    </div>
                    <div className="device-details">
                      <span>Battery: {device.battery}%</span>
                      <span>Firmware: {device.firmware}</span>
                      <span>Capabilities: {device.capabilities.join(', ')}</span>
                    </div>
                  </div>
                  <div className="device-actions">
                    <button className="settings-button">
                      <Settings className="w-4 h-4" />
                      Settings
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="settings-tab">
            <div className="arvr-settings">
              <h3>AR/VR Settings</h3>
              <div className="settings-grid">
                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Camera Access</h4>
                    <p>Allow camera access for AR features</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked title="Enable camera access for AR features" />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Microphone Access</h4>
                    <p>Allow microphone access for voice commands</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked title="Enable microphone access for voice commands" />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Spatial Audio</h4>
                    <p>Enable 3D spatial audio in VR</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked title="Enable 3D spatial audio in VR" />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Hand Tracking</h4>
                    <p>Enable hand tracking for natural interactions</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked title="Enable hand tracking for natural interactions" />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Eye Tracking</h4>
                    <p>Enable eye tracking for foveated rendering</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" title="Enable eye tracking for foveated rendering" />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Haptic Feedback</h4>
                    <p>Enable haptic feedback for controllers</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked title="Enable haptic feedback for controllers" />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* AR Camera View */}
      {isARActive && (
        <div className="ar-camera-view">
          <div className="camera-header">
            <h3>AR Camera View</h3>
            <div className="camera-controls">
            <button className="control-button" title="Camera Controls">
              <Camera className="w-4 h-4" />
            </button>
            <button className="control-button" title="Audio Controls">
              <Volume2 className="w-4 h-4" />
            </button>
            <button className="control-button" title="Settings">
              <Settings className="w-4 h-4" />
            </button>
            </div>
          </div>
          <div className="camera-container">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="camera-feed"
            />
            <canvas
              ref={canvasRef}
              className="ar-overlay"
            />
          </div>
        </div>
      )}

      {/* VR Environment */}
      {isVRActive && (
        <div className="vr-environment">
          <div className="vr-header">
            <h3>VR Environment</h3>
            <div className="vr-controls">
            <button className="control-button" title="Move Controls">
              <Move className="w-4 h-4" />
            </button>
            <button className="control-button" title="Rotation Controls">
              <RotateCw className="w-4 h-4" />
            </button>
            <button className="control-button" title="Zoom Controls">
              <ZoomIn className="w-4 h-4" />
            </button>
            </div>
          </div>
          <div className="vr-viewport">
            <div className="vr-scene">
              {/* VR scene content would be rendered here */}
              <div className="vr-placeholder">
                <Monitor className="w-16 h-16" />
                <p>VR Environment Loading...</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
