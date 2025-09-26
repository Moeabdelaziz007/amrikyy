import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Settings, 
  Zap, 
  Sparkles,
  Layers,
  Palette,
  Monitor,
  Smartphone,
  Tablet,
  Eye,
  EyeOff,
  Download,
  Upload,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Info,
  Star,
  Heart,
  ThumbsUp,
  Award,
  Target,
  Rocket,
  Flame,
  Snowflake,
  Droplets,
  Wind,
  Sun,
  Moon
} from 'lucide-react';

interface AnimationPreset {
  id: string;
  name: string;
  description: string;
  category: 'entrance' | 'exit' | 'hover' | 'loading' | 'transition' | 'special';
  duration: number;
  easing: string;
  properties: string[];
  preview: string;
  icon: React.ReactNode;
  complexity: 'simple' | 'medium' | 'complex';
}

interface AnimationSettings {
  globalSpeed: number;
  reducedMotion: boolean;
  autoPlay: boolean;
  previewMode: boolean;
  showGrid: boolean;
  showTimeline: boolean;
  enableSound: boolean;
  enableHaptics: boolean;
  customEasing: boolean;
  performanceMode: 'quality' | 'balanced' | 'performance';
}

interface AnimationElement {
  id: string;
  type: 'div' | 'button' | 'card' | 'modal' | 'tooltip';
  preset: string;
  customProperties: Record<string, any>;
  triggers: string[];
  duration: number;
  delay: number;
  iteration: number;
  direction: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
  fillMode: 'none' | 'forwards' | 'backwards' | 'both';
  playState: 'running' | 'paused';
}

export const AdvancedAnimationSystem: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'presets' | 'elements' | 'timeline' | 'settings'>('presets');
  const [loading, setLoading] = useState(true);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [previewElement, setPreviewElement] = useState<HTMLDivElement | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // Mock data - in production, this would come from Firebase
  const [animationPresets] = useState<AnimationPreset[]>([
    {
      id: 'fade-in',
      name: 'Fade In',
      description: 'Smooth fade in animation',
      category: 'entrance',
      duration: 500,
      easing: 'ease-out',
      properties: ['opacity', 'transform'],
      preview: 'fadeIn',
      icon: <Eye className="w-4 h-4" />,
      complexity: 'simple'
    },
    {
      id: 'slide-up',
      name: 'Slide Up',
      description: 'Element slides up from bottom',
      category: 'entrance',
      duration: 600,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      properties: ['transform', 'opacity'],
      preview: 'slideUp',
      icon: <ArrowUp className="w-4 h-4" />,
      complexity: 'simple'
    },
    {
      id: 'bounce-in',
      name: 'Bounce In',
      description: 'Playful bounce entrance',
      category: 'entrance',
      duration: 800,
      easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      properties: ['transform', 'opacity'],
      preview: 'bounceIn',
      icon: <Target className="w-4 h-4" />,
      complexity: 'medium'
    },
    {
      id: 'flip-in',
      name: 'Flip In',
      description: '3D flip entrance effect',
      category: 'entrance',
      duration: 700,
      easing: 'ease-out',
      properties: ['transform', 'opacity', 'perspective'],
      preview: 'flipIn',
      icon: <RotateCcw className="w-4 h-4" />,
      complexity: 'complex'
    },
    {
      id: 'zoom-in',
      name: 'Zoom In',
      description: 'Scale up from center',
      category: 'entrance',
      duration: 400,
      easing: 'ease-out',
      properties: ['transform', 'opacity'],
      preview: 'zoomIn',
      icon: <Zap className="w-4 h-4" />,
      complexity: 'simple'
    },
    {
      id: 'slide-out',
      name: 'Slide Out',
      description: 'Element slides out to the right',
      category: 'exit',
      duration: 500,
      easing: 'ease-in',
      properties: ['transform', 'opacity'],
      preview: 'slideOut',
      icon: <ArrowRight className="w-4 h-4" />,
      complexity: 'simple'
    },
    {
      id: 'fade-out',
      name: 'Fade Out',
      description: 'Smooth fade out animation',
      category: 'exit',
      duration: 400,
      easing: 'ease-in',
      properties: ['opacity'],
      preview: 'fadeOut',
      icon: <EyeOff className="w-4 h-4" />,
      complexity: 'simple'
    },
    {
      id: 'scale-out',
      name: 'Scale Out',
      description: 'Scale down to nothing',
      category: 'exit',
      duration: 300,
      easing: 'ease-in',
      properties: ['transform', 'opacity'],
      preview: 'scaleOut',
      icon: <Minus className="w-4 h-4" />,
      complexity: 'simple'
    },
    {
      id: 'hover-lift',
      name: 'Hover Lift',
      description: 'Lift effect on hover',
      category: 'hover',
      duration: 200,
      easing: 'ease-out',
      properties: ['transform', 'box-shadow'],
      preview: 'hoverLift',
      icon: <ArrowUp className="w-4 h-4" />,
      complexity: 'simple'
    },
    {
      id: 'hover-glow',
      name: 'Hover Glow',
      description: 'Glow effect on hover',
      category: 'hover',
      duration: 300,
      easing: 'ease-out',
      properties: ['box-shadow', 'filter'],
      preview: 'hoverGlow',
      icon: <Sparkles className="w-4 h-4" />,
      complexity: 'medium'
    },
    {
      id: 'pulse',
      name: 'Pulse',
      description: 'Continuous pulse animation',
      category: 'loading',
      duration: 1000,
      easing: 'ease-in-out',
      properties: ['transform', 'opacity'],
      preview: 'pulse',
      icon: <Heart className="w-4 h-4" />,
      complexity: 'simple'
    },
    {
      id: 'spin',
      name: 'Spin',
      description: 'Continuous rotation',
      category: 'loading',
      duration: 1000,
      easing: 'linear',
      properties: ['transform'],
      preview: 'spin',
      icon: <RefreshCw className="w-4 h-4" />,
      complexity: 'simple'
    },
    {
      id: 'wave',
      name: 'Wave',
      description: 'Wave-like motion',
      category: 'loading',
      duration: 1200,
      easing: 'ease-in-out',
      properties: ['transform'],
      preview: 'wave',
      icon: <Droplets className="w-4 h-4" />,
      complexity: 'medium'
    },
    {
      id: 'morph',
      name: 'Morph',
      description: 'Shape morphing animation',
      category: 'special',
      duration: 1000,
      easing: 'ease-in-out',
      properties: ['border-radius', 'transform'],
      preview: 'morph',
      icon: <Layers className="w-4 h-4" />,
      complexity: 'complex'
    },
    {
      id: 'particle',
      name: 'Particle',
      description: 'Particle system effect',
      category: 'special',
      duration: 2000,
      easing: 'ease-out',
      properties: ['transform', 'opacity', 'filter'],
      preview: 'particle',
      icon: <Sparkles className="w-4 h-4" />,
      complexity: 'complex'
    }
  ]);

  const [animationElements] = useState<AnimationElement[]>([
    {
      id: '1',
      type: 'button',
      preset: 'hover-lift',
      customProperties: { scale: 1.05, shadow: '0 10px 25px rgba(0,0,0,0.2)' },
      triggers: ['hover', 'focus'],
      duration: 200,
      delay: 0,
      iteration: 1,
      direction: 'normal',
      fillMode: 'both',
      playState: 'running'
    },
    {
      id: '2',
      type: 'card',
      preset: 'fade-in',
      customProperties: { opacity: 1, translateY: 0 },
      triggers: ['load', 'scroll'],
      duration: 500,
      delay: 100,
      iteration: 1,
      direction: 'normal',
      fillMode: 'forwards',
      playState: 'running'
    },
    {
      id: '3',
      type: 'modal',
      preset: 'zoom-in',
      customProperties: { scale: 1, opacity: 1 },
      triggers: ['open'],
      duration: 300,
      delay: 0,
      iteration: 1,
      direction: 'normal',
      fillMode: 'forwards',
      playState: 'running'
    }
  ]);

  const [animationSettings, setAnimationSettings] = useState<AnimationSettings>({
    globalSpeed: 1.0,
    reducedMotion: false,
    autoPlay: true,
    previewMode: true,
    showGrid: false,
    showTimeline: true,
    enableSound: false,
    enableHaptics: false,
    customEasing: false,
    performanceMode: 'balanced'
  });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (previewRef.current) {
      setPreviewElement(previewRef.current);
    }
  }, []);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'entrance': return 'text-green-500';
      case 'exit': return 'text-red-500';
      case 'hover': return 'text-blue-500';
      case 'loading': return 'text-yellow-500';
      case 'transition': return 'text-purple-500';
      case 'special': return 'text-pink-500';
      default: return 'text-gray-500';
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'simple': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'complex': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getComplexityIcon = (complexity: string) => {
    switch (complexity) {
      case 'simple': return <CheckCircle className="w-3 h-3" />;
      case 'medium': return <AlertTriangle className="w-3 h-3" />;
      case 'complex': return <Info className="w-3 h-3" />;
      default: return <Info className="w-3 h-3" />;
    }
  };

  const playAnimation = (presetId: string) => {
    if (previewElement) {
      const preset = animationPresets.find(p => p.id === presetId);
      if (preset) {
        previewElement.style.animation = 'none';
        previewElement.offsetHeight; // Trigger reflow
        previewElement.style.animation = `${preset.preview} ${preset.duration}ms ${preset.easing}`;
      }
    }
  };

  const stopAnimation = () => {
    if (previewElement) {
      previewElement.style.animation = 'none';
    }
    setIsPlaying(false);
  };

  const resetAnimation = () => {
    if (previewElement) {
      previewElement.style.animation = 'none';
      previewElement.style.transform = 'none';
      previewElement.style.opacity = '1';
    }
  };

  const handleSettingChange = (key: keyof AnimationSettings, value: any) => {
    setAnimationSettings(prev => ({ ...prev, [key]: value }));
  };

  const exportAnimations = () => {
    // In production, this would export animation configurations
    console.log('Exporting animations...');
  };

  const importAnimations = () => {
    // In production, this would import animation configurations
    console.log('Importing animations...');
  };

  if (loading) {
    return (
      <div className="advanced-animation-system">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading animation system...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="advanced-animation-system">
      <div className="animation-header">
        <div className="header-content">
          <div className="header-title">
            <Sparkles className="header-icon" />
            <h1>Advanced Animation System</h1>
          </div>
          <div className="header-controls">
            <button 
              className="action-button"
              onClick={isPlaying ? stopAnimation : () => playAnimation(selectedPreset || 'fade-in')}
            >
              {isPlaying ? <Pause className="button-icon" /> : <Play className="button-icon" />}
              {isPlaying ? 'Stop' : 'Play'}
            </button>
            <button className="action-button" onClick={resetAnimation}>
              <RotateCcw className="button-icon" />
              Reset
            </button>
            <button className="action-button" onClick={exportAnimations}>
              <Download className="button-icon" />
              Export
            </button>
            <button className="action-button" onClick={importAnimations}>
              <Upload className="button-icon" />
              Import
            </button>
          </div>
        </div>
      </div>

      <div className="animation-tabs">
        <button 
          className={`tab ${activeTab === 'presets' ? 'active' : ''}`}
          onClick={() => setActiveTab('presets')}
        >
          <Palette className="tab-icon" />
          Presets
        </button>
        <button 
          className={`tab ${activeTab === 'elements' ? 'active' : ''}`}
          onClick={() => setActiveTab('elements')}
        >
          <Layers className="tab-icon" />
          Elements
        </button>
        <button 
          className={`tab ${activeTab === 'timeline' ? 'active' : ''}`}
          onClick={() => setActiveTab('timeline')}
        >
          <Monitor className="tab-icon" />
          Timeline
        </button>
        <button 
          className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <Settings className="tab-icon" />
          Settings
        </button>
      </div>

      <div className="animation-content">
        {activeTab === 'presets' && (
          <div className="presets-tab">
            <div className="presets-grid">
              {animationPresets.map((preset) => (
                <div 
                  key={preset.id} 
                  className={`preset-card ${selectedPreset === preset.id ? 'selected' : ''}`}
                  onClick={() => setSelectedPreset(preset.id)}
                >
                  <div className="preset-header">
                    <div className="preset-icon">
                      {preset.icon}
                    </div>
                    <div className="preset-badges">
                      <span className={`category-badge ${getCategoryColor(preset.category)}`}>
                        {preset.category}
                      </span>
                      <span className={`complexity-badge ${getComplexityColor(preset.complexity)}`}>
                        {getComplexityIcon(preset.complexity)}
                        {preset.complexity}
                      </span>
                    </div>
                  </div>
                  <div className="preset-info">
                    <h4 className="preset-name">{preset.name}</h4>
                    <p className="preset-description">{preset.description}</p>
                    <div className="preset-details">
                      <span>Duration: {preset.duration}ms</span>
                      <span>Easing: {preset.easing}</span>
                      <span>Properties: {preset.properties.join(', ')}</span>
                    </div>
                  </div>
                  <div className="preset-actions">
                    <button 
                      className="play-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        playAnimation(preset.id);
                        setIsPlaying(true);
                      }}
                    >
                      <Play className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'elements' && (
          <div className="elements-tab">
            <div className="elements-list">
              {animationElements.map((element) => (
                <div key={element.id} className="element-item">
                  <div className="element-icon">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div className="element-info">
                    <div className="element-header">
                      <h4 className="element-type">{element.type}</h4>
                      <span className="preset-badge">{element.preset}</span>
                    </div>
                    <div className="element-details">
                      <span>Triggers: {element.triggers.join(', ')}</span>
                      <span>Duration: {element.duration}ms</span>
                      <span>Delay: {element.delay}ms</span>
                      <span>State: {element.playState}</span>
                    </div>
                  </div>
                  <div className="element-actions">
                    <button className="edit-button">
                      <Settings className="w-4 h-4" />
                      Edit
                    </button>
                    <button className="play-button">
                      <Play className="w-4 h-4" />
                      Test
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="timeline-tab">
            <div className="timeline-container">
              <div className="timeline-header">
                <h3>Animation Timeline</h3>
                <div className="timeline-controls">
                  <button className="control-button">
                    <Play className="w-4 h-4" />
                  </button>
                  <button className="control-button">
                    <Pause className="w-4 h-4" />
                  </button>
                  <button className="control-button">
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="timeline-track">
                <div className="timeline-ruler">
                  <div className="ruler-markers">
                    {Array.from({ length: 10 }, (_, i) => (
                      <div key={i} className="ruler-marker">
                        <span className="marker-label">{i * 100}ms</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="timeline-elements">
                  {animationElements.map((element, index) => (
                    <div 
                      key={element.id} 
                      className="timeline-element"
                      style={{
                        left: `${element.delay}px`,
                        width: `${element.duration}px`,
                        top: `${index * 40}px`
                      }}
                    >
                      <div className="element-bar">
                        <span className="element-label">{element.type}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="settings-tab">
            <div className="animation-settings">
              <h3>Animation Settings</h3>
              <div className="settings-grid">
                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Global Speed</h4>
                    <p>Adjust the speed of all animations</p>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="3.0"
                    step="0.1"
                    value={animationSettings.globalSpeed}
                    onChange={(e) => handleSettingChange('globalSpeed', parseFloat(e.target.value))}
                    className="speed-slider"
                  />
                  <span className="speed-value">{animationSettings.globalSpeed}x</span>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Reduced Motion</h4>
                    <p>Respect user's motion preferences</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={animationSettings.reducedMotion}
                      onChange={(e) => handleSettingChange('reducedMotion', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Auto Play</h4>
                    <p>Automatically play animations on load</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={animationSettings.autoPlay}
                      onChange={(e) => handleSettingChange('autoPlay', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Preview Mode</h4>
                    <p>Show animation previews</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={animationSettings.previewMode}
                      onChange={(e) => handleSettingChange('previewMode', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Show Grid</h4>
                    <p>Display alignment grid</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={animationSettings.showGrid}
                      onChange={(e) => handleSettingChange('showGrid', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Show Timeline</h4>
                    <p>Display animation timeline</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={animationSettings.showTimeline}
                      onChange={(e) => handleSettingChange('showTimeline', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Enable Sound</h4>
                    <p>Add sound effects to animations</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={animationSettings.enableSound}
                      onChange={(e) => handleSettingChange('enableSound', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Enable Haptics</h4>
                    <p>Add haptic feedback to animations</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={animationSettings.enableHaptics}
                      onChange={(e) => handleSettingChange('enableHaptics', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Custom Easing</h4>
                    <p>Allow custom easing functions</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={animationSettings.customEasing}
                      onChange={(e) => handleSettingChange('customEasing', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Performance Mode</h4>
                    <p>Optimize animations for performance</p>
                  </div>
                  <select 
                    value={animationSettings.performanceMode}
                    onChange={(e) => handleSettingChange('performanceMode', e.target.value)}
                    className="performance-select"
                  >
                    <option value="quality">Quality</option>
                    <option value="balanced">Balanced</option>
                    <option value="performance">Performance</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Preview Area */}
      <div className="animation-preview">
        <div className="preview-header">
          <h3>Animation Preview</h3>
          <div className="preview-controls">
            <button className="control-button">
              <Monitor className="w-4 h-4" />
            </button>
            <button className="control-button">
              <Tablet className="w-4 h-4" />
            </button>
            <button className="control-button">
              <Smartphone className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="preview-area">
          <div 
            ref={previewRef}
            className="preview-element"
          >
            <div className="preview-content">
              <Sparkles className="w-8 h-8" />
              <span>Preview Element</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
