import React, { useState, useEffect } from 'react';
import {
  Brain,
  Cpu,
  Zap,
  Network,
  Eye,
  Sparkles,
  CircuitBoard,
  Activity,
  Bot,
  CpuIcon,
  Wifi,
  Database,
  Lock,
  Shield,
  TrendingUp,
  Pulse,
  Layers,
  Grid3X3,
  Hexagon
} from 'lucide-react';

export interface AITheme {
  id: string;
  name: string;
  displayName: string;
  description: string;
  icon: React.ComponentType<any>;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    error: string;
    info: string;
    ai: string;
    neural: string;
    quantum: string;
    cyber: string;
  };
  gradients: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    ai: string;
    neural: string;
    quantum: string;
    cyber: string;
  };
  effects: {
    glow: string;
    pulse: string;
    matrix: string;
    hologram: string;
    neural: string;
    quantum: string;
  };
  animations: {
    aiPulse: string;
    dataFlow: string;
    neuralNetwork: string;
    quantumField: string;
    cyberGrid: string;
  };
}

export const aiThemes: AITheme[] = [
  {
    id: 'neural-network',
    name: 'neural-network',
    displayName: 'Neural Network',
    description: 'Advanced neural network with brain-like patterns',
    icon: Brain,
    colors: {
      primary: '#00D4FF',
      secondary: '#7C3AED',
      accent: '#F59E0B',
      background: '#0A0A0F',
      surface: '#1A1A2E',
      text: '#FFFFFF',
      textSecondary: '#A1A1AA',
      border: '#27272A',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
      ai: '#00D4FF',
      neural: '#7C3AED',
      quantum: '#EC4899',
      cyber: '#06B6D4'
    },
    gradients: {
      primary: 'linear-gradient(135deg, #00D4FF 0%, #7C3AED 100%)',
      secondary: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
      background: 'linear-gradient(135deg, #0A0A0F 0%, #1A1A2E 100%)',
      surface: 'linear-gradient(135deg, #1A1A2E 0%, #27272A 100%)',
      ai: 'linear-gradient(135deg, #00D4FF 0%, #7C3AED 50%, #EC4899 100%)',
      neural: 'linear-gradient(135deg, #7C3AED 0%, #00D4FF 100%)',
      quantum: 'linear-gradient(135deg, #EC4899 0%, #06B6D4 100%)',
      cyber: 'linear-gradient(135deg, #06B6D4 0%, #00D4FF 100%)'
    },
    effects: {
      glow: '0 0 30px rgba(0, 212, 255, 0.5), 0 0 60px rgba(124, 58, 237, 0.3)',
      pulse: '0 0 20px rgba(0, 212, 255, 0.4), 0 0 40px rgba(0, 212, 255, 0.2)',
      matrix: '0 0 25px rgba(16, 185, 129, 0.4), 0 0 50px rgba(16, 185, 129, 0.2)',
      hologram: '0 0 35px rgba(236, 72, 153, 0.4), 0 0 70px rgba(236, 72, 153, 0.2)',
      neural: '0 0 40px rgba(124, 58, 237, 0.5), 0 0 80px rgba(124, 58, 237, 0.3)',
      quantum: '0 0 45px rgba(236, 72, 153, 0.6), 0 0 90px rgba(236, 72, 153, 0.4)'
    },
    animations: {
      aiPulse: 'ai-pulse 2s ease-in-out infinite alternate',
      dataFlow: 'data-flow 3s linear infinite',
      neuralNetwork: 'neural-network 4s ease-in-out infinite',
      quantumField: 'quantum-field 5s ease-in-out infinite',
      cyberGrid: 'cyber-grid 6s linear infinite'
    }
  },
  {
    id: 'quantum-computing',
    name: 'quantum-computing',
    displayName: 'Quantum Computing',
    description: 'Quantum field effects with particle animations',
    icon: Cpu,
    colors: {
      primary: '#EC4899',
      secondary: '#06B6D4',
      accent: '#F59E0B',
      background: '#0F0A1A',
      surface: '#1A0F2E',
      text: '#FFFFFF',
      textSecondary: '#A1A1AA',
      border: '#27272A',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
      ai: '#EC4899',
      neural: '#06B6D4',
      quantum: '#8B5CF6',
      cyber: '#00D4FF'
    },
    gradients: {
      primary: 'linear-gradient(135deg, #EC4899 0%, #06B6D4 100%)',
      secondary: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
      background: 'linear-gradient(135deg, #0F0A1A 0%, #1A0F2E 100%)',
      surface: 'linear-gradient(135deg, #1A0F2E 0%, #27272A 100%)',
      ai: 'linear-gradient(135deg, #EC4899 0%, #06B6D4 50%, #8B5CF6 100%)',
      neural: 'linear-gradient(135deg, #06B6D4 0%, #EC4899 100%)',
      quantum: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
      cyber: 'linear-gradient(135deg, #00D4FF 0%, #EC4899 100%)'
    },
    effects: {
      glow: '0 0 30px rgba(236, 72, 153, 0.5), 0 0 60px rgba(6, 182, 212, 0.3)',
      pulse: '0 0 20px rgba(236, 72, 153, 0.4), 0 0 40px rgba(236, 72, 153, 0.2)',
      matrix: '0 0 25px rgba(139, 92, 246, 0.4), 0 0 50px rgba(139, 92, 246, 0.2)',
      hologram: '0 0 35px rgba(6, 182, 212, 0.4), 0 0 70px rgba(6, 182, 212, 0.2)',
      neural: '0 0 40px rgba(236, 72, 153, 0.5), 0 0 80px rgba(236, 72, 153, 0.3)',
      quantum: '0 0 45px rgba(139, 92, 246, 0.6), 0 0 90px rgba(139, 92, 246, 0.4)'
    },
    animations: {
      aiPulse: 'ai-pulse 2s ease-in-out infinite alternate',
      dataFlow: 'data-flow 3s linear infinite',
      neuralNetwork: 'neural-network 4s ease-in-out infinite',
      quantumField: 'quantum-field 5s ease-in-out infinite',
      cyberGrid: 'cyber-grid 6s linear infinite'
    }
  },
  {
    id: 'cyber-matrix',
    name: 'cyber-matrix',
    displayName: 'Cyber Matrix',
    description: 'Cyberpunk matrix with digital rain effects',
    icon: CircuitBoard,
    colors: {
      primary: '#10B981',
      secondary: '#F59E0B',
      accent: '#EF4444',
      background: '#0A1A0F',
      surface: '#1A2E1A',
      text: '#FFFFFF',
      textSecondary: '#A1A1AA',
      border: '#27272A',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
      ai: '#10B981',
      neural: '#F59E0B',
      quantum: '#EF4444',
      cyber: '#06B6D4'
    },
    gradients: {
      primary: 'linear-gradient(135deg, #10B981 0%, #F59E0B 100%)',
      secondary: 'linear-gradient(135deg, #EF4444 0%, #10B981 100%)',
      background: 'linear-gradient(135deg, #0A1A0F 0%, #1A2E1A 100%)',
      surface: 'linear-gradient(135deg, #1A2E1A 0%, #27272A 100%)',
      ai: 'linear-gradient(135deg, #10B981 0%, #F59E0B 50%, #EF4444 100%)',
      neural: 'linear-gradient(135deg, #F59E0B 0%, #10B981 100%)',
      quantum: 'linear-gradient(135deg, #EF4444 0%, #10B981 100%)',
      cyber: 'linear-gradient(135deg, #06B6D4 0%, #10B981 100%)'
    },
    effects: {
      glow: '0 0 30px rgba(16, 185, 129, 0.5), 0 0 60px rgba(245, 158, 11, 0.3)',
      pulse: '0 0 20px rgba(16, 185, 129, 0.4), 0 0 40px rgba(16, 185, 129, 0.2)',
      matrix: '0 0 25px rgba(245, 158, 11, 0.4), 0 0 50px rgba(245, 158, 11, 0.2)',
      hologram: '0 0 35px rgba(239, 68, 68, 0.4), 0 0 70px rgba(239, 68, 68, 0.2)',
      neural: '0 0 40px rgba(16, 185, 129, 0.5), 0 0 80px rgba(16, 185, 129, 0.3)',
      quantum: '0 0 45px rgba(245, 158, 11, 0.6), 0 0 90px rgba(245, 158, 11, 0.4)'
    },
    animations: {
      aiPulse: 'ai-pulse 2s ease-in-out infinite alternate',
      dataFlow: 'data-flow 3s linear infinite',
      neuralNetwork: 'neural-network 4s ease-in-out infinite',
      quantumField: 'quantum-field 5s ease-in-out infinite',
      cyberGrid: 'cyber-grid 6s linear infinite'
    }
  }
];

export const AIPoweredThemeSelector: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState<AITheme>(aiThemes[0]);
  const [isOpen, setIsOpen] = useState(false);
  const [aiStatus, setAiStatus] = useState({
    neuralNetwork: 'active',
    quantumProcessor: 'processing',
    cyberSecurity: 'monitoring',
    dataFlow: 'optimal'
  });

  useEffect(() => {
    // Apply AI theme
    const root = document.documentElement;
    
    // Apply AI-specific colors
    root.style.setProperty('--ai-primary', currentTheme.colors.primary);
    root.style.setProperty('--ai-secondary', currentTheme.colors.secondary);
    root.style.setProperty('--ai-accent', currentTheme.colors.accent);
    root.style.setProperty('--ai-background', currentTheme.colors.background);
    root.style.setProperty('--ai-surface', currentTheme.colors.surface);
    root.style.setProperty('--ai-text', currentTheme.colors.text);
    root.style.setProperty('--ai-text-secondary', currentTheme.colors.textSecondary);
    root.style.setProperty('--ai-border', currentTheme.colors.border);
    root.style.setProperty('--ai-success', currentTheme.colors.success);
    root.style.setProperty('--ai-warning', currentTheme.colors.warning);
    root.style.setProperty('--ai-error', currentTheme.colors.error);
    root.style.setProperty('--ai-info', currentTheme.colors.info);
    root.style.setProperty('--ai-neural', currentTheme.colors.neural);
    root.style.setProperty('--ai-quantum', currentTheme.colors.quantum);
    root.style.setProperty('--ai-cyber', currentTheme.colors.cyber);
    
    // Apply AI gradients
    root.style.setProperty('--ai-gradient-primary', currentTheme.gradients.primary);
    root.style.setProperty('--ai-gradient-secondary', currentTheme.gradients.secondary);
    root.style.setProperty('--ai-gradient-background', currentTheme.gradients.background);
    root.style.setProperty('--ai-gradient-surface', currentTheme.gradients.surface);
    root.style.setProperty('--ai-gradient-ai', currentTheme.gradients.ai);
    root.style.setProperty('--ai-gradient-neural', currentTheme.gradients.neural);
    root.style.setProperty('--ai-gradient-quantum', currentTheme.gradients.quantum);
    root.style.setProperty('--ai-gradient-cyber', currentTheme.gradients.cyber);
    
    // Apply AI effects
    root.style.setProperty('--ai-glow', currentTheme.effects.glow);
    root.style.setProperty('--ai-pulse', currentTheme.effects.pulse);
    root.style.setProperty('--ai-matrix', currentTheme.effects.matrix);
    root.style.setProperty('--ai-hologram', currentTheme.effects.hologram);
    root.style.setProperty('--ai-neural', currentTheme.effects.neural);
    root.style.setProperty('--ai-quantum', currentTheme.effects.quantum);
    
    // Apply AI animations
    root.style.setProperty('--ai-animation-pulse', currentTheme.animations.aiPulse);
    root.style.setProperty('--ai-animation-data-flow', currentTheme.animations.dataFlow);
    root.style.setProperty('--ai-animation-neural-network', currentTheme.animations.neuralNetwork);
    root.style.setProperty('--ai-animation-quantum-field', currentTheme.animations.quantumField);
    root.style.setProperty('--ai-animation-cyber-grid', currentTheme.animations.cyberGrid);
  }, [currentTheme]);

  const handleThemeChange = (theme: AITheme) => {
    setCurrentTheme(theme);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="ai-theme-selector-button"
        title="Select AI Theme"
        aria-label="Select AI Theme"
      >
        <Brain className="h-5 w-5" />
        <span className="hidden sm:block">{currentTheme.displayName}</span>
        <div className="ai-status-indicator">
          <div className="ai-pulse-dot"></div>
        </div>
      </button>

      {isOpen && (
        <div className="ai-theme-modal">
          <div className="ai-modal-header">
            <div className="flex items-center space-x-2">
              <Brain className="h-6 w-6 text-ai-primary" />
              <h3 className="text-lg font-semibold text-ai-text">AI-Powered Themes</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="ai-close-button"
              title="Close theme selector"
              aria-label="Close theme selector"
            >
              ×
            </button>
          </div>

          {/* AI System Status */}
          <div className="ai-status-panel">
            <h4 className="ai-status-title">AI System Status</h4>
            <div className="ai-status-grid">
              <div className="ai-status-item">
                <Network className="h-4 w-4" />
                <span>Neural Network</span>
                <div className={`ai-status-badge ${aiStatus.neuralNetwork}`}>
                  {aiStatus.neuralNetwork}
                </div>
              </div>
              <div className="ai-status-item">
                <Cpu className="h-4 w-4" />
                <span>Quantum Processor</span>
                <div className={`ai-status-badge ${aiStatus.quantumProcessor}`}>
                  {aiStatus.quantumProcessor}
                </div>
              </div>
              <div className="ai-status-item">
                <Shield className="h-4 w-4" />
                <span>Cyber Security</span>
                <div className={`ai-status-badge ${aiStatus.cyberSecurity}`}>
                  {aiStatus.cyberSecurity}
                </div>
              </div>
              <div className="ai-status-item">
                <TrendingUp className="h-4 w-4" />
                <span>Data Flow</span>
                <div className={`ai-status-badge ${aiStatus.dataFlow}`}>
                  {aiStatus.dataFlow}
                </div>
              </div>
            </div>
          </div>

          {/* AI Theme Grid */}
          <div className="ai-theme-grid">
            {aiThemes.map((theme) => {
              const Icon = theme.icon;
              const isSelected = theme.id === currentTheme.id;
              
              return (
                <button
                  key={theme.id}
                  onClick={() => handleThemeChange(theme)}
                  className={`ai-theme-card ${isSelected ? 'selected' : ''}`}
                  title={`Select ${theme.displayName} theme`}
                  aria-label={`Select ${theme.displayName} theme`}
                >
                  <div className="ai-theme-header">
                    <Icon className="ai-theme-icon" />
                    <span className="ai-theme-title">{theme.displayName}</span>
                  </div>
                  <p className="ai-theme-description">{theme.description}</p>
                  
                  {/* AI Color Matrix */}
                  <div className="ai-color-matrix">
                    <div className="ai-color-row">
                      <div className="ai-color-cell" style={{ backgroundColor: theme.colors.ai }}></div>
                      <div className="ai-color-cell" style={{ backgroundColor: theme.colors.neural }}></div>
                      <div className="ai-color-cell" style={{ backgroundColor: theme.colors.quantum }}></div>
                      <div className="ai-color-cell" style={{ backgroundColor: theme.colors.cyber }}></div>
                    </div>
                  </div>
                  
                  {isSelected && (
                    <div className="ai-selected-indicator">
                      <Sparkles className="h-4 w-4" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* AI Features Preview */}
          <div className="ai-features-preview">
            <h4 className="ai-features-title">AI Features</h4>
            <div className="ai-features-list">
              <div className="ai-feature-item">
                <Eye className="h-4 w-4" />
                <span>Computer Vision</span>
              </div>
              <div className="ai-feature-item">
                <Bot className="h-4 w-4" />
                <span>Neural Networks</span>
              </div>
              <div className="ai-feature-item">
                <Database className="h-4 w-4" />
                <span>Machine Learning</span>
              </div>
              <div className="ai-feature-item">
                <Lock className="h-4 w-4" />
                <span>Quantum Encryption</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIPoweredThemeSelector;
