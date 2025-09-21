import React, { useState, useEffect } from 'react';
import { GlassCard } from '../dashboard/GlassCard';

interface ThemeConfig {
  name: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundStyle: 'dark' | 'light' | 'auto';
  neonIntensity: 'low' | 'medium' | 'high';
  animations: boolean;
  soundEffects: boolean;
  customCSS?: string;
}

interface AccessibilityConfig {
  highContrast: boolean;
  reducedMotion: boolean;
  fontSize: 'small' | 'medium' | 'large';
  keyboardNavigation: boolean;
  screenReader: boolean;
}

interface ShortcutConfig {
  commandPalette: string;
  darkMode: string;
  startAll: string;
  stopAll: string;
  toggleMute: string;
  quickSearch: string;
}

interface ThemeCustomizationProps {
  className?: string;
}

export const ThemeCustomization: React.FC<ThemeCustomizationProps> = ({ className = '' }) => {
  const [theme, setTheme] = useState<ThemeConfig>({
    name: 'Cyberpunk Neon',
    primaryColor: '#00f5ff',
    secondaryColor: '#ff00ff',
    accentColor: '#00ff00',
    backgroundStyle: 'dark',
    neonIntensity: 'high',
    animations: true,
    soundEffects: false,
    customCSS: ''
  });

  const [accessibility, setAccessibility] = useState<AccessibilityConfig>({
    highContrast: false,
    reducedMotion: false,
    fontSize: 'medium',
    keyboardNavigation: true,
    screenReader: false
  });

  const [shortcuts, setShortcuts] = useState<ShortcutConfig>({
    commandPalette: 'Cmd+K',
    darkMode: 'Alt+Shift+D',
    startAll: 'Cmd+Shift+L',
    stopAll: 'Cmd+Shift+S',
    toggleMute: 'Cmd+M',
    quickSearch: 'Cmd+/'
  });

  const [activeTab, setActiveTab] = useState<'theme' | 'accessibility' | 'shortcuts' | 'presets'>('theme');

  const presetThemes: ThemeConfig[] = [
    {
      name: 'Cyberpunk Neon',
      primaryColor: '#00f5ff',
      secondaryColor: '#ff00ff',
      accentColor: '#00ff00',
      backgroundStyle: 'dark',
      neonIntensity: 'high',
      animations: true,
      soundEffects: false
    },
    {
      name: 'Matrix Green',
      primaryColor: '#00ff00',
      secondaryColor: '#00cc00',
      accentColor: '#66ff66',
      backgroundStyle: 'dark',
      neonIntensity: 'medium',
      animations: true,
      soundEffects: false
    },
    {
      name: 'Ocean Blue',
      primaryColor: '#0099ff',
      secondaryColor: '#0066cc',
      accentColor: '#66ccff',
      backgroundStyle: 'dark',
      neonIntensity: 'medium',
      animations: true,
      soundEffects: false
    },
    {
      name: 'Minimal Dark',
      primaryColor: '#ffffff',
      secondaryColor: '#cccccc',
      accentColor: '#999999',
      backgroundStyle: 'dark',
      neonIntensity: 'low',
      animations: false,
      soundEffects: false
    },
    {
      name: 'Light Mode',
      primaryColor: '#0066cc',
      secondaryColor: '#004499',
      accentColor: '#0099ff',
      backgroundStyle: 'light',
      neonIntensity: 'low',
      animations: false,
      soundEffects: false
    }
  ];

  useEffect(() => {
    // Apply theme to document
    const root = document.documentElement;
    root.style.setProperty('--primary-color', theme.primaryColor);
    root.style.setProperty('--secondary-color', theme.secondaryColor);
    root.style.setProperty('--accent-color', theme.accentColor);
    
    if (theme.backgroundStyle === 'dark') {
      root.classList.add('dark');
    } else if (theme.backgroundStyle === 'light') {
      root.classList.remove('dark');
    }

    // Apply accessibility settings
    if (accessibility.reducedMotion) {
      root.style.setProperty('--animation-duration', '0.01s');
    } else {
      root.style.setProperty('--animation-duration', '0.3s');
    }

    if (accessibility.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Apply font size
    const fontSizeMap = { small: '14px', medium: '16px', large: '18px' };
    root.style.setProperty('--base-font-size', fontSizeMap[accessibility.fontSize]);

    // Apply custom CSS
    let customStyleElement = document.getElementById('custom-theme-styles');
    if (!customStyleElement) {
      customStyleElement = document.createElement('style');
      customStyleElement.id = 'custom-theme-styles';
      document.head.appendChild(customStyleElement);
    }
    customStyleElement.textContent = theme.customCSS || '';

  }, [theme, accessibility]);

  const handlePresetSelect = (preset: ThemeConfig) => {
    setTheme(preset);
  };

  const handleExportTheme = () => {
    const config = { theme, accessibility, shortcuts };
    const dataStr = JSON.stringify(config, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `auraos-theme-${theme.name.toLowerCase().replace(/\s+/g, '-')}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportTheme = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const config = JSON.parse(e.target?.result as string);
        if (config.theme) setTheme(config.theme);
        if (config.accessibility) setAccessibility(config.accessibility);
        if (config.shortcuts) setShortcuts(config.shortcuts);
      } catch (error) {
        console.error('Error importing theme:', error);
      }
    };
    reader.readAsText(file);
  };

  return (
    <GlassCard
      title="Theme Customization"
      subtitle="Personalize Your AuraOS Experience"
      glowColor="purple"
      className={className}
    >
      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6">
        {[
          { id: 'theme', label: '🎨 Theme', icon: '🎨' },
          { id: 'accessibility', label: '♿ Accessibility', icon: '♿' },
          { id: 'shortcuts', label: '⌨️ Shortcuts', icon: '⌨️' },
          { id: 'presets', label: '📦 Presets', icon: '📦' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-purple-400 to-pink-500 text-white shadow-glow-purple-md'
                : 'bg-glass-secondary text-text-secondary hover:bg-glass-primary hover:text-text-primary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Theme Tab */}
      {activeTab === 'theme' && (
        <div className="space-y-6">
          {/* Color Customization */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Primary Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={theme.primaryColor}
                  onChange={(e) => setTheme(prev => ({ ...prev, primaryColor: e.target.value }))}
                  className="w-12 h-10 rounded border border-glass-border"
                />
                <input
                  type="text"
                  value={theme.primaryColor}
                  onChange={(e) => setTheme(prev => ({ ...prev, primaryColor: e.target.value }))}
                  className="flex-1 px-3 py-2 bg-glass-primary border border-glass-border rounded text-text-primary"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Secondary Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={theme.secondaryColor}
                  onChange={(e) => setTheme(prev => ({ ...prev, secondaryColor: e.target.value }))}
                  className="w-12 h-10 rounded border border-glass-border"
                />
                <input
                  type="text"
                  value={theme.secondaryColor}
                  onChange={(e) => setTheme(prev => ({ ...prev, secondaryColor: e.target.value }))}
                  className="flex-1 px-3 py-2 bg-glass-primary border border-glass-border rounded text-text-primary"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Accent Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={theme.accentColor}
                  onChange={(e) => setTheme(prev => ({ ...prev, accentColor: e.target.value }))}
                  className="w-12 h-10 rounded border border-glass-border"
                />
                <input
                  type="text"
                  value={theme.accentColor}
                  onChange={(e) => setTheme(prev => ({ ...prev, accentColor: e.target.value }))}
                  className="flex-1 px-3 py-2 bg-glass-primary border border-glass-border rounded text-text-primary"
                />
              </div>
            </div>
          </div>

          {/* Background Style */}
          <div>
            <label className="block text-sm font-medium mb-2">Background Style</label>
            <div className="flex gap-2">
              {[
                { value: 'dark', label: 'Dark', icon: '🌙' },
                { value: 'light', label: 'Light', icon: '☀️' },
                { value: 'auto', label: 'Auto', icon: '🔄' }
              ].map(style => (
                <button
                  key={style.value}
                  onClick={() => setTheme(prev => ({ ...prev, backgroundStyle: style.value as any }))}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    theme.backgroundStyle === style.value
                      ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white shadow-glow-blue-md'
                      : 'bg-glass-secondary text-text-secondary hover:bg-glass-primary'
                  }`}
                >
                  {style.icon} {style.label}
                </button>
              ))}
            </div>
          </div>

          {/* Neon Intensity */}
          <div>
            <label className="block text-sm font-medium mb-2">Neon Intensity</label>
            <div className="flex gap-2">
              {[
                { value: 'low', label: 'Low', icon: '💡' },
                { value: 'medium', label: 'Medium', icon: '🔆' },
                { value: 'high', label: 'High', icon: '💥' }
              ].map(intensity => (
                <button
                  key={intensity.value}
                  onClick={() => setTheme(prev => ({ ...prev, neonIntensity: intensity.value as any }))}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    theme.neonIntensity === intensity.value
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-glow-yellow-md'
                      : 'bg-glass-secondary text-text-secondary hover:bg-glass-primary'
                  }`}
                >
                  {intensity.icon} {intensity.label}
                </button>
              ))}
            </div>
          </div>

          {/* Effects */}
          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={theme.animations}
                onChange={(e) => setTheme(prev => ({ ...prev, animations: e.target.checked }))}
                className="rounded"
              />
              <span className="text-sm">Enable Animations</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={theme.soundEffects}
                onChange={(e) => setTheme(prev => ({ ...prev, soundEffects: e.target.checked }))}
                className="rounded"
              />
              <span className="text-sm">Sound Effects</span>
            </label>
          </div>

          {/* Custom CSS */}
          <div>
            <label className="block text-sm font-medium mb-2">Custom CSS</label>
            <textarea
              value={theme.customCSS}
              onChange={(e) => setTheme(prev => ({ ...prev, customCSS: e.target.value }))}
              placeholder="Add your custom CSS here..."
              className="w-full h-32 px-3 py-2 bg-glass-primary border border-glass-border rounded text-text-primary font-mono text-sm resize-none"
            />
          </div>
        </div>
      )}

      {/* Accessibility Tab */}
      {activeTab === 'accessibility' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={accessibility.highContrast}
                  onChange={(e) => setAccessibility(prev => ({ ...prev, highContrast: e.target.checked }))}
                  className="rounded"
                />
                <span className="text-sm">High Contrast Mode</span>
              </label>
              
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={accessibility.reducedMotion}
                  onChange={(e) => setAccessibility(prev => ({ ...prev, reducedMotion: e.target.checked }))}
                  className="rounded"
                />
                <span className="text-sm">Reduce Motion</span>
              </label>
              
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={accessibility.keyboardNavigation}
                  onChange={(e) => setAccessibility(prev => ({ ...prev, keyboardNavigation: e.target.checked }))}
                  className="rounded"
                />
                <span className="text-sm">Enhanced Keyboard Navigation</span>
              </label>
              
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={accessibility.screenReader}
                  onChange={(e) => setAccessibility(prev => ({ ...prev, screenReader: e.target.checked }))}
                  className="rounded"
                />
                <span className="text-sm">Screen Reader Support</span>
              </label>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Font Size</label>
              <div className="flex gap-2">
                {[
                  { value: 'small', label: 'Small' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'large', label: 'Large' }
                ].map(size => (
                  <button
                    key={size.value}
                    onClick={() => setAccessibility(prev => ({ ...prev, fontSize: size.value as any }))}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      accessibility.fontSize === size.value
                        ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-glow-green-md'
                        : 'bg-glass-secondary text-text-secondary hover:bg-glass-primary'
                    }`}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Shortcuts Tab */}
      {activeTab === 'shortcuts' && (
        <div className="space-y-4">
          {Object.entries(shortcuts).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between p-3 bg-glass-secondary rounded-lg">
              <div>
                <div className="font-medium text-sm capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </div>
                <div className="text-xs text-text-secondary">
                  {key === 'commandPalette' && 'Open command palette'}
                  {key === 'darkMode' && 'Toggle dark mode'}
                  {key === 'startAll' && 'Start all agents'}
                  {key === 'stopAll' && 'Stop all agents'}
                  {key === 'toggleMute' && 'Toggle sound effects'}
                  {key === 'quickSearch' && 'Quick search'}
                </div>
              </div>
              <div className="px-3 py-1 bg-glass-primary border border-glass-border rounded text-sm font-mono">
                {value}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Presets Tab */}
      {activeTab === 'presets' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {presetThemes.map(preset => (
              <div
                key={preset.name}
                onClick={() => handlePresetSelect(preset)}
                className="p-4 bg-glass-secondary rounded-lg border border-glass-border cursor-pointer hover:shadow-glow-purple-sm transition-all duration-200"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex gap-1">
                    <div 
                      className="w-4 h-4 rounded-full border border-white/20"
                      style={{ backgroundColor: preset.primaryColor }}
                    />
                    <div 
                      className="w-4 h-4 rounded-full border border-white/20"
                      style={{ backgroundColor: preset.secondaryColor }}
                    />
                    <div 
                      className="w-4 h-4 rounded-full border border-white/20"
                      style={{ backgroundColor: preset.accentColor }}
                    />
                  </div>
                  <div className="font-medium text-sm">{preset.name}</div>
                </div>
                <div className="text-xs text-text-secondary">
                  {preset.backgroundStyle} • {preset.neonIntensity} neon • {preset.animations ? 'animated' : 'static'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 pt-6 border-t border-glass-border">
        <button
          onClick={handleExportTheme}
          className="px-4 py-2 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-lg text-sm font-medium hover:shadow-glow-green-sm transition-all duration-200"
        >
          📥 Export Theme
        </button>
        <label className="px-4 py-2 bg-gradient-to-r from-blue-400 to-cyan-500 text-white rounded-lg text-sm font-medium hover:shadow-glow-blue-sm transition-all duration-200 cursor-pointer">
          📤 Import Theme
          <input
            type="file"
            accept=".json"
            onChange={handleImportTheme}
            className="hidden"
          />
        </label>
        <button
          onClick={() => {
            setTheme(presetThemes[0]);
            setAccessibility({
              highContrast: false,
              reducedMotion: false,
              fontSize: 'medium',
              keyboardNavigation: true,
              screenReader: false
            });
          }}
          className="px-4 py-2 bg-glass-secondary text-text-primary rounded-lg text-sm font-medium hover:bg-glass-primary transition-all duration-200"
        >
          🔄 Reset to Default
        </button>
      </div>
    </GlassCard>
  );
};

export default ThemeCustomization;
