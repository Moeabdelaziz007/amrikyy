/**
 * 🎨 Theme Customizer Component for AuraOS
 * Advanced theme customization interface
 */

import React, { useState, useCallback } from 'react';
import {
  Palette,
  Sun,
  Moon,
  Monitor,
  Eye,
  EyeOff,
  Download,
  Upload,
  RotateCcw,
  Check,
  X,
  Settings,
  Wand2,
  Sparkles,
  Layers,
  Type,
  Image,
  Video,
  Droplets,
  Zap,
  Shield,
  Heart,
} from 'lucide-react';
import { useDesktopTheme, ThemeConfig } from './DesktopThemeProvider';

interface ThemeCustomizerProps {
  isOpen: boolean;
  onClose: () => void;
}

const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({
  isOpen,
  onClose,
}) => {
  const { currentTheme, availableThemes, setTheme, updateTheme, resetTheme } =
    useDesktopTheme();
  const [activeTab, setActiveTab] = useState<
    'presets' | 'colors' | 'fonts' | 'effects' | 'wallpaper'
  >('presets');
  const [customTheme, setCustomTheme] = useState<ThemeConfig>(currentTheme);
  const [previewMode, setPreviewMode] = useState(false);

  const handleColorChange = useCallback(
    (colorType: keyof ThemeConfig['colors'], value: string) => {
      setCustomTheme(prev => ({
        ...prev,
        colors: {
          ...prev.colors,
          [colorType]: value,
        },
      }));
    },
    []
  );

  const handleFontChange = useCallback(
    (fontType: keyof ThemeConfig['fonts'], value: string) => {
      setCustomTheme(prev => ({
        ...prev,
        fonts: {
          ...prev.fonts,
          [fontType]: value,
        },
      }));
    },
    []
  );

  const handleEffectToggle = useCallback(
    (effectType: keyof ThemeConfig['effects'], value: boolean) => {
      setCustomTheme(prev => ({
        ...prev,
        effects: {
          ...prev.effects,
          [effectType]: value,
        },
      }));
    },
    []
  );

  const handleWallpaperChange = useCallback(
    (type: ThemeConfig['wallpaper']['type'], value: string) => {
      setCustomTheme(prev => ({
        ...prev,
        wallpaper: {
          type,
          value,
        },
      }));
    },
    []
  );

  const applyCustomTheme = useCallback(() => {
    updateTheme(customTheme);
  }, [customTheme, updateTheme]);

  const exportTheme = useCallback(() => {
    const dataStr = JSON.stringify(customTheme, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `auraos-theme-${customTheme.name.toLowerCase().replace(/\s+/g, '-')}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, [customTheme]);

  const importTheme = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = e => {
        try {
          const theme = JSON.parse(e.target?.result as string);
          setCustomTheme(theme);
        } catch (error) {
          console.error('Failed to import theme:', error);
        }
      };
      reader.readAsText(file);
    },
    []
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Palette className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Theme Customizer
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Customize your AuraOS experience
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className={`p-2 rounded-lg transition-colors ${
                previewMode
                  ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              title="Preview mode"
            >
              {previewMode ? (
                <Eye className="w-4 h-4" />
              ) : (
                <EyeOff className="w-4 h-4" />
              )}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex h-full">
          {/* Sidebar */}
          <div className="w-64 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
            <div className="p-4">
              <nav className="space-y-2">
                {[
                  { id: 'presets', label: 'Presets', icon: Sparkles },
                  { id: 'colors', label: 'Colors', icon: Palette },
                  { id: 'fonts', label: 'Typography', icon: Type },
                  { id: 'effects', label: 'Effects', icon: Wand2 },
                  { id: 'wallpaper', label: 'Wallpaper', icon: Image },
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id as any)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === id
                        ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto">
            <div className="p-6">
              {activeTab === 'presets' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Theme Presets
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {availableThemes.map(theme => (
                        <button
                          key={theme.id}
                          onClick={() => {
                            setTheme(theme.id);
                            setCustomTheme(theme);
                          }}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            currentTheme.id === theme.id
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                          }`}
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <div
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: theme.colors.primary }}
                            />
                            <span className="font-medium">{theme.name}</span>
                          </div>
                          <div className="flex gap-1">
                            {Object.values(theme.colors)
                              .slice(0, 4)
                              .map((color, index) => (
                                <div
                                  key={index}
                                  className="w-6 h-6 rounded border border-gray-200 dark:border-gray-700"
                                  style={{ backgroundColor: color }}
                                />
                              ))}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'colors' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Color Palette
                    </h3>
                    <div className="grid grid-cols-2 gap-6">
                      {Object.entries(customTheme.colors).map(
                        ([key, value]) => (
                          <div key={key} className="space-y-2">
                            <label className="text-sm font-medium capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </label>
                            <div className="flex items-center gap-3">
                              <input
                                type="color"
                                value={value}
                                onChange={e =>
                                  handleColorChange(
                                    key as keyof ThemeConfig['colors'],
                                    e.target.value
                                  )
                                }
                                className="w-12 h-8 rounded border border-gray-200 dark:border-gray-700"
                              />
                              <input
                                type="text"
                                value={value}
                                onChange={e =>
                                  handleColorChange(
                                    key as keyof ThemeConfig['colors'],
                                    e.target.value
                                  )
                                }
                                className="flex-1 px-3 py-1 text-sm border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800"
                              />
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'fonts' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Typography</h3>
                    <div className="space-y-4">
                      {Object.entries(customTheme.fonts).map(([key, value]) => (
                        <div key={key} className="space-y-2">
                          <label className="text-sm font-medium capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()} Font
                          </label>
                          <select
                            value={value}
                            onChange={e =>
                              handleFontChange(
                                key as keyof ThemeConfig['fonts'],
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800"
                          >
                            <option value="Inter">Inter</option>
                            <option value="Poppins">Poppins</option>
                            <option value="Roboto">Roboto</option>
                            <option value="Open Sans">Open Sans</option>
                            <option value="Lato">Lato</option>
                            <option value="Montserrat">Montserrat</option>
                            <option value="JetBrains Mono">
                              JetBrains Mono
                            </option>
                            <option value="Fira Code">Fira Code</option>
                            <option value="Orbitron">Orbitron</option>
                            <option value="Rajdhani">Rajdhani</option>
                          </select>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'effects' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Visual Effects
                    </h3>
                    <div className="space-y-4">
                      {Object.entries(customTheme.effects).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                          >
                            <div>
                              <div className="font-medium capitalize">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {key === 'blur' &&
                                  'Enable blur effects for glass morphism'}
                                {key === 'animations' &&
                                  'Enable smooth transitions and animations'}
                                {key === 'shadows' &&
                                  'Enable drop shadows and depth effects'}
                                {key === 'glass' &&
                                  'Enable glass morphism effects'}
                              </div>
                            </div>
                            <button
                              onClick={() =>
                                handleEffectToggle(
                                  key as keyof ThemeConfig['effects'],
                                  !value
                                )
                              }
                              className={`w-12 h-6 rounded-full transition-colors ${
                                value
                                  ? 'bg-blue-500'
                                  : 'bg-gray-300 dark:bg-gray-600'
                              }`}
                            >
                              <div
                                className={`w-5 h-5 bg-white rounded-full transition-transform ${
                                  value ? 'translate-x-6' : 'translate-x-0.5'
                                }`}
                              />
                            </button>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'wallpaper' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Wallpaper</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Wallpaper Type
                        </label>
                        <select
                          value={customTheme.wallpaper.type}
                          onChange={e =>
                            handleWallpaperChange(
                              e.target
                                .value as ThemeConfig['wallpaper']['type'],
                              customTheme.wallpaper.value
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800"
                        >
                          <option value="solid">Solid Color</option>
                          <option value="gradient">Gradient</option>
                          <option value="image">Image</option>
                          <option value="video">Video</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          {customTheme.wallpaper.type === 'solid'
                            ? 'Color'
                            : customTheme.wallpaper.type === 'gradient'
                              ? 'Gradient'
                              : customTheme.wallpaper.type === 'image'
                                ? 'Image URL'
                                : 'Video URL'}
                        </label>
                        {customTheme.wallpaper.type === 'solid' ? (
                          <input
                            type="color"
                            value={customTheme.wallpaper.value}
                            onChange={e =>
                              handleWallpaperChange('solid', e.target.value)
                            }
                            className="w-full h-12 rounded border border-gray-200 dark:border-gray-700"
                          />
                        ) : (
                          <input
                            type="text"
                            value={customTheme.wallpaper.value}
                            onChange={e =>
                              handleWallpaperChange(
                                customTheme.wallpaper.type,
                                e.target.value
                              )
                            }
                            placeholder={
                              customTheme.wallpaper.type === 'gradient'
                                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                : customTheme.wallpaper.type === 'image'
                                  ? 'https://example.com/image.jpg'
                                  : 'https://example.com/video.mp4'
                            }
                            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <div className="flex items-center gap-2">
            <button
              onClick={exportTheme}
              className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export
            </button>

            <label className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer">
              <Upload className="w-4 h-4" />
              Import
              <input
                type="file"
                accept=".json"
                onChange={importTheme}
                className="hidden"
              />
            </label>

            <button
              onClick={resetTheme}
              className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={applyCustomTheme}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Check className="w-4 h-4" />
              Apply Theme
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeCustomizer;
