import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LanguageContextType {
  language: 'en' | 'ar';
  toggleLanguage: () => void;
  setLanguage: (lang: 'en' | 'ar') => void;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  // Get language from localStorage or default to 'en'
  const [language, setLanguage] = useState<'en' | 'ar'>(() => {
    const savedLanguage = localStorage.getItem('preferred-language');
    console.log('🔍 LanguageContext: Initializing with saved language:', savedLanguage);
    return (savedLanguage as 'en' | 'ar') || 'en';
  });

  // Sync language state with localStorage whenever it changes
  React.useEffect(() => {
    const savedLanguage = localStorage.getItem('preferred-language');
    if (savedLanguage && savedLanguage !== language) {
      console.log('🔍 LanguageContext: Syncing language state with localStorage:', savedLanguage);
      setLanguage(savedLanguage as 'en' | 'ar');
    }
  }, [language]);

  // Listen for localStorage changes from other tabs/contexts
  React.useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'preferred-language' && e.newValue) {
        console.log('🔍 LanguageContext: localStorage changed, updating language to:', e.newValue);
        setLanguage(e.newValue as 'en' | 'ar');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const toggleLanguage = () => {
    console.log('🔍 LanguageContext: toggleLanguage called, current language:', language);
    setLanguage(prev => {
      const newLanguage = prev === 'en' ? 'ar' : 'en';
      // Save to localStorage
      localStorage.setItem('preferred-language', newLanguage);
      console.log('🔍 LanguageContext: Language toggled to:', newLanguage);
      return newLanguage;
    });
  };

  const setLanguageDirectly = (lang: 'en' | 'ar') => {
    console.log('🔍 LanguageContext: setLanguageDirectly called with:', lang);
    setLanguage(lang);
    localStorage.setItem('preferred-language', lang);
  };

  const isRTL = language === 'ar';

  // Debug: Log current state
  console.log('🔍 LanguageContext: Current state - language:', language, 'isRTL:', isRTL, 'localStorage:', localStorage.getItem('preferred-language'));

  return (
    <LanguageContext.Provider value={{ 
      language, 
      toggleLanguage, 
      setLanguage: setLanguageDirectly, 
      isRTL 
    }}>
      <div className={isRTL ? 'rtl font-arabic' : 'ltr font-english'} dir={isRTL ? 'rtl' : 'ltr'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};