import React, { useMemo, useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const GallerySection = () => {
  const { language, isRTL } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const galleryRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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
      '1.jpeg',
      '2.jpeg',
      '3.jpeg',
      '4.jpeg',
      '5.jpeg',
      '6.jpeg',
      '7.jpeg',
      '8.jpeg',
      '9.jpeg',
      '10.jpeg',
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
    },
    ar: {
      title: "اكتشف جمال التراث",
      subtitle: "",
      close: "إغلاق",
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

  const handleBannerPause = () => {
    setIsPaused(true);
  };

  const handleBannerResume = () => {
    setIsPaused(false);
  };

  const handleImageClick = (index: number) => {
    setSelectedImage(index);
    document.body.style.overflow = 'hidden';
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (scrollContainerRef.current?.offsetLeft || 0));
    setScrollLeft(scrollContainerRef.current?.scrollLeft || 0);
    setIsPaused(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (scrollContainerRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2;
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsPaused(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX - (scrollContainerRef.current?.offsetLeft || 0));
    setScrollLeft(scrollContainerRef.current?.scrollLeft || 0);
    setIsPaused(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - (scrollContainerRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2;
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setIsPaused(false);
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
          <div className="relative overflow-x-auto overflow-y-hidden">
            {/* Pause Indicator */}
            {isPaused && (
              <div className="absolute top-2 right-2 z-10 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                {language === 'en' ? 'Paused' : 'متوقف مؤقتاً'}
              </div>
            )}
            <div 
              ref={scrollContainerRef}
              className={`flex space-x-6 ${isVisible && !isPaused ? 'animate-scroll-slow' : ''} ${isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'}`} 
              style={{ 
                direction: 'ltr',
                scrollBehavior: isDragging ? 'auto' : 'smooth',
                userSelect: isDragging ? 'none' : 'auto'
              }}
              onMouseEnter={handleBannerPause}
              onMouseLeave={handleMouseUp}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {galleryImages.map((image, index) => (
                <div key={index} className="flex-shrink-0">
                  <img 
                    src={image.src}
                    alt={image.alt}
                    className="w-40 h-40 object-cover rounded-lg border-2 border-white shadow-lg cursor-pointer hover:scale-105 transition-transform duration-200"
                    onClick={() => handleImageClick(index)}
                  />
                </div>
              ))}
              {/* Duplicate images for seamless loop */}
              {galleryImages.map((image, index) => (
                <div key={`duplicate-${index}`} className="flex-shrink-0">
                  <img 
                    src={image.src}
                    alt={image.alt}
                    className="w-40 h-40 object-cover rounded-lg border-2 border-white shadow-lg cursor-pointer hover:scale-105 transition-transform duration-200"
                    onClick={() => handleImageClick(index + galleryImages.length)}
                  />
                </div>
              ))}
            </div>
          </div>
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