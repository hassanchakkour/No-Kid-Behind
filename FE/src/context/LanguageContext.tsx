import { createContext, useContext, useState, useEffect } from 'react';
import type { Lang } from '../i18n/translations';

interface LanguageContextValue {
  lang: Lang;
  toggleLang: () => void;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'en',
  toggleLang: () => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('en');

  useEffect(() => {
    // Arabic glyphs render visually smaller than Latin at the same rem size;
    // bumping the root font-size scales all rem-based text proportionally.
    document.documentElement.style.fontSize = lang === 'ar' ? '17px' : '';
    document.documentElement.lang = lang;
  }, [lang]);

  const toggleLang = () => setLang((l) => (l === 'en' ? 'ar' : 'en'));
  return (
    <LanguageContext.Provider value={{ lang, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
