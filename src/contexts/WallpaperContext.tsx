import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

export interface WallpaperTheme {
  id: string;
  name: string;
  type: 'gradient' | 'animated' | 'particle';
  colors: string[];
  animation?: {
    duration: number;
    direction: 'horizontal' | 'vertical' | 'radial' | 'diagonal';
  };
  particles?: {
    count: number;
    speed: number;
    size: number;
  };
}

const WALLPAPER_THEMES: WallpaperTheme[] = [
  {
    id: 'aurora',
    name: 'Aurora Borealis',
    type: 'animated',
    colors: ['#0f0f23', '#1a1a2e', '#16213e', '#0f3460', '#533483'],
    animation: { duration: 20, direction: 'radial' },
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk Neon',
    type: 'animated',
    colors: ['#0a0a0a', '#1a0033', '#330066', '#6600cc', '#00ff88'],
    animation: { duration: 15, direction: 'diagonal' },
  },
  {
    id: 'sunset',
    name: 'Digital Sunset',
    type: 'animated',
    colors: ['#ff6b6b', '#ffa726', '#ffcc02', '#4ecdc4', '#45b7d1'],
    animation: { duration: 25, direction: 'horizontal' },
  },
  {
    id: 'ocean',
    name: 'Deep Ocean',
    type: 'animated',
    colors: ['#001122', '#003366', '#0066aa', '#0099ff', '#00ccff'],
    animation: { duration: 30, direction: 'vertical' },
  },
  {
    id: 'matrix',
    name: 'Matrix Code',
    type: 'particle',
    colors: ['#000000', '#001100', '#003300', '#00ff00'],
    particles: { count: 50, speed: 2, size: 2 },
  },
  {
    id: 'galaxy',
    name: 'Galaxy Spiral',
    type: 'animated',
    colors: ['#000000', '#1a0033', '#330066', '#6600cc', '#9900ff'],
    animation: { duration: 40, direction: 'radial' },
  },
];

interface WallpaperContextType {
  currentWallpaper: string;
  setCurrentWallpaper: (themeId: string) => void;
  availableThemes: WallpaperTheme[];
  timeBasedWallpaper: boolean;
  setTimeBasedWallpaper: (enabled: boolean) => void;
  timeOfDay: 'day' | 'night';
}

const WallpaperContext = createContext<WallpaperContextType | undefined>(
  undefined
);

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

export const WallpaperProvider: React.FC<WallpaperProviderProps> = ({
  children,
}) => {
  const [currentWallpaper, setCurrentWallpaper] = useState('aurora');
  const [timeBasedWallpaper, setTimeBasedWallpaper] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState<'day' | 'night'>('day');

  // Update time of day and apply time-based wallpaper changes
  useEffect(() => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
    const updateTimeOfDay = () => {
      const hour = new Date().getHours();
      const newTimeOfDay = hour >= 6 && hour < 18 ? 'day' : 'night';
      setTimeOfDay(newTimeOfDay);

      // Apply time-based wallpaper if enabled
      if (timeBasedWallpaper) {
        const timeBasedThemes = {
          day: ['sunset', 'ocean', 'aurora'],
          night: ['cyberpunk', 'matrix', 'galaxy'],
        };

        const availableThemes = timeBasedThemes[newTimeOfDay];
        const randomTheme =
          availableThemes[Math.floor(Math.random() * availableThemes.length)];
        setCurrentWallpaper(randomTheme);
      }
    };

    updateTimeOfDay();
    const interval = setInterval(updateTimeOfDay, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [timeBasedWallpaper]);

  // Load saved preferences from localStorage
  useEffect(() => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
    localStorage.setItem('auraos-wallpaper', currentWallpaper);
  }, [currentWallpaper]);

  useEffect(() => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
    localStorage.setItem(
      'auraos-time-based-wallpaper',
      JSON.stringify(timeBasedWallpaper)
    );
  }, [timeBasedWallpaper]);

  const value: WallpaperContextType = {
    currentWallpaper,
    setCurrentWallpaper,
    availableThemes: WALLPAPER_THEMES,
    timeBasedWallpaper,
    setTimeBasedWallpaper,
    timeOfDay,
  };

  return (
    <WallpaperContext.Provider value={value}>
      {children}
    </WallpaperContext.Provider>
  );
};