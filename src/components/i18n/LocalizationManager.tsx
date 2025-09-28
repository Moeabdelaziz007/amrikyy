import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  MapPin, 
  Calendar, 
  Clock, 
  DollarSign, 
  Globe, 
  Settings,
  CheckCircle,
  AlertTriangle,
  Info,
  Edit,
  Save,
  RefreshCw,
  Download,
  Upload,
  Search,
  Filter,
  Plus,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react';

interface Locale {
  id: string;
  name: string;
  code: string;
  region: string;
  currency: string;
  timezone: string;
  dateFormat: string;
  timeFormat: string;
  numberFormat: string;
  firstDayOfWeek: number;
  measurement: 'metric' | 'imperial';
  temperature: 'celsius' | 'fahrenheit';
}

interface LocalizationRule {
  id: string;
  type: 'date' | 'time' | 'number' | 'currency' | 'text';
  pattern: string;
  example: string;
  description: string;
  locale: string;
  active: boolean;
}

interface CulturalSetting {
  id: string;
  category: 'business' | 'social' | 'religious' | 'holiday' | 'formatting';
  name: string;
  value: string;
  description: string;
  locale: string;
  impact: 'high' | 'medium' | 'low';
}

interface LocalizationSettings {
  autoDetect: boolean;
  fallbackLocale: string;
  enableRTL: boolean;
  enableCulturalAdaptation: boolean;
  enableRegionalFormatting: boolean;
  enableHolidayCalendar: boolean;
  enableBusinessHours: boolean;
  enableSocialNorms: boolean;
}

export const LocalizationManager: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'locales' | 'rules' | 'cultural' | 'settings'>('locales');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingLocale, setEditingLocale] = useState<string | null>(null);

  // Mock data - in production, this would come from Firebase
  const [locales] = useState<Locale[]>([
    {
      id: 'en-US',
      name: 'English (United States)',
      code: 'en-US',
      region: 'United States',
      currency: 'USD',
      timezone: 'America/New_York',
      dateFormat: 'MM/DD/YYYY',
      timeFormat: '12h',
      numberFormat: '1,234.56',
      firstDayOfWeek: 0,
      measurement: 'imperial',
      temperature: 'fahrenheit'
    },
    {
      id: 'en-GB',
      name: 'English (United Kingdom)',
      code: 'en-GB',
      region: 'United Kingdom',
      currency: 'GBP',
      timezone: 'Europe/London',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '24h',
      numberFormat: '1,234.56',
      firstDayOfWeek: 1,
      measurement: 'metric',
      temperature: 'celsius'
    },
    {
      id: 'es-ES',
      name: 'Spanish (Spain)',
      code: 'es-ES',
      region: 'Spain',
      currency: 'EUR',
      timezone: 'Europe/Madrid',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '24h',
      numberFormat: '1.234,56',
      firstDayOfWeek: 1,
      measurement: 'metric',
      temperature: 'celsius'
    },
    {
      id: 'fr-FR',
      name: 'French (France)',
      code: 'fr-FR',
      region: 'France',
      currency: 'EUR',
      timezone: 'Europe/Paris',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '24h',
      numberFormat: '1 234,56',
      firstDayOfWeek: 1,
      measurement: 'metric',
      temperature: 'celsius'
    },
    {
      id: 'de-DE',
      name: 'German (Germany)',
      code: 'de-DE',
      region: 'Germany',
      currency: 'EUR',
      timezone: 'Europe/Berlin',
      dateFormat: 'DD.MM.YYYY',
      timeFormat: '24h',
      numberFormat: '1.234,56',
      firstDayOfWeek: 1,
      measurement: 'metric',
      temperature: 'celsius'
    },
    {
      id: 'ar-SA',
      name: 'Arabic (Saudi Arabia)',
      code: 'ar-SA',
      region: 'Saudi Arabia',
      currency: 'SAR',
      timezone: 'Asia/Riyadh',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '12h',
      numberFormat: '١٬٢٣٤٫٥٦',
      firstDayOfWeek: 6,
      measurement: 'metric',
      temperature: 'celsius'
    },
    {
      id: 'zh-CN',
      name: 'Chinese (China)',
      code: 'zh-CN',
      region: 'China',
      currency: 'CNY',
      timezone: 'Asia/Shanghai',
      dateFormat: 'YYYY-MM-DD',
      timeFormat: '24h',
      numberFormat: '1,234.56',
      firstDayOfWeek: 1,
      measurement: 'metric',
      temperature: 'celsius'
    },
    {
      id: 'ja-JP',
      name: 'Japanese (Japan)',
      code: 'ja-JP',
      region: 'Japan',
      currency: 'JPY',
      timezone: 'Asia/Tokyo',
      dateFormat: 'YYYY/MM/DD',
      timeFormat: '24h',
      numberFormat: '1,234',
      firstDayOfWeek: 0,
      measurement: 'metric',
      temperature: 'celsius'
    }
  ]);

  const [localizationRules] = useState<LocalizationRule[]>([
    {
      id: '1',
      type: 'date',
      pattern: 'MM/DD/YYYY',
      example: '12/25/2023',
      description: 'US date format',
      locale: 'en-US',
      active: true
    },
    {
      id: '2',
      type: 'date',
      pattern: 'DD/MM/YYYY',
      example: '25/12/2023',
      description: 'European date format',
      locale: 'en-GB',
      active: true
    },
    {
      id: '3',
      type: 'time',
      pattern: 'HH:mm',
      example: '14:30',
      description: '24-hour time format',
      locale: 'en-GB',
      active: true
    },
    {
      id: '4',
      type: 'time',
      pattern: 'h:mm A',
      example: '2:30 PM',
      description: '12-hour time format',
      locale: 'en-US',
      active: true
    },
    {
      id: '5',
      type: 'number',
      pattern: '#,##0.00',
      example: '1,234.56',
      description: 'US number format',
      locale: 'en-US',
      active: true
    },
    {
      id: '6',
      type: 'number',
      pattern: '#.##0,00',
      example: '1.234,56',
      description: 'European number format',
      locale: 'de-DE',
      active: true
    },
    {
      id: '7',
      type: 'currency',
      pattern: '$#,##0.00',
      example: '$1,234.56',
      description: 'US dollar format',
      locale: 'en-US',
      active: true
    },
    {
      id: '8',
      type: 'currency',
      pattern: '#,##0.00 €',
      example: '1.234,56 €',
      description: 'Euro format',
      locale: 'de-DE',
      active: true
    }
  ]);

  const [culturalSettings] = useState<CulturalSetting[]>([
    {
      id: '1',
      category: 'business',
      name: 'Business Hours',
      value: '9:00 AM - 5:00 PM',
      description: 'Standard business hours',
      locale: 'en-US',
      impact: 'high'
    },
    {
      id: '2',
      category: 'business',
      name: 'Business Hours',
      value: '9:00 - 17:00',
      description: 'Standard business hours',
      locale: 'en-GB',
      impact: 'high'
    },
    {
      id: '3',
      category: 'holiday',
      name: 'New Year',
      value: 'January 1',
      description: 'New Year celebration',
      locale: 'en-US',
      impact: 'medium'
    },
    {
      id: '4',
      category: 'holiday',
      name: 'New Year',
      value: '1 January',
      description: 'New Year celebration',
      locale: 'en-GB',
      impact: 'medium'
    },
    {
      id: '5',
      category: 'social',
      name: 'Greeting',
      value: 'Hello',
      description: 'Standard greeting',
      locale: 'en-US',
      impact: 'low'
    },
    {
      id: '6',
      category: 'social',
      name: 'Greeting',
      value: 'Hola',
      description: 'Standard greeting',
      locale: 'es-ES',
      impact: 'low'
    },
    {
      id: '7',
      category: 'religious',
      name: 'Weekend',
      value: 'Saturday, Sunday',
      description: 'Weekend days',
      locale: 'en-US',
      impact: 'medium'
    },
    {
      id: '8',
      category: 'religious',
      name: 'Weekend',
      value: 'Friday, Saturday',
      description: 'Weekend days',
      locale: 'ar-SA',
      impact: 'medium'
    }
  ]);

  const [localizationSettings, setLocalizationSettings] = useState<LocalizationSettings>({
    autoDetect: true,
    fallbackLocale: 'en-US',
    enableRTL: true,
    enableCulturalAdaptation: true,
    enableRegionalFormatting: true,
    enableHolidayCalendar: true,
    enableBusinessHours: true,
    enableSocialNorms: true
  });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'date': return <Calendar className="w-4 h-4" />;
      case 'time': return <Clock className="w-4 h-4" />;
      case 'number': return <Settings className="w-4 h-4" />;
      case 'currency': return <DollarSign className="w-4 h-4" />;
      case 'text': return <Edit className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'business': return <Settings className="w-4 h-4" />;
      case 'social': return <Globe className="w-4 h-4" />;
      case 'religious': return <Info className="w-4 h-4" />;
      case 'holiday': return <Calendar className="w-4 h-4" />;
      case 'formatting': return <Edit className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const filteredLocales = locales.filter(locale =>
    locale.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    locale.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
    locale.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredRules = localizationRules.filter(rule =>
    rule.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rule.pattern.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rule.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCultural = culturalSettings.filter(setting =>
    setting.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    setting.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    setting.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSettingChange = (key: keyof LocalizationSettings, value: any) => {
    setLocalizationSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleLocaleEdit = (localeId: string) => {
    setEditingLocale(editingLocale === localeId ? null : localeId);
  };

  const saveLocale = (localeId: string) => {
    // In production, this would save the locale changes
    console.log('Saving locale:', localeId);
    setEditingLocale(null);
  };

  const exportLocalization = () => {
    // In production, this would export localization data
    console.log('Exporting localization data...');
  };

  const importLocalization = () => {
    // In production, this would import localization data
    console.log('Importing localization data...');
  };

  if (loading) {
    return (
      <div className="localization-manager">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading localization settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="localization-manager">
      <div className="localization-header">
        <div className="header-content">
          <div className="header-title">
            <MapPin className="header-icon" />
            <h1>Localization Manager</h1>
          </div>
          <div className="header-controls">
            <button className="action-button" onClick={exportLocalization}>
              <Download className="button-icon" />
              Export
            </button>
            <button className="action-button" onClick={importLocalization}>
              <Upload className="button-icon" />
              Import
            </button>
          </div>
        </div>
      </div>

      <div className="localization-tabs">
        <button 
          className={`tab ${activeTab === 'locales' ? 'active' : ''}`}
          onClick={() => setActiveTab('locales')}
        >
          <Globe className="tab-icon" />
          Locales
        </button>
        <button 
          className={`tab ${activeTab === 'rules' ? 'active' : ''}`}
          onClick={() => setActiveTab('rules')}
        >
          <Settings className="tab-icon" />
          Rules
        </button>
        <button 
          className={`tab ${activeTab === 'cultural' ? 'active' : ''}`}
          onClick={() => setActiveTab('cultural')}
        >
          <Info className="tab-icon" />
          Cultural
        </button>
        <button 
          className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <Settings className="tab-icon" />
          Settings
        </button>
      </div>

      <div className="localization-content">
        {activeTab === 'locales' && (
          <div className="locales-tab">
            <div className="locales-header">
              <div className="search-box">
                <Search className="search-icon" />
                <input
                  type="text"
                  placeholder="Search locales..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>

            <div className="locales-list">
              {filteredLocales.map((locale) => (
                <div key={locale.id} className="locale-item">
                  <div className="locale-info">
                    <div className="locale-header">
                      <h4 className="locale-name">{locale.name}</h4>
                      <span className="locale-code">{locale.code}</span>
                    </div>
                    <div className="locale-details">
                      <div className="detail-row">
                        <span className="detail-label">Region:</span>
                        <span className="detail-value">{locale.region}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Currency:</span>
                        <span className="detail-value">{locale.currency}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Timezone:</span>
                        <span className="detail-value">{locale.timezone}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Date Format:</span>
                        <span className="detail-value">{locale.dateFormat}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Time Format:</span>
                        <span className="detail-value">{locale.timeFormat}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Number Format:</span>
                        <span className="detail-value">{locale.numberFormat}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">First Day:</span>
                        <span className="detail-value">
                          {locale.firstDayOfWeek === 0 ? 'Sunday' : 
                           locale.firstDayOfWeek === 1 ? 'Monday' : 
                           locale.firstDayOfWeek === 6 ? 'Friday' : 'Other'}
                        </span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Measurement:</span>
                        <span className="detail-value">{locale.measurement}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Temperature:</span>
                        <span className="detail-value">{locale.temperature}</span>
                      </div>
                    </div>
                  </div>
                  <div className="locale-actions">
                    <button 
                      className="edit-button"
                      onClick={() => handleLocaleEdit(locale.id)}
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    {editingLocale === locale.id && (
                      <button 
                        className="save-button"
                        onClick={() => saveLocale(locale.id)}
                      >
                        <Save className="w-4 h-4" />
                        Save
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'rules' && (
          <div className="rules-tab">
            <div className="rules-header">
              <div className="search-box">
                <Search className="search-icon" />
                <input
                  type="text"
                  placeholder="Search rules..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>

            <div className="rules-list">
              {filteredRules.map((rule) => (
                <div key={rule.id} className="rule-item">
                  <div className="rule-icon">
                    {getTypeIcon(rule.type)}
                  </div>
                  <div className="rule-info">
                    <div className="rule-header">
                      <h4 className="rule-type">{rule.type}</h4>
                      <div className="rule-badges">
                        <span className="locale-badge">{rule.locale}</span>
                        {rule.active && (
                          <span className="active-badge">
                            <CheckCircle className="w-3 h-3" />
                            Active
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="rule-details">
                      <div className="pattern-row">
                        <span className="pattern-label">Pattern:</span>
                        <code className="pattern-value">{rule.pattern}</code>
                      </div>
                      <div className="example-row">
                        <span className="example-label">Example:</span>
                        <span className="example-value">{rule.example}</span>
                      </div>
                      <p className="rule-description">{rule.description}</p>
                    </div>
                  </div>
                  <div className="rule-actions">
                    <button className="edit-button">
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button className="toggle-button">
                      {rule.active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      {rule.active ? 'Disable' : 'Enable'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'cultural' && (
          <div className="cultural-tab">
            <div className="cultural-header">
              <div className="search-box">
                <Search className="search-icon" />
                <input
                  type="text"
                  placeholder="Search cultural settings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>

            <div className="cultural-list">
              {filteredCultural.map((setting) => (
                <div key={setting.id} className="cultural-item">
                  <div className="cultural-icon">
                    {getCategoryIcon(setting.category)}
                  </div>
                  <div className="cultural-info">
                    <div className="cultural-header">
                      <h4 className="cultural-name">{setting.name}</h4>
                      <div className="cultural-badges">
                        <span className="category-badge">{setting.category}</span>
                        <span className={`impact-badge ${getImpactColor(setting.impact)}`}>
                          {setting.impact} impact
                        </span>
                        <span className="locale-badge">{setting.locale}</span>
                      </div>
                    </div>
                    <div className="cultural-details">
                      <div className="value-row">
                        <span className="value-label">Value:</span>
                        <span className="value-content">{setting.value}</span>
                      </div>
                      <p className="cultural-description">{setting.description}</p>
                    </div>
                  </div>
                  <div className="cultural-actions">
                    <button className="edit-button">
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button className="delete-button">
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="settings-tab">
            <div className="localization-settings">
              <h3>Localization Settings</h3>
              <div className="settings-grid">
                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Auto Detect Locale</h4>
                    <p>Automatically detect user's locale based on browser settings</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={localizationSettings.autoDetect}
                      onChange={(e) => handleSettingChange('autoDetect', e.target.checked)}
                      aria-label="Enable automatic localization detection"
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Fallback Locale</h4>
                    <p>Default locale when user's preferred locale is not available</p>
                  </div>
                  <select 
                    value={localizationSettings.fallbackLocale}
                    onChange={(e) => handleSettingChange('fallbackLocale', e.target.value)}
                    className="locale-select"
                    title="Select fallback locale"
                    aria-label="Select fallback locale"
                  >
                    {locales.map(locale => (
                      <option key={locale.id} value={locale.id}>
                        {locale.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Enable RTL Support</h4>
                    <p>Support right-to-left languages like Arabic and Hebrew</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={localizationSettings.enableRTL}
                      onChange={(e) => handleSettingChange('enableRTL', e.target.checked)}
                      aria-label="Enable right-to-left language support"
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Cultural Adaptation</h4>
                    <p>Adapt content and behavior to local cultural norms</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={localizationSettings.enableCulturalAdaptation}
                      onChange={(e) => handleSettingChange('enableCulturalAdaptation', e.target.checked)}
                      aria-label="Enable cultural adaptation features"
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Regional Formatting</h4>
                    <p>Apply regional formatting for dates, numbers, and currency</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={localizationSettings.enableRegionalFormatting}
                      onChange={(e) => handleSettingChange('enableRegionalFormatting', e.target.checked)}
                      aria-label="Enable regional formatting for dates and numbers"
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Holiday Calendar</h4>
                    <p>Show local holidays and observances</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={localizationSettings.enableHolidayCalendar}
                      onChange={(e) => handleSettingChange('enableHolidayCalendar', e.target.checked)}
                      aria-label="Enable local holiday calendar"
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Business Hours</h4>
                    <p>Respect local business hours and working days</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={localizationSettings.enableBusinessHours}
                      onChange={(e) => handleSettingChange('enableBusinessHours', e.target.checked)}
                      aria-label="Enable local business hours support"
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Social Norms</h4>
                    <p>Adapt to local social customs and communication styles</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={localizationSettings.enableSocialNorms}
                      onChange={(e) => handleSettingChange('enableSocialNorms', e.target.checked)}
                      aria-label="Enable local social norms adaptation"
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
