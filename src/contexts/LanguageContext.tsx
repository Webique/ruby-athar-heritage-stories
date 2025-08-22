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

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  // Initialize language state with a more robust approach
  const [language, setLanguageState] = useState<'en' | 'ar'>(() => {
    // Try multiple storage methods for maximum compatibility
    try {
      // First try sessionStorage (more reliable for page navigation)
      const sessionLang = sessionStorage.getItem('ruby-athar-language');
      if (sessionLang === 'en' || sessionLang === 'ar') {
        return sessionLang;
      }
      
      // Fallback to localStorage
      const localLang = localStorage.getItem('ruby-athar-language');
      if (localLang === 'en' || localLang === 'ar') {
        return localLang;
      }
      
      // Check URL for language parameter
      const urlParams = new URLSearchParams(window.location.search);
      const urlLang = urlParams.get('lang');
      if (urlLang === 'en' || urlLang === 'ar') {
        return urlLang;
      }
      
      // Check browser language
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith('ar')) {
        return 'ar';
      }
      
      // Default to English
      return 'en';
    } catch (error) {
      console.warn('Language detection failed, defaulting to English:', error);
      return 'en';
    }
  });

  // Function to save language to both storages
  const saveLanguage = (lang: 'en' | 'ar') => {
    try {
      sessionStorage.setItem('ruby-athar-language', lang);
      localStorage.setItem('ruby-athar-language', lang);
      
      // Also update URL without page reload
      const url = new URL(window.location.href);
      url.searchParams.set('lang', lang);
      window.history.replaceState({}, '', url.toString());
    } catch (error) {
      console.warn('Failed to save language preference:', error);
    }
  };

  // Function to set language
  const setLanguage = (lang: 'en' | 'ar') => {
    setLanguageState(lang);
    saveLanguage(lang);
  };

  // Function to toggle language
  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'ar' : 'en';
    setLanguage(newLang);
  };

  // Effect to sync language on mount and URL changes
  useEffect(() => {
    const handleUrlChange = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const urlLang = urlParams.get('lang');
      if (urlLang === 'en' || urlLang === 'ar') {
        setLanguageState(urlLang);
        saveLanguage(urlLang);
      }
    };

    // Listen for popstate (back/forward navigation)
    window.addEventListener('popstate', handleUrlChange);
    
    // Check URL on mount
    handleUrlChange();

    return () => {
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, []);

  // Effect to ensure language is properly set on first load
  useEffect(() => {
    // If no language is set in URL, check storage and set it
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang');
    
    if (!urlLang) {
      const storedLang = sessionStorage.getItem('ruby-athar-language') || localStorage.getItem('ruby-athar-language');
      if (storedLang === 'en' || storedLang === 'ar') {
        // Update URL to reflect the stored language
        const url = new URL(window.location.href);
        url.searchParams.set('lang', storedLang);
        window.history.replaceState({}, '', url.toString());
      }
    }
  }, []);

  // Effect to sync with storage changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'ruby-athar-language' && e.newValue) {
        if (e.newValue === 'en' || e.newValue === 'ar') {
          setLanguageState(e.newValue);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
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
      >
        {children}
      </div>
    </LanguageContext.Provider>
  );
};