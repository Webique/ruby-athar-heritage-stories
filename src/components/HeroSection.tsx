import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import heroBackground from '@/assets/hero-background.jpg';

const HeroSection = () => {
  const { language, isRTL } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const content = {
    en: {
      tagline: "Discover the Hidden Stories",
      subtitle: "of the Arabian Peninsula",
      description: "Journey through forgotten tales, mysterious legends, and inspiring figures that shaped Arabian culture.",
      cta: "Begin Your Journey",
    },
    ar: {
      tagline: "اكتشف القصص المخفية",
      subtitle: "لشبه الجزيرة العربية",
      description: "رحلة عبر الحكايات المنسية والأساطير الغامضة والشخصيات الملهمة التي شكلت الثقافة العربية.",
      cta: "ابدأ رحلتك"
    }
  };

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-cover bg-center bg-scroll md:bg-fixed"
      style={{
        backgroundImage: `url(${heroBackground})`,
      }}
    >
      {/* Elegant Overlay */}
      <div className="absolute inset-0 bg-gradient-hero"></div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className={`space-y-8 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
          <div className="space-y-4">
            <h1 className={`text-hero font-bold text-primary-foreground leading-tight ${isRTL ? 'font-arabic' : 'font-english'}`}>
              <span className={`block ${isVisible ? 'text-reveal animate' : 'text-reveal'}`} style={{ animationDelay: '0.2s' }}>
                {content[language].tagline}
              </span>
              <span className={`block text-secondary ${isVisible ? 'text-reveal animate' : 'text-reveal'}`} style={{ animationDelay: '0.4s' }}>
                {content[language].subtitle}
              </span>
            </h1>
            
            <p className={`text-large text-primary-foreground/90 max-w-3xl mx-auto ${isVisible ? 'text-reveal animate' : 'text-reveal'}`} style={{ animationDelay: '0.6s' }}>
              {content[language].description}
            </p>
          </div>

          <div className={`${isVisible ? 'text-reveal animate' : 'text-reveal'}`} style={{ animationDelay: '0.8s' }}>
            <Button className="btn-hero text-lg px-12 py-6 shadow-glow">
              {content[language].cta}
            </Button>
          </div>
        </div>

        {/* Scroll indicator removed as requested */}
      </div>
    </section>
  );
};

export default HeroSection;