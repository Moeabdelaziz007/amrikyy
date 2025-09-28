npm install
npm startimport React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Supported languages
const LANGS = ['en', 'ar'] as const;
type Lang = typeof LANGS[number];

interface I18nContextProps {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
  dir: 'rtl' | 'ltr';
}

const I18nContext = createContext<I18nContextProps | undefined>(undefined);

function getDir(lang: Lang): 'rtl' | 'ltr' {
  return lang === 'ar' ? 'rtl' : 'ltr';
}

function loadMessages(lang: Lang): Record<string, string> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require(`./${lang}.json`);
  } catch (err) {
    console.error('Failed to load messages for', lang, err);
    return {};
  }
}

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const saved = (typeof window !== 'undefined' && localStorage.getItem('amrikyy_lang')) as Lang | null;
  const initial: Lang = (saved as Lang) || 'ar';
  const [lang, setLangState] = useState<Lang>(initial);
  const [messages, setMessages] = useState<Record<string, string>>(loadMessages(initial));

  useEffect(() => {
    setMessages(loadMessages(lang));
    document.documentElement.dir = getDir(lang);
    document.documentElement.lang = lang;
    try {
      localStorage.setItem('amrikyy_lang', lang);
    } catch (e) {
      // ignore
    }
  }, [lang]);

  const setLang = (l: Lang) => setLangState(l);
  const t = (key: string) => messages[key] || key;

  return (
    <I18nContext.Provider value={{ lang, setLang, t, dir: getDir(lang) }}>
      {children}
    </I18nContext.Provider>
  );
};

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
