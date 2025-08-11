import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card } from '@/components/ui/card';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

// Import gallery images
import petroglyphs from '@/assets/gallery/petroglyphs.jpg';
import bedouinCamp from '@/assets/gallery/bedouin-camp.jpg';
import calligraphy from '@/assets/gallery/calligraphy.jpg';
import marketplace from '@/assets/gallery/marketplace.jpg';
import desertRuins from '@/assets/gallery/desert-ruins.jpg';
import coffeeCeremony from '@/assets/gallery/coffee-ceremony.jpg';
import tradeRoute from '@/assets/gallery/trade-route.jpg';
import instruments from '@/assets/gallery/instruments.jpg';
import fieldTrips from '@/assets/field-trips.jpg';
import storytelling from '@/assets/storytelling.jpg';
import culturalAdventure from '@/assets/cultural-adventure.jpg';
import heroBackground from '@/assets/hero-background.jpg';

const GallerySection = () => {
  const { language, isRTL } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const galleryImages = [
    { src: heroBackground, alt: 'Saudi Arabian Landscape' },
    { src: petroglyphs, alt: 'Ancient Petroglyphs' },
    { src: bedouinCamp, alt: 'Bedouin Camp' },
    { src: calligraphy, alt: 'Arabic Calligraphy' },
    { src: marketplace, alt: 'Traditional Marketplace' },
    { src: desertRuins, alt: 'Desert Ruins' },
    { src: coffeeCeremony, alt: 'Coffee Ceremony' },
    { src: tradeRoute, alt: 'Ancient Trade Route' },
    { src: instruments, alt: 'Traditional Instruments' },
    { src: fieldTrips, alt: 'Cultural Field Trip' },
    { src: storytelling, alt: 'Storytelling Experience' },
    { src: culturalAdventure, alt: 'Cultural Adventure' },
  ];

  const content = {
    en: {
      title: "Experience Gallery",
      subtitle: "Discover the Beauty of Arabian Heritage",
      close: "Close"
    },
    ar: {
      title: "معرض التجارب",
      subtitle: "اكتشف جمال التراث العربي",
      close: "إغلاق"
    }
  };

  const openLightbox = (index: number) => {
    setSelectedImage(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'unset';
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (selectedImage === null) return;
    
    if (direction === 'prev') {
      setSelectedImage(selectedImage === 0 ? galleryImages.length - 1 : selectedImage - 1);
    } else {
      setSelectedImage(selectedImage === galleryImages.length - 1 ? 0 : selectedImage + 1);
    }
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className={`text-section font-bold text-primary mb-4 ${isRTL ? 'font-arabic' : 'font-english'}`}>
            {content[language].title}
          </h2>
          <p className={`text-large text-muted-foreground ${isRTL ? 'font-arabic' : 'font-english'}`}>
            {content[language].subtitle}
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
          {galleryImages.map((image, index) => (
            <Card 
              key={index}
              className="group overflow-hidden cursor-pointer hover:shadow-glow transition-all duration-300 hover:-translate-y-1"
              onClick={() => openLightbox(index)}
            >
              <div className="aspect-square overflow-hidden">
                <img 
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </div>
            </Card>
          ))}
        </div>

        {/* Lightbox */}
        {selectedImage !== null && (
          <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
            <div className="relative max-w-4xl max-h-full">
              {/* Close Button */}
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>

              {/* Navigation Buttons */}
              <button
                onClick={() => navigateImage('prev')}
                className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'right-4' : 'left-4'} p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors`}
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              <button
                onClick={() => navigateImage('next')}
                className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'left-4' : 'right-4'} p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors`}
              >
                <ChevronRight className="h-6 w-6" />
              </button>

              {/* Image */}
              <img
                src={galleryImages[selectedImage].src}
                alt={galleryImages[selectedImage].alt}
                className="max-w-full max-h-full object-contain rounded-lg"
              />

              {/* Image Counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-3 py-1 rounded-full">
                {selectedImage + 1} / {galleryImages.length}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default GallerySection;