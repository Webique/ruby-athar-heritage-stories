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

  // Always get the current language from localStorage to ensure consistency
  const getCurrentLanguage = (): 'en' | 'ar' => {
    const savedLanguage = localStorage.getItem('preferred-language');
    console.log('🔍 LanguageContext: getCurrentLanguage called, returning:', savedLanguage);
    return (savedLanguage as 'en' | 'ar') || 'en';
  };

  const isRTL = getCurrentLanguage() === 'ar';

  // Debug: Log current state
  console.log('🔍 LanguageContext: Current state - language:', language, 'isRTL:', isRTL, 'localStorage:', localStorage.getItem('preferred-language'));

  return (
    <LanguageContext.Provider value={{ 
      language: getCurrentLanguage(), 
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