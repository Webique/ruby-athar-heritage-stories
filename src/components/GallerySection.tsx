import React, { useMemo, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';

const GallerySection = () => {
  const { language, isRTL } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [isGalleryOpenMobile, setIsGalleryOpenMobile] = useState<boolean>(false);

  // List of all files currently in public/lovable-uploads
  const uploadFileNames = useMemo(
    () => [
      '10afbe70-377f-479c-a4a0-9a33e3f40eeb.JPG',
      '4d216453-a8bb-491d-b43d-fb4db7b71639.JPG',
      '826518a3-30b0-4d50-9671-34abb663977f.JPG',
      '553462f4-1f84-4b5d-8e79-3e8a642971aa.JPG',
      'b6b47a64-ea24-41c6-af07-3cfc243e79bd.JPG',
      'c7da6b11-c138-4813-91f1-80e5c7d3127b.JPG',
      'eeb2b9ca-dd8c-46e1-9b7c-d899682a7862.JPG',
      '67801cd7-9f60-4a3b-8f21-ad0aa4776be9.JPG',
      '95b289ab-c8d7-4912-bec2-3f04fc500899.JPG',
      'b07ff68e-b34e-4cfc-b114-d4edff3ad44d.JPG',
      '6b87fe27-3fc3-4450-b68f-dd8a6a21d7ee.JPG',
      'fbf42f47-4082-4912-a594-0f65ec3a5226.JPG',
      'e9444279-3dd1-45be-a1f0-161ad002dda3.JPG',
      '549c4ad5-fcbc-4102-a310-89ed146ca103.JPG',
      '57c254ad-e243-4c9e-8032-b1eed5ad95c0.JPG',
      'd774779a-82e1-40ac-99a6-d00cc3ae3f3c.JPG',
      'dc8dbd7a-8038-4b1b-b13f-cc746805aaa2.JPG',
      '10cb736e-e2ad-42db-a9b0-658a7a37e0af.JPG',
      'b91604e9-d8aa-48f3-a4ba-f5b19a7a9bf9.JPG',
      'bb886e90-5e58-4074-acaf-c6c002fe9b17.JPG',
      '02c9d370-af2f-42bd-b455-a26abb0cd9ce.JPG',
      '44ac8813-d4e9-4670-9cfb-690a59cdcddb.JPG',
      '8a923dc5-d9bc-4126-9b7b-828719444daa.JPG',
      'b82e857d-1430-4396-a586-2cb883715d8c.JPG',
      '3ed03164-ffe8-4612-b9eb-3cb154f5bb32.JPG',
      '5a79fb4a-d127-4cb2-8f86-fa27b1c43955.JPG',
      '72fde9ed-dd04-43f3-9575-175bb605706e.JPG',
      'f8ad0963-d679-409d-b591-7695e6686da5.JPG',
      '1fd8dd04-d77e-431b-b629-deb39edc693e.JPG',
      '28d3dd25-9963-42ce-91ea-dd810f9bae3e.JPG',
      '6fd62c4c-e545-4d5c-b0c2-ddc67925c724.JPG',
      '48e6719b-366a-4032-b32a-f13640f84c09.JPG',
      '5e33b28e-b8b1-47bc-a931-f5db1b201035.JPG',
      'f3051db6-8d26-43de-8237-ffd7bca0ddea.JPG',
      '6a3e05c7-ac48-4bdc-8192-939f89f6cc81.JPG',
      'f496132f-b12e-4bf1-82a6-0b6f77c2a2a6.JPG',
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
      viewGallery: "عرض المعرض",
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
        <div className="mb-8">
          <div className="relative overflow-hidden">
            <div className="flex space-x-6 animate-scroll-slow">
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