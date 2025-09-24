/**
 * 🎨 Desktop Theme Provider for AuraOS
 * Advanced theme management with real-time switching
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

export interface ThemeConfig {
  id: string;
  name: string;
  type: 'light' | 'dark' | 'auto';
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    border: string;
  };
  fonts: {
    primary: string;
    secondary: string;
    mono: string;
  };
  effects: {
    blur: boolean;
    animations: boolean;
    shadows: boolean;
    glass: boolean;
  };
  wallpaper: {
    type: 'solid' | 'gradient' | 'image' | 'video';
    value: string;
  };
}

interface ThemeContextType {
  currentTheme: ThemeConfig;
  availableThemes: ThemeConfig[];
  isDarkMode: boolean;
  setTheme: (themeId: string) => void;
  toggleDarkMode: () => void;
  updateTheme: (updates: Partial<ThemeConfig>) => void;
  resetTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const defaultThemes: ThemeConfig[] = [
  {
    id: 'modern-light',
    name: 'Modern Light',
    type: 'light',
    colors: {
      primary: '#3b82f6',
      secondary: '#10b981',
      accent: '#8b5cf6',
      background: '#ffffff',
      surface: '#f8fafc',
      text: '#0f172a',
      border: '#e2e8f0',
    },
    fonts: {
      primary: 'Inter',
      secondary: 'Poppins',
      mono: 'JetBrains Mono',
    },
    effects: {
      blur: true,
      animations: true,
      shadows: true,
      glass: true,
    },
    wallpaper: {
      type: 'gradient',
      value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
  },
  {
    id: 'modern-dark',
    name: 'Modern Dark',
    type: 'dark',
    colors: {
      primary: '#60a5fa',
      secondary: '#34d399',
      accent: '#a78bfa',
      background: '#0a0a0a',
      surface: '#111111',
      text: '#ffffff',
      border: '#262626',
    },
    fonts: {
      primary: 'Inter',
      secondary: 'Poppins',
      mono: 'JetBrains Mono',
    },
    effects: {
      blur: true,
      animations: true,
      shadows: true,
      glass: true,
    },
    wallpaper: {
      type: 'gradient',
      value: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    },
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    type: 'dark',
    colors: {
      primary: '#00ff88',
      secondary: '#00d9ff',
      accent: '#ff6b9d',
      background: '#0a0a0a',
      surface: '#111111',
      text: '#00ff88',
      border: '#262626',
    },
    fonts: {
      primary: 'Orbitron',
      secondary: 'Rajdhani',
      mono: 'JetBrains Mono',
    },
    effects: {
      blur: true,
      animations: true,
      shadows: true,
      glass: true,
    },
    wallpaper: {
      type: 'gradient',
      value: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
    },
  },
  {
    id: 'minimal',
    name: 'Minimal',
    type: 'light',
    colors: {
      primary: '#000000',
      secondary: '#666666',
      accent: '#000000',
      background: '#ffffff',
      surface: '#fafafa',
      text: '#000000',
      border: '#e0e0e0',
    },
    fonts: {
      primary: 'Inter',
      secondary: 'Inter',
      mono: 'JetBrains Mono',
    },
    effects: {
      blur: false,
      animations: false,
      shadows: false,
      glass: false,
    },
    wallpaper: {
      type: 'solid',
      value: '#ffffff',
    },
  },
];

interface DesktopThemeProviderProps {
  children: ReactNode;
  defaultThemeId?: string;
}

export const DesktopThemeProvider: React.FC<DesktopThemeProviderProps> = ({
  children,
  defaultThemeId = 'modern-dark',
}) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeConfig>(
    defaultThemes.find(t => t.id === defaultThemeId) || defaultThemes[0]
  );
  const [availableThemes] = useState<ThemeConfig[]>(defaultThemes);
  const [isDarkMode, setIsDarkMode] = useState(currentTheme.type === 'dark');

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    const { colors, fonts, effects, wallpaper } = currentTheme;

    // Apply color variables
    root.style.setProperty('--theme-primary', colors.primary);
    root.style.setProperty('--theme-secondary', colors.secondary);
    root.style.setProperty('--theme-accent', colors.accent);
    root.style.setProperty('--theme-background', colors.background);
    root.style.setProperty('--theme-surface', colors.surface);
    root.style.setProperty('--theme-text', colors.text);
    root.style.setProperty('--theme-border', colors.border);

    // Apply font variables
    root.style.setProperty('--theme-font-primary', fonts.primary);
    root.style.setProperty('--theme-font-secondary', fonts.secondary);
    root.style.setProperty('--theme-font-mono', fonts.mono);

    // Apply effects
    root.style.setProperty(
      '--theme-blur',
      effects.blur ? 'blur(20px)' : 'none'
    );
    root.style.setProperty(
      '--theme-animations',
      effects.animations ? 'auto' : 'none'
    );
    root.style.setProperty(
      '--theme-shadows',
      effects.shadows ? 'auto' : 'none'
    );
    root.style.setProperty(
      '--theme-glass',
      effects.glass ? 'rgba(255,255,255,0.1)' : 'transparent'
    );

    // Apply wallpaper
    if (wallpaper.type === 'solid') {
      root.style.setProperty('--theme-wallpaper', wallpaper.value);
    } else if (wallpaper.type === 'gradient') {
      root.style.setProperty('--theme-wallpaper', wallpaper.value);
    }

    // Apply dark mode class
    if (currentTheme.type === 'dark') {
      root.classList.add('dark');
      setIsDarkMode(true);
    } else if (currentTheme.type === 'light') {
      root.classList.remove('dark');
      setIsDarkMode(false);
    } else {
      // Auto mode - use system preference
      const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches;
      root.classList.toggle('dark', prefersDark);
      setIsDarkMode(prefersDark);
    }

    // Save to localStorage
    localStorage.setItem('auraos-theme', JSON.stringify(currentTheme));
  }, [currentTheme]);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('auraos-theme');
    if (savedTheme) {
      try {
        const theme = JSON.parse(savedTheme);
        setCurrentTheme(theme);
      } catch (error) {
        console.warn('Failed to load saved theme:', error);
      }
    }
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (currentTheme.type === 'auto') {
        setIsDarkMode(mediaQuery.matches);
        document.documentElement.classList.toggle('dark', mediaQuery.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [currentTheme.type]);

  const setTheme = (themeId: string) => {
    const theme = availableThemes.find(t => t.id === themeId);
    if (theme) {
      setCurrentTheme(theme);
    }
  };

  const toggleDarkMode = () => {
    const newTheme = isDarkMode ? 'modern-light' : 'modern-dark';
    setTheme(newTheme);
  };

  const updateTheme = (updates: Partial<ThemeConfig>) => {
    setCurrentTheme(prev => ({ ...prev, ...updates }));
  };

  const resetTheme = () => {
    setTheme(defaultThemeId);
  };

  const contextValue: ThemeContextType = {
    currentTheme,
    availableThemes,
    isDarkMode,
    setTheme,
    toggleDarkMode,
    updateTheme,
    resetTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useDesktopTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error(
      'useDesktopTheme must be used within a DesktopThemeProvider'
    );
  }
  return context;
};

// Theme utility functions
export const applyThemeTransition = (element: HTMLElement, duration = 300) => {
  element.style.transition = `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
  setTimeout(() => {
    element.style.transition = '';
  }, duration);
};

export const createThemeCSS = (theme: ThemeConfig): string => {
  return `
    :root {
      --theme-primary: ${theme.colors.primary};
      --theme-secondary: ${theme.colors.secondary};
      --theme-accent: ${theme.colors.accent};
      --theme-background: ${theme.colors.background};
      --theme-surface: ${theme.colors.surface};
      --theme-text: ${theme.colors.text};
      --theme-border: ${theme.colors.border};
      --theme-font-primary: ${theme.fonts.primary};
      --theme-font-secondary: ${theme.fonts.secondary};
      --theme-font-mono: ${theme.fonts.mono};
      --theme-blur: ${theme.effects.blur ? 'blur(20px)' : 'none'};
      --theme-animations: ${theme.effects.animations ? 'auto' : 'none'};
      --theme-shadows: ${theme.effects.shadows ? 'auto' : 'none'};
      --theme-glass: ${theme.effects.glass ? 'rgba(255,255,255,0.1)' : 'transparent'};
      --theme-wallpaper: ${theme.wallpaper.value};
    }
  `;
};

export default DesktopThemeProvider;
