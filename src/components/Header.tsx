import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Phone, Globe } from 'lucide-react';

const Header = () => {
  const { language, toggleLanguage, isRTL } = useLanguage();

  const content = {
    en: {
      phone: '+966 50 433 3581',
      toggleText: 'العربية'
    },
    ar: {
      phone: '+966 50 433 3581',
      toggleText: 'English'
    }
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border shadow-elegant">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo - Left in LTR, Right in RTL */}
          <div className={`flex items-center ${isRTL ? 'order-3' : 'order-1'}`}>
            <img 
              src="/lovable-uploads/c7c366f7-aedb-4844-ae65-e0744224b58a.png" 
              alt="Athar Ruby Logo" 
              className="h-16 w-auto"
            />
          </div>

          {/* Phone Number - Center */}
          <div className={`flex items-center gap-2 order-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Phone className={`h-4 w-4 text-primary ${isRTL ? 'ml-2' : 'mr-2'}`} />
            <a 
              href={`tel:${content[language].phone}`}
              className={`text-body font-medium hover:text-primary transition-colors ${isRTL ? 'font-arabic' : ''}`}
              dir="ltr"
            >
              {content[language].phone}
            </a>
          </div>

          {/* Language Toggle - Right in LTR, Left in RTL */}
          <div className={`${isRTL ? 'order-1' : 'order-3'}`}>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleLanguage}
              className="flex items-center gap-2 btn-gold"
            >
              <Globe className="h-4 w-4" />
              {content[language].toggleText}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;