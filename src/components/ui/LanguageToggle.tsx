      >
        {t('english')}
      </button>
      <button
        onClick={() => setLang('ar')}
        style={{
          background: lang === 'ar' ? '#007aff' : '#f0f0f0',
          color: lang === 'ar' ? '#fff' : '#333',
          border: 'none',
          borderRadius: 16,
          padding: '4px 12px',
          cursor: 'pointer',
          fontWeight: lang === 'ar' ? 700 : 400
        }}
      >
        {t('arabic')}
      </button>
    </div>
  );
};

export default LanguageToggle;
import React from 'react';
import { useI18n } from '../../i18n/i18n';

const LanguageToggle: React.FC = () => {
  const { lang, setLang, t } = useI18n();
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ fontWeight: 500 }}>{t('language')}:</span>
      <button
        onClick={() => setLang('en')}
        style={{
          background: lang === 'en' ? '#007aff' : '#f0f0f0',
          color: lang === 'en' ? '#fff' : '#333',
          border: 'none',
          borderRadius: 16,
          padding: '4px 12px',
          marginInlineEnd: 4,
          cursor: 'pointer',
          fontWeight: lang === 'en' ? 700 : 400
        }}

