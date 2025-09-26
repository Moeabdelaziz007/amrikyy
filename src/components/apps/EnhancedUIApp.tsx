import { db } from '../../lib/firebase';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  getDocs,
  onSnapshot, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';

// Enhanced UI/UX App
export const EnhancedUIApp: React.FC = () => {
  const [themes, setThemes] = useState<any[]>([]);
  const [currentTheme, setCurrentTheme] = useState('dark');
  const [wallpapers, setWallpapers] = useState<any[]>([]);
  const [currentWallpaper, setCurrentWallpaper] = useState('default');
  const [layout, setLayout] = useState('grid');
  const [animations, setAnimations] = useState(true);
  const [soundEffects, setSoundEffects] = useState(false);
  const [personalization, setPersonalization] = useState({
    accentColor: '#00ff88',
    fontSize: 'medium',
    density: 'comfortable',
    language: 'en',
    timeFormat: '12h'
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
    if (user) {
      loadUserPreferences();
      loadThemes();
      loadWallpapers();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadUserPreferences = () => {
    if (!user) return;
    
    const prefsRef = collection(db, 'userPreferences');
    const q = query(prefsRef, where('userId', '==', user.uid));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const prefs = snapshot.docs[0].data();
        setCurrentTheme(prefs.theme || 'dark');
        setCurrentWallpaper(prefs.wallpaper || 'default');
        setLayout(prefs.layout || 'grid');
        setAnimations(prefs.animations !== false);
        setSoundEffects(prefs.soundEffects || false);
        setPersonalization(prefs.personalization || personalization);
      }
      setLoading(false);
    }, (error) => {
      console.error('Failed to load preferences:', error);
      setLoading(false);
    });

    return unsubscribe;
  };

  const loadThemes = () => {
    const themesData = [
      {
        id: 'dark',
        name: 'Dark Mode',
        description: 'Classic dark theme with neon accents',
        colors: {
          primary: '#00ff88',
          secondary: '#3b82f6',
          background: '#0a0a0a',
          surface: '#1a1a1a',
          text: '#ffffff'
        },
        preview: '🌙'
      },
      {
        id: 'light',
        name: 'Light Mode',
        description: 'Clean light theme with modern design',
        colors: {
          primary: '#3b82f6',
          secondary: '#10b981',
          background: '#ffffff',
          surface: '#f8fafc',
          text: '#1f2937'
        },
        preview: '☀️'
      },
      {
        id: 'cyberpunk',
        name: 'Cyberpunk',
        description: 'Futuristic neon cyberpunk theme',
        colors: {
          primary: '#ff0080',
          secondary: '#00ffff',
          background: '#000000',
          surface: '#1a0033',
          text: '#ffffff'
        },
        preview: '🤖'
      },
      {
        id: 'nature',
        name: 'Nature',
        description: 'Calming nature-inspired theme',
        colors: {
          primary: '#10b981',
          secondary: '#f59e0b',
          background: '#064e3b',
          surface: '#065f46',
          text: '#ffffff'
        },
        preview: '🌿'
      },
      {
        id: 'ocean',
        name: 'Ocean',
        description: 'Deep ocean blue theme',
        colors: {
          primary: '#06b6d4',
          secondary: '#3b82f6',
          background: '#0c4a6e',
          surface: '#075985',
          text: '#ffffff'
        },
        preview: '🌊'
      },
      {
        id: 'sunset',
        name: 'Sunset',
        description: 'Warm sunset orange theme',
        colors: {
          primary: '#f97316',
          secondary: '#ef4444',
          background: '#7c2d12',
          surface: '#9a3412',
          text: '#ffffff'
        },
        preview: '🌅'
      }
    ];
    setThemes(themesData);
  };

  const loadWallpapers = () => {
    const wallpapersData = [
      {
        id: 'default',
        name: 'Default',
        description: 'Dynamic gradient background',
        preview: '🎨',
        type: 'gradient'
      },
      {
        id: 'particles',
        name: 'Particles',
        description: 'Animated particle system',
        preview: '✨',
        type: 'particles'
      },
      {
        id: 'matrix',
        name: 'Matrix',
        description: 'Digital rain effect',
        preview: '🔢',
        type: 'matrix'
      },
      {
        id: 'stars',
        name: 'Stars',
        description: 'Twinkling starfield',
        preview: '⭐',
        type: 'stars'
      },
      {
        id: 'waves',
        name: 'Waves',
        description: 'Animated wave patterns',
        preview: '🌊',
        type: 'waves'
      },
      {
        id: 'geometric',
        name: 'Geometric',
        description: 'Abstract geometric shapes',
        preview: '🔷',
        type: 'geometric'
      }
    ];
    setWallpapers(wallpapersData);
  };

  const savePreferences = async () => {
    if (!user) return;

    try {
      const prefsData = {
        userId: user.uid,
        theme: currentTheme,
        wallpaper: currentWallpaper,
        layout,
        animations,
        soundEffects,
        personalization,
        updatedAt: serverTimestamp()
      };

      const prefsRef = collection(db, 'userPreferences');
      const q = query(prefsRef, where('userId', '==', user.uid));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        await addDoc(prefsRef, prefsData);
      } else {
        await updateDoc(doc(db, 'userPreferences', snapshot.docs[0].id), prefsData);
      }

      // Apply theme to document
      applyTheme(currentTheme);
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  };

  const applyTheme = (themeId: string) => {
    const theme = themes.find(t => t.id === themeId);
    if (!theme) return;

    const root = document.documentElement;
    root.style.setProperty('--primary-color', theme.colors.primary);
    root.style.setProperty('--secondary-color', theme.colors.secondary);
    root.style.setProperty('--background-color', theme.colors.background);
    root.style.setProperty('--surface-color', theme.colors.surface);
    root.style.setProperty('--text-color', theme.colors.text);
  };

  const applyWallpaper = (wallpaperId: string) => {
    const wallpaper = wallpapers.find(w => w.id === wallpaperId);
    if (!wallpaper) return;

    const body = document.body;
    body.className = body.className.replace(/wallpaper-\w+/g, '');
    body.classList.add(`wallpaper-${wallpaper.type}`);
  };

  const handleThemeChange = (themeId: string) => {
    setCurrentTheme(themeId);
    applyTheme(themeId);
  };

  const handleWallpaperChange = (wallpaperId: string) => {
    setCurrentWallpaper(wallpaperId);
    applyWallpaper(wallpaperId);
  };

  const handlePersonalizationChange = (key: string, value: string) => {
    setPersonalization(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="enhanced-ui-app">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading UI preferences...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="enhanced-ui-app">
        <div className="auth-required">
          <h2>🔐 Authentication Required</h2>
          <p>Please sign in to access UI customization</p>
          <button 
            className="auth-btn"
            onClick={() => window.location.reload()}
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="enhanced-ui-app">
      <div className="ui-header">
        <h2>🎨 Enhanced UI/UX</h2>
        <div className="header-actions">
          <button 
            className="save-btn"
            onClick={savePreferences}
          >
            💾 Save Preferences
          </button>
        </div>
      </div>

      {/* Theme Selection */}
      <div className="ui-section">
        <h3>🎨 Themes</h3>
        <div className="themes-grid">
          {themes.map(theme => (
            <div 
              key={theme.id} 
              className={`theme-card ${currentTheme === theme.id ? 'active' : ''}`}
              onClick={() => handleThemeChange(theme.id)}
            >
              <div className="theme-preview" style={{ backgroundColor: theme.colors.background }}>
                <div className="theme-preview-content">
                  <div className="theme-preview-primary" style={{ backgroundColor: theme.colors.primary }}></div>
                  <div className="theme-preview-secondary" style={{ backgroundColor: theme.colors.secondary }}></div>
                  <div className="theme-preview-surface" style={{ backgroundColor: theme.colors.surface }}></div>
                </div>
                <div className="theme-icon">{theme.preview}</div>
              </div>
              <div className="theme-info">
                <h4>{theme.name}</h4>
                <p>{theme.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Wallpaper Selection */}
      <div className="ui-section">
        <h3>🖼️ Wallpapers</h3>
        <div className="wallpapers-grid">
          {wallpapers.map(wallpaper => (
            <div 
              key={wallpaper.id} 
              className={`wallpaper-card ${currentWallpaper === wallpaper.id ? 'active' : ''}`}
              onClick={() => handleWallpaperChange(wallpaper.id)}
            >
              <div className="wallpaper-preview">
                <div className="wallpaper-icon">{wallpaper.preview}</div>
              </div>
              <div className="wallpaper-info">
                <h4>{wallpaper.name}</h4>
                <p>{wallpaper.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Layout Options */}
      <div className="ui-section">
        <h3>📐 Layout</h3>
        <div className="layout-options">
          <div className="layout-option">
            <label>
              <input
                type="radio"
                name="layout"
                value="grid"
                checked={layout === 'grid'}
                onChange={(e) => setLayout(e.target.value)}
              />
              <span className="layout-preview grid">
                <div className="grid-item"></div>
                <div className="grid-item"></div>
                <div className="grid-item"></div>
                <div className="grid-item"></div>
              </span>
              Grid Layout
            </label>
          </div>
          <div className="layout-option">
            <label>
              <input
                type="radio"
                name="layout"
                value="list"
                checked={layout === 'list'}
                onChange={(e) => setLayout(e.target.value)}
              />
              <span className="layout-preview list">
                <div className="list-item"></div>
                <div className="list-item"></div>
                <div className="list-item"></div>
              </span>
              List Layout
            </label>
          </div>
          <div className="layout-option">
            <label>
              <input
                type="radio"
                name="layout"
                value="compact"
                checked={layout === 'compact'}
                onChange={(e) => setLayout(e.target.value)}
              />
              <span className="layout-preview compact">
                <div className="compact-item"></div>
                <div className="compact-item"></div>
                <div className="compact-item"></div>
                <div className="compact-item"></div>
                <div className="compact-item"></div>
                <div className="compact-item"></div>
              </span>
              Compact Layout
            </label>
          </div>
        </div>
      </div>

      {/* Personalization */}
      <div className="ui-section">
        <h3>⚙️ Personalization</h3>
        <div className="personalization-grid">
          <div className="personalization-item">
            <label>Accent Color</label>
            <input
              type="color"
              value={personalization.accentColor}
              onChange={(e) => handlePersonalizationChange('accentColor', e.target.value)}
            />
          </div>
          <div className="personalization-item">
            <label>Font Size</label>
            <select aria-label="Select option"
              value={personalization.fontSize}
              onChange={(e) => handlePersonalizationChange('fontSize', e.target.value)}
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>
          <div className="personalization-item">
            <label>Density</label>
            <select aria-label="Select option"
              value={personalization.density}
              onChange={(e) => handlePersonalizationChange('density', e.target.value)}
            >
              <option value="compact">Compact</option>
              <option value="comfortable">Comfortable</option>
              <option value="spacious">Spacious</option>
            </select>
          </div>
          <div className="personalization-item">
            <label>Language</label>
            <select aria-label="Select option"
              value={personalization.language}
              onChange={(e) => handlePersonalizationChange('language', e.target.value)}
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>
          <div className="personalization-item">
            <label>Time Format</label>
            <select aria-label="Select option"
              value={personalization.timeFormat}
              onChange={(e) => handlePersonalizationChange('timeFormat', e.target.value)}
            >
              <option value="12h">12 Hour</option>
              <option value="24h">24 Hour</option>
            </select>
          </div>
        </div>
      </div>

      {/* Accessibility & Effects */}
      <div className="ui-section">
        <h3>♿ Accessibility & Effects</h3>
        <div className="effects-grid">
          <div className="effect-item">
            <label>
              <input
                type="checkbox"
                checked={animations}
                onChange={(e) => setAnimations(e.target.checked)}
              />
              <span>Animations</span>
            </label>
          </div>
          <div className="effect-item">
            <label>
              <input
                type="checkbox"
                checked={soundEffects}
                onChange={(e) => setSoundEffects(e.target.checked)}
              />
              <span>Sound Effects</span>
            </label>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="ui-section">
        <h3>👁️ Preview</h3>
        <div className="preview-container">
          <div className="preview-desktop">
            <div className="preview-apps">
              <div className="preview-app"></div>
              <div className="preview-app"></div>
              <div className="preview-app"></div>
              <div className="preview-app"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
