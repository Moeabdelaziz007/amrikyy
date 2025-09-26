import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './AuthContext';

interface UserSettings {
  theme: 'dark' | 'light' | 'auto';
  wallpaper: string;
  desktopLayout: 'grid' | 'list' | 'compact';
  animations: boolean;
  soundEffects: boolean;
  notifications: boolean;
  autoStart: string[];
  widgets: {
    weather: boolean;
    calendar: boolean;
    systemStats: boolean;
    quickNotes: boolean;
  };
  shortcuts: {
    [key: string]: string;
  };
}

interface UserSettingsContextType {
  settings: UserSettings;
  updateSetting: (key: keyof UserSettings, value: any) => Promise<void>;
  updateWidget: (widget: keyof UserSettings['widgets'], enabled: boolean) => Promise<void>;
  addShortcut: (key: string, appId: string) => Promise<void>;
  removeShortcut: (key: string) => Promise<void>;
  loading: boolean;
}

const UserSettingsContext = createContext<UserSettingsContextType | undefined>(undefined);

export const useUserSettings = () => {
  const context = useContext(UserSettingsContext);
  if (!context) {
    throw new Error('useUserSettings must be used within a UserSettingsProvider');
  }
  return context;
};

const defaultSettings: UserSettings = {
  theme: 'dark',
  wallpaper: 'default',
  desktopLayout: 'grid',
  animations: true,
  soundEffects: true,
  notifications: true,
  autoStart: [],
  widgets: {
    weather: true,
    calendar: true,
    systemStats: true,
    quickNotes: false,
  },
  shortcuts: {
    'ctrl+1': 'dashboard',
    'ctrl+2': 'ai-agents',
    'ctrl+3': 'automation',
  },
};

interface UserSettingsProviderProps {
  children: React.ReactNode;
}

export const UserSettingsProvider: React.FC<UserSettingsProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
    if (user) {
      loadUserSettings();
    } else {
      setSettings(defaultSettings);
      setLoading(false);
    }
  }, [user]);

  const loadUserSettings = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setSettings({ ...defaultSettings, ...userData.settings });
      } else {
        // Create new user document with default settings
        await setDoc(doc(db, 'users', user.uid), {
          settings: defaultSettings,
          createdAt: new Date(),
          lastLogin: new Date(),
        });
        setSettings(defaultSettings);
      }
    } catch (error) {
      console.error('Error loading user settings:', error);
      setSettings(defaultSettings);
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key: keyof UserSettings, value: any) => {
    if (!user) return;

    try {
      const newSettings = { ...settings, [key]: value };
      setSettings(newSettings);
      
      await updateDoc(doc(db, 'users', user.uid), {
        [`settings.${key}`]: value,
        lastUpdated: new Date(),
      });
    } catch (error) {
      console.error('Error updating setting:', error);
      // Revert on error
      setSettings(settings);
    }
  };

  const updateWidget = async (widget: keyof UserSettings['widgets'], enabled: boolean) => {
    if (!user) return;

    try {
      const newWidgets = { ...settings.widgets, [widget]: enabled };
      const newSettings = { ...settings, widgets: newWidgets };
      setSettings(newSettings);
      
      await updateDoc(doc(db, 'users', user.uid), {
        [`settings.widgets.${widget}`]: enabled,
        lastUpdated: new Date(),
      });
    } catch (error) {
      console.error('Error updating widget:', error);
    }
  };

  const addShortcut = async (key: string, appId: string) => {
    if (!user) return;

    try {
      const newShortcuts = { ...settings.shortcuts, [key]: appId };
      const newSettings = { ...settings, shortcuts: newShortcuts };
      setSettings(newSettings);
      
      await updateDoc(doc(db, 'users', user.uid), {
        [`settings.shortcuts.${key}`]: appId,
        lastUpdated: new Date(),
      });
    } catch (error) {
      console.error('Error adding shortcut:', error);
    }
  };

  const removeShortcut = async (key: string) => {
    if (!user) return;

    try {
      const newShortcuts = { ...settings.shortcuts };
      delete newShortcuts[key];
      const newSettings = { ...settings, shortcuts: newShortcuts };
      setSettings(newSettings);
      
      await updateDoc(doc(db, 'users', user.uid), {
        [`settings.shortcuts.${key}`]: null,
        lastUpdated: new Date(),
      });
    } catch (error) {
      console.error('Error removing shortcut:', error);
    }
  };

  const value: UserSettingsContextType = {
    settings,
    updateSetting,
    updateWidget,
    addShortcut,
    removeShortcut,
    loading,
  };

  return (
    <UserSettingsContext.Provider value={value}>
      {children}
    </UserSettingsContext.Provider>
  );
};
