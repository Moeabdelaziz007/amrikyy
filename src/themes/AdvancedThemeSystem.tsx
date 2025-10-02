import React, { useState, useEffect, createContext, useContext } from 'react';
import { 
  Sun, 
  Moon, 
  Palette, 
  Monitor, 
  Smartphone, 
  Settings,
  Zap,
  Star,
  Heart,
  Droplets,
  Flame,
  Leaf,
  Mountain,
  Waves,
  Sunset,
  Sparkles
} from 'lucide-react';
import { astroTheme } from '../shell/theme/astro-theme';

export interface Theme {
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
  };
  gradients: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
  };
  shadows: {
    small: string;
    medium: string;
    large: string;
    glow: string;
  };
  animations: {
    duration: string;
    easing: string;
  };
  typography: {
    fontFamily: string;
    fontSize: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
    };
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
  };
  borderRadius: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };
}

export const themes: Theme[] = [
  {
    id: 'astro',
    name: 'astro',
    displayName: 'Astro Space',
    description: 'Futuristic space theme with neon cyan and magenta accents',
    icon: Star,
    colors: {
      primary: astroTheme.colors.primary,
      secondary: astroTheme.colors.accent,
      accent: astroTheme.colors.accent,
      background: astroTheme.colors.background,
      surface: astroTheme.colors.surface,
      text: astroTheme.colors.text,
      textSecondary: astroTheme.colors.textSecondary,
      border: astroTheme.colors.glassBorder,
      success: astroTheme.colors.success,
      warning: astroTheme.colors.warning,
      error: astroTheme.colors.error,
      info: astroTheme.colors.primary,
    },
    gradients: {
      primary: astroTheme.gradients.primary,
      secondary: astroTheme.gradients.accent,
      background: astroTheme.gradients.background,
      surface: astroTheme.gradients.glass,
    },
    shadows: {
      small: '0 1px 3px rgba(0, 246, 255, 0.12), 0 1px 2px rgba(0, 246, 255, 0.24)',
      medium: '0 4px 6px rgba(0, 246, 255, 0.07), 0 2px 4px rgba(0, 246, 255, 0.06)',
      large: '0 10px 15px rgba(0, 246, 255, 0.1), 0 4px 6px rgba(0, 246, 255, 0.05)',
      glow: astroTheme.shadows.glow,
    },
    animations: {
      duration: astroTheme.animations.duration,
      easing: astroTheme.animations.easing,
    },
    typography: {
      fontFamily: astroTheme.fonts.primary,
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
      },
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      '2xl': '3rem',
    },
    borderRadius: {
      none: '0',
      sm: '0.125rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem',
      full: '9999px',
    },
  },
  {
    id: 'aurora',
    name: 'aurora',
    displayName: 'Aurora',
    description: 'Mystical aurora borealis with vibrant gradients',
    icon: Sparkles,
    colors: {
      primary: '#8B5CF6',
      secondary: '#06B6D4',
      accent: '#F59E0B',
      background: '#0F0F23',
      surface: '#1A1A2E',
      text: '#FFFFFF',
      textSecondary: '#A1A1AA',
      border: '#27272A',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
    },
    gradients: {
      primary: 'linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)',
      secondary: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
      background: 'linear-gradient(135deg, #0F0F23 0%, #1A1A2E 100%)',
      surface: 'linear-gradient(135deg, #1A1A2E 0%, #27272A 100%)',
    },
    shadows: {
      small: '0 1px 3px rgba(139, 92, 246, 0.12), 0 1px 2px rgba(139, 92, 246, 0.24)',
      medium: '0 4px 6px rgba(139, 92, 246, 0.07), 0 2px 4px rgba(139, 92, 246, 0.06)',
      large: '0 10px 15px rgba(139, 92, 246, 0.1), 0 4px 6px rgba(139, 92, 246, 0.05)',
      glow: '0 0 20px rgba(139, 92, 246, 0.3), 0 0 40px rgba(6, 182, 212, 0.2)',
    },
    animations: {
      duration: '0.3s',
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
    typography: {
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
      },
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      '2xl': '3rem',
    },
    borderRadius: {
      none: '0',
      sm: '0.125rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem',
      full: '9999px',
    },
  },
  {
    id: 'ocean',
    name: 'ocean',
    displayName: 'Ocean Depths',
    description: 'Deep ocean blues with wave-like gradients',
    icon: Waves,
    colors: {
      primary: '#0EA5E9',
      secondary: '#06B6D4',
      accent: '#8B5CF6',
      background: '#0C1445',
      surface: '#1E293B',
      text: '#F8FAFC',
      textSecondary: '#94A3B8',
      border: '#334155',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
    },
    gradients: {
      primary: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',
      secondary: 'linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)',
      background: 'linear-gradient(135deg, #0C1445 0%, #1E293B 100%)',
      surface: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)',
    },
    shadows: {
      small: '0 1px 3px rgba(14, 165, 233, 0.12), 0 1px 2px rgba(14, 165, 233, 0.24)',
      medium: '0 4px 6px rgba(14, 165, 233, 0.07), 0 2px 4px rgba(14, 165, 233, 0.06)',
      large: '0 10px 15px rgba(14, 165, 233, 0.1), 0 4px 6px rgba(14, 165, 233, 0.05)',
      glow: '0 0 20px rgba(14, 165, 233, 0.3), 0 0 40px rgba(6, 182, 212, 0.2)',
    },
    animations: {
      duration: '0.3s',
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
    typography: {
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
      },
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      '2xl': '3rem',
    },
    borderRadius: {
      none: '0',
      sm: '0.125rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem',
      full: '9999px',
    },
  },
  {
    id: 'sunset',
    name: 'sunset',
    displayName: 'Golden Sunset',
    description: 'Warm sunset colors with orange and pink gradients',
    icon: Sunset,
    colors: {
      primary: '#F59E0B',
      secondary: '#EF4444',
      accent: '#8B5CF6',
      background: '#1C1917',
      surface: '#292524',
      text: '#FAFAF9',
      textSecondary: '#A8A29E',
      border: '#44403C',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
    },
    gradients: {
      primary: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
      secondary: 'linear-gradient(135deg, #8B5CF6 0%, #EF4444 100%)',
      background: 'linear-gradient(135deg, #1C1917 0%, #292524 100%)',
      surface: 'linear-gradient(135deg, #292524 0%, #44403C 100%)',
    },
    shadows: {
      small: '0 1px 3px rgba(245, 158, 11, 0.12), 0 1px 2px rgba(245, 158, 11, 0.24)',
      medium: '0 4px 6px rgba(245, 158, 11, 0.07), 0 2px 4px rgba(245, 158, 11, 0.06)',
      large: '0 10px 15px rgba(245, 158, 11, 0.1), 0 4px 6px rgba(245, 158, 11, 0.05)',
      glow: '0 0 20px rgba(245, 158, 11, 0.3), 0 0 40px rgba(239, 68, 68, 0.2)',
    },
    animations: {
      duration: '0.3s',
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
    typography: {
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
      },
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      '2xl': '3rem',
    },
    borderRadius: {
      none: '0',
      sm: '0.125rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem',
      full: '9999px',
    },
  },
  {
    id: 'forest',
    name: 'forest',
    displayName: 'Forest Green',
    description: 'Natural forest greens with earthy tones',
    icon: Leaf,
    colors: {
      primary: '#10B981',
      secondary: '#059669',
      accent: '#F59E0B',
      background: '#0F1419',
      surface: '#1F2937',
      text: '#F9FAFB',
      textSecondary: '#9CA3AF',
      border: '#374151',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
    },
    gradients: {
      primary: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
      secondary: 'linear-gradient(135deg, #F59E0B 0%, #10B981 100%)',
      background: 'linear-gradient(135deg, #0F1419 0%, #1F2937 100%)',
      surface: 'linear-gradient(135deg, #1F2937 0%, #374151 100%)',
    },
    shadows: {
      small: '0 1px 3px rgba(16, 185, 129, 0.12), 0 1px 2px rgba(16, 185, 129, 0.24)',
      medium: '0 4px 6px rgba(16, 185, 129, 0.07), 0 2px 4px rgba(16, 185, 129, 0.06)',
      large: '0 10px 15px rgba(16, 185, 129, 0.1), 0 4px 6px rgba(16, 185, 129, 0.05)',
      glow: '0 0 20px rgba(16, 185, 129, 0.3), 0 0 40px rgba(5, 150, 105, 0.2)',
    },
    animations: {
      duration: '0.3s',
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
    typography: {
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
      },
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      '2xl': '3rem',
    },
    borderRadius: {
      none: '0',
      sm: '0.125rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem',
      full: '9999px',
    },
  },
  {
    id: 'fire',
    name: 'fire',
    displayName: 'Fire & Flame',
    description: 'Intense fire colors with red and orange gradients',
    icon: Flame,
    colors: {
      primary: '#EF4444',
      secondary: '#F59E0B',
      accent: '#8B5CF6',
      background: '#1C1917',
      surface: '#292524',
      text: '#FAFAF9',
      textSecondary: '#A8A29E',
      border: '#44403C',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
    },
    gradients: {
      primary: 'linear-gradient(135deg, #EF4444 0%, #F59E0B 100%)',
      secondary: 'linear-gradient(135deg, #8B5CF6 0%, #EF4444 100%)',
      background: 'linear-gradient(135deg, #1C1917 0%, #292524 100%)',
      surface: 'linear-gradient(135deg, #292524 0%, #44403C 100%)',
    },
    shadows: {
      small: '0 1px 3px rgba(239, 68, 68, 0.12), 0 1px 2px rgba(239, 68, 68, 0.24)',
      medium: '0 4px 6px rgba(239, 68, 68, 0.07), 0 2px 4px rgba(239, 68, 68, 0.06)',
      large: '0 10px 15px rgba(239, 68, 68, 0.1), 0 4px 6px rgba(239, 68, 68, 0.05)',
      glow: '0 0 20px rgba(239, 68, 68, 0.3), 0 0 40px rgba(245, 158, 11, 0.2)',
    },
    animations: {
      duration: '0.3s',
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
    typography: {
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
      },
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      '2xl': '3rem',
    },
    borderRadius: {
      none: '0',
      sm: '0.125rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem',
      full: '9999px',
    },
  },
  {
    id: 'mountain',
    name: 'mountain',
    displayName: 'Mountain Peak',
    description: 'Cool mountain grays with crisp whites',
    icon: Mountain,
    colors: {
      primary: '#6B7280',
      secondary: '#9CA3AF',
      accent: '#3B82F6',
      background: '#111827',
      surface: '#1F2937',
      text: '#F9FAFB',
      textSecondary: '#D1D5DB',
      border: '#374151',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
    },
    gradients: {
      primary: 'linear-gradient(135deg, #6B7280 0%, #9CA3AF 100%)',
      secondary: 'linear-gradient(135deg, #3B82F6 0%, #6B7280 100%)',
      background: 'linear-gradient(135deg, #111827 0%, #1F2937 100%)',
      surface: 'linear-gradient(135deg, #1F2937 0%, #374151 100%)',
    },
    shadows: {
      small: '0 1px 3px rgba(107, 114, 128, 0.12), 0 1px 2px rgba(107, 114, 128, 0.24)',
      medium: '0 4px 6px rgba(107, 114, 128, 0.07), 0 2px 4px rgba(107, 114, 128, 0.06)',
      large: '0 10px 15px rgba(107, 114, 128, 0.1), 0 4px 6px rgba(107, 114, 128, 0.05)',
      glow: '0 0 20px rgba(107, 114, 128, 0.3), 0 0 40px rgba(59, 130, 246, 0.2)',
    },
    animations: {
      duration: '0.3s',
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
    typography: {
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
      },
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      '2xl': '3rem',
    },
    borderRadius: {
      none: '0',
      sm: '0.125rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem',
      full: '9999px',
    },
  },
];

interface ThemeContextType {
  currentTheme: Theme;
  setTheme: (themeId: string) => void;
  themes: Theme[];
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  applyTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(themes[0]);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    // Load saved theme from localStorage
    const savedThemeId = localStorage.getItem('auraos-theme');
    const savedDarkMode = localStorage.getItem('auraos-dark-mode');
    
    if (savedThemeId) {
      const theme = themes.find(t => t.id === savedThemeId);
      if (theme) {
        setCurrentTheme(theme);
      }
    }
    
    if (savedDarkMode) {
      setIsDarkMode(savedDarkMode === 'true');
    }
  }, []);

  const setTheme = (themeId: string) => {
    const theme = themes.find(t => t.id === themeId);
    if (theme) {
      setCurrentTheme(theme);
      localStorage.setItem('auraos-theme', themeId);
      applyTheme(theme);
    }
  };

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('auraos-dark-mode', newDarkMode.toString());
  };

  const applyTheme = (theme: Theme) => {
    const root = document.documentElement;
    
    // Apply CSS custom properties
    root.style.setProperty('--color-primary', theme.colors.primary);
    root.style.setProperty('--color-secondary', theme.colors.secondary);
    root.style.setProperty('--color-accent', theme.colors.accent);
    root.style.setProperty('--color-background', theme.colors.background);
    root.style.setProperty('--color-surface', theme.colors.surface);
    root.style.setProperty('--color-text', theme.colors.text);
    root.style.setProperty('--color-text-secondary', theme.colors.textSecondary);
    root.style.setProperty('--color-border', theme.colors.border);
    root.style.setProperty('--color-success', theme.colors.success);
    root.style.setProperty('--color-warning', theme.colors.warning);
    root.style.setProperty('--color-error', theme.colors.error);
    root.style.setProperty('--color-info', theme.colors.info);
    
    // Apply gradients
    root.style.setProperty('--gradient-primary', theme.gradients.primary);
    root.style.setProperty('--gradient-secondary', theme.gradients.secondary);
    root.style.setProperty('--gradient-background', theme.gradients.background);
    root.style.setProperty('--gradient-surface', theme.gradients.surface);
    
    // Apply shadows
    root.style.setProperty('--shadow-small', theme.shadows.small);
    root.style.setProperty('--shadow-medium', theme.shadows.medium);
    root.style.setProperty('--shadow-large', theme.shadows.large);
    root.style.setProperty('--shadow-glow', theme.shadows.glow);
    
    // Apply typography
    root.style.setProperty('--font-family', theme.typography.fontFamily);
    
    // Apply spacing
    root.style.setProperty('--spacing-xs', theme.spacing.xs);
    root.style.setProperty('--spacing-sm', theme.spacing.sm);
    root.style.setProperty('--spacing-md', theme.spacing.md);
    root.style.setProperty('--spacing-lg', theme.spacing.lg);
    root.style.setProperty('--spacing-xl', theme.spacing.xl);
    root.style.setProperty('--spacing-2xl', theme.spacing['2xl']);
    
    // Apply border radius
    root.style.setProperty('--radius-none', theme.borderRadius.none);
    root.style.setProperty('--radius-sm', theme.borderRadius.sm);
    root.style.setProperty('--radius-md', theme.borderRadius.md);
    root.style.setProperty('--radius-lg', theme.borderRadius.lg);
    root.style.setProperty('--radius-xl', theme.borderRadius.xl);
    root.style.setProperty('--radius-full', theme.borderRadius.full);
    
    // Apply animations
    root.style.setProperty('--animation-duration', theme.animations.duration);
    root.style.setProperty('--animation-easing', theme.animations.easing);
    
    // Apply theme-specific color variables for color dots
    root.style.setProperty('--theme-primary-color', theme.colors.primary);
    root.style.setProperty('--theme-secondary-color', theme.colors.secondary);
    root.style.setProperty('--theme-accent-color', theme.colors.accent);
    root.style.setProperty('--theme-success-color', theme.colors.success);
  };

  useEffect(() => {
    applyTheme(currentTheme);
  }, [currentTheme]);

  const value: ThemeContextType = {
    currentTheme,
    setTheme,
    themes,
    isDarkMode,
    toggleDarkMode,
    applyTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const AdvancedThemeSelector: React.FC = () => {
  const { currentTheme, setTheme, themes, isDarkMode, toggleDarkMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="theme-selector-button"
        title="Select theme"
        aria-label="Select theme"
      >
        <Palette className="h-5 w-5" />
        <span className="hidden sm:block">{currentTheme.displayName}</span>
        <div 
          className="theme-color-preview"
        />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 theme-modal z-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Choose Theme</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/10 rounded-lg transition-colors"
            >
              ×
            </button>
          </div>

          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between mb-4 p-3 bg-white/5 rounded-lg">
            <div className="flex items-center space-x-2">
              {isDarkMode ? <Moon className="h-5 w-5 text-blue-400" /> : <Sun className="h-5 w-5 text-yellow-400" />}
              <span className="text-white font-medium">Dark Mode</span>
            </div>
            <button
              onClick={toggleDarkMode}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isDarkMode ? 'bg-blue-600' : 'bg-gray-600'
              }`}
              title={`${isDarkMode ? 'Disable' : 'Enable'} dark mode`}
              aria-label={`${isDarkMode ? 'Disable' : 'Enable'} dark mode`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isDarkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Theme Grid */}
          <div className="grid grid-cols-2 gap-3">
            {themes.map((theme) => {
              const Icon = theme.icon;
              const isSelected = theme.id === currentTheme.id;
              
              return (
                <button
                  key={theme.id}
                  onClick={() => {
                    setTheme(theme.id);
                    setIsOpen(false);
                  }}
                  className={`theme-card ${isSelected ? 'selected' : ''}`}
                  title={`Select ${theme.displayName} theme`}
                  aria-label={`Select ${theme.displayName} theme`}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon className="theme-card-icon" />
                    <span className="theme-card-title">{theme.displayName}</span>
                  </div>
                  <p className="theme-card-description">{theme.description}</p>
                  
                  {/* Color Preview */}
                  <div className="theme-color-palette">
                    <div 
                      className="theme-color-dot theme-color-dot-primary"
                      title="Primary color"
                    />
                    <div 
                      className="theme-color-dot theme-color-dot-secondary"
                      title="Secondary color"
                    />
                    <div 
                      className="theme-color-dot theme-color-dot-accent"
                      title="Accent color"
                    />
                    <div 
                      className="theme-color-dot theme-color-dot-success"
                      title="Success color"
                    />
                  </div>
                  
                  {isSelected && (
                    <Star className="theme-star-icon fill-current" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Theme Info */}
          <div className="mt-4 p-3 bg-white/5 rounded-lg">
            <h4 className="text-white font-medium mb-2">Current Theme</h4>
            <p className="text-white/70 text-sm">{currentTheme.description}</p>
            <div className="flex items-center space-x-2 mt-2">
              <span className="text-white/50 text-xs">Primary:</span>
              <div 
                className="w-3 h-3 rounded-full border border-white/20 theme-color-preview"
              />
              <span className="text-white/70 text-xs">{currentTheme.colors.primary}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedThemeSelector;
