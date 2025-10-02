/**
 * Desktop Mode Context
 * 
 * Manages the adaptive desktop modes for the Liquid Intelligence UI system.
 * Modes include: work, creative, relax, and custom.
 * 
 * Each mode affects:
 * - Background gradients
 * - Window styling
 * - Color schemes
 * - Animation speeds
 * - AI behavior
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type DesktopMode = 'work' | 'creative' | 'relax' | 'custom';

interface DesktopModeConfig {
  mode: DesktopMode;
  colors: {
    primary: string;
    accent: string;
    background: string;
  };
  animations: {
    speed: number; // 0.5 = slow, 1 = normal, 2 = fast
    intensity: number; // 0-1
  };
  ai: {
    personality: 'professional' | 'creative' | 'casual';
    suggestions: boolean;
  };
}

interface DesktopModeContextType {
  mode: DesktopMode;
  config: DesktopModeConfig;
  setMode: (mode: DesktopMode) => void;
  updateConfig: (config: Partial<DesktopModeConfig>) => void;
}

const defaultConfigs: Record<DesktopMode, DesktopModeConfig> = {
  work: {
    mode: 'work',
    colors: {
      primary: '#00f6ff',
      accent: '#0088ff',
      background: 'linear-gradient(135deg, #0a0f1e 0%, #1a1f2e 100%)',
    },
    animations: {
      speed: 1,
      intensity: 0.7,
    },
    ai: {
      personality: 'professional',
      suggestions: true,
    },
  },
  creative: {
    mode: 'creative',
    colors: {
      primary: '#ff00f4',
      accent: '#ff6b9d',
      background: 'linear-gradient(135deg, #1e0a1e 0%, #2e1a2e 100%)',
    },
    animations: {
      speed: 1.5,
      intensity: 1,
    },
    ai: {
      personality: 'creative',
      suggestions: true,
    },
  },
  relax: {
    mode: 'relax',
    colors: {
      primary: '#00ff88',
      accent: '#00cc6a',
      background: 'linear-gradient(135deg, #0a1e1e 0%, #1a2e2e 100%)',
    },
    animations: {
      speed: 0.7,
      intensity: 0.5,
    },
    ai: {
      personality: 'casual',
      suggestions: false,
    },
  },
  custom: {
    mode: 'custom',
    colors: {
      primary: '#00f6ff',
      accent: '#ff00f4',
      background: 'linear-gradient(135deg, #0a0f1e 0%, #1a1f2e 100%)',
    },
    animations: {
      speed: 1,
      intensity: 0.8,
    },
    ai: {
      personality: 'professional',
      suggestions: true,
    },
  },
};

const DesktopModeContext = createContext<DesktopModeContextType | undefined>(undefined);

export const useDesktopMode = () => {
  const context = useContext(DesktopModeContext);
  if (!context) {
    throw new Error('useDesktopMode must be used within a DesktopModeProvider');
  }
  return context;
};

interface DesktopModeProviderProps {
  children: ReactNode;
}

export const DesktopModeProvider: React.FC<DesktopModeProviderProps> = ({ children }) => {
  const [mode, setModeState] = useState<DesktopMode>(() => {
    // Load from localStorage
    const saved = localStorage.getItem('auraos-desktop-mode');
    return (saved as DesktopMode) || 'work';
  });

  const [config, setConfig] = useState<DesktopModeConfig>(() => {
    // Load custom config from localStorage if mode is custom
    if (mode === 'custom') {
      const savedConfig = localStorage.getItem('auraos-desktop-config');
      if (savedConfig) {
        try {
          return JSON.parse(savedConfig);
        } catch (e) {
          console.error('Failed to parse saved config');
        }
      }
    }
    return defaultConfigs[mode];
  });

  const setMode = (newMode: DesktopMode) => {
    setModeState(newMode);
    setConfig(defaultConfigs[newMode]);
    localStorage.setItem('auraos-desktop-mode', newMode);
    
    // Log mode change
    console.log(`🎨 Desktop mode changed to: ${newMode}`);
  };

  const updateConfig = (updates: Partial<DesktopModeConfig>) => {
    const newConfig = { ...config, ...updates };
    setConfig(newConfig);
    
    // If updating custom mode, save to localStorage
    if (mode === 'custom') {
      localStorage.setItem('auraos-desktop-config', JSON.stringify(newConfig));
    }
  };

  // Apply CSS variables based on current mode
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--mode-primary', config.colors.primary);
    root.style.setProperty('--mode-accent', config.colors.accent);
    root.style.setProperty('--mode-animation-speed', `${config.animations.speed}s`);
    root.style.setProperty('--mode-animation-intensity', config.animations.intensity.toString());
  }, [config]);

  // Apply mode class to body
  useEffect(() => {
    document.body.className = `desktop-${mode}-mode`;
  }, [mode]);

  const value: DesktopModeContextType = {
    mode,
    config,
    setMode,
    updateConfig,
  };

  return (
    <DesktopModeContext.Provider value={value}>
      {children}
    </DesktopModeContext.Provider>
  );
};
