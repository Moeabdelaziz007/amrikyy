import React, { useState, useEffect } from 'react';
import { useUserSettings } from '../../contexts/UserSettingsContext';

interface Theme {
  id: string;
  name: string;
  description: string;
  category: 'modern' | 'classic' | 'futuristic' | 'minimal' | 'creative';
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
  };
  effects: {
    blur: number;
    glow: boolean;
    animation: 'smooth' | 'bounce' | 'float' | 'none';
    particles: boolean;
  };
  preview: string;
}

export const AdvancedThemeSelector: React.FC = () => {
  const { settings, updateSetting } = useUserSettings();
  const [selectedTheme, setSelectedTheme] = useState<string>(settings.theme || 'dark');
  const [previewMode, setPreviewMode] = useState(false);
  const [customTheme, setCustomTheme] = useState<Partial<Theme>>({});

  const themes: Theme[] = [
    {
      id: 'quantum-glass',
      name: 'Quantum Glass',
      description: 'Ultra-modern glassmorphism with quantum effects',
      category: 'futuristic',
      colors: {
        primary: '#00FFFF',
        secondary: '#FF00FF',
        accent: '#FFFF00',
        background: 'linear-gradient(135deg, #0a0a0a, #1a1a2e, #16213e)',
        surface: 'rgba(0, 255, 255, 0.1)',
        text: '#FFFFFF'
      },
      effects: {
        blur: 25,
        glow: true,
        animation: 'float',
        particles: true
      },
      preview: '🌌'
    },
    {
      id: 'neural-network',
      name: 'Neural Network',
      description: 'AI-inspired interface with neural patterns',
      category: 'futuristic',
      colors: {
        primary: '#00FF88',
        secondary: '#FF0080',
        accent: '#8000FF',
        background: 'radial-gradient(circle at 20% 20%, rgba(0, 255, 136, 0.3) 0%, transparent 50%)',
        surface: 'rgba(0, 255, 136, 0.15)',
        text: '#FFFFFF'
      },
      effects: {
        blur: 20,
        glow: true,
        animation: 'smooth',
        particles: true
      },
      preview: '🧠'
    },
    {
      id: 'cyberpunk-neon',
      name: 'Cyberpunk Neon',
      description: 'High-tech neon aesthetics with grid patterns',
      category: 'futuristic',
      colors: {
        primary: '#00FF00',
        secondary: '#FF0080',
        accent: '#00FFFF',
        background: 'linear-gradient(135deg, #000000, #010101, #030303)',
        surface: 'rgba(0, 255, 0, 0.2)',
        text: '#00FF00'
      },
      effects: {
        blur: 15,
        glow: true,
        animation: 'bounce',
        particles: false
      },
      preview: '🌃'
    },
    {
      id: 'liquid-metal',
      name: 'Liquid Metal',
      description: 'Smooth metallic surfaces with liquid animations',
      category: 'modern',
      colors: {
        primary: '#C0C0C0',
        secondary: '#808080',
        accent: '#FFD700',
        background: 'linear-gradient(135deg, #1a1a1a, #2d2d2d, #404040)',
        surface: 'rgba(192, 192, 192, 0.1)',
        text: '#FFFFFF'
      },
      effects: {
        blur: 30,
        glow: false,
        animation: 'smooth',
        particles: true
      },
      preview: '💎'
    },
    {
      id: 'aurora-borealis',
      name: 'Aurora Borealis',
      description: 'Natural aurora effects with organic colors',
      category: 'creative',
      colors: {
        primary: '#00FF88',
        secondary: '#FF6B6B',
        accent: '#4ECDC4',
        background: 'linear-gradient(135deg, #0f0f23, #1a1a2e, #16213e)',
        surface: 'rgba(0, 255, 136, 0.1)',
        text: '#FFFFFF'
      },
      effects: {
        blur: 20,
        glow: true,
        animation: 'float',
        particles: true
      },
      preview: '🌌'
    },
    {
      id: 'minimal-dark',
      name: 'Minimal Dark',
      description: 'Clean, minimal design with subtle animations',
      category: 'minimal',
      colors: {
        primary: '#FFFFFF',
        secondary: '#CCCCCC',
        accent: '#007AFF',
        background: '#000000',
        surface: 'rgba(255, 255, 255, 0.05)',
        text: '#FFFFFF'
      },
      effects: {
        blur: 10,
        glow: false,
        animation: 'smooth',
        particles: false
      },
      preview: '⚫'
    }
  ];

  const applyTheme = (theme: Theme) => {
    const root = document.documentElement;
    
    // Apply CSS custom properties
    root.style.setProperty('--theme-primary', theme.colors.primary);
    root.style.setProperty('--theme-secondary', theme.colors.secondary);
    root.style.setProperty('--theme-accent', theme.colors.accent);
    root.style.setProperty('--theme-background', theme.colors.background);
    root.style.setProperty('--theme-surface', theme.colors.surface);
    root.style.setProperty('--theme-text', theme.colors.text);
    root.style.setProperty('--theme-blur', `${theme.effects.blur}px`);
    
    // Apply effects
    if (theme.effects.glow) {
      root.classList.add('theme-glow');
    } else {
      root.classList.remove('theme-glow');
    }
    
    if (theme.effects.particles) {
      root.classList.add('theme-particles');
    } else {
      root.classList.remove('theme-particles');
    }
    
    root.classList.add(`theme-${theme.effects.animation}`);
  };

  const handleThemeSelect = (themeId: string) => {
    const theme = themes.find(t => t.id === themeId);
    if (theme) {
      setSelectedTheme(themeId);
      applyTheme(theme);
      updateSetting('theme', themeId);
    }
  };

  const handlePreviewToggle = () => {
    setPreviewMode(!previewMode);
    if (!previewMode) {
      // Apply current theme for preview
      const theme = themes.find(t => t.id === selectedTheme);
      if (theme) applyTheme(theme);
    }
  };

  const createCustomTheme = () => {
    const newTheme: Theme = {
      id: 'custom',
      name: 'Custom Theme',
      description: 'Your personalized theme',
      category: 'creative',
      colors: {
        primary: customTheme.colors?.primary || '#3B82F6',
        secondary: customTheme.colors?.secondary || '#8B5CF6',
        accent: customTheme.colors?.accent || '#F59E0B',
        background: customTheme.colors?.background || 'linear-gradient(135deg, #0f0f23, #1a1a2e)',
        surface: customTheme.colors?.surface || 'rgba(255, 255, 255, 0.1)',
        text: customTheme.colors?.text || '#FFFFFF'
      },
      effects: {
        blur: customTheme.effects?.blur || 20,
        glow: customTheme.effects?.glow || true,
        animation: customTheme.effects?.animation || 'smooth',
        particles: customTheme.effects?.particles || true
      },
      preview: '🎨'
    };
    
    applyTheme(newTheme);
    updateSetting('theme', 'custom');
  };

  useEffect(() => {
    const theme = themes.find(t => t.id === selectedTheme);
    if (theme) applyTheme(theme);
  }, [selectedTheme]);

  return (
    <div className="advanced-theme-selector">
      <div className="theme-header">
        <h2>🎨 Advanced Theme System</h2>
        <div className="theme-controls">
          <button 
            className={`preview-btn ${previewMode ? 'active' : ''}`}
            onClick={handlePreviewToggle}
          >
            {previewMode ? 'Exit Preview' : 'Live Preview'}
          </button>
        </div>
      </div>

      <div className="theme-categories">
        {['modern', 'classic', 'futuristic', 'minimal', 'creative'].map(category => (
          <button
            key={category}
            className={`category-btn ${category}`}
            onClick={() => {
              const categoryThemes = themes.filter(t => t.category === category);
              if (categoryThemes.length > 0) {
                handleThemeSelect(categoryThemes[0].id);
              }
            }}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      <div className="themes-grid">
        {themes.map(theme => (
          <div
            key={theme.id}
            className={`theme-card ${selectedTheme === theme.id ? 'selected' : ''}`}
            onClick={() => handleThemeSelect(theme.id)}
          >
            <div className="theme-preview" style={{ backgroundColor: theme.colors.primary }}>
              <span className="theme-icon">{theme.preview}</span>
            </div>
            <div className="theme-info">
              <h3>{theme.name}</h3>
              <p>{theme.description}</p>
              <div className="theme-tags">
                <span className="tag">{theme.category}</span>
                {theme.effects.glow && <span className="tag glow">✨ Glow</span>}
                {theme.effects.particles && <span className="tag particles">🌟 Particles</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="custom-theme-section">
        <h3>🎨 Create Custom Theme</h3>
        <div className="custom-theme-form">
          <div className="color-inputs">
            <label>
              Primary Color:
              <input
                type="color"
                value={customTheme.colors?.primary || '#3B82F6'}
                onChange={(e) => setCustomTheme(prev => ({
                  ...prev,
                  colors: { ...prev.colors, primary: e.target.value }
                }))}
              />
            </label>
            <label>
              Secondary Color:
              <input
                type="color"
                value={customTheme.colors?.secondary || '#8B5CF6'}
                onChange={(e) => setCustomTheme(prev => ({
                  ...prev,
                  colors: { ...prev.colors, secondary: e.target.value }
                }))}
              />
            </label>
            <label>
              Accent Color:
              <input
                type="color"
                value={customTheme.colors?.accent || '#F59E0B'}
                onChange={(e) => setCustomTheme(prev => ({
                  ...prev,
                  colors: { ...prev.colors, accent: e.target.value }
                }))}
              />
            </label>
          </div>
          
          <div className="effect-controls">
            <label>
              Blur Intensity:
              <input
                type="range"
                min="0"
                max="50"
                value={customTheme.effects?.blur || 20}
                onChange={(e) => setCustomTheme(prev => ({
                  ...prev,
                  effects: { ...prev.effects, blur: parseInt(e.target.value) }
                }))}
              />
              <span>{customTheme.effects?.blur || 20}px</span>
            </label>
            
            <label>
              <input
                type="checkbox"
                checked={customTheme.effects?.glow || false}
                onChange={(e) => setCustomTheme(prev => ({
                  ...prev,
                  effects: { ...prev.effects, glow: e.target.checked }
                }))}
              />
              Enable Glow Effects
            </label>
            
            <label>
              <input
                type="checkbox"
                checked={customTheme.effects?.particles || false}
                onChange={(e) => setCustomTheme(prev => ({
                  ...prev,
                  effects: { ...prev.effects, particles: e.target.checked }
                }))}
              />
              Enable Particles
            </label>
          </div>
          
          <button className="create-theme-btn" onClick={createCustomTheme}>
            Create Custom Theme
          </button>
        </div>
      </div>

      {previewMode && (
        <div className="theme-preview-overlay">
          <div className="preview-content">
            <h3>Live Theme Preview</h3>
            <p>Current theme: {themes.find(t => t.id === selectedTheme)?.name}</p>
            <div className="preview-elements">
              <div className="preview-card">Sample Card</div>
              <div className="preview-button">Sample Button</div>
              <div className="preview-input">
                <input type="text" placeholder="Sample Input" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
