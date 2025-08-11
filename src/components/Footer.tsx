import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Phone, Mail, Instagram, Twitter, Facebook } from 'lucide-react';

const Footer = () => {
  const { language, isRTL } = useLanguage();

  const content = {
    en: {
      tagline: "Heritage Gems of Arabia",
      phone: "+966 50 433 3581",
      email: "atharruby@outlook.com",
      copyright: "© 2024 Athar Ruby. All rights reserved.",
      developed: "Crafted with passion for Arabian heritage"
    },
    ar: {
      tagline: "جواهر التراث العربي",
      phone: "+966 50 433 3581",
      email: "atharruby@outlook.com",
      copyright: "© 2024 أثر روبي. جميع الحقوق محفوظة.",
      developed: `صُنع بشغف للتراث العربي.

ومحبته العميقة.`
    }
  };

  return (
    <footer className="bg-gradient-primary text-primary-foreground py-16">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-3 gap-12 items-center">
          {/* Logo and Tagline */}
          <div className={`text-center lg:text-left ${isRTL ? 'lg:text-right' : ''}`}>
            <img 
              src="/lovable-uploads/c7c366f7-aedb-4844-ae65-e0744224b58a.png" 
              alt="Athar Ruby Logo" 
              className="h-16 w-auto mx-auto lg:mx-0 mb-4"
            />
            <p className={`text-lg font-medium ${isRTL ? 'font-arabic' : 'font-english'}`}>
              {content[language].tagline}
            </p>
          </div>

          {/* Contact Information */}
          <div className="text-center">
            <div className="space-y-4">
              <div className={`flex items-center justify-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Phone className="h-5 w-5 text-secondary" />
                <a 
                  href={`tel:${content[language].phone}`}
                  className="hover:text-secondary transition-colors"
                >
                  {content[language].phone}
                </a>
              </div>
              
              <div className={`flex items-center justify-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Mail className="h-5 w-5 text-secondary" />
                <a 
                  href={`mailto:${content[language].email}`}
                  className="hover:text-secondary transition-colors"
                >
                  {content[language].email}
                </a>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className={`text-center lg:text-right ${isRTL ? 'lg:text-left' : ''}`}>
            <div className="flex items-center justify-center lg:justify-end gap-4 mb-4">
              <a href="#" className="p-2 bg-primary-foreground/10 hover:bg-secondary/20 rounded-full transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 bg-primary-foreground/10 hover:bg-secondary/20 rounded-full transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 bg-primary-foreground/10 hover:bg-secondary/20 rounded-full transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-primary-foreground/20 my-8"></div>

        {/* Copyright */}
        <div className="text-center space-y-2">
          <p className={`text-sm ${isRTL ? 'font-arabic' : 'font-english'}`}>
            {content[language].copyright}
          </p>
          <p className={`text-xs text-primary-foreground/70 ${isRTL ? 'font-arabic' : 'font-english'}`}>
            {content[language].developed}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;