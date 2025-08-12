import React, { useMemo, useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';

const GallerySection = () => {
  const { language, isRTL } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [isGalleryOpenMobile, setIsGalleryOpenMobile] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState(false);
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (galleryRef.current) {
      observer.observe(galleryRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // List of all files currently in public/lovable-uploads
  const uploadFileNames = useMemo(
    () => [
      '19e206c3-4a07-4ef2-b477-cd3e49919a36.JPG',
      '250259e1-54d5-4954-9e0b-7ba1bd7d4698.JPG',
      '3efae04f-d55e-47cb-bace-328e3aa1bb91.JPG',
      '87b9d1e9-eb5c-43a6-8e56-81e77cb3e2de.JPG',
      '98e67da8-4a60-4d75-b49f-bd3b8289dc66.JPG',
      'bb975493-9bdd-4ec3-8c36-5206dc5acd29.JPG',
      'cd6970f6-e9b1-40b1-886c-10084491cd98.JPG',
      'd0f41331-24d6-4050-b958-00ab02fff505.JPG',
      'd4383754-7b97-47ea-a48d-3344b4095edf.JPG',
      'dc0c6535-876e-43c5-8f5a-1aff8cca290c.JPG',
      'e2e3b43e-d5f2-459f-bc73-f8dde23b1e4e.JPG',
      'fed2ecb2-42f9-4811-94e8-85aebfb0ccf1.JPG',
    ]
      // Keep sorted for stable UI order
      .sort((a, b) => a.localeCompare(b)),
    []
  );

  const galleryImages = uploadFileNames.map((fileName) => ({
    src: `/lovable-uploads/${fileName}`,
    alt: fileName,
  }));

  const content = {
    en: {
      title: "Experience Gallery",
      subtitle: "Discover the Beauty of Arabian Heritage",
      close: "Close",
      viewGallery: "View Gallery",
      hideGallery: "Hide Gallery",
    },
    ar: {
      title: "اكتشف جمال التراث",
      subtitle: "",
      close: "إغلاق",
      viewGallery: "عرض المزيد",
      hideGallery: "إخفاء المعرض",
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
        </div>

        {/* Horizontal Sliding Banner */}
        <div className="mb-8" ref={galleryRef}>
          <div className="relative overflow-hidden">
            <div className={`flex space-x-6 ${isVisible ? 'animate-scroll-slow' : ''}`} style={{ direction: 'ltr' }}>
              {galleryImages.map((image, index) => (
                <div key={index} className="flex-shrink-0">
                  <img 
                    src={image.src}
                    alt={image.alt}
                    className="w-40 h-40 object-cover rounded-lg border-2 border-white shadow-lg"
                  />
                </div>
              ))}
              {/* Duplicate images for seamless loop */}
              {galleryImages.map((image, index) => (
                <div key={`duplicate-${index}`} className="flex-shrink-0">
                  <img 
                    src={image.src}
                    alt={image.alt}
                    className="w-40 h-40 object-cover rounded-lg border-2 border-white shadow-lg"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Toggle Button */}
        <div className="flex justify-center mb-6">
          <Button
            onClick={() => setIsGalleryOpenMobile((prev) => !prev)}
            className="flex items-center gap-2 bg-primary text-primary-foreground border border-primary hover:bg-primary/90 shadow-glow"
          >
            {isGalleryOpenMobile ? (
              <>
                {content[language].hideGallery}
                <ChevronUp className="h-4 w-4" />
              </>
            ) : (
              <>
                {content[language].viewGallery}
                <ChevronDown className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>

        {/* Gallery Grid - Hidden by default */}
        <div className={`${isGalleryOpenMobile ? 'grid' : 'hidden'} grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-7xl mx-auto`}>
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