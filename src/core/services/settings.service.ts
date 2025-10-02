import { IService } from '../types/os';
import { db } from '../../lib/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { authService } from './auth.service';

export type UserSettings = {
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
  shortcuts: Record<string, string>;
};

const defaultSettings: UserSettings = {
  theme: 'dark',
  wallpaper: 'default',
  desktopLayout: 'grid',
  animations: true,
  soundEffects: true,
  notifications: true,
  autoStart: [],
  widgets: { weather: true, calendar: true, systemStats: true, quickNotes: false },
  shortcuts: { 'ctrl+1': 'dashboard', 'ctrl+2': 'ai-agents', 'ctrl+3': 'automation' },
};

type SettingsListener = (settings: UserSettings) => void;

export class SettingsService implements IService {
  public readonly name = 'settings';
  private settings: UserSettings = defaultSettings;
  private listeners: Set<SettingsListener> = new Set();

  async start(): Promise<void> {
    const user = authService.getUser();
    if (!user) return;
    await this.load(user.uid);
  }

  get(): UserSettings {
    return this.settings;
  }

  subscribe(cb: SettingsListener): () => void {
    this.listeners.add(cb);
    cb(this.settings);
    return () => this.listeners.delete(cb);
  }

  private notify(): void {
    for (const cb of this.listeners) cb(this.settings);
  }

  async load(uid: string): Promise<void> {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const data = userDoc.data() as { settings?: Partial<UserSettings> };
        this.settings = { ...defaultSettings, ...(data.settings || {}) };
      } else {
        await setDoc(doc(db, 'users', uid), { settings: defaultSettings, createdAt: new Date(), lastLogin: new Date() });
        this.settings = defaultSettings;
      }
      this.notify();
    } catch {
      this.settings = defaultSettings;
      this.notify();
    }
  }

  async set<K extends keyof UserSettings>(key: K, value: UserSettings[K]): Promise<void> {
    const user = authService.getUser();
    if (!user) return;
    this.settings = { ...this.settings, [key]: value } as UserSettings;
    this.notify();
    await updateDoc(doc(db, 'users', user.uid), { [`settings.${String(key)}`]: value, lastUpdated: new Date() });
  }

  async setWidget(widget: keyof UserSettings['widgets'], enabled: boolean): Promise<void> {
    const user = authService.getUser();
    if (!user) return;
    this.settings = { ...this.settings, widgets: { ...this.settings.widgets, [widget]: enabled } };
    this.notify();
    await updateDoc(doc(db, 'users', user.uid), { [`settings.widgets.${widget}`]: enabled, lastUpdated: new Date() });
  }
}

export const settingsService = new SettingsService();


