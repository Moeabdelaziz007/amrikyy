import React, { useState, useEffect } from 'react';

interface Theme {
  id: string;
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
  };
  gradients: {
    primary: string;
    secondary: string;
    accent: string;
  };
  effects: {
    glassOpacity: number;
    blurIntensity: number;
    shadowIntensity: number;
  };
  animations: {
    duration: string;
    easing: string;
  };
}

const themes: Theme[] = [
  {
    id: 'default',
    name: 'Amrikyy Classic',
    description: 'The original Amrikyy AIOS theme with blue and purple gradients',
    colors: {
      primary: '#3b82f6',
      secondary: '#8b5cf6',
      accent: '#ec4899',
      background: '#0f0f23',
      surface: '#1a1a2e',
      text: '#ffffff'
    },
    gradients: {
      primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      secondary: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      accent: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    effects: {
      glassOpacity: 0.1,
      blurIntensity: 20,
      shadowIntensity: 0.37
    },
    animations: {
      duration: '0.3s',
      easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
    }
  },
  {
    id: 'dark',
    name: 'Midnight Pro',
    description: 'Deep dark theme with neon accents',
    colors: {
      primary: '#00ffff',
      secondary: '#ff00ff',
      accent: '#ffff00',
      background: '#000000',
      surface: '#111111',
      text: '#ffffff'
    },
    gradients: {
      primary: 'linear-gradient(135deg, #00ffff 0%, #0080ff 100%)',
      secondary: 'linear-gradient(135deg, #ff00ff 0%, #ff0080 100%)',
      accent: 'linear-gradient(135deg, #ffff00 0%, #ff8000 100%)'
    },
    effects: {
      glassOpacity: 0.2,
      blurIntensity: 25,
      shadowIntensity: 0.5
    },
    animations: {
      duration: '0.4s',
      easing: 'cubic-bezier(0.16, 1, 0.3, 1)'
    }
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk Neon',
    description: 'High-contrast cyberpunk theme with electric colors',
    colors: {
      primary: '#ff0080',
      secondary: '#00ff80',
      accent: '#8000ff',
      background: '#0a0a0a',
      surface: '#1a0a1a',
      text: '#ffffff'
    },
    gradients: {
      primary: 'linear-gradient(135deg, #ff0080 0%, #ff4000 100%)',
      secondary: 'linear-gradient(135deg, #00ff80 0%, #00ff40 100%)',
      accent: 'linear-gradient(135deg, #8000ff 0%, #4000ff 100%)'
    },
    effects: {
      glassOpacity: 0.15,
      blurIntensity: 30,
      shadowIntensity: 0.6
    },
    animations: {
      duration: '0.2s',
      easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
    }
  },
  {
    id: 'ocean',
    name: 'Ocean Depths',
    description: 'Calming ocean theme with blue-green gradients',
    colors: {
      primary: '#0891b2',
      secondary: '#0d9488',
      accent: '#06b6d4',
      background: '#0c4a6e',
      surface: '#075985',
      text: '#ffffff'
    },
    gradients: {
      primary: 'linear-gradient(135deg, #0891b2 0%, #0d9488 100%)',
      secondary: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
      accent: 'linear-gradient(135deg, #0d9488 0%, #06b6d4 100%)'
    },
    effects: {
      glassOpacity: 0.12,
      blurIntensity: 18,
      shadowIntensity: 0.35
    },
    animations: {
      duration: '0.5s',
      easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
    }
  },
  {
    id: 'sunset',
    name: 'Sunset Vibes',
    description: 'Warm sunset theme with orange and pink tones',
    colors: {
      primary: '#f97316',
      secondary: '#ec4899',
      accent: '#f59e0b',
      background: '#7c2d12',
      surface: '#9a3412',
      text: '#ffffff'
    },
    gradients: {
      primary: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
      secondary: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
      accent: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
    },
    effects: {
      glassOpacity: 0.08,
      blurIntensity: 15,
      shadowIntensity: 0.3
    },
    animations: {
      duration: '0.6s',
      easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
    }
  },
  {
    id: 'forest',
    name: 'Forest Green',
    description: 'Natural forest theme with green and earth tones',
    colors: {
      primary: '#16a34a',
      secondary: '#059669',
      accent: '#10b981',
      background: '#14532d',
      surface: '#166534',
      text: '#ffffff'
    },
    gradients: {
      primary: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
      secondary: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
      accent: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
    },
    effects: {
      glassOpacity: 0.1,
      blurIntensity: 20,
      shadowIntensity: 0.4
    },
    animations: {
      duration: '0.4s',
      easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
    }
  }
];

export const AdvancedThemeSelector: React.FC = () => {
  const [selectedTheme, setSelectedTheme] = useState<Theme>(themes[0]);
  const [isOpen, setIsOpen] = useState(false);
  const [customTheme, setCustomTheme] = useState<Partial<Theme>>({});

  useEffect(() => {
    // Apply theme to document root
    const root = document.documentElement;
    const theme = selectedTheme;
    
    root.style.setProperty('--primary-color', theme.colors.primary);
    root.style.setProperty('--secondary-color', theme.colors.secondary);
    root.style.setProperty('--accent-color', theme.colors.accent);
    root.style.setProperty('--bg-gradient-primary', theme.gradients.primary);
    root.style.setProperty('--bg-gradient-secondary', theme.gradients.secondary);
    root.style.setProperty('--bg-gradient-accent', theme.gradients.accent);
    root.style.setProperty('--glass-bg', `rgba(255, 255, 255, ${theme.effects.glassOpacity})`);
    root.style.setProperty('--animation-normal', theme.animations.duration);
    root.style.setProperty('--ease-out-quart', theme.animations.easing);
    
    // Apply background
    document.body.style.background = theme.gradients.primary;
    document.body.style.backgroundSize = '400% 400%';
  }, [selectedTheme]);

  const applyTheme = (theme: Theme) => {
    setSelectedTheme(theme);
    setIsOpen(false);
  };

  const createCustomTheme = () => {
    const newTheme: Theme = {
      id: 'custom',
      name: 'Custom Theme',
      description: 'Your personalized theme',
      colors: {
        primary: customTheme.colors?.primary || '#3b82f6',
        secondary: customTheme.colors?.secondary || '#8b5cf6',
        accent: customTheme.colors?.accent || '#ec4899',
        background: customTheme.colors?.background || '#0f0f23',
        surface: customTheme.colors?.surface || '#1a1a2e',
        text: customTheme.colors?.text || '#ffffff'
      },
      gradients: {
        primary: customTheme.gradients?.primary || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        secondary: customTheme.gradients?.secondary || 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        accent: customTheme.gradients?.accent || 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
      },
      effects: {
        glassOpacity: customTheme.effects?.glassOpacity || 0.1,
        blurIntensity: customTheme.effects?.blurIntensity || 20,
        shadowIntensity: customTheme.effects?.shadowIntensity || 0.37
      },
      animations: {
        duration: customTheme.animations?.duration || '0.3s',
        easing: customTheme.animations?.easing || 'cubic-bezier(0.25, 1, 0.5, 1)'
      }
    };
    
    applyTheme(newTheme);
  };

  return (
    <div className="advanced-theme-selector">
      <div className="theme-header">
        <h2>🌈 Advanced Theme Selector</h2>
        <p>Customize your Amrikyy AIOS experience with beautiful themes</p>
      </div>

      <div className="theme-controls">
        <button 
          className="theme-toggle-btn"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? 'Close Themes' : 'Browse Themes'}
        </button>
        
        <div className="current-theme">
          <h3>Current Theme: {selectedTheme.name}</h3>
          <p>{selectedTheme.description}</p>
        </div>
      </div>

      {isOpen && (
        <div className="themes-grid">
          {themes.map(theme => (
            <div 
              key={theme.id}
              className={`theme-card ${selectedTheme.id === theme.id ? 'selected' : ''}`}
              onClick={() => applyTheme(theme)}
            >
              <div 
                className="theme-preview"
                style={{ background: theme.gradients.primary }}
              >
                <div className="theme-colors">
                  <div 
                    className="color-swatch"
                    style={{ backgroundColor: theme.colors.primary }}
                  ></div>
                  <div 
                    className="color-swatch"
                    style={{ backgroundColor: theme.colors.secondary }}
                  ></div>
                  <div 
                    className="color-swatch"
                    style={{ backgroundColor: theme.colors.accent }}
                  ></div>
                </div>
              </div>
              <div className="theme-info">
                <h4>{theme.name}</h4>
                <p>{theme.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="custom-theme-section">
        <h3>🎨 Create Custom Theme</h3>
        <div className="custom-theme-controls">
          <div className="color-inputs">
            <div className="input-group">
              <label>Primary Color</label>
              <input
                type="color"
                value={customTheme.colors?.primary || '#3b82f6'}
                onChange={(e) => setCustomTheme(prev => ({
                  ...prev,
                  colors: { ...prev.colors, primary: e.target.value }
                }))}
              />
            </div>
            <div className="input-group">
              <label>Secondary Color</label>
              <input
                type="color"
                value={customTheme.colors?.secondary || '#8b5cf6'}
                onChange={(e) => setCustomTheme(prev => ({
                  ...prev,
                  colors: { ...prev.colors, secondary: e.target.value }
                }))}
              />
            </div>
            <div className="input-group">
              <label>Accent Color</label>
              <input
                type="color"
                value={customTheme.colors?.accent || '#ec4899'}
                onChange={(e) => setCustomTheme(prev => ({
                  ...prev,
                  colors: { ...prev.colors, accent: e.target.value }
                }))}
              />
            </div>
          </div>
          
          <div className="effect-controls">
            <div className="slider-group">
              <label>Glass Opacity: {customTheme.effects?.glassOpacity || 0.1}</label>
              <input
                type="range"
                min="0.05"
                max="0.3"
                step="0.01"
                value={customTheme.effects?.glassOpacity || 0.1}
                onChange={(e) => setCustomTheme(prev => ({
                  ...prev,
                  effects: { ...prev.effects, glassOpacity: parseFloat(e.target.value) }
                }))}
              />
            </div>
            <div className="slider-group">
              <label>Blur Intensity: {customTheme.effects?.blurIntensity || 20}px</label>
              <input
                type="range"
                min="5"
                max="50"
                step="1"
                value={customTheme.effects?.blurIntensity || 20}
                onChange={(e) => setCustomTheme(prev => ({
                  ...prev,
                  effects: { ...prev.effects, blurIntensity: parseInt(e.target.value) }
                }))}
              />
            </div>
          </div>
          
          <button 
            className="apply-custom-btn"
            onClick={createCustomTheme}
          >
            Apply Custom Theme
          </button>
        </div>
      </div>

      <div className="theme-effects">
        <h3>✨ Theme Effects</h3>
        <div className="effects-grid">
          <div className="effect-card">
            <h4>🎭 Animations</h4>
            <p>Enhanced transitions and micro-interactions</p>
            <div className="effect-toggle">
              <input type="checkbox" defaultChecked />
              <span>Enable</span>
            </div>
          </div>
          <div className="effect-card">
            <h4>🌟 Particle Effects</h4>
            <p>Floating particles and ambient effects</p>
            <div className="effect-toggle">
              <input type="checkbox" defaultChecked />
              <span>Enable</span>
            </div>
          </div>
          <div className="effect-card">
            <h4>🔊 Sound Effects</h4>
            <p>Audio feedback for interactions</p>
            <div className="effect-toggle">
              <input type="checkbox" />
              <span>Enable</span>
            </div>
          </div>
          <div className="effect-card">
            <h4>🌈 Dynamic Gradients</h4>
            <p>Animated background gradients</p>
            <div className="effect-toggle">
              <input type="checkbox" defaultChecked />
              <span>Enable</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};