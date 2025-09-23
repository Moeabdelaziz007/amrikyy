import { useState } from 'react';
import {
  Settings,
  Palette,
  Bell,
  Shield,
  Monitor,
  User,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WALLPAPER_THEMES, WallpaperTheme } from '../os/WallpaperManager';
import { useWallpaper } from '../../contexts/WallpaperContext';

export const SettingsApp = () => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [brightness, setBrightness] = useState([80]);
  const [volume, setVolume] = useState([70]);
  const [selectedWallpaper, setSelectedWallpaper] = useState('aurora');

  const {
    currentWallpaper,
    setCurrentWallpaper,
    timeBasedWallpaper,
    setTimeBasedWallpaper,
    timeOfDay,
  } = useWallpaper();

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-900/20 to-gray-900/20">
      {/* Header */}
      <div className="p-4 border-b border-white/10 glass">
        <div className="flex items-center gap-3">
          <Settings className="w-6 h-6 text-primary" />
          <div>
            <h2 className="text-xl font-semibold">System Settings</h2>
            <p className="text-sm text-muted-foreground">
              Customize your AuraOS experience
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-auto">
        <Tabs defaultValue="appearance" className="w-full">
          <TabsList className="grid w-full grid-cols-4 glass border-white/20">
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Appearance
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="flex items-center gap-2"
            >
              <Bell className="w-4 h-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Privacy
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-2">
              <Monitor className="w-4 h-4" />
              System
            </TabsTrigger>
          </TabsList>

          <TabsContent value="appearance" className="space-y-4 mt-4">
            <Card className="glass border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Theme Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Dark Mode</h4>
                    <p className="text-sm text-muted-foreground">
                      Enable dark theme
                    </p>
                  </div>
                  <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Brightness</label>
                  <Slider
                    value={brightness}
                    onValueChange={setBrightness}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    {brightness[0]}%
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Time-based Wallpaper</h4>
                    <p className="text-sm text-muted-foreground">
                      Automatically change wallpaper based on time of day
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Current time: {timeOfDay} mode
                    </p>
                  </div>
                  <Switch
                    checked={timeBasedWallpaper}
                    onCheckedChange={setTimeBasedWallpaper}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Wallpaper Themes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {WALLPAPER_THEMES.map(theme => (
                    <div
                      key={theme.id}
                      className={`relative aspect-video rounded-lg cursor-pointer transition-all duration-300 ${
                        currentWallpaper === theme.id
                          ? 'ring-2 ring-primary/70 shadow-lg scale-105'
                          : 'hover:ring-2 hover:ring-primary/30 hover:scale-102'
                      }`}
                      onClick={() => {
                        setSelectedWallpaper(theme.id);
                        setCurrentWallpaper(theme.id);
                      }}
                      style={{
                        background: `linear-gradient(135deg, ${theme.colors.join(', ')})`,
                      }}
                    >
                      {/* Theme preview overlay */}
                      <div className="absolute inset-0 rounded-lg bg-black/20 flex items-center justify-center">
                        <div className="text-center text-white/90">
                          <div className="text-sm font-medium">
                            {theme.name}
                          </div>
                          <div className="text-xs opacity-75 capitalize">
                            {theme.type}
                          </div>
                        </div>
                      </div>

                      {/* Selection indicator */}
                      {currentWallpaper === theme.id && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                      )}

                      {/* Animation indicator */}
                      {theme.type === 'animated' && (
                        <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 rounded text-xs text-white/80">
                          ✨ Animated
                        </div>
                      )}

                      {/* Particle indicator */}
                      {theme.type === 'particle' && (
                        <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 rounded text-xs text-white/80">
                          ⭐ Particles
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Current wallpaper info */}
                <div className="mt-4 p-3 bg-black/20 rounded-lg">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>
                      Current:{' '}
                      {
                        WALLPAPER_THEMES.find(t => t.id === currentWallpaper)
                          ?.name
                      }
                    </span>
                    {timeBasedWallpaper && (
                      <span className="text-primary">• Auto-changing</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4 mt-4">
            <Card className="glass border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notification Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Enable Notifications</h4>
                    <p className="text-sm text-muted-foreground">
                      Receive system notifications
                    </p>
                  </div>
                  <Switch
                    checked={notifications}
                    onCheckedChange={setNotifications}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Volume</label>
                  <Slider
                    value={volume}
                    onValueChange={setVolume}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">{volume[0]}%</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-4 mt-4">
            <Card className="glass border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Privacy & Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Auto-save Data</h4>
                    <p className="text-sm text-muted-foreground">
                      Automatically save your work
                    </p>
                  </div>
                  <Switch checked={autoSave} onCheckedChange={setAutoSave} />
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Data Collection</h4>
                  <p className="text-sm text-muted-foreground">
                    We collect minimal data to improve your experience. Your
                    data is encrypted and secure.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-4 mt-4">
            <Card className="glass border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="w-5 h-5" />
                  System Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">OS Version:</span>
                    <p className="font-medium">AuraOS 2.1.0</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Build:</span>
                    <p className="font-medium">2024.1.0</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">AI Engine:</span>
                    <p className="font-medium">Amrikyy AI v3.0</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Last Update:</span>
                    <p className="font-medium">Today</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 glass border-white/20"
                  >
                    Check Updates
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 glass border-white/20"
                  >
                    Restart System
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
