import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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

// Simple function to get language from URL
const getLanguageFromURL = (): 'en' | 'ar' | null => {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const lang = urlParams.get('lang');
    return lang === 'en' || lang === 'ar' ? lang : null;
  } catch {
    return null;
  }
};

// Simple function to get language from storage
const getLanguageFromStorage = (): 'en' | 'ar' | null => {
  try {
    const stored = localStorage.getItem('ruby-athar-language') || sessionStorage.getItem('ruby-athar-language');
    return stored === 'en' || stored === 'ar' ? stored : null;
  } catch {
    return null;
  }
};

// Simple function to save language to storage
const saveLanguageToStorage = (lang: 'en' | 'ar') => {
  try {
    localStorage.setItem('ruby-athar-language', lang);
    sessionStorage.setItem('ruby-athar-language', lang);
  } catch (error) {
    console.warn('Failed to save language to storage:', error);
  }
};

// Simple function to update URL with language
const updateURLWithLanguage = (lang: 'en' | 'ar') => {
  try {
    const url = new URL(window.location.href);
    url.searchParams.set('lang', lang);
    window.history.replaceState({}, '', url.toString());
    console.log('URL updated to:', url.toString());
  } catch (error) {
    console.error('Failed to update URL:', error);
  }
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  // Initialize language with simple priority: URL > Storage > Default
  const [language, setLanguageState] = useState<'en' | 'ar'>(() => {
    const urlLang = getLanguageFromURL();
    if (urlLang) {
      console.log('Language from URL:', urlLang);
      return urlLang;
    }
    
    const storedLang = getLanguageFromStorage();
    if (storedLang) {
      console.log('Language from storage:', storedLang);
      return storedLang;
    }
    
    console.log('Using default language: en');
    return 'en';
  });

  // Simple toggle function
  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'ar' : 'en';
    console.log('Toggling language from', language, 'to', newLang);
    
    // Update state immediately
    setLanguageState(newLang);
    
    // Save to storage
    saveLanguageToStorage(newLang);
    
    // Update URL
    updateURLWithLanguage(newLang);
  };

  // Simple set language function
  const setLanguage = (lang: 'en' | 'ar') => {
    console.log('Setting language to:', lang);
    
    // Update state immediately
    setLanguageState(lang);
    
    // Save to storage
    saveLanguageToStorage(lang);
    
    // Update URL
    updateURLWithLanguage(lang);
  };

  // Effect to sync with URL changes (for back/forward navigation)
  useEffect(() => {
    const handlePopState = () => {
      const urlLang = getLanguageFromURL();
      if (urlLang && urlLang !== language) {
        console.log('URL changed, updating language to:', urlLang);
        setLanguageState(urlLang);
        saveLanguageToStorage(urlLang);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [language]);

  // Effect to ensure URL has language parameter on mount
  useEffect(() => {
    const urlLang = getLanguageFromURL();
    if (!urlLang) {
      console.log('No language in URL, adding current language:', language);
      updateURLWithLanguage(language);
    }
  }, []);

  const isRTL = language === 'ar';

  return (
    <LanguageContext.Provider value={{ 
      language, 
      toggleLanguage, 
      setLanguage, 
      isRTL 
    }}>
      <div 
        className={isRTL ? 'rtl font-arabic' : 'ltr font-english'} 
        dir={isRTL ? 'rtl' : 'ltr'}
        data-language={language}
        key={language} // Force re-render when language changes
      >
        {children}
      </div>
    </LanguageContext.Provider>
  );
};