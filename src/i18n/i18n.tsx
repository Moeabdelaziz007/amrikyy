import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

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

const messageModules = import.meta.glob('./*.json', { eager: true });
const messagesMap: Record<string, Record<string, string>> = {};
Object.entries(messageModules).forEach(([path, mod]) => {
  const key = path.replace('./', '').replace('.json', '');
  const m = (mod as any).default || mod;
  messagesMap[key] = m as Record<string, string>;
});

async function loadMessagesAsync(lang: Lang): Promise<Record<string, string>> {
  return messagesMap[lang] || {};
}

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const saved = (typeof window !== 'undefined' && localStorage.getItem('amrikyy_lang')) as Lang | null;
  const initial: Lang = (saved as Lang) || 'ar';
  const [lang, setLangState] = useState<Lang>(initial);
  const [messages, setMessages] = useState<Record<string, string>>({});

  useEffect(() => {
    let alive = true;
    loadMessagesAsync(lang).then(m => {
      if (!alive) return;
      setMessages(m);
    });
    document.documentElement.dir = getDir(lang);
    document.documentElement.lang = lang;
    try {
      localStorage.setItem('amrikyy_lang', lang);
    } catch (e) {}
    return () => { alive = false; };
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
