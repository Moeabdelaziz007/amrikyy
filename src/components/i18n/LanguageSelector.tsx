import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Globe, 
  Languages, 
  Check, 
  Search, 
  Download, 
  Upload,
  Settings,
  FileText,
  Users,
  Calendar,
  Clock,
  MapPin,
  Flag,
  ArrowRight,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  rtl: boolean;
  coverage: number; // percentage of translated content
  lastUpdated: Date;
  contributors: number;
  status: 'complete' | 'partial' | 'incomplete' | 'missing';
}

interface Translation {
  id: string;
  key: string;
  category: 'ui' | 'content' | 'error' | 'notification';
  source: string;
  target: string;
  language: string;
  status: 'translated' | 'needs_review' | 'missing' | 'outdated';
  translator: string;
  lastModified: Date;
}

interface LanguageSettings {
  defaultLanguage: string;
  fallbackLanguage: string;
  autoDetect: boolean;
  saveUserPreference: boolean;
  showNativeNames: boolean;
  enableRTL: boolean;
  dateFormat: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
  timeFormat: '12h' | '24h';
  numberFormat: 'US' | 'EU' | 'IN';
  currency: string;
}

export const LanguageSelector: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'languages' | 'translations' | 'settings' | 'contributors'>('languages');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  // Mock data - in production, this would come from Firebase
  const [languages] = useState<Language[]>([
    {
      code: 'en',
      name: 'English',
      nativeName: 'English',
      flag: '🇺🇸',
      rtl: false,
      coverage: 100,
      lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      contributors: 5,
      status: 'complete'
    },
    {
      code: 'es',
      name: 'Spanish',
      nativeName: 'Español',
      flag: '🇪🇸',
      rtl: false,
      coverage: 85,
      lastUpdated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      contributors: 3,
      status: 'partial'
    },
    {
      code: 'fr',
      name: 'French',
      nativeName: 'Français',
      flag: '🇫🇷',
      rtl: false,
      coverage: 72,
      lastUpdated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      contributors: 2,
      status: 'partial'
    },
    {
      code: 'de',
      name: 'German',
      nativeName: 'Deutsch',
      flag: '🇩🇪',
      rtl: false,
      coverage: 45,
      lastUpdated: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      contributors: 1,
      status: 'incomplete'
    },
    {
      code: 'ar',
      name: 'Arabic',
      nativeName: 'العربية',
      flag: '🇸🇦',
      rtl: true,
      coverage: 30,
      lastUpdated: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
      contributors: 1,
      status: 'incomplete'
    },
    {
      code: 'zh',
      name: 'Chinese',
      nativeName: '中文',
      flag: '🇨🇳',
      rtl: false,
      coverage: 15,
      lastUpdated: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      contributors: 0,
      status: 'missing'
    },
    {
      code: 'ja',
      name: 'Japanese',
      nativeName: '日本語',
      flag: '🇯🇵',
      rtl: false,
      coverage: 8,
      lastUpdated: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
      contributors: 0,
      status: 'missing'
    },
    {
      code: 'pt',
      name: 'Portuguese',
      nativeName: 'Português',
      flag: '🇵🇹',
      rtl: false,
      coverage: 60,
      lastUpdated: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      contributors: 2,
      status: 'partial'
    }
  ]);

  const [translations] = useState<Translation[]>([
    {
      id: '1',
      key: 'welcome.message',
      category: 'ui',
      source: 'Welcome to Amrikyy AIOS System',
      target: 'Bienvenido al Sistema Amrikyy AIOS',
      language: 'es',
      status: 'translated',
      translator: 'translator@example.com',
      lastModified: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    },
    {
      id: '2',
      key: 'dashboard.title',
      category: 'ui',
      source: 'Dashboard',
      target: 'Tableau de bord',
      language: 'fr',
      status: 'translated',
      translator: 'translator@example.com',
      lastModified: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    },
    {
      id: '3',
      key: 'error.network',
      category: 'error',
      source: 'Network connection failed',
      target: '',
      language: 'de',
      status: 'missing',
      translator: '',
      lastModified: new Date()
    },
    {
      id: '4',
      key: 'notification.success',
      category: 'notification',
      source: 'Operation completed successfully',
      target: 'العملية مكتملة بنجاح',
      language: 'ar',
      status: 'needs_review',
      translator: 'translator@example.com',
      lastModified: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    }
  ]);

  const [languageSettings, setLanguageSettings] = useState<LanguageSettings>({
    defaultLanguage: 'en',
    fallbackLanguage: 'en',
    autoDetect: true,
    saveUserPreference: true,
    showNativeNames: true,
    enableRTL: true,
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    numberFormat: 'US',
    currency: 'USD'
  });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete': return 'text-green-500';
      case 'partial': return 'text-yellow-500';
      case 'incomplete': return 'text-orange-500';
      case 'missing': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'partial': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'incomplete': return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'missing': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <Info className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTranslationStatusColor = (status: string) => {
    switch (status) {
      case 'translated': return 'text-green-500';
      case 'needs_review': return 'text-yellow-500';
      case 'missing': return 'text-red-500';
      case 'outdated': return 'text-orange-500';
      default: return 'text-gray-500';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'ui': return <Settings className="w-4 h-4" />;
      case 'content': return <FileText className="w-4 h-4" />;
      case 'error': return <AlertTriangle className="w-4 h-4" />;
      case 'notification': return <Info className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const filteredLanguages = languages.filter(lang => 
    lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lang.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTranslations = translations.filter(translation =>
    translation.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
    translation.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
    translation.target.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLanguageChange = (languageCode: string) => {
    setSelectedLanguage(languageCode);
    // In production, this would change the application language
    console.log('Changing language to:', languageCode);
  };

  const handleSettingChange = (key: keyof LanguageSettings, value: any) => {
    setLanguageSettings(prev => ({ ...prev, [key]: value }));
  };

  const downloadTranslations = (languageCode: string) => {
    // In production, this would download translation files
    console.log('Downloading translations for:', languageCode);
  };

  const uploadTranslations = (languageCode: string) => {
    // In production, this would upload translation files
    console.log('Uploading translations for:', languageCode);
  };

  const contributeTranslation = (translationId: string) => {
    // In production, this would open translation contribution interface
    console.log('Contributing to translation:', translationId);
  };

  if (loading) {
    return (
      <div className="language-selector">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading language settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="language-selector">
      <div className="language-header">
        <div className="header-content">
          <div className="header-title">
            <Globe className="header-icon" />
            <h1>Language & Localization</h1>
          </div>
          <div className="header-controls">
            <div className="current-language">
              <span className="current-flag">🇺🇸</span>
              <span className="current-name">English</span>
            </div>
          </div>
        </div>
      </div>

      <div className="language-tabs">
        <button 
          className={`tab ${activeTab === 'languages' ? 'active' : ''}`}
          onClick={() => setActiveTab('languages')}
        >
          <Languages className="tab-icon" />
          Languages
        </button>
        <button 
          className={`tab ${activeTab === 'translations' ? 'active' : ''}`}
          onClick={() => setActiveTab('translations')}
        >
          <FileText className="tab-icon" />
          Translations
        </button>
        <button 
          className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <Settings className="tab-icon" />
          Settings
        </button>
        <button 
          className={`tab ${activeTab === 'contributors' ? 'active' : ''}`}
          onClick={() => setActiveTab('contributors')}
        >
          <Users className="tab-icon" />
          Contributors
        </button>
      </div>

      <div className="language-content">
        {activeTab === 'languages' && (
          <div className="languages-tab">
            <div className="languages-header">
              <div className="search-box">
                <Search className="search-icon" />
                <input
                  type="text"
                  placeholder="Search languages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>

            <div className="languages-list">
              {filteredLanguages.map((language) => (
                <div 
                  key={language.code} 
                  className={`language-item ${selectedLanguage === language.code ? 'selected' : ''}`}
                  onClick={() => handleLanguageChange(language.code)}
                >
                  <div className="language-flag">
                    <span className="flag-emoji">{language.flag}</span>
                  </div>
                  <div className="language-info">
                    <div className="language-header">
                      <h4 className="language-name">{language.name}</h4>
                      <div className="language-badges">
                        <span className={`status-badge ${getStatusColor(language.status)}`}>
                          {getStatusIcon(language.status)}
                          {language.status}
                        </span>
                        {language.rtl && (
                          <span className="rtl-badge">RTL</span>
                        )}
                      </div>
                    </div>
                    <div className="language-details">
                      <span className="native-name">{language.nativeName}</span>
                      <span>Coverage: {language.coverage}%</span>
                      <span>Contributors: {language.contributors}</span>
                      <span>Updated: {language.lastUpdated.toLocaleDateString()}</span>
                    </div>
                    <div className="coverage-bar">
                      <div 
                        className="coverage-fill"
                        style={{ width: `${language.coverage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="language-actions">
                    {selectedLanguage === language.code && (
                      <Check className="w-5 h-5 text-green-500" />
                    )}
                    <button 
                      className="action-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadTranslations(language.code);
                      }}
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button 
                      className="action-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        uploadTranslations(language.code);
                      }}
                    >
                      <Upload className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'translations' && (
          <div className="translations-tab">
            <div className="translations-header">
              <div className="search-box">
                <Search className="search-icon" />
                <input
                  type="text"
                  placeholder="Search translations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>

            <div className="translations-list">
              {filteredTranslations.map((translation) => (
                <div key={translation.id} className="translation-item">
                  <div className="translation-icon">
                    {getCategoryIcon(translation.category)}
                  </div>
                  <div className="translation-info">
                    <div className="translation-header">
                      <h4 className="translation-key">{translation.key}</h4>
                      <div className="translation-badges">
                        <span className="category-badge">{translation.category}</span>
                        <span className={`status-badge ${getTranslationStatusColor(translation.status)}`}>
                          {translation.status}
                        </span>
                        <span className="language-badge">{translation.language}</span>
                      </div>
                    </div>
                    <div className="translation-content">
                      <div className="source-text">
                        <strong>Source:</strong> {translation.source}
                      </div>
                      <div className="target-text">
                        <strong>Target:</strong> {translation.target || 'Not translated'}
                      </div>
                    </div>
                    <div className="translation-details">
                      <span>Translator: {translation.translator || 'None'}</span>
                      <span>Modified: {translation.lastModified.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="translation-actions">
                    {translation.status === 'missing' && (
                      <button 
                        className="contribute-button"
                        onClick={() => contributeTranslation(translation.id)}
                      >
                        <ArrowRight className="w-4 h-4" />
                        Contribute
                      </button>
                    )}
                    {translation.status === 'needs_review' && (
                      <button className="review-button" title="Review language settings" aria-label="Review language settings">
                        <Check className="w-4 h-4" />
                        Review
                      </button>
                    )}
                    <button className="edit-button" title="Edit language settings" aria-label="Edit language settings">
                      <Settings className="w-4 h-4" />
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="settings-tab">
            <div className="language-settings">
              <h3>Language Settings</h3>
              <div className="settings-grid">
                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Default Language</h4>
                    <p>Primary language for the application</p>
                  </div>
                  <select 
                    value={languageSettings.defaultLanguage}
                    onChange={(e) => handleSettingChange('defaultLanguage', e.target.value)}
                    className="language-select"
                    title="Select default language"
                    aria-label="Select default language"
                  >
                    {languages.map(lang => (
                      <option key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Fallback Language</h4>
                    <p>Language to use when translation is missing</p>
                  </div>
                  <select 
                    value={languageSettings.fallbackLanguage}
                    onChange={(e) => handleSettingChange('fallbackLanguage', e.target.value)}
                    className="language-select"
                    title="Select fallback language"
                    aria-label="Select fallback language"
                  >
                    {languages.map(lang => (
                      <option key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Auto Detect Language</h4>
                    <p>Automatically detect user's preferred language</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={languageSettings.autoDetect}
                      onChange={(e) => handleSettingChange('autoDetect', e.target.checked)}
                      aria-label="Enable automatic language detection"
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Save User Preference</h4>
                    <p>Remember user's language choice</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={languageSettings.saveUserPreference}
                      onChange={(e) => handleSettingChange('saveUserPreference', e.target.checked)}
                      aria-label="Save user language preference"
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Show Native Names</h4>
                    <p>Display language names in their native script</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={languageSettings.showNativeNames}
                      onChange={(e) => handleSettingChange('showNativeNames', e.target.checked)}
                      aria-label="Show language names in native script"
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Enable RTL Support</h4>
                    <p>Support right-to-left languages</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={languageSettings.enableRTL}
                      onChange={(e) => handleSettingChange('enableRTL', e.target.checked)}
                      aria-label="Enable right-to-left language support"
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Date Format</h4>
                    <p>How dates are displayed</p>
                  </div>
                  <select 
                    value={languageSettings.dateFormat}
                    onChange={(e) => handleSettingChange('dateFormat', e.target.value)}
                    className="format-select"
                    title="Select date format"
                    aria-label="Select date format"
                  >
                    <option value="MM/DD/YYYY">MM/DD/YYYY (US)</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY (EU)</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD (ISO)</option>
                  </select>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Time Format</h4>
                    <p>How time is displayed</p>
                  </div>
                  <select 
                    value={languageSettings.timeFormat}
                    onChange={(e) => handleSettingChange('timeFormat', e.target.value)}
                    className="format-select"
                    title="Select time format"
                    aria-label="Select time format"
                  >
                    <option value="12h">12-hour (AM/PM)</option>
                    <option value="24h">24-hour</option>
                  </select>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Number Format</h4>
                    <p>How numbers are formatted</p>
                  </div>
                  <select 
                    value={languageSettings.numberFormat}
                    onChange={(e) => handleSettingChange('numberFormat', e.target.value)}
                    className="format-select"
                    title="Select number format"
                    aria-label="Select number format"
                  >
                    <option value="US">US (1,234.56)</option>
                    <option value="EU">EU (1.234,56)</option>
                    <option value="IN">India (1,23,456.78)</option>
                  </select>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Currency</h4>
                    <p>Default currency for financial displays</p>
                  </div>
                  <select 
                    value={languageSettings.currency}
                    onChange={(e) => handleSettingChange('currency', e.target.value)}
                    className="currency-select"
                    title="Select currency"
                    aria-label="Select currency"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="JPY">JPY (¥)</option>
                    <option value="CNY">CNY (¥)</option>
                    <option value="INR">INR (₹)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'contributors' && (
          <div className="contributors-tab">
            <div className="contributors-stats">
              <h3>Translation Contributors</h3>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-header">
                    <Users className="stat-icon" />
                    <span className="stat-label">Total Contributors</span>
                  </div>
                  <div className="stat-value">12</div>
                </div>
                <div className="stat-card">
                  <div className="stat-header">
                    <Languages className="stat-icon" />
                    <span className="stat-label">Languages Supported</span>
                  </div>
                  <div className="stat-value">{languages.length}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-header">
                    <FileText className="stat-icon" />
                    <span className="stat-label">Translations</span>
                  </div>
                  <div className="stat-value">{translations.length}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-header">
                    <CheckCircle className="stat-icon" />
                    <span className="stat-label">Completion Rate</span>
                  </div>
                  <div className="stat-value">68%</div>
                </div>
              </div>
            </div>

            <div className="contribute-section">
              <h3>Contribute Translations</h3>
              <div className="contribute-info">
                <p>Help make Amrikyy AIOS System accessible to users worldwide by contributing translations.</p>
                <div className="contribute-actions">
                  <button className="contribute-button primary">
                    <ArrowRight className="button-icon" />
                    Start Contributing
                  </button>
                  <button className="contribute-button secondary">
                    <Download className="button-icon" />
                    Download Translation Kit
                  </button>
                  <button className="contribute-button secondary">
                    <FileText className="button-icon" />
                    View Guidelines
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
