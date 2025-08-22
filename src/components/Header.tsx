import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Phone, Globe, Map, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const { language, toggleLanguage, isRTL } = useLanguage();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const content = {
    en: {
      phone: '0573600158',
      toggleText: 'العربية',
      nav: {
        home: 'Home',
        trips: 'Trips'
      }
    },
    ar: {
      phone: '0573600158',
      toggleText: 'English',
      nav: {
        home: 'الرئيسية',
        trips: 'الرحلات'
      }
    }
  };

  const navItems = [
    { path: '/', label: content[language].nav.home },
    { path: '/journey', label: content[language].nav.trips }
  ];

  // Flip navigation items order for RTL
  const displayNavItems = isRTL ? [...navItems].reverse() : navItems;

  return (
    <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border shadow-elegant">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo - Left in LTR, Right in RTL */}
          <div className={`flex items-center ${isRTL ? 'order-4' : 'order-1'}`}>
            <img 
              src="/lovable-uploads/c7c366f7-aedb-4844-ae65-e0744224b58a.png" 
              alt="Athar Ruby Logo" 
              className="h-16 w-auto"
            />
          </div>

          {/* Navigation Menu - Center */}
          <nav className={`hidden md:flex items-center gap-6 order-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {displayNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-body font-medium transition-colors hover:text-primary ${
                  location.pathname === item.path || 
                  (item.path === '/#about' && location.pathname === '/' && location.hash === '#about') ||
                  (item.path === '/#contact' && location.pathname === '/' && location.hash === '#contact')
                    ? 'text-primary'
                    : 'text-muted-foreground'
                } ${isRTL ? 'font-arabic' : 'font-english'}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Phone Number - Center in mobile, right in desktop */}
          <div className={`flex items-center gap-2 order-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Phone className={`h-4 w-4 text-primary ${isRTL ? 'ml-2' : 'mr-2'}`} />
            <a 
              href={`tel:${content[language].phone}`}
              className={`text-xs sm:text-body font-medium hover:text-primary transition-colors ${isRTL ? 'font-arabic' : ''}`}
              dir="ltr"
            >
              {content[language].phone}
            </a>
          </div>

          {/* Language Toggle - Right in LTR, Left in RTL */}
          <div className={`${isRTL ? 'order-1' : 'order-4'}`}>
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

          {/* Mobile Menu Button */}
          <div className="md:hidden order-5">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-border bg-background/95 backdrop-blur-sm rounded-lg shadow-lg">
            <nav className="flex flex-col gap-3 px-4 py-4">
              {displayNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-base font-medium transition-colors hover:text-primary py-2 px-3 rounded-md ${
                    location.pathname === item.path || 
                    (item.path === '/#about' && location.pathname === '/' && location.hash === '#about') ||
                    (item.path === '/#contact' && location.pathname === '/' && location.hash === '#contact')
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:bg-muted/50'
                  } ${isRTL ? 'font-arabic text-right' : 'font-english text-left'}`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;