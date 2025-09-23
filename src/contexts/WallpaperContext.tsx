import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { WALLPAPER_THEMES, WallpaperTheme } from '../components/os/WallpaperManager';

interface WallpaperContextType {
  currentWallpaper: string;
  setCurrentWallpaper: (themeId: string) => void;
  availableThemes: WallpaperTheme[];
  timeBasedWallpaper: boolean;
  setTimeBasedWallpaper: (enabled: boolean) => void;
  timeOfDay: 'day' | 'night';
}

const WallpaperContext = createContext<WallpaperContextType | undefined>(undefined);

export const useWallpaper = () => {
  const context = useContext(WallpaperContext);
  if (!context) {
    throw new Error('useWallpaper must be used within a WallpaperProvider');
  }
  return context;
};

interface WallpaperProviderProps {
  children: ReactNode;
}

export const WallpaperProvider: React.FC<WallpaperProviderProps> = ({ children }) => {
  const [currentWallpaper, setCurrentWallpaper] = useState('aurora');
  const [timeBasedWallpaper, setTimeBasedWallpaper] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState<'day' | 'night'>('day');

  // Update time of day and apply time-based wallpaper changes
  useEffect(() => {
    const updateTimeOfDay = () => {
      const hour = new Date().getHours();
      const newTimeOfDay = hour >= 6 && hour < 18 ? 'day' : 'night';
      setTimeOfDay(newTimeOfDay);

      // Apply time-based wallpaper if enabled
      if (timeBasedWallpaper) {
        const timeBasedThemes = {
          day: ['sunset', 'ocean', 'aurora'],
          night: ['cyberpunk', 'matrix', 'galaxy']
        };
        
        const availableThemes = timeBasedThemes[newTimeOfDay];
        const randomTheme = availableThemes[Math.floor(Math.random() * availableThemes.length)];
        setCurrentWallpaper(randomTheme);
      }
    };

    updateTimeOfDay();
    const interval = setInterval(updateTimeOfDay, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [timeBasedWallpaper]);

  // Load saved preferences from localStorage
  useEffect(() => {
    const savedWallpaper = localStorage.getItem('auraos-wallpaper');
    const savedTimeBased = localStorage.getItem('auraos-time-based-wallpaper');
    
    if (savedWallpaper) {
      setCurrentWallpaper(savedWallpaper);
    }
    if (savedTimeBased) {
      setTimeBasedWallpaper(JSON.parse(savedTimeBased));
    }
  }, []);

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem('auraos-wallpaper', currentWallpaper);
  }, [currentWallpaper]);

  useEffect(() => {
    localStorage.setItem('auraos-time-based-wallpaper', JSON.stringify(timeBasedWallpaper));
  }, [timeBasedWallpaper]);

  const value: WallpaperContextType = {
    currentWallpaper,
    setCurrentWallpaper,
    availableThemes: WALLPAPER_THEMES,
    timeBasedWallpaper,
    setTimeBasedWallpaper,
    timeOfDay
  };

  return (
    <WallpaperContext.Provider value={value}>
      {children}
    </WallpaperContext.Provider>
  );
};
